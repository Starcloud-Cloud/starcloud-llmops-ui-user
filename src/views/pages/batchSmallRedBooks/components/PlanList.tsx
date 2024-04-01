import { Row, Col } from 'antd';
import { memo } from 'react';
import Goods from '../good';
const PlanList = ({
    planList,
    setBusinessUid,
    setDetailOpen,
    timeFailure
}: {
    planList: any[];
    setBusinessUid: (data: any) => void;
    setDetailOpen: (data: any) => void;
    timeFailure: (data: number) => void;
}) => {
    return (
        <Row gutter={20} className="h-[fit-content] w-full">
            {planList?.map((item: any, index: number) => (
                <Col key={item.businessUid} xs={12} md={12} xl={8} xxl={6} className="inline-block">
                    <Goods
                        item={item}
                        setBusinessUid={setBusinessUid}
                        setDetailOpen={setDetailOpen}
                        timeFailure={() => timeFailure(index + 1)}
                    />
                </Col>
            ))}
        </Row>
    );
};
const memoPlanList = (pre: any, next: any) => {
    return JSON.stringify(pre.planList) === JSON.stringify(next.planList);
};

export default memo(PlanList, memoPlanList);
