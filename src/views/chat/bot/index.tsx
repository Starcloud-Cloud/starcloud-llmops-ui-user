import { getChatDetail } from 'api/chat/share';
import { useEffect, useMemo, useState } from 'react';
import { IChatInfo } from 'views/template/myChat/createChat';
import { Chat } from 'views/template/myChat/createChat/components/Chat';
import { useParams } from 'react-router-dom';

const chatBot = () => {
    const { mediumUid } = useParams(); // 获取

    const url = window.location.href;
    const pattern = /\/([^/]+)\/[^/]+$/;
    const match = url.match(pattern);

    const extractedPart = (match && match[1]) || '';

    const statisticsMode = useMemo(() => {
        switch (extractedPart) {
            case 'cb_i':
                return 'chat';
            case 'cb_js':
                return 'chatbot';
            case 'cb_web':
                return 'chatbot-iframe';
            default:
                return '';
        }
    }, [extractedPart]);

    const [chatBotInfo, setChatBotInfo] = useState<IChatInfo>({
        guideList: ['', '']
    });

    useEffect(() => {
        if (mediumUid) {
            (async () => {
                const res = await getChatDetail(mediumUid);
                setChatBotInfo({
                    ...chatBotInfo,
                    enableStatement: true,
                    name: res.name,
                    avatar: res?.images?.[0],
                    introduction: res.description, // 简介
                    enableIntroduction: res.chatConfig?.description?.enabled,
                    statement: res.chatConfig?.openingStatement.statement,
                    prePrompt: res.chatConfig.prePrompt,
                    temperature: res.chatConfig.modelConfig?.completionParams?.temperature,
                    defaultImg: res?.images?.[0],
                    enableSearchInWeb: res.chatConfig?.webSearchConfig?.enabled,
                    searchInWeb: res.chatConfig?.webSearchConfig?.webScope
                });
            })();
        }
    }, []);

    return (
        <div className="h-[100vh]">
            <Chat chatBotInfo={chatBotInfo} mode={'iframe'} mediumUid={mediumUid} />
        </div>
    );
};

export default chatBot;
