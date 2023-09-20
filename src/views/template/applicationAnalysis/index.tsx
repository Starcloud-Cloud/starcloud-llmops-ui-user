import {
    Box,
    Grid,
    FormControl,
    InputLabel,
    InputAdornment,
    Select,
    MenuItem,
    Typography,
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableRow,
    TableContainer,
    Paper,
    Pagination,
    TextField,
    Button,
    Drawer,
    Card,
    Divider,
    Chip,
    IconButton,
    CardContent
} from '@mui/material';
import { dispatch } from 'store';
import { openSnackbar } from 'store/slices/snackbar';
import ClearIcon from '@mui/icons-material/Clear';
import formatDate from 'hooks/useDate';
import AccessAlarm from '@mui/icons-material/AccessAlarm';
import CloseIcon from '@mui/icons-material/Close';
import SubCard from 'ui-component/cards/SubCard';
import MainCard from 'ui-component/cards/MainCard';
import { useState, useEffect } from 'react';
import Chart, { Props } from 'react-apexcharts';
import { logStatistics, statisticsByAppUid, infoPage, infoPageByAppUid, logMetaData, detailImage, detailApp } from 'api/template';
import SearchIcon from '@mui/icons-material/Search';
import { t } from 'hooks/web/useI18n';
import Perform from '../carryOut/perform';
import marketStore from 'store/market';
import PicModal from 'views/picture/create/Modal';
import { getChatRecord } from 'api/chat';
import { ChatRecord } from '../myChat/createChat/components/ChatRecord';
import useUserStore from 'store/user';
interface LogStatistics {
    messageCount: string;
    createDate: string;
    elapsedAvg: number;
    userCount: string;
    tokens: string;
    feedbackLikeCount: number;
}
interface Charts {
    title: string;
    data: { x: string; y: string | number }[];
}
interface TableData {
    uid: string;
    appMode: string;
    fromScene: string;
    appName: string;
    totalAnswerTokens: number;
    totalMessageTokens: number;
    totalElapsed: number;
    status: string;
    createTime: number;
    errorMessage: string;
    endUser: string;
    appExecutor: string;
    updateTime: number;
}
interface Date {
    label: string;
    value: string;
}
interface Query {
    appName?: string;
    timeType?: string;
    appMode?: string;
    fromScene?: string;
}
interface Detail {
    name?: string;
    description?: string;
    categories?: string[];
    tags?: string[];

