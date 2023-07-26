import { Card, CardHeader, Box, Grid, Button, Tab, Tabs, Divider, Typography, Chip } from '@mui/material';
import { getApp, getRecommendApp, appCreate, appModify } from 'api/template/index';
import { userBenefits } from 'api/template';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import AccessAlarm from '@mui/icons-material/AccessAlarm';
import { executeApp } from 'api/template/fetch';
import { t } from 'hooks/web/useI18n';
import { useEffect, useRef, useState, useCallback } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { dispatch } from 'store';
import userInfoStore from 'store/entitlementAction';
import { openSnackbar } from 'store/slices/snackbar';
import { TabsProps } from 'types';
import { Details, Execute } from 'types/template';
import Perform from 'views/template/carryOut/perform';
import Arrange from './arrange';
import Basis from './basis';
import Upload from './upLoad';
import marketStore from 'store/market';
export function TabPanel({ children, value, index, ...other }: TabsProps) {
    return (
        <div role="tabpanel" hidden={value !== index} id={`simple-tabpanel-${index}`} aria-labelledby={`simple-tab-${index}`} {...other}>
            {/* {value === index && ( */}
            <Box sx={{ p: 2, display: value === index ? 'block' : 'none' }}>
                <Box>{children}</Box>
            </Box>
            {/* )} */}
        </div>
    );
}
export function a11yProps(index: number) {
    return {
        id: `simple-tab-${index}`,
        'aria-controls': `simple-tabpanel-${index}`
    };
}
function CreateDetail() {
    const categoryList = marketStore((state) => state.categoryList);
    //路由跳转
    const navigate = useNavigate();
    const location = useLocation();
    const searchParams = new URLSearchParams(location.search);
    const { setUserInfo }: any = userInfoStore();
    //是否全部执行
    let isAllExecute = false;
    const [detail, setDetail] = useState(null as unknown as Details);
    const [loadings, setLoadings] = useState<any[]>([]);
    const basis = useRef<any>(null);
    //判断是保存还是切换tabs
    const changeData = (data: Execute) => {
        const { stepId, index }: { stepId: string; index: number } = data;
        const newValue = [...loadings];
        newValue[index] = true;
        if (!isAllExecute) {
            setLoadings(newValue);
        } else {
            const value: any[] = [];
            for (let i = index; i < detail.workflowConfig.steps.length; i++) {
                value[i] = true;
            }
            setLoadings(value);
        }
        const fetchData = async () => {
            let resp: any = await executeApp({
                appUid: searchParams.get('uid') ? searchParams.get('uid') : searchParams.get('recommend'),
                stepId: stepId,
                appReqVO: detail
            });
            const contentData = { ...detail };
            contentData.workflowConfig.steps[index].flowStep.response.answer = '';
            setDetail(contentData);
            const reader = resp.getReader();
            const textDecoder = new TextDecoder();
            let outerJoins: any;
            while (1) {
                let joins = outerJoins;
                const { done, value } = await reader.read();
                if (textDecoder.decode(value).includes('2008002007')) {
                    dispatch(
                        openSnackbar({
                            open: true,
                            message: t('market.error'),
                            variant: 'alert',
                            alert: {
                                color: 'error'
                            },
                            close: false
                        })
                    );
                    const newValue1 = [...loadings];
                    newValue1[index] = false;
                    setLoadings(newValue1);
                    return;
                }
                if (done) {
                    userBenefits().then((res) => {
                        setUserInfo(res);
                    });
                    if (
                        isAllExecute &&
                        index < detail.workflowConfig.steps.length - 1 &&
                        detail.workflowConfig.steps[index + 1].flowStep.response.style !== 'BUTTON'
                    ) {
                        changeData({
                            index: index + 1,
                            stepId: detail.workflowConfig.steps[index + 1].field,
                            steps: detail.workflowConfig.steps[index + 1]
                        });
                    }
                    break;
                }
                const newValue1 = [...loadings];
                newValue1[index] = false;
                setLoadings(newValue1);
                let str = textDecoder.decode(value);
                const lines = str.split('\n');
                lines.forEach((message, i: number) => {
                    if (i === 0 && joins) {
                        message = joins + message;
                        joins = undefined;
                    }
                    if (i === lines.length - 1) {
                        if (message && message.indexOf('}') === -1) {
                            joins = message;
                            return;
                        }
                    }
                    let bufferObj;
                    if (message?.startsWith('data:')) {
                        bufferObj = message.substring(5) && JSON.parse(message.substring(5));
                    }
                    if (bufferObj?.code === 200) {
                        contentData.workflowConfig.steps[index].flowStep.response.answer =
                            contentData.workflowConfig.steps[index].flowStep.response.answer + bufferObj.content;
                        setDetail(contentData);
                    } else if (bufferObj && bufferObj.code !== 200) {
                        dispatch(
                            openSnackbar({
                                open: true,
                                message: t('market.warning'),
                                variant: 'alert',
                                alert: {
                                    color: 'error'
                                },
                                close: false
                            })
                        );
                    }
                });
                outerJoins = joins;
            }
        };
        fetchData();
    };
    useEffect(() => {
        if (searchParams.get('uid')) {
            getApp({ uid: searchParams.get('uid') as string }).then((res) => {
                setDetail(res);
            });
        } else {
            getRecommendApp({ recommend: searchParams.get('recommend') as string }).then((res) => {
                setDetail(res);
            });
        }

        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);
    const [perform, setPerform] = useState('perform');
    //设置name desc
    const setData = (data: any) => {
        setDetail({
            ...detail,
            [data.name]: data.value
        });
    };
    //设置执行的步骤
    const exeChange = ({ e, steps, i }: any) => {
        const newValue = { ...detail };
        newValue.workflowConfig.steps[steps].variable.variables[i].value = e.value;
        setDetail(newValue);
    };
    //设置执行的prompt
    const promptChange = ({ e, steps, i }: any) => {
        const newValue = { ...detail };
        newValue.workflowConfig.steps[steps].flowStep.variable.variables[i].value = e.value;
        setDetail(newValue);
    };

    //增加 删除变量
    const changeConfigs = (data: any) => {
        setDetail({
            ...detail,
            workflowConfig: data
        });
        setPerform(perform + 1);
    };
    //设置提示词编排步骤的name desc
    const editChange = useCallback(
        ({ num, label, value, flag }: { num: number; label: string; value: string; flag: boolean | undefined }) => {
            const oldvalue = { ...detail };
            if (flag) {
                const changeValue = value;
                oldvalue.workflowConfig.steps[num].field = changeValue.replace(/\s+/g, '_').toUpperCase();
            }
            oldvalue.workflowConfig.steps[num][label] = value;
            setDetail(oldvalue);
        },
        [detail]
    );
    //提示词更改
    const basisChange = ({ e, index, i, flag = false }: any) => {
        const oldValue = { ...detail };
        if (flag) {
            oldValue.workflowConfig.steps[index].flowStep.variable.variables[i].isShow =
                !oldValue.workflowConfig.steps[index].flowStep.variable.variables[i].isShow;
        } else {
            if (e.name === 'res') {
                oldValue.workflowConfig.steps[index].flowStep.response.style = e.value;
            } else {
                oldValue.workflowConfig.steps[index].flowStep.variable.variables[i].defaultValue = e.value;
            }
        }
        setDetail(oldValue);
        setPerform(perform + 1);
    };
    const statusChange = ({ i, index }: { i: number; index: number }) => {
        const value = { ...detail };
        value.workflowConfig.steps[index].variable.variables[i].isShow = !value.workflowConfig.steps[index].variable.variables[i].isShow;
        setDetail(value);
    };
    //保存更改
    const saveDetail = () => {
        if (basis?.current?.submit()) {
            if (searchParams.get('uid')) {
                appModify(detail).then((res) => {
                    if (res.data) {
                        navigate('/my-app');
                        dispatch(
                            openSnackbar({
                                open: true,
                                message: t('market.modify'),
                                variant: 'alert',
                                alert: {
                                    color: 'success'
                                },
                                close: false
                            })
                        );
                    }
                });
            } else {
                appCreate(detail).then((res) => {
                    if (res.data) {
                        navigate('/my-app');
                        dispatch(
                            openSnackbar({
                                open: true,
                                message: t('market.create'),
                                variant: 'alert',
                                alert: {
                                    color: 'success'
                                },
                                close: false
                            })
                        );
                    }
                });
            }
        } else {
            setValue(0);
        }
    };
    //tabs
    const [value, setValue] = useState(0);
    const handleChange = (event: React.SyntheticEvent, newValue: number) => {
        setValue(newValue);
    };
    return (
        <Card>
            <CardHeader
                sx={{ padding: 2 }}
                avatar={
                    <Button
                        variant="contained"
                        startIcon={<ArrowBackIcon />}
                        color="secondary"
                        onClick={() => navigate('/template/createCenter')}
                    >
                        {t('myApp.back')}
                    </Button>
                }
                title={detail?.name}
                action={
                    <Button variant="contained" color="secondary" autoFocus onClick={saveDetail}>
                        {t('myApp.save')}
                    </Button>
                }
            ></CardHeader>
            <Divider />
            <Tabs value={value} onChange={handleChange}>
                <Tab label={t('myApp.basis')} {...a11yProps(0)} />
                <Tab label={t('myApp.arrangement')} {...a11yProps(1)} />
                <Tab label={t('myApp.upload')} {...a11yProps(2)} />
            </Tabs>
            <TabPanel value={value} index={0}>
                <Grid container spacing={2}>
                    <Grid item lg={6}>
                        {detail && (
                            <Basis
                                ref={basis}
                                initialValues={{
                                    name: detail?.name,
                                    desc: detail?.description,
                                    categories: detail?.categories,
                                    tags: detail?.tags
                                }}
                                setValues={setData}
                            />
                        )}
                    </Grid>
                    <Grid item lg={6}>
                        <Typography variant="h5" mb={1}>
                            {t('market.debug')}
                        </Typography>
                        <Card elevation={2} sx={{ p: 2 }}>
                            <Box display="flex" justifyContent="space-between" alignItems="center">
                                <Box display="flex" justifyContent="space-between" alignItems="center">
                                    <AccessAlarm sx={{ fontSize: '70px' }} />
                                    <Box>
                                        <Box>
                                            <Typography variant="h1" sx={{ fontSize: '2rem' }}>
                                                {detail?.name}
                                            </Typography>
                                        </Box>
                                        <Box>
                                            {detail?.categories?.map((item: any) => (
                                                <span key={item}>
                                                    #{categoryList?.find((el: { code: string }) => el.code === item)?.name}
                                                </span>
                                            ))}
                                            {detail?.tags?.map((el: any) => (
                                                <Chip key={el} sx={{ marginLeft: 1 }} size="small" label={el} variant="outlined" />
                                            ))}
                                        </Box>
                                    </Box>
                                </Box>
                            </Box>
                            <Divider sx={{ mb: 1 }} />
                            <Typography variant="h5" sx={{ fontSize: '1.1rem', mb: 3 }}>
                                {detail?.description}
                            </Typography>
                            <Perform
                                key={perform}
                                config={detail?.workflowConfig}
                                changeSon={changeData}
                                loadings={loadings}
                                variableChange={exeChange}
                                promptChange={promptChange}
                                isallExecute={(flag: boolean) => {
                                    isAllExecute = flag;
                                }}
                                source="myApp"
                            />
                        </Card>
                    </Grid>
                </Grid>
            </TabPanel>
            <TabPanel value={value} index={1}>
                <Grid container spacing={2}>
                    <Grid item lg={6} sx={{ width: '100%' }}>
                        {detail && (
                            <Arrange
                                config={detail?.workflowConfig}
                                editChange={editChange}
                                basisChange={basisChange}
                                statusChange={statusChange}
                                changeConfigs={changeConfigs}
                            />
                        )}
                    </Grid>
                    <Grid item lg={6}>
                        <Typography variant="h5" mb={1}>
                            {t('market.debug')}
                        </Typography>
                        <Card elevation={2} sx={{ p: 2 }}>
                            <Box display="flex" justifyContent="space-between" alignItems="center">
                                <Box display="flex" justifyContent="space-between" alignItems="center">
                                    <AccessAlarm sx={{ fontSize: '70px' }} />
                                    <Box>
                                        <Box>
                                            <Typography variant="h1" sx={{ fontSize: '2rem' }}>
                                                {detail?.name}
                                            </Typography>
                                        </Box>
                                        <Box>
                                            {detail?.categories?.map((item: any) => (
                                                <span key={item}>
                                                    #{categoryList?.find((el: { code: string }) => el.code === item)?.name}
                                                </span>
                                            ))}
                                            {detail?.tags?.map((el: any) => (
                                                <Chip key={el} sx={{ marginLeft: 1 }} size="small" label={el} variant="outlined" />
                                            ))}
                                        </Box>
                                    </Box>
                                </Box>
                            </Box>
                            <Divider sx={{ mb: 1 }} />
                            <Typography variant="h5" sx={{ fontSize: '1.1rem', mb: 3 }}>
                                {detail?.description}
                            </Typography>
                            <Perform
                                key={perform}
                                config={detail?.workflowConfig}
                                changeSon={changeData}
                                loadings={loadings}
                                variableChange={exeChange}
                                promptChange={promptChange}
                                isallExecute={(flag: boolean) => {
                                    isAllExecute = flag;
                                }}
                                source="myApp"
                            />
                        </Card>
                    </Grid>
                </Grid>
            </TabPanel>
            <TabPanel value={value} index={2}>
                <Upload />
            </TabPanel>
        </Card>
    );
}
export default CreateDetail;
