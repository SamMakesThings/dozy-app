import React from 'react';
import { StyleSheet } from 'react-native';
import { Container, IconButton } from '@draftbit/ui';
import { scale } from 'react-native-size-matters';
import { ProgressBar } from './ProgressBar';
import { dozy_theme } from '../config/Themes';

interface Navigation {
  goBack: Function;
}

interface Props {
  backButtonDisabled: boolean;
  navigation: Navigation;
  progressBarPercent: number;
}

const HeaderProgressBar: React.FC<Props> = (props) => {
  const theme = dozy_theme;

  return (
    <Container
      style={styles.View_HeaderContainer}
      elevation={0}
      useThemeGutterPadding={true}
    >
      <IconButton
        style={{
          ...styles.Nav_BackButton,
          display: !props.backButtonDisabled ? 'flex' : 'none'
        }}
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
            ...{ display: props.progressBarPercent ? 'flex' : 'none' }
          }}
          color={theme.colors.primary}
          progress={props.progressBarPercent}
          borderRadius={10}
          unfilledColor={theme.colors.medium}
        />
      </Container>
    </Container>
  );
};

const styles = StyleSheet.create({
  View_ProgressBarContainer: {
    width: '100%',
    flexDirection: 'row',
    justifyContent: 'center'
  },
  View_HeaderContainer: {
    flex: 1,
    justifyContent: 'space-between',
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: scale(42)
  },
  Nav_BackButton: {},
  ProgressBar: {
    width: scale(225),
    height: scale(6)
  }
});

export default HeaderProgressBar;
