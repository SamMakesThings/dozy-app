import React from 'react';
import { StyleSheet } from 'react-native';
import { Container, IconButton, ProgressBar } from '@draftbit/ui';
import { slumber_theme } from '../config/Themes';

const HeaderProgressBar = (props) => {
  const theme = slumber_theme;

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
        size={32}
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
          borderWidth={0}
          borderRadius={10}
          animationType="spring"
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
    marginTop: 50
  },
  Nav_BackButton: {},
  ProgressBar: {
    width: 250,
    height: 7
  }
});

export default HeaderProgressBar;
