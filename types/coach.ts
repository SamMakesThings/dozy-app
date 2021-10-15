import { ImageSourcePropType } from 'react-native';

export type CoachImage = ImageSourcePropType;

export interface Coach {
  id: string; // This id is matched to /coaches/{id}
  firstName: string;
  lastName: string;
  title?: string;
  image?: CoachImage;
  expoPushToken: string;
}

export interface CoachImageDTO {
  bucket?: string; // Bucket name in the storage
  path: string; // Image path in the storage
}

export interface CoachDTO extends Omit<Coach, 'image'> {
  image?: CoachImageDTO;
}
