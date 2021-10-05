import React from 'react';
import { shallow } from 'enzyme';
import { TouchableOpacity, TextInput } from 'react-native';
import { FeedbackWidget } from '../FeedbackWidget';
import { dozy_theme } from '../../config/Themes';

describe('FeedbackWidget', () => {
  /* RE-ENABLE THESE ONCE COMPONENT IS WORKING AGAIN
  it('should match the snapshot', () => {
    const component = shallow(<FeedbackWidget theme={dozy_theme} />);
    expect(component).toMatchSnapshot();
  });

  it('should show the textbox when rate is not 0', async () => {
    const rate = 5;
    const component = shallow(
      <FeedbackWidget rate={rate} theme={dozy_theme} />,
    );

    expect(component.find(TextInput).exists()).toBeTruthy();
    expect(component.find(TouchableOpacity).exists()).toBeTruthy();
  });

  it('should not show the textbox if rate is 0', () => {
    const rate = 0;
    const component = shallow(
      <FeedbackWidget rate={rate} theme={dozy_theme} />,
    );

    expect(component.find(TextInput).exists()).toBeFalsy();
    expect(component.find(TouchableOpacity).exists()).toBeFalsy();
  }); */
});
