import {
    Box,
    Grid,
    FormControl,
    InputLabel,
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
    Tooltip,
    Divider,
    Chip
} from '@mui/material';
import formatDate from 'hooks/useDate';
import AccessAlarm from '@mui/icons-material/AccessAlarm';
import SubCard from 'ui-component/cards/SubCard';
import { useState, useEffect } from 'react';
import Chart, { Props } from 'react-apexcharts';
import { logStatistics, infoPage, logTimeType, detailImage, detailApp } from 'api/template';
import SearchIcon from '@mui/icons-material/Search';
import { t } from 'hooks/web/useI18n';
import Perform from '../carryOut/perform';
import marketStore from 'store/market';
import PicModal from 'views/picture/create/Modal';
interface LogStatistics {
    messageCount: string;
    createDate: string;
    elapsedAvg: number;
    userCount: string;
    tokens: string;
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
}
function ApplicationAnalysis() {
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
        infoPage({ ...params, ...queryParams }).then((res) => {
            setTotalData(res.list);
            setTotal(res.total);
        });
    };
    //获取标数据
    const getStatistic = () => {
        logStatistics(queryParams).then((res) => {
            const message = res?.map((item: LogStatistics) => ({ y: item.messageCount, x: item.createDate }));
            // const userCount = res?.map((item: LogStatistics) => ({ y: item.userCount, x: item.createDate }));
            const tokens = res?.map((item: LogStatistics) => ({ y: item.tokens, x: item.createDate }));
            // const elapsedAvg = res?.map((item: LogStatistics) => ({ y: item.elapsedAvg?.toFixed(2), x: item.createDate }));
            setGenerate([
                { title: t('generateLog.messageTotal'), data: message },
                // { title: t('generateLog.usertotal'), data: userCount },
                // { title: t('generateLog.TimeConsuming') + '(S)', data: elapsedAvg },
                { title: t('generateLog.tokenTotal'), data: tokens }
            ]);
        });
    };
    const [dateList, setDateList] = useState([] as Date[]);
    const scenseList = [
        { label: '创作中心', value: 'WEB_ADMIN' },
        { label: '应用市场', value: 'WEB_MARKET' },
        { label: '分享', value: 'SHARE_WEB' }
    ];
    useEffect(() => {
        //获取echarts
        getStatistic();
        infoList(page);
        logTimeType().then((res) => {
            setDateList(res);
        });
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);
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
    const [open, setOpen] = useState(false);

    // 详情
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
    return (
        <Box>
            <Grid sx={{ mb: 2 }} container spacing={2} alignItems="center">
                <Grid item md={3} lg={2} xs={12}>
                    <TextField
                        label={t('generateLog.name')}
                        value={queryParams.appName}
                        name="appName"
                        InputLabelProps={{ shrink: true }}
                        onChange={(e) => {
                            setQuery({ ...queryParams, [e.target.name]: e.target.value });
                        }}
                        fullWidth
                    />
                </Grid>
                <Grid item md={3} lg={2} xs={12}>
                    <FormControl fullWidth>
                        <InputLabel id="appMode">模式</InputLabel>
                        <Select labelId="appMode" name="appMode" label="模式" value={queryParams.appMode} onChange={handleChange}>
                            <MenuItem value="COMPLETION">生成</MenuItem>
                            <MenuItem value="CHAT">聊天</MenuItem>
                            <MenuItem value="BASE_GENERATE_IMAGE">图片</MenuItem>
                        </Select>
                    </FormControl>
                </Grid>
                <Grid item md={3} lg={2} xs={12}>
                    <FormControl fullWidth>
                        <InputLabel id="fromScene">场景</InputLabel>
                        <Select labelId="fromScene" name="fromScene" label="场景" value={queryParams.fromScene} onChange={handleChange}>
                            {scenseList.map((item) => (
                                <MenuItem value={item.value}>{item.label}</MenuItem>
                            ))}
                        </Select>
                    </FormControl>
                </Grid>
                <Grid item md={3} lg={2} xs={12}>
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
                <Grid item md={3} lg={2} xs={12}>
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
                            <TableCell align="center">{t('generate.mode')}</TableCell>
                            <TableCell align="center">{t('generate.name')}</TableCell>
                            <TableCell align="center">执行场景</TableCell>
                            <TableCell align="center">{t('generate.totalAnswerTokens')}</TableCell>
                            <TableCell align="center">{t('generate.totalElapsed')} (s)</TableCell>
                            <TableCell align="center">{t('generate.status')}</TableCell>
                            <TableCell align="center">{t('generate.createTime')}</TableCell>
                            <TableCell align="center"></TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {totalData?.map((row) => (
                            <TableRow key={row.uid} sx={{ '&:last-child td, &:last-child th': { border: 0 } }}>
                                <TableCell align="center">{t('generate.' + row.appMode)}</TableCell>
                                <TableCell align="center">{row.appName}</TableCell>
                                <TableCell align="center">{scenseList.find((item) => item.value === row.fromScene)?.label}</TableCell>
                                <TableCell align="center">{row.totalAnswerTokens + row.totalMessageTokens}</TableCell>
                                <TableCell align="center">{row.totalElapsed}</TableCell>
                                <TableCell align="center">{row.status}</TableCell>
                                <TableCell align="center">{formatDate(row.createTime)}</TableCell>
                                <TableCell align="center">
                                    <Button
                                        color="secondary"
                                        size="small"
                                        onClick={() => {
                                            if (row.appMode === 'BASE_GENERATE_IMAGE') {
                                                detailImage(row.uid).then((res) => {
                                                    setDetail(res.list);
                                                });
                                            } else if (row.appMode === 'COMPLETION') {
                                                detailApp(row.uid).then((res) => {
                                                    setDetail(res.list);
                                                });
                                            } else {
                                            }
                                            setOpen(true);
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
            <Drawer anchor="right" open={open} onClose={() => setOpen(false)}>
                <Card elevation={2} sx={{ p: 2, width: { sm: '100%', md: '1000px' } }}>
                    {/* 应用 */}
                    {/* <Box>
                        <Box display="flex" justifyContent="space-between" alignItems="center">
                            <Box display="flex" justifyContent="space-between" alignItems="center">
                                <AccessAlarm sx={{ fontSize: '70px' }} />
                                <Box>
                                    <Box>
                                        <Typography variant="h1" sx={{ fontSize: '2rem' }}>
                                            {detail?.name}
                                        </Typography>
                                    </Box>
                                    <Box>
                                        {detail?.categories?.map((item: any) => (
                                            <span key={item}>#{categoryList?.find((el: { code: string }) => el.code === item)?.name}</span>
                                        ))}
                                        {detail?.tags?.map((el: any) => (
                                            <Chip key={el} sx={{ marginLeft: 1 }} size="small" label={el} variant="outlined" />
                                        ))}
                                    </Box>
                                </Box>
                            </Box>
                        </Box>
                        <Divider sx={{ mb: 1 }} />
                        <Typography variant="h5" sx={{ fontSize: '1.1rem', mb: 3 }}>
                            {detail?.description}
                        </Typography>
                        <Perform
                        config={{}}
                        changeSon={() => {}}
                        changeanswer={() => {}}
                        loadings={[]}
                        variableChange={() => {}}
                        promptChange={() => {}}
                        isallExecute={() => {}}
                        source="myApp"
                    />
                    </Box> */}
                    {/* 图片 */}
                    <Box>
                        <Table aria-label="simple table">
                            <TableHead>
                                <TableRow>
                                    <TableCell align="center">{t('generate.mode')}</TableCell>
                                    <TableCell align="center">{t('generate.name')}</TableCell>
                                    <TableCell align="center">执行场景</TableCell>
                                    <TableCell align="center">{t('generate.status')}</TableCell>
                                    <TableCell align="center">错误消息</TableCell>
                                    <TableCell align="center">用户</TableCell>
                                    <TableCell align="center">{t('generate.createTime')}</TableCell>
                                    <TableCell align="center"></TableCell>
                                </TableRow>
                            </TableHead>
                            <TableBody>
                                {detail?.map((row) => (
                                    <TableRow key={row.uid} sx={{ '&:last-child td, &:last-child th': { border: 0 } }}>
                                        <TableCell align="center">{t('generate.' + row.appMode)}</TableCell>
                                        <TableCell align="center">{row.appName}</TableCell>
                                        <TableCell align="center">
                                            {scenseList.find((item) => item.value === row.fromScene)?.label}
                                        </TableCell>
                                        <TableCell align="center">{row.status}</TableCell>
                                        <TableCell align="center">
                                            <Tooltip title={row.errorMessage}>
                                                <Typography width="200px" noWrap>
                                                    {row.errorMessage}
                                                </Typography>
                                            </Tooltip>
                                        </TableCell>
                                        <TableCell align="center">{row.endUser}</TableCell>
                                        <TableCell align="center">{formatDate(row.createTime as number)}</TableCell>
                                        <TableCell align="center">
                                            <Button
                                                color="secondary"
                                                size="small"
                                                onClick={() => {
                                                    setImgDetail(row.imageInfo);
                                                    setPicOpen(true);
                                                }}
                                            >
                                                {t('generate.detail')}
                                            </Button>
                                        </TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    </Box>
                </Card>
            </Drawer>
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
        </Box>
    );
}
export default ApplicationAnalysis;
