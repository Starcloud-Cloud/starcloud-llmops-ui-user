import {
    Box,
    Typography,
    Grid,
    Divider,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    Button,
    IconButton,
    Stack,
    Switch,
    Accordion,
    AccordionSummary,
    AccordionDetails
} from '@mui/material';
import { t } from 'hooks/web/useI18n';
import { Popconfirm } from 'antd';
import MainCard from 'ui-component/cards/MainCard';
import Add from '@mui/icons-material/Add';
import SettingsIcon from '@mui/icons-material/Settings';
import DeleteIcon from '@mui/icons-material/Delete';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import { useFormik as Formik } from 'formik';
import generateValidationSchema from 'hooks/usevalid';
import { Validas, Rows } from 'types/template';
import FormExecute from 'views/template/components/validaForm';
const Valida = ({ variables, basisChange, index, setModal, setOpen, setTitle, statusChange, editModal, delModal }: Validas) => {
    const fn = (data: any[]) => {
        const Data: Record<string, any> = {};
        data.forEach((variable: { style: boolean; field: string; value: string }) => {
            const { field, value } = variable;
            Data[field] = value !== null && value !== undefined ? value : '';
        });
        return Data;
    };
    const formik = Formik({
        initialValues: fn(variables),
        validationSchema: generateValidationSchema(variables, true),
        onSubmit: () => {
            console.log(formik);

            console.log(111);
        }
    });
    return (
        <Box p={1} minHeight="150px">
            <form>
                <Accordion>
                    <AccordionSummary expandIcon={<ExpandMoreIcon />} aria-controls="panel1a-content" id="panel1a-header">
                        <Typography>Promtp</Typography>
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
                        <Divider sx={{ margin: '16px 0' }} />
                        <MainCard
                            content={false}
                            title={t('myApp.table')}
                            secondary={
                                <Stack direction="row" spacing={2} alignItems="center">
                                    <Button
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
                                            <TableCell> {t('myApp.desc')}</TableCell>
                                            <TableCell>{t('myApp.operation')}</TableCell>
                                        </TableRow>
                                    </TableHead>
                                    <TableBody>
                                        {variables.map((row: Rows, i: number) => (
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
                                                <TableCell>{row.description}</TableCell>
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
                        <Typography>模型变量</Typography>
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
};
export default Valida;
