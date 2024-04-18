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
    Col
} from 'antd';
import { FormControl, Autocomplete, Chip, TextField } from '@mui/material';
import { PlusOutlined, SaveOutlined, ZoomInOutlined } from '@ant-design/icons';
import { getAccessToken } from 'utils/auth';
import _ from 'lodash-es';
import { useState, useEffect, useRef, memo } from 'react';
import { materialTemplate, materialImport, materialExport, materialResilt, getPlan, planModify } from 'api/redBook/batchIndex';
import FormModal from './formModal';
import MarketForm from '../../../template/components/marketForm';
import CreateVariable from '../../copywriting/components/spliceCmponents/variable';
import LeftModalAdd from './leftModalAdd';
import AddStyle from 'ui-component/AddStyle';
import { useLocation } from 'react-router-dom';
import { v4 as uuidv4 } from 'uuid';
import Forms from '../../smallRedBook/components/form';
const Lefts = ({
    detailShow = true,
    data,
    saveLoading,
    setCollData,
    newSave,
    setPlanUid
}: {
    detailShow?: boolean;
    data?: any;
    saveLoading?: boolean;
    setCollData?: (data: any) => void;
    newSave: (data: any) => void;
    setPlanUid: (data: any) => void;
}) => {
    const location = useLocation();
    const searchParams = new URLSearchParams(location.search);
    //存储的数据
    const appRef = useRef<any>(null);
    const [appData, setAppData] = useState<any>(null);
    const getStatus = (status: any) => {
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
    //上传素材弹框
    const [uploadOpen, setUploadOpen] = useState(false);
    const [parseUid, setParseUid] = useState(''); //上传之后获取的 uid
    //获取表头数据
    const getTableHeader = async () => {
        const result = await materialTemplate(materialType);
        const newList = result?.fieldDefine?.map((item: any) => {
            return {
                title: item.desc,
                align: 'center',
                width: 200,
                dataIndex: item.fieldName,
                render: (_: any, row: any) => (
                    <div className="flex justify-center items-center gap-2">
                        {item.type === 'image' ? (
                            <Image width={50} height={50} preview={false} src={row[item.fieldName]} />
                        ) : (
                            <div className="break-all line-clamp-4">{row[item.fieldName]}</div>
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
                width: 100,
                fixed: 'right',
                render: (_: any, row: any, index: number) => (
                    <div className="flex justify-center">
                        <Button onClick={() => handleEdit(row, index)} size="small" type="link">
                            编辑
                        </Button>
                        <Popconfirm
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
    };
    //下载模板
    const handleDownLoad = async () => {
        const res = await materialExport(materialType);
        const downloadLink = document.createElement('a');
        downloadLink.href = window.URL.createObjectURL(res);
        downloadLink.download = materialType + '.zip';
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
                    tableRef.current = result?.materialDTOList;
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
        const newList = _.cloneDeep(tableRef.current);
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
    useEffect(() => {
        if (materialType) {
            getTableHeader();
        }
    }, [materialType]);
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

    const getList = async () => {
        let result;
        let newList: any;
        if (data) {
            result = _.cloneDeep(data);
            newList = _.cloneDeep(result?.executeParam?.appInformation);
        } else {
            result = await getPlan(searchParams.get('appUid'));
            newList = _.cloneDeep(result?.configuration?.appInformation);
            const collData: any = result?.configuration?.appInformation?.example;
            if (collData) {
                setCollData && setCollData(collData.split(','));
            }
        }
        setTotalCount(result?.totalCount);
        setPlanUid(result?.uid);
        appRef.current = result;
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
        const newMater = newList?.workflowConfig?.steps
            ?.find((item: any) => item?.flowStep?.handler === 'MaterialActionHandler')
            ?.variable?.variables?.find((item: any) => item.field === 'MATERIAL_TYPE')?.value;

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
                setFileList(
                    newList?.workflowConfig?.steps
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
                        }))
                );
            }
        } else {
            if (data) {
                tableRef.current = newList?.workflowConfig?.steps
                    ?.find((item: any) => item?.flowStep?.handler === 'MaterialActionHandler')
                    ?.variable?.variables?.find((item: any) => item.style === 'MATERIAL')?.value;
                setTableData(tableRef.current);
            } else {
                tableRef.current = result?.configuration?.materialList;
                setTableData(tableRef.current);
            }
        }

        generRef.current = newList?.workflowConfig?.steps?.filter(
            (item: any) => item?.flowStep?.handler !== 'MaterialActionHandler' && item?.flowStep?.handler !== 'PosterActionHandler'
        );
        setGenerateList(generRef.current);
        getStepMater();
        const newImage = newList?.workflowConfig?.steps?.find((item: any) => item?.flowStep?.handler === 'PosterActionHandler');
        newImage?.flowStep?.variable?.variables?.forEach((item: any) => {
            if (item.field === 'SYSTEM_POSTER_STYLE_CONFIG' && item.value) {
                item.value = JSON.parse(item.value);
            }
        });
        if (result?.configuration?.imageStyleList?.length > 0) {
            newImage.variable.variables.find((item: any) => item.field === 'POSTER_STYLE_CONFIG').value =
                result?.configuration?.imageStyleList;
        }
        setImagMater(newImage);
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
        const newList = generRef.current.map((item: any) => {
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
            width: 200,
            dataIndex: item.fieldName,
            render: (_: any, row: any) => (
                <div className="flex justify-center items-center flex-wrap break-all gap-2">
                    <div className="line-clamp-5">
                        {item.type === 'image' ? (
                            <Image width={50} height={50} preview={false} src={row[item.fieldName]} />
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
            generRef.current[i].variable.variables[
                generRef.current[i].variable.variables?.findIndex((item: any) => item.style === 'MATERIAL')
            ].value;
        newList.splice(index, 1);
        generRef.current.current = newValue;
        setGenerateList(generRef.current.current);
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
    const [totalCount, setTotalCount] = useState<number>(5);
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
            const data = _.cloneDeep(appData);
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
                    : appData.executeParam.appInformation.workflowConfig.steps?.find(
                          (item: any) => item?.flowStep?.handler === 'PosterActionHandler'
                      )
            ];
            newSave(data);
        } else {
            const styleData = imageRef.current?.record?.variable?.variables?.find(
                (item: any) => item.field === 'POSTER_STYLE_CONFIG'
            )?.value;
            const data = {
                uid: appData?.uid,
                totalCount,
                configuration: {
                    imageStyleList: styleData
                        ? JSON.parse(styleData)?.map((item: any) => ({
                              ...item,
                              id: undefined,
                              code: item.id
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
                        ...appData.configuration.appInformation,
                        workflowConfig: {
                            steps: [
                                ...appData.configuration.appInformation.workflowConfig.steps?.filter(
                                    (item: any) => item?.flowStep?.handler === 'MaterialActionHandler'
                                ),
                                ...newList,
                                ...appData.configuration.appInformation.workflowConfig.steps?.filter(
                                    (item: any) => item?.flowStep?.handler === 'PosterActionHandler'
                                )
                            ]
                        }
                    }
                }
            };
            const result = await planModify(data);
            if (flag) {
                newSave(result);
            }
        }
    };
    const [tabKey, setTabKey] = useState('1');
    const [page, setPage] = useState(1);
    return (
        <>
            <div className="relative">
                {detailShow && (
                    <div className="flex justify-between items-end mb-4">
                        <div className="text-[22px]">{appData?.configuration?.appInformation?.name}</div>
                        <div>
                            状态：{getStatus(appData?.status)}{' '}
                            <Popconfirm
                                title="更新提示"
                                description={
                                    <div>
                                        <div>当前应用最新版本为：2</div>
                                        <div>你使用的应用版本为：1</div>
                                        <div>是否需要更新版本，获得最佳创作效果</div>
                                    </div>
                                }
                                onConfirm={() => {}}
                                okText="更新"
                                cancelText="取消"
                            >
                                <span className="p-2 rounded-md cursor-pointer hover:shadow-md">
                                    版本号： <span className="font-blod">{appData?.version}</span>
                                </span>
                            </Popconfirm>
                        </div>
                    </div>
                )}
                <div
                    style={{
                        height: detailShow ? (getTenant() === ENUM_TENANT.AI ? 'calc(100vh - 370px)' : 'calc(100vh - 181px)') : '80vh'
                    }}
                    className="overflow-y-auto pb-[72px]"
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
                                                    <Button size="small" type="primary" onClick={() => setUploadOpen(true)}>
                                                        批量导入
                                                    </Button>
                                                    {/* <Button size="small" type="primary">
                                            选择已有素材
                                        </Button> */}
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
                                                    return String(index);
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
                                items={generateList?.map((item: any, index: number) => ({
                                    key: index.toString(),
                                    label: item.name,
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
                                                                appUid={appData?.appUid}
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
                                                                            newList[index].variable.variables[num].value = '';
                                                                            newList[index].variable.variables[num].isShow = false;
                                                                            newList[index].variable.variables[num1].isShow = true;
                                                                        } else if (e.value === 'AI_PARODY') {
                                                                            newList[index].variable.variables[num].isShow = true;
                                                                            newList[index].variable.variables[num1].isShow = true;
                                                                        } else {
                                                                            newList[index].variable.variables[num1].value = [];
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
                                                    <Tabs.TabPane tab="变量列表" key="1">
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
                                                    <Tabs.TabPane tab="变量编辑" key="2">
                                                        <Row gutter={10}>
                                                            {item?.variable?.variables?.map((item: any, de: number) => (
                                                                <Col key={item?.field} span={12}>
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
                                                </Tabs>
                                            )}
                                        </div>
                                    )
                                }))}
                            />
                        </Tabs.TabPane>
                        {appData?.configuration?.appInformation?.workflowConfig?.steps?.find(
                            (item: any) => item?.flowStep?.handler === 'PosterActionHandler'
                        ) && (
                            <Tabs.TabPane key={'3'} tab="图片生成">
                                <AddStyle appUid={appData?.appUid} ref={imageRef} record={imageMater} />
                            </Tabs.TabPane>
                        )}
                        {appData?.executeParam?.appInformation?.workflowConfig?.steps?.find(
                            (item: any) => item?.flowStep?.handler === 'MaterialActionHandler'
                        ) && (
                            <Tabs.TabPane key={'3'} tab="图片生成">
                                <AddStyle appUid={appData?.appUid} ref={imageRef} record={imageMater} mode={2} />
                            </Tabs.TabPane>
                        )}
                        {detailShow && (
                            <Tabs.TabPane key={'4'} tab="批量生成参数">
                                <div>
                                    <div className="relative mt-[16px] max-w-[300px]">
                                        <InputNumber
                                            className="bg-[#f8fafc] w-full"
                                            size="large"
                                            value={totalCount}
                                            onChange={(e: any) => {
                                                setTotalCount(e);
                                            }}
                                            min={1}
                                            max={100}
                                        />
                                        <span className="text-[#697586] block bg-gradient-to-b from-[#fff] to-[#f8fafc] px-[5px] absolute top-[-9px] left-2 text-[12px]">
                                            生成数量
                                        </span>
                                    </div>
                                </div>
                            </Tabs.TabPane>
                        )}
                    </Tabs>
                </div>

                <div className="z-[1000] absolute bottom-0 flex gap-2 bg-[#fff] pt-4 w-[100%]">
                    {detailShow && (
                        <>
                            <Button
                                className="w-full h-[43px]"
                                icon={<SaveOutlined rev={undefined} />}
                                onClick={() => handleSaveClick(false)}
                                type="primary"
                            >
                                保存配置
                            </Button>
                            <Button className="w-full h-[43px]" type="primary" onClick={() => handleSaveClick(true)}>
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
            <Modal open={open} footer={null} onCancel={() => setOpen(false)}>
                <Image className="min-w-[472px]" preview={false} alt="example" src={previewImage} />
            </Modal>
            {zoomOpen && (
                <LeftModalAdd
                    zoomOpen={zoomOpen}
                    setZoomOpen={setZoomOpen}
                    tableLoading={tableLoading}
                    columns={columns}
                    tableData={tableData}
                    setTitle={setTitle}
                    setEditOpen={setEditOpen}
                    setPage={setPage}
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
            {editOpen && (
                <FormModal title={title} editOpen={editOpen} setEditOpen={setEditOpen} columns={columns} form={form} formOk={formOk} />
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
                    sourceList={[
                        { label: '小红书', value: 'SMALL_RED_BOOK' },
                        { label: '其他', value: 'OTHER' }
                    ]}
                />
            )}
        </>
    );
};

export default Lefts;
