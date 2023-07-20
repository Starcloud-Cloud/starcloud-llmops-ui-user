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
    Stack,
    Switch
} from '@mui/material';
import { styled } from '@mui/material/styles';
import ArrowForwardIosSharpIcon from '@mui/icons-material/ArrowForwardIosSharp';
import MuiAccordion, { AccordionProps } from '@mui/material/Accordion';
import MuiAccordionSummary, { AccordionSummaryProps } from '@mui/material/AccordionSummary';
import MuiAccordionDetails from '@mui/material/AccordionDetails';
import { t } from 'hooks/web/useI18n';
import { Popconfirm } from 'antd';

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
import FormExecute from 'views/template/components/validaForm';

import { forwardRef, useImperativeHandle } from 'react';
const Accordion = styled((props: AccordionProps) => <MuiAccordion disableGutters elevation={0} square {...props} />)(({ theme }) => ({
    border: `1px solid ${theme.palette.divider}`,
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
    ({ variable, variables, basisChange, index, setModal, setOpen, setTitle, statusChange, editModal, delModal }: Validas, ref) => {
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
        const fn = (data: any[]) => {
            const Data: Record<string, any> = {};
            data.forEach((item: { field: string; defaultValue: string }) => {
                const { field, defaultValue } = item;
                Data[field] = defaultValue !== null && defaultValue !== undefined ? defaultValue : '';
            });
            return Data;
        };
        const formik = Formik({
            initialValues: fn(variables),
            validationSchema: generateValidationSchema(variables, true),
            onSubmit: () => {}
        });
        return (
            <Box p={1}>
                <form>
                    <Accordion>
                        <AccordionSummary expandIcon={<ExpandMoreIcon />} aria-controls="panel1a-content" id="panel1a-header">
                            {formik.values.prompt !== '' && <CheckCircleIcon fontSize="small" color="success" />}
                            {formik.values.prompt === '' && <CancelIcon fontSize="small" color="error" />}
                            <Typography ml={2} fontSize="16px">
                                Promtp
                            </Typography>
                        </AccordionSummary>
                        <AccordionDetails>
                            {variables?.map((el: any, i: number) => (
                                <Grid item md={12} xs={12} key={i + 'variables'}>
                                    {el.field === 'prompt' && (
                                        <>
                                            <FormExecute
                                                formik={formik}
                                                item={el}
                                                onChange={(e: any) => {
                                                    basisChange({ e, index, i });
                                                }}
                                            />
                                            {Boolean(formik.errors[el.field])}
                                        </>
                                    )}
                                </Grid>
                            ))}
                            <MainCard
                                content={false}
                                title={t('myApp.table')}
                                secondary={
                                    <Stack direction="row" spacing={2} alignItems="center">
                                        <Button
                                            size="small"
                                            color="secondary"
                                            onClick={() => {
                                                setModal(index);
                                                setOpen(true);
                                                setTitle('Add');
                                            }}
                                            variant="outlined"
                                            startIcon={<Add />}
                                        >
                                            {t('myApp.add')}
                                        </Button>
                                    </Stack>
                                }
                            >
                                <TableContainer>
                                    <Table>
                                        <TableHead>
                                            <TableRow>
                                                <TableCell>{t('myApp.field')}</TableCell>
                                                <TableCell>{t('myApp.name')}</TableCell>
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
                        <AccordionSummary expandIcon={<ExpandMoreIcon />} aria-controls="panel1a-content" id="panel1a-header">
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
                                        <FormExecute formik={formik} item={el} onChange={(e: any) => basisChange({ e, index, i })} />
                                    )}
                                </Grid>
                            ))}
                        </AccordionDetails>
                    </Accordion>
                </form>
            </Box>
        );
    }
);
export default Valida;
