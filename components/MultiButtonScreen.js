import React from "react"
import { StyleSheet, Text } from "react-native"
import {
  withTheme,
  ScreenContainer,
  Container,
  IconButton,
  ProgressBar,
  Button
} from "@draftbit/ui"

const MultiButtonScreen = props => {
    const { theme } = props;
    return (
        <ScreenContainer hasSafeArea={true} scrollable={false} style={styles.Root_ne0}>
            <Container style={styles.Container_n9i} elevation={0} useThemeGutterPadding={true}>
                <IconButton
                    style={styles.IconButton_not}
                    icon="Ionicons/md-arrow-back"
                    size={32}
                    color={theme.colors.secondary}
                    onPress={() => {
                    props.navigation.goBack()
                    }}
                />
                <Container style={styles.Container_n8l} elevation={0} useThemeGutterPadding={true}>
                    <ProgressBar
                    style={{...styles.ProgressBar_nj7, ...{display: props.progressBar ? 'flex' : 'none'}}}
                    color={theme.colors.primary}
                    progress={props.progressBarPercent}
                    borderWidth={0}
                    borderRadius={10}
                    animationType="spring"
                    unfilledColor={theme.colors.medium}
                    />
                </Container>
            </Container>
            <Container style={styles.Container_nux} elevation={0} useThemeGutterPadding={true}>
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
            <Container style={[styles.Container_nh7, {maxHeight: 50+(props.buttonValues.length * 50)}]} elevation={0} useThemeGutterPadding={true}>
                {props.buttonValues.map(val => {
                    const label = val.label;
                    const value = val.value;
                    return (
                        <Button 
                            key={value}
                            style={styles.Button_nu5}
                            type="outline"
                            color={theme.colors.secondary}
                            loading={false}
                            disabled={false}
                            onPress={() => {
                                props.onQuestionSubmit(value);
                            }}>
                            {label}
                        </Button>
                    )
                })}
            </Container>
        </ScreenContainer>
    )
}

const styles = StyleSheet.create({
  Button_nu5: {},
  Container_n8l: {
    width: "100%",
    justifyContent: "center",
    alignItems: "center"
  },
  Container_n9i: {
    width: "100%",
    height: "10%",
    justifyContent: "space-between",
    flexDirection: "row",
    marginTop: 20
  },
  Container_nh7: {
    flex: 5,
    justifyContent: "space-around",
    marginBottom: 10
  },
  Container_nux: {
    flex: 3,
    justifyContent: "center",
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
    justifyContent: "space-between",
  },
  Text_npp: {
    textAlign: "center",
    width: "100%",
    alignItems: "flex-start",
    alignSelf: "center"
  }
})

export default withTheme(MultiButtonScreen)
