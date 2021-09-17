import React from 'react';
import { shallow } from 'enzyme';
import { View } from 'react-native';
import ProgressBar from '../ProgressBar';

describe('ProgressBar', () => {
  it('should match the snapshot', () => {
    const component = shallow(<ProgressBar progress={0.1} />);
    expect(component).toMatchSnapshot();
  });

  it('should render the progress correctly', () => {
    const progress = 0.1;
    const component = shallow(<ProgressBar progress={progress} />);
    expect(
      component.find(View).first().childAt(0).childAt(0).props().style,
    ).toMatchObject({ flex: progress });
  });
});
