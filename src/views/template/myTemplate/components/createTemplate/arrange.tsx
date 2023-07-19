import {
    Box,
    Typography,
    TextField,
    Divider,
    Button,
    IconButton,
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    FormControl,
    FormControlLabel,
    Select,
    Menu,
    MenuItem,
    InputLabel,
    Switch,
    Tooltip
} from '@mui/material';
import SubCard from 'ui-component/cards/SubCard';

import CloseIcon from '@mui/icons-material/Close';
import DeleteIcon from '@mui/icons-material/Delete';
import MoreHorizIcon from '@mui/icons-material/MoreHoriz';
import ChatBubbleIcon from '@mui/icons-material/ChatBubble';
import BorderColorIcon from '@mui/icons-material/BorderColor';
import fun from 'assets/images/category/fun.svg';
import Add from '@mui/icons-material/Add';
import AddCircleSharpIcon from '@mui/icons-material/AddCircleSharp';

import { t } from 'hooks/web/useI18n';

// import Form from 'views/template/components/form';
import Valida from 'views/template/myTemplate/components/createTemplate/validaForm';
import { useState } from 'react';
import { useFormik } from 'formik';
import * as yup from 'yup';
interface Option {
    label: string;
    value: string;
}
function BootstrapDialogTitle(props: any) {
    const { children, onClose, ...other } = props;

    return (
        <DialogTitle sx={{ m: 0, p: 2 }} {...other}>
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
                    <CloseIcon />
                </IconButton>
            ) : null}
        </DialogTitle>
    );
}

const validationSchema = yup.object({
    field: yup.string().required('variable is required'),
    label: yup.string().required('label is required')
});

