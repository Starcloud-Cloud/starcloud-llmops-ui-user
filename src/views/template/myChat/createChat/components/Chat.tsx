import CleaningServicesSharpIcon from '@mui/icons-material/CleaningServicesSharp';
import KeyboardVoiceIcon from '@mui/icons-material/KeyboardVoice';
import MoreHorizTwoToneIcon from '@mui/icons-material/MoreHorizTwoTone';
import SendIcon from '@mui/icons-material/Send';
import {
    Card,
    CardContent,
    Divider,
    Grid,
    IconButton,
    InputAdornment,
    Menu,
    MenuItem,
    OutlinedInput,
    Typography,
    useMediaQuery,
    useTheme
} from '@mui/material';
import React, { useEffect, useRef } from 'react';
import PerfectScrollbar from 'react-perfect-scrollbar';
import { useLocation } from 'react-router-dom';
import { getChat, getChatHistory, messageSSE } from '../../../../../api/chat';
import { t } from '../../../../../hooks/web/useI18n';
import { dispatch } from '../../../../../store';
import { openSnackbar } from '../../../../../store/slices/snackbar';
import { IChatInfo } from '../index';
import ChatHistory from './ChatHistory';

export type IHistory = Partial<{
    uid: string;
    appConversationUid: string;
    appUid: string;
    appMode: string;
    appConfig: string;
    appStep: string;
    status: string;
    errorCode: string;
    errorMsg: string;
    variables: string;
    message: string;
    messageTokens: number;
    messageUnitPrice: number;
    answer: string;
    answerTokens: number;
    answerUnitPrice: number;
    elapsed: number;
    totalPrice: number;
    currency: string;
    fromScene: string;
    endUser: string;
    id: string;
    createTime: number;
    robotName: string;
    robotAvatar: string;
    isNew: boolean;
    isSystem?: boolean;
}>;

