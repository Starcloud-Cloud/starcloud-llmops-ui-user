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
    theme,
    Tooltip,
    Popover,
    Dropdown,
    Switch
} from 'antd';
import { AccordionDetails, AccordionSummary, Accordion, IconButton } from '@mui/material';
import { ExpandMore, AddCircleSharp, South, MoreVert } from '@mui/icons-material';
import {
    PlusOutlined,
    SaveOutlined,
    ZoomInOutlined,
    InfoCircleOutlined,
    CloudUploadOutlined,
    DeleteOutlined,
    CopyOutlined,
    VerticalAlignBottomOutlined,
    VerticalAlignTopOutlined,
    SettingOutlined,
    RightOutlined
} from '@ant-design/icons';
import { getAccessToken } from 'utils/auth';
import _ from 'lodash-es';
import { useState, useEffect, useRef, useMemo } from 'react';
import {
    materialTemplate,
    materialImport,
    materialExport,
    materialResilt,
    getPlan,
    planModify,
    planUpgrade,
    materialParse,
    metadata,
    planModifyConfig,
    materialJudge,
    createSameApp,
    createMaterialList
} from 'api/redBook/batchIndex';
import { marketDeatail } from 'api/template/index';
import FormModal, { propShow } from './formModal';
import MarketForm from '../../../template/components/marketForm';
import CreateVariable from '../../copywriting/components/spliceCmponents/variable';
import LeftModalAdd from './leftModalAdd';
import AddStyleApp from 'ui-component/AddStyle/indexApp';
import AddStyle from 'ui-component/AddStyle/index';
import { useLocation } from 'react-router-dom';
import { v4 as uuidv4 } from 'uuid';
import Forms from '../../smallRedBook/components/form';
import { dispatch } from 'store';
import { openSnackbar } from 'store/slices/snackbar';
import { useAllDetail } from 'contexts/JWTContext';
import { PermissionUpgradeModal } from 'views/template/myChat/createChat/components/modal/permissionUpgradeModal';
import { useNavigate } from 'react-router-dom';
import AiCreate from './AICreate';
import { PicImagePick } from 'ui-component/PicImagePick';
import './newLeft.scss';
import { SearchOutlined } from '@ant-design/icons';
import { stepList } from 'api/template';
import EditStepTitle from './editStepTitle';
import SettingModal from './settingModal';
import React from 'react';

