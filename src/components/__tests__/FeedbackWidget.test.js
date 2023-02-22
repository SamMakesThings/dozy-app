import React from 'react';
import { shallow } from 'enzyme';
import { FeedbackWidget } from '../FeedbackWidget';
import { dozy_theme } from '../../config/Themes';
import { findByTestID } from '../../utilities/tests';

describe('FeedbackWidget', () => {
  it('should match the snapshot', () => {
    const component = shallow(<FeedbackWidget theme={dozy_theme} rate={5} />);
    expect(component).toMatchSnapshot();
  });

  it('should show the footer when the feedbak is not submitted', async () => {
    const component = shallow(
      <FeedbackWidget submitted={false} theme={dozy_theme} />,
    );

    expect(findByTestID(component, 'Footer').exists()).toBeTruthy();
  });

  it('should not show the footer when the feedback is submitted, but show the thanks text', () => {
    const component = shallow(<FeedbackWidget submitted theme={dozy_theme} />);

    expect(findByTestID(component, 'Footer').exists()).toBeFalsy();
    expect(findByTestID(component, 'Thanks').exists()).toBeTruthy();
  });
});
