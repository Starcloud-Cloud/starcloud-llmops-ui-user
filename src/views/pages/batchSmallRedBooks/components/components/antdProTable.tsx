import { EditableProTable } from '@ant-design/pro-components';
import { useState, memo, useMemo, useEffect } from 'react';
import _ from 'lodash-es';
import { Resizable } from 'react-resizable';
import './index.css';

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

const TablePro = ({ tableData, selectedRowKeys, setSelectedRowKeys, columns, setPage, setTableData }: any) => {
    const [editableKey, setEditableRowKey] = useState<React.Key[]>([]);
    const [column, setColumn] = useState<any[]>([]);

    useEffect(() => {
        setColumn(columns);
    }, [columns]);

    const components = {
        header: {
            cell: ResizeableTitle
        }
    };

    const handleResize =
        (index: number) =>
        (e: any, { size }: any) => {
            const nextColumns = [...column];
            nextColumns[index] = {
                ...nextColumns[index],
                width: size.width
            };
            setColumn(nextColumns);
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
            rowKey="uuid"
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
            toolBarRender={false}
            columns={resultColumns}
            value={tableData}
            pagination={{
                pageSize: 20,
                pageSizeOptions: [20, 50, 100, 300, 500],
                onChange: (page) => setPage(page)
            }}
            recordCreatorProps={false}
            editable={{
                type: 'multiple',
                editableKeys: editableKey,
                onSave: async (rowKey, data, row) => {
                    const newList = tableData?.map((item: any) => {
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
