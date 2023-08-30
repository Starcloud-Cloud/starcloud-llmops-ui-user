import AddIcon from '@mui/icons-material/Add';
import CloseIcon from '@mui/icons-material/Close';
import GraphicEqIcon from '@mui/icons-material/GraphicEq';
import PlayCircleOutlineIcon from '@mui/icons-material/PlayCircleOutline';
import {
    Button,
    CardActions,
    CardContent,
    Divider,
    FormControl,
    FormControlLabel,
    Grid,
    IconButton,
    InputLabel,
    MenuItem,
    Modal,
    Radio,
    RadioGroup,
    Select,
    Slider,
    Switch,
    TextField
} from '@mui/material';
import { Popover, Upload, UploadFile, UploadProps } from 'antd';
import { getAvatarList, getVoiceList } from 'api/chat';
import { t } from 'hooks/web/useI18n';
import React, { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';
import { dispatch } from 'store';
import { gridSpacing } from 'store/constant';
import { openSnackbar } from 'store/slices/snackbar';
import MainCard from 'ui-component/cards/MainCard';
import AppModal from 'views/picture/create/Menu/appModal';
import { getAccessToken } from 'utils/auth';
import { config } from 'utils/axios/config';
import { v4 as uuidv4 } from 'uuid';
import { IChatInfo } from '../index';
import workWechatPay from 'assets/images/landing/work_wechat_pay.png';

const { base_url } = config;

const uploadButton = (
    <div>
        <AddIcon />
        <div style={{ marginTop: 8 }}>上传</div>
    </div>
);

interface IVoiceType {
    Name: string;
    DisplayName: string;
    LocalName: string;
    ShortName: string;
    Gender: string;
    Locale: string;
    LocaleName: string;
    StyleList: string[];
    SecondaryLocaleList?: any;
    RolePlayList: string[];
    SampleRateHertz: string;
    VoiceType: string;
    Status: string;
    ExtendedPropertyMap?: any;
    WordsPerMinute: string;
}

const VoiceModal = ({
    open,
    handleClose,
    chatBotInfo,
    setChatBotInfo,
    list
}: {
    open: boolean;
    handleClose: () => void;
    chatBotInfo: IChatInfo;
    setChatBotInfo: (chatInfo: IChatInfo) => void;
    list: IVoiceType[];
}) => {
    const [name, setName] = useState('');
    const [style, setStyle] = useState('');
    const [speed, setSpeed] = useState(1);
    const [pitch, setPitch] = useState(1);

    const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setName((event.target as HTMLInputElement).value);
    };

    useEffect(() => {
        if (chatBotInfo) {
            setName(chatBotInfo?.voiceName || '');
            setPitch(chatBotInfo?.voicePitch || 1);
            setSpeed(chatBotInfo?.voiceSpeed || 1);
            setStyle(chatBotInfo?.voiceStyle || '');
        }
    }, [chatBotInfo]);

    const styleList = React.useMemo(() => {
        const item = list.find((v) => v.LocalName === name);
        return item?.StyleList || [];
    }, [list, name]);

    const handleTest = async () => {
        fetch(`${base_url}/llm/chat/voice/example`, {
            method: 'POST', // Specify the HTTP method (POST in this case, since you are sending data)
            headers: {
                'Content-Type': 'application/json',
                Authorization: 'Bearer ' + getAccessToken()
            },
            body: JSON.stringify({
                shortName: name,
                style: style,
                prosodyPitch: pitch,
                prosodyRate: speed
            })
        })
            .then((response: any) => {
                const reader: any = response.body?.getReader();
                return new ReadableStream({
                    // 创建新的可读流
                    start(controller) {
                        function read() {
                            reader.read().then(({ done, value }: any) => {
                                if (done) {
                                    controller.close(); // 关闭流
                                    return;
                                }
                                controller.enqueue(value); // 将数据放入流
                                read(); // 继续读取下一部分数据
                            });
                        }

                        read(); // 开始读取
                    }
                });
            })
            .then((stream) => {
                let buffer: any;
                const reader = stream.getReader(); // 获取读取器
                const processStream: any = ({ done, value }: any) => {
                    if (done) {
                        const audioContext = new window.AudioContext();
                        if (audioContext.state === 'suspended') {
                            audioContext.resume();
                        }
                        audioContext.decodeAudioData(
                            buffer,
                            (buffer) => {
                                const sourceNode = audioContext.createBufferSource();
                                sourceNode.buffer = buffer;
                                // 连接节点到扬声器
                                sourceNode.connect(audioContext.destination);
                                // 播放音频
                                sourceNode.start();
                            },
                            (error) => {
                                console.error('解码音频数据时出错：', error);
                            }
                        );
                        return;
                    }
                    // 将数据放入缓冲区
                    const arrayOrg = new Int32Array(buffer);
                    const arrayCurrent = new Int32Array(value.buffer);
                    const totalLength = arrayOrg.byteLength + arrayCurrent.byteLength;
                    const mergedBuffer = new ArrayBuffer(totalLength);
                    const mergedArray = new Int32Array(mergedBuffer);
                    mergedArray.set(arrayOrg, 0);
                    mergedArray.set(arrayCurrent, arrayOrg.length);
                    buffer = mergedArray.buffer;
                    return reader.read().then(processStream); // 继续读取下一部分数据
                };
                return reader.read().then(processStream); // 开始读取
            })
            .catch((error) => {
                dispatch(
                    openSnackbar({
                        open: true,
                        message: '播放异常',
                        variant: 'alert',
                        alert: {
                            color: 'error'
                        },
                        close: false
                    })
                );
                console.error('发生错误:', error);
            });
    };

    return (
        <Modal open={open} onClose={handleClose} aria-labelledby="modal-title" aria-describedby="modal-description">
            <MainCard
                style={{
                    position: 'absolute',
                    width: '800px',
                    top: '50%',
                    left: '50%',
                    transform: 'translate(-50%, -50%)'
                }}
                title="选择声音"
                content={false}
                secondary={
                    <IconButton onClick={handleClose} size="large" aria-label="close modal">
                        <CloseIcon fontSize="small" />
                    </IconButton>
                }
            >
                <CardContent>
                    <Grid container spacing={gridSpacing}>
                        <div className={'w-full px-[24px] '}>
                            <div className={'w-full  pt-[24px]'}>
                                <RadioGroup row aria-label="gender" name="row-radio-buttons-group" value={name} onChange={handleChange}>
                                    <div className={'grid grid-cols-2 gap-4 w-full'}>
                                        {list.map((item, index) => (
                                            <FormControlLabel
                                                key={index}
                                                value={item.LocalName}
                                                control={<Radio />}
                                                label={`${item.LocalName}-${item.Gender === 'Male' ? '男' : '女'}-${item.LocaleName}`}
                                            />
                                        ))}
                                    </div>
                                </RadioGroup>
                            </div>
                            <Divider className={'py-[15px]'} />
                            <div className={'flex items-center justify-between mt-5'}>
                                <div className={'flex-[0 0 150px]'}>
                                    <FormControl sx={{ width: '100%' }}>
                                        <InputLabel id="age-select" size={'small'}>
                                            风格
                                        </InputLabel>
                                        <Select
                                            size={'small'}
                                            id="columnId"
                                            name="columnId"
                                            label={'style'}
                                            className={'w-[150px]'}
                                            value={style}
                                            disabled={!styleList || styleList?.length === 0}
                                            onChange={(e) => {
                                                setStyle(e.target.value);
                                            }}
                                        >
                                            {styleList.map((item, index) => (
                                                <MenuItem key={index} value={item}>
                                                    {t(`voiceStyles.${item}`)}
                                                </MenuItem>
                                            ))}
                                        </Select>
                                    </FormControl>
                                </div>

                                <div className={'flex-1 flex items-center justify-center'}>
                                    <div className={'w-4/5 flex items-center justify-center'}>
                                        <span className={'text-sm mr-2 w-[38px]'}>音调</span>
                                        <Slider
                                            color={'secondary'}
                                            defaultValue={1}
                                            step={0.1}
                                            valueLabelDisplay="auto"
                                            min={0.5}
                                            value={pitch}
                                            max={1.5}
                                            onChange={(e, value) => {
                                                setPitch(value as number);
                                            }}
                                        />
                                    </div>
                                </div>

                                <div className={'flex-1 flex items-center justify-center'}>
                                    <div className={'w-4/5 flex items-center justify-center'}>
                                        <span className={'text-sm mr-2'}>语速</span>
                                        <Slider
                                            color={'secondary'}
                                            className={'w-4/5'}
                                            defaultValue={1}
                                            step={0.1}
                                            valueLabelDisplay="auto"
                                            min={0.5}
                                            max={2}
                                            value={speed}
                                            onChange={(e, value) => {
                                                setSpeed(value as number);
                                            }}
                                        />
                                    </div>
                                </div>
                                <div className={'flex-[0 0 150px]'}>
                                    <Button
                                        startIcon={<PlayCircleOutlineIcon />}
                                        variant={'contained'}
                                        color={'secondary'}
                                        size={'small'}
                                        onClick={() => handleTest()}
                                    >
                                        播放
                                    </Button>
                                </div>
                            </div>
                        </div>
                    </Grid>
                </CardContent>
                <Divider />
                <CardActions>
                    <Grid container justifyContent="flex-end">
                        <Button
                            variant="contained"
                            type="button"
                            color={'secondary'}
                            onClick={() => {
                                setChatBotInfo({
                                    ...chatBotInfo,
                                    voiceName: name,
                                    voiceStyle: style,
                                    voicePitch: pitch,
                                    voiceSpeed: speed
                                });
                                handleClose();
                            }}
                        >
                            保存
                        </Button>
                    </Grid>
                </CardActions>
            </MainCard>
        </Modal>
    );
};

