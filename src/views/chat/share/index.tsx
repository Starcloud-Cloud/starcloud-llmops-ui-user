import { Card, CardContent, Divider, Typography, useTheme } from '@mui/material';
import { shareChatBotInfo, shareChatBotList } from 'api/chat';
import React, { useEffect, useMemo, useRef, useState } from 'react';
import { useParams } from 'react-router-dom';
import { extractChatBlocks } from 'views/template/myChat/createChat/components/Chat';
import ChatHistory from 'views/template/myChat/createChat/components/ChatHistory';

export const ShareChat = () => {
    const theme = useTheme();
    const { shareKey } = useParams(); // 获取
    const [chatBotInfo, setChatBotInfo] = React.useState<any>({});
    const [data, setData] = useState<any[]>([]);

    useEffect(() => {
        if (shareKey) {
            shareChatBotInfo(shareKey).then((res) => {
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
            });
        }
    }, [shareKey]);

    useEffect(() => {
        if (shareKey && chatBotInfo) {
            shareChatBotList(shareKey).then((res) => {
                console.log(res, 'res');
                const list = res.map((v: any) => ({
                    ...v,
                    robotName: chatBotInfo.name,
                    robotAvatar: chatBotInfo.avatar
                }));

                const chatBlocks = extractChatBlocks(list);
                console.log(chatBlocks, 'list');
                setData(chatBlocks);
            });
        }
    }, [shareKey, chatBotInfo]);

    return (
        <Card
            sx={{
                overflow: 'visible',
                background: 'inherit'
            }}
        >
            <div className="w-full">
                <div className={'flex justify-center items-center py-[8px]'}>
                    <div className="w-[28px] h-[28px] flex justify-center items-center">
                        {chatBotInfo.avatar && <img className="w-[28px] h-[28px] rounded-md object-fill" src={chatBotInfo.avatar} alt="" />}
                    </div>
                    <span className={'text-lg font-medium ml-2'}>{chatBotInfo.name}</span>
                </div>
                <Divider variant={'fullWidth'} />
                <div className="h-[calc(100vh-64px)] max-w-[768px] w-full overflow-y-auto mx-auto">
                    <div>
                        {chatBotInfo.enableIntroduction && (
                            <Card className="bg-[#f2f3f5] mx-[24px] mt-[12px] p-[16px] flex">
                                <div className="flex w-[56px] h-[56px] justify-center items-center">
                                    <img className="w-[56px] h-[56px] rounded-xl object-fill" src={chatBotInfo.avatar} alt="" />
                                </div>
                                <div className="flex flex-col ml-3">
                                    <span className={'text-lg font-medium h-[28px]'}>{chatBotInfo.name}</span>
                                    <Typography align="left" variant="subtitle2" color={'#000'}>
                                        {chatBotInfo.introduction}
                                    </Typography>
                                </div>
                            </Card>
                        )}
                        <CardContent>
                            <ChatHistory theme={theme} data={data} />
                        </CardContent>
                    </div>
                </div>
            </div>
        </Card>
    );
};
