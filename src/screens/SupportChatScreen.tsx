import React from 'react';
import {
  StyleSheet,
  Text,
  View,
  Linking,
  Platform,
  TouchableOpacity,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Entypo, MaterialCommunityIcons } from '@expo/vector-icons';
import { scale } from 'react-native-size-matters';
import { dozy_theme } from '../config/Themes';
import FocusAwareStatusBar from '../components/FocusAwareStatusBar';
import Clipboard from '../../assets/images/Clipboard.svg';
import { CardContainer } from '../components/CardContainer';

export const SupportChatScreen: React.FC = ({}) => {
  const theme = dozy_theme;

  return (
    <SafeAreaView style={styles.SafeAreaView} edges={['top']}>
      <FocusAwareStatusBar backgroundColor={dozy_theme.colors.medium} />
      <View style={styles.Root}>
        <View style={styles.View_ContentContainer}>
          <Clipboard
            style={styles.Icon_Clipboard}
            width={scale(80)}
            height={scale(80)}
          />
          <CardContainer>
            <TouchableOpacity
              onPress={() => {
                Linking.openURL('https://discord.gg/KqDr4VmJKB');
              }}
            >
              <View style={styles.View_CardHeaderContainer}>
                <View style={styles.headerContent}>
                  <Text
                    style={{
                      ...theme.typography.cardTitle,
                      ...styles.Text_CardTitle,
                    }}
                  >
                    Have questions? Need help?
                  </Text>
                  <Text
                    style={{
                      ...theme.typography.body2,
                      ...styles.Text_CardSubtitle,
                    }}
                  >
                    Join our community discord server
                  </Text>
                </View>
                <Entypo
                  name={'chevron-right'}
                  size={scale(28)}
                  color={theme.colors.secondary}
                />
              </View>
              <View style={styles.View_CardContentContainer}>
                <MaterialCommunityIcons
                  name="discord"
                  size={scale(100)}
                  color={theme.colors.secondary}
                />
              </View>
            </TouchableOpacity>
          </CardContainer>
        </View>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  Root: {
    marginTop: scale(
      Platform.select({
        ios: dozy_theme.spacing.medium,
        android: dozy_theme.spacing.large,
      }) as number,
    ),
    flex: 1,
    backgroundColor: dozy_theme.colors.background,
  },
  SafeAreaView: {
    backgroundColor: dozy_theme.colors.medium,
    flex: 1,
  },
  headerContent: {
    flexDirection: 'column',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
  },
  View_ContentContainer: {
    justifyContent: 'flex-start',
    alignItems: 'stretch',
    paddingHorizontal: scale(10),
    paddingTop: scale(10),
  },
  View_CardHeaderContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  View_CardContentContainer: {
    height: 150,
    justifyContent: 'center',
    alignItems: 'center',
  },
  Text_CardTitle: {
    color: dozy_theme.colors.secondary,
  },
  Text_CardSubtitle: {
    color: dozy_theme.colors.secondary,
    opacity: 0.5,
    marginTop: scale(-5),
    marginBottom: scale(12),
  },
  Icon_Clipboard: {
    margin: scale(50),
    alignSelf: 'center',
  },
});