const ShortcutModal = ({ open, handleClose }: { open: boolean; handleClose: () => void }) => {
    const [type, setType] = useState('0');
    return (
        <Modal open={open} onClose={handleClose} aria-labelledby="modal-title" aria-describedby="modal-description">
            <MainCard
                style={{
                    position: 'absolute',
                    width: '800px',
                    top: '50%',
                    left: '50%',
                    transform: 'translate(-50%, -50%)'
                }}
                title="添加快捷方式"
                content={false}
                secondary={
                    <IconButton onClick={handleClose} size="large" aria-label="close modal">
                        <CloseIcon fontSize="small" />
                    </IconButton>
                }
            >
                <div className={'w-full p-[24px] '}>
                    <FormControl sx={{ width: '100%' }}>
                        <InputLabel id="age-select">类型</InputLabel>
                        <Select id="columnId" name="columnId" label={'style'} fullWidth onChange={(e: any) => setType(e.target.value)}>
                            <MenuItem value="0">文本内容</MenuItem>
                            <MenuItem value="1">执行AI流程</MenuItem>
                        </Select>
                    </FormControl>

                    <TextField className={'mt-2'} fullWidth label={'关键字'} />
                    {type === '0' ? (
                        <TextField
                            className={'mt-2'}
                            fullWidth
                            multiline={true}
                            maxRows={3}
                            minRows={3}
                            aria-valuemax={200}
                            label={'回复内容'}
                        />
                    ) : (
                        <FormControl sx={{ width: '100%' }} className={'mt-2'}>
                            <InputLabel id="age-select">选择应用</InputLabel>
                            <Select id="columnId" name="columnId" label={'style'} fullWidth onChange={(e: any) => setType(e.target.value)}>
                                <MenuItem value="0">
                                    <em>文本内容</em>
                                </MenuItem>
                                <MenuItem value="1">
                                    <em>执行AI流程</em>
                                </MenuItem>
                            </Select>
                        </FormControl>
                    )}
                </div>
                <Divider />
                <CardActions>
                    <Grid container justifyContent="flex-end">
                        <Button variant="contained" type="button">
                            保存
                        </Button>
                    </Grid>
                </CardActions>
            </MainCard>
        </Modal>
    );
};

