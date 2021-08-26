import React, { PropsWithChildren } from 'react';
import { StyleSheet, Text, View } from 'react-native';

const BasicContainer = ({ children }: PropsWithChildren<unknown>) => {
  return <View style={styles.root}>{children}</View>;
};

export default BasicContainer;

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: '#232B3F'
  }
});
