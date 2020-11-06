import React from 'react';
import { Text } from 'react-native';

export class MonoText extends React.Component<{ style: object }> {
  render() {
    return (
      <Text
        {...this.props}
        style={[this.props.style, { fontFamily: 'space-mono' }]}
      />
    );
  }
}
