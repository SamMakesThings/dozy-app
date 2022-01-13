import { useState, useEffect, useContext, createContext, useMemo } from 'react';
import { Linking } from 'react-native';
import InAppBrowser from 'react-native-inappbrowser-reborn';
import firestore from '@react-native-firebase/firestore';
import functions from '@react-native-firebase/functions';
import { find } from 'lodash';
import { dozy_theme } from '../config/Themes';
import {
  HealthDeviceData,
  HealthDeviceProvider,
  SessionRequestResponse,
} from '../types/healthDevice';
import { Deffered, extractParamsFromUrl } from './common';

export interface HealthDeviceContextValue {
  devices: HealthDeviceData[];
}

export default class HealthDevice {
  static Context = createContext<HealthDeviceContextValue | null>(null);

  static TerraAuthResolver: Deffered | undefined;

  static useHealthDeviceService(userId: string): HealthDeviceContextValue {
    const [devices, setDevices] = useState<HealthDeviceData[]>([]);

    useEffect(() => {
      let subscriber: (() => void) | undefined;

      if (userId) {
        subscriber = firestore()
          .collection('users')
          .doc(userId)
          .collection('devices')
          .onSnapshot(async (): Promise<void> => {
            const healthDevices: HealthDeviceData[] = [];

            const deviceDocs = await firestore()
              .collection('users')
              .doc(userId)
              .collection('devices')
              .get();
            deviceDocs.forEach((it) => {
              healthDevices.push(it.data() as HealthDeviceData);
            });
            setDevices(healthDevices);
          });
      }

      return () => (subscriber ? subscriber() : undefined);
    }, [userId]);

    useEffect(() => {
      const handleDeepLink = (event: { url: string }): void => {
        console.log('event url ===== ', event.url);
        if (event.url.includes('com.dozyhealth.dozy://terra')) {
          InAppBrowser.close();
          if (HealthDevice.TerraAuthResolver?.resolve) {
            HealthDevice.TerraAuthResolver.resolve(
              extractParamsFromUrl(event.url),
            );
          }
        }
      };
      Linking.addEventListener('url', handleDeepLink);

      return () => Linking.removeEventListener('url', handleDeepLink);
    }, []);

    const healthDeviceContextValue = useMemo(
      (): HealthDeviceContextValue => ({
        devices,
      }),
      [devices],
    );

    return healthDeviceContextValue;
  }

  static async connectToTerra(
    userId: string,
    provider: HealthDeviceProvider,
  ): Promise<void> {
    if (userId && provider) {
      const response = (
        await functions().httpsCallable('generateWidgetSession')({ provider })
      ).data as SessionRequestResponse;

      console.log('generateWidgetSession result: ', response);

      if (response.success) {
        HealthDevice.TerraAuthResolver = new Deffered();
        const browserResponse = await HealthDevice.openWidget(
          response.widgetUrl!,
        );
        console.log('browserResponse: ', browserResponse);
        if (browserResponse.type === 'cancel') {
          HealthDevice.TerraAuthResolver = undefined;
        } else {
          const authResponse = await HealthDevice.TerraAuthResolver.promise;
          HealthDevice.TerraAuthResolver = undefined;
          console.log('authResponse: ', authResponse);
          if (authResponse.user_id) {
            const healthDeviceData: HealthDeviceData = {
              provider,
              sessionId: response.sessionId,
              widgetUrl: response.widgetUrl,
              userId: authResponse.user_id,
            };
            const devicesCollection = firestore()
              .collection('users')
              .doc(userId)
              .collection('devices');
            const existingDocs = (
              await devicesCollection.where('provider', '==', provider).get()
            ).docs;
            if (existingDocs.length) {
              await existingDocs[0].ref.update(healthDeviceData);
            } else {
              await devicesCollection.add(healthDeviceData);
            }
            await firestore()
              .collection('terra-users')
              .doc(authResponse.user_id)
              .set({
                terraUserId: authResponse.user_id,
                userId,
              });
          } else {
            throw new Error(authResponse.message);
          }
        }
      } else {
        throw new Error(response.message);
      }
    } else {
      throw new Error('userId and provider are required!');
    }
  }

  static async disconnectFromTerra(
    userId: string,
    provider: HealthDeviceProvider,
  ): Promise<void> {
    if (userId && provider) {
      const response = (
        await functions().httpsCallable('deauthenticateUserFromTerra')({
          provider,
        })
      ).data;
      if (!response.success) {
        throw new Error(response.message);
      }
    } else {
      throw new Error('userId and provider are required!');
    }
  }

  static async openWidget(widgetUrl: string): Promise<any> {
    if (!widgetUrl) {
      throw new Error('The widget URL is invalid!');
    }

    if (await InAppBrowser.isAvailable()) {
      const result = await InAppBrowser.open(widgetUrl, {
        // iOS Properties
        dismissButtonStyle: 'cancel',
        preferredBarTintColor: dozy_theme.colors.primary,
        preferredControlTintColor: 'white',
        readerMode: false,
        animated: true,
        modalPresentationStyle: 'fullScreen',
        modalTransitionStyle: 'coverVertical',
        modalEnabled: true,
        enableBarCollapsing: false,
        // Android Properties
        showTitle: true,
        toolbarColor: dozy_theme.colors.primary,
        secondaryToolbarColor: 'black',
        navigationBarColor: 'black',
        navigationBarDividerColor: 'white',
        enableUrlBarHiding: true,
        enableDefaultShare: true,
        forceCloseOnRedirection: false,
        // Specify full animation resource identifier(package:anim/name)
        // or only resource name(in case of animation bundled with app).
        animations: {
          startEnter: 'slide_in_right',
          startExit: 'slide_out_left',
          endEnter: 'slide_in_left',
          endExit: 'slide_out_right',
        },
        headers: {
          // 'my-custom-header': 'my custom header value',
        },
      });

      return result;
    } else Linking.openURL(widgetUrl);
  }

  static isDeviceConnected(
    devices: HealthDeviceData[],
    provider: HealthDeviceProvider,
  ): boolean {
    const deviceData = find<HealthDeviceData>(devices, { provider });

    return !!(
      deviceData?.sessionId &&
      deviceData.widgetUrl &&
      deviceData.userId
    );
  }

  static useHealthDevice(): HealthDeviceContextValue {
    return useContext<HealthDeviceContextValue>(
      HealthDevice.Context as React.Context<HealthDeviceContextValue>,
    );
  }
}
