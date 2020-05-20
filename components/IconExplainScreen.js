import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import {
  withTheme,
  ScreenContainer,
  Container,
  ProgressBar
} from '@draftbit/ui';
import BottomNavButtons from './BottomNavButtons';

// Wizard screen with a hero image (usually icon) and paragraph text
const IconExplainScreen = (props) => {
  const { theme } = props;

  return (
    <ScreenContainer
      hasSafeArea={true}
      scrollable={false}
      style={styles.RootContainer}
    >
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
            borderWidth={0}
            borderRadius={10}
            animationType="spring"
            unfilledColor={theme.colors.medium}
          />
        </Container>
      </Container>
      <Container
        style={styles.View_ContentContainer}
        elevation={0}
        useThemeGutterPadding={true}
      >
        <View style={styles.View_ImageContainer}>{props.image}</View>
        <Text
          style={[
            styles.Text_Explainer,
            theme.typography.body1,
            {
              color: theme.colors.secondary,
              flex: 3
            }
          ]}
        >
          {props.textLabel}
        </Text>
      </Container>
      <BottomNavButtons
        onPress={props.onQuestionSubmit}
        buttonLabel={props.buttonLabel}
        bottomBackButton={props.bottomBackButton}
        bbbDisabled={props.bbbDisabled}
        theme={theme}
      />
    </ScreenContainer>
  );
};

const styles = StyleSheet.create({
  Button_Continue: {
    paddingTop: 0,
    marginTop: 8
  },
  View_ImageContainer: {
    flex: 5,
    justifyContent: 'center'
  },
  View_ContentContainer: {
    flex: 1,
    justifyContent: 'flex-end',
    alignItems: 'center'
  },
  View_HeaderContainer: {
    width: '100%',
    height: '10%',
    justifyContent: 'space-between',
    flexDirection: 'row',
    marginTop: 20
  },
  View_BarContainer: {
    width: '100%',
    justifyContent: 'center',
    alignItems: 'center'
  },
  Nav_BackButton: {
    paddingRight: 0
  },
  ProgressBar: {
    width: 250,
    height: 7,
    paddingRight: 0,
    marginRight: 0
  },
  RootContainer: {},
  Text_Explainer: {
    textAlign: 'center',
    width: '100%',
    alignItems: 'flex-start',
    alignSelf: 'center'
  }
});

export default withTheme(IconExplainScreen);
