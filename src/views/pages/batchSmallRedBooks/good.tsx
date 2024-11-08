import { Progress, Skeleton, Popover, Button, Tag, Tooltip } from 'antd';
import GradeOutlinedIcon from '@mui/icons-material/GradeOutlined';
import GradeIcon from '@mui/icons-material/Grade';
import Swipers from './components/swiper';
import formatDate from 'hooks/useDate';
import { contentLike, contentUnlike } from 'api/redBook/batchIndex';
import { dispatch } from 'store';
import { openSnackbar } from 'store/slices/snackbar';
import { useState, memo, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { failureRetry } from 'api/redBook/batchIndex';
import './index.scss';
import BackupIcon from '@mui/icons-material/Backup';
const Goods = ({ item, setBusinessUid, setDetailOpen, show, timeFailure }: any) => {
    const navigate = useNavigate();
    const [likeOpen, setLikeOpen] = useState(item?.liked);
    //执行按钮
    const handleTransfer = (key: string, errMessage: string, count?: number) => {
        switch (key) {
            case 'INIT':
                return <Tag>等待执行</Tag>;
            case 'EXECUTING':
                return <Tag color="processing">生成中</Tag>;
            case 'SUCCESS':
                return <Tag color="success">执行成功</Tag>;
            case 'FAILURE':
                return (
                    <Popover
                        content={
                            <div>
                                <div>{errMessage}</div>
                            </div>
                        }
                        title="失败原因"
                    >
                        <Tag color="error">执行失败{count && `(${count})`}</Tag>
                    </Popover>
                );
            case 'ULTIMATE_FAILURE':
                return errMessage?.indexOf('权益不足') !== -1 && !count ? (
                    <span
                        onClick={() => {
                            window.open(process.env.REACT_APP_SHARE_URL + '/subscribe');
                            // navigate('/subscribe');
                        }}
                        className="!mr-0 cursor-pointer text-[#673ab7] hover:underline font-[500]"
                    >
                        权益不足，去升级
                    </span>
                ) : (
                    <Popover
                        content={
                            <div>
                                <div>{errMessage}</div>
                            </div>
                        }
                        title="失败原因"
                    >
                        <Tag color="error">执行失败</Tag>
                    </Popover>
                );
        }
    };
    //失败重试
    const failure = async (uid: string) => {
        setLoading(true);
        const result = await failureRetry({ uid });
        timeFailure();
        setTimeout(() => {
            setLoading(false);
        }, 3000);
    };
    const [loading, setLoading] = useState(false);
    return (
        // <div className=" w-full aspect-[200/266] rounded-[16px] shadow p-[10px] border border-solid border-[#EBEEF5] bg-[#fff] h-[565px]">
        //     {item.status !== 'SUCCESS' ? (
        //         <div>
        //             <div className="w-full h-[330px] aspect-[250/335] flex justify-center items-center relative gu">
        //                 <Skeleton.Image
        //                     className="!w-[100%] !h-[100%]"
        //                     active={item.status === 'INIT' || item.status === 'EXECUTING' ? true : false}
        //                 />
        //                 {item.status === 'EXECUTING' && (
        //                     <div className="absolute top-0 right-0 left-0 bottom-0 flex flex-col gap-2 justify-center items-center z-1000">
        //                         <Progress
        //                             type="circle"
        //                             percent={Math.floor((item?.progress?.currentStepIndex / item?.progress?.totalStepCount) * 100)}
        //                         />
        //                         <Popover content={'执行到第几步/总步数'}>
        //                             <div className="font-[500] cursor-pointer">
        //                                 {item?.progress?.currentStepIndex}/{item?.progress?.totalStepCount}
        //                             </div>
        //                         </Popover>
        //                     </div>
        //                 )}
        //                 {item.status === 'ULTIMATE_FAILURE' && (
        //                     <Button
        //                         disabled={loading}
        //                         onClick={() => failure(item.uid)}
        //                         className="absolute bottom-[100px] left-0 right-0 m-auto w-[80px]"
        //                         type="primary"
        //                         size="small"
        //                     >
        //                         {loading ? '正在重试' : '失败重试'}
        //                     </Button>
        //                 )}
        //             </div>
        //             <div className="relative">
        //                 <Skeleton
        //                     paragraph={false}
        //                     className="mt-[10px] h-[44px]"
        //                     active={item.status === 'INIT' || item.status === 'EXECUTING' ? true : false}
        //                 />
        //                 <div className="h-[88px]">
        //                     <Skeleton
        //                         paragraph={false}
        //                         className="mt-[10px]"
        //                         active={item.status === 'INIT' || item.status === 'EXECUTING' ? true : false}
        //                     />
        //                     <Skeleton
        //                         paragraph={false}
        //                         className="mt-[10px]"
        //                         active={item.status === 'INIT' || item.status === 'EXECUTING' ? true : false}
        //                     />
        //                     <Skeleton
        //                         paragraph={false}
        //                         className="mt-[10px] mb-[15px]"
        //                         active={item.status === 'INIT' || item.status === 'EXECUTING' ? true : false}
        //                     />
        //                 </div>
        //                 <div className="absolute right-1 top-0">
        //                     {handleTransfer(item.status, item.errorMessage)}
        //                     {item.status === 'FAILURE' && <span>({item.retryCount})</span>}
        //                 </div>
        //                 <div className="text-[#15273799] text-[12px] mt-[5px] flex justify-between items-center">
        //                     <div className="whitespace-nowrap line-clamp-1">
        //                         <div className="inline-block whitespace-nowrap">
        //                             <span className="font-[600]">状态：</span>
        //                             {handleTransfer(item.status, item.errorMessage, item.retryCount)}
        //                         </div>
        //                         <div className="inline-block whitespace-nowrap">
        //                             <span className="font-[600]">耗时：</span>
        //                             {(item.elapsed / 1000)?.toFixed(2) || 0}S
        //                         </div>
        //                     </div>
        //                     <div className=" line-clamp-1">
        //                         <span className="font-[600]">张数：</span>-
        //                     </div>
        //                 </div>
        //                 <div className="text-[#15273799] text-[12px] line-clamp-1">
        //                     <span className="font-[600]">时间：</span>
        //                     {item.startTime && item.endTime ? formatDate(item.startTime) + '到' + formatDate(item.endTime) : ''}
        //                 </div>
        //             </div>
        //         </div>
        //     ) : (
        //         <>
        //             <Swipers item={item} />
        //             <div
        //                 className="mt-[10px] cursor-pointer"
        //                 onClick={() => {
        //                     setBusinessUid(item.uid);
        //                     setDetailOpen(true);
        //                 }}
        //             >
        //                 <div className="flex justify-between items-start">
        //                     <div className="line-clamp-2 h-[44px] text-[14px] font-bold">{item?.executeResult?.copyWriting?.title}</div>
        //                     {/* {!show && (
        //                         <div>
        //                             {likeOpen ? (
        //                                 <GradeIcon
        //                                     onClick={async (e: any) => {
        //                                         e.stopPropagation();
        //                                         const result = await contentUnlike({ uid: item.uid });
        //                                         if (result) {
        //                                             setLikeOpen(false);
        //                                             dispatch(
        //                                                 openSnackbar({
        //                                                     open: true,
        //                                                     message: '取消点赞成功',
        //                                                     variant: 'alert',
        //                                                     alert: {
        //                                                         color: 'success'
        //                                                     },
        //                                                     anchorOrigin: { vertical: 'top', horizontal: 'center' },
        //                                                     transition: 'SlideDown',
        //                                                     close: false
        //                                                 })
        //                                             );
        //                                         }
        //                                     }}
        //                                     sx={{ color: '#ecc94b99' }}
        //                                 />
        //                             ) : (
        //                                 <GradeOutlinedIcon
        //                                     onClick={async (e: any) => {
        //                                         e.stopPropagation();
        //                                         const result = await contentLike({ uid: item.uid });
        //                                         if (result) {
        //                                             setLikeOpen(true);
        //                                             dispatch(
        //                                                 openSnackbar({
        //                                                     open: true,
        //                                                     message: '点赞成功',
        //                                                     variant: 'alert',
        //                                                     alert: {
        //                                                         color: 'success'
        //                                                     },
        //                                                     anchorOrigin: { vertical: 'top', horizontal: 'center' },
        //                                                     transition: 'SlideDown',
        //                                                     close: false
        //                                                 })
        //                                             );
        //                                         }
        //                                     }}
        //                                     sx={{ color: '#0003' }}
        //                                 />
        //                             )}
        //                         </div>
        //                     )} */}
        //                 </div>
        //                 <Popover
        //                     content={
        //                         <div className="w-[500px] text-[12px]">
        //                             <div>
        //                                 <span className="font-[600]">标题：</span>
        //                                 {item?.executeResult?.copyWriting?.title}
        //                             </div>
        //                             <div>
        //                                 <span className="font-[600]">描述：</span>
        //                                 <span className="text-[#15273799] ">{item?.executeResult?.copyWriting?.content}</span>
        //                             </div>
        //                         </div>
        //                     }
        //                 >
        //                     <div className="line-clamp-4 mt-[10px] text-[14px] h-[88px]">{item?.executeResult?.copyWriting?.content}</div>
        //                 </Popover>
        //                 {!show && (
        //                     <>
        //                         <div className="text-[#15273799] text-[12px] mt-[5px] flex justify-between items-center">
        //                             <div className="whitespace-nowrap line-clamp-1">
        //                                 <div className="inline-block whitespace-nowrap">
        //                                     <span className="font-[600]">状态：</span>
        //                                     {handleTransfer(item.status, item.errorMessage)}
        //                                 </div>
        //                                 <div className="inline-block whitespace-nowrap">
        //                                     <span className="font-[600]">耗时：</span>
        //                                     {(item.elapsed / 1000)?.toFixed(2)}S
        //                                 </div>
        //                             </div>
        //                             <div className="line-clamp-1">
        //                                 <span className="font-[600]">张数：</span>
        //                                 {item?.executeResult?.imageList?.length}
        //                             </div>
        //                         </div>
        //                         <div className="text-[#15273799] text-[12px] line-clamp-1">
        //                             <span className="font-[600]">时间：</span>
        //                             {formatDate(item.startTime)}到{formatDate(item.endTime)}
        //                         </div>
        //                         <div className="flex justify-around items-center w-[160px] mx-auto">
        //                             <div>
        //                                 {likeOpen ? (
        //                                     <Tooltip title="取消点赞">
        //                                         <GradeIcon
        //                                             className="cursor-pointer"
        //                                             onClick={async (e: any) => {
        //                                                 e.stopPropagation();
        //                                                 const result = await contentUnlike({ uid: item.uid });
        //                                                 if (result) {
        //                                                     setLikeOpen(false);
        //                                                     dispatch(
        //                                                         openSnackbar({
        //                                                             open: true,
        //                                                             message: '取消点赞成功',
        //                                                             variant: 'alert',
        //                                                             alert: {
        //                                                                 color: 'success'
        //                                                             },
        //                                                             anchorOrigin: { vertical: 'top', horizontal: 'center' },
        //                                                             transition: 'SlideDown',
        //                                                             close: false
        //                                                         })
        //                                                     );
        //                                                 }
        //                                             }}
        //                                             sx={{ color: '#ecc94b99' }}
        //                                         />
        //                                     </Tooltip>
        //                                 ) : (
        //                                     <Tooltip title="点赞">
        //                                         <GradeOutlinedIcon
        //                                             className="cursor-pointer"
        //                                             onClick={async (e: any) => {
        //                                                 e.stopPropagation();
        //                                                 const result = await contentLike({ uid: item.uid });
        //                                                 if (result) {
        //                                                     setLikeOpen(true);
        //                                                     dispatch(
        //                                                         openSnackbar({
        //                                                             open: true,
        //                                                             message: '点赞成功',
        //                                                             variant: 'alert',
        //                                                             alert: {
        //                                                                 color: 'success'
        //                                                             },
        //                                                             anchorOrigin: { vertical: 'top', horizontal: 'center' },
        //                                                             transition: 'SlideDown',
        //                                                             close: false
        //                                                         })
        //                                                     );
        //                                                 }
        //                                             }}
        //                                             sx={{ color: '#0003' }}
        //                                         />
        //                                     </Tooltip>
        //                                 )}
        //                             </div>
        //                             {/* <div>
        //                                 <BackupIcon
        //                                     className="text-gray-500 cursor-pointer"
        //                                     onClick={async (e: any) => {
        //                                         e.stopPropagation();
        //                                     }}
        //                                 />
        //                             </div> */}
        //                         </div>
        //                     </>
        //                 )}
        //             </div>
        //         </>
        //     )}
        // </div>
        <div key={item.businessUid} className="overflow-hidden cursor-pointer relative border border-solid border-[#CECAD5] rounded-[16px]">
            {item.status !== 'SUCCESS' ? (
                <div className="relative">
                    <div className="p-[16px] aspect-[263/351] flex justify-center items-center relative gu">
                        <Skeleton.Image
                            className="!w-[100%] !h-[100%]"
                            active={item.status === 'INIT' || item.status === 'EXECUTING' ? true : false}
                        />
                        {item.status === 'EXECUTING' && (
                            <div className="absolute top-0 right-0 left-0 bottom-0 flex flex-col gap-2 justify-center items-center z-1000">
                                <Progress
                                    type="circle"
                                    percent={Math.floor((item?.progress?.currentStepIndex / item?.progress?.totalStepCount) * 100)}
                                />
                                <Popover content={'执行到第几步/总步数'}>
                                    <div className="font-[500] cursor-pointer">
                                        {item?.progress?.currentStepIndex}/{item?.progress?.totalStepCount}
                                    </div>
                                </Popover>
                            </div>
                        )}
                        {item.status === 'ULTIMATE_FAILURE' && (
                            <Button
                                disabled={loading}
                                onClick={(e) => {
                                    failure(item.uid);
                                    e.stopPropagation();
                                }}
                                className="absolute bottom-[100px] left-0 right-0 m-auto w-[80px]"
                                type="primary"
                                size="small"
                            >
                                {loading ? '正在重试' : '失败重试'}
                            </Button>
                        )}
                    </div>
                    <Skeleton
                        paragraph={false}
                        className="px-4"
                        active={item.status === 'INIT' || item.status === 'EXECUTING' ? true : false}
                    />
                    <Skeleton
                        paragraph={false}
                        className="mt-[8px] mb-[16px] px-4"
                        active={item.status === 'INIT' || item.status === 'EXECUTING' ? true : false}
                    />
                    <div className="absolute right-2 bottom-6">
                        {handleTransfer(item.status, item.errorMessage)}
                        {item.status === 'FAILURE' && <span>({item.retryCount})</span>}
                    </div>
                </div>
            ) : (
                <div
                    onClick={() => {
                        setBusinessUid(item.uid);
                        setDetailOpen(true);
                    }}
                >
                    <Swipers show={show} item={item} />
                    <div className="p-[12px]">
                        <div className="h-[40px] text-sm font-[500] line-clamp-2">{item?.executeResult?.copyWriting?.title}</div>
                    </div>
                </div>
            )}
        </div>
    );
};
const arePropsEqual = (prevProps: any, nextProps: any) => {
    return JSON.stringify(prevProps?.item) === JSON.stringify(nextProps?.item);
};
export default memo(Goods, arePropsEqual);
