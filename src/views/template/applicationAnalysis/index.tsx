import { Card, Box, Grid, FormControl, InputLabel, Select, MenuItem, Typography } from '@mui/material';
import { useState } from 'react';
import Chart, { Props } from 'react-apexcharts';
function ApplicationAnalysis() {
    const [queryParams, setQuery] = useState({
        date: '',
        play: '',
        scene: '',
        type: '',
        username: ''
    });
    const handleChange = (e: any) => {
        const { name, value } = e.target;
        setQuery({ ...queryParams, [name]: value });
    };

    const chartData: Props = {
        height: 300,
        type: 'area',
        options: {
            chart: {
                id: 'market-sale-chart',
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
        series: [
            {
                name: 'Youtube',
                data: [10, 90, 65, 85, 40, 80, 30]
            },
            {
                name: 'Facebook',
                data: [50, 30, 25, 15, 60, 10, 25]
            },
            {
                name: 'Twitter',
                data: [5, 50, 40, 55, 20, 40, 20]
            }
        ]
    };
    return (
        <Box>
            <Grid container spacing={2}>
                <Grid item md={3} lg={2}>
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
                <Grid item md={3} lg={2}>
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
                <Grid item md={3} lg={2}>
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
                <Grid item md={3} lg={2}>
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
            <Grid container mt={2} spacing={5}>
                <Grid item md={6} xs={12}>
                    <Card elevation={5} sx={{ height: '500px', padding: 2 }}>
                        <Typography variant="h4" gutterBottom>
                            折线图
                        </Typography>
                        <Typography variant="subtitle1" gutterBottom>
                            副标题
                        </Typography>
                        <Chart {...chartData} />
                    </Card>
                </Grid>
                <Grid item md={6} xs={12}>
                    <Card elevation={5} sx={{ height: '500px', padding: 2 }}>
                        <Typography variant="h4" gutterBottom>
                            折线图
                        </Typography>
                        <Typography variant="subtitle1" gutterBottom>
                            副标题
                        </Typography>
                        <Chart {...chartData} />
                    </Card>
                </Grid>
                <Grid item md={6} xs={12}>
                    <Card elevation={5} sx={{ height: '500px', padding: 2 }}>
                        <Typography variant="h4" gutterBottom>
                            折线图
                        </Typography>
                        <Typography variant="subtitle1" gutterBottom>
                            副标题
                        </Typography>
                        <Chart {...chartData} />
                    </Card>
                </Grid>
                <Grid item md={6} xs={12}>
                    <Card elevation={5} sx={{ height: '500px', padding: 2 }}>
                        <Typography variant="h4" gutterBottom>
                            折线图
                        </Typography>
                        <Typography variant="subtitle1" gutterBottom>
                            副标题
                        </Typography>
                        <Chart {...chartData} />
                    </Card>
                </Grid>
            </Grid>
        </Box>
    );
}
export default ApplicationAnalysis;
