import MainCard from 'ui-component/cards/MainCard';
import CloseIcon from '@mui/icons-material/Close';
import { useEffect, useRef, useState } from 'react';
import { useFormik } from 'formik';
import * as yup from 'yup';
import React from 'react';
import { Button, Modal } from 'antd';
import ThreeStep from './threeStep';
import { getContentDetail, getContentDetail1 } from 'api/redBook';

type IAddAiModalProps = {
    open: boolean;
    handleClose: () => void;
    changeList?: () => void;
    businessUid: string;
    show?: boolean;
    executeResult?: any;
};

export const DetailModal = ({ open, handleClose, changeList, businessUid, show, executeResult }: IAddAiModalProps) => {
    const [detail, setDetail] = useState(null);
    const preRef = useRef(0);
    const [pre, setPre] = useState(0);
    const [dataStatus, setSataStatus] = useState(false);
    //是否是生成记录的详情
    const [exeDetail, setExeDetail] = useState(false);
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
    }, [businessUid]);
    useEffect(() => {
        if (pre) {
            getContentDetail(businessUid).then((res) => {
                if (res) {
                    if (res.status !== 'EXECUTING') {
                        setSataStatus(true);
                        changeList && changeList();
                    }
                    setDetail(res);
                }
            });
        }
    }, [pre]);

    return (
        <Modal
            width={'80%'}
            open={open}
            onCancel={handleClose}
            title="详情"
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
