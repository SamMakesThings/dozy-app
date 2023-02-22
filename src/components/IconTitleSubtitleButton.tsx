import React from 'react';
import {
  Text,
  View,
  TouchableOpacity,
  StyleSheet,
  TouchableOpacityProps,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { scale } from 'react-native-size-matters';
import { dozy_theme } from '../config/Themes';

interface Props extends TouchableOpacityProps {
  titleLabel: string;
  subtitleLabel: string;
  backgroundColor?: string;
  icon?: React.ReactElement;
  badge?: boolean;
}

const IconTitleSubtitleButton: React.FC<Props> = ({
  titleLabel,
  subtitleLabel,
  backgroundColor,
  icon,
  badge,
  style,
  ...props
}) => {
  const theme = dozy_theme;
  return (
    <TouchableOpacity
      style={[
        styles.Touchable_ButtonContainer,
        { backgroundColor: backgroundColor || theme.colors.medium },
        style,
      ]}
      {...props}
    >
      {icon || ( // Use custom icon if passed
        <Ionicons
          name="ios-add-circle"
          size={scale(35)}
          color={theme.colors.secondary}
        />
      )}
      {badge && ( // Add red circle badge if "badge" passed
        <View style={styles.View_BadgeContainer}>
          <Text
            style={{
              color: theme.colors.secondary,
              fontSize: scale(12),
              lineHeight: scale(14),
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
          {titleLabel}
        </Text>
        <Text
          style={[
            theme.typography.body2,
            styles.subTitleLabel,
            { color: theme.colors.secondary },
          ]}
        >
          {subtitleLabel}
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
    marginBottom: scale(15),
  },
  // eslint-disable-next-line react-native/no-color-literals
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
    alignItems: 'center',
  },
  subTitleLabel: {
    opacity: 0.5,
    marginTop: scale(-5),
  },
});

export default IconTitleSubtitleButton;