/**
 * 形象设计
 * @constructor
 */
export const FashionStyling = ({
    setChatBotInfo,
    chatBotInfo
}: {
    setChatBotInfo: (chatInfo: IChatInfo) => void;
    chatBotInfo: IChatInfo;
}) => {
    const [fileList, setFileList] = useState<UploadFile[]>([]);
    const [voiceOpen, setVoiceOpen] = useState(false);
    const [shortcutOpen, setShortcutOpen] = useState(false);
    const [avatarList, setAvatarList] = useState<string[]>([]);
    const [startCheck, setStartCheck] = useState(false);
    const [isFirst, setIsFirst] = useState(true);
    const [list, setList] = useState<IVoiceType[]>([]);
    const [isValid, setIsValid] = useState(true);
    const [websiteCount, setWebsiteCount] = useState(0);
    const [title, setTitle] = useState('');
    const [appValues, setAppValues] = useState<any>('');
    const location = useLocation();
    const searchParams = new URLSearchParams(location.search);

    const [appOpen, setAppOpen] = useState(false);
    const [tags, setTags] = useState<any[]>([]);
    const emits = (data: any) => {
        setAppOpen(false);
        if (tags.includes('Desc')) {
            setChatBotInfo({ ...chatBotInfo, introduction: data });
        } else if (tags.includes('Welcome')) {
            setChatBotInfo({ ...chatBotInfo, statement: data });
        }
    };

    const closeVoiceModal = () => {
        setVoiceOpen(false);
    };

    useEffect(() => {
        (async () => {
            const res = await getVoiceList();
            if (!chatBotInfo.voiceName) {
                setChatBotInfo({
                    ...chatBotInfo,
                    voiceName: res?.[0]?.LocalName
                });
                setList(res || []);
            }
        })();
    }, [chatBotInfo]);

    const handleChange: UploadProps['onChange'] = ({ fileList: newFileList }) => setFileList(newFileList);

    useEffect(() => {
        if (fileList?.[0]?.response?.data) {
            console.log(1);
            setChatBotInfo({
                ...chatBotInfo,
                avatar: fileList?.[0]?.response?.data
            });
        }
    }, [fileList]);

    // 获取头像列表和初始头像回显(只有第一次)
    useEffect(() => {
        if (isFirst && chatBotInfo.defaultImg) {
            (async () => {
                const res = await getAvatarList();
                setAvatarList([chatBotInfo.defaultImg, ...res.map((item: string, index: number) => `${item}?index=${uuidv4()}`)]);
                setIsFirst(false);
            })();
        }
    }, [chatBotInfo, isFirst]);

    // 上传头像之后头像列表
    useEffect(() => {
        if (fileList?.[0]?.response?.data) {
            setAvatarList([fileList?.[0]?.response?.data, ...avatarList]);
            // 把fileList清空
            setFileList([]);
        }
    }, [fileList]);

    useEffect(() => {
        if (chatBotInfo?.searchInWeb) {
            const websites = chatBotInfo?.searchInWeb?.split(/[\n,]/).map((item) => item.trim());
            // 简单验证每个网站地址
            const isValidInput = websites.every((website) =>
                /^(https?:\/\/)?([\w.-]+\.[a-z]{2,6})(:[0-9]{1,5})?([/\w.-]*)*\/?$/.test(website)
            );
            setIsValid(isValidInput);
            setWebsiteCount(isValidInput ? websites.length : 0);
        }
    }, [chatBotInfo?.searchInWeb]);

    return (
        <>
            <div>
                <div>
                    <span
                        className={
                            "before:bg-[#673ab7] before:left-0 before:top-[2px] before:content-[''] before:w-[3px] before:h-[14px] before:absolute before:ml-0.5 block text-[1.125rem] font-medium pl-[12px] relative text-black"
                        }
                    >
                        基本信息
                    </span>
                    <div className={'mt-5 w-1/3'}>
                        <TextField
                            label={'名称'}
                            className={'mt-1'}
                            value={chatBotInfo.name}
                            error={(startCheck && !chatBotInfo.name) || (chatBotInfo.name?.length || 0) > 20}
                            fullWidth
                            InputLabelProps={{ shrink: true }}
                            size={'small'}
                            onChange={(e) => {
                                const value = e.target.value;
                                setStartCheck(true);
                                setChatBotInfo({ ...chatBotInfo, name: value });
                            }}
                        />
                        <div className="flex justify-between">
                            {startCheck && !chatBotInfo.name ? (
                                <div className="text-[#f44336] mt-1">请填写名称</div>
                            ) : (
                                <div className="h-[20px]" />
                            )}
                            <div className="text-right text-stone-600 mr-1 mt-1">{chatBotInfo.name?.length || 0}/20</div>
                        </div>
                    </div>
                    <div className={'mt-3'}>
                        <span className={'text-base text-black'}>头像</span>
                        <div className={'pt-2 flex items-center overflow-x-auto'}>
                            <Upload
                                maxCount={1}
                                action={`${process.env.REACT_APP_BASE_URL}${
                                    process.env.REACT_APP_API_URL
                                }/llm/chat/avatar/${searchParams.get('appId')}`}
                                headers={{
                                    Authorization: 'Bearer ' + getAccessToken()
                                }}
                                accept=".png, .jpg, .jpeg"
                                name="avatarFile"
                                listType="picture-card"
                                fileList={fileList}
                                onChange={handleChange}
                                className="!w-[110px]"
                            >
                                {fileList.length >= 1 ? null : uploadButton}
                            </Upload>
                            <div className="flex  items-center">
                                {avatarList.map((item, index) => (
                                    <img
                                        onClick={() => {
                                            setChatBotInfo({
                                                ...chatBotInfo,
                                                avatar: item
                                            });
                                        }}
                                        key={index}
                                        className={`w-[102px] h-[102px]  rounded-lg object-fill cursor-pointer mr-[8px] mb-[8px] hover:outline hover:outline-offset-2 hover:outline-1 hover:outline-[#673ab7] ${
                                            chatBotInfo.avatar === item ? 'outline outline-offset-2 outline-1 outline-[#673ab7]' : ''
                                        }`}
                                        src={item}
                                    />
                                ))}
                            </div>
                        </div>
                    </div>
                    <div className={'mt-1'}>
                        <div className="flex justify-end items-center">
                            <Button
                                color="secondary"
                                size="small"
                                variant="text"
                                onClick={() => {
                                    setTags(['Optimize Prompt', 'Chat', 'Desc']);
                                    setAppOpen(true);
                                    setTitle('简介优化');
                                    setAppValues(chatBotInfo.introduction);
                                }}
                            >
                                一键AI生成
                            </Button>
                            <span className={'text-#697586'}>{chatBotInfo.enableIntroduction ? '展示' : '不展示'}</span>
                            <Switch
                                color={'secondary'}
                                checked={chatBotInfo.enableIntroduction}
                                onChange={() => {
                                    setChatBotInfo({
                                        ...chatBotInfo,
                                        enableIntroduction: !chatBotInfo.enableIntroduction
                                    });
                                }}
                            />
                        </div>
                        <TextField
                            className={'mt-1'}
                            size={'small'}
                            fullWidth
                            multiline={true}
                            maxRows={5}
                            minRows={5}
                            InputLabelProps={{ shrink: true }}
                            value={chatBotInfo.introduction}
                            error={(chatBotInfo?.introduction?.length || 0) > 300}
                            label={'简介'}
                            onChange={(e) => {
                                const value = e.target.value;
                                setChatBotInfo({ ...chatBotInfo, introduction: value });
                            }}
                        />
                        <div className="text-right text-stone-600 mr-1 mt-1">{chatBotInfo?.introduction?.length || 0}/300</div>
                    </div>
                    <div className={'mt-5'}>
                        <div className="flex justify-between">
                            <div className="flex justify-between flex-col">
                                <span className={'text-base text-black'}>声音</span>
                                <div className={'text-#697586'}>让你的机器人说话吧！</div>
                            </div>
                            <div className="flex justify-end items-center">
                                <span className={'text-#697586'}>{chatBotInfo.enableVoice ? '启用' : '不启用'}</span>
                                <Switch
                                    disabled
                                    color={'secondary'}
                                    checked={chatBotInfo.enableVoice}
                                    onChange={() => {
                                        setChatBotInfo({
                                            ...chatBotInfo,
                                            enableVoice: !chatBotInfo.enableVoice
                                        });
                                    }}
                                />
                            </div>
                        </div>
                        {chatBotInfo.enableVoice && (
                            <div className={'mt-3'}>
                                <Button
                                    variant={'contained'}
                                    startIcon={<GraphicEqIcon />}
                                    color={'secondary'}
                                    size={'small'}
                                    onClick={() => setVoiceOpen(true)}
                                >
                                    选择声音
                                </Button>
                                {chatBotInfo.voiceName && (
                                    <Button
                                        className={'ml-3'}
                                        startIcon={<PlayCircleOutlineIcon />}
                                        variant={'contained'}
                                        color={'secondary'}
                                        size={'small'}
                                    >
                                        {chatBotInfo.voiceName}
                                    </Button>
                                )}
                            </div>
                        )}
                    </div>
                </div>
                <div className={'mt-10'}>
                    <span
                        className={
                            "before:bg-[#673ab7] before:left-0 before:top-[7px] before:content-[''] before:w-[3px] before:h-[14px] before:absolute before:ml-0.5 block text-lg font-medium pl-[12px] relative"
                        }
                    >
                        对话配置
                    </span>
                    <div className={'mt-0'}>
                        <div className="flex justify-end items-center">
                            <Button
                                color="secondary"
                                size="small"
                                variant="text"
                                onClick={() => {
                                    setTags(['Optimize Prompt', 'Chat', 'Welcome']);
                                    setAppOpen(true);
                                    setTitle('欢迎语优化');
                                    setAppValues(chatBotInfo.introduction);
                                }}
                            >
                                一键AI生成
                            </Button>
                            <span className={'text-#697586'}>{chatBotInfo.enableStatement ? '展示' : '不展示'}</span>
                            <Switch
                                color={'secondary'}
                                checked={chatBotInfo.enableStatement}
                                onChange={(e) => {
                                    const value = e.target.value;
                                    setChatBotInfo({ ...chatBotInfo, enableStatement: !chatBotInfo.enableStatement });
                                }}
                            />
                        </div>
                        <TextField
                            className={'mt-1'}
                            size={'small'}
                            fullWidth
                            multiline={true}
                            maxRows={5}
                            minRows={5}
                            error={(chatBotInfo?.statement?.length || 0) > 300}
                            aria-valuemax={200}
                            label={'欢迎语'}
                            placeholder="打开聊天窗口后会主动发送"
                            InputLabelProps={{ shrink: true }}
                            value={chatBotInfo.statement}
                            onChange={(e) => {
                                const value = e.target.value;
                                setChatBotInfo({ ...chatBotInfo, statement: value });
                            }}
                        />
                        <div className="text-right text-stone-600 mr-1 mt-1 flex items-center justify-between">
                            <div className="ml-1">
                                打开聊天窗口后会主动发送的内容，可以写一写常见提问示例。提问示例格式：#帮我写一篇产品推荐文案#
                            </div>
                            <div>{chatBotInfo?.statement?.length || 0}/300</div>
                        </div>
                        {/* <div className={'mt-5'}>
                            <span className={'text-base'}>设置常见问题引导用户如何使用</span>
                            {chatBotInfo.guideList?.map((item, index) => (
                                <div className={'flex items-center mt-3 w-1/2'} key={index}>
                                    <TextField
                                        label={'欢迎语'}
                                        className={'mt-1'}
                                        size={'small'}
                                        fullWidth
                                        value={item}
                                        placeholder={'输入常见问题来指导用户'}
                                        onChange={(e) => {
                                            let guideList = [...chatBotInfo.guideList!];
                                            guideList[index] = e.target.value;
                                            setChatBotInfo({ ...chatBotInfo, guideList });
                                        }}
                                    />
                                    {index + 1 === chatBotInfo?.guideList?.length && chatBotInfo.guideList.length < 5 && (
                                        <Button
                                            className={'min-w-[40px] h-[40px] ml-3'}
                                            startIcon={<AddIcon />}
                                            variant={'outlined'}
                                            color={'secondary'}
                                            size={'small'}
                                            sx={{
                                                '& .MuiButton-startIcon': {
                                                    marginRight: 0
                                                }
                                            }}
                                            onClick={() => {
                                                setChatBotInfo({ ...chatBotInfo, guideList: [...chatBotInfo?.guideList!, ''] });
                                            }}
                                        />
                                    )}
                                    {chatBotInfo?.guideList?.length !== 1 && (
                                        <Button
                                            className={'min-w-[40px] h-[40px] ml-2'}
                                            startIcon={<RemoveIcon />}
                                            variant={'outlined'}
                                            color={'secondary'}
                                            size={'small'}
                                            sx={{
                                                '& .MuiButton-startIcon': {
                                                    marginRight: 0
                                                }
                                            }}
                                            onClick={() => {
                                                const guideList = [...chatBotInfo?.guideList!];
                                                guideList.splice(index, 1);
                                                setChatBotInfo({ ...chatBotInfo, guideList: [...guideList] });
                                            }}
                                        />
                                    )}
                                </div>
                            ))}
                        </div> */}
                    </div>
                    {/* <div className={'mt-5'}>
                        <span className={'text-base'}>快捷方式</span>
                        <div className={'mt-3'}>
                            <Button
                                variant={'contained'}
                                startIcon={<AddIcon />}
                                color={'secondary'}
                                size={'small'}
                                onClick={() => setShortcutOpen(true)}
                            >
                                添加快捷方式
                            </Button>
                            <ShortcutRecord />
                        </div>
                    </div> */}
                </div>
                <div className={'mt-10'}>
                    <span
                        className={
                            "before:bg-[#673ab7] before:left-0 before:top-[7px] before:content-[''] before:w-[3px] before:h-[14px] before:absolute before:ml-0.5 block text-lg font-medium pl-[12px] relative"
                        }
                    >
                        品牌包装
                    </span>

                    <Popover
                        placement="topLeft"
                        content={
                            <div className="flex justify-start items-center flex-col">
                                <div className="text-sm text-center w-[330px]">
                                    <div>功能正在封闭测试中。</div>
                                    <div>可联系我们产品顾问进一步了解，</div>
                                    <div>并获得提前免费使用的权利。</div>
                                </div>
                                <img className="w-40" src={workWechatPay} alt="" />
                            </div>
                        }
                        trigger="hover"
                    >
                        <div className={'mt-5'}>
                            <div className="flex justify-between">
                                <div className="flex justify-between flex-col">
                                    <span className={'text-base text-black'}>logo&品牌</span>
                                </div>
                            </div>
                            <div className="flex justify-end items-center">
                                <span className={'text-#697586'}>{'展示'}</span>
                                <Switch disabled color={'secondary'} checked={true} />
                            </div>

                            <div>
                                <div className="flex items-center">
                                    <svg
                                        version="1.1"
                                        id="Layer_1"
                                        xmlns="http://www.w3.org/2000/svg"
                                        xmlnsXlink="http://www.w3.org/1999/xlink"
                                        x="0px"
                                        y="0px"
                                        width="48px"
                                        height="48px"
                                        viewBox="0 0 48 48"
                                        enableBackground="new 0 0 48 48"
                                        xmlSpace="preserve"
                                    >
                                        <image
                                            id="image0"
                                            width="48"
                                            height="48"
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
                                    <div className={'w-1/3 ml-3'}>
                                        <TextField
                                            label={'品牌'}
                                            disabled
                                            className={'mt-1'}
                                            value={'魔法AI'}
                                            fullWidth
                                            InputLabelProps={{ shrink: true }}
                                            size={'small'}
                                        />
                                    </div>
                                </div>
                            </div>
                        </div>
                    </Popover>
                </div>
            </div>
            {voiceOpen && (
                <VoiceModal
                    open={voiceOpen}
                    handleClose={closeVoiceModal}
                    chatBotInfo={chatBotInfo}
                    setChatBotInfo={setChatBotInfo}
                    list={list}
                />
            )}
            {shortcutOpen && <ShortcutModal open={shortcutOpen} handleClose={() => setShortcutOpen(false)} />}
            {appOpen && <AppModal title={title} value={appValues} open={appOpen} emits={emits} tags={tags} setOpen={setAppOpen} />}
        </>
    );
};
