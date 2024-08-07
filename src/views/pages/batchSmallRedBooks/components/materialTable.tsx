import { useState, useRef, useEffect, useMemo, memo } from 'react';
import { useLocation } from 'react-router-dom';
import { ActionType, ModalForm, ProFormTextArea, ProFormSelect } from '@ant-design/pro-components';
import TablePro from './components/antdProTable';
import { getMaterialTitle, getMaterialPage, createMaterial, updateMaterial, delMaterial, delsMaterial } from 'api/redBook/material';
import { EditType } from 'views/materialLibrary/detail';
import { Upload, Image, Tooltip, Popconfirm, Button, Form, message, Modal, Radio, Progress, UploadProps, Tag, Space, Spin } from 'antd';
import { EyeOutlined, CloudUploadOutlined, SearchOutlined, PlusOutlined, ZoomInOutlined } from '@ant-design/icons';
import { propShow } from 'views/pages/batchSmallRedBooks/components/formModal';
import { PicImagePick } from 'ui-component/PicImagePick';
import FormModal from 'views/materialLibrary/components/formModal';
import LeftModalAdd from './newLeftModal';
import _ from 'lodash-es';
import DownMaterial from 'views/materialLibrary/components/downMaterial';
import { imageOcr } from 'api/redBook/batchIndex';
import { getAccessToken } from 'utils/auth';
import { v4 as uuidv4 } from 'uuid';

