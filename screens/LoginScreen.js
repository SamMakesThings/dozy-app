import React from 'react';
import {
  withTheme,
  Button,
  ScreenContainer,
  Container,
  Image,
  Touchable,
} from '@draftbit/ui';
import { StyleSheet, Text } from 'react-native';
import Images from '../config/Images';
import { AuthContext } from "../authContext";
import { slumber_theme } from "../config/slumber_theme";

function LoginScreen () {
  // Pull the theme manually
  const theme = slumber_theme;

  // Get my auth functions from hook
  const { signIn, signUp } = React.useContext(AuthContext);

  return (
    <ScreenContainer
      scrollable={false}
      hasSafeArea={false}
      style={styles.screenContainer1D}
    >
      <Container
        backgroundImage={Images.DreamBgExtended}
        useThemeGutterPadding={false}
        backgroundImageResizeMode="contain"
        elevation={0}
        style={styles.containerA6}
      >
        <Container
          elevation={0}
          useThemeGutterPadding={false}
          style={styles.containerG3}
        >
          <Image
            source={Images.WordmarkTrans}
            resizeMode="contain"
            style={styles.imagePQ}
          />
        </Container>
        <Container
          elevation={0}
          useThemeGutterPadding={true}
          style={styles.containerPi}
        >
          <Image
            source={Images.UndrawBed}
            resizeMode="contain"
            style={styles.image6G}
          />
          <Text
            allowFontScaling={false}
            style={StyleSheet.flatten([
              styles.text94,
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
              styles.textBw,
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
          style={styles.containerGr}
        >
          <Button
            type="solid"
            color={theme.colors.primary}
            style={StyleSheet.flatten([
              styles.button9I,
              { borderRadius: theme.borderRadius.button },
            ])}
            onPress={signUp}
          >
            Get Started
          </Button>
          <Touchable style={styles.touchable64} onPress={signIn}>
            <Text
              style={StyleSheet.flatten([
                styles.textW2,
                theme.typography.body1,
                { color: theme.colors.surface },
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
  button9I: {
    height: 55,
    justifyContent: 'center',
  },
  screenContainer1D: {
    // alignItems: 'auto', DELETE THIS LINE IF THINGS DON'T BREAK
  },
  containerA6: {
    flexGrow: 1,
    width: '100%',
    height: '60%',
    justifyContent: 'space-between',
  },
  containerG3: {
    height: '15%',
  },
  textW2: {
    textAlign: 'center',
  },
  image6G: {
    width: '60%',
    alignSelf: 'center',
    height: '40%',
  },
  imagePQ: {
    alignSelf: 'flex-start',
    marginLeft: 15,
    width: '50%',
    height: '120%',
  },
  containerPi: {
    height: '65%',
    justifyContent: 'flex-end',
  },
  touchable64: {
    paddingTop: 25,
    paddingBottom: 25,
    marginBottom: 10,
  },
  text94: {
    textAlign: 'center',
  },
  textBw: {
    marginTop: -10,
    textAlign: 'center',
    marginBottom: 35,
  },
  containerGr: {
    justifyContent: 'flex-end',
    height: '20%',
  },
});

export default withTheme(LoginScreen);