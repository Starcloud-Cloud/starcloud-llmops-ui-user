import React, { useEffect, useState } from 'react';
import { IChatInfo } from 'views/template/myChat/createChat';
import { Chat } from 'views/template/myChat/createChat/components/Chat';
import { useLocation, useParams } from 'react-router-dom';
import { getChatInfo, marketPage } from 'api/chat/mark';
import { useWindowSize } from 'hooks/useWindowSize';
import { Card } from '@mui/material';
import { Space, Tag } from 'antd';

const list = [
    {
        icon: 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACEAAAAhCAYAAABX5MJvAAAACXBIWXMAAAsTAAALEwEAmpwYAAAAAXNSR0IArs4c6QAAAARnQU1BAACxjwv8YQUAAATDSURBVHgBzVhdTBxVFP5mZhe2u2mAhSUpESjiXwgaDQEkNtH4IGhpG2lafxJTjInRp2offGjiM1hjU01fiGnrizGxYNCkShXZ1DQlNCFtkEIaivyHn4XdZdlZ2d/rObN0utClvYul+iUDZ+7OPd+Zc88599xRIAEhhDo6OlrgcDhcFoulTFVVVyKBPBq3aZpmicfjMfq/qqrwxWIxD11juq57ysvLFxVFSWCrcLvdFo/H86Lf728LBkMj4XBYJ+UikUiYVypSx8kowc8Hg8ERnj87O/sS68vIgIWFhVfpTa4x6YNALBYVwaB+jfXel5yeV7xef2s0Gk2IbQDrJf0tzLOpEeS6FnbldoL1syGbLsF2eWAjmOeupaFxjddMPESs8WnMr/KfxcXFPTZb1rPIABT9oKjH9PQ0lpaW+EUymQ7mY16kxEKb7BuQK8VXp06Jmqoqsbu4WBQXFYknysvF6wcOiKt9fSITeL3eNuZXSFYpHW9SIXpM5g0+PnoU7efPm/dUjEwv2B0O/NzVBSpSMqpAvLeI90mqhPMFWVlZRTKThm7cQEd7uyGXlpbi+44Og7SiosIYC+k6frlwAbIg3l1ciS0Oh3BRGbbLTKLUQX1DAyYnJvDRsWOoq6szxpsOHsTQ0JAhT01NQRbE61jbCoy9QGpSZWUlvj5zxpADgQCGh4cxPjaGwcFB8xmqA5AFLyXzW2g9C5EBZmZm8FlrK3q6u7G8vIx/AzaCN0OLpllzZSdRSuEwuX5yctK437d/P16pr0d/fz++OXsWWwFteE7yRNzGFsngHBHdNqCpqQlfnj5tyJRq2AqYV1G0LJUE6S22r7fXlKtra035z4EBU/b5fMgEiiKsKm1oUdkJO+x3ksjd00NFbhnd3b/hx85Oc7z3yhXTWzLg+seeCMuW3L2Njab868WLeOH5WrzX/C4ozWBfM5AaGQxcvy6lj3nJCWHKzYS0/w4dfgNHmptNQt4/qqur8QN5ovXECeTk5OCLkyfRSAErC24JQS1c48ZWbR0iQXKYvm6IskRMTEyI+fn5dW0eBWhS8I8I8ftbQnQ8LYT7Her90vcoyd7Cu5fSVP2LFG1u6vxloLMKuEkpGF81hvLz81FSUoLCwkKkZlZeXl5SiK0AhTVA8WvA3B80kF4/85ItYwptxy6n0zlOdXzz0j17Cbh0hEKZEqniQ6DsEOB4hO5TKm0iQpvHHD3rJoPP0VotAS4yxOYEaj5PqzYSiepe71KZ/C66ugBc/QS49S3daEkjdpaSaEsSBqeTz2jZwONk8HOfApM/AY++CVh3plWp63+POBw7njJ8yf0EBdX7kIFvMLk0011E6uEQJxJyovMZoGQfXRSU9l1Sqqjst+Xm5n5g3PD5gpuVjMABGaWgjQRIznCuSB4DmNe0SPwfekyK8HgopB/nww4eAtjrKyuB48x714//+bmDQc8ofn+gZbvOH5FI5P4nsNvggwmvGR22H4gxrGftLNqQjk+5h1e0ubnFPdnZ2ttUyF62Wq1FdPy3J3uAO9NSu+21ecZFbg/RNUNv30Oe/a6goOBy2hi4lxEbDDK+T5AhLrt9525VNVpC+j6hZJNiK/0epb4gTGM+KsULoVBonIilv0/8A5ZO+0vXO0PcAAAAAElFTkSuQmCC',
        title: '亚马逊运营',
        desList: [
            '你是一个亚马逊广告创意专家，请给出10个电冰箱的广告创意，风格是科技感和未来感',
            '你是一个亚马逊选品专家，请给出十个宠物品类的小众产品灵感，主要针对美国中高收入群体，适合在Amazon上售卖'
        ]
    },
    {
        icon: 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACEAAAAhCAYAAABX5MJvAAAACXBIWXMAAAsTAAALEwEAmpwYAAAAAXNSR0IArs4c6QAAAARnQU1BAACxjwv8YQUAAALWSURBVHgB7ZZNSBVRFMf/594707N8hVDRh5HQQiIqssgwgkxXUQRSbVtGUG0KiVootDGiFrWIauHerbUoIcWQQkgj22hLpS8ov/Jr5s49nRHSyDe+pz3DwD/MvTNz7j33d86cuTPAila0DEXzGVsaeF3KQ8mkDQuwSBnPs7BjA5W1hZ+xGIjWO0GjDDmXbVw2MVP7pK9PHr9MI5nsKmni8/u8BYzqvwWYXoSwO2XtvkR7ksFMBYcYVIQ8iMFpieQAS0qQK0TTGdYOOESENciPDDk++OYRCnKG2FCBtCJ1EHmUIxwYmkAauUJgItgUpw95FIFKdGh3ImcI3xyVNl+PYnYtwonMhj8UFw8pdwpLIq5urOMUskG030WxvBV7sRQIoOLt6XAXskFEFJVJOtJYGsUFX4ZsEORciXQpJIsxvzFIHEMwjrkoKwRIfZM2yuA9kH3jNiIuc4wWzF1I9iS0SRD7pb8ujibnuGZ8dQ6vskKYAv1USrNJTsMZ7wIgm9eDkWFTX1nrvyUTXZLbXb+BxH0XW3ex74PfOzpq7smtW+JnfJYQ34Xy5ssx0zEHDhnUWseFanV0LNKokehD1rZ5oIN7Rr7oKzbgCr+A6zeWr3pftD44rFjtUJr6hvp1Z/+7oDwcoxvG4PXara5hW7neDOcOK6If1nFb1VW/h4g4J4hYj6t55/CoLfY8VyiZ2C1HjQuwJ55DGuMC90Qb1aU9Hg0DXg/HFVGoKiVmX5yy8qiPnWs2KXyEiz/pquPCC78z01omCSKwU1WKUW+nKCVOVwvEDDBHcg2cdZE7baem68fE28uvpyMtRSGXSlcaTsBK9FZpXBPTwiB42kbr5MRw8iDhTP4STw9xMl/FNcuJWZ/Xwb/ScodQg5LDCHmQvA+RghnEQiGssa3ao27kA8JT3U6FbYn2+SY/PDK2OVjlSrXyFv23HblwwteFveef0SesaEX/k34CGjEZKun9g2MAAAAASUVORK5CYII=',
        title: '独立站',
        desList: [
            '你是一个博文撰写专家，请帮我生成一篇电冰箱的新产品发布的博文，要体现的产品卖点是“时尚，多功能”',
            '你是一个网红招募专家，请帮我写一篇招募网红帮我推广宠物玩具的邮件,要体现产品卖点是“安全，有趣“'
        ]
    }
];

