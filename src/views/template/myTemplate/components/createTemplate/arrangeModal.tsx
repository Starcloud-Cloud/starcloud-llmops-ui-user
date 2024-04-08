import {
    Box,
    Typography,
    TextField,
    Button,
    IconButton,
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    FormControl,
    FormControlLabel,
    Select,
    MenuItem,
    InputLabel,
    Switch
} from '@mui/material';
import { Add, Close } from '@mui/icons-material';
import { useEffect, useState } from 'react';
import { useFormik } from 'formik';
import _ from 'lodash-es';
import * as yup from 'yup';
import { verifyJSON, changeJSONValue } from 'views/template/components/validaForm';
import { dispatch } from 'store';
import { openSnackbar } from 'store/slices/snackbar';
import { t } from 'hooks/web/useI18n';
interface Option {
    label: string;
    value: string;
    description?: string;
}
function BootstrapDialogTitle(props: any) {
    const { children, onClose, ...other } = props;

    return (
        <DialogTitle sx={{ m: 0, px: 2 }} {...other}>
            {children}
            {onClose ? (
                <IconButton
                    aria-label="close"
                    onClick={onClose}
                    sx={{
                        position: 'absolute',
                        right: 8,
                        top: 8,
                        color: (theme) => theme.palette.grey[500]
                    }}
                >
                    <Close />
                </IconButton>
            ) : null}
        </DialogTitle>
    );
}

