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
import HelpIcon from '@mui/icons-material/Help';
import Add from '@mui/icons-material/Add';
import AddCircleSharpIcon from '@mui/icons-material/AddCircleSharp';
import SouthIcon from '@mui/icons-material/South';

import { t } from 'hooks/web/useI18n';

import { stepList } from 'api/template';
import Valida from 'views/template/myTemplate/components/createTemplate/validaForm';
import { useState, useEffect, memo } from 'react';
import { useFormik } from 'formik';
import _ from 'lodash-es';
import * as yup from 'yup';
interface Option {
    label: string;
    value: string;
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
                    <CloseIcon />
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

function Arrange({ config, editChange, basisChange, statusChange, changeConfigs }: any) {
    const [stepTitle, setStepTitle] = useState<string[]>([]);

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
            const oldValue = _.cloneDeep(config);
            if (title === t('myApp.add')) {
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
        { label: t('myApp.input'), value: 'INPUT' },
        { label: t('myApp.textarea'), value: 'TEXTAREA' },
        { label: t('myApp.select'), value: 'SELECT' }
    ];
    //关闭弹窗
    const handleClose = () => {
        formik.resetForm();
        setOptions([]);
        setOpen(false);
    };
    //添加变量
    const addVariable = () => {
        setOptions([..._.cloneDeep(options), { label: 'label', value: 'value' }]);
    };
    //编辑变量
    const editModal = (row: any, i: number, index: number) => {
        for (let key in formik.values) {
            formik.setFieldValue(key, row[key]);
        }
        if (row.options) setOptions(row.options);
        setTitle(t('myApp.edit'));
        setModal(index);
        setStepIndex(i);
        setOpen(true);
    };
    //删除变量
    const delModal = (i: number, index: number) => {
        setModal(index);
        setStepIndex(i);
        const oldValues = _.cloneDeep(config);
        oldValues.steps[index].variable.variables.splice(i, 1);
        changeConfigs(oldValues);
    };
    const optionChange = (e: { target: { name: string; value: string } }, index: number) => {
        const { name, value } = e.target;
        const oldOption = _.cloneDeep(options);
        const updatedOption = { ...oldOption[index], [name]: value };
        oldOption[index] = updatedOption;
        setOptions(oldOption);
    };
    const [expanded, setExpanded] = useState<(boolean | null | undefined)[]>([]);
    const expandChange = (index: number) => {
        const newallvalida = [...allvalida];
        newallvalida[index] = (allvalida[index] as number) + 1;
        setallvalida(newallvalida);
        let newValue = _.cloneDeep(expanded);
        newValue = newValue.map((item: boolean | null | undefined) => false);
        newValue[index] = true;
        setExpanded(newValue);
    };
    //判断步骤名称是否重复
    const [errIpt, setErrIpt] = useState<(null | undefined | boolean)[]>([]);
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
        const newValue = _.cloneDeep(config);
        newValue.steps.splice(index, 1);
        changeConfigs(newValue);
    };
    //增加步骤
    const [stepLists, setStepList] = useState<{ name: string; field: string; description: string }[]>([]);
    const [addAnchorEl, setAddAnchorEl] = useState<(null | HTMLElement)[]>([]);
    const addOpen = addAnchorEl.map((item) => Boolean(item));
    const addClick = (event: React.MouseEvent<HTMLButtonElement>, index: number) => {
        const newVal = [...addAnchorEl];
        newVal[index] = event.currentTarget;
        setAddAnchorEl(newVal);
    };
    const addClose = (index: number) => {
        const newVal = [...addAnchorEl];
        newVal[index] = null;
        setAddAnchorEl(newVal);
    };
    const stepEtch = (index: number, name: string, steps: any, newStep: any, i: number) => {
        if (steps.some((item: { name: string }) => item.name === name + index)) {
            stepEtch(index + 1, name, steps, newStep, i);
        } else {
            const Name = _.cloneDeep(newStep);
            Name.name = Name.name + index;
            Name.field = Name.field + index;
            const newValue = _.cloneDeep(config);
            newValue.steps.splice(i + 1, 0, Name);
            changeConfigs(newValue);
            let newVal = [...expanded];
            newVal = newVal.map(() => false);
            newVal[i + 1] = true;
            setExpanded(newVal);
        }
    };
    const addStep = (step: any, index: number) => {
        const newStep = _.cloneDeep(step);
        stepEtch(index + 1, newStep.name, config.steps, newStep, index);
    };
    useEffect(() => {
        if (config) {
            setStepTitle(config.steps.map((item: { name: string }) => item.name));
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);
    useEffect(() => {
        setallvalidas(
            config?.steps.map((item: any) => {
                return item.flowStep.variable.variables.some((el: { defaultValue: string | null }) => {
                    return el.defaultValue === '';
                });
            })
        );
    }, [expanded]);

    //改变值让子组件检测到
    const [allvalida, setallvalida] = useState<(number | null)[]>([]);
    const [allvalidas, setallvalidas] = useState<(boolean | null)[]>([]);

    return (
        <Box>
            <Typography variant="h5" fontSize="1rem" mb={1}>
                {t('myApp.flow')}
            </Typography>
            {config?.steps.map((item: any, index: number) => (
                <Box key={index}>
                    {index !== 0 && (
                        <Box display="flex" justifyContent="center">
                            <SouthIcon />
                        </Box>
                    )}
                    <SubCard
                        sx={{ overflow: 'visible' }}
                        contentSX={{
                            padding: '0 !important',
                            height: '100%',
                            overflow: 'visible'
                        }}
                    >
                        <Box
                            sx={{
                                borderRadius: '4px',
                                overflow: 'visible',
                                borderLeft: allvalidas[index] ? '5px solid #ff6376' : 'none'
                            }}
                            height="100px"
                            display="flex"
                            justifyContent="space-between"
                            alignItems="center"
                        >
                            <Box display="flex" alignItems="center" flexWrap="wrap" overflow="visible">
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
                                    <img
                                        style={{ width: '2.5rem', height: '2.5rem' }}
                                        src={require('../../../../../assets/images/carryOut/' + item.flowStep.icon + '.svg')}
                                        alt="svg"
                                    />
                                </Box>
                                <Box display="flex" alignItems="center">
                                    <Typography variant="h4">
                                        {t('market.steps')}
                                        {index + 1}：
                                    </Typography>
                                    {!editStatus[index] && (
                                        <Typography
                                            noWrap
                                            sx={{ maxWidth: { xs: '90px', sm: '200px', md: '450px', lg: '160px' } }}
                                            variant="h4"
                                        >
                                            {item.name}
                                        </Typography>
                                    )}
                                    {editStatus[index] && (
                                        <Box sx={{ width: { xs: '90px', sm: '180px', md: '400px', lg: '140px' } }}>
                                            <TextField
                                                onBlur={() => {
                                                    const newVal = [...errIpt];
                                                    if (!stepTitle[index]) {
                                                        const newValue = { ...editStatus };
                                                        newValue[index] = false;
                                                        setEditStatus(newValue);
                                                    } else if (
                                                        config?.steps.every((value: { name: string }, i: number) => {
                                                            if (index === i) {
                                                                return true;
                                                            } else {
                                                                return value.name !== item.name;
                                                            }
                                                        })
                                                    ) {
                                                        newVal[index] = false;
                                                        setErrIpt(newVal);
                                                        const newValue = { ...editStatus };
                                                        newValue[index] = false;
                                                        setEditStatus(newValue);
                                                        editChange({ num: index, label: 'name', value: stepTitle[index], flag: true });
                                                    } else {
                                                        newVal[index] = true;
                                                        setErrIpt(newVal);
                                                    }
                                                }}
                                                error={errIpt[index] ? true : false}
                                                onChange={(e) => {
                                                    const { value }: { name: string; value: string } = e.target;
                                                    const titIndex = [...stepTitle];
                                                    titIndex[index] = value;
                                                    setStepTitle(titIndex);
                                                }}
                                                helperText={errIpt[index] ? '步骤名称不能重复' : ' '}
                                                name="name"
                                                fullWidth
                                                autoFocus
                                                value={stepTitle[index]}
                                                variant="standard"
                                            />
                                        </Box>
                                    )}
                                    {/* 编辑名称和描述 */}
                                    {expanded[index] && (
                                        <>
                                            <Tooltip placement="top" title={t('market.editName')}>
                                                <IconButton
                                                    onClick={() => {
                                                        if (stepTitle[index] === '') {
                                                            const val = [...stepTitle];
                                                            val[index] = JSON.parse(JSON.stringify(item.name));
                                                            setStepTitle(val);
                                                        }
                                                        const newValue = { ...editStatus };
                                                        newValue[index] = true;
                                                        setEditStatus(newValue);
                                                    }}
                                                    size="small"
                                                >
                                                    <BorderColorIcon fontSize="small" />
                                                </IconButton>
                                            </Tooltip>
                                            <Box display="inline-block" position="relative">
                                                <Tooltip placement="top" title={item.description ? item.description : t('market.addDesc')}>
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
                                                {descStatus[index] && (
                                                    <Box position="absolute" bottom="-120px" right="-200px" zIndex={10} width="380px">
                                                        <TextField
                                                            onBlur={() => {
                                                                const newValue = { ...editStatus };
                                                                newValue[index] = false;
                                                                setDescStatus(newValue);
                                                            }}
                                                            onChange={(e) =>
                                                                editChange({ num: index, label: e.target.name, value: e.target.value })
                                                            }
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
                                        </>
                                    )}
                                </Box>
                            </Box>
                            <Box display="flex" alignItems="center">
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
                                        {t('market.desc')}
                                    </Button>
                                )}
                                {expanded[index] && (
                                    <Tooltip placement="top" title={item.flowStep.description}>
                                        <HelpIcon fontSize="small" />
                                    </Tooltip>
                                )}
                                <IconButton
                                    aria-controls={menuOpen[index] ? 'del' + index : undefined}
                                    aria-haspopup="true"
                                    aria-expanded={menuOpen[index] ? 'true' : undefined}
                                    onClick={(e) => {
                                        menuClick(e, index);
                                    }}
                                >
                                    <MoreHorizIcon />
                                </IconButton>
                                <Menu
                                    id={'del' + index}
                                    open={menuOpen[index] ? true : false}
                                    onClose={() => {
                                        menuClose(index);
                                    }}
                                    anchorEl={anchorEl[index]}
                                >
                                    <MenuItem
                                        disabled={config?.steps.length === 1}
                                        onClick={() => {
                                            delStep(index);
                                            const newVal = [...anchorEl];
                                            newVal[index] = null;
                                            setAnchorEl(newVal);
                                        }}
                                    >
                                        <DeleteIcon color="error" />
                                        {t('market.delete')}
                                    </MenuItem>
                                </Menu>
                            </Box>
                        </Box>
                        {expanded[index] && <Divider />}
                        <Box sx={{ display: expanded[index] ? 'block' : 'none' }}>
                            <Valida
                                key={item.field}
                                variable={item.variable?.variables}
                                variables={item.flowStep.variable.variables}
                                responent={item.flowStep.response}
                                buttonLabel={item.buttonLabel}
                                basisChange={basisChange}
                                index={index}
                                allvalida={allvalida[index]}
                                setModal={(i) => {
                                    setModal(i);
                                }}
                                setOpen={setOpen}
                                setTitle={setTitle}
                                editChange={editChange}
                                statusChange={statusChange}
                                editModal={editModal}
                                delModal={delModal}
                            />
                        </Box>
                    </SubCard>
                    <Box textAlign="center" fontSize="25px" fontWeight={600} mt={1}>
                        |
                    </Box>
                    <IconButton
                        aria-controls={addOpen[index] ? 'add' + index : undefined}
                        aria-haspopup="true"
                        aria-expanded={addOpen[index] ? 'true' : undefined}
                        onClick={(e) => {
                            stepList().then((res) => {
                                setStepList(res);
                            });
                            addClick(e, index);
                        }}
                        color="secondary"
                        sx={{ display: 'block', margin: '0 auto', fontSize: 'unset' }}
                    >
                        <AddCircleSharpIcon />
                    </IconButton>
                    <Menu
                        id={'add' + index}
                        open={addOpen[index] ? true : false}
                        onClose={() => {
                            addClose(index);
                        }}
                        anchorEl={addAnchorEl[index]}
                    >
                        {stepLists.map((step) => (
                            <MenuItem
                                sx={{ display: 'block', maxWidth: '500px', whiteSpace: 'normal' }}
                                key={step.field}
                                onClick={() => {
                                    addStep(step, index);
                                    const newVal = [...anchorEl];
                                    newVal[index] = null;
                                    setAddAnchorEl(newVal);
                                }}
                            >
                                <Typography variant="h5">{step.name}</Typography>
                                <Typography>{step.description}</Typography>
                            </MenuItem>
                        ))}
                    </Menu>
                </Box>
            ))}
            <Dialog onClose={handleClose} aria-labelledby="customized-dialog-title" open={open}>
                <BootstrapDialogTitle id="customized-dialog-title" onClose={handleClose}>
                    <Typography fontSize="1.25rem" fontWeight={600}>
                        {title}
                    </Typography>
                </BootstrapDialogTitle>
                <DialogContent dividers>
                    <Typography variant="body2">{t('market.addPrompt')}:</Typography>
                    <Typography variant="body2" mb={2}>
                        {'{STEP.' + config?.steps[modal].field + '.' + formik.values.field + '}'}
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
                            value={formik.values.defaultValue}
                            onChange={formik.handleChange}
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
                        <FormControl fullWidth sx={{ mt: 2 }}>
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
                            sx={{ mt: 2 }}
                            control={<Switch name="isShow" defaultChecked onChange={formik.handleChange} value={formik.values.isShow} />}
                            label={t('myApp.isShow')}
                            labelPlacement="start"
                        />
                        {formik.values.style === 'SELECT' && (
                            <Box>
                                {options.map((item, vIndex: number) => (
                                    <Box key={vIndex} mt={2}>
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
const arePropsEqual = (prevProps: any, nextProps: any) => {
    return JSON.stringify(prevProps?.config?.steps) === JSON.stringify(nextProps?.config?.steps);
};
export default memo(Arrange, arePropsEqual);
