import { create } from 'zustand';
import { Chat } from '../types/custom';

export type ChatsState = {
  chats: Chat[];
  setChats: (chats: Chat[]) => void;
};

export const useChatsStore = create<ChatsState>((set) => ({
  chats: [],
  setChats: (chats) =>
    set(() => {
      return { chats: chats };
    }),
}));
