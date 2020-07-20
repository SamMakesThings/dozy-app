import Images from '../config/Images';

// Copy and image information for treatment modules
// Used to keep things consistent across the app.
// Make sure to add any new modules here.
export default {
  BSL: {
    title: 'Baseline collection',
    subTitle: 'Gathering data for custom treatment',
    image: Images.WomanInBed,
    todos: ['Record 7 nights of sleep in your sleep diary'],
    url: 'https://dozy.customerly.help/collecting-a-baseline-of-sleep-data/'
  },
  SCTSRT: {
    title: 'Stimulus Control Therapy and SRT',
    subTitle: 'Doing things to things',
    image: Images.WomanInBed,
    todos: [
      'Stick to your target sleep schedule',
      'Do nothing in bed besides sleeping (no phone!)',
      'If awake for 15+ mins, get up and return later'
    ],
    url: 'https://dozy.customerly.help/collecting-a-baseline-of-sleep-data/'
  }
};
