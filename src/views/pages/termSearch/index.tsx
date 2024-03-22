import { Button, Select, Divider, Tag, Input, Popover } from 'antd';
import { QuestionCircleOutlined } from '@ant-design/icons';
import { Modal, IconButton, CardContent } from '@mui/material';
import SubCard from 'ui-component/cards/SubCard';
import { Close } from '@mui/icons-material';
import MainCard from 'ui-component/cards/MainCard';
import { useEffect, useState } from 'react';
import ResultFilter from './component/resultFilter';
import TermTable from './component/termTable';
import _ from 'lodash-es';
import { openSnackbar } from 'store/slices/snackbar';
import { dispatch } from 'store';
import {
    KeywordMetadataExtendPrepare,
    KeywordMetadataExtendAsin,
    KeywordMetadataPage,
    exportExtendAsin,
    userRighsLimitUsedCount
} from 'api/listing/termSerch';
const TermSearch = () => {
    const { Option } = Select;
    const handleClose = (index: number) => {
        const newList = _.cloneDeep(queryAsin);
        newList.asinList.splice(index, 1);
        setQueryAsin(newList);
    };
    const [value, setValue] = useState('');

    //获取拓ASIN
    const [asinOpen, setAsinOpen] = useState(false);
    const [queryAsin, setQueryAsin] = useState<any>({
        month: '最近30天',
        market: 1,
        asinList: []
    });
    const [asinData, setAsinData] = useState<any>({});
    const getAsin = async () => {
        // 获取权限

        const usedResult = await userRighsLimitUsedCount({ levelRightCode: 'listingQuery' });
        console.log('🚀 ~ getAsin ~ result:', usedResult);

        if (queryAsin.asinList.length === 0) {
            dispatch(
                openSnackbar({
                    open: true,
                    message: 'ASIN没有输入',
                    variant: 'alert',
                    alert: {
                        color: 'error'
                    },
                    close: false
                })
            );
            return false;
        }
        const result = await KeywordMetadataExtendPrepare({
            ...queryAsin,
            month: queryAsin.month === '最近30天' ? '' : queryAsin.month
        });
        setAsinData(result);
        setAsinOpen(true);
    };
    // useEffect(() => {
    //     getAsin();
    // }, []);
    useEffect(() => {
        if (value) {
            const str = /^[a-zA-Z0-9]{10}$/;
            if (str.test(value)) {
                const newList = _.cloneDeep(queryAsin);
                newList.asinList.push(value.toUpperCase());
                setQueryAsin(newList);
                setValue('');
            }
        }
    }, [value]);

    //根据ASIN获取拓展词变体
    const [pageQuery, setPageQuery] = useState({
        page: 1,
        size: 20,
        desc: true, //升降序
        orderColumn: 12 //排序的字段
    });
    useEffect(() => {
        if (type !== 0) {
            getExtended(type);
        }
    }, [pageQuery.page, pageQuery.size]);
    //搜索结果过滤的值
    const [searchResult, setSearchResult] = useState<any>(null);
    //变体类型
    const [type, setType] = useState(0);
    const getExtended = async (num: number) => {
        const { month, market } = queryAsin;
        setLoading(true);
        setAsinOpen(false);
        const result = await KeywordMetadataExtendAsin({
            ...pageQuery,
            ...searchResult,
            excludeKeywords: searchResult?.excludeKeywords ? searchResult.excludeKeywords.split(',') : undefined,
            includeKeywords: searchResult?.includeKeywords ? searchResult.includeKeywords.split(',') : undefined,
            market,
            month: market === '最近30天' ? '' : month,
            queryVariations: num === 1 ? true : false,
            asinList: num === 2 ? asinData?.diamondList : queryAsin.asinList,
            originAsinList: queryAsin.asinList,
            filterDeletedKeywords: false
        });
        setLoading(false);
        setTotal(result.total);
        setTableData(result.items);
    };

    const [total, setTotal] = useState(0);
    const [loading, setLoading] = useState(false);
    const [tableData, setTableData] = useState<any[]>([]);
    //获取日期
    const getPreviousMonthDate = (monthsAgo: number, flag?: boolean) => {
        const currentDate = new Date();
        currentDate.setMonth(currentDate.getMonth() - monthsAgo);

        const year = currentDate.getFullYear();
        const month = currentDate.getMonth() + 1; // 月份从 0 到 11，所以需要加 1

        // 格式化为 YY-MM
        const formattedDate = year + '-' + (month < 10 ? '0' : '') + month;

        return !flag ? formattedDate : year + (month < 10 ? '0' : '') + month;
    };
    //结果筛选
    const filterTable = (data: any) => {
        if (JSON.stringify(data) === JSON.stringify(searchResult)) {
            if (pageQuery.page === 1) {
                getExtended(type);
            } else {
                setPageQuery({
                    ...pageQuery,
                    page: 1
                });
            }
        } else {
            setSearchResult(data);
        }
    };
    useEffect(() => {
        if (searchResult) {
            if (pageQuery.page === 1) {
                getExtended(type);
            } else {
                setPageQuery({
                    ...pageQuery,
                    page: 1
                });
            }
        }
    }, [searchResult]);
    //导出
    const handleExport = async () => {
        const { month, market } = queryAsin;
        const result = await exportExtendAsin({
            ...pageQuery,
            ...searchResult,
            excludeKeywords: searchResult?.excludeKeywords ? searchResult.excludeKeywords.split(',') : undefined,
            includeKeywords: searchResult?.includeKeywords ? searchResult.includeKeywords.split(',') : undefined,
            market,
            month: market === '最近30天' ? '' : month,
            queryVariations: type === 1 ? true : false,
            asinList: type === 2 ? asinData?.diamondList : queryAsin.asinList,
            originAsinList: queryAsin.asinList,
            filterDeletedKeywords: false
        });
        console.log(result);

        const link = document.createElement('a');
        link.href = window.URL.createObjectURL(result);
        link.target = '_blank';
        link.download = `拓展流量词.xls`;
        link.click();
    };
    return (
        <div style={{ height: 'calc(100vh - 128px)' }} className="overflow-y-auto overflow-x-hidden">
            <SubCard
                sx={{ mb: 3 }}
                contentSX={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', p: '10px !important' }}
            >
                <div>
                    <span className="text-[#000c] font-[500]">关键词优化</span>&nbsp;
                    <span className="text-[#673ab7] font-[500]">- 拓展关键词</span>
                </div>
            </SubCard>
            <div className="flex justify-center bg-[#fff] py-[50px]">
                <div className="w-[990px]">
                    <div className="min-h-[44px] border border-solid border-[#673ab7] rounded">
                        <div className=" min-h-[42px] flex items-center flex-wrap flex-1">
                            <Select
                                bordered={false}
                                className="w-[110px]"
                                optionLabelProp="label"
                                value={queryAsin.market}
                                onChange={(market) => {
                                    setQueryAsin({
                                        ...queryAsin,
                                        market
                                    });
                                }}
                                options={[
                                    { label: '🇺🇸 美国站', value: 1 },
                                    { label: '🇯🇵 日本站', value: 6 },
                                    { label: '🇬🇧 英国站', value: 3 },
                                    { label: '🇩🇪 德国站', value: 4 },
                                    { label: '🇫🇷 法国站', value: 5 },
                                    { label: '🇮🇹 意大利', value: 35691 },
                                    { label: '🇪🇸 西班牙', value: 44551 },
                                    { label: '🇨🇦 加拿大', value: 7 },
                                    { label: '🇮🇳 印度站', value: 44571 }
                                ]}
                            ></Select>
                            <Select
                                bordered={false}
                                value={queryAsin.month}
                                onChange={(month) => {
                                    setQueryAsin({
                                        ...queryAsin,
                                        month
                                    });
                                }}
                                className="w-[110px]"
                                optionLabelProp="label"
                            >
                                {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22].map((item) => (
                                    <Option key={item} value={item === 1 ? '最近30天' : getPreviousMonthDate(item, true)}>
                                        {item === 1 ? '最近30天' : getPreviousMonthDate(item)}
                                    </Option>
                                ))}
                            </Select>
                            <Divider className="border-[#d8dadf]" type="vertical" />
                            {queryAsin.asinList.map((item: string, index: number) => (
                                <Tag
                                    key={index}
                                    color="#3e4757"
                                    className="my-[6px] mr-[10px] rounded-[15px] h-[30px] text-sm leading-[28px]"
                                    closable
                                    onClose={(e) => {
                                        e.preventDefault();
                                        handleClose(index);
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
                                placeholder="输入父(子)体ASIN(最多20个)，多个以空格区分，或直接从txt/Excel按列复制粘贴"
                            />
                        </div>
                    </div>
                    <div className="mt-[14px] flex items-center justify-end">
                        <p className="text-[13px] text-[#9fa3a8] mr-[5%]">
                            示例ASIN：
                            <span
                                onClick={() =>
                                    setQueryAsin({
                                        ...queryAsin,
                                        asinList: ['B098T9ZFB5', 'B09JW5FNVX', 'B0B71DH45N', 'B07MHHM31K', 'B08RYQR1CJ']
                                    })
                                }
                                className="ml-[10px border-b border-dashed border-[#9fa3a8] cursor-pointer hover:text-[#673ab7]"
                            >
                                B098T9ZFB5,B09JW5FNVX,B0B71DH45N,B07MHHM31K,B08RYQR1CJ
                            </span>
                        </p>
                        <Button
                            onClick={() => {
                                setQueryAsin({
                                    ...queryAsin,
                                    asinList: []
                                });
                            }}
                        >
                            清除
                        </Button>
                    </div>
                </div>

                <Button type="primary" onClick={getAsin} className="ml-[10px]">
                    立即查询
                </Button>
            </div>
            {type !== 0 && <ResultFilter filterTable={filterTable} type={type} getExtended={getExtended} />}
            {type !== 0 && (
                <TermTable
                    pageQuery={pageQuery}
                    queryAsin={queryAsin}
                    loading={loading}
                    total={total}
                    tableData={tableData}
                    setPageQuery={setPageQuery}
                    type={type}
                    getExtended={getExtended}
                    handleExport={handleExport}
                />
            )}
            {asinOpen && (
                <Modal open={asinOpen}>
                    <MainCard
                        style={{
                            position: 'absolute',
                            width: '600px',
                            top: '10%',
                            left: '50%',
                            transform: 'translate(-50%, 0)',
                            maxHeight: '80%',
                            overflow: 'auto',
                            outline: 0
                        }}
                        title="选择拓词方式"
                        content={false}
                        secondary={
                            <IconButton onClick={() => setAsinOpen(false)} size="large" aria-label="close modal">
                                <Close fontSize="small" />
                            </IconButton>
                        }
                    >
                        <CardContent>
                            <div className="mb-[40px] text-[#7b7e81] text-[13px] px-[40px] text-center">
                                主人~ 为了帮助您拓展更多流量词，请选择需要的拓词方式查询哦！{' '}
                            </div>
                            <div className="flex justify-between items-center px-[80px]">
                                <div>
                                    使用<span className="font-[600] text-[#2a2b2c]"> 全部变体 </span>
                                    拓词，获取流量词数：
                                </div>
                                <div
                                    onClick={() => {
                                        setType(1);
                                        getExtended(1);
                                    }}
                                    className="text-[#673ab7] font-[600] cursor-pointer border-b border-dashed border-[#2a2b2c]"
                                >
                                    {asinData?.variationResults}
                                </div>
                            </div>
                            <div className="flex justify-between items-center px-[80px] my-[10px]">
                                <div>
                                    使用<span className="font-[600] text-[#2a2b2c]"> 畅销变体 </span>
                                    拓词，获取流量词数：
                                </div>
                                <div
                                    onClick={() => {
                                        setType(2);
                                        getExtended(2);
                                    }}
                                    className="text-[#673ab7] font-[600] cursor-pointer border-b border-dashed border-[#2a2b2c]"
                                >
                                    {asinData?.diamondResults}
                                </div>
                            </div>
                            <div className="flex justify-between items-center px-[80px]">
                                <div>
                                    使用<span className="font-[600] text-[#2a2b2c]"> 当前变体 </span>
                                    拓词，获取流量词数：
                                </div>
                                <div
                                    onClick={() => {
                                        setType(3);
                                        getExtended(3);
                                    }}
                                    className="text-[#673ab7] font-[600] cursor-pointer border-b border-dashed border-[#2a2b2c]"
                                >
                                    {asinData?.results}
                                </div>
                            </div>
                            <div className="mt-[60px] flex justify-between">
                                <Button
                                    type="primary"
                                    onClick={() => {
                                        setType(1);
                                        getExtended(1);
                                    }}
                                >
                                    用全部变体拓词({asinData?.variationResults})
                                </Button>
                                <Button
                                    type="primary"
                                    onClick={() => {
                                        setType(2);
                                        getExtended(2);
                                    }}
                                >
                                    用畅销变体拓词({asinData?.diamondResults})
                                </Button>
                                <Button
                                    type="primary"
                                    onClick={() => {
                                        setType(3);
                                        getExtended(3);
                                    }}
                                >
                                    用当前变体拓词({asinData?.results})
                                </Button>
                            </div>
                        </CardContent>
                    </MainCard>
                </Modal>
            )}
        </div>
    );
};
export default TermSearch;
