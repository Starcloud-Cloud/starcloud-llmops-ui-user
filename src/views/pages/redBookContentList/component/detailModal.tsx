import { useEffect, useRef, useState } from 'react';
import { Modal, Tooltip, Popover } from 'antd';
import { ExclamationCircleOutlined } from '@ant-design/icons';
import ThreeStep from './threeStep';
import { getContentDetail, getContentDetail1 } from 'api/redBook';
import GradeIcon from '@mui/icons-material/Grade';
import { dispatch } from 'store';
import { openSnackbar } from 'store/slices/snackbar';
import GradeOutlinedIcon from '@mui/icons-material/GradeOutlined';
import { contentLike, contentUnlike } from 'api/redBook/batchIndex';

type IAddAiModalProps = {
    open: boolean;
    handleClose: () => void;
    changeList?: (data: any) => void;
    businessUid: string;
    show?: boolean;
    executeResult?: any;
    isFlag?: boolean;
    qrCodeShow?: boolean;
};

export const DetailModal = ({ open, isFlag, qrCodeShow, handleClose, changeList, businessUid, show, executeResult }: IAddAiModalProps) => {
    const [detail, setDetail] = useState<any>(null);
    const preRef = useRef(0);
    const [pre, setPre] = useState(0);
    const [dataStatus, setSataStatus] = useState(false);
    //是否是生成记录的详情
    const [exeDetail, setExeDetail] = useState(false);
    const [count, setCount] = useState(1);

    useEffect(() => {
        if (!executeResult) {
            if (show) {
                getContentDetail1(businessUid).then((res) => {
                    if (res) {
                        setDetail(res);
                    }
                });
            } else {
                getContentDetail(businessUid).then((res) => {
                    if (res) {
                        setDetail(res);
                    }
                });
            }
        } else {
            setDetail(executeResult);
            setExeDetail(true);
        }
    }, [businessUid, count]);

    useEffect(() => {
        if (pre) {
            getContentDetail(businessUid).then((res) => {
                if (res) {
                    if (res.status === 'EXECUTING') {
                        setDetail(res);
                    } else if (res.status !== 'EXECUTING' && res.status === 'SUCCESS') {
                        setSataStatus(true);
                        changeList && changeList(businessUid);
                        setDetail(res);
                    } else if (res.status !== 'EXECUTING' && res.status === 'FAILURE') {
                        setSataStatus(true);
                        dispatch(
                            openSnackbar({
                                open: true,
                                message: res.errorMessage,
                                variant: 'alert',
                                alert: {
                                    color: 'error'
                                },
                                anchorOrigin: { vertical: 'top', horizontal: 'center' },
                                transition: 'SlideDown',
                                close: false
                            })
                        );
                    }
                }
            });
        }
    }, [pre]);

    return (
        <Modal
            width={'80%'}
            open={open}
            onCancel={handleClose}
            wrapClassName="wrap-three-step"
            title={
                <div className="flex items-start">
                    <span>详情</span>
                    <div className="ml-2">
                        {!isFlag && (
                            <>
                                <div className="flex items-center gap-2">
                                    {detail?.liked ? (
                                        <Tooltip title="取消点赞">
                                            <GradeIcon
                                                onClick={async (e: any) => {
                                                    e.stopPropagation();
                                                    const result = await contentUnlike({ uid: detail.uid });
                                                    if (result) {
                                                        setCount((pre) => pre + 1);
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
                                        </Tooltip>
                                    ) : (
                                        <Tooltip title="点赞">
                                            <GradeOutlinedIcon
                                                onClick={async (e: any) => {
                                                    e.stopPropagation();
                                                    const result = await contentLike({ uid: detail.uid });
                                                    if (result) {
                                                        setCount((pre) => pre + 1);
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
                                        </Tooltip>
                                    )}
                                    <Popover
                                        placement="top"
                                        content={
                                            <div>
                                                <div className="text-xs">
                                                    笔记 ID：<span className="font-bold">{detail?.uid}</span>
                                                </div>
                                                <div className="text-xs">
                                                    耗时：<span className="font-bold">{(detail?.elapsed / 1000)?.toFixed(1)} s</span>
                                                </div>
                                            </div>
                                        }
                                    >
                                        <ExclamationCircleOutlined className="cursor-pointer" />
                                    </Popover>
                                </div>
                            </>
                        )}
                    </div>
                </div>
            }
            footer={false}
            style={{ maxWidth: '1400px', top: 30 }}

            // footer={
            //     <div>
            //         <Button>上一篇</Button>
            //         <Button>下一篇</Button>
            //     </div>
            // }
        >
            <div className="h-[calc(100vh-140px)] p-2">
                <ThreeStep
                    isFlag={isFlag}
                    qrCodeShow={qrCodeShow}
                    data={detail}
                    show={show}
                    pre={preRef.current}
                    dataStatus={dataStatus}
                    exeDetail={exeDetail}
                    setSataStatus={setSataStatus}
                    setPre={(data) => {
                        preRef.current = data;
                        setPre(preRef.current);
                    }}
                />
            </div>
        </Modal>
    );
};
