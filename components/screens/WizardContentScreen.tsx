import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { withTheme, ScreenContainer, Container } from '@draftbit/ui';
import { scale } from 'react-native-size-matters';
import BottomNavButtons from '../BottomNavButtons';
import { Theme } from '../../types/theme';

interface Props {
  theme: Theme;
  flexibleLayout?: boolean;
  textLabel: string | JSX.Element;
  titleLabel?: string;
  onQuestionSubmit: Function;
  buttonLabel?: string;
  bottomBackButtonLabel?: string;
  bottomGreyButtonLabel?: string;
  bottomBackButton?: Function;
  bbbDisabled?: boolean;
  onlyBackButton?: boolean;
}

// General use wizard screen layout. Pass images, charts, etc as a child
// By default uses a kinda fixed layout for consistency. For screens with
// lots of content, add the prop 'flexibleLayout' for maximum flex
const WizardContentScreen: React.FC<Props> = (props) => {
  const { theme } = props;

  return (
    <ScreenContainer hasSafeArea={true} scrollable={false}>
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
            flex: props.flexibleLayout ? undefined : 1,
            height: props.flexibleLayout ? scale(20) : undefined
          }}
        />
        <View
          style={{
            ...styles.View_HeroContainer,
            flex: props.flexibleLayout ? undefined : 5
          }}
        >
          {props.children}
        </View>
        <View
          style={{
            ...styles.View_TextContainer,
            flex: props.flexibleLayout ? undefined : 3
          }}
        >
          {props.titleLabel && (
            <Text
              style={[
                styles.Text_Explainer,
                theme.typography.headline5,
                {
                  color: theme.colors.secondary,
                  marginBottom: scale(10)
                }
              ]}
            >
              {props.titleLabel}
            </Text>
          )}
          <Text
            style={[
              styles.Text_Explainer,
              theme.typography.body1,
              {
                color: theme.colors.secondary,
                marginBottom: 10
              }
            ]}
          >
            {props.textLabel}
          </Text>
        </View>
      </Container>
      <BottomNavButtons
        onPress={props.onQuestionSubmit}
        buttonLabel={props.buttonLabel}
        bottomGreyButtonLabel={props.bottomGreyButtonLabel}
        bottomBackButton={props.bottomBackButton}
        bottomBackButtonLabel={props.bottomBackButtonLabel}
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
    flex: 5,
    alignItems: 'center'
  },
  View_TextContainer: {
    width: '90%'
  },
  Text_Explainer: {
    textAlign: 'left',
    alignItems: 'flex-start'
  }
});

export default withTheme(WizardContentScreen);
