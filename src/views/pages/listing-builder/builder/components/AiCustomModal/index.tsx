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

type IAddAiModalProps = {
    open: boolean;
    handleClose: () => void;
};

export const AiCustomModal = ({ open, handleClose }: IAddAiModalProps) => {
    const formik = useFormik({
        initialValues: {
            productFeatures: '',
            clientFeatures: '',
            voidWord: '',
            showNamePosition: '',
            name: '',
            style: ''
        },
        validationSchema: yup.object({
            productFeatures: yup.string().required('标题是必填的')
        }),
        onSubmit: async (values) => {}
    });

    const [state, setState] = React.useState({
        gilad: true,
        jason: false,
        antoine: false
    });

    const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setState({
            ...state,
            [event.target.name]: event.target.checked
        });
    };

    const { gilad, jason, antoine } = state;

    return (
        <Modal open={open} onClose={handleClose} aria-labelledby="modal-title" aria-describedby="modal-description">
            <MainCard
                style={{
                    position: 'absolute',
                    top: '50%',
                    left: '50%',
                    transform: 'translate(-50%, -50%)'
                }}
                title={'设置'}
                content={false}
                className="sm:w-[700px] xs:w-[300px]"
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
                    <form onSubmit={formik.handleSubmit} className="mt-2">
                        <Grid container>
                            <Grid item md={12}>
                                <TextField
                                    size="small"
                                    label={'Feature*'}
                                    fullWidth
                                    id="productFeatures"
                                    name="productFeatures"
                                    color="secondary"
                                    InputLabelProps={{ shrink: true }}
                                    value={formik.values.productFeatures}
                                    onChange={formik.handleChange}
                                    error={formik.touched.productFeatures && Boolean(formik.errors.productFeatures)}
                                    helperText={formik.touched.productFeatures && formik.errors.productFeatures}
                                />
                            </Grid>
                            <Grid item md={12}>
                                <div className="mt-2 text-base font-semibold">建议</div>
                                <FormControl component="fieldset" variant="standard" className="w-full mt-1">
                                    <FormGroup className="w-full" sx={{ display: 'initial' }}>
                                        <FormControlLabel
                                            className="border border-solid border-[#999] rounded-xl pr-1 ml-0"
                                            control={
                                                <Checkbox
                                                    className="px-1 py-[2px]"
                                                    size="small"
                                                    checked={gilad}
                                                    onChange={handleChange}
                                                    name="gilad"
                                                />
                                            }
                                            label="Gilad Gray"
                                        />
                                        <FormControlLabel
                                            className="border border-solid border-[#999] rounded-xl pr-1 ml-0"
                                            control={
                                                <Checkbox
                                                    className="px-1 py-[2px]"
                                                    size="small"
                                                    checked={gilad}
                                                    onChange={handleChange}
                                                    name="gilad"
                                                />
                                            }
                                            label="Gilad Gray"
                                        />
                                    </FormGroup>
                                </FormControl>
                            </Grid>
                        </Grid>
                    </form>
                </CardContent>
                <Divider />
                <CardActions>
                    <Grid container justifyContent="flex-end">
                        <Button variant="contained" type="button" color="secondary" onClick={() => {}}>
                            确认
                        </Button>
                    </Grid>
                </CardActions>
            </MainCard>
        </Modal>
    );
};
