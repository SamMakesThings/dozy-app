import React from 'react';
import { StyleSheet } from 'react-native';
import { Container, Button } from '@draftbit/ui';

const BottomNavButtons = (props) => {
  return (
    <Container
      style={styles.View_ButtonContainer}
      elevation={0}
      useThemeGutterPadding={true}
    >
      <Button
        style={styles.Button_Continue}
        type="solid"
        onPress={() => {
          props.onContinue();
        }}
        color={props.theme.colors.primary}
      >
        {props.buttonLabel}
      </Button>
    </Container>
  );
};

const styles = StyleSheet.create({
  Button_Continue: {
    paddingTop: 0,
    marginTop: 8
  },
  View_ButtonContainer: {
    height: '15%'
  },
  Nav_BackButton: {
    paddingRight: 0
  }
});

export default BottomNavButtons;
