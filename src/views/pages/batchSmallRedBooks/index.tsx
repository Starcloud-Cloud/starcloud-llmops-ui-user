import { useState, useEffect, useRef } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { IconButton } from '@mui/material';
import { KeyboardBackspace } from '@mui/icons-material';
import { getContentPage } from 'api/redBook';
import { planExecute, batchPages, getListExample } from 'api/redBook/batchIndex';
import SubCard from 'ui-component/cards/SubCard';
import { dispatch } from 'store';
import { openSnackbar } from 'store/slices/snackbar';
import _ from 'lodash-es';
import { DetailModal } from '../redBookContentList/component/detailModal';
import './index.scss';
import Left from './components/newLeft';
import Right from './components/right';
import jsCookie from 'js-cookie';
const BatcSmallRedBooks = () => {
    const navigate = useNavigate();
    const timer: any = useRef([]);

    //批次分页
    const batchPage = { pageNo: 1, pageSize: 100 };
    const [batchUid, setBatchUid] = useState('');
    const [bathList, setBathList] = useState<any[]>([]);
    const [batchOpen, setbatchOpen] = useState(false);
    //手风琴的数据
    const [collData, setCollData] = useState([]);
    //监听手风琴有值的时候请求数据
    useEffect(() => {
        if (collData?.length != 0) {
            getListExample(collData).then((res) => {
                setExampleList(res);
            });
        }
    }, [collData]);
    //关闭页面清除定时器
    useEffect(() => {
        return () => {
            timer.current?.map((item: any) => {
                clearInterval(item);
            });
        };
    }, []);
    // const handleSave = async ({ flag, newData, tableData }: { flag: boolean; newData: any; tableData: any[] }) => {
    //     if (flag) {
    //         setExeDisabled(true);
    //         plabListRef.current = [];
    //         setPlanList(plabListRef.current);
    //     }
    //     if (searchParams.get('uid')) {
    //         try {
    //             const res = await planModify({
    //                 name: newData?.name,
    //                 randomType: newData.randomType,
    //                 total: newData.total,
    //                 tags: newData?.tags,
    //                 configuration: {
    //                     ...newData,
    //                     creativeMaterialList: tableData,
    //                     total: undefined,
    //                     randomType: undefined,
    //                     imageStyleList: undefined,
    //                     name: undefined,
    //                     tags: undefined,
    //                     targetKeys: undefined,
    //                     variableList: schemeRef.current
    //                 },
    //                 type: 'XHS',

    //                 uid: searchParams.get('uid')
    //             });
    //             uidRef.current = res;
    //             dispatch(
    //                 openSnackbar({
    //                     open: true,
    //                     message: '编辑成功',
    //                     variant: 'alert',
    //                     alert: {
    //                         color: 'success'
    //                     },
    //                     anchorOrigin: { vertical: 'top', horizontal: 'center' },
    //                     transition: 'SlideDown',
    //                     close: false
    //                 })
    //             );
    //             if (flag) {
    //                 planExecute({ uid: searchParams.get('uid') })
    //                     .then((res) => {
    //                         batchPages({ ...batchPage, planUid: searchParams.get('uid') }).then((res) => {
    //                             setBathList(res.list);
    //                             setExeDisabled(false);
    //                         });
    //                     })
    //                     .catch((err) => {
    //                         batchPages({ ...batchPage, planUid: searchParams.get('uid') }).then((res) => {
    //                             setBathList(res.list);
    //                             setExeDisabled(false);
    //                         });
    //                     });
    //             }
    //         } catch (err) {
    //             setExeDisabled(false);
    //         }
    //     } else {
    //         try {
    //             const res = await planCreate({
    //                 name: newData?.name,
    //                 randomType: newData.randomType,
    //                 total: newData.total,
    //                 tags: newData?.tags,
    //                 configuration: {
    //                     ...newData,
    //                     creativeMaterialList: tableData,
    //                     total: undefined,
    //                     randomType: undefined,
    //                     imageStyleList: undefined,
    //                     name: undefined,
    //                     tags: undefined,
    //                     targetKeys: undefined,
    //                     variableList: schemeRef.current
    //                 },
    //                 type: 'XHS'
    //             });
    //             uidRef.current = res;
    //             dispatch(
    //                 openSnackbar({
    //                     open: true,
    //                     message: '创建成功',
    //                     variant: 'alert',
    //                     alert: {
    //                         color: 'success'
    //                     },
    //                     anchorOrigin: { vertical: 'top', horizontal: 'center' },
    //                     transition: 'SlideDown',
    //                     close: false
    //                 })
    //             );
    //             navigate('/batchSmallRedBook?uid=' + res);
    //             if (flag) {
    //                 planExecute({ uid: res })
    //                     .then((result) => {
    //                         batchPages({ ...batchPage, planUid: searchParams.get('uid') }).then((res) => {
    //                             setBathList(res.list);
    //                             setExeDisabled;
    //                         });
    //                     })
    //                     .catch((err) => {
    //                         batchPages({ ...batchPage, planUid: searchParams.get('uid') }).then((res) => {
    //                             setBathList(res.list);
    //                             setExeDisabled(false);
    //                         });
    //                     });
    //             }
    //         } catch (err) {
    //             setExeDisabled(false);
    //         }
    //     }
    // };
    const [pre, setPre] = useState(0);
    const newSave = async (uid: string) => {
        await planExecute({ uid });
        setPre(pre + 1);
        dispatch(
            openSnackbar({
                open: true,
                message: '执行成功',
                variant: 'alert',
                alert: {
                    color: 'success'
                },
                anchorOrigin: { vertical: 'top', horizontal: 'center' },
                close: false
            })
        );
        const res = await batchPages({ ...batchPage, planUid: uid });
        setBathList(res.list);
    };

    //页面滚动
    const [exampleList, setExampleList] = useState<any[]>([]);
    const [total, setTotal] = useState(0);
    const [planList, setPlanList] = useState<any[]>([]);
    const plabListRef: any = useRef(null);
    const [queryPage, setQueryPage] = useState({
        pageNo: 1,
        pageSize: 20
    });
    const queryRef: any = useRef({ pageNo: 1, pageSize: 20 });
    const handleScroll = (current: any) => {
        if (current) {
            if (
                current.scrollHeight - current.scrollTop === current.clientHeight &&
                queryRef.current.pageNo * queryRef.current.pageSize < total
            ) {
                queryRef.current = {
                    pageNo: queryRef.current.pageNo + 1,
                    pageSize: queryRef.current.pageSize
                };
                setQueryPage(queryRef.current);
            }
        }
    };
    const getList = (batch?: string) => {
        getContentPage({
            ...queryRef.current,
            batchUid: batch || batchUid
        }).then((res) => {
            setTotal(res.total);
            plabListRef.current = [...plabListRef.current, ...res.list];
            setPlanList(plabListRef.current);
            setbatchOpen(false);
        });
    };
    const getLists = (pageNo: number, batch?: string) => {
        getContentPage({
            ...queryRef.current,
            pageNo,
            batchUid: batch || batchUid
        }).then((res) => {
            setTotal(res.total);
            const newList = _.cloneDeep(plabListRef.current);
            newList.splice((queryRef.current.pageNo - 1) * queryRef.current.pageSize, queryRef.current.pageSize, ...res.list);
            plabListRef.current = newList;
            setPlanList(plabListRef.current);
            setbatchOpen(false);
        });
    };
    useEffect(() => {
        if (queryPage.pageNo > 1) {
            getList();
            timer.current[queryPage.pageNo - 1] = setInterval(() => {
                if (
                    plabListRef.current
                        .slice((queryPage.pageNo - 1) * queryPage.pageSize, queryPage.pageNo * queryPage.pageSize)
                        ?.every((item: any) => item?.status !== 'EXECUTING' && item?.status !== 'INIT' && item?.status !== 'FAILURE')
                ) {
                    clearInterval(timer.current[queryPage.pageNo - 1]);
                    return;
                }
                getLists(queryPage.pageNo);
            }, 2000);
        }
    }, [queryPage.pageNo]);
    const [collapseActive, setcollapseActive] = useState<any[]>([]);
    //手风琴的开关
    const changeCollapse = (e: any) => {
        setcollapseActive(e);
        timer.current?.map((item: any) => {
            clearInterval(item);
        });
        timer.current = [];
        plabListRef.current = [];

        if (e.length > 0) {
            setbatchOpen(true);
            queryRef.current = {
                pageNo: 1,
                pageSize: 20
            };
            setQueryPage(queryRef.current);
            setBatchUid(e[0]);
            if (bathList?.find((item) => item.uid == e[0])?.status === 'SUCCESS') {
                getList(e[0]);
            } else {
                getList(e[0]);
                timer.current[0] = setInterval(() => {
                    if (
                        plabListRef.current?.length === 0 ||
                        plabListRef.current.slice(0, 20)?.every((item: any) => {
                            return item?.status !== 'EXECUTING' && item?.status !== 'INIT' && item?.status !== 'FAILURE';
                        })
                    ) {
                        clearInterval(timer.current[0]);
                        return;
                    }
                    getLists(1, e[0]);
                }, 2000);
            }
        }
    };
    useEffect(() => {
        if (bathList?.length !== 0) {
            const bathId = bathList[0].uid;
            setcollapseActive([bathId]);
            timer.current?.map((item: any) => {
                clearInterval(item);
            });
            timer.current = [];
            plabListRef.current = [];
            // setPlanList([]);
            setbatchOpen(true);
            queryRef.current = {
                pageNo: 1,
                pageSize: 20
            };
            setQueryPage(queryRef.current);
            setBatchUid(bathId);
            if (bathList?.find((item) => item.uid == bathId)?.status === 'SUCCESS') {
                getList(bathId);
            } else {
                getList(bathId);
                timer.current[0] = setInterval(() => {
                    if (
                        plabListRef.current?.length === 0 ||
                        plabListRef.current.slice(0, 20)?.every((item: any) => {
                            return item?.status !== 'EXECUTING' && item?.status !== 'INIT' && item?.status !== 'FAILURE';
                        })
                    ) {
                        clearInterval(timer.current[0]);
                        return;
                    }
                    getLists(1, bathId);
                }, 2000);
            }
        }
    }, [bathList]);

    const [detailOpen, setDetailOpen] = useState(false);
    const [businessUid, setBusinessUid] = useState('');
    const [businessIndex, setBusinessIndex] = useState(0);
    const changeList = () => {
        const pageNo = Number((businessIndex / 20).toFixed(0)) + 1;
        getLists(pageNo);
    };
    //编辑获列表
    const [PlanUid, setPlanUid] = useState('');
    useEffect(() => {
        if (PlanUid) {
            batchPages({ ...batchPage, planUid: PlanUid }).then((res) => {
                setBathList(res.list);
            });
        }
    }, [PlanUid]);
    return (
        <div
            style={{
                height: jsCookie.get('isClient') ? '100vh' : '100%'
            }}
            className="bg-[rgb(244,246,248)] h-full md:min-w-[1052px] lg:min-w-[1152px] overflow-y-hidden overflow-x-auto"
        >
            <SubCard
                contentSX={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    p: '10px !important'
                }}
            >
                <div>
                    <IconButton onClick={() => navigate('/appMarket')} color="secondary">
                        <KeyboardBackspace fontSize="small" />
                    </IconButton>
                    <span className="text-[#000c] font-[500]">应用市场</span>
                </div>
                <div></div>
            </SubCard>
            <div className="flex gap-[20px] mt-4 h-[calc(100%-74px)]">
                <div className="2xl:w-[500px] xl:w-[410px] lg:w-[410px]  w-[410px] bg-white rounded-lg p-4">
                    <Left pre={pre} setCollData={setCollData} newSave={newSave} setPlanUid={setPlanUid} />
                </div>
                <div className="flex-1 min-w-[650px] bg-white rounded-lg p-4 h-full overflow-y-auto">
                    <Right
                        bathList={bathList}
                        exampleList={exampleList}
                        collapseActive={collapseActive}
                        batchOpen={batchOpen}
                        changeCollapse={(data: any) => changeCollapse(data)}
                        planList={planList}
                        setBusinessUid={(data: any) => {
                            setBusinessUid(data.uid);
                            setBusinessIndex(data.index);
                        }}
                        setDetailOpen={(data: any) => setDetailOpen(data)}
                        handleScroll={(data: any) => handleScroll(data)}
                        timeFailure={(index: number) => {
                            const pageNo = Number((index / 20).toFixed(0)) + 1;
                            clearInterval(timer.current[pageNo]);
                            timer.current[pageNo] = getLists(pageNo);
                            timer.current[pageNo] = setInterval(() => {
                                if (
                                    plabListRef.current
                                        .slice((pageNo - 1) * queryPage.pageSize, pageNo * queryPage.pageSize)
                                        ?.every(
                                            (item: any) =>
                                                item?.status !== 'EXECUTING' && item?.status !== 'INIT' && item?.status !== 'FAILURE'
                                        )
                                ) {
                                    clearInterval(timer.current[pageNo]);
                                    return;
                                }
                                getLists(pageNo);
                            }, 2000);
                        }}
                    />
                </div>
            </div>

            {detailOpen && (
                <DetailModal open={detailOpen} changeList={changeList} handleClose={() => setDetailOpen(false)} businessUid={businessUid} />
            )}
        </div>
    );
};
export default BatcSmallRedBooks;
