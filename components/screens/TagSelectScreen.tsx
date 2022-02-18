import React, { useState, useCallback } from 'react';
import {
  StyleSheet,
  Text,
  Platform,
  View,
  TextInput,
  useWindowDimensions,
  ScrollView,
  InteractionManager,
} from 'react-native';
import { Entypo } from '@expo/vector-icons';
import { withTheme, ScreenContainer, Container } from '@draftbit/ui';
import { scale } from 'react-native-size-matters';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import ToggleTag from '../ToggleTag';
import BottomNavButtons from '../BottomNavButtons';
import KeyboardAwareView from '../KeyboardAwareView';
import ConfirmSleepTimeModal from '../ConfirmSleepTimeModal';
import { Theme } from '../../types/theme';
import { SleepLog } from '../../types/custom';
import { ErrorObj } from '../../types/error';

if (Platform.OS === 'android') {
  require('intl/locale-data/jsonp/en-US');
  require('intl/locale-data/jsonp/tr-TR');
  require('date-time-format-timezone');
  // ntl.__disableRegExpRestore(); /*For syntaxerror invalid regular expression unmatched parentheses*/
}

interface Props {
  theme: Theme;
  touchableTags: {
    label: string;
    selected?: boolean;
    icon: React.ComponentProps<typeof Entypo>['name'];
  }[];
  defaultTags?: string[];
  defaultNotes?: string;
  questionLabel: string;
  inputLabel: string;
  validateSleepLog: () => ErrorObj | boolean;
  onInvalidForm: () => void;
  onFormSubmit: (value: { notes: string; tags: string[] }) => void;
  sleepLog: SleepLog;
}

const TagSelectScreen: React.FC<Props> = ({
  theme,
  touchableTags,
  defaultTags,
  defaultNotes,
  questionLabel,
  inputLabel,
  sleepLog,
  validateSleepLog,
  onInvalidForm,
  onFormSubmit,
}) => {
  // Set up component state for tags and note field
  const [selectedTags, updateTags] = React.useState(defaultTags || []) as any;
  const [notes, setNotes] = useState(defaultNotes || '');
  const [showingModal, setShowingModal] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string>();
  const { top, bottom } = useSafeAreaInsets();
  const { height } = useWindowDimensions();
  const scrollViewRef = React.useRef<ScrollView>(null);

  const onAndroidLayout = useCallback((): void => {
    InteractionManager.runAfterInteractions(() => {
      if (scrollViewRef.current) {
        scrollViewRef.current.scrollToEnd({ animated: false });
      }
    });
  }, []);

  const onFormSubmitWithNotesAndTags = useCallback((): void => {
    onFormSubmit({ notes, tags: selectedTags });
  }, [onFormSubmit, notes, selectedTags]);

  const onSubmit = useCallback((): void => {
    const validationResult = validateSleepLog();
    if (validationResult === true) {
      onFormSubmitWithNotesAndTags();
    } else {
      setErrorMessage((validationResult as ErrorObj).errorMsg);
      setShowingModal(true);
    }
  }, [validateSleepLog, onFormSubmitWithNotesAndTags]);

  const onFixSleepLog = useCallback((): void => {
    setShowingModal(false);
    onInvalidForm();
  }, [onInvalidForm]);

  return (
    <ScreenContainer
      hasSafeArea={false}
      scrollable={false}
      style={{ paddingTop: top, paddingBottom: bottom }}
    >
      <ConfirmSleepTimeModal
        visible={showingModal}
        sleepLog={sleepLog}
        description={errorMessage}
        onRequestClose={() => setShowingModal((prevState) => !prevState)}
        onFix={onFixSleepLog}
        onProceed={onFormSubmitWithNotesAndTags}
      />
      <View
        style={[
          styles.overlay,
          {
            backgroundColor: theme.colors.background,
            height: top + height * 0.1,
          },
        ]}
      />
      <Container
        style={[
          styles.Container_nof,
          { backgroundColor: theme.colors.background },
        ]}
        elevation={0}
        useThemeGutterPadding={true}
      />
      <ScrollView
        contentContainerStyle={styles.container}
        ref={scrollViewRef}
        keyboardDismissMode="on-drag"
        onLayout={Platform.OS === 'android' ? onAndroidLayout : undefined}
      >
        <KeyboardAwareView
          style={styles.container}
          enabled={Platform.OS === 'ios'}
        >
          <Container style={styles.Container_nuv} useThemeGutterPadding>
            <Text
              style={[
                styles.Text_nqt,
                theme.typography.headline5,
                {
                  color: theme.colors.secondary,
                },
              ]}
            >
              {questionLabel}
            </Text>
            <View
              style={[
                styles.tagsContainer,
                {
                  backgroundColor: theme.colors.background,
                },
              ]}
            >
              {touchableTags.map((tag) => {
                // Create ToggleTag elements based on props
                const { label, icon } = tag;
                // If editing log and tag is present, mark it selected
                const selected =
                  defaultTags && defaultTags.includes(label) ? true : false;

                return (
                  <ToggleTag
                    key={label}
                    theme={theme}
                    initialSelected={selected}
                    entypoIcon={icon}
                    label={label}
                    onPress={() => {
                      const tempArray = selectedTags;
                      const index = selectedTags.findIndex(
                        (it: string) => it === label,
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
                  backgroundColor: theme.colors.background,
                },
              ]}
            >
              <TextInput
                style={styles.notesInput}
                placeholder={inputLabel}
                placeholderTextColor={theme.colors.light}
                defaultValue={defaultNotes}
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
      <BottomNavButtons theme={theme} onPress={onSubmit} buttonLabel="Finish" />
    </ScreenContainer>
  );
};

const styles = StyleSheet.create({
  overlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    zIndex: 1,
  },
  container: {
    flexGrow: 1,
  },
  View_TextInputContainer: {
    alignSelf: 'stretch',
    marginTop: scale(12),
    marginBottom: scale(15),
    borderBottomWidth: 1.5,
  },
  Container_nof: {
    width: '100%',
    height: '9%',
    justifyContent: 'space-between',
    flexDirection: 'row',
    marginTop: scale(17),
    zIndex: 1,
  },
  Container_nuv: {
    flexGrow: 1,
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingTop: scale(10),
  },
  Text_nqt: {
    textAlign: 'center',
    width: '100%',
    alignItems: 'flex-start',
    alignSelf: 'center',
  },
  tagsContainer: {
    flex: 4,
    flexDirection: 'row',
    justifyContent: 'space-around',
    flexWrap: 'wrap',
    alignContent: 'center',
    alignItems: 'flex-start',
    marginTop: scale(12),
  },
  // eslint-disable-next-line react-native/no-color-literals
  notesInput: {
    height: scale(38),
    color: '#ffffff',
    fontSize: scale(17),
    paddingBottom: scale(10),
  },
});

export default withTheme(TagSelectScreen);
