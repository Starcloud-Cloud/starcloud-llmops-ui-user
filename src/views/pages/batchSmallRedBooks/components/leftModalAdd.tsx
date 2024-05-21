import { Modal, Button, Table, Popconfirm, Form, Input, Select, Switch, InputNumber, Tag } from 'antd';
import type { TableProps } from 'antd';
import { useEffect, useState } from 'react';
import AiCreate from './AICreate';
import _ from 'lodash-es';
import { PlusOutlined } from '@ant-design/icons';
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
    materialType,
    selectedRowKeys,
    setcustom,
    setField,
    downTableData,
    setSelectedRowKeys,
    setFieldCompletionData,
    fieldCompletionData,
    setVariableData,
    variableData
}: {
    zoomOpen: boolean;
    setZoomOpen: (data: boolean) => void;
    tableLoading: boolean;
    columns: any[];
    MokeList: any[];
    materialType: any;
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
    setFieldCompletionData: (data: any) => void;
    fieldCompletionData: any;
    setVariableData: (data: any) => void;
    variableData: any;
}) => {
    const handleDels = () => {
        const newData = tableData?.filter((item) => {
            return !selectedRowKeys?.find((el: any) => el === item.uuid);
        });
        changeTableValue(newData);
    };
    const [colOpen, setColOpen] = useState(false);
    const materialColumns: TableProps<any>['columns'] = [
        {
            title: '字段 Code',
            dataIndex: 'fieldName',
            align: 'center'
        },
        {
            title: '字段名称',
            dataIndex: 'desc',
            align: 'center'
        },
        {
            title: '字段类型',
            dataIndex: 'type',
            align: 'center'
        },
        {
            title: '是否必填',
            render: (_, row) => <Tag color="processing">{row?.required ? '必填' : '不必填'}</Tag>,
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
    const options = [
        { label: '字符串', value: 'string' },
        { label: '图片', value: 'image' },
        { label: '富文本', value: 'textBox' }
    ];
    return (
        <Modal maskClosable={false} width={'70%'} open={zoomOpen} footer={null} onCancel={() => setZoomOpen(false)}>
            <div className="flex gap-2 justify-between my-[20px]">
                <Button disabled={selectedRowKeys?.length === 0} type="primary" onClick={handleDels}>
                    批量删除({selectedRowKeys?.length})
                </Button>
                <div className="flex gap-2">
                    <Button type="primary" onClick={() => setColOpen(true)}>
                        素材字段配置
                    </Button>
                    <AiCreate
                        title="AI 素材生成"
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
            <Modal width={'80%'} open={colOpen} onCancel={() => setColOpen(false)} footer={false} title="素材字段配置">
                <div className="flex justify-end">
                    <Button
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
                        新增
                    </Button>
                </div>
                <Table columns={materialColumns} dataSource={materialTableData} />
                <div className="flex justify-center mt-4">
                    <Button type="primary">保存</Button>
                </div>
            </Modal>
            <Modal
                title={materialTitle}
                onOk={async () => {
                    const result = await form.validateFields();
                    if (rowIndex === -1) {
                        setMaterialTableData([result, ...materialTableData]);
                    } else {
                        const newData = [...materialTableData];
                        newData.splice(rowIndex, 1, result);
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
                    <Form.Item label="字段 Code" name="fieldName" rules={[{ required: true, message: '请输入字段 Code' }]}>
                        <Input />
                    </Form.Item>
                    <Form.Item label="字段名称" name="desc" rules={[{ required: true, message: '请输入字段名称' }]}>
                        <Input />
                    </Form.Item>
                    <Form.Item label="字段类型" name="type" rules={[{ required: true, message: '请选择字段类型' }]}>
                        <Select options={options} />
                    </Form.Item>
                    <Form.Item label="字段排序" name="order" rules={[{ required: true, message: '请输入字段排序' }]}>
                        <InputNumber className="w-full" min={1} />
                    </Form.Item>
                    <Form.Item
                        initialValue={false}
                        label="是否必填"
                        name="required"
                        rules={[{ required: true, message: '请选择是否必填' }]}
                    >
                        <Switch />
                    </Form.Item>
                </Form>
            </Modal>
        </Modal>
    );
};
export default LeftModalAdd;
