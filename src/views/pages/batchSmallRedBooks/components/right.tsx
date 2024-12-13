import { Collapse, Spin, Tag, Popover, Button, Popconfirm, Modal, Checkbox, QRCode, Input, Tooltip, Steps, Image } from 'antd';
import { CopyrightOutlined, CloseOutlined, LoadingOutlined } from '@ant-design/icons';
import copy from 'clipboard-copy';
import dayjs from 'dayjs';
import { memo, useEffect, useRef, useState } from 'react';
import PlanList from './PlanList';
import Good from '../good';
import { dispatch } from 'store';
import { openSnackbar } from 'store/slices/snackbar';
import { planCancel, qrCode, bindPlugin } from 'api/redBook/batchIndex';
import { getMaterialTitle, createBatchMaterial } from 'api/redBook/material';
import { plugExecute, plugexEcuteResult } from 'api/redBook/plug';
import { aiIdentify } from 'api/plug/index';
import JSZip from 'jszip';
import _ from 'lodash-es';
import { useNavigate, useLocation } from 'react-router-dom';
import { EditType } from 'views/materialLibrary/detail';

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
    getbatchPages,
    setSeleValue,
    planUid
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
    setSeleValue: (data: any) => void;
    planUid: string;
}) => {
    const navigate = useNavigate();
    const location = useLocation();
    const query = new URLSearchParams(location.search);
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

    //右下角智能生成
    const [isExe, setIsExe] = useState(true);

    const [exeInputOpen, setExeInputOpen] = useState(false);
    const [exeInputValue, setExeInputValue] = useState('');

    const [errMsg, setErrMsg] = useState('');
    const [aiRocord, setAiRocord] = useState<any>(undefined); //获取详情数据
    const getAIData = async () => {
        const result = await bindPlugin({
            appUid: query.get('appUid') || query.get('uid'),
            planUid,
            source: query.get('appUid') ? 'MARKET' : 'APP'
        });
        const res = result?.pluginDetailList?.length > 0 ? result?.pluginDetailList[0] : undefined;
        setAiRocord(res ? { ...res?.pluginDefinition, ...res?.pluginConfig } : res);
        setExeInputValue(res?.pluginDefinition?.userInput);
    };

    const handleAiExe = async () => {
        setExeInputOpen(true);
        setErrMsg('');
        setStepCurrent(0);
        if (!exeInputValue) {
            return false;
        }
        //点击 ai生成笔记
        setAiStepOpen(true);
        try {
            const result = await aiIdentify({
                pluginName: aiRocord?.pluginName,
                description: '',
                userPrompt: '',
                userInput: exeInputValue,
                inputFormart: aiRocord?.inputFormart
            });
            setStepCurrent(1);
            handleNextExe(result);
        } catch (err: any) {
            setErrMsg(err.msg);
        }
    };
    const timer = useRef<any>(null);
    const handleNextExe = async (result: any) => {
        //ai生成笔记生成笔记完成 开始执行
        try {
            const code = await plugExecute({
                inputParams: result,
                uuid: aiRocord.pluginUid
            });
            setStepCurrent(2);
            timer.current = setInterval(async () => {
                try {
                    const res = await plugexEcuteResult({
                        code,
                        uuid: aiRocord.pluginUid
                    });
                    if (res.status === 'completed') {
                        let List;
                        if (Array.isArray(res.output) && aiRocord.outputType === 'list') {
                            List = res.output;
                        } else if (typeof res.output === 'object' && res.output !== null && aiRocord.outputType === 'obj') {
                            List = [res.output];
                        } else {
                            dispatch(
                                openSnackbar({
                                    open: true,
                                    message: '返回数据类型有误，请稍后再试',
                                    variant: 'alert',
                                    alert: {
                                        color: 'error'
                                    },
                                    anchorOrigin: { vertical: 'top', horizontal: 'center' },
                                    close: false
                                })
                            );
                            clearInterval(timer.current);
                            return false;
                        }
                        const bindFieldData = JSON.parse(aiRocord?.fieldMap);
                        const newList = List.map((item: any) => {
                            const newItem: any = {};
                            for (let key in item) {
                                if (bindFieldData[key]) {
                                    newItem[bindFieldData[key]] = item[key];
                                } else {
                                    newItem[key] = item[key];
                                }
                            }
                            return newItem;
                        });
                        getResult(newList);
                        clearInterval(timer.current);
                    } else if (res.status === 'failed' || res.status === 'requires_action' || res.status === 'canceled') {
                        dispatch(
                            openSnackbar({
                                open: true,
                                message:
                                    res.status === 'failed'
                                        ? '对话失败'
                                        : res.status === 'requires_action'
                                        ? '对话中断，需要进一步处理'
                                        : res.status === 'canceled'
                                        ? '对话已取消'
                                        : '',
                                variant: 'alert',
                                alert: {
                                    color: 'error'
                                },
                                anchorOrigin: { vertical: 'top', horizontal: 'center' },
                                close: false
                            })
                        );
                        clearInterval(timer.current);
                    }
                } catch (err: any) {
                    setErrMsg(err.msg);
                    clearInterval(timer.current);
                }
            }, 4000);
        } catch (err: any) {
            setErrMsg(err.msg);
        }
    };
    const getResult = async (data: any[]) => {
        const result = await getMaterialTitle({ appUid: query.get('appUid') || query.get('uid') });
        const newData = data.map((record) => {
            const content = result?.tableMeta?.map((item: any) => {
                if (item.columnType === EditType.Image) {
                    return {
                        columnId: item.id,
                        columnName: item.columnName,
                        columnCode: item.columnCode,
                        value: record[item.columnCode] || '',
                        description: record[item.columnCode + '_description'],
                        tags: record[item.columnCode + '_tags'],
                        extend: record[item.columnCode + '_extend']
                    };
                } else {
                    return {
                        columnId: item.id,
                        columnName: item.columnName,
                        columnCode: item.columnCode,
                        value: record[item.columnCode],
                        extend: record[item.columnCode + '_extend']
                    };
                }
            });
            return {
                libraryId: result.id,
                content: content
            };
        });
        try {
            const res = await createBatchMaterial({ saveReqVOS: newData });
            setStepCurrent(3);
            setSeleValue(res);
            setTimeout(() => {
                setAiStepOpen(false);
            }, 1000);
        } catch (err: any) {
            setErrMsg(err.msg);
        }
    };
    //获取表头
    useEffect(() => {
        if (planUid) {
            getAIData();
        }
    }, [planUid]);
    const [aiStepOpen, setAiStepOpen] = useState(false);
    const [stepCurrent, setStepCurrent] = useState(0);

    return (
        <div className="h-full overflow-x-hidden">
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
                        accordion
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
            {aiRocord &&
                (isExe ? (
                    <div className="absolute w-[400px] left-[calc(50%-200px)] bottom-10 bg-[#ede7f6] rounded-lg px-4 pt-1 pb-2 flex flex-col items-center gap-2 border-[0.5px] border-solid border-[#d9d9d9] z-[1]">
                        <div className="w-full flex justify-between text-sm font-bold mb-2">
                            <div>智能生成</div>
                            <CloseOutlined
                                onClick={() => setIsExe(false)}
                                className="text-xs cursor-pointer border border-solid border-[transparent] hover:border-[#d9d9d9] rounded-full w-[20px] h-[20px] flex justify-center items-center"
                            />
                        </div>
                        <div className="w-full">
                            <Input
                                status={exeInputOpen && !exeInputValue ? 'error' : ''}
                                value={exeInputValue}
                                onChange={(e) => setExeInputValue(e.target.value)}
                            />
                            {exeInputOpen && !exeInputValue && <div className="text-xs text-[#ff4d4f] mt-1 ml-1">内容必填</div>}
                        </div>
                        <Button onClick={handleAiExe} type="primary" size="small">
                            点击生成笔记
                        </Button>
                    </div>
                ) : (
                    <Tooltip title="点击展开智能生成" placement="topLeft">
                        <div
                            onClick={() => setIsExe(true)}
                            className="absolute right-[-20px] bottom-4 bg-[#ede7f6] cursor-pointer w-[70px] h-[40px] p-4 flex items-center rounded-full border border-solid border-[#d9d9d9]"
                        >
                            <svg
                                viewBox="0 0 1024 1024"
                                version="1.1"
                                xmlns="http://www.w3.org/2000/svg"
                                p-id="4429"
                                width="25"
                                height="25"
                            >
                                <path
                                    d="M443.904 352.512c-10.368 0-12.8-10.965333-12.8-10.965333-7.253333-36.48-13.354667-57.472-13.354667-57.472-6.101333-20.992-16.768-32.256-16.768-32.256-10.666667-11.264-31.616-17.664-31.616-17.664-20.992-6.4-59.306667-14.293333-59.306666-14.293334-11.562667-1.792-11.562667-12.16-11.562667-12.16 0-10.325333 11.52-12.8 11.52-12.8 38.357333-7.893333 59.349333-14.250667 59.349333-14.250666 20.992-6.4 31.616-17.664 31.616-17.664 10.666667-11.264 16.768-31.914667 16.768-31.914667 6.058667-20.693333 13.354667-57.173333 13.354667-57.173333 2.432-11.605333 12.8-11.605333 12.8-11.605334 9.728 0 12.16 11.562667 12.16 11.562667 7.893333 36.522667 13.653333 57.173333 13.653333 57.173333 5.802667 20.693333 16.469333 32 16.469334 32 10.666667 11.221333 31.914667 17.621333 31.914666 17.621334 21.333333 6.4 59.008 14.293333 59.008 14.293333 11.562667 2.432 11.562667 12.8 11.562667 12.8 0 10.325333-11.52 12.117333-11.52 12.117333-37.76 7.936-59.050667 14.293333-59.050667 14.293334-21.290667 6.4-31.914667 17.664-31.914666 17.664-10.666667 11.264-16.426667 32.256-16.426667 32.256-5.802667 20.992-13.696 57.472-13.696 57.472a13.013333 13.013333 0 0 1-12.16 10.965333zM154.453333 561.408s2.816 2.986667 7.893334 2.986667c0 0 9.301333 0 11.178666-10.666667 0 0 6.016-32.981333 11.136-52.266667 0 0 5.12-19.285333 14.890667-29.738666 0 0 9.728-10.453333 29.269333-16.042667 0 0 19.498667-5.546667 54.826667-11.605333 0 0 10.666667-1.877333 10.666667-11.605334 0 0 0-9.813333-10.666667-11.648 0 0-35.328-6.016-54.826667-11.818666 0 0-19.541333-5.845333-29.269333-16.042667 0 0-9.813333-10.24-14.890667-29.525333 0 0-5.12-19.285333-11.136-52.736 0 0-1.877333-10.24-11.178666-10.24 0 0-9.728 0-11.605334 10.24 0 0-6.058667 33.450667-11.136 52.736 0 0-5.12 19.285333-14.890666 29.525333 0 0-9.770667 10.24-29.269334 16.042667 0 0-19.498667 5.802667-54.357333 11.818666 0 0-10.666667 1.877333-10.666667 11.648 0 0 0 9.728 10.666667 11.605334 0 0 34.858667 6.016 54.357333 11.605333 0 0 19.498667 5.546667 29.269334 16.042667 0 0 9.770667 10.453333 14.890666 29.738666 0 0 5.12 19.285333 11.136 52.266667 0 0 0.938667 4.650667 3.712 7.68zM524.8 503.04a42.666667 42.666667 0 0 1 60.330667 0l373.290666 373.248a42.666667 42.666667 0 0 1-60.373333 60.373333l-373.248-373.333333a42.666667 42.666667 0 0 1 0-60.288zM374.613333 976.554667c-7.338667 0-12.373333-4.48-12.373333-4.48a18.688 18.688 0 0 1-5.546667-11.306667 952.618667 952.618667 0 0 0-14.464-82.176c-7.125333-29.525333-22.613333-44.501333-22.613333-44.501333-15.573333-15.018667-46.677333-23.466667-46.677333-23.466667-31.061333-8.405333-85.333333-18.432-85.333334-18.432-16.341333-3.157333-16.341333-17.92-16.341333-17.92 0-7.381333 4.736-12.117333 4.736-12.117333 4.778667-4.736 11.605333-5.802667 11.605333-5.802667 54.272-7.381333 85.333333-15.018667 85.333334-15.018667 31.104-7.637333 46.634667-23.168 46.634666-23.168 15.530667-15.530667 22.912-45.824 22.912-45.824 7.381333-30.293333 14.250667-84.053333 14.250667-84.053333 2.090667-16.298667 17.92-16.298667 17.92-16.298667 15.786667 0 17.365333 16.853333 17.365333 16.853334 6.826667 52.693333 13.952 82.176 13.952 82.176 7.125333 29.482667 23.168 44.245333 23.168 44.245333 16.085333 14.762667 47.146667 22.912 47.146667 22.912 31.104 8.192 84.821333 18.176 84.821333 18.176 16.341333 3.157333 16.341333 17.92 16.341334 17.92 0 14.762667-18.432 17.92-18.432 17.92-53.76 8.405333-84.309333 16.341333-84.309334 16.341333-30.549333 7.893333-46.08 23.168-46.08 23.168-15.530667 15.274667-22.656 45.312-22.656 45.312-7.125333 30.037333-13.952 82.688-13.952 82.688-1.578667 16.853333-17.408 16.853333-17.408 16.853334z m385.834667-505.130667s1.92 10.581333 12.032 10.581333c0 0 9.642667 0 11.562667-10.581333 0 0 6.272-34.688 11.52-54.613333 0 0 5.333333-20.053333 15.445333-30.634667 0 0 10.112-10.581333 30.592-16.597333 0 0 20.48-6.016 56.576-12.288 0 0 11.093333-1.92 11.093333-12.032 0 0 0-10.112-11.093333-12.032 0 0-36.138667-6.272-56.576-12.032 0 0-20.48-5.802667-30.592-16.64 0 0-10.112-10.837333-15.402667-30.805334 0 0-5.290667-19.968-11.562666-54.186666 0 0-1.92-11.093333-11.52-11.093334 0 0-10.154667 0-12.074667 11.093334 0 0-6.272 34.218667-11.52 54.186666 0 0-5.333333 19.968-15.445333 30.805334 0 0-10.112 10.837333-30.336 16.64 0 0-20.224 5.76-56.32 12.032 0 0-4.864 0.981333-7.978667 4.096 0 0-3.114667 3.114667-3.114667 7.936 0 0 0 10.112 11.093334 12.032 0 0 36.096 6.272 56.32 12.288 0 0 20.224 6.016 30.293333 16.64 0 0 10.154667 10.581333 15.445333 30.549333 0 0 5.290667 19.968 11.52 54.656z"
                                    p-id="4430"
                                ></path>
                            </svg>
                        </div>
                    </Tooltip>
                ))}
            <Modal
                title="笔记生成进度"
                open={aiStepOpen}
                onCancel={() => setAiStepOpen(false)}
                closable={errMsg ? true : false}
                maskClosable={false}
                footer={false}
                keyboard={false}
            >
                <div className="mt-4 flex justify-center">
                    <Steps
                        direction="vertical"
                        size="small"
                        current={stepCurrent}
                        status={errMsg ? 'error' : 'process'}
                        items={[
                            {
                                icon: stepCurrent === 0 && !errMsg ? <LoadingOutlined /> : null,
                                title: 'AI 识别中生成···',
                                description: (
                                    <div className="text-xs font-bold">{stepCurrent === 0 && errMsg ? `错误信息：(${errMsg})` : ''}</div>
                                )
                            },
                            {
                                icon: stepCurrent === 1 && !errMsg ? <LoadingOutlined /> : null,
                                title: 'AI 识别生成成功，开始 Ai 执行中···',
                                description: (
                                    <div className="text-xs font-bold">{stepCurrent === 1 && errMsg ? `错误信息：(${errMsg})` : ''}</div>
                                )
                            },
                            {
                                icon: stepCurrent === 2 && !errMsg ? <LoadingOutlined /> : null,
                                title: 'AI 执行成功，准备生成素材···',
                                description: (
                                    <div className="text-xs font-bold">{stepCurrent === 2 && errMsg ? `错误信息：(${errMsg})` : ''}</div>
                                )
                            },
                            {
                                icon: stepCurrent === 3 && !errMsg ? <LoadingOutlined /> : null,
                                title: '素材生成成功，准备插入并生成···',
                                description: (
                                    <div className="text-xs font-bold">{stepCurrent === 3 && errMsg ? `错误信息：(${errMsg})` : ''}</div>
                                )
                            },
                            { title: 'AI 生成笔记···' }
                        ]}
                    />
                </div>
            </Modal>
        </div>
    );
};
const RightMemo = (prevProps: any, nextProps: any) => {
    return (
        _.isEqual(prevProps?.isexample, nextProps?.isexample) &&
        _.isEqual(prevProps?.planUid, nextProps?.planUid) &&
        _.isEqual(prevProps?.bathList, nextProps?.bathList) &&
        _.isEqual(prevProps?.collapseActive, nextProps?.collapseActive) &&
        _.isEqual(prevProps?.batchOpen, nextProps?.batchOpen) &&
        _.isEqual(prevProps?.batchDataList, nextProps?.batchDataList) &&
        _.isEqual(prevProps?.exampleList, nextProps?.exampleList)
    );
};
export default memo(Right, RightMemo);
