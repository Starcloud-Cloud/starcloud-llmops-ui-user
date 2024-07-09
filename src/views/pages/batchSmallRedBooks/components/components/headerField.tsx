import { Modal, Form, Table, Button, Popconfirm, Tag, Input, Select, Switch } from 'antd';
import type { TableProps } from 'antd';
import type { ProColumns } from '@ant-design/pro-components';
import { EditableProTable } from '@ant-design/pro-components';
import { DndContext } from '@dnd-kit/core';
import { restrictToVerticalAxis } from '@dnd-kit/modifiers';
import { SortableContext, useSortable, verticalListSortingStrategy } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { useState, useMemo, createContext, useContext, memo, useEffect } from 'react';
import _ from 'lodash-es';
import { HolderOutlined } from '@ant-design/icons';
import { materialFieldCode } from 'api/redBook/batchIndex';
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
    console.log(contextValue);

    return (
        <RowContext.Provider value={contextValue}>
            <tr {...props} ref={setNodeRef} style={style} {...attributes} />
        </RowContext.Provider>
    );
};
const HeaderField = ({
    setColOpen,
    onDragEnd,
    materialFieldTypeList,
    materialTableData,
    setMaterialTableData,
    setFieldHeads
}: {
    setColOpen: (data: boolean) => void;
    onDragEnd: (data: any) => void;
    materialFieldTypeList: any[];
    materialTableData: any[];
    setMaterialTableData: (data: any) => void;
    setFieldHeads?: (data: any) => void;
}) => {
    const [form] = Form.useForm();
    const [open, setOpen] = useState(false);
    const [title, setTile] = useState('新增字段');
    const [rowIndex, setRowIndex] = useState(-1);
    const materialColumns: TableProps<any>['columns'] = [
        {
            title: '排序',
            key: '排序',
            align: 'center',
            width: 80,
            render: () => <DragHandle />
        },
        {
            title: '字段名称',
            align: 'center',
            key: 'desc',
            dataIndex: 'desc'
        },
        {
            title: '字段类型',
            key: 'type',
            dataIndex: 'type',
            align: 'center',
            render: (_, row) => materialFieldTypeList?.find((item) => item.value === row.type)?.label
        },
        {
            title: '是否为分组字段',
            key: 'isGroupField',
            dataIndex: 'isGroupField',
            align: 'center',
            render: (_, row) => (row?.isGroupField ? <Tag color="processing">是</Tag> : <Tag color="processing">否</Tag>)
        },
        {
            title: '是否必填',
            key: 'required',
            dataIndex: 'required',
            align: 'center',
            render: (_, row) => (row?.required ? <Tag color="processing">必填</Tag> : '')
        },
        {
            title: '操作',
            align: 'center',
            key: 'option',
            width: 120,
            render: (_, row, index) => (
                <div className="w-full flex justify-center gap-2">
                    <Button
                        type="link"
                        onClick={() => {
                            setRowIndex(index);
                            setTile('编辑字段');
                            setOpen(true);
                            form.setFieldsValue(row);
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
    useEffect(() => {
        if (!open) {
            form.resetFields();
        }
    }, [open]);
    return (
        <>
            <Button
                onClick={() => {
                    setTile('新增字段');
                    setOpen(true);
                }}
                type="primary"
                className="absolute top-[12px] right-[40px]"
            >
                新增
            </Button>
            <DndContext modifiers={[restrictToVerticalAxis]} onDragEnd={onDragEnd}>
                <SortableContext items={materialTableData.map((i) => i.uuid)} strategy={verticalListSortingStrategy}>
                    <Table
                        components={{ body: { row: Row } }}
                        pagination={false}
                        columns={materialColumns}
                        dataSource={materialTableData}
                        rowKey={'uuid'}
                    />
                </SortableContext>
            </DndContext>
            <div className="flex justify-center mt-4">
                <Button
                    type="primary"
                    disabled={materialTableData?.length === 0}
                    onClick={async () => {
                        const result = await materialFieldCode({
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
            <Modal
                open={open}
                onCancel={() => setOpen(false)}
                title={title}
                onOk={async () => {
                    const result = await form.validateFields();
                    console.log(result);

                    const newList = _.cloneDeep(materialTableData);
                    if (title === '新增字段') {
                        newList.unshift({ ...result, uuid: uuidv4() });
                    } else {
                        newList[rowIndex] = { ...result, uuid: newList[rowIndex].uuid };
                    }
                    setMaterialTableData(newList);
                    setOpen(false);
                }}
            >
                <Form form={form} labelCol={{ span: 6 }}>
                    <Form.Item
                        label="字段名称"
                        name="desc"
                        rules={[
                            {
                                required: true,
                                message: '请输入字段名称'
                            },
                            {
                                max: 16,
                                message: '字段名称不能超过 20 个字'
                            }
                        ]}
                    >
                        <Input />
                    </Form.Item>
                    <Form.Item
                        label="字段类型"
                        name="type"
                        rules={[
                            {
                                required: true,
                                message: '请选择字段类型'
                            }
                        ]}
                    >
                        <Select options={materialFieldTypeList} />
                    </Form.Item>
                    <Form.Item label="是否为分组字段" valuePropName="checked" initialValue={false} name="isGroupField">
                        <Switch />
                    </Form.Item>
                    <Form.Item label="是否为必填" valuePropName="checked" initialValue={false} name="required">
                        <Switch />
                    </Form.Item>
                </Form>
            </Modal>
        </>
    );
};
const memoHeaderField = (oldValue: any, newValue: any) => {
    return (
        _.isEqual(oldValue.materialFieldTypeList, newValue.materialFieldTypeList) &&
        _.isEqual(oldValue.materialTableData, newValue.materialTableData)
    );
};
export default memo(HeaderField, memoHeaderField);
