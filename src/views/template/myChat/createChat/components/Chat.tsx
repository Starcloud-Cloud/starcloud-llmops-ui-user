import CleaningServicesSharpIcon from '@mui/icons-material/CleaningServicesSharp';
import KeyboardVoiceIcon from '@mui/icons-material/KeyboardVoice';
import MoreHorizTwoToneIcon from '@mui/icons-material/MoreHorizTwoTone';
import PendingIcon from '@mui/icons-material/Pending';
import SendIcon from '@mui/icons-material/Send';
import {
    Button,
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
    Tooltip,
    Typography,
    useMediaQuery,
    useTheme
} from '@mui/material';
import React, { useEffect, useMemo, useRef, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { getChat, getChatHistory, getSkillList, messageSSE, shareChat, shareChatBotList } from '../../../../../api/chat';
import { dispatch } from '../../../../../store';
import { openSnackbar } from '../../../../../store/slices/snackbar';
import { IChatInfo } from '../index';
import ChatHistory from './ChatHistory';
import { getShareChatHistory, shareMessageSSE } from 'api/chat/share';
import jsCookie from 'js-cookie';
import ExpandLessIcon from '@mui/icons-material/ExpandLess';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import { Popover, Select, Switch, Tag } from 'antd';
import { uniqBy } from 'lodash-es';
import { conversation, marketMessageSSE } from 'api/chat/mark';
import { useChatMessage } from 'store/chatMessage';
import { useWindowSize } from 'hooks/useWindowSize';
import { v4 as uuidv4 } from 'uuid';
import _ from 'lodash';
import { BpCheckbox } from 'ui-component/BpCheckbox';
import useUserStore from 'store/user';
import './chat.scss';
import { handleIcon } from './SkillWorkflowCard';
import HelpOutlineIcon from '@mui/icons-material/HelpOutline';
import { PermissionUpgradeModal } from './modal/permissionUpgradeModal';

const env = process.env.REACT_APP_ENV;
import ShareIcon from '@mui/icons-material/Share';
import useCopyToClipboard from 'react-use/lib/useCopyToClipboard';

const { Option } = Select;

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
    docs: any;
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
    isAds?: boolean;
    ads?: string;
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
                            inputProps={{ 'aria-label': 'weight', maxLength: 200 }}
                        />
                    </Grid>
                </Grid>
                <div>
                    <div className="flex justify-end px-[24px]">
                        <div className="text-right text-stone-600 mr-1 mt-1">{message?.length || 0}/200</div>
                    </div>
                </div>
            </div>
        </div>
    );
};

// 转换type
const transformType = (key: string) => {
    switch (key) {
        case 'news':
            return 'url';
        case 'content':
            return 'url';
        case 'image':
            return 'img';
        default:
            break;
    }
};
export function extractChatBlocks(data: any) {
    const chatBlocks: any[] = [];
    let currentBlock: any[] = [];
    let insideBlock = false;

    for (const item of data) {
        if (item.msgType === 'CHAT_FUN') {
            if (!insideBlock) {
                insideBlock = true;
                currentBlock.push(item);
            } else {
                currentBlock.push(item);
            }
        } else if (item.msgType === 'CHAT') {
            chatBlocks.push(item);
        } else if (item.msgType === 'CHAT_DONE' && insideBlock) {
            let currentData: any = {};
            let loop: any = [];
            let currentLoop: any = [];
            currentBlock.push(item);
            insideBlock = false;
            currentData.robotName = currentBlock[0].robotName;
            currentData.robotAvatar = currentBlock[0].robotAvatar;
            currentData.message = currentBlock[0].message;
            currentData.createTime = currentBlock[0].createTime;
            currentData.isNew = false;
            currentData.answer = currentBlock.find((v) => v.msgType === 'CHAT_DONE')?.answer || '';
            currentData.process = [];

            for (const block of currentBlock) {
                if (block.msgType === 'CHAT_FUN') {
                    currentLoop.push(block);
                } else if (block.msgType === 'FUN_CALL') {
                    currentLoop.push(block);
                    loop.push(currentLoop);
                    currentLoop = [];
                } else {
                    currentLoop = [];
                }
            }

            loop.forEach((item: { answer: string }[], index: string | number) => {
                currentData.process[index] = {
                    tips: '查询完成',
                    showType: item[0].answer && transformType(JSON.parse(item[0].answer).arguments?.type),
                    input: item?.[0]?.answer && JSON.parse(item[0].answer).arguments,
                    data: item?.[1]?.answer && JSON.parse(item[1].answer),
                    success: true,
                    status: 1,
                    id: uuidv4()
                };
            });

            chatBlocks.push(currentData);
            currentData = {};
            currentBlock = [];
        } else {
            if (insideBlock) {
                currentBlock.push(item);
            }
        }
    }
    return chatBlocks;
}

