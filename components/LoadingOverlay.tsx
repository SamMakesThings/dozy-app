import React from 'react';
import { View, ActivityIndicator, StyleSheet, Text } from 'react-native';
import { dozy_theme } from '../config/Themes';

export interface LoadingOverlayProps {
  title?: string;
}

const LoadingOverlay: React.FC<LoadingOverlayProps> = ({ title }) => (
  <View style={styles.container}>
    <ActivityIndicator size="large" color={dozy_theme.colors.primary} />
    {!!title && <Text style={styles.title}>{title}</Text>}
  </View>
);

const styles = StyleSheet.create({
  // eslint-disable-next-line react-native/no-color-literals
  container: {
    ...StyleSheet.absoluteFillObject,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#232B3F',
  },
  title: {
    marginTop: 12,
    color: dozy_theme.colors.secondary,
    ...dozy_theme.typography.body2,
  },
});

export default LoadingOverlay;
