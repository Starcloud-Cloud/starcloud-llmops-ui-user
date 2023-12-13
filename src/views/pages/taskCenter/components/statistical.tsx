import { Tabs, Row, Col, Divider } from 'antd';
import { useEffect, useState } from 'react';
import * as echarts from 'echarts';
const Statistical = () => {
    const [activeKey, setActiveKey] = useState('1');
    //基础数据
    const getEchart = () => {
        const myChart = echarts.init(document.getElementById('echarts'));
        const options = {
            xAxis: {
                type: 'category',
                data: ['2023-12-01', '2023-12-02', '2023-12-03', '2023-12-04', '2023-12-05', '2023-12-06', '2023-12-07']
            },
            yAxis: {
                type: 'value'
            },
            legend: {
                show: true
            },
            tooltip: {
                show: true,
                showContent: true,
                trigger: 'axis'
            },
            dataZoom: [
                {
                    id: 'dataZoomX',
                    type: 'slider',
                    xAxisIndex: [0],
                    filterMode: 'filter'
                }
            ],
            series: [
                {
                    name: '笔记数',
                    data: [100, 200, 300, 900, 500, 600, 700],
                    type: 'line',
                    symbolSize: 0,
                    lineStyle: {
                        width: 5
                    },
                    smooth: true,
                    itemStyle: {
                        color: '#fedcdc'
                    }
                },
                {
                    name: '互动总量',
                    data: [700, 600, 500, 400, 300, 200, 100],
                    type: 'bar',
                    smooth: true,
                    barWidth: 20
                }
            ]
        };
        myChart.setOption(options);
    };
    //评论分析
    const getAnalyze = () => {
        const myChart = echarts.init(document.getElementById('analyze'));
        const options = {
            legend: {
                show: true
            },
            tooltip: {
                trigger: 'item'
            },
            series: [
                {
                    name: 'Access From',
                    type: 'pie',
                    radius: ['40%', '70%'],
                    avoidLabelOverlap: false,

                    data: [
                        { value: 1048, name: 'Search Engine' },
                        { value: 735, name: 'Direct' },
                        { value: 580, name: 'Email' },
                        { value: 484, name: 'Union Ads' },
                        { value: 300, name: 'Video Ads' }
                    ]
                }
            ]
        };
        myChart.setOption(options);
    };
    useEffect(() => {
        if (activeKey === '1') {
            getEchart();
        } else {
            // getAnalyze();
        }
    }, [activeKey]);

    return (
        <div className="statistical">
            <Tabs
                activeKey={activeKey}
                onChange={(key: string) => setActiveKey(key)}
                items={[
                    {
                        key: '1',
                        label: '基础数据',
                        children: (
                            <div>
                                <div className="mb-[20px] text-[16px] font-[600] flex items-center">
                                    <span className="block h-[14px] w-[3px] bg-[#ff3347] mr-[10px]"></span> 数据概览
                                </div>
                                <Row gutter={20}>
                                    <Col xxl={6} xl={8} sm={12} xs={24}>
                                        <div className="px-[15px] py-[10px] rounded-md bg-[#fafbfc] flex justify-between flex-col mb-[20px]">
                                            <div className="text-[14px] font-[400]">达人数</div>
                                            <div className="mt-[10px] flex justify-between items-center">
                                                <span className="text-[12px]">当前周期</span>
                                                <span className="text-[20px] font-[700]">50.1W</span>
                                            </div>
                                            <Divider />
                                            <div className="flex justify-between text-[12px] font-[400] text-[#898e99]">
                                                <span>上一周期</span>
                                                <span>52.9W</span>
                                            </div>
                                        </div>
                                    </Col>
                                </Row>
                                <div className="my-[20px] text-[16px] font-[600] flex items-center">
                                    <span className="block h-[14px] w-[3px] bg-[#ff3347] mr-[10px]"></span> 数据概览
                                </div>
                                <div id="echarts" className="h-[500px] w-full"></div>
                            </div>
                        )
                    },
                    {
                        key: '2',
                        label: ' 评论分析',
                        children: (
                            <div>
                                {/* <div className="mb-[20px] text-[16px] font-[600] flex items-center">
                                    <span className="block h-[14px] w-[3px] bg-[#ff3347] mr-[10px]"></span> 评论词云
                                </div> */}
                                <div className="my-[20px] text-[16px] font-[600] flex items-center">
                                    <span className="block h-[14px] w-[3px] bg-[#ff3347] mr-[10px]"></span> 评论情感构成
                                </div>
                                <div id="analyze" className="h-[500px]"></div>
                            </div>
                        )
                    }
                ]}
            />
        </div>
    );
};
export default Statistical;
