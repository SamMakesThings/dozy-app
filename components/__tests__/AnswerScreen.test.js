import React from 'react';
import { shallow } from 'enzyme';
import { AnswerScreen } from '../screens/AnswerScreen';
import { dozy_theme } from '../../config/Themes';

describe('AnswerScreen', () => {
  it('should match the snapshot', () => {
    const component = shallow(
      <AnswerScreen
        theme={dozy_theme}
        faq={{
          id: '1',
          question: { content: 'Question', type: 'plain_text' },
          answer: { content: 'Answer', type: 'plain_text' },
        }}
      />,
    );
    expect(component).toMatchSnapshot();
  });
});
