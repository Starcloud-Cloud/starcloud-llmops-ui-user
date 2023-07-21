import { Tooltip, IconButton, Button, Typography, Grid, Box, Card, CardContent, CircularProgress } from '@mui/material';
import ReplyIcon from '@mui/icons-material/Reply';
import InsertPhotoIcon from '@mui/icons-material/InsertPhoto';
import ContentPasteIcon from '@mui/icons-material/ContentPaste';
import NotStartedIcon from '@mui/icons-material/NotStarted';
import ErrorOutlineIcon from '@mui/icons-material/ErrorOutline';
import { useFormik as Formik } from 'formik';
import FormExecute from 'views/template/components/validaForm';
import generateValidationSchema from 'hooks/usevalid';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { useTheme } from '@mui/material/styles';
import { t } from 'hooks/web/useI18n';
import { El } from 'types/template';
import { useRef, forwardRef, useImperativeHandle, useEffect } from 'react';
import copy from 'clipboard-copy';
const CarrOut = forwardRef(({ config, source, loadings, variableChange, promptChange, item, steps, callBack }: any, ref) => {
    const theme = useTheme();
    const isDarkMode = theme.palette.mode === 'dark';
    useImperativeHandle(ref, () => ({
        formiks: formik,
        submit: () => {
            if (Object.values(formik.values).some((value) => value === '')) {
                formik.handleSubmit();
                return false;
            } else {
                return formik.values;
            }
        }
    }));
    const fn = (data: any[]) => {
        const Data: Record<string, any> = {};
        data.forEach((variable: { isShow: boolean; field: string; value: string }) => {
            const { field, isShow, value } = variable;
            if (isShow) {
                Data[field] = value !== null && value !== undefined ? value : '';
            }
        });
        return Data;
    };
    const formik = Formik({
        initialValues: fn([...(item.variable ? item.variable.variables : []), ...item.flowStep?.variable.variables]),
        validationSchema: generateValidationSchema([
            ...(item.variable ? item.variable.variables : []),
            ...item.flowStep.variable.variables
        ]),
        onSubmit: () => {
            callBack({ item: item.field, steps });
        }
    });
    const mdRef = useRef<any>(null);
    const disSteps = (index: number) => {
        const model = config?.steps[index].flowStep.variable?.variables.map((el: El) => {
            if (el.isShow) {
                return el.value ? false : true;
            } else {
                return el.defaultValue ? false : true;
            }
        });
        const variable = config?.steps[index].variable?.variables.map((el: El) => {
            if (el.isShow) {
                return el.value ? false : true;
            } else {
                return false;
            }
        });
        return model?.some((value: boolean) => value === true) || variable?.some((value: boolean) => value === true) ? true : false;
    };
    useEffect(() => {
        if (mdRef.current) {
            mdRef.current.scrollTop = mdRef.current.scrollHeight;
        }
    }, [item?.flowStep.response.answer]);
    return (
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
                            <Typography variant="h4">{item.name}</Typography>
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
                                formik.handleSubmit();
                            }}
                            disabled={disSteps(steps)}
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
                        {item.variable?.variables?.map((el: any, i: number) =>
                            el.isShow ? (
                                <Grid item key={el.field} md={el.style === 'TEXTAREA' ? 6 : 4} xs={12}>
                                    <FormExecute formik={formik} item={el} onChange={(e: any) => variableChange({ e, steps, i })} />
                                </Grid>
                            ) : null
                        )}
                        {item.flowStep.variable.variables.length !== 0 &&
                            item.flowStep.variable?.variables?.map((el: any, i: number) =>
                                el.isShow ? (
                                    <Grid
                                        item
                                        lg={el.field === 'prompt' ? 12 : el.style === 'TEXTAREA' ? 6 : 4}
                                        md={el.field === 'prompt' ? 12 : el.style === 'TEXTAREA' ? 6 : 4}
                                        xs={12}
                                        key={el.field}
                                    >
                                        <FormExecute formik={formik} item={el} onChange={(e: any) => promptChange({ e, steps, i })} />
                                    </Grid>
                                ) : null
                            )}
                    </Grid>
                </form>
                <Box my={2} display="flex">
                    {item.flowStep.response.style === 'TEXTAREA' || item.flowStep.response.style === 'INPUT' ? (
                        <Box width="100%" sx={{ background: '#f8fafc' }}>
                            <Box
                                sx={{ p: 2, height: item.flowStep.response.style === 'TEXTAREA' ? '300px' : '100px', overflow: 'auto' }}
                                ref={mdRef}
                            >
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
                                        {/* <Button
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
                                </Button> */}
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
                                    {/* {item.flowStep.response.answer && (
                                        <Typography sx={{ mt: 1, fontSize: '.75rem', mr: '24px' }}>
                                            {item.flowStep.response.answer?.length} {t('market.words')}
                                        </Typography>
                                    )} */}
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
    );
});
export default CarrOut;
