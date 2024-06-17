import CreatePlanProvider from 'contexts/CreatePlan';
import jsCookie from 'js-cookie';

import { useLocation, useNavigate } from 'react-router-dom';
import { useState } from 'react';
import SubCard from 'ui-component/cards/SubCard';
import { IconButton } from '@mui/material';
import { KeyboardBackspace } from '@mui/icons-material';

import Left from './components/newLeft';
const CreatePlan = ({
    isMyApp,
    detail,
    setDetail
}: {
    isMyApp?: boolean;
    detail: any;
    setDetail: (data: any, fieldShow?: boolean) => void;
}) => {
    const navigate = useNavigate();
    const [appDescription, setAppDescription] = useState('');
    const [leftWidth, setLeftWidth] = useState('');
    return (
        <CreatePlanProvider>
            <div
                style={{
                    height: jsCookie.get('isClient') ? '100vh' : '100%'
                }}
                className="bg-[rgb(244,246,248)] h-full md:min-w-[1052px] lg:min-w-[1152px] overflow-y-hidden overflow-x-auto"
            >
                {!isMyApp && (
                    <SubCard
                        contentSX={{
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'space-between',
                            p: '10px !important'
                        }}
                    >
                        <div>
                            <IconButton onClick={() => navigate('/appMarket')} color="secondary">
                                <KeyboardBackspace fontSize="small" />
                            </IconButton>
                            <span className="text-[#000c] font-[500]">应用市场</span>
                            {appDescription && (
                                <span
                                    className="2xl:ml-[430px] xl:ml-[340px] lg:ml-[300px]  ml-[300px] text-[#673ab7] cursor-pointer"
                                    onClick={() => {
                                        window.open(appDescription);
                                    }}
                                >
                                    应用说明
                                </span>
                            )}
                        </div>
                        <div></div>
                    </SubCard>
                )}
                <div
                    className="flex gap-[20px]"
                    style={{
                        height: detail ? '100%' : 'calc(100% - 58px)',
                        marginTop: detail ? 0 : '16px'
                    }}
                >
                    <div
                        style={{
                            width: leftWidth ? leftWidth : ''
                        }}
                        className={`duration-700 2xl:w-[500px] xl:w-[410px] lg:w-[370px] w-[370px] bg-white rounded-lg pl-2 pr-0`}
                    >
                        {/* <Left
                            pre={1}
                            planState={false}
                            detail={detail}
                            leftWidth={leftWidth}
                            setWidth={() => {
                                if (leftWidth) {
                                    setLeftWidth('');
                                } else {
                                    setLeftWidth('50%');
                                }
                            }}
                            setDetail={setDetail}
                        /> */}
                    </div>
                    {/* <div className="flex-1 min-w-[650px] bg-white rounded-lg p-4 h-full overflow-y-auto">
                        <Right
                            rightPage={rightPage}
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
                                setBathOpen(batchOpenRef.current);
                            }}
                        />
                    </div>
                {detailOpen && (
                    <DetailModal
                        open={detailOpen}
                        changeList={changeList}
                        handleClose={() => setDetailOpen(false)}
                        businessUid={businessUid}
                    />
                )} */}
                </div>
            </div>
        </CreatePlanProvider>
    );
};
export default CreatePlan;
