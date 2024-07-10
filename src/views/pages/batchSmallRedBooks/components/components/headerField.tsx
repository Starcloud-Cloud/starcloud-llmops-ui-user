import { Modal, Form, Button, Popconfirm, Tag, Input, InputNumber, Switch, Select } from 'antd';
import { PlusOutlined } from '@ant-design/icons';
import { ActionType } from '@ant-design/pro-components';
import { useState, useRef, useEffect } from 'react';
import _ from 'lodash-es';
import TablePro from './antdProTable';
import { getColumn, createColumn, updateColumn, delColumn } from 'api/material/field';

const HeaderField = ({
    libraryId = '77',
    colOpen,
    setColOpen
}: {
    libraryId?: string;
    colOpen: boolean;
    setColOpen: (data: boolean) => void;
}) => {
    const [form] = Form.useForm();
    const [open, setOpen] = useState(false);
    const actionRef = useRef<ActionType>();
    const materialFieldTypeList = [
        { label: '字符串输入框', value: 0 },
        { label: '整数', value: 1 },
        { label: '时间', value: 2 },
        { label: '数字', value: 3 },
        { label: '布尔值', value: 4 },
        { label: '图片', value: 5 }
    ];
    const materialColumns: any = [
        {
            title: '字段名称',
            align: 'center',
            width: 400,
            required: true,
            dataIndex: 'columnName',
            formItemProps: {
                rules: [
                    {
                        required: true,
                        message: '请输入字段名称'
                    },
                    {
                        max: 16,
                        message: '字段名称不能超过 20 个字'
                    }
                ]
            }
        },
        {
            title: '字段类型',
            width: 200,
            required: true,
            dataIndex: 'columnType',
            align: 'center',
            valueType: 'select',
            fieldProps: {
                options: materialFieldTypeList
            },
            formItemProps: {
                rules: [
                    {
                        required: true,
                        message: '请选择字段类型'
                    }
                ]
            },
            render: (_: any, row: any) => materialFieldTypeList?.find((item) => item.value === row.type)?.label
        },
        {
            width: 200,
            title: '是否为分组字段',
            dataIndex: 'isGroupColumn',
            align: 'center',
            valueType: 'switch',
            render: (_: any, row: any) => (row?.isGroupColumn ? <Tag color="processing">是</Tag> : <Tag color="processing">否</Tag>)
        },
        {
            width: 200,
            title: '是否必填',
            dataIndex: 'isRequired',
            align: 'center',
            valueType: 'switch',
            render: (_: any, row: any) => (row?.isRequired ? <Tag color="processing">必填</Tag> : '')
        },
        {
            title: '操作',
            align: 'center',
            dataIndex: 'operation',
            width: 60,
            render: (text: any, row: any, index: any) => (
                <div className="w-full flex justify-center gap-2">
                    {/* <Button
                        type="link"
                        onClick={() => {
                            form.setFieldsValue(row);
                            setRowIndex(index);
                            setTitle('编辑字段配置');
                            setOpen(true);
                        }}
                    >
                        编辑
                    </Button> */}
                    <Popconfirm
                        title="提示"
                        description="请再次确认是否要删除"
                        onConfirm={async () => {
                            await delColumn({ id: row.id });
                            getList();
                        }}
                        okText="Yes"
                        cancelText="No"
                    >
                        <Button type="link" danger>
                            删除
                        </Button>
                    </Popconfirm>
                </div>
            )
        }
    ];
    const [tableData, setTableData] = useState<any[]>([]);
    //编辑
    const handleEditColumn = async (record: any, type = 1) => {
        await updateColumn(record);
        getList();
    };
    const [tableLoading, setTableLoading] = useState(false);
    const getList = async () => {
        setTableLoading(true);
        const result = await getColumn({ libraryId });
        setTableLoading(false);
        setTableData(result);
    };
    useEffect(() => {
        getList();
    }, []);
    return (
        <Modal width={'80%'} open={colOpen} onCancel={() => setColOpen(false)} footer={false} title="素材字段配置">
            <TablePro
                isSelection={true}
                isPagination={true}
                tableLoading={tableLoading}
                handleEditColumn={handleEditColumn}
                actionRef={actionRef}
                tableData={tableData}
                columns={materialColumns}
                setTableData={setTableData}
            />
            <Button
                onClick={() => {
                    setOpen(true);
                }}
                disabled={tableData.length >= 30}
                className="mt-4"
                type="primary"
                icon={<PlusOutlined />}
            >
                新增（{tableData.length}/30）
            </Button>
            <Modal
                title={'新增字段配置'}
                onOk={async () => {
                    const result = await form.validateFields();
                    await createColumn({ ...result, libraryId });
                    getList();
                    setOpen(false);
                    form.resetFields();
                }}
                open={open}
                onCancel={() => {
                    form.resetFields();
                    setOpen(false);
                }}
            >
                <Form labelCol={{ span: 6 }} form={form}>
                    <Form.Item
                        label="字段名称"
                        name="columnName"
                        rules={[
                            { required: true, message: '请输入字段名称' },
                            { max: 20, message: '字段名称不能超过 20 个字' }
                        ]}
                    >
                        <Input />
                    </Form.Item>
                    <Form.Item label="字段类型" name="columnType" rules={[{ required: true, message: '请选择字段类型' }]}>
                        <Select options={materialFieldTypeList} />
                    </Form.Item>
                    <Form.Item initialValue={0} label="字段序号" name="sequence" rules={[{ required: true, message: '请输入字段序号' }]}>
                        <InputNumber className="w-full" min={0} />
                    </Form.Item>
                    <Form.Item initialValue={false} label="是否为分组字段" name="isGroupColumn" valuePropName="checked">
                        <Switch />
                    </Form.Item>
                    <Form.Item initialValue={false} label="是否必填" name="isRequired" valuePropName="checked">
                        <Switch />
                    </Form.Item>
                </Form>
            </Modal>
        </Modal>
    );
};
export default HeaderField;