const Lefts = ({
    detailShow = true,
    planState,
    pre,
    imageStylePre,
    isMyApp,
    changePre,
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
    leftWidth,
    setDefaultVariableData,
    setDefaultField,
    setWidth,
    getAppList
}: {
    detailShow?: boolean;
    planState?: number;
    isMyApp?: boolean;
    pre?: number;
    imageStylePre?: number;
    changePre?: number;
    detail?: any;
    data?: any;
    saveLoading?: boolean;
    defaultVariableData?: any;
    defaultField?: any;
    leftWidth?: any;
    fieldHead?: any;
    setCollData?: (data: any) => void;
    setGetData?: (data: any) => void;
    setFieldHead?: (data: any) => void;
    setMoke?: (data: any) => void;
    setImageMoke?: (data: any) => void;
    newSave: (data: any) => void;
    setDetail?: (data: any, fieldShow?: boolean) => void;
    setPlanUid: (data: any) => void;
    setDefaultVariableData?: (data: any) => void;
    setDefaultField?: (data: any) => void;
    setWidth?: () => void;
    getAppList?: () => void;
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
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [selectImg, setSelectImg] = useState<any>(null);
    const [imageDataIndex, setImageDataIndex] = useState(0);
    const [filedName, setFiledName] = useState('');
    const [values, setValues] = useState({});
    const tableRef = useRef<any[]>([]);

    useEffect(() => {
        if (tableRef.current.length && selectImg?.largeImageURL) {
            const data = tableRef.current;
            data.forEach((item) => {
                if (item.uuid === imageDataIndex) {
                    item[filedName] = selectImg?.largeImageURL;
                }
            });
            tableRef.current = data;
            setTableData([...data]);
        }
    }, [selectImg]);

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
    const [materialTypeStatus, setMaterialTypeStatus] = useState(false); //获取状态 true图片 false 表格
    const materialStatus = useMemo(() => {
        return (
            appData?.configuration?.appInformation?.workflowConfig?.steps
                ?.find((item: any) => item.flowStep.handler === 'MaterialActionHandler')
                ?.variable?.variables?.find((el: any) => el.field === 'BUSINESS_TYPE')?.value || 'default'
        );
    }, [
        appData?.configuration?.appInformation?.workflowConfig?.steps
            ?.find((item: any) => item.flowStep.handler === 'MaterialActionHandler')
            ?.variable?.variables?.find((el: any) => el.field === 'BUSINESS_TYPE')?.value
    ]);
    //上传图片
    const [open, setOpen] = useState(false);
    const [previewImage, setpreviewImage] = useState('');
    const [fileList, setFileList] = useState<any[]>([]);
    const [previewUrl, setPreviewUrl] = useState('');
    const [previewOpen, setPreviewOpen] = useState(false);
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
        accept: '.zip,.rar',
        beforeUpload: async (file, fileList) => {
            setUploadLoading(true);
            try {
                const result = await materialImport({
                    planSource: detail ? 'app' : 'market',
                    uid: searchParams.get('uid'),
                    file
                });
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
    const [tableData, setTableData] = useState<any[]>([]);
    const [columns, setColumns] = useState<any[]>([]);
    //让列表插入数据
    const [selectedRowKeys, setSelectedRowKeys] = useState<any[]>([]);
    //插入数据
    const downTableData = (data: any[], num: number) => {
        if (num === 1) {
            const newList = _.cloneDeep(tableRef.current);
            newList.unshift(...data);
            tableRef.current = newList;
            setTableData(tableRef.current);
        } else {
            tableRef.current = data;
            setTableData(tableRef.current);
        }
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
    const [canUpload, setCanUpload] = useState(true);

    const getTableHeader = (list: any[]) => {
        // const result = await materialTemplate(materialType);
        setMokeList(list);
        const newList = list?.map((item: any) => {
            return {
                title: item.desc,
                align: 'center',
                width: item.type === 'textBox' ? 400 : 200,
                dataIndex: item.fieldName,
                render: (_: any, row: any, index: number) => (
                    <div className="flex justify-center items-center gap-2">
                        {item.type === 'image' ? (
                            <div className="relative">
                                {/* {row[item.fieldName] ? (
                                    <Image
                                        fallback={
                                            'data:image/png;base64,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'
                                        }
                                        width={80}
                                        height={80}
                                        preview={false}
                                        src={row[item.fieldName] + '?x-oss-process=image/resize,w_300/quality,q_80'}
                                    />
                                ) : (
                                    <div className="w-[80px] h-[80px] rounded-md border border-solid border-black/10"></div>
                                )} */}
                                <Upload
                                    className="table_upload"
                                    {...propShow}
                                    showUploadList={false}
                                    listType="picture-card"
                                    maxCount={1}
                                    disabled={!canUpload}
                                    onChange={(info) => {
                                        if (info.file.status === 'done') {
                                            const data = tableRef.current;
                                            data[index][item.fieldName] = info?.file?.response?.data?.url;
                                            tableRef.current = data;
                                            setTableData([...data]);
                                        }
                                    }}
                                >
                                    {row[item.fieldName] ? (
                                        <div className="relative">
                                            <Image
                                                onMouseEnter={() => setCanUpload(false)}
                                                onClick={(e) => e.stopPropagation()}
                                                width={82}
                                                height={82}
                                                preview={{
                                                    src: row[item.fieldName]
                                                }}
                                                src={
                                                    row[item.fieldName] + '?x-oss-process=image/resize,w_100/quality,q_80'
                                                    // selectImg?.largeImageURL ||
                                                    // form.getFieldValue(item.dataIndex) + '?x-oss-process=image/resize,w_300/quality,q_80'
                                                }
                                            />
                                            <div className="bottom-0 z-[1] absolute w-full h-[20px] hover:bg-black/30 flex justify-center items-center bg-[rgba(0,0,0,.4)]">
                                                <Tooltip title="上传">
                                                    <div
                                                        className="flex-1 flex justify-center"
                                                        onMouseEnter={() => setCanUpload(true)}
                                                        onMouseLeave={() => setCanUpload(false)}
                                                    >
                                                        <CloudUploadOutlined className="text-white/60 hover:text-white" />
                                                    </div>
                                                </Tooltip>
                                                <Tooltip title="搜索">
                                                    <div
                                                        className="flex-1 flex justify-center !cursor-pointer"
                                                        onClick={(e) => {
                                                            setIsModalOpen(true);
                                                            e.stopPropagation();
                                                            setImageDataIndex(row.uuid);
                                                            setFiledName(item.fieldName);
                                                            setValues(row);
                                                        }}
                                                    >
                                                        <SearchOutlined className="text-white/60 hover:text-white" />
                                                    </div>
                                                </Tooltip>
                                            </div>
                                        </div>
                                    ) : (
                                        <div
                                            className=" w-[80px] h-[80px] border border-dashed border-[#d9d9d9] rounded-[5px] bg-[#000]/[0.02] flex justify-center items-center flex-col cursor-pointer relative"
                                            onMouseEnter={() => setCanUpload(true)}
                                        >
                                            <PlusOutlined />
                                            <div style={{ marginTop: 8 }}>Upload</div>
                                            <Tooltip title="搜索">
                                                <div
                                                    className="bottom-0 z-[1] absolute w-full h-[20px] hover:bg-black/30 flex justify-center items-center bg-[rgba(0,0,0,.5)]"
                                                    onClick={(e) => {
                                                        setIsModalOpen(true);
                                                        e.stopPropagation();
                                                        setImageDataIndex(row.uuid);
                                                        setFiledName(item.fieldName);
                                                        setValues(row);
                                                    }}
                                                >
                                                    <SearchOutlined className="text-white/80 hover:text-white" />
                                                </div>
                                            </Tooltip>
                                        </div>
                                    )}
                                </Upload>
                            </div>
                        ) : item.type === 'listImage' ? (
                            <div className="flex gap-1 flex-wrap">
                                {row[item.fieldName]?.map((item: any) => (
                                    <Image
                                        width={50}
                                        height={50}
                                        preview={false}
                                        src={item + '?x-oss-process=image/resize,w_100/quality,q_80'}
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
        downloadLink.download = appData?.configuration?.appInformation?.name + '-模版.zip';
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
                    if (!detail) {
                        handleSaveClick(false);
                    } else {
                        // 我的应用
                        setExeState(false);
                        const arr = headerSaveAll();
                        setDetail &&
                            setDetail({
                                ...detail,
                                workflowConfig: {
                                    steps: arr?.filter((item: any) => item)
                                }
                            });
                    }
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
            console.log(result, page, rowIndex);

            newList.splice((page - 1) * 20 + rowIndex, 1, {
                ...result,
                uuid: newList[(page - 1) * 20 + rowIndex]?.uuid,
                group: newList[(page - 1) * 20 + rowIndex]?.group
            });
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
    const [selectImgLoading, setSelectImgLoading] = useState(false);
    const verifyList = () => {
        if (tableData?.length === 0 && fileList?.length === 0) {
            dispatch(
                openSnackbar({
                    open: true,
                    message: '素材上传最少有一个',
                    variant: 'alert',
                    alert: {
                        color: 'error'
                    },
                    anchorOrigin: { vertical: 'top', horizontal: 'center' },
                    close: false
                })
            );
            return;
        }
        if (imageRef.current?.record?.variable?.variable?.find((item: any) => item.field === 'POSTER_STYLE_CONFIG')) {
        }
        console.log(imageRef.current);
    };
    // 选择照片loading

    const getList = async (flag?: boolean, appUpdate?: boolean, isimgStyle?: boolean) => {
        let result;
        let newList: any;
        setTableLoading(true);
        if (data) {
            result = _.cloneDeep(data);
            newList = _.cloneDeep(result?.executeParam?.appInformation);
        } else if (appUpdate) {
            if (searchParams.get('appUid')) {
                setSelectImgLoading(true);
                result = await getPlan({ appUid: searchParams.get('appUid'), uid: searchParams.get('uid'), source: 'MARKET' });
                setSelectImgLoading(false);
                newList = _.cloneDeep(result?.configuration?.appInformation);
            } else {
                setSelectImgLoading(true);
                result = await getPlan({ appUid: searchParams.get('uid'), source: 'APP' });
                setSelectImgLoading(false);
                newList = _.cloneDeep(result?.configuration?.appInformation);
            }
        } else if (detail) {
            setSelectImgLoading(true);
            result = await getPlan({ appUid: searchParams.get('uid'), source: 'APP' });
            setSelectImgLoading(false);
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
            setSelectImgLoading(true);
            result = await getPlan({ appUid: searchParams.get('appUid'), uid: searchParams.get('uid'), source: 'MARKET' });
            setSelectImgLoading(false);
            const res = await marketDeatail({ uid: searchParams.get('appUid') });
            setVersion(res?.version || 0);
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

            if (arr?.find((el: any) => el.style === 'MATERIAL')?.value) {
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
        const judge = await materialJudge({
            uid: data ? result.planUid : searchParams.get('uid') ? searchParams.get('uid') : detail ? detail?.uid : result.uid,
            planSource: detail ? 'app' : 'market'
        });
        setMaterialTypeStatus(judge);
        const newMater = materiallist?.find((item: any) => item.field === 'MATERIAL_TYPE')?.value;
        const customData = materiallist?.find((item: any) => item.field === 'CUSTOM_MATERIAL_GENERATE_CONFIG')?.value;
        setDefaultVariableData && setDefaultVariableData(customData && customData !== '{}' ? JSON.parse(customData) : null);
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
        let tableDataList;
        if (!data) {
            tableDataList = await createMaterialList({
                uid: result.uid
            });
        }
        if (judge) {
            if (!data) {
                setFileList(
                    tableDataList?.map((item: any) => ({
                        uid: uuidv4(),
                        thumbUrl: item?.pictureUrl,
                        response: {
                            data: {
                                url: item?.pictureUrl
                            }
                        }
                    })) ||
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
                tableRef.current =
                    tableDataList?.map((item: any) => ({
                        ...item,
                        uuid: uuidv4()
                    })) ||
                    picList?.map((item: any) => ({
                        ...item,
                        uuid: uuidv4()
                    }));
                console.log(tableRef.current, 'tableRef.current');
                setTableData(tableRef.current || []);
            }
        }
        generRef.current = _.cloneDeep(
            newList?.workflowConfig?.steps?.filter(
                (item: any) => item?.flowStep?.handler !== 'MaterialActionHandler' && item?.flowStep?.handler !== 'PosterActionHandler'
            )
        );
        setGenerateList(generRef.current);
        getStepMater();
        const newImage = newList?.workflowConfig?.steps?.find((item: any) => item?.flowStep?.handler === 'PosterActionHandler');
        newImage?.flowStep?.variable?.variables?.forEach((item: any) => {
            if (item.field === 'SYSTEM_POSTER_STYLE_CONFIG' && item.value && typeof item.value === 'string') {
                item.value = JSON.parse(item.value);
            }
        });
        if (result?.configuration?.imageStyleList?.length > 0) {
            newImage.variable.variables.find((item: any) => item.field === 'POSTER_STYLE_CONFIG').value =
                result?.configuration?.imageStyleList ||
                newImage?.variable?.variables?.find((el: any) => el.field === 'POSTER_STYLE_CONFIG')?.value;
        }
        setImagMater(newImage);
        setTableLoading(false);
        if (isimgStyle) {
            saveTemplate();
        }
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
        if (detail) {
            setExeState(false);
            const arr = headerSaveAll();
            setDetail &&
                setDetail({
                    ...detail,
                    workflowConfig: {
                        steps: arr?.filter((item: any) => item)
                    }
                });
        } else {
            handleSaveClick(false);
        }
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
        if (!detail) {
            handleSaveClick(false, false, true);
        } else {
            setExeState(false);
            const arr = headerSaveAll(data);
            setDetail &&
                setDetail(
                    {
                        ...detail,
                        workflowConfig: {
                            steps: arr?.filter((item: any) => item)
                        }
                    },
                    true
                );
        }
    };
    const setField = (data: any) => {
        const newData1 = _.cloneDeep(appRef.current);
        const step = newData1.configuration.appInformation.workflowConfig.steps.find(
            (item: any) => item.flowStep.handler === 'MaterialActionHandler'
        ).variable.variables;
        step.find((item: any) => item.field === 'MATERIAL_GENERATE_CONFIG').value = data;
        newData1.configuration.appInformation.workflowConfig.steps.find(
            (item: any) => item.flowStep.handler === 'MaterialActionHandler'
        ).variable.variables = step;
        appRef.current = newData1;
        setAppData(appRef.current);
        if (detail) {
            setExeState(false);
            const arr = headerSaveAll();
            setDetail &&
                setDetail({
                    ...detail,
                    workflowConfig: {
                        steps: arr?.filter((item: any) => item)
                    }
                });
        } else {
            handleSaveClick(false);
        }
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
                                        'data:image/png;base64,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'
                                    }
                                    width={50}
                                    height={50}
                                    preview={false}
                                    src={row[item.fieldName] + '?x-oss-process=image/resize,w_100/quality,q_80'}
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
                                        src={item + '?x-oss-process=image/resize,w_100/quality,q_80'}
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
                type: materialTypes
            });
        }
        pubilcList[pubilcList?.findIndex((item: any) => item.style === 'MATERIAL')].value = newList;
        generRef.current = newValue;
        setGenerateList(generRef.current);
        setAppDataGen();
        setEditOpens(false);
        forms.resetFields();
    };
    // 基础数据
    const [totalCount, setTotalCount] = useState<number>(1);
    useEffect(() => {
        const getStatus = async () => {
            setSelectImgLoading(true);
            const result = await getPlan({
                appUid: searchParams.get('appUid') || searchParams.get('uid'),
                uid: searchParams.get('appUid') ? searchParams.get('uid') : undefined,
                source: searchParams.get('appUid') ? 'MARKET' : detail ? 'APP' : 'MARKET'
            });
            setSelectImgLoading(false);
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
        if (planState && planState > 0) {
            handleSaveClick(exeState);
        } else if (planState && planState < 0) {
            handleSaveClick(exeState, false, true);
        }
    }, [planState]);
    const [exeState, setExeState] = useState(false);

    const materialList = React.useMemo(() => {
        return materialStatus === 'picture'
            ? fileList?.map((item) => ({
                  pictureUrl: item?.response?.data?.url,
                  type: 'picture'
              }))
            : tableData?.map((item) => ({
                  ...item,
                  type: materialType
              }));
    }, [materialStatus, fileList, tableData]);

    //保存
    const handleSaveClick = async (flag: boolean, detailShow?: boolean, fieldShow?: boolean) => {
        // verifyList();
        // return;
        const newList = _.cloneDeep(generRef.current);
        newList?.forEach((item: any) => {
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
                        materialStatus === 'picture'
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
            console.log(imageRef.current);
            console.log(
                appRef.current.configuration.appInformation.workflowConfig.steps?.find(
                    (item: any) => item?.flowStep?.handler === 'PosterActionHandler'
                )
            );

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
                        materialStatus === 'picture'
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
                                imageRef.current
                                    ? imageRef.current?.record
                                    : appRef.current.configuration.appInformation.workflowConfig.steps?.find(
                                          (item: any) => item?.flowStep?.handler === 'PosterActionHandler'
                                      )
                            ]
                        }
                    }
                },
                source: detail ? 'APP' : 'MARKET'
            };
            let result;

            if (!fieldShow) {
                result = await planModify(data);
                if (result) {
                    getList(false, true);
                }
            } else {
                result = await planModifyConfig(data);
            }
            const judge = await materialJudge({
                uid: searchParams.get('uid'),
                planSource: searchParams.get('appUid') ? 'market' : 'app'
            });
            setMaterialTypeStatus(judge);
            dispatch(
                openSnackbar({
                    open: true,
                    message: '创作计划保存成功',
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
    const upDateVersion = async (updataTip: string) => {
        const result = await planUpgrade({
            uid: appData?.uid,
            appUid: searchParams.get('appUid'),
            configuration: appData?.configuration,
            totalCount,
            isFullCover: updataTip === '0' ? undefined : true
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
    }, [generateList]);
    useEffect(() => {
        if (materialStatus === 'picture') {
            setMoke &&
                setMoke(
                    fileList?.map((item) => ({
                        pictureUrl: item?.response?.data?.url,
                        type: 'picture'
                    })) || []
                );
        } else {
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
        const materiallist = appData?.configuration
            ? appData?.configuration?.appInformation?.workflowConfig?.steps
                  ?.find((item: any) => item?.flowStep?.handler === 'MaterialActionHandler')
                  ?.variable?.variables?.find((item: any) => item.field === 'CUSTOM_MATERIAL_GENERATE_CONFIG')?.value
            : appData?.executeParam?.appInformation?.workflowConfig?.steps
                  ?.find((item: any) => item?.flowStep?.handler === 'MaterialActionHandler')
                  ?.variable?.variables?.find((item: any) => item.field === 'CUSTOM_MATERIAL_GENERATE_CONFIG')?.value;
        setDefaultVariableData && setDefaultVariableData(materiallist && materiallist !== '{}' ? JSON.parse(materiallist) : null);
    }, [
        appData?.configuration?.appInformation?.workflowConfig?.steps
            ?.find((item: any) => item?.flowStep?.handler === 'MaterialActionHandler')
            ?.variable?.variables?.find((item: any) => item.field === 'CUSTOM_MATERIAL_GENERATE_CONFIG')?.value,
        appData?.executeParam?.appInformation?.workflowConfig?.steps
            ?.find((item: any) => item?.flowStep?.handler === 'MaterialActionHandler')
            ?.variable?.variables?.find((item: any) => item.field === 'CUSTOM_MATERIAL_GENERATE_CONFIG')?.value
    ]);
    useEffect(() => {
        const materiallist = appData?.configuration
            ? appData?.configuration?.appInformation?.workflowConfig?.steps
                  ?.find((item: any) => item?.flowStep?.handler === 'MaterialActionHandler')
                  ?.variable?.variables?.find((item: any) => item.field === 'MATERIAL_DEFINE')?.value
            : appData?.executeParam?.appInformation?.workflowConfig?.steps
                  ?.find((item: any) => item?.flowStep?.handler === 'MaterialActionHandler')
                  ?.variable?.variables?.find((item: any) => item.field === 'MATERIAL_DEFINE')?.value;
        getTableHeader(materiallist && materiallist !== '[]' ? JSON.parse(materiallist) : []);
        setFieldHead && setFieldHead(materiallist && materiallist !== '[]' ? JSON.parse(materiallist) : null);
    }, [
        appData?.configuration?.appInformation?.workflowConfig?.steps
            ?.find((item: any) => item?.flowStep?.handler === 'MaterialActionHandler')
            ?.variable?.variables?.find((item: any) => item.field === 'MATERIAL_DEFINE')?.value,
        canUpload,
        appData?.executeParam?.appInformation?.workflowConfig?.steps
            ?.find((item: any) => item?.flowStep?.handler === 'MaterialActionHandler')
            ?.variable?.variables?.find((item: any) => item.field === 'MATERIAL_DEFINE')?.value
    ]);
    useEffect(() => {
        const materiallist = appData?.configuration
            ? appData?.configuration?.appInformation?.workflowConfig?.steps
                  ?.find((item: any) => item?.flowStep?.handler === 'MaterialActionHandler')
                  ?.variable?.variables?.find((item: any) => item.field === 'MATERIAL_GENERATE_CONFIG')?.value
            : appData?.executeParam?.appInformation?.workflowConfig?.steps
                  ?.find((item: any) => item?.flowStep?.handler === 'MaterialActionHandler')
                  ?.variable?.variables?.find((item: any) => item.field === 'MATERIAL_GENERATE_CONFIG')?.value;

        setDefaultField && setDefaultField(materiallist && materiallist !== '{}' ? JSON.parse(materiallist) : null);
    }, [
        appData?.configuration?.appInformation?.workflowConfig?.steps
            ?.find((item: any) => item?.flowStep?.handler === 'MaterialActionHandler')
            ?.variable?.variables?.find((item: any) => item.field === 'MATERIAL_GENERATE_CONFIG')?.value,
        appData?.executeParam?.appInformation?.workflowConfig?.steps
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
        groupNum: 1,
        generateCount: 1
    });
    const [fieldCompletionData, setFieldCompletionData] = useState<any>({
        checkedFieldList: [],
        requirement: ''
    });
    useEffect(() => {
        const newList = columns?.slice(1, columns?.length - 1)?.filter((item) => item.type !== 'image' && item.type !== 'document');
        const maxLength = newList?.filter((item) => item.required);
        const reList = newList?.filter((item) => item.required)?.map((i: any) => i?.dataIndex);
        const resizeList = newList?.filter((item) => !item.required)?.map((i: any) => i?.dataIndex);
        if (defaultVariableData) {
            const list = maxLength?.map((item) => item.dataIndex);
            if (maxLength?.length >= 6) {
                setVariableData({
                    ...defaultVariableData,
                    checkedFieldList: list
                });
            } else {
                const list1 = newList
                    ?.filter((item) => item.required || defaultVariableData?.checkedFieldList?.includes(item.dataIndex))
                    ?.map((item) => item.dataIndex);
                setVariableData({
                    ...defaultVariableData,
                    checkedFieldList: list1?.slice(0, 6)
                });
            }
        } else {
            setVariableData({
                ...variableData,
                checkedFieldList: reList
            });
        }
        if (defaultField) {
            const maxLength = newList?.filter((item) => item.required);
            const list = maxLength?.map((item) => item.dataIndex);
            if (maxLength?.length >= 6) {
                setFieldCompletionData({
                    ...defaultField,
                    checkedFieldList: list
                });
            } else {
                const list1 = newList

                    ?.filter((item) => defaultField?.checkedFieldList?.includes(item.dataIndex))
                    ?.map((item) => item.dataIndex);
                setFieldCompletionData({
                    ...defaultField,
                    checkedFieldList: list1?.slice(0, 6)
                });
            }
        } else {
            setFieldCompletionData({
                ...fieldCompletionData,
                checkedFieldList: []
            });
        }
    }, [columns]);
    const headerSaveAll = (data?: any) => {
        const newData = _.cloneDeep(detail);
        let arr = newData?.workflowConfig?.steps;
        const a = appRef.current.configuration?.appInformation?.workflowConfig?.steps?.find(
            (item: any) => item.flowStep.handler === 'MaterialActionHandler'
        );
        if (a) {
            a.variable.variables.find((item: any) => item.style === 'MATERIAL').value =
                materialStatus === 'picture'
                    ? fileList?.map((item: any) => ({
                          pictureUrl: item?.response?.data?.url
                      }))
                    : tableData?.map((item: any) => ({
                          ...item
                      }));
            a.variable.variables.find((item: any) => item.field === 'MATERIAL_DEFINE').value =
                data ||
                appRef.current.configuration?.appInformation?.workflowConfig?.steps
                    ?.find((item: any) => item.flowStep.handler === 'MaterialActionHandler')
                    .variable?.variables?.find((item: any) => item.field === 'MATERIAL_DEFINE').value;
            arr[
                appRef.current.configuration?.appInformation?.workflowConfig?.steps?.findIndex(
                    (item: any) => item.flowStep.handler === 'MaterialActionHandler'
                )
            ] = a;
        }
        let b = _.cloneDeep(imageRef.current?.record);
        if (!b) {
            b = appRef.current.configuration?.appInformation?.workflowConfig?.steps?.find(
                (item: any) => item?.flowStep?.handler === 'PosterActionHandler'
            );
        }
        console.log(b);

        arr = [arr.find((item: any) => item.flowStep.handler === 'MaterialActionHandler'), ..._.cloneDeep(generRef.current), b];
        return arr;
    };

    // 我的应用保存
    const saveTemplate = () => {
        setExeState(false);
        const arr = headerSaveAll();
        console.log(arr);

        setDetail &&
            setDetail({
                ...detail,
                workflowConfig: {
                    steps: arr?.filter((item: any) => item)
                }
            });
    };

    //素材字段配置弹框
    const gessaveApp = () => {
        let arr = headerSaveAll();
        setExeState(true);
        setDetail &&
            setDetail({
                ...detail,
                workflowConfig: {
                    steps: arr?.filter((item: any) => item)
                }
            });
    };
    const [colOpen, setColOpen] = useState(false);
    const [updataTip, setUpdataTip] = useState('0');

    //创作同款应用状态
    const [createAppStatus, setCreateAppStatus] = useState(false);

    //增加步骤的
    const [stepOpen, setStepOpen] = useState<any[]>([]);
    const [stepLists, setStepList] = useState<any[]>([]);
    const [collStep, setCollStep] = useState('');
    const getImage = (data: string) => {
        let image: string = '';
        try {
            image = require('../../../../assets/images/carryOut/' + data + '.svg');
        } catch (errr) {
            image = '';
        }
        return image;
    };
    const addupStep = (item: any, index: number) => {
        const newLists = _.cloneDeep(appRef.current);
        newLists.configuration?.appInformation?.workflowConfig?.steps.unshift(item);
        appRef.current = newLists;
        setAppData(appRef.current);
    };
    const addStep = (item: any, index: number) => {
        const newList = _.cloneDeep(generRef.current);
        const newLists = _.cloneDeep(appRef.current);
        const handle = newLists.configuration?.appInformation?.workflowConfig?.steps?.find(
            (item: any) => item.flowStep.handler === 'MaterialActionHandler'
        );
        let name = addName(item.name);
        if (handle) {
            newList.splice(index, 0, { ...item, name });
            newLists.configuration?.appInformation?.workflowConfig?.steps.splice(index + 1, 0, { ...item, name });
        } else {
            newList.splice(index + 1, 0, { ...item, name });
            newLists.configuration?.appInformation?.workflowConfig?.steps.splice(index + 1, 0, { ...item, name });
        }
        generRef.current = newList;
        appRef.current = newLists;
        setAppData(appRef.current);
        setGenerateList(generRef.current);
        const newStep = _.cloneDeep(stepOpen);
        newStep[index] = open;
        setStepOpen(newStep);
    };
    const addName: any = (name: string) => {
        const nameList = appRef.current.configuration?.appInformation?.workflowConfig?.steps?.map((item: any) => item.name);

        if (nameList.includes(name)) {
            const nameParts = name.match(/(.*?)(\d*)$/);
            console.log(nameParts);
            if (nameParts) {
                // 如果有数字，则解析出数字并加1
                let prefix = nameParts[1];
                let numberPart = nameParts[2];
                let incrementedNumber = numberPart ? parseInt(numberPart, 10) + 1 : 1;
                return addName(`${prefix}${incrementedNumber > 0 ? incrementedNumber : ''}`);
            } else {
                // 如果没有数字，就默认从1开始
                return addName(`${name}1`);
            }
        } else {
            return name;
        }
    };
    //删除步骤
    const delStep = (index: number) => {
        const newList = _.cloneDeep(generRef.current);
        const newLists = _.cloneDeep(appRef.current);
        const handle = newLists.configuration?.appInformation?.workflowConfig?.steps?.find(
            (item: any) => item.flowStep.handler === 'MaterialActionHandler'
        );
        if (handle) {
            if (index === 0) {
                setTableData([]);
                setFileList([]);
                newLists.configuration?.appInformation?.workflowConfig?.steps.splice(index, 1);
            } else {
                newList.splice(index - 1, 1);
                newLists.configuration?.appInformation?.workflowConfig?.steps.splice(index, 1);
            }
        } else {
            newList.splice(index, 1);
            newLists.configuration?.appInformation?.workflowConfig?.steps.splice(index, 1);
        }
        generRef.current = newList;
        appRef.current = newLists;
        setAppData(appRef.current);
        setGenerateList(generRef.current);
    };
    //复制步骤
    const copyStep = (item: any, index: number) => {
        const newList = _.cloneDeep(generRef.current);
        const newLists = _.cloneDeep(appRef.current);
        const handle = newLists.configuration?.appInformation?.workflowConfig?.steps?.find(
            (item: any) => item.flowStep.handler === 'MaterialActionHandler'
        );
        if (handle) {
            newList.splice(index, 0, { ...item, name: item.name + '_copy' });
            newLists.configuration?.appInformation?.workflowConfig?.steps.splice(index + 1, 0, { ...item, name: item.name + '_copy' });
        } else {
            newList.splice(index + 1, 0, { ...item, name: item.name + '_copy' });
            newLists.configuration?.appInformation?.workflowConfig?.steps.splice(index + 1, 0, { ...item, name: item.name + '_copy' });
        }
        generRef.current = newList;
        appRef.current = newLists;
        setAppData(appRef.current);
        setGenerateList(generRef.current);
    };
    //移动步骤
    const stepMove = (index: number, direction: number) => {
        const newList = _.cloneDeep(generRef.current);
        const newLists = _.cloneDeep(appRef.current);
        const handle = newLists.configuration?.appInformation?.workflowConfig?.steps?.find(
            (item: any) => item.flowStep.handler === 'MaterialActionHandler'
        );
        if (handle) {
            const temp = _.cloneDeep(newList[index - 1]);
            newList[index - 1] = newList[index - 1 + direction];
            newList[index - 1 + direction] = temp;
            console.log(newList);
            const temps = _.cloneDeep(newLists.configuration?.appInformation?.workflowConfig?.steps[index]);
            newLists.configuration.appInformation.workflowConfig.steps[index] =
                newLists.configuration.appInformation.workflowConfig.steps[index + direction];
            newLists.configuration.appInformation.workflowConfig.steps[index + direction] = temps;
        } else {
            const temp = _.cloneDeep(newList[index]);
            newList[index] = newList[index + direction];
            newList[index + direction] = temp;
            const temps = _.cloneDeep(newLists.configuration?.appInformation?.workflowConfig?.steps[index]);
            newLists.configuration.appInformation.workflowConfig.steps[index] = newList[index + direction];
            newLists.configuration.appInformation.workflowConfig.steps[index + direction] = temps;
        }
        generRef.current = newList;
        appRef.current = newLists;
        setAppData(appRef.current);
        setGenerateList(generRef.current);
    };
    //改变给 sppData 赋值
    const setAppDataGen = () => {
        const variable = appRef.current.configuration.appInformation.workflowConfig.steps;
        const appOne = _.cloneDeep(variable[0]);
        const applast = _.cloneDeep(variable[variable?.length - 1]);
        const newappList = _.cloneDeep(appRef.current);
        newappList.configuration.appInformation.workflowConfig.steps = [appOne, ...generRef.current, applast];
        appRef.current = newappList;
        setAppData(appRef.current);
    };
    useEffect(() => {
        if (detail?.type) {
            stepList(detail?.type).then((res) => {
                setStepList(res);
            });
        }
    }, [detail?.type]);
    useEffect(() => {
        if (changePre && appRef.current) {
            appRef.current.configuration.appInformation = detail;
            setAppData(appRef.current);
            generRef.current = appRef.current?.configuration?.appInformation?.workflowConfig?.steps?.filter((item: any) => {
                return item?.flowStep?.handler !== 'MaterialActionHandler' && item?.flowStep?.handler !== 'PosterActionHandler';
            });
            setGenerateList(generRef.current);
        }
    }, [changePre]);
    const [imgPre, setImgPre] = useState(0);
    useEffect(() => {
        if (imgPre === 1) {
            getList(true);
            setImgPre(0);
        }
    }, [detail]);
    const [settingOpen, setSettingOpen] = useState(false);
    const [steptitOpen, setSteotitOpen] = useState(false);
    const [stepTitData, setStepTitData] = useState<any>(null);
    const [stepIndex, setStepIndex] = useState(-1);
    //全局变量
    const [advancedModal, setAdvancedModal] = useState(false);
    const [allVariable, setAllVariable] = useState<any>(null);
    useEffect(() => {
        if (imageStylePre) {
            getList(true, false, true);
        }
    }, [imageStylePre]);
    return (
        <>
            <div className="relative h-full">
                <Tooltip title={!leftWidth ? '展开' : '收缩'}>
                    <Button
                        style={{
                            transform: leftWidth ? 'rotate(180deg)' : 'rotate(0deg)'
                        }}
                        className={`absolute top-4 right-[-10px] z-[1000] duration-700`}
                        onClick={() => setWidth && setWidth()}
                        size="small"
                        shape="circle"
                    >
                        <RightOutlined />
                    </Button>
                </Tooltip>
                {isMyApp && (
                    <div className="text-[22px] whitespace-nowrap mx-2 mb-4 pt-4 mr-4">{appData?.configuration?.appInformation?.name}</div>
                )}
                {detailShow && !detail && (
                    <div className="flex gap-2 justify-between items-center mx-2 mb-4 pt-4 mr-4">
                        <div className="text-[22px] whitespace-nowrap">{appData?.configuration?.appInformation?.name}</div>
                        <div>
                            {!detail && (
                                <Button
                                    loading={createAppStatus}
                                    onClick={async () => {
                                        setCreateAppStatus(true);
                                        const result = await createSameApp({
                                            appMarketUid: searchParams.get('appUid'),
                                            planUid: searchParams.get('uid')
                                        });
                                        navigate('/createApp?uid=' + result);
                                        setCreateAppStatus(false);
                                    }}
                                    type="primary"
                                    size="small"
                                    className="mr-1"
                                >
                                    创作同款应用
                                </Button>
                            )}
                            执行状态：{getStatus1(appData?.status)}
                            <div className="inline-block whitespace-nowrap">
                                <Popconfirm
                                    title="更新提示"
                                    description={
                                        <div className="ml-[-24px]">
                                            <Tabs
                                                activeKey={updataTip}
                                                onChange={(e) => setUpdataTip(e)}
                                                items={[
                                                    {
                                                        key: '0',
                                                        label: '更新应用',
                                                        children: (
                                                            <div className="w-[240px] mb-4">
                                                                <div>当前应用最新版本为：{version}</div>
                                                                <div>你使用的应用版本为：{appData?.version}</div>
                                                                <div>是否需要更新版本，获得最佳创作效果</div>
                                                            </div>
                                                        )
                                                    },
                                                    {
                                                        key: '1',
                                                        label: '初始化应用',
                                                        children: (
                                                            <div className="w-[240px] mb-4">
                                                                是否需要初始化为最新的应用配置。
                                                                <br />
                                                                <span className="text-[#ff4d4f]">注意:</span>
                                                                会覆盖所有已修改的应用配置，请自行备份相关内容
                                                            </div>
                                                        )
                                                    }
                                                ]}
                                            ></Tabs>
                                        </div>
                                    }
                                    okButtonProps={{
                                        disabled: (appData?.version ? appData?.version : 0) === version && updataTip === '0'
                                    }}
                                    onConfirm={() => upDateVersion(updataTip)}
                                    okText="更新"
                                    cancelText="取消"
                                >
                                    <Badge count={(appData?.version ? appData?.version : 0) !== version ? 1 : 0} dot>
                                        <span className="p-2 rounded-md cursor-pointer hover:shadow-md">
                                            版本号： <span className="font-blod">{appData?.version || 0}</span>
                                        </span>
                                    </Badge>
                                </Popconfirm>
                            </div>
                        </div>
                    </div>
                )}
                <div
                    style={{
                        height: detailShow
                            ? getTenant() === ENUM_TENANT.AI
                                ? 'calc(100% - 118px)'
                                : 'calc(100% - 68px)'
                            : 'calc(100% - 14px)',
                        scrollbarGutter: 'stable'
                    }}
                    className=" box-border overflow-y-auto pb-[72px] pr-1 mr-[-4px]"
                >
                    <Tabs activeKey={tabKey} onChange={(key) => setTabKey(key)}>
                        {(appData?.configuration?.appInformation?.workflowConfig?.steps?.find(
                            (item: any) => item?.flowStep?.handler === 'MaterialActionHandler'
                        ) ||
                            appData?.executeParam?.appInformation?.workflowConfig?.steps?.find(
                                (item: any) => item?.flowStep?.handler === 'MaterialActionHandler'
                            )) && (
                            <Tabs.TabPane key={'1'} tab="素材上传">
                                <div className="flex justify-between items-center mb-2">
                                    <div>
                                        <InfoCircleOutlined />
                                        <span className="text-sm ml-1 text-stone-600">可上传自己的图片和内容等，进行笔记生成</span>
                                    </div>
                                    {/* <IconButton size="small">
                                        <SettingOutlined  />
                                    </IconButton> */}
                                </div>
                                <div>
                                    {materialStatus}
                                    {materialStatus === 'picture' ? (
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
                                                            <PlusOutlined />
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
                                                        detail={detail}
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
                                                        icon={<ZoomInOutlined />}
                                                    ></Button>
                                                </div>
                                            </div>
                                            <Table
                                                pagination={{
                                                    defaultPageSize: 20,
                                                    pageSizeOptions: [20, 50, 100, 300, 500],
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
                            <div className="flex justify-between items-center mb-2">
                                <div>
                                    <InfoCircleOutlined />
                                    <span className="text-sm ml-1 text-stone-600">配置 AI生成规则，灵活定制生成的内容</span>
                                </div>
                                {/* {detail && (
                                    <Tooltip title="流程配置">
                                        <Button
                                            icon={<SettingOutlined  />}
                                            shape="circle"
                                            size="small"
                                            type="primary"
                                            onClick={() => setSettingOpen(true)}
                                        />
                                    </Tooltip>
                                )} */}
                            </div>

                            {generateList?.map((item: any, index: number) => (
                                <div key={index}>
                                    <Accordion defaultExpanded={index === 0} className="before:border-none !m-0">
                                        <AccordionSummary
                                            className="border-b border-solid border-black/20 p-0 !min-h-[0]"
                                            sx={{
                                                '& .Mui-expanded': {
                                                    my: '12px !important'
                                                },
                                                '& .Mui-expanded .aaa': {
                                                    transition: 'transform 0.4s',
                                                    transform: 'rotate(0deg)'
                                                }
                                            }}
                                        >
                                            <div className="w-full flex items-center">
                                                <ExpandMore className="aaa -rotate-90" />
                                                {item.name}
                                            </div>
                                        </AccordionSummary>
                                        <AccordionDetails>
                                            <div key={item.field}>
                                                <div className="text-xs text-black/50">{item?.description}</div>
                                                {item?.flowStep?.handler !== 'VariableActionHandler' ? (
                                                    item?.variable?.variables?.map((el: any, i: number) => (
                                                        <div key={el.field}>
                                                            {el?.isShow && (
                                                                <MarketForm
                                                                    key={el.value}
                                                                    item={el}
                                                                    materialType={''}
                                                                    details={
                                                                        appData?.configuration?.appInformation ||
                                                                        appData?.executeParam?.appInformation
                                                                    }
                                                                    materialList={
                                                                        item?.variable?.variables?.find(
                                                                            (item: any) => item?.field === 'MATERIAL_TYPE'
                                                                        )?.options || []
                                                                    }
                                                                    materialValue={
                                                                        item?.variable?.variables?.find(
                                                                            (item: any) => item?.field === 'MATERIAL_TYPE'
                                                                        )?.value
                                                                    }
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
                                                                    setMaterialType={(e: any) => {
                                                                        if (e) {
                                                                            setMaterialTypes(e);
                                                                            const newList = _.cloneDeep(generRef.current);
                                                                            newList[index].variable.variables.find(
                                                                                (dt: any) => dt.field === 'MATERIAL_TYPE'
                                                                            ).value = e;
                                                                            generRef.current = newList;
                                                                            setGenerateList(generRef.current);
                                                                            newList[index].variable.variables[
                                                                                item.variable.variables?.findIndex(
                                                                                    (item: any) => item.style === 'MATERIAL'
                                                                                )
                                                                            ].value = [];
                                                                            stepRef.current = index;
                                                                            setStep(stepRef.current);
                                                                            setTableDatas(e, index);
                                                                        } else {
                                                                            setMaterialTypes(
                                                                                item?.variable?.variables?.find(
                                                                                    (i: any) => i.field === 'MATERIAL_TYPE'
                                                                                )?.value
                                                                            );
                                                                        }
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
                                                                        setAppDataGen();
                                                                        setAppData(appRef.current);
                                                                    }}
                                                                />
                                                            )}
                                                        </div>
                                                    ))
                                                ) : (
                                                    <Row gutter={10}>
                                                        {item?.variable?.variables?.map((item: any, de: number) => (
                                                            <Col key={item?.value} span={24}>
                                                                <Forms
                                                                    item={item}
                                                                    index={de}
                                                                    changeValue={(data: any) => {
                                                                        const newList = _.cloneDeep(generRef.current);
                                                                        newList[index].variable.variables[de].value = data.value;
                                                                        generRef.current = newList;
                                                                        setGenerateList(generRef.current);
                                                                        setAppDataGen();
                                                                    }}
                                                                    flag={false}
                                                                />
                                                            </Col>
                                                        ))}
                                                    </Row>
                                                    // <Tabs defaultActiveKey="1">
                                                    //     {/* <Tabs.TabPane tab="变量编辑" key="1"> */}

                                                    //     {/* </Tabs.TabPane> */}
                                                    //     {/* <Tabs.TabPane tab="变量列表" key="2">
                                                    //         <CreateVariable
                                                    //             rows={item?.variable?.variables}
                                                    //             setRows={(data: any[]) => {
                                                    //                 const newList = _.cloneDeep(generRef.current);
                                                    //                 newList[index].variable.variables = data;
                                                    //                 generRef.current = newList;
                                                    //                 setGenerateList(generRef.current);
                                                    //                 setAppDataGen();
                                                    //             }}
                                                    //         />
                                                    //     </Tabs.TabPane> */}
                                                    // {/* </Tabs> */}
                                                )}
                                            </div>
                                        </AccordionDetails>
                                    </Accordion>
                                </div>
                            ))}
                        </Tabs.TabPane>
                        {appData?.configuration?.appInformation?.workflowConfig?.steps?.find(
                            (item: any) => item?.flowStep?.handler === 'PosterActionHandler'
                        ) && (
                            <Tabs.TabPane key={'3'} tab="图片生成">
                                {detail ? (
                                    <AddStyle
                                        selectImgLoading={selectImgLoading}
                                        materialStatus={materialStatus}
                                        saveTemplate={saveTemplate}
                                        details={appData?.configuration?.appInformation}
                                        hasAddStyle={detail || !detailShow ? false : true}
                                        setImageVar={setImageVar}
                                        appUid={appData?.appUid}
                                        ref={imageRef}
                                        record={imageMater}
                                        getList={() => getList(true)}
                                        materialType={materialType}
                                    />
                                ) : (
                                    <AddStyleApp
                                        selectImgLoading={selectImgLoading}
                                        allData={appData}
                                        materialStatus={materialStatus}
                                        details={appData?.configuration?.appInformation}
                                        hasAddStyle={detail || !detailShow ? false : true}
                                        setImageVar={setImageVar}
                                        getList={() => getList(true)}
                                        appUid={appData?.appUid}
                                        ref={imageRef}
                                        record={imageMater}
                                        materialType={materialType}
                                    />
                                )}
                            </Tabs.TabPane>
                        )}
                        {appData?.executeParam?.appInformation?.workflowConfig?.steps?.find(
                            (item: any) => item?.flowStep?.handler === 'MaterialActionHandler'
                        ) && (
                            <Tabs.TabPane key={'3'} tab="图片生成">
                                <div className="flex items-center mb-2">
                                    <Tooltip title="生成图片时会按照风格模板的顺序去使用">
                                        <InfoCircleOutlined className="cursor-pointer" />
                                    </Tooltip>
                                    <span className="text-sm ml-1 text-stone-600">
                                        配置笔记图片生成的风格模版，支持不同风格模版组合生成
                                    </span>
                                </div>
                                <AddStyle
                                    canAddCustomStyle={false}
                                    details={appData?.configuration?.appInformation}
                                    materialStatus={materialStatus}
                                    // hasAddStyle={true}
                                    hasAddStyle={false}
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
                <div className="z-[1000] absolute bottom-0 flex gap-2 bg-[#fff] py-4 w-[calc(100%-8px)]">
                    {detailShow && (
                        <>
                            <Button
                                className="w-full"
                                icon={<SaveOutlined />}
                                onClick={() => {
                                    if (!detail) {
                                        handleSaveClick(false);
                                    } else {
                                        // 我的应用
                                        setExeState(false);
                                        const arr = headerSaveAll();
                                        setDetail &&
                                            setDetail({
                                                ...detail,
                                                workflowConfig: {
                                                    steps: arr?.filter((item: any) => item)
                                                }
                                            });
                                    }
                                }}
                                type="primary"
                            >
                                保存配置
                            </Button>
                            <Button
                                className="w-full"
                                type="primary"
                                onClick={() => {
                                    if (!detail) {
                                        handleSaveClick(true);
                                    } else {
                                        gessaveApp();
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
                    src={previewImage + '?x-oss-process=image/resize,w_100/quality,q_80'}
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
                    detail={detail}
                    columns={columns}
                    tableData={tableData}
                    setTitle={setTitle}
                    setEditOpen={setEditOpen}
                    changeTableValue={(data) => {
                        tableRef.current = data;
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
                    setMaterialTypeStatus={setMaterialTypeStatus}
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
                    getList={() => getList(true)}
                    materialList={materialList}
                    allData={appData}
                    details={appData?.configuration?.appInformation}
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
                    getList={() => getList(true)}
                    materialList={materialList}
                    allData={appData}
                    details={appData?.configuration?.appInformation}
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
            {botOpen && (
                <PermissionUpgradeModal open={botOpen} handleClose={() => setBotOpen(false)} title={`权益不足，去升级`} from={''} />
            )}
            <Image
                className="hidden"
                width={400}
                preview={{
                    visible: previewOpen,
                    onVisibleChange: (visible) => {
                        setPreviewOpen(visible);
                    }
                }}
                src={previewUrl}
            />
            {isModalOpen && (
                <PicImagePick
                    getList={() => {
                        if (detail) {
                            setImgPre(1);
                            getAppList && getAppList();
                        } else {
                            getList(true);
                        }
                    }}
                    materialList={materialList}
                    allData={appData}
                    details={appData?.configuration?.appInformation}
                    isModalOpen={isModalOpen}
                    setIsModalOpen={setIsModalOpen}
                    setSelectImg={setSelectImg}
                    columns={columns}
                    values={values}
                />
            )}
            {settingOpen && (
                <SettingModal
                    settingOpen={settingOpen}
                    setSettingOpen={setSettingOpen}
                    saveStep={() => {
                        setExeState(false);
                        const arr = headerSaveAll();
                        setDetail &&
                            setDetail({
                                ...detail,
                                workflowConfig: {
                                    steps: arr?.filter((item: any) => item)
                                }
                            });
                        setSettingOpen(false);
                    }}
                    appData={appData}
                    stepMove={stepMove}
                    stepOpen={stepOpen}
                    setStepOpen={setStepOpen}
                    materialStatus={materialStatus}
                    advanced={(item, index) => {
                        setAllVariable(item);
                        setStepIndex(index - 1);
                        setAdvancedModal(true);
                    }}
                    advanceds={(item, index) => {
                        setStepIndex(index);
                        setStepTitData({
                            name: item?.name,
                            description: item?.description,
                            flowStep: item?.flowStep
                        });
                        setSteotitOpen(true);
                    }}
                    addStep={addStep}
                    copyStep={copyStep}
                    delStep={delStep}
                    setEditOpens={setEditOpens}
                    setTitles={setTitles}
                    stepMaterial={stepMaterial}
                    setMaterialTypes={setMaterialTypes}
                    materialTypeStatus={materialTypeStatus}
                    setStep={(index) => {
                        stepRef.current = index - 1;
                        setStep(stepRef.current);
                    }}
                    changeSwitch={() => {
                        if (materialStatus === 'default') {
                            setFileList(
                                tableRef.current?.map((item) => ({
                                    uid: uuidv4(),
                                    thumbUrl: item[columns[1]?.dataIndex],
                                    response: {
                                        data: {
                                            url: item[columns[1]?.dataIndex]
                                        }
                                    }
                                }))
                            );
                        } else {
                            tableRef.current = fileList?.map((item) => ({
                                [columns[1].dataIndex]: item?.response?.data?.url
                            }));
                            setTableData(tableRef.current);
                        }
                        appRef.current.configuration.appInformation.workflowConfig.steps
                            .find((item: any) => item.flowStep.handler === 'MaterialActionHandler')
                            .variable.variables.find((el: any) => el.field === 'BUSINESS_TYPE').value =
                            materialStatus === 'default' ? 'picture' : 'default';
                        setAppData(appRef.current);
                        generRef.current = appRef.current?.configuration?.appInformation?.workflowConfig?.steps?.filter((item: any) => {
                            return item?.flowStep?.handler !== 'MaterialActionHandler' && item?.flowStep?.handler !== 'PosterActionHandler';
                        });
                        setGenerateList(generRef.current);
                    }}
                    changeForm={(e: any, item: any, index: number, i: number) => {
                        const newList = _.cloneDeep(generRef.current);
                        const type = e.name === 'MATERIAL_TYPE' ? e.value : undefined;
                        const code = item?.flowStep?.handler;
                        newList[index - 1].variable.variables[i].value = e.value;
                        if (type && item.variable.variables?.find((item: any) => item.style === 'MATERIAL')) {
                            newList[index - 1].variable.variables[
                                item.variable.variables?.findIndex((item: any) => item.style === 'MATERIAL')
                            ].value = [];
                            stepRef.current = index - 1;
                            setStep(stepRef.current);
                            setTableDatas(type, index - 1);
                        }
                        if (code === 'CustomActionHandler' && e.name === 'GENERATE_MODE') {
                            const num = item.variable.variables?.findIndex((item: any) => item.field === 'REQUIREMENT');
                            const num1 = item.variable.variables?.findIndex((item: any) => item.style === 'MATERIAL');
                            if (e.value === 'RANDOM') {
                                newList[index - 1].variable.variables[num].isShow = false;
                                newList[index - 1].variable.variables[num1].isShow = true;
                            } else if (e.value === 'AI_PARODY') {
                                newList[index - 1].variable.variables[num].isShow = true;
                                newList[index - 1].variable.variables[num1].isShow = true;
                            } else {
                                newList[index - 1].variable.variables[num1].isShow = false;
                                newList[index - 1].variable.variables[num].isShow = true;
                            }
                        }
                        generRef.current = newList;
                        setGenerateList(generRef.current);
                        setAppDataGen();
                    }}
                    stepLists={stepLists}
                    changeForms={(data, index, de) => {
                        const newList = _.cloneDeep(generRef.current);
                        newList[index - 1].variable.variables[de].value = data.value;
                        generRef.current = newList;
                        setGenerateList(generRef.current);
                        setAppDataGen();
                    }}
                />
            )}
            {steptitOpen && (
                <EditStepTitle
                    steptitOpen={steptitOpen}
                    setSteotitOpen={setSteotitOpen}
                    setData={(data: any) => {
                        const newList = _.cloneDeep(generRef.current);
                        const newLists = _.cloneDeep(appRef.current);
                        const { name, description, variables } = data;
                        newList[stepIndex - 1] = {
                            ...newList[stepIndex - 1],
                            name,
                            description,
                            field: name
                        };
                        newList[stepIndex - 1].flowStep.variable.variables = variables;
                        newLists.configuration.appInformation.workflowConfig.steps[stepIndex] = {
                            ...newLists.configuration?.appInformation?.workflowConfig?.steps[stepIndex],
                            name,
                            description,
                            field: name
                        };
                        newLists.configuration.appInformation.workflowConfig.steps[stepIndex].flowStep.variable.variables = variables;
                        generRef.current = newList;
                        appRef.current = newLists;
                        setAppData(appRef.current);
                        setGenerateList(generRef.current);
                    }}
                    stepTitData={stepTitData}
                />
            )}
            {advancedModal && (
                <Modal width={'60%'} title="高级设置" open={advancedModal} footer={false} onCancel={() => setAdvancedModal(false)}>
                    <CreateVariable
                        rows={allVariable?.variable?.variables}
                        setRows={(data: any[]) => {
                            const newTable = data?.map((item) => ({
                                ...item,
                                isShow: false
                            }));
                            const newData = _.cloneDeep(allVariable);
                            newData.variable.variables = newTable;
                            setAllVariable(newData);
                            const newList = _.cloneDeep(generRef.current);
                            newList[stepIndex].variable.variables = newTable;
                            generRef.current = newList;
                            setGenerateList(generRef.current);
                            setAppDataGen();
                            setAdvancedModal(false);
                        }}
                    />
                </Modal>
            )}
        </>
    );
};

export default Lefts;
