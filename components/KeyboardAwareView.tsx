import React, { useState, useCallback, useEffect } from 'react';
import {
  Animated,
  Keyboard,
  TextInput,
  UIManager,
  useWindowDimensions,
  ViewPropTypes,
  KeyboardEvent,
  EmitterSubscription,
} from 'react-native';
import PropTypes, { InferProps } from 'prop-types';

const KeyboardAwareViewPropTypes = {
  ...ViewPropTypes,
  enabled: PropTypes.bool,
};

export type KeyboardAwareViewProps = InferProps<
  typeof KeyboardAwareViewPropTypes
>;

const { State: TextInputState } = TextInput;

const KeyboardAwareView: React.FC<KeyboardAwareViewProps> = ({
  style,
  enabled = false,
  ...props
}) => {
  const [shiftForKeyboard] = useState(new Animated.Value(0));
  const [keyboardDidShowListener, setKeyboardDidShowListener] =
    useState<EmitterSubscription | null>(null);
  const [keyboardDidHideListener, setKeyboardDidHideListener] =
    useState<EmitterSubscription | null>(null);
  const windowDimensions = useWindowDimensions();

  const keyboardDidShow = useCallback(
    (event: KeyboardEvent) => {
      const keyboardHeight = event.endCoordinates.height;
      const currentlyFocusedField = TextInputState.currentlyFocusedField();

      // Sometimes currentlyFocusedField is null, for example on Apple Signin Native UI
      if (currentlyFocusedField) {
        UIManager.measure(
          currentlyFocusedField,
          (originX, originY, w, h, pageX, pageY) => {
            const fieldHeight = h;
            const fieldTop = pageY;
            const gap =
              windowDimensions.height -
              keyboardHeight -
              (fieldTop + fieldHeight);
            if (gap < 0) {
              Animated.timing(shiftForKeyboard, {
                toValue: enabled ? gap : 0,
                duration: 300,
                useNativeDriver: true,
              }).start();
            }
          },
        );
      }
    },
    [shiftForKeyboard, enabled],
  );

  const keyboardDidHide = useCallback(() => {
    Animated.timing(shiftForKeyboard, {
      toValue: 0,
      duration: 300,
      useNativeDriver: true,
    }).start();
  }, [shiftForKeyboard]);

  useEffect(() => {
    setKeyboardDidShowListener(
      Keyboard.addListener('keyboardDidShow', keyboardDidShow),
    );
    setKeyboardDidHideListener(
      Keyboard.addListener('keyboardDidHide', keyboardDidHide),
    );

    return () => {
      if (keyboardDidShowListener) {
        keyboardDidShowListener.remove();
      }
      if (keyboardDidHideListener) {
        keyboardDidHideListener.remove();
      }
    };
  }, []);

  return (
    <Animated.View
      {...props}
      style={[style, { transform: [{ translateY: shiftForKeyboard }] }]}
    />
  );
};

KeyboardAwareView.propTypes = KeyboardAwareViewPropTypes;

export default KeyboardAwareView;
