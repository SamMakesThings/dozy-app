import React from 'react';
import { StyleSheet, Text, View, TextProps } from 'react-native';
import { withTheme, ScreenContainer, Container } from '@draftbit/ui';
import { ProgressBar } from '../ProgressBar';
import BottomNavButtons from '../BottomNavButtons';
import { Theme } from '../../types/theme';

interface Props {
  theme: Theme;
  progressBarPercent?: number;
  image: React.ReactElement;
  textLabel: string | React.ReactElement<TextProps>;
  longText?: boolean;
  onQuestionSubmit?: (value?: string | number | boolean) => void;
  buttonLabel?: string;
  bottomGreyButtonLabel?: string;
  bottomBackButton?: () => void;
  bbbDisabled?: boolean;
  onlyBackButton?: boolean;
}

// Wizard screen with a hero image (usually icon) and paragraph text
const IconExplainScreen: React.FC<Props> = (props) => {
  const { theme } = props;

  return (
    <ScreenContainer hasSafeArea={true} scrollable={false}>
      <Container elevation={0} useThemeGutterPadding={true}>
        <Container
          style={styles.View_BarContainer}
          elevation={0}
          useThemeGutterPadding={true}
        >
          <ProgressBar
            style={props.progressBarPercent ? undefined : styles.hidden}
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
        <View style={styles.spacer} />
        <View style={styles.View_ImageContainer}>{props.image}</View>
        <Text
          style={[
            styles.Text_Explainer,
            theme.typography.body1,
            {
              color: theme.colors.secondary,
            },
            !props.longText && styles.shortLabel,
          ]}
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
    justifyContent: 'center',
  },
  View_ContentContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  View_BarContainer: {
    width: '100%',
    justifyContent: 'center',
    alignItems: 'center',
  },
  Text_Explainer: {
    textAlign: 'left',
    width: '90%',
    alignItems: 'flex-start',
    alignSelf: 'center',
    marginBottom: 10,
  },
  shortLabel: { flex: 3 },
  spacer: { flex: 1 },
  hidden: { display: 'none' },
});

export default withTheme(IconExplainScreen);
