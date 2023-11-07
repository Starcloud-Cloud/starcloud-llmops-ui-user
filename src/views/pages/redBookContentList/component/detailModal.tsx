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
import { useState } from 'react';
import { useFormik } from 'formik';
import * as yup from 'yup';
import React from 'react';
import { ThreeStep } from './threeStep';

type IAddAiModalProps = {
    open: boolean;
    handleClose: () => void;
};

export const DetailModal = ({ open, handleClose }: IAddAiModalProps) => {
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
                className="sm:w-[1200px] xs:w-[300px]"
                secondary={
                    <IconButton onClick={handleClose} size="large" aria-label="close modal">
                        <CloseIcon fontSize="small" />
                    </IconButton>
                }
            >
                <CardContent
                    sx={{
                        p: 2
                    }}
                >
                    <ThreeStep />
                </CardContent>
                <Divider />
                {/* <CardActions>
                    <Grid container justifyContent="flex-end">
                        <Button variant="contained" type="button" color="secondary" onClick={() => {}}>
                            确认
                        </Button>
                    </Grid>
                </CardActions> */}
            </MainCard>
        </Modal>
    );
};
