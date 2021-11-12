import React from 'react';
import {
  StyleProp,
  StyleSheet,
  Text,
  View,
  ViewStyle,
  TextProps,
} from 'react-native';
import { withTheme, ScreenContainer, Container } from '@draftbit/ui';
import { scale } from 'react-native-size-matters';
import BottomNavButtons from '../BottomNavButtons';
import { Theme } from '../../types/theme';

interface Props {
  theme: Theme;
  flexibleLayout?: boolean;
  textLabel?: string | React.ReactElement<TextProps>;
  titleLabel?: string;
  onQuestionSubmit?: (value?: string) => void;
  buttonLabel?: string;
  bottomBackButtonLabel?: string;
  bottomGreyButtonLabel?: string;
  bottomBackButton?: () => void;
  bbbDisabled?: boolean;
  onlyBackButton?: boolean;
  style?: StyleProp<ViewStyle>;
  contentContainerStyle?: StyleProp<ViewStyle>;
}

// General use wizard screen layout. Pass images, charts, etc as a child
// By default uses a kinda fixed layout for consistency. For screens with
// lots of content, add the prop 'flexibleLayout' for maximum flex
const WizardContentScreen: React.FC<Props> = (props) => {
  const { theme } = props;

  return (
    <ScreenContainer hasSafeArea={true} scrollable={false} style={props.style}>
      <Container
        style={[
          styles.View_ContentContainer,
          props.flexibleLayout
            ? styles.flexibleLayoutContainer
            : styles.container,
        ]}
        elevation={0}
        useThemeGutterPadding={true}
      >
        <View
          style={props.flexibleLayout ? styles.flexibleContent : styles.content}
        />
        <View
          style={[
            styles.View_HeroContainer,
            !props.flexibleLayout && styles.heroContainer,
            props.contentContainerStyle,
          ]}
        >
          {props.children}
        </View>
        {!!(props.titleLabel || props.textLabel) && (
          <View
            style={[
              styles.View_TextContainer,
              !props.flexibleLayout && styles.textContainer,
            ]}
          >
            {!!props.titleLabel && (
              <Text
                style={[
                  styles.Text_Explainer,
                  theme.typography.headline5,
                  {
                    color: theme.colors.secondary,
                    marginBottom: scale(10),
                  },
                ]}
              >
                {props.titleLabel}
              </Text>
            )}
            <Text
              style={[
                styles.Text_Explainer,
                styles.textLabel,
                theme.typography.body1,
                {
                  color: theme.colors.secondary,
                },
              ]}
            >
              {props.textLabel}
            </Text>
          </View>
        )}
      </Container>
      <BottomNavButtons
        onPress={
          props.onQuestionSubmit as (value?: string | number | boolean) => void
        }
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
    justifyContent: 'center',
  },
  View_ContentContainer: {
    flex: 1,
    alignItems: 'center',
  },
  View_TextContainer: {
    width: '90%',
  },
  Text_Explainer: {
    textAlign: 'left',
    alignItems: 'flex-start',
  },
  container: {
    justifyContent: 'center',
  },
  flexibleLayoutContainer: {
    justifyContent: 'space-around',
  },
  content: {
    flex: 1,
  },
  flexibleContent: {
    height: scale(20),
  },
  heroContainer: {
    flex: 5,
  },
  textContainer: {
    flex: 3,
  },
  textLabel: {
    marginBottom: 10,
  },
});

export default withTheme<Props, React.FC<Props>>(WizardContentScreen);