const MaterialTable = ({ materialStatus, updataTable, uid, bizUid, bizType, appUid, tableTitle, handleExecute }: any) => {
    const [form] = Form.useForm();
    const [imageForm] = Form.useForm();
    const [page, setPage] = useState({
        pageNo: 1,
        pageSize: 20
    });
    const [total, setTotal] = useState(0);
    const [columns, setColumns] = useState<any[]>([]);
    const tableRef = useRef<any[]>([]);
    const [tableLoading, setTableLoading] = useState(false);
    const [tableData, setTableData] = useState<any[]>([]);
    const handleUpdateColumn = () => {};
    const [previewOpen, setPreviewOpen] = useState(false);
    const actionRef = useRef<ActionType>();
    const actionRefs = useRef<ActionType>();
    const [canUpload, setCanUpload] = useState(true); //禁用上传
    const [title, setTitle] = useState('');
    const [currentRecord, setCurrentRecord] = useState<any>(null);
    const [filedName, setFiledName] = useState<string>('');
    const [selectImg, setSelectImg] = useState<any>(null);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [btnLoading, setBtnLoading] = useState(-1);
    const [extend, setExtend] = useState<any>({});

    const getClumns = useMemo(() => {
        if (columns.length === 0) [];
        const list = columns?.map((item: any) => ({
            desc: item.columnName,
            fieldName: item.columnCode,
            type: item.columnType,
            required: item.isRequired,
            width: item.columnWidth
        }));

        const newList = list?.map((item: any) => {
            return {
                title: item.desc,
                align: 'center',
                className: 'align-middle',
                required: !!item.required,
                width: item.width || 400,
                dataIndex: item.fieldName,
                editable: () => {
                    return !(item.type === EditType.Image);
                },
                editType: item.type,
                valueType: 'textarea',
                fieldProps: { autoSize: { minRows: 1, maxRows: 5 } },
                render: (text: any, row: any, index: number) => {
                    return (
                        <div className="flex justify-center items-center gap-2">
                            {item.type === EditType.Image ? (
                                <div className="relative">
                                    <Upload
                                        className="table_upload"
                                        {...propShow}
                                        showUploadList={false}
                                        listType="picture-card"
                                        maxCount={1}
                                        disabled={!canUpload}
                                        onChange={(info) => {
                                            if (info.file.status === 'done') {
                                                const data = JSON.parse(JSON.stringify(tableRef.current));
                                                data[index][item.fieldName] = info?.file?.response?.data?.url;
                                                tableRef.current = data;
                                                setTableData([...data]);
                                                handleEditColumn({ ...row, [item.fieldName]: info?.file?.response?.data?.url });
                                            }
                                        }}
                                    >
                                        {row[item.fieldName] ? (
                                            <div className="relative">
                                                <div className="relative">
                                                    <Image
                                                        onMouseEnter={() => setCanUpload(false)}
                                                        onClick={(e) => e.stopPropagation()}
                                                        width={82}
                                                        height={82}
                                                        preview={false}
                                                        src={row[item.fieldName] + '?x-oss-process=image/resize,w_100/quality,q_80'}
                                                    />
                                                    <div
                                                        className="absolute z-[1] cursor-pointer inset-0 bg-[rgba(0, 0, 0, 0.5)] flex justify-center items-center text-white opacity-0 hover:opacity-100"
                                                        onClick={(e) => {
                                                            e.stopPropagation();
                                                            setPreviewOpen(true);
                                                            setCurrentRecord(row);
                                                            setFiledName(item.fieldName);
                                                        }}
                                                    >
                                                        <div>
                                                            <EyeOutlined />
                                                            预览
                                                        </div>
                                                    </div>
                                                </div>
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
                                                                setCurrentRecord(row);
                                                                setFiledName(item.fieldName);
                                                                // setImageData(row.uuid);
                                                                // setValues(row);
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
                                                            setCurrentRecord(row);
                                                            setFiledName(item.fieldName);
                                                            // setImageData(row.uuid);
                                                            // setValues(row);
                                                        }}
                                                    >
                                                        <SearchOutlined className="text-white/80 hover:text-white" />
                                                    </div>
                                                </Tooltip>
                                            </div>
                                        )}
                                    </Upload>
                                </div>
                            ) : (
                                <div className="break-all line-clamp-4">{row[item.fieldName]}</div>
                            )}
                        </div>
                    );
                },
                formItemProps: {
                    rules: [
                        {
                            required: !!item.required,
                            message: item.desc + '是必填项'
                        }
                    ]
                },
                type: item.type
            };
        });
        return [
            {
                title: '序号',
                align: 'center',
                className: 'align-middle',
                dataIndex: 'index',
                editable: () => {
                    return false;
                },
                isDefault: true,
                width: 70,
                fixed: true,
                render: (_: any, row: any, index: number) => <span>{index + 1}</span>
            },
            // {
            //     title: 'ID',
            //     dataIndex: 'id',
            //     align: 'center',
            //     width: 80,
            //     isDefault: true,
            //     renderText: (text: any) => text || 0,
            //     sorter: (a: any, b: any) => a.usedCount - b.usedCount
            // },
            ...newList,
            {
                title: '使用次数',
                dataIndex: 'usedCount',
                align: 'center',
                width: 100,
                isDefault: true,
                renderText: (text: any) => text || 0,
                sorter: (a: any, b: any) => a.usedCount - b.usedCount
            },
            {
                title: '操作',
                align: 'center',
                dataIndex: 'operation',
                isDefault: true,
                width: 60,
                fixed: 'right',
                render: (text: any, record: any, index: number) => (
                    <div className="flex flex-col gap-2 justify-center">
                        <Button
                            type="link"
                            onClick={async () => {
                                await form.setFieldsValue(record);
                                setCurrentRecord(record);
                                setTitle('编辑');
                                setEditOpen(true);
                            }}
                        >
                            编辑
                        </Button>
                        <Popconfirm
                            title="提示"
                            description="请再次确认是否要删除"
                            onConfirm={() => handleDel(record.id)}
                            okText="Yes"
                            cancelText="No"
                        >
                            <Button type="link" danger>
                                删除
                            </Button>
                        </Popconfirm>
                    </div>
                )
            }
        ];
    }, [columns]);
    const getClumn = useMemo(() => {
        if (columns.length === 0) [];
        return getClumns?.map((item, index) => ({
            ...item,
            readonly: true,
            // dataIndex: index !== getClumns.length - 1 ? 'index' : item.dataIndex,
            editable: false
        }));
    }, [getClumns]);
    const [editOpen, setEditOpen] = useState(false);
    const formOk = async (values: any) => {
        if (currentRecord) {
            handleEditColumn({ libraryId: currentRecord.libraryId, id: currentRecord.id, ...values }, 1);
            ({ libraryId: currentRecord.libraryId, id: currentRecord.id, ...values });
            setEditOpen(false);
            setCurrentRecord(null);
        } else {
            await handleEditColumn({ ...values }, 2);
            setEditOpen(false);
            setCurrentRecord(null);
        }
    };
    //创建编辑最终逻辑
    const handleEditColumn = async (record: any, type = 1) => {
        console.log(record);
        const tableMetaList = _.cloneDeep(columns);
        const recordKeys = Object.keys(record);
        const content = tableMetaList.map((item) => {
            if (recordKeys.includes(item.columnCode)) {
                if (item.columnType === EditType.Image) {
                    return {
                        columnId: item.id,
                        columnName: item.columnName,
                        columnCode: item.columnCode,
                        value: record[item.columnCode],
                        description: record[item.columnCode + '_description'],
                        tags: record[item.columnCode + '_tags'],
                        extend: record[item.columnCode + '_extend']
                    };
                } else {
                    return {
                        columnId: item.id,
                        columnName: item.columnName,
                        columnCode: item.columnCode,
                        value: record[item.columnCode]
                    };
                }
            }
        });

        const data = {
            libraryId: record.libraryId || libraryId,
            id: record.id,
            content: content
        };
        let result;
        if (type === 1) {
            result = await updateMaterial(data);
        } else {
            result = await createMaterial(data);
        }
        if (result) {
            if (type === 1) {
                message.success('更新成功');
                form.resetFields();
                getList();
            } else {
                message.success('新增成功');
                form.resetFields();
                getList();
            }
        }
    };
    const handleDel = async (id: string) => {
        await delMaterial({ id });
        message.success('删除成功');
        getList();
    };
    useEffect(() => {
        if (tableRef.current.length && selectImg?.largeImageURL) {
            const result: any = currentRecord;
            result[filedName] = selectImg?.largeImageURL;

            handleEditColumn(result);
        }
    }, [selectImg]);
    const getList = (data?: any, pageNo?: any, pageSize?: any) => {
        setTableLoading(true);
        getMaterialPage({ pageNo: pageNo || page.pageNo, pageSize: pageSize || page.pageSize, appUid, sortingFields: data }).then((res) => {
            let newList: any = [];
            res.list.map((item: any) => {
                let obj: any = _.cloneDeep(item);
                item.content.forEach((item1: any) => {
                    if (item1?.['columnCode']) {
                        obj[item1['columnCode']] = item1?.['value'];
                        if (item1.description) {
                            obj[item1['columnCode'] + '_description'] = item1?.['description'];
                        }
                        if (item1.tags) {
                            obj[item1['columnCode'] + '_tags'] = item1?.['tags'];
                        }
                        if (item1.extend) {
                            obj[item1['columnCode'] + '_extend'] = item1?.['extend'];
                        }
                    }
                });
                newList.push(obj);
            });
            setTableData(newList);
            tableRef.current = newList;
            setTotal(res.total);
            setTableLoading(false);
        });
    };
    //素材库 libraryId
    const [libraryId, setLibraryId] = useState('');
    //素材库名称
    const [libraryName, setLibraryName] = useState('');
    //素材库的值
    const [pluginConfig, setpluginConfig] = useState<string | null>(null);
    const [libraryType, setLibraryType] = useState(-1);
    const getTitleList = () => {
        getMaterialTitle({ appUid }).then((res) => {
            setLibraryType(res.createSource);
            setLibraryName(res.name);
            setpluginConfig(res.pluginConfig);
            setLibraryId(res.id);
            setColumns(res.tableMeta);
        });
    };
    useEffect(() => {
        if (appUid) {
            getTitleList();
        }
    }, [appUid, tableTitle, updataTable]);
    useEffect(() => {
        if (appUid) {
            getList();
        }
    }, [appUid, updataTable]);

    //批量导入
    const [uploadOpen, setUploadOpen] = useState(false);
    const [radioType, setRadioType] = useState(1);
    //放大编辑弹窗
    const [zoomOpen, setZoomOpen] = useState(false);

    const handleOcr = async (filedName: string, url: string, type: number) => {
        try {
            setBtnLoading(type);
            const data = await imageOcr({ imageUrls: [url], cleansing: !!type });
            const result = data?.list?.[0].ocrGeneralDTO;
            imageForm.setFieldValue(`${filedName}_tag`, result.tag);
            imageForm.setFieldValue(`${filedName}_description`, result.content);
            setBtnLoading(-1);
            setExtend({ [filedName + '_extend']: result.data });
        } catch (e) {
            setBtnLoading(-1);
        }
    };
    const [fileList, setfileList] = useState<any[]>([]);
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
            setfileList(info.fileList);
            if (info.file.status === 'done') {
                const tableMetaList = _.cloneDeep(columns);
                const content = tableMetaList.map((item) => {
                    return {
                        columnId: item.id,
                        columnName: item.columnName,
                        columnCode: item.columnCode,
                        value: info?.file?.response?.data?.url
                    };
                });
                const data = {
                    libraryId,
                    content: content
                };
                createMaterial(data);
            }
            if (info.fileList?.every((item) => item.status === 'done')) {
                setTimeout(() => {
                    getList();
                }, 1000);
            }
        },
        onRemove(info: any) {
            delMaterial({ id: info.id }).then((res) => {
                getList();
            });
        },
        onDrop(e) {
            console.log('Dropped files', e.dataTransfer.files);
        }
    };
    useEffect(() => {
        if (materialStatus === 'picture') {
            const field = columns.find((el) => el.columnType === EditType.Image)?.columnCode;
            setfileList(
                tableData?.map((item) => ({
                    uid: uuidv4(),
                    id: item.id,
                    thumbUrl: item[field],
                    response: {
                        data: {
                            url: item[field]
                        }
                    }
                }))
            );
        }
    }, [tableData, materialStatus]);
    return (
        <div>
            {materialStatus === 'picture' ? (
                <>
                    <div className="text-[12px] font-[500] flex items-center justify-between">
                        <div>图片总量：{fileList?.length}</div>
                        {fileList?.length > 0 && (
                            <Button
                                danger
                                onClick={async () => {
                                    await delsMaterial(tableData?.map((item) => item.id));
                                    getList();
                                }}
                                size="small"
                                type="text"
                            >
                                全部清除
                            </Button>
                        )}
                    </div>
                    <div className="flex flex-wrap gap-[10px] overflow-y-auto">
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
                    <div className="flex items-center justify-between mb-4">
                        <div>
                            <Button size="small" type="primary" onClick={() => setUploadOpen(true)}>
                                批量导入
                            </Button>
                        </div>
                        <div className="flex gap-2 items-end">
                            <div className="text-xs text-black/50">点击放大编辑</div>
                            <Button onClick={() => setZoomOpen(true)} type="primary" shape="circle" icon={<ZoomInOutlined />}></Button>
                        </div>
                    </div>
                    <div className="material-index material-detail-table">
                        <TablePro
                            isSelection={true}
                            actionRef={actionRef}
                            columns={getClumn}
                            tableData={tableData}
                            tableLoading={tableLoading}
                            page={page}
                            setPage={setPage}
                            total={total}
                            setTableData={(data: any) => {
                                tableRef.current = data;
                                setTableData(data);
                            }}
                            getList={getList}
                            handleEditColumn={handleEditColumn}
                            onUpdateColumn={handleUpdateColumn}
                        />
                    </div>
                </>
            )}
            {editOpen && (
                <FormModal
                    getList={() => {
                        getTitleList();
                    }}
                    libraryId={libraryId}
                    pluginConfig={pluginConfig as any}
                    title={title}
                    editOpen={editOpen}
                    setEditOpen={setEditOpen}
                    columns={getClumns}
                    form={form}
                    formOk={formOk}
                    row={currentRecord}
                />
            )}
            <Modal maskClosable={false} width={'80%'} open={zoomOpen} footer={null} onCancel={() => setZoomOpen(false)}>
                <LeftModalAdd
                    appUid={appUid}
                    libraryId={libraryId}
                    libraryType={libraryType}
                    bizUid={bizUid}
                    bizType={bizType}
                    libraryName={libraryName}
                    pluginConfig={pluginConfig}
                    tableLoading={tableLoading}
                    actionRefs={actionRefs}
                    columns={getClumns}
                    tableMeta={columns}
                    tableData={tableData}
                    total={total}
                    setTableData={(data) => {
                        tableRef.current = data;
                        setTableData(data);
                    }}
                    page={page}
                    setPage={setPage}
                    setEditOpen={setEditOpen}
                    setTitle={setTitle}
                    getList={getList}
                    getTitleList={getTitleList}
                    handleEditColumn={handleEditColumn}
                    handleExecute={(data: number[]) => {
                        handleExecute(data);
                        setZoomOpen(false);
                    }}
                />
            </Modal>
            {isModalOpen && (
                <PicImagePick
                    getList={() => {
                        getTitleList();
                    }}
                    libraryId={libraryId}
                    pluginConfig={pluginConfig as any}
                    // getList={() => {
                    //     if (detail) {
                    //         setImgPre(1);
                    //         getAppList && getAppList();
                    //     } else {
                    //         getList(true);
                    //     }
                    // }}
                    // materialList={materialList}
                    // allData={appData}
                    // details={all?.configuration?.appInformation}
                    isModalOpen={isModalOpen}
                    setIsModalOpen={setIsModalOpen}
                    setSelectImg={setSelectImg}
                    columns={columns}
                    // values={values}
                />
            )}
            {previewOpen && (
                <ModalForm
                    onInit={async () => {
                        const value: any = {};
                        value[filedName + '_tags'] = currentRecord[filedName + '_tags'];
                        value[filedName + '_description'] = currentRecord[filedName + '_description'];
                        await imageForm.setFieldsValue(value);
                    }}
                    layout="horizontal"
                    form={imageForm}
                    width={800}
                    title="预览"
                    open={previewOpen}
                    onOpenChange={setPreviewOpen}
                    onFinish={async () => {
                        const value = await imageForm.getFieldsValue();
                        const result = await handleEditColumn({
                            ...currentRecord,
                            ...value,
                            ...extend
                        });
                        setPreviewOpen(false);
                    }}
                >
                    <div className="flex justify-center mb-3">
                        <Image width={500} height={500} className="object-contain" src={currentRecord[filedName]} preview={false} />
                    </div>

                    <ProFormSelect mode="tags" name={filedName + '_tags'} label="标签" />
                    <div className="flex justify-end mb-2">
                        <Space>
                            <Button loading={btnLoading == 0} onClick={() => handleOcr(filedName, currentRecord[filedName], 0)}>
                                图片OCR
                            </Button>
                            <Button loading={btnLoading === 1} onClick={() => handleOcr(filedName, currentRecord[filedName], 1)}>
                                清洗OCR内容
                            </Button>
                        </Space>
                    </div>
                    <Spin spinning={btnLoading !== -1}>
                        <ProFormTextArea name={filedName + '_description'} label="描述" />
                    </Spin>
                    {currentRecord[filedName + '_extend'] && (
                        <div>
                            <Tag>有扩展字段</Tag>
                        </div>
                    )}
                </ModalForm>
            )}
            {uploadOpen && <DownMaterial libraryId={libraryId} uploadOpen={uploadOpen} setUploadOpen={setUploadOpen} getList={getList} />}
        </div>
    );
};
const memoMaterialTable = (pre: any, next: any) => {
    return (
        _.isEqual(pre.materialStatus, next.materialStatus) &&
        _.isEqual(pre.updataTable, next.updataTable) &&
        _.isEqual(pre.uid, next.uid) &&
        _.isEqual(pre.appUid, next.appUid) &&
        _.isEqual(pre.tableTitle, next.tableTitle)
    );
};
export default memo(MaterialTable, memoMaterialTable);
