import { scale } from 'react-native-size-matters';
import { Theme } from '../types/theme';

// eslint-disable-next-line @typescript-eslint/naming-convention
export const dozy_theme: Theme = {
  disabledOpacity: 0.5,
  spacing: {
    gutters: 16,
    text: 4,
    small: 8,
    medium: 12,
    large: 16,
  },
  borderRadius: {
    global: 6,
    button: 36,
  },
  buttonLayout: {
    minHeight: scale(47),
    justifyContent: 'center',
  },
  typography: {
    smallLabel: {
      fontSize: scale(16),
      lineHeight: scale(26),
      fontFamily: 'RubikRegular',
    },
    body1: {
      fontSize: scale(18),
      lineHeight: scale(22),
      fontFamily: 'RubikRegular',
      letterSpacing: -0.25,
    },
    body2: {
      fontSize: scale(14),
      lineHeight: scale(22),
      fontFamily: 'RubikRegular',
    },
    button: {
      fontSize: scale(16),
      lineHeight: scale(16),
      fontFamily: 'RubikRegular',
    },
    caption: {
      fontSize: scale(12),
      lineHeight: scale(16),
      fontFamily: 'RubikRegular',
    },
    headline1: {
      fontSize: scale(60),
      lineHeight: scale(71),
      fontFamily: 'RubikBold',
    },
    headline2: {
      fontSize: scale(48),
      lineHeight: scale(58),
      fontFamily: 'RubikMedium',
    },
    headline3: {
      fontSize: scale(28),
      lineHeight: scale(35),
      fontFamily: 'RubikMedium',
    },
    headline4: {
      fontSize: scale(24),
      lineHeight: scale(32),
      fontFamily: 'RubikBold',
    },
    headline5: {
      fontSize: scale(22),
      lineHeight: scale(26),
      fontFamily: 'RubikMedium',
    },
    headline6: {
      fontSize: scale(16),
      lineHeight: scale(24),
      fontFamily: 'RubikMedium',
    },
    cardTitle: {
      fontSize: scale(20),
      lineHeight: scale(26),
      fontFamily: 'RubikMedium',
    },
    overline: {
      fontSize: scale(12),
      lineHeight: scale(16),
      letterSpacing: 2,
      fontFamily: 'RubikRegular',
    },
    subtitle1: {
      fontSize: scale(16),
      lineHeight: scale(26),
      fontFamily: 'RubikRegular',
    },
    subtitle2: {
      fontSize: scale(14),
      lineHeight: scale(22),
      fontFamily: 'RubikRegular',
    },
  },
  colors: {
    background: 'rgba(35, 43, 63, 1)',
    divider: 'rgba(234, 237, 242, 1)',
    error: 'rgba(255, 69, 100, 1)',
    light: 'rgba(153, 172, 185, 1)',
    lightInverse: 'rgba(153, 172, 185, 0.3)',
    medium: 'rgba(64, 75, 105, 1)',
    mediumInverse: 'rgba(255, 255, 255, 0.87)',
    primary: 'rgba(0, 129, 138, 1)',
    secondary: 'rgba(219, 237, 243, 1)',
    strong: 'rgba(255, 255, 255, 1)',
    strongInverse: 'rgba(255, 255, 255, 1)',
    surface: 'rgba(255, 255, 255, 1)',
  },
  elevation: {
    0: {
      shadowColor: 'rgba(18, 20, 44, 1)',
      shadowOffset: {
        width: 0,
        height: 0,
      },
      shadowRadius: 0,
      shadowOpacity: 0,
      borderWidth: 0,
      borderColor: 'rgba(18, 20, 44, 1)',
      borderOpacity: 0,
    },
    1: {
      shadowColor: 'rgba(18, 20, 44, 1)',
      shadowOffset: {
        width: 0,
        height: 2,
      },
      shadowRadius: 4,
      shadowOpacity: 0.06,
      borderWidth: 1,
      borderColor: 'rgba(18, 20, 44, 1)',
      borderOpacity: 0.06,
    },
    2: {
      shadowColor: 'rgba(18, 20, 44, 1)',
      shadowOffset: {
        width: 0,
        height: 2,
      },
      shadowRadius: 4,
      shadowOpacity: 0.2,
      borderWidth: 0,
      borderColor: 'rgba(18, 20, 44, 1)',
      borderOpacity: 0,
    },
    3: {
      shadowColor: 'rgba(18, 20, 44, 1)',
      shadowOffset: {
        width: 0,
        height: 6,
      },
      shadowRadius: 6,
      shadowOpacity: 0.12,
      borderWidth: 0,
      borderColor: 'rgba(18, 20, 44, 1)',
      borderOpacity: 0,
    },
  },
};
