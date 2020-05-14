import React from 'react';
import { StyleSheet, Text, TextInput, Image, View } from 'react-native';
import {
  withTheme,
  ScreenContainer,
  Container,
  IconButton,
  ProgressBar,
  Button
} from '@draftbit/ui';
import UndrawBed from '../assets/images/UndrawBed.png';

const IconExplainScreen = (props) => {
  const [selectedNum, setSelectedNum] = React.useState(-1);

  const { theme } = props;
  return (
    <ScreenContainer
      hasSafeArea={true}
      scrollable={false}
      style={styles.Root_n3a}
    >
      <View
        style={styles.Container_nh7}
        elevation={0}
        useThemeGutterPadding={true}
      >
        <IconButton
          style={styles.IconButton_nmh}
          icon="Ionicons/md-arrow-back"
          size={32}
          color={theme.colors.secondary}
          onPress={() => {
            props.navigation.goBack();
          }}
        />
        <Container
          style={styles.Container_nzw}
          elevation={0}
          useThemeGutterPadding={true}
        >
          <ProgressBar
            style={{
              ...styles.ProgressBar_neb,
              ...{ display: props.progressBar ? 'flex' : 'none' }
            }}
            color={theme.colors.primary}
            progress={props.progressBarPercent}
            borderWidth={0}
            borderRadius={10}
            animationType="spring"
            unfilledColor={theme.colors.medium}
          />
        </Container>
      </View>
      <Container
        style={styles.Container_nfw}
        elevation={0}
        useThemeGutterPadding={true}
      >
        <Text
          style={[
            styles.Text_nlz,
            theme.typography.headline5,
            {
              color: theme.colors.secondary
            }
          ]}
        >
          {props.questionLabel}
        </Text>
        <Container
          style={{
            marginTop: 65,
            marginBottom: 30,
            width: '50%',
            alignSelf: 'center',
            borderBottomWidth: 1.5,
            borderColor: theme.colors.medium
          }}
        >
          <TextInput
            style={{
              height: 40,
              color: '#ffffff',
              fontSize: 21,
              paddingBottom: 12
            }}
            placeholder={props.inputLabel}
            placeholderTextColor={theme.colors.light}
            keyboardType="number-pad"
            keyboardAppearance="dark"
            returnKeyType="done"
            enablesReturnKeyAutomatically={true}
            onChangeText={(inputValue) => setSelectedNum(inputValue)}
            onSubmitEditing={(event) => {
              props.onQuestionSubmit(event.nativeEvent.text);
            }}
          />
        </Container>
      </Container>
      <Container
        style={styles.Container_nrj}
        elevation={0}
        useThemeGutterPadding={true}
      >
        <Button
          style={styles.Button_nqa}
          type="solid"
          onPress={() => {
            props.onQuestionSubmit(selectedNum);
          }}
          color={theme.colors.primary}
          disabled={(!props.optional && selectedNum < 0) || selectedNum === ''}
        >
          Next
        </Button>
      </Container>
    </ScreenContainer>
  );
};

const styles = StyleSheet.create({
  Button_nqa: {
    paddingTop: 0,
    marginTop: 8
  },
  Container_nfw: {
    height: '72%',
    justifyContent: 'center',
    marginTop: 20
  },
  Container_nh7: {
    width: '100%',
    height: '10%',
    justifyContent: 'space-between',
    flexDirection: 'row',
    marginTop: 20
  },
  Container_nrj: {
    height: '15%'
  },
  Container_nzw: {
    width: '100%',
    justifyContent: 'center',
    alignItems: 'center'
  },
  IconButton_nmh: {
    paddingRight: 0
  },
  ProgressBar_neb: {
    width: 250,
    height: 7,
    paddingRight: 0,
    marginRight: 0
  },
  Root_n3a: {},
  TextField_nw8: {},
  Text_nlz: {
    textAlign: 'center',
    width: '100%',
    alignItems: 'flex-start',
    alignSelf: 'center'
  }
});

export default withTheme(IconExplainScreen);
