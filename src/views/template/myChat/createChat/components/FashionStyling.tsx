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
import { getAvatarList, getVoiceList, testSpeakerSSE } from 'api/chat';
import React, { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';
import { gridSpacing } from 'store/constant';
import MainCard from 'ui-component/cards/MainCard';
import { getAccessToken } from 'utils/auth';
import { IChatInfo } from '../index';

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
    setChatBotInfo
}: {
    open: boolean;
    handleClose: () => void;
    chatBotInfo: IChatInfo;
    setChatBotInfo: (chatInfo: IChatInfo) => void;
}) => {
    const [name, setName] = useState('');
    const [style, setStyle] = useState('');
    const [speed, setSpeed] = useState(1);
    const [pitch, setPitch] = useState(1);

    const [list, setList] = useState<IVoiceType[]>([]);

    const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setName((event.target as HTMLInputElement).value);
    };

    useEffect(() => {
        (async () => {
            const res = await getVoiceList();
            setName(res?.[0]?.LocalName);
            setList(res || []);
        })();
    }, []);

    const styleList = React.useMemo(() => {
        const item = list.find((v) => v.LocalName === name);
        return item?.StyleList || [];
    }, [list, name]);

    const handleTest = async () => {
        try {
            // const response = await fetch('http://www.w3schools.com/html/horse.mp3');
            let response: any = await testSpeakerSSE({
                shortName: 'zh-CN-YunyeNeural'
                // prosodyRate: 'CHAT_TEST',
                // prosodyPitch,
            });
            console.log(response);
            const arrayBuffer = await response.arrayBuffer();
            console.log(arrayBuffer);
            // const response = await axios({
            //     method: 'post',
            //     url: 'http://www.w3schools.com/html/horse.mp3',
            //     responseType: 'arraybuffer'
            // });

            const audioContext = new window.AudioContext();
            if (audioContext.state === 'suspended') {
                await audioContext.resume();
            }

            // 将ArrayBuffer转换为AudioBuffer
            audioContext.decodeAudioData(
                // response.data,
                arrayBuffer,
                (buffer) => {
                    // 创建AudioBufferSourceNode
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
        } catch (error) {
            console.error('播放音频时出错：', error);
        }

        // let resp: any = await testSpeakerSSE({
        //     shortName: 'zh-CN-YunyeNeural'
        //     // prosodyRate: 'CHAT_TEST',
        //     // prosodyPitch,
        // });
        // const reader = resp.getReader();
        // let outerJoins: any;
        // while (1) {
        //     let joins = outerJoins;
        //     const { done, value } = await reader.read();
        //     if (done) {
        //         console.log('done');
        //         break;
        //     }
        //     // 创建AudioContext对象
        //     const audioContext = new window.AudioContext();
        //     const uint8Array = new Uint8Array(value);
        //     const arrayBuffer = uint8Array.buffer;
        //     // 将ArrayBuffer转换为AudioBuffer
        //     audioContext.decodeAudioData(
        //         arrayBuffer,
        //         (buffer) => {
        //             // 创建AudioBufferSourceNode
        //             const sourceNode = audioContext.createBufferSource();
        //             sourceNode.buffer = buffer;
        //             // 连接节点到扬声器
        //             sourceNode.connect(audioContext.destination);
        //             // 播放音频
        //             sourceNode.start();
        //         },
        //         (error) => {
        //             console.error('解码音频数据时出错：', error);
        //         }
        //     );
        //     outerJoins = joins;
        // }
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
                                            Style
                                        </InputLabel>
                                        <Select
                                            size={'small'}
                                            id="columnId"
                                            name="columnId"
                                            label={'style'}
                                            className={'w-[150px]'}
                                            value={style}
                                            onChange={(e) => {
                                                setStyle(e.target.value);
                                            }}
                                        >
                                            {styleList.map((item, index) => (
                                                <MenuItem key={index} value={item}>
                                                    {item}
                                                </MenuItem>
                                            ))}
                                        </Select>
                                    </FormControl>
                                </div>

                                <div className={'flex-1 flex items-center justify-center'}>
                                    <div className={'w-4/5 flex items-center justify-center'}>
                                        <span className={'text-sm mr-2'}>Pitch</span>
                                        <Slider
                                            defaultValue={1}
                                            step={0.1}
                                            valueLabelDisplay="auto"
                                            min={0.5}
                                            value={chatBotInfo.voicePitch}
                                            max={1.5}
                                            onChange={(e, value) => {
                                                setChatBotInfo({
                                                    ...chatBotInfo,
                                                    voicePitch: value as number
                                                });
                                            }}
                                        />
                                    </div>
                                </div>

                                <div className={'flex-1 flex items-center justify-center'}>
                                    <div className={'w-4/5 flex items-center justify-center'}>
                                        <span className={'text-sm mr-2'}>Speed</span>
                                        <Slider
                                            className={'w-4/5'}
                                            defaultValue={1}
                                            step={0.1}
                                            valueLabelDisplay="auto"
                                            min={0.5}
                                            max={2}
                                            value={chatBotInfo.voiceSpeed}
                                            onChange={(e, value) => {
                                                setChatBotInfo({
                                                    ...chatBotInfo,
                                                    voiceSpeed: value as number
                                                });
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
                        <Button variant="contained" type="button">
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
    const [visibleVoice, setVisibleVoice] = useState(false);
    const [voiceOpen, setVoiceOpen] = useState(false);
    const [shortcutOpen, setShortcutOpen] = useState(false);
    const [avatarList, setAvatarList] = useState<string[]>([]);
    const [startCheck, setStartCheck] = useState(false);
    const [isFirst, setIsFirst] = useState(true);

    const location = useLocation();
    const searchParams = new URLSearchParams(location.search);

    useEffect(() => {
        setChatBotInfo({ ...chatBotInfo, enableVoice: visibleVoice });
    }, [visibleVoice]);

    const closeVoiceModal = () => {
        setVoiceOpen(false);
    };

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
            console.log(2);
            (async () => {
                const res = await getAvatarList();
                setAvatarList([chatBotInfo.defaultImg, ...res]);
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

    return (
        <>
            <div>
                <div>
                    <span
                        className={
                            "before:bg-[#673ab7] before:left-0 before:top-[7px] before:content-[''] before:w-[3px] before:h-[14px] before:absolute before:ml-0.5 block text-lg font-medium pl-[12px] relative text-black"
                        }
                    >
                        基本信息
                    </span>
                    <div className={'mt-5 w-1/3'}>
                        <TextField
                            label={'名称'}
                            className={'mt-1'}
                            value={chatBotInfo.name}
                            error={startCheck && !chatBotInfo.name}
                            helperText={(!chatBotInfo.name && '请填写名称') || <div className="h-[20px]" />}
                            fullWidth
                            InputLabelProps={{ shrink: true }}
                            size={'small'}
                            onChange={(e) => {
                                const value = e.target.value;
                                setStartCheck(true);
                                setChatBotInfo({ ...chatBotInfo, name: value });
                            }}
                        />
                    </div>
                    <div className={'mt-3'}>
                        <span className={'text-base text-black'}>头像</span>
                        <div className={'mt-1 flex items-center'}>
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
                                        className={`w-[102px] h-[102px]  rounded-lg object-fill cursor-pointer mr-[8px] mb-[8px] hover:outline hover:outline-offset-2 hover:outline-2 hover:outline-[#673ab7] ${
                                            chatBotInfo.avatar === item ? 'outline outline-offset-2 outline-2 outline-[#673ab7]' : ''
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
                                onChange={(e) => {
                                    const value = e.target.value;
                                    console.log(value, 'value');
                                    setChatBotInfo({ ...chatBotInfo, enableIntroduction: !chatBotInfo.enableIntroduction });
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
                                <span className={'text-#697586'}>{visibleVoice ? '启用' : '不启用'}</span>
                                <Switch
                                    disabled
                                    color={'secondary'}
                                    checked={visibleVoice}
                                    onChange={(e) => setVisibleVoice(e.target.checked)}
                                />
                            </div>
                        </div>
                        {false && (
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
                                <Button
                                    className={'ml-3'}
                                    startIcon={<PlayCircleOutlineIcon />}
                                    variant={'contained'}
                                    color={'secondary'}
                                    size={'small'}
                                >
                                    林志玲
                                </Button>
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
                        <div className="text-right text-stone-600 mr-1 mt-1">{chatBotInfo?.statement?.length || 0}/300</div>
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
            <VoiceModal open={voiceOpen} handleClose={closeVoiceModal} chatBotInfo={chatBotInfo} setChatBotInfo={setChatBotInfo} />
            <ShortcutModal open={shortcutOpen} handleClose={() => setShortcutOpen(false)} />
        </>
    );
};
