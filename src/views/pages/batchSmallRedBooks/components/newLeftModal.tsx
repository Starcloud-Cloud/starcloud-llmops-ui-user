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
    appUid,
    bizUid,
    bizType,
    libraryId,
    libraryUid,
    materialflag,
    libraryName,
    libraryType,
    pluginConfig,
    tableLoading,
    actionRefs,
    page,
    total,
    columns,
    tableMeta,
    tableData,
    setTableData,
    setTitle,
    setEditOpen,
    setPage,
    getList,
    getTitleList,
    handleEditColumn,
    handleUpdateColumn,
    handleExecute
}: {
    appUid: string;
    bizUid: string;
    bizType: string;
    libraryId: string;
    libraryUid: string;
    materialflag: boolean;
    libraryName: string;
    libraryType: number;
    pluginConfig: string | null;
    tableLoading: boolean;
    actionRefs: any;
    page: any;
    total: number;
    columns: any[];
    tableMeta: any[];
    tableData: any[];
    setTableData: (data: any[]) => void;
    setTitle: (data: string) => void;
    setEditOpen: (data: boolean) => void;
    setPage: (data: any) => void;
    getList: (data?: any) => void;
    getTitleList: () => void;
    handleEditColumn: (data: any) => void;
    handleUpdateColumn: (index: number, size: any) => void;
    handleExecute: any;
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
                    name={libraryName}
                    setTitle={setTitle}
                    setEditOpen={setEditOpen}
                    setColOpen={setColOpen}
                    selectedRowKeys={selectedRowKeys}
                    materialflag={materialflag}
                    handleBatchDel={handleDels}
                    libraryId={libraryId}
                    libraryUid={libraryUid}
                    bizType={bizType}
                    bizUid={bizUid}
                    appUid={appUid}
                    pluginConfig={pluginConfig}
                    columns={columns}
                    tableMeta={tableMeta}
                    tableData={tableData}
                    setSelectedRowKeys={setSelectedRowKeys}
                    getTitleList={getTitleList}
                    getList={getList}
                    libraryType={libraryType}
                    canSwitch={true}
                    canExecute={true}
                    handleExecute={handleExecute}
                />
                <div className="material-index material-detail-table">
                    <TablePro
                        actionRefs={actionRefs}
                        tableLoading={tableLoading}
                        tableData={tableData}
                        selectedRowKeys={selectedRowKeys}
                        setSelectedRowKeys={setSelectedRowKeys}
                        columns={columns}
                        total={total}
                        page={page}
                        setPage={setPage}
                        setTableData={setTableData}
                        handleEditColumn={handleEditColumn}
                        onUpdateColumn={handleUpdateColumn}
                        getList={getList}
                    />
                </div>
            </div>
            {/* {colOpen && <HeaderField libraryId={libraryId} colOpen={colOpen} setColOpen={setColOpen} headerSave={getTitleList} />} */}
        </div>
    );
};
const memoLeftModal = (pre: any, next: any) => {
    return (
        _.isEqual(pre.appUid, next.appUid) &&
        _.isEqual(pre.libraryId, next.libraryId) &&
        _.isEqual(pre.bizType, next.bizType) &&
        _.isEqual(pre.bizUid, next.bizUid) &&
        _.isEqual(pre.materialflag, next.materialflag) &&
        _.isEqual(pre.libraryName, next.libraryName) &&
        _.isEqual(pre.pluginConfig, next.pluginConfig) &&
        _.isEqual(pre.tableLoading, next.tableLoading) &&
        _.isEqual(pre.total, next.total) &&
        _.isEqual(pre.columns, next.columns) &&
        _.isEqual(pre.tableData, next.tableData)
    );
};
export default memo(LeftModalAdd, memoLeftModal);
// export default LeftModalAdd;
