import { systemWeights } from 'react-native-typography';

export const slumber_theme = {
  disabledOpacity: 0.5,
  spacing: {
    gutters: 16,
    text: 4,
    small: 8,
    medium: 12,
    large: 16
  },
  borderRadius: {
    global: 6,
    button: 36
  },
  typography: {
    body1: {
      fontSize: 16,
      lineHeight: 26,
      fontFamily: 'RubikRegular'
    },
    body2: {
      fontSize: 14,
      lineHeight: 22,
      fontFamily: 'RubikRegular'
    },
    button: {
      fontSize: 16,
      lineHeight: 16,
      fontFamily: 'RubikRegular'
    },
    caption: {
      fontSize: 12,
      lineHeight: 16,
      fontFamily: 'RubikRegular'
    },
    headline1: {
      fontSize: 60,
      lineHeight: 71,
      fontFamily: 'RubikBold'
    },
    headline2: {
      fontSize: 48,
      lineHeight: 58,
      fontFamily: 'RubikMedium'
    },
    headline3: {
      fontSize: 38,
      lineHeight: 55,
      fontFamily: 'RubikMedium'
    },
    headline4: {
      fontSize: 24,
      lineHeight: 32,
      fontFamily: 'RubikBold'
    },
    headline5: {
      fontSize: 20,
      lineHeight: 26,
      fontFamily: 'RubikBold'
    },
    headline6: {
      fontSize: 16,
      lineHeight: 24,
      fontFamily: 'RubikBold'
    },
    overline: {
      fontSize: 12,
      lineHeight: 16,
      letterSpacing: 2,
      fontFamily: 'RubikRegular'
    },
    subtitle1: {
      fontSize: 16,
      lineHeight: 26,
      fontFamily: 'RubikRegular'
    },
    subtitle2: {
      fontSize: 14,
      lineHeight: 22,
      fontFamily: 'RubikRegular'
    }
  },
  colors: {
    background: 'rgba(35, 43, 63, 1)',
    divider: 'rgba(234, 237, 242, 1)',
    error: 'rgba(255, 69, 100, 1)',
    light: 'rgba(153, 172, 185, 1)',
    lightInverse: 'rgba(255, 255, 255, 0.68)',
    medium: 'rgba(64, 75, 105, 1)',
    mediumInverse: 'rgba(255, 255, 255, 0.87)',
    primary: 'rgba(0, 129, 138, 1)',
    secondary: 'rgba(219, 237, 243, 1)',
    strong: 'rgba(255, 255, 255, 1)',
    strongInverse: 'rgba(255, 255, 255, 1)',
    surface: 'rgba(255, 255, 255, 1)'
  },
  elevation: {
    '0': {
      shadowColor: 'rgba(255, 255, 255, 1)',
      shadowOffset: {
        width: 0,
        height: 0
      },
      shadowRadius: 0,
      shadowOpacity: 0,
      borderWidth: 0,
      borderColor: 'rgba(255, 255, 255, 1)',
      borderOpacity: 0
    },
    '1': {
      shadowColor: 'rgba(255, 255, 255, 1)',
      shadowOffset: {
        width: 0,
        height: 2
      },
      shadowRadius: 4,
      shadowOpacity: 0.06,
      borderWidth: 1,
      borderColor: 'rgba(255, 255, 255, 1)',
      borderOpacity: 0.06
    },
    '2': {
      shadowColor: 'rgba(255, 255, 255, 1)',
      shadowOffset: {
        width: 0,
        height: 2
      },
      shadowRadius: 4,
      shadowOpacity: 0.2,
      borderWidth: 0,
      borderColor: 'rgba(255, 255, 255, 1)',
      borderOpacity: 0
    },
    '3': {
      shadowColor: 'rgba(255, 255, 255, 1)',
      shadowOffset: {
        width: 0,
        height: 6
      },
      shadowRadius: 6,
      shadowOpacity: 0.12,
      borderWidth: 0,
      borderColor: 'rgba(255, 255, 255, 1)',
      borderOpacity: 0
    }
  }
};
