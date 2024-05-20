import { Modal, Button, Table } from 'antd';
import { useEffect, useState } from 'react';
import AiCreate from './AICreate';
import _ from 'lodash-es';
const LeftModalAdd = ({
    zoomOpen,
    setZoomOpen,
    tableLoading,
    columns,
    tableData,
    MokeList,
    setTitle,
    setEditOpen,
    changeTableValue,
    setPage,
    defaultVariableData,
    defaultField,
    selectedRowKeys,
    setcustom,
    setField,
    downTableData,
    setSelectedRowKeys
}: {
    zoomOpen: boolean;
    setZoomOpen: (data: boolean) => void;
    tableLoading: boolean;
    columns: any[];
    MokeList: any[];
    tableData: any[];
    setTitle: (data: string) => void;
    setEditOpen: (data: boolean) => void;
    changeTableValue: (data: any) => void;
    setPage: (data: any) => void;
    setcustom?: (data: any) => void;
    setField?: (data: any) => void;
    downTableData: (data: any) => void;
    setSelectedRowKeys: (data: any) => void;
    defaultVariableData?: any;
    defaultField?: any;
    selectedRowKeys?: any;
}) => {
    const handleDels = () => {
        const newData = tableData?.filter((item) => {
            return !selectedRowKeys?.find((el: any) => el === item.uuid);
        });
        changeTableValue(newData);
    };
    return (
        <Modal maskClosable={false} width={'70%'} open={zoomOpen} footer={null} onCancel={() => setZoomOpen(false)}>
            <div className="flex gap-2 justify-between my-[20px]">
                <Button disabled={selectedRowKeys?.length === 0} type="primary" onClick={handleDels}>
                    批量删除({selectedRowKeys?.length})
                </Button>
                <div className="flex gap-2">
                    {/* <Button>素材字段配置</Button> */}
                    <AiCreate
                        title="AI 素材生成"
                        columns={columns}
                        MokeList={MokeList}
                        tableData={tableData}
                        defaultVariableData={defaultVariableData}
                        defaultField={defaultField}
                        setPage={setPage}
                        setcustom={setcustom}
                        setField={setField}
                        setSelectedRowKeys={setSelectedRowKeys}
                        downTableData={downTableData}
                    />
                    <Button
                        type="primary"
                        onClick={() => {
                            setTitle('新增');
                            setEditOpen(true);
                        }}
                    >
                        新增
                    </Button>
                </div>
            </div>
            <Table
                scroll={{ y: 500 }}
                rowKey={(record, index) => {
                    return record.uuid;
                }}
                pagination={{
                    showSizeChanger: true,
                    defaultPageSize: 20,
                    pageSizeOptions: [20, 50, 100, 300, 500],
                    onChange: (page) => {
                        setPage(page);
                    }
                }}
                loading={tableLoading}
                size="small"
                virtual
                rowSelection={{
                    type: 'checkbox',
                    fixed: true,
                    columnWidth: 50,
                    selectedRowKeys: selectedRowKeys,
                    onChange: (selectedRowKeys: React.Key[], selectedRows: any[]) => {
                        setSelectedRowKeys(selectedRowKeys);
                    }
                }}
                columns={columns}
                dataSource={tableData}
            />
        </Modal>
    );
};
export default LeftModalAdd;
