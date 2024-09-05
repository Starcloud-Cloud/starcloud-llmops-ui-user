import {
    Box,
    Button as Buttons,
    Card,
    CardHeader,
    Chip,
    Divider,
    IconButton,
    ListItemIcon,
    Menu,
    MenuItem,
    Typography
} from '@mui/material';
import { Tabs, Image, Select, Popover, Form, Popconfirm, Button, Spin, Alert, Drawer, List } from 'antd';
import { ArrowBack, ContentPaste, Delete, MoreVert, ErrorOutline, KeyboardBackspace } from '@mui/icons-material';
import { metadata } from 'api/template';
import { useAllDetail } from 'contexts/JWTContext';
import { executeApp } from 'api/template/fetch';
import { appCreate, appModify, getApp, getRecommendApp } from 'api/template/index';
import { t } from 'hooks/web/useI18n';
import { createContext, useCallback, useEffect, useRef, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { dispatch } from 'store';
import { openSnackbar } from 'store/slices/snackbar';
import { Details, Execute } from 'types/template';
import Perform from 'views/template/carryOut/newPerform';
import Arrange from './newArrange';
import Basis from './newBasis';
import ApplicationAnalysis from 'views/template/applicationAnalysis';
import Upload from './upLoad';
import { del, copy } from 'api/template';
import marketStore from 'store/market';
import _ from 'lodash-es';
import { PermissionUpgradeModal } from 'views/template/myChat/createChat/components/modal/permissionUpgradeModal';
import { materialTemplate } from 'api/redBook/batchIndex';
import FormModal from 'views/pages/batchSmallRedBooks/components/formModal';
import { schemeMetadata } from 'api/redBook/copywriting';
import CreatePlan from 'views/pages/batchSmallRedBooks';
import useUserStore from 'store/user';
import jsCookie from 'js-cookie';
interface Items {
    label: string;
    value: string;
}
interface AppModels {
    aiModel?: Items[];
    language?: Items[];
    appType?: Items[];
    variableStyle?: Items[];
}
const Header = ({
    permissions,
    detail,
    aiModel,
    setOpenUpgradeModel,
    setAiModel,
    appModels
}: {
    permissions: any;
    detail: any;
    aiModel: any;
    setOpenUpgradeModel: (data: any) => void;
    setAiModel: (data: any) => void;
    appModels: any;
}) => {
    const { Option } = Select;
    return (
        <div>
            <div className="flex justify-between items-center">
                <Box display="flex" justifyContent="space-between" alignItems="center" gap={1}>
                    {detail?.icon && (
                        <Image
                            preview={false}
                            height={60}
                            className="rounded-lg overflow-hidden"
                            src={require('../../../../../assets/images/category/' + detail?.icon + '.svg')}
                        />
                    )}
                    <Box>
                        <Typography variant="h1" sx={{ fontSize: '2rem' }}>
                            {detail?.name}
                        </Typography>
                        <Box>
                            <span>#{detail?.category}</span>
                            {detail?.tags?.map((el: any) => (
                                <Chip key={el} sx={{ marginLeft: 1 }} size="small" label={el} variant="outlined" />
                            ))}
                        </Box>
                    </Box>
                </Box>
                {detail?.workflowConfig?.steps?.length === 1 && (
                    <div className="flex items-center">
                        <Popover
                            title="模型介绍"
                            content={
                                <>
                                    <div>- 默认模型集成多个LLM，自动适配提供最佳回复方式和内容。4.0比3.5效果更好推荐使用</div>
                                    <div>- 通义千问是国内知名模型，拥有完善智能的中文内容支持</div>
                                </>
                            }
                        >
                            <ErrorOutline sx={{ color: '#697586', mr: '5px', cursor: 'pointer' }} />
                        </Popover>
                        <Select
                            style={{ width: 100, height: 23 }}
                            bordered={false}
                            disabled={true}
                            className="rounded-2xl border-[0.5px] border-[#673ab7] border-solid"
                            rootClassName="modelSelect"
                            popupClassName="modelSelectPopup"
                            value={aiModel}
                            onChange={(value) => {
                                if (value === 'gpt-4' && !permissions.includes('app:execute:llm:gpt4')) {
                                    setOpenUpgradeModel(true);
                                    return;
                                }
                                setAiModel(value);
                            }}
                        >
                            {appModels?.llmModelType?.map((item: any) => (
                                <Option key={item.value} value={item.value}>
                                    {item.label}
                                </Option>
                            ))}
                        </Select>
                    </div>
                )}
            </div>
            <Divider sx={{ my: 1 }} />
            <Typography variant="h5" sx={{ fontSize: '1.1rem', mb: 3 }}>
                {detail?.description}
            </Typography>
        </div>
    );
};
function CreateDetail() {
    const createPlanRef = useRef<any>(null);
    const categoryList = marketStore((state) => state.categoryList);
    const addStyle = useRef<any>(null);
    //路由跳转
    const navigate = useNavigate();
    const location = useLocation();
    const searchParams = new URLSearchParams(location.search);
    const allDetail = useAllDetail();
    //是否全部执行
    let isAllExecute = false;
    const [detail, setDetail] = useState(null as unknown as Details);
    const detailRef: any = useRef(null);
    const [loadings, setLoadings] = useState<any[]>([]);
    const loadingsRef: any = useRef([]);
    //执行禁用
    const isDisableRef: any = useRef([]);
    const [isDisables, setIsDisables] = useState<any>([]);
    //是否显示分享翻译
    const [isShows, setIsShow] = useState<any[]>([]);
    let conversationUid: undefined | string = undefined;
    //token不足
    const [tokenOpen, setTokenOpen] = useState(false);
    const [from, setFrom] = useState('');
    //类型 模型类型
    const [appModels, setAppModel] = useState<AppModels>({});
    const [aiModel, setAiModel] = useState<undefined | string>(undefined);
    //数组方法封装
    const changeArr = (data: any[], setData: (data: any) => void, index: number, flag: boolean) => {
        const newData = _.cloneDeep(data);
        newData[index] = flag;
        setData(newData);
    };
    const allChangeArr = (stepLength: number, flag: boolean) => {
        const value: any[] = [];
        for (let i = 0; i < stepLength; i++) {
            value[i] = flag;
        }
        isDisableRef.current = value;
        loadingsRef.current = value;
        setIsDisables(isDisableRef?.current);
        setLoadings(loadingsRef?.current);
    };
    //执行
    const changeData = (data: Execute) => {
        const { stepId, index }: { stepId: string; index: number } = data;
        if (!isAllExecute) {
            changeArr(isDisableRef.current, setIsDisables, index, true);
            changeArr(loadingsRef.current, setLoadings, index, true);
        } else {
            allChangeArr(detail.workflowConfig.steps.length, true);
        }
        const fetchData = async () => {
            try {
                let resp: any = await executeApp({
                    appUid: searchParams.get('uid') ? searchParams.get('uid') : searchParams.get('recommend'),
                    stepId: stepId,
                    appReqVO: detailRef.current,
                    aiModel,
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

                    if (done) {
                        changeArr(isDisableRef.current, setIsDisables, index, false);
                        const newShow = _.cloneDeep(isShows);
                        newShow[index] = true;
                        setIsShow(newShow);
                        allDetail?.setPre(allDetail?.pre + 1);
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
                    console.log(str);

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
                        console.log(bufferObj);
                        if (bufferObj?.code === 200 && bufferObj.type !== 'ads-msg') {
                            changeArr(loadingsRef.current, setLoadings, index, false);
                            if (!conversationUid && index === 0 && isAllExecute) {
                                conversationUid = bufferObj.conversationUid;
                            }
                            const contentData1 = _.cloneDeep(contentData);
                            contentData1.workflowConfig.steps[index].flowStep.response.answer =
                                detailRef.current.workflowConfig.steps[index].flowStep.response.answer + bufferObj.content;
                            detailRef.current = _.cloneDeep(contentData1);
                            setDetail(contentData1);
                        } else if (bufferObj?.code === 2004008003) {
                            setFrom(`${bufferObj?.scene}_${bufferObj?.bizUid}`);
                            setTokenOpen(true);
                            allChangeArr(detail.workflowConfig.steps.length, false);
                            return;
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
                            return;
                        } else if (bufferObj && bufferObj.code !== 200 && bufferObj.code !== 300900000) {
                            dispatch(
                                openSnackbar({
                                    open: true,
                                    message: t('market.warning'),
                                    variant: 'alert',
                                    alert: {
                                        color: 'error'
                                    },
                                    anchorOrigin: { vertical: 'top', horizontal: 'center' },
                                    close: false
                                })
                            );
                            allChangeArr(detail.workflowConfig.steps.length, false);
                        }
                    });
                    outerJoins = joins;
                }
            } catch (err) {
                allChangeArr(detail.workflowConfig.steps.length, false);
            }
        };
        fetchData();
    };
    useEffect(() => {
        getList();
        metadata().then((res) => {
            setAppModel(res);
        });
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
            if (item?.flowStep?.handler === 'PosterActionHandler') {
                const variable = item?.flowStep?.variable?.variables?.find((el: any) => el.field === 'SYSTEM_POSTER_STYLE_CONFIG');
                if (variable && typeof variable.value === 'string') {
                    item.flowStep.variable.variables.find((el: any) => el.field === 'SYSTEM_POSTER_STYLE_CONFIG').value = JSON.parse(
                        variable.value
                    );
                } else {
                    item?.flowStep?.variable?.variables?.push({
                        field: 'SYSTEM_POSTER_STYLE_CONFIG',
                        isShow: true,
                        label: '风格配置',
                        order: 5,
                        style: 'TEXTAREA',
                        type: 'TEXT',
                        value: []
                    });
                }
            }
        });
        newValue?.workflowConfig?.steps?.forEach((item: any) => {
            const arr = item?.variable?.variables;
            if (
                arr?.find((el: any) => el.field === 'MATERIAL_TYPE') &&
                arr?.find((el: any) => el.style === 'MATERIAL') &&
                arr?.find((el: any) => el.style === 'MATERIAL')?.value
            ) {
                let list: any;

                try {
                    list = JSON.parse(arr?.find((el: any) => el.style === 'MATERIAL')?.value);
                } catch (err) {
                    list = arr?.find((el: any) => el.style === 'MATERIAL')?.value;
                }
                arr.find((el: any) => el.style === 'MATERIAL').value = list;
            }
            if (arr?.find((el: any) => el.style === 'CHECKBOX')) {
                let list: any;

                try {
                    list = JSON.parse(arr?.find((el: any) => el.style === 'CHECKBOX')?.value);
                } catch (err) {
                    list = arr?.find((el: any) => el.style === 'CHECKBOX')?.value;
                }
                arr.find((el: any) => el.style === 'CHECKBOX').value = list;
            }
            if (arr?.find((el: any) => el.style === 'TAG_BOX')) {
                let list: any;

                try {
                    list = JSON.parse(arr?.find((el: any) => el.style === 'TAG_BOX')?.value);
                } catch (err) {
                    list = arr?.find((el: any) => el.style === 'TAG_BOX')?.value;
                }
                arr.find((el: any) => el.style === 'TAG_BOX').value = list;
            }
            if (arr?.find((el: any) => el.style === 'IMAGE_LIST')) {
                let list: any;

                try {
                    list = JSON.parse(arr?.find((el: any) => el.style === 'IMAGE_LIST')?.value);
                } catch (err) {
                    list = arr?.find((el: any) => el.style === 'IMAGE_LIST')?.value;
                }
                arr.find((el: any) => el.style === 'IMAGE_LIST').value = list;
            }
            if (item?.flowStep?.handler === 'PosterActionHandler' && arr?.find((el: any) => el.field === 'POSTER_STYLE_CONFIG')) {
                let list: any;
                try {
                    list = JSON.parse(arr?.find((el: any) => el.field === 'POSTER_STYLE_CONFIG')?.value);
                } catch (err) {
                    list = arr?.find((el: any) => el.field === 'POSTER_STYLE_CONFIG')?.value;
                }
                arr.find((el: any) => el.field === 'POSTER_STYLE_CONFIG').value = list;
            }
        });
        if (newValue?.workflowConfig?.steps?.length === 1) {
            setAiModel(
                newValue?.workflowConfig?.steps[0].flowStep?.variable?.variables?.find((item: any) => item?.field === 'model')?.value ||
                    'gpt-3.5-turbo'
            );
        }
        detailRef.current = _.cloneDeep(newValue);
        getStepMater();
        setDetail(newValue);
    };
    const [openUpgradeModel, setOpenUpgradeModel] = useState(false);
    //设置name desc icon
    const setData = (data: any) => {
        detailRef.current = {
            ...detailRef.current,
            [data.name]: data.value
        };
        setDetail({
            ...detailRef.current,
            [data.name]: data.value
        });
    };
    //设置执行的步骤
    const exeChange = ({ e, steps, i, type, code }: any) => {
        const newValue = _.cloneDeep(detailRef.current);
        newValue.workflowConfig.steps[steps].variable.variables[i].value = e.value;
        if (type && newValue.workflowConfig.steps[steps].variable.variables?.find((item: any) => item.style === 'MATERIAL')) {
            newValue.workflowConfig.steps[steps].variable.variables[
                newValue.workflowConfig.steps[steps].variable.variables?.findIndex((item: any) => item.style === 'MATERIAL')
            ].value = [];
            stepRef.current = steps;
            setStep(stepRef.current);
            setTableData(type, steps);
        }
        if (code === 'CustomActionHandler' && e.name === 'GENERATE_MODE') {
            const num = newValue.workflowConfig.steps[steps].variable.variables?.findIndex((item: any) => item.field === 'REQUIREMENT');
            const num1 = newValue.workflowConfig.steps[steps].variable.variables?.findIndex((item: any) => item.style === 'MATERIAL');
            if (e.value === 'RANDOM') {
                newValue.workflowConfig.steps[steps].variable.variables[num].value = '';
                newValue.workflowConfig.steps[steps].variable.variables[num].isShow = false;
                newValue.workflowConfig.steps[steps].variable.variables[num1].isShow = true;
            } else if (e.value === 'AI_PARODY') {
                newValue.workflowConfig.steps[steps].variable.variables[num].isShow = true;
                newValue.workflowConfig.steps[steps].variable.variables[num1].isShow = true;
            } else {
                newValue.workflowConfig.steps[steps].variable.variables[num1].value = [];
                newValue.workflowConfig.steps[steps].variable.variables[num1].isShow = false;
                newValue.workflowConfig.steps[steps].variable.variables[num].isShow = true;
            }
        }
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
            ...detailRef.current,
            workflowConfig: data
        });
        setDetail(
            _.cloneDeep({
                ...detailRef.current,
                workflowConfig: data
            })
        );
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
            } else if (e.name === 'type') {
                oldValue.workflowConfig.steps[index].flowStep.response.type = e.value;
                if (e.value !== 'JSON') {
                    oldValue.workflowConfig.steps[index].flowStep.response.output = undefined;
                }
            } else if (e.name === 'output') {
                if (oldValue.workflowConfig.steps[index].flowStep.response.output) {
                    oldValue.workflowConfig.steps[index].flowStep.response.output.jsonSchema = e.value;
                } else {
                    oldValue.workflowConfig.steps[index].flowStep.response.output = { jsonSchema: e.value };
                }
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
    };
    const statusChange = ({ i, index }: { i: number; index: number }) => {
        const newValue = _.cloneDeep(detailRef.current);
        newValue.workflowConfig.steps[index].variable.variables[i].isShow =
            !newValue.workflowConfig.steps[index].variable.variables[i].isShow;
        detailRef.current = newValue;
        setDetail(detailRef.current);
    };
    //更改answer
    const changeanswer = ({ value, index }: any) => {
        const newValue = _.cloneDeep(detail);
        newValue.workflowConfig.steps[index].flowStep.response.answer = value;
        detailRef.current = newValue;
        setDetail(newValue);
    };
    //判断基础设置
    const [basisPre, setBasisPre] = useState(0);
    //保存更改
    const planStateRef = useRef(0);
    const [planState, setPlanState] = useState(0); //更新之后调计划的保存
    const saveDetail = (flag?: boolean, fieldShow?: boolean, isimgStyle?: boolean) => {
        setErrOpen(false);
        const newList = _.cloneDeep(detailRef.current);
        const index: number = newList?.workflowConfig?.steps?.findIndex((item: any) => item?.flowStep?.handler === 'PosterActionHandler');
        if (index !== -1) {
            newList.workflowConfig.steps[index] = addStyle?.current?.record || newList.workflowConfig.steps[index];
        }
        newList?.workflowConfig?.steps?.forEach((item: any) => {
            item?.variable?.variables?.forEach((el: any) => {
                if (el.value && typeof el.value === 'object') {
                    el.value = JSON.stringify(el.value);
                }
            });
            item?.flowStep?.variable?.variables?.forEach((el: any) => {
                if (el.value && typeof el.value === 'object') {
                    el.value = JSON.stringify(el.value);
                }
            });
        });
        if (createPlanRef.current) {
            let arr = _.cloneDeep(newList?.workflowConfig?.steps);
            const a = arr.find((item: any) => item.flowStep.handler === 'MaterialActionHandler');
            if (a) {
                const newMokeAI = _.cloneDeep(createPlanRef?.current?.mokeAI);
                const newMoke = _.cloneDeep(createPlanRef?.current?.moke);
                const newFieldHead = _.cloneDeep(createPlanRef?.current?.fieldHead);
                a.variable.variables.find((item: any) => item.style === 'MATERIAL').value = JSON.stringify(newMoke);
                a.variable.variables.find((item: any) => item.field === 'CUSTOM_MATERIAL_GENERATE_CONFIG').value =
                    JSON.stringify(newMokeAI);

                a.variable.variables.find((item: any) => item.field === 'MATERIAL_DEFINE').value = JSON.stringify(newFieldHead);
            }
            const newImageMoke = _.cloneDeep(createPlanRef?.current?.imageMoke);
            const index = arr.findIndex((item: any) => item.flowStep.handler === 'PosterActionHandler');
            if (index !== -1) {
                if (newImageMoke) {
                    newImageMoke?.variable?.variables?.forEach((item: any) => {
                        if (typeof item.value === 'object') {
                            item.value = JSON.stringify(item.value);
                        }
                    });
                    newImageMoke?.flowStep.variable?.variables?.forEach((item: any) => {
                        if (typeof item.value === 'object') {
                            item.value = JSON.stringify(item.value);
                        }
                    });
                }
                arr[index] = newImageMoke || arr.find((item: any) => item.flowStep.handler === 'PosterActionHandler');
            }
            const newData = _.cloneDeep(createPlanRef.current.getDetail);
            newData?.forEach((item: any) => {
                item?.variable?.variables?.forEach((el: any) => {
                    if (el.value && typeof el.value === 'object') {
                        el.value = JSON.stringify(el.value);
                    }
                });
                item?.flowStep?.variable?.variables?.forEach((el: any) => {
                    if (el.value && typeof el.value === 'object') {
                        el.value = JSON.stringify(el.value);
                    }
                });
            });
            arr = [
                arr.find((item: any) => item.flowStep.handler === 'MaterialActionHandler'),
                ...newData,
                arr.find((item: any) => item.flowStep.handler === 'PosterActionHandler')
            ];
            newList.workflowConfig.steps = arr?.filter((item: any) => item);
        }
        if (newList.name && newList.category) {
            if (searchParams.get('uid')) {
                appModify(newList).then((res) => {
                    setViewLoading(false);
                    console.log(res, createPlanRef.current, flag);

                    if (res?.data && res?.data?.verificationList?.length === 0) {
                        if (createPlanRef.current && !flag) {
                            console.log(fieldShow, planState, planStateRef.current);

                            if (fieldShow) {
                                if (planStateRef.current < 0) {
                                    planStateRef.current -= 1;
                                    setPlanState(planStateRef.current);
                                } else {
                                    planStateRef.current = -1;
                                    setPlanState(planStateRef.current);
                                }
                            } else {
                                if (planStateRef.current > 0) {
                                    planStateRef.current += 1;
                                    setPlanState(planStateRef.current);
                                } else {
                                    planStateRef.current = 1;
                                    setPlanState(planStateRef.current);
                                }
                            }
                        }
                        setSaveState(saveState + 1);
                        dispatch(
                            openSnackbar({
                                open: true,
                                message: '应用保存成功',
                                variant: 'alert',
                                anchorOrigin: { vertical: 'top', horizontal: 'center' },
                                alert: {
                                    color: 'success'
                                },
                                close: false
                            })
                        );
                    } else {
                        setErrList(res?.data?.verificationList);
                        setErrOpen(true);
                    }
                });
            } else {
                appCreate(newList).then((res) => {
                    setViewLoading(false);
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
            setBasisPre(basisPre + 1);
            setValue('0');
        }
    };
    //风格模板配置
    const [imageStylePre, setImageStylePre] = useState(0);
    const saveImageStyle = () => {
        if (createPlanRef.current) {
            setImageStylePre(imageStylePre + 1);
        } else {
            saveDetail();
        }
    };
    const saveDetails = (data: any, flag?: boolean) => {
        const newList = _.cloneDeep(data);
        detailRef.current = newList;
        setTimeout(() => {
            if (flag) {
                saveDetail(false, true);
            } else {
                saveDetail();
            }
        }, 500);

        // setDetail(detailRef.current);
    };
    //tabs
    const [value, setValue] = useState('0');
    // 删除按钮的menu
    const [delAnchorEl, setDelAnchorEl] = useState<null | HTMLElement>(null);
    const delOpen = Boolean(delAnchorEl);
    const [saveState, setSaveState] = useState<number>(0);
    const [flag, setflag] = useState(false);
    //获取状态
    const getStatus = (data: boolean) => {
        setflag(data);
    };
    const permissions = useUserStore((state) => state.permissions);

    //检测 model
    console.log(detail?.workflowConfig);

    useEffect(() => {
        if (detail?.workflowConfig?.steps?.length === 1) {
            setAiModel(detail?.workflowConfig.steps[0]?.flowStep?.variable?.variables?.find((item: any) => item.field === 'model')?.value);
        }
    }, [
        detail?.workflowConfig?.steps[0]?.flowStep?.variable?.variables[
            detail?.workflowConfig.steps[0]?.flowStep?.variable?.variables?.findIndex((el: any) => el?.field === 'model')
        ]?.value
    ]);
    //素材类型的请求接口
    const stepRef = useRef(0);
    const [step, setStep] = useState(0);
    const [materialType, setMaterialType] = useState('');
    const refersSourceRef = useRef<any>(null);
    const [refersSource, setRefersSource] = useState<any[]>([]);
    //删除
    const handleDel = (index: number, i: number) => {
        if (i) {
            stepRef.current = i;
            setStep(stepRef.current);
        }
        const newValue = _.cloneDeep(detailRef.current);
        const newList =
            newValue.workflowConfig.steps[i].variable.variables[
                newValue.workflowConfig.steps[i].variable.variables?.findIndex((item: any) => item.style === 'MATERIAL')
            ].value;
        newList.splice(index, 1);
        detailRef.current = newValue;
        setDetail(detailRef.current);
    };
    const [form] = Form.useForm();
    const [title, setTitle] = useState('');
    //编辑
    const [editOpen, setEditOpen] = useState(false);
    const [rowIndex, setRowIndex] = useState(0);
    const handleEdit = (row: any, index: number, i?: number) => {
        if (i || i === 0) {
            let newData = _.cloneDeep(stepRef.current);
            newData = i;
            stepRef.current = newData;
            setStep(stepRef.current);
        }
        setTitle('编辑');
        setMaterialType(row.type);
        form.setFieldsValue(row);
        setRowIndex(index);
        setEditOpen(true);
    };
    const formOk = (result: any) => {
        const newValue = _.cloneDeep(detailRef.current);
        const pubilcList = newValue.workflowConfig.steps[stepRef.current].variable.variables;
        let newList = pubilcList[pubilcList?.findIndex((item: any) => item.style === 'MATERIAL')]?.value;
        if (title === '编辑') {
            newList.splice(rowIndex, 1, { ...result, type: materialType });
        } else {
            if (!newList) {
                newList = [];
            }
            newList.unshift({
                ...result,
                type: materialType
            });
        }
        pubilcList[pubilcList?.findIndex((item: any) => item.style === 'MATERIAL')].value = newList;
        detailRef.current = newValue;
        setDetail(detailRef.current);
        setEditOpen(false);
        form.resetFields();
    };
    //获取数据表头
    const getHeader = (data: any, i: number) => {
        const newList = data?.map((item: any) => ({
            title: item.desc,
            align: 'center',
            width: 200,
            dataIndex: item.fieldName,
            render: (_: any, row: any) => (
                <div className="flex justify-center items-center flex-wrap break-all gap-2">
                    <div className="line-clamp-5">
                        {item.type === 'image' ? (
                            row[item.fieldName] ? (
                                <Image
                                    fallback={
                                        'data:image/png;base64,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'
                                    }
                                    width={50}
                                    height={50}
                                    preview={false}
                                    src={row[item.fieldName]}
                                />
                            ) : (
                                <div className="w-[50px] h-[50px] rounded-md border border-solid border-black/10"></div>
                            )
                        ) : item.fieldName === 'source' ? (
                            <>
                                {row[item.fieldName] === 'OTHER'
                                    ? refersSourceRef.current?.find((item: any) => item.value === 'OTHER')?.label
                                    : row[item.fieldName] === 'SMALL_RED_BOOK'
                                    ? refersSourceRef.current?.find((item: any) => item.value === 'SMALL_RED_BOOK')?.label
                                    : row[item.fieldName]}
                            </>
                        ) : (
                            row[item.fieldName]
                        )}
                    </div>
                </div>
            ),
            required: item.required,
            type: item.type
        }));

        return [
            ...newList,
            {
                title: '操作',
                align: 'center',
                width: 100,
                fixed: 'right',
                render: (_: any, row: any, index: number) => (
                    <div className="flex justify-center">
                        <Button
                            onClick={() => {
                                handleEdit(row, index, i);
                            }}
                            size="small"
                            type="link"
                        >
                            编辑
                        </Button>
                        <Popconfirm
                            title="提示"
                            description="请再次确认是否删除？"
                            okText="确认"
                            cancelText="取消"
                            onConfirm={() => handleDel(index, i)}
                        >
                            <Button size="small" type="link" danger>
                                删除
                            </Button>
                        </Popconfirm>
                    </div>
                )
            }
        ];
    };
    const getHeaders = (data: any, i: number) => {
        const newList = data;
        newList?.splice(newList?.length - 1, 1);
        return [
            ...newList,
            {
                title: '操作',
                align: 'center',
                width: 100,
                fixed: 'right',
                render: (_: any, row: any, index: number) => (
                    <div className="flex justify-center">
                        <Button
                            onClick={() => {
                                handleEdit(row, index, i);
                            }}
                            size="small"
                            type="link"
                        >
                            编辑
                        </Button>
                        <Popconfirm
                            title="提示"
                            description="请再次确认是否删除？"
                            okText="确认"
                            cancelText="取消"
                            onConfirm={() => handleDel(index, i)}
                        >
                            <Button size="small" type="link" danger>
                                删除
                            </Button>
                        </Popconfirm>
                    </div>
                )
            }
        ];
    };
    useEffect(() => {
        schemeMetadata().then((res) => {
            refersSourceRef.current = res.refersSource;
            setRefersSource(refersSourceRef.current);
        });
    }, []);
    //获取哪个步骤有素材
    const stepMarRef = useRef<any[]>([]);
    const [stepMaterial, setStepMaterial] = useState<any[]>([]);
    const setTableData = async (type: string, steps: number) => {
        const res = await materialTemplate(type);
        const newList = _.cloneDeep(stepMarRef.current);
        newList[steps] = getHeaders(getHeader(res?.fieldDefine, steps), steps);
        stepMarRef.current = newList;
        setStepMaterial(stepMarRef.current);
    };
    const getStepMater = async () => {
        const arr: any[] = [];
        const newList = detailRef.current?.workflowConfig?.steps.map((item: any) => {
            const arr = item?.variable?.variables;
            return arr?.find((i: any) => i?.field === 'MATERIAL_TYPE')?.value;
        });
        const allper = newList?.map(async (el: any, index: number) => {
            if (el) {
                const res = await materialTemplate(el);
                arr[index] = getHeader(res?.fieldDefine, index);
            } else {
                arr[index] = undefined;
            }
        });
        await Promise.all(allper);
        stepMarRef.current = arr;
        setStepMaterial(stepMarRef?.current);
    };
    //增加表格
    const getTableData = async ({ step, index }: { step: any; index: number }) => {
        const newList = stepMarRef.current;
        let data = undefined;
        const values = step?.variable?.variables?.find((item: any) => item?.field === 'MATERIAL_TYPE')?.value;
        if (values) {
            const result = await materialTemplate(values);
            data = result.fieldDefine;
        }

        newList?.splice(index + 1, 0, data ? getHeader(data, index + 1) : undefined);
        const ccc = newList?.map((el: any, i: number) => {
            if (el) {
                return getHeaders(el, i);
            }
        });
        stepMarRef.current = ccc;

        setStepMaterial(stepMarRef.current);
    };
    //复制表格
    const tableCopy = (index: number) => {
        const newData = _.cloneDeep(stepMarRef.current);
        const temp = _.cloneDeep(newData[index]);
        newData.splice(index, 0, temp);

        const ccc = newData?.map((el: any, i: number) => {
            if (el) {
                return getHeaders(el, i);
            }
        });
        stepMarRef.current = ccc;
        setStepMaterial(stepMarRef.current);
    };
    //删除表格
    const tableDataDel = (index: number) => {
        const newData = _.cloneDeep(stepMarRef.current);
        newData?.splice(index, 1);
        const ccc = newData?.map((el: any, i: number) => {
            if (el) {
                return getHeaders(el, i);
            }
        });
        stepMarRef.current = ccc;
        setStepMaterial(stepMarRef.current);
    };
    //移动表格
    const tableDataMove = ({ index, direction }: { index: number; direction: number }) => {
        const newData = _.cloneDeep(stepMarRef.current);
        const temp = _.cloneDeep(newData[index]);
        newData[index] = _.cloneDeep(newData[index + direction]);
        newData[index + direction] = temp;
        const ccc = newData?.map((el: any, i: number) => {
            if (el) {
                return getHeaders(el, i);
            }
        });
        stepMarRef.current = ccc;
        setStepMaterial(stepMarRef.current);
    };
    const [viewLoading, setViewLoading] = useState(false);
    useEffect(() => {
        if (searchParams.get('source') === 'market') {
            setValue('4');
        }
    }, []);
    const [changePre, setChangePre] = useState(0);
    const [tableTitle, setTableTitle] = useState(0);
    console.log(1);

    const [errOpen, setErrOpen] = useState(false);
    const [errList, setErrList] = useState<any[]>([]);

    return detail ? (
        <Card sx={{ height: jsCookie.get('isClient') ? '100vh' : '100%', overflowY: 'auto', position: 'relative' }}>
            <CardHeader
                sx={{ padding: 2 }}
                avatar={
                    <Buttons
                        sx={{ zIndex: 10 }}
                        variant="contained"
                        startIcon={<ArrowBack />}
                        color="secondary"
                        onClick={() => {
                            searchParams.get('source') === 'market' ? navigate('/appMarket') : navigate('/template/createCenter');
                        }}
                    >
                        {t('myApp.back')}
                    </Buttons>
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
                                sx={{ zIndex: 9 }}
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
                            <MenuItem
                                onClick={() => {
                                    copy({ uid: searchParams.get('uid') }).then((res) => {
                                        if (res) {
                                            dispatch(
                                                openSnackbar({
                                                    open: true,
                                                    message: '复制成功',
                                                    variant: 'alert',
                                                    alert: {
                                                        color: 'success'
                                                    },
                                                    anchorOrigin: { vertical: 'top', horizontal: 'center' },
                                                    transition: 'SlideDown',
                                                    close: false
                                                })
                                            );
                                            setDelAnchorEl(null);
                                            navigate('/my-app');
                                        }
                                    });
                                }}
                            >
                                <ListItemIcon>
                                    <ContentPaste color="secondary" />
                                </ListItemIcon>
                                <Typography variant="inherit" noWrap>
                                    复制应用
                                </Typography>
                            </MenuItem>
                        </Menu>
                        <Buttons sx={{ zIndex: 9 }} variant="contained" color="secondary" autoFocus onClick={() => saveDetail()}>
                            {t('myApp.save')}
                        </Buttons>
                    </>
                }
            ></CardHeader>
            <Divider />
            <div className="w-full absolute top-[24px] h-[calc(100vh-200px)]">
                <Tabs
                    activeKey={value}
                    centered={true}
                    onChange={(key: string) => {
                        if (!detailRef.current) {
                            return;
                        }
                        if (detailRef?.current?.type === 'MEDIA_MATRIX') {
                            if (value === '4') {
                                const newData = _.cloneDeep(detailRef.current);
                                let arr = newData?.workflowConfig?.steps;
                                const a = arr.find((item: any) => item.flowStep.handler === 'MaterialActionHandler');
                                if (a) {
                                    a.variable.variables.find((item: any) => item.style === 'MATERIAL').value =
                                        createPlanRef?.current?.moke;
                                }
                                const index = arr.findIndex((item: any) => item.flowStep.handler === 'PosterActionHandler');
                                if (index !== -1) {
                                    arr[index] =
                                        createPlanRef?.current?.imageMoke ||
                                        arr.find((item: any) => item.flowStep.handler === 'PosterActionHandler');
                                    const sysdata = arr[index].flowStep.variable.variables.find(
                                        (i: any) => i.field === 'SYSTEM_POSTER_STYLE_CONFIG'
                                    ).value;
                                    if (typeof sysdata === 'string') {
                                        arr[index].flowStep.variable.variables.find(
                                            (i: any) => i.field === 'SYSTEM_POSTER_STYLE_CONFIG'
                                        ).value = JSON.parse(sysdata);
                                    }
                                }
                                arr = [
                                    arr.find((item: any) => item.flowStep.handler === 'MaterialActionHandler'),
                                    ...createPlanRef.current.getDetail,
                                    arr.find((item: any) => item.flowStep.handler === 'PosterActionHandler')
                                ];
                                newData.workflowConfig.steps = arr?.filter((item: any) => item);
                                detailRef.current = newData;
                                setDetail(detailRef?.current);
                                setValue(key);
                            } else if (key === '4') {
                                setChangePre(changePre + 1);
                                setValue(key);
                            } else {
                                setValue(key);
                            }
                        } else {
                            setValue(key);
                        }
                    }}
                >
                    <Tabs.TabPane tab=" 基础设置" key="0">
                        <div className="flex justify-center ">
                            <div className="xl:w-[80%] lg:w-full md:w-full">
                                <Basis
                                    detail={{
                                        name: detail?.name,
                                        description: detail?.description,
                                        category: detail?.category,
                                        tags: detail?.tags,
                                        example: detail?.example,
                                        sort: detail?.sort,
                                        type: detail?.type,
                                        icon: detail?.icon
                                    }}
                                    basisPre={basisPre}
                                    appModel={appModels?.appType}
                                    setValues={setData}
                                />
                            </div>
                        </div>
                    </Tabs.TabPane>
                    {permissions.includes('app:flow') && (
                        <Tabs.TabPane tab="流程编排" key="1">
                            <div
                                className="overflow-y-auto mt-[-16px]"
                                style={{
                                    height: jsCookie.get('isClient') ? 'calc(100vh - 70px)' : 'calc(100vh - 210px)',
                                    backgroundImage: `radial-gradient(circle, rgba(0, 0, 0, 0.1) 10%, transparent 10%)`,
                                    backgroundSize: '10px 10px',
                                    backgroundRepeat: 'repeat'
                                }}
                            >
                                <div className="h-[16px]"></div>
                                <Alert
                                    className="mb-4 mx-4"
                                    message="修改流程后，可直接在 ”运行应用“ 处进行测试，验证流程是否符合需求"
                                    type="warning"
                                    closable
                                />
                                <div className="flex justify-center">
                                    <div className={`xl:w-[80%] lg:w-full pb-4`}>
                                        <Arrange
                                            detail={detail}
                                            config={detail?.workflowConfig}
                                            variableStyle={appModels?.variableStyle}
                                            editChange={editChange}
                                            basisChange={basisChange}
                                            statusChange={statusChange}
                                            changeConfigs={changeConfigs}
                                            getTableData={getTableData}
                                            tableCopy={tableCopy}
                                            tableDataDel={tableDataDel}
                                            tableDataMove={tableDataMove}
                                            saveImageStyle={saveImageStyle}
                                            setTableTitle={() => setTableTitle(new Date().getTime())}
                                        />
                                    </div>
                                </div>
                            </div>
                        </Tabs.TabPane>
                    )}
                    {permissions.includes('app:run') && (
                        <Tabs.TabPane tab="运行应用" key="4">
                            <div className="w-full">
                                {detail?.type === 'MEDIA_MATRIX' ? (
                                    <Spin spinning={viewLoading} tip="Loading">
                                        <div
                                            style={{
                                                height: jsCookie.get('isClient') ? 'calc(100vh - 86px)' : 'calc(100vh - 220px)'
                                            }}
                                            className="bg-[rgb(244,246,248)]"
                                        >
                                            <CreatePlan
                                                ref={createPlanRef}
                                                imageStylePre={imageStylePre}
                                                tableTitle={tableTitle}
                                                getAppList={getList}
                                                changePre={changePre}
                                                planState={planState}
                                                detail={_.cloneDeep(detailRef.current)}
                                                setDetail={(data: any, flag?: boolean) => saveDetails(data, flag)}
                                                isMyApp={false}
                                                isblack={false}
                                            />
                                        </div>
                                    </Spin>
                                ) : (
                                    <div>
                                        <Card elevation={2} sx={{ p: 2 }}>
                                            <Header
                                                permissions={permissions}
                                                detail={detail}
                                                aiModel={aiModel}
                                                setOpenUpgradeModel={setOpenUpgradeModel}
                                                setAiModel={setAiModel}
                                                appModels={appModels}
                                            />
                                            <Perform
                                                columns={stepMaterial}
                                                setEditOpen={setEditOpen}
                                                setStep={(data: any) => {
                                                    stepRef.current = data;
                                                    setStep(stepRef.current);
                                                }}
                                                getList={getList}
                                                setMaterialType={setMaterialType}
                                                setTitle={setTitle}
                                                isShows={isShows}
                                                details={_.cloneDeep(detailRef.current)}
                                                config={_.cloneDeep(detailRef.current?.workflowConfig)}
                                                changeConfigs={changeConfigs}
                                                changeSon={changeData}
                                                changeanswer={changeanswer}
                                                loadings={loadings}
                                                isDisables={isDisables}
                                                variableChange={exeChange}
                                                promptChange={promptChange}
                                                isallExecute={(flag: boolean) => {
                                                    isAllExecute = flag;
                                                }}
                                                addStyle={addStyle}
                                                source="myApp"
                                            />
                                        </Card>
                                    </div>
                                )}
                            </div>
                        </Tabs.TabPane>
                    )}
                    {detailRef.current?.uid && searchParams.get('uid') && permissions.includes('app:analyze') && (
                        <Tabs.TabPane tab="应用分析" key="2">
                            <div
                                style={{
                                    height: jsCookie.get('isClient') ? 'calc(100vh - 86px)' : 'calc(100vh - 210px)'
                                }}
                                className="overflow-y-auto px-4"
                            >
                                <ApplicationAnalysis appUid={detail?.uid} value={Number(value)} type="APP_ANALYSIS" />
                            </div>
                        </Tabs.TabPane>
                    )}
                    {searchParams.get('uid') && permissions.includes('app:publish') && (
                        <Tabs.TabPane tab="应用发布" key="3">
                            <div
                                style={{
                                    height: jsCookie.get('isClient') ? 'calc(100vh - 86px)' : 'calc(100vh - 220px)'
                                }}
                                className="overflow-y-auto px-4"
                            >
                                <Upload
                                    appUid={searchParams.get('uid') as string}
                                    saveState={saveState}
                                    saveDetail={saveDetail}
                                    getStatus={getStatus}
                                />
                            </div>
                        </Tabs.TabPane>
                    )}
                </Tabs>
            </div>
            {openUpgradeModel && (
                <PermissionUpgradeModal from={'upgradeGpt4_0'} open={openUpgradeModel} handleClose={() => setOpenUpgradeModel(false)} />
            )}
            {tokenOpen && (
                <PermissionUpgradeModal
                    from={from}
                    open={tokenOpen}
                    handleClose={() => setTokenOpen(false)}
                    title={'当前魔法豆不足，升级会员，立享五折优惠！'}
                />
            )}
            {editOpen && (
                <FormModal
                    title={title}
                    materialType={materialType}
                    editOpen={editOpen}
                    setEditOpen={setEditOpen}
                    columns={stepMarRef.current[stepRef.current]}
                    form={form}
                    formOk={formOk}
                    sourceList={refersSource}
                />
            )}
            <Drawer title="错误信息" placement="right" onClose={() => setErrOpen(false)} open={errOpen} mask={false}>
                <List
                    itemLayout="horizontal"
                    dataSource={errList}
                    renderItem={(item, index) => (
                        <List.Item>
                            <List.Item.Meta title={item.bizCode} description={<div className="text-xs text-[red]">{item.message}</div>} />
                        </List.Item>
                    )}
                />
            </Drawer>
        </Card>
    ) : (
        <div className="w-full h-full flex justify-center items-center">
            <Spin spinning={true} />
        </div>
    );
}
export default CreateDetail;
