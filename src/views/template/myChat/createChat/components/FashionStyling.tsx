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
import { Upload, UploadFile, UploadProps } from 'antd';
import { getAvatarList, getVoiceList } from 'api/chat';
import { t } from 'hooks/web/useI18n';
import React, { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';
import { dispatch } from 'store';
import { gridSpacing } from 'store/constant';
import { openSnackbar } from 'store/slices/snackbar';
import MainCard from 'ui-component/cards/MainCard';
import { getAccessToken } from 'utils/auth';
import { config } from 'utils/axios/config';
import { v4 as uuidv4 } from 'uuid';
import { IChatInfo } from '../index';

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

    const location = useLocation();
    const searchParams = new URLSearchParams(location.search);

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
            </div>
            <VoiceModal
                open={voiceOpen}
                handleClose={closeVoiceModal}
                chatBotInfo={chatBotInfo}
                setChatBotInfo={setChatBotInfo}
                list={list}
            />
            <ShortcutModal open={shortcutOpen} handleClose={() => setShortcutOpen(false)} />
        </>
    );
};
