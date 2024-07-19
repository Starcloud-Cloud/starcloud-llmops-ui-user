import { Modal, Button, Space, Dropdown } from 'antd';
import { DownOutlined, SettingOutlined } from '@ant-design/icons';
import type { DragEndEvent } from '@dnd-kit/core';
import { arrayMove } from '@dnd-kit/sortable';
import { useEffect, useState, memo, useMemo } from 'react';
import { LeftOutlined } from '@ant-design/icons';
import AiCreate from './AICreate';
import _ from 'lodash-es';
import { v4 as uuidv4 } from 'uuid';
import TablePro from './components/antdProTable';
import HeaderField from './components/headerField';
import PlugMarket from 'views/materialLibrary/components/plugMarket';
const LeftModalAdd = ({
    colOpen,
    setColOpen,
    tableLoading,
    detail,
    columns,
    tableData,
    setTableData,
    MokeList,
    materialFieldTypeList,
    setTitle,
    setEditOpen,
    changeTableValue,
    setPage,
    defaultVariableData,
    defaultField,
    fieldHead,
    materialType,
    selectedRowKeys,
    setcustom,
    setField,
    setFieldHeads,
    downTableData,
    setSelectedRowKeys,
    setFieldCompletionData,
    fieldCompletionData,
    setVariableData,
    variableData
}: // setMaterialTypeStatus
{
    colOpen: boolean;
    setColOpen: (data: boolean) => void;
    tableLoading: boolean;
    detail?: any;
    columns: any[];
    MokeList: any[];
    materialFieldTypeList: any[];
    materialType: any;
    tableData: any[];
    setTableData: (data: any[]) => void;
    setTitle: (data: string) => void;
    setEditOpen: (data: boolean) => void;
    changeTableValue: (data: any) => void;
    setPage: (data: any) => void;
    setcustom?: (data: any) => void;
    setField?: (data: any) => void;
    setFieldHeads?: (data: any) => void;
    downTableData: (data: any, num: number) => void;
    setSelectedRowKeys: (data: any) => void;
    defaultVariableData?: any;
    defaultField?: any;
    fieldHead?: any;
    selectedRowKeys?: any;
    setFieldCompletionData: (data: any) => void;
    fieldCompletionData: any;
    setVariableData: (data: any) => void;
    // setMaterialTypeStatus: (data: any) => void;
    variableData: any;
}) => {
    const handleDels = () => {
        const newData = tableData?.filter((item) => {
            return !selectedRowKeys?.find((el: any) => el === item.uuid);
        });
        changeTableValue(newData);
    };
    const [materialTableData, setMaterialTableData] = useState<any[]>([]);

    const [plugOpen, setPlugOpen] = useState(false);
    const [plugTitle, setPlugTitle] = useState('插件市场');
    const [plugValue, setPlugValue] = useState<null | string>(null);
    useEffect(() => {
        if (fieldHead) {
            // setMaterialTableData(fieldHead);
            setMaterialTableData(
                fieldHead?.map((item: any) => {
                    return { ...item, uuid: item.uuid || uuidv4() };
                })
            );
        }
    }, [fieldHead]);
    useEffect(() => {
        if (!plugOpen) {
            setPlugValue(null);
            setPlugTitle('插件市场');
        }
    }, [plugOpen]);
    console.log(columns);

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
                        {/* {detail && (
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
                        )} */}
                    </div>
                </div>
                <TablePro
                    tableData={tableData}
                    selectedRowKeys={selectedRowKeys}
                    setSelectedRowKeys={setSelectedRowKeys}
                    columns={columns}
                    setPage={setPage}
                    setTableData={setTableData}
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
                                console.log(value);

                                setPlugTitle(title);
                                setPlugValue(value);
                            }}
                        />
                    ) : null
                    // <AiCreate
                    //     plugValue={plugValue}
                    //     setPlugOpen={setPlugOpen}
                    //     materialType={materialType}
                    //     columns={columns}
                    //     MokeList={MokeList}
                    //     tableData={tableData}
                    //     setPage={setPage}
                    //     setcustom={setcustom}
                    //     setField={setField}
                    //     setSelectedRowKeys={setSelectedRowKeys}
                    //     downTableData={downTableData}
                    //     setFieldCompletionData={setFieldCompletionData}
                    //     fieldCompletionData={fieldCompletionData}
                    //     setVariableData={setVariableData}
                    //     variableData={variableData}
                    // />
                }
            </Modal>
            {/* {colOpen && <HeaderField colOpen={colOpen} setColOpen={setColOpen} />} */}
        </div>
    );
};
const memoLeftModal = (pre: any, next: any) => {
    return (
        _.isEqual(pre.colOpen, next.colOpen) &&
        _.isEqual(pre.editableKey, next.editableKey) &&
        _.isEqual(pre.columns, next.columns) &&
        _.isEqual(pre.MokeList, next.MokeList) &&
        _.isEqual(pre.materialFieldTypeList, next.materialFieldTypeList) &&
        _.isEqual(pre.materialType, next.materialType) &&
        _.isEqual(pre.tableData, next.tableData) &&
        _.isEqual(pre.defaultVariableData, next.defaultVariableData) &&
        _.isEqual(pre.defaultField, next.defaultField) &&
        _.isEqual(pre.fieldHead, next.fieldHead) &&
        _.isEqual(pre.selectedRowKeys, next.selectedRowKeys) &&
        _.isEqual(pre.fieldCompletionData, next.fieldCompletionData) &&
        _.isEqual(pre.variableData, next.variableData)
    );
};
export default memo(LeftModalAdd, memoLeftModal);
// export default LeftModalAdd;
