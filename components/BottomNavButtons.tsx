import React from 'react';
import { StyleSheet, TouchableOpacity, Text } from 'react-native';
import { scale } from 'react-native-size-matters';
import { Container, Button } from '@draftbit/ui';
import { Theme } from '../types/theme';
import { useRoute } from '@react-navigation/native';
import { firebase } from '@react-native-firebase/firestore';
import { AuthContext } from '../context/AuthContext';

interface Props {
  theme: Theme;
  bottomBackButton?: Function;
  bbbDisabled?: boolean;
  buttonValues?: Array<{
    label: string;
    value: string | number | boolean;
    solidColor?: boolean;
  }>;
  onPress: Function;
  onlyBackButton?: boolean;
  disabled?: boolean;
  buttonLabel?: string;
  bottomGreyButtonLabel?: string;
  bottomBackButtonLabel?: string;
}

// A catch-all component for buttons on the bottom of a screen.
// TODO: Replace bottomGreyButton calls with buttonValues
const BottomNavButtons: React.FC<Props> = (props) => {
  const { theme, bottomBackButton, bbbDisabled } = props;
  const route = useRoute();
  const { state } = React.useContext(AuthContext);
  const userId = state.userId;

  const submitUserProgress = () => {
    console.log('route =>', route.name);
    const db = firebase.firestore().collection('users').doc(userId);
    db.update({
      currentPage: {
        name: route.name,
        visitedAt: firebase.firestore.FieldValue.serverTimestamp()
      }
    });
  };

  return (
    <Container
      style={{
        ...styles.View_ButtonContainer,
        justifyContent: bottomBackButton ? 'flex-end' : 'center'
      }}
      elevation={0}
      useThemeGutterPadding={true}
    >
      {props.buttonValues &&
        props.buttonValues.map((val) => {
          const { label, value, solidColor } = val;
          return (
            <Button
              key={value}
              style={{ ...theme.buttonLayout, ...styles.Button_Default }}
              type={solidColor ? 'solid' : 'outline'}
              color={solidColor ? theme.colors.primary : theme.colors.secondary}
              loading={false}
              disabled={false}
              onPress={() => {
                props.onPress(value);
                submitUserProgress();
              }}
            >
              {label}
            </Button>
          );
        })}
      <Button
        style={{
          ...theme.buttonLayout,
          ...styles.Button_Continue,
          display: props.onlyBackButton ? 'none' : 'flex'
        }}
        type="solid"
        onPress={() => {
          props.onPress();
          submitUserProgress();
        }}
        color={theme.colors.primary}
        disabled={props.disabled}
      >
        {props.buttonLabel || 'Next'}
      </Button>
      {props.bottomGreyButtonLabel && (
        <Button
          style={{
            ...theme.buttonLayout,
            ...styles.Button_Continue,
            display: props.onlyBackButton ? 'none' : 'flex'
          }}
          type="solid"
          onPress={() => {
            props.onPress(props.bottomGreyButtonLabel);
            submitUserProgress();
          }}
          color={theme.colors.medium}
          disabled={props.disabled}
        >
          {props.bottomGreyButtonLabel}
        </Button>
      )}
      {props.bottomBackButton && (
        <TouchableOpacity
          disabled={bbbDisabled}
          style={styles.Touchable_BackButton}
          onPress={() => (bottomBackButton ? bottomBackButton() : undefined)}
        >
          <Text
            style={StyleSheet.flatten([
              styles.Text_BackButton,
              props.theme.typography.smallLabel,
              {
                color: theme.colors.light,
                opacity: !props.bbbDisabled ? 1 : 0.3
              }
            ])}
          >
            {props.bottomBackButtonLabel || 'Back'}
          </Text>
        </TouchableOpacity>
      )}
    </Container>
  );
};

const styles = StyleSheet.create({
  Button_Default: {
    marginTop: scale(5)
  },
  Button_Continue: {
    paddingTop: 0,
    marginTop: scale(5)
  },
  View_ButtonContainer: {
    marginBottom: scale(15)
  },
  Touchable_BackButton: {
    paddingTop: scale(18),
    paddingBottom: scale(2)
  },
  Text_BackButton: {
    textAlign: 'center'
  }
});

export default BottomNavButtons;