export const Chat = ({
    chatBotInfo,
    mode,
    statisticsMode,
    showSelect,
    botList,
    mediumUid,
    setMUid,
    uid,
    setUid,
    setChatBotInfo,
    shareKey
}: {
    chatBotInfo: IChatInfo;
    mode?: 'iframe' | 'test' | 'market' | 'share';
    statisticsMode?: string;
    showSelect?: boolean;
    botList?: any[];
    mediumUid?: string;
    setMUid?: (mediumUid: any) => void;
    uid?: string;
    setUid?: (uid: string) => void;
    setChatBotInfo: (chatBotInfo: IChatInfo) => void;
    shareKey?: string;
}) => {
    const theme = useTheme();
    const scrollRef: any = React.useRef();
    const contentRef: any = useRef(null);
    const location = useLocation();
    const searchParams = new URLSearchParams(location.search);
    const appId = searchParams.get('appId') as string;
    const permissions = useUserStore((state) => state.permissions);

    const [isListening, setIsListening] = React.useState(false);
    const [message, setMessage] = React.useState('');
    const [conversationUid, setConversationUid] = React.useState('');
    const [data, setData] = React.useState<IHistory[]>([]);
    const [time, setTime] = React.useState(1);
    const [isFirst, setIsFirst] = React.useState(true);
    const [isFetch, setIsFetch] = useState(false);
    const [open, setOpen] = useState(false);
    const [isFinish, setIsFinish] = useState(false);
    const [skillWorkflowList, setSkillWorkflowList] = useState<any[]>([]);
    const [skillOpen, setSkillOpen] = useState(false);
    const [openUpgradeModel, setOpenUpgradeModel] = useState(false);
    const [openUpgradeOnline, setOpenUpgradeOnline] = useState(false);
    const [openUpgradeSkillModel, setOpenUpgradeSkillModel] = useState(false);
    const [enableOnline, setEnableOnline] = useState<any>();
    const [selectModel, setSelectModel] = useState<any>();
    const [openToken, setOpenToken] = useState(false);

    const { messageData, setMessageData } = useChatMessage();
    const [state, copyToClipboard] = useCopyToClipboard();
    const navigate = useNavigate();

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

    // 左边联动右边,右边不联动左边
    useEffect(() => {
        setEnableOnline(chatBotInfo.enableSearchInWeb);
    }, [chatBotInfo.enableSearchInWeb]);

    // 左边联动右边,右边不联动左边
    useEffect(() => {
        setSelectModel(chatBotInfo.modelProvider);
    }, [chatBotInfo.modelProvider]);

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

    // mode share start
    useEffect(() => {
        if (shareKey && chatBotInfo && mode === 'share') {
            shareChatBotList(shareKey).then((res) => {
                const list = res.map((v: any) => ({
                    ...v,
                    robotName: chatBotInfo.name,
                    robotAvatar: chatBotInfo.avatar
                }));

                const chatBlocks = extractChatBlocks(list);
                setData(chatBlocks);
            });
        }
    }, [shareKey, chatBotInfo]);
    // mode share end

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
        if (mode === 'test' && conversationUid && isFirst && chatBotInfo.name) {
            (async () => {
                const res: any = await getChatHistory({ conversationUid, pageNo: 1, pageSize: 10000 });
                const list = res.list.map((v: any) => ({
                    ...v,
                    robotName: chatBotInfo.name,
                    robotAvatar: chatBotInfo.avatar
                }));

                const chatBlocks = extractChatBlocks(list);

                const result = [
                    ...chatBlocks,
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
            setConversationUid(jsCookie.get(conversationUniKey) || '');
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
                const chatBlocks = extractChatBlocks(list);
                const result = [
                    ...chatBlocks,
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

    // mode market start
    React.useEffect(() => {
        if (mode === 'market' && uid) {
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
        if (mode === 'market' && conversationUid) {
            (async () => {
                const res: any = await getChatHistory({ conversationUid, pageNo: 1, pageSize: 10000 });
                const list = res.list.map((v: any) => ({
                    ...v,
                    robotName: chatBotInfo.name,
                    robotAvatar: chatBotInfo.avatar
                }));
                const chatBlocks = extractChatBlocks(list);
                const result = [
                    ...chatBlocks,
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
        if (mode === 'market' && !conversationUid) {
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
        if (mode === 'market' && messageData && chatBotInfo && uid && isFinish) {
            doFetch(messageData);
        }
    }, [mode, messageData, chatBotInfo, uid, isFinish]);
    // mode market end

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

    // 重试
    const handleRetry = (index: number) => {
        const data = dataRef.current;
        const current = data[index];
        doFetch(current.message);
    };

    React.useEffect(() => {
        if (isFetch && scrollRef?.current) {
            const scrollContainer = scrollRef.current;
            const contentElement = contentRef.current;
            scrollContainer.scrollTop = contentElement.scrollHeight;
        }
    });

    // 首次进入
    React.useEffect(() => {
        if (scrollRef?.current && data.length) {
            setTimeout(() => {
                const scrollContainer = scrollRef.current;
                const contentElement = contentRef.current;
                scrollContainer.scrollTop = contentElement.scrollHeight;
            }, 1000);
        }
    }, [scrollRef?.current, data]);

    // 处理技能
    React.useEffect(() => {
        if (mode === 'test' && chatBotInfo.skillWorkflowList) {
            const copyData = _.cloneDeep(chatBotInfo.skillWorkflowList) || [];
            if (copyData.length) {
                setSkillWorkflowList([...copyData]);
            } else {
                if (chatBotInfo.uid) {
                    getSkillList(chatBotInfo.uid).then((res) => {
                        const appWorkFlowList =
                            res?.['3']?.map((item: any) => ({
                                name: item.appWorkflowSkillDTO?.name,
                                description: item.appWorkflowSkillDTO?.desc,
                                type: item.type,
                                skillAppUid: item.appWorkflowSkillDTO?.skillAppUid,
                                uid: item.uid,
                                images: item.appWorkflowSkillDTO?.icon,
                                appConfigId: item.appConfigId,
                                appType: item.appWorkflowSkillDTO?.appType,
                                defaultPromptDesc: item.appWorkflowSkillDTO?.defaultPromptDesc,
                                copyWriting: item.appWorkflowSkillDTO?.copyWriting,
                                disabled: item.disabled
                            })) || [];

                        const systemList =
                            res?.['5']?.map((item: any) => ({
                                name: item.systemHandlerSkillDTO?.name,
                                description: item.systemHandlerSkillDTO?.desc,
                                type: item.type,
                                code: item.systemHandlerSkillDTO?.code,
                                uid: item.uid,
                                images: item.systemHandlerSkillDTO?.icon,
                                appConfigId: item.appConfigId,
                                copyWriting: item.systemHandlerSkillDTO?.copyWriting,
                                disabled: item.disabled,
                                usage: item.systemHandlerSkillDTO.usage
                            })) || [];

                        const mergedArray = [...appWorkFlowList, ...systemList];
                        const enableList = mergedArray.filter((v) => !v.disabled);

                        setSkillWorkflowList(enableList);
                    });
                }
            }
        } else {
            if (chatBotInfo.uid) {
                getSkillList(chatBotInfo.uid).then((res) => {
                    const appWorkFlowList =
                        res?.['3']?.map((item: any) => ({
                            name: item.appWorkflowSkillDTO?.name,
                            description: item.appWorkflowSkillDTO?.desc,
                            type: item.type,
                            skillAppUid: item.appWorkflowSkillDTO?.skillAppUid,
                            uid: item.uid,
                            images: item.appWorkflowSkillDTO?.icon,
                            appConfigId: item.appConfigId,
                            appType: item.appWorkflowSkillDTO?.appType,
                            defaultPromptDesc: item.appWorkflowSkillDTO?.defaultPromptDesc,
                            copyWriting: item.appWorkflowSkillDTO?.copyWriting,
                            disabled: item.disabled
                        })) || [];

                    const systemList =
                        res?.['5']?.map((item: any) => ({
                            name: item.systemHandlerSkillDTO?.name,
                            description: item.systemHandlerSkillDTO?.desc,
                            type: item.type,
                            code: item.systemHandlerSkillDTO?.code,
                            uid: item.uid,
                            images: item.systemHandlerSkillDTO?.icon,
                            appConfigId: item.appConfigId,
                            copyWriting: item.systemHandlerSkillDTO?.copyWriting,
                            disabled: item.disabled,
                            usage: item.systemHandlerSkillDTO.usage
                        })) || [];

                    const mergedArray = [...appWorkFlowList, ...systemList];
                    const enableList = mergedArray.filter((v) => !v.disabled);

                    setSkillWorkflowList(enableList);
                });
            }
        }
    }, [mode, chatBotInfo]);

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

    const handleSSEData = (eventData: any) => {
        try {
            const subString = eventData.substring(5);
            const bufferObj = JSON.parse(subString);
            if (bufferObj?.code === 200) {
                if (env === 'development') {
                    console.log(bufferObj, 'bufferObj');
                }
                if (mediumUid) {
                    jsCookie.set(conversationUniKey, bufferObj.conversationUid);
                }
                setConversationUid(bufferObj.conversationUid);
                if (bufferObj.type === 'i' || bufferObj.type === 'docs') {
                    // 处理流程
                    const copyData = [...dataRef.current].filter((v: any) => !v.isAds);
                    const process = copyData[copyData.length - 1].process || [];
                    const content = JSON.parse(bufferObj.content);

                    // 处理文档（文档状态默认不更新）
                    if (content.showType === 'docs') {
                        content.data = uniqBy(content.data, 'id');
                        copyData[copyData.length - 1].docs = content ? [content] : [];
                        console.log(copyData, 'copyData');
                        dataRef.current = copyData;
                        setData(copyData);
                    }
                    // 处理链接
                    if (content.showType === 'url' || content.showType === 'tips' || content.showType === 'img') {
                        //判断时候copyData.process里时候有同样id的对象，有的话就替换，没有的话就插入
                        const index = copyData[copyData.length - 1].process?.findIndex((v: any) => v.id === content.id);

                        if (index > -1) {
                            // 替换
                            if (copyData[copyData.length - 1].isAds) {
                                copyData[copyData.length - 2].process[index] = content;
                            } else {
                                copyData[copyData.length - 1].process[index] = content;
                            }
                            dataRef.current = copyData;
                            setData(copyData);
                        } else {
                            if (copyData[copyData.length - 1].isAds) {
                                copyData[copyData.length - 2].process = [...process, content];
                            } else {
                                copyData[copyData.length - 1].process = [...process, content];
                            }
                            dataRef.current = copyData;
                            setData(copyData);
                        }
                    }
                }
                if (bufferObj.type === 'm') {
                    // 处理结论
                    const copyData = [...dataRef.current];
                    if (copyData[copyData.length - 1].isAds) {
                        copyData[copyData.length - 2].answer = copyData[copyData.length - 2].answer + bufferObj.content;
                        copyData[copyData.length - 2].isNew = true;
                    } else {
                        copyData[copyData.length - 1].answer = copyData[copyData.length - 1].answer + bufferObj.content;
                        copyData[copyData.length - 1].isNew = true;
                    }

                    dataRef.current = copyData;
                    setData(copyData);
                }
                if (bufferObj.type === 'ads-msg') {
                    const newMessage: IHistory = {
                        isAds: true,
                        ads: bufferObj.content
                    };
                    const copyData = dataRef.current;
                    copyData.push(newMessage);
                    setData([...copyData]);
                }
            } else if (bufferObj?.code === 300900000 || !bufferObj?.code) {
                // 不处理
                return;
            } else if (bufferObj?.code === 2008002007) {
                // 处理token不足
                const copyData = [...dataRef.current];
                copyData[copyData.length - 1].answer = '当前使用的魔力值不足';
                copyData[copyData.length - 1].status = 'ERROR';
                copyData[copyData.length - 1].isNew = false;
                setOpenToken(true);
            } else {
                console.log('error', bufferObj);
                const copyData = [...dataRef.current]; // 使用dataRef.current代替data
                if (copyData[copyData.length - 1].isAds) {
                    copyData[copyData.length - 2].answer = env === 'development' ? bufferObj.content : '机器人异常，请重试';
                    copyData[copyData.length - 2].status = 'ERROR';
                    copyData[copyData.length - 2].isNew = false;
                } else {
                    copyData[copyData.length - 1].answer = env === 'development' ? bufferObj.content : '机器人异常，请重试';
                    copyData[copyData.length - 1].status = 'ERROR';
                    copyData[copyData.length - 1].isNew = false;
                }
                dataRef.current = copyData;
                setData(copyData);
                setIsFetch(false);
            }
        } catch (e) {
            console.log(e, 'error-JSON.parse异常');
        }
    };

    const doFetch = async (message: string, isGoOn?: boolean) => {
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
                    conversationUid: jsCookie.get(conversationUniKey),
                    modelType: selectModel,
                    webSearch: isGoOn ? false : enableOnline
                });
            }
            if (mode === 'test') {
                resp = await messageSSE({
                    appUid: appId,
                    scene: 'CHAT_TEST',
                    conversationUid,
                    query: message,
                    modelType: selectModel,
                    webSearch: isGoOn ? false : enableOnline
                });
            }
            if (mode === 'market') {
                resp = await marketMessageSSE({
                    appUid: uid,
                    conversationUid,
                    query: message,
                    modelType: selectModel,
                    webSearch: isGoOn ? false : enableOnline
                });
            }
            setIsFirst(false);

            const reader = resp.getReader();
            const textDecoder = new TextDecoder();
            let outerJoins = '';

            while (true) {
                const { done, value } = await reader.read();
                if (done) {
                    const copyData = [...dataRef.current];
                    if (copyData[copyData.length - 1].isAds) {
                        copyData[dataRef.current.length - 2].isNew = false;
                    } else {
                        copyData[dataRef.current.length - 1].isNew = false;
                    }
                    dataRef.current = copyData;
                    setData(copyData);
                    setIsFetch(false);
                    break;
                }

                const str = textDecoder.decode(value);
                outerJoins += str;

                // 查找事件结束标志，例如"}\n"
                let eventEndIndex = outerJoins.indexOf('}\n');

                while (eventEndIndex !== -1) {
                    const eventData = outerJoins.slice(0, eventEndIndex + 1);
                    handleSSEData(eventData);
                    outerJoins = outerJoins.slice(eventEndIndex + 3);
                    eventEndIndex = outerJoins.indexOf('}\n');
                }
            }
        } catch (e: any) {
            console.log('error', e);
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

        const copyData = _.cloneDeep(dataRef.current);
        const newData = copyData.filter((v: any) => v.isStatement);
        setData(newData);
        dataRef.current = newData;
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

    // 监听技能模型切换到4.0
    useEffect(() => {
        if (skillWorkflowList.length) {
            setChatBotInfo({
                ...chatBotInfo,
                modelProvider: 'GPT4'
            });
        }
    }, [skillWorkflowList.length]);

    const handleShare = async () => {
        const res = await shareChat({
            conversationUid: conversationUid,
            mediumUid: mediumUid,
            scene: statisticsMode
        });
        if (res) {
            copyToClipboard(`${window.location.origin}/share_cb/${res?.shareKey}?q=${res?.inviteCode}`);
        }
        dispatch(
            openSnackbar({
                open: true,
                message: '把你的对话分享给朋友吧，还可以免费增加权益哦！',
                variant: 'alert',
                anchorOrigin: { vertical: 'top', horizontal: 'center' },
                alert: {
                    color: 'success'
                },
                close: false
            })
        );
        return;
    };

    const goShow = useMemo(() => {
        if (!isFetch && data.length) {
            const data = dataRef.current.filter((v: any) => !v.isStatement).filter((v: any) => v.status !== 'ERROR');
            const answer = data[data.length - 1]?.answer;
            if (!answer) return false;
            // 对{x}做处理
            const text = answer?.trim().replace(/\{(\d+)\}/g, '');
            const lastChar = text.slice(-1);
            const sentenceEndRegex = /[.?!。？！]/;
            const result = sentenceEndRegex.test(lastChar);
            return !result;
        }
    }, [isFetch, data]);

    return (
        <div className="h-full relative flex justify-center">
            {mode === 'market' && width > 1300 && (
                <div
                    className="rounded-tl-lg rounded-bl-lg h-full  min-w-[231px] overflow-y-auto  bg-white"
                    style={{ borderRight: '1px solid rgba(230,230,231,1)' }}
                >
                    <div className="h-full  px-[8px] flex flex-col">
                        <div className="h-[44px] flex items-center text-lg font-bold">AI员工</div>
                        <div className="bg-white rounded-md flex-1">
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
                        <div
                            className="h-[28px] flex items-center justify-center text-[#673ab7] cursor-pointer"
                            onClick={() => {
                                navigate('/my-chat');
                            }}
                        >
                            创作属于自己的数字员工
                        </div>
                    </div>
                </div>
            )}
            <div className={`h-full flex flex-col  ${mode === 'market' ? 'rounded-tr-lg rounded-br-lg bg-white ' : ''}   w-full`}>
                <div className={`flex items-center p-[8px] justify-center h-[44px] flex-shrink-0 relative`}>
                    {showSelect ? (
                        <Popover
                            content={
                                <div className="h-[380px] overflow-y-auto">
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
                                                    setOpen(false);
                                                }
                                                if (mode === 'market') {
                                                    setUid && setUid(item.value);
                                                    setOpen(false);
                                                }
                                            }}
                                        >
                                            <div className="w-[40px] h-[40px]">
                                                <img src={item.avatar} alt="" className="w-[40px] h-[40px] rounded-md" />
                                            </div>
                                            <div className="ml-2">
                                                <div className="text-lg">{item.name}</div>
                                                <div className="text-sm w-[260px] text-[#9da3af] mt-1 h-[60px] line-clamp-3">
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
                                <span className="text-xs ml-1 text-[#697586]">切换员工</span>
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
                    {conversationUid && mode !== 'share' && (
                        <Tooltip title={'把你的对话分享给朋友'}>
                            <svg
                                onClick={() => handleShare()}
                                className={`absolute ${
                                    statisticsMode === 'SHARE_JS' ? 'right-[53px]' : 'right-2'
                                }  text-[16px] cursor-pointer`}
                                stroke="currentColor"
                                fill="none"
                                strokeWidth="2"
                                viewBox="0 0 24 24"
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                height="1em"
                                width="1em"
                                xmlns="http://www.w3.org/2000/svg"
                            >
                                <path d="M4 12v8a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-8"></path>
                                <polyline points="16 6 12 2 8 6"></polyline>
                                <line x1="12" y1="2" x2="12" y2="15"></line>
                            </svg>
                        </Tooltip>
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
                                    <ChatHistory theme={theme} data={data} handleRetry={handleRetry} />
                                </CardContent>
                            </div>
                        </div>
                    </div>
                </div>
                <div className={`${mode === 'market' ? 'mb-1' : ''} flex-shrink-0 flex justify-center w-full`}>
                    <div className={'w-full max-w-[768px] p-[8px] relative'}>
                        {goShow && (
                            <div className="absolute top-0 inset-x-0 flex justify-center">
                                <Button
                                    variant="outlined"
                                    color="secondary"
                                    size="small"
                                    className="w-[200px] rounded-3xl"
                                    onClick={() => {
                                        doFetch('继续', true);
                                    }}
                                >
                                    继续
                                </Button>
                            </div>
                        )}
                        <div className="flex justify-between mb-[2px]">
                            {skillWorkflowList && skillWorkflowList?.length > 0 ? (
                                <Popover
                                    placement="topLeft"
                                    arrow={false}
                                    open={skillOpen}
                                    onOpenChange={(newOpen) => setSkillOpen(newOpen)}
                                    content={
                                        <div className="max-h-[260px] overflow-y-auto">
                                            {skillWorkflowList.map((v: any, index: number) => (
                                                <>
                                                    <div className="flex flex-col w-[280px]" key={index}>
                                                        <div className="flex items-center justify-between">
                                                            <div className="flex items-center">
                                                                {v.images ? (
                                                                    handleIcon(v.images, 'w-[18px] h-[18px]') || (
                                                                        <img className="rounded w-[18px] h-[18px]" src={v.images} />
                                                                    )
                                                                ) : (
                                                                    <svg
                                                                        viewBox="0 0 1024 1024"
                                                                        version="1.1"
                                                                        xmlns="http://www.w3.org/2000/svg"
                                                                        width="18"
                                                                        height="18"
                                                                    >
                                                                        <path
                                                                            d="M689.737143 650.496c8.996571-5.339429 18.797714-9.435429 29.220571-12.105143a28.233143 28.233143 0 0 1-0.219428-3.474286v-27.940571a27.940571 27.940571 0 0 1 55.881143 0v27.940571a28.196571 28.196571 0 0 1-0.219429 3.474286c10.386286 2.669714 20.224 6.765714 29.257143 12.105143a28.233143 28.233143 0 0 1 2.267428-2.596571l19.748572-19.748572a27.940571 27.940571 0 1 1 39.497143 39.497143l-19.748572 19.748571a28.16 28.16 0 0 1-2.56 2.304c5.302857 9.033143 9.435429 18.834286 12.068572 29.257143a28.233143 28.233143 0 0 1 3.474285-0.219428h27.940572a27.940571 27.940571 0 1 1 0 55.881143h-27.940572a28.16 28.16 0 0 1-3.474285-0.219429 111.067429 111.067429 0 0 1-12.068572 29.257143c0.877714 0.658286 1.755429 1.462857 2.56 2.267428l19.748572 19.748572a27.940571 27.940571 0 1 1-39.497143 39.497143l-19.748572-19.748572a28.233143 28.233143 0 0 1-2.304-2.56 111.067429 111.067429 0 0 1-29.257142 12.068572 28.196571 28.196571 0 0 1 0.256 3.474285v27.940572a27.940571 27.940571 0 1 1-55.881143 0v-27.940572c0-1.170286 0.073143-2.304 0.219428-3.474285a111.067429 111.067429 0 0 1-29.257143-12.068572 28.233143 28.233143 0 0 1-2.304 2.56l-19.748571 19.748572a27.940571 27.940571 0 1 1-39.497143-39.497143l19.748572-19.748572a28.269714 28.269714 0 0 1 2.596571-2.304 111.067429 111.067429 0 0 1-12.105143-29.257142 28.16 28.16 0 0 1-3.474286 0.256h-27.940571a27.940571 27.940571 0 0 1 0-55.881143h27.940571c1.170286 0 2.340571 0.073143 3.474286 0.219428 2.669714-10.422857 6.765714-20.224 12.105143-29.257143a28.16 28.16 0 0 1-2.596571-2.304l-19.748572-19.748571a27.940571 27.940571 0 1 1 39.497143-39.497143l19.748571 19.748572a28.233143 28.233143 0 0 1 2.304 2.596571zM914.285714 582.436571A233.947429 233.947429 0 0 0 746.678857 512a234.057143 234.057143 0 0 0-172.397714 75.446857h-11.995429v14.043429A233.691429 233.691429 0 0 0 512 746.678857c0 65.645714 26.953143 125.001143 70.436571 167.606857H182.857143a73.142857 73.142857 0 0 1-73.142857-73.142857V182.857143a73.142857 73.142857 0 0 1 73.142857-73.142857h658.285714a73.142857 73.142857 0 0 1 73.142857 73.142857v399.579428z m-640.950857-197.485714l-37.924571 36.059429 106.057143 116.114285L512 374.747429l-35.328-38.729143-132.644571 126.354285-70.692572-77.421714z m0 201.142857l-37.924571 36.059429 106.057143 116.114286L512 575.890286l-35.328-38.729143-132.644571 126.354286-70.692572-77.421715z m288.950857-199.789714v50.249143h201.142857v-50.249143h-201.142857z m184.393143 416.219429a55.881143 55.881143 0 1 0 0-111.725715 55.881143 55.881143 0 0 0 0 111.725715z"
                                                                            fill="#6580A9"
                                                                            p-id="1616"
                                                                        ></path>
                                                                    </svg>
                                                                )}
                                                                <span className="line-clamp-1 text-base ml-1">{v.name}</span>
                                                                <span>
                                                                    {v.usage && (
                                                                        <Tooltip
                                                                            title={
                                                                                <div>
                                                                                    <div>使用示例</div>
                                                                                    <div className="whitespace-pre-line">{v.usage}</div>
                                                                                </div>
                                                                            }
                                                                            placement="top"
                                                                        >
                                                                            <div className="flex items-center cursor-pointer">
                                                                                <HelpOutlineIcon className="text-base cursor-pointer" />
                                                                            </div>
                                                                        </Tooltip>
                                                                    )}
                                                                </span>
                                                            </div>
                                                            <BpCheckbox size="small" checked />
                                                        </div>
                                                        <div className="line-clamp-3 text-xs text-[#364152] h-[48px]">{v.description}</div>
                                                    </div>
                                                    {skillWorkflowList.length - 1 !== index && <Divider className="mt-[6px]" />}
                                                </>
                                            ))}
                                        </div>
                                    }
                                    trigger="click"
                                >
                                    <div className="flex items-center cursor-pointer" onClick={() => setSkillOpen(!skillOpen)}>
                                        <span className="text-sm">技能:</span>
                                        <div className="flex items-center justify-start">
                                            {skillWorkflowList &&
                                                skillWorkflowList.slice(0, 5).map((item: any, index: number) =>
                                                    !item.images ? (
                                                        <svg
                                                            key={index}
                                                            viewBox="0 0 1024 1024"
                                                            version="1.1"
                                                            xmlns="http://www.w3.org/2000/svg"
                                                            width="18"
                                                            height="18"
                                                        >
                                                            <path
                                                                d="M689.737143 650.496c8.996571-5.339429 18.797714-9.435429 29.220571-12.105143a28.233143 28.233143 0 0 1-0.219428-3.474286v-27.940571a27.940571 27.940571 0 0 1 55.881143 0v27.940571a28.196571 28.196571 0 0 1-0.219429 3.474286c10.386286 2.669714 20.224 6.765714 29.257143 12.105143a28.233143 28.233143 0 0 1 2.267428-2.596571l19.748572-19.748572a27.940571 27.940571 0 1 1 39.497143 39.497143l-19.748572 19.748571a28.16 28.16 0 0 1-2.56 2.304c5.302857 9.033143 9.435429 18.834286 12.068572 29.257143a28.233143 28.233143 0 0 1 3.474285-0.219428h27.940572a27.940571 27.940571 0 1 1 0 55.881143h-27.940572a28.16 28.16 0 0 1-3.474285-0.219429 111.067429 111.067429 0 0 1-12.068572 29.257143c0.877714 0.658286 1.755429 1.462857 2.56 2.267428l19.748572 19.748572a27.940571 27.940571 0 1 1-39.497143 39.497143l-19.748572-19.748572a28.233143 28.233143 0 0 1-2.304-2.56 111.067429 111.067429 0 0 1-29.257142 12.068572 28.196571 28.196571 0 0 1 0.256 3.474285v27.940572a27.940571 27.940571 0 1 1-55.881143 0v-27.940572c0-1.170286 0.073143-2.304 0.219428-3.474285a111.067429 111.067429 0 0 1-29.257143-12.068572 28.233143 28.233143 0 0 1-2.304 2.56l-19.748571 19.748572a27.940571 27.940571 0 1 1-39.497143-39.497143l19.748572-19.748572a28.269714 28.269714 0 0 1 2.596571-2.304 111.067429 111.067429 0 0 1-12.105143-29.257142 28.16 28.16 0 0 1-3.474286 0.256h-27.940571a27.940571 27.940571 0 0 1 0-55.881143h27.940571c1.170286 0 2.340571 0.073143 3.474286 0.219428 2.669714-10.422857 6.765714-20.224 12.105143-29.257143a28.16 28.16 0 0 1-2.596571-2.304l-19.748572-19.748571a27.940571 27.940571 0 1 1 39.497143-39.497143l19.748571 19.748572a28.233143 28.233143 0 0 1 2.304 2.596571zM914.285714 582.436571A233.947429 233.947429 0 0 0 746.678857 512a234.057143 234.057143 0 0 0-172.397714 75.446857h-11.995429v14.043429A233.691429 233.691429 0 0 0 512 746.678857c0 65.645714 26.953143 125.001143 70.436571 167.606857H182.857143a73.142857 73.142857 0 0 1-73.142857-73.142857V182.857143a73.142857 73.142857 0 0 1 73.142857-73.142857h658.285714a73.142857 73.142857 0 0 1 73.142857 73.142857v399.579428z m-640.950857-197.485714l-37.924571 36.059429 106.057143 116.114285L512 374.747429l-35.328-38.729143-132.644571 126.354285-70.692572-77.421714z m0 201.142857l-37.924571 36.059429 106.057143 116.114286L512 575.890286l-35.328-38.729143-132.644571 126.354286-70.692572-77.421715z m288.950857-199.789714v50.249143h201.142857v-50.249143h-201.142857z m184.393143 416.219429a55.881143 55.881143 0 1 0 0-111.725715 55.881143 55.881143 0 0 0 0 111.725715z"
                                                                fill="#6580A9"
                                                                p-id="1616"
                                                            ></path>
                                                        </svg>
                                                    ) : (
                                                        handleIcon(item.images, 'w-[18px] h-[18px]') || (
                                                            <img
                                                                className="rounded ml-1"
                                                                key={index}
                                                                src={item.images}
                                                                width={18}
                                                                height={18}
                                                            />
                                                        )
                                                    )
                                                )}
                                        </div>
                                        {skillWorkflowList.length > 5 && <span>...</span>}
                                        {skillOpen ? (
                                            <ExpandLessIcon className="h-[18px] w-[18px]" />
                                        ) : (
                                            <ExpandMoreIcon className="h-[18px] w-[18px]" />
                                        )}
                                    </div>
                                </Popover>
                            ) : (
                                <div />
                            )}
                            <div>
                                <Select
                                    style={{ width: 100 }}
                                    bordered={false}
                                    className="rounded-2xl border-[0.5px] border-[#673ab7] border-solid mb-1"
                                    value={selectModel || 'GPT35'}
                                    disabled={mode === 'iframe' || mode === 'share'}
                                    rootClassName="modelSelect"
                                    popupClassName="modelSelectPopup"
                                    onChange={(value) => {
                                        if (value === 'GPT4' && !permissions.includes('chat:config:llm:gpt4')) {
                                            setOpenUpgradeModel(true);
                                            return;
                                        }
                                        if (value === 'QWEN' && !permissions.includes('chat:config:llm:qwen')) {
                                            setOpenUpgradeModel(true);
                                            return;
                                        }
                                        setSelectModel(value);
                                    }}
                                >
                                    <Option value={'GPT35'} disabled={chatBotInfo.modelProvider === 'GPT4'}>
                                        默认模型3.5
                                    </Option>
                                    <Option value={'GPT4'}>默认模型4.0</Option>
                                    <Option value={'QWEN'} disabled={chatBotInfo.modelProvider === 'GPT4'}>
                                        通义千问
                                    </Option>
                                </Select>
                            </div>
                        </div>
                        <Grid container spacing={1} alignItems="center" className="px-0 flex-nowrap w-full ml-0">
                            {/* <Grid item className="!pl-0">
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
                            </Grid> */}
                            <Grid item xs={12} sm zeroMinWidth className="!pl-0">
                                <OutlinedInput
                                    id="message-send"
                                    fullWidth
                                    multiline
                                    disabled={mode === 'share'}
                                    value={message}
                                    onChange={(e) => setMessage(e.target.value)}
                                    placeholder="请输入想咨询的问题"
                                    className="!pt-0"
                                    onKeyDown={handleKeyDown}
                                    onClick={(e) => {
                                        // 判断当前人是否有权限使用
                                        if (chatBotInfo.enableSearchInWeb && !permissions.includes('chat:config:websearch')) {
                                            setOpenUpgradeOnline(true);
                                            const dom = document.querySelector('#message-send') as HTMLTextAreaElement;
                                            dom?.blur();
                                            return;
                                        }
                                        if (chatBotInfo.modelProvider === 'GPT4' && !permissions.includes('chat:config:llm:gpt4')) {
                                            setOpenUpgradeModel(true);
                                            const dom = document.querySelector('#message-send') as HTMLTextAreaElement;
                                            dom?.blur();
                                            return;
                                        }
                                        if (chatBotInfo.modelProvider === 'QWEN' && !permissions.includes('chat:config:llm:qwen')) {
                                            setOpenUpgradeModel(true);
                                            const dom = document.querySelector('#message-send') as HTMLTextAreaElement;
                                            dom?.blur();
                                            return;
                                        }
                                        if (skillWorkflowList?.length && !permissions.includes('chat:config:skills')) {
                                            setOpenUpgradeSkillModel(true);
                                            const dom = document.querySelector('#message-send') as HTMLTextAreaElement;
                                            dom?.blur();
                                            return;
                                        }
                                    }}
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
                                    inputProps={{ 'aria-label': 'weight', maxLength: 200 }}
                                />
                            </Grid>
                        </Grid>
                        <div className="flex justify-between mt-1 items-center">
                            {/* {skillWorkflowList && skillWorkflowList?.length > 0 ? (
                                <Popover
                                    placement="topLeft"
                                    arrow={false}
                                    open={skillOpen}
                                    content={
                                        <div className="max-h-[220px] overflow-y-auto">
                                            {skillWorkflowList.map((v: any, index: number) => (
                                                <>
                                                    <div className="flex flex-col w-[220px]">
                                                        <div className="flex items-center justify-between">
                                                            <div className="flex items-center">
                                                                <img className="rounded w-[18px] h-[18px]" src={v.images} />
                                                                <span className="line-clamp-1 text-base ml-1">{v.name}</span>
                                                            </div>
                                                            <BpCheckbox size="small" checked />
                                                        </div>
                                                        <div className="line-clamp-2 text-xs text-[#364152] h-[32px]">{v.description}</div>
                                                    </div>
                                                    {skillWorkflowList.length - 1 !== index && <Divider className="mt-[6px]" />}
                                                </>
                                            ))}
                                        </div>
                                    }
                                    trigger="click"
                                >
                                    <div
                                        className="flex items-center mb-1 cursor-pointer px-[8px]"
                                        onClick={() => setSkillOpen(!skillOpen)}
                                    >
                                        <span className="text-sm ml-[40px]">技能:</span>
                                        <div className="flex items-center justify-start">
                                            {skillWorkflowList &&
                                                skillWorkflowList
                                                    .slice(0, 5)
                                                    .map((item: any, index: number) => (
                                                        <img
                                                            className="rounded ml-1"
                                                            key={index}
                                                            src={item.images}
                                                            width={18}
                                                            height={18}
                                                        />
                                                    ))}
                                        </div>
                                        {skillWorkflowList.length > 5 && <span>...</span>}
                                        {skillOpen ? (
                                            <ExpandLessIcon className="ml-1 h-[18px] w-[18px]" />
                                        ) : (
                                            <ExpandMoreIcon className="ml-1 h-[18px] w-[18px]" />
                                        )}
                                    </div>
                                </Popover>
                            ) : (
                                <div />
                            )} */}
                            <Tooltip title={'清除'} placement="top" arrow>
                                <CleaningServicesSharpIcon
                                    className="text-base cursor-pointer hover:text-[#673ab7]"
                                    onClick={handleClean}
                                />
                            </Tooltip>
                            <div />
                            <div className="flex items-center">
                                <div className="flex items-center justify-center">
                                    <span className="mr-1 text-sm">联网查询</span>
                                    <Switch
                                        checked={!!enableOnline}
                                        checkedChildren="开启"
                                        unCheckedChildren="关闭"
                                        disabled={mode === 'iframe' || mode === 'share' || !!chatBotInfo.enableSearchInWeb}
                                        size={'small'}
                                        onChange={(value) => {
                                            if (value && !permissions.includes('chat:config:websearch')) {
                                                setOpenUpgradeOnline(true);
                                                return;
                                            }
                                            setEnableOnline(value);
                                        }}
                                    />
                                </div>
                                <div className="text-right text-stone-600 w-[55px] ml-2">{message?.length || 0}/200</div>
                            </div>
                        </div>
                        {mode !== 'market' && (
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
                        )}
                    </div>
                </div>
            </div>
            {mode === 'market' && width > 1300 && <div className="min-w-[220px] h-full bg-[#f4f6f8]" />}
            <PermissionUpgradeModal open={openUpgradeOnline} handleClose={() => setOpenUpgradeOnline(false)} />
            <PermissionUpgradeModal open={openUpgradeModel} handleClose={() => setOpenUpgradeModel(false)} />
            <PermissionUpgradeModal open={openUpgradeSkillModel} handleClose={() => setOpenUpgradeSkillModel(false)} />
            <PermissionUpgradeModal open={openToken} handleClose={() => setOpenToken(false)} title={'当前使用的魔力值不足'} />
        </div>
    );
};
