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
    Paper
} from '@mui/material';
import SubCard from 'ui-component/cards/SubCard';
import { dispatch } from 'store';
import { openSnackbar } from 'store/slices/snackbar';
import { Code, ContentPaste, CheckCircle, Storefront, CloudUploadOutlined, HistoryOutlined } from '@mui/icons-material';
import { useState, useEffect } from 'react';
import formatDate from 'hooks/useDate';
import { publishCreate, publishOperate, publishPage, publishGetAuditByAppUid } from 'api/template';
function Upload({ uploadState, appUid }: { uploadState: boolean; appUid: string }) {
    const IconList: { [key: string]: any } = {
        cloudUploadOutlined: <CloudUploadOutlined sx={{ fontSize: '12px' }} />,
        historyOutlined: <HistoryOutlined sx={{ fontSize: '12px' }} />,
        contentPaste: <ContentPaste sx={{ fontSize: '12px' }} />
    };
    const upLoadList = [
        {
            title: '网页',
            desc: '用户在此链接可以直接和您的机器人聊天',
            comingSoon: true,
            action: [
                { title: '复制链接', icon: 'contentPaste' },
                { title: '预览体验', icon: 'historyOutlined' },
                { title: '域名部署', icon: 'historyOutlined' }
            ]
        },
        {
            title: 'JS嵌入',
            desc: '可添加到网站的任何位置，将此 iframe 添加到 html 代码中',
            comingSoon: true,
            action: [
                { title: '创建站点', icon: 'cloudUploadOutlined' },
                { title: '查看代码', icon: 'historyOutlined' }
            ]
        },
        {
            title: 'API调用',
            desc: '通过API，可直接进行调用或发出请求',
            comingSoon: true,
            action: [
                { title: '接口秘钥', icon: 'cloudUploadOutlined' },
                { title: '接口文档', icon: 'historyOutlined' }
            ]
        }
    ];
    const wchatList = [
        {
            title: '微信群聊',
            desc: '微信群在新创建的微信群聊中提供机器人服务，首位进群人员为管理员；',
            comingSoon: true,
            action: [
                { title: '创建群聊', icon: 'cloudUploadOutlined' },
                { title: '查看群聊', icon: 'historyOutlined' }
            ]
        },
        {
            title: '微信公众号',
            desc: '可在微信公众号后台配置，提供机器人服务',
            comingSoon: true,
            action: [{ title: '配置微信公众号', icon: 'cloudUploadOutlined' }]
        },
        {
            title: '企业微信',
            desc: '可在企业微信配置，提供微信机器人服务',
            comingSoon: true,
            action: [{ title: '配置企业微信公众号', icon: 'cloudUploadOutlined' }]
        },
        {
            title: '小程序',
            desc: '可在微信公众号后台配置，提供机器人服务',
            comingSoon: true,
            action: [{ title: '小程序', icon: 'cloudUploadOutlined' }]
        }
    ];
    const otherList = [
        {
            title: '飞书',
            desc: '微信群在新创建的微信群聊中提供机器人服务，首位进群人员为管理员；',
            comingSoon: true,
            action: [
                { title: '创建群聊', icon: 'cloudUploadOutlined' },
                { title: '查看群聊', icon: 'historyOutlined' }
            ]
        },
        {
            title: '钉钉',
            desc: '可在钉钉后台配置，提供机器人服务',
            comingSoon: true,
            action: [{ title: '钉钉', icon: 'cloudUploadOutlined' }]
        },
        {
            title: 'QQ',
            desc: '可在QQ配置，提供QQ机器人服务',
            comingSoon: true,
            action: [{ title: 'QQ', icon: 'cloudUploadOutlined' }]
        },
        {
            title: 'APP',
            desc: '可在APP后台配置，提供机器人服务',
            comingSoon: true,
            action: [{ title: 'App', icon: 'cloudUploadOutlined' }]
        }
    ];
    useEffect(() => {
        if (appUid) {
            getAuditByAppUid();
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [appUid]);
    const getAuditByAppUid = () => {
        publishGetAuditByAppUid(appUid).then((res) => {
            setReleaseState(res.audit);
            setEffUid(res.uid);
        });
    };
    const [tableData, setTableData] = useState([]);
    //点击更新之后保存的值
    const [upData, setUpdate] = useState<null | { updateTime: number; uid: string }>(null);
    //发布状态
    const [releaseState, setReleaseState] = useState<number>(0);
    //发布uid（页面进入获取的uid）
    const [effUid, setEffUid] = useState('');
    const handleUpdate = async () => {
        const result = await publishCreate({ appUid });
        setUpdate(result);
    };
    //发布到市场
    const uploadMarket = async () => {
        if (upData) {
            const result = await publishOperate({ uid: upData?.uid as string, appUid, status: releaseState === 1 ? 4 : 1 });
            if (result) {
                getAuditByAppUid();
                dispatch(
                    openSnackbar({
                        open: true,
                        message: '操作成功',
                        variant: 'alert',
                        alert: {
                            color: 'error'
                        },
                        close: false
                    })
                );
            }
        } else if (releaseState === 1) {
            const result = await publishOperate({ uid: effUid, appUid, status: 4 });
            if (result) {
                getAuditByAppUid();
                dispatch(
                    openSnackbar({
                        open: true,
                        message: '操作成功',
                        variant: 'alert',
                        alert: {
                            color: 'error'
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
        const result = await publishPage({ appUid });
        setTableData(result.list);
        setHistorySate(true);
    };
    return (
        <Box>
            <SubCard
                sx={{ p: 2, mb: 4 }}
                contentSX={{ height: '50px', p: '0 !important', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}
            >
                <Box>
                    <Typography fontSize={16} fontWeight={500}>
                        点击[更新]按钮保存设置以便发布。
                    </Typography>
                    {upData && (
                        <Box fontSize={12} mt="12px" display="flex" alignItems="center">
                            <CheckCircle color="success" sx={{ fontSize: '14px' }} /> 所有设置已更新!最后一次更新日期：
                            <Typography color="secondary">{upData && formatDate(upData.updateTime)}</Typography>
                        </Box>
                    )}
                </Box>
                <Button disabled={!uploadState} color="secondary" variant="outlined" onClick={handleUpdate}>
                    更新
                </Button>
            </SubCard>
            <Typography>
                <span
                    className={
                        "before:bg-[#673ab7] before:left-0 before:top-[7px] before:content-[''] before:w-[3px] before:h-[14px] before:absolute before:ml-0.5 block text-lg font-medium pl-[12px] relative"
                    }
                >
                    基础
                </span>
            </Typography>
            <Grid container spacing={2}>
                <Grid item md={6} xs={12}>
                    <SubCard contentSX={{ height: '120px', p: '20px', display: 'flex' }}>
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
                                <Storefront color="secondary" />
                            </Box>
                        </Box>
                        <Box ml={2}>
                            <Typography fontSize={16} fontWeight={500} display="flex" alignItems="center">
                                模板市场
                                <Chip
                                    sx={{ ml: 1.5 }}
                                    size="small"
                                    label={
                                        releaseState === 0
                                            ? '未发表的'
                                            : releaseState === 1
                                            ? '待审核的'
                                            : releaseState === 2
                                            ? '审核通过'
                                            : releaseState === 3
                                            ? '审核未通过'
                                            : releaseState === 4
                                            ? '用户已取消'
                                            : '已失效'
                                    }
                                />
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
                                        cursor: upData || releaseState === 1 ? 'pointer' : 'default',
                                        '&:hover': { color: upData || releaseState === 1 ? '#673ab7' : 'none' }
                                    }}
                                    onClick={uploadMarket}
                                >
                                    <CloudUploadOutlined sx={{ fontSize: '12px' }} />
                                    &nbsp;&nbsp; {releaseState === 1 ? '取消发布' : '发布到模板市场'}
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
                                    sx={{ background: '#f2f3f5' }}
                                    display="flex"
                                    alignItems="center"
                                    justifyContent="center"
                                >
                                    <Code />
                                </Box>
                            </Box>
                            <Box ml={2}>
                                <Typography fontSize={16} fontWeight={500} display="flex" alignItems="center">
                                    {item.title}
                                    {item.comingSoon && <Chip sx={{ ml: 1.5 }} size="small" label="即将推出" />}
                                </Typography>
                                <Typography margin="10px 0 10px" height="32px" lineHeight="16px" color="#9da3af">
                                    {item.desc}
                                </Typography>
                                <Box display="flex">
                                    {item.action.map((el, i) => (
                                        <Box key={i} color="#b5bed0" fontSize="12px" display="flex" alignItems="center" mr={2}>
                                            {IconList[el.icon]}
                                            &nbsp;&nbsp; {el.title}
                                        </Box>
                                    ))}
                                </Box>
                            </Box>
                        </SubCard>
                    </Grid>
                ))}
            </Grid>
            <Typography mt={4}>
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
                                    <Code />
                                </Box>
                            </Box>
                            <Box ml={2}>
                                <Typography fontSize={16} fontWeight={500} display="flex" alignItems="center">
                                    {item.title}
                                    {item.comingSoon && <Chip sx={{ ml: 1.5 }} size="small" label="即将推出" />}
                                </Typography>
                                <Typography margin="10px 0 10px" height="32px" lineHeight="16px" color="#9da3af">
                                    {item.desc}
                                </Typography>
                                <Box display="flex">
                                    {item.action.map((el, i) => (
                                        <Box key={i} color="#b5bed0" fontSize="12px" display="flex" alignItems="center" mr={2}>
                                            {IconList[el.icon]}
                                            &nbsp;&nbsp; {el.title}
                                        </Box>
                                    ))}
                                </Box>
                            </Box>
                        </SubCard>
                    </Grid>
                ))}
            </Grid>
            <Typography mt={4}>
                <span
                    className={
                        "before:bg-[#673ab7] before:left-0 before:top-[7px] before:content-[''] before:w-[3px] before:h-[14px] before:absolute before:ml-0.5 block text-lg font-medium pl-[12px] relative"
                    }
                >
                    其他
                </span>
            </Typography>
            <Grid container spacing={2}>
                {otherList.map((item) => (
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
                                    <Code />
                                </Box>
                            </Box>
                            <Box ml={2}>
                                <Typography fontSize={16} fontWeight={500} display="flex" alignItems="center">
                                    {item.title}
                                    {item.comingSoon && <Chip sx={{ ml: 1.5 }} size="small" label="即将推出" />}
                                </Typography>
                                <Typography margin="10px 0 10px" height="32px" lineHeight="16px" color="#9da3af">
                                    {item.desc}
                                </Typography>
                                <Box display="flex">
                                    {item.action.map((el, i) => (
                                        <Box key={i} color="#b5bed0" fontSize="12px" display="flex" alignItems="center" mr={2}>
                                            {IconList[el.icon]}
                                            &nbsp;&nbsp; {el.title}
                                        </Box>
                                    ))}
                                </Box>
                            </Box>
                        </SubCard>
                    </Grid>
                ))}
            </Grid>
            <Dialog maxWidth="lg" fullWidth open={historyState} onClose={() => setHistorySate(false)}>
                <DialogTitle>历史记录</DialogTitle>
                <DialogContent>
                    <TableContainer component={Paper}>
                        <Table size="small">
                            <TableHead>
                                <TableRow>
                                    <TableCell>APP名称</TableCell>
                                    <TableCell>版本号</TableCell>
                                    <TableCell>更新时间</TableCell>
                                    <TableCell>状态</TableCell>
                                </TableRow>
                            </TableHead>
                            <TableBody>
                                {tableData.map((row: any) => (
                                    <TableRow key={row.name} sx={{ '&:last-child td, &:last-child th': { border: 0 } }}>
                                        <TableCell component="th" scope="row">
                                            {row.name}
                                        </TableCell>
                                        <TableCell>{row.version}</TableCell>
                                        <TableCell>{formatDate(row.updateTime)}</TableCell>
                                        <TableCell>
                                            {row.audit === 0
                                                ? '未发表的'
                                                : row.audit === 1
                                                ? '待审核的'
                                                : row.audit === 2
                                                ? '审核通过'
                                                : row.audit === 3
                                                ? '审核未通过'
                                                : row.audit === 4
                                                ? '用户已取消'
                                                : '已失效'}
                                        </TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    </TableContainer>
                </DialogContent>
            </Dialog>
        </Box>
    );
}
export default Upload;
