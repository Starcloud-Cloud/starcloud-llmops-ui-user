import React, { useEffect, useState } from 'react';
import { IChatInfo } from 'views/template/myChat/createChat';
import { Chat } from 'views/template/myChat/createChat/components/Chat';
import { useLocation, useParams } from 'react-router-dom';
import { getChatInfo, marketPage } from 'api/chat/mark';
import { useWindowSize } from 'hooks/useWindowSize';
import { Card } from '@mui/material';
import { cards } from '../../pages/landing/CardData';
import { Alert, Space, Tag } from 'antd';
import { ExpandMore } from '@mui/icons-material';

const ChatMy = () => {
    const location = useLocation();
    const searchParams = new URLSearchParams(location.search);
    const appUid = searchParams.get('appUid') as string;
    const [visible, setVisible] = useState(false);

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
        const r = localStorage.getItem('showChatAlert');
        if (r !== '1') {
            setVisible(true);
        }
    }, []);

    useEffect(() => {
        if (uid) {
            (async () => {
                const res = await getChatInfo(uid);
                setChatBotInfo({
                    uid: res.uid,
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
                    searchInWeb: res.chatConfig?.webSearchConfig?.webScope,
                    modelProvider: res?.chatConfig?.modelConfig?.provider === 'openai' ? 'GPT35' : res?.chatConfig?.modelConfig?.provider
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
            className={`${visible ? 'h-[calc(100vh-260px)]' : 'h-[calc(100vh-154px)]'}`}
        >
            {visible ? (
                <Alert
                    description={
                        <div>
                            <h3 className={'text-xl'}>
                                欢迎使用
                                <span className={'text-[#673ab7]'}>魔法</span>
                                AI自由对话
                            </h3>
                            <div className={'py-1'}>如何更聪明的提问？让魔法AI给你需要的答案？使用提问的万能句式</div>
                            <div>
                                <Space size={[0, 8]} wrap>
                                    <Tag color="blue">聪明的提问</Tag>=
                                    <Tag color="red" className={'ml-[8px]'}>
                                        设定角色
                                    </Tag>
                                    +
                                    <Tag color="red" className={'ml-[8px]'}>
                                        简述背景
                                    </Tag>
                                    +
                                    <Tag color="red" className={'ml-[8px]'}>
                                        定目标
                                    </Tag>
                                    +
                                    <Tag color="red" className={'ml-[8px]'}>
                                        补要求
                                    </Tag>
                                </Space>
                            </div>
                        </div>
                    }
                    type="info"
                    showIcon
                    closable
                    className={`${width > 1300 ? 'max-w-[calc(100%-220px)]' : 'w-full'} mb-2`}
                    onClose={() => {
                        setVisible(false);
                        localStorage.setItem('showChatAlert', '1');
                    }}
                />
            ) : (
                <div
                    className={`${width > 1300 ? 'max-w-[calc(100%-220px)]' : 'w-full'} flex justify-end items-center cursor-pointer`}
                    onClick={() => setVisible(true)}
                >
                    <ExpandMore />
                    <span>查看使用教程</span>
                </div>
            )}

            <Chat
                chatBotInfo={chatBotInfo}
                mode={'market'}
                uid={uid}
                setUid={setUid}
                showSelect={width <= 1300}
                botList={list}
                setChatBotInfo={setChatBotInfo}
                statisticsMode={'CHAT_MARKET'}
            />
        </Card>
    );
};

export default ChatMy;
