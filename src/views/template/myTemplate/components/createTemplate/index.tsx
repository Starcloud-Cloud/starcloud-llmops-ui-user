import {
    Box,
    Button,
    Card,
    CardHeader,
    Chip,
    Divider,
    Grid,
    IconButton,
    ListItemIcon,
    Menu,
    MenuItem,
    Tab,
    Tabs,
    Typography
} from '@mui/material';
import { Image } from 'antd';
import { ArrowBack, Delete, MoreVert, ErrorOutline } from '@mui/icons-material';
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
import ApplicationAnalysis from 'views/template/applicationAnalysis';
import Upload from './upLoad';
import { del } from 'api/template';
import marketStore from 'store/market';
import _ from 'lodash-es';
import { PermissionUpgradeModal } from 'views/template/myChat/createChat/components/modal/permissionUpgradeModal';
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
    const detailRef: any = useRef(null);
    const [loadings, setLoadings] = useState<any[]>([]);
    //是否显示分享翻译
    const [isShows, setIsShow] = useState<any[]>([]);
    const basis = useRef<any>(null);
    let conversationUid: undefined | string = undefined;
    //token不足
    const [tokenOpen, setTokenOpen] = useState(false);
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
                appReqVO: detailRef.current,
                conversationUid
            });

            const contentData = _.cloneDeep(detailRef.current);
            contentData.workflowConfig.steps[index].flowStep.response.answer = '';
            detailRef.current = _.cloneDeep(contentData);
            setDetail(contentData);
            const reader = resp.getReader();
            const textDecoder = new TextDecoder();
            let outerJoins: any;
            while (1) {
                let joins = outerJoins;
                const { done, value } = await reader.read();
                if (textDecoder.decode(value).includes('2008002007')) {
                    setTokenOpen(true);
                    const newValue1 = [...loadings];
                    newValue1[index] = false;
                    setLoadings(newValue1);
                    return;
                }
                if (done) {
                    const newValue1 = [...loadings];
                    newValue1[index] = false;
                    setLoadings(newValue1);
                    const newShow = _.cloneDeep(isShows);
                    newShow[index] = true;
                    setIsShow(newShow);
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
                    if (bufferObj?.code === 200 && bufferObj.type !== 'ads-msg') {
                        const newValue1 = [...loadings];
                        newValue1[index] = false;
                        setLoadings(newValue1);
                        if (!conversationUid && index === 0 && isAllExecute) {
                            conversationUid = bufferObj.conversationUid;
                        }
                        const contentData1 = _.cloneDeep(contentData);
                        contentData1.workflowConfig.steps[index].flowStep.response.answer =
                            detailRef.current.workflowConfig.steps[index].flowStep.response.answer + bufferObj.content;
                        detailRef.current = _.cloneDeep(contentData1);
                        setDetail(contentData1);
                    } else if (bufferObj?.code === 200 && bufferObj.type === 'ads-msg') {
                        dispatch(
                            openSnackbar({
                                open: true,
                                message: bufferObj.content,
                                variant: 'alert',
                                alert: {
                                    color: 'success'
                                },
                                close: false
                            })
                        );
                    } else if (bufferObj && bufferObj.code !== 200 && bufferObj.code !== 300900000) {
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
        getList();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);
    const getList = (data: string | null = null) => {
        detailRef.current = {};
        if (data) {
            getApp({ uid: data }).then((res) => {
                resUpperCase(res);
            });
        } else {
            if (searchParams.get('uid')) {
                getApp({ uid: searchParams.get('uid') as string }).then((res) => {
                    resUpperCase(res);
                });
            } else {
                getRecommendApp({ recommend: searchParams.get('recommend') as string }).then((res) => {
                    resUpperCase(res);
                });
            }
        }
    };
    const resUpperCase = (result: Details) => {
        const newValue = { ...result };
        newValue.workflowConfig.steps?.forEach((item) => {
            item.variable?.variables.forEach((el: { field: string }) => {
                el.field = el.field.toUpperCase();
            });
        });
        detailRef.current = _.cloneDeep(newValue);
        setDetail(newValue);
    };
    const [perform, setPerform] = useState('perform');
    //设置name desc
    const setData = (data: any) => {
        detailRef.current = {
            ..._.cloneDeep(detail),
            [data.name]: data.value
        };
        setDetail({
            ..._.cloneDeep(detailRef.current),
            [data.name]: data.value
        });
    };
    //设置执行的步骤
    const exeChange = ({ e, steps, i }: any) => {
        const newValue = _.cloneDeep(detail);
        newValue.workflowConfig.steps[steps].variable.variables[i].value = e.value;
        detailRef.current = _.cloneDeep(newValue);
        setDetail(newValue);
    };
    //设置执行的prompt
    const promptChange = async ({ e, steps, i, flag = false }: any) => {
        const newValue = _.cloneDeep(detailRef.current);
        if (flag) {
            newValue.workflowConfig.steps[steps].variable.variables[i].value = e.value;
        } else {
            newValue.workflowConfig.steps[steps].flowStep.variable.variables[i].value = e.value;
        }
        detailRef.current = _.cloneDeep(newValue);
        setDetail(newValue);
    };
    //增加 删除 改变变量
    const changeConfigs = (data: any) => {
        detailRef.current = _.cloneDeep({
            ...detail,
            workflowConfig: data
        });
        setDetail(
            _.cloneDeep({
                ...detail,
                workflowConfig: data
            })
        );
        setPerform(perform + 1);
    };
    //设置提示词编排步骤的name desc
    const editChange = useCallback(
        ({ num, label, value, flag }: { num: number; label: string; value: string; flag: boolean | undefined }) => {
            const oldvalue = _.cloneDeep(detailRef.current);
            if (flag) {
                const changeValue = value;
                oldvalue.workflowConfig.steps[num].field = changeValue.replace(/\s+/g, '_').toUpperCase();
            }
            oldvalue.workflowConfig.steps[num][label] = value;
            detailRef.current = oldvalue;

            setDetail(oldvalue);
        },
        [detail]
    );
    //提示词更改
    const basisChange = ({ e, index, i, flag = false, values = false }: any) => {
        const oldValue = _.cloneDeep(detailRef.current);
        if (flag) {
            oldValue.workflowConfig.steps[index].flowStep.variable.variables[i].isShow =
                !oldValue.workflowConfig.steps[index].flowStep.variable.variables[i].isShow;
        } else {
            if (e.name === 'res') {
                oldValue.workflowConfig.steps[index].flowStep.response.style = e.value;
            } else {
                if (values) {
                    oldValue.workflowConfig.steps[index].flowStep.variable.variables[i].value = e.value;
                } else {
                    oldValue.workflowConfig.steps[index].flowStep.variable.variables[i].defaultValue = e.value;
                }
            }
        }
        detailRef.current = _.cloneDeep(oldValue);
        setDetail(oldValue);
        setPerform(perform + 1);
    };
    const statusChange = ({ i, index }: { i: number; index: number }) => {
        const value = _.cloneDeep(detail);
        value.workflowConfig.steps[index].variable.variables[i].isShow = !value.workflowConfig.steps[index].variable.variables[i].isShow;
        detailRef.current = _.cloneDeep(value);
        setDetail(value);
    };
    //更改answer
    const changeanswer = ({ value, index }: any) => {
        const newValue = _.cloneDeep(detail);
        newValue.workflowConfig.steps[index].flowStep.response.answer = value;
        detailRef.current = newValue;
        setDetail(newValue);
    };
    //保存更改
    const saveDetail = () => {
        if (!basis?.current?.submit()) {
            if (searchParams.get('uid')) {
                appModify(detail).then((res) => {
                    if (res.data) {
                        setSaveState(saveState + 1);
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
                        navigate('/createApp?uid=' + res.data.uid);
                        getList(res.data.uid);
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
    // 删除按钮的menu
    const [delAnchorEl, setDelAnchorEl] = useState<null | HTMLElement>(null);
    const delOpen = Boolean(delAnchorEl);
    const [saveState, setSaveState] = useState<number>(0);
    const [flag, setflag] = useState(false);
    //获取状态
    const getStatus = (data: boolean) => {
        setflag(data);
    };
    return (
        <Card>
            <CardHeader
                sx={{ padding: 2 }}
                avatar={
                    <Button
                        variant="contained"
                        startIcon={<ArrowBack />}
                        color="secondary"
                        onClick={() => navigate('/template/createCenter')}
                    >
                        {t('myApp.back')}
                    </Button>
                }
                title={<Typography variant="h3">{detail?.name}</Typography>}
                action={
                    <>
                        {searchParams.get('uid') && (
                            <IconButton
                                aria-label="more"
                                id="long-button"
                                aria-controls={delOpen ? 'long-menu' : undefined}
                                aria-expanded={delOpen ? 'true' : undefined}
                                aria-haspopup="true"
                                onClick={(e) => {
                                    setDelAnchorEl(e.currentTarget);
                                }}
                            >
                                <MoreVert />
                            </IconButton>
                        )}
                        <Menu
                            id="del-menu"
                            MenuListProps={{
                                'aria-labelledby': 'del-button'
                            }}
                            anchorEl={delAnchorEl}
                            open={delOpen}
                            onClose={() => {
                                setDelAnchorEl(null);
                            }}
                        >
                            <MenuItem
                                onClick={() => {
                                    del(searchParams.get('uid') as string).then((res) => {
                                        if (res) {
                                            setDelAnchorEl(null);
                                            navigate('/my-app');
                                        }
                                    });
                                }}
                            >
                                <ListItemIcon>
                                    <Delete color="error" />
                                </ListItemIcon>
                                <Typography variant="inherit" noWrap>
                                    {t('myApp.delApp')}
                                </Typography>
                            </MenuItem>
                        </Menu>
                        <Button variant="contained" color="secondary" autoFocus onClick={saveDetail}>
                            {t('myApp.save')}
                        </Button>
                    </>
                }
            ></CardHeader>
            <Divider />
            <Tabs value={value} onChange={handleChange}>
                <Tab label={t('myApp.basis')} {...a11yProps(0)} />
                <Tab label={t('myApp.arrangement')} {...a11yProps(1)} />
                {searchParams.get('uid') && <Tab label="应用分析" {...a11yProps(2)} />}
                {searchParams.get('uid') && (
                    <Tab
                        label={
                            <Box display="flex" alignItems="center">
                                {t('myApp.upload')}
                                {flag && <ErrorOutline color="warning" sx={{ fontSize: '14px' }} />}
                            </Box>
                        }
                        {...a11yProps(3)}
                    />
                )}
            </Tabs>
            <TabPanel value={value} index={0}>
                <Grid container spacing={2}>
                    <Grid item lg={6}>
                        {detail && (
                            <Basis
                                ref={basis}
                                initialValues={{
                                    name: detail?.name,
                                    description: detail?.description,
                                    categories: detail?.categories,
                                    tags: detail?.tags
                                }}
                                setValues={setData}
                            />
                        )}
                    </Grid>
                    <Grid item lg={6}>
                        <Typography variant="h5" fontSize="1rem" mb={1}>
                            {t('market.debug')}
                        </Typography>
                        <Card elevation={2} sx={{ p: 2 }}>
                            <Box display="flex" justifyContent="space-between" alignItems="center">
                                <Box display="flex" justifyContent="space-between" alignItems="center" gap={1}>
                                    <Image preview={false} className="rounded-lg overflow-hidden" height={60} src={detail?.images[0]} />
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
                            {detail && value === 0 && (
                                <Perform
                                    key={perform}
                                    isShows={isShows}
                                    config={_.cloneDeep(detailRef.current.workflowConfig)}
                                    changeConfigs={changeConfigs}
                                    changeSon={changeData}
                                    loadings={loadings}
                                    variableChange={exeChange}
                                    changeanswer={changeanswer}
                                    promptChange={promptChange}
                                    isallExecute={(flag: boolean) => {
                                        isAllExecute = flag;
                                    }}
                                    source="myApp"
                                />
                            )}
                        </Card>
                    </Grid>
                </Grid>
            </TabPanel>
            <TabPanel value={value} index={1}>
                <Grid container spacing={2}>
                    <Grid item lg={6} sx={{ width: '100%' }}>
                        {detail?.workflowConfig && (
                            <Arrange
                                config={_.cloneDeep(detail.workflowConfig)}
                                editChange={editChange}
                                basisChange={basisChange}
                                statusChange={statusChange}
                                changeConfigs={changeConfigs}
                            />
                        )}
                    </Grid>
                    <Grid item lg={6}>
                        <Typography variant="h5" fontSize="1rem" mb={1}>
                            {t('market.debug')}
                        </Typography>
                        <Card elevation={2} sx={{ p: 2 }}>
                            <Box display="flex" justifyContent="space-between" alignItems="center">
                                <Box display="flex" justifyContent="space-between" alignItems="center" gap={1}>
                                    <Image preview={false} className="rounded-lg overflow-hidden" height={60} src={detail?.images[0]} />
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
                            {detail && value === 1 && (
                                <Perform
                                    key={perform}
                                    isShows={isShows}
                                    config={_.cloneDeep(detailRef.current.workflowConfig)}
                                    changeConfigs={changeConfigs}
                                    changeSon={changeData}
                                    changeanswer={changeanswer}
                                    loadings={loadings}
                                    variableChange={exeChange}
                                    promptChange={promptChange}
                                    isallExecute={(flag: boolean) => {
                                        isAllExecute = flag;
                                    }}
                                    source="myApp"
                                />
                            )}
                        </Card>
                    </Grid>
                </Grid>
            </TabPanel>
            <TabPanel value={value} index={2}>
                {detailRef.current?.uid && searchParams.get('uid') && (
                    <ApplicationAnalysis appUid={detail?.uid} value={value} type="APP_ANALYSIS" />
                )}
            </TabPanel>
            <TabPanel value={value} index={3}>
                {searchParams.get('uid') && (
                    <Upload
                        appUid={searchParams.get('uid') as string}
                        saveState={saveState}
                        saveDetail={saveDetail}
                        getStatus={getStatus}
                    />
                )}
            </TabPanel>
            <PermissionUpgradeModal open={tokenOpen} handleClose={() => setTokenOpen(false)} title={'当前使用的令牌不足'} />
        </Card>
    );
}
export default CreateDetail;
