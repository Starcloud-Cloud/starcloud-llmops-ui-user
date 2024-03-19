import { TextField, FormControl, InputLabel, Select, MenuItem, Chip, FormHelperText, Autocomplete } from '@mui/material';
import { getTenant, ENUM_TENANT } from 'utils/permission';
import { Upload, UploadProps, Button, Table, InputNumber, Radio, Modal, Image, Popconfirm, Form, Input } from 'antd';
import { PlusOutlined, LoadingOutlined, SaveOutlined, ZoomInOutlined } from '@ant-design/icons';
import type { RadioChangeEvent } from 'antd';
import { getAccessToken } from 'utils/auth';
import _ from 'lodash-es';
import { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import Forms from '../../smallRedBook/components/form';
import axios from 'utils/axios/index';
import { schemeList, materialTemplate, metadata, materialImport, materialResilt } from 'api/redBook/batchIndex';
import { dispatch } from 'store';
import { openSnackbar } from 'store/slices/snackbar';
import FormModal from './formModal';
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
    const navigate = useNavigate();
    const [valueOpen, setValueOpen] = useState(false);
    const [targetKeysOpen, settargetKeysOpen] = useState(false);
    //2.文案模板
    const [mockData, setMockData] = useState<any[]>([]);
    const [preform, setPerform] = useState(1);
    //判断上传的类型
    const [materialType, setMaterialType] = useState('');
    useEffect(() => {
        if (detailData?.targetKeys) {
            changeBasis('tags', mockData.find((value) => value.uid === detailData?.targetKeys)?.tags);
            setSchemeLists(mockData.find((value) => value.uid === detailData?.targetKeys)?.variableList);
            setMaterialType(mockData.find((value) => value.uid === detailData?.targetKeys)?.materialType);
        } else {
            changeBasis('tags', []);
        }
    }, [detailData?.targetKeys]);

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
    //批量上传素材
    const [zoomOpen, setZoomOpen] = useState(false); //下载弹框
    const [downLoadUrl, setDownLoadUrl] = useState(''); //下载的地址
    const [tableLoading, setTableLoading] = useState(false);
    const tableRef = useRef<any[]>([]);
    const [tableData, setTableData] = useState<any[]>([]);
    const [columns, setColumns] = useState<any[]>([]);
    //上传素材弹框
    const [uploadOpen, setUploadOpen] = useState(false);
    const [parseUid, setParseUid] = useState(''); //上传之后获取的 uid
    //更改基础信息
    const changeBasis = (name: string, value: any) => {
        const newData = _.cloneDeep(detailData);
        newData[name] = value;
        setDetailData(newData);
    };
    //保存
    const handleSaveClick = (flag: boolean) => {
        if (!detailData?.name) {
            setValueOpen(true);
            dispatch(
                openSnackbar({
                    open: true,
                    message: '计划名称必填',
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
        if (!detailData?.targetKeys) {
            settargetKeysOpen(true);
            dispatch(
                openSnackbar({
                    open: true,
                    message: '没有选择生成方案',
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
                            row[item.fieldName]
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
        setDownLoadUrl(result?.templateUrl);
    };
    //下载模板
    const handleDownLoad = async () => {
        const res = await axios.download({ url: downLoadUrl });
        const downloadLink = document.createElement('a');
        downloadLink.href = window.URL.createObjectURL(res);
        downloadLink.download = '批量导入模板.xls';
        document.body.appendChild(downloadLink);
        downloadLink.click();
        document.body.removeChild(downloadLink);
    };
    //导入文件
    const fileInputRef = useRef(null);
    const handleFileSelect = async (event: any) => {
        event.preventDefault();
        const files = event.target.files;
        if (!files.length) return;
        const selectedFile = files[0];
        const formData = new FormData();
        formData.append('file', selectedFile);
        const result = await materialImport(formData);
        setTableLoading(true);
        setUploadOpen(false);
        setParseUid(result?.data);
    };
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
    useEffect(() => {
        if (detailData?.creativeMaterialList) {
            tableRef.current = detailData?.creativeMaterialList;
            setTableData(tableRef.current);
        }
    }, [detailData?.creativeMaterialList]);
    useEffect(() => {
        if (materialType) {
            getTableHeader();
        }
    }, [materialType]);
    useEffect(() => {
        schemeList().then((res: any) => {
            setMockData(res);
        });
    }, []);
    return (
        <>
            <div
                className="!mx-[20px] pt-[20px]  overflow-y-auto pb-[72px]"
                style={{ height: getTenant() === ENUM_TENANT.AI ? 'calc(100vh - 210px)' : 'calc(100vh - 130px)' }}
            >
                <TextField
                    fullWidth
                    key={detailData?.name}
                    size="small"
                    color="secondary"
                    InputLabelProps={{ shrink: true }}
                    error={valueOpen && !detailData?.name}
                    helperText={valueOpen && !detailData?.name ? '计划名称必填' : ''}
                    label="计划名称"
                    defaultValue={detailData?.name}
                    onBlur={(e: any) => {
                        setValueOpen(true);
                        changeBasis('name', e.target.value);
                    }}
                />
                <div className="text-[18px] font-[600] my-[20px]">1. 选择创作方案</div>
                <FormControl
                    key={detailData?.targetKeys}
                    error={targetKeysOpen && !detailData?.targetKeys}
                    color="secondary"
                    size="small"
                    fullWidth
                >
                    <InputLabel id="example">选择文案模版</InputLabel>
                    <Select
                        labelId="example"
                        value={detailData?.targetKeys}
                        label="选择文案模版"
                        onChange={(e: any) => {
                            setPerform(preform + 1);
                            settargetKeysOpen(true);
                            changeBasis('targetKeys', e.target.value);
                        }}
                    >
                        {mockData?.map((item, index) => (
                            <MenuItem key={index} value={item.uid}>
                                {item.name}
                            </MenuItem>
                        ))}
                    </Select>
                    <FormHelperText>{targetKeysOpen && !detailData?.targetKeys ? '请选择文案模板' : ''}</FormHelperText>
                </FormControl>
                {detailData?.targetKeys && (
                    <>
                        <div className="text-[18px] font-[600] mt-[20px] mb-[10px]">
                            2. {materialType === 'picture' ? '批量上传素材图片' : '批量上传素材'}
                        </div>
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
                                        <Button size="small" type="primary">
                                            选择已有素材
                                        </Button>
                                    </div>
                                    <Button
                                        onClick={() => setZoomOpen(true)}
                                        type="primary"
                                        shape="circle"
                                        icon={<ZoomInOutlined rev={undefined} />}
                                    ></Button>
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
                        <div className="text-[18px] font-[600] mt-[20px]">3. 方案参数</div>
                        <div className="text-[14px] font-[600] mt-[10px]">
                            {mockData.filter((value) => value.uid === detailData?.targetKeys)[0]?.name}
                            <span
                                onClick={() => {
                                    navigate(
                                        `/copywritingModal?uid=${mockData?.filter((val) => val?.uid === detailData?.targetKeys)[0]?.uid}`
                                    );
                                }}
                                className=" ml-[10px] text-[12px] font-[400] cursor-pointer text-[#673ab7] border-b border-solid border-[#673ab7]"
                            >
                                查看方案
                            </span>
                        </div>
                        {schemesList?.map((item: any, de) => (
                            <Forms
                                key={item?.field + item?.value}
                                item={item}
                                index={de}
                                changeValue={(data: any) => {
                                    const newData = _.cloneDeep(schemesList);
                                    newData[de].value = data.value;
                                    setSchemeLists(newData);
                                }}
                                flag={false}
                            />
                        ))}
                        <div className="text-[18px] font-[600] mt-[20px]">4. 标签</div>
                        <FormControl key={detailData?.tags} color="secondary" size="small" fullWidth>
                            <Autocomplete
                                sx={{ mt: 2 }}
                                multiple
                                size="small"
                                id="tags-filled"
                                color="secondary"
                                options={[]}
                                defaultValue={detailData?.tags}
                                freeSolo
                                renderTags={(value: readonly string[], getTagProps) =>
                                    value.map((option: string, index: number) => (
                                        <Chip variant="outlined" label={option} {...getTagProps({ index })} />
                                    ))
                                }
                                onChange={(e: any, newValue) => {
                                    changeBasis('tags', newValue);
                                }}
                                renderInput={(param) => (
                                    <TextField
                                        onBlur={(e: any) => {
                                            if (e.target.value) {
                                                let newValue = detailData.tags;
                                                if (!newValue) {
                                                    newValue = [];
                                                }
                                                newValue.push(e.target.value);
                                                changeBasis('tags', newValue);
                                            }
                                        }}
                                        color="secondary"
                                        {...param}
                                        label="标签"
                                        placeholder="请输入标签然后回车"
                                    />
                                )}
                            />
                        </FormControl>

                        <div className="text-[18px] font-[600] my-[20px]">5. 批量生成参数</div>
                        <div>
                            <Radio.Group
                                value={detailData?.randomType}
                                onChange={(e: RadioChangeEvent) => {
                                    changeBasis('randomType', e.target.value);
                                }}
                            >
                                <Radio value="RANDOM">全部随机</Radio>
                                {/* <Radio value="SEQUENCE">按顺序</Radio> */}
                            </Radio.Group>
                        </div>
                        <div className="mt-[20px]">生成数量：</div>
                        <InputNumber
                            size="large"
                            value={detailData?.total}
                            onChange={(e: any) => {
                                changeBasis('total', e);
                            }}
                            min={1}
                            max={100}
                            className="w-full"
                        />
                    </>
                )}
            </div>
            <div className="z-[1000] absolute bottom-0 flex gap-2 bg-[#fff] p-[20px] pb-0 w-[100%]">
                <Button className="w-full" icon={<SaveOutlined rev={undefined} />} onClick={() => handleSaveClick(false)} type="primary">
                    保存配置
                </Button>
                <Button
                    disabled={exedisabled || (detailData.status && detailData.status === 'RUNNING' ? true : false)}
                    className="w-full"
                    type="primary"
                    onClick={() => handleSaveClick(true)}
                >
                    保存并开始生成
                </Button>
            </div>
            <Modal open={open} footer={null} onCancel={() => setOpen(false)}>
                <Image className="min-w-[472px]" preview={false} alt="example" src={previewImage} />
            </Modal>
            <Modal width={'70%'} open={zoomOpen} footer={null} onCancel={() => setZoomOpen(false)}>
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
                    <div className="relative">
                        <Button type="primary">上传 XLS</Button>
                        <input
                            className="opacity-0 w-[85px] h-[32px] absolute top-0 left-0 cursor-pointer"
                            ref={fileInputRef}
                            type="file"
                            accept=".xls"
                            onChange={handleFileSelect}
                        />
                    </div>
                </div>
            </Modal>
            {editOpen && (
                <FormModal title={title} editOpen={editOpen} setEditOpen={setEditOpen} columns={columns} form={form} formOk={formOk} />
            )}
        </>
    );
};
export default Lefts;
