import { EditableProTable } from '@ant-design/pro-components';
import { useState, memo, useEffect, useCallback } from 'react';
import _ from 'lodash-es';
import { Resizable } from 'react-resizable';
import './index.css';
import React from 'react';
import { GetRowKey } from 'antd/lib/table/interface';
import { EditType } from 'views/materialLibrary/detail';

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

const TablePro = ({
    tableData,
    selectedRowKeys,
    setSelectedRowKeys,
    columns,
    setPage,
    setTableData,
    actionRef,
    onUpdateColumn,
    handleEditColumn
}: any) => {
    const [column, setColumn] = useState<any[]>([]);
    const [editableKeys, setEditableRowKeys] = useState<React.Key[]>([]);
    const [dataIndex, setDataIndex] = useState<any[]>([]);

    useEffect(() => {
        setColumn(columns);
    }, [columns]);

    const components = {
        header: {
            cell: ResizeableTitle
        }
    };

    const rowKey = 'id';

    // ============================ RowKey ============================
    const getRowKey = React.useMemo<GetRowKey<any>>(() => {
        if (typeof rowKey === 'function') {
            return rowKey;
        }
        return (record: any, index?: number) => {
            if (index === -1) {
                return (record as any)?.[rowKey as string];
            }
            // 如果 props 中有name 的话，用index 来做行号，这样方便转化为 index

            return (record as any)?.[rowKey as string] ?? index?.toString();
        };
    }, [rowKey]);

    const handleUpdateColumn = async (index: any, size: any) => {
        onUpdateColumn && (await onUpdateColumn(index, size));
    };

    // 使用 useCallback 确保防抖动函数不会在每次渲染时重新创建
    const debouncedHandleUpdateColumn = useCallback(_.debounce(handleUpdateColumn, 500), []);

    const handleResize =
        (index: number) =>
        (e: any, { size }: any) => {
            const nextColumns = [...column];
            nextColumns[index] = {
                ...nextColumns[index],
                width: size.width
            };
            setColumn(nextColumns);
            debouncedHandleUpdateColumn(index, size);
        };

    const resultColumns = column.map((col: any, index: any) => ({
        ...col,
        onHeaderCell: (column: any) => ({
            width: column.width,
            onResize: handleResize(index)
        })
    }));

    return (
        <EditableProTable<any>
            className="edit-table"
            rowKey={rowKey}
            tableAlertRender={false}
            components={components}
            rowSelection={{
                type: 'checkbox',
                fixed: true,
                columnWidth: 50,
                selectedRowKeys: selectedRowKeys,
                onChange: (selectedRowKeys: React.Key[], selectedRows: any[]) => {
                    setSelectedRowKeys(selectedRowKeys);
                }
            }}
            actionRef={actionRef}
            toolBarRender={false}
            columns={resultColumns.map((item) => ({
                ...item,
                editable: dataIndex.flat(1).join('.') === [item.dataIndex || item.key].flat(1).join('.') ? undefined : false,
                onCell: (record: any, rowIndex: any) => ({
                    onClick: () => {
                        if (item.dataIndex === 'index' || item.dataIndex === 'operation' || item.editType === EditType.Image) {
                            setDataIndex([]);
                            setEditableRowKeys([]);
                            return;
                        }
                        setEditableRowKeys([getRowKey(record, rowIndex)]);
                        setDataIndex([item.dataIndex || (item.key as string)]);
                    },
                    onBlur: (e: any) => {
                        if (item.dataIndex === 'index' || item.dataIndex === 'operation' || item.editType === EditType.Image) {
                            setDataIndex([]);
                            setEditableRowKeys([]);
                            return;
                        }
                        handleEditColumn(record);
                        setEditableRowKeys([]);
                    }
                })
            }))}
            value={tableData}
            pagination={{
                pageSize: 20,
                pageSizeOptions: [20, 50, 100, 300, 500],
                onChange: (page) => setPage(page)
            }}
            recordCreatorProps={false}
            editable={{
                editableKeys: editableKeys,
                onValuesChange: (record, recordList) => {
                    setTableData(recordList);
                }
            }}
        />
    );
};

const memoTablePro = (oldValue: any, newValue: any) => {
    return (
        _.isEqual(oldValue.tableData, newValue.tableData) &&
        _.isEqual(oldValue.selectedRowKeys, newValue.selectedRowKeys) &&
        _.isEqual(oldValue.columns, newValue.columns)
    );
};
export default memo(TablePro, memoTablePro);
