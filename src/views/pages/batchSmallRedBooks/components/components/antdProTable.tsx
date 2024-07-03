import { EditableProTable } from '@ant-design/pro-components';
import { useState, memo, useMemo } from 'react';
import _ from 'lodash-es';
const TablePro = ({ tableData, selectedRowKeys, setSelectedRowKeys, columns, setPage, setTableData }: any) => {
    const [editableKey, setEditableRowKey] = useState<React.Key[]>([]);
    const column: any[] = useMemo(() => {
        return columns;
    }, [columns]);
    return (
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
            toolBarRender={false}
            columns={column}
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
