import {
    Box,
    Typography,
    Grid,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    Button,
    IconButton,
    Switch,
    FormControl,
    InputLabel,
    Select,
    MenuItem,
    TextField,
    Tooltip,
    Chip,
    FormControlLabel
} from '@mui/material';
import { styled } from '@mui/material/styles';
import ArrowForwardIosSharpIcon from '@mui/icons-material/ArrowForwardIosSharp';
import MuiAccordion, { AccordionProps } from '@mui/material/Accordion';
import MuiAccordionSummary, { AccordionSummaryProps } from '@mui/material/AccordionSummary';
import MuiAccordionDetails from '@mui/material/AccordionDetails';
import copy from 'clipboard-copy';
import ErrorIcon from '@mui/icons-material/Error';
import ContentPaste from '@mui/icons-material/ContentPaste';
import { t } from 'hooks/web/useI18n';
import { Divider, Popconfirm, Input } from 'antd';
import { dispatch } from 'store';
import { openSnackbar } from 'store/slices/snackbar';
import MainCard from 'ui-component/cards/MainCard';
import Add from '@mui/icons-material/Add';
import SettingsIcon from '@mui/icons-material/Settings';
import DeleteIcon from '@mui/icons-material/Delete';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import CancelIcon from '@mui/icons-material/Cancel';

import { useFormik as Formik } from 'formik';
import editValidationSchema from 'hooks/useEditValid';
import _ from 'lodash-es';
import { Validas, Rows } from 'types/template';
import FormExecute from 'views/template/components/validaForm';
import { useState, memo, useEffect, useRef } from 'react';
const Accordion = styled((props: AccordionProps) => <MuiAccordion disableGutters elevation={0} square {...props} />)(({ theme }) => ({
    borderTop: `1px solid ${theme.palette.divider}`,
    borderBottom: `1px solid ${theme.palette.divider}`,
    '&:not(:last-child)': {
        borderBottom: 0
    },
    '&:before': {
        display: 'none'
    }
}));

const AccordionSummary = styled((props: AccordionSummaryProps) => (
    <MuiAccordionSummary expandIcon={<ArrowForwardIosSharpIcon sx={{ fontSize: '0.9rem' }} />} {...props} />
))(({ theme }) => ({
    backgroundColor: theme.palette.mode === 'dark' ? 'rgba(255, 255, 255, .05)' : 'rgba(0, 0, 0, .03)',
    flexDirection: 'row-reverse',
    '& .MuiAccordionSummary-expandIconWrapper.Mui-expanded': {
        transform: 'rotate(90deg)'
    },
    '& .MuiAccordionSummary-content': {
        marginLeft: theme.spacing(1)
    }
}));

