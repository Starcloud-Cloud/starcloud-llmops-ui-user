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
    Button
} from '@mui/material';
import formatDate from 'hooks/useDate';
import SubCard from 'ui-component/cards/SubCard';
import { useState, useEffect } from 'react';
import Chart, { Props } from 'react-apexcharts';
import { logStatistics, infoPage, logTimeType } from 'api/template';
import SearchIcon from '@mui/icons-material/Search';
import { t } from 'hooks/web/useI18n';
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
    [key: string]: string;
}
interface Date {
    label: string;
    value: string;
}
interface Query {
    appName: string;
    timeType: string;
}
function ApplicationAnalysis() {
    const [queryParams, setQuery] = useState<Query>({
        timeType: '',
        appName: ''
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
                            <TableCell>{t('generate.mode')}</TableCell>
                            <TableCell>{t('generate.name')}</TableCell>
                            <TableCell>{t('generate.totalAnswerTokens')}</TableCell>
                            <TableCell>{t('generate.totalElapsed')} (s)</TableCell>
                            <TableCell>{t('generate.status')}</TableCell>
                            <TableCell>{t('generate.createTime')}</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {totalData?.map((row) => (
                            <TableRow key={row.uid} sx={{ '&:last-child td, &:last-child th': { border: 0 } }}>
                                <TableCell>{t('generate.' + row.appMode)}</TableCell>
                                <TableCell>{row.appName}</TableCell>
                                <TableCell>{row.totalAnswerTokens}</TableCell>
                                <TableCell>{row.totalElapsed}</TableCell>
                                <TableCell>{row.status}</TableCell>
                                <TableCell>{formatDate(row.createTime)}</TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </TableContainer>
            <Box my={2}>
                <Pagination page={page.pageNo} count={Math.ceil(total / page.pageSize)} onChange={paginationChange} />
            </Box>
        </Box>
    );
}
export default ApplicationAnalysis;
