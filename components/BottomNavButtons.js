import React from 'react';
import { StyleSheet, TouchableOpacity, Text } from 'react-native';
import { scale } from 'react-native-size-matters';
import { Container, Button } from '@draftbit/ui';

const BottomNavButtons = (props) => {
  const { theme, bottomBackButton, bbbDisabled } = props;

  return (
    <Container
      style={{
        ...styles.View_ButtonContainer,
        justifyContent: bottomBackButton ? 'flex-end' : 'center'
      }}
      elevation={0}
      useThemeGutterPadding={true}
    >
      <Button
        style={{
          ...theme.buttonLayout,
          ...styles.Button_Continue,
          display: props.onlyBackButton ? 'none' : 'flex'
        }}
        type="solid"
        onPress={() => {
          props.onPress();
        }}
        color={theme.colors.primary}
        disabled={props.disabled}
      >
        {props.buttonLabel ? props.buttonLabel : 'Next'}
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
          onPress={() => bottomBackButton()}
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
            Back
          </Text>
        </TouchableOpacity>
      )}
    </Container>
  );
};

const styles = StyleSheet.create({
  Button_Continue: {
    paddingTop: 0,
    marginTop: scale(8)
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
