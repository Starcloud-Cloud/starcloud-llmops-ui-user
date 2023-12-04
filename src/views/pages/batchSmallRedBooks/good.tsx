import { Image, Skeleton, Popover } from 'antd';
import GradeOutlinedIcon from '@mui/icons-material/GradeOutlined';
import Swipers from './components/swiper';
import formatDate from 'hooks/useDate';
import imgLoading from 'assets/images/picture/loading.gif';
import { contentLike, contentUnlike } from 'api/redBook/batchIndex';
const Goods = ({ item, setBusinessUid, setDetailOpen }: any) => {
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
        }
    };
    return (
        <div className="mb-[20px] w-full aspect-[200/266] rounded-[16px] shadow p-[10px] border border-solid border-[#EBEEF5] bg-[#fff]">
            {!item.pictureContent ? (
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
                        <GradeOutlinedIcon
                            onClick={(e: any) => {
                                e.stopPropagation();
                            }}
                            sx={{ color: '#0003' }}
                        />
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
export default Goods;
