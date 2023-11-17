import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import {
    Box,
    Button,
    Card,
    CardHeader,
    Divider,
    IconButton,
    Link,
    ListItemIcon,
    MenuItem,
    Tab,
    Tabs,
    Typography,
    Menu
} from '@mui/material';
import ErrorIcon from '@mui/icons-material/Error';
import { chatSave, deleteApp, getChatInfo } from 'api/chat';
import { useWindowSize } from 'hooks/useWindowSize';
import { t } from 'hooks/web/useI18n';
import { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { dispatch } from 'store';
import { openSnackbar } from 'store/slices/snackbar';
import { TabsProps } from 'types';
import { Details } from 'types/template';
import { Chat } from './components/Chat';
import { FashionStyling } from './components/FashionStyling';
import { Knowledge } from './components/Knowledge';
import { Regulation } from './components/Regulation';
import { Skill } from './components/Skill';
import Upload from '../../myTemplate/components/createTemplate/upLoad';
import ApplicationAnalysis from 'views/template/applicationAnalysis';
import DeleteIcon from '@mui/icons-material/Delete';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import { Confirm } from 'ui-component/Confirm';
import { VideoModel } from '../components/VideoModel';

export function TabPanel({ children, value, index, ...other }: TabsProps) {
    return (
        <div role="tabpanel" hidden={value !== index} id={`simple-tabpanel-${index}`} aria-labelledby={`simple-tab-${index}`} {...other}>
            <Box sx={{ p: 2, display: value === index ? 'block' : 'none' }}>
                <Box>{children}</Box>
            </Box>
        </div>
    );
}

export function a11yProps(index: number) {
    return {
        id: `simple-tab-${index}`,
        value: index,
        'aria-controls': `simple-tabpanel-${index}`
    };
}

export type IChatInfo = {
    name?: string;
    avatar?: string;
    uid?: string;
    prePrompt?: string;
    statement?: string; // 欢迎语
    enableStatement?: boolean;
    temperature?: number;
    guideList?: string[];
    introduction?: string; // 简介
    enableIntroduction?: boolean;
    enableVoice?: boolean;
    defaultImg?: string;
    voiceName?: string;
    voiceStyle?: string;
    voicePitch?: number;
    voiceSpeed?: number;
    enableSearchInWeb?: boolean;
    searchInWeb?: string;
    skillWorkflowList?: any[];
    modelProvider?: string;
};

function CreateDetail() {
    //路由跳转
    const navigate = useNavigate();
    const location = useLocation();
    const searchParams = new URLSearchParams(location.search);
    const [detail, setDetail] = useState(null as unknown as Details);
    const [chatBotInfo, setChatBotInfo] = useState<IChatInfo>({
        guideList: ['', '']
    });
    const [delAnchorEl, setDelAnchorEl] = useState<null | HTMLElement>(null);
    const delOpen = Boolean(delAnchorEl);
    const [dialogOpen, setDialogOpen] = useState(false);

    const { width } = useWindowSize();

    useEffect(() => {
        if (searchParams.get('appId')) {
            getChatInfo({ appId: searchParams.get('appId') as string }).then((res) => {
                setDetail(res);
                setChatBotInfo({
                    ...chatBotInfo,
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
            });
        }
    }, []);

    //保存更改
    const saveDetail = async () => {
        if (chatBotInfo?.skillWorkflowList?.filter((v) => !v.disabled).length && chatBotInfo.modelProvider !== 'GPT4') {
            dispatch(
                openSnackbar({
                    open: true,
                    message: '开启技能的同时模型必须选择默认模型4.0',
                    variant: 'alert',
                    alert: {
                        color: 'error'
                    },
                    close: false
                })
            );
            return;
        }
        if (chatBotInfo.name === undefined || chatBotInfo.name === '') {
            dispatch(
                openSnackbar({
                    open: true,
                    message: '名称不能为空',
                    variant: 'alert',
                    alert: {
                        color: 'error'
                    },
                    close: false
                })
            );
            return;
        }
        if (chatBotInfo.name?.length > 20) {
            dispatch(
                openSnackbar({
                    open: true,
                    message: '名称长度不能超过20个字',
                    variant: 'alert',
                    alert: {
                        color: 'error'
                    },
                    close: false
                })
            );
            return;
        }

        if (chatBotInfo.prePrompt === undefined || chatBotInfo.prePrompt === '') {
            dispatch(
                openSnackbar({
                    open: true,
                    message: '角色描述不能为空',
                    variant: 'alert',
                    alert: {
                        color: 'error'
                    },
                    close: false
                })
            );
            return;
        }
        if (chatBotInfo.prePrompt.length > 1000) {
            dispatch(
                openSnackbar({
                    open: true,
                    message: '角色描述不能超过1000字',
                    variant: 'alert',
                    alert: {
                        color: 'error'
                    },
                    close: false
                })
            );
            return;
        }
        if (chatBotInfo.introduction && chatBotInfo.introduction.length > 300) {
            dispatch(
                openSnackbar({
                    open: true,
                    message: '简介不能超过300字',
                    variant: 'alert',
                    alert: {
                        color: 'error'
                    },
                    close: false
                })
            );
            return;
        }
        if (chatBotInfo.statement && chatBotInfo.statement.length > 300) {
            dispatch(
                openSnackbar({
                    open: true,
                    message: '欢迎语不能超过300字',
                    variant: 'alert',
                    alert: {
                        color: 'error'
                    },
                    close: false
                })
            );
            return;
        }
        if (chatBotInfo.searchInWeb) {
            const websites = chatBotInfo.searchInWeb
                .trim()
                .split('\n')
                .map((item) => item.trim());
            // 简单验证每个网站地址
            const isValidInput = websites.every((website) =>
                /^(https?:\/\/)?([\w.-]+\.[a-z]{2,6})(:[0-9]{1,5})?([/\w.-]*)*\/?$/.test(website)
            );
            if (websites.length > 10) {
                dispatch(
                    openSnackbar({
                        open: true,
                        message: '网络搜索范围地址不能超过10个',
                        variant: 'alert',
                        alert: {
                            color: 'error'
                        },
                        close: false
                    })
                );
                return;
            }

            if (!isValidInput) {
                dispatch(
                    openSnackbar({
                        open: true,
                        message: '请输入正确的网络搜索范围',
                        variant: 'alert',
                        alert: {
                            color: 'error'
                        },
                        close: false
                    })
                );
                return;
            }
        }
        const data: any = detail;
        data.name = chatBotInfo.name;
        data.images = [chatBotInfo.avatar];
        data.chatConfig.prePrompt = chatBotInfo.prePrompt;
        data.chatConfig.modelConfig.completionParams.temperature = chatBotInfo.temperature;
        data.chatConfig.modelConfig.provider = chatBotInfo.modelProvider;
        data.chatConfig.openingStatement = { statement: chatBotInfo.statement, enabled: chatBotInfo.enableStatement };
        data.chatConfig.description.enabled = chatBotInfo.enableIntroduction;
        data.description = chatBotInfo.introduction;
        data.chatConfig.webSearchConfig = {
            enabled: chatBotInfo.enableSearchInWeb,
            webScope: chatBotInfo.searchInWeb
        };
        await chatSave(data);
        setSaveState(saveState + 1);
        dispatch(
            openSnackbar({
                open: true,
                message: '保存成功',
                variant: 'alert',
                alert: {
                    color: 'success'
                },
                close: false
            })
        );
    };

    //tabs
    const [value, setValue] = useState(1);
    const [saveState, setSaveState] = useState(0);
    const [videoOpen, setVideoOpen] = useState(false);

    const handleChange = (event: any, newValue: number) => {
        setValue(newValue);
    };

    const updateDetail = async () => {
        await saveDetail();
        // setSaveState(saveState + 1);
    };
    //获取状态
    const [flag, setflag] = useState<boolean>(false);
    const getStatus = (data: boolean) => {
        setflag(data);
    };
    return (
        <div className="grid grid-cols-12 gap-4">
            <Card className="xl:col-span-8 xs:col-span-12 relative">
                <CardHeader
                    sx={{ padding: 2 }}
                    avatar={
                        <Button variant="contained" startIcon={<ArrowBackIcon />} color="secondary" onClick={() => navigate('/my-chat')}>
                            {t('myApp.back')}
                        </Button>
                    }
                    title={chatBotInfo?.name}
                    action={
                        <div className="flex items-center">
                            <span className="cursor-pointer text-[#6839b7] ml-1" onClick={() => setVideoOpen(true)}>
                                查看视频教程
                            </span>
                            <IconButton
                                aria-label="more"
                                id="long-button"
                                aria-haspopup="true"
                                onClick={(e) => {
                                    setDelAnchorEl(e.currentTarget);
                                }}
                            >
                                <MoreVertIcon />
                            </IconButton>
                            <Menu
                                id="del-menu"
                                MenuListProps={{
                                    'aria-labelledby': 'del-button'
                                }}
                                anchorEl={delAnchorEl}
                                open={delOpen}
                                onClose={() => {
                                    setDelAnchorEl(null);
                                }}
                            >
                                <MenuItem
                                    onClick={() => {
                                        setDialogOpen(true);
                                    }}
                                >
                                    <ListItemIcon>
                                        <DeleteIcon color="error" />
                                    </ListItemIcon>
                                    <Typography variant="inherit" noWrap>
                                        删除机器人
                                    </Typography>
                                </MenuItem>
                            </Menu>
                        </div>
                    }
                    // action={
                    //     (value === 0 || value === 1 || value === 6) && (
                    //         <Button
                    //             // className="right-[25px] top-[85px] absolute z-50"
                    //             variant="contained"
                    //             color="secondary"
                    //             autoFocus
                    //             onClick={saveDetail}
                    //         >
                    //             {t('myApp.save')}
                    //         </Button>
                    //     )
                    // }
                ></CardHeader>
                <Divider />
                <Tabs value={value} variant="scrollable" onChange={handleChange}>
                    <Tab component={Link} label={'形象设计'} {...a11yProps(0)} />
                    <Tab component={Link} label={'规则设定'} {...a11yProps(1)} />
                    <Tab component={Link} label={'知识库'} {...a11yProps(3)} />
                    <Tab component={Link} label={'技能'} {...a11yProps(4)} />
                    {width < 1280 && <Tab component={Link} label={'调试'} {...a11yProps(5)} />}
                    <Tab
                        component={Link}
                        label={
                            <Box display="flex" alignItems="center">
                                对外发布
                                {flag && <ErrorIcon color="warning" sx={{ fontSize: '14px' }} />}
                            </Box>
                        }
                        {...a11yProps(6)}
                    />
                    <Tab component={Link} label={'应用分析'} {...a11yProps(7)} />
                </Tabs>
                <TabPanel value={value} index={0}>
                    <FashionStyling setChatBotInfo={setChatBotInfo} chatBotInfo={chatBotInfo} handleSave={saveDetail} />
                </TabPanel>
                <TabPanel value={value} index={1}>
                    <Regulation setChatBotInfo={setChatBotInfo} chatBotInfo={chatBotInfo} handleSave={saveDetail} />
                </TabPanel>
                <TabPanel value={value} index={7}>
                    <ApplicationAnalysis appUid={detail?.uid} value={value} type="CHAT_ANALYSIS" />
                </TabPanel>
                <TabPanel value={value} index={3}>
                    {detail?.uid && <Knowledge datasetId={detail.uid} />}
                </TabPanel>
                <TabPanel value={value} index={4}>
                    <Skill setChatBotInfo={setChatBotInfo} chatBotInfo={chatBotInfo} />
                </TabPanel>

                {width < 1330 && (
                    <TabPanel value={value} index={5}>
                        <div className="h-screen">
                            <Chat chatBotInfo={chatBotInfo} mode={'test'} setChatBotInfo={setChatBotInfo} statisticsMode={'CHAT_TEST'} />
                        </div>
                    </TabPanel>
                )}
                <TabPanel value={value} index={6}>
                    {detail?.uid && (
                        <Upload
                            appUid={detail?.uid}
                            saveState={saveState}
                            saveDetail={updateDetail}
                            getStatus={getStatus}
                            mode={'CHAT'}
                            handleSave={saveDetail}
                        />
                    )}
                </TabPanel>
            </Card>
            {value !== 5 && (
                <div className="xl:col-span-4 xl:block xs:hidden h-[calc(100vh-154px)]">
                    <div className="text-base color-[#121926]">预览与调试</div>
                    <Card className="h-full">
                        <Chat chatBotInfo={chatBotInfo} mode={'test'} setChatBotInfo={setChatBotInfo} statisticsMode={'CHAT_TEST'} />
                    </Card>
                </div>
            )}
            <Confirm
                handleOk={() => {
                    deleteApp(searchParams.get('appId') as string).then((res) => {
                        if (res) {
                            setDelAnchorEl(null);
                            navigate('/my-chat');
                        }
                    });
                }}
                open={dialogOpen}
                handleClose={() => {
                    setDelAnchorEl(null);
                    setDialogOpen(false);
                }}
                title="提醒"
                content="确认删除该机器人？"
            />
            {videoOpen && <VideoModel open={videoOpen} handleClose={() => setVideoOpen(false)} />}
        </div>
    );
}

export default CreateDetail;
