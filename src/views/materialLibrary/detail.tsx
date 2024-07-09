import { CloudUploadOutlined, DownOutlined, PlusOutlined, SearchOutlined, SettingOutlined } from '@ant-design/icons';
import { Button, Space, Input, Tag, Dropdown, Avatar, Popconfirm, Upload, Image, Tooltip, message, Form, Modal } from 'antd';
import {
    createMaterialLibrarySlice,
    delBatchMaterialLibrarySlice,
    delMaterialLibrarySlice,
    getMaterialLibraryDataList,
    getMaterialLibraryTitleList,
    updateMaterialLibrarySlice,
    updateMaterialLibraryTitle
} from 'api/material';
import { dictData } from 'api/template';
import { useEffect, useRef, useState } from 'react';
import { useLocation } from 'react-router-dom';
import TablePro from 'views/pages/batchSmallRedBooks/components/components/antdProTable';
import { propShow } from 'views/pages/batchSmallRedBooks/components/formModal';
import { v4 as uuidv4 } from 'uuid';
import { IconRenderer } from './index';
import { ActionType, ModalForm, ProFormText, ProFormTextArea } from '@ant-design/pro-components';
import FormModal from './components/formModal';
import './edit-table.css';
import { PicImagePick } from 'ui-component/PicImagePick';

export enum EditType {
    String = 0,
    Int = 1,
    Time = 2,
    Num = 3,
    Boolean = 4,
    Image = 5
}

