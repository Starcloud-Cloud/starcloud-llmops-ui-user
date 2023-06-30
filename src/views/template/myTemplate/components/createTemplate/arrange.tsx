import {
    Box,
    Typography,
    Card,
    Grid,
    TextField,
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
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    FormControlLabel,
    Switch
} from '@mui/material';
import MainCard from 'ui-component/cards/MainCard';

import SettingsIcon from '@mui/icons-material/Settings';
import CloseIcon from '@mui/icons-material/Close';
import DeleteIcon from '@mui/icons-material/Delete';
import Add from '@mui/icons-material/Add';

import Form from 'views/template/components/form';
import { useState } from 'react';
import { useFormik } from 'formik';
import * as yup from 'yup';
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
    variable: yup.string().required('variable is required'),
    label: yup.string().required('label is required')
});

function Arrange({ config, editChange, variableChange, basisChange }: any) {
    const formik = useFormik({
        initialValues: {
            variable: '',
            label: '',
            value: '',
            is_show: ''
        },
        validationSchema,
        onSubmit: (values) => {}
    });
    const rows = [{ name: 'Frozen yoghurt', calories: 159, fat: 12 }];
    //弹窗
    const [open, setOpen] = useState(false);
    const handleClose = () => {
        setOpen(false);
    };
    return (
        <Box>
            <Typography variant="h3">模板流程</Typography>
            {config?.steps.map((item: any, index: number) => (
                <Card key={item.field} sx={{ padding: '16px 0' }}>
                    <Grid container spacing={2}>
                        <Grid item lg={4}>
                            <TextField
                                label="标题"
                                value={item.buttonLabel}
                                name="label"
                                InputLabelProps={{ shrink: true }}
                                onChange={(e) => editChange({ num: index, label: e.target.name, value: e.target.value })}
                                helperText={' '}
                                fullWidth
                            />
                        </Grid>
                        <Grid item lg={8}>
                            <TextField
                                label="描述"
                                value={item.description}
                                name="desc"
                                InputLabelProps={{ shrink: true }}
                                onChange={(e) => editChange({ num: index, label: e.target.name, value: e.target.value })}
                                helperText={' '}
                                fullWidth
                            />
                        </Grid>
                    </Grid>
                    <Typography variant="h3">变量</Typography>
                    <Grid container spacing={2}>
                        {item.variable &&
                            item.variable.variables.map((el: any, i: number) => (
                                <Grid item md={3} key={i + 'prompt'}>
                                    <Form item={el} onChange={(e: any) => variableChange({ e, index, i })} />
                                </Grid>
                            ))}
                        {item.flowStep.variable?.variables.map((el: any, i: number) => (
                            <Grid item md={12} key={i + 'variables'}>
                                <Form item={el} onChange={(e: any) => basisChange({ e, index, i })} />
                            </Grid>
                        ))}
                    </Grid>
                    <Divider sx={{ margin: '16px 0' }} />
                    <MainCard
                        content={false}
                        title="Basic Table"
                        secondary={
                            <Stack direction="row" spacing={2} alignItems="center">
                                <Button onClick={() => setOpen(true)} variant="outlined" startIcon={<Add />}>
                                    Add
                                </Button>
                            </Stack>
                        }
                    >
                        <TableContainer>
                            <Table>
                                <TableHead>
                                    <TableRow>
                                        <TableCell>变量 KEY</TableCell>
                                        <TableCell>字段名称</TableCell>
                                        <TableCell> 可选</TableCell>
                                        <TableCell>操作</TableCell>
                                    </TableRow>
                                </TableHead>
                                <TableBody>
                                    {rows.map((row) => (
                                        <TableRow hover key={row.name}>
                                            <TableCell>{row.name}</TableCell>
                                            <TableCell>{row.calories}</TableCell>
                                            <TableCell>{row.fat}</TableCell>
                                            <TableCell>
                                                <IconButton color="primary">
                                                    <SettingsIcon />
                                                </IconButton>
                                                <IconButton color="error">
                                                    <DeleteIcon />
                                                </IconButton>
                                            </TableCell>
                                        </TableRow>
                                    ))}
                                </TableBody>
                            </Table>
                        </TableContainer>
                    </MainCard>
                </Card>
            ))}
            <Dialog onClose={handleClose} aria-labelledby="customized-dialog-title" open={open}>
                <BootstrapDialogTitle id="customized-dialog-title" onClose={handleClose}>
                    Modal title
                </BootstrapDialogTitle>
                <DialogContent dividers>
                    <form onSubmit={formik.handleSubmit}>
                        <TextField
                            fullWidth
                            id="variable"
                            name="variable"
                            label="variable"
                            value={formik.values.variable}
                            onChange={formik.handleChange}
                            InputLabelProps={{ shrink: true }}
                            error={formik.touched.variable && Boolean(formik.errors.variable)}
                            helperText={formik.touched.variable && formik.errors.variable ? String(formik.errors.variable) : ' '}
                        />
                        <TextField
                            fullWidth
                            id="label"
                            name="label"
                            label="label"
                            value={formik.values.label}
                            onChange={formik.handleChange}
                            InputLabelProps={{ shrink: true }}
                            error={formik.touched.label && Boolean(formik.errors.label)}
                            helperText={formik.touched.label && formik.errors.label ? String(formik.errors.label) : ' '}
                        />
                        <TextField
                            fullWidth
                            id="value"
                            name="value"
                            label="value"
                            value={formik.values.value}
                            onChange={formik.handleChange}
                            InputLabelProps={{ shrink: true }}
                            helperText={' '}
                        />
                        <FormControlLabel value="formik.values.is_show" control={<Switch />} label="是否显示" labelPlacement="start" />
                    </form>
                </DialogContent>
                <DialogActions>
                    <Button
                        autoFocus
                        onClick={() => {
                            formik.handleSubmit();
                        }}
                    >
                        Save changes
                    </Button>
                </DialogActions>
            </Dialog>
        </Box>
    );
}
export default Arrange;
