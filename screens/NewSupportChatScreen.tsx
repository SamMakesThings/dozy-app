import React from 'react';
import {
  StyleSheet,
  Text,
  View,
  ActivityIndicator,
  SafeAreaView
} from 'react-native';
import { scale } from 'react-native-size-matters';
import { AuthContext } from '../utilities/authContext';
import { dozy_theme } from '../config/Themes';
import { Navigation } from '../types/custom';

export const NewSupportChatScreen: React.FC<{ navigation: Navigation }> = ({
  navigation
}) => {
  const theme = dozy_theme;
  const { state } = React.useContext(AuthContext);

  // If state is available, show screen. Otherwise, show loading indicator.
  if (state.sleepLogs && state.userData?.currentTreatments) {
    return (
      <SafeAreaView style={styles.SafeAreaView}>
        <View style={styles.Root}>
          <View style={styles.View_HeaderContainer}>
            <Text>Sam Stowers</Text>
          </View>
          <View style={styles.View_ContentContainer}>
            <Text>test</Text>
          </View>
        </View>
      </SafeAreaView>
    );
  } else {
    // If sleep logs haven't loaded, show indicator
    return (
      <View>
        <ActivityIndicator
          size="large"
          color={theme.colors.primary}
          style={{
            width: scale(45),
            height: scale(45),
            marginTop: '45%',
            alignSelf: 'center'
          }}
        />
      </View>
    );
  }
};

const styles = StyleSheet.create({
  Root: {
    marginTop: scale(20),
    paddingBottom: scale(25),
    flex: 1,
    backgroundColor: dozy_theme.colors.background
  },
  SafeAreaView: {
    backgroundColor: dozy_theme.colors.medium,
    flex: 1
  },
  View_HeaderContainer: {
    backgroundColor: dozy_theme.colors.medium
  },
  ItemMargin: {
    marginTop: scale(10)
  },
  View_ContentContainer: {
    justifyContent: 'flex-start',
    alignItems: 'flex-start',
    paddingHorizontal: scale(10)
  }
});

export default NewSupportChatScreen;
