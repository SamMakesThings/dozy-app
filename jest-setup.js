import mockExpoConstants from './__mocks__/expo-constants.mock';
import mockReactNative from './__mocks__/react-native.mock';

jest.mock('expo-constants', () => mockExpoConstants);
jest.doMock('react-native', () => mockReactNative);
jest.mock('@react-native-google-signin/google-signin', () => {});
