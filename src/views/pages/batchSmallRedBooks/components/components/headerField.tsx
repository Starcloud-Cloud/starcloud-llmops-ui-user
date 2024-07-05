import { Modal, Button, Popconfirm, Tag } from 'antd';
import type { ProColumns } from '@ant-design/pro-components';
import { EditableProTable } from '@ant-design/pro-components';
import { DndContext } from '@dnd-kit/core';
import { restrictToVerticalAxis } from '@dnd-kit/modifiers';
import { SortableContext, useSortable, verticalListSortingStrategy } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { useState, useMemo, createContext, useContext, memo } from 'react';
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
    const [editableKeys, setEditableRowKeys] = useState<any[]>([]);
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
    return (
        <>
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
