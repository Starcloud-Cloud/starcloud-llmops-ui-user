import { useEffect, useState } from 'react';
import { IChatInfo } from 'views/template/myChat/createChat';
import { Chat } from 'views/template/myChat/createChat/components/Chat';
import { useLocation, useParams } from 'react-router-dom';
import { getChatInfo, marketPage } from 'api/chat/mark';
import { useWindowSize } from 'hooks/useWindowSize';
import { Card } from '@mui/material';
import { cards } from '../../pages/landing/CardData';

const ChatMy = () => {
    const location = useLocation();
    const searchParams = new URLSearchParams(location.search);
    const appUid = searchParams.get('appUid') as string;

    const [chatBotInfo, setChatBotInfo] = useState<IChatInfo>({
        guideList: ['', '']
    });
    const [uid, setUid] = useState<any>('');
    const [list, setList] = useState<any[]>([]);

    useEffect(() => {
        if (appUid) {
            setUid(appUid);
        }
    }, [appUid]);

    useEffect(() => {
        if (uid) {
            (async () => {
                const res = await getChatInfo(uid);
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
    }, [uid]);

    useEffect(() => {
        marketPage({
            model: 'CHAT',
            pageNo: 1,
            pageSize: 1000
        }).then((res) => {
            const r = res?.list?.map((item: any) => ({
                value: item.uid,
                name: item.name,
                des: item.description,
                avatar: item.images?.[0]
            }));
            setList(r);
            if (!appUid) {
                setUid(r[0]?.value);
            }
        });
    }, [appUid]);
    const { width } = useWindowSize();

    return (
        <Card
            sx={{
                overflow: 'visible',
                background: 'inherit'
            }}
            className="h-[calc(100vh-130px)]"
        >
            {/* <div className="rounded-lg h-full"> */}
            <Chat chatBotInfo={chatBotInfo} mode={'individual'} uid={uid} setUid={setUid} showSelect={width <= 1300} botList={list} />
            {/* </div> */}
        </Card>
    );
};

export default ChatMy;
