import { Modal, Form, Button, Popconfirm, Tag, Input, InputNumber, Switch, Select, message } from 'antd';
import { HolderOutlined } from '@ant-design/icons';
import { EditableProTable } from '@ant-design/pro-components';
import React, { useState, useRef, useEffect, useMemo, useContext } from 'react';
import { Resizable } from 'react-resizable';
import type { DragEndEvent } from '@dnd-kit/core';
import { DndContext } from '@dnd-kit/core';
import type { SyntheticListenerMap } from '@dnd-kit/core/dist/hooks/utilities';
import { restrictToVerticalAxis } from '@dnd-kit/modifiers';
import { arrayMove, SortableContext, useSortable, verticalListSortingStrategy } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import _ from 'lodash-es';
import { getColumn, createColumn, updatesColumn, delColumn } from 'api/material/field';
const ResizeableTitle = (props: any) => {
    const { onResize, width, ...restProps } = props;

    if (!width) {
        return <th {...restProps} />;
    }

    return (
        <Resizable width={width} height={0} onResize={onResize} draggableOpts={{ enableUserSelectHack: false }}>
            <th {...restProps} />
        </Resizable>
    );
};

interface RowContextProps {
    setActivatorNodeRef?: (element: HTMLElement | null) => void;
    listeners?: SyntheticListenerMap;
}
const RowContext = React.createContext<RowContextProps>({});
const DragHandle: React.FC = () => {
    const { setActivatorNodeRef, listeners } = useContext(RowContext);
    return (
        <Button type="text" size="small" icon={<HolderOutlined />} style={{ cursor: 'move' }} ref={setActivatorNodeRef} {...listeners} />
    );
};
interface RowProps extends React.HTMLAttributes<HTMLTableRowElement> {
    'data-row-key': string;
}
const Row: React.FC<RowProps> = (props) => {
    const { attributes, listeners, setNodeRef, setActivatorNodeRef, transform, transition, isDragging } = useSortable({
        id: props['data-row-key']
    });

    const style: React.CSSProperties = {
        ...props.style,
        transform: CSS.Translate.toString(transform),
        transition,
        ...(isDragging ? { position: 'relative', zIndex: 9999 } : {})
    };

    const contextValue = useMemo<RowContextProps>(() => ({ setActivatorNodeRef, listeners }), [setActivatorNodeRef, listeners]);

    return (
        <RowContext.Provider value={contextValue}>
            <tr {...props} ref={setNodeRef} style={style} {...attributes} />
        </RowContext.Provider>
    );
};
const HeaderField = ({
    libraryId,
    // colOpen,
    // setColOpen,
    setPattern,
    headerSave
}: {
    libraryId?: string;
    // colOpen: boolean;
    // setColOpen: (data: boolean) => void;
    setPattern?: (data: any[]) => void; //方便拼图生成模式
    headerSave?: () => void;
}) => {
    const components = {
        header: {
            cell: ResizeableTitle
        },
        body: { row: Row }
    };
    const rowKey = 'id';
    const [form] = Form.useForm();
    const [open, setOpen] = useState(false);
    const actionRef = useRef<any>();
    const materialFieldTypeList = [
        { label: '字符串', value: 0 },
        { label: '图片', value: 5 },
        { label: '文档路径', value: 6 }
    ];
    const materialColumns: any = [
        { key: 'sort', align: 'center', width: 80, render: () => <DragHandle />, editable: false },
        {
            title: '字段名称',
            align: 'center',
            width: 400,
            required: true,
            dataIndex: 'columnName',
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
            width: 200,
            required: true,
            dataIndex: 'columnType',
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
            render: (_: any, row: any) => materialFieldTypeList?.find((item) => item.value === row.type)?.label
        },
        {
            width: 200,
            title: '是否为分组字段',
            dataIndex: 'isGroupColumn',
            align: 'center',
            valueType: 'switch',
            render: (_: any, row: any) => (row?.isGroupColumn ? <Tag color="processing">是</Tag> : <Tag color="processing">否</Tag>)
        },
        {
            width: 200,
            title: '是否必填',
            dataIndex: 'isRequired',
            align: 'center',
            valueType: 'switch',
            render: (_: any, row: any) => (row?.isRequired ? <Tag color="processing">必填</Tag> : '')
        },
        {
            title: '操作',
            align: 'center',
            valueType: 'option',
            width: 60,
            fixed: 'right',
            render: (text: any, row: any, index: any) => (
                <div className="w-full flex justify-center gap-2">
                    {/* <Button
                        type="link"
                        onClick={() => {
                            form.setFieldsValue(row);
                            setRowIndex(index);
                            setTitle('编辑字段配置');
                            setOpen(true);
                        }}
                    >
                        编辑
                    </Button> */}
                    <Popconfirm
                        title="提示"
                        description="请再次确认是否要删除"
                        onConfirm={async () => {
                            await delColumn({ id: row.id });
                            getList();
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
    const [tableData, setTableData] = useState<any[]>([]);
    const [editableKeys, seteditableKeys] = useState<React.Key[]>([]);
    const [tableLoading, setTableLoading] = useState(false);
    const getList = async () => {
        setTableLoading(true);
        const result = await getColumn({ libraryId });
        setTableLoading(false);
        seteditableKeys(result.map((item: any) => item.id));
        setTableData(result);
    };
    const onDragEnd = ({ active, over }: DragEndEvent) => {
        if (active.id !== over?.id) {
            const newList = (prevState: any) => {
                const activeIndex = prevState.findIndex((record: any) => record.id === active?.id);
                const overIndex = prevState.findIndex((record: any) => record.id === over?.id);
                return arrayMove(prevState, activeIndex, overIndex);
            };
            setTableData(newList(tableData));
        }
    };
    useEffect(() => {
        if (libraryId) {
            getList();
        }
    }, [libraryId]);
    return (
        <>
            {/* <Modal width={'80%'} open={colOpen} onCancel={() => setColOpen(false)} footer={false} title="素材字段配置"> */}
            <DndContext modifiers={[restrictToVerticalAxis]} onDragEnd={onDragEnd}>
                <SortableContext items={tableData.map((i) => i.id)} strategy={verticalListSortingStrategy}>
                    <EditableProTable<any>
                        className="edit-table"
                        rowKey={rowKey}
                        maxLength={30}
                        tableAlertRender={false}
                        loading={tableLoading}
                        components={components}
                        rowSelection={false}
                        editableFormRef={actionRef}
                        toolBarRender={false}
                        columns={materialColumns}
                        value={tableData}
                        pagination={false}
                        controlled
                        recordCreatorProps={{
                            newRecordType: 'dataSource',
                            record: () => ({
                                id: Date.now(),
                                uuid: Date.now(),
                                isRequired: false,
                                columnType: 0,
                                isGroupColumn: false
                            })
                        }}
                        editable={{
                            type: 'multiple',
                            editableKeys: editableKeys,
                            actionRender: (row, config, defaultDoms) => {
                                return [
                                    <Button
                                        onClick={() => {
                                            setTableData(tableData.filter((item, index) => index !== row.index));
                                        }}
                                        type="link"
                                        danger
                                    >
                                        删除
                                    </Button>
                                ];
                            },
                            onValuesChange: (record, recordList) => {
                                setTableData(recordList);
                            },
                            onChange: seteditableKeys
                        }}
                        onChange={(data) => {
                            console.log(data);
                        }}
                    />
                </SortableContext>
            </DndContext>
            {/* <Button
                onClick={() => {
                    setOpen(true);
                }}
                disabled={tableData.length >= 30}
                className="mt-4"
                type="primary"
                icon={<PlusOutlined />}
            >
                新增（{tableData.length}/30）
            </Button> */}
            <div className="flex justify-center mt-4">
                <div>
                    <Button
                        onClick={async () => {
                            if (tableData.some((item) => !item.columnName || (item!.columnType !== 0 && !item.columnType))) {
                                return false;
                            }
                            await updatesColumn({
                                libraryId,
                                tableColumnSaveReqVOList: tableData.map((item, index) => {
                                    if (item.uuid) {
                                        return {
                                            columnWidth: 400,
                                            libraryId,
                                            ...item,
                                            id: undefined,
                                            uuid: undefined,
                                            sequence: index
                                        };
                                    } else {
                                        return { ...item, sequence: index };
                                    }
                                })
                            });
                            getList();
                            headerSave && headerSave();
                            setPattern && setPattern(tableData);
                            // setColOpen(false);
                            message.success('保存成功');
                        }}
                        className="mt-4"
                        type="primary"
                    >
                        保存
                    </Button>
                    <div className="text-xs text-black/50 mt-3">编辑后请保存</div>
                </div>
            </div>
            <Modal
                title={'新增字段配置'}
                onOk={async () => {
                    const result = await form.validateFields();
                    await createColumn({ ...result, libraryId });
                    getList();
                    setOpen(false);
                    form.resetFields();
                }}
                open={open}
                onCancel={() => {
                    form.resetFields();
                    setOpen(false);
                }}
            >
                <Form labelCol={{ span: 6 }} form={form}>
                    <Form.Item
                        label="字段名称"
                        name="columnName"
                        rules={[
                            { required: true, message: '请输入字段名称' },
                            { max: 20, message: '字段名称不能超过 20 个字' }
                        ]}
                    >
                        <Input />
                    </Form.Item>
                    <Form.Item label="字段类型" name="columnType" rules={[{ required: true, message: '请选择字段类型' }]}>
                        <Select options={materialFieldTypeList} />
                    </Form.Item>
                    <Form.Item initialValue={0} label="字段序号" name="sequence" rules={[{ required: true, message: '请输入字段序号' }]}>
                        <InputNumber className="w-full" min={0} />
                    </Form.Item>
                    <Form.Item initialValue={false} label="是否为分组字段" name="isGroupColumn" valuePropName="checked">
                        <Switch />
                    </Form.Item>
                    <Form.Item initialValue={false} label="是否必填" name="isRequired" valuePropName="checked">
                        <Switch />
                    </Form.Item>
                </Form>
            </Modal>
            {/* </Modal> */}
        </>
    );
};
export default HeaderField;
