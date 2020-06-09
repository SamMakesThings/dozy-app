import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { scale } from 'react-native-size-matters';
import { useNavigation } from '@react-navigation/native';
import { AuthContext } from '../utilities/authContext';
import { LinkCard } from './LinkCard';
import { TodoItem } from './TodoItem';
import { CardContainer } from './CardContainer';
import { slumber_theme } from '../config/Themes';
import treatments from '../constants/Treatments';

const CurrentTreatmentsCard = () => {
  const theme = slumber_theme;
  const navigation = useNavigation();
  const { state } = React.useContext(AuthContext);

  // Get the correct copy & image based on currentModule treatment code
  const { title, subTitle, image } = treatments[
    state.userData.currentTreatments.currentModule
  ];

  // Compute current module's progress percent based on dates
  const progressPercent = ~~(
    (100 *
      (state.userData.nextCheckin.checkinDatetime.toDate().getTime() -
        state.userData.currentTreatments.lastCheckinDatetime
          .toDate()
          .getTime() -
        (state.userData.nextCheckin.checkinDatetime.toDate().getTime() -
          Date.now()))) /
    (state.userData.nextCheckin.checkinDatetime.toDate().getTime() -
      state.userData.currentTreatments.lastCheckinDatetime.toDate().getTime())
  );

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
          {progressPercent}% complete
        </Text>
      </View>
      <View style={styles.View_CardContentContainer}>
        <LinkCard
          style={styles.ItemMargin}
          bgImage={image}
          titleLabel={title}
          subtitleLabel={subTitle}
          onPress={() => {
            console.log('Pressed the link card');
            navigation.navigate('TreatmentReview');
          }}
        />
        <View style={{ ...styles.ItemMargin, ...styles.View_TodoContainer }}>
          {
            // Pull todos from treatments object, map them out
            treatments[
              state.userData.currentTreatments.currentModule
            ].todos.map((todo) => {
              return <TodoItem key={todo} completed={false} label={todo} />;
            })
          }
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