export const ChatTip = (props: any) => {
    return (
        <div className={`flex flex-col rounded-lg bg-white w-full p-3 justify-center pl-6 absolute top-0 left-0 bottom-0 `}>
            <div className="overflow-auto">
                <div className="flex justify-center flex-col items-center">
                    <h3 className={'text-3xl text-black'}>
                        欢迎使用 <span className={'text-[#673ab7]'}>魔法AI</span> 自由对话
                    </h3>
                    <div className={'py-1 mt-5'}>如何更聪明的提问？让魔法AI给你需要的答案？使用提问的万能句式</div>
                    <div className="mt-5">
                        <Space size={[0, 8]} wrap>
                            <Tag color="blue" className="h-[54px] flex items-center rounded-lg ml-[8px]">
                                聪明的提问
                            </Tag>
                            =
                            <Tag color="red" className="h-[54px] flex items-center rounded-lg ml-[8px]">
                                设定角色
                            </Tag>
                            +
                            <Tag color="red" className="h-[54px] flex items-center rounded-lg ml-[8px]">
                                简述背景
                            </Tag>
                            +
                            <Tag color="red" className="h-[54px] flex items-center rounded-lg ml-[8px]">
                                定目标
                            </Tag>
                            +
                            <Tag color="red" className="h-[54px] flex items-center rounded-lg ml-[8px]">
                                补要求
                            </Tag>
                        </Space>
                    </div>
                </div>
                <div className="flex flex-col items-center">
                    <div className="text-base my-7 text-[#0009]">提问示例</div>
                    {list.map((item: any, index) => (
                        <div className="max-w-[550px] flex justify-start flex-col" key={index}>
                            <div className="flex items-center">
                                <img src={item.icon} alt="" />
                                <span className="my-[10px] text-lg text-[#0009]">{item?.title}</span>
                            </div>
                            {item?.desList?.map((v: any, i: number) => {
                                return (
                                    <div
                                        className="text-base text-[#0009] mb-[10px] cursor-pointer hover:text-[#673ab7]"
                                        key={i}
                                        onClick={() => props.handleExample(v)}
                                    >
                                        {`“${v}”`}
                                    </div>
                                );
                            })}
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

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
        <div className="relative">
            <Card
                sx={{
                    overflow: 'visible',
                    background: 'inherit'
                }}
                className={'h-[calc(100vh-154px)] overflow-auto'}
            >
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
        </div>
    );
};

export default ChatMy;
