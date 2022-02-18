import React from 'react';
import { shallow } from 'enzyme';
import MonoText from '../StyledText';

describe('StyledText', () => {
  it('should match the snapshot', () => {
    const component = shallow(<MonoText>Snapshot test!</MonoText>);
    expect(component).toMatchSnapshot();
  });
});
