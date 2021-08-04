import React from 'react';
import {
  StyleSheet,
  Text,
  Platform,
  View,
  TextInput,
  useWindowDimensions,
  ScrollView
} from 'react-native';
import { withTheme, ScreenContainer, Container } from '@draftbit/ui';
import '@react-native-firebase/firestore';
import { scale } from 'react-native-size-matters';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import ToggleTag from '../ToggleTag';
import BottomNavButtons from '../BottomNavButtons';
import { Theme } from '../../types/theme';
import KeyboardAwareView from '../KeyboardAwareView';

if (Platform.OS === 'android') {
  require('intl/locale-data/jsonp/en-US');
  require('intl/locale-data/jsonp/tr-TR');
  require('date-time-format-timezone');
  // ntl.__disableRegExpRestore(); /*For syntaxerror invalid regular expression unmatched parentheses*/
}

interface Props {
  theme: Theme;
  touchableTags: Array<{
    label: string;
    selected: boolean;
    icon: string;
  }>;
  defaultTags?: string[];
  defaultNotes?: string;
  questionLabel: string;
  inputLabel: string;
  onFormSubmit: Function;
}

const TagSelectScreen: React.FC<Props> = (props) => {
  // Set the available tags and icons
  const { theme, touchableTags } = props;

  // Set up component state for tags and note field
  const [selectedTags, updateTags] = React.useState(
    props.defaultTags || []
  ) as any;
  const [notes, setNotes] = React.useState(props.defaultNotes || []);
  const { top, bottom } = useSafeAreaInsets();
  const { height } = useWindowDimensions();

  return (
    <ScreenContainer
      hasSafeArea={false}
      scrollable={false}
      style={{ paddingTop: top, paddingBottom: bottom }}
    >
      <View
        style={[
          styles.overlay,
          {
            backgroundColor: theme.colors.background,
            height: top + height * 0.1
          }
        ]}
      />
      <Container
        style={[
          styles.Container_nof,
          { backgroundColor: theme.colors.background }
        ]}
        elevation={0}
        useThemeGutterPadding={true}
      />
      <ScrollView contentContainerStyle={{ flex: 1 }} scrollEnabled={false}>
        <KeyboardAwareView style={{ flex: 1 }}>
          <Container style={styles.Container_nuv} useThemeGutterPadding>
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
                alignItems: 'flex-start',
                backgroundColor: theme.colors.background
              }}
            >
              {touchableTags.map((tag) => {
                // Create ToggleTag elements based on props
                const { label, icon } = tag;
                // If editing log and tag is present, mark it selected
                const selected =
                  props.defaultTags && props.defaultTags.includes(label)
                    ? true
                    : false;

                return (
                  <ToggleTag
                    key={label}
                    theme={theme}
                    initialSelected={selected}
                    entypoIcon={icon}
                    label={label}
                    onPress={() => {
                      let tempArray = selectedTags;
                      const index = selectedTags.findIndex(
                        (tag: string) => tag === label
                      );
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
            <View
              style={[
                styles.View_TextInputContainer,
                {
                  borderColor: theme.colors.medium,
                  backgroundColor: theme.colors.background
                }
              ]}
            >
              <TextInput
                style={{
                  height: scale(35),
                  color: '#ffffff',
                  fontSize: scale(17),
                  paddingBottom: scale(10)
                }}
                placeholder={props.inputLabel}
                placeholderTextColor={theme.colors.light}
                defaultValue={props.defaultNotes}
                keyboardType="default"
                keyboardAppearance="dark"
                returnKeyType="done"
                enablesReturnKeyAutomatically={true}
                onChangeText={(value) => setNotes(value)}
              />
            </View>
          </Container>
        </KeyboardAwareView>
      </ScrollView>
      <BottomNavButtons
        theme={theme}
        onPress={() => props.onFormSubmit({ notes: notes, tags: selectedTags })}
        buttonLabel="Finish"
      />
    </ScreenContainer>
  );
};

const styles = StyleSheet.create({
  overlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    zIndex: 1
  },
  View_TextInputContainer: {
    alignSelf: 'stretch',
    marginTop: 0,
    marginBottom: '7%',
    borderBottomWidth: 1.5
  },
  Button_n5c: {
    paddingTop: 0,
    marginTop: scale(7)
  },
  Container_nmw: {
    height: '15%'
  },
  Container_nof: {
    width: '100%',
    height: '10%',
    justifyContent: 'space-between',
    flexDirection: 'row',
    marginTop: scale(17),
    zIndex: 1
  },
  Container_nuv: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center'
  },
  IconButton_n9u: {
    paddingRight: 0
  },
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
