import React from 'react';
import { StyleSheet, Text } from 'react-native';
import { withTheme, ScreenContainer, Container, Button } from '@draftbit/ui';
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
        style={styles.Container_nux}
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
      <Container
        style={[
          styles.View_ButtonsContainer,
          {
            maxHeight: 50 + props.buttonValues.length * 50,
            marginBotton: props.onlyBackButton ? 0 : 10
          }
        ]}
        elevation={0}
        useThemeGutterPadding={true}
      >
        {props.buttonValues.map((val) => {
          const { label, value, solidColor } = val;
          return (
            <Button
              key={value}
              style={styles.Button_nu5}
              type={solidColor ? 'solid' : 'outline'}
              color={solidColor ? theme.colors.primary : theme.colors.secondary}
              loading={false}
              disabled={false}
              onPress={() => {
                props.onQuestionSubmit(value);
              }}
            >
              {label}
            </Button>
          );
        })}
      </Container>
      <BottomNavButtons
        theme={theme}
        bottomBackButton={
          props.bottomBackButton ? props.bottomBackButton : null
        }
        onlyBackButton
      />
    </ScreenContainer>
  );
};

const styles = StyleSheet.create({
  Button_nu5: {},
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
  Container_nux: {
    flex: 3,
    justifyContent: 'center',
    marginTop: 20
  },
  IconButton_not: {
    paddingRight: 0
  },
  ProgressBar_nj7: {
    width: 250,
    height: 7,
    paddingRight: 0,
    marginRight: 0
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
