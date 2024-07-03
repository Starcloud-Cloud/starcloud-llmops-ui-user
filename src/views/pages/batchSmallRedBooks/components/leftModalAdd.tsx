import { Modal, Button, Tooltip } from 'antd';
import type { DragEndEvent } from '@dnd-kit/core';
import { arrayMove } from '@dnd-kit/sortable';
import { useEffect, useState, memo } from 'react';
import AiCreate from './AICreate';
import _ from 'lodash-es';
import FieldImage from 'assets/images/icons/field.svg';
import { v4 as uuidv4 } from 'uuid';
import TablePro from './components/antdProTable';
import HeaderField from './components/headerField';
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
    console.log(9999);

    const handleDels = () => {
        const newData = tableData?.filter((item) => {
            return !selectedRowKeys?.find((el: any) => el === item.uuid);
        });
        changeTableValue(newData);
    };
    // const materialColumns: TableProps<any>['columns'] = [
    //     {
    //         title: '字段名称',
    //         dataIndex: 'desc',
    //         align: 'center'
    //     },
    //     {
    //         title: '字段类型',
    //         render: (_, row) => materialFieldTypeList?.find((item) => item.value === row.type)?.label,
    //         align: 'center'
    //     },
    //     {
    //         title: '是否为分组',
    //         render: (_, row) => <Tag color="processing">{row?.isGroupField ? '是' : '否'}</Tag>,
    //         align: 'center'
    //     },
    //     {
    //         title: '是否必填',
    //         render: (_, row) => (row?.required ? <Tag color="processing">必填</Tag> : ''),
    //         align: 'center'
    //     },
    //     {
    //         title: '排序',
    //         dataIndex: 'order',
    //         align: 'center'
    //     },
    //     {
    //         title: '操作',
    //         width: 120,
    //         render: (_, row, index) => (
    //             <div className="flex gap-2">
    //                 <Button
    //                     type="link"
    //                     onClick={() => {
    //                         form.setFieldsValue(row);
    //                         setRowIndex(index);
    //                         setMaterialTitle('编辑');
    //                         setFormOpen(true);
    //                     }}
    //                 >
    //                     编辑
    //                 </Button>
    //                 <Popconfirm
    //                     title="提示"
    //                     description="请再次确认是否要删除"
    //                     onConfirm={() => {
    //                         const newData = materialTableData?.filter((item, i) => i !== index);
    //                         setMaterialTableData(newData);
    //                     }}
    //                     okText="Yes"
    //                     cancelText="No"
    //                 >
    //                     <Button type="link" danger>
    //                         删除
    //                     </Button>
    //                 </Popconfirm>
    //             </div>
    //         ),
    //         align: 'center'
    //     }
    // ];
    const [materialTableData, setMaterialTableData] = useState<any[]>([]);
    // const [rowIndex, setRowIndex] = useState(-1);
    // const [formOpen, setFormOpen] = useState(false);
    // const [materialTitle, setMaterialTitle] = useState('');
    // const [form] = Form.useForm();

    const onDragEnd = ({ active, over }: DragEndEvent) => {
        if (active.id !== over?.id) {
            const newList = (prevState: any) => {
                const activeIndex = prevState.findIndex((record: any) => record.uuid === active?.id);
                const overIndex = prevState.findIndex((record: any) => record.uuid === over?.id);
                return arrayMove(prevState, activeIndex, overIndex);
            };
            setMaterialTableData(newList(materialTableData));
        }
    };
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
                        <AiCreate
                            title="AI 素材生成"
                            detail={detail}
                            setColOpen={setColOpen}
                            materialType={materialType}
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
                            setFieldCompletionData={setFieldCompletionData}
                            fieldCompletionData={fieldCompletionData}
                            setVariableData={setVariableData}
                            variableData={variableData}
                        />
                        {detail && (
                            <Tooltip title="素材字段配置">
                                <img onClick={() => setColOpen(true)} className="w-[28px] cursor-pointer" src={FieldImage} />
                            </Tooltip>
                        )}
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
            <HeaderField
                colOpen={colOpen}
                setColOpen={setColOpen}
                onDragEnd={onDragEnd}
                materialFieldTypeList={materialFieldTypeList}
                materialTableData={materialTableData}
                setMaterialTableData={setMaterialTableData}
                setFieldHeads={setFieldHeads}
            />
            {/* <Modal
                title={materialTitle}
                onOk={async () => {
                    const result = await form.validateFields();
                    const newData = _.cloneDeep(materialTableData);
                    if (rowIndex === -1) {
                        newData.unshift(result);
                        newData?.sort((a, b) => a.order - b.order);
                        setMaterialTableData(newData);
                    } else {
                        newData.splice(rowIndex, 1, { ...newData[rowIndex], ...result });
                        newData?.sort((a, b) => a.order - b.order);
                        setMaterialTableData(newData);
                    }
                    form.resetFields();
                    setFormOpen(false);
                }}
                open={formOpen}
                onCancel={() => {
                    form.resetFields();
                    setFormOpen(false);
                }}
            >
                <Form labelCol={{ span: 6 }} form={form}>
                    <Form.Item
                        label="字段名称"
                        name="desc"
                        rules={[
                            { required: true, message: '请输入字段名称' },
                            { max: 20, message: '字段名称不能超过 20 个字' }
                            // { pattern:'', message: '字段名称不能存在空格和符号' },
                        ]}
                    >
                        <Input />
                    </Form.Item>
                    <Form.Item label="字段类型" name="type" rules={[{ required: true, message: '请选择字段类型' }]}>
                        <Select options={materialFieldTypeList} />
                    </Form.Item>
                    <Form.Item initialValue={0} label="字段排序" name="order" rules={[{ required: true, message: '请输入字段排序' }]}>
                        <InputNumber className="w-full" min={0} />
                    </Form.Item>
                    <Form.Item initialValue={false} label="是否为分组字段" name="isGroupField" valuePropName="checked">
                        <Switch />
                    </Form.Item>
                    <Form.Item initialValue={false} label="是否必填" name="required" valuePropName="checked">
                        <Switch />
                    </Form.Item>
                </Form>
            </Modal> */}
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
