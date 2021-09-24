import React from 'react';
import { shallow } from 'enzyme';
import { TouchableOpacity } from 'react-native';
import { FeedbackWidget } from '../FeedbackWidget';
import { dozy_theme } from '../../config/Themes';

describe('FeedbackWidget', () => {
  it('should match the snapshot', () => {
    const component = shallow(<FeedbackWidget theme={dozy_theme} />);
    expect(component).toMatchSnapshot();
  });

  it('should call onSubmit function when rate is not 0', () => {
    const rate = 1;
    const onSubmit = jest.fn(() => rate);
    const component = shallow(
      <FeedbackWidget rate={rate} theme={dozy_theme} onSubmit={onSubmit} />,
    );

    expect(onSubmit).not.toHaveBeenCalled();

    component.find(TouchableOpacity).first().props().onPress();

    expect(onSubmit.mock.calls.length).toBe(1);
    expect(component.find(TouchableOpacity).first().props().onPress()).toBe(
      rate,
    );
  });

  it('should disable the submit button if rate is 0', () => {
    const rate = 0;
    const component = shallow(
      <FeedbackWidget rate={rate} theme={dozy_theme} />,
    );

    expect(
      component.find(TouchableOpacity).first().props().disabled,
    ).toBeTruthy();
  });
});
