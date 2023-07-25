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
    MenuItem
} from '@mui/material';
import { styled } from '@mui/material/styles';
import ArrowForwardIosSharpIcon from '@mui/icons-material/ArrowForwardIosSharp';
import MuiAccordion, { AccordionProps } from '@mui/material/Accordion';
import MuiAccordionSummary, { AccordionSummaryProps } from '@mui/material/AccordionSummary';
import MuiAccordionDetails from '@mui/material/AccordionDetails';
import ErrorIcon from '@mui/icons-material/Error';
import { t } from 'hooks/web/useI18n';
import { Divider, Popconfirm } from 'antd';

import MainCard from 'ui-component/cards/MainCard';
import Add from '@mui/icons-material/Add';
import SettingsIcon from '@mui/icons-material/Settings';
import DeleteIcon from '@mui/icons-material/Delete';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import CancelIcon from '@mui/icons-material/Cancel';

import { useFormik as Formik } from 'formik';
import generateValidationSchema from 'hooks/usevalid';
import { Validas, Rows } from 'types/template';
import FormExecute from 'views/template/components/form';

import { forwardRef, useImperativeHandle } from 'react';
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
const Valida = forwardRef(
    (
        { variable, variables, responent, basisChange, index, setModal, setOpen, setTitle, statusChange, editModal, delModal }: Validas,
        ref
    ) => {
        useImperativeHandle(ref, () => ({
            allValidas: Object.values(formik.values).some((value) => value === ''),
            allValida: () => {
                if (Object.values(formik.values).some((value) => value === '')) {
                    formik.handleSubmit();
                    return true;
                } else {
                    return false;
                }
            }
        }));
        const typeList = [
            { label: t('myApp.input'), value: 'INPUT' },
            { label: t('myApp.textarea'), value: 'TEXTAREA' }
        ];
        const fn = (data: any[]) => {
            const Data: Record<string, any> = {};
            data.forEach((item: { field: string; defaultValue: string }) => {
                const { field, defaultValue } = item;
                Data[field] = defaultValue !== null && defaultValue !== undefined ? defaultValue : '';
            });
            return Data;
        };
        const formik = Formik({
            initialValues: fn(JSON.parse(JSON.stringify(variables))),
            validationSchema: generateValidationSchema(JSON.parse(JSON.stringify(variables)), true),
            onSubmit: () => {}
        });
        return (
            <Box py={1}>
                <form>
                    <Accordion>
                        <AccordionSummary expandIcon={<ExpandMoreIcon />} aria-controls="panel1a-content1" id="panel1a-header1">
                            {formik.values.prompt !== '' && <CheckCircleIcon fontSize="small" color="success" />}
                            {formik.values.prompt === '' && <CancelIcon fontSize="small" color="error" />}
                            <Typography ml={2} fontSize="16px">
                                {t('market.prompt')}
                            </Typography>
                        </AccordionSummary>
                        <AccordionDetails>
                            {variables?.map((el: any, i: number) => (
                                <Grid item md={12} xs={12} key={i + 'variables'}>
                                    {el.field === 'prompt' && (
                                        <>
                                            <Box display="flex" justifyContent="space-between" alignItems="center">
                                                <Box display="flex" alignItems="center">
                                                    <Typography mr={1} variant="h5">
                                                        {t('market.' + el.field)}
                                                    </Typography>
                                                    <ErrorIcon fontSize="small" />
                                                </Box>
                                                <Box>
                                                    <Switch
                                                        name="promptisShow"
                                                        onChange={(e) => {
                                                            basisChange({ e: e.target, index, i, flag: true });
                                                        }}
                                                        checked={el.isShow}
                                                    />
                                                </Box>
                                            </Box>
                                            <FormExecute
                                                formik={formik}
                                                item={el}
                                                onChange={(e: any) => {
                                                    basisChange({ e, index, i, flag: false });
                                                }}
                                            />
                                        </>
                                    )}
                                </Grid>
                            ))}
                            <MainCard>
                                <Box display="flex" justifyContent="space-between" alignItems="center">
                                    <Typography variant="h5" sx={{ display: 'flex', alignItems: 'center' }}>
                                        <Box mr={1}>{t('myApp.table')}</Box> <ErrorIcon fontSize="small" />
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
                                                <TableCell>{t('myApp.value')}</TableCell>
                                                <TableCell> {t('myApp.isShow')}</TableCell>
                                                <TableCell>{t('myApp.operation')}</TableCell>
                                            </TableRow>
                                        </TableHead>
                                        <TableBody>
                                            {variable?.map((row: Rows, i: number) => (
                                                <TableRow hover key={row.field}>
                                                    <TableCell>{row.field}</TableCell>
                                                    <TableCell>{row.label}</TableCell>
                                                    <TableCell>{row.style}</TableCell>
                                                    <TableCell>{row.defaultValue}</TableCell>
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
                                                            <IconButton color="error">
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
                    <Accordion>
                        <AccordionSummary expandIcon={<ExpandMoreIcon />} aria-controls="panel1a-content2" id="panel1a-header2">
                            {Object.entries({ ...formik.values }).every((value) => {
                                if (value[0] !== 'prompt') {
                                    return value[1] !== '';
                                } else {
                                    return true;
                                }
                            }) && <CheckCircleIcon fontSize="small" color="success" />}
                            {Object.entries({ ...formik.values }).some((value) => {
                                if (value[0] !== 'prompt') {
                                    return value[1] === '';
                                } else {
                                    return false;
                                }
                            }) && <CancelIcon fontSize="small" color="error" />}
                            <Typography ml={2} fontSize="16px">
                                {t('market.model')}
                            </Typography>
                        </AccordionSummary>
                        <AccordionDetails>
                            {variables?.map((el: any, i: number) => (
                                <Grid item md={12} xs={12} key={i + 'variables'}>
                                    {el.field !== 'prompt' && (
                                        <FormExecute
                                            formik={formik}
                                            item={el}
                                            onChange={(e: any) => basisChange({ e, index, i, flag: false })}
                                        />
                                    )}
                                </Grid>
                            ))}
                        </AccordionDetails>
                    </Accordion>
                    <Accordion>
                        <AccordionSummary expandIcon={<ExpandMoreIcon />} aria-controls="panel1a-content3" id="panel1a-header3">
                            <Typography fontSize="16px">{t('myApp.responent')}</Typography>
                        </AccordionSummary>
                        <AccordionDetails>
                            <FormControl fullWidth>
                                <InputLabel id="responent">{t('myApp.responent')}</InputLabel>
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
                                        <MenuItem key={i} value={item.value}>
                                            {item.label}
                                        </MenuItem>
                                    ))}
                                </Select>
                            </FormControl>
                        </AccordionDetails>
                    </Accordion>
                </form>
            </Box>
        );
    }
);
export default Valida;
