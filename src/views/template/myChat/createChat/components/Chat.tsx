import CleaningServicesSharpIcon from '@mui/icons-material/CleaningServicesSharp';
import KeyboardVoiceIcon from '@mui/icons-material/KeyboardVoice';
import MoreHorizTwoToneIcon from '@mui/icons-material/MoreHorizTwoTone';
import PendingIcon from '@mui/icons-material/Pending';
import SendIcon from '@mui/icons-material/Send';
import {
    Card,
    CardContent,
    Divider,
    FormControl,
    Grid,
    IconButton,
    InputAdornment,
    InputLabel,
    Menu,
    MenuItem,
    OutlinedInput,
    Select,
    Tooltip,
    Typography,
    useMediaQuery,
    useTheme
} from '@mui/material';
import React, { useEffect, useRef, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { getChat, getChatHistory, messageSSE } from '../../../../../api/chat';
import { t } from '../../../../../hooks/web/useI18n';
import { dispatch } from '../../../../../store';
import { openSnackbar } from '../../../../../store/slices/snackbar';
import { IChatInfo } from '../index';
import ChatHistory from './ChatHistory';
import { getShareChatHistory, shareMessageSSE } from 'api/chat/share';
import jsCookie from 'js-cookie';
import ExpandLessIcon from '@mui/icons-material/ExpandLess';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import { Popover } from 'antd';
import { uniqBy } from 'lodash-es';
import { conversation, marketMessageSSE } from 'api/chat/mark';
import { useChatMessage } from 'store/chatMessage';
import { useWindowSize } from 'hooks/useWindowSize';

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
    process: any;
    answer: any;
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
    isStatement?: boolean;
}>;

