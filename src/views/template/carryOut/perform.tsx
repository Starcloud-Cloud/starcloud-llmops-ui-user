import { Tooltip, TextField, IconButton, Button, Typography, Grid, Box, Card, CardContent, CircularProgress } from '@mui/material';

import AlbumIcon from '@mui/icons-material/Album';
import ErrorOutlineIcon from '@mui/icons-material/ErrorOutline';
import ContentPasteIcon from '@mui/icons-material/ContentPaste';
import NotStartedIcon from '@mui/icons-material/NotStarted';
import ThumbUpAltOutlinedIcon from '@mui/icons-material/ThumbUpAltOutlined';
import ThumbDownOutlinedIcon from '@mui/icons-material/ThumbDownOutlined';
import ReplyIcon from '@mui/icons-material/Reply';
import InsertPhotoIcon from '@mui/icons-material/InsertPhoto';
import { useFormik as Formik } from 'formik';
import FormExecute from 'views/template/components/validaForm';
import generateValidationSchema from 'hooks/usevalid';
import copy from 'clipboard-copy';
import { useTheme } from '@mui/material/styles';
import { t } from 'hooks/web/useI18n';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
function Perform({ config, changeSon, source, loadings, isallExecute }: any) {
    const theme = useTheme();
    const isDarkMode = theme.palette.mode === 'dark';
    const fn = (data: any[]) => {
        const Data: Record<string, any> = {};
        data.forEach((variable: { isShow: boolean; field: string; value: string }) => {
            const { field, isShow, value } = variable;
            if (isShow) {
                Data[field] = value;
            }
        });
        return Data;
    };
    const arr: any[] = [];
    const mapVariables = (variable: any, obj: any) => {
        for (const item of variable) {
            for (const key in obj) {
                if (item.field === key) {
                    item.value = obj[key];
                }
            }
        }
    };
    config?.steps.forEach((item: any, index: number) => {
        arr[index] = Formik({
            initialValues: fn([...(item.variable ? item.variable.variables : []), ...item.flowStep?.variable.variables]),
            validationSchema: generateValidationSchema([
                ...(item.variable ? item.variable.variables : []),
                ...item.flowStep.variable.variables
            ]),
            onSubmit: (value) => {
                const steps = JSON.parse(JSON.stringify(config?.steps[index]));
                if (steps.variable) mapVariables(steps.variable.variables, value);
                mapVariables(steps.flowStep.variable.variables, value);
                changeSon({ stepId: config?.steps[index].field, steps, index });
            }
        });
    });
    const validateFormAndReturnValidity = async (formik: any) => {
        await formik.validateForm();
        return formik.isValid;
    };
    const allExecute = async () => {
        let list: any[] = [];
        for (let index = 0; index < arr.length; index++) {
            let result = await validateFormAndReturnValidity(arr[index]);
            list.push(result);
            if (!result) {
                arr[index].handleSubmit();
            }
        }
        const data = list.every((item) => item === true);
        if (data) {
            isallExecute(true);
            arr[0].handleSubmit();
        }
    };
    return (
        <Box>
            {config?.steps.length > 1 ? (
                <Box mb={1}>
                    <Button color="secondary" startIcon={<AlbumIcon />} variant="contained" onClick={allExecute}>
                        {t('market.allExecute')}
                    </Button>
                    <Tooltip title={t('market.allStepTips')}>
                        <IconButton size="small">
                            <ErrorOutlineIcon />
                        </IconButton>
                    </Tooltip>
                </Box>
            ) : null}
            {config?.steps.map(
                (item: any, steps: number) =>
                    item.flowStep.response.style !== 'BUTTON' && (
                        <Card key={item.field + item.steps} sx={{ position: 'relative' }}>
                            {loadings[steps] && (
                                <div
                                    style={{
                                        position: 'absolute',
                                        top: 0,
                                        left: 0,
                                        right: 0,
                                        bottom: 0,
                                        display: 'flex',
                                        justifyContent: 'center',
                                        alignItems: 'center',
                                        backgroundColor: !isDarkMode ? 'rgba(255, 255, 255, 0.8)' : 'rgba(0, 0, 0, 0.3)',
                                        zIndex: 100
                                    }}
                                >
                                    <CircularProgress />
                                </div>
                            )}
                            <CardContent sx={{ p: 0 }}>
                                <Box display="flex" justifyContent="space-between" alignItems="top">
                                    {config?.steps.length > 1 || source === 'myApp' ? (
                                        <Box>
                                            <Typography variant="h3">{item.name}</Typography>
                                            <Typography variant="caption" display="block">
                                                {item.description}
                                            </Typography>
                                        </Box>
                                    ) : null}
                                    <Box sx={{ display: { xs: 'none', md: 'block' } }}></Box>
                                    <Box whiteSpace="nowrap">
                                        <Tooltip title={t('market.stepTips')}>
                                            <IconButton size="small">
                                                <ErrorOutlineIcon />
                                            </IconButton>
                                        </Tooltip>
                                        <Button
                                            onClick={() => {
                                                isallExecute(false);
                                                arr[steps].handleSubmit();
                                            }}
                                            color="secondary"
                                            size="small"
                                            startIcon={<NotStartedIcon />}
                                            variant="contained"
                                        >
                                            {item.buttonLabel}
                                        </Button>
                                    </Box>
                                </Box>
                                <form>
                                    <Grid container spacing={1}>
                                        {item.variable?.variables.map((el: any) =>
                                            el.isShow ? (
                                                <Grid item key={el.field} md={el.style === 'TEXTAREA' ? 6 : 4} xs={12}>
                                                    <FormExecute formik={arr[steps]} item={el} />
                                                </Grid>
                                            ) : null
                                        )}
                                        {item.flowStep.variable.variables.length !== 0 &&
                                            item.flowStep.variable.variables.map((el: any) =>
                                                el.isShow ? (
                                                    <Grid
                                                        item
                                                        lg={el.field === 'prompt' ? 12 : el.style === 'TEXTAREA' ? 6 : 4}
                                                        md={el.field === 'prompt' ? 12 : el.style === 'TEXTAREA' ? 6 : 4}
                                                        xs={12}
                                                        key={el.field}
                                                    >
                                                        <FormExecute formik={arr[steps]} item={el} />
                                                    </Grid>
                                                ) : null
                                            )}
                                    </Grid>
                                </form>
                                <Box my={2} display="flex">
                                    {item.flowStep.response.style === 'INPUT' ? (
                                        <TextField
                                            label={t('market.ai')}
                                            InputLabelProps={{ shrink: true }}
                                            value={item.flowStep.response.answer}
                                            fullWidth
                                        />
                                    ) : item.flowStep.response.style === 'TEXTAREA' ? (
                                        <Box width="100%" sx={{ background: '#f8fafc' }}>
                                            <Box sx={{ p: 2, height: '300px', overflow: 'auto' }}>
                                                <ReactMarkdown children={item.flowStep.response.answer} remarkPlugins={[remarkGfm]} />
                                            </Box>
                                            {item.flowStep.response.answer && (
                                                <Box width="100%" display="flex" justifyContent="space-between" overflow="hidden">
                                                    <Box>
                                                        <Button
                                                            sx={{ mt: 1, mr: 1 }}
                                                            size="small"
                                                            variant="outlined"
                                                            color="secondary"
                                                            startIcon={<ContentPasteIcon />}
                                                            onClick={() => {
                                                                copy(item.flowStep.response.answer);
                                                            }}
                                                        >
                                                            {t('market.copys')}
                                                        </Button>
                                                        <Button
                                                            sx={{ mt: 1, mr: 1 }}
                                                            size="small"
                                                            variant="outlined"
                                                            color="secondary"
                                                            startIcon={<ThumbUpAltOutlinedIcon />}
                                                        >
                                                            {t('market.like')}
                                                        </Button>
                                                        <Button
                                                            sx={{ mt: 1, mr: 1 }}
                                                            size="small"
                                                            variant="outlined"
                                                            color="secondary"
                                                            startIcon={<ThumbDownOutlinedIcon />}
                                                        >
                                                            {t('market.Step')}
                                                        </Button>
                                                        <Button
                                                            sx={{ display: { xs: 'inlineBlock', md: 'none' }, mt: 1, mr: 1 }}
                                                            size="small"
                                                            variant="outlined"
                                                            color="secondary"
                                                            startIcon={<ReplyIcon />}
                                                        >
                                                            {t('market.share')}
                                                        </Button>
                                                    </Box>
                                                    {item.flowStep.response.answer && (
                                                        <Typography sx={{ mt: 1, fontSize: '.75rem', mr: '24px' }}>
                                                            {item.flowStep.response.answer?.length} {t('market.words')}
                                                        </Typography>
                                                    )}
                                                </Box>
                                            )}
                                        </Box>
                                    ) : (
                                        <Card
                                            elevation={3}
                                            sx={{
                                                width: '200px',
                                                height: '200px',
                                                marginRight: '16px',
                                                lineHeight: '200px',
                                                textAlign: 'center'
                                            }}
                                        >
                                            <InsertPhotoIcon fontSize="large" />
                                        </Card>
                                    )}
                                </Box>
                            </CardContent>
                        </Card>
                    )
            )}
        </Box>
    );
}
export default Perform;
