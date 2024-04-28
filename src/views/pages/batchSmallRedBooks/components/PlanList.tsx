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
        <div className="grid gap-4 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-2 xl:grid-cols-2 2xl:grid-cols-3 3xl:grid-cols-4 4xl:grid-cols-5">
            {planList?.map((item: any, index: number) => (
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
        // <Row gutter={20} className="h-[fit-content] w-full">
        //     {planList?.map((item: any, index: number) => (
        //         <Col key={item.businessUid} xs={12} md={12} xl={8} xxl={6} className="inline-block">
        //             <Goods
        //                 item={item}
        //                 setBusinessUid={(data: any) => {
        //                     setBusinessUid({ uid: data, index });
        //                 }}
        //                 setDetailOpen={setDetailOpen}
        //                 timeFailure={() => timeFailure(index + 1)}
        //             />
        //         </Col>
        //     ))}
        // </Row>
    );
};
const memoPlanList = (pre: any, next: any) => {
    return JSON.stringify(pre.planList) === JSON.stringify(next.planList);
};

export default memo(PlanList, memoPlanList);
