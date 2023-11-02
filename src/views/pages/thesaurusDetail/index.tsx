import { Button, Select, Divider, Tag, Input, Popover } from 'antd';
import { QuestionCircleOutlined } from '@ant-design/icons';
import { Modal, IconButton, CardContent } from '@mui/material';
import SubCard from 'ui-component/cards/SubCard';
import { Close } from '@mui/icons-material';
import MainCard from 'ui-component/cards/MainCard';
import { useEffect, useState } from 'react';
import ResultFilter from './component/resultFilter';
import TermTable from './component/termTable';
import { KeywordMetadataExtendPrepare, KeywordMetadataExtendAsin, KeywordMetadataPage } from 'api/listing/termSerch';

const ThesaurusDetail = () => {
    const { Option } = Select;
    const handleClose = (removedTag: string) => {
        const newTags = queryAsin.asinList.filter((tag: string) => tag !== removedTag);
        setQueryAsin({
            ...queryAsin,
            asinList: newTags
        });
    };
    const [value, setValue] = useState('');

    //获取拓ASIN
    const [asinOpen, setAsinOpen] = useState(false);
    const [queryAsin, setQueryAsin] = useState<any>({
        month: '最近30天',
        market: 1,
        asinList: ['B098T9ZFB5', 'B09JW5FNVX', 'B0B71DH45N', 'B07MHHM31K', 'B08RYQR1CJ']
    });
    const [asinData, setAsinData] = useState<any>({});
    const getAsin = async () => {
        const result = await KeywordMetadataExtendPrepare({
            ...queryAsin,
            month: queryAsin.month === '最近30天' ? '' : queryAsin.month
        });
        setAsinData(result);
        setAsinOpen(true);
    };
    useEffect(() => {
        getAsin();
    }, []);

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
    return (
        <div style={{ height: 'calc(100vh - 128px)' }} className="overflow-y-auto overflow-x-hidden">
            <SubCard
                sx={{ mb: 3 }}
                contentSX={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', p: '10px !important' }}
            >
                <div>
                    <span className="text-[#000c] font-[500]">关键词优化</span>&nbsp;
                    <span className="text-[#673ab7] font-[500]">- 关键词词库</span>
                </div>
            </SubCard>

            <ResultFilter filterTable={filterTable} type={type} getExtended={getExtended} />
            <TermTable
                pageQuery={pageQuery}
                queryAsin={queryAsin}
                loading={loading}
                total={total}
                tableData={tableData}
                setPageQuery={setPageQuery}
                type={type}
                getExtended={getExtended}
            />
        </div>
    );
};
export default ThesaurusDetail;
