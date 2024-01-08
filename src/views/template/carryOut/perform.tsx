import { Tooltip, IconButton, Button, Typography, Grid, Box, Card, CardContent, CircularProgress, TextField } from '@mui/material';
import { Album, ErrorOutline, NotStarted, AutoAwesome, ContentPaste, InsertPhoto } from '@mui/icons-material';
import Zh from 'assets/images/icons/zhongwen.svg';
import En from 'assets/images/icons/yingwen.svg';
import { El } from 'types/template';
import { t } from 'hooks/web/useI18n';
import { useRef, useEffect, memo } from 'react';
import { useTheme } from '@mui/material/styles';
import _ from 'lodash-es';
import copy from 'clipboard-copy';
import FormExecute from 'views/template/components/validaForm';
import { translateText } from 'api/picture/create';
import { openSnackbar } from 'store/slices/snackbar';
import { useNavigate } from 'react-router-dom';
import { dispatch } from 'store';
function Perform({
    detaData,
    config,
    changeSon,
    source,
    loadings,
    isallExecute,
    variableChange,
    promptChange,
    changeanswer,
    history = false,
    isShows,
    changeConfigs
}: any) {
    const refs = useRef<any>([]);
    //点击全部执行
    const allExecute = () => {
        const newValue = _.cloneDeep(config);
        isallExecute(true);
        newValue.steps = newValue.steps.map((item: any) => changeValue(item));
        changeConfigs(newValue);
        changeSon({ stepId: config.steps[0].field, index: 0 });
    };
    //执行默认值赋值
    const changeValue = (item: any) => {
        const newValue = _.cloneDeep(item);
        newValue.variable?.variables.forEach((item: any) => {
            if (item.isShow && !item.value && item.defaultValue) {
                item.value = item.defaultValue;
            }
        });
        newValue.flowStep.variable.variables.forEach((item: any) => {
            if (item.isShow && !item.value && item.defaultValue) {
                item.value = item.defaultValue;
            }
        });
        return newValue;
    };
    //点击单个执行
    const executeAPP = async (index: number) => {
        const newValue = _.cloneDeep(config);
        isallExecute(false);
        newValue.steps[index] = changeValue(newValue.steps[index]);
        changeConfigs(newValue);
        changeSon({ stepId: newValue.steps[index].field, index });
    };
    //是否全部禁用
    const allDisable = () => {
        const flag = config?.steps?.map((item: any, index: number) => {
            return disSteps(index);
        });
        return flag?.some((value: boolean) => value === true);
    };
    //执行按钮是否全部禁用
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
        return model?.some((value: boolean) => value === true) || variable?.some((value: boolean) => value === true);
    };
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
    //输出流文字时自动往下
    const mdRef: any = useRef([]);
    useEffect(() => {
        if (mdRef.current && mdRef.current.length > 0) {
            config?.steps?.map((item: any, index: number) => {
                if (item.flowStep.response.style !== 'IMAGE' && mdRef.current[index]) {
                    mdRef.current[index].scrollTop = mdRef.current[index]?.scrollHeight;
                }
            });
        }
    }, [config?.steps?.map((item: any) => item?.flowStep.response.answer)]);
    const theme = useTheme();
    const isDarkMode = theme.palette.mode === 'dark';
    const navigate = useNavigate();
    return (
        <Box>
            <div className="flex items-center">
                {config?.steps.length > 1 && (
                    <div>
                        <Button
                            disabled={allDisable() || history}
                            color="secondary"
                            startIcon={<Album />}
                            variant="contained"
                            onClick={allExecute}
                        >
                            {t('market.allExecute')}
                        </Button>
                        <Tooltip title={t('market.allStepTips')}>
                            <IconButton sx={{ mr: '20px' }} size="small">
                                <ErrorOutline />
                            </IconButton>
                        </Tooltip>
                    </div>
                )}
                {detaData?.tags?.includes('Listing') && source === 'market' && (
                    <div
                        onClick={() => navigate('/listingBuilderPage')}
                        className="text-[18px] font-bold text-[#ff4d4f] cursor-pointer hover:underline"
                    >
                        超级 Listing 已上线，立即体验
                    </div>
                )}
            </div>
            {config?.steps?.map((item: any, steps: number) => (
                <Card key={item.field + item.steps} sx={{ position: 'relative' }}>
                    {item.flowStep?.response.style !== 'BUTTON' && (
                        <>
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
                                                <ErrorOutline />
                                            </IconButton>
                                        </Tooltip>
                                        <Button
                                            onClick={() => executeAPP(steps)}
                                            disabled={disSteps(steps) || history}
                                            color="secondary"
                                            size="small"
                                            startIcon={<NotStarted />}
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
                                                    <FormExecute item={el} onChange={(e: any) => variableChange({ e, steps, i })} />
                                                </Grid>
                                            ) : null
                                        )}
                                        {item.flowStep?.variable?.variables.length !== 0 &&
                                            item.flowStep?.variable?.variables?.map((el: any, i: number) =>
                                                el.isShow ? (
                                                    <Grid
                                                        item
                                                        lg={el.field === 'prompt' ? 12 : el.style === 'TEXTAREA' ? 6 : 3}
                                                        md={el.field === 'prompt' ? 12 : el.style === 'TEXTAREA' ? 6 : 3}
                                                        xs={12}
                                                        key={i}
                                                    >
                                                        <FormExecute item={el} onChange={(e: any) => promptChange({ e, steps, i })} />
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
                                                inputRef={(el) => (mdRef.current[steps] = el)}
                                                fullWidth
                                                color="secondary"
                                                InputLabelProps={{ shrink: true }}
                                                label={
                                                    <Box display="flex" alignItems="center">
                                                        <AutoAwesome fontSize="small" />
                                                        {t('myApp.execuent')}
                                                    </Box>
                                                }
                                                onChange={(e) => {
                                                    changeanswer({ value: e.target.value, index: steps });
                                                }}
                                                value={item.flowStep.response.answer}
                                                placeholder={item.flowStep.response.defaultValue}
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
                                                                dispatch(
                                                                    openSnackbar({
                                                                        open: true,
                                                                        message: '复制成功',
                                                                        variant: 'alert',
                                                                        alert: {
                                                                            color: 'success'
                                                                        },
                                                                        close: false,
                                                                        anchorOrigin: { vertical: 'top', horizontal: 'right' },
                                                                        transition: 'SlideLeft'
                                                                    })
                                                                );
                                                            }}
                                                        >
                                                            <ContentPaste fontSize="small" />
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
                                            <InsertPhoto fontSize="large" />
                                        </Card>
                                    )}
                                </Box>
                            </CardContent>
                        </>
                    )}
                </Card>
            ))}
        </Box>
    );
}

const arePropsEqual = (prevProps: any, nextProps: any) => {
    return (
        JSON.stringify(prevProps?.config?.steps) === JSON.stringify(nextProps?.config?.steps) &&
        JSON.stringify(prevProps?.loadings) === JSON.stringify(nextProps?.loadings) &&
        JSON.stringify(prevProps?.isShows) === JSON.stringify(nextProps?.isShows)
    );
};
export default memo(Perform, arePropsEqual);
