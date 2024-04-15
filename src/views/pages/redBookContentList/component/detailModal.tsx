import MainCard from 'ui-component/cards/MainCard';
import CloseIcon from '@mui/icons-material/Close';
import { useEffect, useState } from 'react';
import { useFormik } from 'formik';
import * as yup from 'yup';
import React from 'react';
import { Modal } from 'antd';
import { ThreeStep } from './threeStep';
import { getContentDetail, getContentDetail1 } from 'api/redBook';

type IAddAiModalProps = {
    open: boolean;
    handleClose: () => void;
    businessUid: string;
    show?: boolean;
};

export const DetailModal = ({ open, handleClose, businessUid, show }: IAddAiModalProps) => {
    const [detail, setDetail] = useState(null);

    useEffect(() => {
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
    }, [businessUid]);

    return (
        <Modal width={'80%'} open={open} onCancel={handleClose} title="详情" footer={false}>
            <div className="h-[calc(80vh-86px)] p-2">
                <ThreeStep data={detail} show={show} />
            </div>
        </Modal>
    );
};
