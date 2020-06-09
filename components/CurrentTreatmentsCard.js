import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { scale } from 'react-native-size-matters';
import { AuthContext } from '../utilities/authContext';
import { LinkCard } from './LinkCard';
import { TodoItem } from './TodoItem';
import { CardContainer } from './CardContainer';
import { slumber_theme } from '../config/Themes';
import Images from '../config/Images';

const CurrentTreatmentsCard = () => {
  const theme = slumber_theme;
  const { state } = React.useContext(AuthContext);
  return (
    <CardContainer>
      <View style={styles.View_CardHeaderContainer}>
        <Text
          style={{
            ...theme.typography.cardTitle,
            ...styles.Text_CardTitle
          }}
        >
          In progress
        </Text>
        <Text
          style={{
            ...theme.typography.cardTitle,
            ...styles.Text_RightSubHeader
          }}
        >
          50% complete
        </Text>
      </View>
      <View style={styles.View_CardContentContainer}>
        <LinkCard
          style={styles.ItemMargin}
          bgImage={Images.WomanInBed}
          titleLabel={
            state.userData.currentTreatments
              .currentModule /*"Stimulus Control Therapy & SRT"*/
          }
          subtitleLabel="Training your brain to sleep in bed"
          onPress={() => console.log('Pressed the link card')}
        />
        <View style={{ ...styles.ItemMargin, ...styles.View_TodoContainer }}>
          <TodoItem
            completed={false}
            label="Record 7 nights of sleep in your sleep diary"
          />
        </View>
      </View>
    </CardContainer>
  );
};

const styles = StyleSheet.create({
  ItemMargin: {
    marginTop: scale(10)
  },
  View_ContentContainer: {
    justifyContent: 'flex-start',
    alignItems: 'center'
  },
  View_CardHeaderContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center'
  },
  View_CenteredRowContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingTop: scale(5)
  },
  View_TimeContainer: {
    marginTop: scale(8)
  },
  View_NoCard: {
    width: '92%',
    marginTop: scale(15),
    marginBottom: scale(15)
  },
  Text_CardTitle: {
    color: slumber_theme.colors.secondary
  },
  Text_RightSubHeader: {
    fontFamily: 'RubikRegular',
    fontSize: scale(17),
    color: slumber_theme.colors.secondary,
    opacity: 0.5
  },
  Text_CardSubtitle: {
    color: slumber_theme.colors.secondary,
    opacity: 0.5,
    marginTop: scale(-5)
  },
  Text_Time: {
    textAlign: 'center',
    fontSize: scale(20),
    color: slumber_theme.colors.secondary
  },
  Text_TimeLabel: {
    textAlign: 'center',
    fontSize: scale(12),
    color: slumber_theme.colors.secondary,
    opacity: 0.5,
    marginTop: scale(-6)
  },
  ProgressBar: {
    width: scale(185)
  },
  Icon_Clipboard: {
    margin: scale(20)
  }
});

export default CurrentTreatmentsCard;
