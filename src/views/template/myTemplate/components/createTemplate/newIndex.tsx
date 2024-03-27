import {
    Box,
    Button as Buttons,
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
    // Tabs,
    Typography
} from '@mui/material';
import { Tabs, Image, Select, Popover, Form, Popconfirm, Button, Segmented } from 'antd';
import { ArrowBack, ContentPaste, Delete, MoreVert, ErrorOutline } from '@mui/icons-material';
import { metadata } from 'api/template';
import { useAllDetail } from 'contexts/JWTContext';
import { executeApp } from 'api/template/fetch';
import { appCreate, appModify, getApp, getRecommendApp } from 'api/template/index';
import { t } from 'hooks/web/useI18n';
import { createContext, useCallback, useEffect, useRef, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { dispatch } from 'store';
import { openSnackbar } from 'store/slices/snackbar';
import { TabsProps } from 'types';
import { Details, Execute } from 'types/template';
import Perform from 'views/template/carryOut/perform';
import Arrange from './newArrange';
import Basis from './newBasis';
import ApplicationAnalysis from 'views/template/applicationAnalysis';
import Upload from './upLoad';
import { del, copy } from 'api/template';
import marketStore from 'store/market';
import useUserStore from 'store/user';
import _ from 'lodash-es';
import { PermissionUpgradeModal } from 'views/template/myChat/createChat/components/modal/permissionUpgradeModal';
import { materialTemplate } from 'api/redBook/batchIndex';
import FormModal from 'views/pages/batchSmallRedBooks/components/formModal';
import { schemeMetadata } from 'api/redBook/copywriting';
interface Items {
    label: string;
    value: string;
}
interface AppModels {
    aiModel?: Items[];
    language?: Items[];
    type?: Items[];
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
                            {appModels?.aiModel?.map((item: any) => (
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
    const categoryList = marketStore((state) => state.categoryList);
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
        });
        detailRef.current = _.cloneDeep(newValue);
        if (newValue?.workflowConfig?.steps?.length === 1) {
            setAiModel(
                newValue?.workflowConfig?.steps[0].flowStep?.variable?.variables?.find((item: any) => item?.field === 'model')?.value ||
                    'gpt-3.5-turbo-1106'
            );
        }
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
    const exeChange = ({ e, steps, i, type }: any) => {
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
    //判断基础设置
    const [basisPre, setBasisPre] = useState(0);
    //保存更改
    const saveDetail = () => {
        const details = _.cloneDeep(detailRef.current);
        details?.workflowConfig?.steps?.forEach((item: any) => {
            const arr = item?.variable?.variables;
            if (
                arr?.find((el: any) => el.field === 'MATERIAL_TYPE') &&
                arr?.find((el: any) => el.style === 'MATERIAL') &&
                arr?.find((el: any) => el.style === 'MATERIAL')?.value
            ) {
                arr.find((el: any) => el.style === 'MATERIAL').value = JSON.stringify(
                    arr?.find((el: any) => el.style === 'MATERIAL')?.value
                );
            }
        });
        if (details.name && details.category) {
            if (searchParams.get('uid')) {
                appModify(details).then((res) => {
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
                appCreate(details).then((res) => {
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
    const { Option } = Select;

    //检测 model
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
        console.log(i);
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
        const newList = data.map((item: any) => ({
            title: item.desc,
            align: 'center',
            width: 200,
            dataIndex: item.fieldName,
            render: (_: any, row: any) => (
                <div className="flex justify-center items-center flex-wrap break-all gap-2">
                    <div className="line-clamp-5">
                        {item.type === 'image' ? (
                            <Image width={50} height={50} preview={false} src={row[item.fieldName]} />
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
        console.log(data);

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
        const values = step?.variable?.variables?.find((item: any) => item?.field === 'MATERIAL_TYPE');
        if (values) {
            const result = await materialTemplate(values?.value);
            data = result.fieldDefine;
        }
        newList?.splice(index + 1, 0, getHeader(data, index + 1));
        const ccc = newList?.map((el: any, i: number) => {
            if (el) {
                return getHeaders(el, i);
            }
        });
        stepMarRef.current = ccc;
        console.log(stepMarRef.current, 'stepMarRef.current');

        setStepMaterial(stepMarRef.current);
    };
    //复制表格
    const tableCopy = (index: number) => {
        const newData = _.cloneDeep(stepMarRef.current);
        const temp = _.cloneDeep(newData[index]);
        newData.splice(index, 0, temp);
        console.log(newData);

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
    const [segmentedValue, setSegmentedValue] = useState<string | number>('配置');
    return (
        <Card>
            <CardHeader
                sx={{ padding: 2 }}
                avatar={
                    <Buttons
                        variant="contained"
                        startIcon={<ArrowBack />}
                        color="secondary"
                        onClick={() => navigate('/template/createCenter')}
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
                        <Buttons variant="contained" color="secondary" autoFocus onClick={saveDetail}>
                            {t('myApp.save')}
                        </Buttons>
                    </>
                }
            ></CardHeader>
            <Divider />
            <div className="p-4">
                <Tabs activeKey={value} onChange={setValue}>
                    <Tabs.TabPane tab=" 基础设置" key="0">
                        <div className="flex justify-center ">
                            <div className="xl:w-[80%] lg:w-full">
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
                                    appModel={appModels?.type}
                                    setValues={setData}
                                />
                            </div>
                        </div>
                    </Tabs.TabPane>
                    <Tabs.TabPane tab="流程编排" key="1">
                        <div className="flex justify-center">
                            <div className="xl:w-[80%] lg:w-full">
                                <div className="pb-4 flex justify-center">
                                    <Segmented value={segmentedValue} onChange={setSegmentedValue} options={['配置', '预览']} />
                                </div>
                                {segmentedValue === '配置' && detail && (
                                    <Arrange
                                        detail={detail}
                                        config={detail.workflowConfig}
                                        editChange={editChange}
                                        basisChange={basisChange}
                                        statusChange={statusChange}
                                        changeConfigs={changeConfigs}
                                        getTableData={getTableData}
                                        tableCopy={tableCopy}
                                        tableDataDel={tableDataDel}
                                        tableDataMove={tableDataMove}
                                    />
                                )}
                                {segmentedValue === '预览' && (
                                    <div>
                                        <Typography variant="h5" fontSize="1rem" mb={1}>
                                            {t('market.debug')}
                                        </Typography>
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
                                                setMaterialType={setMaterialType}
                                                setTitle={setTitle}
                                                isShows={isShows}
                                                config={_.cloneDeep(detailRef.current.workflowConfig)}
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
                                                source="myApp"
                                            />
                                        </Card>
                                    </div>
                                )}
                            </div>
                        </div>
                    </Tabs.TabPane>
                    {detailRef.current?.uid && searchParams.get('uid') && (
                        <Tabs.TabPane tab="应用分析" key="2">
                            <ApplicationAnalysis appUid={detail?.uid} value={Number(value)} type="APP_ANALYSIS" />
                        </Tabs.TabPane>
                    )}
                    {searchParams.get('uid') && (
                        <Tabs.TabPane tab="应用发布" key="3">
                            <Upload
                                appUid={searchParams.get('uid') as string}
                                saveState={saveState}
                                saveDetail={saveDetail}
                                getStatus={getStatus}
                            />
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
        </Card>
    );
}
export default CreateDetail;
