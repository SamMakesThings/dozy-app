import storage, { firebase } from '@react-native-firebase/storage';
import firestore from '@react-native-firebase/firestore';
import { Coach, CoachDTO, CoachImage, CoachImageDTO } from '../types/coach';
import Images from '../config/Images';
import CoachConstants from '../constants/Coach';

export async function getOnboardingCoach(): Promise<Coach> {
  let coach: Coach = CoachConstants.defaultCoach;
  let coachDTO: CoachDTO | undefined;
  const defaultCoachQuery = await firestore()
    .collection<CoachDTO>('coaches')
    .where('firstName', '==', 'Sam')
    .get();
  console.log('defaultCoachQuery: ', defaultCoachQuery);
  if (defaultCoachQuery.docs.length) {
    coachDTO = defaultCoachQuery.docs[0].data();
    console.log('coachDTO: ', coachDTO);
  } else {
    const coachesQuery = await firestore()
      .collection<CoachDTO>('coaches')
      .get();
    if (coachesQuery.docs.length) {
      coachDTO = coachesQuery.docs[0].data();
    }
  }
  if (coachDTO) {
    const image = await getCoachImage(coachDTO.image);
    coach = {
      ...coachDTO,
      image,
    };
  }
  console.log('coach**** ', coach);

  return coach;
}

export async function getCoachById(id: string): Promise<Coach> {
  let coach: Coach = CoachConstants.defaultCoach;
  const coachDTO = (
    await firestore().collection<CoachDTO>('coaches').doc(id).get()
  ).data();
  if (coachDTO) {
    const image = await getCoachImage(coachDTO?.image);
    coach = {
      ...coachDTO,
      image,
    };
  }

  return coach;
}

export async function getCoachImage(
  imageDTO?: CoachImageDTO,
): Promise<CoachImage> {
  let image: CoachImage = Images.SamProfile;
  if (imageDTO?.path) {
    const bucket = imageDTO.bucket
      ? firebase.app().storage(imageDTO.bucket)
      : storage();
    const url = await bucket.ref(imageDTO.path).getDownloadURL();
    if (url) {
      image = { uri: url };
    }
  }

  return image;
}

export async function getCoachByUserId(userId: string): Promise<Coach> {
  let coachId: string;
  const userData = await firestore().collection('users').doc(userId).get();
  console.log('userData: ', userData.data());

  if (userData.data()?.lastChat?.sentByUser === false) {
    coachId = userData.data()?.lastChat.sender;
  } else {
    const supportMessages = await firestore()
      .collection('users')
      .doc(userId)
      .collection('supportMessages')
      .orderBy('time', 'desc')
      .limit(100)
      .get();
    let index = 0;
    while (
      supportMessages.docs[index]?.data() &&
      supportMessages.docs[index].data().sentByUser
    ) {
      index++;
    }
    if (index < supportMessages.docs.length) {
      coachId = supportMessages.docs[index].data().sender;
    }
  }

  const coach = await getCoachById(coachId!);
  return coach;
}
