import {
    Box,
    Grid,
    Typography,
    Button,
    IconButton,
    Chip,
    Dialog,
    DialogTitle,
    DialogContent,
    Table,
    TableHead,
    TableRow,
    TableCell,
    TableContainer,
    Paper,
    Pagination,
    Tooltip,
    Switch,
    Tabs,
    Tab,
    TextField
} from '@mui/material';
import { UpgradeModel } from 'views/template/myChat/components/upgradeRobotModel';
import { styled } from '@mui/material/styles';
import { TooltipProps, tooltipClasses } from '@mui/material/Tooltip';
import { InputNumber, Popover } from 'antd';
import SubCard from 'ui-component/cards/SubCard';
import { dispatch } from 'store';
import { openSnackbar } from 'store/slices/snackbar';
import {
    Code,
    ContentPaste,
    CheckCircle,
    Storefront,
    CloudUploadOutlined,
    HistoryOutlined,
    Error,
    Monitor,
    Api,
    MoreVert
} from '@mui/icons-material';
import ErrorOutlineIcon from '@mui/icons-material/ErrorOutline';
import { useState, useEffect, useRef } from 'react';
import { useLocation } from 'react-router-dom';
import formatDate from 'hooks/useDate';
import {
    publishCreate,
    publishOperate,
    publishPage,
    getLatest,
    changeStatus,
    channelCreate,
    bindCreateUrl,
    addFriend,
    getLimit,
    createLimit,
    modifyLimit,
    delMarket
} from 'api/template';
import CreateSiteModal from './components/CreateSiteModal';
import WechatModal from './components/wchatModal';
import { SiteDrawerCode } from './components/SiteDrawerCode';
import WeChatDrawer from './components/WeChatDrawer';
import DomainModal from './components/DomainModal';
import WPAccountModal from './components/WPAccountModal';
import _ from 'lodash-es';
import CopySiteModal from './components/CopySiteModal';
import { useAllDetail } from 'contexts/JWTContext';
import useUserStore from 'store/user';
import { ENUM_TENANT, getTenant } from 'utils/permission';
interface TabPanelProps {
    children?: React.ReactNode;
    index: number;
    value: number;
}
type FrequencyData = {
    timeInterval?: number | null;
    threshold?: number | null;
    message?: string;
    enable?: boolean;
};
type Account = {
    timeInterval?: number | null;
    threshold?: number | null;
    message?: string;
    enable?: boolean;
};
type AdvertisingConfig = {
    threshold?: number | null;
    message?: string;
    enable?: boolean;
};
function CustomTabPanel(props: TabPanelProps) {
    const { children, value, index, ...other } = props;

    return (
        <div role="tabpanel" hidden={value !== index} id={`simple-tabpanel-${index}`} aria-labelledby={`simple-tab-${index}`} {...other}>
            {value === index && (
                <Box sx={{ py: 2 }}>
                    <Box>{children}</Box>
                </Box>
            )}
        </div>
    );
}

