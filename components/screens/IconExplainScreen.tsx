import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { withTheme, ScreenContainer, Container } from '@draftbit/ui';
import { ProgressBar } from '../ProgressBar';
import BottomNavButtons from '../BottomNavButtons';
import { Theme } from '../../types/theme';

interface Props {
  theme: Theme;
  progressBarPercent: number;
  image: React.Component;
  textLabel: string;
  longText?: boolean;
  onQuestionSubmit: Function;
  buttonLabel?: string;
  bottomGreyButtonLabel?: string;
  bottomBackButton?: Function;
  bbbDisabled?: boolean;
  onlyBackButton?: boolean;
}

// Wizard screen with a hero image (usually icon) and paragraph text
const IconExplainScreen: React.FC<Props> = (props) => {
  const { theme } = props;

  return (
    <ScreenContainer hasSafeArea={true} scrollable={false}>
      <Container
        style={styles.View_HeaderContainer}
        elevation={0}
        useThemeGutterPadding={true}
      >
        <Container
          style={styles.View_BarContainer}
          elevation={0}
          useThemeGutterPadding={true}
        >
          <ProgressBar
            style={{
              ...styles.ProgressBar,
              ...{ display: props.progressBarPercent ? 'flex' : 'none' }
            }}
            color={theme.colors.primary}
            progress={props.progressBarPercent}
            borderRadius={10}
            unfilledColor={theme.colors.medium}
          />
        </Container>
      </Container>
      <Container
        style={styles.View_ContentContainer}
        elevation={0}
        useThemeGutterPadding={true}
      >
        <View style={{ flex: 1 }} />
        <View style={styles.View_ImageContainer}>{props.image}</View>
        <Text
          style={{
            ...styles.Text_Explainer,
            ...theme.typography.body1,
            color: theme.colors.secondary,
            flex: props.longText ? undefined : 3,
            marginBottom: 10
          }}
        >
          {props.textLabel}
        </Text>
      </Container>
      <BottomNavButtons
        onPress={props.onQuestionSubmit}
        buttonLabel={props.buttonLabel}
        bottomGreyButtonLabel={props.bottomGreyButtonLabel}
        bottomBackButton={props.bottomBackButton}
        bbbDisabled={props.bbbDisabled}
        onlyBackButton={props.onlyBackButton}
        theme={theme}
      />
    </ScreenContainer>
  );
};

const styles = StyleSheet.create({
  View_ImageContainer: {
    flex: 5,
    justifyContent: 'center'
  },
  View_ContentContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center'
  },
  View_BarContainer: {
    width: '100%',
    justifyContent: 'center',
    alignItems: 'center'
  },
  Nav_BackButton: {
    paddingRight: 0
  },
  Text_Explainer: {
    textAlign: 'left',
    width: '90%',
    alignItems: 'flex-start',
    alignSelf: 'center'
  },
  ProgressBar: {},
  View_HeaderContainer: {}
});

export default withTheme(IconExplainScreen);