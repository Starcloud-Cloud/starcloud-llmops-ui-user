import CleaningServicesSharpIcon from '@mui/icons-material/CleaningServicesSharp';
import HistoryToggleOffSharpIcon from '@mui/icons-material/HistoryToggleOffSharp';
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
import dayjs from 'dayjs';
import React from 'react';
import PerfectScrollbar from 'react-perfect-scrollbar';
import Chip from 'ui-component/extended/Chip';
import { messageSSE } from '../../../../../api/chat';
import { t } from '../../../../../hooks/web/useI18n';
import { dispatch } from '../../../../../store';
import { openSnackbar } from '../../../../../store/slices/snackbar';
import { IChatInfo } from '../index';
import ChatHistory from './ChatHistory';

export type IHistory = {
    type: number;
    text?: string;
    time?: string;
};

export const Chat = ({ chatBotInfo }: { chatBotInfo: IChatInfo }) => {
    const theme = useTheme();
    const scrollRef = React.useRef();
    const matchDownSM = useMediaQuery(theme.breakpoints.down('lg'));

    const [user, setUser] = React.useState<any>({});

    const [isListening, setIsListening] = React.useState(false);
    // const [recognizedText, setRecognizedText] = React.useState('');
    const [message, setMessage] = React.useState('');

    // 创建语音识别对象
    const recognition = new ((window as any).SpeechRecognition || (window as any).webkitSpeechRecognition)();

    // 设置语言为中文
    recognition.lang = 'zh-CN';

    // 语音识别结果事件处理函数
    recognition.onresult = (event: any) => {
        const result = event.results[event.resultIndex][0].transcript;
        setMessage(`${message}${result}`);
    };

    // 开始语音识别
    const startListening = () => {
        setIsListening(true);
        recognition.start();
    };

    // 停止语音识别
    const stopListening = () => {
        setIsListening(false);
        recognition.stop();
    };

    React.useEffect(() => {
        // 清理语音识别对象
        return () => {
            recognition.stop();
            recognition.onresult = null;
        };
    }, []);

    const [data, setData] = React.useState<IHistory[]>([
        {
            type: 2,
            text: 'Hello, How can I help you?',
            time: '2023-09-02 10:30'
        },
        {
            type: 1,
            text: 'Hello, How can I help you?',
            time: '2023-09-02 10:30'
        }
    ]);

    React.useLayoutEffect(() => {
        if (scrollRef?.current) {
            // @ts-ignore
            scrollRef.current.scrollIntoView();
        }
    });

    // handle new message form
    const handleOnSend = async () => {
        if (!message) {
            return;
        }
        setMessage('');
        const newMessage = {
            type: 1,
            text: message,
            time: dayjs().format('YYYY-MM-DD HH:mm')
        };
        // setData((prevState) => [...prevState, newMessage]);

        let resp: any = await messageSSE({
            appUid: '2196b6cce43f41679e15487d79bde823',
            scene: 'WEB_MARKET',
            conversationUid: '17178ad444ed4cdfa18836c54a8011c5',
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
                // const newValue1 = [...loadings];
                // newValue1[index] = false;
                // setLoadings(newValue1);
                return;
            }
            if (done) {
                break;
            }
            let str = textDecoder.decode(value);
            const lines = str.split('\n');
            lines.forEach((message, i: number) => {
                if (i === 0 && joins) {
                    message = joins + message;
                    joins = undefined;
                }
                if (i === lines.length - 1) {
                    if (message && message.indexOf('}') === -1) {
                        joins = message;
                        return;
                    }
                }
                let bufferObj;
                if (message?.startsWith('data:')) {
                    bufferObj = message.substring(5) && JSON.parse(message.substring(5));
                }
                if (bufferObj?.code === 200) {
                    console.log(bufferObj.content);
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

    const handleEnter = (event: React.KeyboardEvent<HTMLDivElement> | undefined) => {
        if (event?.key !== 'Enter') {
            return;
        }
        handleOnSend();
    };

    const handleClean = () => {
        setAnchorEl(null);
        setData([]);
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
        // <div className="bg-[#f4f6f8] rounded-md">
        <div>
            <div className={'flex justify-center items-center py-[15px]'}>
                <img
                    className="w-[38px] h-[38px] rounded-xl ml-2"
                    src="https://afu-1255830993.cos.ap-shanghai.myqcloud.com/chato_image/avater_208/ceeb3af9785ac20c3adad8c4cdd00d3e.png"
                    alt=""
                />
                <text className={'text-lg font-medium ml-3'}>{chatBotInfo.name}</text>
            </div>
            <Divider variant={'fullWidth'} />
            <PerfectScrollbar style={{ width: '100%', height: 'calc(100vh - 310px)', overflowX: 'hidden', minHeight: 525 }}>
                <Card className="bg-[#f2f3f5] m-[24px] p-[16px]">
                    <Typography align="left" variant="subtitle2">
                        {chatBotInfo.introduction}
                    </Typography>
                </Card>
                <CardContent>
                    <ChatHistory theme={theme} user={user} data={data} />
                    {/* @ts-ignore */}
                    {/* <span ref={scrollRef} /> */}
                </CardContent>
            </PerfectScrollbar>
            <Grid container spacing={3} className="px-[24px] mb-3">
                <Grid item>
                    <Chip label="Secondary" chipcolor="secondary" size={'small'} className="cursor-pointer" />
                </Grid>
            </Grid>
            <Grid container spacing={1} alignItems="center" className="px-[24px] pb-[24px]">
                <Grid item>
                    {/* <IconButton size="large" aria-label="attachment file" onClick={() => handleClean()}>
                        <CleaningServicesSharpIcon />
                    </IconButton> */}
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
                            <MenuItem onClick={handleCloseSort}>
                                <HistoryToggleOffSharpIcon className="text-base" />
                                <span className="text-base ml-3">历史</span>
                            </MenuItem>
                        </Menu>
                    </Grid>
                </Grid>
                <Grid item xs={12} sm zeroMinWidth>
                    <OutlinedInput
                        id="message-send"
                        fullWidth
                        value={message}
                        onChange={(e) => setMessage(e.target.value)}
                        onKeyPress={handleEnter}
                        placeholder="Type a Message"
                        endAdornment={
                            <>
                                <InputAdornment position="end">
                                    <IconButton
                                        className="!p-[4px]"
                                        disableRipple
                                        color={isListening ? 'secondary' : 'default'}
                                        onClick={isListening ? stopListening : startListening}
                                        aria-label="voice"
                                    >
                                        <KeyboardVoiceIcon />
                                    </IconButton>
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
