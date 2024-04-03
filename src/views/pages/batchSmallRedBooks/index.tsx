import { useState, useEffect, useRef } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { CardContent, IconButton } from '@mui/material';
import { KeyboardBackspace } from '@mui/icons-material';
import { Row, Col, Collapse, Spin } from 'antd';
import { getContentPage } from 'api/redBook';
import { planCreate, planGet, planModify, planExecute, batchPages } from 'api/redBook/batchIndex';
import SubCard from 'ui-component/cards/SubCard';
import MainCard from 'ui-component/cards/MainCard';
import { dispatch } from 'store';
import { openSnackbar } from 'store/slices/snackbar';
import _ from 'lodash-es';
import { v4 as uuidv4 } from 'uuid';
import { DetailModal } from '../redBookContentList/component/detailModal';
import './index.scss';
import Left from './components/left';
import Right from './components/right';
import Goods from './good';
import dayjs from 'dayjs';
const BatcSmallRedBooks = () => {
    const location = useLocation();
    const navigate = useNavigate();
    const searchParams = new URLSearchParams(location.search);
    const timer: any = useRef([]);
    //1.批量上传图片素材
    const [imageList, setImageList] = useState<any[]>([]);
    const uidRef = useRef('');
    const setDetail = (result: any) => {
        const res = _.cloneDeep(result);
        setDetailData({
            ...res.configuration,
            total: res.total,
            randomType: res.randomType,
            status: res.status,
            name: res.name,
            targetKeys: res.configuration?.schemeUid,
            tags: res.tags || []
        });
        schemeRef.current = res.configuration?.variableList ? res.configuration?.variableList : [];
        setSchemeList(schemeRef.current);
        if (res.configuration?.creativeMaterialList?.findIndex((item: any) => item.type === 'picture') !== -1) {
            setImageList(
                res.configuration?.creativeMaterialList?.map((item: any) => {
                    return {
                        uid: uuidv4(),
                        thumbUrl: item?.pictureUrl,
                        response: {
                            data: {
                                url: item?.pictureUrl
                            }
                        }
                    };
                })
            );
        }
    };

    //批次分页
    const batchPage = { page: 1, pageSize: 100 };
    const [batchUid, setBatchUid] = useState('');
    const [bathList, setBathList] = useState<any[]>([]);
    const [batchOpen, setbatchOpen] = useState(false);
    //编辑获列表
    useEffect(() => {
        if (searchParams.get('uid')) {
            planGet(searchParams.get('uid')).then((result) => {
                if (result) {
                    setDetail(result);
                    batchPages({ ...batchPage, planUid: searchParams.get('uid') }).then((res) => {
                        setBathList(res.list);
                    });
                }
            });
        }
    }, []);
    //关闭页面清除定时器
    useEffect(() => {
        return () => {
            timer.current?.map((item: any) => {
                clearInterval(item);
            });
        };
    }, []);
    //基础数据
    const [detailData, setDetailData] = useState<any>({
        randomType: 'RANDOM',
        total: 5
    });
    const [exedisabled, setExeDisabled] = useState(false);
    const handleSave = async ({ flag, newData, tableData }: { flag: boolean; newData: any; tableData: any[] }) => {
        if (flag) {
            setExeDisabled(true);
            plabListRef.current = [];
            setPlanList(plabListRef.current);
        }
        if (searchParams.get('uid')) {
            try {
                const res = await planModify({
                    name: newData?.name,
                    randomType: newData.randomType,
                    total: newData.total,
                    tags: newData?.tags,
                    configuration: {
                        ...newData,
                        creativeMaterialList: tableData,
                        total: undefined,
                        randomType: undefined,
                        imageStyleList: undefined,
                        name: undefined,
                        tags: undefined,
                        targetKeys: undefined,
                        variableList: schemeRef.current
                    },
                    type: 'XHS',

                    uid: searchParams.get('uid')
                });
                uidRef.current = res;
                dispatch(
                    openSnackbar({
                        open: true,
                        message: '编辑成功',
                        variant: 'alert',
                        alert: {
                            color: 'success'
                        },
                        anchorOrigin: { vertical: 'top', horizontal: 'center' },
                        transition: 'SlideDown',
                        close: false
                    })
                );
                if (flag) {
                    planExecute({ uid: searchParams.get('uid') })
                        .then((res) => {
                            batchPages({ ...batchPage, planUid: searchParams.get('uid') }).then((res) => {
                                setBathList(res.list);
                                setExeDisabled(false);
                            });
                        })
                        .catch((err) => {
                            batchPages({ ...batchPage, planUid: searchParams.get('uid') }).then((res) => {
                                setBathList(res.list);
                                setExeDisabled(false);
                            });
                        });
                }
            } catch (err) {
                setExeDisabled(false);
            }
        } else {
            try {
                const res = await planCreate({
                    name: newData?.name,
                    randomType: newData.randomType,
                    total: newData.total,
                    tags: newData?.tags,
                    configuration: {
                        ...newData,
                        creativeMaterialList: tableData,
                        total: undefined,
                        randomType: undefined,
                        imageStyleList: undefined,
                        name: undefined,
                        tags: undefined,
                        targetKeys: undefined,
                        variableList: schemeRef.current
                    },
                    type: 'XHS'
                });
                uidRef.current = res;
                dispatch(
                    openSnackbar({
                        open: true,
                        message: '创建成功',
                        variant: 'alert',
                        alert: {
                            color: 'success'
                        },
                        anchorOrigin: { vertical: 'top', horizontal: 'center' },
                        transition: 'SlideDown',
                        close: false
                    })
                );
                navigate('/batchSmallRedBook?uid=' + res);
                if (flag) {
                    planExecute({ uid: res })
                        .then((result) => {
                            batchPages({ ...batchPage, planUid: searchParams.get('uid') }).then((res) => {
                                setBathList(res.list);
                                setExeDisabled;
                            });
                        })
                        .catch((err) => {
                            batchPages({ ...batchPage, planUid: searchParams.get('uid') }).then((res) => {
                                setBathList(res.list);
                                setExeDisabled(false);
                            });
                        });
                }
            } catch (err) {
                setExeDisabled(false);
            }
        }
    };
    //页面滚动

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
            batch: batch || batchUid,
            planUid: searchParams.get('uid') || uidRef.current
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
            batch: batch || batchUid,
            planUid: searchParams.get('uid') || uidRef.current
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
                        ?.every((item: any) => item?.pictureStatus !== 'executing' && item?.pictureStatus !== 'init')
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
            if (bathList?.find((item) => item.batch == e[0])?.status === 'SUCCESS') {
                getList(e[0]);
            } else {
                getList(e[0]);
                timer.current[0] = setInterval(() => {
                    if (
                        plabListRef.current?.length === 0 ||
                        plabListRef.current.slice(0, 20)?.every((item: any) => {
                            return item?.pictureStatus !== 'executing' && item?.pictureStatus !== 'init';
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
            const bathId = bathList[0].batch;
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
            if (bathList?.find((item) => item.batch == bathId)?.status === 'SUCCESS') {
                getList(bathId);
            } else {
                getList(bathId);
                timer.current[0] = setInterval(() => {
                    console.log(plabListRef.current?.length);
                    console.log(
                        plabListRef.current
                            .slice(0, 20)
                            ?.every((item: any) => item?.pictureStatus !== 'executing' && item?.pictureStatus !== 'init')
                    );

                    if (
                        plabListRef.current?.length === 0 ||
                        plabListRef.current.slice(0, 20)?.every((item: any) => {
                            return item?.pictureStatus !== 'executing' && item?.pictureStatus !== 'init';
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
    //变量
    const [schemesList, setSchemeList] = useState<any[]>([]);
    const schemeRef: any = useRef(null);

    const [detailOpen, setDetailOpen] = useState(false);
    const [businessUid, setBusinessUid] = useState('');

    return (
        <MainCard content={false}>
            <CardContent className="pb-[72px] !px-4 !pt-4">
                <SubCard contentSX={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', p: '10px !important' }}>
                    <div>
                        <IconButton onClick={() => navigate('/redBookTaskList')} color="secondary">
                            <KeyboardBackspace fontSize="small" />
                        </IconButton>
                        <span className="text-[#000c] font-[500]">创作计划</span>&nbsp;
                        <span className="text-[#673ab7] font-[500]">- {!searchParams.get('uid') ? '新建创作计划' : '编辑创作计划'}</span>
                    </div>
                    <div></div>
                </SubCard>
                <Row gutter={20} className="!ml-0">
                    <Col span={6} className="relative h-full bg-[#fff] !px-[0]">
                        <Left
                            detailData={detailData}
                            setDetailData={setDetailData}
                            imageList={imageList}
                            setImageList={setImageList}
                            schemesList={schemesList}
                            setSchemeLists={(data: any) => {
                                schemeRef.current = data;
                                setSchemeList(schemeRef.current);
                            }}
                            exedisabled={exedisabled}
                            handleSave={(flag: any) => handleSave(flag)}
                        />
                    </Col>
                    <Col span={18} className="overflow-hidden mt-4">
                        <Right
                            bathList={bathList}
                            collapseActive={collapseActive}
                            batchOpen={batchOpen}
                            changeCollapse={(data: any) => changeCollapse(data)}
                            planList={planList}
                            setBusinessUid={(data: any) => setBusinessUid(data)}
                            setDetailOpen={(data: any) => setDetailOpen(data)}
                            handleScroll={(data: any) => handleScroll(data)}
                            timeFailure={(index: number) => {
                                const pageNo = Number((index / 20).toFixed(0)) + 1;
                                clearInterval(timer.current[pageNo]);
                                timer.current[pageNo] = getLists(pageNo);
                            }}
                        />
                    </Col>
                </Row>
                {detailOpen && <DetailModal open={detailOpen} handleClose={() => setDetailOpen(false)} businessUid={businessUid} />}
            </CardContent>
        </MainCard>
    );
};
export default BatcSmallRedBooks;
