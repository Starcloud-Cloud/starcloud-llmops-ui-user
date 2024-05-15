import { Modal, Button, Table, Input } from 'antd';
import { useEffect, useMemo, useState, useRef } from 'react';
import { customMaterialGenerate } from 'api/template/fetch';
import { materialGenerate } from 'api/redBook/batchIndex';
import { dispatch } from 'store';
import { openSnackbar } from 'store/slices/snackbar';
import AiCreate from './AICreate';
import ChatMarkdown from 'ui-component/Markdown';
import { v4 as uuidv4 } from 'uuid';
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
    setcustom,
    setField,
    downTableData
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
    downTableData: (data: any, _?: boolean) => void;
    defaultVariableData?: any;
    defaultField?: any;
}) => {
    const [selTableList, setSelTableList] = useState<any[]>([]);
    const handleDels = () => {
        const newList = selTableList?.map((item) => JSON.stringify(item));
        console.log(newList);
        console.log(tableData);

        const newData = tableData?.filter((item) => {
            console.log(newList.includes(JSON.stringify(item)));
            return !newList.includes(JSON.stringify(item));
        });
        changeTableValue(newData);
        setSelTableList([]);
    };
    return (
        <Modal maskClosable={false} width={'70%'} open={zoomOpen} footer={null} onCancel={() => setZoomOpen(false)}>
            <div className="flex gap-2 justify-between my-[20px]">
                <Button disabled={selTableList.length === 0} type="primary" onClick={handleDels}>
                    批量删除({selTableList.length})
                </Button>
                <div className="flex gap-2">
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
                    return record[Object.keys(record)[1]] + index;
                }}
                pagination={{
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
                    onChange: (selectedRowKeys: React.Key[], selectedRows: any[]) => {
                        setSelTableList(selectedRows);
                    }
                }}
                columns={columns}
                dataSource={tableData}
            />
        </Modal>
    );
};
export default LeftModalAdd;
