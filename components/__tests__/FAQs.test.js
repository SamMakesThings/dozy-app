import React from 'react';
import { shallow } from 'enzyme';
import { FAQs } from '../FAQs';
import { dozy_theme } from '../../config/Themes';

describe('FAQs', () => {
  it('should match the snapshot', () => {
    const component = shallow(
      <FAQs
        theme={dozy_theme}
        title="What would you like to know?"
        questions={[
          { question: 'question 1', answer: 'answer 1' },
          { question: 'question 2', answer: 'answer 2' },
          { question: 'question 3', answer: 'answer 3' },
          { question: 'question 4', answer: 'answer 4' },
        ]}
      />,
    );

    expect(component).toMatchSnapshot();
  });
});
