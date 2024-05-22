import { getTenant, ENUM_TENANT } from 'utils/permission';
import {
    Upload,
    UploadProps,
    Button,
    Table,
    Modal,
    Image,
    Popconfirm,
    Form,
    Progress,
    Tabs,
    Collapse,
    InputNumber,
    Tag,
    Row,
    Col,
    Input,
    Badge,
    theme
} from 'antd';
import { PlusOutlined, SaveOutlined, ZoomInOutlined } from '@ant-design/icons';
import { getAccessToken } from 'utils/auth';
import _ from 'lodash-es';
import { useState, useEffect, useRef } from 'react';
import {
    materialTemplate,
    materialImport,
    materialExport,
    materialResilt,
    getPlan,
    planModify,
    planUpgrade,
    materialParse,
    metadata
} from 'api/redBook/batchIndex';
import { marketDeatail } from 'api/template/index';
import FormModal from './formModal';
import MarketForm from '../../../template/components/marketForm';
import CreateVariable from '../../copywriting/components/spliceCmponents/variable';
import LeftModalAdd from './leftModalAdd';
import AddStyle from 'ui-component/AddStyle';
import { useLocation } from 'react-router-dom';
import { v4 as uuidv4 } from 'uuid';
import Forms from '../../smallRedBook/components/form';
import { dispatch } from 'store';
import { openSnackbar } from 'store/slices/snackbar';
import { useAllDetail } from 'contexts/JWTContext';
import { PermissionUpgradeModal } from 'views/template/myChat/createChat/components/modal/permissionUpgradeModal';
import { useNavigate } from 'react-router-dom';
import AiCreate from './AICreate';
const Lefts = ({
    detailShow = true,
    planState,
    pre,
    detail,
    data,
    saveLoading,
    setCollData,
    setGetData,
    setFieldHead,
    setImageMoke,
    setMoke,
    newSave,
    setDetail,
    setPlanUid,
    defaultVariableData,
    defaultField,
    fieldHead,
    setDefaultVariableData,
    setDefaultField
}: {
    detailShow?: boolean;
    planState?: number;
    pre?: number;
    detail?: any;
    data?: any;
    saveLoading?: boolean;
    defaultVariableData?: boolean;
    defaultField?: boolean;
    fieldHead?: any;
    setCollData?: (data: any) => void;
    setGetData?: (data: any) => void;
    setFieldHead?: (data: any) => void;
    setMoke?: (data: any) => void;
    setImageMoke?: (data: any) => void;
    newSave: (data: any) => void;
    setDetail?: (data: any) => void;
    setPlanUid: (data: any) => void;
    setDefaultVariableData?: (data: any) => void;
    setDefaultField?: (data: any) => void;
}) => {
    const { token } = theme.useToken();
    const navigate = useNavigate();
    const { allDetail: all_detail }: any = useAllDetail();
    const { TextArea } = Input;
    const location = useLocation();
    const searchParams = new URLSearchParams(location.search);
    //存储的数据
    const appRef = useRef<any>(null);
    const [appData, setAppData] = useState<any>(null);
    const [version, setVersion] = useState(0);
    const getStatus1 = (status: any) => {
        switch (status) {
            case 'PENDING':
                return <Tag>待执行</Tag>;
            case 'RUNNING':
                return <Tag color="processing">执行中</Tag>;
            case 'PAUSE':
                return <Tag color="warning">暂停</Tag>;
            case 'CANCELED':
                return <Tag>已取消</Tag>;
            case 'COMPLETE':
                return <Tag color="success">已完成</Tag>;
            case 'FAILURE':
                return <Tag color="error">失败</Tag>;
            default:
                return <Tag>待执行</Tag>;
        }
    };
    //上传素材
    const [materialType, setMaterialType] = useState('');
    //上传图片
    const [open, setOpen] = useState(false);
    const [previewImage, setpreviewImage] = useState('');
    const [fileList, setFileList] = useState<any[]>([]);
    const props: UploadProps = {
        name: 'image',
        multiple: true,
        listType: 'picture-card',
        fileList,
        action: `${process.env.REACT_APP_BASE_URL}${process.env.REACT_APP_API_URL}/llm/creative/plan/uploadImage`,
        headers: {
            Authorization: 'Bearer ' + getAccessToken()
        },
        maxCount: 500,
        onChange(info) {
            setFileList(info.fileList);
        },
        onPreview: (file) => {
            setpreviewImage(file?.response?.data?.url);
            setOpen(true);
        },
        onDrop(e) {
            console.log('Dropped files', e.dataTransfer.files);
        }
    };
    const props1: UploadProps = {
        showUploadList: false,
        accept: '.zip',
        beforeUpload: async (file, fileList) => {
            setUploadLoading(true);
            try {
                const result = await materialImport({ file });
                perRef.current = 100;
                setPercent(perRef.current);
                setTableLoading(true);
                setUploadOpen(false);
                setParseUid(result?.data);
                setUploadLoading(false);
                return false;
            } catch (error) {
                console.error('Error uploading file:', error);
                setUploadLoading(false);
            }
        }
    };
    //批量上传素材
    const [zoomOpen, setZoomOpen] = useState(false); //下载弹框
    const [tableLoading, setTableLoading] = useState(false);
    const tableRef = useRef<any[]>([]);
    const [tableData, setTableData] = useState<any[]>([]);
    const [columns, setColumns] = useState<any[]>([]);
    //让列表插入数据
    const [selectedRowKeys, setSelectedRowKeys] = useState<any[]>([]);
    //插入数据
    const downTableData = (data: any) => {
        tableRef.current = data;
        setTableData(tableRef.current);
    };
    //上传素材弹框
    const [uploadOpen, setUploadOpen] = useState(false);
    const [bookOpen, setBookOpen] = useState(false);
    const [bookValue, setBookValue] = useState('');
    const [bookLoading, setBookLoading] = useState(false);
    const [parseUid, setParseUid] = useState(''); //上传之后获取的 uid
    const [MokeList, setMokeList] = useState<any[]>([]);
    //获取表头数据
    const typeList = [
        { label: '小红书', value: 'SMALL_RED_BOOK' },
        { label: '其他', value: 'OTHER' }
    ];
    const getTableHeader = async (list: any[]) => {
        // const result = await materialTemplate(materialType);
        setMokeList(list);
        const newList = list?.map((item: any) => {
            return {
                title: item.desc,
                align: 'center',
                width: 200,
                dataIndex: item.fieldName,
                render: (_: any, row: any) => (
                    <div className="flex justify-center items-center gap-2">
                        {item.type === 'image' ? (
                            row[item.fieldName] ? (
                                <Image
                                    fallback={
                                        'data:image/png;base64,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'
                                    }
                                    width={50}
                                    height={50}
                                    preview={false}
                                    src={row[item.fieldName] + '?x-oss-process=image/resize,w_300/quality,q_80'}
                                />
                            ) : (
                                <div className="w-[50px] h-[50px] rounded-md border border-solid border-black/10"></div>
                            )
                        ) : item.type === 'listImage' ? (
                            <div className="flex gap-1 flex-wrap">
                                {row[item.fieldName]?.map((item: any) => (
                                    <Image
                                        width={50}
                                        height={50}
                                        preview={false}
                                        src={item + '?x-oss-process=image/resize,w_300/quality,q_80'}
                                    />
                                ))}
                            </div>
                        ) : item.type === 'listStr' ? (
                            <div className="flex gap-1 flex-wrap">
                                {row[item.fieldName]?.map((item: any) => (
                                    <Tag color="processing">{item}</Tag>
                                ))}
                            </div>
                        ) : (
                            <div className="break-all line-clamp-4">
                                {item.fieldName === 'source'
                                    ? typeList?.find((i) => i.value === row[item.fieldName])?.label
                                    : row[item.fieldName]}
                            </div>
                        )}
                    </div>
                ),
                required: item.required,
                type: item.type
            };
        });
        setColumns([
            {
                title: '序号',
                align: 'center',
                width: 70,
                fixed: true,
                render: (_: any, row: any, index: number) => <span>{index + 1}</span>
            },
            ...newList,
            {
                title: '操作',
                align: 'center',
                width: 60,
                fixed: 'right',
                render: (_: any, row: any, index: number) => (
                    <div className="flex flex-col justify-center">
                        <Button onClick={() => handleEdit(row, index)} size="small" type="link">
                            编辑
                        </Button>
                        <Popconfirm
                            zIndex={9999}
                            title="提示"
                            description="请再次确认是否删除？"
                            okText="确认"
                            cancelText="取消"
                            onConfirm={() => handleDel(index)}
                        >
                            <Button size="small" type="link" danger>
                                删除
                            </Button>
                        </Popconfirm>
                    </div>
                )
            }
        ]);
        setTableLoading(false);
        setTablePre(1);
    };
    //下载模板
    const handleDownLoad = async () => {
        const res = await materialExport({
            planSource: detail ? 'app' : 'market',
            uid: searchParams.get('uid')
        });
        const downloadLink = document.createElement('a');
        downloadLink.href = window.URL.createObjectURL(res);
        downloadLink.download = searchParams.get('uid') + '-' + (detail ? 'app' : 'market') + '.zip';
        document.body.appendChild(downloadLink);
        downloadLink.click();
        document.body.removeChild(downloadLink);
    };
    //导入文件
    const [uploadLoading, setUploadLoading] = useState(false);
    const perRef = useRef<number>(0);
    const [percent, setPercent] = useState(0);
    //获取导出结果
    const timer: any = useRef(null);
    const getImportResult = () => {
        clearInterval(timer.current);
        timer.current = setInterval(() => {
            materialResilt(parseUid).then((result) => {
                if (result?.complete) {
                    setTableLoading(false);
                    clearInterval(timer.current);
                    tableRef.current = result?.materialList?.map((item: any) => ({
                        ...item,
                        uuid: uuidv4()
                    }));
                    setTableData(tableRef.current);
                }
            });
        }, 2000);
    };
    //删除
    const handleDel = (index: number) => {
        const newList = JSON.parse(JSON.stringify(tableRef.current));
        newList.splice(index, 1);
        tableRef.current = newList;
        setTableData(tableRef.current);
    };
    const [form] = Form.useForm();
    const [title, setTitle] = useState('');
    //编辑
    const [editOpen, setEditOpen] = useState(false);
    const [rowIndex, setRowIndex] = useState(0);
    const handleEdit = (row: any, index: number) => {
        setTitle('编辑');
        form.setFieldsValue(row);
        setRowIndex(index);
        setEditOpen(true);
    };
    const formOk = (result: any) => {
        const newList = _.cloneDeep(tableRef.current) || [];
        if (title === '编辑') {
            newList.splice((page - 1) * 10 + rowIndex, 1, result);
            tableRef.current = newList;
            setTableData(tableRef.current);
        } else {
            newList.unshift(result);
            tableRef.current = newList;
            setTableData(tableRef.current);
        }
        form.resetFields();
        setEditOpen(false);
    };
    useEffect(() => {
        if (parseUid) {
            getImportResult();
        }
        return () => {
            clearInterval(timer.current);
        };
    }, [parseUid]);
    //获取素材上传表格
    // useEffect(() => {
    //     if (materialType) {
    //         getTableHeader();
    //     }
    // }, [materialType]);
    //模拟上传进度
    const timer1: any = useRef(null);
    useEffect(() => {
        if (uploadLoading) {
            timer1.current = setInterval(() => {
                if (percent < 100) {
                    perRef.current += 30;
                    setPercent(perRef.current);
                }
            }, 20);
        } else {
            clearInterval(timer1.current);
            setPercent(0);
        }
    }, [uploadLoading]);

    //笔记生成
    const generRef = useRef<any>(null);
    const [generateList, setGenerateList] = useState<any[]>([]); //笔记生成
    const imageRef = useRef<any>(null);
    const [imageMater, setImagMater] = useState<any>(null); //图片上传

    const getList = async (flag?: boolean) => {
        let result;
        let newList: any;
        if (data) {
            result = _.cloneDeep(data);
            newList = _.cloneDeep(result?.executeParam?.appInformation);
        } else if (detail) {
            result = result = await getPlan({ appUid: searchParams.get('uid'), source: 'APP' });
            newList = _.cloneDeep(detail);
            newList?.workflowConfig?.steps?.forEach((item: any) => {
                const arr = item?.variable?.variables;
                const arr1 = item?.flowStep?.variable?.variables;
                arr?.forEach((el: any) => {
                    if (el.value && typeof el.value === 'object') {
                        el.value = JSON.stringify(el.value);
                    }
                });
                arr1?.forEach((el: any) => {
                    if (el.value && typeof el.value === 'object') {
                        el.value = JSON.stringify(el.value);
                    }
                });
            });
        } else {
            setTableLoading(true);
            result = await getPlan({ appUid: searchParams.get('appUid'), uid: searchParams.get('uid'), source: 'MARKET' });
            const res = await marketDeatail({ uid: searchParams.get('appUid') });
            setVersion(res.version);
            newList = _.cloneDeep(result?.configuration?.appInformation);
            const collData: any = result?.configuration?.appInformation?.example;
            if (collData) {
                setCollData && setCollData(collData.split(','));
            }
            navigate('/batchSmallRedBook?appUid=' + searchParams.get('appUid') + '&uid=' + result.uid + '&source=' + 'MARKET', {
                replace: true
            });
        }
        if (flag) setTableLoading(false);
        setTotalCount(result?.totalCount);
        setPlanUid(result?.uid);
        appRef.current = result;
        if (data) {
            appRef.current.executeParam.appInformation = newList;
        } else {
            appRef.current.configuration.appInformation = newList;
        }
        setAppData(appRef.current);

        newList?.workflowConfig?.steps.forEach((item: any) => {
            const arr: any[] = item?.variable?.variables;

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
        const materiallist = newList?.workflowConfig?.steps?.find((item: any) => item?.flowStep?.handler === 'MaterialActionHandler')
            ?.variable?.variables;
        const newMater = materiallist?.find((item: any) => item.field === 'MATERIAL_TYPE')?.value;
        const customData = materiallist?.find((item: any) => item.field === 'CUSTOM_MATERIAL_GENERATE_CONFIG')?.value;
        setDefaultVariableData && setDefaultVariableData(customData && customData !== '{}' ? JSON.parse(customData) : null);
        console.log(materiallist?.find((item: any) => item.field === 'MATERIAL_DEFINE')?.value);

        const fieldHeadcon = materiallist?.find((item: any) => item.field === 'MATERIAL_DEFINE')?.value;
        setFieldHead && setFieldHead(fieldHeadcon && fieldHeadcon !== '[]' ? JSON.parse(fieldHeadcon) : null);
        const fieldAI = materiallist?.find((item: any) => item.field === 'MATERIAL_GENERATE_CONFIG')?.value;
        setDefaultField && setDefaultField(fieldAI && fieldAI !== '{}' ? JSON.parse(fieldAI) : null);
        const valueList =
            newList?.workflowConfig?.steps
                ?.find((item: any) => item?.flowStep?.handler === 'MaterialActionHandler')
                ?.variable?.variables?.find((item: any) => item.style === 'MATERIAL')?.value || [];
        const picList = result?.configuration?.materialList;
        setMaterialType(newMater);
        if (newMater === 'picture') {
            if (!data) {
                setFileList(
                    result?.configuration?.materialList?.map((item: any) => ({
                        uid: uuidv4(),
                        thumbUrl: item?.pictureUrl,
                        response: {
                            data: {
                                url: item?.pictureUrl
                            }
                        }
                    }))
                );
            } else {
                const resul = newList?.workflowConfig?.steps
                    ?.find((item: any) => item?.flowStep?.handler === 'MaterialActionHandler')
                    ?.variable?.variables?.find((item: any) => item.style === 'MATERIAL')
                    ?.value?.map((item: any) => ({
                        uid: uuidv4(),
                        thumbUrl: item?.pictureUrl,
                        response: {
                            data: {
                                url: item?.pictureUrl
                            }
                        }
                    }));
                setFileList(
                    picList && picList?.length > 0
                        ? valueList?.map((item: any) => ({
                              uid: uuidv4(),
                              thumbUrl: item?.pictureUrl,
                              response: {
                                  data: {
                                      url: item?.pictureUrl
                                  }
                              }
                          }))
                        : resul
                        ? resul
                        : []
                );
            }
        } else {
            if (data) {
                tableRef.current = newList?.workflowConfig?.steps
                    ?.find((item: any) => item?.flowStep?.handler === 'MaterialActionHandler')
                    ?.variable?.variables?.find((item: any) => item.style === 'MATERIAL')
                    ?.value?.map((item: any, index: number) => {
                        if (index === 0) {
                            return {
                                ...item,
                                uuid: '123'
                            };
                        } else {
                            return {
                                ...item,
                                uuid: uuidv4()
                            };
                        }
                    });
                setTableData(tableRef.current || []);
            } else {
                tableRef.current = picList?.map((item: any) => ({
                    ...item,
                    uuid: uuidv4()
                }));
                setTableData(tableRef.current || []);
            }
        }
        generRef.current = newList?.workflowConfig?.steps?.filter(
            (item: any) => item?.flowStep?.handler !== 'MaterialActionHandler' && item?.flowStep?.handler !== 'PosterActionHandler'
        );
        setGenerateList(generRef.current);
        getStepMater();
        const newImage = newList?.workflowConfig?.steps?.find((item: any) => item?.flowStep?.handler === 'PosterActionHandler');
        newImage?.flowStep?.variable?.variables?.forEach((item: any) => {
            if (item.field === 'SYSTEM_POSTER_STYLE_CONFIG' && item.value && typeof item.value === 'string') {
                item.value = JSON.parse(item.value);
            }
        });
        console.log(result);

        if (result?.configuration?.imageStyleList?.length > 0) {
            console.log(newImage, result?.configuration);

            newImage.variable.variables.find((item: any) => item.field === 'POSTER_STYLE_CONFIG').value =
                result?.configuration?.imageStyleList ||
                newImage?.variable?.variables?.find((el: any) => el.field === 'POSTER_STYLE_CONFIG')?.value;
        }
        setImagMater(newImage);
    };
    const setcustom = (data: any) => {
        const newData = _.cloneDeep(appRef.current);
        const step = newData.configuration.appInformation.workflowConfig.steps.find(
            (item: any) => item.flowStep.handler === 'MaterialActionHandler'
        ).variable.variables;
        step.find((item: any) => item.field === 'CUSTOM_MATERIAL_GENERATE_CONFIG').value = data;
        newData.configuration.appInformation.workflowConfig.steps.find(
            (item: any) => item.flowStep.handler === 'MaterialActionHandler'
        ).variable.variables = step;
        appRef.current = newData;
        setAppData(appRef.current);
        handleSaveClick(false);
    };
    const setFieldHeads = (data: any) => {
        const newData = _.cloneDeep(appRef.current);
        const step = newData.configuration.appInformation.workflowConfig.steps.find(
            (item: any) => item.flowStep.handler === 'MaterialActionHandler'
        ).variable.variables;
        step.find((item: any) => item.field === 'MATERIAL_DEFINE').value = data;
        newData.configuration.appInformation.workflowConfig.steps.find(
            (item: any) => item.flowStep.handler === 'MaterialActionHandler'
        ).variable.variables = step;
        appRef.current = newData;
        setAppData(appRef.current);
        handleSaveClick(false);
    };
    const setField = (data: any) => {
        const newData = _.cloneDeep(appRef.current);
        const step = newData.configuration.appInformation.workflowConfig.steps.find(
            (item: any) => item.flowStep.handler === 'MaterialActionHandler'
        ).variable.variables;
        step.find((item: any) => item.field === 'MATERIAL_GENERATE_CONFIG').value = data;
        newData.configuration.appInformation.workflowConfig.steps.find(
            (item: any) => item.flowStep.handler === 'MaterialActionHandler'
        ).variable.variables = step;
        appRef.current = newData;
        setAppData(appRef.current);
        handleSaveClick(false);
    };
    //页面进入给 Tabs 分配值
    useEffect(() => {
        getList();
    }, []);
    //笔记生成的表头
    const stepRef = useRef(0);
    const [step, setStep] = useState(0);
    const [materialTypes, setMaterialTypes] = useState('');
    //改变值请求新的表头
    const stepMarRef = useRef<any[]>([]);
    const [stepMaterial, setStepMaterial] = useState<any[]>([]);
    const setTableDatas = async (type: string, steps: number) => {
        const res = await materialTemplate(type);
        const newList = _.cloneDeep(stepMarRef.current);
        newList[steps] = getHeaders(getHeader(res?.fieldDefine, steps), steps);
        stepMarRef.current = newList;
        setStepMaterial(stepMarRef.current);
    };
    const getStepMater = async () => {
        const arr: any[] = [];
        const newList = generRef.current?.map((item: any) => {
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
    //获取数据表头
    const getHeader = (data: any, i: number) => {
        const newList = data.map((item: any) => ({
            title: item.desc,
            align: 'center',
            width: item.fieldName === 'source' ? 100 : item.width || 200,
            fixed: item.fieldName === 'source' ? true : false,
            dataIndex: item.fieldName,
            render: (_: any, row: any) => (
                <div className="flex justify-center items-center flex-wrap break-all gap-2">
                    <div className="line-clamp-5">
                        {item.type === 'image' ? (
                            row[item.fieldName] ? (
                                <Image
                                    fallback={
                                        'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAMIAAADDCAYAAADQvc6UAAABRWlDQ1BJQ0MgUHJvZmlsZQAAKJFjYGASSSwoyGFhYGDIzSspCnJ3UoiIjFJgf8LAwSDCIMogwMCcmFxc4BgQ4ANUwgCjUcG3awyMIPqyLsis7PPOq3QdDFcvjV3jOD1boQVTPQrgSkktTgbSf4A4LbmgqISBgTEFyFYuLykAsTuAbJEioKOA7DkgdjqEvQHEToKwj4DVhAQ5A9k3gGyB5IxEoBmML4BsnSQk8XQkNtReEOBxcfXxUQg1Mjc0dyHgXNJBSWpFCYh2zi+oLMpMzyhRcASGUqqCZ16yno6CkYGRAQMDKMwhqj/fAIcloxgHQqxAjIHBEugw5sUIsSQpBobtQPdLciLEVJYzMPBHMDBsayhILEqEO4DxG0txmrERhM29nYGBddr//5/DGRjYNRkY/l7////39v///y4Dmn+LgeHANwDrkl1AuO+pmgAAADhlWElmTU0AKgAAAAgAAYdpAAQAAAABAAAAGgAAAAAAAqACAAQAAAABAAAAwqADAAQAAAABAAAAwwAAAAD9b/HnAAAHlklEQVR4Ae3dP3PTWBSGcbGzM6GCKqlIBRV0dHRJFarQ0eUT8LH4BnRU0NHR0UEFVdIlFRV7TzRksomPY8uykTk/zewQfKw/9znv4yvJynLv4uLiV2dBoDiBf4qP3/ARuCRABEFAoBEgghggQAQZQKAnYEaQBAQaASKIAQJEkAEEegJmBElAoBEgghggQAQZQKAnYEaQBAQaASKIAQJEkAEEegJmBElAoBEgghggQAQZQKAnYEaQBAQaASKIAQJEkAEEegJmBElAoBEgghggQAQZQKAnYEaQBAQaASKIAQJEkAEEegJmBElAoBEgghggQAQZQKAnYEaQBAQaASKIAQJEkAEEegJmBElAoBEgghggQAQZQKAnYEaQBAQaASKIAQJEkAEEegJmBElAoBEgghggQAQZQKAnYEaQBAQaASKIAQJEkAEEegJmBElAoBEgghggQAQZQKAnYEaQBAQaASKIAQJEkAEEegJmBElAoBEgghggQAQZQKAnYEaQBAQaASKIAQJEkAEEegJmBElAoBEgghggQAQZQKAnYEaQBAQaASKIAQJEkAEEegJmBElAoBEgghggQAQZQKAnYEaQBAQaASKIAQJEkAEEegJmBElAoBEgghggQAQZQKAnYEaQBAQaASKIAQJEkAEEegJmBElAoBEgghgg0Aj8i0JO4OzsrPv69Wv+hi2qPHr0qNvf39+iI97soRIh4f3z58/u7du3SXX7Xt7Z2enevHmzfQe+oSN2apSAPj09TSrb+XKI/f379+08+A0cNRE2ANkupk+ACNPvkSPcAAEibACyXUyfABGm3yNHuAECRNgAZLuYPgEirKlHu7u7XdyytGwHAd8jjNyng4OD7vnz51dbPT8/7z58+NB9+/bt6jU/TI+AGWHEnrx48eJ/EsSmHzx40L18+fLyzxF3ZVMjEyDCiEDjMYZZS5wiPXnyZFbJaxMhQIQRGzHvWR7XCyOCXsOmiDAi1HmPMMQjDpbpEiDCiL358eNHurW/5SnWdIBbXiDCiA38/Pnzrce2YyZ4//59F3ePLNMl4PbpiL2J0L979+7yDtHDhw8vtzzvdGnEXdvUigSIsCLAWavHp/+qM0BcXMd/q25n1vF57TYBp0a3mUzilePj4+7k5KSLb6gt6ydAhPUzXnoPR0dHl79WGTNCfBnn1uvSCJdegQhLI1vvCk+fPu2ePXt2tZOYEV6/fn31dz+shwAR1sP1cqvLntbEN9MxA9xcYjsxS1jWR4AIa2Ibzx0tc44fYX/16lV6NDFLXH+YL32jwiACRBiEbf5KcXoTIsQSpzXx4N28Ja4BQoK7rgXiydbHjx/P25TaQAJEGAguWy0+2Q8PD6/Ki4R8EVl+bzBOnZY95fq9rj9zAkTI2SxdidBHqG9+skdw43borCXO/ZcJdraPWdv22uIEiLA4q7nvvCug8WTqzQveOH26fodo7g6uFe/a17W3+nFBAkRYENRdb1vkkz1CH9cPsVy/jrhr27PqMYvENYNlHAIesRiBYwRy0V+8iXP8+/fvX11Mr7L7ECueb/r48eMqm7FuI2BGWDEG8cm+7G3NEOfmdcTQw4h9/55lhm7DekRYKQPZF2ArbXTAyu4kDYB2YxUzwg0gi/41ztHnfQG26HbGel/crVrm7tNY+/1btkOEAZ2M05r4FB7r9GbAIdxaZYrHdOsgJ/wCEQY0J74TmOKnbxxT9n3FgGGWWsVdowHtjt9Nnvf7yQM2aZU/TIAIAxrw6dOnAWtZZcoEnBpNuTuObWMEiLAx1HY0ZQJEmHJ3HNvGCBBhY6jtaMoEiJB0Z29vL6ls58vxPcO8/zfrdo5qvKO+d3Fx8Wu8zf1dW4p/cPzLly/dtv9Ts/EbcvGAHhHyfBIhZ6NSiIBTo0LNNtScABFyNiqFCBChULMNNSdAhJyNSiECRCjUbEPNCRAhZ6NSiAARCjXbUHMCRMjZqBQiQIRCzTbUnAARcjYqhQgQoVCzDTUnQIScjUohAkQo1GxDzQkQIWejUogAEQo121BzAkTI2agUIkCEQs021JwAEXI2KoUIEKFQsw01J0CEnI1KIQJEKNRsQ80JECFno1KIABEKNdtQcwJEyNmoFCJAhELNNtScABFyNiqFCBChULMNNSdAhJyNSiECRCjUbEPNCRAhZ6NSiAARCjXbUHMCRMjZqBQiQIRCzTbUnAARcjYqhQgQoVCzDTUnQIScjUohAkQo1GxDzQkQIWejUogAEQo121BzAkTI2agUIkCEQs021JwAEXI2KoUIEKFQsw01J0CEnI1KIQJEKNRsQ80JECFno1KIABEKNdtQcwJEyNmoFCJAhELNNtScABFyNiqFCBChULMNNSdAhJyNSiECRCjUbEPNCRAhZ6NSiAARCjXbUHMCRMjZqBQiQIRCzTbUnAARcjYqhQgQoVCzDTUnQIScjUohAkQo1GxDzQkQIWejUogAEQo121BzAkTI2agUIkCEQs021JwAEXI2KoUIEKFQsw01J0CEnI1KIQJEKNRsQ80JECFno1KIABEKNdtQcwJEyNmoFCJAhELNNtScABFyNiqFCBChULMNNSdAhJyNSiEC/wGgKKC4YMA4TAAAAABJRU5ErkJggg=='
                                    }
                                    width={50}
                                    height={50}
                                    preview={false}
                                    src={row[item.fieldName] + '?x-oss-process=image/resize,w_300/quality,q_80'}
                                />
                            ) : (
                                <div className="w-[50px] h-[50px] rounded-md border border-solid border-black/10"></div>
                            )
                        ) : item.type === 'listImage' ? (
                            <div className="flex gap-1 flex-wrap">
                                {row[item.fieldName]?.map((item: any) => (
                                    <Image
                                        width={50}
                                        height={50}
                                        preview={false}
                                        src={item + '?x-oss-process=image/resize,w_300/quality,q_80'}
                                    />
                                ))}
                            </div>
                        ) : item.type === 'listStr' ? (
                            <div className="flex gap-1 flex-wrap">
                                {row[item.fieldName]?.map((item: any) => (
                                    <Tag color="processing">{item}</Tag>
                                ))}
                            </div>
                        ) : item.fieldName === 'source' ? (
                            typeList?.find((i) => i.value === row[item.fieldName])?.label
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
                                handleEdits(row, index, i);
                            }}
                            size="small"
                            type="link"
                        >
                            编辑
                        </Button>
                        <Popconfirm
                            zIndex={9999}
                            title="提示"
                            description="请再次确认是否删除？"
                            okText="确认"
                            cancelText="取消"
                            onConfirm={() => handleDels(index, i)}
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
                                handleEdits(row, index, i);
                            }}
                            size="small"
                            type="link"
                        >
                            编辑
                        </Button>
                        <Popconfirm
                            zIndex={9999}
                            title="提示"
                            description="请再次确认是否删除？"
                            okText="确认"
                            cancelText="取消"
                            onConfirm={() => handleDels(index, i)}
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
    const handleDels = (index: number, i: number) => {
        if (i) {
            stepRef.current = i;
            setStep(stepRef.current);
        }
        const newValue = _.cloneDeep(generRef.current);
        const newList =
            newValue[i].variable.variables[newValue[i].variable.variables?.findIndex((item: any) => item.style === 'MATERIAL')].value;
        newList.splice(index, 1);
        generRef.current = newValue;
        setGenerateList(generRef.current);
    };
    const [forms] = Form.useForm();
    const [titles, setTitles] = useState('');
    //编辑
    const [editOpens, setEditOpens] = useState(false);
    const [rowIndexs, setRowIndexs] = useState(0);
    const handleEdits = (row: any, index: number, i?: number) => {
        if (i || i === 0) {
            let newData = _.cloneDeep(stepRef.current);
            newData = i;
            stepRef.current = newData;
            setStep(stepRef.current);
        }
        setTitles('编辑');
        setMaterialTypes(row.type);
        forms.setFieldsValue(row);
        setRowIndexs(index);
        setEditOpens(true);
    };
    const formOks = (result: any) => {
        const newValue = _.cloneDeep(generRef.current);
        const pubilcList = newValue[stepRef.current].variable.variables;
        let newList = pubilcList[pubilcList?.findIndex((item: any) => item.style === 'MATERIAL')]?.value;
        if (titles === '编辑') {
            newList.splice(rowIndexs, 1, { ...result, type: materialTypes });
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
        generRef.current = newValue;
        setGenerateList(generRef.current);
        setEditOpens(false);
        forms.resetFields();
    };
    // 基础数据
    const [totalCount, setTotalCount] = useState<number>(1);
    useEffect(() => {
        const getStatus = async () => {
            const result = await getPlan({
                appUid: searchParams.get('appUid') || searchParams.get('uid'),
                uid: searchParams.get('appUid') ? searchParams.get('uid') : undefined,
                source: searchParams.get('appUid') ? 'MARKET' : detail ? 'APP' : 'MARKET'
            });
            const newData = _.cloneDeep(appRef.current);
            newData.status = result?.status;
            appRef.current = newData;
            setAppData(appRef.current);
        };
        if (pre && pre > 0) {
            getStatus();
        }
    }, [pre]);
    useEffect(() => {
        if (planState) {
            handleSaveClick(exeState);
        }
    }, [planState]);
    const [exeState, setExeState] = useState(false);
    //保存
    const handleSaveClick = async (flag: boolean, detailShow?: boolean) => {
        const newList = _.cloneDeep(generateList);
        newList?.forEach((item) => {
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
        if (detailShow) {
            const data = _.cloneDeep(appRef.current);
            const upData = data?.executeParam?.appInformation?.workflowConfig?.steps?.find(
                (item: any) => item?.flowStep?.handler === 'MaterialActionHandler'
            );
            upData?.variable?.variables?.forEach((item: any) => {
                if (item?.style === 'MATERIAL') {
                    item.value =
                        materialType === 'picture'
                            ? JSON.stringify(
                                  fileList?.map((item) => ({
                                      pictureUrl: item?.response?.data?.url,
                                      type: 'picture'
                                  }))
                              )
                            : JSON.stringify(
                                  tableData?.map((item) => ({
                                      ...item,
                                      type: materialType
                                  }))
                              );
                }
            });
            data.executeParam.appInformation.workflowConfig.steps = [
                upData,
                ...newList,
                imageRef.current
                    ? imageRef.current?.record
                    : appRef.current.executeParam.appInformation.workflowConfig.steps?.find(
                          (item: any) => item?.flowStep?.handler === 'PosterActionHandler'
                      )
            ];
            newSave(data);
        } else {
            let styleData = imageRef.current?.record?.variable?.variables?.find((item: any) => item.field === 'POSTER_STYLE_CONFIG')?.value;
            if (typeof styleData === 'string') {
                styleData = JSON.parse(styleData);
            }
            const data = {
                uid: appRef.current?.uid,
                totalCount,
                configuration: {
                    imageStyleList: styleData
                        ? styleData?.map((item: any, index: number) => ({
                              ...item,
                              id: undefined,
                              code: item.id,
                              index: index + 1
                          }))
                        : imageMater?.variable?.variables?.find((item: any) => item?.field === 'POSTER_STYLE_CONFIG')?.value,
                    materialList:
                        materialType === 'picture'
                            ? fileList?.map((item) => ({
                                  pictureUrl: item?.response?.data?.url,
                                  type: 'picture'
                              }))
                            : tableData?.map((item) => ({
                                  ...item,
                                  type: materialType
                              })),
                    appInformation: {
                        ...appRef.current.configuration.appInformation,
                        workflowConfig: {
                            steps: [
                                ...appRef.current.configuration.appInformation.workflowConfig.steps?.filter(
                                    (item: any) => item?.flowStep?.handler === 'MaterialActionHandler'
                                ),
                                ...newList,
                                ...appRef.current.configuration.appInformation.workflowConfig.steps?.filter(
                                    (item: any) => item?.flowStep?.handler === 'PosterActionHandler'
                                )
                            ]
                        }
                    }
                },
                source: detail ? 'APP' : 'MARKET'
            };
            const result = await planModify(data);
            dispatch(
                openSnackbar({
                    open: true,
                    message: '保存成功',
                    variant: 'alert',
                    alert: {
                        color: 'success'
                    },
                    anchorOrigin: { vertical: 'top', horizontal: 'center' },
                    close: false
                })
            );
            if (flag) {
                if (totalCount > all_detail?.rights?.find((item: any) => item?.type === 'MATRIX_BEAN')?.remaining) {
                    setBotOpen(true);
                    return;
                }
                newSave(result);
            }
            setExeState(false);
        }
    };
    const [tabKey, setTabKey] = useState('1');
    const [page, setPage] = useState(1);
    const upDateVersion = async () => {
        const result = await planUpgrade({
            uid: appData?.uid,
            appUid: searchParams.get('appUid'),
            configuration: appData?.configuration,
            totalCount
        });
        dispatch(
            openSnackbar({
                open: true,
                message: '更新成功',
                variant: 'alert',
                alert: {
                    color: 'success'
                },
                anchorOrigin: { vertical: 'top', horizontal: 'center' },
                close: false
            })
        );
        getList(true);
    };
    //token 不足弹框
    const [botOpen, setBotOpen] = useState(false);
    useEffect(() => {
        if (!bookOpen) {
            setBookValue('');
        }
    }, [bookOpen]);
    //监听素材上传发生变化
    const [tablePre, setTablePre] = useState(0);

    const getTag = (type: string) => {
        return tableData
            ?.map((item: any) => item[type])
            ?.flat(1)
            ?.filter((item: string) => item);
    };
    useEffect(() => {
        if (tablePre && materialType === 'note') {
            const imageList = getTag('images')?.map((item) => ({
                type: 'note',
                pictureUrl: item
            }));
            const TagList = getTag('tags');
            const newList = _.cloneDeep(generRef.current);
            let conList = newList.find((item: any) => item.flowStep.handler === 'ImitateActionHandler').variable.variables;
            conList.find((item: any) => item.style === 'MATERIAL').value = tableData;
            conList.find((item: any) => item.field === 'REFERS_IMAGE').value = imageList;
            conList.find((item: any) => item.field === 'REFERS_TAG').value = TagList;
            newList.find((item: any) => item.flowStep.handler === 'ImitateActionHandler').variable.variables = conList;
            generRef.current = newList;
            setGenerateList(generRef.current);
        }
    }, [JSON.stringify(tableData)]);
    useEffect(() => {
        if (generateList?.length > 0) {
            setGetData && setGetData(generateList);
        }
    }, [JSON.stringify(generateList)]);
    useEffect(() => {
        if (materialType && materialType === 'picture') {
            setMoke &&
                setMoke(
                    fileList?.map((item) => ({
                        pictureUrl: item?.response?.data?.url,
                        type: 'picture'
                    })) || []
                );
        } else if (materialType && materialType !== 'picture') {
            setMoke &&
                setMoke(
                    tableData?.map((item) => ({
                        ...item,
                        type: materialType
                    })) || []
                );
        }
    }, [JSON.stringify(tableData), JSON.stringify(fileList)]);
    const [imageVar, setImageVar] = useState<any>(null);
    useEffect(() => {
        setImageMoke && setImageMoke(imageVar || imageMater);
    }, [imageVar]);
    useEffect(() => {
        const materiallist = appData?.configuration?.appInformation?.workflowConfig?.steps
            ?.find((item: any) => item?.flowStep?.handler === 'MaterialActionHandler')
            ?.variable?.variables?.find((item: any) => item.field === 'CUSTOM_MATERIAL_GENERATE_CONFIG')?.value;
        setDefaultVariableData && setDefaultVariableData(materiallist && materiallist !== '{}' ? JSON.parse(materiallist) : null);
    }, [
        appData?.configuration?.appInformation?.workflowConfig?.steps
            ?.find((item: any) => item?.flowStep?.handler === 'MaterialActionHandler')
            ?.variable?.variables?.find((item: any) => item.field === 'CUSTOM_MATERIAL_GENERATE_CONFIG')?.value
    ]);
    useEffect(() => {
        const materiallist = appData?.configuration?.appInformation?.workflowConfig?.steps
            ?.find((item: any) => item?.flowStep?.handler === 'MaterialActionHandler')
            ?.variable?.variables?.find((item: any) => item.field === 'MATERIAL_DEFINE')?.value;

        getTableHeader(materiallist && materiallist !== '[]' ? JSON.parse(materiallist) : []);
        setFieldHead && setFieldHead(materiallist && materiallist !== '[]' ? JSON.parse(materiallist) : null);
    }, [
        appData?.configuration?.appInformation?.workflowConfig?.steps
            ?.find((item: any) => item?.flowStep?.handler === 'MaterialActionHandler')
            ?.variable?.variables?.find((item: any) => item.field === 'MATERIAL_DEFINE')?.value
    ]);
    useEffect(() => {
        const materiallist = appData?.configuration?.appInformation?.workflowConfig?.steps
            ?.find((item: any) => item?.flowStep?.handler === 'MaterialActionHandler')
            ?.variable?.variables?.find((item: any) => item.field === 'MATERIAL_GENERATE_CONFIG')?.value;
        setDefaultField && setDefaultField(materiallist && materiallist !== '{}' ? JSON.parse(materiallist) : null);
    }, [
        appData?.configuration?.appInformation?.workflowConfig?.steps
            ?.find((item: any) => item?.flowStep?.handler === 'MaterialActionHandler')
            ?.variable?.variables?.find((item: any) => item.field === 'MATERIAL_GENERATE_CONFIG')?.value
    ]);
    const [materialFieldTypeList, setMaterialFieldTypeList] = useState<any[]>([]);
    useEffect(() => {
        metadata().then((res) => {
            setMaterialFieldTypeList(res.MaterialFieldTypeEnum);
        });
    }, []);
    //公共数据
    const [variableData, setVariableData] = useState<any>({
        checkedFieldList: [],
        requirement: undefined,
        generateCount: 1
    });
    const [fieldCompletionData, setFieldCompletionData] = useState<any>({
        checkedFieldList: [],
        requirement: ''
    });
    useEffect(() => {
        if (defaultVariableData) {
            setVariableData(defaultVariableData);
        } else {
            setVariableData({
                ...variableData,
                checkedFieldList: columns
                    ?.slice(1, columns?.length - 1)
                    ?.filter((item) => item.type !== 'image')
                    ?.map((item) => item?.dataIndex)
            });
        }
        if (defaultField) {
            setFieldCompletionData(defaultField);
        } else {
            setFieldCompletionData({
                ...fieldCompletionData,
                checkedFieldList: columns
                    ?.slice(1, columns?.length - 1)
                    ?.filter((item) => item.type !== 'image')
                    ?.map((item) => item?.dataIndex)
            });
        }
    }, [columns]);
    //素材字段配置弹框
    const [colOpen, setColOpen] = useState(false);
    return (
        <>
            <div className="relative h-full">
                {detailShow && (
                    <div className="flex gap-2 justify-between items-center mx-2 mb-4 mr-4">
                        <div className="text-[22px] whitespace-nowrap">{appData?.configuration?.appInformation?.name}</div>
                        {!detail && (
                            <div>
                                状态：{getStatus1(appData?.status)}
                                <div className="inline-block whitespace-nowrap">
                                    {appData?.version !== version ? (
                                        <Popconfirm
                                            title="更新提示"
                                            description={
                                                <div>
                                                    <div>当前应用最新版本为：{version}</div>
                                                    <div>你使用的应用版本为：{appData?.version}</div>
                                                    <div>是否需要更新版本，获得最佳创作效果</div>
                                                </div>
                                            }
                                            onConfirm={() => upDateVersion()}
                                            okText="更新"
                                            cancelText="取消"
                                        >
                                            <Badge dot>
                                                <span className="p-2 rounded-md cursor-pointer hover:shadow-md">
                                                    版本号： <span className="font-blod">{appData?.version || 0}</span>
                                                </span>
                                            </Badge>
                                        </Popconfirm>
                                    ) : (
                                        <span>
                                            版本号： <span className="font-blod">{appData?.version || 0}</span>
                                        </span>
                                    )}
                                </div>
                            </div>
                        )}
                    </div>
                )}
                <div
                    style={{
                        height: detailShow
                            ? getTenant() === ENUM_TENANT.AI
                                ? 'calc(100% - 100px)'
                                : 'calc(100% - 50px)'
                            : 'calc(100% - 14px)'
                    }}
                    className="overflow-y-auto pb-[72px] pr-2"
                >
                    <Tabs activeKey={tabKey} onChange={(key) => setTabKey(key)}>
                        {(appData?.configuration?.appInformation?.workflowConfig?.steps?.find(
                            (item: any) => item?.flowStep?.handler === 'MaterialActionHandler'
                        ) ||
                            appData?.executeParam?.appInformation?.workflowConfig?.steps?.find(
                                (item: any) => item?.flowStep?.handler === 'MaterialActionHandler'
                            )) && (
                            <Tabs.TabPane key={'1'} tab="素材上传">
                                <div>
                                    {materialType === 'picture' ? (
                                        <>
                                            <div className="text-[12px] font-[500] flex items-center justify-between">
                                                <div>图片总量：{fileList?.length}</div>
                                                {fileList?.length > 0 && (
                                                    <Button
                                                        danger
                                                        onClick={() => {
                                                            setFileList([]);
                                                        }}
                                                        size="small"
                                                        type="text"
                                                    >
                                                        全部清除
                                                    </Button>
                                                )}
                                            </div>
                                            <div className="flex flex-wrap gap-[10px] h-[300px] overflow-y-auto shadow">
                                                <div>
                                                    <Upload {...props}>
                                                        <div className=" w-[100px] h-[100px] border border-dashed border-[#d9d9d9] rounded-[5px] bg-[#000]/[0.02] flex justify-center items-center flex-col cursor-pointer">
                                                            <PlusOutlined rev={undefined} />
                                                            <div style={{ marginTop: 8 }}>Upload</div>
                                                        </div>
                                                    </Upload>
                                                </div>
                                            </div>
                                        </>
                                    ) : (
                                        <>
                                            <div className="flex justify-between items-center mb-[10px]">
                                                <div className="flex gap-2">
                                                    <Button
                                                        size="small"
                                                        type="primary"
                                                        onClick={() => {
                                                            if (materialType === 'note') {
                                                                setBookOpen(true);
                                                            } else {
                                                                setUploadOpen(true);
                                                            }
                                                        }}
                                                    >
                                                        批量导入
                                                    </Button>
                                                    <AiCreate
                                                        title="AI 生成"
                                                        materialType={materialType}
                                                        setColOpen={setColOpen}
                                                        columns={columns}
                                                        MokeList={MokeList}
                                                        tableData={tableData}
                                                        defaultVariableData={defaultVariableData}
                                                        defaultField={defaultField}
                                                        setPage={setPage}
                                                        setcustom={setcustom}
                                                        setField={setField}
                                                        downTableData={downTableData}
                                                        setSelectedRowKeys={(data) => {
                                                            setZoomOpen(true);
                                                            setSelectedRowKeys(data);
                                                        }}
                                                        setFieldCompletionData={setFieldCompletionData}
                                                        fieldCompletionData={fieldCompletionData}
                                                        setVariableData={setVariableData}
                                                        variableData={variableData}
                                                    />
                                                </div>
                                                <div className="flex gap-2 items-end">
                                                    <div className="text-xs text-black/50">点击放大编辑</div>
                                                    <Button
                                                        onClick={() => setZoomOpen(true)}
                                                        type="primary"
                                                        shape="circle"
                                                        icon={<ZoomInOutlined rev={undefined} />}
                                                    ></Button>
                                                </div>
                                            </div>
                                            <Table
                                                className="!w-[684px]"
                                                pagination={{
                                                    onChange: (page) => {
                                                        setPage(page);
                                                    }
                                                }}
                                                rowKey={(record, index) => {
                                                    return record.uuid;
                                                }}
                                                loading={tableLoading}
                                                size="small"
                                                virtual
                                                columns={columns}
                                                dataSource={tableData}
                                            />
                                        </>
                                    )}
                                </div>
                            </Tabs.TabPane>
                        )}
                        <Tabs.TabPane
                            key={
                                appData?.configuration?.appInformation?.workflowConfig?.steps?.find(
                                    (item: any) => item?.flowStep?.handler === 'MaterialActionHandler'
                                ) ||
                                appData?.executeParam?.appInformation?.workflowConfig?.steps?.find(
                                    (item: any) => item?.flowStep?.handler === 'MaterialActionHandler'
                                )
                                    ? '2'
                                    : '1'
                            }
                            tab="笔记生成"
                        >
                            <Collapse
                                defaultActiveKey={['0']}
                                style={{ background: token.colorBgContainer, border: 'none' }}
                                items={generateList?.map((item: any, index: number) => ({
                                    key: index.toString(),
                                    label: <span className="text-[16px]">{item.name}</span>,
                                    children: (
                                        <div key={item.field}>
                                            <div className="text-xs text-black/50 mb-4">{item?.description}</div>
                                            {item?.flowStep?.handler !== 'VariableActionHandler' ? (
                                                item?.variable?.variables?.map((el: any, i: number) => (
                                                    <div key={el.field}>
                                                        {el?.isShow && (
                                                            <MarketForm
                                                                key={el.field}
                                                                item={el}
                                                                materialType={''}
                                                                details={appData?.configuration?.appInformation}
                                                                stepCode={item?.field}
                                                                model={''}
                                                                handlerCode={item?.flowStep?.handler}
                                                                history={false}
                                                                promptShow={true}
                                                                setEditOpen={setEditOpens}
                                                                setTitle={setTitles}
                                                                setStep={() => {
                                                                    stepRef.current = index;
                                                                    setStep(stepRef.current);
                                                                }}
                                                                columns={stepMaterial[index]}
                                                                setMaterialType={() => {
                                                                    setMaterialTypes(
                                                                        el?.variable?.variables?.find(
                                                                            (i: any) => i.field === 'MATERIAL_TYPE'
                                                                        )?.value
                                                                    );
                                                                }}
                                                                onChange={(e: any) => {
                                                                    const newList = _.cloneDeep(generRef.current);
                                                                    const type = e.name === 'MATERIAL_TYPE' ? e.value : undefined;
                                                                    const code = item?.flowStep?.handler;
                                                                    newList[index].variable.variables[i].value = e.value;
                                                                    if (
                                                                        type &&
                                                                        item.variable.variables?.find(
                                                                            (item: any) => item.style === 'MATERIAL'
                                                                        )
                                                                    ) {
                                                                        newList[index].variable.variables[
                                                                            item.variable.variables?.findIndex(
                                                                                (item: any) => item.style === 'MATERIAL'
                                                                            )
                                                                        ].value = [];
                                                                        stepRef.current = index;
                                                                        setStep(stepRef.current);
                                                                        setTableDatas(type, index);
                                                                    }
                                                                    if (code === 'CustomActionHandler' && e.name === 'GENERATE_MODE') {
                                                                        const num = item.variable.variables?.findIndex(
                                                                            (item: any) => item.field === 'REQUIREMENT'
                                                                        );
                                                                        const num1 = item.variable.variables?.findIndex(
                                                                            (item: any) => item.style === 'MATERIAL'
                                                                        );
                                                                        if (e.value === 'RANDOM') {
                                                                            newList[index].variable.variables[num].isShow = false;
                                                                            newList[index].variable.variables[num1].isShow = true;
                                                                        } else if (e.value === 'AI_PARODY') {
                                                                            newList[index].variable.variables[num].isShow = true;
                                                                            newList[index].variable.variables[num1].isShow = true;
                                                                        } else {
                                                                            newList[index].variable.variables[num1].isShow = false;
                                                                            newList[index].variable.variables[num].isShow = true;
                                                                        }
                                                                    }
                                                                    generRef.current = newList;
                                                                    setGenerateList(generRef.current);
                                                                }}
                                                            />
                                                        )}
                                                    </div>
                                                ))
                                            ) : (
                                                <Tabs defaultActiveKey="1">
                                                    <Tabs.TabPane tab="变量编辑" key="1">
                                                        <Row gutter={10}>
                                                            {item?.variable?.variables?.map((item: any, de: number) => (
                                                                <Col key={item?.field} span={24}>
                                                                    <Forms
                                                                        item={item}
                                                                        index={de}
                                                                        changeValue={(data: any) => {
                                                                            const newList = _.cloneDeep(generateList);
                                                                            newList[index].variable.variables[de].value = data.value;
                                                                            generRef.current = newList;
                                                                            setGenerateList(generRef.current);
                                                                        }}
                                                                        flag={false}
                                                                    />
                                                                </Col>
                                                            ))}
                                                        </Row>
                                                    </Tabs.TabPane>
                                                    <Tabs.TabPane tab="变量列表" key="2">
                                                        <CreateVariable
                                                            rows={item?.variable?.variables}
                                                            setRows={(data: any[]) => {
                                                                const newList = _.cloneDeep(generateList);
                                                                newList[index].variable.variables = data;
                                                                generRef.current = newList;
                                                                setGenerateList(generRef.current);
                                                            }}
                                                        />
                                                    </Tabs.TabPane>
                                                </Tabs>
                                            )}
                                        </div>
                                    ),
                                    style: {
                                        marginBottom: 16,
                                        background: token.colorFillAlter,
                                        borderRadius: token.borderRadiusLG,
                                        border: 'none'
                                    }
                                }))}
                            />
                        </Tabs.TabPane>
                        {appData?.configuration?.appInformation?.workflowConfig?.steps?.find(
                            (item: any) => item?.flowStep?.handler === 'PosterActionHandler'
                        ) && (
                            <Tabs.TabPane key={'3'} tab="图片生成">
                                <AddStyle
                                    allData={appData}
                                    details={appData?.configuration?.appInformation}
                                    hasAddStyle={detail || !detailShow ? false : true}
                                    setImageVar={setImageVar}
                                    getList={() => getList(true)}
                                    appUid={appData?.appUid}
                                    ref={imageRef}
                                    record={imageMater}
                                    materialType={materialType}
                                />
                            </Tabs.TabPane>
                        )}
                        {appData?.executeParam?.appInformation?.workflowConfig?.steps?.find(
                            (item: any) => item?.flowStep?.handler === 'MaterialActionHandler'
                        ) && (
                            <Tabs.TabPane key={'3'} tab="图片生成">
                                <AddStyle
                                    details={appData?.configuration?.appInformation}
                                    hasAddStyle={detail || !detailShow ? false : true}
                                    setImageVar={setImageVar}
                                    appUid={appData?.appUid}
                                    ref={imageRef}
                                    record={imageMater}
                                    mode={2}
                                    getList={() => getList(true)}
                                    materialType={materialType}
                                />
                            </Tabs.TabPane>
                        )}
                        {detailShow && (
                            <Tabs.TabPane key={'4'} tab="批量生成参数">
                                <div className="mt-[16px] flex gap-2 items-center">
                                    <div className="relative max-w-[300px]">
                                        <InputNumber
                                            className="bg-[#f8fafc] w-full"
                                            size="large"
                                            value={totalCount}
                                            onChange={(e: any) => {
                                                if (e > all_detail?.rights?.find((item: any) => item?.type === 'MATRIX_BEAN')?.remaining) {
                                                    setBotOpen(true);
                                                    return;
                                                }
                                                setTotalCount(e);
                                            }}
                                            min={1}
                                            max={all_detail?.levels[0]?.levelConfigDTO?.aiCreationCount || 8}
                                        />
                                        <span className="text-[#697586] block bg-gradient-to-b from-[#fff] to-[#f8fafc] px-[5px] absolute top-[-9px] left-2 text-[12px]">
                                            生成数量
                                        </span>
                                    </div>
                                    <div className="text-xs text-slate-500">想要生成更多，请升级</div>
                                </div>
                            </Tabs.TabPane>
                        )}
                    </Tabs>
                </div>
                <div className="z-[1000] absolute bottom-[-2px] flex gap-2 bg-[#fff] pt-4 w-[calc(100%-8px)]">
                    {detailShow && (
                        <>
                            {!detail && (
                                <Button
                                    className="w-full"
                                    icon={<SaveOutlined rev={undefined} />}
                                    onClick={() => handleSaveClick(false)}
                                    type="primary"
                                >
                                    保存配置
                                </Button>
                            )}
                            <Button
                                className="w-full"
                                type="primary"
                                onClick={() => {
                                    if (!detail) {
                                        handleSaveClick(true);
                                    } else {
                                        const newData = _.cloneDeep(detail);
                                        let arr = newData?.workflowConfig?.steps;
                                        const a = arr.find((item: any) => item.flowStep.handler === 'MaterialActionHandler');
                                        if (a) {
                                            a.variable.variables.find((item: any) => item.style === 'MATERIAL').value =
                                                materialType === 'picture'
                                                    ? fileList?.map((item) => ({
                                                          pictureUrl: item?.response?.data?.url,
                                                          type: 'picture'
                                                      }))
                                                    : tableData?.map((item) => ({
                                                          ...item,
                                                          type: materialType
                                                      }));
                                        }
                                        const b = arr.find((item: any) => item.flowStep.handler === 'PosterActionHandler');
                                        if (b) {
                                            let styleData = imageRef.current?.record?.variable?.variables?.find(
                                                (item: any) => item.field === 'POSTER_STYLE_CONFIG'
                                            )?.value;
                                            if (typeof styleData === 'string') {
                                                styleData = JSON.parse(styleData);
                                            }
                                            b.variable.variables.find((item: any) => item.field === 'POSTER_STYLE_CONFIG').value = styleData
                                                ? styleData?.map((item: any) => ({
                                                      ...item,
                                                      id: undefined,
                                                      code: item.id
                                                  }))
                                                : imageMater?.variable?.variables?.find(
                                                      (item: any) => item?.field === 'POSTER_STYLE_CONFIG'
                                                  )?.value;
                                        }

                                        arr = [
                                            arr.find((item: any) => item.flowStep.handler === 'MaterialActionHandler'),
                                            ...generRef.current,
                                            arr.find((item: any) => item.flowStep.handler === 'PosterActionHandler')
                                        ];
                                        setExeState(true);
                                        setDetail &&
                                            setDetail({
                                                ...detail,
                                                workflowConfig: {
                                                    steps: arr?.filter((item: any) => item)
                                                }
                                            });
                                    }
                                }}
                            >
                                保存并开始生成
                            </Button>
                        </>
                    )}
                    {!detailShow && (
                        <Button loading={saveLoading} className="w-full" onClick={() => handleSaveClick(false, true)} type="primary">
                            保存并重新生成
                        </Button>
                    )}
                </div>
            </div>
            <Modal zIndex={9999} open={open} footer={null} onCancel={() => setOpen(false)}>
                <Image
                    className="min-w-[472px]"
                    preview={false}
                    alt="example"
                    src={previewImage + '?x-oss-process=image/resize,w_300/quality,q_80'}
                />
            </Modal>
            {zoomOpen && (
                <LeftModalAdd
                    zoomOpen={zoomOpen}
                    setZoomOpen={setZoomOpen}
                    colOpen={colOpen}
                    setColOpen={setColOpen}
                    tableLoading={tableLoading}
                    defaultVariableData={defaultVariableData}
                    materialFieldTypeList={materialFieldTypeList}
                    defaultField={defaultField}
                    fieldHead={fieldHead}
                    selectedRowKeys={selectedRowKeys}
                    setcustom={setcustom}
                    setField={setField}
                    setFieldHeads={setFieldHeads}
                    materialType={materialType}
                    columns={columns}
                    tableData={tableData}
                    setTitle={setTitle}
                    setEditOpen={setEditOpen}
                    changeTableValue={(data) => {
                        tableRef.current = data?.map((item: any) => ({
                            ...item,
                            uuid: uuidv4()
                        }));
                        setTableData(tableRef.current);
                        setSelectedRowKeys([]);
                    }}
                    MokeList={MokeList}
                    setPage={setPage}
                    downTableData={downTableData}
                    setSelectedRowKeys={(data) => {
                        setZoomOpen(true);
                        setSelectedRowKeys(data);
                    }}
                    setFieldCompletionData={setFieldCompletionData}
                    fieldCompletionData={fieldCompletionData}
                    setVariableData={setVariableData}
                    variableData={variableData}
                />
            )}
            <Modal width={400} title="批量导入" open={uploadOpen} footer={null} onCancel={() => setUploadOpen(false)}>
                <p>
                    支持以 XLS 文件形式批量导入页面元素，导入文件将自动刷新列表页。
                    <span className="text-[#673ab7] cursor-pointer" onClick={handleDownLoad}>
                        下载导入 XLS 模板
                    </span>
                </p>
                <div className="flex justify-center mt-[20px]">
                    <div className="flex flex-col items-center">
                        <Upload {...props1}>
                            <Button type="primary">上传 ZIP</Button>
                        </Upload>
                        <div className="text-xs text-black/50 mt-2">请把下载的内容修改后，对目录打包后再上传</div>
                    </div>
                </div>
                {uploadLoading && <Progress size="small" percent={percent} />}
            </Modal>
            <Modal
                zIndex={9999}
                width={400}
                title="批量导入"
                open={bookOpen}
                onOk={async () => {
                    setBookLoading(true);
                    try {
                        const result = await materialParse({ noteUrlList: bookValue?.split(/\r?\n/), materialType });
                        tableRef.current = result?.map((item: any) => ({
                            ...item,
                            uuid: uuidv4()
                        }));
                        setTableData(tableRef.current);
                        setBookLoading(false);
                        setBookOpen(false);
                    } catch (e) {
                        setBookLoading(false);
                    }
                }}
                onCancel={() => setBookOpen(false)}
                confirmLoading={bookLoading}
            >
                <TextArea
                    placeholder="请输入小红书地址使用“空格”分割"
                    rows={8}
                    value={bookValue}
                    onChange={(e) => setBookValue(e.target.value)}
                />
            </Modal>
            {editOpen && (
                <FormModal
                    title={title}
                    editOpen={editOpen}
                    setEditOpen={setEditOpen}
                    columns={columns}
                    form={form}
                    formOk={formOk}
                    sourceList={typeList}
                />
            )}
            {editOpens && (
                <FormModal
                    title={titles}
                    materialType={materialTypes}
                    editOpen={editOpens}
                    setEditOpen={setEditOpens}
                    columns={stepMarRef.current[stepRef.current]}
                    form={forms}
                    formOk={formOks}
                    sourceList={typeList}
                />
            )}
            {botOpen && <PermissionUpgradeModal open={botOpen} handleClose={() => setBotOpen(false)} title={`生成数量不足`} from={''} />}
        </>
    );
};

export default Lefts;
