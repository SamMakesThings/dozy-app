import React from "react"
import { StyleSheet, Text, Platform, View } from "react-native"
import {
  withTheme,
  ScreenContainer,
  Container,
  IconButton,
  ProgressBar,
  TextField,
  Button,
  Icon,
  ThemeProvider,
} from "@draftbit/ui"
import '@firebase/firestore';
import { Entypo } from '@expo/vector-icons';
import Intl from 'intl';

if (Platform.OS === 'android') {
  require('intl/locale-data/jsonp/en-US');
  require('intl/locale-data/jsonp/tr-TR');
  require('date-time-format-timezone');
  Intl.__disableRegExpRestore();/*For syntaxerror invalid regular expression unmatched parentheses*/
}

const TagSelectScreen = props => {
    // Setup component state
    const [selectedTags, setSelectedTags] = React.useState([]);
    const [notes, setNotes] = React.useState("");

    const { theme } = props
    return (
        <ScreenContainer hasSafeArea={true} scrollable={false} style={styles.Root_nb1}>
            <Container style={styles.Container_nof} elevation={0} useThemeGutterPadding={true}>
                <IconButton
                    style={styles.IconButton_n9u}
                    icon="Ionicons/md-arrow-back"
                    size={32}
                    color={theme.colors.secondary}
                    onPress={() => {
                    props.navigation.goBack()
                    }}
                />
                <Container style={styles.Container_nuv} elevation={0} useThemeGutterPadding={true}>
                    <ProgressBar
                    style={{...styles.ProgressBar_nn5, ...{display: props.progressBar ? 'flex' : 'none'}}}
                    color={theme.colors.primary}
                    progress={props.progressBarPercent}
                    borderWidth={0}
                    borderRadius={10}
                    animationType="spring"
                    unfilledColor={theme.colors.medium}
                    />
                </Container>
            </Container>
            <Container style={styles.Container_n8t} elevation={0} useThemeGutterPadding={true}>
                <Text
                    style={[
                    styles.Text_nqt,
                    theme.typography.headline5,
                    {
                        color: theme.colors.secondary
                    }
                    ]}
                >
                    {props.questionLabel}
                </Text>
                <View style={{flex: 4}}>
                    <View>
                        <View style={{
                            borderWidth: 2,
                            borderRadius: 100,
                            borderColor: '#ffffff',
                            width: 75,
                            height: 75,
                            justifyContent: 'center',
                            alignItems: 'center'
                        }}>
                            <Entypo name="sound" size={42} color={theme.colors.primary} />
                        </View>
                        <Text style={{textAlign: 'center'}}>noise</Text>
                    </View>
                </View>
                <TextField
                    style={styles.TextField_no0}
                    type="underline"
                    label={props.inputLabel}
                    keyboardType="default"
                    leftIconMode="inset"
                    onChangeText={value => setNotes(value)}
                    onSubmitEditing={()=>{
                        props.onFormSubmit({notes: notes})
                    }}
                />
            </Container>
            <Container style={styles.Container_nmw} elevation={0} useThemeGutterPadding={true}>
                <Button
                    style={styles.Button_n5c}
                    type="solid"
                    onPress={() => {
                        props.onFormSubmit({notes: notes})
                    }}
                    color={theme.colors.primary}
                >
                    Finish
                </Button>
            </Container>
        </ScreenContainer>
    )
}

const styles = StyleSheet.create({
  Button_n5c: {
    paddingTop: 0,
    marginTop: 8
  },
  Container_n8t: {
    height: "72%",
    justifyContent: "center",
    marginTop: 20
  },
  Container_nmw: {
    height: "15%"
  },
  Container_nof: {
    width: "100%",
    height: "10%",
    justifyContent: "space-between",
    flexDirection: "row",
    marginTop: 20
  },
  Container_nuv: {
    width: "100%",
    justifyContent: "center",
    alignItems: "center"
  },
  IconButton_n9u: {
    paddingRight: 0
  },
  ProgressBar_nn5: {
    width: 250,
    height: 7,
    paddingRight: 0,
    marginRight: 0
  },
  Root_nb1: {
  },
  TextField_no0: {},
  Text_nqt: {
    textAlign: "center",
    width: "100%",
    alignItems: "flex-start",
    alignSelf: "center"
  }
})

export default withTheme(TagSelectScreen)
