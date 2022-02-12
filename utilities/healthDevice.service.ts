import { useState, useEffect, useContext, createContext, useMemo } from 'react';
import { Linking } from 'react-native';
import InAppBrowser from 'react-native-inappbrowser-reborn';
import firestore, {
  FirebaseFirestoreTypes,
} from '@react-native-firebase/firestore';
import functions from '@react-native-firebase/functions';
import { find } from 'lodash';
import moment from 'moment';
import { dozy_theme } from '../config/Themes';
import {
  HealthDeviceData,
  HealthDeviceProvider,
  SessionRequestResponse,
  TerraRequestResponse,
  TerraSleepData,
} from '../types/healthDevice';
import { Deffered, extractParamsFromUrl } from './common';
import { encodeLocalTime } from './time';
import { SleepLog } from '../types/custom';

export interface HealthDeviceContextValue {
  devices: HealthDeviceData[];
}

export default class HealthDevice {
  static Context = createContext<HealthDeviceContextValue>({ devices: [] });

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

      if (response.success) {
        HealthDevice.TerraAuthResolver = new Deffered();
        const browserResponse = await HealthDevice.openWidget(
          response.widgetUrl!,
        );

        if (browserResponse.type === 'cancel') {
          HealthDevice.TerraAuthResolver = undefined;
        } else {
          const authResponse = await HealthDevice.TerraAuthResolver.promise;
          HealthDevice.TerraAuthResolver = undefined;

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

            // Register uid and terra user_id to the global table
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

  static async getSleepSamples(
    provider: HealthDeviceProvider,
    startDate: string,
    endDate: string,
  ): Promise<TerraSleepData[]> {
    if (provider && startDate && endDate) {
      const response = (
        await functions().httpsCallable('getSleepSamples')({
          provider,
          startDate,
          endDate,
        })
      ).data as TerraRequestResponse<TerraSleepData>;

      if (response.success) {
        return response.data!;
      } else {
        throw new Error(response.message);
      }
    } else {
      throw new Error('provider, startDate and endDate are required!');
    }
  }

  static mapTerraSleepDataToSleepLog(
    data: TerraSleepData,
    provider: HealthDeviceProvider,
  ): SleepLog {
    const bedTime = encodeLocalTime(moment(data.metadata.start_time).toDate());
    const fallAsleepTime = moment(bedTime.value)
      .add(
        data.sleep_durations_data.awake.duration_before_sleeping ?? 0,
        'seconds',
      )
      .toDate();
    const upTime = encodeLocalTime(moment(data.metadata.end_time).toDate());
    const wakeTime = moment(upTime.value)
      .subtract(
        data.sleep_durations_data.awake.duration_after_wakeup ?? 0,
        'seconds',
      )
      .toDate();

    return {
      dataFromDevice: {
        provider,
        data,
      },
      isDraft: true,
      bedTime: FirebaseFirestoreTypes.Timestamp.fromDate(bedTime.value),
      fallAsleepTime: FirebaseFirestoreTypes.Timestamp.fromDate(fallAsleepTime),
      wakeTime: FirebaseFirestoreTypes.Timestamp.fromDate(wakeTime),
      upTime: FirebaseFirestoreTypes.Timestamp.fromDate(upTime.value),
      sleepDuration: Math.round(
        (data.sleep_durations_data.asleep.duration_asleep_state ?? 0) / 60,
      ),
      sleepEfficiency: data.metadata.sleep_efficiency,
      nightMinsAwake: Math.round(
        ((data.sleep_durations_data.awake.duration_awake_state ?? 0) -
          (data.sleep_durations_data.awake.duration_before_sleeping ?? 0) -
          (data.sleep_durations_data.awake.duration_after_wakeup ?? 0)) /
          60,
      ),
      minsToFallAsleep: Math.round(
        (data.sleep_durations_data.awake.duration_before_sleeping ?? 0) / 60,
      ),
      minsInBedTotal: Math.round(
        moment(data.metadata.end_time).diff(
          data.metadata.start_time,
          'minutes',
          true,
        ),
      ),
      minsAwakeInBedTotal: Math.round(
        (data.sleep_durations_data.awake.duration_awake_state ?? 0) / 60,
      ),
      wakeCount: data.sleep_durations_data.awake.num_wakeup_events,
      tags: [],
      version: bedTime.version,
      timezone: bedTime.timezone,
    };
  }

  static async maybeUpdateSleepLog(
    userId: string,
    newSleepLog: SleepLog,
  ): Promise<string | undefined> {
    let relatedDocs = (
      await firestore()
        .collection('users')
        .doc(userId)
        .collection('sleepLogs')
        .where(
          'bedTime',
          '>=',
          moment(newSleepLog.bedTime.toDate()).subtract(1, 'day').toDate(),
        )
        .orderBy('bedTime', 'desc')
        .get()
    ).docs as FirebaseFirestoreTypes.QueryDocumentSnapshot<SleepLog>[];

    relatedDocs = relatedDocs.filter((it) => {
      const bedTime = it.data().bedTime.toDate();
      const upTime = it.data().upTime.toDate();
      const newBedTime = newSleepLog.bedTime.toDate();
      const newUpTime = newSleepLog.upTime.toDate();

      return (
        (moment(bedTime).isSameOrAfter(newBedTime) &&
          moment(bedTime).isBefore(newUpTime)) ||
        (moment(upTime).isAfter(newBedTime) &&
          moment(upTime).isSameOrBefore(newUpTime)) ||
        (moment(newBedTime).isSameOrAfter(bedTime) &&
          moment(newUpTime).isSameOrBefore(upTime))
      );
    });

    if (relatedDocs.find((it) => !it.data().isDraft)) {
      return undefined;
    } else if (relatedDocs.length) {
      for (let i = 1; i < relatedDocs.length; i++) {
        await relatedDocs[i].ref.delete();
      }
      await relatedDocs[0].ref.set(newSleepLog);

      return relatedDocs[0].id;
    }

    const newDoc = await firestore()
      .collection('users')
      .doc(userId)
      .collection('sleepLogs')
      .add(newSleepLog);

    return newDoc.id;
  }

  static useHealthDevice(): HealthDeviceContextValue {
    return useContext<HealthDeviceContextValue>(HealthDevice.Context);
  }
}
