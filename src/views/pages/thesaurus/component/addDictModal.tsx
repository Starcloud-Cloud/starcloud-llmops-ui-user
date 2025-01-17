import {
    Button,
    CardActions,
    CardContent,
    Divider,
    FormControl,
    Grid,
    IconButton,
    InputLabel,
    MenuItem,
    Modal,
    Select,
    TextField
} from '@mui/material';
import MainCard from 'ui-component/cards/MainCard';
import CloseIcon from '@mui/icons-material/Close';
import { useFormik } from 'formik';
import { COUNTRY_LIST } from 'views/pages/listing-builder/data';
import { dictAdd } from 'api/listing/thesaurus';
import { dispatch } from 'store';
import { openSnackbar } from 'store/slices/snackbar';
import * as yup from 'yup';

type AddDictModalProps = {
    open: boolean;
    handleClose: () => void;
    forceUpdate: (update: any) => void;
};

export const AddDictModal = ({ open, handleClose, forceUpdate }: AddDictModalProps) => {
    const formik = useFormik({
        initialValues: {
            name: '',
            endpoint: 'US'
        },
        validationSchema: yup.object({
            name: yup.string().required('站点不能为空'),
            endpoint: yup.string().required('词库名称不能为空')
        }),
        onSubmit: async (values) => {
            const res = await dictAdd(values);
            if (res) {
                dispatch(
                    openSnackbar({
                        open: true,
                        message: '操作成功',
                        variant: 'alert',
                        alert: {
                            color: 'success'
                        },
                        anchorOrigin: { vertical: 'top', horizontal: 'center' },
                        close: false
                    })
                );
            }
            forceUpdate({});
            handleClose();
        }
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
                title={'新建词库'}
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
                    <form className="mt-2">
                        <Grid container>
                            <Grid item md={12}>
                                <FormControl fullWidth>
                                    <InputLabel size="small" id="model">
                                        站点
                                    </InputLabel>
                                    <Select
                                        size="small"
                                        labelId="endpoint"
                                        label="endpoint"
                                        id="endpoint"
                                        name="endpoint"
                                        value={formik.values.endpoint}
                                        onChange={formik.handleChange}
                                        error={formik.touched.endpoint && Boolean(formik.errors.endpoint)}
                                    >
                                        {COUNTRY_LIST.map((item: any) => (
                                            <MenuItem key={item.key} value={item.key} className="flex items-center">
                                                <div className="flex items-center">
                                                    {item.icon}
                                                    <span className="ml-1">{item.label}</span>
                                                </div>
                                            </MenuItem>
                                        ))}
                                    </Select>
                                </FormControl>
                            </Grid>
                            <Grid item md={12} className="mt-4">
                                <TextField
                                    size="small"
                                    label={'名称'}
                                    fullWidth
                                    id="name"
                                    name="name"
                                    color="secondary"
                                    value={formik.values.name}
                                    onChange={formik.handleChange}
                                    error={formik.touched.name && Boolean(formik.errors.name)}
                                    helperText={formik.touched.name && formik.errors.name}
                                />
                            </Grid>
                        </Grid>
                    </form>
                </CardContent>
                <Divider />
                <CardActions>
                    <Grid container justifyContent="flex-end">
                        <Button variant="contained" type="button" color="secondary" onClick={() => formik.handleSubmit()}>
                            确认
                        </Button>
                    </Grid>
                </CardActions>
            </MainCard>
        </Modal>
    );
};
