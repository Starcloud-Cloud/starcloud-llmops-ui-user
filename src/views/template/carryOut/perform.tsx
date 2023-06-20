import { Tooltip, IconButton, Button, Typography, Grid, Box, Card } from '@mui/material';

import AlbumIcon from '@mui/icons-material/Album';
import ErrorOutlineIcon from '@mui/icons-material/ErrorOutline';
import NotStartedIcon from '@mui/icons-material/NotStarted';
import InsertPhotoIcon from '@mui/icons-material/InsertPhoto';

import FormExecute from 'views/template/components/validaForm';

import { useFormik as Formik } from 'formik';

import generateValidationSchema from 'hooks/usevalid';

function Perform({ config }: { config: any }) {
    const initialValues: Record<string, any> = {};
    config.variables.forEach((variable: { field: string }) => {
        const { field } = variable;
        initialValues[field] = '';
        // 添加其他类型的校验规则，根据需要进行扩展
    });
    const fn = (data: any[]) => {
        const Data: Record<string, any> = {};
        data.forEach((variable: { field: string }) => {
            const { field } = variable;
            Data[field] = '';
        });
        return Data;
    };

    const validationSchema = generateValidationSchema(config.variables);
    const formik = Formik({
        initialValues,
        validationSchema,
        onSubmit: () => {}
    });
    const arr: any[] = [];
    config.steps.forEach((item: any, index: number) => {
        arr[index] = Formik({
            initialValues: fn([...item.variables, ...item.stepModule.variables]),
            validationSchema: generateValidationSchema([...item.variables, ...item.stepModule.variables]),
            onSubmit: () => {}
        });
    });

    return (
        <Box>
            <Button onClick={() => formik.handleSubmit()} startIcon={<AlbumIcon />} variant="contained">
                全部执行
            </Button>
            <Tooltip title="点击全部执行">
                <IconButton size="small">
                    <ErrorOutlineIcon />
                </IconButton>
            </Tooltip>
            <form>
                <Grid container spacing={2}>
                    {config.variables &&
                        config.variables.map((item: any, index: number) => (
                            <Grid item lg={4} md={6} sm={12} key={index}>
                                <FormExecute formik={formik} item={item} />
                            </Grid>
                        ))}
                </Grid>
            </form>
            {config.steps &&
                config.steps.map((item: any, steps: number) => (
                    <Card elevation={2} sx={{ padding: 2 }} key={item.field}>
                        <Box my={2} display="flex" justifyContent="space-between">
                            <Box>
                                <Typography variant="h2">{item.name}</Typography>
                                <Typography variant="overline" display="block" mt={1}>
                                    {item.description}
                                </Typography>
                            </Box>
                            <Box>
                                <Tooltip title="点击执行当前步骤">
                                    <IconButton size="small">
                                        <ErrorOutlineIcon />
                                    </IconButton>
                                </Tooltip>
                                <Button
                                    onClick={() => arr[steps].handleSubmit()}
                                    size="small"
                                    startIcon={<NotStartedIcon />}
                                    variant="contained"
                                >
                                    {item.buttonLabel}
                                </Button>
                            </Box>
                        </Box>
                        <form>
                            <Grid container spacing={2}>
                                {item.stepModule.variables.map((el: any, index: number) => (
                                    <Grid
                                        item
                                        lg={el.field === 'prompt' ? 12 : el.style === 'TEXT' ? 6 : 4}
                                        md={el.field === 'prompt' ? 12 : el.style === 'TEXT' ? 6 : 4}
                                        sm={12}
                                        key={index}
                                    >
                                        <FormExecute formik={arr[steps]} item={el} />
                                    </Grid>
                                ))}
                                {item.variables.map((el: any, index: number) => (
                                    <Grid item key={index} lg={item.style === 'TEXT' ? 6 : 4} sm={12}>
                                        <FormExecute formik={arr[steps]} item={el} />
                                    </Grid>
                                ))}
                            </Grid>
                        </form>
                        <Box my={2} display="flex">
                            {/* <TextField fullWidth /> */}
                            {/* <TextField multiline rows={8} fullWidth /> */}
                            {Array.from({ length: 3 }, (_, index) => (
                                <Card
                                    elevation={3}
                                    sx={{ width: '200px', height: '200px', marginRight: '16px', lineHeight: '200px', textAlign: 'center' }}
                                >
                                    <InsertPhotoIcon fontSize="large" />
                                </Card>
                            ))}
                        </Box>
                    </Card>
                ))}
        </Box>
    );
}
export default Perform;
