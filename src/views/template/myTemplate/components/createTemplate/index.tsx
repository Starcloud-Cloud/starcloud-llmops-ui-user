import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import { Box, Button, Card, CardHeader, Divider, Grid, Link, Tab, Tabs, Typography } from '@mui/material';
import { userBenefits } from 'api/template';
import { executeApp } from 'api/template/fetch';
import { appCreate, appModify, getApp, getRecommendApp } from 'api/template/index';
import { t } from 'hooks/web/useI18n';
import { useCallback, useEffect, useRef, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { dispatch } from 'store';
import userInfoStore from 'store/entitlementAction';
import { openSnackbar } from 'store/slices/snackbar';
import { TabsProps } from 'types';
import { Details, Execute } from 'types/template';
import Perform from 'views/template/carryOut/perform';
import Arrange from './arrange';
import Basis from './basis';
import { FashionStyling } from './chat/FashionStyling';
import { Knowledge } from './chat/Knowledge';
import { Regulation } from './chat/Regulation';
import { Skill } from './chat/Skill';
import { Chat } from './chat/chat';
import Upload from './upLoad';

export function TabPanel({ children, value, index, ...other }: TabsProps) {
    return (
        <div role="tabpanel" hidden={value !== index} id={`simple-tabpanel-${index}`} aria-labelledby={`simple-tab-${index}`} {...other}>
            {value === index && (
                <Box sx={{ p: 3 }}>
                    <Box>{children}</Box>
                </Box>
            )}
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
                oldvalue.workflowConfig.steps[num].field = value;
            }
            oldvalue.workflowConfig.steps[num][label] = value;
            setDetail(oldvalue);
        },
        [detail]
    );
    //提示词更改
    const basisChange = ({ e, index, i }: any) => {
        const oldValue = { ...detail };
        oldValue.workflowConfig.steps[index].flowStep.variable.variables[i].defaultValue = e.value;
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
                    <Button variant="contained" color="secondary" disabled={value !== 0} autoFocus onClick={saveDetail}>
                        {t('myApp.save')}
                    </Button>
                }
            ></CardHeader>
            <Divider />
            <Tabs
                sx={{
                    m: 3,
                    mb: 0,
                    '& a': {
                        minHeight: 'auto',
                        minWidth: 10,
                        py: 1.5,
                        px: 1,
                        mr: 2.2,
                        display: 'flex',
                        flexDirection: 'row',
                        alignItems: 'center',
                        justifyContent: 'center'
                    },
                    '& a > svg': {
                        mb: '0px !important',
                        mr: 1.1
                    }
                }}
                value={value}
                variant="scrollable"
                onChange={handleChange}
            >
                <Tab component={Link} label={t('myApp.basis')} {...a11yProps(0)} />
                <Tab component={Link} label={t('myApp.arrangement')} {...a11yProps(1)} />
                <Tab component={Link} label={t('myApp.upload')} {...a11yProps(2)} />
                <Tab component={Link} label={'形象设计'} {...a11yProps(3)} />
                <Tab component={Link} label={'规则设定'} {...a11yProps(4)} />
                <Tab component={Link} label={'知识库'} {...a11yProps(5)} />
                <Tab component={Link} label={'技能'} {...a11yProps(6)} />
                <Tab component={Link} label={'会话'} {...a11yProps(7)} />
            </Tabs>
            <TabPanel value={value} index={0}>
                <Grid container spacing={2}>
                    <Grid item lg={6}>
                        {detail && (
                            <Basis ref={basis} initialValues={{ name: detail?.name, desc: detail?.description }} setValues={setData} />
                        )}
                    </Grid>
                    <Grid item lg={6}>
                        <Typography variant="h3">{t('market.debug')}</Typography>
                        <Card elevation={2} sx={{ p: 2 }}>
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
                        <Arrange
                            config={detail?.workflowConfig}
                            editChange={editChange}
                            basisChange={basisChange}
                            statusChange={statusChange}
                            changeConfigs={changeConfigs}
                        />
                    </Grid>
                    <Grid item lg={6}>
                        <Typography variant="h3">调试与预览</Typography>
                        <Card elevation={2} sx={{ p: 2 }}>
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
            <TabPanel value={value} index={3}>
                <FashionStyling />
            </TabPanel>
            <TabPanel value={value} index={4}>
                <Regulation />
            </TabPanel>
            <TabPanel value={value} index={5}>
                <Knowledge />
            </TabPanel>
            <TabPanel value={value} index={6}>
                <Skill />
            </TabPanel>
            <TabPanel value={value} index={7}>
                <Chat />
            </TabPanel>
        </Card>
    );
}

export default CreateDetail;
