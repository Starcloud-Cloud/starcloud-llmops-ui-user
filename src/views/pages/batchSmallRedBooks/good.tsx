import { Progress, Skeleton, Popover, Button } from 'antd';
import GradeOutlinedIcon from '@mui/icons-material/GradeOutlined';
import GradeIcon from '@mui/icons-material/Grade';
import Swipers from './components/swiper';
import formatDate from 'hooks/useDate';
import { contentLike, contentUnlike } from 'api/redBook/batchIndex';
import { dispatch } from 'store';
import { openSnackbar } from 'store/slices/snackbar';
import { useState, memo } from 'react';
import { useNavigate } from 'react-router-dom';
import { failureRetry } from 'api/redBook/batchIndex';
import './index.scss';
const Goods = ({ item, setBusinessUid, setDetailOpen }: any) => {
    const navigate = useNavigate();
    const [likeOpen, setLikeOpen] = useState(item?.liked);
    //执行按钮
    const handleTransfer = (key: string, errMessage: string, count?: number) => {
        switch (key) {
            case 'init':
                return <span className="!mr-0">初始化</span>;
            case 'executing':
                return <span className="!mr-0">生成中</span>;
            case 'execute_success':
                return <span>执行成功</span>;
            case 'execute_error':
                return (
                    <Popover
                        content={
                            <div>
                                <div>{errMessage}</div>
                            </div>
                        }
                        title="失败原因"
                    >
                        <span className="!mr-0 cursor-pointer" color="red">
                            执行失败{count && `(${count})`}
                        </span>
                    </Popover>
                );
            case 'execute_error_finished':
                return errMessage?.indexOf('权益不足') !== -1 && !count ? (
                    <span
                        onClick={() => {
                            navigate('/subscribe');
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
                        <span className="!mr-0 cursor-pointer">执行失败</span>
                    </Popover>
                );
        }
    };
    //失败重试
    const failure = async (uid: string) => {
        setLoading(true);
        const result = await failureRetry(uid);
    };
    const [loading, setLoading] = useState(false);
    return (
        <div className="mb-[20px] w-full aspect-[200/266] rounded-[16px] shadow p-[10px] border border-solid border-[#EBEEF5] bg-[#fff]">
            {item.copyWritingStatus !== 'execute_success' ? (
                <div>
                    <div className="w-full aspect-[250/335] flex justify-center items-center relative gu">
                        <Skeleton.Image
                            className="!w-[100%] !h-[100%]"
                            active={item.copyWritingStatus === 'init' || item.copyWritingStatus === 'executing' ? true : false}
                        />
                        {(item.copyWritingStatus === 'executing' || item.copyWritingStatus === 'execute_error') && (
                            <div className="absolute top-0 right-0 left-0 bottom-0 flex flex-col gap-2 justify-center items-center z-1000">
                                <Progress type="circle" percent={Math.floor((item?.currentStepIndex / item?.totalStep) * 100)} />
                                <Popover content={'执行到第几步/总步数'}>
                                    <div className="font-[500] cursor-pointer">
                                        {item?.currentStepIndex}/{item?.totalStep}
                                    </div>
                                </Popover>
                            </div>
                        )}
                        {item.copyWritingStatus === 'execute_error_finished' && (
                            <Button
                                disabled={loading}
                                onClick={() => failure(item.businessUid)}
                                className="absolute bottom-[100px] left-0 right-0 m-auto w-[80px]"
                                type="primary"
                                size="small"
                            >
                                {loading ? '正在重试' : '失败重试'}
                            </Button>
                        )}
                    </div>
                    <div className="relative">
                        <Skeleton
                            paragraph={false}
                            className="mt-[20px]"
                            active={item.copyWritingStatus === 'init' || item.copyWritingStatus === 'executing' ? true : false}
                        />
                        <Skeleton
                            paragraph={false}
                            className="mt-[20px]"
                            active={item.copyWritingStatus === 'init' || item.copyWritingStatus === 'executing' ? true : false}
                        />
                        <Skeleton
                            paragraph={false}
                            className="mt-[10px]"
                            active={item.copyWritingStatus === 'init' || item.copyWritingStatus === 'executing' ? true : false}
                        />
                        <Skeleton
                            paragraph={false}
                            className="mt-[10px] mb-[15px]"
                            active={item.copyWritingStatus === 'init' || item.copyWritingStatus === 'executing' ? true : false}
                        />
                        <div className="absolute right-1 top-0">
                            {handleTransfer(item.copyWritingStatus, item.copyWritingErrorMsg)}
                            {item.copyWritingStatus === 'execute_error' && <span>({item.copyWritingRetryCount})</span>}
                        </div>
                        <div className="text-[#15273799] text-[12px] mt-[5px] flex justify-between items-center">
                            <div>
                                <span className="font-[600]">状态：</span>
                                {handleTransfer(item.pictureStatus, item.pictureErrorMsg, item.copyWritingRetryCount)}
                            </div>
                            <div>
                                <span className="font-[600]">耗时：</span>
                                {(item.pictureExecuteTime / 1000)?.toFixed(2) || 0}S
                            </div>
                            <div>
                                <span className="font-[600]">张数/字数：</span>
                                {item.pictureNum}
                            </div>
                        </div>
                        <div className="text-[#15273799] text-[12px]">
                            <span className="font-[600]">时间：</span>
                            {item.pictureStartTime && item.pictureEndTime
                                ? formatDate(item.pictureStartTime) + '-' + formatDate(item.pictureEndTime)
                                : ''}
                        </div>
                    </div>
                </div>
            ) : (
                <>
                    <Swipers item={item} />
                    <div
                        className="mt-[10px] cursor-pointer"
                        onClick={() => {
                            setBusinessUid(item.businessUid);
                            setDetailOpen(true);
                        }}
                    >
                        <div className="flex justify-between items-start">
                            <div className="line-clamp-2 h-[40px] text-[14px] font-bold">{item.copyWritingTitle}</div>
                            {likeOpen ? (
                                <GradeIcon
                                    onClick={async (e: any) => {
                                        e.stopPropagation();
                                        const result = await contentUnlike({ businessUid: item.businessUid });
                                        if (result) {
                                            setLikeOpen(false);
                                            dispatch(
                                                openSnackbar({
                                                    open: true,
                                                    message: '取消点赞成功',
                                                    variant: 'alert',
                                                    alert: {
                                                        color: 'success'
                                                    },
                                                    anchorOrigin: { vertical: 'top', horizontal: 'center' },
                                                    transition: 'SlideDown',
                                                    close: false
                                                })
                                            );
                                        }
                                    }}
                                    sx={{ color: '#ecc94b99' }}
                                />
                            ) : (
                                <GradeOutlinedIcon
                                    onClick={async (e: any) => {
                                        e.stopPropagation();
                                        const result = await contentLike({ businessUid: item.businessUid });
                                        if (result) {
                                            setLikeOpen(true);
                                            dispatch(
                                                openSnackbar({
                                                    open: true,
                                                    message: '点赞成功',
                                                    variant: 'alert',
                                                    alert: {
                                                        color: 'success'
                                                    },
                                                    anchorOrigin: { vertical: 'top', horizontal: 'center' },
                                                    transition: 'SlideDown',
                                                    close: false
                                                })
                                            );
                                        }
                                    }}
                                    sx={{ color: '#0003' }}
                                />
                            )}
                        </div>
                        <Popover
                            content={
                                <div className="w-[500px] text-[12px]">
                                    <div>
                                        <span className="font-[600]">标题：</span>
                                        {item.copyWritingTitle}
                                    </div>
                                    <div>
                                        <span className="font-[600]">描述：</span>
                                        <span className="text-[#15273799] ">{item.copyWritingContent}</span>
                                    </div>
                                </div>
                            }
                        >
                            <div className="line-clamp-4 mt-[10px] text-[14px] h-[85px]">{item.copyWritingContent}</div>
                        </Popover>
                        <div className="text-[#15273799] text-[12px] mt-[5px] flex justify-between items-center">
                            <div>
                                <span className="font-[600]">状态：</span>
                                {handleTransfer(item.pictureStatus, item.pictureErrorMsg)}
                            </div>
                            <div>
                                <span className="font-[600]">耗时：</span>
                                {(item.pictureExecuteTime / 1000)?.toFixed(2)}S
                            </div>
                            <div>
                                <span className="font-[600]">张数/字数：</span>
                                {item.pictureNum}
                            </div>
                        </div>
                        <div className="text-[#15273799] text-[12px]">
                            <span className="font-[600]">时间：</span>
                            {formatDate(item.pictureStartTime)}-{formatDate(item.pictureEndTime)}
                        </div>
                    </div>
                </>
            )}
        </div>
    );
};
const arePropsEqual = (prevProps: any, nextProps: any) => {
    return JSON.stringify(prevProps?.item) === JSON.stringify(nextProps?.item);
};
export default memo(Goods, arePropsEqual);
