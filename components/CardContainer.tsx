import React from 'react';
import { StyleSheet, View, ViewProps } from 'react-native';
import { scale } from 'react-native-size-matters';
import { dozy_theme } from '../config/Themes';

export type CardContainerProps = ViewProps;

export const CardContainer: React.FC<CardContainerProps> = ({
  style,
  children,
  ...props
}) => {
  return (
    <View style={[styles.View_CardContainer, style]} {...props}>
      {children}
    </View>
  );
};

const styles = StyleSheet.create({
  View_CardContainer: {
    backgroundColor: dozy_theme.colors.medium,
    padding: scale(12),
    borderRadius: dozy_theme.borderRadius.global,
    marginBottom: scale(15),
  },
});

export default CardContainer;
