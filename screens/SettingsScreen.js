import React, { Component } from "react";
import { observer } from "mobx-react";
import { observable } from "mobx";
import { View, Text, Button } from "react-native";

@observer
export default class SettingsScreen extends React.Component {
  @observable boxVisible = true;
  toggleBox = () => {
    this.boxVisible = !this.boxVisible;
  };
  render() {
    return (
      <View>
        <Text>MobX Demo</Text>
        <Button title={"Test"} onPress={this.toggleBox}>Toggle Box</Button>
        {this.boxVisible && <View style={styles.box} />}
      </View>
    );
  }
}

const styles = {
  box: {
    margin: 10,
    height: 200,
    width: 200,
    backgroundColor: "red"
  }
};