    uid?: string;
    appMode?: string;
    appName?: string;
    fromScene?: string;
    status?: string;
    errorMessage?: string;
    endUser?: string;
    createTime?: number;
    imageInfo?: any;
    appExecutor?: string;
    appInfo?: any;
}
function ApplicationAnalysis({
    appUid = null,
    value = 2,
    type = 'GENERATE_RECORD'
}: {
    appUid: string | null;
    value: number;
    type: string;
}) {
    const [queryParams, setQuery] = useState<Query>({
        timeType: 'LAST_7D'
    });
    const [generate, setGenerate] = useState<Charts[]>([]);
    const [total, setTotal] = useState(0);
    const [page, setPage] = useState({
        pageNo: 1,
        pageSize: 15
    });
    const [totalData, setTotalData] = useState<TableData[]>([]);
    //获取表格数据
    const infoList = (params: any) => {
        if (type === 'GENERATE_RECORD') {
            infoPage({ ...params, ...queryParams, appUid }).then((res) => {
                setTotalData(res.list);
                setTotal(res.total);
            });
        } else {
            infoPageByAppUid({ ...params, ...queryParams, appUid }).then((res) => {
                setTotalData(res.list);
                setTotal(res.total);
            });
        }
    };
    const permissions = useUserStore((state) => state.permissions);
    //获取标数据
    const getStatistic = async () => {
        let res: any;
        if (type === 'GENERATE_RECORD') {
            res = await logStatistics({ ...queryParams, appUid });
        } else {
            res = await statisticsByAppUid({ ...queryParams, appUid });
        }
        const message = res?.map((item: LogStatistics) => ({ y: item.messageCount, x: item.createDate }));
        const userCount = res?.map((item: LogStatistics) => ({ y: item.feedbackLikeCount, x: item.createDate }));
        const tokens = res?.map((item: LogStatistics) => ({ y: item.tokens, x: item.createDate }));
        const elapsedAvg = res?.map((item: LogStatistics) => ({ y: item.elapsedAvg?.toFixed(2), x: item.createDate }));
        const newList = [];
        permissions.includes('log:app:analysis:usageCount') && newList.push({ title: t('generateLog.messageTotal'), data: message });
        permissions.includes('log:app:analysis:usageToken') && newList.push({ title: t('generateLog.tokenTotal'), data: tokens });
        permissions.includes('log:app:analysis:avgElapsed') &&
            newList.push({ title: t('generateLog.TimeConsuming') + '(S)', data: elapsedAvg });
        permissions.includes('log:app:analysis:userLike') && newList.push({ title: t('generateLog.usertotal'), data: userCount });
        setGenerate(newList);
    };
    //时间
    const [dateList, setDateList] = useState([] as Date[]);
    //模式
    const [appMode, setAppMode] = useState([] as Date[]);
    //场景
    const [appScene, setAppScene] = useState([] as Date[]);

    useEffect(() => {
        logMetaData(type).then((res) => {
            setDateList(res.timeType);
            setAppMode(res.appMode);
            setAppScene(res.appScene);
        });
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);
    useEffect(() => {
        if (value === 2 || value === 7) {
            //获取echarts
            getStatistic();
            infoList(page);
        }
    }, [value]);
    //输入框输入
    const handleChange = (e: any) => {
        const { name, value } = e.target;
        setQuery({ ...queryParams, [name]: value });
    };
    //切换分页
    const paginationChange = (event: any, value: number) => {
        setPage((oldValue) => {
            const newValue = {
                ...oldValue,
                pageNo: value
            };
            infoList(newValue);
            return newValue;
        });
    };
    //封装的echarts
    const list = (item: Charts): Props => {
        return {
            height: 200,
            type: 'area',
            options: {
                tooltip: {
                    enabled: true
                },
                chart: {
                    id: item.title,
                    toolbar: {
                        show: false
                    },
                    zoom: {
                        enabled: false
                    },
                    sparkline: {
                        enabled: false
                    }
                },
                dataLabels: {
                    enabled: false
                },
                stroke: {
                    curve: 'straight',
                    width: 2
                },
                fill: {
                    type: 'gradient',
                    gradient: {
                        shadeIntensity: 1,
                        opacityFrom: 0.5,
                        opacityTo: 0,
                        stops: [0, 80, 100]
                    }
                },
                legend: {
                    show: true
                },
                yaxis: {
                    labels: {
                        show: true
                    },
                    axisBorder: {
                        show: true
                    }
                },
                xaxis: {
                    labels: {
                        show: true
                    },
                    axisBorder: {
                        show: true
                    }
                }
            },
            series: [{ name: '', data: item.data }]
        };
    };
    //搜索
    const querys = () => {
        setPage((oldValue) => {
            const newValue = {
                ...oldValue,
                pageNo: 1
            };
            getStatistic();
            infoList(newValue);
            return newValue;
        });
    };
    const categoryList = marketStore((state) => state.categoryList);
    const getDeList = (row: { appMode: string; uid: string }) => {
        if (row.appMode === 'BASE_GENERATE_IMAGE') {
            detailImage({ conversationUid: row.uid }).then((res) => {
                if (res.status === 'SUCCESS') {
                    setImgDetail(res.imageInfo);
                    setPicOpen(true);
                } else {
                    dispatch(
                        openSnackbar({
                            open: true,
                            message: res.errorMessage,
                            variant: 'alert',
                            alert: {
                                color: 'error'
                            },
                            close: false
                        })
                    );
                }
            });
        }
    };
    const [detail, setDetail] = useState<Detail[] | null>(null);
    //图片弹框
    const [picOpen, setPicOpen] = useState(false);
    const [ImgDetail, setImgDetail] = useState({
        images: [],
        prompt: '',
        engine: '',
        width: 0,
        height: 0
    });
    const [currentIndex, setCurrentIndex] = useState(0);
    //执行弹窗
    const [exeOpen, setExeOpen] = useState(false);
    const [exeDetail, setExeDetail] = useState<any>({});
    //聊天
    const [chatVisible, setChatVisible] = useState(false);
    //绘话id
    const [conversationUid, setConversationUid] = useState('');

    return (
        <Box>
            <Grid sx={{ mb: 2 }} container spacing={2} alignItems="center">
                {!appUid && (
                    <>
                        <Grid item md={4} lg={3} xs={12}>
                            <TextField
                                label={t('generateLog.name')}
                                value={queryParams.appName}
                                name="appName"
                                type="search"
                                InputLabelProps={{ shrink: true }}
                                onChange={handleChange}
                                fullWidth
                            />
                        </Grid>
                        <Grid item md={4} lg={3} xs={12}>
                            <FormControl fullWidth>
                                <InputLabel id="appMode">模式</InputLabel>
                                <Select
                                    type="search"
                                    labelId="appMode"
                                    name="appMode"
                                    label="模式"
                                    value={queryParams.appMode}
                                    onChange={handleChange}
                                >
                                    {appMode.map((item) => (
                                        <MenuItem value={item.value}>{item.label}</MenuItem>
                                    ))}
                                </Select>
                            </FormControl>
                        </Grid>
                    </>
                )}
                <Grid item md={4} lg={3} xs={12}>
                    <FormControl fullWidth>
                        <InputLabel id="fromScene">场景</InputLabel>
                        <Select labelId="fromScene" name="fromScene" label="场景" value={queryParams.fromScene} onChange={handleChange}>
                            {appScene.map((item) => (
                                <MenuItem value={item.value}>{item.label}</MenuItem>
                            ))}
                        </Select>
                    </FormControl>
                </Grid>
                <Grid item md={4} lg={3} xs={12}>
                    <FormControl fullWidth>
                        <InputLabel id="demo-simple-select-label">{t('generateLog.date')}</InputLabel>
                        <Select
                            labelId="demo-simple-select-label"
                            name="timeType"
                            label={t('generateLog.date')}
                            value={queryParams.timeType}
                            onChange={handleChange}
                        >
                            {dateList?.map((item) => (
                                <MenuItem key={item.value} value={item.value}>
                                    {item.label}
                                </MenuItem>
                            ))}
                        </Select>
                    </FormControl>
                </Grid>
                <Grid item md={4} lg={3} xs={12}>
                    <Button onClick={querys} startIcon={<SearchIcon />} variant="contained" color="primary">
                        {t('generateLog.search')}
                    </Button>
                </Grid>
            </Grid>
            <Grid container spacing={2}>
                {generate.map((item) => (
                    <Grid item md={6} xs={12} key={item.title}>
                        <SubCard sx={{ pb: 0 }}>
                            <Typography variant="h4" gutterBottom>
                                {item.title}
                            </Typography>
                            <Chart {...list(item)} />
                        </SubCard>
                    </Grid>
                ))}
            </Grid>
            <TableContainer component={Paper} sx={{ mt: 2 }}>
                <Table sx={{ minWidth: 650 }} aria-label="simple table">
                    <TableHead>
                        <TableRow>
                            <TableCell align="center">{t('generate.name')}</TableCell>
                            <TableCell align="center">{t('generate.mode')}</TableCell>
                            <TableCell align="center">执行场景</TableCell>
                            <TableCell align="center">{t('generate.totalAnswerTokens')}</TableCell>
                            <TableCell align="center">{t('generate.totalElapsed')} (s)</TableCell>
                            <TableCell align="center">{t('generate.status')}</TableCell>
                            <TableCell align="center">用户</TableCell>
                            <TableCell align="center">更新时间</TableCell>
                            <TableCell align="center"></TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {totalData?.map((row) => (
                            <TableRow key={row.uid} sx={{ '&:last-child td, &:last-child th': { border: 0 } }}>
                                <TableCell align="center">{row.appName}</TableCell>
                                <TableCell align="center">{t('generate.' + row.appMode)}</TableCell>
                                <TableCell align="center">{appScene.find((item) => item.value === row.fromScene)?.label}</TableCell>
                                <TableCell align="center">{row.totalAnswerTokens + row.totalMessageTokens}</TableCell>
                                <TableCell align="center">{row.totalElapsed}</TableCell>
                                <TableCell align="center">{row.status}</TableCell>
                                <TableCell align="center">{row.appExecutor}</TableCell>
                                <TableCell align="center">{formatDate(row.updateTime)}</TableCell>
                                <TableCell align="center">
                                    <Button
                                        color="secondary"
                                        size="small"
                                        onClick={() => {
                                            if (row.appMode === 'BASE_GENERATE_IMAGE') {
                                                getDeList(row);
                                            } else if (row.appMode === 'COMPLETION') {
                                                detailApp({ conversationUid: row.uid }).then((res) => {
                                                    setExeDetail(res.appInfo);
                                                    setConversationUid(res.conversationUid);
                                                    setExeOpen(true);
                                                });
                                            } else if (row.appMode === 'CHAT') {
                                                setChatVisible(true);
                                                setConversationUid(row.uid);
                                                getChatRecord({
                                                    conversationUid: row.uid,
                                                    pageNo: 1,
                                                    pageSize: 100,
                                                    fromScene: row.fromScene
                                                }).then((res) => {
                                                    setDetail(res.list);
                                                });
                                            }
                                        }}
                                    >
                                        {t('generate.detail')}
                                    </Button>
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </TableContainer>
            <Box my={2}>
                <Pagination page={page.pageNo} count={Math.ceil(total / page.pageSize)} onChange={paginationChange} />
            </Box>
            {picOpen && (
                <PicModal
                    open={picOpen}
                    setOpen={() => {
                        setPicOpen(false);
                        setCurrentIndex(0);
                    }}
                    currentIndex={currentIndex}
                    setCurrentIndex={(currentIndex) => {
                        setCurrentIndex(currentIndex);
                    }}
                    currentImageList={ImgDetail.images}
                    prompt={ImgDetail.prompt}
                    engine={ImgDetail.engine}
                    width={ImgDetail.width}
                    height={ImgDetail.height}
                />
            )}
            {chatVisible && (
                <Drawer
                    anchor="right"
                    open={chatVisible}
                    sx={{ '& .MuiDrawer-paper': { overflow: 'hidden' } }}
                    onClose={() => {
                        setChatVisible(false);
                        setConversationUid('');
                        setDetail(null);
                    }}
                >
                    <div className="bg-[#f4f6f8] w-[350px] md:w-[600px] flex items-center justify-center">
                        <div className="m-[10px] bg-[#fff] h-[calc(100vh-20px)] w-[100%] rounded-lg">
                            <Card>
                                <ChatRecord list={detail} conversationUid={conversationUid} />
                            </Card>
                        </div>
                    </div>
                </Drawer>
            )}
            {exeOpen && (
                <Drawer
                    anchor="right"
                    open={exeOpen}
                    sx={{ '& .MuiDrawer-paper': { overflowY: 'auto' } }}
                    onClose={() => {
                        setExeOpen(false);
                        setExeDetail({});
                        setConversationUid('');
                    }}
                >
                    <div className="bg-[#f4f6f8] w-[1000px] md:w-[800px] flex justify-center">
                        <div className="m-[10px] bg-[#fff] h-[calc(100vh-20px)] w-[100%] rounded-lg">
                            <MainCard
                                title={
                                    <Box display="flex" alignItems="end">
                                        <Typography variant="h3">历史详情</Typography>
                                        <Typography fontSize="12px" color="#697586" ml={1}>
                                            (绘话id：{conversationUid})
                                        </Typography>
                                    </Box>
                                }
                                content={false}
                                secondary={
                                    <IconButton
                                        onClick={() => {
                                            setExeOpen(false);
                                            setConversationUid('');
                                        }}
                                        size="large"
                                        aria-label="close modal"
                                    >
                                        <CloseIcon fontSize="small" />
                                    </IconButton>
                                }
                            >
                                <CardContent>
                                    <Box>
                                        <Box display="flex" justifyContent="space-between" alignItems="center">
                                            <Box display="flex" justifyContent="space-between" alignItems="center">
                                                <AccessAlarm sx={{ fontSize: '70px' }} />
                                                <Box>
                                                    <Box>
                                                        <Typography variant="h1" sx={{ fontSize: '2rem' }}>
                                                            {exeDetail?.name}
                                                        </Typography>
                                                    </Box>
                                                    <Box>
                                                        {exeDetail?.categories?.map((item: any) => (
                                                            <span key={item}>
                                                                #{categoryList?.find((el: { code: string }) => el.code === item)?.name}
                                                            </span>
                                                        ))}
                                                        {exeDetail?.tags?.map((el: any) => (
                                                            <Chip
                                                                key={el}
                                                                sx={{ marginLeft: 1 }}
                                                                size="small"
                                                                label={el}
                                                                variant="outlined"
                                                            />
                                                        ))}
                                                    </Box>
                                                </Box>
                                            </Box>
                                        </Box>
                                        <Divider sx={{ mb: 1 }} />
                                        <Typography variant="h5" sx={{ fontSize: '1.1rem', mb: 3 }}>
                                            {exeDetail?.description}
                                        </Typography>
                                        <Perform
                                            history={true}
                                            config={exeDetail.workflowConfig}
                                            changeConfigs={() => {}}
                                            changeSon={() => {}}
                                            changeanswer={() => {}}
                                            loadings={[]}
                                            isShows={[]}
                                            variableChange={() => {}}
                                            promptChange={() => {}}
                                            isallExecute={() => {}}
                                            source="myApp"
                                        />
                                    </Box>
                                </CardContent>
                            </MainCard>
                        </div>
                    </div>
                </Drawer>
            )}
        </Box>
    );
}
export default ApplicationAnalysis;
