import { Collapse, Spin, Tag, Popover, Button, Popconfirm, Modal, Checkbox, QRCode } from 'antd';
import { CopyrightOutlined, CloseOutlined } from '@ant-design/icons';
import copy from 'clipboard-copy';
import dayjs from 'dayjs';
import { memo, useEffect, useRef, useState } from 'react';
import PlanList from './PlanList';
import Good from '../good';
import { dispatch } from 'store';
import { openSnackbar } from 'store/slices/snackbar';
import { planCancel, qrCode } from 'api/redBook/batchIndex';
import JSZip from 'jszip';
import _ from 'lodash-es';
import { useNavigate } from 'react-router-dom';
const Right = ({
    isexample,
    setIsexample,
    rightPage,
    batchTotal,
    bathList,
    exampleList,
    collapseActive,
    batchOpen,
    changeCollapse,
    batchDataList,
    setBusinessUid,
    setDetailOpen,
    timeFailure,
    getbatchPages
}: {
    isexample: boolean;
    setIsexample: (data: any) => void;
    rightPage: number;
    batchTotal: number;
    bathList: any[];
    exampleList: any[];
    collapseActive: any;
    batchOpen: boolean;
    changeCollapse: (data: any) => void;
    batchDataList: any[];
    setBusinessUid: (data: any) => void;
    setDetailOpen: (data: any) => void;
    timeFailure: (data: any) => void;
    getbatchPages: (data: any) => void;
}) => {
    const navigate = useNavigate();
    const scrollRef: any = useRef(null);
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
    const [pageNum, setPageNum] = useState(1);
    const getMore = () => {
        getbatchPages({ pageNo: pageNum + 1, pageSize: 10 });
        setPageNum(pageNum + 1);
    };
    //批量下载
    const [downOpen, setDownOpen] = useState(false);
    const [downList, setDownList] = useState<any[]>([]);
    const batchDownload = (data: any[]) => {
        setDownList(data?.filter((item) => item.status === 'SUCCESS'));
        setCheckValue(data?.filter((item) => item.status === 'SUCCESS')?.map((item) => item.uid));
        setDownOpen(true);
    };
    const [checkValue, setCheckValue] = useState<undefined | any[]>(undefined);
    const appendIndexToDuplicates = (list: any[]) => {
        const countMap: any = {};
        const result = list.map((item) => {
            // 初始化计数器
            if (!countMap[item?.executeResult?.copyWriting?.title]) {
                countMap[item?.executeResult?.copyWriting?.title] = 0;
            }
            countMap[item?.executeResult?.copyWriting?.title] += 1;

            // 如果是重复的，添加计数后缀
            if (countMap[item?.executeResult?.copyWriting?.title] > 1) {
                const newData = _.cloneDeep(item);
                newData.executeResult.copyWriting.title = `${item?.executeResult?.copyWriting?.title}_${
                    countMap[item?.executeResult?.copyWriting?.title] - 1
                }`;
                return newData;
            }
            return item;
        });
        return result;
    };
    const [imgLoading, setImgLoading] = useState(false);
    const downloadImage = async () => {
        setImgLoading(true);
        const zip = new JSZip();
        const imageList = appendIndexToDuplicates(downList.filter((item) => checkValue?.includes(item.uid)));
        const result = await qrCode({
            domain: process.env.REACT_APP_SHARE_URL || 'https://cn-test.mofabiji.com',
            uidList: imageList?.map((item) => item.uid)
        });
        const promises = imageList.map(async (imageUrl: any, index: number) => {
            const response = await fetch(result?.find((item: any) => item.uid === imageUrl.uid)?.qrCode);
            const arrayBuffer = await response.arrayBuffer();
            zip.file(imageUrl?.executeResult?.copyWriting?.title + '.png', arrayBuffer);
        });
        Promise.all(promises)
            .then(() => {
                setImgLoading(false);
                zip.generateAsync({ type: 'blob' }).then((content: any) => {
                    const url = window.URL.createObjectURL(content);
                    const a = document.createElement('a');
                    a.href = url;
                    a.download = '二维码分享.zip'; // 设置下载的文件名
                    a.click();
                    window.URL.revokeObjectURL(url);
                });
            })
            .catch((error) => {
                setImgLoading(false);
                console.error('Error downloading images:', error);
            });
    };
    const [textLoading, setTextLoading] = useState(false);
    const downloadText = async () => {
        setTextLoading(true);
        const zip = new JSZip();
        const imageList = appendIndexToDuplicates(downList.filter((item) => checkValue?.includes(item.uid)));
        const promises = imageList.map(async (item: any, index: number) => {
            const folder: any = zip.folder(item?.executeResult?.copyWriting?.title);
            const images = item?.executeResult?.imageList?.map(async (el: any, i: number) => {
                const response = await fetch(el.url);
                const arrayBuffer = await response.arrayBuffer();
                folder.file('image' + (i + 1) + `.${el?.url?.split('.')[el?.url?.split('.')?.length - 1]}`, arrayBuffer);
            });
            await Promise.all(images)
                .then(async (res) => {
                    let index = 1;
                    folder.file(item?.executeResult?.copyWriting?.title + '.txt', item?.executeResult?.copyWriting?.content);
                    zip.file(folder);
                })
                .catch((err) => {
                    setTextLoading(false);
                });
        });

        Promise.all(promises)
            .then(() => {
                setTextLoading(false);
                zip.generateAsync({ type: 'blob' }).then((content: any) => {
                    const url = window.URL.createObjectURL(content);
                    const a = document.createElement('a');
                    a.href = url;
                    a.download = '小红书素材.zip'; // 设置下载的文件名
                    a.click();
                    window.URL.revokeObjectURL(url);
                });
            })
            .catch((error) => {
                setTextLoading(false);
                console.error('Error downloading images:', error);
            });
    };

    useEffect(() => {
        if (rightPage) setPageNum(1);
    }, [rightPage]);

    //小红书分享
    const [batchid, setBatchid] = useState('');
    const [publishOpen, setPublishOpen] = useState(false);
    return (
        <>
            {bathList?.length === 0 || isexample ? (
                <div style={{ height: '100%' }} className="flex gap-2 relative flex-col justify-center items-center">
                    {isexample && (
                        <Button
                            onClick={() => setIsexample(false)}
                            className="absolute top-2 right-2"
                            size="small"
                            type="primary"
                            shape="circle"
                            icon={<CloseOutlined />}
                        ></Button>
                    )}
                    {exampleList?.length > 0 ? (
                        <div className="w-full overflow-x-auto flex justify-center gap-2">
                            {exampleList?.map((item: any) => (
                                <div className="xs:w-[200px] xl:w-[200px] 2xl:w-[380px]" key={item?.businessUid}>
                                    <Good
                                        item={item}
                                        setBusinessUid={(data: any) => {
                                            setBusinessUid({ uid: data, index: 0 });
                                        }}
                                        setDetailOpen={setDetailOpen}
                                        show={true}
                                    />
                                </div>
                            ))}
                        </div>
                    ) : (
                        <img
                            className="w-[300px]"
                            src="https://www.chuangkit.com/ai-design/assets/right-panel-editor-47905452.png"
                            alt=""
                        />
                    )}
                    <div className="flex flex-col justify-center items-center">
                        <div className="font-[500] text-[20px] text-[#1b2337] my-[8px]">魔法创作计划</div>
                        <div>在左侧输入你的创意，保存并开始生成吧</div>
                    </div>
                </div>
            ) : (
                <>
                    <Collapse
                        onChange={changeCollapse}
                        activeKey={collapseActive}
                        items={bathList?.map((item, i) => {
                            return {
                                key: item.uid,
                                label: (
                                    <div className="w-full flex justify-between items-center text-sm pr-[20px]">
                                        <div className="flex items-center">
                                            {item.status === 'RUNNING' && (
                                                <Popconfirm
                                                    title="提示"
                                                    description="请再次确认是否全部取消?"
                                                    onConfirm={async (e) => {
                                                        e?.stopPropagation();
                                                        const result = await planCancel({ batchUid: item.uid });
                                                        dispatch(
                                                            openSnackbar({
                                                                open: true,
                                                                message: '取消成功',
                                                                variant: 'alert',
                                                                alert: {
                                                                    color: 'success'
                                                                },
                                                                anchorOrigin: { vertical: 'top', horizontal: 'center' },
                                                                close: false
                                                            })
                                                        );
                                                    }}
                                                    onCancel={(e) => {
                                                        e?.stopPropagation();
                                                    }}
                                                    okText="确认"
                                                    cancelText="取消"
                                                >
                                                    <Button
                                                        onClick={(e) => e.stopPropagation()}
                                                        className="mr-1"
                                                        size="small"
                                                        danger
                                                        type="primary"
                                                    >
                                                        全部取消
                                                    </Button>
                                                </Popconfirm>
                                            )}
                                            <Popover
                                                content={
                                                    <div className="flex items-center gap-2">
                                                        <span>批次号：{item.uid}</span>
                                                        <CopyrightOutlined
                                                            onClick={(e) => {
                                                                copy(item.uid);
                                                                dispatch(
                                                                    openSnackbar({
                                                                        open: true,
                                                                        message: '复制成功',
                                                                        variant: 'alert',
                                                                        alert: {
                                                                            color: 'success'
                                                                        },
                                                                        anchorOrigin: { vertical: 'top', horizontal: 'center' },
                                                                        close: false
                                                                    })
                                                                );
                                                                e.stopPropagation();
                                                            }}
                                                            className="cursor-pointer"
                                                        />
                                                    </div>
                                                }
                                            >
                                                {getStatus(item.status)}
                                            </Popover>
                                            <span className="font-[600]">生成时间：</span>
                                            {dayjs(item?.createTime)?.format('YYYY-MM-DD HH:mm:ss')}
                                            <div className="w-[71px] inline-block whitespace-nowrap ml-1">
                                                <span className="font-[600]">版本号：</span>
                                                {item?.version}
                                            </div>
                                        </div>
                                        <div className="hidden xl:hidden 2xl:block">
                                            <div className="flex items-center gap-1 flex-wrap">
                                                <span className="font-[600]">执行人:</span>
                                                <div className="!w-[80px] line-clamp-1">{item?.creator}</div>
                                                <span className="font-[600]">生成成功数:</span>
                                                <span className="w-[17px]">{item?.successCount}</span>
                                                <span className="font-[600]">生成失败数:</span>
                                                <span className="w-[17px]">{item?.failureCount}</span>
                                                <span className="font-[600]">生成总数:</span>
                                                <span className="w-[17px]">{item?.totalCount}</span>
                                                {item.status === 'COMPLETE' && batchDataList[i] && collapseActive[0] === item.uid && (
                                                    <>
                                                        <Button
                                                            onClick={(e) => {
                                                                batchDownload(batchDataList[i]);
                                                                e.stopPropagation();
                                                            }}
                                                            size="small"
                                                            type="primary"
                                                        >
                                                            批量下载
                                                        </Button>
                                                        <Button
                                                            onClick={(e) => {
                                                                setBatchid(item?.uid);
                                                                setPublishOpen(true);
                                                                e.stopPropagation();
                                                            }}
                                                            size="small"
                                                            type="primary"
                                                        >
                                                            批量分享
                                                        </Button>
                                                    </>
                                                )}
                                            </div>
                                        </div>
                                        <div className="hidden 2xl:hidden xl:block lg:block md:block sm:block xs:block">
                                            <div className="flex items-center gap-1 flex-wrap">
                                                {item.status === 'COMPLETE' && batchDataList[i] && collapseActive[0] === item.uid && (
                                                    <>
                                                        <Button
                                                            onClick={(e) => {
                                                                batchDownload(batchDataList[i]);
                                                                e.stopPropagation();
                                                            }}
                                                            size="small"
                                                            type="primary"
                                                        >
                                                            批量下载
                                                        </Button>
                                                        <Button
                                                            onClick={(e) => {
                                                                setBatchid(item?.uid);
                                                                setPublishOpen(true);
                                                                e.stopPropagation();
                                                            }}
                                                            size="small"
                                                            type="primary"
                                                        >
                                                            批量分享
                                                        </Button>
                                                    </>
                                                )}
                                            </div>
                                        </div>
                                    </div>
                                ),
                                children: (
                                    <Spin className="!max-h-full" spinning={batchOpen}>
                                        <div className="overflow-y-auto overflow-x-hidden flex flex-wrap gap-2" ref={scrollRef}>
                                            <PlanList
                                                key={item.uid}
                                                batchDataList={batchDataList[i]}
                                                setBusinessUid={setBusinessUid}
                                                setDetailOpen={setDetailOpen}
                                                timeFailure={(index) => timeFailure({ i, index })}
                                            />
                                        </div>
                                    </Spin>
                                )
                            };
                        })}
                    />
                    {batchTotal > pageNum * 10 && (
                        <div className="flex justify-center mt-4">
                            <Button size="small" type="primary" onClick={getMore}>
                                更多
                            </Button>
                        </div>
                    )}
                </>
            )}
            <Modal
                title="批量下载"
                width="60%"
                open={downOpen}
                onCancel={() => {
                    setCheckValue(undefined);
                    setDownOpen(false);
                }}
                footer={false}
            >
                <Checkbox.Group value={checkValue} onChange={setCheckValue}>
                    <div className="grid grid-cols-4 gap-4">
                        {downList?.map((item: any) => (
                            <div className="relative" key={item?.businessUid}>
                                <Good
                                    item={item}
                                    noDetail={true}
                                    setBusinessUid={(data: any) => {
                                        setBusinessUid({ uid: data, index: 0 });
                                    }}
                                    setDetailOpen={setDetailOpen}
                                    show={true}
                                />
                                <Checkbox value={item?.uid} className="absolute top-2 right-2 z-[1]" />
                            </div>
                        ))}
                    </div>
                </Checkbox.Group>
                <div className="flex justify-center gap-2 mt-4">
                    <Button
                        loading={textLoading}
                        onClick={downloadText}
                        disabled={!checkValue || checkValue?.length === 0}
                        size="small"
                        type="primary"
                    >
                        批量下载素材({checkValue?.length || 0})
                    </Button>
                    <Button
                        loading={imgLoading}
                        onClick={downloadImage}
                        disabled={!checkValue || checkValue?.length === 0}
                        size="small"
                        type="primary"
                    >
                        批量下载二维码({checkValue?.length || 0})
                    </Button>
                </div>
            </Modal>
            <Modal open={publishOpen} title={'批量分享'} footer={null} onCancel={() => setPublishOpen(false)} closable={false}>
                <div className="w-full flex justify-center items-center flex-col gap-2">
                    <QRCode value={`${process.env.REACT_APP_SHARE_URL}/batchShare?uid=` + batchid} />
                    <div className="flex flex-col items-center">
                        <div
                            onClick={() => window.open(`${process.env.REACT_APP_SHARE_URL}/batchShare?uid=${batchid}`)}
                            className="text-md underline cursor-pointer text-[#673ab7]"
                        >
                            查看效果
                        </div>
                    </div>
                </div>
            </Modal>
        </>
    );
};
const RightMemo = (prevProps: any, nextProps: any) => {
    return (
        JSON.stringify(prevProps?.isexample) === JSON.stringify(nextProps?.isexample) &&
        JSON.stringify(prevProps?.bathList) === JSON.stringify(nextProps?.bathList) &&
        JSON.stringify(prevProps?.collapseActive) === JSON.stringify(nextProps?.collapseActive) &&
        JSON.stringify(prevProps?.batchOpen) === JSON.stringify(nextProps?.batchOpen) &&
        JSON.stringify(prevProps?.batchDataList) === JSON.stringify(nextProps?.batchDataList) &&
        JSON.stringify(prevProps?.exampleList) === JSON.stringify(nextProps?.exampleList)
    );
};
export default memo(Right, RightMemo);
