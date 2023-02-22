import { ViewStyle } from 'react-native';

type Deep<T> = {
  [P in keyof T]: Deep<T[P]> | number | string | ViewStyle['justifyContent'];
};

export interface Theme {
  disabledOpacity: number;
  spacing: {
    gutters: number;
    text: number;
    small: number;
    medium: number;
    large: number;
  };
  borderRadius: {
    global: number;
    button: number;
  };
  buttonLayout: {
    minHeight: number;
    justifyContent: ViewStyle['justifyContent'];
  };
  typography: {
    smallLabel: {
      fontSize: number;
      lineHeight: number;
      fontFamily: string;
    };
    body1: {
      fontSize: number;
      lineHeight: number;
      fontFamily: string;
      letterSpacing: number;
    };
    body2: {
      fontSize: number;
      lineHeight: number;
      fontFamily: string;
    };
    button: {
      fontSize: number;
      lineHeight: number;
      fontFamily: string;
    };
    caption: {
      fontSize: number;
      lineHeight: number;
      fontFamily: string;
    };
    headline1: {
      fontSize: number;
      lineHeight: number;
      fontFamily: string;
    };
    headline2: {
      fontSize: number;
      lineHeight: number;
      fontFamily: string;
    };
    headline3: {
      fontSize: number;
      lineHeight: number;
      fontFamily: string;
    };
    headline4: {
      fontSize: number;
      lineHeight: number;
      fontFamily: string;
    };
    headline5: {
      fontSize: number;
      lineHeight: number;
      fontFamily: string;
    };
    headline6: {
      fontSize: number;
      lineHeight: number;
      fontFamily: string;
    };
    cardTitle: {
      fontSize: number;
      lineHeight: number;
      fontFamily: string;
    };
    overline: {
      fontSize: number;
      lineHeight: number;
      letterSpacing: number;
      fontFamily: string;
    };
    subtitle1: {
      fontSize: number;
      lineHeight: number;
      fontFamily: string;
    };
    subtitle2: {
      fontSize: number;
      lineHeight: number;
      fontFamily: string;
    };
  };
  colors: {
    background: string;
    divider: string;
    error: string;
    light: string;
    lightInverse: string;
    medium: string;
    mediumInverse: string;
    primary: string;
    secondary: string;
    strong: string;
    strongInverse: string;
    surface: string;
  };
  elevation: {
    '0': {
      shadowColor: string;
      shadowOffset: {
        width: number;
        height: number;
      };
      shadowRadius: number;
      shadowOpacity: number;
      borderWidth: number;
      borderColor: string;
      borderOpacity: number;
    };
    '1': {
      shadowColor: string;
      shadowOffset: {
        width: number;
        height: number;
      };
      shadowRadius: number;
      shadowOpacity: number;
      borderWidth: number;
      borderColor: string;
      borderOpacity: number;
    };
    '2': {
      shadowColor: string;
      shadowOffset: {
        width: number;
        height: number;
      };
      shadowRadius: number;
      shadowOpacity: number;
      borderWidth: number;
      borderColor: string;
      borderOpacity: number;
    };
    '3': {
      shadowColor: string;
      shadowOffset: {
        width: number;
        height: number;
      };
      shadowRadius: number;
      shadowOpacity: number;
      borderWidth: number;
      borderColor: string;
      borderOpacity: number;
    };
  };
  [key: string]: number | string | Deep<any>;
}
