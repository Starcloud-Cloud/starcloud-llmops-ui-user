import { Collapse, Spin, Tag, Popover } from 'antd';
import { CopyrightOutlined } from '@ant-design/icons';
import copy from 'clipboard-copy';
import dayjs from 'dayjs';
import { memo, useRef } from 'react';
import PlanList from './PlanList';
import Good from '../good';
import { dispatch } from 'store';
import { openSnackbar } from 'store/slices/snackbar';
const Right = ({
    bathList,
    exampleList,
    collapseActive,
    batchOpen,
    changeCollapse,
    planList,
    setBusinessUid,
    setDetailOpen,
    handleScroll,
    timeFailure
}: {
    bathList: any[];
    exampleList: any[];
    collapseActive: any;
    batchOpen: boolean;
    changeCollapse: (data: any) => void;
    planList: any[];
    setBusinessUid: (data: any) => void;
    setDetailOpen: (data: any) => void;
    handleScroll: (data: any) => void;
    timeFailure: (data: number) => void;
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
    return (
        <div>
            {bathList?.length === 0 ? (
                <div style={{ height: 'calc(100vh - 210px)' }} className="flex justify-center items-center">
                    <div className="text-center">
                        {exampleList?.length > 0 ? (
                            <div className="!w-[300px] justify-center flex gap-2">
                                {exampleList?.map((item: any) => (
                                    <Good
                                        key={item?.businessUid}
                                        item={item}
                                        setBusinessUid={setBusinessUid}
                                        setDetailOpen={setDetailOpen}
                                        show={true}
                                    />
                                ))}
                            </div>
                        ) : (
                            <img
                                className="w-[300px]"
                                src="https://www.chuangkit.com/ai-design/assets/right-panel-editor-47905452.png"
                                alt=""
                            />
                        )}
                        <div className="font-[500] text-[20px] text-[#1b2337] my-[8px]">魔法创作计划</div>
                        <div>在左侧输入你的创意，保存并开始生成吧</div>
                    </div>
                </div>
            ) : (
                <>
                    <Collapse
                        onChange={changeCollapse}
                        activeKey={collapseActive}
                        items={bathList?.map((item) => {
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
                                                            rev={undefined}
                                                        />
                                                    </div>
                                                }
                                            >
                                                {getStatus(item.status)}
                                            </Popover>
                                            <span className="font-[600]">生成时间：</span>
                                            {dayjs(item?.createTime)?.format('YYYY-MM-DD HH:mm:ss')}
                                            <div className="inline-block whitespace-nowrap">
                                                <span className="font-[600]">版本号：</span>
                                                {item?.version}
                                            </div>
                                        </div>
                                        <div>
                                            <span className="font-[600]">执行人：</span>
                                            {item?.creator}&nbsp;&nbsp;
                                            <span className="font-[600]">生成成功数：</span>
                                            {item?.successCount}&nbsp;&nbsp;
                                            <span className="font-[600]">生成失败数：</span>
                                            {item?.failureCount}&nbsp;&nbsp;
                                            <div className="inline-block whitespace-nowrap">
                                                <span className="font-[600]">生成总数：</span>
                                                {item?.totalCount}
                                            </div>
                                        </div>
                                    </div>
                                ),
                                children: (
                                    <Spin className="!max-h-full" spinning={batchOpen}>
                                        <div
                                            className="h-[600px] overflow-y-auto overflow-x-hidden flex flex-wrap gap-2"
                                            ref={scrollRef}
                                            onScroll={() => handleScroll(scrollRef.current)}
                                        >
                                            <PlanList
                                                planList={planList}
                                                setBusinessUid={setBusinessUid}
                                                setDetailOpen={setDetailOpen}
                                                timeFailure={timeFailure}
                                            />
                                        </div>
                                    </Spin>
                                )
                            };
                        })}
                        accordion
                    />
                </>
            )}
        </div>
    );
};
const RightMemo = (prevProps: any, nextProps: any) => {
    return (
        JSON.stringify(prevProps?.bathList) === JSON.stringify(nextProps?.bathList) &&
        JSON.stringify(prevProps?.collapseActive) === JSON.stringify(nextProps?.collapseActive) &&
        JSON.stringify(prevProps?.batchOpen) === JSON.stringify(nextProps?.batchOpen) &&
        JSON.stringify(prevProps?.planList) === JSON.stringify(nextProps?.planList) &&
        JSON.stringify(prevProps?.exampleList) === JSON.stringify(nextProps?.exampleList)
    );
};
export default memo(Right, RightMemo);
