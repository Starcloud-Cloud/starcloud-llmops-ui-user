import { Tooltip, IconButton, Button, Typography, Grid, Box, Card, CardContent, CircularProgress, TextField } from '@mui/material';
import Zh from 'assets/images/icons/zhongwen.svg';
import En from 'assets/images/icons/yingwen.svg';
import ReplyIcon from '@mui/icons-material/Reply';
import InsertPhotoIcon from '@mui/icons-material/InsertPhoto';
import ContentPasteIcon from '@mui/icons-material/ContentPaste';
import AutoAwesomeIcon from '@mui/icons-material/AutoAwesome';
import NotStartedIcon from '@mui/icons-material/NotStarted';
import ErrorOutlineIcon from '@mui/icons-material/ErrorOutline';
import { useFormik as Formik } from 'formik';
import FormExecute from 'views/template/components/validaForm';
import generateValidationSchema from 'hooks/usevalid';
// import ReactMarkdown from 'react-markdown';
// import remarkGfm from 'remark-gfm';
import { useTheme } from '@mui/material/styles';
import { t } from 'hooks/web/useI18n';
import { El } from 'types/template';
import { useRef, forwardRef, useImperativeHandle, useEffect } from 'react';
import _ from 'lodash-es';
import copy from 'clipboard-copy';
import { translateText } from 'api/picture/create';

