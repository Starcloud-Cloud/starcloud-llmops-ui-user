import { useState, useRef, useEffect, useMemo } from 'react';
import { ActionType } from '@ant-design/pro-components';
import TablePro from './components/antdProTable';
import { getMaterialTitle, getMaterialPage } from 'api/redBook/material';
import { EditType } from 'views/materialLibrary/detail';
import { Upload, Image, Tooltip, Popconfirm, Button, Form } from 'antd';
import { EyeOutlined, CloudUploadOutlined, SearchOutlined, PlusOutlined } from '@ant-design/icons';
import { propShow } from 'views/pages/batchSmallRedBooks/components/formModal';
import FormModal from '../components/formModal';
const MaterialTable = ({ uid = '373e6d9caeeb4307bca70bf4039fd84a' }: any) => {
    const [form] = Form.useForm();
    const [columns, setColumns] = useState<any[]>([]);
    const tableRef = useRef<any[]>([]);
    const [tableLoading, setTableLoading] = useState(false);
    const [tableData, setTableData] = useState<any[]>([]);
    const [selectedRowKeys, setSelectRowKeys] = useState<any>([]);
    const handleEditColumn = () => {};
    const handleUpdateColumn = () => {};
    const [previewOpen, setPreviewOpen] = useState(false);
    const actionRef = useRef<ActionType>();
    const [canUpload, setCanUpload] = useState(true); //禁用上传
    const [title, setTitle] = useState('');
    const [currentRecord, setCurrentRecord] = useState<any>(null);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [filedName, setFiledName] = useState<string>('');
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
                                                // handleEditColumn({ ...row, [item.fieldName]: info?.file?.response?.data?.url });
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
                width: 120,
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
    }, [columns]);
    const [editOpen, setEditOpen] = useState(false);
    const [page, setPage] = useState({
        pageNo: 1,
        pageSize: 100
    });
    const formOk = async () => {
        const values = await form.validateFields();
        console.log(currentRecord);
        if (currentRecord) {
            // await handleEditColumn({ ...values, id: currentRecord.id }, 1);
            setEditOpen(false);
            setCurrentRecord(null);
        } else {
            // await handleEditColumn({ ...values }, 2);
            setEditOpen(false);
            setCurrentRecord(null);
        }
    };
    const handleDel = (id: string) => {};
    const getList = () => {
        getMaterialTitle({ uid }).then((res) => {
            setColumns(res.tableMeta);
        });
        setTableLoading(true);
        getMaterialPage({ ...page, libraryUid: uid, id: 429 }).then((res) => {
            let newList: any = [];
            res.list.map((item: any) => {
                let obj: any = {
                    id: item.id
                };
                item.content.forEach((item1: any) => {
                    if (item1?.['columnCode']) {
                        obj[item1['columnCode']] = item1?.['value'];
                        if (item1.description) {
                            obj[item1['columnCode'] + '_description'] = item1?.['description'];
                        }
                        if (item1.tags) {
                            obj[item1['columnCode'] + '_tags'] = item1?.['tags'];
                        }
                    }
                });
                newList.push(obj);
            });
            setTableData(newList);
            tableRef.current = newList;
            setTableLoading(false);
        });
    };
    useEffect(() => {
        getList();
    }, []);
    return (
        <div>
            <TablePro
                actionRef={actionRef}
                columns={getClumns}
                tableData={tableData}
                tableLoading={tableLoading}
                selectedRowKeys={selectedRowKeys}
                setSelectedRowKeys={setSelectRowKeys}
                setPage={setPage}
                setTableData={setTableData}
                handleEditColumn={handleEditColumn}
                onUpdateColumn={handleUpdateColumn}
            />
            {editOpen && (
                <FormModal title={title} editOpen={editOpen} setEditOpen={setEditOpen} columns={getClumns} form={form} formOk={formOk} />
            )}
        </div>
    );
};
export default MaterialTable;
