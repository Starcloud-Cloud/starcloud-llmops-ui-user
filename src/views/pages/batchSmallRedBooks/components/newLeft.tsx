import { TextField, FormControl, InputLabel, Select, MenuItem, Chip, FormHelperText, Autocomplete } from '@mui/material';
import { getTenant, ENUM_TENANT } from 'utils/permission';
import { Upload, UploadProps, Button, Table, InputNumber, Radio, Modal, Image, Popconfirm, Form, Progress, Tabs, Collapse } from 'antd';
import { PlusOutlined, SaveOutlined, ZoomInOutlined } from '@ant-design/icons';
import type { RadioChangeEvent } from 'antd';
import { getAccessToken } from 'utils/auth';
import _ from 'lodash-es';
import { useState, useEffect, useRef, memo } from 'react';
import { useNavigate } from 'react-router-dom';
import Forms from '../../smallRedBook/components/form';
import { schemeList, materialTemplate, metadata, materialImport, materialExport, materialResilt } from 'api/redBook/batchIndex';
import { dispatch } from 'store';
import { openSnackbar } from 'store/slices/snackbar';
import FormModal from './formModal';
import moke from './moke.json';
import MarketForm from '../../../template/components/marketForm';
const Lefts = ({
    detailData,
    setDetailData,
    imageList,
    setImageList,
    schemesList,
    setSchemeLists,
    exedisabled,
    handleSave
}: {
    detailData: any; //基础数据
    setDetailData: (data: any) => void; ///更改基础数据
    imageList: any[]; //上传图片的列表
    setImageList: (data: any[]) => void;
    schemesList: any[]; //变量列表
    setSchemeLists: (data: any) => void; //更改变量列表
    exedisabled: boolean; //保存按钮是否禁用
    handleSave: (data: any) => void; //保存
}) => {
    //上传素材
    const [materialType, setMaterialType] = useState('');
    //上传图片
    const [open, setOpen] = useState(false);
    const [previewImage, setpreviewImage] = useState('');
    const props: UploadProps = {
        name: 'image',
        multiple: true,
        listType: 'picture-card',
        fileList: imageList,
        action: `${process.env.REACT_APP_BASE_URL}${process.env.REACT_APP_API_URL}/llm/creative/plan/uploadImage`,
        headers: {
            Authorization: 'Bearer ' + getAccessToken()
        },
        maxCount: 500,
        onChange(info) {
            setImageList(info.fileList);
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
    //保存
    const handleSaveClick = (flag: boolean) => {
        if (schemesList?.length > 0 && schemesList?.some((item: any) => !item.value && !item.defaultValue)) {
            dispatch(
                openSnackbar({
                    open: true,
                    message: '方案参数全部必填',
                    variant: 'alert',
                    alert: {
                        color: 'error'
                    },
                    anchorOrigin: { vertical: 'top', horizontal: 'center' },
                    transition: 'SlideDown',
                    close: false
                })
            );
            return false;
        }
        const newList = _.cloneDeep(schemesList);
        newList.forEach((item: any) => {
            if (item.defaultValue && !item.value) {
                item.value = item.defaultValue;
            }
        });
        setSchemeLists(newList);
        const newData = _.cloneDeep(detailData);
        newData.schemeUid = detailData?.targetKeys;
        const pictureList = imageList
            ?.map((item: any) => item?.response?.data?.url)
            ?.filter((el: any) => el)
            ?.map((item: any) => {
                return {
                    pictureUrl: item,
                    type: 'picture'
                };
            });
        handleSave({ flag, newData, tableData: materialType === 'picture' ? pictureList : tableData });
    };

    //获取表头数据
    const getTableHeader = async () => {
        // const res = await metadata();
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
        const newList = [...tableRef.current];
        if (title === '编辑') {
            newList.splice(rowIndex, 1, result);
            tableRef.current = newList;
            setTableData(tableRef.current);
        } else {
            newList.unshift(result);
            tableRef.current = newList;
            setTableData(tableRef.current);
        }
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
    //上传表格数据
    useEffect(() => {
        if (detailData?.creativeMaterialList) {
            tableRef.current = detailData?.creativeMaterialList;
            setTableData(tableRef.current);
        }
    }, [JSON.stringify(detailData?.creativeMaterialList)]);
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

    const [imageMater, setImagMater] = useState<any>(null); //图片上传

    const getList = () => {
        const newList: any = _.cloneDeep(moke);
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
        setMaterialType(
            newList?.workflowConfig?.steps
                ?.find((item: any) => item?.flowStep?.handler === 'MaterialActionHandler')
                ?.variable?.variables?.find((item: any) => item.field === 'MATERIAL_TYPE')?.value
        );
        generRef.current = newList?.workflowConfig?.steps?.filter(
            (item: any) => item?.flowStep?.handler !== 'MaterialActionHandler' && item?.flowStep?.handler !== 'PosterActionHandler'
        );
        setGenerateList(generRef.current);
        getStepMater();
        setImagMater(newList?.workflowConfig?.steps?.find((item: any) => item?.flowStep?.handler === 'PosterActionHandler'));
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
        console.log(i);
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
        if (title === '编辑') {
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
    return (
        <>
            <div
                className=" pt-[20px]  overflow-y-auto pb-[72px]"
                style={{ height: getTenant() === ENUM_TENANT.AI ? 'calc(100vh - 210px)' : 'calc(100vh - 130px)' }}
            >
                <Tabs
                    defaultActiveKey="1"
                    items={[
                        {
                            label: '素材上传',
                            key: '1',
                            children: (
                                <div>
                                    {materialType === 'picture' ? (
                                        <>
                                            <div className="text-[12px] font-[500] flex items-center justify-between">
                                                <div>图片总量：{imageList?.length}</div>
                                                {imageList?.length > 0 && (
                                                    <Button
                                                        danger
                                                        onClick={() => {
                                                            setImageList([]);
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
                                                rowKey={(record, index) => String(index)}
                                                loading={tableLoading}
                                                size="small"
                                                virtual
                                                columns={columns}
                                                dataSource={tableData}
                                            />
                                        </>
                                    )}
                                </div>
                            )
                        },
                        {
                            label: '笔记生成',
                            key: '2',
                            children: (
                                <Collapse
                                    accordion
                                    items={generateList?.map((item: any, index: number) => ({
                                        key: index.toString(),
                                        label: item.name,
                                        children: (
                                            <div key={item.field}>
                                                {item?.variable?.variables?.map(
                                                    (el: any, i: number) =>
                                                        el?.isShow && (
                                                            <MarketForm
                                                                key={el.field}
                                                                item={el}
                                                                materialType={''}
                                                                stepCode={
                                                                    el?.field === 'REQUIREMENT'
                                                                        ? item.variable?.variables?.find(
                                                                              (i: any) => i.field === 'GENERATE_MODE'
                                                                          )?.value
                                                                        : ''
                                                                }
                                                                handlerCode={el?.flowStep?.handler}
                                                                history={false}
                                                                setEditOpen={setEditOpen}
                                                                setTitle={setTitle}
                                                                setStep={() => {
                                                                    setStep(index);
                                                                }}
                                                                columns={stepMaterial[index]}
                                                                setMaterialType={() => {
                                                                    setMaterialType(
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
                                                        )
                                                )}
                                            </div>
                                        )
                                    }))}
                                />
                            )
                        },
                        {
                            label: '图片生成',
                            key: '3',
                            children: 222
                        },
                        {
                            label: '批量生成参数',
                            key: '4',
                            children: 333
                        }
                    ]}
                />
            </div>
            <div className="z-[1000] absolute bottom-0 flex gap-2 bg-[#fff] p-[20px] pb-0 w-[100%]">
                <Button className="w-full" icon={<SaveOutlined rev={undefined} />} onClick={() => handleSaveClick(false)} type="primary">
                    保存配置
                </Button>
                <Button disabled={exedisabled} className="w-full" type="primary" onClick={() => handleSaveClick(true)}>
                    保存并开始生成
                </Button>
            </div>
            <Modal open={open} footer={null} onCancel={() => setOpen(false)}>
                <Image className="min-w-[472px]" preview={false} alt="example" src={previewImage} />
            </Modal>
            <Modal maskClosable={false} width={'70%'} open={zoomOpen} footer={null} onCancel={() => setZoomOpen(false)}>
                <div className="flex justify-end my-[20px]">
                    <Button
                        type="primary"
                        onClick={() => {
                            setTitle('新增');
                            setEditOpen(true);
                        }}
                    >
                        新增
                    </Button>
                </div>
                <Table
                    rowKey={(record, index) => String(index)}
                    loading={tableLoading}
                    size="small"
                    virtual
                    columns={columns}
                    dataSource={tableData}
                />
            </Modal>
            <Modal width={400} title="批量导入" open={uploadOpen} footer={null} onCancel={() => setUploadOpen(false)}>
                <p>
                    支持以 XLS 文件形式批量导入页面元素，导入文件将自动刷新列表页。
                    <span className="text-[#673ab7] cursor-pointer" onClick={handleDownLoad}>
                        下载导入 XLS 模板
                    </span>
                </p>
                <div className="flex justify-center mt-[20px]">
                    <div>
                        <Upload {...props1}>
                            <Button type="primary">上传 ZIP</Button>
                        </Upload>
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
                    sourceList={[]}
                />
            )}
        </>
    );
};
const LeftMemo = (prevProps: any, nextProps: any) => {
    return (
        JSON.stringify(prevProps?.detailData) === JSON.stringify(nextProps?.detailData) &&
        JSON.stringify(prevProps?.imageList) === JSON.stringify(nextProps?.imageList) &&
        JSON.stringify(prevProps?.schemesList) === JSON.stringify(nextProps?.schemesList) &&
        JSON.stringify(prevProps?.exedisabled) === JSON.stringify(nextProps?.exedisabled)
    );
};
export default memo(Lefts, LeftMemo);
