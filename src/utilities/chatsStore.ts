import { create } from 'zustand';
import firestore from '@react-native-firebase/firestore';
import { Chat } from '../types/custom';

export type ChatsState = {
  chats: Chat[] | [];
  setChats: (chats: Chat[]) => void;
};

export const useChatsStore = create<ChatsState>((set) => ({
  chats: [
    {
      chatId: '',
      time: firestore.Timestamp.now(),
      message: '',
      sender: '',
      sentByUser: true,
    },
  ],
  setChats: (chats) =>
    set(() => {
      return { chats: chats };
    }),
}));
