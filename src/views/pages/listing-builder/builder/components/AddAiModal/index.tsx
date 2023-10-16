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
    Tab,
    Tabs,
    TextField
} from '@mui/material';
import MainCard from 'ui-component/cards/MainCard';
import CloseIcon from '@mui/icons-material/Close';
import { useState } from 'react';
import { TabPanel } from 'views/template/myChat/createChat';
import { useFormik } from 'formik';
import * as yup from 'yup';

type IAddAiModalProps = {
    open: boolean;
    handleClose: () => void;
};

function a11yProps(index: number) {
    return {
        id: `simple-tab-${index}`,
        'aria-controls': `simple-tabpanel-${index}`
    };
}

export const AddAiModal = ({ open, handleClose }: IAddAiModalProps) => {
    const [tab, setTab] = useState(0);
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
                title={'新增'}
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
                        p: 1
                    }}
                >
                    <form onSubmit={formik.handleSubmit} className="mt-2">
                        <Grid container>
                            <Grid sx={{ mt: 1 }} item md={12}>
                                <TextField
                                    size="small"
                                    label={'产品特征'}
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
                            <Grid sx={{ mt: 1 }} item md={12}>
                                <TextField
                                    size="small"
                                    label={'客户特征'}
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
                            <Grid sx={{ mt: 1 }} item md={12}>
                                <TextField
                                    size="small"
                                    label={'不希望出现的词汇'}
                                    fullWidth
                                    id="voidWord"
                                    name="voidWord"
                                    color="secondary"
                                    InputLabelProps={{ shrink: true }}
                                    value={formik.values.voidWord}
                                    onChange={formik.handleChange}
                                    error={formik.touched.voidWord && Boolean(formik.errors.voidWord)}
                                    helperText={formik.touched.voidWord && formik.errors.voidWord}
                                />
                            </Grid>
                            <Grid sx={{ mt: 1 }} item md={12} className="grid gap-3 grid-cols-3">
                                <div>
                                    <FormControl fullWidth>
                                        <InputLabel size="small" id="demo-simple-select-label">
                                            显示品牌名称
                                        </InputLabel>
                                        <Select
                                            size="small"
                                            labelId="demo-simple-select-label"
                                            id="demo-simple-select"
                                            // value={age}
                                            label="Age"
                                            // onChange={handleChange}
                                        >
                                            <MenuItem value={10}>展示在标题开头</MenuItem>
                                            <MenuItem value={20}>展示在标题结尾</MenuItem>
                                        </Select>
                                    </FormControl>
                                </div>
                                <div>
                                    <TextField
                                        size="small"
                                        label={'品牌名称'}
                                        fullWidth
                                        id="voidWord"
                                        name="voidWord"
                                        color="secondary"
                                        InputLabelProps={{ shrink: true }}
                                        value={formik.values.voidWord}
                                        onChange={formik.handleChange}
                                        error={formik.touched.voidWord && Boolean(formik.errors.voidWord)}
                                        helperText={formik.touched.voidWord && formik.errors.voidWord}
                                    />
                                </div>
                                <div>
                                    <FormControl fullWidth>
                                        <InputLabel size="small" id="demo-simple-select-label">
                                            语言风格
                                        </InputLabel>
                                        <Select
                                            size="small"
                                            labelId="demo-simple-select-label"
                                            id="demo-simple-select"
                                            // value={age}
                                            label="Age"
                                            // onChange={handleChange}
                                        >
                                            <MenuItem value={1}>正式</MenuItem>
                                            <MenuItem value={2}>感性</MenuItem>
                                            <MenuItem value={3}>鼓吹</MenuItem>
                                            <MenuItem value={4}>有激情</MenuItem>
                                            <MenuItem value={5}>又爆发力</MenuItem>
                                        </Select>
                                    </FormControl>
                                </div>
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
