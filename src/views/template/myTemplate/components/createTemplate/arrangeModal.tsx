import {
    Box,
    TextField,
    Button,
    IconButton,
    DialogTitle,
    FormControl,
    FormControlLabel,
    Select,
    MenuItem,
    InputLabel,
    Switch
} from '@mui/material';
import { Add, Close } from '@mui/icons-material';
import { Modal } from 'antd';
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

const validationSchema = yup.object({
    field: yup
        .string()
        .required('变量 KEY 是必填的')
        .matches(/^[a-zA-Z0-9_-]+$/, '只能输入字母、数字、_、-')
        .max(20, '最多输入20个字符'),
    label: yup.string().required(' 变量名称是必填的')
});
const ArrangeModal = ({
    open,
    setOpen,
    variableStyle,
    title,
    detail,
    row,
    modal,
    changevariable
}: {
    open: boolean;
    variableStyle?: any[];
    setOpen: () => void;
    title: string;
    detail: any;
    row: any;
    modal?: number;
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
        <Modal
            title={title}
            open={open}
            onCancel={setOpen}
            okButtonProps={{ disabled: row?.group === 'SYSTEM' }}
            onOk={() => {
                formik.handleSubmit();
            }}
        >
            <div>像这样将这个变量添加到提示符中</div>
            <div>{'{' + formik.values.field + '}'}</div>
            <form onSubmit={formik.handleSubmit}>
                <TextField
                    fullWidth
                    id="field"
                    name="field"
                    color="secondary"
                    required
                    label={t('myApp.field')}
                    value={formik.values.field}
                    onChange={formik.handleChange}
                    InputLabelProps={{ shrink: true }}
                    error={formik.touched.field && Boolean(formik.errors.field)}
                    helperText={formik.touched.field && formik.errors.field ? String(formik.errors.field) : ''}
                />
                <TextField
                    fullWidth
                    id="label"
                    name="label"
                    color="secondary"
                    sx={{ mt: 2 }}
                    required
                    label={t('myApp.name')}
                    value={formik.values.label}
                    onChange={formik.handleChange}
                    InputLabelProps={{ shrink: true }}
                    error={formik.touched.label && Boolean(formik.errors.label)}
                    helperText={formik.touched.label && formik.errors.label ? String(formik.errors.label) : ''}
                />
                <TextField
                    fullWidth
                    id="defaultValue"
                    name="defaultValue"
                    color="secondary"
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
                    helperText={''}
                />
                <TextField
                    fullWidth
                    id="description"
                    name="description"
                    color="secondary"
                    sx={{ mt: 2 }}
                    label={t('myApp.desc')}
                    value={formik.values.description}
                    onChange={formik.handleChange}
                    InputLabelProps={{ shrink: true }}
                    helperText={''}
                />
                {detail?.type === 'MEDIA_MATRIX' && (
                    <FormControl color="secondary" fullWidth sx={{ mt: 2 }}>
                        <InputLabel>变量分组</InputLabel>
                        <Select color="secondary" onChange={formik.handleChange} name="group" value={formik.values.group} label="变量分组">
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
                <FormControl color="secondary" fullWidth sx={{ mt: 2 }}>
                    <InputLabel>{t('myApp.type')}</InputLabel>
                    <Select
                        color="secondary"
                        onChange={formik.handleChange}
                        name="style"
                        value={formik.values.style}
                        label={t('myApp.type')}
                    >
                        {variableStyle?.map((el: any) => (
                            <MenuItem key={el.value} value={el.value}>
                                {el.label}
                            </MenuItem>
                        ))}
                    </Select>
                </FormControl>
                <FormControlLabel
                    sx={{ mt: 2 }}
                    control={
                        <Switch
                            name="isShow"
                            color="secondary"
                            defaultChecked
                            onChange={formik.handleChange}
                            value={formik.values.isShow}
                        />
                    }
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
                                    color="secondary"
                                    value={item.label}
                                    onChange={(e) => optionChange(e, vIndex)}
                                    InputLabelProps={{ shrink: true }}
                                />
                                <span className="block">—</span>
                                <TextField
                                    name="value"
                                    label="value"
                                    color="secondary"
                                    value={item.value}
                                    onChange={(e) => optionChange(e, vIndex)}
                                    InputLabelProps={{ shrink: true }}
                                />
                                <TextField
                                    color="secondary"
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
        </Modal>
    );
};
export default ArrangeModal;
