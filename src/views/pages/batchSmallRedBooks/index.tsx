import { useState, useEffect, useRef, forwardRef, useImperativeHandle } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { IconButton } from '@mui/material';
import { KeyboardBackspace } from '@mui/icons-material';
import { Popconfirm, Tabs, Button, Badge, Tag, Tooltip, message } from 'antd';
import { InfoCircleOutlined } from '@ant-design/icons';
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
import { createSameApp } from 'api/redBook/batchIndex';
import { marketDeatail } from 'api/template';
import dayjs from 'dayjs';
const BatcSmallRedBooks = forwardRef(
    (
        {
            planState,
            imageStylePre,
            tableTitle,
            changePre,
            getAppList,
            detail,
            isMyApp,
            isblack,
            setDetail,
            setPlanUidRef,
            setTotalCount,
            setImageStyleList
        }: {
            planState: number;
            imageStylePre?: number;
            tableTitle?: number;
            changePre?: number;
            getAppList: () => void;
            detail?: any;
            isMyApp?: boolean;
            isblack?: boolean;
            setDetail: (data: any, fieldShow?: boolean) => void;
            setPlanUidRef: (data: string) => void;
            setTotalCount: (data: number) => void;
            setImageStyleList: (data: any[]) => void;
        },
        ref
    ) => {
        useImperativeHandle(ref, () => ({
            getDetail: getData,
            imageMoke: imageMoke //图片
        }));
        const [appDescription, setAppDescription] = useState('');
        const [getData, setGetData] = useState<any>(null);
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
                console.log(res);
                setVersion(res.version);
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
        const newSave = async ({ uid }: { uid: string }) => {
            timer.current?.map((item: any) => {
                clearInterval(item);
            });
            batchOpenRef.current = true;
            const result = await planExecute({ uid });
            if (result.warning) {
                message.warning(result.warning);
            }
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
                console.log(res);

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
                if (
                    res.list?.every((item: any) => item.progress) ||
                    res.list?.some((item: any) => item?.status !== 'EXECUTING' && item?.status !== 'INIT' && item?.status !== 'FAILURE')
                ) {
                    const newList = _.cloneDeep(batchDataListRef.current);
                    newList[collIndexRef.current] = res.list;
                    console.log(newList, collIndexRef.current);
                    batchDataListRef.current = newList;
                    setBatchDataList(batchDataListRef.current);
                    setbatchOpen(false);
                }
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

        const [updataTip, setUpdataTip] = useState('0');
        const [version, setVersion] = useState(0);
        const [appInfo, setAppInfo] = useState<any>({});
        const [versionPre, setVersionPre] = useState(0);
        const [createAppStatus, setCreateAppStatus] = useState(false);

        const getStatus = (status: any) => {
            switch (status) {
                case 'PENDING':
                    return <Tag>待执行</Tag>;
                case 'RUNNING':
                    return <Tag color="processing">执行中</Tag>;
                case 'PAUSE':
                    return <Tag color="warning">暂停</Tag>;
                case 'CANCELED':
                    return <Tag>已取消</Tag>;
                case 'COMPLETE':
                    return <Tag color="success">已完成</Tag>;
                case 'FAILURE':
                    return <Tag color="error">失败</Tag>;
                default:
                    return <Tag>待执行</Tag>;
            }
        };
        const [example, setIsexample] = useState(false);
        return (
            <div
                style={{
                    height: jsCookie.get('isClient') && !detail ? '100vh' : '100%'
                }}
                className="bg-[rgb(244,246,248)] md:min-w-[1052px] lg:min-w-[1152px] overflow-y-hidden overflow-x-auto"
            >
                {!detail && (
                    <SubCard
                        contentSX={{
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'space-between',
                            p: '8px !important'
                        }}
                    >
                        <div className="flex items-center gap-2">
                            <IconButton onClick={() => navigate('/appMarket')} color="secondary">
                                <KeyboardBackspace fontSize="small" />
                            </IconButton>
                            <div className="flex items-end gap-2">
                                <div className="text-[#000c] text-lg font-[500]">{appInfo.name}</div>
                                <div className="flex items-end gap-2 !text-xs">
                                    <div>状态：{getStatus(appInfo.status)}</div>
                                    <div>
                                        <Popconfirm
                                            title="更新提示"
                                            description={
                                                <div className="ml-[-24px]">
                                                    <Tabs
                                                        activeKey={updataTip}
                                                        onChange={(e) => setUpdataTip(e)}
                                                        items={[
                                                            {
                                                                key: '0',
                                                                label: '更新应用',
                                                                children: (
                                                                    <div className="w-[240px] mb-4">
                                                                        <div>当前应用最新版本为：{version}</div>
                                                                        <div>你使用的应用版本为：{appInfo.version}</div>
                                                                        <div>是否需要更新版本，获得最佳创作效果</div>
                                                                    </div>
                                                                )
                                                            },
                                                            {
                                                                key: '1',
                                                                label: '初始化应用',
                                                                children: (
                                                                    <div className="w-[240px] mb-4">
                                                                        是否需要初始化为最新的应用配置。
                                                                        <br />
                                                                        <span className="text-[#ff4d4f]">注意:</span>
                                                                        会覆盖所有已修改的应用配置，请自行备份相关内容
                                                                    </div>
                                                                )
                                                            }
                                                        ]}
                                                    ></Tabs>
                                                </div>
                                            }
                                            okButtonProps={{
                                                disabled: (appInfo?.version ? appInfo?.version : 0) === version && updataTip === '0'
                                            }}
                                            onConfirm={() => setVersionPre(versionPre + 1)}
                                            okText="更新"
                                            cancelText="取消"
                                        >
                                            <Badge count={(appInfo?.version ? appInfo?.version : 0) !== version ? 1 : 0} dot>
                                                <span className="text-xs cursor-pointer hover:shadow-md">
                                                    版本号： <span className="font-blod">{appInfo.version || 0}</span>
                                                </span>
                                            </Badge>
                                        </Popconfirm>
                                    </div>
                                    <div className=" text-black/50">
                                        最后修改时间：{dayjs(appInfo.updateTime).format('YYYY-MM-DD HH:mm:ss')}
                                    </div>
                                    <Button onClick={() => setIsexample(true)} size="small" type="primary">
                                        查看示例
                                    </Button>
                                </div>
                            </div>
                        </div>
                        <div>
                            {!detail && (
                                <div className="flex items-center gap-2">
                                    <Tooltip title="复制应用后,可自定义素材字段，流程节点，图片模版等内容">
                                        <InfoCircleOutlined />
                                    </Tooltip>

                                    <Button
                                        loading={createAppStatus}
                                        onClick={async () => {
                                            setCreateAppStatus(true);
                                            const result = await createSameApp({
                                                appMarketUid: searchParams.get('appUid'),
                                                planUid: searchParams.get('uid')
                                            });
                                            navigate('/createApp?uid=' + result);
                                            setCreateAppStatus(false);
                                        }}
                                        size="small"
                                        type="primary"
                                        className="mr-1"
                                    >
                                        复制应用
                                    </Button>
                                </div>
                            )}
                        </div>
                    </SubCard>
                )}
                <div
                    className="flex gap-4"
                    style={{
                        height: detail ? '100%' : 'calc(100% - 60px)',
                        marginTop: detail ? 0 : '8px'
                    }}
                >
                    <div
                        style={{
                            width: leftWidth ? leftWidth : ''
                        }}
                        className={`duration-700 w-[350px] bg-white rounded-lg pl-2 pr-0`}
                    >
                        <Left
                            pre={pre}
                            updataTip={updataTip}
                            versionPre={versionPre}
                            tableTitle={tableTitle}
                            imageStylePre={imageStylePre}
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
                                    setLeftWidth('30%');
                                }
                            }}
                            setAppInfo={setAppInfo}
                            getAppList={getAppList}
                            setImageMoke={setImageMoke}
                            setCollData={setCollData}
                            newSave={newSave}
                            setDetail={setDetail}
                            setPlanUid={setPlanUid}
                            setPlanUidRef={setPlanUidRef}
                            setTotalCountRef={setTotalCount}
                            setImageStyleList={setImageStyleList}
                        />
                    </div>
                    <div className="flex-1 min-w-[650px] bg-white rounded-lg p-4 h-full overflow-y-scroll">
                        <Right
                            rightPage={rightPage}
                            isexample={example}
                            setIsexample={setIsexample}
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
                            }}
                        />
                    </div>
                </div>
                {detailOpen && (
                    <DetailModal
                        open={detailOpen}
                        isFlag={bathList?.length === 0 || example}
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
