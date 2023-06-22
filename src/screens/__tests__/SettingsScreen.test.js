import React from 'react';
import { shallow } from 'enzyme';
import * as Application from 'expo-application';
import { findByTestID } from '../../utilities/tests';
import { SettingsScreen } from '../SettingsScreen';

describe('SettingsScreen', () => {
  it('should match the snapshot', () => {
    // Mock new Date() to get consistent date prop for <DatePicker>
    const mockDate = new Date(Date.UTC(2021, 0, 1, 0));
    const dateSpy = jest
      .spyOn(global, 'Date')
      .mockImplementation(() => mockDate);

    const component = shallow(<SettingsScreen />);
    expect(component).toMatchSnapshot();

    dateSpy.mockRestore();
  });

  it('should show the app version correctly', () => {
    const component = shallow(<SettingsScreen />);
    expect(findByTestID(component, 'appVersion').props().children).toBe(
      `@dozyapp ${Application.nativeApplicationVersion}`,
    );
  });
});
