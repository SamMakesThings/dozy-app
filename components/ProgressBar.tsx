import React from 'react';
import { StyleSheet, View } from 'react-native';
import { withTheme } from '@draftbit/ui';
import { scale } from 'react-native-size-matters';
import { dozy_theme } from '../config/Themes';

interface Props {
  progress: number;
  style?: object;
  color?: string;
  unfilledColor?: string;
  borderRadius?: number;
}

// A progress bar component. By default expands to available horizontal space in its parent container.
export const ProgressBar: React.FC<Props> = ({
  progress = 0.01,
  style,
  color = dozy_theme.colors.primary,
  unfilledColor = dozy_theme.colors.medium,
  borderRadius = 100
}) => {
  return (
    <View style={{ ...styles.View_ProgBarContainer, ...style }}>
      <View
        style={{
          ...styles.View_ProgBarBg,
          backgroundColor: unfilledColor,
          borderRadius: borderRadius
        }}
      >
        <View
          style={{
            ...styles.View_ProgBarFill,
            backgroundColor: color,
            borderRadius: borderRadius,
            flex: progress
          }}
        />
        <View
          style={{
            ...styles.View_ProgBarBlank,
            flex: 1 - progress
          }}
        />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  View_ProgBarContainer: {
    height: scale(8)
  },
  View_ProgBarBg: {
    backgroundColor: dozy_theme.colors.background,
    flex: 1,
    flexDirection: 'row',
    borderRadius: 100
  },
  View_ProgBarFill: {
    flex: 1,
    backgroundColor: dozy_theme.colors.primary,
    borderRadius: 100
  },
  View_ProgBarBlank: {
    flex: 1
  }
});

export default withTheme(ProgressBar);
