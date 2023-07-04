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
    Pagination
} from '@mui/material';
import formatDate from 'hooks/useDate';
import SubCard from 'ui-component/cards/SubCard';
import { useState, useEffect } from 'react';
import Chart, { Props } from 'react-apexcharts';
import { logStatistics, infoPage } from 'api/template';
import { t } from 'hooks/web/useI18n';
interface LogStatistics {
    messageCount: string;
    createDate: string;
    elapsedTotal: string;
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
interface Page {
    pageNo: number;
    pageSize: number;
}
function ApplicationAnalysis() {
    const [queryParams, setQuery] = useState({
        date: '',
        play: '',
        scene: '',
        type: '',
        username: ''
    });
    const [generate, setGenerate] = useState<Charts[]>([]);
    const [total, setTotal] = useState(0);
    const [page, setPage] = useState({
        pageNo: 1,
        pageSize: 10
    });
    const [totalData, setTotalData] = useState<TableData[]>([]);
    //获取表格数据
    const infoList = (params: Page) => {
        infoPage(params).then((res) => {
            setTotalData(res.list);
            setTotal(res.total);
        });
    };
    useEffect(() => {
        //获取echarts
        logStatistics().then((res) => {
            const message = res?.map((item: LogStatistics) => ({ y: item.messageCount, x: item.createDate }));
            const userCount = res?.map((item: LogStatistics) => ({ y: item.userCount, x: item.createDate }));
            const tokens = res?.map((item: LogStatistics) => ({ y: item.tokens, x: item.createDate }));
            const elapsedTotal = res?.map((item: LogStatistics) => ({ y: item.elapsedTotal, x: item.createDate }));
            setGenerate([
                { title: t('generateLog.messageTotal'), data: message },
                { title: t('generateLog.usertotal'), data: userCount },
                { title: t('generateLog.TimeConsuming'), data: elapsedTotal },
                { title: t('generateLog.tokenTotal'), data: tokens }
            ]);
        });
        infoList(page);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);
    const handleChange = (e: any) => {
        const { name, value } = e.target;
        setQuery({ ...queryParams, [name]: value });
    };
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
    const list = (item: Charts): Props => {
        return {
            height: 300,
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
    return (
        <Box>
            <Grid sx={{ mb: 2 }} container spacing={2}>
                <Grid item md={3} lg={2} xs={12}>
                    <FormControl fullWidth>
                        <InputLabel id="demo-simple-select-label">分析</InputLabel>
                        <Select
                            labelId="demo-simple-select-label"
                            name="date"
                            label="分析"
                            value={queryParams.date}
                            onChange={handleChange}
                        >
                            <MenuItem value={10}>Ten</MenuItem>
                            <MenuItem value={20}>Twenty</MenuItem>
                            <MenuItem value={30}>Thirty</MenuItem>
                        </Select>
                    </FormControl>
                </Grid>
                <Grid item md={3} lg={2} xs={12}>
                    <FormControl fullWidth>
                        <InputLabel id="demo-simple-select-label">应用</InputLabel>
                        <Select
                            labelId="demo-simple-select-label"
                            name="play"
                            label="应用"
                            value={queryParams.play}
                            onChange={handleChange}
                        >
                            <MenuItem value={10}>Ten</MenuItem>
                            <MenuItem value={20}>Twenty</MenuItem>
                            <MenuItem value={30}>Thirty</MenuItem>
                        </Select>
                    </FormControl>
                </Grid>
                <Grid item md={3} lg={2} xs={12}>
                    <FormControl fullWidth>
                        <InputLabel id="demo-simple-select-label">场景</InputLabel>
                        <Select
                            labelId="demo-simple-select-label"
                            name="scene"
                            label="场景"
                            value={queryParams.scene}
                            onChange={handleChange}
                        >
                            <MenuItem value={10}>Ten</MenuItem>
                            <MenuItem value={20}>Twenty</MenuItem>
                            <MenuItem value={30}>Thirty</MenuItem>
                        </Select>
                    </FormControl>
                </Grid>
                <Grid item md={3} lg={2} xs={12}>
                    <FormControl fullWidth>
                        <InputLabel id="demo-simple-select-label">用户类型</InputLabel>
                        <Select
                            labelId="demo-simple-select-label"
                            name="type"
                            label="用户类型"
                            value={queryParams.type}
                            onChange={handleChange}
                        >
                            <MenuItem value={10}>Ten</MenuItem>
                            <MenuItem value={20}>Twenty</MenuItem>
                            <MenuItem value={30}>Thirty</MenuItem>
                        </Select>
                    </FormControl>
                </Grid>
            </Grid>
            <Grid container spacing={2}>
                {generate.map((item) => (
                    <Grid item md={6} xs={12} key={item.title}>
                        <SubCard sx={{ height: '400px' }}>
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
                            <TableCell>{t('generate.name')}</TableCell>
                            <TableCell>{t('generate.mode')}</TableCell>
                            <TableCell>{t('generate.totalMessageTokens')}</TableCell>
                            <TableCell>{t('generate.totalAnswerTokens')}</TableCell>
                            <TableCell>{t('generate.totalElapsed')}</TableCell>
                            <TableCell>{t('generate.totalPrice')}</TableCell>
                            <TableCell>{t('generate.status')}</TableCell>
                            <TableCell>{t('generate.createTime')}</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {totalData?.map((row) => (
                            <TableRow key={row.uid} sx={{ '&:last-child td, &:last-child th': { border: 0 } }}>
                                <TableCell>{row.appMode}</TableCell>
                                <TableCell>{row.appName}</TableCell>
                                <TableCell>{row.totalMessageTokens}</TableCell>
                                <TableCell>{row.totalAnswerTokens}</TableCell>
                                <TableCell>{row.totalElapsed}</TableCell>
                                <TableCell>{row.totalPrice}</TableCell>
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