const validationSchema = yup.object({
    field: yup
        .string()
        .required('variable is required')
        .matches(/^[A-Z0-9_-]+$/, '只能输入大写字母、数字、_、-')
        .max(20, '最多输入20个字符'),
    label: yup.string().required('label is required')
});
const ArrangeModal = ({
    open,
    variableStyle,
    handleClose,
    title,
    detail,
    row,
    modal,
    changevariable
}: {
    open: boolean;
    variableStyle?: any[];
    handleClose: (data: boolean) => void;
    title: string;
    detail: any;
    row: any;
    modal: number;
    changevariable: (data: any) => void;
}) => {
    const formik = useFormik({
        initialValues: {
            field: '',
            label: '',
            defaultValue: '',
            description: '',
            style: 'INPUT',
            group: 'PARAMS',
            isShow: true
        },
        validationSchema,
        onSubmit: (values) => {
            if (values.style === 'JSON' && values.defaultValue) {
                if (!verifyJSON(values.defaultValue)) {
                    dispatch(
                        openSnackbar({
                            open: true,
                            message: '默认值必须是 JSON 格式',
                            variant: 'alert',
                            alert: {
                                color: 'error'
                            },
                            close: false,
                            anchorOrigin: { vertical: 'top', horizontal: 'center' },
                            transition: 'SlideLeft'
                        })
                    );
                } else {
                    changevariable({ values, options });
                }
            } else {
                changevariable({ values, options });
            }
        }
    });
    const [options, setOptions] = useState<Option[]>([]);
    //添加下拉框子项
    const addVariable = () => {
        setOptions([..._.cloneDeep(options), { label: 'label', value: 'value', description: '' }]);
    };
    //改变下拉框的子项
    const optionChange = (e: { target: { name: string; value: string } }, index: number) => {
        const { name, value } = e.target;
        const oldOption = _.cloneDeep(options);
        const updatedOption = { ...oldOption[index], [name]: value };
        oldOption[index] = updatedOption;
        setOptions(oldOption);
    };
    useEffect(() => {
        if (title === '编辑') {
            if (row.options) setOptions(row.options);

            formik.setValues(row);
        }
    }, [title]);
    return (
        <Dialog onClose={handleClose} aria-labelledby="customized-dialog-title" open={open}>
            <BootstrapDialogTitle id="customized-dialog-title" onClose={handleClose}>
                <Typography fontSize="1.25rem" fontWeight={600}>
                    {title}
                </Typography>
            </BootstrapDialogTitle>
            <DialogContent dividers>
                <Typography variant="body2">{t('market.addPrompt')}:</Typography>
                <Typography variant="body2" mb={2}>
                    {'{STEP.' + detail?.config?.steps[modal].field + '.' + formik.values.field + '}'}
                </Typography>
                <form onSubmit={formik.handleSubmit}>
                    <TextField
                        fullWidth
                        id="field"
                        name="field"
                        required
                        label={t('myApp.field')}
                        value={formik.values.field}
                        onChange={formik.handleChange}
                        InputLabelProps={{ shrink: true }}
                        error={formik.touched.field && Boolean(formik.errors.field)}
                        helperText={formik.touched.field && formik.errors.field ? String(formik.errors.field) : ' '}
                    />
                    <TextField
                        fullWidth
                        id="label"
                        name="label"
                        sx={{ mt: 2 }}
                        required
                        label={t('myApp.name')}
                        value={formik.values.label}
                        onChange={formik.handleChange}
                        InputLabelProps={{ shrink: true }}
                        error={formik.touched.label && Boolean(formik.errors.label)}
                        helperText={formik.touched.label && formik.errors.label ? String(formik.errors.label) : ' '}
                    />
                    <TextField
                        fullWidth
                        id="defaultValue"
                        name="defaultValue"
                        sx={{ mt: 2 }}
                        label={t('myApp.value')}
                        multiline={formik.values.style === 'JSON' ? true : false}
                        minRows={4}
                        value={formik.values.defaultValue}
                        onChange={formik.handleChange}
                        onBlur={(e) => {
                            formik.setFieldValue('defaultValue', changeJSONValue(e.target.value));
                        }}
                        InputLabelProps={{ shrink: true }}
                        helperText={' '}
                    />
                    <TextField
                        fullWidth
                        id="description"
                        name="description"
                        sx={{ mt: 2 }}
                        label={t('myApp.desc')}
                        value={formik.values.description}
                        onChange={formik.handleChange}
                        InputLabelProps={{ shrink: true }}
                        helperText={' '}
                    />
                    {detail?.type === 'MEDIA_MATRIX' && (
                        <FormControl fullWidth sx={{ mt: 2 }}>
                            <InputLabel>变量分组</InputLabel>
                            <Select onChange={formik.handleChange} name="group" value={formik.values.group} label="变量分组">
                                <MenuItem value={'ADVANCED'}>
                                    <div className="w-full flex justify-between items-end">
                                        <div>高级变量</div>
                                        <div className="text-xs text-black/50">创建者在配置页面可编辑删除，普通用户不能编辑删除</div>
                                    </div>
                                </MenuItem>
                                <MenuItem value={'PARAMS'}>
                                    <div className="w-full flex justify-between items-end">
                                        <div>通用变量</div>
                                        <div className="text-xs text-black/50">所有用户都可编辑删除</div>
                                    </div>
                                </MenuItem>
                                <MenuItem disabled={true} value={'SYSTEM'}>
                                    <div className="w-full flex justify-between items-end">
                                        <div>系统变量</div>
                                        <div className="text-xs text-black/50">所有用户都不可编辑删除</div>
                                    </div>
                                </MenuItem>
                            </Select>
                        </FormControl>
                    )}
                    <FormControl fullWidth sx={{ mt: detail?.type === 'MEDIA_MATRIX' ? 4 : 2 }}>
                        <InputLabel>{t('myApp.type')}</InputLabel>
                        <Select onChange={formik.handleChange} name="style" value={formik.values.style} label={t('myApp.type')}>
                            {variableStyle?.map((el: any) => (
                                <MenuItem key={el.value} value={el.value}>
                                    {el.label}
                                </MenuItem>
                            ))}
                        </Select>
                    </FormControl>
                    <FormControlLabel
                        sx={{ mt: 2 }}
                        control={<Switch name="isShow" defaultChecked onChange={formik.handleChange} value={formik.values.isShow} />}
                        label={t('myApp.isShow')}
                        labelPlacement="start"
                    />
                    {(formik.values.style === 'SELECT' || formik.values.style === 'RADIO') && (
                        <Box>
                            {options.map((item, vIndex: number) => (
                                <Box className="flex gap-2 items-center" key={vIndex} mt={2}>
                                    <TextField
                                        name="label"
                                        label="label"
                                        value={item.label}
                                        onChange={(e) => optionChange(e, vIndex)}
                                        InputLabelProps={{ shrink: true }}
                                    />
                                    <span className="block">—</span>
                                    <TextField
                                        name="value"
                                        label="value"
                                        value={item.value}
                                        onChange={(e) => optionChange(e, vIndex)}
                                        InputLabelProps={{ shrink: true }}
                                    />
                                    <TextField
                                        variant="standard"
                                        name="description"
                                        label="description"
                                        value={item.description}
                                        onChange={(e) => optionChange(e, vIndex)}
                                        InputLabelProps={{ shrink: true }}
                                    />
                                </Box>
                            ))}
                            <br />
                            <Button size="small" variant="outlined" startIcon={<Add />} onClick={addVariable}>
                                {t('myApp.addOption')}
                            </Button>
                        </Box>
                    )}
                </form>
            </DialogContent>
            <DialogActions>
                <Button
                    disabled={row?.group === 'SYSTEM'}
                    autoFocus
                    onClick={() => {
                        formik.handleSubmit();
                    }}
                >
                    {t('myApp.confirm')}
                </Button>
            </DialogActions>
        </Dialog>
    );
};
export default ArrangeModal;