const CarrOut = forwardRef(
    ({ config, source, loadings, variableChange, promptChange, item, steps, callBack, changeanswer, history, isShows }: any, ref) => {
        const theme = useTheme();
        const isDarkMode = theme.palette.mode === 'dark';
        useImperativeHandle(ref, () => ({
            formiks: formik,
            submit: () => {
                const curren = async () => {
                    const newValue = _.cloneDeep(config);
                    const promises: any[] = [];
                    const promises1: any[] = [];
                    if (newValue.steps[steps].variable && newValue.steps[steps].variable.variables) {
                        for (const [i, item] of newValue.steps[steps].variable.variables.entries()) {
                            if (item.isShow && item.defaultValue && (item.value === '' || !item.value)) {
                                promises.push(asyncMethos(item, i));
                            }
                        }
                    }

                    for (const [i, item] of newValue.steps[steps].flowStep.variable.variables.entries()) {
                        if (item.isShow && item.defaultValue && (item.value === '' || !item.value)) {
                            promises1.push(asyncMethos1(item, i));
                        }
                    }
                    await Promise.all(promises);
                    await Promise.all(promises1);

                    // if (Object.values(formik.values).some((value) => value === '')) {
                    //      await formik.handleSubmit();
                    //     return false;
                    // } else {
                    //     return formik.values;
                    // }
                };
                curren();
            }
        }));
        const fn = (data: any[]) => {
            const Data: Record<string, any> = {};
            data.map((variable: { isShow: boolean; field: string; value: string }) => {
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
                    return el.value || el.value === false || el.defaultValue || el.defaultValue === false ? false : true;
                } else {
                    return el.defaultValue || el.defaultValue === false ? false : true;
                }
            });
            const variable = config?.steps[index].variable?.variables.map((el: El) => {
                if (el.isShow) {
                    return el.value || el.value || el.defaultValue || el.defaultValue === false ? false : true;
                } else {
                    return false;
                }
            });
            return model?.some((value: boolean) => value === true) || variable?.some((value: boolean) => value === true) ? true : false;
        };
        const asyncMethos = async (item: any, i: number) => {
            await promptChange({ e: { value: item.defaultValue }, steps, i, flag: true });
            await formik.setFieldValue(item.field, item.defaultValue);
        };
        const asyncMethos1 = async (item: any, i: number) => {
            await promptChange({ e: { value: item.defaultValue }, steps, i });
            await formik.setFieldValue(item.field, item.defaultValue);
        };
        //点击单个执行
        const executeAPP = async (index: number) => {
            const newValue = _.cloneDeep(config);
            const promises: any[] = [];
            const promises1: any[] = [];
            if (newValue.steps[index].variable && newValue.steps[index].variable.variables) {
                for (const [i, item] of newValue.steps[index].variable.variables.entries()) {
                    if (item.isShow && item.defaultValue && (item.value === '' || !item.value)) {
                        promises.push(asyncMethos(item, i));
                    }
                }
            }
            for (const [i, item] of newValue.steps[index].flowStep.variable.variables.entries()) {
                if (item.isShow && item.defaultValue && (item.value === '' || !item.value)) {
                    promises1.push(asyncMethos1(item, i));
                }
            }
            await Promise.all(promises);
            await Promise.all(promises1);
            await formik.handleSubmit();
        };
        useEffect(() => {
            if (mdRef.current) {
                mdRef.current.scrollTop = mdRef.current.scrollHeight;
            }
        }, [item?.flowStep.response.answer]);
        //翻译
        const translation = (flag: boolean, value: string, index: number) => {
            translateText({
                textList: [value],
                sourceLanguage: !flag ? 'en' : 'zh',
                targetLanguage: !flag ? 'zh' : 'en'
            }).then((res) => {
                changeanswer({ value: res.translatedList[0].translated, index });
            });
        };
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
                                <Typography variant="caption" display="block" mt={1}>
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
                                onClick={() => executeAPP(steps)}
                                disabled={disSteps(steps) || history}
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
                                    <Grid item key={i} md={el.style === 'TEXTAREA' ? 6 : 3} xs={12}>
                                        <FormExecute formik={formik} item={el} onChange={(e: any) => variableChange({ e, steps, i })} />
                                    </Grid>
                                ) : null
                            )}
                            {item.flowStep.variable.variables.length !== 0 &&
                                item.flowStep.variable?.variables?.map((el: any, i: number) =>
                                    el.isShow ? (
                                        <Grid
                                            item
                                            lg={el.field === 'prompt' ? 12 : el.style === 'TEXTAREA' ? 6 : 3}
                                            md={el.field === 'prompt' ? 12 : el.style === 'TEXTAREA' ? 6 : 3}
                                            xs={12}
                                            key={i}
                                        >
                                            <FormExecute formik={formik} item={el} onChange={(e: any) => promptChange({ e, steps, i })} />
                                        </Grid>
                                    ) : null
                                )}
                        </Grid>
                    </form>
                    <Box my={1}>
                        {item.flowStep.response.style === 'TEXTAREA' || item.flowStep.response.style === 'INPUT' ? (
                            // <>
                            //     <Typography color="#697586" ml={1} mb={-1.5} display="flex" alignItems="center">
                            //         <AutoAwesomeIcon fontSize="small" />
                            //         &nbsp; {t('myApp.execuent')}
                            //     </Typography>
                            //     <Box width="100%" sx={{ background: isDarkMode ? '#1a223f' : '#f8fafc' }}>
                            //         <Box
                            //             sx={{
                            //                 p: 2,
                            //                 minHeight: item.flowStep.response.style === 'TEXTAREA' ? '200px' : '50px',
                            //                 maxHeight: item.flowStep.response.style === 'TEXTAREA' ? '400px' : '100px',
                            //                 overflow: 'auto'
                            //             }}
                            //             ref={mdRef}
                            //         >
                            //             <ReactMarkdown children={item.flowStep.response.answer} remarkPlugins={[remarkGfm]} />
                            //         </Box>
                            //         {item.flowStep.response.answer && (
                            //             <Box width="100%" display="flex" justifyContent="space-between" overflow="hidden">
                            //                 <Box>
                            //                     <Button
                            //                         sx={{ mt: 1, mr: 1 }}
                            //                         size="small"
                            //                         variant="outlined"
                            //                         color="secondary"
                            //                         startIcon={<ContentPasteIcon />}
                            //                         onClick={() => {
                            //                             copy(item.flowStep.response.answer);
                            //                         }}
                            //                     >
                            //                         {t('market.copys')}
                            //                     </Button>
                            //                     {/* <Button
                            //             sx={{ mt: 1, mr: 1 }}
                            //             size="small"
                            //             variant="outlined"
                            //             color="secondary"
                            //             startIcon={<ThumbUpAltOutlinedIcon />}
                            //         >
                            //             {t('market.like')}
                            //         </Button>
                            //         <Button
                            //             sx={{ mt: 1, mr: 1 }}
                            //             size="small"
                            //             variant="outlined"
                            //             color="secondary"
                            //             startIcon={<ThumbDownOutlinedIcon />}
                            //         >
                            //             {t('market.Step')}
                            //         </Button> */}
                            //                     <Button
                            //                         sx={{ display: { xs: 'inlineBlock', md: 'none' }, mt: 1, mr: 1 }}
                            //                         size="small"
                            //                         variant="outlined"
                            //                         color="secondary"
                            //                         startIcon={<ReplyIcon />}
                            //                     >
                            //                         {t('market.share')}
                            //                     </Button>
                            //                 </Box>
                            //             </Box>
                            //         )}
                            //     </Box>
                            // </>
                            <>
                                <TextField
                                    sx={{ mt: 2 }}
                                    inputRef={mdRef}
                                    fullWidth
                                    color="secondary"
                                    InputLabelProps={{ shrink: true }}
                                    label={
                                        <Box display="flex" alignItems="center">
                                            <AutoAwesomeIcon fontSize="small" />
                                            {t('myApp.execuent')}
                                        </Box>
                                    }
                                    onChange={(e) => {
                                        changeanswer({ value: e.target.value, index: steps });
                                    }}
                                    value={item.flowStep.response.answer}
                                    multiline
                                    minRows={item.flowStep.response.style === 'TEXTAREA' ? 5 : 1}
                                    maxRows={item.flowStep.response.style === 'TEXTAREA' ? 7 : 2}
                                />
                                {item.flowStep.response.answer && isShows[steps] && (
                                    <Box width="100%" display="flex" justifyContent="space-between" overflow="hidden">
                                        <Box>
                                            <IconButton
                                                color="secondary"
                                                onClick={() => {
                                                    copy(item.flowStep.response.answer);
                                                }}
                                            >
                                                <ContentPasteIcon fontSize="small" />
                                            </IconButton>
                                            <IconButton
                                                onClick={() =>
                                                    translation(
                                                        /[\u4e00-\u9fa5]/.test(item.flowStep.response.answer),
                                                        item.flowStep.response.answer,
                                                        steps
                                                    )
                                                }
                                            >
                                                {/[\u4e00-\u9fa5]/.test(item.flowStep.response.answer) ? (
                                                    <Tooltip title="翻译成英文" arrow placement="top">
                                                        <img width="20px" src={En} alt="" />
                                                    </Tooltip>
                                                ) : (
                                                    <Tooltip title="翻译成中文" arrow placement="top">
                                                        <img width="20px" src={Zh} alt="" />
                                                    </Tooltip>
                                                )}
                                            </IconButton>
                                        </Box>
                                    </Box>
                                )}
                            </>
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
    }
);
export default CarrOut;
