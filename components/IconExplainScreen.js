import React from 'react';
import { StyleSheet, Text, Image, View } from 'react-native';
import {
  withTheme,
  ScreenContainer,
  Container,
  IconButton,
  ProgressBar,
  Button
} from '@draftbit/ui';
import { useNavigation } from '@react-navigation/native';
import UndrawBed from '../assets/images/UndrawBed.png';

const IconExplainScreen = (props) => {
  const { theme } = props;
  const navigation = useNavigation();

  return (
    <ScreenContainer
      hasSafeArea={true}
      scrollable={false}
      style={styles.Root_n3a}
    >
      <Container
        style={styles.View_HeaderContainer}
        elevation={0}
        useThemeGutterPadding={true}
      >
        <IconButton
          style={styles.IconButton_nmh}
          icon="Ionicons/md-arrow-back"
          size={32}
          color={theme.colors.secondary}
          onPress={() => {
            navigation.goBack();
          }}
        />
        <Container
          style={styles.Container_nzw}
          elevation={0}
          useThemeGutterPadding={true}
        >
          <ProgressBar
            style={{
              ...styles.ProgressBar_neb,
              ...{ display: props.progressBar ? 'flex' : 'none' }
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
        <View style={{ flex: 4 }}>
          <Image source={UndrawBed} style={styles.Image_Featured} />
        </View>
        <Text
          style={[
            styles.Text_nlz,
            theme.typography.body1,
            {
              color: theme.colors.secondary,
              flex: 2
            }
          ]}
        >
          {props.textLabel}
        </Text>
      </Container>
      <Container
        style={styles.View_ButtonContainer}
        elevation={0}
        useThemeGutterPadding={true}
      >
        <Button
          style={styles.Button_Continue}
          type="solid"
          onPress={() => {
            props.onContinue();
          }}
          color={theme.colors.primary}
        >
          {props.buttonLabel}
        </Button>
      </Container>
    </ScreenContainer>
  );
};

const styles = StyleSheet.create({
  Button_Continue: {
    paddingTop: 0,
    marginTop: 8
  },
  Image_Featured: {
    flex: 1,
    maxWidth: '80%',
    maxHeight: '80%',
    resizeMode: 'center'
  },
  View_ContentContainer: {
    height: '72%',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 20
  },
  View_HeaderContainer: {
    width: '100%',
    height: '10%',
    justifyContent: 'space-between',
    flexDirection: 'row',
    marginTop: 20
  },
  View_ButtonContainer: {
    height: '15%'
  },
  Container_nzw: {
    width: '100%',
    justifyContent: 'center',
    alignItems: 'center'
  },
  IconButton_nmh: {
    paddingRight: 0
  },
  ProgressBar_neb: {
    width: 250,
    height: 7,
    paddingRight: 0,
    marginRight: 0
  },
  Root_n3a: {},
  TextField_nw8: {},
  Text_nlz: {
    textAlign: 'center',
    width: '100%',
    alignItems: 'flex-start',
    alignSelf: 'center'
  }
});

export default withTheme(IconExplainScreen);
