import React from 'react';
import { IChatInfo } from 'views/template/myChat/createChat';

const ChatBotContent = React.createContext<{
    chatBotInfo: IChatInfo;
    setChatBotInfo: (value: IChatInfo) => void;
} | null>(null);
ChatBotContent.displayName = 'ChatBotContent';

export const ChatBotProvider = ({ children }: { children: React.ReactElement }) => {
    const [chatBotInfo, setChatBotInfo] = React.useState<IChatInfo>({});

    return (
        <ChatBotContent.Provider
            value={{
                chatBotInfo,
                setChatBotInfo
            }}
        >
            {children}
        </ChatBotContent.Provider>
    );
};

export const useChatBot = () => {
    const context = React.useContext(ChatBotContent);
    if (!context) {
        throw new Error('useChatBot must be used within a ChatBotProvider');
    }
    return context;
};
