import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { withTheme, ScreenContainer, Container } from '@draftbit/ui';
import { scale } from 'react-native-size-matters';
import BottomNavButtons from '../BottomNavButtons';

// General use wizard screen layout. Pass images, charts, etc as a child
// By default uses a kinda fixed layout for consistency. For screens with
// lots of content, add the prop 'flexibleLayout' for maximum flex
const WizardContentScreen = (props) => {
  const { theme } = props;

  return (
    <ScreenContainer
      hasSafeArea={true}
      scrollable={false}
      style={styles.RootContainer}
    >
      <Container
        style={{
          ...styles.View_ContentContainer,
          justifyContent: props.flexibleLayout ? 'space-around' : 'center'
        }}
        elevation={0}
        useThemeGutterPadding={true}
      >
        <View
          style={{
            ...styles.View_TopPadding,
            flex: props.flexibleLayout ? null : 1,
            height: props.flexibleLayout ? scale(100) : null
          }}
        />
        <View
          style={{
            ...styles.View_HeroContainer,
            flex: props.flexibleLayout ? null : 5
          }}
        >
          {props.children}
        </View>
        <Text
          style={[
            styles.Text_Explainer,
            theme.typography.body1,
            {
              color: theme.colors.secondary,
              flex: props.flexibleLayout ? null : 3,
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
  View_HeroContainer: {
    justifyContent: 'center'
  },
  View_ContentContainer: {
    flex: 1,
    alignItems: 'center'
  },
  Text_Explainer: {
    textAlign: 'left',
    width: '90%',
    alignItems: 'flex-start',
    alignSelf: 'center'
  }
});

export default withTheme(WizardContentScreen);
