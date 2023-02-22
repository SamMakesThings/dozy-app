import { StyleProp, TextStyle } from 'react-native';

export interface RichTextSnip {
  text: string;
  style?: StyleProp<TextStyle>;
  onPress?: () => void;
}

export type RichTextData = RichTextSnip[];
