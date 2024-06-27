import { useState, useEffect, useRef, forwardRef, useImperativeHandle } from 'react';
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
import { MoreOutlined, SwapOutlined } from '@ant-design/icons';
import { marketDeatail } from 'api/template';
const BatcSmallRedBooks = forwardRef(
    (
        {
            planState,
            changePre,
            getAppList,
            detail,
            isMyApp,
            isblack,
            setDetail
        }: {
            planState: number;
            changePre?: number;
            getAppList: () => void;
            detail?: any;
            isMyApp?: boolean;
            isblack?: boolean;
            setDetail: (data: any, fieldShow?: boolean) => void;
        },
        ref
    ) => {
        useImperativeHandle(ref, () => ({
            getDetail: getData,
            moke: moke,
            imageMoke: imageMoke, //图片
            mokeAI: defaultVariableData, //批量生成
            fieldAI: defaultField, //字段补齐
            fieldHead: fieldHead //上传素材表头
        }));
        const [appDescription, setAppDescription] = useState('');

        const [defaultVariableData, setDefaultVariableData] = useState<any>(null);
        const [defaultField, setDefaultField] = useState<any>(null);
        const [getData, setGetData] = useState<any>(null);
        const [fieldHead, setFieldHead] = useState(null);
        const [moke, setMoke] = useState<any[]>([]);
        const [imageMoke, setImageMoke] = useState<any[]>([]);
        const navigate = useNavigate();
        const timer: any = useRef([]);
        //批次分页
        const [batchPage, setBatchPage] = useState({ pageNo: 1, pageSize: 10 });
        const [batchTotal, setBatchTotal] = useState(0);
        const [batchUid, setBatchUid] = useState('');
        const [bathList, setBathList] = useState<any[]>([]);
        const [batchOpen, setbatchOpen] = useState(false);
        //手风琴的数据
        const [collData, setCollData] = useState([]);

        const location = useLocation();
        const searchParams = new URLSearchParams(location.search);
        useEffect(() => {
            (async () => {
                if (!searchParams.get('appUid')) {
                    return false;
                }
                const res = await marketDeatail({ uid: searchParams.get('appUid') });
                if (res.description) {
                    const urlPattern = /https?:\/\/[^\s]+(?:\.com|\.cn|\.org|\.net|\.edu\.com.cn)/g;
                    const urls = res?.description?.match(urlPattern);
                    setAppDescription(urls?.[0] || '');
                }
            })();
        }, []);

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
        const [pre, setPre] = useState(0);
        const [rightPage, setRightPage] = useState(0);
        const collIndexRef = useRef(0);
        const [collIndex, setCollIndex] = useState(0);
        const newSave = async (uid: string) => {
            timer.current?.map((item: any) => {
                clearInterval(item);
            });
            batchOpenRef.current = true;
            setBathOpen(batchOpenRef.current);
            await planExecute({ uid });
            const res = await batchPages({ batchPage, planUid: uid });
            setRightPage(rightPage + 1);
            setBathList(res.list);
            setBatchTotal(res.total);
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
        };
        //页面滚动
        const [exampleList, setExampleList] = useState<any[]>([]);
        const queryPage = {
            pageNo: 1,
            pageSize: 40
        };
        const getList = (batch?: string) => {
            getContentPage({
                ...queryPage,
                batchUid: batch || batchUid
            }).then((res) => {
                const newList = _.cloneDeep(batchDataListRef.current);
                newList[collIndexRef.current] = res.list;
                batchDataListRef.current = newList;
                setBatchDataList(batchDataListRef.current);
                setTimeout(() => {
                    setbatchOpen(false);
                }, 500);
            });
        };
        const getLists = (pageNo: number, batch?: string) => {
            getContentPage({
                ...queryPage,
                pageNo,
                batchUid: batch || batchUid
            }).then((res) => {
                const result = res?.list?.every((item: any) => {
                    return item?.status !== 'EXECUTING' && item?.status !== 'INIT' && item?.status !== 'FAILURE';
                });
                if (result) {
                    batchPages({ pageNo: (collIndex / 10) | (0 + 1), pageSize: 10, planUid: PlanUid }).then((res) => {
                        const newList = _.cloneDeep(bathList);
                        newList?.splice(((collIndex / 10) | 0) * 10, (((collIndex / 10) | 0) + 1) * 10, ...res.list);
                        setBathList(newList);
                        setBatchTotal(res.total);
                    });
                }
                const newList = _.cloneDeep(batchDataListRef.current);
                newList[collIndexRef.current] = res.list;
                console.log(newList, collIndexRef.current);

                batchDataListRef.current = newList;
                setBatchDataList(batchDataListRef.current);
                setbatchOpen(false);
            });
        };
        const [collapseActive, setcollapseActive] = useState<any[]>([]);
        //手风琴的开关
        const changeCollapse = (e: any) => {
            timer.current?.map((item: any) => {
                clearInterval(item);
            });
            timer.current = [];
            if (e.length > 0) {
                const newList = _.cloneDeep(batchDataListRef.current);
                const index = bathList?.findIndex((item: any) => item.uid === e[0]);
                collIndexRef.current = index;
                setCollIndex(collIndexRef.current);
                if (newList[index] && newList[index]?.length > 0) {
                    setcollapseActive(e);
                    timer.current[0] = setInterval(() => {
                        if (
                            batchDataListRef.current[collIndexRef.current]?.length === 0 ||
                            batchDataListRef.current[collIndexRef.current]?.slice(0, 20)?.every((item: any) => {
                                return item?.status !== 'EXECUTING' && item?.status !== 'INIT' && item?.status !== 'FAILURE';
                            })
                        ) {
                            clearInterval(timer.current[0]);
                            batchOpenRef.current = false;
                            setBathOpen(batchOpenRef.current);
                            setPre(pre + 1);
                            return;
                        }
                        getLists(1, e[0]);
                    }, 2000);
                } else {
                    setcollapseActive(e);
                    setbatchOpen(true);
                    setBatchUid(e[0]);
                    if (bathList?.find((item) => item.uid == e[0])?.status === 'SUCCESS') {
                        getList(e[0]);
                    } else {
                        getList(e[0]);
                        timer.current[0] = setInterval(() => {
                            if (
                                batchDataListRef.current[collIndexRef.current]?.length === 0 ||
                                batchDataListRef.current[collIndexRef.current]?.slice(0, 20)?.every((item: any) => {
                                    return item?.status !== 'EXECUTING' && item?.status !== 'INIT' && item?.status !== 'FAILURE';
                                })
                            ) {
                                clearInterval(timer.current[0]);
                                batchOpenRef.current = false;
                                setBathOpen(batchOpenRef.current);
                                setPre(pre + 1);
                                return;
                            }
                            getLists(1, e[0]);
                        }, 2000);
                    }
                }
            } else {
                setcollapseActive(e);
            }
        };
        const batchOpenRef = useRef(true);
        const [bathOpen, setBathOpen] = useState(true);
        useEffect(() => {
            if (bathList?.length !== 0 && batchOpenRef.current) {
                collIndexRef.current = 0;
                setCollIndex(collIndexRef.current);
                const newList = _.cloneDeep(batchDataListRef.current);
                newList.unshift(undefined);
                batchDataListRef.current = newList;
                setBatchDataList(batchDataListRef.current);
                const bathId = bathList[0].uid;
                setcollapseActive([bathId]);
                setbatchOpen(true);
                setBatchUid(bathId);
                if (bathList?.find((item) => item.uid == bathId)?.status === 'SUCCESS') {
                    getList(bathId);
                } else {
                    getList(bathId);
                    timer.current[0] = setInterval(() => {
                        if (
                            batchDataListRef.current[collIndexRef.current]?.length === 0 ||
                            batchDataListRef.current[collIndexRef.current]?.slice(0, 20)?.every((item: any) => {
                                return item?.status !== 'EXECUTING' && item?.status !== 'INIT' && item?.status !== 'FAILURE';
                            })
                        ) {
                            clearInterval(timer.current[0]);
                            setPre(pre + 1);
                            return;
                        }
                        getLists(1, bathId);
                    }, 2000);
                }
                batchOpenRef.current = false;
                setBathOpen(batchOpenRef.current);
            }
        }, [bathList]);

        const [detailOpen, setDetailOpen] = useState(false);
        const [businessUid, setBusinessUid] = useState('');
        const [businessIndex, setBusinessIndex] = useState(0);
        const changeList = (data: string) => {
            console.log(data, batchDataListRef.current);
            let index = -1;
            batchDataListRef.current?.map((item, d) => {
                item?.map((i: any) => {
                    if (i.uid === data) {
                        index = d;
                    }
                });
            });
            bathList?.findIndex((item: any) => item.uid === data);
            collIndexRef.current = index;
            setCollIndex(collIndexRef.current);
            const pageNo = Number((businessIndex / 20) | 0) + 1;
            getLists(pageNo);
        };
        //编辑获列表
        const [PlanUid, setPlanUid] = useState('');
        const getbatchPages = (data?: any) => {
            batchPages({ ...(data ? data : batchPage), planUid: PlanUid }).then((res) => {
                if (data) {
                    setBathList([...bathList, ...res.list]);
                } else {
                    setBathList(res.list);
                }
                setBatchTotal(res.total);
            });
        };
        useEffect(() => {
            if (PlanUid) {
                getbatchPages();
            }
        }, [PlanUid]);

        //批次号下的列表
        const batchDataListRef = useRef<any[]>([]);
        const [batchDataList, setBatchDataList] = useState<any[]>([]);
        const [leftWidth, setLeftWidth] = useState('');
        return (
            <div
                style={{
                    height: jsCookie.get('isClient') ? '100vh' : '100%'
                }}
                className="bg-[rgb(244,246,248)] h-full md:min-w-[1052px] lg:min-w-[1152px] overflow-y-hidden overflow-x-auto"
            >
                {isblack && (
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
                            {appDescription && (
                                <span
                                    className="2xl:ml-[430px] xl:ml-[340px] lg:ml-[300px]  ml-[300px] text-[#673ab7] cursor-pointer"
                                    onClick={() => {
                                        window.open(appDescription);
                                    }}
                                >
                                    应用说明
                                </span>
                            )}
                        </div>
                        <div></div>
                    </SubCard>
                )}
                <div
                    className="flex gap-[20px]"
                    style={{
                        height: detail ? '100%' : 'calc(100% - 58px)',
                        marginTop: detail ? 0 : '16px'
                    }}
                >
                    <div
                        style={{
                            width: leftWidth ? leftWidth : ''
                        }}
                        className={`duration-700 2xl:w-[500px] xl:w-[410px] lg:w-[370px] w-[370px] bg-white rounded-lg pl-2 pr-0`}
                    >
                        <Left
                            pre={pre}
                            isMyApp={isMyApp}
                            changePre={changePre}
                            planState={planState}
                            detail={detail}
                            setGetData={setGetData}
                            leftWidth={leftWidth}
                            setWidth={() => {
                                if (leftWidth) {
                                    setLeftWidth('');
                                } else {
                                    setLeftWidth('50%');
                                }
                            }}
                            getAppList={getAppList}
                            setFieldHead={setFieldHead}
                            setMoke={setMoke}
                            setImageMoke={setImageMoke}
                            setCollData={setCollData}
                            newSave={newSave}
                            setDetail={setDetail}
                            setPlanUid={setPlanUid}
                            defaultVariableData={defaultVariableData}
                            defaultField={defaultField}
                            fieldHead={fieldHead}
                            setDefaultVariableData={setDefaultVariableData}
                            setDefaultField={setDefaultField}
                        />
                    </div>
                    <div className="flex-1 min-w-[650px] bg-white rounded-lg p-4 h-full overflow-y-auto">
                        <Right
                            rightPage={rightPage}
                            batchTotal={batchTotal}
                            bathList={bathList}
                            exampleList={exampleList}
                            collapseActive={collapseActive}
                            batchOpen={batchOpen}
                            changeCollapse={(data: any) => changeCollapse(data)}
                            batchDataList={batchDataList}
                            setBusinessUid={(data: any) => {
                                setBusinessUid(data.uid);
                                setBusinessIndex(data.index);
                            }}
                            getbatchPages={getbatchPages}
                            setDetailOpen={(data: any) => setDetailOpen(data)}
                            timeFailure={({ i, index }: { i: number; index: number }) => {
                                collIndexRef.current = i;
                                setCollIndex(collIndexRef.current);
                                const pageNo = Number((index / 20) | 0) + 1;
                                clearInterval(timer.current[pageNo]);
                                timer.current[pageNo] = getLists(pageNo);
                                timer.current[pageNo] = setInterval(() => {
                                    if (
                                        batchDataListRef.current[collIndexRef.current]?.every(
                                            (item: any) =>
                                                item?.status !== 'EXECUTING' && item?.status !== 'INIT' && item?.status !== 'FAILURE'
                                        )
                                    ) {
                                        clearInterval(timer.current[pageNo]);
                                        setPre(pre + 1);
                                        return;
                                    }
                                    getLists(pageNo);
                                }, 2000);
                                batchOpenRef.current = false;
                                setBathOpen(batchOpenRef.current);
                            }}
                        />
                    </div>
                </div>
                {detailOpen && (
                    <DetailModal
                        open={detailOpen}
                        changeList={changeList}
                        handleClose={() => setDetailOpen(false)}
                        businessUid={businessUid}
                    />
                )}
            </div>
        );
    }
);
export default BatcSmallRedBooks;
