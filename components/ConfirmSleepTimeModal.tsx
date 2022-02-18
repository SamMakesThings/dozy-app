import React from 'react';
import {
  View,
  Modal,
  Text,
  StyleSheet,
  ModalProps,
  TouchableOpacity,
  TouchableWithoutFeedback,
} from 'react-native';
import PropTypes, { InferProps } from 'prop-types';
import { withTheme } from '@draftbit/ui';

import { Theme } from '../types/theme';
import SleepLogEntryCard from './SleepLogEntryCard';
import { SleepLog } from '../types/custom';

const ConfirmSleepTimeModalPropTypes = {
  theme: PropTypes.any.isRequired,
  title: PropTypes.string,
  description: PropTypes.string,
  sleepLog: PropTypes.shape({
    logId: PropTypes.string,
    bedTime: PropTypes.shape({}).isRequired,
    fallAsleepTime: PropTypes.shape({}).isRequired,
    wakeTime: PropTypes.shape({}).isRequired,
    upTime: PropTypes.shape({}).isRequired,
    sleepRating: PropTypes.number.isRequired,
    sleepDuration: PropTypes.number.isRequired,
    sleepEfficiency: PropTypes.number.isRequired,
    nightMinsAwake: PropTypes.number.isRequired,
    minsToFallAsleep: PropTypes.number.isRequired,
    minsInBedTotal: PropTypes.number.isRequired,
    minsAwakeInBedTotal: PropTypes.number.isRequired,
    wakeCount: PropTypes.number.isRequired,
    SCTAnythingNonSleepInBed: PropTypes.bool,
    SCTNonSleepActivities: PropTypes.string,
    notes: PropTypes.string,
    tags: PropTypes.arrayOf(PropTypes.string.isRequired),
  }).isRequired,
  onFix: PropTypes.func,
  onProceed: PropTypes.func,
};

type ConfirmSleepTimeModalProps = Omit<
  InferProps<typeof ConfirmSleepTimeModalPropTypes>,
  'theme'
> &
  ModalProps & {
    theme: Theme;
  };

const ConfirmSleepTimeModal: React.FC<ConfirmSleepTimeModalProps> = ({
  title = 'Confirm your sleep and wake time',
  description = 'Your sleep and wake times are weird. Please check them carefully.',
  theme,
  sleepLog,
  onFix,
  onProceed,
  onRequestClose,
  ...props
}) => {
  return (
    <Modal
      animationType="slide"
      transparent
      onRequestClose={onRequestClose}
      {...props}
    >
      <TouchableWithoutFeedback onPress={onRequestClose}>
        <View style={styles.container}>
          <View
            style={[
              styles.modalView,
              {
                borderRadius: theme.borderRadius.global,
                backgroundColor: theme.colors.medium,
              },
              theme.elevation[3],
            ]}
          >
            <Text
              style={[
                theme.typography.headline5,
                { color: theme.colors.primary },
              ]}
            >
              {title}
            </Text>
            <Text
              style={[
                styles.description,
                theme.typography.body2,
                { color: theme.colors.secondary },
              ]}
            >
              {description}
            </Text>
            <SleepLogEntryCard sleepLog={sleepLog as SleepLog} />
            <View style={styles.controls}>
              <TouchableOpacity
                style={[
                  styles.button,
                  {
                    backgroundColor: theme.colors.primary,
                    borderRadius: theme.borderRadius.button,
                  },
                ]}
                onPress={onFix as NonNullable<any>}
              >
                <Text
                  style={[
                    theme.typography.button,
                    { color: theme.colors.secondary },
                  ]}
                >
                  Fix It
                </Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[
                  styles.button,
                  styles.rightButton,
                  {
                    backgroundColor: theme.colors.primary,
                    borderRadius: theme.borderRadius.button,
                  },
                ]}
                onPress={onProceed as NonNullable<any>}
              >
                <Text
                  style={[
                    theme.typography.button,
                    { color: theme.colors.secondary },
                  ]}
                >
                  Proceed As Is
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </TouchableWithoutFeedback>
    </Modal>
  );
};

ConfirmSleepTimeModal.propTypes = ConfirmSleepTimeModalPropTypes;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignContent: 'center',
  },
  // eslint-disable-next-line react-native/no-color-literals
  modalView: {
    alignItems: 'center',
    marginHorizontal: 16,
    padding: 20,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 5,
  },
  description: {
    marginTop: 8,
  },
  controls: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 32,
  },
  button: {
    flex: 1,
    alignItems: 'center',
    padding: 10,
  },
  rightButton: {
    marginLeft: 20,
  },
});

export default withTheme(ConfirmSleepTimeModal);
