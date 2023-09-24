import { Box, Button, Card, Switch, TextField } from '@mui/material';
import { Upload, UploadFile, UploadProps } from 'antd';
import { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';
import { getAccessToken } from 'utils/auth';
import { IChatInfo } from 'views/template/myChat/createChat';
import AddIcon from '@mui/icons-material/Add';
import { config } from 'utils/axios/config';
import AppModal from 'views/picture/create/Menu/appModal';
import { Chat } from '../../template/myChat/createChat/components/Chat';
import { v4 as uuidv4 } from 'uuid';
import { getAvatarList, getChatInfo } from 'api/chat';

/**
 * 新增机器人页面
 */
const { base_url } = config;
const createBot = () => {
    const [chatBotInfo, setChatBotInfo] = useState<IChatInfo>({});
    const [fileList, setFileList] = useState<UploadFile[]>([]);
    const [avatarList, setAvatarList] = useState<string[]>([]);
    const [startCheck, setStartCheck] = useState(false);
    const [title, setTitle] = useState('');
    const [appOpen, setAppOpen] = useState(false);
    const [appValues, setAppValues] = useState<any>('');
    const [tags, setTags] = useState<any[]>([]);
    const [regulationText, setRegulationText] = useState('');
    const [isFirst, setIsFirst] = useState(true);

    const location = useLocation();
    const searchParams = new URLSearchParams(location.search);

    useEffect(() => {
        if (searchParams.get('appId')) {
            getChatInfo({ appId: searchParams.get('appId') as string }).then((res) => {
                setChatBotInfo((preState) => {
                    return {
                        ...preState,
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
                        modelProvider:
                            res?.chatConfig?.modelConfig?.provider === 'openai' ? 'GPT35' : res?.chatConfig?.modelConfig?.provider
                    };
                });
            });
        }
    }, []);

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

    const emits = (data: any) => {
        setAppOpen(false);
        if (tags.includes('Desc')) {
            setChatBotInfo({ ...chatBotInfo, introduction: data });
        } else if (tags.includes('Welcome')) {
            setChatBotInfo({ ...chatBotInfo, statement: data });
        }
    };

    const uploadButton = (
        <div>
            <AddIcon />
            <div style={{ marginTop: 8 }}>上传</div>
        </div>
    );

    return (
        <div className="grid grid-cols-12 gap-4">
            <Card className="xl:col-span-8 xs:col-span-12 relative p-[16px]">
                <h3 className="text-[#303133] font-medium text-xl mb-6">创建机器人</h3>
                <div className="inline-block p-4 bg-[#F2F3F5] rounded-lg mb-10 lg:block md:w-[484px] sm:w-full">
                    <p className="text-xs text-[#596780] leading-5 mb-3">通过以下两种方式之一，只要 20 秒即可快速填充基础信息</p>
                    <div className="grid md:grid-cols-2 gap-5 sm:grid-cols-1 md:gap-4">
                        <div className="flex cursor-pointer bg-white items-center rounded-lg py-4 px-6 gap-4">
                            <svg className="w-8 h-8 text-[#7c5cfc] shrink-0">
                                <use href="#icon-collection"></use>
                            </svg>
                            <div className="space-y-1">
                                <p className="text-[#303133] text-sm font-medium tracking-[0.13px] transition-colors">选择模版创建</p>
                                <p className="text-[#9DA3AF] text-xs transition-colors">海量模版助你快速创建</p>
                            </div>
                        </div>
                        <div className="flex cursor-pointer bg-white items-center rounded-lg py-4 px-6 gap-4">
                            <svg className="w-8 h-8 text-[#7c5cfc] shrink-0">
                                <use href="#icon-robot-ai"></use>
                            </svg>
                            <div className="space-y-1">
                                <p className="text-[#303133] text-sm font-medium tracking-[0.13px] transition-colors">AI 一键创建</p>
                                <p className="text-[#9DA3AF] text-xs transition-colors">AI 生成，匹配度更高</p>
                            </div>
                        </div>
                    </div>
                </div>
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
                            action={`${process.env.REACT_APP_BASE_URL}${process.env.REACT_APP_API_URL}/llm/chat/avatar/${searchParams.get(
                                'appId'
                            )}`}
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
                        maxRows={3}
                        minRows={3}
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
                <span
                    className={
                        "before:bg-[#673ab7] before:left-0 before:top-[2px] before:content-[''] before:w-[3px] before:h-[14px] before:absolute before:ml-0.5 block text-[1.125rem] font-medium pl-[12px] relative text-black"
                    }
                >
                    基本规则
                </span>
                <div>
                    <Box className={'mt-0'} display="flex" justifyContent="right">
                        <Button
                            color="secondary"
                            size="small"
                            variant="text"
                            onClick={() => {
                                setTags(['Chat', 'Optimize Prompt', 'Role']);
                                setAppOpen(true);
                            }}
                        >
                            一键AI生成
                        </Button>
                    </Box>
                    <TextField
                        value={regulationText}
                        label={'角色描述'}
                        className={'mt-1'}
                        fullWidth
                        size={'small'}
                        multiline={true}
                        maxRows={18}
                        minRows={10}
                        InputLabelProps={{ shrink: true }}
                        onChange={(e) => {
                            setStartCheck(true);
                            setRegulationText(e.target.value);
                        }}
                        error={(regulationText?.length || 0) > 1000 || (startCheck && !regulationText)}
                    />
                    <div className="flex justify-between">
                        {startCheck && !regulationText ? (
                            <div className="text-[#f44336] mt-1">请输入角色描述</div>
                        ) : (
                            <div className="mt-1">机器人将根据以上内容，明确具体的职责进行回答。请尽量输入重要且精准的要求。</div>
                        )}
                        <div className="text-right text-stone-600 mr-1 mt-1">{regulationText?.length || 0}/1000</div>
                    </div>
                </div>

                <div className="mt-5">
                    <span
                        className={
                            "before:bg-[#673ab7] before:left-0 before:top-[2px] before:content-[''] before:w-[3px] before:h-[14px] before:absolute before:ml-0.5 block text-[1.125rem] font-medium pl-[12px] relative text-black"
                        }
                    >
                        对话配置
                    </span>
                    <div className={'mt-2'}>
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
                                <div className="ml-1 text-left">
                                    打开聊天窗口后会主动发送的内容，可以写一写常见提问示例。提问示例格式：#帮我写一篇产品推荐文案#
                                </div>
                                <div>{chatBotInfo?.statement?.length || 0}/300</div>
                            </div>
                        </div>
                    </div>
                </div>
            </Card>
            <div className="xl:col-span-4 xl:block xs:hidden h-[calc(100vh-154px)]">
                <div className="text-base color-[#121926]">预览与调试</div>
                <Card className="h-full">
                    <Chat chatBotInfo={chatBotInfo} mode={'test'} setChatBotInfo={setChatBotInfo} statisticsMode={'CHAT_TEST'} />
                </Card>
            </div>
            {appOpen && <AppModal title={title} value={appValues} open={appOpen} emits={emits} tags={tags} setOpen={setAppOpen} />}
        </div>
    );
};

export default createBot;