const MaterialLibraryDetail = () => {
    const [columns, setColumns] = useState<any>([]);
    const [tableData, setTableData] = useState<any>([]);
    const [detail, setDetail] = useState<any>(null);
    const [selectedRowKeys, setSelectRowKeys] = useState<any>([]);
    const [page, setPage] = useState(1);
    const [typeList, setTypeList] = useState<any[]>([]);
    const [canUpload, setCanUpload] = useState(true);
    const [forceUpdate, setForceUpdate] = useState(0);
    const [editOpen, setEditOpen] = useState(false);
    const [title, setTitle] = useState('');
    const [currentRecord, setCurrentRecord] = useState<any>(null);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [filedName, setFiledName] = useState<string>('');
    const [selectImg, setSelectImg] = useState<any>(null);
    const [previewOpen, setPreviewOpen] = useState(false);

    useEffect(() => {
        if (tableRef.current.length && selectImg?.largeImageURL) {
            const result: any = currentRecord;
            result[filedName] = selectImg?.largeImageURL;

            handleEditColumn(result);
        }
    }, [selectImg]);

    const location = useLocation();
    const searchParams = new URLSearchParams(location.search);
    const id = searchParams.get('id');

    const tableRef = useRef<any[]>([]);
    const actionRef = useRef<ActionType>();
    const tableMetaRef = useRef<any[]>([]);

    const [form] = Form.useForm();

    useEffect(() => {
        dictData('', 'material_format_type').then((res) => {
            setTypeList(res.list);
        });
    }, []);

    useEffect(() => {
        getMaterialLibraryTitleList({ id }).then((data) => {
            setDetail(data);
            tableMetaRef.current = data.tableMeta;
        });
    }, []);

    useEffect(() => {
        if (detail) {
            const list = detail?.tableMeta?.map((item: any) => ({
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
                    render: (_: any, row: any, index: number) => (
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
                                                <Image
                                                    onMouseEnter={() => setCanUpload(false)}
                                                    onClick={(e) => e.stopPropagation()}
                                                    width={82}
                                                    height={82}
                                                    preview={{
                                                        destroyOnClose: true,
                                                        toolbarRender: () => null,
                                                        imageRender: () => {
                                                            return (
                                                                <ModalForm
                                                                    layout="horizontal"
                                                                    width={800}
                                                                    title="预览"
                                                                    open={true}
                                                                    modalProps={{ closable: false }}
                                                                >
                                                                    <div className="flex justify-center mb-3">
                                                                        <Image width={500} src={row[item.fieldName]} preview={false} />
                                                                    </div>
                                                                    <ProFormText name="tags" label="标签" />
                                                                    <ProFormTextArea name="description" label="描述" />
                                                                </ModalForm>
                                                            );
                                                        }
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
                                                                setCurrentRecord(row);
                                                                setFiledName(item.fieldName);
                                                                // setImageDataIndex(row.uuid);
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
                                                            // setImageDataIndex(row.uuid);
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
                    ),
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
            const columnData = [
                {
                    title: '序号',
                    align: 'center',
                    className: 'align-middle',
                    dataIndex: 'index',
                    editable: () => {
                        return false;
                    },
                    width: 70,
                    fixed: true,
                    render: (_: any, row: any, index: number) => <span>{index + 1}</span>
                },
                ...newList,
                {
                    title: '操作',
                    align: 'center',
                    dataIndex: 'operation',
                    className: 'align-middle',
                    width: 200,
                    fixed: 'right',
                    render: (text: any, record: any, index: number) => (
                        <div className="flex items-center justify-center">
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

            setColumns(columnData);
        }
    }, [canUpload, detail]);

    useEffect(() => {
        getMaterialLibraryDataList({ libraryId: id }).then((data) => {
            let newList: any = [];
            data.map((item: any) => {
                let obj: any = {
                    // uuid: uuidv4(),
                    id: item.id
                };
                item.content.forEach((item1: any) => {
                    if (item1?.['columnCode']) {
                        obj[item1['columnCode']] = item1?.['value'];
                    }
                });
                newList.push(obj);
            });

            setTableData(newList);
            tableRef.current = newList;
        });
    }, [forceUpdate]);

    const items: any = [
        {
            key: '1',
            label: '编辑素材字段',
            onClick: () => {}
        },
        {
            key: '2',
            label: '导入素材字段',
            onClick: async () => {}
        }
    ];

    const handleDel = async (id: number) => {
        const data = await delMaterialLibrarySlice({ id });
        if (data) {
            setForceUpdate(forceUpdate + 1);
            message.success('删除成功');
        }
    };

    const handleBatchDel = async () => {
        const data = await delBatchMaterialLibrarySlice(selectedRowKeys);
        if (data) {
            setForceUpdate(forceUpdate + 1);
            message.success('删除成功');
        }
    };

    const handleUpdateColumn = async (index: number, size: any) => {
        const list = tableMetaRef.current[index - 1];

        await updateMaterialLibraryTitle({
            columnType: list.columnType,
            columnWidth: size.width,
            libraryId: Number(id),
            id: list.id,
            isRequired: list.isRequired,
            sequence: list.sequence,
            columnName: list.columnName,
            description: list.description
        });
    };

    const handleEditColumn = async (record: any, type = 1) => {
        const tableMetaList = tableMetaRef.current;
        const recordKeys = Object.keys(record);
        const content = tableMetaList.map((item) => {
            if (recordKeys.includes(item.columnCode)) {
                return {
                    columnId: item.id,
                    columnName: item.columnName,
                    columnCode: item.columnCode,
                    value: record[item.columnCode]
                };
            }
        });

        const data = {
            libraryId: detail.id,
            id: record.id,
            content: content,
            url: detail.iconUrl,
            status: detail.status
        };
        let result;
        if (type === 1) {
            result = await updateMaterialLibrarySlice(data);
        } else {
            result = await createMaterialLibrarySlice(data);
        }
        if (result) {
            if (type === 1) {
                message.success('更新成功');
                setForceUpdate(forceUpdate + 1);
            } else {
                message.success('新增成功');
                setForceUpdate(forceUpdate + 1);
            }
        }
    };

    const formOk = async () => {
        const values = await form.validateFields();
        if (currentRecord) {
            await handleEditColumn({ ...values, id: currentRecord.id }, 1);
            setEditOpen(false);
            setCurrentRecord(null);
        } else {
            await handleEditColumn({ ...values }, 2);
            setEditOpen(false);
            setCurrentRecord(null);
        }
    };

    return (
        <>
            <div className="flex justify-between items-center">
                <div className="flex items-center mb-2">
                    <div>{detail?.iconUrl && <Avatar shape="square" icon={<IconRenderer value={detail?.iconUrl} />} size={48} />}</div>
                    <div className="flex flex-col ml-2">
                        <div className="cursor-pointer flex items-center">
                            <span className="text-[20px] font-semibold">{detail?.name}</span>
                        </div>
                        {/* <div className="mt-2">
                            <Space>
                                <Tag bordered={false}>123</Tag>
                                <Tag bordered={false}>123</Tag>
                                <Tag bordered={false}>123</Tag>
                                <Tag bordered={false}>123</Tag>
                            </Space>
                        </div> */}
                    </div>
                </div>
                <div>
                    <Space>
                        {selectedRowKeys.length > 0 && (
                            <Popconfirm title="确认删除?" onConfirm={handleBatchDel}>
                                <Button danger>批量删除</Button>
                            </Popconfirm>
                        )}
                        <Dropdown menu={{ items }}>
                            <Button>
                                <Space>
                                    <SettingOutlined className="p-1 cursor-pointer" />
                                    <DownOutlined />
                                </Space>
                            </Button>
                        </Dropdown>
                        <Button
                            type="primary"
                            onClick={() => {
                                setEditOpen(true);
                                setTitle('添加内容');
                            }}
                        >
                            添加内容
                        </Button>
                    </Space>
                </div>
            </div>
            <div className="material-detail-table">
                {columns.length > 0 && tableData.length > 0 && (
                    <TablePro
                        handleEditColumn={handleEditColumn}
                        onUpdateColumn={handleUpdateColumn}
                        actionRef={actionRef}
                        tableData={tableData}
                        selectedRowKeys={selectedRowKeys}
                        setSelectedRowKeys={setSelectRowKeys}
                        columns={columns}
                        setPage={setPage}
                        setTableData={setTableData}
                    />
                )}
            </div>
            <FormModal title={title} editOpen={editOpen} setEditOpen={setEditOpen} columns={columns} form={form} formOk={formOk} />
            {isModalOpen && (
                <PicImagePick
                    getList={() => {
                        // if (detail) {
                        //     setImgPre(1);
                        //     getAppList && getAppList();
                        // } else {
                        //     getList(true);
                        // }
                    }}
                    materialList={[]}
                    allData={null}
                    details={null}
                    isModalOpen={isModalOpen}
                    setIsModalOpen={setIsModalOpen}
                    setSelectImg={setSelectImg}
                    columns={columns}
                    values={null}
                />
            )}
        </>
    );
};

export default MaterialLibraryDetail;