type IConversation = {
    uid: string;
    appUid: string;
    appName: string;
    appMode: string;
    appConfig: string;
    status: string;
    fromScene: string;
    endUser: string;
    id: string;
    createTime: number;
};
export const Chat = ({ chatBotInfo }: { chatBotInfo: IChatInfo }) => {
    const theme = useTheme();
    const scrollRef: any = React.useRef();
    const matchDownSM = useMediaQuery(theme.breakpoints.down('lg'));
    const location = useLocation();
    const searchParams = new URLSearchParams(location.search);
    const appId = searchParams.get('appId') as string;

    const [isListening, setIsListening] = React.useState(false);
    const [message, setMessage] = React.useState('');
    const [conversationUid, setConversationUid] = React.useState('');
    const [data, setData] = React.useState<IHistory[]>([]);
    const [time, setTime] = React.useState(1);
    const [isFirst, setIsFirst] = React.useState(true);

    const dataRef: any = useRef(data);
    const timeOutRef: any = useRef(null);

    // 创建语音识别对象
    const recognition = new ((window as any).SpeechRecognition || (window as any).webkitSpeechRecognition)();

    // 设置语言为中文
    // recognition.lang = 'zh-CN';

    // 语音识别结果事件处理函数
    recognition.onresult = (event: any) => {
        const result = event.results[event.resultIndex][0].transcript;
        setMessage(`${message}${result}`);
    };

    // 开始语音识别
    const startListening = () => {
        timeOutRef.current = setInterval(() => {
            setTime((time) => time + 1);
        }, 1000);
        setIsListening(true);
        recognition.start();
    };

    // 停止语音识别
    const stopListening = () => {
        timeOutRef.current && clearInterval(timeOutRef.current);
        setTime(1);
        setIsListening(false);
        recognition.stop();
    };

    useEffect(() => {
        return () => {
            timeOutRef.current && clearInterval(timeOutRef.current);
        };
    }, []);

    // 获取会话
    React.useEffect(() => {
        (async () => {
            const res: IConversation[] = await getChat({ scene: 'CHAT_TEST', appUid: appId });
            if (res && res.length) {
                setConversationUid(res[0].uid);
            }
        })();
    }, []);

    // 获取历史记录, 只加载一次
    React.useEffect(() => {
        if (conversationUid && isFirst) {
            (async () => {
                const res: any = await getChatHistory({ conversationUid, pageNo: 1, pageSize: 10000 });
                const list = res.list.map((v: any) => ({ ...v, robotName: chatBotInfo.name, robotAvatar: chatBotInfo.avatar }));
                setData([
                    ...list,
                    { robotName: chatBotInfo.name, robotAvatar: chatBotInfo.avatar, answer: chatBotInfo.statement, isSystem: true }
                ]);
                setIsFirst(false);
            })();
        }
    }, [conversationUid, chatBotInfo]);

    // 更新历史记录
    React.useEffect(() => {
        if (!isFirst) {
            const list = data.map((v: any) => ({ ...v, robotName: chatBotInfo.name, robotAvatar: chatBotInfo.avatar }));
            setData(list);
        }
    }, [chatBotInfo.avatar, chatBotInfo.name, chatBotInfo.statement]);

    // 更新欢迎语
    React.useEffect(() => {
        if (!isFirst) {
            const copyData = [...data];
            const index = copyData.findIndex((v) => v.isSystem);
            copyData[index].answer = chatBotInfo.statement;
            setData(copyData);
        }
    }, [chatBotInfo.statement]);

    React.useEffect(() => {
        // 清理语音识别对象
        return () => {
            recognition.stop();
            recognition.onresult = null;
        };
    }, []);

    React.useLayoutEffect(() => {
        if (scrollRef?.current) {
            // @ts-ignore
            scrollRef.current.scrollIntoView();
        }
    });

    const handleKeyDown = async (event: any) => {
        // 按下 Shift + Enter 换行
        if (event.shiftKey && event.keyCode === 13) {
            setMessage(message + '\n');
        } else if (!event.shiftKey && event.keyCode === 13) {
            // 单独按回车键提交表单
            await handleOnSend();
        }
    };

    // handle new message form
    const handleOnSend = async () => {
        if (!message.trim()) {
            return;
        }
        setMessage('');
        const newMessage: IHistory = {
            robotName: chatBotInfo.name,
            robotAvatar: chatBotInfo.avatar,
            message,
            createTime: new Date().getTime(),
            answer: '',
            isNew: true
        };
        const newData = [...data, newMessage];
        dataRef.current = newData;
        setData(newData);

        let resp: any = await messageSSE({
            appUid: appId,
            scene: 'CHAT_TEST',
            conversationUid,
            query: message
        });
        const reader = resp.getReader();
        const textDecoder = new TextDecoder();
        let outerJoins: any;
        while (1) {
            let joins = outerJoins;
            const { done, value } = await reader.read();
            if (textDecoder.decode(value).includes('2008002007')) {
                dispatch(
                    openSnackbar({
                        open: true,
                        message: t('market.error'),
                        variant: 'alert',
                        alert: {
                            color: 'error'
                        },
                        close: false
                    })
                );
                return;
            }
            if (done) {
                const copyData = [...dataRef.current];
                copyData[dataRef.current.length - 1].isNew = false;
                setData(copyData);
                break;
            }
            let str = textDecoder.decode(value);
            const lines = str.split('\n');
            lines.forEach((messages, i: number) => {
                if (i === 0 && joins) {
                    messages = joins + messages;
                    joins = undefined;
                }
                if (i === lines.length - 1) {
                    if (messages && messages.indexOf('}') === -1) {
                        joins = messages;
                        return;
                    }
                }
                let bufferObj;
                if (messages?.startsWith('data:')) {
                    bufferObj = messages.substring(5) && JSON.parse(messages.substring(5));
                }
                if (bufferObj?.code === 200) {
                    setConversationUid(bufferObj.conversationUId);
                    const copyData = [...dataRef.current]; // 使用dataRef.current代替data
                    copyData[copyData.length - 1].answer = copyData[dataRef.current.length - 1].answer + bufferObj.content;
                    copyData[copyData.length - 1].isNew = true;
                    dataRef.current = copyData;
                    setData(copyData);
                } else if (bufferObj && bufferObj.code !== 200) {
                    dispatch(
                        openSnackbar({
                            open: true,
                            message: t('market.warning'),
                            variant: 'alert',
                            alert: {
                                color: 'error'
                            },
                            close: false
                        })
                    );
                }
            });
            outerJoins = joins;
        }
    };

    const handleClean = () => {
        setAnchorEl(null);
        setData([]);
        setConversationUid('');
    };

    const [anchorEl, setAnchorEl] = React.useState<Element | ((element: Element) => Element) | null | undefined>(null);
    const handleClickSort = (event: React.MouseEvent<HTMLButtonElement> | undefined) => {
        setAnchorEl(event?.currentTarget);
    };

    const handleCloseSort = () => {
        setAnchorEl(null);
    };

    // toggle sidebar
    const [openChatDrawer, setOpenChatDrawer] = React.useState(true);
    const handleDrawerOpen = () => {
        setOpenChatDrawer((prevState) => !prevState);
    };

    // close sidebar when widow size below 'md' breakpoint
    React.useEffect(() => {
        setOpenChatDrawer(!matchDownSM);
    }, [matchDownSM]);

    return (
        <div>
            <div className={'flex justify-center items-center py-[8px]'}>
                <img className="w-[28px] h-[28px] rounded-md object-fill" src={chatBotInfo.avatar} alt="" />
                <span className={'text-lg font-medium ml-2'}>{chatBotInfo.name}</span>
            </div>
            <Divider variant={'fullWidth'} />
            <PerfectScrollbar style={{ width: '100%', height: 'calc(100vh - 265px)', overflowX: 'hidden', minHeight: 525 }}>
                {chatBotInfo.introduction && chatBotInfo.enableIntroduction && (
                    <Card className="bg-[#f2f3f5] mx-[24px] mt-[12px] p-[16px] flex">
                        <img className="w-[56px] h-[56px] rounded-xl object-fill" src={chatBotInfo.avatar} alt="" />
                        <div className="flex flex-col ml-3">
                            <span className={'text-lg font-medium'}>{chatBotInfo.name}</span>
                            <Typography align="left" variant="subtitle2" color={'#000'}>
                                {chatBotInfo.introduction}
                            </Typography>
                        </div>
                    </Card>
                )}
                <CardContent>
                    <ChatHistory theme={theme} data={data} />
                    <span ref={scrollRef}></span>
                </CardContent>
            </PerfectScrollbar>
            <Grid container spacing={1} alignItems="center" className="px-[24px] pb-[24px]">
                <Grid item>
                    <Grid item>
                        <IconButton onClick={handleClickSort} size="large" aria-label="chat user details change">
                            <MoreHorizTwoToneIcon />
                        </IconButton>
                        <Menu
                            id="simple-menu"
                            anchorEl={anchorEl}
                            keepMounted
                            open={Boolean(anchorEl)}
                            onClose={handleCloseSort}
                            anchorOrigin={{
                                vertical: 'bottom',
                                horizontal: 'right'
                            }}
                            transformOrigin={{
                                vertical: 'top',
                                horizontal: 'right'
                            }}
                        >
                            <MenuItem onClick={handleClean}>
                                <CleaningServicesSharpIcon className="text-base" />
                                <span className="text-base ml-3">清除</span>
                            </MenuItem>
                        </Menu>
                    </Grid>
                </Grid>
                <Grid item xs={12} sm zeroMinWidth>
                    <OutlinedInput
                        id="message-send"
                        fullWidth
                        multiline
                        value={message}
                        onChange={(e) => setMessage(e.target.value)}
                        placeholder="请输入(Shift+Enter换行)"
                        className="!pt-0"
                        onKeyDown={handleKeyDown}
                        maxRows={2}
                        endAdornment={
                            <>
                                <InputAdornment position="end">
                                    {!isListening ? (
                                        <IconButton
                                            className="!p-[4px]"
                                            disableRipple
                                            color={'default'}
                                            onClick={startListening}
                                            aria-label="voice"
                                        >
                                            <KeyboardVoiceIcon />
                                        </IconButton>
                                    ) : (
                                        <div
                                            onClick={stopListening}
                                            className="w-[30px] h-[30px] rounded-full border-2 border-[#727374] border-solid flex justify-center items-center cursor-pointer"
                                        >
                                            <div className="w-[16px] h-[16px] rounded-sm bg-[red] text-white flex justify-center items-center text-xs">
                                                {time}
                                            </div>
                                        </div>
                                    )}
                                </InputAdornment>
                                <InputAdornment position="end" className="relative">
                                    <IconButton
                                        className="!p-[4px]"
                                        disableRipple
                                        color={message ? 'secondary' : 'default'}
                                        onClick={handleOnSend}
                                        aria-label="send message"
                                    >
                                        <SendIcon />
                                    </IconButton>
                                </InputAdornment>
                            </>
                        }
                        aria-describedby="search-helper-text"
                        inputProps={{ 'aria-label': 'weight' }}
                    />
                </Grid>
            </Grid>
        </div>
    );
};