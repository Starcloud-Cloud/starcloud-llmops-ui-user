import { create } from 'zustand';

type IChatMessage = {
    messageData: string;
    setMessageData: (messageData: string) => void;
};

export const useChatMessage = create<IChatMessage>((set) => ({
    messageData: '',
    setMessageData: (messageData: string) => set(() => ({ messageData }))
}));
