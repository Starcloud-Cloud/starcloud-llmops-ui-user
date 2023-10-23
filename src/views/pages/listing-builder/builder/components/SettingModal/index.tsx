import { Button, CardActions, CardContent, Divider, Grid, IconButton, Modal, TextField } from '@mui/material';
import MainCard from 'ui-component/cards/MainCard';
import CloseIcon from '@mui/icons-material/Close';
import { useFormik } from 'formik';
import * as yup from 'yup';

type IAddAiModalProps = {
    open: boolean;
    handleClose: () => void;
};

export const SettingModal = ({ open, handleClose }: IAddAiModalProps) => {
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
                                    label={'Title Max'}
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
                            <Grid sx={{ mt: 2 }} item md={12}>
                                <TextField
                                    size="small"
                                    label={'Feature Max'}
                                    fullWidth
                                    id="clientFeatures"
                                    name="clientFeatures"
                                    color="secondary"
                                    InputLabelProps={{ shrink: true }}
                                    value={formik.values.clientFeatures}
                                    onChange={formik.handleChange}
                                    error={formik.touched.clientFeatures && Boolean(formik.errors.clientFeatures)}
                                    helperText={formik.touched.clientFeatures && formik.errors.clientFeatures}
                                />
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