export type IConversation = {
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

export const ChatBtn = () => {
    const [anchorEl, setAnchorEl] = React.useState<Element | ((element: Element) => Element) | null | undefined>(null);
    const [isListening, setIsListening] = React.useState(false);
    const [message, setMessage] = React.useState('');
    const [time, setTime] = React.useState(1);
    const { setMessageData } = useChatMessage();
    const navigate = useNavigate();

    const timeOutRef: any = useRef(null);

    const handleClean = () => {
        setAnchorEl(null);
        // setData([]);
        // dataRef.current = [];
        // setConversationUid('');
        // jsCookie.remove(conversationUniKey);
    };

    const handleClickSort = (event: React.MouseEvent<HTMLButtonElement> | undefined) => {
        setAnchorEl(event?.currentTarget);
    };

    const handleCloseSort = () => {
        setAnchorEl(null);
    };

    // 创建语音识别对象
    const recognition = new ((window as any).SpeechRecognition || (window as any).webkitSpeechRecognition)();

    // 设置语言为中文
    recognition.lang = navigator.language;

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

    const handleKeyDown = async (event: any) => {
        // 按下 Shift + Enter 换行
        if (event.shiftKey && event.keyCode === 13) {
            event.preventDefault();
            setMessage(message + '\n');
        } else if (!event.shiftKey && event.keyCode === 13) {
            event.preventDefault();
            // 单独按回车键提交表单
            await handleOnSend();
        }
    };

    const handleOnSend = async () => {
        setMessageData(message);
        navigate('/chat/my');
    };

    return (
        <div className="flex-shrink-0 flex justify-center w-full ">
            <div className="w-full max-w-[768px]  relative text-sm rounded-lg bg-white shadow-lg p-3 border border-[#E3E4E5]">
                <Grid container spacing={1} alignItems="center" className="px-0 sm:px-[12px] flex-nowrap">
                    <Grid item className="!pl-0">
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
                    <Grid item xs={12} sm zeroMinWidth className="!pl-0">
                        <OutlinedInput
                            id="message-send"
                            fullWidth
                            multiline
                            value={message}
                            onChange={(e) => setMessage(e.target.value)}
                            placeholder="请输入想咨询的问题"
                            className="!pt-0"
                            onKeyDown={handleKeyDown}
                            minRows={1}
                            maxRows={3}
                            endAdornment={
                                <>
                                    <InputAdornment position="end">
                                        {!isListening ? (
                                            <Tooltip arrow placement="top" title={'语音输入'}>
                                                <IconButton
                                                    disableRipple
                                                    color={'default'}
                                                    onClick={startListening}
                                                    aria-label="voice"
                                                    className="p-0"
                                                >
                                                    <KeyboardVoiceIcon />
                                                </IconButton>
                                            </Tooltip>
                                        ) : (
                                            <Tooltip placement="top" arrow title={'停止语音输入'}>
                                                <div
                                                    onClick={stopListening}
                                                    className="w-[30px] h-[30px] rounded-full border-2 border-[#727374] border-solid flex justify-center items-center cursor-pointer"
                                                >
                                                    <div className="w-[16px] h-[16px] rounded-sm bg-[red] text-white flex justify-center items-center text-xs">
                                                        {time}
                                                    </div>
                                                </div>
                                            </Tooltip>
                                        )}
                                    </InputAdornment>
                                    <InputAdornment position="end" className="relative">
                                        <Tooltip placement="top" arrow title={'发送'}>
                                            <IconButton
                                                disableRipple
                                                color={message ? 'secondary' : 'default'}
                                                onClick={handleOnSend}
                                                aria-label="send message"
                                            >
                                                <SendIcon />
                                            </IconButton>
                                        </Tooltip>
                                    </InputAdornment>
                                </>
                            }
                            aria-describedby="search-helper-text"
                            inputProps={{ 'aria-label': 'weight', maxLength: 100 }}
                        />
                    </Grid>
                </Grid>
                <div>
                    <div className="flex justify-end px-[24px]">
                        <div className="text-right text-stone-600 mr-1 mt-1">{message?.length || 0}/100</div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export const Chat = ({
    chatBotInfo,
    mode,
    statisticsMode,
    showSelect,
    botList,
    mediumUid,
    setMUid,
    uid,
    setUid
}: {
    chatBotInfo: IChatInfo;
    mode?: 'iframe' | 'test' | 'individual';
    statisticsMode?: string;
    showSelect?: boolean;
    botList?: any[];
    mediumUid?: string;
    setMUid?: (mediumUid: any) => void;
    uid?: string;
    setUid?: (uid: string) => void;
}) => {
    const theme = useTheme();
    const scrollRef: any = React.useRef();
    const contentRef: any = useRef(null);
    const location = useLocation();
    const searchParams = new URLSearchParams(location.search);
    const appId = searchParams.get('appId') as string;

    const [isListening, setIsListening] = React.useState(false);
    const [message, setMessage] = React.useState('');
    const [conversationUid, setConversationUid] = React.useState('');
    const [data, setData] = React.useState<IHistory[]>([]);
    const [time, setTime] = React.useState(1);
    const [isFirst, setIsFirst] = React.useState(true);
    const [isFetch, setIsFetch] = useState(false);
    const [open, setOpen] = useState(false);
    const [isFinish, setIsFinish] = useState(false);

    const { messageData, setMessageData } = useChatMessage();
    const { width } = useWindowSize();

    const dataRef: any = useRef(data);
    const timeOutRef: any = useRef(null);

    const conversationUniKey = `conversationUid-${mediumUid}`;

    // 创建语音识别对象
    const recognition = new ((window as any).SpeechRecognition || (window as any).webkitSpeechRecognition)();

    // 设置语言为中文
    recognition.lang = navigator.language;

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

    // mode test start
    // 获取会话
    React.useEffect(() => {
        if (mode === 'test') {
            (async () => {
                const res: IConversation[] = await getChat({ scene: 'CHAT_TEST', appUid: appId });
                if (res && res.length) {
                    setConversationUid(res[0].uid);
                }
            })();
        }
    }, [mode]);

    // 获取历史记录, 只加载一次
    React.useEffect(() => {
        if (mode === 'test' && conversationUid && isFirst) {
            (async () => {
                const res: any = await getChatHistory({ conversationUid, pageNo: 1, pageSize: 10000 });
                const list = res.list.map((v: any) => ({
                    ...v,
                    robotName: chatBotInfo.name,
                    robotAvatar: chatBotInfo.avatar
                }));
                const result = [
                    ...list,
                    {
                        robotName: chatBotInfo.name,
                        robotAvatar: chatBotInfo.avatar,
                        answer: chatBotInfo.statement && convertTextWithLinks(chatBotInfo.statement),
                        isStatement: true
                    }
                ];
                dataRef.current = result;
                setData(result);
                setIsFirst(false);
            })();
        }

        if (mode === 'test' && !conversationUid && isFirst) {
            if (chatBotInfo.enableStatement) {
                const result = [
                    {
                        robotName: chatBotInfo.name,
                        robotAvatar: chatBotInfo.avatar,
                        answer: chatBotInfo.statement && convertTextWithLinks(chatBotInfo.statement),
                        isStatement: true
                    }
                ];
                dataRef.current = result;
                setData(result);
            } else {
                dataRef.current = [];
                setData([]);
            }
        }
    }, [conversationUid, chatBotInfo, mode]);

    // 更新历史记录
    React.useEffect(() => {
        if (mode === 'test' && !isFirst) {
            const list: any = dataRef.current.map((v: any) => ({
                ...v,
                robotName: chatBotInfo.name,
                robotAvatar: chatBotInfo.avatar
            }));
            dataRef.current = list;
            setData(list);
        }
    }, [chatBotInfo.avatar, chatBotInfo.name, chatBotInfo.statement, mode]);

    // 更新欢迎语
    React.useEffect(() => {
        if (mode === 'test' && !isFirst) {
            const copyData = [...dataRef.current];
            const index = copyData.findIndex((v) => v.isStatement);
            if (index > -1) {
                if (chatBotInfo.enableStatement) {
                    copyData[index].answer = chatBotInfo.statement && convertTextWithLinks(chatBotInfo.statement);
                } else {
                    copyData[index].answer = '';
                }
                dataRef.current = copyData;
                setData(copyData);
            }
        }
    }, [chatBotInfo.statement, chatBotInfo.enableStatement, mode]);
    // mode test end

    // mode iframe start
    // iframe 模式下获取历史记录
    React.useEffect(() => {
        if (mode === 'iframe') {
            (async () => {
                const res = await getShareChatHistory({
                    pageNo: 1,
                    pageSize: 10000,
                    conversationUid: jsCookie.get(conversationUniKey)
                });
                const list =
                    res.list?.map((v: any) => ({
                        ...v,
                        robotName: chatBotInfo.name,
                        robotAvatar: chatBotInfo.avatar
                    })) || [];
                const result = [
                    ...list,
                    {
                        robotName: chatBotInfo.name,
                        robotAvatar: chatBotInfo.avatar,
                        answer: chatBotInfo.statement && convertTextWithLinks(chatBotInfo.statement),
                        isStatement: true
                    }
                ];
                dataRef.current = result;
                setData(result);
            })();
        }
    }, [mode, chatBotInfo]);
    // mode iframe end

    // mode individual start
    React.useEffect(() => {
        if (mode === 'individual' && uid) {
            (async () => {
                const res: IConversation = await conversation({ appUid: uid });
                if (res) {
                    setConversationUid(res.uid);
                } else {
                    setConversationUid('');
                    setIsFinish(true);
                    setData([]);
                    dataRef.current = [];
                }
            })();
        }
    }, [mode, uid]);

    React.useEffect(() => {
        if (mode === 'individual' && conversationUid) {
            (async () => {
                const res: any = await getChatHistory({ conversationUid, pageNo: 1, pageSize: 10000 });
                const list = res.list.map((v: any) => ({
                    ...v,
                    robotName: chatBotInfo.name,
                    robotAvatar: chatBotInfo.avatar
                }));
                const result = [
                    ...list,
                    {
                        robotName: chatBotInfo.name,
                        robotAvatar: chatBotInfo.avatar,
                        answer: chatBotInfo.statement && convertTextWithLinks(chatBotInfo.statement),
                        isStatement: true
                    }
                ];
                dataRef.current = result;
                setData(result);
                setIsFinish(true);
            })();
        }
        if (mode === 'individual' && !conversationUid) {
            const result = [
                {
                    robotName: chatBotInfo.name,
                    robotAvatar: chatBotInfo.avatar,
                    answer: chatBotInfo.statement && convertTextWithLinks(chatBotInfo.statement),
                    isStatement: true
                }
            ];
            dataRef.current = result;
            setData(result);
            setIsFinish(true);
        }
    }, [mode, chatBotInfo]);

    // 加载完历史再请求
    useEffect(() => {
        if (mode === 'individual' && messageData && chatBotInfo && uid && isFinish) {
            doFetch(messageData);
        }
    }, [mode, messageData, chatBotInfo, uid, isFinish]);
    // mode individual end

    React.useEffect(() => {
        // 清理语音识别对象
        return () => {
            recognition.stop();
            recognition.onresult = null;
        };
    }, []);

    function convertTextWithLinks(text: string): JSX.Element {
        const hashtagRegex = /#([^#]+)#/g;

        const parts: (JSX.Element | string)[] = [];
        let lastIndex = 0;

        let match;
        while ((match = hashtagRegex.exec(text)) !== null) {
            parts.push(text.slice(lastIndex, match.index));
            const hashtagContent = match[1];
            parts.push(
                <a
                    key={match.index}
                    className="text-[#7C5CFC] cursor-pointer"
                    onClick={() => {
                        doFetch(hashtagContent);
                    }}
                >
                    {hashtagContent}
                </a>
            );
            lastIndex = hashtagRegex.lastIndex;
        }

        if (lastIndex < text.length) {
            parts.push(text.slice(lastIndex));
        }

        return <>{parts}</>;
    }

    React.useEffect(() => {
        if (isFetch && scrollRef?.current) {
            const scrollContainer = scrollRef.current;
            const contentElement = contentRef.current;
            scrollContainer.scrollTop = contentElement.scrollHeight;
        }
    });

    const handleKeyDown = async (event: any) => {
        // 按下 Shift + Enter 换行
        if (event.shiftKey && event.keyCode === 13) {
            event.preventDefault();
            setMessage(message + '\n');
        } else if (!event.shiftKey && event.keyCode === 13) {
            event.preventDefault();
            // 单独按回车键提交表单
            await handleOnSend();
        }
    };

    const doFetch = async (message: string) => {
        setMessage('');
        setMessageData('');
        const newMessage: IHistory = {
            robotName: chatBotInfo.name,
            robotAvatar: chatBotInfo.avatar,
            message,
            createTime: new Date().getTime(),
            answer: '',
            isNew: true
        };
        const newData = [...dataRef.current, newMessage];
        dataRef.current = newData;
        setData(newData);

        setIsFetch(true);
        try {
            let resp: any;
            if (mode === 'iframe') {
                resp = await shareMessageSSE({
                    scene: statisticsMode,
                    query: message,
                    mediumUid,
                    conversationUid: jsCookie.get(conversationUniKey)
                });
            }
            if (mode === 'test') {
                resp = await messageSSE({
                    appUid: appId,
                    scene: 'CHAT_TEST',
                    conversationUid,
                    query: message
                });
            }
            if (mode === 'individual') {
                resp = await marketMessageSSE({
                    appUid: uid,
                    conversationUid,
                    query: message
                });
            }
            setIsFirst(false);

            const reader = resp.getReader();
            const textDecoder = new TextDecoder();
            let outerJoins: any;
            while (1) {
                let joins = outerJoins;
                try {
                    const { done, value } = await reader.read();
                    if (done) {
                        const copyData = [...dataRef.current];
                        copyData[dataRef.current.length - 1].isNew = false;
                        dataRef.current = copyData;
                        setData(copyData);
                        setIsFetch(false);
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
                        console.log(bufferObj, 'bufferObj');
                        if (bufferObj?.code === 200) {
                            jsCookie.set(conversationUniKey, bufferObj.conversationUid);
                            setConversationUid(bufferObj.conversationUid);

                            // 处理流程
                            if (bufferObj.type === 'i') {
                                const copyData = [...dataRef.current];
                                const process = copyData[copyData.length - 1].process || [];
                                const content = JSON.parse(bufferObj.content);
                                // 处理文档（文档状态默认不更新）
                                if (content.showType === 'docs') {
                                    content.data = uniqBy(content.data, 'id');
                                    copyData[copyData.length - 1].process = [...process, content];
                                    dataRef.current = copyData;
                                    setData(copyData);
                                }
                                // 处理链接
                                if (content.showType === 'url' || content.showType === 'tips') {
                                    //判断时候copyData.process里时候有同样id的对象，有的话就替换，没有的话就插入
                                    const index = copyData[copyData.length - 1].process
                                        ?.filter((v: any) => v.showType === 'tips')
                                        ?.findIndex((v: any) => v.id === content.id);

                                    if (index > -1) {
                                        // 替换
                                        copyData[copyData.length - 1].process[index] = content;
                                        dataRef.current = copyData;
                                        setData(copyData);
                                    } else {
                                        copyData[copyData.length - 1].process = [...process, content];
                                        dataRef.current = copyData;
                                        setData(copyData);
                                    }
                                }
                            }
                            if (bufferObj.type === 'm') {
                                // 处理结论
                                const copyData = [...dataRef.current];
                                copyData[copyData.length - 1].answer = copyData[dataRef.current.length - 1].answer + bufferObj.content;
                                copyData[copyData.length - 1].isNew = true;
                                dataRef.current = copyData;
                                setData(copyData);
                            }
                        } else if (bufferObj && bufferObj.code !== 200) {
                            dispatch(
                                openSnackbar({
                                    open: true,
                                    message: `[${bufferObj.code}]-${bufferObj.error}`,
                                    variant: 'alert',
                                    alert: {
                                        color: 'error'
                                    },
                                    close: false
                                })
                            );
                        }
                    });
                } catch (e) {
                    break;
                }

                outerJoins = joins;
            }
        } catch (e: any) {
            const copyData = [...dataRef.current]; // 使用dataRef.current代替data
            if (e.message === 'Request timeout') {
                copyData[copyData.length - 1].answer = '机器人超时，请重试';
            } else {
                copyData[copyData.length - 1].answer = '机器人异常，请重试';
            }
            copyData[copyData.length - 1].status = 'ERROR';
            dataRef.current = copyData;
            setData(copyData);
            setIsFetch(false);
            copyData[copyData.length - 1].isNew = false;
        } finally {
            setIsFetch(false);
        }
    };

    // handle new message form
    const handleOnSend = async () => {
        if (!message.trim()) {
            return;
        }
        doFetch(message);
    };

    const handleClean = () => {
        setAnchorEl(null);
        setData([]);
        dataRef.current = [];
        setConversationUid('');
        jsCookie.remove(conversationUniKey);
    };

    const [anchorEl, setAnchorEl] = React.useState<Element | ((element: Element) => Element) | null | undefined>(null);
    const handleClickSort = (event: React.MouseEvent<HTMLButtonElement> | undefined) => {
        setAnchorEl(event?.currentTarget);
    };

    const handleCloseSort = () => {
        setAnchorEl(null);
    };

    return (
        <div className="h-full relative flex justify-center">
            {mode === 'individual' && width > 1300 && (
                <div
                    className="rounded-tl-lg rounded-bl-lg h-full  min-w-[231px] overflow-y-auto  bg-white"
                    style={{ borderRight: '1px solid rgba(230,230,231,1)' }}
                >
                    <div className="h-full  px-[8px]">
                        <div className="h-[44px] flex items-center justify-center text-lg">AI员工</div>
                        <div className="bg-white rounded-md">
                            {botList?.map((item, index) => (
                                <>
                                    <div
                                        key={index}
                                        className={`w-[220px] h-[75px] flex items-center justify-start cursor-pointer p-[8px] border-b-[1px] border-solid border-[rgba(230,230,231,1)] ${
                                            (mediumUid || uid) === item.value ? 'shadow-lg' : ''
                                        }`}
                                        onClick={() => {
                                            setUid && setUid(item.value);
                                        }}
                                    >
                                        <div className="w-[40px] h-[40px]">
                                            <img src={item.avatar} alt="" className="w-[40px] h-[40px] rounded-md" />
                                        </div>
                                        <div className="ml-2 h-full">
                                            <div className="text-lg line-clamp-2">{item.name}</div>
                                        </div>
                                    </div>
                                </>
                            ))}
                        </div>
                    </div>
                </div>
            )}
            <div
                className={`h-full flex flex-col max-w-[768px] ${
                    mode === 'individual' ? 'rounded-tr-lg rounded-br-lg bg-white ' : ''
                }   w-full`}
            >
                <div className={`flex items-center p-[8px] justify-center h-[44px] flex-shrink-0`}>
                    {showSelect ? (
                        <Popover
                            content={
                                <div className="h-[600px] overflow-y-auto">
                                    <div className="flex justify-center">切换员工</div>
                                    {botList?.map((item, index) => (
                                        <div
                                            key={index}
                                            className={`flex items-center justify-center cursor-pointer mt-2 p-[8px] border-[1px] border-solid rounded-lg hover:border-[#673ab7] ${
                                                (mediumUid || uid) === item.value ? 'border-[#673ab7]' : 'border-[rgba(230,230,231,1)]'
                                            }`}
                                            onClick={() => {
                                                if (mode === 'iframe') {
                                                    setMUid && setMUid(item.value);
                                                }
                                                if (mode === 'individual') {
                                                    setUid && setUid(item.value);
                                                }
                                            }}
                                        >
                                            <div className="w-[40px] h-[40px]">
                                                <img src={item.avatar} alt="" className="w-[40px] h-[40px] rounded-md" />
                                            </div>
                                            <div className="ml-2">
                                                <div className="text-lg">{item.name}</div>
                                                <div className="text-sm w-[320px] text-[#9da3af] mt-1 h-[60px] line-clamp-3">
                                                    {item.des || '无'}
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            }
                            placement="bottom"
                            trigger="click"
                            open={open}
                            onOpenChange={setOpen}
                        >
                            <div className="flex items-center justify-center cursor-pointer">
                                <div className="w-[28px] h-[28px] flex justify-center items-center">
                                    <img className="w-[28px] h-[28px] rounded-md object-fill" src={chatBotInfo.avatar} alt="" />
                                </div>
                                <span className={'text-lg font-medium ml-2'}>{chatBotInfo.name}</span>

                                {open ? <ExpandLessIcon className="ml-1 " /> : <ExpandMoreIcon className="ml-1" />}
                                <span className="text-xs ml-1 text-[#697586]">可切换员工</span>
                            </div>
                        </Popover>
                    ) : (
                        <div className="flex items-center justify-center cursor-pointer">
                            <div className="w-[28px] h-[28px] flex justify-center items-center">
                                <img className="w-[28px] h-[28px] rounded-md object-fill" src={chatBotInfo.avatar} alt="" />
                            </div>
                            <span className={'text-lg font-medium ml-2'}>{chatBotInfo.name}</span>
                        </div>
                    )}
                </div>
                <Divider variant={'fullWidth'} />
                <div className="flex-grow flex justify-center overflow-y-auto w-full" style={{ scrollbarGutter: 'stable' }}>
                    <div className={'max-w-[768px] w-full'}>
                        <div
                            style={{
                                width: '100%',
                                overflowX: 'hidden',
                                height: '100%'
                            }}
                            ref={scrollRef}
                        >
                            <div ref={contentRef}>
                                {chatBotInfo.enableIntroduction && (
                                    <Card className="bg-[#f2f3f5] mx-[12px] mt-[12px] p-[12px] flex">
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
                                <CardContent className="!p-0">
                                    <ChatHistory theme={theme} data={data} />
                                </CardContent>
                            </div>
                        </div>
                    </div>
                </div>
                {mode === 'individual' ? (
                    <div className="flex-shrink-0 flex justify-center w-full mb-1 ">
                        <div className="w-full max-w-[768px] text-sm rounded-lg bg-white shadow-lg pt-3 px-1 pb-0 border border-[#E3E4E5] border-solid relative top-[20px]">
                            <Grid container spacing={1} alignItems="center" className="px-0 sm:px-[12px] flex-nowrap">
                                <Grid item className="!pl-0">
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
                                <Grid item xs={12} sm zeroMinWidth className="!pl-0">
                                    <OutlinedInput
                                        id="message-send"
                                        fullWidth
                                        multiline
                                        value={message}
                                        onChange={(e) => setMessage(e.target.value)}
                                        placeholder="请输入想咨询的问题"
                                        className="!pt-0"
                                        onKeyDown={handleKeyDown}
                                        minRows={1}
                                        maxRows={3}
                                        endAdornment={
                                            <>
                                                <InputAdornment position="end">
                                                    {!isListening ? (
                                                        <Tooltip arrow placement="top" title={'语音输入'}>
                                                            <IconButton
                                                                disableRipple
                                                                color={'default'}
                                                                onClick={startListening}
                                                                aria-label="voice"
                                                                className="p-0"
                                                            >
                                                                <KeyboardVoiceIcon />
                                                            </IconButton>
                                                        </Tooltip>
                                                    ) : (
                                                        <Tooltip placement="top" arrow title={'停止语音输入'}>
                                                            <div
                                                                onClick={stopListening}
                                                                className="w-[30px] h-[30px] rounded-full border-2 border-[#727374] border-solid flex justify-center items-center cursor-pointer"
                                                            >
                                                                <div className="w-[16px] h-[16px] rounded-sm bg-[red] text-white flex justify-center items-center text-xs">
                                                                    {time}
                                                                </div>
                                                            </div>
                                                        </Tooltip>
                                                    )}
                                                </InputAdornment>
                                                <InputAdornment position="end" className="relative">
                                                    {isFetch ? (
                                                        <Tooltip placement="top" arrow title={'请求中'}>
                                                            <IconButton
                                                                disableRipple
                                                                color={message ? 'secondary' : 'default'}
                                                                aria-label="send message"
                                                            >
                                                                <PendingIcon />
                                                            </IconButton>
                                                        </Tooltip>
                                                    ) : (
                                                        <Tooltip placement="top" arrow title={'发送'}>
                                                            <IconButton
                                                                disableRipple
                                                                color={message ? 'secondary' : 'default'}
                                                                onClick={handleOnSend}
                                                                aria-label="send message"
                                                            >
                                                                <SendIcon />
                                                            </IconButton>
                                                        </Tooltip>
                                                    )}
                                                </InputAdornment>
                                            </>
                                        }
                                        aria-describedby="search-helper-text"
                                        inputProps={{ 'aria-label': 'weight', maxLength: 100 }}
                                    />
                                </Grid>
                            </Grid>
                            <div>
                                <div className="flex justify-end px-[24px]">
                                    <div className="text-right text-stone-600 mr-1">{message?.length || 0}/100</div>
                                </div>
                            </div>
                        </div>
                    </div>
                ) : (
                    <div className="flex-shrink-0 flex justify-center w-full">
                        <div className="w-full max-w-[768px] p-[8px] ">
                            <Grid container spacing={1} alignItems="center" className="px-0 sm:px-[12px] flex-nowrap">
                                <Grid item className="!pl-0">
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
                                <Grid item xs={12} sm zeroMinWidth className="!pl-0">
                                    <OutlinedInput
                                        id="message-send"
                                        fullWidth
                                        multiline
                                        value={message}
                                        onChange={(e) => setMessage(e.target.value)}
                                        placeholder="请输入想咨询的问题"
                                        className="!pt-0"
                                        onKeyDown={handleKeyDown}
                                        minRows={1}
                                        maxRows={3}
                                        endAdornment={
                                            <>
                                                <InputAdornment position="end">
                                                    {!isListening ? (
                                                        <Tooltip arrow placement="top" title={'语音输入'}>
                                                            <IconButton
                                                                disableRipple
                                                                color={'default'}
                                                                onClick={startListening}
                                                                aria-label="voice"
                                                                className="p-0"
                                                            >
                                                                <KeyboardVoiceIcon />
                                                            </IconButton>
                                                        </Tooltip>
                                                    ) : (
                                                        <Tooltip placement="top" arrow title={'停止语音输入'}>
                                                            <div
                                                                onClick={stopListening}
                                                                className="w-[30px] h-[30px] rounded-full border-2 border-[#727374] border-solid flex justify-center items-center cursor-pointer"
                                                            >
                                                                <div className="w-[16px] h-[16px] rounded-sm bg-[red] text-white flex justify-center items-center text-xs">
                                                                    {time}
                                                                </div>
                                                            </div>
                                                        </Tooltip>
                                                    )}
                                                </InputAdornment>
                                                <InputAdornment position="end" className="relative">
                                                    {isFetch ? (
                                                        <Tooltip placement="top" arrow title={'请求中'}>
                                                            <IconButton
                                                                disableRipple
                                                                color={message ? 'secondary' : 'default'}
                                                                aria-label="send message"
                                                            >
                                                                <PendingIcon />
                                                            </IconButton>
                                                        </Tooltip>
                                                    ) : (
                                                        <Tooltip placement="top" arrow title={'发送'}>
                                                            <IconButton
                                                                disableRipple
                                                                color={message ? 'secondary' : 'default'}
                                                                onClick={handleOnSend}
                                                                aria-label="send message"
                                                            >
                                                                <SendIcon />
                                                            </IconButton>
                                                        </Tooltip>
                                                    )}
                                                </InputAdornment>
                                            </>
                                        }
                                        aria-describedby="search-helper-text"
                                        inputProps={{ 'aria-label': 'weight', maxLength: 100 }}
                                    />
                                </Grid>
                            </Grid>
                            <div>
                                <div className="flex justify-end px-[24px]">
                                    <div className="text-right text-stone-600 mr-1 mt-1">{message?.length || 0}/100</div>
                                </div>
                            </div>
                            <div className="w-full flex justify-center">
                                <div className="flex justify-center items-center">
                                    <svg
                                        version="1.1"
                                        id="Layer_1"
                                        xmlns="http://www.w3.org/2000/svg"
                                        xmlnsXlink="http://www.w3.org/1999/xlink"
                                        x="0px"
                                        y="0px"
                                        width="18px"
                                        height="18px"
                                        viewBox="0 0 18 18"
                                        enableBackground="new 0 0 24 24"
                                        xmlSpace="preserve"
                                    >
                                        <image
                                            id="image0"
                                            width="18"
                                            height="18"
                                            x="0"
                                            y="0"
                                            xlinkHref="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAgAAAAIACAMAAADDpiTIAAAABGdBTUEAALGPC/xhBQAAACBjSFJN
                AAB6JgAAgIQAAPoAAACA6AAAdTAAAOpgAAA6mAAAF3CculE8AAABFFBMVEUAAAAbidsSptUZmtcV
                p9MWn9cUp9IIxsYA3bgA37kA27YhhN4Wo9QXnNsTp9MXntYVodUTptMMvcoA4LoA3roA3rUA4rwH
                zcIRsc8Up9UdiuIeiOEdiOIOs8yMAP9DW+tBXOlDWupFWuw1beZEXOtgOPJRS+9WRO8qeOU8Y+li
                OPINvcqOBP90H/iOAv+NA/8Xmtkakt4VodcJxsQtdOVrLvdgPfRWS/JOVPB+FvtyKPhoNfYSrNFf
                P/QUptUXn9dfQPRIWu9gP/Q8betcQfQArd46ZegqgOcEtOJrL/cCsuAhi+cDsd46bes1behxKPgA
                rdsFstsDst0pgeVFXu9cQ/NpM/ZbQ/M5b+lfQfOSAP/////updnfAAAAW3RSTlMAHCtHV3KCYlM3
                HB8vTV18qrqaelwfPYqqiz1cenwfii+6XZqLTap8iqqaTT2KelyaiqpsbHqKmqqKmqqauop6i3xd
                TS8ffGw9fHqKXJpNTRw4U2NygnJXRyscgI11jwAAAAFiS0dEW3S8lTQAAAAHdElNRQfnBgcPKQZz
                ezFgAAAgBElEQVR42u2d6WPbVnbFOZO004ayE9txRiPJrGl6WJkRaTXTxZaqluPWqWzX6bTpNv3/
                /5ASBBeQxPLevecuD8T5kG+RQfzuO+e+BUCvd0T6xS9++csvvvjiyy+//JOF/nStX/3qz/58oa++
                +sr6AjtJqH/y4MHDh19/882jEj1+/KSgb799an21nXDqP3j49del2Mvgr/Wd9WV34uskG/GP6vT4
                8a+fVKkrgYSVjfpHDTqtgZ8nQRcEKSqEfZXv76urgMT04OFvmtmH0u8qIC09ePhNCPzTYPhdI5CO
                Akd+xNDfyPqndWrSSSD8Bf5o+p0FeNfDh4HwY62/q4AEFNLtrwf/r4n4uxBwqn4EfZr3dxbgV/2w
                hp/c+HUW4Fox9JmDv7MAdwrv+lD4nzz51vpHd1rpQRR9euPfZYBLxdFHDf8uA3wopukH4+8KwF6x
                gx+Kv8sAY0UmPx5/VwCWivZ+XO/XFYC9oge/wPB/0h0LMFKfgP8RY9G/KwBXOqPglxj+XQFYiIRf
                in83D9RW3IKvNP7OAZRFwy/IvysATRHxn4p0f10BaCt+1Ud8+HcFoCgifmH+3UKQkqj4Re3/CepA
                QP/s7Ox8o7N+3/p2exMV/6NTWfyAAliwP7841KIKrG+6H5HxS9v/E24LcHZ2UaPzrgYyEVt/Hf6c
                FqCefl4CXQ0whr8Gf3oCNNPvbKDHwi+z97MnagKE4j/yEjgJfbTPij8tAfox+I+5BDjDX4c/KQFi
                8R9rCbDw6/CnJAAF/1GWQAr847eCqfiPrgR4+JX4x3cAHP4LnVlj0dLJMxZ+8eW/lWIDgIn/eEqA
                OfwfKfGP7AD753z+x5EDXP5K/h/JHzD8j8MEuPi1+EcGAIx/200gGf5RMwCM/W9NYGCNyS1+jfX/
                paICADj8c/3Fc2tSx84/KgDg/C8uhi+sWQmItfJ/XPwvRsOXz615ocUf/nr8YxoACf4LCxgOf2tN
                zB1/rQWgKP7Y9q9gAcN2xQDf/l1OAPoy+HMLGL5szWwAMPz1+EdMAOT4Ly1gOG5JDED4O5wACvLP
                LaAljUDHn2wBw+FfWtNj6wSBX60BjOAv0/5vdJkXwHCceCMAGf4e+cuO/4VerSsg6RjA8He4AyjO
                f50BaTcCIP5KDYAr/us2MOlGADH71wsAF/P/gl5tKyDNFQFM+/dI6wiQN/6FDFg0As+tacYLZP8e
                jwALrf/u6XJYVHKNAIy/TgMQs/+nw7/YBAzT2xqA8VdpAKK+FazFv9gEJFcBMP4qARB1/kt4Aaig
                0TDZCgC1/0oB4JT/QQGkMx3E8dcIgKjzvzoTgFyXw4MKSGM6iOOvEABxDwBq8t/vAjNNEqiAp6c4
                /vIBEPkAqFoDWFEACVTACZC//EvAIp//0+W/Pw1IYncQtvynEQCxz38rNoBLjYbJVQCUv3AAxA5/
                df7lBeC6Ar5H8hcOgOjXP+g2gNUFMBxfWXNW4S8bANHDX70BqC4At2dEcMt/4gFA+BCIPv/KAnC6
                NYQd/5IBQPkOjHoDUFsAHisA2v9JBsC3FP76DUB9AfirADB/OQOgfQbKIADqC8BbBYD5ixkA8Stg
                JvxLF4KczgbR/IU6QOpH4CwagKYCcFUBaP4yAfAdlb9JA9BYAI4qALn/IxcA9G9A2gRA6WbQjibW
                4NcC7v+KGQDjE6BGAVByHmBfTk6IoPkLGADnC7BWARBQAD4qAM4fbgC8DwBbBUBIAXioAOwCsIAB
                ML//bMa/qQfMZX5SFM8fOwXkfv7bLACae8BcxgtC2A2ApTzht+QfkgDmFYBeAIAaAHneX5BdAAQX
                wNBwOUCAP6wDROC3NICwFiCT4YIQfAIA6wC/w3z225B/YAuQ6WWL+GMMADH4MxkGQHgCDM0mg/gJ
                AMYAUPhNAyA8ATKZTAYl+PMNABL9K1nyjzEAmwoQaAD5BgCkbxsAcQawkPpJ4acS/JkGAMVvGwAR
                LWAu9Z1BgQaQZwBI71/K1ABGsQWg3QhKNAAcA0DTt9sEzhWbANptgMAKMMMA4IO/Zx0AkS2gehsg
                0gBSDUCAfs84ACgGoLoiKNIAkAxAYvBnsg2AymfCJpPpdLbWdDoZj00aQd63f4EGIETfOgBKpwCT
                yaxU00IRKLUBIg1gvAFIDf5MtgEwOhz501mNptN1DahsDcs0ALEGIEjf2gD2O8B6+hsjWFaKRiOI
                PgNOMADJwZ/JUwc4CaC/LQGFNkCmAYgxAGH6rjrAYPxLTRTaAJkVgHADAG3018lPAMThz11AuA0Q
                2QIINgDSk93R8hIA0fjzEpC9OTIrAGEGoELf2gBGLPyZRPtAoRlgwFFg6b5vK1MDuGTzF60AoRlg
                81FgNfrWHeArNv6F5JaEpQKg3gAU+r6CPPAPmfjX6LXUvRELgJoWUM/6czk4BcAb/oIhIBYA1S2g
                Mn3jDhDFfzaTuTliAXDqY/Bnsj8IzrR/QQsQC4ByAzCg7+Ag+BiBX6YC5ALg1Mfgz2RpAK9A9r+U
                QB8oFgAHBqCz3lcmyykglL+ABUjtARwYgO6kb0eWATDC8of3gfAXgW312MXgz2QYACNU+ydlAUKb
                wJlcDP5MhgaA5w+2ALkOcJMAtoM/k50BSPDHWoBcB7hqAY0HfyY7AxDhD7UAuSWA3ADMB38mMwMY
                4ab/QhYgGAALA7Ca8+/JzACy8S/BH1gAggFw6oN+z84AhPwfmQFyBnB9fWbNfS2rNSBB/jALkDKA
                67+6uLDmvpER/1eC/FEWILQGeJ39/nNr7msZfhJCjj/oaJDEGuAP1/kN6FuDX8mmA7xEbf9XCZIB
                AlPA6xV+PwZg900oSf6QPUH8gwDX21tw1AYgzx/SBKA3Aa6L98Aa/FoWBqDBH5AB4CngDn43CWBh
                AEv+IguA2AKATgGv926ClwTQN4D8+J84f34GIA1gH/8RG8AIcvxfowBgBnB9fXgbjtYARojHf8LE
                XAlAGUAZfjctoLoBKPLnNgEYAyjH7yYBlA1g/fivQgPALgCIAVTgd5MAygagy5+5FAQwgB+q8B+p
                AWwe/1doAJfi3BqAAVxX34pjNIDt639UGgBuAbAN4LruZliTX0nTALb8lQKAVwBcA6jF7yUBFLeB
                C29/0uPPKQCeAVw33A4nCaDHv/j2N60GYMZZCGAZQBP+4zOAIn+1BoBVAAwDuG7kf2wGsPPyR8UA
                YBQAwwCa8XtpAbUMwI4/vQDIBhCC30sCGOBXbQAYBUA1gCD8XhJAxwD2+Gs2AIwCIB4ECuR/RAaw
                /+5/3QCgTwMl8R+RAVwefPxHNwDIBUB5FiB7ziNQ1uhzyfM//PaPcgCQC4DQAgYPfy8JIG4AJZ9+
                0g4A6m5gfAsYgd9LAhjwVw8AagFEG0AU/6MwgNIvv6kHAPFASOzDIFH4Ly58PBEsiv+y9MuP6gFA
                nQVGzgEj+ftIAFEDqPjwo3oAEAsg7pVwP8TeHR8JoI/fIACIk4CoOWDs8G+9AYyqvvtrEADEHjCm
                BYzn72MRQI7/sEoGAUBLgIg5IAG/jwSQMoBq/CYBQEuAcAOg8PeRAOr4TQKAmADBLSCJf3sN4LKO
                v0kA0FYBQhMguvvP1VoDqMVvEwC0FiAwAUjD/8JHCyjwLEA9fqE3QTaJlACBq4BU/i4SAP4sQBN+
                mwCgGUDYIkD4zu+ePCQA2gAqZ/62HaDgHIAY/xftNIDG4W9lAGIJQLX/Cx/7QFgDCMBv1AHSEuB3
                ovxdJADSAELwWwWA1CIAh7+HBAAaQBB+qwCQWgbm8G+XAQTiT8sAGltAFn8PiwAoAwjFn5YBNCYA
                efq3lIcEwBhA88zPugOkGUBTAvD4e0gAiAGMwoe/VQAQDaB+DkCf/rfKAGLwmwWAyGlg5vhviQFE
                4U/MAJ6K8vfQArINIA6/mQEQXw/4O1H+DhKAawCx+NPqAOsTgM3fQwLwDCAav9EuMPmZ8Kei/FM3
                AAJ+KwOgvh/2RJK/h30ghgFQ8Ke1BtirSwAAfw8JoIs/sTXAugeCeOu/uRwkAPUoKBG/lQGQXxB+
                Isk/XQOg4rcyAPoL4p9J8k/VAOj4jQyA8X74ihaAuwCcK8kWMG7Rd18m/BlvBn0qyd9BAkTPAXn4
                jaaAjC+EVLQAiAmAiwSINAAmfqMA4Hwh5pkg/+QMgIs/pUfB1iqdBEIawOQMgI8/pWdBVyptAUAN
                gIMWMMIA+PSNDID3gagTwQBwkADBBgDBb2MAvI9EPpMLAAcJEGoAGPwJvQ1kq1O5AEjGAFD4TQyA
                yb+sBUDxT8QAYPjTeR9cQSUPBaMaAActYIABAPGn80LIgp6JNQAOEqDZAJD4LRaBmd+I7pVsBMAa
                AAcJ0LANBJj27yiVNwLvSC4A7A2gfh8Yjd/AAAD8T+QCwLcBwOkbGAA7/3uHPSAuABwYQHULKIBf
                3wAQ/A96QFwA2D8OUtkCiuBXnwJC+O8vAwENwD4BKgxABr/2FJC3/r/RUzkDME+AUgO4FMKvbQAg
                /vs9IK4D9GkA+MbfyAAA7X+uvR4Qx9+jAQjiVzYAGP+9HrDVBiBJX9kAcPx3e0BgB+jOAGTx6xoA
                kH9PqgO0nwPuGIA0flUDwEz/cp1IGYD5PmDRAMTxaxoAcvjvFUA7DUC089M3ACz/nUkA0gDsW0BN
                /IoGAOa/MwlAGoB5C3im5f2qBoBa/dmqcBgAOAV0YgBa+NUMAD38ezuzwFYZQF8Tv5YBCPB/2tYO
                4K8V8SsZwGvk7G+tk3YawNVvNfHrGIDA8O8VJwEtMoCr17OxagFoGIAM/8L7IVtjAFeLuzVtmwHg
                u/+VtrPAlhjA1fJ+tc0AhIZ/rzAJaMc2UI6/dQYgx39bAMAEsDKAwdX6hrXLAATxb2eB6RvA1QZ/
                ywyAyX+wVGMBpG4ABfyz2aRFBsDAP7haTIc2el26jHDSDgO42r1pLTIAMv+rq5K/dlgD62WApE+C
                7f/U9hgAHX/on/wenwDaBnD4W1VbQEkDoPK/qvujuy7wLPWHQUp+q24LKGcAZPyvG/5wcVHpWdIG
                UJpzbTEAkeG/0tYEfoNeBVQ0gHL8LTEAgfQvrYDTZJ8Hvqr6pW0wgNdU/oPQf2FdAafgBNAygOo6
                b4MBCA//pfL/4Sm6BdAxgLrfmb4B0Jd+IvivOsGn4ARQMYDan5m+AZD5D5q6/5J/5wRcAAoG0FDl
                qRuAzvBfalsACb0UsOlXJm4AV/RTf9H8l7X2PXYSaI1feRUYbgCMjZ94/ksL+B6aALIGMAj5jSkb
                AGfbl8I/+we/RyaAaAd4FfQTdbeB3OCn8d8UAMoABDvAMPzKLSD0nYAG/LMMeAZMADkDCMWv3AJ6
                wU/mPxssCwCVAGL4w6e3iRoA88wXmf/iHwYWgFAHGPPr0jQAxtSPyX9VAJ4DIO7HJbkIxD3yy+Cf
                F4Djr4NG/rYUF4HYJ74HnH/9dbYZiEkAgQCILu30DIB/4J/FH1gA+ACId7bkDADxvEfc/k9ZAWAS
                AB0AlGBLzACu7PnjCgAcAKS+JjEDgDzuxWkAM/3NogAQCYANAOKvSsoAME/7cfnP/nZRAN4CgPyj
                EjIA0MOeAy7/2d/1ThEJAAwAek2nsw8Me9aX2QAs9AZSALgACF7zL1EqBoB71JvP/+2iAPgtAIw/
                B79uC0g3AOCT/uwGYDa7WRSAmwaAhV+5BaQaAGTmt9KAz392+6b3914aAGY9p2AASPyIAJjN7t70
                /sFHALDtLAEDwL7nBRAAs7eLAvhHD/z5P8b/PjD4NT8DAP/ZzaIAAj6tLt0AIGrZ+0EQ+FueEAEw
                u+UXAJ8/Ar93A8C/5Aty12Z37AJgN4CYH+LbAATe8TaA3LW3WQGcWfJnzvw28rwNJPKKP0gALBLg
                bs4qADZ/DH7P20Ayb3gE3bhFAfyeUwDMCQAMv18DEHrB5wB03+6yAugb8cfhd2sAYu93xQRA1gJw
                CoDFH4nfqQHIvd4XdfNulwXQM+Af8aBHiDwagOTbnVH3bcH/7l2P2ASw+EPxe9wHlsQPu31vOQXA
                4I/G7+8giCh+WAe4TIC7f+qRMoA+/4Pjd2cAsvhhHWChAOItwBV/XwYgjR9nAMsEuPvn7G+q8RfA
                78sAxPEDDaBQAJEWQOUvgt/TNpACfuBNXCbA3fvlX43aECLu/wW934cgL9tA5Fe7xgl34+4KBRCx
                GORr+LsxAOxhr2rhFlDyBLhb/d3gECDyl8LvZBFICz+uA1wnwJv1Xw6sAHf8PawCq+FHGsAqAeab
                Px2SAu7wezAA7utdYjTA3bi3+wXQ6zd2gg75mxuA3uDPBDSAPAGyvaCtzlLDb24AuviRBrBKgGwr
                oKAaE6Dix2777cvWAJTxQw1glQDLleDmGjj3Nvdby9IA1PFDDWCVAPlC4F4J7NbA+Zmvhd+iDA1A
                H7+IAZQVwKoK+mdnZ4v/Mq5XnL+dAVjgFzGA1UKg98utkJUBmOCHGsC6BdwsBOIlP/yNDEBx1WdX
                A+Cdu1nzf8O/rnLJNv+5LAzADD/2lm4SYC5zrRrDX9kAlttAdvSxBrBpAXfXgRLjr2sAE1v8QgZw
                uAyQDH51A7DFL2QAlbPABPjrGsCPtvilDAA/C4z8ciVDmgYw0vsedpWQt27LHz4L1Br+qgYw0vse
                tsqNvdnynzu+zAZpGcBoxDgGiRPy1t2JFYAifyUDyPHbG8AAeOsKBoCdBSIvslEqBjC6XG2ImRuA
                xDYQehKgOPx1DGC03RC15j8A3rpboQJQ5a9gAKPCjnhrDQA4CVCb/S0lbgCjnRMR1vwHwFu3YwCw
                rSDkFYZI2ABGu+eh2msAc9AF6tq/tAHs4Zf7Hm6oBsBbt2MAqJ0Abf6SBjA6wC/1PVyT+3uzwx/U
                A6rzlzOAEvz2BoBcBNrlj9kJUOcvZgCl+O0NYIC7c3sGAOkB9fkLGUAp/Xa1gG/3DGDu6uqCJWIA
                VfhbNQe83SsAfg8IvLhgSRhAJf5WGwC/B7TgL2AANfjtDQDXAh7wZ68DmvCHvxKsDr8DA8Dd5P0A
                YLcAJvzRrwSrx+/AAGAJcHMHLgAb/lgDaMDfJgM4DABmD2jDH2kAo0b8bTKA28MC4PWABvO/GbID
                DMDfJgM4DADmMpANf9gUMAh/iwygJAB4LYD++t9SIAMIw+/AAKAfBkAmgBF/jAEE0vdgAAPQjbsF
                FwDqumKFMIBg/B4MAJQAN2X8GS2AFX+AAUTgd7APDLrRZQ0AqwWwaQABBhCF334fGHWjSwOAkQBG
                DQDbAOLwOzAA3NdBoQUwMOLPNIBY/K1pAW/uwAlgFQCsReBo/K1pASv40wvAKgA4i8AE/G0xgCr+
                5ASAXBVF9ACg4PdgAIih9raKP/k8qFUAkDtAGn4HBoC41dX854ZVSRLRAIj4PRjAAHDXbisLgLoV
                bMWfZgBk/C0xgGr+1BYgKQOg42+JAdTwn5tdFE2EKSAHvwcD4N/rGv53/0K7KKsOMH4KyMLvwQD4
                97qOPzEB+EVJVKwBbF7tcsQGUMufuBOYyBQw9LhHqw2glj+1BTDiH9cBvmLj92AA3Htdzz+xBIgy
                AD5+FwbAvNcN/ImPBCVwDACB34UBsO712wb8xARgFiVZ4R0gBH/6BtDIn5gARgYQHAAg/MkbwE0j
                f+IcwIZ/aACg8LswAM69buafVgKEGQAOvwsDYNzrAP5pJUCIAfAn/s4MgH6vQ/jPaRdlwz+kA0Ti
                T9wAmqZ/S9H2AegXxVFAAEDxezgLTr/Xze1/cgnQGABg/B7OgpPvdYj90xPApACaAgCOP2UDCOSf
                1DJwPX7Aqn+LDCAo/jOpViVPY+Xh78MASO126PBPKgGm2vh9GMBAlD/1MKBFAYy18fswgPhb/TbY
                /unHwQ34T9T5J2oAEcOffBgw/qrYmqrjT9QAovhTHwgyKICxNn4fBhDrtXH4E3ogaKLP34UBDET5
                kx8JVe8Bp+r4nRhA1J2OxU9/Jly9AMbq+BM0gGj+9LeCaBfARJ+/DwOIyNp4/IwXgynzn+rj92EA
                ESONwP/uXSoFMNbn78MABpL4OR8J0+U/0ceflgG8pfGf0y9Mlf9BALxiPuqXjAEE3mcafta7YVUL
                QH/4ezGAgSR+jgEEXRhKY338Lk4C9oISgOj+TAPQdICJAX8XR4GDxhkdP+/zAHr8p+rpn5ABMPAz
                PxCjVwBj/eHvxQCa7jILP/MTYWr8J/rD340BDOrxR5z6gBuAWgFMDIa/GwOoS4Ab3vBnfyNQaS9g
                asI/AQPg4md/JlipAMYG+BMwAD5+9ldidQ6E2PB3YgCVMQvAz/9OuEoBbBsAre7PkwEMBPGzDUCl
                AKYWw9+PAZQmAAY/3wA01oKN+Hs2ABR+vgFozAPHFvbv2QBg+AEGoFAAE5Ph78YA9m8wY89HxADE
                mwAr/l4MYLA7+JH4IQYgXQBW/N0YQDEBsPQxBiDcBU5N4v/CyzmQnduLxo8xANkmIOf/Sh2/l4Ng
                BQPA47/7PfgSBTS2sX93BgDt/DYCXaNgE2DG30sHmN9ccOe3Fv1ZgF0N2sffTQeY2asMfVAHuJQo
                f/32z5MBDMTwozrATEIZMDHj78YA7j+I4QcagFAGGPJ3YgD3Hz/J8QcagEwGTIymf14M4P7+48eP
                b+T4ozrApQQywJK/AwPI6C8kaADQy8VngCV/cwO4X+GXTABkAPTwFmDK33gNaE1fNAHm4IsGF4Ap
                f9MAuC/gT8gAwG3g2JK/ZQDc/+vHouQMANoBLgW0gKnV9o+xAewMflkDmAtcPpb/0Iy/lQHs0xc1
                AHgA9HAWMDHa/jc1gPsS/IIGgA+ATO3gb2EAZfQX+izF/1bmZ0AsYGx0/Gsj9SngfQV+wUUgiQDI
                hBr+lvyVA+B9JX3BBJAJgB7AAuz56wZADX3BFnAu94N4+Kerxz/sJoCqBnBfj1/OAKQCoMe0gM3j
                n4YNoJ4BNNAXNACxAOBVwGTz+LdlACh1gE2DX9IA5qK/rD/lDn9T/ionwd8H0Bc0AMEAyPRiTCmB
                wtt/LBsAjQAIoy9nAKIBsKyAYXQJ7Lz90bIBEO8AQ6xf1gDm0j+x11tAjCqB3Zd/mgaAsAGE05cz
                AHn+CwsYhtfAdO/dr6YBINoBRgx+QQMQbgCKFRBSApODbz+0NQDi6IsZgHgDkOvlGud4Oq0Z+yVf
                /mhnBxg5+OUMYK7Df9kGbGpgPDmsgumk4sN/lvyFDCBw0qdiAAOtAvhpH+yiDBaaZv8Z13z12TIA
                ZAyAMPjlDEClAcj1YkhR6zpAGn0pA1BqAHL9SCmAdnWAxMEvZgAfNPn3eq8SMwB0ANDpCxnAXJd/
                r5+WAWADgDH4xQxAsQHI9VMs/9acAuDR/yhzEuzftPnHN4ItOQXAxi9yFFS1ASRWgCF/WAAwvV+s
                A5hb8I9sBA0TABUACPwiHYAR/7hGMPkHASD0ZQxAbQVwXxGNoKEBQAIAhF/EANQnAFuFtwF25wAQ
                AQDDL2EABhMAQgXYJQA7ADDRL2YAJhOA+Aow488NACh+AQMw5l84HOCzBWAGABa/wBqQ8g4AuQLM
                EoAVAGj8+DWguTX9TCHLAVYFwAkAOH58ANyaTQCL6gdUgBF/RgDg8Qt0gIYTwJ0KcNsCMPjj8eMN
                wAn/gAUhowIgNwAS+PEG4IZ/cwXYLANRGwAZ/HADcMS/sQJS+iKAEH64AZguAB7qhb8CIAWAGH70
                FNAZ/4YKsCgAZ/zBAWC+ABhXAQb8KQ2AHH50ADjkX1sB+vwJDcDea3w9G4BL/nUVoF8A8QEgOfzB
                mwBO+ddUgH/+svixAeCWf3UFaPOPbgCE+UMDwDH/ygpwzl8YPzYAXPOvqgDdaWBsAyjOHxkAzvlX
                rAnqFkBcAyCOHxoA7vn3es9LCkB1L8Abf2QAuFr/r6yAV6YFENcAKPAHBkAS/MtOiChuB0fxV8CP
                3ANIhP+iAl6aFYA7/rgGYG6NNUb7bxDR4h81AdDgjwsAB+d/Y7Q3HVSaBkTxl1z63wgWAAm0/3UV
                oNQFRlzfew38R8x/rwJ0moCICaCK/eMagAT57y0IHCV/WAOQTPu/VwFj1Qzwxx8UALeJ8u/1Bi8V
                C6C1/OfWGDl6oZYBEQsASvxBDUCS8b/VT0oW0PH3qvXOgGwB+OMPagCTjf+CfpTPAH/5j2kAkh/+
                uV5IW0DH37nyGOj4Hyv/1faglAVE8NdZ/8U0gHNraFi9kLKAmP2flPi3aPjn+knGAmL2/7X4I86A
                tY7/MgZs+evs/35ETABbiD/TC7gFuDv/0/Gv1fNzKP7zqPO/WgHwmYt/3obFnyqdWQ3/dPi3dvjn
                6hvx12oAOv6NwsSAu8e/MPzbj3+hPqAEYh//VAqAjn+YuJ1A/OtfdAKAyf9Y8GdimUA8f50A6PhH
                iJ4DlLc/JcD/uPBnopUA6e2fKh0Ai/87F6/91lZ8CZzR3v6q0QHw+FujsFJcCRDxqxgAZ/33aPFn
                6p+F1gD92w8KBsDgf3vU/DOF2MA559Mf4vg/MfgfPf6l6muAav0riScA4/xHh3+j/vl5+dBnf/hT
                ehHgc4cfpUVDsK2C8wV7yFd/hVsAMv/jnPqFCfO555VkC4DKv+v91CTKn9r+dfjVJNkDUtu/Dr+i
                BAuAaP8dflXJFQCNf4dfWVIFQLP/Dr+6hAqANPw7/AaSKQAC/w8dfhNJFAAB/7sOv5U88O/oG8oc
                /02H31TgpeBY/u/cfeT12ATdDYzGb/3rO0ELII5/1/j5kA3+btbnRqAmIAp/R9+RIBkQg7/r+5wJ
                gD+cfxf8/sS1gHD8HX2fUsF/+67N73ZJWwwLCKT/oTvi6VrUiUAY/s74/YtC/1MI/g5+GooPgc/N
                B37fdb6fjuIqoLnx6+CnpvAKaLD+23ddu5+k3gd1grVj//ZDxz5lNZnAp+rcn7/rxn0LVGMCnyvg
                LwZ9R75NOqyBT58Obf92vhzyHflW6g9/+Pf/WOrnn3/+z//a6L//J9P//vGP/2d9gZr6fwApfYYx
                DHMWAAAAJXRFWHRkYXRlOmNyZWF0ZQAyMDIzLTA2LTA3VDE1OjQxOjA2KzA4OjAwLJ5v2AAAACV0
                RVh0ZGF0ZTptb2RpZnkAMjAyMy0wNi0wN1QxNTo0MTowNiswODowMF3D12QAAAAASUVORK5CYII="
                                        />
                                    </svg>
                                    <span className="text-[#596780] text-xs truncate leading-5 ml-1">
                                        <a href="https://mofaai.com.cn" className="text-violet-500" target={'_blank'}>
                                            Powered by 魔法AI
                                        </a>
                                    </span>
                                </div>
                            </div>
                        </div>
                    </div>
                )}
            </div>
            {mode === 'individual' && width > 1300 && <div className="min-w-[220px] h-full bg-[#f4f6f8]" />}
        </div>
    );
};
