import React from 'react';
import {
  Text,
  View,
  TouchableOpacity,
  GestureResponderEvent
} from 'react-native';
// import { withTheme } from '@draftbit/ui';
import { Ionicons } from '@expo/vector-icons';
import { scale } from 'react-native-size-matters';
import { dozy_theme } from '../config/Themes';

interface Props {
  titleLabel: string;
  subtitleLabel: string;
  notLoggedToday: boolean;
  onPress: ((event: GestureResponderEvent) => void) | undefined;
}

const IconTitleSubtitleButton: React.FC<Props> = (props) => {
  const theme = dozy_theme;
  // TODO: Hide or grey log sleep button if logged today
  return (
    <TouchableOpacity
      style={{
        flexDirection: 'row',
        justifyContent: 'space-around',
        alignItems: 'center',
        backgroundColor: props.notLoggedToday
          ? theme.colors.primary
          : theme.colors.medium,
        padding: scale(18),
        borderRadius: theme.borderRadius.global,
        marginTop: scale(15),
        marginBottom: scale(15)
      }}
      onPress={props.onPress}
    >
      <Ionicons
        name="ios-add-circle"
        size={scale(35)}
        color={theme.colors.secondary}
      />
      <View>
        <Text
          style={{ ...theme.typography.body1, color: theme.colors.secondary }}
        >
          How did you sleep last night?
        </Text>
        <Text
          style={{
            ...theme.typography.body2,
            color: theme.colors.secondary,
            opacity: 0.5,
            marginTop: scale(-5)
          }}
        >
          A consistent log improves treatment
        </Text>
      </View>
    </TouchableOpacity>
  );
};

export default IconTitleSubtitleButton;
