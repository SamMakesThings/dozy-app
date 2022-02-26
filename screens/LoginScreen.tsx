import React, { useState, useEffect, useRef } from 'react';
import * as AppleAuthentication from 'expo-apple-authentication';
import { Button, ScreenContainer, Container, Touchable } from '@draftbit/ui';
import { StyleSheet, Text, ImageBackground, Platform } from 'react-native';
import { scale, moderateScale } from 'react-native-size-matters';
import Auth from '../utilities/auth.service';
import { dozy_theme } from '../config/Themes';
import WordmarkTrans from '../assets/images/WordmarkTrans.svg';
import UndrawBed from '../assets/images/UndrawBed.svg';
import LoadingOverlay from '../components/LoadingOverlay';

const LoginScreen: React.FC = () => {
  // Pull the theme manually
  const theme = dozy_theme;

  // Get my auth functions from hook
  const { state, signIn, signInWithApple } = Auth.useAuth();
  const [isLoading, setLoading] = useState(state.isLoading);
  const previousLoadingStateRef = useRef(isLoading);

  useEffect(() => {
    if (!state.isLoading && previousLoadingStateRef.current) {
      setTimeout(() => {
        setLoading(state.isLoading);
        previousLoadingStateRef.current = state.isLoading;
      }, 800);
    } else {
      setLoading(state.isLoading);
      previousLoadingStateRef.current = state.isLoading;
    }
  }, [state.isLoading]);

  return state.isSigningIn || !isLoading ? (
    <ScreenContainer
      scrollable={false}
      hasSafeArea={true}
      style={styles.View_RootContainer}
    >
      <ImageBackground
        source={require('../assets/images/DreamBgExtended.png')}
        style={styles.View_ContentContainer}
        imageStyle={styles.background}
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
            height={moderateScale(160, 2)}
            style={styles.Image_FeaturedBed}
          />
          <Text
            allowFontScaling={false}
            style={StyleSheet.flatten([
              styles.Text_Hero1,
              theme.typography.headline3,
              { color: theme.colors.strongInverse },
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
              { color: theme.colors.strongInverse },
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
              onPress={signInWithApple}
            />
          )}

          <Button
            type="solid"
            color={theme.colors.primary}
            style={[
              theme.buttonLayout,
              {
                borderRadius: theme.borderRadius.button,
              },
              Platform.OS === 'ios' && styles.Button_Signin_iOS,
            ]}
            onPress={signIn}
            accessibilityTraits={undefined}
            accessibilityComponentType={undefined}
          >
            {Platform.OS === 'ios' ? 'Continue with Google' : 'Get started'}
          </Button>
          <Touchable style={styles.Touchable_BackButton} onPress={signIn}>
            <Text
              style={StyleSheet.flatten([
                styles.Text_SignIn,
                theme.typography.smallLabel,
                { color: theme.colors.surface },
              ])}
            >
              {Platform.OS === 'ios' ? 'Returning users' : 'Sign in'}
            </Text>
          </Touchable>
        </Container>
      </ImageBackground>
    </ScreenContainer>
  ) : (
    <LoadingOverlay style={styles.loadingContainer} />
  );
};

const styles = StyleSheet.create({
  View_RootContainer: {},
  View_ContentContainer: {
    flexGrow: 1,
    width: '100%',
    height: '60%',
    justifyContent: 'space-between',
  },
  View_LogoContainer: {
    height: '15%',
  },
  Text_SignIn: {
    textAlign: 'center',
  },
  Image_FeaturedBed: {
    width: '60%',
    alignSelf: 'center',
  },
  Image_Wordmark: {
    alignSelf: 'flex-start',
    marginLeft: scale(12),
    width: '50%',
    height: '120%',
  },
  View_HeroLogoText: {
    flex: 1,
    justifyContent: 'flex-end',
  },
  Touchable_BackButton: {
    paddingTop: scale(25),
    paddingBottom: scale(20),
  },
  Text_Hero1: {
    textAlign: 'center',
  },
  Text_Hero2: {
    textAlign: 'center',
    marginBottom: moderateScale(30, 2),
  },
  View_ButtonsContainer: {
    justifyContent: 'flex-end',
  },
  background: { resizeMode: 'contain' },
  Button_Signin_iOS: {
    marginTop: scale(5),
  },
  loadingContainer: {
    position: 'relative',
    flex: 1,
  },
});

export default LoginScreen;
