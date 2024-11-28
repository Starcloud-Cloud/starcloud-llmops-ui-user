import { Button, Input } from 'antd';
import React, { useState, memo, useEffect, useRef, useMemo, useContext } from 'react';
import _ from 'lodash-es';
import { appFieldCode } from 'api/redBook/batchIndex';

import { HolderOutlined } from '@ant-design/icons';
import { Resizable } from 'react-resizable';
import type { DragEndEvent } from '@dnd-kit/core';
import { EditableProTable } from '@ant-design/pro-components';
import { DndContext } from '@dnd-kit/core';
import type { SyntheticListenerMap } from '@dnd-kit/core/dist/hooks/utilities';
import { restrictToVerticalAxis } from '@dnd-kit/modifiers';
import { arrayMove, SortableContext, useSortable, verticalListSortingStrategy } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { v4 as uuidv4 } from 'uuid';
import { dispatch } from 'store';
import { openSnackbar } from 'store/slices/snackbar';

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

interface Variable {
    rows: any[];
    detail?: any;
    setRows: (data: any[]) => void;
}

const CreateVariable = ({ rows, detail, setRows }: Variable) => {
    const columns: any = [
        { key: 'sort', align: 'center', width: 80, render: () => <DragHandle />, editable: false },
        {
            title: '变量名称',
            dataIndex: 'label',
            align: 'center',
            formItemProps: {
                component: <Input />,
                rules: [
                    {
                        required: true,
                        message: '请输入字段名称'
                    }
                ]
            }
        },
        {
            title: '变量类型',
            align: 'center',
            dataIndex: 'style',
            valueType: 'select',
            fieldProps: {
                options: [
                    { label: '输入框', value: 'INPUT' },
                    { label: '文本框', value: 'TEXTAREA' },
                    { label: '下拉框', value: 'SELECT' },
                    { label: '图片', value: 'IMAGE' }
                ]
            }
        },
        {
            title: '变量默认值',
            dataIndex: 'defaultValue',
            align: 'center',
            formItemProps: {
                component: <Input />
            }
        },
        {
            title: '操作',
            width: 60,
            align: 'center',
            valueType: 'option'
        }
    ];
    const [tableData, setTableData] = useState<any[]>([]);
    const [saveLoading, setSaveLoading] = useState(false);
    const handleSave = async () => {
        setSaveLoading(true);
        try {
            const result = await appFieldCode({
                variables: tableData
            });
            setSaveLoading(false);
            setRows(result);
            const newList = result?.map((item: any) => ({
                ...item,
                uuid: uuidv4()
            }));
            setTableData(newList);
            setEditableKeys(newList.map((item: any) => item.uuid));
            dispatch(
                openSnackbar({
                    open: true,
                    message: '保存全局变量成功',
                    variant: 'alert',
                    alert: {
                        color: 'success'
                    },
                    anchorOrigin: { vertical: 'top', horizontal: 'center' },
                    close: false
                })
            );
        } catch (err) {
            setSaveLoading(false);
        }
    };
    useEffect(() => {
        const newList = rows?.map((item) => ({ ...item, uuid: uuidv4() }));
        setEditableKeys(newList?.map((item: any) => item.uuid));
        setTableData(newList);
    }, []);

    //表格
    const timer = useRef<any>();
    const actionRef = useRef<any>();
    const components = {
        header: {
            cell: ResizeableTitle
        },
        body: { row: Row }
    };
    const [editableKeys, setEditableKeys] = useState<React.Key[]>([]);
    const onDragEnd = ({ active, over }: DragEndEvent) => {
        if (active.id !== over?.id) {
            const newList = (prevState: any) => {
                const activeIndex = prevState.findIndex((record: any) => record.uuid === active?.id);
                const overIndex = prevState.findIndex((record: any) => record.uuid === over?.id);
                return arrayMove(prevState, activeIndex, overIndex);
            };
            setTableData(newList(tableData));
        }
    };
    return (
        <>
            <DndContext modifiers={[restrictToVerticalAxis]} onDragEnd={onDragEnd}>
                <SortableContext items={tableData.map((i) => i.uuid)} strategy={verticalListSortingStrategy}>
                    <EditableProTable<any>
                        className="edit-table"
                        rowKey={'uuid'}
                        maxLength={50}
                        tableAlertRender={false}
                        components={components}
                        rowSelection={false}
                        editableFormRef={actionRef}
                        toolBarRender={false}
                        columns={columns}
                        value={tableData}
                        pagination={false}
                        recordCreatorProps={{
                            newRecordType: 'dataSource',
                            creatorButtonText: '增加字段',
                            record: () => {
                                return {
                                    uuid: uuidv4(),
                                    style: 'INPUT'
                                };
                            }
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
                                clearTimeout(timer.current);
                                timer.current = setTimeout(() => {
                                    let newList = _.cloneDeep(recordList);
                                    newList.forEach((item, index) => {
                                        item.field = item.name;
                                    });
                                    setTableData(newList);
                                }, 500);
                            },
                            onChange: setEditableKeys
                        }}
                    />
                </SortableContext>
            </DndContext>
            <div className="flex justify-center mt-4">
                <Button loading={saveLoading} type="primary" onClick={handleSave}>
                    保存
                </Button>
            </div>
        </>
    );
};
const arePropsEqual = (prevProps: any, nextProps: any) => {
    return (
        JSON.stringify(prevProps?.rows) === JSON.stringify(nextProps?.rows) &&
        JSON.stringify(prevProps?.detail) === JSON.stringify(nextProps?.detail)
    );
};
export default memo(CreateVariable, arePropsEqual);
