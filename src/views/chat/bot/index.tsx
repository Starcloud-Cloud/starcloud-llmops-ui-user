import { getChatDetail, getChatDetailList } from 'api/chat/share';
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
                return 'SHARE_IFRAME';
            case 'cb_js':
                return 'SHARE_JS';
            case 'cb_web':
                return 'SHARE_WEB';
            default:
                return '';
        }
    }, [extractedPart]);

    const [chatBotInfo, setChatBotInfo] = useState<IChatInfo>({
        guideList: ['', '']
    });
    const [mUid, setMUid] = useState('');
    const [showSelect, setShowSelect] = useState(false);
    const [list, setList] = useState<any[]>([]);

    useEffect(() => {
        if (mediumUid) {
            const result = mediumUid?.split('|');
            if (result.length > 1) {
                setMUid(result[0]);
                doFetchDetailList(result);
                setShowSelect(true);
            } else {
                setMUid(mediumUid);
                setShowSelect(false);
            }
        }
    }, [mediumUid]);

    const doFetchDetailList = async (mediumUids: any) => {
        const data = await getChatDetailList({ mediumUids: mediumUids });
        const resultArray = [];

        for (const key in data) {
            if (data.hasOwnProperty(key)) {
                const value = data[key];
                resultArray.push({ k: value.name, v: key });
            }
        }

        setList(resultArray);
    };

    useEffect(() => {
        if (mUid) {
            (async () => {
                const res = await getChatDetail(mUid);
                setChatBotInfo({
                    name: res.name,
                    avatar: res?.images?.[0],
                    introduction: res.description, // 简介
                    enableIntroduction: res.chatConfig?.description?.enabled,
                    statement: res.chatConfig?.openingStatement.statement,
                    enableStatement: res.chatConfig?.openingStatement.enabled,
                    prePrompt: res.chatConfig.prePrompt,
                    temperature: res.chatConfig.modelConfig?.completionParams?.temperature,
                    defaultImg: res?.images?.[0],
                    enableSearchInWeb: res.chatConfig?.webSearchConfig?.enabled,
                    searchInWeb: res.chatConfig?.webSearchConfig?.webScope
                });
            })();
        }
    }, [mUid]);

    return (
        <div className="h-[100vh]">
            <Chat
                chatBotInfo={chatBotInfo}
                mode={'iframe'}
                mediumUid={mUid}
                setMUid={setMUid}
                statisticsMode={statisticsMode}
                // showSelect={showSelect}
                showSelect={false}
                botList={list}
            />
        </div>
    );
};

export default chatBot;
