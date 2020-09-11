import React from 'react';
import {
  Text,
  View,
  TouchableOpacity,
  GestureResponderEvent,
  StyleSheet
} from 'react-native';
// import { withTheme } from '@draftbit/ui';
import { Ionicons } from '@expo/vector-icons';
import { scale } from 'react-native-size-matters';
import { dozy_theme } from '../config/Themes';

interface Props {
  titleLabel: string;
  subtitleLabel: string;
  backgroundColor?: string;
  icon?: object;
  badge?: boolean;
  onPress?: ((event: GestureResponderEvent) => void) | undefined;
}

const IconTitleSubtitleButton: React.FC<Props> = (props) => {
  const theme = dozy_theme;
  return (
    <TouchableOpacity
      style={{
        ...styles.Touchable_ButtonContainer,
        backgroundColor: props.backgroundColor || theme.colors.medium
      }}
      onPress={props.onPress}
    >
      {props.icon || ( // Use custom icon if passed
        <Ionicons
          name="ios-add-circle"
          size={scale(35)}
          color={theme.colors.secondary}
        />
      )}
      {props.badge && ( // Add red circle badge if "badge" passed
        <View style={styles.View_BadgeContainer}>
          <Text
            style={{
              color: theme.colors.secondary,
              fontSize: scale(12),
              lineHeight: scale(14)
            }}
          >
            1
          </Text>
        </View>
      )}

      <View>
        <Text
          style={{ ...theme.typography.body1, color: theme.colors.secondary }}
        >
          {props.titleLabel}
        </Text>
        <Text
          style={{
            ...theme.typography.body2,
            color: theme.colors.secondary,
            opacity: 0.5,
            marginTop: scale(-5)
          }}
        >
          {props.subtitleLabel}
        </Text>
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  Touchable_ButtonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    padding: scale(18),
    borderRadius: dozy_theme.borderRadius.global,
    marginTop: scale(15),
    marginBottom: scale(15)
  },
  View_BadgeContainer: {
    backgroundColor: 'red',
    padding: scale(4),
    width: scale(23),
    marginTop: scale(10),
    marginLeft: scale(4),
    borderRadius: scale(100),
    position: 'absolute',
    alignSelf: 'flex-start',
    justifyContent: 'center',
    alignItems: 'center'
  }
});

export default IconTitleSubtitleButton;
