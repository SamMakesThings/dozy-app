import React from 'react';
import { shallow } from 'enzyme';
import { FeedbackPopupModal } from '../FeedbackPopupModal';
import { dozy_theme } from '../../config/Themes';

describe('FeedbackPopupModal', () => {
  it('should match the snapshot', () => {
    const component = shallow(<FeedbackPopupModal theme={dozy_theme} />);
    expect(component).toMatchSnapshot();
  });
});
