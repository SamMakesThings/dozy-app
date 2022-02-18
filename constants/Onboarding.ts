export interface OnboardingMeta {
  version: 'A' | 'B';
  steps: string[];
}

const onboarding: { defaultSteps: OnboardingMeta } = {
  defaultSteps: {
    version: 'A',
    steps: [''],
  },
};

export default onboarding;
