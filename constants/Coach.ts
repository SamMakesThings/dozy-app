import { Coach } from '../types/coach';
import Images from '../config/Images';

const defaultCoach: Coach = {
  firstName: 'Sam',
  lastName: 'Stowers',
  title: 'Founder & Sleep Coach',
  id: '',
  image: Images.SamProfile,
};

export default {
  defaultCoach,
};
