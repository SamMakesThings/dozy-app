import React from 'react';
import { StyleSheet, Text, Platform, View } from 'react-native';
import {
  withTheme,
  ScreenContainer,
  Container,
  IconButton,
  ProgressBar,
  TextField,
  Button
} from '@draftbit/ui';
import '@firebase/firestore';
import Intl from 'intl';
import ToggleTag from './ToggleTag';

if (Platform.OS === 'android') {
  require('intl/locale-data/jsonp/en-US');
  require('intl/locale-data/jsonp/tr-TR');
  require('date-time-format-timezone');
  Intl.__disableRegExpRestore(); /*For syntaxerror invalid regular expression unmatched parentheses*/
}

const TagSelectScreen = (props) => {
  // Set the available tags and icons
  const { theme, touchableTags } = props;

  // Set up component state for tags and note field
  const [selectedTags, updateTags] = React.useState([]);
  const [notes, setNotes] = React.useState('');

  return (
    <ScreenContainer
      hasSafeArea={true}
      scrollable={false}
      style={styles.Root_nb1}
    >
      <Container
        style={styles.Container_nof}
        elevation={0}
        useThemeGutterPadding={true}
      >
        <IconButton
          style={styles.IconButton_n9u}
          icon="Ionicons/md-arrow-back"
          size={32}
          color={theme.colors.secondary}
          onPress={() => {
            props.navigation.goBack();
          }}
        />
        <Container
          style={styles.Container_nuv}
          elevation={0}
          useThemeGutterPadding={true}
        >
          <ProgressBar
            style={{
              ...styles.ProgressBar_nn5,
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
      </Container>
      <Container
        style={styles.Container_n8t}
        elevation={0}
        useThemeGutterPadding={true}
      >
        <Text
          style={[
            styles.Text_nqt,
            theme.typography.headline5,
            {
              color: theme.colors.secondary
            }
          ]}
        >
          {props.questionLabel}
        </Text>
        <View
          style={{
            flex: 4,
            flexDirection: 'row',
            justifyContent: 'space-around',
            flexWrap: 'wrap',
            alignContent: 'center',
            alignItems: 'flex-start'
          }}
        >
          {touchableTags.map((tag) => {
            // Create ToggleTag elements based on props
            const { label, selected, icon } = tag;

            return (
              <ToggleTag
                key={label}
                theme={theme}
                selected={selected}
                entypoIcon={icon}
                label={label}
                onPress={() => {
                  let tempArray = selectedTags;
                  const index = selectedTags.findIndex((tag) => tag === label);
                  if (index > -1) {
                    tempArray.splice(index, 1);
                    updateTags(tempArray);
                  } else {
                    tempArray.push(label);
                    updateTags(tempArray);
                  }
                }}
              />
            );
          })}
        </View>
        <TextField
          style={styles.TextField_no0}
          type="underline"
          label={props.inputLabel}
          keyboardType="default"
          leftIconMode="inset"
          onChangeText={(value) => setNotes(value)}
          onSubmitEditing={() => {
            props.onFormSubmit({ notes: notes, tags: selectedTags });
          }}
        />
      </Container>
      <Container
        style={styles.Container_nmw}
        elevation={0}
        useThemeGutterPadding={true}
      >
        <Button
          style={styles.Button_n5c}
          type="solid"
          onPress={() => {
            props.onFormSubmit({ notes: notes, tags: selectedTags });
          }}
          color={theme.colors.primary}
        >
          Finish
        </Button>
      </Container>
    </ScreenContainer>
  );
};

const styles = StyleSheet.create({
  Button_n5c: {
    paddingTop: 0,
    marginTop: 8
  },
  Container_n8t: {
    height: '72%',
    justifyContent: 'center',
    marginTop: 20
  },
  Container_nmw: {
    height: '15%'
  },
  Container_nof: {
    width: '100%',
    height: '10%',
    justifyContent: 'space-between',
    flexDirection: 'row',
    marginTop: 20
  },
  Container_nuv: {
    width: '100%',
    justifyContent: 'center',
    alignItems: 'center'
  },
  IconButton_n9u: {
    paddingRight: 0
  },
  ProgressBar_nn5: {
    width: 250,
    height: 7,
    paddingRight: 0,
    marginRight: 0
  },
  Root_nb1: {},
  TextField_no0: {
    flex: 1
  },
  Text_nqt: {
    textAlign: 'center',
    width: '100%',
    alignItems: 'flex-start',
    alignSelf: 'center'
  }
});

export default withTheme(TagSelectScreen);
