import { Button, Select, Divider, Tag, Input, Table, Tooltip } from 'antd';
import { ArrowDownOutlined, BarChartOutlined, MoreOutlined, DeleteOutlined } from '@ant-design/icons';
import type { ColumnsType } from 'antd/es/table';
import React, { useState } from 'react';
import Chart, { Props } from 'react-apexcharts';
const TermSearch = () => {
    const [tags, setTags] = useState<string[]>([]);
    const handleClose = (removedTag: string) => {
        const newTags = tags.filter((tag) => tag !== removedTag);
        console.log(newTags);
        setTags(newTags);
    };
    const [value, setValue] = useState('');
    const [pageQuery, setPageQuery] = useState({
        pageNo: 1,
        pageSize: 10
    });
    const [loading, setLoading] = useState(false);
    const [selectedRowKeys, setSelectedRowKeys] = useState<React.Key[]>([]);
    const rowSelection = {
        selectedRowKeys,
        onChange: (selectedRowKeys: React.Key[], selectedRows: any[]) => {
            console.log(`selectedRowKeys: ${selectedRowKeys}`, 'selectedRows: ', selectedRows);
        }
    };
    const columns: ColumnsType<any> = [
        {
            title: '#',
            width: 40,
            render: (_, row, index) => <div>{(index + 1) * pageQuery.pageNo}</div>
        },
        {
            title: (
                <span className="text-[#86898c] text-[13px] w-[130px]">
                    关键词&nbsp;
                    <Tooltip placement="top" title="鼠标移到每列数据的标题，会出现详细解释哦！">
                        <span className="text-[#673ab7] text-[12px] font-[400] border-b border-dashed border-[#673ab7] cursor-default ">
                            数据解释
                        </span>
                    </Tooltip>
                </span>
            ),
            width: 130,
            dataIndex: 'age'
        },
        {
            title: (
                <Tooltip
                    placement="top"
                    title={
                        <>
                            <p>上行：流量占比，指的是所有查询ASIN通过该流量词获得的曝光量占比的总和</p>
                            <p>关键词的流量占比数值越大，说明该关键词给ASIN带来的曝光量越大</p>
                            <p className="mt-[10px]">
                                下行：预估周曝光量，指的是该关键词本周内给产品带来的预估曝光量，非该词在亚马逊的总搜索量
                            </p>
                        </>
                    }
                >
                    <div className="cursor-default relative min-w-[90px]">
                        <span className="text-[12px] leading-3 p-[2px] text-[#fff] rounded bg-[#673ab7] absolute top-[-13px] left-[13px]">
                            内测版
                        </span>
                        <span className="text-[#673ab7] text-sm">
                            流量占比
                            <ArrowDownOutlined className="" rev={undefined} />
                        </span>
                    </div>
                </Tooltip>
            ),
            width: 90,
            dataIndex: 'address'
        },
        {
            title: (
                <Tooltip
                    placement="top"
                    title={
                        <>
                            <p>通过相关ASIN，可以查看该关键词来源于查询ASIN中的哪些变体</p>
                            <p>展示的变体根据关键词流量占比从左至右降序排列，您可以滑动查看更多变体</p>
                            <p className="mt-[10px]">图片支持点击跳转到该变体的亚马逊Listing详情页</p>
                            <p>鼠标悬浮在图片上可以看到产品大图及流量占比、价格等数据</p>
                        </>
                    }
                >
                    <div className="cursor-default">相关ASIN</div>
                </Tooltip>
            )
        },
        {
            title: (
                <Tooltip
                    placement="top"
                    title={
                        <>
                            <p>最近2-3年该关键词的月度搜索量趋势</p>
                            <p>对于季节性或趋势性关键词，可能只在最近2年某几个月出现，则其它月份搜索量填充0</p>
                            <p>对于月搜索量为0的关键词，表示该关键词搜索量太小，没有达到收录阈值</p>
                            <p className="mt-[10px]">
                                扩展阅读：<span className="text-[#673ab7] cursor-pointer">如何通过搜索趋势判断买家需求？</span>
                            </p>
                        </>
                    }
                >
                    <div className="cursor-default">月搜索趋势</div>
                </Tooltip>
            ),
            width: 200,
            render: (_, row) => (
                <div className="w-[200px] h-full relative">
                    <div className="absolute top-[-50px]">
                        <Chart {...echarts()} />
                    </div>
                </div>
            )
        },
        {
            title: (
                <Tooltip
                    placement="top"
                    title={
                        <>
                            <p>
                                数据来源于亚马逊ABA数据的每周关键词搜索频率排名（Search Frequency Rank）数字越小表示排名越靠前，搜索量越高
                            </p>
                            <p className="mt-[10px]">列表页的ABA周排名展示的是最近一周的数据，每周更新上一周的数据</p>
                            <p>鼠标悬浮在排名数字上可以看到当前数据对应的时间</p>
                        </>
                    }
                >
                    <div className="cursor-default">ABA周排名</div>
                </Tooltip>
            ),
            dataIndex: 'address'
        },
        {
            title: (
                <Tooltip
                    placement="top"
                    title={
                        <>
                            <p>
                                上行：月搜索量，指的是一个自然月的月搜索量，比如2022年6月，该关键词在亚马逊站内的搜索总次数您现在看到的是上个月的月搜索量，每月月初更新上个月的数据
                            </p>
                            <p>（如果关键词上个月没有搜索量，则显示的是该关键词最近有搜索量的月份的数据）</p>
                            <p className="mt-[10px]">下行：日均搜索量，日均搜索量=月搜索量/30天</p>
                            <p>
                                如何评估卖家精灵关键词的准确率：<span className="text-[#673ab7] cursor-pointer">详细了解</span>
                            </p>
                        </>
                    }
                >
                    <div className="cursor-default">月搜索量</div>
                </Tooltip>
            ),
            dataIndex: 'address'
        },
        {
            title: (
                <Tooltip
                    placement="top"
                    title={
                        <>
                            <p>
                                上行：月购买量，指一个自然月，比如2023年7月，在亚马逊站内搜索该关键词后产生购买的次数 比如：某用户搜索iphone
                                charger，然后1次购买了1个iphone充电器，2条数据线(关联推荐的商品)，则购买量=1
                            </p>
                            <p className="mt-[10px]">
                                下行：购买率，购买率=购买量/搜索量，指的是在买家输入该搜索词并点击此细分市场中的任意商品后，买家的购买次数占买家输入该搜索词总次数的比例，
                                <span className="cursor-pointer text-[#673ab7]">详细了解</span>
                                比如关键词wireless
                                charger，一个月内被搜索了120万次，共产生了1.6万次销售(未必全部是无线充电器，也可能是数据线)，则该词的购买率
                                = 1.6万/120万=1.33%
                            </p>
                        </>
                    }
                >
                    <div className="cursor-default">月购买量</div>
                </Tooltip>
            ),
            dataIndex: 'address'
        },
        {
            title: (
                <Tooltip
                    placement="top"
                    title={
                        <>
                            <p>SellerSprite Product Rank，能够让该关键词排名维持在搜索结果第1页的8天预估单量</p>
                            <p>比如SPR=280，则代表产品8天内该关键词下的出单量需要达到280，才能让该关键词排名维持在搜索结果第1页</p>
                            <p className="mt-[10px]">SPR数值越大，表示让关键词排名维持在首页的单量要求更高，竞争更激烈</p>
                            <p>
                                扩展阅读：<span className="cursor-pointer text-[#673ab7]">如何让关键词排名快速上首页？</span>
                            </p>
                        </>
                    }
                >
                    <div className="cursor-default">SPR</div>
                </Tooltip>
            ),
            dataIndex: 'address'
        },
        {
            title: (
                <Tooltip
                    placement="top"
                    title={
                        <>
                            <p>该关键词在亚马逊搜索结果第1页的产品中，标题包含该关键词的产品数量</p>
                            <p>比如标题密度为12，则代表该关键词的搜索结果第1页中，共有12个产品的标题包含了该关键词</p>
                            <p className="mt-[10px]">
                                扩展阅读：<span className="cursor-pointer text-[#673ab7]">如何利用标题密度找出竞品核心关键词？</span>
                            </p>
                        </>
                    }
                >
                    <div className="cursor-default">标题密度</div>
                </Tooltip>
            ),
            dataIndex: 'address'
        },
        {
            title: (
                <Tooltip
                    placement="top"
                    title={
                        <>
                            <p>商品数，指搜索该关键词后出现了多少相关产品(All Departments类目)</p>
                            <p>比如：1-48 of over 1,000 results for "ipad stand"</p>
                            <p className="mt-[10px]">
                                基于IP地址的不同，各地区IP呈现的搜索结果数都不同，所以您在亚马逊前台搜索的结果数可能也会存在差别，
                                <span className="cursor-pointer text-[#673ab7]">详细解释</span>
                            </p>
                        </>
                    }
                >
                    <div className="cursor-default">商品数</div>
                </Tooltip>
            ),
            dataIndex: 'address'
        },
        {
            title: (
                <Tooltip
                    placement="top"
                    title={
                        <>
                            <p>供需比 = 搜索量(需求) / 商品数(供应)</p>
                            <p>在同类市场中，供需比值越高，则代表该市场需求越强劲</p>
                            <p className="mt-[10px]">
                                比如关键词phone holder的月搜索量为69,465，商品数为14,875则该关键词对应细分市场的供需比为69,465/14,875=4.7
                            </p>
                        </>
                    }
                >
                    <div className="cursor-default">供需比</div>
                </Tooltip>
            ),
            dataIndex: 'address'
        },
        {
            title: (
                <Tooltip
                    placement="top"
                    title={
                        <>
                            <p>表示近7天内进入过该关键词搜索结果前3页的广告产品总数</p>
                            <p>包括SP广告、HR广告、品牌广告和视频广告</p>
                        </>
                    }
                >
                    <div className="cursor-default">广告竞品数</div>
                </Tooltip>
            ),
            dataIndex: 'address'
        },
        {
            title: (
                <Tooltip
                    placement="top"
                    title={
                        <>
                            <p>上行：点击集中度，指该关键词下点击排名前三ASIN的点击总占比</p>
                            <p>
                                数据来源于亚马逊后台ABA报告，一般来说，点击集中度越高，该词垄断程度越高 扩展阅读：
                                <span className="cursor-pointer text-[#673ab7]">如何快速判断细分市场垄断程度？</span>
                            </p>
                            <p className="mt-[10px]">假设点击前三ASIN的点击共享分别是13.9%、12.4%、11.1%</p>
                            <p>则前三ASIN点击总占比=13.9%+12.4%+11.1%=37.4%</p>
                            <p className="mt-[10px]">
                                下行：前三ASIN转化总占比，指的是该关键词下点击排名前三ASIN的转化共享之和（转化共享，指的是该ASIN在这个关键词下的销量占整个词销量的比例）
                            </p>
                            <p className="mt-[10px]">则前三ASIN转化总占比=18.4%+10.9%+5.6%=34.9%</p>
                            <p></p>
                        </>
                    }
                >
                    <div className="cursor-default">点击集中度</div>
                </Tooltip>
            ),
            dataIndex: 'address'
        },
        {
            title: (
                <Tooltip
                    placement="top"
                    title={
                        <>
                            <p>亚马逊站内广告Bid价格，系统提供【词组匹配】的Bid建议价格以及范围</p>
                            <p>关键词出价是市场竞争度、市场成熟度的直接反映，也是营销费用的反映</p>
                            <p className="mt-[10px]">
                                在站内广告投放时，您可以优先选择低竞争高需求的关键词，也就是出价较低而搜索量较高的关键词
                            </p>
                            <p>
                                视频介绍：<span className="cursor-pointer text-[#673ab7]">点击这里</span>
                            </p>
                        </>
                    }
                >
                    <div className="cursor-default">PPC竞价</div>
                </Tooltip>
            ),
            dataIndex: 'address'
        },
        {
            title: '操作',
            fixed: true,
            width: 60,
            render: (_, row) => (
                <>
                    <Button type="text" shape="circle" icon={<BarChartOutlined rev={undefined} />}></Button>
                    <Button type="text" shape="circle" icon={<MoreOutlined rev={undefined} />}></Button>
                    <Button type="text" shape="circle" icon={<DeleteOutlined rev={undefined} />}></Button>
                </>
            )
        }
    ];
    const data: any[] = [];
    for (let i = 0; i < 46; i++) {
        data.push({
            key: i,
            name: `Edward King ${i}`,
            age: 32,
            address: `London, Park Lane no. ${i}`
        });
    }
    const echarts = (): Props => {
        return {
            width: '100%',
            height: '100%',
            type: 'area',
            options: {
                tooltip: {
                    x: {
                        show: false
                    }
                    // custom: function ({ series, seriesIndex, dataPointIndex, w }) {
                    //     console.log(series, seriesIndex, dataPointIndex);

                    //     // 在这里自定义你的提示内容和样式
                    //     return `<div style="background-color: #333; color: #fff; padding: 10px;position:relative">
                    //       <div style="position:absolute top:-100px">
                    //       Series:${series[seriesIndex][dataPointIndex]}
                    //       </div>

                    //     </div>`;
                    // }
                },
                chart: {
                    id: '1',
                    toolbar: {
                        show: false
                    },
                    zoom: {
                        enabled: false
                    },
                    sparkline: {
                        enabled: false
                    },
                    offsetX: -20
                },
                dataLabels: {
                    enabled: false
                },
                stroke: {
                    curve: 'smooth',
                    width: 1
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
                    show: false
                },
                grid: {
                    show: false
                },
                yaxis: {
                    labels: {
                        show: false
                    },
                    axisBorder: {
                        show: false
                    }
                },
                xaxis: {
                    labels: {
                        show: false
                    },
                    axisBorder: {
                        show: false
                    }
                }
            },
            series: [
                {
                    data: [
                        { x: '2021年11月10日', y: 7870 },
                        { x: '2021年11月11日', y: 20 },
                        { x: '2021年11月12日', y: 30 }
                    ]
                },
                {
                    data: [
                        { x: '2021年11月10日', y: 222 },
                        { x: '2021年11月11日', y: '55555' },
                        { x: '2021年11月12日', y: '40%' }
                    ]
                },
                {
                    data: [
                        { x: '2021年11月10日', y: 8888 },
                        { x: '2021年11月11日', y: 7777 },
                        { x: '2021年11月12日', y: 9999 }
                    ]
                }
            ]
        };
    };
    return (
        <div className="h-full overflow-hidden">
            <div className="flex px-[50px] mt-[50px] mb-[20px]">
                <div className="w-[990px]">
                    <div className="min-h-[42px] border border-solid border-[#673ab7] rounded">
                        <div className=" min-h-[32px] flex items-center flex-wrap flex-1">
                            <Select
                                bordered={false}
                                className="w-[110px]"
                                optionLabelProp="label"
                                options={[
                                    { label: '🇨🇳 China', value: 'china' },
                                    { label: '🇨🇺 Usa', value: 'USA' }
                                ]}
                            ></Select>
                            <Select
                                bordered={false}
                                className="w-[110px]"
                                optionLabelProp="label"
                                options={[
                                    { label: '🇨🇳 China', value: 'china' },
                                    { label: '🇨🇺 Usa', value: 'USA' }
                                ]}
                            ></Select>
                            <Divider className="border-[#d8dadf]" type="vertical" />
                            {tags.map((item) => (
                                <Tag
                                    color="#3e4757"
                                    className="my-[6px] mr-[10px] rounded-[15px] h-[30px] text-sm leading-[28px]"
                                    closable
                                    onClose={(e) => {
                                        e.preventDefault();
                                        handleClose(item);
                                    }}
                                >
                                    <span className="pr-[5px]">{item}</span>
                                </Tag>
                            ))}
                            <Input
                                value={value}
                                name="value"
                                onChange={(e: any) => setValue(e.target.value)}
                                className="w-[100%] flex-1"
                                bordered={false}
                                placeholder="已录入20个ASIN"
                            />
                        </div>
                    </div>
                    <div className="mt-[14px] flex items-center justify-end">
                        <p className="text-[13px] text-[#9fa3a8] mr-[6%]">
                            示例ASIN：
                            <span
                                onClick={() => setTags(['B098T9ZFB5', 'B09JW5FNVX', 'B0B71DH45N', 'B07MHHM31K', 'B08RYQR1CJ'])}
                                className="ml-[10px border-b border-dashed border-[#9fa3a8] cursor-pointer hover:text-[#673ab7]"
                            >
                                B098T9ZFB5,B09JW5FNVX,B0B71DH45N,B07MHHM31K,B08RYQR1CJ
                            </span>
                        </p>
                        <Button>清除</Button>
                        <Button className="ml-[10px]">立即查询</Button>
                    </div>
                </div>
                <Button className="ml-[21px]">查询历史</Button>
            </div>
            <div className="bg-[#fff] flex items-center justify-between p-[20px] pt-[12px] h-[76px]">
                <div>
                    <Button>加入词库</Button>
                    <Button className="mx-[10px]">导出</Button>
                    <span className="text-[#7b7e81]">
                        搜索结果数：<span className="text-[#673ab7] font-[600]">1,603</span>
                    </span>
                </div>
                <div>
                    <Select
                        className="w-[140px] h-[36px]"
                        defaultValue="流量占比"
                        options={[
                            { label: '流量占比', value: '流量占比' },
                            { label: '相关ASIN', value: '相关ASIN' }
                        ]}
                    ></Select>
                    <Select
                        className="w-[80px] h-[36px] mx-[10px]"
                        defaultValue="倒序"
                        options={[
                            { label: '升序', value: '升序' },
                            { label: '降序', value: '降序' }
                        ]}
                    ></Select>
                    <Button>确定</Button>
                </div>
            </div>
            <Table scroll={{ x: '1300px' }} rowKey={'key'} rowSelection={rowSelection} columns={columns} dataSource={data} />
        </div>
    );
};
export default TermSearch;
