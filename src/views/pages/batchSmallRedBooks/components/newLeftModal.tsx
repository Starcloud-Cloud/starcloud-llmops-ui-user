import { Modal, Button, Space, Dropdown, message } from 'antd';
import { DownOutlined, SettingOutlined } from '@ant-design/icons';
import { useEffect, useState, memo, useMemo } from 'react';
import _ from 'lodash-es';
import TablePro from './components/antdProTable';
import HeaderField from './components/headerField';
import '../../../materialLibrary/index.scss';
import '../../../materialLibrary/edit-table.css';
import { delsMaterial } from 'api/redBook/material';
import AiCreate from './newAI';
import { TableHeader } from '../../../materialLibrary/detail';
const LeftModalAdd = ({
    libraryId,
    libraryUid,
    pluginConfig,
    tableLoading,
    actionRefs,
    columns,
    tableMeta,
    tableData,
    setTableData,
    setTitle,
    setEditOpen,
    setPage,
    getList,
    getTitleList,
    downTableData,
    handleEditColumn
}: {
    libraryId: string;
    libraryUid: string;
    pluginConfig: string | null;
    tableLoading: boolean;
    actionRefs: any;
    columns: any[];
    tableMeta: any[];
    tableData: any[];
    setTableData: (data: any[]) => void;
    setTitle: (data: string) => void;
    setEditOpen: (data: boolean) => void;
    setPage: (data: any) => void;
    getList: () => void;
    getTitleList: () => void;
    downTableData: (data: any, num: number) => void;
    handleEditColumn: (data: any) => void;
}) => {
    const [selectedRowKeys, setSelectedRowKeys] = useState<any[]>([]);
    const handleDels = async () => {
        await delsMaterial(selectedRowKeys);
        setSelectedRowKeys([]);
        message.success('删除成功');
        getList();
    };
    const [colOpen, setColOpen] = useState(false);
    return (
        <div>
            <div className="overflow-y-auto mt-6">
                <TableHeader
                    name=""
                    setTitle={setTitle}
                    setEditOpen={setEditOpen}
                    setColOpen={setColOpen}
                    selectedRowKeys={selectedRowKeys}
                    handleBatchDel={handleDels}
                    libraryId={libraryId}
                    libraryUid={libraryUid}
                    pluginConfig={pluginConfig}
                    columns={columns}
                    tableMeta={tableMeta}
                    tableData={tableData}
                    setSelectedRowKeys={setSelectedRowKeys}
                    getTitleList={getTitleList}
                    getList={getList}
                    libraryType={1}
                    canSwitch={true}
                />
                <div className="material-index material-detail-table">
                    <TablePro
                        actionRefs={actionRefs}
                        tableLoading={tableLoading}
                        tableData={tableData}
                        selectedRowKeys={selectedRowKeys}
                        setSelectedRowKeys={setSelectedRowKeys}
                        columns={columns}
                        setPage={setPage}
                        setTableData={setTableData}
                        handleEditColumn={handleEditColumn}
                    />
                </div>
            </div>
            {colOpen && <HeaderField libraryId={libraryId} colOpen={colOpen} setColOpen={setColOpen} headerSave={getTitleList} />}
        </div>
    );
};
const memoLeftModal = (pre: any, next: any) => {
    return (
        _.isEqual(pre.libraryId, next.libraryId) &&
        _.isEqual(pre.libraryUid, next.libraryUid) &&
        _.isEqual(pre.pluginConfig, next.pluginConfig) &&
        _.isEqual(pre.tableLoading, next.tableLoading) &&
        _.isEqual(pre.columns, next.columns) &&
        _.isEqual(pre.tableData, next.tableData)
    );
};
export default memo(LeftModalAdd, memoLeftModal);
// export default LeftModalAdd;
