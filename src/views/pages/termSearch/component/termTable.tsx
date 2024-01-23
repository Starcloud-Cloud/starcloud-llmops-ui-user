import { Button, Select, Table, Popover, Tooltip, Image } from 'antd';
import { Pagination } from '@mui/material';
import type { ColumnsType } from 'antd/es/table';
import { ArrowDownOutlined } from '@ant-design/icons';
import React, { useState, useEffect, memo, useRef } from 'react';
import AddLexicon from './addLexicon';
import copy from 'clipboard-copy';
import { openSnackbar } from 'store/slices/snackbar';
import { dispatch } from 'store';
import './termTable.scss';
const TermTable = ({
    loading,
    pageQuery,
    queryAsin,
    total,
    tableData,
    type,
    setPageQuery,
    getExtended
}: {
    loading: boolean;
    pageQuery: any;
    queryAsin: any;
    total: number;
    tableData: any[];
    type: number;
    setPageQuery: (data: any) => void;
    getExtended: (data: number) => void;
}) => {
    const tableRef: any = useRef(null);
    const [selectedRowKeys, setSelectedRowKeys] = useState<React.Key[]>([]);
    const rowSelection = {
        selectedRowKeys,
        onChange: (selectedRowKeys: React.Key[], selectedRows: any[]) => {
            setSelectedRowKeys(selectedRowKeys);
        }
    };
    const columns: ColumnsType<any> = [
        {
            title: '#',
            width: 50,
            align: 'center',
            render: (_, row, index) => <div>{index + 1 + pageQuery.size * (pageQuery.page - 1)}</div>
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
            align: 'center',
            render: (_, row) => (
                <>
                    <Popover
                        placement="rightBottom"
                        content={
                            <div className="w-[630px] h-[280px] rounded flex flex-wrap gap-4">
                                {row.gkDatas?.map((item: any, index: number) => (
                                    <div>
                                        <Popover
                                            placement="top"
                                            content={
                                                <div className="w-[330px] ">
                                                    <div className="my-[10px] line-clamp-2 text-sm">{item.asinTitle}</div>
                                                    <div className="flex justify-between items-center text-[#95999e]">
                                                        <div>
                                                            价格：<span className="text-[#673ab7]">${item.asinPrice}</span>
                                                        </div>
                                                        <div>
                                                            评论数(评分)：
                                                            <span className="text-[#673ab7]">
                                                                {item.asinReviews}({item.asinRating})
                                                            </span>
                                                        </div>
                                                    </div>
                                                </div>
                                            }
                                        >
                                            <div className=" w-[110px] p-[10px] border border-solid rounded border-[#d4d8dd] hover:border-[#673ab7] overflow-hidden cursor-pointer">
                                                <Image width={90} src={item.asinImage} preview={false} />
                                            </div>
                                        </Popover>

                                        <div className="text-[#95999e] text-center">第{index + 1}位</div>
                                    </div>
                                ))}
                            </div>
                        }
                        trigger="hover"
                    >
                        <Tooltip placement="top" title="点击复制">
                            <span
                                className="border-b border-dashed border-[#d4d8dd] cursor-pointer"
                                onClick={() => {
                                    copy(row.keywords);
                                    dispatch(
                                        openSnackbar({
                                            open: true,
                                            message: '复制成功',
                                            variant: 'alert',
                                            alert: {
                                                color: 'success'
                                            },
                                            close: false,
                                            anchorOrigin: { vertical: 'top', horizontal: 'right' },
                                            transition: 'SlideLeft'
                                        })
                                    );
                                }}
                            >
                                {row.keywords}
                            </span>
                        </Tooltip>
                    </Popover>

                    <div className="text-[#95999e] text-[13px]">{row.keywordCn}</div>
                </>
            )
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
                        <span className="text-[#673ab7] text-sm">
                            流量占比
                            <ArrowDownOutlined className="" rev={undefined} />
                        </span>
                    </div>
                </Tooltip>
            ),
            width: 90,
            align: 'center',
            render: (_, row) => (
                <div className="">
                    <div className="text-[#1e2022]">{(row?.trafficPercentage * 100)?.toFixed(2) || 0 + '%'}</div>
                    <Tooltip placement="top" title="预计周曝光量">
                        <div className="text-[#95999e] cursor-pointer">{parseInt(row?.calculatedWeeklySearches)}</div>
                    </Tooltip>
                </div>
            )
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
            ),
            width: 150,
            align: 'center',
            render: (_, row) => (
                <div className="w-[150px]">
                    <div className="text-sm font-[500] text-[#95999e] text-center">相关产品：{row.relationVariationsItems?.length}</div>
                    <div className="flex w-[118px] h-[58px] overflow-x-auto items-center sidebar">
                        <div className="shrink-0 cursor-pointer">
                            {row.relationVariationsItems?.map((item: any) => (
                                <Popover
                                    content={
                                        <div className="w-[400px] h-[460px] drop-shadow-sm rounded">
                                            <Image
                                                width={400}
                                                className=" border border-solid border-transparent hover:border-[#673ab7] rounded-lg"
                                                src={item.imageUrl}
                                                preview={false}
                                            />
                                            <div className="my-[10px] line-clamp-1 text-[#dcddde] text-sm">{item.title}</div>
                                            <div className="flex justify-between items-center text-[#95999e]">
                                                <div>
                                                    流量占比：
                                                    <span className="text-[#673ab7]">
                                                        {(item.trafficPercentage * 100)?.toFixed(2) || 0}%
                                                    </span>
                                                </div>
                                                <div>
                                                    价格：<span className="text-[#673ab7]">${item.price}</span>
                                                </div>
                                                <div>
                                                    评论数(评分)：
                                                    <span className="text-[#673ab7]">
                                                        {item.reviews}({item.rating})
                                                    </span>
                                                </div>
                                            </div>
                                        </div>
                                    }
                                    placement="right"
                                    trigger="hover"
                                >
                                    <Image
                                        className="border border-solid border-transparent hover:border-[#673ab7] rounded overflow-hidden"
                                        key={item.asin}
                                        width={46}
                                        height={46}
                                        preview={false}
                                        src={item.imageUrl}
                                    />
                                </Popover>
                            ))}
                        </div>
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
            align: 'center',
            width: 200,
            render: (_, row, index) => (
                <div className="w-[168px] relative">
                    <div className="absolute top-[-20px] left-0 w-[168px] h-[70px]" id={'chart' + index}></div>
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
            align: 'center',
            render: (_, row) => <span className="border-b border-dashed border-[#9fa3a8]">{row.searchesRank}</span>
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
            align: 'center',
            render: (_, row) => (
                <>
                    <span className="border-b border-dashed border-[#9fa3a8]">{row.searches}</span>
                    <Tooltip placement="top" title="日均">
                        <div className="text-[#95999e] text-[13px]">{parseInt((row.searches / 30)?.toString())}</div>
                    </Tooltip>
                </>
            )
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
            align: 'center',
            render: (_, row) => (
                <>
                    <span>{row.purchases}</span>
                    <div className="text-[#95999e] text-[13px]">{parseInt((row.purchaseRate * 100)?.toFixed(2) || 0 + '%')}</div>
                </>
            )
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
            align: 'center',
            dataIndex: 'cprExact'
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
            align: 'center',
            dataIndex: 'titleDensityExact'
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
            align: 'center',
            dataIndex: 'products'
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
            align: 'center',
            dataIndex: 'supplyDemandRatio'
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
            align: 'center',
            render: (_, row) => (
                <Tooltip placement="top" title="近7天广告竞品数">
                    <div>{row.latest7daysAds}</div>
                </Tooltip>
            )
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
            align: 'center',
            render: (_, row) => (
                <div>
                    <span className="border-b border-dashed border-[#9fa3a8]">{(row.top3ClickingRate * 100)?.toFixed(1) || 0 + '%'}</span>
                    <div className="text-[#95999e] text-[13px]">{(row.top3ConversionRate * 100)?.toFixed(1) || 0 + '%'}</div>
                </div>
            )
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
            align: 'center',
            render: (_, row) => (
                <div>
                    <span className="border-b border-dashed border-[#9fa3a8]">${row.top3ClickingRate?.toFixed(2) || 0}</span>
                    <div className="text-[#95999e] text-[13px]">{row.bidMin?.toFixed(2) || 0 + '-' + row.bidMax?.toFixed(2) || 0}</div>
                </div>
            )
        }
    ];
    const getChartsList = (index: number, Axis: string[], rankList: number[], searchList: number[]) => {
        const chartContainer = document.getElementById('chart' + index);
        // @ts-ignore
        const myChart = window.echarts.init(chartContainer);
        const options = {
            grid: {
                left: '0%',
                right: '0%',
                top: '0%',
                bottom: '0%'
            },
            xAxis: {
                type: 'category',
                data: Axis,
                show: false
            },
            yAxis: {
                type: 'value',
                show: false
            },
            tooltip: {
                show: true,
                showContent: true,
                trigger: 'axis'
            },
            series: [
                {
                    name: '月搜索量',
                    data: searchList,
                    type: 'line',
                    smooth: true,
                    symbolSize: 0,
                    lineStyle: {
                        width: 0.5
                    },
                    itemStyle: {
                        color: '#fedcdc'
                    },
                    areaStyle: {
                        color: '#fedcdc'
                    }
                },
                {
                    name: 'ABA排名',
                    data: rankList,
                    type: 'line',
                    lineStyle: {
                        width: 0.5
                    },
                    smooth: true,
                    symbolSize: 0
                }
            ]
        };
        myChart.setOption(options);
    };
    //弹框
    const [open, setOpen] = useState(false);
    useEffect(() => {
        tableData?.map((item: any, index: number) => {
            const Axis: any[] = [];
            const rankList: any[] = [];
            const searchList: any[] = [];
            item.searchesTrend?.map((el: any) => {
                Axis.push(`${el?.month?.substr(0, 4)}年${el?.month?.substr(4, 2)}月`);
                rankList.push(el?.searchRank);
                searchList.push(el?.searches);
            });
            getChartsList(index, Axis, rankList, searchList);
        });
        if (tableRef.current) {
            tableRef.current.scrollIntoView({ behavior: 'smooth' });
        }
    }, [JSON.stringify(tableData)]);
    return (
        <div ref={tableRef}>
            <div className="sticky top-0 z-[3] bg-[#fff] flex items-center justify-between p-[20px] pt-[12px] h-[76px]">
                <div>
                    <Button>导出</Button>
                    <Button className="mx-[10px]" onClick={() => setOpen(true)} disabled={selectedRowKeys.length === 0}>
                        加入词库
                    </Button>
                    <span className="text-[#7b7e81]">
                        搜索结果数：<span className="text-[#673ab7] font-[600]">{total}</span>
                    </span>
                </div>
                <div>
                    <Select
                        className="w-[140px] h-[36px]"
                        value={pageQuery.orderColumn}
                        onChange={(data) =>
                            setPageQuery({
                                ...pageQuery,
                                orderColumn: data
                            })
                        }
                        options={[
                            { label: '流量占比', value: 12 },
                            { label: '相关ASIN', value: 20 },
                            { label: 'ABA周排名', value: 4 },
                            { label: '月搜索量', value: 5 },
                            { label: '月购买量', value: 6 },
                            { label: '月购买量', value: 6 },
                            { label: '购买率', value: 7 },
                            { label: 'SPR', value: 16 },
                            { label: '标题密度', value: 15 },
                            { label: '商品数', value: 8 },
                            { label: '供需比', value: 9 },
                            { label: '广告竞品数', value: 10 },
                            { label: '点击集中度', value: 19 },
                            { label: 'PPC竞价', value: 11 }
                        ]}
                    ></Select>
                    <Select
                        className="w-[80px] h-[36px] mx-[10px]"
                        value={pageQuery.desc}
                        onChange={(data) =>
                            setPageQuery({
                                ...pageQuery,
                                desc: data
                            })
                        }
                        defaultValue="倒序"
                        options={[
                            { label: '升序', value: false },
                            { label: '降序', value: true }
                        ]}
                    ></Select>
                    <Button onClick={() => getExtended(type)}>确定</Button>
                </div>
            </div>
            <Table
                className="termTable"
                loading={loading}
                sticky={{ offsetHeader: 76 }}
                scroll={{ x: '1300px' }}
                pagination={false}
                rowKey={'keywords'}
                rowSelection={rowSelection}
                columns={columns}
                dataSource={tableData}
            />
            {total > pageQuery.size && (
                <div className="mt-[20px] flex">
                    <Pagination
                        page={pageQuery.page}
                        count={Math.ceil(total / pageQuery.size)}
                        onChange={(e: any, value: number) => {
                            setPageQuery({
                                ...pageQuery,
                                page: value
                            });
                        }}
                    />
                    <Select
                        style={{ width: 100 }}
                        value={pageQuery.size}
                        onChange={(value) => {
                            setPageQuery({
                                ...pageQuery,
                                size: value
                            });
                        }}
                        options={[
                            { value: 10, label: '10 条/页' },
                            { value: 20, label: '20 条/页' },
                            { value: 30, label: '30 条/页' },
                            { value: 50, label: '50 条/页' }
                        ]}
                    />
                </div>
            )}
            {open && <AddLexicon open={open} queryAsin={queryAsin} selectedRowKeys={selectedRowKeys} setOpen={setOpen} />}
        </div>
    );
};
const arePropsEqual = (prevProps: any, nextProps: any) => {
    return (
        JSON.stringify(prevProps?.tableData) === JSON.stringify(nextProps?.tableData) &&
        JSON.stringify(prevProps?.loading) === JSON.stringify(nextProps?.loading) &&
        JSON.stringify(prevProps?.page) === JSON.stringify(nextProps?.page)
    );
};
export default memo(TermTable, arePropsEqual);
