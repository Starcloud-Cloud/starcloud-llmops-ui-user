import { Tooltip, TextField, IconButton, Button, Typography, Grid, Box, Card } from '@mui/material';

import AlbumIcon from '@mui/icons-material/Album';
import ErrorOutlineIcon from '@mui/icons-material/ErrorOutline';
import NotStartedIcon from '@mui/icons-material/NotStarted';
import InsertPhotoIcon from '@mui/icons-material/InsertPhoto';
import { useFormik as Formik } from 'formik';
import FormExecute from 'views/template/components/validaForm';
import generateValidationSchema from 'hooks/usevalid';
import { t } from 'hooks/web/useI18n';

function Perform({ config }: { config: any }) {
    if (!config) {
        return null;
    }
    // const initialValues: Record<string, any> = {};
    // config.variable.variables.forEach((variable: { field: string }) => {
    //     const { field } = variable;
    //     initialValues[field] = '';
    // });
    const fn = (data: any[]) => {
        const Data: Record<string, any> = {};
        data.forEach((variable: { isShow: boolean; field: string }) => {
            const { field, isShow } = variable;
            if (isShow) {
                Data[field] = '';
            }
        });
        return Data;
    };
    const validationSchema = generateValidationSchema(config.variable.variables);
    const formik = Formik({
        initialValues: fn(config.variable.variables),
        validationSchema,
        onSubmit: () => {}
    });
    const arr: any[] = [];
    config.steps.forEach((item: any, index: number) => {
        arr[index] = Formik({
            initialValues: fn([...item.variable.variables, ...item.flowStep.variable.variables]),
            validationSchema: generateValidationSchema([...item.variable.variables, ...item.flowStep.variable.variables]),
            onSubmit: () => {}
        });
    });
    return (
        <Box>
            {config.steps > 1 ? (
                <Box>
                    <Button onClick={() => formik.handleSubmit()} startIcon={<AlbumIcon />} variant="contained">
                        {t('market.allExecute')}
                    </Button>
                    <Tooltip title={t('market.allStepTips')}>
                        <IconButton size="small">
                            <ErrorOutlineIcon />
                        </IconButton>
                    </Tooltip>
                </Box>
            ) : null}
            <form>
                <Grid container spacing={2}>
                    {config.variable.variables.length !== 0 &&
                        config.variable.variables.map((item: any) =>
                            item.isShow ? (
                                <Grid item lg={4} md={6} sm={12} key={item.field}>
                                    <FormExecute formik={formik} item={item} />
                                </Grid>
                            ) : null
                        )}
                </Grid>
            </form>
            {config.steps.map((item: any, steps: number) => (
                <Card sx={{ padding: 2 }} key={item.field + item.steps}>
                    <Box my={2} display="flex" justifyContent="space-between">
                        <Box>
                            {config.steps > 1 ? (
                                <Box>
                                    <Typography variant="h3">{item.name}</Typography>
                                    <Typography variant="body2">nxcvjkxclvjxljc{item.desc}</Typography>
                                </Box>
                            ) : null}
                            <Box></Box>
                            <Typography variant="overline" display="block" mt={1}>
                                {item.description}
                            </Typography>
                        </Box>
                        <Box>
                            <Tooltip title={t('market.stepTips')}>
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
                            {item.variable.variables.length !== 0 &&
                                item.variable.variables.map((el: any) =>
                                    el.isShow ? (
                                        <Grid item key={el.field} lg={item.style === 'TEXT' ? 6 : 4} sm={12}>
                                            <FormExecute formik={arr[steps]} item={el} />
                                        </Grid>
                                    ) : null
                                )}
                            {item.flowStep.variable.variables.length !== 0 &&
                                item.flowStep.variable.variables.map((el: any) =>
                                    el.isShow ? (
                                        <Grid
                                            item
                                            lg={el.field === 'prompt' ? 12 : el.style === 'TEXT' ? 6 : 4}
                                            md={el.field === 'prompt' ? 12 : el.style === 'TEXT' ? 6 : 4}
                                            sm={12}
                                            key={el.field}
                                        >
                                            <FormExecute formik={arr[steps]} item={el} />
                                        </Grid>
                                    ) : null
                                )}
                        </Grid>
                    </form>
                    <Box my={2} display="flex">
                        {item.flowStep.response.style === 'TEXT' ? (
                            <TextField fullWidth />
                        ) : item.flowStep.response.style === 'TEXTAREA' ? (
                            <TextField multiline rows={8} fullWidth />
                        ) : (
                            <Card
                                elevation={3}
                                sx={{ width: '200px', height: '200px', marginRight: '16px', lineHeight: '200px', textAlign: 'center' }}
                            >
                                <InsertPhotoIcon fontSize="large" />
                            </Card>
                        )}
                    </Box>
                </Card>
            ))}
        </Box>
    );
}
export default Perform;
