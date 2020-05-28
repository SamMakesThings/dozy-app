import React from 'react';
import {
  withTheme,
  Button,
  ScreenContainer,
  Container,
  Image,
  Touchable
} from '@draftbit/ui';
import { StyleSheet, Text } from 'react-native';
import { scale, verticalScale } from 'react-native-size-matters';
import Images from '../config/Images';
import { AuthContext } from '../utilities/authContext';
import { slumber_theme } from '../config/Themes';

function LoginScreen() {
  // Pull the theme manually
  const theme = slumber_theme;

  // Get my auth functions from hook
  const { signIn } = React.useContext(AuthContext);

  return (
    <ScreenContainer
      scrollable={false}
      hasSafeArea={false}
      style={styles.View_RootContainer}
    >
      <Container
        backgroundImage={Images.DreamBgExtended}
        useThemeGutterPadding={false}
        backgroundImageResizeMode="contain"
        elevation={0}
        style={styles.View_ContentContainer}
      >
        <Container
          elevation={0}
          useThemeGutterPadding={false}
          style={styles.View_LogoContainer}
        >
          <Image
            source={Images.WordmarkTrans}
            resizeMode="contain"
            style={styles.Image_Wordmark}
          />
        </Container>
        <Container
          elevation={0}
          useThemeGutterPadding={true}
          style={styles.View_HeroLogoText}
        >
          <Image
            source={Images.UndrawBed}
            resizeMode="contain"
            style={styles.Image_FeaturedBed}
          />
          <Text
            allowFontScaling={false}
            style={StyleSheet.flatten([
              styles.Text_Hero1,
              theme.typography.headline3,
              { color: theme.colors.strongInverse }
            ])}
          >
            Sleep through
          </Text>
          <Text
            accessible={true}
            adjustsFontSizeToFit={false}
            allowFontScaling={false}
            style={StyleSheet.flatten([
              styles.Text_Hero2,
              theme.typography.headline3,
              { color: theme.colors.strongInverse }
            ])}
          >
            the night again
          </Text>
        </Container>
        <Container
          useThemeGutterPadding={true}
          elevation={0}
          style={styles.View_ButtonsContainer}
        >
          <Button
            type="solid"
            color={theme.colors.primary}
            style={StyleSheet.flatten([
              theme.buttonLayout,
              { borderRadius: theme.borderRadius.button }
            ])}
            onPress={signIn}
          >
            Get Started
          </Button>
          <Touchable style={styles.Touchable_BackButton} onPress={signIn}>
            <Text
              style={StyleSheet.flatten([
                styles.Text_SignIn,
                theme.typography.smallLabel,
                { color: theme.colors.surface }
              ])}
            >
              Sign In
            </Text>
          </Touchable>
        </Container>
      </Container>
    </ScreenContainer>
  );
}

const styles = StyleSheet.create({
  View_RootContainer: {},
  View_ContentContainer: {
    flexGrow: 1,
    width: '100%',
    height: '60%',
    justifyContent: 'space-between'
  },
  View_LogoContainer: {
    height: '15%'
  },
  Text_SignIn: {
    textAlign: 'center'
  },
  Image_FeaturedBed: {
    width: '60%',
    alignSelf: 'center',
    height: verticalScale(200)
  },
  Image_Wordmark: {
    alignSelf: 'flex-start',
    marginLeft: scale(12),
    width: '50%',
    height: '120%'
  },
  View_HeroLogoText: {
    height: '65%',
    justifyContent: 'flex-end'
  },
  Touchable_BackButton: {
    paddingTop: scale(25),
    paddingBottom: scale(25),
    marginBottom: scale(10)
  },
  Text_Hero1: {
    textAlign: 'center'
  },
  Text_Hero2: {
    textAlign: 'center',
    marginBottom: verticalScale(40)
  },
  View_ButtonsContainer: {
    justifyContent: 'flex-end'
  }
});

export default withTheme(LoginScreen);
