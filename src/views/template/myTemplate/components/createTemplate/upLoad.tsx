import {
    Box,
    Grid,
    Typography,
    Button,
    Chip,
    Dialog,
    DialogTitle,
    DialogContent,
    Table,
    TableHead,
    TableRow,
    TableCell,
    TableBody,
    TableContainer,
    Paper,
    Pagination,
    Tooltip,
    Switch
} from '@mui/material';
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
    Api
} from '@mui/icons-material';
import { useState, useEffect, useRef } from 'react';
import { useLocation } from 'react-router-dom';
import formatDate from 'hooks/useDate';
import { publishCreate, publishOperate, publishPage, getLatest, changeStatus, channelCreate } from 'api/template';
import CopyToClipboard from 'react-copy-to-clipboard';
import CreateSiteModal from './components/CreateSiteModal';
import { SiteDrawerCode } from './components/SiteDrawerCode';
import DomainModal from './components/DomainModal';
import _ from 'lodash-es';
import CopySiteModal from './components/CopySiteModal';

function Upload({ appUid, saveState, saveDetail, mode }: { appUid: string; saveState: number; saveDetail: () => void; mode?: 'CHAT' }) {
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
                { title: '查看代码', icon: 'historyOutlined', onclick: () => setOpenDrawer(true) }
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
    const [upLoadList, setUpLoadList] = useState(defaultUpLoadList);
    const [webMediumUid, setWebMediumUid] = useState('');
    const webMediumUidRef = useRef();

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
            setUpdateBtn(res);
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
    }>({
        needUpdate: false,
        showPublish: true,
        enablePublish: false,
        uid: '',
        needTips: true,
        isFirstCreatePublishRecord: true
    });
    const [tableData, setTableData] = useState([]);
    //保存按钮是否触发更新
    const [updateBtnSate, setUpdateBtnSate] = useState(false);
    const handleUpdate = () => {
        setUpdateBtnSate(true);
        saveDetail();
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
        window.open(`/cb_web/${webMediumUidRef.current}`);
    };

    return (
        <Box>
            <SubCard
                sx={{ p: 2, mb: 4 }}
                contentSX={{ height: '50px', p: '0 !important', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}
            >
                <Box>
                    <Typography fontSize={16} fontWeight={500} display="flex" alignItems="center">
                        点击[更新]按钮保存设置以便发布。
                        <Tooltip title="每次编辑后，可先验证结果满足需求后，再点击更新。点击更新后，会把修改的配置同步到不同的发布渠道上">
                            <Error fontSize="small" />
                        </Tooltip>
                    </Typography>
                    {updateBtn?.isFirstCreatePublishRecord && !updateBtn.needUpdate && (
                        <Box fontSize={12} mt="12px">
                            更新所有发布渠道上的设置。
                        </Box>
                    )}
                    {updateBtn.needUpdate && (
                        <Box fontSize={12} mt="12px" display="flex" alignItems="center">
                            <Error color="warning" sx={{ fontSize: '14px' }} /> 检测到未保存的设置。最后更新日期:
                            <Typography color="secondary">
                                {updateBtn.appLastUpdateTime && formatDate(updateBtn.appLastUpdateTime)}
                            </Typography>
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
                    更新
                </Button>
            </SubCard>
            {/* <Typography mb={3}>
                <span
                    className={
                        "before:bg-[#673ab7] before:left-0 before:top-[7px] before:content-[''] before:w-[3px] before:h-[14px] before:absolute before:ml-0.5 block text-lg font-medium pl-[12px] relative"
                    }
                >
                    基础
                </span>
            </Typography> */}
            <Grid container spacing={2}>
                <Grid item md={6} xs={12}>
                    <SubCard contentSX={{ height: '120px', p: '20px', display: 'flex' }}>
                        <Box>
                            <Box
                                width="40px"
                                height="40px"
                                borderRadius="50%"
                                sx={mode === 'CHAT' ? { background: '#f2f3f5' } : { background: '#673ab74f' }}
                                display="flex"
                                alignItems="center"
                                justifyContent="center"
                            >
                                {mode === 'CHAT' ? <Storefront /> : <Storefront color={'secondary'} />}
                            </Box>
                        </Box>
                        {mode === 'CHAT' ? (
                            <Box ml={2}>
                                <Typography component="div" fontSize={16} fontWeight={500} display="flex" alignItems="center">
                                    应用市场
                                    <Chip sx={{ ml: 1.5 }} size="small" label={'即将推出'} />
                                </Typography>
                                <Typography margin="10px 0 24px" lineHeight="16px" color="#9da3af">
                                    用户可在模板市场中下载你上传的应用
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
                                                    : 'default'
                                        }}
                                    >
                                        <CloudUploadOutlined sx={{ fontSize: '12px' }} />
                                        &nbsp;&nbsp; {!updateBtn?.showPublish ? '取消发布' : '发布到模板市场'}
                                    </Box>
                                    <Box color="#b5bed0" fontSize="12px" display="flex" alignItems="center" mr={2}>
                                        <HistoryOutlined sx={{ fontSize: '12px' }} />
                                        &nbsp;&nbsp; 发布历史记录
                                    </Box>
                                </Box>
                            </Box>
                        ) : (
                            <Box ml={2}>
                                <Typography component="div" fontSize={16} fontWeight={500} display="flex" alignItems="center">
                                    应用市场
                                    <Chip
                                        sx={{ ml: 1.5 }}
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
                                            sx={{ ml: 1.5 }}
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
                                <Typography margin="10px 0 24px" lineHeight="16px" color="#9da3af">
                                    用户可在模板市场中下载你上传的应用
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
                                        &nbsp;&nbsp; {!updateBtn?.showPublish ? '取消发布' : '发布到模板市场'}
                                    </Box>
                                    <Box
                                        color="#b5bed0"
                                        fontSize="12px"
                                        display="flex"
                                        alignItems="center"
                                        mr={2}
                                        sx={{ cursor: 'pointer', '&:hover': { color: '#673ab7' } }}
                                        onClick={marketRecord}
                                    >
                                        <HistoryOutlined sx={{ fontSize: '12px' }} />
                                        &nbsp;&nbsp; 发布历史记录
                                    </Box>
                                </Box>
                            </Box>
                        )}
                    </SubCard>
                </Grid>
                {upLoadList.map((item) => (
                    <Grid key={item.title} item md={6} xs={12}>
                        <SubCard contentSX={{ height: '120px', p: '20px', display: 'flex' }}>
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
                                </Box>
                            </Box>
                            <Box ml={2} className="w-full">
                                <div className="flex justify-between items-center">
                                    <Typography component="div" fontSize={16} fontWeight={500} display="flex" alignItems="center">
                                        {item.title}
                                        {item.comingSoon && <Chip sx={{ ml: 1.5 }} size="small" label="即将推出" />}
                                    </Typography>
                                    <div>
                                        {item.enable && (
                                            <Switch
                                                disabled={updateBtn.isFirstCreatePublishRecord}
                                                size={'small'}
                                                color={'secondary'}
                                                checked={item.enableValue}
                                                onChange={() => handleSwitch(item)}
                                            />
                                        )}
                                    </div>
                                </div>
                                <Typography margin="10px 0 10px" height="32px" lineHeight="16px" color="#9da3af">
                                    {item.desc}
                                </Typography>
                                <Box display="flex">
                                    {item.action.map((el: any, i) =>
                                        item.type === 2 ? (
                                            <Box
                                                key={i}
                                                color="#b5bed0"
                                                fontSize="12px"
                                                display="flex"
                                                alignItems="center"
                                                mr={2}
                                                onClick={() => {
                                                    if (item.enableValue) el.onclick();
                                                }}
                                                className={`${item.enableValue ? 'cursor-pointer hover:text-purple-500' : ''}`}
                                            >
                                                {IconList[el.icon]}
                                                &nbsp;&nbsp; {el.title}
                                            </Box>
                                        ) : (
                                            <Box
                                                key={i}
                                                color="#b5bed0"
                                                fontSize="12px"
                                                display="flex"
                                                alignItems="center"
                                                mr={2}
                                                onClick={() => {
                                                    if (!updateBtn.isFirstCreatePublishRecord) el.onclick();
                                                }}
                                                className={`${
                                                    !updateBtn.isFirstCreatePublishRecord ? 'cursor-pointer hover:text-purple-500' : ''
                                                }`}
                                            >
                                                {IconList[el.icon]}
                                                &nbsp;&nbsp; {el.title}
                                            </Box>
                                        )
                                    )}
                                </Box>
                            </Box>
                        </SubCard>
                    </Grid>
                ))}
            </Grid>
            {/* <Typography mt={4} mb={3}>
                <span
                    className={
                        "before:bg-[#673ab7] before:left-0 before:top-[7px] before:content-[''] before:w-[3px] before:h-[14px] before:absolute before:ml-0.5 block text-lg font-medium pl-[12px] relative"
                    }
                >
                    微信
                </span>
            </Typography>
            <Grid container spacing={2}>
                {wchatList.map((item) => (
                    <Grid key={item.title} item md={6} xs={12}>
                        <SubCard contentSX={{ height: '120px', p: '20px', display: 'flex' }}>
                            <Box>
                                <Box
                                    width="40px"
                                    height="40px"
                                    borderRadius="50%"
                                    sx={{ background: '#f2f3f5' }}
                                    display="flex"
                                    alignItems="center"
                                    justifyContent="center"
                                >
                                    <img
                                        style={{ width: '25px', height: '25px' }}
                                        src={require(`../../../../../assets/images/upLoad/${item.icon}.svg`)}
                                        alt=""
                                    />
                                </Box>
                            </Box>
                            <Box ml={2}>
                                <Typography component="div" fontSize={16} fontWeight={500} display="flex" alignItems="center">
                                    {item.title}
                                    {item.comingSoon && <Chip sx={{ ml: 1.5 }} size="small" label="即将推出" />}
                                </Typography>
                                <Typography margin="10px 0 10px" height="32px" lineHeight="16px" color="#9da3af">
                                    {item.desc}
                                </Typography>
                            </Box>
                        </SubCard>
                    </Grid>
                ))}
            </Grid>
            <Typography mt={4} mb={2} textAlign="center" fontSize="14px" fontWeight="500">
                以下发布平台即将发布 敬请期待
            </Typography>
            <Box display="flex" justifyContent="center">
                {otherList.map((item) => (
                    <Box key={item.icon} textAlign="center" fontSize="12px" mr={2} color="#9da3af">
                        <Box
                            width="40px"
                            height="40px"
                            borderRadius="5px"
                            sx={{ background: '#f2f3f5' }}
                            display="flex"
                            alignItems="center"
                            justifyContent="center"
                            mb="5px"
                        >
                            <img
                                style={{ width: '25px', height: '25px' }}
                                src={require(`../../../../../assets/images/upLoad/${item.icon}.svg`)}
                                alt=""
                            />
                        </Box>
                        {item.title}
                    </Box>
                ))}
            </Box> */}
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
                                        <TableCell>APP名称</TableCell>
                                        <TableCell>版本号</TableCell>
                                        <TableCell>状态</TableCell>
                                        <TableCell>更新时间</TableCell>
                                        <TableCell>创建时间</TableCell>
                                    </TableRow>
                                </TableHead>
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
                />
            )}
            <DomainModal open={openDomain} setOpen={setOpenDomain} />
            <CopySiteModal open={openCopySite} setOpen={setOpenCopySite} uid={webMediumUid} />
        </Box>
    );
}
export default Upload;
