import React from 'react';
import { Text, TextProps, StyleSheet } from 'react-native';
import { RichTextData } from '../types/RichTextData';
import { dozy_theme } from '../config/Themes';

export interface RichTextProps extends TextProps {
  data: RichTextData;
  linkColor?: string;
}

const RichText: React.FC<RichTextProps> = ({ data, style, ...props }) => (
  <Text style={[styles.container, style]} {...props}>
    {data.map(({ text, style: snipStyle, onPress }, index) => (
      <Text
        key={text + index}
        style={[onPress && styles.linkStyle, onPress && {}, snipStyle]}
        onPress={onPress}
      >
        {text}
      </Text>
    ))}
  </Text>
);

const styles = StyleSheet.create({
  container: {
    ...dozy_theme.typography.body1,
    color: dozy_theme.colors.secondary,
  },
  linkStyle: {
    color: dozy_theme.colors.strong,
    textDecorationLine: 'underline',
    textDecorationStyle: 'solid',
    textDecorationColor: dozy_theme.colors.strong,
  },
});

export default RichText;
