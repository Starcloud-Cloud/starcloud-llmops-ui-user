import { Card, CardContent, Divider, Typography, useTheme } from '@mui/material';
import React, { useEffect, useMemo, useRef } from 'react';
import ChatHistory from './ChatHistory';

export const ChatRecord = ({ list }: { list: any }) => {
    const theme = useTheme();

    const [chatBotInfo, setChatBotInfo] = React.useState<any>({});

    const timeOutRef: any = useRef(null);

    useEffect(() => {
        return () => {
            timeOutRef.current && clearInterval(timeOutRef.current);
        };
    }, []);

    useEffect(() => {
        if (list?.length > 0) {
            setChatBotInfo({
                avatar: list?.[0]?.images?.[0],
                name: list?.[0]?.appName
            });
        }
    }, [list]);

    const data = useMemo(() => {
        if (list) {
            return list.map((v: any) => ({ ...v, robotName: v?.appName, robotAvatar: v?.images?.[0] }));
        }
        return [];
    }, [list]);

    return (
        <div>
            <div className={'flex justify-center items-center py-[8px]'}>
                <div className="w-[28px] h-[28px] flex justify-center items-center">
                    <img className="w-[28px] h-[28px] rounded-md object-fill" src={chatBotInfo.avatar} alt="" />
                </div>
                <span className={'text-lg font-medium ml-2'}>{chatBotInfo.name}</span>
            </div>
            <Divider variant={'fullWidth'} />
            <div style={{ width: '100%', height: '100%', overflowX: 'hidden' }}>
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
    );
};
