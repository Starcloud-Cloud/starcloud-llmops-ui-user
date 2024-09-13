import MainCard from 'ui-component/cards/MainCard';
import CloseIcon from '@mui/icons-material/Close';
import { useEffect, useRef, useState } from 'react';
import { useFormik } from 'formik';
import * as yup from 'yup';
import React from 'react';
import { Button, Modal, Tooltip } from 'antd';
import ThreeStep from './threeStep';
import { getContentDetail, getContentDetail1 } from 'api/redBook';
import GradeIcon from '@mui/icons-material/Grade';
import { dispatch } from 'store';
import { openSnackbar } from 'store/slices/snackbar';
import GradeOutlinedIcon from '@mui/icons-material/GradeOutlined';
import { contentLike, contentUnlike } from 'api/redBook/batchIndex';
import BackupIcon from '@mui/icons-material/Backup';

type IAddAiModalProps = {
    open: boolean;
    handleClose: () => void;
    changeList?: (data: any) => void;
    businessUid: string;
    show?: boolean;
    executeResult?: any;
};

export const DetailModal = ({ open, handleClose, changeList, businessUid, show, executeResult }: IAddAiModalProps) => {
    const [detail, setDetail] = useState<any>(null);
    const preRef = useRef(0);
    const [pre, setPre] = useState(0);
    const [dataStatus, setSataStatus] = useState(false);
    const [errMessage, setErrMessage] = useState('');
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
                    } else if (res.status !== 'EXECUTING' && res.status === 'SUCCESS') {
                        setErrMessage(res.errorMessage);
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
                <div className="flex">
                    <span>详情</span>
                    <div className="flex gap-2 justify-around items-center ml-2">
                        <div className="cursor-pointer">
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
                        </div>
                        {/* <div>
                            <BackupIcon
                                className="text-gray-500"
                                onClick={async (e: any) => {
                                    e.stopPropagation();
                                }}
                            />
                        </div> */}
                        <Tooltip title="笔记ID">
                            <div className="text-xs text-black/50 cursor-pointer">{detail?.uid}</div>
                        </Tooltip>
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
                    data={detail}
                    show={show}
                    pre={preRef.current}
                    dataStatus={dataStatus}
                    errMessage={errMessage}
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
