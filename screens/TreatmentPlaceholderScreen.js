import React from 'react';
import { StatusBar, StyleSheet, Text } from 'react-native';
import { withTheme, ScreenContainer, Container, Icon } from '@draftbit/ui';
import { slumber_theme } from '../config/Themes';

class Root extends React.Component {
  state = {};

  componentDidMount() {
    StatusBar.setBarStyle('dark-content');
  }

  static navigationOptions = {
    header: null
  };

  render() {
    const theme = slumber_theme;
    return (
      <ScreenContainer
        hasSafeArea={true}
        scrollable={false}
        style={styles.Root_n5}
      >
        <Container
          style={styles.Container_nc}
          elevation={0}
          useThemeGutterPadding={true}
        />
        <Container
          style={styles.Container_nf}
          elevation={0}
          useThemeGutterPadding={true}
        >
          <Icon
            style={styles.Icon_no}
            name="Ionicons/ios-clipboard"
            size={128}
            color={theme.colors.primary}
          />
          <Text
            style={[
              styles.Text_n1,
              theme.typography.headline4,
              {
                color: '#ffffff'
              }
            ]}
          >
            Coming Soon
          </Text>
          <Text
            style={[
              styles.Text_ni,
              theme.typography.subtitle1,
              {
                color: '#aaaaaa'
              }
            ]}
          >
            Treatment progression, checklists, & guidance will be here in a
            future update.
          </Text>
        </Container>
        <Container
          style={styles.Container_np}
          elevation={0}
          useThemeGutterPadding={true}
        />
      </ScreenContainer>
    );
  }
}

const styles = StyleSheet.create({
  Container_nf: {
    alignItems: 'center'
  },
  Container_np: {
    marginBottom: 24
  },
  Icon_no: {
    marginBottom: 40
  },
  Root_n5: {
    justifyContent: 'space-between',
    backgroundColor: slumber_theme.colors.background
  },
  Text_n1: {
    textAlign: 'center',
    width: '90%',
    color: slumber_theme.colors.strong
  },
  Text_ni: {
    textAlign: 'center',
    width: '90%'
  }
});

export default withTheme(Root);
