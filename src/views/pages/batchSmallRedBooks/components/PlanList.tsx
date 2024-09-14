import { Row, Col } from 'antd';
import { memo } from 'react';
import Goods from '../good';
const PlanList = ({
    batchDataList,
    setBusinessUid,
    setDetailOpen,
    timeFailure
}: {
    batchDataList: any[];
    setBusinessUid: (data: any) => void;
    setDetailOpen: (data: any) => void;
    timeFailure: (data: number) => void;
}) => {
    return (
        <div className="w-full grid gap-4 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-4 xl:grid-cols-5 2xl:grid-cols-6 3xl:grid-cols-6 4xl:grid-cols-7">
            {batchDataList?.map((item: any, index: number) => (
                <Goods
                    key={item.businessUid}
                    item={item}
                    setBusinessUid={(data: any) => {
                        setBusinessUid({ uid: data, index });
                    }}
                    setDetailOpen={setDetailOpen}
                    timeFailure={() => timeFailure(index + 1)}
                />
            ))}
        </div>
    );
};
const memoPlanList = (pre: any, next: any) => {
    return JSON.stringify(pre.batchDataList) === JSON.stringify(next.batchDataList);
};

export default memo(PlanList, memoPlanList);
