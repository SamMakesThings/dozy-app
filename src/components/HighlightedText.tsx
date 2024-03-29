import React from 'react';
import { Text, StyleSheet, ViewStyle } from 'react-native';
import { Container } from '@draftbit/ui';
import { scale } from 'react-native-size-matters';
import { dozy_theme } from '../config/Themes';

interface Props {
  label: string;
  textColor: string;
  bgColor: string;
  style?: ViewStyle;
}

const HighlightedText: React.FC<Props> = (props) => {
  const theme = dozy_theme;
  return (
    <Container
      style={{
        ...styles.View_Container,
        borderRadius: theme.borderRadius.button,
        ...props.style,
      }}
      elevation={0}
      backgroundColor={props.bgColor}
      useThemeGutterPadding={false}
    >
      <Text
        style={[
          theme.typography.smallLabel,
          styles.Text_Highlighted,
          { color: props.textColor },
        ]}
      >
        {props.label}
      </Text>
    </Container>
  );
};

const styles = StyleSheet.create({
  View_Container: {
    maxWidth: '94%',
    alignSelf: 'flex-start',
    marginHorizontal: 0,
    overflow: 'hidden',
  },
  Text_Highlighted: {
    textAlign: 'center',
    width: '100%',
    paddingVertical: scale(5),
    paddingHorizontal: scale(2),
  },
});

export default HighlightedText;