const AccordionDetails = styled(MuiAccordionDetails)(({ theme }) => ({
    padding: theme.spacing(2),
    borderTop: '1px solid rgba(0, 0, 0, .125)'
}));
const Valida = ({
    title,
    handler,
    variable,
    variables,
    responent,
    buttonLabel,
    fields,
    basisChange,
    index,
    allvalida,
    editChange,
    setModal,
    setOpen,
    setTitle,
    statusChange,
    editModal,
    delModal
}: Validas) => {
    const { TextArea } = Input;
    useEffect(() => {
        if (Object.values(formik.values).some((value) => value === '')) {
            formik.handleSubmit();
        }
    }, [allvalida]);
    const typeList = [
        { label: t('myApp.input'), value: 'INPUT' },
        { label: t('myApp.textarea'), value: 'TEXTAREA' },
        { label: 'JSON 类型', value: 'JSON' }
    ];
    const fn = (data: any[]) => {
        const Data: Record<string, any> = {};
        data?.forEach((item: { field: string; value: string }) => {
            const { field, value } = item;
            Data[field] = value !== null && value !== undefined ? value : '';
        });
        return Data;
    };
    const formik = Formik({
        initialValues: fn(_.cloneDeep(variables)),
        validationSchema: editValidationSchema(_.cloneDeep(variables)),
        onSubmit: () => {}
    });
    const [expanded, setExpanded] = useState<string | false>('panel1');
    const handleChange = (panel: string) => (event: React.SyntheticEvent, isExpanded: boolean) => {
        setExpanded(isExpanded ? panel : false);
    };
    const timeoutRef = useRef<any>();
    const iptRef = useRef<any | null>(null);
    const changePrompt = (field: string, i: number) => {
        const newVal = _.cloneDeep(variables);
        const part1 = newVal[i].value.slice(0, iptRef?.current?.resizableTextArea?.textArea?.selectionStart);
        const part2 = newVal[i].value.slice(iptRef?.current?.resizableTextArea?.textArea?.selectionStart);
        newVal[i].value = `${part1}{STEP.${fields}.${field}}${part2}`;
        formik.setFieldValue('prompt', newVal[i].value);
        basisChange({ e: { name: 'prompt', value: newVal[i].value }, index, i, flag: false, values: true });
    };
    return (
        <Box py={1}>
            <form>
                <Accordion expanded={expanded === 'panel1'} onChange={handleChange('panel1')}>
                    <AccordionSummary expandIcon={<ExpandMoreIcon />} aria-controls="panel1a-content1" id="panel1a-header1">
                        {handler === 'VariableActionHandler' || handler === 'MaterialActionHandler' || formik.values.prompt ? (
                            <CheckCircleIcon fontSize="small" color="success" />
                        ) : (
                            <CancelIcon fontSize="small" color="error" />
                        )}
                        <Typography ml={2} fontSize="16px">
                            {handler === 'VariableActionHandler' || handler === 'MaterialActionHandler' ? '变量' : t('market.prompt')}
                        </Typography>
                    </AccordionSummary>
                    <AccordionDetails>
                        {variables?.map(
                            (el: any, i: number) =>
                                handler !== 'AssembleActionHandler' && (
                                    <Grid item md={12} xs={12} key={i}>
                                        {el.field === 'prompt' && (
                                            <>
                                                <Box display="flex" justifyContent="space-between" alignItems="center">
                                                    <Box display="flex" alignItems="center">
                                                        <Typography mr={1} variant="h5">
                                                            {t('market.' + el.field)}
                                                        </Typography>
                                                        <Tooltip placement="top" title={t('market.promptDesc')}>
                                                            <ErrorIcon fontSize="small" />
                                                        </Tooltip>
                                                    </Box>
                                                    <Box>
                                                        <FormControlLabel
                                                            label="是否显示"
                                                            control={
                                                                <Switch
                                                                    name="promptisShow"
                                                                    onChange={(e) => {
                                                                        basisChange({ e: e.target, index, i, flag: true });
                                                                    }}
                                                                    checked={el.isShow}
                                                                />
                                                            }
                                                        />
                                                    </Box>
                                                </Box>
                                                <TextArea
                                                    className="mt-[16px]"
                                                    status={formik.touched[el.field] && Boolean(formik.errors[el.field]) ? 'error' : ''}
                                                    ref={iptRef}
                                                    style={{ height: '200px' }}
                                                    value={formik.values[el.field]}
                                                    name={el.field}
                                                    onChange={(e) => {
                                                        formik.handleChange(e);
                                                        clearTimeout(timeoutRef.current);
                                                        timeoutRef.current = setTimeout(() => {
                                                            basisChange({ e: e.target, index, i, flag: false, values: true });
                                                        }, 300);
                                                    }}
                                                />
                                                {formik.touched[el.field] && formik.errors[el.field] ? (
                                                    <span className="text-[12px] text-[#f44336] mt-[5px] ml-[5px]">
                                                        {String(formik.errors[el.field])}
                                                    </span>
                                                ) : (
                                                    <span className="text-[12px] mt-[5px] ml-[5px]">{el.description}</span>
                                                )}
                                                {/* <TextField
                                            color="secondary"
                                            sx={{ mt: 2 }}
                                            inputRef={iptRef}
                                            placeholder={el.defaultValue}
                                            value={formik.values[el.field]}
                                            id={el.field}
                                            required
                                            name={el.field}
                                            multiline
                                            minRows={6}
                                            maxRows={6}
                                            InputLabelProps={{ shrink: true }}
                                            error={formik.touched[el.field] && Boolean(formik.errors[el.field])}
                                            helperText={
                                                formik.touched[el.field] && formik.errors[el.field]
                                                    ? String(formik.errors[el.field])
                                                    : el.description
                                            }
                                            onChange={(e) => {
                                                formik.handleChange(e);
                                                clearTimeout(timeoutRef.current);
                                                timeoutRef.current = setTimeout(() => {
                                                    basisChange({ e: e.target, index, i, flag: false, values: true });
                                                }, 300);
                                            }}
                                            fullWidth
                                        /> */}

                                                <Box mb={1}>
                                                    {variable?.map((item) => (
                                                        <Tooltip key={item.field} placement="top" title={t('market.fields')}>
                                                            <Chip
                                                                sx={{ mr: 1, mt: 1 }}
                                                                size="small"
                                                                color="primary"
                                                                onClick={() => changePrompt(item.field, i)}
                                                                label={item.field}
                                                            ></Chip>
                                                        </Tooltip>
                                                    ))}
                                                </Box>
                                            </>
                                        )}
                                    </Grid>
                                )
                        )}
                        <MainCard sx={{ borderRadius: 0 }} contentSX={{ p: 0 }}>
                            <Box display="flex" justifyContent="space-between" alignItems="center">
                                <Typography variant="h5" sx={{ display: 'flex', alignItems: 'center' }}>
                                    <Box mr={1}>{t('myApp.table')}</Box>
                                    <Tooltip title={t('market.varableDesc')}>
                                        <ErrorIcon fontSize="small" />
                                    </Tooltip>
                                </Typography>
                                <Button
                                    size="small"
                                    color="secondary"
                                    onClick={() => {
                                        setModal(index);
                                        setOpen(true);
                                        setTitle(t('myApp.add'));
                                    }}
                                    variant="outlined"
                                    startIcon={<Add />}
                                >
                                    {t('myApp.add')}
                                </Button>
                            </Box>
                            <Divider style={{ margin: '10px 0' }} />
                            <TableContainer>
                                <Table size="small">
                                    <TableHead>
                                        <TableRow>
                                            <TableCell>{t('myApp.field')}</TableCell>
                                            <TableCell>{t('myApp.name')}</TableCell>
                                            <TableCell>{t('myApp.type')}</TableCell>
                                            <TableCell> {t('myApp.isShow')}</TableCell>
                                            <TableCell>{t('myApp.operation')}</TableCell>
                                        </TableRow>
                                    </TableHead>
                                    <TableBody>
                                        {variable?.map((row: Rows, i: number) => (
                                            <TableRow hover key={row.field}>
                                                <TableCell>{row.field}</TableCell>
                                                <TableCell>{row.label}</TableCell>
                                                <TableCell>{t('myApp.' + row.style.toLowerCase())}</TableCell>
                                                <TableCell>
                                                    <Switch
                                                        name={row.field}
                                                        onChange={() => {
                                                            statusChange({ i, index });
                                                        }}
                                                        checked={row?.isShow}
                                                    />
                                                </TableCell>
                                                <TableCell>
                                                    <IconButton
                                                        onClick={() => {
                                                            editModal(row, i, index);
                                                        }}
                                                        color="primary"
                                                    >
                                                        <SettingsIcon />
                                                    </IconButton>
                                                    <Popconfirm
                                                        title={t('myApp.del')}
                                                        description={t('myApp.delDesc')}
                                                        onConfirm={() => delModal(i, index)}
                                                        onCancel={() => {}}
                                                        okText={t('myApp.confirm')}
                                                        cancelText={t('myApp.cancel')}
                                                    >
                                                        <IconButton disabled={row.group === 'SYSTEM'} color="error">
                                                            <DeleteIcon />
                                                        </IconButton>
                                                    </Popconfirm>
                                                </TableCell>
                                            </TableRow>
                                        ))}
                                    </TableBody>
                                </Table>
                            </TableContainer>
                        </MainCard>
                    </AccordionDetails>
                </Accordion>
                {handler !== 'VariableActionHandler' && handler !== 'MaterialActionHandler' && (
                    <>
                        <Accordion expanded={expanded === 'panel2'} onChange={handleChange('panel2')}>
                            <AccordionSummary expandIcon={<ExpandMoreIcon />} aria-controls="panel1a-content2" id="panel1a-header2">
                                {variables.every((value) => {
                                    if (value.field !== 'prompt') {
                                        return value.value;
                                    } else {
                                        return true;
                                    }
                                }) ? (
                                    <CheckCircleIcon fontSize="small" color="success" />
                                ) : (
                                    <CancelIcon fontSize="small" color="error" />
                                )}

                                <Typography ml={2} fontSize="16px">
                                    {t('market.model')}
                                </Typography>
                            </AccordionSummary>
                            <AccordionDetails>
                                {variables?.map((el: any, i: number) => (
                                    <Grid item md={12} xs={12} key={i + 'variables'}>
                                        {el.field !== 'prompt' && el.field !== 'n' && (
                                            <FormExecute
                                                formik={formik}
                                                item={el}
                                                onChange={(e: any) => basisChange({ e, index, i, flag: false, values: true })}
                                            />
                                        )}
                                    </Grid>
                                ))}
                            </AccordionDetails>
                        </Accordion>
                        {handler !== 'AssembleActionHandler' && (
                            <Accordion expanded={expanded === 'panel3'} onChange={handleChange('panel3')}>
                                <AccordionSummary expandIcon={<ExpandMoreIcon />} aria-controls="panel1a-content3" id="panel1a-header3">
                                    <Typography fontSize="16px">{t('myApp.stepStyle')}</Typography>
                                </AccordionSummary>
                                <AccordionDetails>
                                    <TextField
                                        required
                                        name="buttonLabel"
                                        fullWidth
                                        label={t('myApp.exeLabel')}
                                        variant="outlined"
                                        onChange={(e) => {
                                            editChange({ num: index, label: e.target.name, value: e.target.value });
                                        }}
                                        value={buttonLabel}
                                        sx={{ mt: 2 }}
                                    />
                                </AccordionDetails>
                            </Accordion>
                        )}
                        <Accordion expanded={expanded === 'panel4'} onChange={handleChange('panel4')}>
                            <AccordionSummary expandIcon={<ExpandMoreIcon />} aria-controls="panel1a-content4" id="panel1a-header4">
                                <Typography fontSize="16px">响应类型</Typography>
                            </AccordionSummary>
                            <AccordionDetails>
                                <FormControl fullWidth>
                                    <InputLabel color="secondary" id="responent">
                                        响应类型
                                    </InputLabel>
                                    <Select
                                        disabled={responent?.readOnly ? true : false}
                                        color="secondary"
                                        onChange={(e) => {
                                            basisChange({ e: e.target, index, i: 0, flag: false });
                                        }}
                                        name="type"
                                        labelId="responent"
                                        value={responent.type}
                                        label="响应类型"
                                    >
                                        <MenuItem value={'TEXT'}>文本类型</MenuItem>
                                        <MenuItem value={'JSON'}>JSON 类型</MenuItem>
                                    </Select>
                                </FormControl>
                                {/* {responent.type && (
                            <FormControl className="mt-[16px]" color="secondary" fullWidth>
                                <InputLabel color="secondary" id="responent">
                                    {t('myApp.responent')}
                                </InputLabel>
                                <Select
                                    color="secondary"
                                    onChange={(e) => {
                                        basisChange({ e: e.target, index, i: 0, flag: false });
                                    }}
                                    name="res"
                                    labelId="responent"
                                    value={responent.style}
                                    label={t('myApp.responent')}
                                >
                                    {typeList.map((item, i) => (
                                        <MenuItem
                                            disabled={
                                                item.value === 'JSON' && responent.type === 'TEXT'
                                                    ? true
                                                    : (item.value === 'INPUT' || item.value === 'TEXTAREA') && responent.type === 'JSON'
                                                    ? true
                                                    : false
                                            }
                                            key={i}
                                            value={item.value}
                                        >
                                            {item.label}
                                        </MenuItem>
                                    ))}
                                </Select>
                            </FormControl>
                        )} */}
                                {responent.type === 'JSON' && (
                                    <TextArea
                                        disabled={responent?.readOnly ? true : false}
                                        key={responent?.output?.jsonSchema}
                                        defaultValue={responent?.output?.jsonSchema}
                                        className="mt-[16px]"
                                        style={{ height: '200px' }}
                                        onBlur={(e) => {
                                            basisChange({ e: { name: 'output', value: e.target.value }, index, i: 0, flag: false });
                                        }}
                                    />
                                )}
                            </AccordionDetails>
                        </Accordion>
                    </>
                )}
            </form>
        </Box>
    );
};

const arePropsEqual = (prevProps: any, nextProps: any) => {
    return (
        JSON.stringify(prevProps?.variable) === JSON.stringify(nextProps?.variable) &&
        JSON.stringify(prevProps?.variables) === JSON.stringify(nextProps?.variables) &&
        JSON.stringify(prevProps?.responent) === JSON.stringify(nextProps?.responent) &&
        JSON.stringify(prevProps?.buttonLabel) === JSON.stringify(nextProps?.buttonLabel)
    );
};
export default memo(Valida, arePropsEqual);