function a11yProps(index: number) {
    return {
        id: `simple-tab-${index}`,
        'aria-controls': `simple-tabpanel-${index}`
    };
}
const CustomWidthTooltip = styled(({ className, ...props }: TooltipProps) => <Tooltip {...props} classes={{ popper: className }} />)({
    [`& .${tooltipClasses.tooltip}`]: {
        maxWidth: 500
    }
});
function Upload({
    appUid,
    saveState,
    saveDetail,
    mode,
    getStatus,
    handleSave
}: {
    appUid: string;
    saveState: number;
    saveDetail: () => void;
    mode?: 'CHAT';
    getStatus: (data: boolean) => void;
    handleSave?: () => void;
}) {
    const allDetail = useAllDetail();
    const defaultUpLoadList = [
        {
            title: '网页',
            icon: 'monitor',
            desc: '用户在此链接可以直接和您的机器人聊天',
            enable: true,
            enableValue: false,
            comingSoon: false,
            type: 2,
            action: [
                { title: '复制链接', icon: 'contentPaste', onclick: () => setOpenCopySite(true) },
                { title: '预览体验', icon: 'historyOutlined', onclick: () => handleOpenWeb() },
                { title: '域名部署', icon: 'historyOutlined', onclick: () => setOpenDomain(true) }
            ]
        },
        {
            title: 'JS嵌入',
            icon: 'code',
            desc: '可添加到网站的任何位置，将此 iframe 添加到 html 代码中',
            enable: false,
            comingSoon: false,
            action: [
                { title: '创建站点', icon: 'cloudUploadOutlined', onclick: () => setOpenCreateSite(true) },
                {
                    title: '查看代码',
                    icon: 'historyOutlined',
                    onclick: () => {
                        getUpdateBtn();
                        setOpenDrawer(true);
                    }
                }
            ]
        },
        {
            title: '微信群聊',
            icon: 'qiyeweixin',
            desc: '在微信群聊中提供机器人服务',
            enable: false,
            chat: true,
            enableValue: false,
            comingSoon: true,
            type: 2,
            // type: 5,
            action: [
                {
                    title: '创建群聊',
                    icon: 'contentPaste',
                    onclick: () => {
                        // userInfo.benefits.map((value: any) => {
                        //     if (value.name === '微信机器人') {
                        //         if (value.totalNum === -1) {
                        //             setOpenWchat(true);
                        //         } else if (updateBtn.channelMap[7].length < value.totalNum) {
                        //             setOpenWchat(true);
                        //         } else {
                        //             setBotOpen(true);
                        //
                        //     }
                        // });
                        const totalNum = allDetail?.allDetail?.levels[0]?.levelConfigDTO?.usableWechatBot;

                        if (totalNum === -1) {
                            setOpenWchat(true);
                        } else if (updateBtn.channelMap[7].length < totalNum) {
                            setOpenWchat(true);
                        } else {
                            setBotOpen(true);
                        }
                    }
                },
                {
                    title: '查看群聊',
                    icon: 'historyOutlined',
                    onclick: () => {
                        getUpdateBtn();
                        setOpenWeDrawer(true);
                    }
                }
            ]
        },
        {
            title: '微信公众号',
            icon: 'weixingongzhonghao',
            desc: '可在微信公众号后台配置，提供机器人服务',
            enableValue: false,
            comingSoon: false,
            type: 5,
            action: [
                {
                    title: '配置公众号',
                    icon: 'historyOutlined',
                    onclick: async () => {
                        if (updateBtn?.channelMap[12]?.length == 0) {
                            await bindCreateUrl({
                                appUid: updateBtn.appUid,
                                name: updateBtn.name,
                                publishUid: updateBtn.uid,
                                status: 0
                            });
                            getUpdateBtn();
                        }
                        setOpenWPAccount(true);
                    }
                }
            ]
        },
        {
            title: 'API调用',
            icon: 'api',
            desc: '通过API，可直接进行调用或发出请求',
            enable: false,
            comingSoon: true,
            action: [
                { title: '接口秘钥', icon: 'cloudUploadOutlined' },
                { title: '接口文档', icon: 'historyOutlined' }
            ]
        }
    ];
    const [openCreateSite, setOpenCreateSite] = useState(false);
    const [siteName, setSiteName] = useState('');
    const [openDrawer, setOpenDrawer] = useState(false);
    const [openDomain, setOpenDomain] = useState(false);
    const [openCopySite, setOpenCopySite] = useState(false);
    const [upLoadList, setUpLoadList] = useState<any[]>(defaultUpLoadList);
    const [webMediumUid, setWebMediumUid] = useState('');
    const webMediumUidRef = useRef();
    const [openWchat, setOpenWchat] = useState(false);
    const [openWeDrawer, setOpenWeDrawer] = useState(false);
    const [botOpen, setBotOpen] = useState(false);
    const [openWPAccount, setOpenWPAccount] = useState(false);
    //tabs
    const [tabValue, setTabValue] = useState(0);
    const handleChange = (event: React.SyntheticEvent, newValue: number) => {
        setTabValue(newValue);
    };
    //Limit
    const [allData, setAllData] = useState<any>({});
    const [frequencyData, setFrequencyData] = useState<FrequencyData>({});
    const [account, setAccount] = useState<Account>({});
    const [advertisingConfig, setAdvertisingConfig] = useState<AdvertisingConfig>({});
    //获取发布设置
    const getLimitList = async (data: any) => {
        const { appUid, uid } = data;
        const res = await getLimit({ appUid, publishUid: uid });
        setAllData(res);
        setFrequencyData(res.rateConfig);
        setAccount(res.userRateConfig);
        setAdvertisingConfig(res.advertisingConfig);
    };
    //保存发布设置
    const saveSetting = async () => {
        if (allData.uid) {
            const res = await modifyLimit({
                ..._.cloneDeep(allData),
                advertisingConfig: { ...advertisingConfig },
                rateConfig: { ...frequencyData },
                userRateConfig: { ...account }
            });
            getLimitList(updateBtn);
        } else {
            const res = await createLimit({
                ..._.cloneDeep(allData),
                advertisingConfig: { ...advertisingConfig },
                rateConfig: { ...frequencyData },
                userRateConfig: { ...account }
            });
            getLimitList(updateBtn);
        }
    };

    const IconList: { [key: string]: any } = {
        monitor: <Monitor color="secondary" />,
        code: <Code color="secondary" />,
        api: <Api />,
        cloudUploadOutlined: <CloudUploadOutlined sx={{ fontSize: '12px' }} />,
        historyOutlined: <HistoryOutlined sx={{ fontSize: '12px' }} />,
        contentPaste: <ContentPaste sx={{ fontSize: '12px' }} />
    };

    const wchatList = [
        {
            title: '微信群聊',
            desc: '微信群在新创建的微信群聊中提供机器人服务，首位进群人员为管理员；',
            icon: 'weixin',
            comingSoon: true,
            action: [
                { title: '创建群聊', icon: 'cloudUploadOutlined' },
                { title: '查看群聊', icon: 'historyOutlined' }
            ]
        },
        {
            title: '微信公众号',
            desc: '可在微信公众号后台配置，提供机器人服务',
            icon: 'weixingongzhonghao',
            comingSoon: true,
            action: [{ title: '配置微信公众号', icon: 'cloudUploadOutlined' }]
        },
        {
            title: '企业微信',
            desc: '可在企业微信配置，提供微信机器人服务',
            icon: 'qiyeweixin',
            comingSoon: true,
            action: [{ title: '配置企业微信公众号', icon: 'cloudUploadOutlined' }]
        },
        {
            title: '小程序',
            desc: '可在微信公众号后台配置，提供机器人服务',
            icon: 'xiaochengxu',
            comingSoon: true,
            action: [{ title: '小程序', icon: 'cloudUploadOutlined' }]
        }
    ];
    const otherList = [
        {
            title: '飞书',
            icon: 'tuisong'
        },
        {
            title: '钉钉',
            icon: 'wsn-ding-col'
        },
        {
            title: 'QQ',
            icon: 'QQ'
        },
        {
            title: 'APP',
            icon: 'app'
        }
    ];
    const location = useLocation();
    // const searchParams = new URLSearchParams(location.search);
    useEffect(() => {
        if (appUid) {
            getUpdateBtn();
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [appUid]);
    const getUpdateBtn = () => {
        getLatest(appUid).then((res) => {
            getLimitList(res);
            setUpdateBtn(res);
            getStatus(res.needUpdate);
            setReleaseState(res.auditTag);
        });
    };
    //发布状态
    const [releaseState, setReleaseState] = useState<number>(0);
    //页面进入判断更新按钮是否可点
    const [updateBtn, setUpdateBtn] = useState<{
        needUpdate: boolean;
        appLastUpdateTime?: number;
        enablePublish: boolean;
        showPublish?: boolean;
        uid: string;
        appUid?: string;
        needTips: boolean;
        isFirstCreatePublishRecord: boolean;
        channelMap?: any;
        name?: string;
        marketUid?: string;
    }>({
        needUpdate: false,
        showPublish: true,
        enablePublish: false,
        uid: '',
        needTips: true,
        isFirstCreatePublishRecord: true
    });
    useEffect(() => {
        setUpLoadList([...defaultUpLoadList]);
    }, [updateBtn]);
    const [tableData, setTableData] = useState([]);
    //保存按钮是否触发更新
    const [updateBtnSate, setUpdateBtnSate] = useState(false);
    const handleUpdate = () => {
        saveDetail();
        setUpdateBtnSate(true);
    };
    //发布到市场
    const uploadMarket = async () => {
        if (releaseState === 1) {
            const result = await publishOperate({ uid: updateBtn.uid, appUid, status: 4 });
            if (result) {
                getUpdateBtn();
                dispatch(
                    openSnackbar({
                        open: true,
                        message: '操作成功',
                        variant: 'alert',
                        alert: {
                            color: 'success'
                        },
                        close: false
                    })
                );
            }
        } else {
            const result = await publishOperate({ uid: updateBtn.uid, appUid, status: releaseState === 1 ? 4 : 1 });
            if (result) {
                getUpdateBtn();
                dispatch(
                    openSnackbar({
                        open: true,
                        message: '操作成功',
                        variant: 'alert',
                        alert: {
                            color: 'success'
                        },
                        close: false
                    })
                );
            }
        }
    };
    //发表历史记录弹框
    const [historyState, setHistorySate] = useState(false);
    //市场记录弹窗
    const marketRecord = async () => {
        const result = await publishPage({ appUid, ...pageQuery });
        setTableData(result.list);
        setTotal(result.page.total);
        setHistorySate(true);
    };
    useEffect(() => {
        const show = async () => {
            if (saveState) {
                if (updateBtnSate) {
                    await publishCreate({ appUid });
                    dispatch(
                        openSnackbar({
                            open: true,
                            message: '更新成功',
                            variant: 'alert',
                            alert: {
                                color: 'success'
                            },
                            close: false
                        })
                    );
                    setUpdateBtnSate(false);
                }
                getUpdateBtn();
            }
        };
        show();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [saveState]);
    //分页
    const [total, setTotal] = useState(0);
    const [pageQuery, setPageQuery] = useState({
        pageNo: 1,
        pageSize: 10
    });
    const paginationChange = (event: any, value: number) => {
        setPageQuery((oldVal) => {
            const newVal = { ...oldVal };
            newVal.pageNo = value;
            publishPage({ appUid, ...newVal }).then((result) => {
                setTableData(result.list);
                setTotal(result.page.total);
            });
            return newVal;
        });
    };
    const handleSwitch = async (record: any) => {
        if (record.type === 2) {
            if (updateBtn?.channelMap?.[2]?.length > 0) {
                await changeStatus({
                    uid: updateBtn?.channelMap?.[2]?.[0]?.uid,
                    // 非常规0启用 1禁用
                    status: updateBtn?.channelMap?.[2]?.[0]?.status ? 0 : 1
                });
                getUpdateBtn();
                dispatch(
                    openSnackbar({
                        open: true,
                        message: '操作成功',
                        variant: 'alert',
                        alert: {
                            color: 'success'
                        },
                        close: false
                    })
                );
            } else {
                await channelCreate({
                    appUid: updateBtn.appUid,
                    name: `${updateBtn.name}-网页分享`,
                    publishUid: updateBtn.uid,
                    type: 2,
                    status: 0
                });
                getUpdateBtn();
                dispatch(
                    openSnackbar({
                        open: true,
                        message: '操作成功',
                        variant: 'alert',
                        alert: {
                            color: 'success'
                        },
                        close: false
                    })
                );
            }
        } else if (record.type === 5) {
            if (updateBtn?.channelMap?.[5]?.length > 0) {
            } else {
            }
        }
    };
    //创建站点确认
    const createSite = async () => {
        await channelCreate({
            appUid: updateBtn.appUid,
            name: siteName,
            publishUid: updateBtn.uid,
            type: 3,
            status: 0
        });
        getUpdateBtn();
        setOpenCreateSite(false);
        setOpenDrawer(true);
        dispatch(
            openSnackbar({
                open: true,
                message: '创建成功',
                variant: 'alert',
                alert: {
                    color: 'success'
                },
                close: false
            })
        );
    };
    //改变updateBtn的值
    const setCodeValue = (data: any) => {
        const newValue = _.cloneDeep(updateBtn);
        newValue.channelMap[3] = data;
        setUpdateBtn(newValue);
    };

    // 修改启用禁用的值
    useEffect(() => {
        if (updateBtn?.channelMap?.[2]?.length > 0) {
            const newValue = _.cloneDeep(upLoadList);
            newValue[0].enableValue = updateBtn?.channelMap?.[2]?.[0]?.status === 1 ? false : true;
            setUpLoadList(newValue);
            setWebMediumUid(updateBtn?.channelMap?.[2]?.[0]?.mediumUid);
            webMediumUidRef.current = updateBtn?.channelMap?.[2]?.[0]?.mediumUid;
        }
    }, [updateBtn]);

    const handleOpenWeb = () => {
        window.open(`/${mode === 'CHAT' ? 'cb_web' : 'app_web'}/${webMediumUidRef.current}`);
    };
    //企业微信群聊
    const [phone, setPhone] = useState('');
    const wechatOK = async () => {
        const result = await addFriend({
            mobile: phone,
            appUid: updateBtn.appUid,
            name: updateBtn.name + '_wecom_group',
            publishUid: updateBtn.uid
        });
        if (result) {
            getUpdateBtn();
            setOpenWchat(false);
            setOpenWeDrawer(true);
            dispatch(
                openSnackbar({
                    open: true,
                    message: '创建成功',
                    variant: 'alert',
                    alert: {
                        color: 'success'
                    },
                    close: false
                })
            );
        }
    };
    const permissions = useUserStore((state) => state.permissions);
    //删除发布的模板
    const delTemplate = async () => {
        const res = await delMarket(updateBtn.marketUid);
        getUpdateBtn();
        dispatch(
            openSnackbar({
                open: true,
                message: '删除成功',
                variant: 'alert',
                alert: {
                    color: 'success'
                },
                close: false
            })
        );
    };
    return (
        <Box>
            <Tabs value={tabValue} onChange={handleChange} aria-label="basic tabs example">
                <Tab label="发布渠道" {...a11yProps(0)} />
                <Tab label="发布设置" {...a11yProps(1)} />
            </Tabs>
            <CustomTabPanel value={tabValue} index={1}>
                <span
                    className={
                        "before:bg-[#673ab7] before:left-0 before:top-[7px] before:content-[''] before:w-[3px] before:h-[14px] before:absolute before:ml-0.5 block text-lg font-medium pl-[12px] relative"
                    }
                    style={{ display: 'flex', alignItems: 'center' }}
                >
                    用量限制
                    <CustomWidthTooltip
                        sx={{
                            [`& .${tooltipClasses.tooltip}`]: {
                                maxWidth: 500
                            }
                        }}
                        placement="top"
                        title={
                            <>
                                <Typography>限制将作用于当前机器人，同一设备同一浏览器访问时识别为一名用户</Typography>
                                <Typography>在后台测试时的对话量不在限制范围内</Typography>
                                <Typography>超出后的回复不扣权益</Typography>
                            </>
                        }
                    >
                        <ErrorOutlineIcon sx={{ fontSize: '18px', ml: 0.5 }} />
                    </CustomWidthTooltip>
                    <Typography ml={1} fontSize="12px" color="#697586">
                        调试模式下不生效
                    </Typography>
                </span>
                <Grid container spacing={2}>
                    <Grid item md={6} xs={12}>
                        <SubCard sx={{ position: 'relative' }} title="按使用频率">
                            <Box>
                                每隔
                                <InputNumber
                                    style={{ margin: '0 10px' }}
                                    min={0}
                                    max={60}
                                    controls={true}
                                    value={frequencyData.timeInterval}
                                    defaultValue={60}
                                    onChange={(value: number | null) => setFrequencyData({ ...frequencyData, timeInterval: value })}
                                />
                                秒， 只能发送
                                <InputNumber
                                    style={{ margin: '0 10px' }}
                                    min={0}
                                    max={60}
                                    value={frequencyData.threshold}
                                    defaultValue={60}
                                    onChange={(value: number | null) => setFrequencyData({ ...frequencyData, threshold: value })}
                                />
                                条
                            </Box>
                            <Box mt={3} mb={2}>
                                超出默认回复
                            </Box>
                            <Box>
                                <TextField
                                    size="small"
                                    defaultValue="当前咨询用户过多，请排队等候"
                                    value={frequencyData.message}
                                    onChange={(e) => setFrequencyData({ ...frequencyData, message: e.target.value })}
                                    color="secondary"
                                    fullWidth
                                />
                            </Box>
                            <Box position="absolute" top="9px" right="8px">
                                <Switch
                                    checked={frequencyData.enable}
                                    onChange={() => {
                                        setFrequencyData({
                                            ...frequencyData,
                                            enable: !frequencyData.enable
                                        });
                                    }}
                                />
                            </Box>
                        </SubCard>
                    </Grid>
                    <Grid item md={6} xs={12}>
                        <SubCard sx={{ position: 'relative' }} title="按使用量">
                            <Box>
                                每隔
                                <InputNumber
                                    style={{ margin: '0 10px' }}
                                    min={0}
                                    max={60}
                                    controls={true}
                                    value={account.timeInterval}
                                    defaultValue={60}
                                    onChange={(value: number | null) => setAccount({ ...account, timeInterval: value })}
                                />
                                秒， 只能发送
                                <InputNumber
                                    style={{ margin: '0 10px' }}
                                    min={0}
                                    max={60}
                                    value={account.threshold}
                                    defaultValue={60}
                                    onChange={(value: number | null) => setAccount({ ...account, threshold: value })}
                                />
                                条
                            </Box>
                            <Box mt={3} mb={2}>
                                超出默认回复
                            </Box>
                            <Box>
                                <TextField
                                    size="small"
                                    defaultValue="抱歉，您已经达到最大对话上限"
                                    onChange={(e) => {
                                        setAccount({
                                            ...account,
                                            message: e.target.value
                                        });
                                    }}
                                    value={account.message}
                                    color="secondary"
                                    fullWidth
                                />
                            </Box>
                            <Box position="absolute" top="9px" right="8px">
                                <Switch
                                    checked={account.enable}
                                    onChange={() => {
                                        setAccount({
                                            ...account,
                                            enable: !account.enable
                                        });
                                    }}
                                />
                            </Box>
                        </SubCard>
                    </Grid>
                </Grid>
                <span
                    className={
                        "!mt-[30px] before:bg-[#673ab7] before:left-0 before:top-[7px] before:content-[''] before:w-[3px] before:h-[14px] before:absolute before:ml-0.5 block text-lg font-medium pl-[12px] relative"
                    }
                    style={{ display: 'flex', alignItems: 'center' }}
                >
                    对话广告
                    <CustomWidthTooltip
                        sx={{
                            [`& .${tooltipClasses.tooltip}`]: {
                                maxWidth: 500
                            }
                        }}
                        placement="top"
                        title={
                            <>
                                <Typography>广告将作用于当前机器人，同一设备同一浏览器访问时识别为一名用户</Typography>
                                <Typography>当用户进行对话时，可插入自己的品牌和内容</Typography>
                            </>
                        }
                    >
                        <ErrorOutlineIcon sx={{ fontSize: '18px', ml: 0.5 }} />
                    </CustomWidthTooltip>
                    <Typography ml={1} fontSize="12px" color="#697586">
                        调试模式下不生效
                    </Typography>
                </span>
                <Grid container spacing={2}>
                    <Grid item xs={12}>
                        <SubCard sx={{ position: 'relative' }} title="按使用量">
                            <Box>
                                每个用户每隔
                                <InputNumber
                                    style={{ margin: '0 10px' }}
                                    min={0}
                                    max={60}
                                    value={advertisingConfig.threshold}
                                    defaultValue={60}
                                    onChange={(value: number | null) => setAdvertisingConfig({ ...advertisingConfig, threshold: value })}
                                />
                                条，展示一次广告
                            </Box>
                            <Box mt={3} mb={2}>
                                超出默认回复
                            </Box>
                            <Box>
                                <TextField
                                    multiline
                                    minRows={2}
                                    size="small"
                                    value={advertisingConfig.message}
                                    onChange={(e) => {
                                        setAdvertisingConfig({
                                            ...advertisingConfig,
                                            message: e.target.value
                                        });
                                    }}
                                    color="secondary"
                                    fullWidth
                                />
                            </Box>
                            <Box position="absolute" top="9px" right="8px">
                                <Switch
                                    checked={advertisingConfig.enable}
                                    onChange={() => {
                                        setAdvertisingConfig({
                                            ...advertisingConfig,
                                            enable: !advertisingConfig.enable
                                        });
                                    }}
                                />
                            </Box>
                        </SubCard>
                    </Grid>
                </Grid>
                <Button onClick={saveSetting} sx={{ mt: 6 }} color="secondary" variant="contained">
                    保存设置
                </Button>
            </CustomTabPanel>
            <CustomTabPanel value={tabValue} index={0}>
                <SubCard
                    sx={{ p: 2, mb: 4 }}
                    contentSX={{
                        minHeight: '50px',
                        p: '0 !important',
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'center'
                    }}
                >
                    <Box>
                        <Typography fontSize={16} fontWeight={500} display="flex" alignItems="center">
                            点击[更新渠道]按钮保存当前设置，以便同步修改到各个渠道。
                            <Tooltip
                                placement="top"
                                title="每次编辑后，可先验证结果满足需求后，再点击更新渠道。点击更新渠道后，会把修改的配置同步到不同的发布渠道上"
                            >
                                <Error sx={{ cursor: 'pointer' }} fontSize="small" />
                            </Tooltip>
                        </Typography>
                        {updateBtn?.isFirstCreatePublishRecord && !updateBtn.needUpdate && (
                            <Box fontSize={12} mt="12px">
                                更新所有发布渠道上的设置。
                            </Box>
                        )}
                        {updateBtn.needUpdate && (
                            <Box fontSize={12} mt="12px" display="flex" alignItems="center">
                                <Error color="warning" sx={{ fontSize: '14px' }} /> 检测到还未更新渠道的设置。配置最后更新日期:
                                <Typography color="secondary">
                                    {updateBtn.appLastUpdateTime && formatDate(updateBtn.appLastUpdateTime)}
                                </Typography>
                                需要点击[更新渠道]来同步配置。
                            </Box>
                        )}
                        {updateBtn && !updateBtn.isFirstCreatePublishRecord && !updateBtn.needUpdate && (
                            <Box fontSize={12} mt="12px" display="flex" alignItems="center">
                                <CheckCircle color="success" sx={{ fontSize: '14px' }} /> 所有设置已更新!最后一次更新日期：
                                <Typography color="secondary">
                                    {updateBtn.appLastUpdateTime && formatDate(updateBtn.appLastUpdateTime)}
                                </Typography>
                            </Box>
                        )}
                    </Box>
                    <Button disabled={!updateBtn?.needUpdate} color="secondary" variant="outlined" onClick={handleUpdate}>
                        更新渠道
                    </Button>
                </SubCard>
                <Grid container display="flex" spacing={2}>
                    {(permissions.includes('chat.publish.market') || mode !== 'CHAT') && (
                        <Grid flex={1} item md={6} xs={12}>
                            <SubCard contentSX={{ minHeight: '120px', p: '20px', display: 'flex', position: 'relative' }}>
                                <Box>
                                    <Box
                                        width="40px"
                                        height="40px"
                                        borderRadius="50%"
                                        sx={{ background: '#673ab74f' }}
                                        display="flex"
                                        alignItems="center"
                                        justifyContent="center"
                                    >
                                        <Storefront color={'secondary'} />
                                    </Box>
                                </Box>
                                <Box ml={2}>
                                    <Typography
                                        component="div"
                                        fontSize={16}
                                        fontWeight={500}
                                        display="flex"
                                        alignItems="center"
                                        flexWrap="wrap"
                                    >
                                        {mode === 'CHAT' ? '员工广场' : '应用市场'}

                                        <Chip
                                            sx={{ mx: 1.5 }}
                                            size="small"
                                            label={
                                                releaseState === 0
                                                    ? '未发布'
                                                    : releaseState === 1
                                                    ? '待审核'
                                                    : releaseState === 2
                                                    ? '审核通过'
                                                    : releaseState === 3
                                                    ? '审核未通过'
                                                    : releaseState === 4
                                                    ? '用户已取消'
                                                    : '已失效'
                                            }
                                        />
                                        {updateBtn?.needTips && (
                                            <Chip
                                                sx={{ mt: 1, display: { lg: 'block', md: 'none', xs: 'none' } }}
                                                size="small"
                                                color="warning"
                                                label={
                                                    updateBtn.needTips && releaseState === 1
                                                        ? '检测到应用已经更新：建议更新重新发布'
                                                        : updateBtn.needTips && releaseState === 0 && updateBtn.isFirstCreatePublishRecord
                                                        ? '需要更新后才能发布'
                                                        : '检测到应用已经更新：需要更新重新发布'
                                                }
                                                variant="outlined"
                                            />
                                        )}
                                    </Typography>
                                    {updateBtn?.needTips && (
                                        <Chip
                                            sx={{ mt: '10px', display: { lg: 'none', md: 'block' } }}
                                            size="small"
                                            color="warning"
                                            label={
                                                updateBtn.needTips && releaseState === 1
                                                    ? '检测到应用已经更新：建议更新重新发布'
                                                    : updateBtn.needTips && releaseState === 0 && updateBtn.isFirstCreatePublishRecord
                                                    ? '需要更新后才能发布'
                                                    : '检测到应用已经更新：需要更新重新发布'
                                            }
                                            variant="outlined"
                                        />
                                    )}
                                    <Typography minHeight="32px" margin="10px 0 10px" lineHeight="16px" color="#9da3af">
                                        {mode === 'CHAT' ? '用户可在员工广场中使用你发布的机器人' : '用户可在员工广场中使用你发布的应用'}
                                    </Typography>
                                    <Box display="flex">
                                        <Box
                                            color="#b5bed0"
                                            fontSize="12px"
                                            display="flex"
                                            alignItems="center"
                                            mr={2}
                                            sx={{
                                                cursor:
                                                    !updateBtn?.showPublish || (updateBtn?.showPublish && updateBtn?.enablePublish)
                                                        ? 'pointer'
                                                        : 'default',
                                                '&:hover': {
                                                    color:
                                                        !updateBtn?.showPublish || (updateBtn?.showPublish && updateBtn?.enablePublish)
                                                            ? '#673ab7'
                                                            : 'none'
                                                }
                                            }}
                                            onClick={() => {
                                                if (!updateBtn?.showPublish || (updateBtn?.showPublish && updateBtn?.enablePublish)) {
                                                    uploadMarket();
                                                }
                                            }}
                                        >
                                            <CloudUploadOutlined sx={{ fontSize: '12px' }} />
                                            <span style={{ marginLeft: '8px' }}>
                                                {!updateBtn?.showPublish
                                                    ? '取消发布'
                                                    : mode === 'CHAT'
                                                    ? '发布到员工广场'
                                                    : '发布到模板市场'}
                                            </span>
                                        </Box>
                                        <Box
                                            color="#b5bed0"
                                            fontSize="12px"
                                            display="flex"
                                            alignItems="center"
                                            flexWrap="wrap"
                                            mr={2}
                                            sx={{ cursor: 'pointer', '&:hover': { color: '#673ab7' } }}
                                            onClick={marketRecord}
                                        >
                                            <Box whiteSpace="nowrap">
                                                <HistoryOutlined sx={{ fontSize: '12px' }} />
                                                <span style={{ marginLeft: '8px' }}>发布历史记录</span>
                                            </Box>
                                        </Box>
                                    </Box>
                                </Box>
                                {permissions.includes('app:market:delete') && updateBtn.marketUid && (
                                    <Popover
                                        placement="bottom"
                                        content={
                                            <Button onClick={delTemplate} color="error" variant="outlined">
                                                删除模板
                                            </Button>
                                        }
                                        trigger="click"
                                    >
                                        <IconButton className="absolute top-[20px] right-[20px]">
                                            <MoreVert />
                                        </IconButton>
                                    </Popover>
                                )}
                            </SubCard>
                        </Grid>
                    )}
                    {getTenant() === ENUM_TENANT.AI
                        ? upLoadList.map((item) =>
                              // item.title === '微信群聊' ||
                              item.title === '微信公众号' ? (
                                  mode === 'CHAT' && (
                                      <Grid key={item.title} flex={1} item md={6} xs={12}>
                                          <SubCard
                                              sx={{ height: '100%' }}
                                              contentSX={{ minHeight: '140px', height: '100%', p: '20px', display: 'flex' }}
                                          >
                                              <Box>
                                                  <Box
                                                      width="40px"
                                                      height="40px"
                                                      borderRadius="50%"
                                                      sx={item.comingSoon ? { background: '#f2f3f5' } : { background: '#673ab74f' }}
                                                      display="flex"
                                                      alignItems="center"
                                                      justifyContent="center"
                                                  >
                                                      {IconList[item.icon]}
                                                      {!IconList[item.icon] && (
                                                          <img
                                                              style={{ width: '25px', height: '25px' }}
                                                              src={require(`../../../../../assets/images/upLoad/${item.icon}.svg`)}
                                                              alt=""
                                                          />
                                                      )}
                                                  </Box>
                                              </Box>
                                              <Box ml={2} className="w-full">
                                                  <div className="flex justify-between items-center">
                                                      <Typography
                                                          component="div"
                                                          fontSize={16}
                                                          fontWeight={500}
                                                          display="flex"
                                                          alignItems="center"
                                                      >
                                                          {item.title}
                                                          {item.comingSoon && <Chip sx={{ ml: 1.5 }} size="small" label="即将推出" />}
                                                      </Typography>
                                                      <div>
                                                          {item.enable && (
                                                              <>
                                                                  <span className={'text-#697586'}>
                                                                      {item.enableValue ? '开放' : '关闭'}
                                                                  </span>
                                                                  <Switch
                                                                      disabled={updateBtn.isFirstCreatePublishRecord}
                                                                      size={'small'}
                                                                      color={'secondary'}
                                                                      checked={item.enableValue}
                                                                      onChange={() => handleSwitch(item)}
                                                                  />
                                                              </>
                                                          )}
                                                      </div>
                                                  </div>
                                                  <Typography margin="10px 0 10px" minHeight="32px" lineHeight="16px" color="#9da3af">
                                                      {item.desc}
                                                  </Typography>
                                                  <Box display="flex">
                                                      {item.action.map((el: any, i: number) =>
                                                          item.type === 2 ? (
                                                              <Box
                                                                  key={i}
                                                                  color="#b5bed0"
                                                                  fontSize="12px"
                                                                  display="flex"
                                                                  flexWrap="wrap"
                                                                  alignItems="center"
                                                                  mr={2}
                                                                  onClick={() => {
                                                                      if (item.enableValue) el.onclick();
                                                                  }}
                                                                  className={`${
                                                                      item.enableValue ? 'cursor-pointer hover:text-purple-500' : ''
                                                                  }`}
                                                              >
                                                                  <Box whiteSpace="nowrap">
                                                                      {IconList[el.icon]}
                                                                      <span style={{ marginLeft: '8px' }}>{el.title}</span>
                                                                  </Box>
                                                              </Box>
                                                          ) : (
                                                              <Box
                                                                  key={i}
                                                                  color="#b5bed0"
                                                                  fontSize="12px"
                                                                  display="flex"
                                                                  flexWrap="wrap"
                                                                  alignItems="center"
                                                                  mr={2}
                                                                  onClick={() => {
                                                                      if (!updateBtn.isFirstCreatePublishRecord && i == 1) {
                                                                          el.onclick();
                                                                      } else if (
                                                                          !updateBtn.isFirstCreatePublishRecord &&
                                                                          !updateBtn.needUpdate
                                                                      ) {
                                                                          el.onclick();
                                                                      }
                                                                  }}
                                                                  className={`${
                                                                      (!updateBtn.isFirstCreatePublishRecord && i == 1) ||
                                                                      (!updateBtn.isFirstCreatePublishRecord && !updateBtn.needUpdate)
                                                                          ? 'cursor-pointer hover:text-purple-500'
                                                                          : ''
                                                                  }`}
                                                              >
                                                                  <Box whiteSpace="nowrap">
                                                                      {IconList[el.icon]}
                                                                      <span style={{ marginLeft: '8px' }}>{el.title}</span>
                                                                  </Box>
                                                              </Box>
                                                          )
                                                      )}
                                                  </Box>
                                              </Box>
                                          </SubCard>
                                      </Grid>
                                  )
                              ) : (
                                  <Grid key={item.title} flex={1} item md={6} xs={12}>
                                      <SubCard
                                          sx={{ height: '100%' }}
                                          contentSX={{ minHeight: '140px', height: '100%', p: '20px', display: 'flex' }}
                                      >
                                          <Box>
                                              <Box
                                                  width="40px"
                                                  height="40px"
                                                  borderRadius="50%"
                                                  sx={item.comingSoon ? { background: '#f2f3f5' } : { background: '#673ab74f' }}
                                                  display="flex"
                                                  alignItems="center"
                                                  justifyContent="center"
                                              >
                                                  {IconList[item.icon]}
                                                  {!IconList[item.icon] && (
                                                      <img
                                                          style={{ width: '25px', height: '25px' }}
                                                          src={require(`../../../../../assets/images/upLoad/${item.icon}.svg`)}
                                                          alt=""
                                                      />
                                                  )}
                                              </Box>
                                          </Box>
                                          <Box ml={2} className="w-full">
                                              <div className="flex justify-between items-center">
                                                  <Typography
                                                      component="div"
                                                      fontSize={16}
                                                      fontWeight={500}
                                                      display="flex"
                                                      alignItems="center"
                                                  >
                                                      {item.title}
                                                      {item.comingSoon && <Chip sx={{ ml: 1.5 }} size="small" label="即将推出" />}
                                                  </Typography>
                                                  <div>
                                                      {item.enable && (
                                                          <>
                                                              <span className={'text-#697586'}>{item.enableValue ? '开放' : '关闭'}</span>
                                                              <Switch
                                                                  disabled={updateBtn.isFirstCreatePublishRecord}
                                                                  size={'small'}
                                                                  color={'secondary'}
                                                                  checked={item.enableValue}
                                                                  onChange={() => handleSwitch(item)}
                                                              />
                                                          </>
                                                      )}
                                                  </div>
                                              </div>
                                              <Typography margin="10px 0 10px" minHeight="32px" lineHeight="16px" color="#9da3af">
                                                  {item.desc}
                                              </Typography>
                                              <Box display="flex">
                                                  {item.action.map((el: any, i: number) =>
                                                      item.type === 2 ? (
                                                          <Box
                                                              key={i}
                                                              color="#b5bed0"
                                                              fontSize="12px"
                                                              display="flex"
                                                              flexWrap="wrap"
                                                              alignItems="center"
                                                              mr={2}
                                                              onClick={() => {
                                                                  if (item.enableValue) el.onclick();
                                                              }}
                                                              className={`${
                                                                  item.enableValue ? 'cursor-pointer hover:text-purple-500' : ''
                                                              }`}
                                                          >
                                                              <Box whiteSpace="nowrap">
                                                                  {IconList[el.icon]}
                                                                  <span style={{ marginLeft: '8px' }}>{el.title}</span>
                                                              </Box>
                                                          </Box>
                                                      ) : (
                                                          <Box
                                                              key={i}
                                                              color="#b5bed0"
                                                              fontSize="12px"
                                                              display="flex"
                                                              flexWrap="wrap"
                                                              alignItems="center"
                                                              mr={2}
                                                              onClick={() => {
                                                                  if (!updateBtn.isFirstCreatePublishRecord && i == 1) {
                                                                      el.onclick();
                                                                  } else if (
                                                                      !updateBtn.isFirstCreatePublishRecord &&
                                                                      !updateBtn.needUpdate
                                                                  ) {
                                                                      el.onclick();
                                                                  }
                                                              }}
                                                              className={`${
                                                                  (!updateBtn.isFirstCreatePublishRecord && i == 1) ||
                                                                  (!updateBtn.isFirstCreatePublishRecord && !updateBtn.needUpdate)
                                                                      ? 'cursor-pointer hover:text-purple-500'
                                                                      : ''
                                                              }`}
                                                          >
                                                              <Box whiteSpace="nowrap">
                                                                  {IconList[el.icon]}
                                                                  <span style={{ marginLeft: '8px' }}>{el.title}</span>
                                                              </Box>
                                                          </Box>
                                                      )
                                                  )}
                                              </Box>
                                          </Box>
                                      </SubCard>
                                  </Grid>
                              )
                          )
                        : upLoadList
                              ?.filter((i) => i.title === 'API调用')
                              ?.map((item) =>
                                  // item.title === '微信群聊' ||
                                  item.title === '微信公众号' ? (
                                      mode === 'CHAT' && (
                                          <Grid key={item.title} flex={1} item md={6} xs={12}>
                                              <SubCard
                                                  sx={{ height: '100%' }}
                                                  contentSX={{ minHeight: '140px', height: '100%', p: '20px', display: 'flex' }}
                                              >
                                                  <Box>
                                                      <Box
                                                          width="40px"
                                                          height="40px"
                                                          borderRadius="50%"
                                                          sx={item.comingSoon ? { background: '#f2f3f5' } : { background: '#673ab74f' }}
                                                          display="flex"
                                                          alignItems="center"
                                                          justifyContent="center"
                                                      >
                                                          {IconList[item.icon]}
                                                          {!IconList[item.icon] && (
                                                              <img
                                                                  style={{ width: '25px', height: '25px' }}
                                                                  src={require(`../../../../../assets/images/upLoad/${item.icon}.svg`)}
                                                                  alt=""
                                                              />
                                                          )}
                                                      </Box>
                                                  </Box>
                                                  <Box ml={2} className="w-full">
                                                      <div className="flex justify-between items-center">
                                                          <Typography
                                                              component="div"
                                                              fontSize={16}
                                                              fontWeight={500}
                                                              display="flex"
                                                              alignItems="center"
                                                          >
                                                              {item.title}
                                                              {item.comingSoon && <Chip sx={{ ml: 1.5 }} size="small" label="即将推出" />}
                                                          </Typography>
                                                          <div>
                                                              {item.enable && (
                                                                  <>
                                                                      <span className={'text-#697586'}>
                                                                          {item.enableValue ? '开放' : '关闭'}
                                                                      </span>
                                                                      <Switch
                                                                          disabled={updateBtn.isFirstCreatePublishRecord}
                                                                          size={'small'}
                                                                          color={'secondary'}
                                                                          checked={item.enableValue}
                                                                          onChange={() => handleSwitch(item)}
                                                                      />
                                                                  </>
                                                              )}
                                                          </div>
                                                      </div>
                                                      <Typography margin="10px 0 10px" minHeight="32px" lineHeight="16px" color="#9da3af">
                                                          {item.desc}
                                                      </Typography>
                                                      <Box display="flex">
                                                          {item.action.map((el: any, i: number) =>
                                                              item.type === 2 ? (
                                                                  <Box
                                                                      key={i}
                                                                      color="#b5bed0"
                                                                      fontSize="12px"
                                                                      display="flex"
                                                                      flexWrap="wrap"
                                                                      alignItems="center"
                                                                      mr={2}
                                                                      onClick={() => {
                                                                          if (item.enableValue) el.onclick();
                                                                      }}
                                                                      className={`${
                                                                          item.enableValue ? 'cursor-pointer hover:text-purple-500' : ''
                                                                      }`}
                                                                  >
                                                                      <Box whiteSpace="nowrap">
                                                                          {IconList[el.icon]}
                                                                          <span style={{ marginLeft: '8px' }}>{el.title}</span>
                                                                      </Box>
                                                                  </Box>
                                                              ) : (
                                                                  <Box
                                                                      key={i}
                                                                      color="#b5bed0"
                                                                      fontSize="12px"
                                                                      display="flex"
                                                                      flexWrap="wrap"
                                                                      alignItems="center"
                                                                      mr={2}
                                                                      onClick={() => {
                                                                          if (!updateBtn.isFirstCreatePublishRecord && i == 1) {
                                                                              el.onclick();
                                                                          } else if (
                                                                              !updateBtn.isFirstCreatePublishRecord &&
                                                                              !updateBtn.needUpdate
                                                                          ) {
                                                                              el.onclick();
                                                                          }
                                                                      }}
                                                                      className={`${
                                                                          (!updateBtn.isFirstCreatePublishRecord && i == 1) ||
                                                                          (!updateBtn.isFirstCreatePublishRecord && !updateBtn.needUpdate)
                                                                              ? 'cursor-pointer hover:text-purple-500'
                                                                              : ''
                                                                      }`}
                                                                  >
                                                                      <Box whiteSpace="nowrap">
                                                                          {IconList[el.icon]}
                                                                          <span style={{ marginLeft: '8px' }}>{el.title}</span>
                                                                      </Box>
                                                                  </Box>
                                                              )
                                                          )}
                                                      </Box>
                                                  </Box>
                                              </SubCard>
                                          </Grid>
                                      )
                                  ) : (
                                      <Grid key={item.title} flex={1} item md={6} xs={12}>
                                          <SubCard
                                              sx={{ height: '100%' }}
                                              contentSX={{ minHeight: '140px', height: '100%', p: '20px', display: 'flex' }}
                                          >
                                              <Box>
                                                  <Box
                                                      width="40px"
                                                      height="40px"
                                                      borderRadius="50%"
                                                      sx={item.comingSoon ? { background: '#f2f3f5' } : { background: '#673ab74f' }}
                                                      display="flex"
                                                      alignItems="center"
                                                      justifyContent="center"
                                                  >
                                                      {IconList[item.icon]}
                                                      {!IconList[item.icon] && (
                                                          <img
                                                              style={{ width: '25px', height: '25px' }}
                                                              src={require(`../../../../../assets/images/upLoad/${item.icon}.svg`)}
                                                              alt=""
                                                          />
                                                      )}
                                                  </Box>
                                              </Box>
                                              <Box ml={2} className="w-full">
                                                  <div className="flex justify-between items-center">
                                                      <Typography
                                                          component="div"
                                                          fontSize={16}
                                                          fontWeight={500}
                                                          display="flex"
                                                          alignItems="center"
                                                      >
                                                          {item.title}
                                                          {item.comingSoon && <Chip sx={{ ml: 1.5 }} size="small" label="即将推出" />}
                                                      </Typography>
                                                      <div>
                                                          {item.enable && (
                                                              <>
                                                                  <span className={'text-#697586'}>
                                                                      {item.enableValue ? '开放' : '关闭'}
                                                                  </span>
                                                                  <Switch
                                                                      disabled={updateBtn.isFirstCreatePublishRecord}
                                                                      size={'small'}
                                                                      color={'secondary'}
                                                                      checked={item.enableValue}
                                                                      onChange={() => handleSwitch(item)}
                                                                  />
                                                              </>
                                                          )}
                                                      </div>
                                                  </div>
                                                  <Typography margin="10px 0 10px" minHeight="32px" lineHeight="16px" color="#9da3af">
                                                      {item.desc}
                                                  </Typography>
                                                  <Box display="flex">
                                                      {item.action.map((el: any, i: number) =>
                                                          item.type === 2 ? (
                                                              <Box
                                                                  key={i}
                                                                  color="#b5bed0"
                                                                  fontSize="12px"
                                                                  display="flex"
                                                                  flexWrap="wrap"
                                                                  alignItems="center"
                                                                  mr={2}
                                                                  onClick={() => {
                                                                      if (item.enableValue) el.onclick();
                                                                  }}
                                                                  className={`${
                                                                      item.enableValue ? 'cursor-pointer hover:text-purple-500' : ''
                                                                  }`}
                                                              >
                                                                  <Box whiteSpace="nowrap">
                                                                      {IconList[el.icon]}
                                                                      <span style={{ marginLeft: '8px' }}>{el.title}</span>
                                                                  </Box>
                                                              </Box>
                                                          ) : (
                                                              <Box
                                                                  key={i}
                                                                  color="#b5bed0"
                                                                  fontSize="12px"
                                                                  display="flex"
                                                                  flexWrap="wrap"
                                                                  alignItems="center"
                                                                  mr={2}
                                                                  onClick={() => {
                                                                      if (!updateBtn.isFirstCreatePublishRecord && i == 1) {
                                                                          el.onclick();
                                                                      } else if (
                                                                          !updateBtn.isFirstCreatePublishRecord &&
                                                                          !updateBtn.needUpdate
                                                                      ) {
                                                                          el.onclick();
                                                                      }
                                                                  }}
                                                                  className={`${
                                                                      (!updateBtn.isFirstCreatePublishRecord && i == 1) ||
                                                                      (!updateBtn.isFirstCreatePublishRecord && !updateBtn.needUpdate)
                                                                          ? 'cursor-pointer hover:text-purple-500'
                                                                          : ''
                                                                  }`}
                                                              >
                                                                  <Box whiteSpace="nowrap">
                                                                      {IconList[el.icon]}
                                                                      <span style={{ marginLeft: '8px' }}>{el.title}</span>
                                                                  </Box>
                                                              </Box>
                                                          )
                                                      )}
                                                  </Box>
                                              </Box>
                                          </SubCard>
                                      </Grid>
                                  )
                              )}
                </Grid>
                {/* <Button onClick={handleSave} sx={{ mt: 6 }} color="secondary" variant="contained">
                    保存设置
                </Button> */}
            </CustomTabPanel>
            {historyState && (
                <Dialog
                    maxWidth="lg"
                    fullWidth
                    open={historyState}
                    onClose={() => {
                        setHistorySate(false);
                        setPageQuery({
                            ...pageQuery,
                            pageNo: 1
                        });
                    }}
                >
                    <DialogTitle>历史记录</DialogTitle>
                    <DialogContent>
                        <TableContainer component={Paper}>
                            <Table size="small">
                                <TableHead>
                                    <TableRow>
                                        <TableCell align="center">APP名称</TableCell>
                                        <TableCell align="center">版本号</TableCell>
                                        <TableCell align="center">状态</TableCell>
                                        <TableCell align="center">更新时间</TableCell>
                                        <TableCell align="center">创建时间</TableCell>
                                    </TableRow>
                                </TableHead>
                                {tableData.map((row: any, index: number) => (
                                    <TableRow key={index}>
                                        <TableCell align="center">{row.name}</TableCell>
                                        <TableCell align="center">{row.version}</TableCell>
                                        <TableCell align="center">
                                            {row.audit === 0
                                                ? '未发布'
                                                : row.audit === 1
                                                ? '待审核'
                                                : row.audit === 2
                                                ? '审核通过'
                                                : row.audit === 3
                                                ? '审核未通过'
                                                : row.audit === 4
                                                ? '用户已取消'
                                                : '已失效'}
                                        </TableCell>
                                        <TableCell align="center">{formatDate(row.updateTime)}</TableCell>
                                        <TableCell align="center">{formatDate(row.createTime)}</TableCell>
                                    </TableRow>
                                ))}
                            </Table>
                        </TableContainer>
                        <Box my={2}>
                            <Pagination page={pageQuery.pageNo} count={Math.ceil(total / pageQuery.pageSize)} onChange={paginationChange} />
                        </Box>
                    </DialogContent>
                </Dialog>
            )}
            <CreateSiteModal
                open={openCreateSite}
                setOpen={setOpenCreateSite}
                value={siteName}
                setValue={setSiteName}
                handleOk={createSite}
            />
            {openDrawer && updateBtn.channelMap && (
                <SiteDrawerCode
                    codeList={updateBtn.channelMap[3]}
                    open={openDrawer}
                    setOpen={setOpenDrawer}
                    setCodeValue={setCodeValue}
                    getUpdateBtn={getUpdateBtn}
                    mode={mode}
                />
            )}
            {openWeDrawer && (
                <WeChatDrawer
                    codeList={updateBtn.channelMap[7]}
                    open={openWeDrawer}
                    setOpen={setOpenWeDrawer}
                    getUpdateBtn={getUpdateBtn}
                />
            )}
            {botOpen && (
                <UpgradeModel
                    open={botOpen}
                    handleClose={() => setBotOpen(false)}
                    title={`添加微信群聊个数(${allDetail?.allDetail?.levels[0]?.levelConfigDTO?.usableBotDocument})已用完`}
                    from="usableWechatBot_0"
                />
            )}
            <DomainModal open={openDomain} setOpen={setOpenDomain} />
            <CopySiteModal open={openCopySite} setOpen={setOpenCopySite} uid={webMediumUid} mode={mode} />
            {openWchat && <WechatModal open={openWchat} setOpen={setOpenWchat} value={phone} setValue={setPhone} handleOk={wechatOK} />}
            {openWPAccount && (
                <WPAccountModal open={openWPAccount} setOpen={setOpenWPAccount} updateBtn={updateBtn} getUpdateBtn={getUpdateBtn} />
            )}
        </Box>
    );
}
export default Upload;
