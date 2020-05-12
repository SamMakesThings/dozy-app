import React from 'react';
import { StyleSheet, Text, View, TouchableWithoutFeedback } from 'react-native';
import { withTheme } from '@draftbit/ui';
import '@firebase/firestore';
import { Entypo } from '@expo/vector-icons';

// Component for the icon/button that toggles
const ToggleTag = (props) => {
  const { theme } = props;
  const [selected, setSelected] = React.useState(false);

  return (
    <TouchableWithoutFeedback
      onPress={() => {
        setSelected(!selected);
        props.onPress(props.label);
      }}
    >
      <View style={styles.View_ToggleContainer}>
        <View
          style={[
            styles.View_IconContainer,
            selected
              ? {
                  backgroundColor: theme.colors.primary,
                  borderColor: theme.colors.primary
                }
              : {
                  borderColor: theme.colors.light
                }
          ]}
        >
          <Entypo
            name={props.entypoIcon}
            size={38}
            color={selected ? theme.colors.secondary : theme.colors.primary}
          />
        </View>
        <Text style={[styles.Text_ToggleLabel, { color: theme.colors.light }]}>
          {props.label}
        </Text>
      </View>
    </TouchableWithoutFeedback>
  );
};

const styles = StyleSheet.create({
  View_ToggleContainer: {
    width: '15%',
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
    margin: 5
  },
  View_IconContainer: {
    borderWidth: 2,
    borderRadius: 100,
    width: 60,
    height: 60,
    justifyContent: 'center',
    alignItems: 'center'
  },
  Text_ToggleLabel: {
    textAlign: 'center',
    paddingTop: 2
  }
});

export default withTheme(ToggleTag);
