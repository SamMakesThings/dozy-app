import React from 'react';
import { StyleSheet, Text } from 'react-native';
import { withTheme, ScreenContainer, Container } from '@draftbit/ui';
import BottomNavButtons from './BottomNavButtons';

const MultiButtonScreen = (props) => {
  const { theme } = props;

  return (
    <ScreenContainer
      hasSafeArea={true}
      scrollable={false}
      style={styles.Root_ne0}
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
        <Text
          style={[
            styles.Text_npp,
            theme.typography.headline5,
            {
              color: theme.colors.secondary
            }
          ]}
        >
          {props.questionLabel}
        </Text>
      </Container>
      <BottomNavButtons
        theme={theme}
        bottomBackButton={
          props.bottomBackButton ? props.bottomBackButton : null
        }
        buttonValues={props.buttonValues}
        onlyBackButton
        onQuestionSubmit={props.onQuestionSubmit}
      />
    </ScreenContainer>
  );
};

const styles = StyleSheet.create({
  Container_n8l: {
    width: '100%',
    justifyContent: 'center',
    alignItems: 'center'
  },
  View_HeaderContainer: {
    width: '100%',
    height: '10%',
    justifyContent: 'space-between',
    flexDirection: 'row',
    marginTop: 20
  },
  View_ButtonsContainer: {
    flex: 5,
    justifyContent: 'space-around'
  },
  View_ContentContainer: {
    flex: 3,
    justifyContent: 'center',
    marginTop: 20
  },
  Root_ne0: {
    justifyContent: 'space-between'
  },
  Text_npp: {
    textAlign: 'center',
    width: '100%',
    alignItems: 'flex-start',
    alignSelf: 'center'
  }
});

export default withTheme(MultiButtonScreen);
