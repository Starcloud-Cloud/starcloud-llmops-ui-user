import SubCard from 'ui-component/cards/SubCard';
import { useEffect, useState } from 'react';
import ResultFilter from './component/resultFilter';
import TermTable from './component/termTable';
import { useLocation } from 'react-router-dom';
import { keywordPage } from 'api/listing/thesaurus';
import { AddKeywordDrawer } from './component/AddKeywordDrawer';

const containerStyle: React.CSSProperties = {
    position: 'relative',
    height: 'calc(100vh - 128px)'
};

const ThesaurusDetail = () => {
    const [addKeywordOpen, setAddKeywordOpen] = useState(false);
    const [uid, setUid] = useState('');
    const [searchResult, setSearchResult] = useState<any>(null);
    const [type, setType] = useState(0);
    const [total, setTotal] = useState(0);
    const [loading, setLoading] = useState(false);
    const [tableData, setTableData] = useState<any[]>([]);
    const [update, forceUpdate] = useState({});

    const location = useLocation();
    const searchParams = new URLSearchParams(location.search);
    const queryUid = searchParams.get('uid');

    // 初始fetch
    useEffect(() => {
        setUid(queryUid!);
    }, [queryUid]);

    const [pageQuery, setPageQuery] = useState({
        page: 1,
        size: 20,
        desc: true, //升降序
        orderColumn: 5 //排序的字段
    });

    useEffect(() => {
        if (uid) {
            getExtended();
        }
    }, [pageQuery.page, pageQuery.size, uid, update]);

    const getExtended = async (orderColumn?: number, desc?: boolean) => {
        setLoading(true);
        const data = {
            dictUid: searchResult?.uid || uid,
            ...pageQuery,
            ...searchResult,
            pageNo: pageQuery.page,
            pageSize: pageQuery.size
        };

        if (orderColumn && desc !== undefined) {
            data.orderColumn = orderColumn;
            data.desc = desc;
            setPageQuery((pre: any) => {
                return {
                    ...pre,
                    orderColumn,
                    desc
                };
            });
        }

        const result = await keywordPage(data);
        if (result.status === 'ANALYSIS') {
            forceUpdate({});
        }
        setLoading(false);
        setTotal(result.keywordMetadataResp.total);
        setTableData(result.keywordMetadataResp.list);
    };

    //结果筛选
    const filterTable = (data: any) => {
        if (JSON.stringify(data) === JSON.stringify(searchResult)) {
            if (pageQuery.page === 1) {
                getExtended();
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
                getExtended();
            } else {
                setPageQuery({
                    ...pageQuery,
                    page: 1
                });
            }
        }
    }, [searchResult]);

    return (
        <div className="overflow-y-auto" style={containerStyle}>
            <SubCard
                sx={{ mb: 3 }}
                contentSX={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', p: '10px !important' }}
            >
                <div>
                    <span className="text-[#000c] font-[500]">关键词优化</span>&nbsp;
                    <span className="text-[#673ab7] font-[500]">- 关键词词库</span>
                </div>
            </SubCard>

            <ResultFilter
                filterTable={filterTable}
                type={type}
                getExtended={getExtended}
                setAddKeywordOpen={setAddKeywordOpen}
                uid={uid}
                setUid={setUid}
            />
            <TermTable
                uid={uid}
                pageQuery={pageQuery}
                queryAsin={() => null}
                loading={loading}
                total={total}
                tableData={tableData}
                setPageQuery={setPageQuery}
                type={type}
                getExtended={getExtended}
            />
            {addKeywordOpen && (
                <AddKeywordDrawer open={addKeywordOpen} handleClose={() => setAddKeywordOpen(false)} uid={uid} forceUpdate={forceUpdate} />
            )}
        </div>
    );
};
export default ThesaurusDetail;
