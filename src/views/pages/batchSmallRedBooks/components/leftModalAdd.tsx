import { Modal, Button, Table, Popconfirm, Form, Input, Select, Switch, InputNumber, Tag, Tooltip } from 'antd';
import type { TableProps } from 'antd';
import type { ProColumns } from '@ant-design/pro-components';
import { EditableProTable, ProFormRadio } from '@ant-design/pro-components';
import type { DragEndEvent } from '@dnd-kit/core';
import { DndContext } from '@dnd-kit/core';
import type { SyntheticListenerMap } from '@dnd-kit/core/dist/hooks/utilities';
import { restrictToVerticalAxis } from '@dnd-kit/modifiers';
import { arrayMove, SortableContext, useSortable, verticalListSortingStrategy } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { useEffect, useState, useMemo, createContext, useContext } from 'react';
import AiCreate from './AICreate';
import _ from 'lodash-es';
import { PlusOutlined, CloudDownloadOutlined, HolderOutlined } from '@ant-design/icons';
import { materialFieldCode } from 'api/redBook/batchIndex';
import { useLocation } from 'react-router-dom';
import FieldImage from 'assets/images/icons/field.svg';
import { v4 as uuidv4 } from 'uuid';
const RowContext = createContext<any>({});
const DragHandle: React.FC = () => {
    const { setActivatorNodeRef, listeners } = useContext(RowContext);
    return (
        <Button type="text" size="small" icon={<HolderOutlined />} style={{ cursor: 'move' }} ref={setActivatorNodeRef} {...listeners} />
    );
};
const Row: React.FC<any> = (props) => {
    const { attributes, listeners, setNodeRef, setActivatorNodeRef, transform, transition, isDragging } = useSortable({
        id: props['data-row-key']
    });

    const style: React.CSSProperties = {
        ...props.style,
        transform: CSS.Translate.toString(transform),
        transition,
        ...(isDragging ? { position: 'relative', zIndex: 9999 } : {})
    };

    const contextValue = useMemo<any>(() => ({ setActivatorNodeRef, listeners }), [setActivatorNodeRef, listeners]);
    return (
        <RowContext.Provider value={contextValue}>
            <tr {...props} ref={setNodeRef} style={style} {...attributes} />
        </RowContext.Provider>
    );
};
const LeftModalAdd = ({
    zoomOpen,
    setZoomOpen,
    colOpen,
    setColOpen,
    tableLoading,
    detail,
    editableKey,
    setEditableRowKey,
    columns,
    tableData,
    setTableData,
    MokeList,
    materialFieldTypeList,
    setTitle,
    setEditOpen,
    changeTableValue,
    setPage,
    defaultVariableData,
    defaultField,
    fieldHead,
    materialType,
    selectedRowKeys,
    setcustom,
    setField,
    setFieldHeads,
    downTableData,
    setSelectedRowKeys,
    setFieldCompletionData,
    fieldCompletionData,
    setVariableData,
    variableData,
    setMaterialTypeStatus
}: {
    zoomOpen: boolean;
    setZoomOpen: (data: boolean) => void;
    colOpen: boolean;
    setColOpen: (data: boolean) => void;
    tableLoading: boolean;
    editableKey: any[];
    setEditableRowKey: (data: any) => void;
    detail?: any;
    columns: any[];
    MokeList: any[];
    materialFieldTypeList: any[];
    materialType: any;
    tableData: any[];
    setTableData: (data: any[]) => void;
    setTitle: (data: string) => void;
    setEditOpen: (data: boolean) => void;
    changeTableValue: (data: any) => void;
    setPage: (data: any) => void;
    setcustom?: (data: any) => void;
    setField?: (data: any) => void;
    setFieldHeads?: (data: any) => void;
    downTableData: (data: any, num: number) => void;
    setSelectedRowKeys: (data: any) => void;
    defaultVariableData?: any;
    defaultField?: any;
    fieldHead?: any;
    selectedRowKeys?: any;
    setFieldCompletionData: (data: any) => void;
    fieldCompletionData: any;
    setVariableData: (data: any) => void;
    setMaterialTypeStatus: (data: any) => void;
    variableData: any;
}) => {
    const location = useLocation();
    const searchParams = new URLSearchParams(location.search);
    const handleDels = () => {
        const newData = tableData?.filter((item) => {
            return !selectedRowKeys?.find((el: any) => el === item.uuid);
        });
        changeTableValue(newData);
    };
    // const materialColumns: TableProps<any>['columns'] = [
    //     {
    //         title: '字段名称',
    //         dataIndex: 'desc',
    //         align: 'center'
    //     },
    //     {
    //         title: '字段类型',
    //         render: (_, row) => materialFieldTypeList?.find((item) => item.value === row.type)?.label,
    //         align: 'center'
    //     },
    //     {
    //         title: '是否为分组',
    //         render: (_, row) => <Tag color="processing">{row?.isGroupField ? '是' : '否'}</Tag>,
    //         align: 'center'
    //     },
    //     {
    //         title: '是否必填',
    //         render: (_, row) => (row?.required ? <Tag color="processing">必填</Tag> : ''),
    //         align: 'center'
    //     },
    //     {
    //         title: '排序',
    //         dataIndex: 'order',
    //         align: 'center'
    //     },
    //     {
    //         title: '操作',
    //         width: 120,
    //         render: (_, row, index) => (
    //             <div className="flex gap-2">
    //                 <Button
    //                     type="link"
    //                     onClick={() => {
    //                         form.setFieldsValue(row);
    //                         setRowIndex(index);
    //                         setMaterialTitle('编辑');
    //                         setFormOpen(true);
    //                     }}
    //                 >
    //                     编辑
    //                 </Button>
    //                 <Popconfirm
    //                     title="提示"
    //                     description="请再次确认是否要删除"
    //                     onConfirm={() => {
    //                         const newData = materialTableData?.filter((item, i) => i !== index);
    //                         setMaterialTableData(newData);
    //                     }}
    //                     okText="Yes"
    //                     cancelText="No"
    //                 >
    //                     <Button type="link" danger>
    //                         删除
    //                     </Button>
    //                 </Popconfirm>
    //             </div>
    //         ),
    //         align: 'center'
    //     }
    // ];
    const materialColumns: ProColumns<any>[] = [
        {
            title: '排序',
            readonly: true,
            editable: (text, record, index) => {
                return false;
            },
            align: 'center',
            width: 80,
            render: () => <DragHandle />
        },
        {
            title: '字段名称',
            align: 'center',
            dataIndex: 'desc',
            formItemProps: {
                rules: [
                    {
                        required: true,
                        message: '请输入字段名称'
                    },
                    {
                        max: 16,
                        message: '字段名称不能超过 20 个字'
                    }
                ]
            }
        },
        {
            title: '字段类型',
            dataIndex: 'type',
            align: 'center',
            valueType: 'select',
            fieldProps: {
                options: materialFieldTypeList
            },
            formItemProps: {
                rules: [
                    {
                        required: true,
                        message: '请选择字段类型'
                    }
                ]
            },
            render: (_, row) => materialFieldTypeList?.find((item) => item.value === row.type)?.label
        },
        {
            title: '是否为分组字段',
            dataIndex: 'isGroupField',
            align: 'center',
            valueType: 'switch',
            render: (_, row) => (row?.isGroupField ? <Tag color="processing">是</Tag> : <Tag color="processing">否</Tag>)
        },
        {
            title: '是否必填',
            dataIndex: 'required',
            align: 'center',
            valueType: 'switch',
            render: (_, row) => (row?.required ? <Tag color="processing">必填</Tag> : '')
        },
        {
            title: '操作',
            align: 'center',
            valueType: 'option',
            width: 200,
            render: (text, record, index, action) => (
                <div className="w-full flex justify-center gap-2">
                    <Button
                        type="link"
                        onClick={() => {
                            console.log(record.uuid);

                            action?.startEditable?.(record.uuid);
                        }}
                    >
                        编辑
                    </Button>
                    <Popconfirm
                        title="提示"
                        description="请再次确认是否要删除"
                        onConfirm={() => {
                            const newData = materialTableData?.filter((item, i) => i !== index);
                            setMaterialTableData(newData);
                        }}
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
    const [materialTableData, setMaterialTableData] = useState<any[]>([]);
    const [rowIndex, setRowIndex] = useState(-1);
    const [formOpen, setFormOpen] = useState(false);
    const [materialTitle, setMaterialTitle] = useState('');
    const [form] = Form.useForm();
    //多行编辑
    const [editableKeys, setEditableRowKeys] = useState<React.Key[]>([]);

    const onDragEnd = ({ active, over }: DragEndEvent) => {
        if (active.id !== over?.id) {
            const newList = (prevState: any) => {
                const activeIndex = prevState.findIndex((record: any) => record.uuid === active?.id);
                const overIndex = prevState.findIndex((record: any) => record.uuid === over?.id);
                return arrayMove(prevState, activeIndex, overIndex);
            };
            setMaterialTableData(newList(materialTableData));
        }
    };
    useEffect(() => {
        if (fieldHead) {
            // setMaterialTableData(fieldHead);
            setMaterialTableData(
                fieldHead?.map((item: any) => {
                    return { ...item, uuid: item.uuid || uuidv4() };
                })
            );
        }
    }, [fieldHead]);
    return (
        <Modal maskClosable={false} width={'80%'} open={zoomOpen} footer={null} onCancel={() => setZoomOpen(false)}>
            <div className="max-h-[60vh] overflow-y-auto mt-6">
                <div className="flex gap-2 justify-between mb-[20px]">
                    <div className="flex gap-2">
                        <Button
                            type="primary"
                            onClick={() => {
                                setTitle('新增');
                                setEditOpen(true);
                            }}
                        >
                            新增素材
                        </Button>
                        <Button disabled={selectedRowKeys?.length === 0} type="primary" onClick={handleDels}>
                            批量删除({selectedRowKeys?.length})
                        </Button>
                    </div>
                    <div className="flex items-center gap-2">
                        <AiCreate
                            title="AI 素材生成"
                            detail={detail}
                            setColOpen={setColOpen}
                            materialType={materialType}
                            columns={columns}
                            MokeList={MokeList}
                            tableData={tableData}
                            defaultVariableData={defaultVariableData}
                            defaultField={defaultField}
                            setPage={setPage}
                            setcustom={setcustom}
                            setField={setField}
                            setSelectedRowKeys={setSelectedRowKeys}
                            downTableData={downTableData}
                            setFieldCompletionData={setFieldCompletionData}
                            fieldCompletionData={fieldCompletionData}
                            setVariableData={setVariableData}
                            variableData={variableData}
                        />
                        {detail && (
                            <Tooltip title="素材字段配置">
                                <img onClick={() => setColOpen(true)} className="w-[28px] cursor-pointer" src={FieldImage} />
                            </Tooltip>
                        )}
                    </div>
                </div>
                <DndContext modifiers={[restrictToVerticalAxis]} onDragEnd={onDragEnd}>
                    <SortableContext items={tableData.map((i) => i.uuid)} strategy={verticalListSortingStrategy}>
                        <EditableProTable<any>
                            rowKey="uuid"
                            tableAlertRender={false}
                            rowSelection={{
                                type: 'checkbox',
                                fixed: true,
                                columnWidth: 50,
                                selectedRowKeys: selectedRowKeys,
                                onChange: (selectedRowKeys: React.Key[], selectedRows: any[]) => {
                                    setSelectedRowKeys(selectedRowKeys);
                                }
                            }}
                            components={{ body: { row: Row } }}
                            toolBarRender={false}
                            columns={columns}
                            value={tableData}
                            pagination={{
                                pageSize: 20,
                                pageSizeOptions: [20, 50, 100, 300, 500],
                                onChange: (page) => setPage(page)
                            }}
                            recordCreatorProps={{
                                position: 'top',
                                record: () => ({
                                    uuid: uuidv4()
                                })
                            }}
                            editable={{
                                type: 'multiple',
                                editableKeys: editableKey,
                                onSave: async (rowKey, data, row) => {
                                    const newList = tableData?.map((item) => {
                                        if (item.uuid === rowKey) {
                                            return data;
                                        } else {
                                            return item;
                                        }
                                    });
                                    setTableData(newList);
                                },
                                onChange: setEditableRowKey
                            }}
                            onChange={(data: any) => {
                                setTableData(data);
                            }}
                        />
                    </SortableContext>
                </DndContext>
                {/* <Table
                    rowKey={(record, index) => {
                        return record.uuid;
                    }}
                    pagination={{
                        showSizeChanger: true,
                        defaultPageSize: 20,
                        pageSizeOptions: [20, 50, 100, 300, 500],
                        onChange: (page) => {
                            setPage(page);
                        }
                    }}
                    loading={tableLoading}
                    size="small"
                    virtual
                    rowSelection={{
                        type: 'checkbox',
                        fixed: true,
                        columnWidth: 50,
                        selectedRowKeys: selectedRowKeys,
                        onChange: (selectedRowKeys: React.Key[], selectedRows: any[]) => {
                            setSelectedRowKeys(selectedRowKeys);
                        }
                    }}
                    columns={columns}
                    dataSource={tableData}
                /> */}
            </div>
            <Modal width={'80%'} open={colOpen} onCancel={() => setColOpen(false)} footer={false} title="素材字段配置">
                <div className="flex justify-end mb-4">
                    {/* <Button
                        disabled={materialTableData?.length >= 30}
                        size="small"
                        onClick={() => {
                            console.log(1111);
                        }}
                        icon={<CloudDownloadOutlined />}
                        type="primary"
                    >
                        导入素材字段
                    </Button> */}
                    {/* <Button
                        disabled={materialTableData?.length === 30}
                        size="small"
                        onClick={() => {
                            setMaterialTitle('新增');
                            setRowIndex(-1);
                            setFormOpen(true);
                        }}
                        icon={<PlusOutlined />}
                        type="primary"
                    >
                        新增({materialTableData?.length || 0}/30)
                    </Button> */}
                </div>
                {/* <Table pagination={false} columns={materialColumns} dataSource={materialTableData} /> */}
                <DndContext modifiers={[restrictToVerticalAxis]} onDragEnd={onDragEnd}>
                    <SortableContext items={materialTableData.map((i) => i.uuid)} strategy={verticalListSortingStrategy}>
                        <EditableProTable<any>
                            rowKey="uuid"
                            components={{ body: { row: Row } }}
                            toolBarRender={false}
                            maxLength={30}
                            columns={materialColumns}
                            value={materialTableData}
                            recordCreatorProps={{
                                record: () => ({
                                    uuid: uuidv4(),
                                    isGroupField: false,
                                    required: false
                                })
                            }}
                            editable={{
                                type: 'multiple',
                                editableKeys,
                                onSave: async (rowKey, data, row) => {
                                    const newList = materialTableData?.map((item) => {
                                        if (item.uuid === rowKey) {
                                            return data;
                                        } else {
                                            return item;
                                        }
                                    });
                                    setMaterialTableData(newList);
                                },
                                onChange: setEditableRowKeys
                            }}
                        />
                    </SortableContext>
                </DndContext>
                <div className="flex justify-center mt-4">
                    <Button
                        type="primary"
                        disabled={materialTableData?.length === 0}
                        onClick={async () => {
                            const result = await materialFieldCode({
                                // fieldConfigDTOList: materialTableData
                                fieldConfigDTOList: materialTableData?.map((item, index) => ({
                                    ...item,
                                    order: index
                                }))
                            });
                            setMaterialTableData(result);
                            try {
                                setFieldHeads && setFieldHeads(JSON.stringify(result));
                                setColOpen(false);
                            } catch (err) {
                                console.log(err);
                            }
                        }}
                    >
                        保存
                    </Button>
                </div>
            </Modal>
            <Modal
                title={materialTitle}
                onOk={async () => {
                    const result = await form.validateFields();
                    const newData = _.cloneDeep(materialTableData);
                    if (rowIndex === -1) {
                        newData.unshift(result);
                        newData?.sort((a, b) => a.order - b.order);
                        setMaterialTableData(newData);
                    } else {
                        newData.splice(rowIndex, 1, { ...newData[rowIndex], ...result });
                        newData?.sort((a, b) => a.order - b.order);
                        setMaterialTableData(newData);
                    }
                    form.resetFields();
                    setFormOpen(false);
                }}
                open={formOpen}
                onCancel={() => {
                    form.resetFields();
                    setFormOpen(false);
                }}
            >
                <Form labelCol={{ span: 6 }} form={form}>
                    <Form.Item
                        label="字段名称"
                        name="desc"
                        rules={[
                            { required: true, message: '请输入字段名称' },
                            { max: 20, message: '字段名称不能超过 20 个字' }
                            // { pattern:'', message: '字段名称不能存在空格和符号' },
                        ]}
                    >
                        <Input />
                    </Form.Item>
                    <Form.Item label="字段类型" name="type" rules={[{ required: true, message: '请选择字段类型' }]}>
                        <Select options={materialFieldTypeList} />
                    </Form.Item>
                    <Form.Item initialValue={0} label="字段排序" name="order" rules={[{ required: true, message: '请输入字段排序' }]}>
                        <InputNumber className="w-full" min={0} />
                    </Form.Item>
                    <Form.Item initialValue={false} label="是否为分组字段" name="isGroupField" valuePropName="checked">
                        <Switch />
                    </Form.Item>
                    <Form.Item initialValue={false} label="是否必填" name="required" valuePropName="checked">
                        <Switch />
                    </Form.Item>
                </Form>
            </Modal>
        </Modal>
    );
};
const memoLeftModal = (pre: any, next: any) => {
    return (
        JSON.stringify(pre.zoomOpen) === JSON.stringify(next.zoomOpen) &&
        JSON.stringify(pre.colOpen) === JSON.stringify(next.colOpen) &&
        JSON.stringify(pre.tableLoading) === JSON.stringify(next.tableLoading) &&
        JSON.stringify(pre.editableKey) === JSON.stringify(next.editableKey) &&
        JSON.stringify(pre.columns) === JSON.stringify(next.columns) &&
        JSON.stringify(pre.MokeList) === JSON.stringify(next.MokeList) &&
        JSON.stringify(pre.materialFieldTypeList) === JSON.stringify(next.materialFieldTypeList) &&
        JSON.stringify(pre.materialType) === JSON.stringify(next.materialType) &&
        JSON.stringify(pre.tableData) === JSON.stringify(next.tableData) &&
        JSON.stringify(pre.defaultVariableData) === JSON.stringify(next.defaultVariableData) &&
        JSON.stringify(pre.defaultField) === JSON.stringify(next.defaultField) &&
        JSON.stringify(pre.fieldHead) === JSON.stringify(next.fieldHead) &&
        JSON.stringify(pre.selectedRowKeys) === JSON.stringify(next.selectedRowKeys) &&
        JSON.stringify(pre.fieldCompletionData) === JSON.stringify(next.fieldCompletionData) &&
        JSON.stringify(pre.variableData) === JSON.stringify(next.variableData)
    );
};
// export default memo(LeftModalAdd, memoLeftModal);
export default LeftModalAdd;
