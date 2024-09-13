import { Collapse, Spin, Tag, Popover, Button } from 'antd';
import { CopyrightOutlined, CloseOutlined } from '@ant-design/icons';
import copy from 'clipboard-copy';
import dayjs from 'dayjs';
import { memo, useEffect, useMemo, useRef, useState } from 'react';
import PlanList from './PlanList';
import Good from '../good';
import { dispatch } from 'store';
import { openSnackbar } from 'store/slices/snackbar';
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
    useEffect(() => {
        if (rightPage) setPageNum(1);
    }, [rightPage]);
    return (
        <>
            {bathList?.length === 0 || isexample ? (
                <div style={{ height: '100%' }} className="flex relative flex-col justify-center items-center">
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
                        <div className="!w-[400px] h-[350px] flex gap-2">
                            {exampleList?.map((item: any) => (
                                <div className="w-[50%]" key={item?.businessUid}>
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
                                        <div>
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
                                            <div className="w-[71px] inline-block whitespace-nowrap">
                                                <span className="font-[600]">版本号：</span>
                                                {item?.version}
                                            </div>
                                        </div>
                                        <div className="flex gap-1 flex-wrap">
                                            <span className="font-[600]">执行人:</span>
                                            <div className="!w-[50px] line-clamp-1">{item?.creator}</div>
                                            <span className="font-[600]">生成成功数:</span>
                                            <span className="w-[17px]">{item?.successCount}</span>
                                            <span className="font-[600]">生成失败数:</span>
                                            <span className="w-[17px]">{item?.failureCount}</span>
                                            <span className="font-[600]">生成总数:</span>
                                            <span className="w-[17px]">{item?.totalCount}</span>
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
                        accordion
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
