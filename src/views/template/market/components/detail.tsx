import { Typography, Breadcrumbs, Link, Box, Card, Chip, Divider, CircularProgress } from '@mui/material';
import { Image, Select, Popover, Popconfirm, Button, Form } from 'antd';
// import RemoveRedEyeIcon from '@mui/icons-material/RemoveRedEye';
// import VerticalAlignBottomIcon from '@mui/icons-material/VerticalAlignBottom';
// import ThumbUpIcon from '@mui/icons-material/ThumbUp';
import {
    marketDeatail,
    metadata
    // installTemplate
} from 'api/template';
import { materialTemplate } from 'api/redBook/batchIndex';
import { schemeMetadata } from 'api/redBook/copywriting';
import { favoriteGetMarketInfo, favoriteCollect, favoriteCancel } from 'api/template/collect';
import { dispatch } from 'store';
import { openSnackbar } from 'store/slices/snackbar';
import { executeMarket } from 'api/template/fetch';
import CarryOut from 'views/template/carryOut';
import { Execute, Details } from 'types/template';
import marketStore from 'store/market';
import { t } from 'hooks/web/useI18n';
import { useParams, useNavigate, useLocation } from 'react-router-dom';
import { useEffect, useState, useRef } from 'react';
import { useAllDetail } from 'contexts/JWTContext';
import { useTheme } from '@mui/material/styles';
import _ from 'lodash-es';
import useCategory from 'hooks/useCategory';
import useUserStore from 'store/user';
import { PermissionUpgradeModal } from 'views/template/myChat/createChat/components/modal/permissionUpgradeModal';
import { GradeOutlined, Grade, ErrorOutline } from '@mui/icons-material';
import FormModal from 'views/pages/batchSmallRedBooks/components/formModal';
interface Items {
    label: string;
    value: string;
}
interface AppModels {
    aiModel?: Items[];
    language?: Items[];
    type?: Items[];
    variableStyle?: Items[];
}
function Deatail() {
    const ref = useRef<HTMLDivElement | null>(null);
    const allDetail = useAllDetail();
    const { categoryTrees } = marketStore();
    const { uid = '' } = useParams<{ uid?: string }>();
    const location = useLocation();
    const searchParams = new URLSearchParams(location.search);
    const navigate = useNavigate();
    const [detailData, setDetailData] = useState<Details>(null as unknown as Details);
    const detailRef: any = useRef(null);
    //token不足
    const [tokenOpen, setTokenOpen] = useState(false);
    const [from, setFrom] = useState('');
    //类型 模型类型
    const [openUpgradeModel, setOpenUpgradeModel] = useState(false);
    const [appModels, setAppModel] = useState<AppModels>({});
    const [aiModels, setAiModels] = useState<string | undefined>(undefined);
    const aimodeRef: any = useRef(undefined);
    //执行loading
    const [loadings, setLoadings] = useState<any[]>([]);
    const loadingsRef: any = useRef([]);
    //执行禁用
    const isDisableRef: any = useRef([]);
    const [isDisables, setIsDisables] = useState<any>([]);
    //是否显示分享翻译
    const [isShows, setIsShow] = useState<any[]>([]);
    let isAllExecute = false;
    let conversationUid: undefined | string = undefined;
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
            allChangeArr(detailData.workflowConfig.steps.length, true);
        }
        const fetchData = async () => {
            try {
                let resp: any = await executeMarket({
                    appUid: detailRef.current?.uid,
                    stepId: stepId,
                    aiModel: aimodeRef.current,
                    appReqVO: detailRef.current,
                    conversationUid
                });
                const contentData = _.cloneDeep(detailRef.current);
                contentData.workflowConfig.steps[index].flowStep.response.answer = '';
                detailRef.current = contentData;
                setDetailData(contentData);
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
                            index < detailData.workflowConfig.steps.length - 1 &&
                            detailData.workflowConfig.steps[index + 1].flowStep.response.style !== 'BUTTON'
                        ) {
                            changeData({
                                index: index + 1,
                                stepId: detailData.workflowConfig.steps[index + 1].field,
                                steps: detailData.workflowConfig.steps[index + 1]
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
                            detailRef.current = contentData1;
                            setDetailData(contentData1);
                        } else if (bufferObj?.code === 200 && bufferObj.type === 'ads-msg') {
                            dispatch(
                                openSnackbar({
                                    open: true,
                                    message: bufferObj.content,
                                    variant: 'alert',
                                    alert: {
                                        color: 'success'
                                    },
                                    anchorOrigin: { vertical: 'top', horizontal: 'center' },
                                    close: false
                                })
                            );
                        } else if (bufferObj?.code === 2004008003) {
                            setFrom(`${bufferObj?.scene}_${bufferObj?.bizUid}`);
                            setTokenOpen(true);
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
                            allChangeArr(detailData.workflowConfig.steps.length, false);
                            return;
                        }
                    });
                    outerJoins = joins;
                }
            } catch (err) {
                allChangeArr(detailData.workflowConfig.steps.length, false);
            }
        };
        fetchData();
    };
    //更改answer
    const changeanswer = ({ value, index }: any) => {
        const newValue = _.cloneDeep(detailRef.current);
        newValue.workflowConfig.steps[index].flowStep.response.answer = value;
        detailRef.current = newValue;
        setDetailData(newValue);
    };
    //设置执行的prompt
    const promptChange = ({ e, steps, i, flag = false }: any) => {
        const newValue = _.cloneDeep(detailRef.current);
        if (flag) {
            newValue.workflowConfig.steps[steps].variable.variables[i].value = e.value;
        } else {
            newValue.workflowConfig.steps[steps].flowStep.variable.variables[i].value = e.value;
        }
        detailRef.current = newValue;
        setDetailData(newValue);
    };
    //更改变量的值
    const variableChange = ({ e, steps, i, type, code }: any) => {
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
        detailRef.current = newValue;
        setDetailData(newValue);
    };
    //增加 删除 改变变量
    const changeConfigs = (data: any) => {
        detailRef.current = _.cloneDeep({
            ...detailRef.current,
            workflowConfig: data
        });
        setDetailData(detailRef.current);
    };
    const [active, setActive] = useState(false);
    useEffect(() => {
        if (searchParams.get('type') === 'collect') {
            favoriteGetMarketInfo({ uid }).then((res) => {
                setAllLoading(false);
                setPlholder(res);
            });
        } else {
            marketDeatail({ uid }).then((res: any) => {
                if (res) {
                    setAllLoading(false);
                    setPlholder(res);
                }
            });
        }
        const setPlholder = (res: any) => {
            const result = _.cloneDeep(res);
            if (result.isFavorite) {
                setActive(true);
            }
            if (result?.workflowConfig?.steps?.length === 1) {
                aimodeRef.current =
                    result?.workflowConfig?.steps[0].flowStep?.variable?.variables?.find((item: any) => item?.field === 'model')?.value ||
                    'gpt-3.5-turbo-1106';
                setAiModels(aimodeRef.current);
            }
            const newData = _.cloneDeep(result);
            newData?.workflowConfig?.steps?.forEach((item: any) => {
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
            detailRef.current = newData;
            getStepMater();
            setDetailData(detailRef.current);
        };
        metadata().then((res) => {
            setAppModel(res);
        });
        if (ref.current !== null && ref.current.parentNode !== null) {
            const top: any = ref.current.parentNode;
            setTimeout(() => {
                top.scrollTop = 286;
            }, 100);
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);
    const permissions = useUserStore((state) => state.permissions);

    // const iconStyle = {
    //     fontSize: '16px',
    //     display: 'inline-block',
    //     margin: '0 8px 0 4px'
    // };
    //下载模板
    // const [loading, setLoading] = useState(false);
    // const install = () => {
    //     setLoading(true);
    //     installTemplate({ uid }).then((res) => {
    //         if (res.data) {
    //             setLoading(false);
    // detailRef.current = {
    //                 ...detailData,
    //                 installStatus: { installStatus: 'INSTALLED' }
    //             }
    //             setDetailData({
    //                 ...detailData,
    //                 installStatus: { installStatus: 'INSTALLED' }
    //             });
    //         }
    //     });
    // };
    //页面进入loading
    const theme = useTheme();
    const isDarkMode = theme.palette.mode === 'dark';
    const [allLoading, setAllLoading] = useState(true);
    const { Option } = Select;
    //过滤出category
    const categoryList = marketStore((state) => state.categoryList);
    const getImage = (active: string) => {
        let image;
        try {
            image = require('../../../../assets/images/category/' + active + '.svg');
        } catch (_) {
            image =
                'data:image/png;base64,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';
        }
        return image;
    };

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
    //素材类型的请求接口
    const stepRef = useRef(0);
    const [step, setStep] = useState(0);
    const [materialType, setMaterialType] = useState('');
    const refersSourceRef = useRef<any>(null);
    const [refersSource, setRefersSource] = useState<any[]>([]);
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
        setDetailData(detailRef.current);
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
        setDetailData(detailRef.current);
        setEditOpen(false);
        form.resetFields();
    };
    useEffect(() => {
        schemeMetadata().then((res) => {
            refersSourceRef.current = res.refersSource;
            setRefersSource(refersSourceRef.current);
        });
    }, []);
    return (
        <Card ref={ref} elevation={2} sx={{ padding: 2, position: 'relative' }}>
            <div className="absolute right-[20px] top-[20px]">
                {!active ? (
                    <div
                        className="cursor-pointer"
                        onClick={(e) => {
                            favoriteCollect({ marketUid: detailRef.current?.uid }).then((res) => {
                                if (res) {
                                    dispatch(
                                        openSnackbar({
                                            open: true,
                                            message: '收藏成功',
                                            variant: 'alert',
                                            alert: {
                                                color: 'success'
                                            },
                                            close: false
                                        })
                                    );
                                }
                            });
                            setActive(true);
                            e.stopPropagation();
                        }}
                    >
                        <GradeOutlined sx={{ color: '#0003' }} />
                    </div>
                ) : (
                    <div
                        className="cursor-pointer"
                        onClick={(e) => {
                            favoriteCancel({ marketUid: detailRef.current?.uid }).then((res) => {
                                if (res) {
                                    dispatch(
                                        openSnackbar({
                                            open: true,
                                            message: '取消收藏成功',
                                            variant: 'alert',
                                            alert: {
                                                color: 'success'
                                            },
                                            close: false
                                        })
                                    );
                                }
                            });
                            setActive(false);
                            e.stopPropagation();
                        }}
                    >
                        <Grade sx={{ color: '#ecc94b99' }} />
                    </div>
                )}
            </div>
            {allLoading && (
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
                        backgroundColor: !isDarkMode ? 'rgba(255, 255, 255, 0.9)' : 'rgba(0, 0, 0, 0.4)',
                        zIndex: 100
                    }}
                >
                    <CircularProgress />
                </div>
            )}
            <Breadcrumbs aria-label="breadcrumb" sx={{ mb: 1, display: 'inline-block' }}>
                {searchParams.get('type') !== 'collect' ? (
                    <Link sx={{ cursor: 'pointer' }} underline="hover" color="inherit" onClick={() => navigate('/appMarket')}>
                        {t('market.all')}
                    </Link>
                ) : (
                    <Link sx={{ cursor: 'pointer' }} underline="hover" color="inherit" onClick={() => navigate('/collect')}>
                        收藏
                    </Link>
                )}
                <Link
                    color="secondary"
                    sx={{ cursor: 'pointer' }}
                    underline="hover"
                    onClick={() => {
                        if (detailData?.category.startsWith('SEO_WRITING')) {
                            navigate('/appMarket?category=SEO_WRITING');
                        } else if (detailData?.category.startsWith('SOCIAL_MEDIA')) {
                            navigate('/appMarket?category=SOCIAL_MEDIA');
                        } else {
                            navigate('/appMarket?category=' + detailData?.category?.split('_')[0]);
                        }
                    }}
                >
                    {useCategory(categoryTrees, detailData?.category)?.name}
                </Link>
            </Breadcrumbs>
            <Box display="flex" justifyContent="space-between" alignItems="end">
                <Box display="flex" justifyContent="space-between" alignItems="center" gap={1}>
                    {detailData?.icon && (
                        <Image preview={false} className="rounded-lg overflow-hidden" height={60} src={getImage(detailData?.icon)} />
                    )}
                    <Box>
                        <Box>
                            <Typography variant="h1" sx={{ fontSize: '2rem' }}>
                                {detailData?.name}
                            </Typography>
                        </Box>
                        <Box>
                            <span>#{useCategory(categoryTrees, detailData?.category)?.name}</span>
                            {detailData?.tags?.map((el: any) => (
                                <Chip key={el} sx={{ marginLeft: 1 }} size="small" label={el} variant="outlined" />
                            ))}
                        </Box>
                        {/* <Box sx={{ display: 'flex', alignItems: 'center' }}>
                            <RemoveRedEyeIcon fontSize="small" />
                            <span style={iconStyle}>{detailData?.viewCount}</span>
                            <VerticalAlignBottomIcon fontSize="small" />
                            <span style={iconStyle}>{detailData?.installCount}</span>
                            <ThumbUpIcon fontSize="small" />
                            <span style={iconStyle}>{detailData?.likeCount}</span>
                        </Box> */}
                    </Box>
                </Box>
                {/* <LoadingButton
                    color="info"
                    disabled={detailData.installStatus?.installStatus === 'INSTALLED'}
                    onClick={install}
                    loading={loading}
                    loadingIndicator="downLoad..."
                    variant="outlined"
                >
                    {detailData.installStatus?.installStatus === 'UNINSTALLED' ? t('market.down') : t('market.ins')}
                </LoadingButton> */}
                {detailData?.workflowConfig?.steps?.length === 1 && (
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
                            <div className="h-[23px]">
                                <ErrorOutline sx={{ color: '#697586', mr: '5px', cursor: 'pointer' }} />
                            </div>
                        </Popover>
                        <Select
                            style={{ width: 100, height: 23 }}
                            bordered={false}
                            className="rounded-2xl border-[0.5px] border-[#673ab7] border-solid"
                            rootClassName="modelSelect"
                            popupClassName="modelSelectPopup"
                            value={aiModels}
                            onChange={(value) => {
                                if (value === 'gpt-4' && !permissions.includes('app:execute:llm:gpt4')) {
                                    setOpenUpgradeModel(true);
                                    return;
                                }
                                aimodeRef.current = value;
                                setAiModels(value);
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
            </Box>
            <Divider sx={{ my: 1, borderColor: isDarkMode ? '#bdc8f0' : '#ccc' }} />
            <CarryOut
                columns={stepMaterial}
                setEditOpen={setEditOpen}
                setStep={(data: any) => {
                    stepRef.current = data;
                    setStep(stepRef.current);
                }}
                setMaterialType={setMaterialType}
                setTitle={setTitle}
                config={detailData}
                isShows={isShows}
                isDisables={isDisables}
                changeConfigs={changeConfigs}
                changeData={changeData}
                variableChange={variableChange}
                promptChange={promptChange}
                loadings={loadings}
                changeanswer={changeanswer}
                allExecute={(value: boolean) => {
                    isAllExecute = value;
                }}
            />
            {openUpgradeModel && (
                <PermissionUpgradeModal from="upgradeGpt4_0" open={openUpgradeModel} handleClose={() => setOpenUpgradeModel(false)} />
            )}
            {tokenOpen && (
                <PermissionUpgradeModal
                    open={tokenOpen}
                    from={from}
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
export default Deatail;
