import {
    Button,
    CardActions,
    CardContent,
    Checkbox,
    Divider,
    FormControl,
    FormControlLabel,
    FormGroup,
    FormLabel,
    Grid,
    IconButton,
    Modal,
    TextField
} from '@mui/material';
import MainCard from 'ui-component/cards/MainCard';
import CloseIcon from '@mui/icons-material/Close';
import { useEffect, useState } from 'react';
import { useFormik } from 'formik';
import * as yup from 'yup';
import React from 'react';
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
        <Modal open={open} onClose={handleClose} aria-labelledby="modal-title" aria-describedby="modal-description">
            <MainCard
                style={{
                    position: 'absolute',
                    top: '50%',
                    left: '50%',
                    transform: 'translate(-50%, -50%)'
                }}
                title={'详情'}
                content={false}
                className="sm:w-[1200px] xs:w-[300px] h-[92vh]"
                secondary={
                    <IconButton onClick={handleClose} size="large" aria-label="close modal">
                        <CloseIcon fontSize="small" />
                    </IconButton>
                }
            >
                <CardContent
                    className="h-[calc(100%-86px)]"
                    sx={{
                        p: 2
                    }}
                >
                    <ThreeStep data={detail} show={show} />
                </CardContent>
            </MainCard>
        </Modal>
    );
};
