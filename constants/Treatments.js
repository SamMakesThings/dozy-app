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
    url: 'https://dozy.customerly.help/collecting-a-baseline-of-sleep-data/',
    optional: false
  },
  SCTSRT: {
    title: 'Stimulus Control Therapy and SRT',
    subTitle: 'Train your brain to sleep in bed',
    image: Images.WomanInBed,
    todos: [
      'Stick to your target sleep schedule',
      'Do nothing in bed besides sleeping (no phone!)',
      'If awake for 15+ mins, get up and return later'
    ],
    url: 'https://dozy.customerly.help/collecting-a-baseline-of-sleep-data/',
    optional: false
  },
  RLX: {
    title: 'Relaxation Training & PMR',
    subTitle: 'Relax the muscles to relax the mind',
    image: Images.WomanInBed,
    todos: [
      'Practice PMR once during the day',
      'Use PMR before trying to sleep'
    ],
    url: 'https://dozy.customerly.help',
    optional: false
  },
  PIT: {
    title: 'Paradoxical Intention Therapy (PIT)',
    subTitle: 'To sleep, stop trying to sleep',
    image: Images.WomanInBed,
    todos: ['Practice not trying to fall asleep when in bed'],
    url: 'https://dozy.customerly.help',
    optional: false
  },
  COG1: {
    title: 'Harmful Beliefs About Sleep',
    subTitle: 'Finding and fixing harmful perspectives',
    image: Images.WomanInBed,
    todos: ['Notice harmful thoughts and replace with healthy ones'],
    url: 'https://dozy.customerly.help',
    optional: false
  },
  COG2: {
    title: 'Revisiting Harmful Beliefs About Sleep',
    subTitle: "Checking the progress you've made",
    image: Images.WomanInBed,
    todos: ['Notice harmful thoughts and replace with healthy ones'],
    url: 'https://dozy.customerly.help',
    optional: false
  },
  HYG: {
    title: 'Fixing Sleep Hygiene',
    subTitle: 'Improving sleep duration & quality',
    image: Images.WomanInBed,
    todos: ['Improve sleep hygiene'],
    url: 'https://dozy.customerly.help',
    optional: false
  },
  END: {
    title: 'Maintaining Sleep Improvements',
    subTitle: 'Strategies to prevent insomnia recurring',
    image: Images.WomanInBed,
    todos: ['Nothing to do!'],
    url: 'https://dozy.customerly.help',
    optional: false
  },
  FIX: {
    title: 'Sticking To The Schedule',
    subTitle: 'Getting you on the path to improved sleep',
    image: Images.WomanInBed,
    todos: ['Stick to the target sleep schedule'],
    url: 'https://dozy.customerly.help',
    optional: true
  },
  JET: {
    title: 'Fighting Jet Lag',
    subTitle: 'For travelers',
    image: Images.WomanInBed,
    todos: ['Take melatonin before trip to prepare'],
    url: 'https://dozy.customerly.help',
    optional: true
  }
};
