import { Modal, Button, Space, Dropdown, message } from 'antd';
import { DownOutlined, SettingOutlined } from '@ant-design/icons';
import { useEffect, useState, memo, useMemo } from 'react';
import { LeftOutlined } from '@ant-design/icons';
import _ from 'lodash-es';
import TablePro from './components/antdProTable';
import HeaderField from './components/headerField';
import PlugMarket from 'views/materialLibrary/components/plugMarket';
import { delsMaterial } from 'api/redBook/material';
import AiCreate from './AICreate';
const LeftModalAdd = ({
    libraryId,
    tableLoading,
    actionRefs,
    columns,
    tableData,
    setTableData,
    setTitle,
    setEditOpen,
    setPage,
    getList,
    getTitleList,
    handleEditColumn
}: {
    libraryId: string;
    tableLoading: boolean;
    actionRefs: any;
    columns: any[];
    tableData: any[];
    setTableData: (data: any[]) => void;
    setTitle: (data: string) => void;
    setEditOpen: (data: boolean) => void;
    setPage: (data: any) => void;
    getList: () => void;
    getTitleList: () => void;
    handleEditColumn: (data: any) => void;
}) => {
    const [selectedRowKeys, setSelectedRowKeys] = useState<any[]>([]);
    const handleDels = async () => {
        const result = await delsMaterial(selectedRowKeys);
        setSelectedRowKeys([]);
        message.success('删除成功');
        getList();
    };
    const [colOpen, setColOpen] = useState(false);
    const [plugOpen, setPlugOpen] = useState(false);
    const [plugTitle, setPlugTitle] = useState('插件市场');
    const [plugValue, setPlugValue] = useState<null | string>(null);
    useEffect(() => {
        if (!plugOpen) {
            setPlugValue(null);
            setPlugTitle('插件市场');
        }
    }, [plugOpen]);
    return (
        <div>
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
                        <Button type="primary" onClick={() => setPlugOpen(true)}>
                            AI 素材生成
                        </Button>
                        <Dropdown
                            menu={{
                                items: [
                                    {
                                        key: '1',
                                        label: '编辑素材字段',
                                        onClick: () => setColOpen(true)
                                    },
                                    {
                                        key: '2',
                                        label: '导入素材字段',
                                        onClick: async () => {}
                                    }
                                ]
                            }}
                        >
                            <Button>
                                <Space>
                                    <SettingOutlined className="p-1 cursor-pointer" />
                                    <DownOutlined />
                                </Space>
                            </Button>
                        </Dropdown>
                    </div>
                </div>
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
            {/* AI素材生成 */}
            <Modal width={800} open={plugOpen} onCancel={() => setPlugOpen(false)} footer={false}>
                <div className="font-bold text-xl mb-8 flex items-center gap-2">
                    {plugValue && <Button onClick={() => setPlugValue(null)} size="small" shape="circle" icon={<LeftOutlined />} />}
                    {plugTitle}
                </div>
                {
                    !plugValue ? (
                        <PlugMarket
                            onOk={(title: string, value: string) => {
                                setPlugTitle(title);
                                setPlugValue(value);
                            }}
                        />
                    ) : null
                    // <AiCreate
                    //     plugValue={plugValue}
                    //     setPlugOpen={setPlugOpen}
                    //     columns={columns}
                    // MokeList={MokeList}
                    // tableData={tableData}
                    // setPage={setPage}
                    // setSelectedRowKeys={setSelectedRowKeys}
                    // downTableData={downTableData}
                    // setFieldCompletionData={setFieldCompletionData}
                    // fieldCompletionData={fieldCompletionData}
                    // setVariableData={setVariableData}
                    // variableData={variableData}
                    // />
                }
            </Modal>
            {colOpen && <HeaderField libraryId={libraryId} colOpen={colOpen} setColOpen={setColOpen} headerSave={getTitleList} />}
        </div>
    );
};
const memoLeftModal = (pre: any, next: any) => {
    return _.isEqual(pre.editableKey, next.editableKey) && _.isEqual(pre.columns, next.columns) && _.isEqual(pre.tableData, next.tableData);
};
export default memo(LeftModalAdd, memoLeftModal);
// export default LeftModalAdd;
