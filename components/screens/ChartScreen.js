import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { withTheme, ScreenContainer, Container } from '@draftbit/ui';
import { VictoryChart, VictoryTheme, VictoryLine } from 'victory-native';
import BottomNavButtons from '../BottomNavButtons';

// Wizard screen with a hero image (usually icon) and paragraph text
const ChartScreen = (props) => {
  const { theme } = props;

  // DELETE ME: Sample data for Victory js
  const data = [
    { quarter: 1, earnings: 13000 },
    { quarter: 2, earnings: 16500 },
    { quarter: 3, earnings: 14250 },
    { quarter: 4, earnings: 19000 }
  ];

  const sleepLogs = props.sleepLogs;
  console.log(sleepLogs);

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
      ></Container>
      <Container
        style={styles.View_ContentContainer}
        elevation={0}
        useThemeGutterPadding={true}
      >
        <View style={{ flex: 1 }} />
        <View style={styles.View_ImageContainer}>
          <VictoryChart width={350} theme={VictoryTheme.material}>
            <VictoryLine
              data={sleepLogs}
              x="upTime"
              y="sleepEfficiency"
              style={{
                data: {
                  stroke: theme.colors.primary,
                  strokeWidth: 6,
                  strokeLinejoin: 'round'
                }
              }}
            />
          </VictoryChart>
        </View>
        <Text
          style={[
            styles.Text_Explainer,
            theme.typography.body1,
            {
              color: theme.colors.secondary,
              flex: props.longText ? null : 3,
              marginBottom: 10
            }
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
  }
});

export default withTheme(ChartScreen);
