import { Button, Select, Table, Popover, Tooltip, Image } from 'antd';
import { Card, Pagination } from '@mui/material';
import type { ColumnsType } from 'antd/es/table';
import React, { useState, useEffect, memo } from 'react';
import * as echarts from 'echarts';
import copy from 'clipboard-copy';
import { openSnackbar } from 'store/slices/snackbar';
import { dispatch } from 'store';
import './termTable.scss';
import { delKeyword } from 'api/listing/thesaurus';
import { Arrow } from './Arrow';
import { splitThousandth } from 'utils/number-format';

const TermTable = ({
    loading,
    pageQuery,
    queryAsin,
    total,
    tableData,
    type,
    setPageQuery,
    getExtended,
    uid
}: {
    loading: boolean;
    pageQuery: any;
    queryAsin: any;
    total: number;
    tableData: any[];
    type: number;
    uid: string;
    setPageQuery: (data: any) => void;
    getExtended: (orderColumn?: number, desc?: boolean) => void;
}) => {
    const [selectedRowKeys, setSelectedRowKeys] = useState<React.Key[]>([]);
    const [desc, setDesc] = useState<boolean>(false);
    const [orderColumn, setOrderColumn] = useState<number>(0);

    const rowSelection = {
        selectedRowKeys,
        onChange: (selectedRowKeys: React.Key[], selectedRows: any[]) => {
            setSelectedRowKeys(selectedRowKeys);
        }
    };
    const columns: ColumnsType<any> = [
        {
            title: '#',
            width: 72,
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
                                    copy(row.keyword);
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
                                {row.keyword}
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
                            <p>该关键词下搜索结果第1页产品的主要所属类目</p>
                            <p>将搜索结果第1页的产品按所属类目汇总，类目下产品越多的类目排在前面</p>
                            <p>比如保温杯，可能出现在户外、家居类目</p>
                        </>
                    }
                >
                    <div className="cursor-default">所属类目</div>
                </Tooltip>
            ),
            width: 200,
            render: (_, row, index) => <span>{row?.departments?.[0]?.label}</span>
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
                    <div className="cursor-default">
                        月搜索趋势
                        {[23].includes(pageQuery.orderColumn) && <Arrow isDesc={pageQuery.desc} />}
                    </div>
                </Tooltip>
            ),
            width: 200,
            render: (_, row, index) => (
                <div className="w-[168px] relative">
                    <div className="absolute top-[-20px] left-0 w-[168px] h-[70px]" id={'chart' + index}></div>
                </div>
            )
        },
        // {
        //     title: (
        //         <Tooltip
        //             placement="top"
        //             title={
        //                 <>
        //                     <p> 上行：相关度的相对值，最高=100，最低=0.5</p>
        //                     <p> 数值越大，表示该关键词与查询关键词在亚马逊搜索结果第一页的自然排名中，所关联的同款竞品ASIN数量越多</p>
        //                     <p>
        //                         ps：相关度=100并不代表该关键词与查询关键词所关联的ASIN完全一样，而是指该关键词与查询关键词在亚马逊搜索结果第一页的自然排名产品中同款ASIN数量最多
        //                     </p>
        //                     <p>
        //                         下行：相关度的绝对值，即该关键词与查询关键词在亚马逊搜索结果第一页的自然排名中，所关联的同款竞品ASIN的具体数量
        //                     </p>
        //                 </>
        //             }
        //         >
        //             <div className="cursor-default">
        //                 相关度
        //                 {[21].includes(pageQuery.orderColumn) && <Arrow isDesc={pageQuery.desc} />}
        //             </div>
        //         </Tooltip>
        //     ),
        //     render: (_, row) => (
        //         <>
        //             <div>{row.relevancy && Math.round(row.relevancy)}</div>
        //             <span className="text-[#95999e] text-[13px]">{row.absoluteRelevancy}</span>
        //         </>
        //     )
        // },
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
                    <div className="cursor-default">
                        月搜索量
                        {[5].includes(pageQuery.orderColumn) && <Arrow isDesc={pageQuery.desc} />}
                    </div>
                </Tooltip>
            ),
            render: (_, row) => (
                <>
                    <span className="border-b border-dashed border-[#9fa3a8]">{splitThousandth(row.searches)}</span>
                    <Tooltip placement="top" title="日均">
                        <div className="text-[#95999e] text-[13px]">{splitThousandth(parseInt((row.searches / 30)?.toString()))}</div>
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
                    <div className="cursor-default">
                        月购买量
                        {[7].includes(pageQuery.orderColumn) && <Arrow isDesc={pageQuery.desc} />}
                    </div>
                </Tooltip>
            ),
            render: (_, row) => (
                <>
                    <span>{splitThousandth(row.purchases)}</span>
                    <div className="text-[#95999e] text-[13px]">{parseInt((row.purchaseRate * 100)?.toFixed(2))}%</div>
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
                    <div className="cursor-default">
                        SPR
                        {[16].includes(pageQuery.orderColumn) && <Arrow isDesc={pageQuery.desc} />}
                    </div>
                </Tooltip>
            ),
            dataIndex: 'spr',
            render: (value) => splitThousandth(value)
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
                    <div className="cursor-default">
                        标题密度
                        {[15].includes(pageQuery.orderColumn) && <Arrow isDesc={pageQuery.desc} />}
                    </div>
                </Tooltip>
            ),
            dataIndex: 'titleDensity'
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
                    <div className="cursor-default">
                        商品数
                        {[8].includes(pageQuery.orderColumn) && <Arrow isDesc={pageQuery.desc} />}
                    </div>
                </Tooltip>
            ),
            dataIndex: 'products',
            render: (value) => splitThousandth(value)
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
                    <div className="cursor-default">
                        供需比
                        {[9].includes(pageQuery.orderColumn) && <Arrow isDesc={pageQuery.desc} />}
                    </div>
                </Tooltip>
            ),
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
                    <div className="cursor-default">
                        广告竞品数
                        {[22].includes(pageQuery.orderColumn) && <Arrow isDesc={pageQuery.desc} />}
                    </div>
                </Tooltip>
            ),
            render: (_, row) => (
                <Tooltip placement="top" title="近7天广告竞品数">
                    <div>{splitThousandth(row.adProducts)}</div>
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
                        </>
                    }
                >
                    <div className="cursor-default">
                        点击集中度
                        {[18].includes(pageQuery.orderColumn) && <Arrow isDesc={pageQuery.desc} />}
                    </div>
                </Tooltip>
            ),
            render: (_, row) => (
                <div>
                    <span className="border-b border-dashed border-[#9fa3a8]">
                        {row.monopolyClickRate && (row.monopolyClickRate * 100)?.toFixed(1) + '%'}
                    </span>
                    <div className="text-[#95999e] text-[13px]">{row.cvsShareRate && (row.cvsShareRate * 100)?.toFixed(1) + '%'}</div>
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
                    <div className="cursor-default">
                        RPC竞价
                        {[11].includes(pageQuery.orderColumn) && <Arrow isDesc={pageQuery.desc} />}
                    </div>
                </Tooltip>
            ),
            render: (_, row) => (
                <div>
                    <span className="border-b border-dashed border-[#9fa3a8]">${row.bid && row.bid?.toFixed(2)}</span>
                    <div className="text-[#95999e] text-[13px]">
                        {row.bidMin && row.bidMin?.toFixed(2)} - {row.bidMax && row.bidMax?.toFixed(2)}
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
                            <p> 数据取自: 关键词在亚马逊搜索结果中点击排名前3 ASIN的“中位数”</p>
                            <p>点击数字，可查看该关键词搜索前3页的价格/评分数/评分值分布情况</p>
                            <p> 价格分布：判断哪个价格区间可能还有机会(价格差异化)，以及哪个价格区间竞争最为激烈</p>
                            <p> 评分数分布：说明该市场打造新品的难度，如果中低评分数区间占比较大，说明新品进入壁垒不高</p>
                            <p>
                                评分值分布：说明该市场的成熟度，如果4.5以上的商品数很多，说明该市场很成熟，通过商品差异性建立竞争壁垒难度较大；如果3.5分商品很多，可能存在改进空间
                            </p>
                        </>
                    }
                >
                    <div className="cursor-default">
                        市场分析
                        {[17].includes(pageQuery.orderColumn) && <Arrow isDesc={pageQuery.desc} />}
                    </div>
                </Tooltip>
            ),
            render: (_, row) => (
                <div>
                    <span className="border-b border-dashed border-[#9fa3a8]">${row.avgPrice}</span>
                    <div className="text-[#95999e] text-[13px]">${splitThousandth(row.avgReviews) + '(' + row.avgRating + ')'}</div>
                </div>
            )
        }
    ];
    const getChartsList = (index: number, Axis: string[], rankList: number[], searchList: number[]) => {
        const chartContainer = document.getElementById('chart' + index);
        const myChart = echarts.init(chartContainer);
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

    useEffect(() => {
        tableData?.map((item: any, index: number) => {
            const Axis: any[] = [];
            const rankList: any[] = [];
            const searchList: any[] = [];
            item.trends?.map((el: any) => {
                Axis.push(`${el?.month?.substr(0, 4)}年${el?.month?.substr(4, 2)}月`);
                rankList.push(el?.searchRank);
                searchList.push(el?.search);
            });
            getChartsList(index, Axis, rankList, searchList);
        });
    }, [JSON.stringify(tableData)]);

    const handleDelDict = async () => {
        const res = await delKeyword({
            uid,
            data: selectedRowKeys
        });
        if (res) {
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
            getExtended();
        }
    };

    return (
        <div className="mt-4 rounded-lg bg-[#fff] py-[10px]">
            <div className="z-[3] bg-[#fff] flex items-center justify-between px-[20px] flex-wrap">
                <div>
                    <Button className="mr-2" disabled={!selectedRowKeys.length} onClick={() => handleDelDict()}>
                        批量删除
                    </Button>
                    <span className="text-[#7b7e81]">
                        搜索结果数：<span className="text-[#673ab7] font-[600]">{total}</span>
                    </span>
                </div>
                <div className="my-[10px]">
                    <Select
                        className="w-[140px] h-[36px]"
                        value={pageQuery.orderColumn}
                        onChange={
                            (data) => setOrderColumn(data)
                            // setPageQuery({
                            //     ...pageQuery,
                            //     orderColumn: data
                            // })
                        }
                        options={[
                            // { label: '相关度', value: 21 },
                            { label: 'ABA周排名', value: 23 },
                            { label: '月搜索量', value: 5 },
                            { label: '月购买量', value: 6 },
                            { label: '购买率', value: 7 },
                            { label: 'SPR', value: 16 },
                            { label: '标题密度', value: 15 },
                            { label: '商品数', value: 8 },
                            { label: '供需比', value: 9 },
                            { label: '广告竞品数', value: 22 },
                            { label: '点击集中度', value: 18 },
                            { label: 'RPC竞价', value: 11 },
                            { label: '均价', value: 17 }
                        ]}
                    ></Select>
                    <Select
                        className="w-[80px] h-[36px] mx-[10px]"
                        value={pageQuery.desc}
                        onChange={
                            (data) => setDesc(data)
                            // setPageQuery({
                            //     ...pageQuery,
                            //     desc: data
                            // })
                        }
                        defaultValue="倒序"
                        options={[
                            { label: '升序', value: false },
                            { label: '降序', value: true }
                        ]}
                    ></Select>
                    <Button onClick={() => getExtended(orderColumn, desc)}>确定</Button>
                </div>
            </div>
            <Table
                loading={loading}
                sticky={{ offsetHeader: 0 }}
                scroll={{ x: '1300px' }}
                pagination={false}
                rowKey={'keyword'}
                rowSelection={rowSelection}
                columns={columns}
                dataSource={tableData}
            />
            {total > pageQuery.size && (
                <div className="mb-[10px] mt-[20px] mr-[10px] flex justify-end">
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
        </div>
    );
};

export default memo(TermTable);
