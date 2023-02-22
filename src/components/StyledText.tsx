import React from 'react';
import { Text, TextProps, StyleSheet } from 'react-native';

const MonoText: React.FC<TextProps> = ({ style, ...props }) => (
  <Text {...props} style={[style, styles.text]} />
);

const styles = StyleSheet.create({
  text: { fontFamily: 'space-mono' },
});

export default MonoText;
