import React, { useState, useCallback } from 'react';
import {
  View,
  Modal,
  StyleSheet,
  ModalProps,
  TouchableWithoutFeedback,
} from 'react-native';
import { withTheme } from '@draftbit/ui';
import { scale } from 'react-native-size-matters';
import { Theme } from '../types/theme';
import FeedbackWidget from './FeedbackWidget';
import submitFeedback from '../utilities/submitFeedback';

export interface FeedbackPopupModalProps extends ModalProps {
  theme: Theme;
}

export const FeedbackPopupModal: React.FC<FeedbackPopupModalProps> = ({
  onRequestClose,
  ...props
}) => {
  const [feedback, setFeedback] = useState('');
  const [rate, setRate] = useState(0);

  const onSubmit = useCallback((): void => {
    submitFeedback(rate, feedback);
  }, [rate, feedback]);

  return (
    <Modal
      animationType="slide"
      transparent
      onRequestClose={(event) => onRequestClose?.(event)}
      {...props}
    >
      <TouchableWithoutFeedback onPress={onRequestClose}>
        <View style={styles.container}>
          <FeedbackWidget
            style={styles.modalView}
            rate={rate}
            onRateChange={setRate}
            onFeedbackChange={setFeedback}
            onSubmit={onSubmit}
          />
        </View>
      </TouchableWithoutFeedback>
    </Modal>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  // eslint-disable-next-line react-native/no-color-literals
  modalView: {
    marginHorizontal: scale(10),
  },
});

export default withTheme(FeedbackPopupModal);
