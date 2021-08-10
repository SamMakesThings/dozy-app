import React from 'react';
import * as AppleAuthentication from 'expo-apple-authentication'; // @ts-ignore
import { Button, ScreenContainer, Container, Touchable } from '@draftbit/ui';
import {
  StyleSheet,
  Text,
  ImageBackground,
  Platform,
  ViewStyle
} from 'react-native';
import { scale, verticalScale } from 'react-native-size-matters';
import { AuthContext } from '../utilities/authContext';
import { dozy_theme } from '../config/Themes';
import WordmarkTrans from '../assets/images/WordmarkTrans.svg';
import UndrawBed from '../assets/images/UndrawBed.svg';

function LoginScreen() {
  // Pull the theme manually
  const theme = dozy_theme;

  // Get my auth functions from hook
  const { signIn, signInWithApple } = React.useContext(AuthContext);

  return (
    <ScreenContainer
      scrollable={false}
      hasSafeArea={true}
      style={styles.View_RootContainer}
    >
      <ImageBackground
        source={require('../assets/images/DreamBgExtended.png')}
        style={styles.View_ContentContainer}
        imageStyle={{ resizeMode: 'contain' }}
      >
        <Container
          elevation={0}
          useThemeGutterPadding={false}
          style={styles.View_LogoContainer}
        >
          <WordmarkTrans
            width={scale(150)}
            height={scale(71)}
            style={styles.Image_Wordmark}
          />
        </Container>
        <Container
          elevation={0}
          useThemeGutterPadding={true}
          style={styles.View_HeroLogoText}
        >
          <UndrawBed
            width={scale(200)}
            height={verticalScale(200)}
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
          {Platform.OS === 'ios' && ( // Show Apple signin if iPhone
            <AppleAuthentication.AppleAuthenticationButton
              buttonType={
                AppleAuthentication.AppleAuthenticationButtonType.CONTINUE
              }
              buttonStyle={
                AppleAuthentication.AppleAuthenticationButtonStyle.BLACK
              }
              cornerRadius={theme.borderRadius.button}
              style={StyleSheet.flatten([
                theme.buttonLayout as ViewStyle,
                { borderRadius: theme.borderRadius.button }
              ])}
              onPress={signInWithApple}
            />
          )}

          <Button
            type="solid"
            color={theme.colors.primary}
            style={StyleSheet.flatten([
              theme.buttonLayout,
              {
                borderRadius: theme.borderRadius.button,
                marginTop: Platform.OS === 'ios' ? scale(5) : 0
              }
            ])}
            onPress={signIn}
          >
            {Platform.OS === 'ios' ? 'Continue with Google' : 'Get started'}
          </Button>
          <Touchable style={styles.Touchable_BackButton} onPress={signIn}>
            <Text
              style={StyleSheet.flatten([
                styles.Text_SignIn,
                theme.typography.smallLabel,
                { color: theme.colors.surface }
              ])}
            >
              {Platform.OS === 'ios' ? 'Returning users' : 'Sign in'}
            </Text>
          </Touchable>
        </Container>
      </ImageBackground>
    </ScreenContainer>
  );
}

const styles = StyleSheet.create({
  View_RootContainer: {},
  View_ContentContainer: {
    flexGrow: 1,
    width: '100%',
    height: '60%',
    justifyContent: 'space-between',
    paddingBottom: Platform.OS === 'ios' ? scale(20) : 0
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
    paddingBottom: scale(25)
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

export default LoginScreen;
