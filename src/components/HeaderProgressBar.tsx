import React from 'react';
import { StyleSheet } from 'react-native';
import { Container, IconButton } from '@draftbit/ui';
import { SafeAreaView } from 'react-native-safe-area-context';
import { scale } from 'react-native-size-matters';
import { NavigationProp } from '@react-navigation/native';
import { ProgressBar } from './ProgressBar';
import { dozy_theme } from '../config/Themes';

interface Props {
  backButtonDisabled: boolean;
  navigation: NavigationProp<any>;
  progressBarPercent: number;
}

const HeaderProgressBar: React.FC<Props> = (props) => {
  const theme = dozy_theme;

  return (
    <SafeAreaView edges={['top']}>
      <Container
        style={styles.View_HeaderContainer}
        elevation={0}
        useThemeGutterPadding={true}
      >
        <IconButton
          style={props.backButtonDisabled ? styles.hidden : undefined}
          icon="Ionicons/md-arrow-back"
          size={scale(26)}
          color={theme.colors.secondary}
          onPress={() => {
            props.navigation.goBack();
          }}
        />
        <Container
          style={styles.View_ProgressBarContainer}
          elevation={0}
          useThemeGutterPadding={true}
        >
          <ProgressBar
            style={{
              ...styles.ProgressBar,
              ...{ display: props.progressBarPercent ? 'flex' : 'none' },
            }}
            color={theme.colors.primary}
            progress={props.progressBarPercent}
            borderRadius={10}
            unfilledColor={theme.colors.medium}
          />
        </Container>
      </Container>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  View_ProgressBarContainer: {
    width: '100%',
    flexDirection: 'row',
    justifyContent: 'center',
  },
  View_HeaderContainer: {
    flex: 1,
    justifyContent: 'space-between',
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: scale(10),
  },
  ProgressBar: {
    width: scale(225),
    height: scale(6),
  },
  hidden: { display: 'none' },
});

export default HeaderProgressBar;
