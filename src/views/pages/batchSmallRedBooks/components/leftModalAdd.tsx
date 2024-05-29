import { Modal, Button, Table, Popconfirm, Form, Input, Select, Switch, InputNumber, Tag, Tooltip } from 'antd';
import type { TableProps } from 'antd';
import { useEffect, useState } from 'react';
import AiCreate from './AICreate';
import _ from 'lodash-es';
import { PlusOutlined } from '@ant-design/icons';
import { materialJudge } from 'api/redBook/batchIndex';
import { materialFieldCode } from 'api/redBook/batchIndex';
import { useLocation } from 'react-router-dom';
import FieldImage from 'assets/images/icons/field.svg';
const LeftModalAdd = ({
    zoomOpen,
    setZoomOpen,
    colOpen,
    setColOpen,
    tableLoading,
    columns,
    tableData,
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
    variableData,
    setMaterialTypeStatus
}: {
    zoomOpen: boolean;
    setZoomOpen: (data: boolean) => void;
    colOpen: boolean;
    setColOpen: (data: boolean) => void;
    tableLoading: boolean;
    columns: any[];
    MokeList: any[];
    materialFieldTypeList: any[];
    materialType: any;
    tableData: any[];
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
    setMaterialTypeStatus: (data: any) => void;
    variableData: any;
}) => {
    const location = useLocation();
    const searchParams = new URLSearchParams(location.search);
    const handleDels = () => {
        const newData = tableData?.filter((item) => {
            return !selectedRowKeys?.find((el: any) => el === item.uuid);
        });
        changeTableValue(newData);
    };
    const materialColumns: TableProps<any>['columns'] = [
        {
            title: '字段名称',
            dataIndex: 'desc',
            align: 'center'
        },
        {
            title: '字段类型',
            render: (_, row) => materialFieldTypeList?.find((item) => item.value === row.type)?.label,
            align: 'center'
        },
        {
            title: '是否必填',
            render: (_, row) => (row?.required ? <Tag color="processing">必填</Tag> : ''),
            align: 'center'
        },
        {
            title: '排序',
            dataIndex: 'order',
            align: 'center'
        },
        {
            title: '操作',
            width: 120,
            render: (_, row, index) => (
                <div className="flex gap-2">
                    <Button
                        type="link"
                        onClick={() => {
                            console.log(row);

                            form.setFieldsValue(row);
                            setRowIndex(index);
                            setMaterialTitle('编辑');
                            setFormOpen(true);
                        }}
                    >
                        编辑
                    </Button>
                    <Popconfirm
                        title="提示"
                        description="请再次确认是否要删除"
                        onConfirm={() => {
                            const newData = materialTableData?.filter((item, i) => i !== index);
                            setMaterialTableData(newData);
                        }}
                        okText="Yes"
                        cancelText="No"
                    >
                        <Button type="link" danger>
                            删除
                        </Button>
                    </Popconfirm>
                </div>
            ),
            align: 'center'
        }
    ];
    const [materialTableData, setMaterialTableData] = useState<any[]>([]);
    const [rowIndex, setRowIndex] = useState(-1);
    const [formOpen, setFormOpen] = useState(false);
    const [materialTitle, setMaterialTitle] = useState('');
    const [form] = Form.useForm();
    useEffect(() => {
        if (fieldHead) {
            setMaterialTableData(fieldHead);
        }
    }, [fieldHead]);
    return (
        <Modal maskClosable={false} width={'80%'} open={zoomOpen} footer={null} onCancel={() => setZoomOpen(false)}>
            <div className="flex gap-2 justify-between my-[20px]">
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
                    <Tooltip title="素材字段配置">
                        <img className="w-[28px] cursor-pointer" src={FieldImage} />
                    </Tooltip>
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
            <Modal width={'80%'} open={colOpen} onCancel={() => setColOpen(false)} footer={false} title="素材字段配置">
                <div className="flex justify-end">
                    <Button
                        disabled={materialTableData?.length === 20}
                        size="small"
                        className="mb-4"
                        onClick={() => {
                            setMaterialTitle('新增');
                            setRowIndex(-1);
                            setFormOpen(true);
                        }}
                        icon={<PlusOutlined rev={undefined} />}
                        type="primary"
                    >
                        新增({materialTableData?.length || 0}/20)
                    </Button>
                </div>
                <Table pagination={false} columns={materialColumns} dataSource={materialTableData} />
                <div className="flex justify-center mt-4">
                    <Button
                        type="primary"
                        disabled={materialTableData?.length === 0}
                        onClick={async () => {
                            const result = await materialFieldCode({
                                fieldConfigDTOList: materialTableData
                            });
                            setMaterialTableData(result);
                            try {
                                setFieldHeads && setFieldHeads(JSON.stringify(result));
                                setColOpen(false);
                            } catch (err) {
                                console.log(err);
                            }
                            const judge = await materialJudge({
                                uid: searchParams.get('uid'),
                                planSource: searchParams.get('appUid') ? 'market' : 'app'
                            });

                            setMaterialTypeStatus(judge);
                        }}
                    >
                        保存
                    </Button>
                </div>
            </Modal>
            <Modal
                title={materialTitle}
                onOk={async () => {
                    const result = await form.validateFields();
                    console.log(result);
                    const newData = _.cloneDeep(materialTableData);
                    if (rowIndex === -1) {
                        newData.unshift(result);
                        newData?.sort((a, b) => a.order - b.order);
                        setMaterialTableData(newData);
                    } else {
                        newData.splice(rowIndex, 1, { ...newData[rowIndex], ...result });
                        newData?.sort((a, b) => a.order - b.order);
                        console.log(newData);

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
                            { max: 30, message: '字段名称不能超过 30 个字' }
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
                    <Form.Item initialValue={false} label="是否必填" name="required" valuePropName="checked">
                        <Switch />
                    </Form.Item>
                </Form>
            </Modal>
        </Modal>
    );
};
export default LeftModalAdd;
