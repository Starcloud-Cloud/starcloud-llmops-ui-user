import { Image, Skeleton, Popover } from 'antd';
import GradeOutlinedIcon from '@mui/icons-material/GradeOutlined';
import GradeIcon from '@mui/icons-material/Grade';
import Swipers from './components/swiper';
import formatDate from 'hooks/useDate';
import imgLoading from 'assets/images/picture/loading.gif';
import { contentLike, contentUnlike } from 'api/redBook/batchIndex';
import { dispatch } from 'store';
import { openSnackbar } from 'store/slices/snackbar';
import { useState, memo } from 'react';
const Goods = ({ item, setBusinessUid, setDetailOpen }: any) => {
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
                            执行失败
                        </span>
                    </Popover>
                );
        }
    };
    return (
        <div className="mb-[20px] w-full aspect-[200/266] rounded-[16px] shadow p-[10px] border border-solid border-[#EBEEF5] bg-[#fff]">
            {item.pictureStatus === 'init' || item.pictureStatus === 'executing' ? (
                <div className="w-full flex justify-center items-center">
                    <div className="w-full aspect-[250/335] flex justify-center items-center">
                        <div className="text-center">
                            <Image width={40} src={imgLoading} preview={false} />
                            <div>
                                {handleTransfer(item.pictureStatus, item.pictureErrorMsg)}
                                {item.pictureStatus === 'execute_error' && <span>({item.pictureRetryCount})</span>}
                            </div>
                        </div>
                    </div>
                </div>
            ) : item.pictureStatus === 'execute_error' || item.pictureStatus === 'execute_error_finished' ? (
                <div className="w-full flex justify-center items-center">
                    <div className="w-full aspect-[250/335] flex justify-center items-center relative">
                        <Image
                            height={'100%'}
                            src="data:image/png;base64,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"
                            preview={false}
                        />
                        <span className="absolute bottom-[30%]">
                            {handleTransfer(item.pictureStatus, item.pictureErrorMsg)}{' '}
                            {item.pictureStatus === 'execute_error' && <span>({item.pictureRetryCount})</span>}
                        </span>
                    </div>
                </div>
            ) : (
                <Swipers item={item} />
            )}
            {!item.copyWritingTitle ? (
                <div className="relative">
                    <Skeleton paragraph={false} className="mt-[20px]" active />
                    <Skeleton paragraph={false} className="mt-[20px]" active />
                    <Skeleton paragraph={false} className="mt-[10px]" active />
                    <Skeleton paragraph={false} className="mt-[10px] mb-[15px]" active />
                    <div className="absolute right-1 top-0">
                        {handleTransfer(item.copyWritingStatus, item.copyWritingErrorMsg)}
                        {item.copyWritingStatus === 'execute_error' && <span>({item.copyWritingRetryCount})</span>}
                    </div>
                    <div className="text-[#15273799] text-[12px] mt-[5px] flex justify-between items-center">
                        <div>
                            <span className="font-[600]">文案：</span>
                            {handleTransfer(item.copyWritingStatus, item.copyWritingErrorMsg, item.copyWritingRetryCount)}
                        </div>
                        <div>
                            <span className="font-[600]">耗时：</span>
                            {(item.copyWritingExecuteTime / 1000)?.toFixed(2) || 0}S
                        </div>
                        <div>
                            <span className="font-[600]">字数：</span>
                            {item.copyWritingCount}
                        </div>
                    </div>
                    <div className="text-[#15273799] text-[12px]">
                        <span className="font-[600]">时间：</span>
                        {item.copyWritingStartTime && item.copyWritingEndTime
                            ? formatDate(item.copyWritingStartTime) + '-' + formatDate(item.copyWritingEndTime)
                            : ''}
                    </div>
                    <div className="text-[#15273799] text-[12px] mt-[5px] flex justify-between items-center">
                        <div>
                            <span className="font-[600]">图片：</span>
                            {handleTransfer(item.pictureStatus, item.pictureErrorMsg, item.copyWritingRetryCount)}
                        </div>
                        <div>
                            <span className="font-[600]">耗时：</span>
                            {(item.pictureExecuteTime / 1000)?.toFixed(2) || 0}S
                        </div>
                        <div>
                            <span className="font-[600]">张数：</span>
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
            ) : (
                <div
                    className="mt-[10px] cursor-pointer"
                    onClick={() => {
                        setBusinessUid(item.businessUid);
                        setDetailOpen(true);
                    }}
                >
                    <div className="flex justify-between items-start">
                        <div className="line-clamp-2 h-[37px] text-[14px] font-bold">{item.copyWritingTitle}</div>
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
                        <div className="line-clamp-4 mt-[10px] text-[14px] h-[75px]">{item.copyWritingContent}</div>
                    </Popover>
                    <div className="text-[#15273799] text-[12px] mt-[5px] flex justify-between items-center">
                        <div>
                            <span className="font-[600]">文案：</span>
                            {handleTransfer(item.copyWritingStatus, item.copyWritingErrorMsg)}
                        </div>
                        <div>
                            <span className="font-[600]">耗时：</span>
                            {(item.copyWritingExecuteTime / 1000)?.toFixed(2)}S
                        </div>
                        <div>
                            <span className="font-[600]">字数：</span>
                            {item.copyWritingCount}
                        </div>
                    </div>
                    <div className="text-[#15273799] text-[12px]">
                        <span className="font-[600]">时间：</span>
                        {formatDate(item.copyWritingStartTime)}-{formatDate(item.copyWritingEndTime)}
                    </div>
                    <div className="text-[#15273799] text-[12px] mt-[5px] flex justify-between items-center">
                        <div>
                            <span className="font-[600]">图片：</span>
                            {handleTransfer(item.pictureStatus, item.pictureErrorMsg)}
                        </div>
                        <div>
                            <span className="font-[600]">耗时：</span>
                            {(item.pictureExecuteTime / 1000)?.toFixed(2)}S
                        </div>
                        <div>
                            <span className="font-[600]">张数：</span>
                            {item.pictureNum}
                        </div>
                    </div>
                    <div className="text-[#15273799] text-[12px]">
                        <span className="font-[600]">时间：</span>
                        {formatDate(item.pictureStartTime)}-{formatDate(item.pictureEndTime)}
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
