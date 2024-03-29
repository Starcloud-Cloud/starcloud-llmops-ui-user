import { Collapse, Spin } from 'antd';
import dayjs from 'dayjs';
import { memo, useRef, useMemo } from 'react';
import PlanList from './PlanList';
const Right = ({
    bathList,
    collapseActive,
    batchOpen,
    changeCollapse,
    planList,
    setBusinessUid,
    setDetailOpen,
    handleScroll
}: {
    bathList: any[];
    collapseActive: any;
    batchOpen: boolean;
    changeCollapse: (data: any) => void;
    planList: any[];
    setBusinessUid: (data: any) => void;
    setDetailOpen: (data: any) => void;
    handleScroll: (data: any) => void;
}) => {
    const scrollRef: any = useRef(null);
    return (
        <div>
            {bathList?.length === 0 ? (
                <div style={{ height: 'calc(100vh - 210px)' }} className="flex justify-center items-center">
                    <div className="text-center">
                        <img
                            className="w-[300px]"
                            src="https://www.chuangkit.com/ai-design/assets/right-panel-editor-47905452.png"
                            alt=""
                        />
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
                                key: item.batch,
                                label: (
                                    <div className="w-full flex justify-between items-center text-sm pr-[20px]">
                                        <div className="">
                                            <span className="font-[600]">生成时间：</span>
                                            {dayjs(item?.startTime)?.format('YYYY-MM-DD HH:mm:ss')}（{item?.batch}）
                                        </div>
                                        <div>
                                            <span className="font-[600]">生成成功数：</span>
                                            {item?.successCount}&nbsp;&nbsp;
                                            <span className="font-[600]">生成失败数：</span>
                                            {item?.failureCount}&nbsp;&nbsp;
                                            <span className="font-[600]">生成总数：</span>
                                            {item?.totalCount}
                                        </div>
                                    </div>
                                ),
                                children: (
                                    <Spin className="!max-h-full" spinning={batchOpen}>
                                        <div
                                            className="h-[1000px] overflow-y-auto overflow-x-hidden flex flex-wrap gap-2 mt-[20px]"
                                            ref={scrollRef}
                                            onScroll={() => handleScroll(scrollRef.current)}
                                        >
                                            <PlanList planList={planList} setBusinessUid={setBusinessUid} setDetailOpen={setDetailOpen} />
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
        JSON.stringify(prevProps?.planList) === JSON.stringify(nextProps?.planList)
    );
};
export default memo(Right, RightMemo);
