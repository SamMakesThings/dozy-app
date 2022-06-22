export interface OnboardingMeta {
  version: 'A' | 'B';
  steps: string[];
}

export const ISIquestionSubtitle =
  'Please rate the current severity (i.e. last 2 weeks) of your insomnia problem(s)';

const onboarding: { defaultSteps: OnboardingMeta } = {
  defaultSteps: {
    version: 'A',
    steps: [''],
  },
};

export default onboarding;