function Arrange({ config, editChange, basisChange, statusChange, changeConfigs }: any) {
    const formik = useFormik({
        initialValues: {
            field: '',
            label: '',
            defaultValue: '',
            description: '',
            style: 'INPUT',
            isShow: true
        },
        validationSchema,
        onSubmit: (values) => {
            const oldValue = { ...config };
            if (title === 'Add') {
                if (!oldValue.steps[modal].variable) {
                    oldValue.steps[modal].variable = { variables: [] };
                }
                oldValue.steps[modal].variable.variables.push({ ...values, options });
            } else {
                oldValue.steps[modal].variable.variables[stepIndex] = {
                    ...oldValue.steps[modal].variable.variables[stepIndex],
                    ...values,
                    options
                };
            }
            changeConfigs(oldValue);
            handleClose();
        }
    });
    const [modal, setModal] = useState<number>(0);
    const [stepIndex, setStepIndex] = useState<number>(0);
    const [options, setOptions] = useState<Option[]>([]);
    //弹窗
    const [open, setOpen] = useState(false);
    const [title, setTitle] = useState('');
    const typeList = [
        { label: 'Input', value: 'INPUT' },
        { label: 'Textarea', value: 'TEXTAREA' },
        { label: 'Select', value: 'SELECT' }
    ];
    //关闭弹窗
    const handleClose = () => {
        formik.resetForm();
        setOptions([]);
        setOpen(false);
    };
    //添加变量
    const addVariable = () => {
        setOptions([...options, { label: 'label', value: 'value' }]);
    };
    //编辑变量
    const editModal = (row: any, i: number, index: number) => {
        for (let key in formik.values) {
            formik.setFieldValue(key, row[key]);
        }
        if (row.options) setOptions(row.options);
        setTitle('Edit');
        setModal(index);
        setStepIndex(i);
        setOpen(true);
    };
    //删除变量
    const delModal = (i: number, index: number) => {
        setModal(index);
        setStepIndex(i);
        const oldValues = { ...config };
        oldValues.steps[index].variable.variables.splice(i, 1);
        changeConfigs(oldValues);
    };
    const optionChange = (e: { target: { name: string; value: string } }, index: number) => {
        const { name, value } = e.target;
        const oldOption = [...options];
        const updatedOption = { ...oldOption[index], [name]: value };
        oldOption[index] = updatedOption;
        setOptions(oldOption);
    };
    const [expanded, setExpanded] = useState<(boolean | null | undefined)[]>([]);
    const expandChange = (index: number) => {
        let newValue = [...expanded];
        newValue = newValue.map((item: boolean | null | undefined) => false);
        newValue[index] = true;
        setExpanded(newValue);
    };
    //步骤名称是显示还是编辑状态
    const [editStatus, setEditStatus] = useState<(boolean | null | undefined)[]>([]);
    //步骤描述是显示还是编辑状态
    const [descStatus, setDescStatus] = useState<(boolean | null | undefined)[]>([]);
    //删除步骤的menu
    const [anchorEl, setAnchorEl] = useState<(null | HTMLElement)[]>([]);
    const menuOpen = anchorEl.map((item) => Boolean(item));
    const menuClick = (event: React.MouseEvent<HTMLButtonElement>, index: number) => {
        const newVal = [...anchorEl];
        newVal[index] = event.currentTarget;
        setAnchorEl(newVal);
    };
    const menuClose = (index: number) => {
        const newVal = [...anchorEl];
        newVal[index] = null;
        setAnchorEl(newVal);
    };
    //删除步骤
    const delStep = (index: number) => {
        const newValue = { ...config };
        newValue.steps.splice(index, 1);
        changeConfigs(newValue);
    };
    return (
        <Box>
            <Typography variant="h3">{t('myApp.flow')}</Typography>
            {config?.steps.map((item: any, index: number) => (
                <Box key={index}>
                    <SubCard
                        sx={{ position: 'relative', overflow: 'visible' }}
                        contentSX={{
                            padding: '0 !important',
                            height: '100%',
                            overflow: 'visible'
                        }}
                    >
                        <Box height="100px" display="flex" justifyContent="space-between" alignItems="center">
                            <Box display="flex" alignItems="center" flexWrap="wrap">
                                <Box
                                    width="3.125rem"
                                    height="3.125rem"
                                    display="flex"
                                    alignItems="center"
                                    justifyContent="center"
                                    border="1px solid rgba(76,76,102,.1)"
                                    borderRadius="6px"
                                    margin="0 8px"
                                >
                                    <img style={{ width: '2.5rem', height: '2.5rem' }} src={fun} alt="svg" />
                                </Box>
                                <Box display="flex" alignItems="end">
                                    <Typography fontWeight="600" fontSize="1.125rem">
                                        步骤{index + 1}：
                                    </Typography>
                                    {!editStatus[index] && (
                                        <Typography
                                            noWrap
                                            sx={{ width: { xs: '90px', sm: '200px', md: '450px', lg: '160px' } }}
                                            fontWeight="600"
                                            fontSize="1.125rem"
                                        >
                                            {item.name}
                                        </Typography>
                                    )}
                                    {editStatus[index] && (
                                        <Box sx={{ width: { xs: '90px', sm: '200px', md: '450px', lg: '160px' } }}>
                                            <TextField
                                                onBlur={() => {
                                                    const newValue = { ...editStatus };
                                                    newValue[index] = false;
                                                    setEditStatus(newValue);
                                                }}
                                                onChange={(e) => editChange({ num: index, label: e.target.name, value: e.target.value })}
                                                name="name"
                                                fullWidth
                                                autoFocus
                                                value={item.name}
                                                variant="standard"
                                            />
                                        </Box>
                                    )}
                                    {expanded[index] && (
                                        <>
                                            <Tooltip placement="top" title="编辑步骤名称">
                                                <IconButton
                                                    onClick={() => {
                                                        const newValue = { ...editStatus };
                                                        newValue[index] = true;
                                                        setEditStatus(newValue);
                                                    }}
                                                    size="small"
                                                >
                                                    <BorderColorIcon fontSize="small" />
                                                </IconButton>
                                            </Tooltip>
                                            <Tooltip placement="top" title={item.description ? item.description : '点击添加描述'}>
                                                <IconButton
                                                    onClick={() => {
                                                        const newValue = { ...editStatus };
                                                        newValue[index] = true;
                                                        setDescStatus(newValue);
                                                    }}
                                                    size="small"
                                                >
                                                    <ChatBubbleIcon fontSize="small" />
                                                </IconButton>
                                            </Tooltip>
                                        </>
                                    )}
                                    {descStatus[index] && (
                                        <Box position="absolute" top="70px" right="10px" zIndex={9999} width="380px">
                                            <TextField
                                                onBlur={() => {
                                                    const newValue = { ...editStatus };
                                                    newValue[index] = false;
                                                    setDescStatus(newValue);
                                                }}
                                                onChange={(e) => editChange({ num: index, label: e.target.name, value: e.target.value })}
                                                autoFocus
                                                name="description"
                                                fullWidth
                                                value={item.description}
                                                multiline
                                                minRows={4}
                                            />
                                        </Box>
                                    )}
                                </Box>
                            </Box>
                            <Box>
                                {!expanded[index] && (
                                    <Button
                                        onClick={() => {
                                            expandChange(index);
                                        }}
                                        size="small"
                                        color="secondary"
                                        variant="outlined"
                                        startIcon={<BorderColorIcon />}
                                    >
                                        编辑
                                    </Button>
                                )}
                                <IconButton
                                    aria-controls={menuOpen[index] ? 'basic-menu' : undefined}
                                    aria-haspopup="true"
                                    aria-expanded={menuOpen[index] ? 'true' : undefined}
                                    onClick={(e) => {
                                        menuClick(e, index);
                                    }}
                                >
                                    <MoreHorizIcon />
                                </IconButton>
                                <Menu
                                    id="basic-menu"
                                    open={menuOpen[index] ? true : false}
                                    onClose={() => {
                                        menuClose(index);
                                    }}
                                    anchorEl={anchorEl[index]}
                                >
                                    <MenuItem>
                                        <DeleteIcon
                                            color="error"
                                            onClick={() => {
                                                const newVal = [...anchorEl];
                                                newVal[index] = null;
                                                setAnchorEl(newVal);
                                                delStep(index);
                                            }}
                                        />
                                        删除
                                    </MenuItem>
                                </Menu>
                            </Box>
                        </Box>
                        {expanded[index] && <Divider />}
                        {expanded[index] && (
                            <Valida
                                variables={item.flowStep.variable.variables}
                                basisChange={basisChange}
                                index={index}
                                setModal={setModal}
                                setOpen={setOpen}
                                setTitle={setTitle}
                                statusChange={statusChange}
                                editModal={editModal}
                                delModal={delModal}
                            />
                        )}
                    </SubCard>
                    <IconButton color="secondary" sx={{ display: 'block', margin: '5px auto', fontSize: 'unset' }}>
                        <AddCircleSharpIcon />
                    </IconButton>
                </Box>
            ))}
            <Dialog onClose={handleClose} aria-labelledby="customized-dialog-title" open={open}>
                <BootstrapDialogTitle id="customized-dialog-title" onClose={handleClose}>
                    {title}
                </BootstrapDialogTitle>
                <DialogContent dividers>
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
                            label={t('myApp.value')}
                            value={formik.values.defaultValue}
                            onChange={formik.handleChange}
                            InputLabelProps={{ shrink: true }}
                            helperText={' '}
                        />
                        <TextField
                            fullWidth
                            id="description"
                            name="description"
                            label={t('myApp.desc')}
                            value={formik.values.description}
                            onChange={formik.handleChange}
                            InputLabelProps={{ shrink: true }}
                            helperText={' '}
                        />
                        <FormControl fullWidth>
                            <InputLabel>{t('myApp.type')}</InputLabel>
                            <Select onChange={formik.handleChange} name="style" value={formik.values.style} label={t('myApp.type')}>
                                {typeList.map((el: any) => (
                                    <MenuItem key={el.value} value={el.value}>
                                        {el.label}
                                    </MenuItem>
                                ))}
                            </Select>
                        </FormControl>
                        <FormControlLabel
                            control={<Switch name="isShow" defaultChecked onChange={formik.handleChange} value={formik.values.isShow} />}
                            label={t('myApp.isShow')}
                            labelPlacement="start"
                        />
                        {formik.values.style === 'SELECT' && (
                            <Box>
                                {options.map((item, vIndex: number) => (
                                    <Box key={vIndex}>
                                        <TextField
                                            name="label"
                                            label="label"
                                            value={item.label}
                                            onChange={(e) => optionChange(e, vIndex)}
                                            InputLabelProps={{ shrink: true }}
                                            helperText=" "
                                        />
                                        <span style={{ display: 'inline-block', margin: '20px 10px 0 10px' }}>—</span>
                                        <TextField
                                            name="value"
                                            label="value"
                                            value={item.value}
                                            onChange={(e) => optionChange(e, vIndex)}
                                            InputLabelProps={{ shrink: true }}
                                            helperText=" "
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
                        autoFocus
                        onClick={() => {
                            formik.handleSubmit();
                        }}
                    >
                        {t('myApp.confirm')}
                    </Button>
                </DialogActions>
            </Dialog>
        </Box>
    );
}
export default Arrange;
