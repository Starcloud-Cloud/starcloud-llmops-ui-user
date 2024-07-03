import { Select, Input, Row, Col, Tabs, Space, Button, Modal, Form, Switch, Avatar, message, Popconfirm } from 'antd';
import type { TabsProps } from 'antd';
import { useEffect, useRef, useState } from 'react';
import IconSelect, { MoreIcon, allIcons } from 'ui-component/IconSelect';
import Icon, { ApiOutlined, AppstoreOutlined, UploadOutlined } from '@ant-design/icons';
import { ActionType, CheckCard, ProColumns, ProTable } from '@ant-design/pro-components';
import { addMaterial, delMaterial, getMaterialPage, updateMaterial } from 'api/material';
import dayjs from 'dayjs';
import { dictData } from 'api/template';
const { Option } = Select;

const MaterialLibrary = () => {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [selectIcon, setSelectIcon] = useState('');
    const [typeList, setTypeList] = useState<any[]>([]);
    const [record, setRecord] = useState<any>(null);
    const actionRef = useRef<ActionType>();

    const IconRenderer = ({ value }: { value: string }) => {
        let SelectedIcon = value.includes('http') ? AppstoreOutlined : allIcons['AppstoreAddOutlined'];
        return <SelectedIcon />;
    };

    useEffect(() => {
        dictData('', 'material_format_type').then((res) => {
            setTypeList(res.list);
        });
    }, []);

    const handleTypeLabel = (value: string) => {
        return typeList.find((v) => v.value === value.toString())?.label || '未知';
    };

    const columns: ProColumns<any>[] = [
        {
            title: '名称',
            align: 'left',
            dataIndex: 'name',
            renderText: (_, record) => {
                return (
                    <div className="flex items-center">
                        <IconRenderer value={record.iconUrl} />
                        <span className="ml-2">{record.name}</span>
                    </div>
                );
            }
        },
        {
            title: '类型',
            align: 'center',
            dataIndex: 'formatType',
            search: false,
            renderText: (text) => handleTypeLabel(text)
        },
        {
            title: '数量',
            align: 'center',
            dataIndex: 'fileCount',
            search: false
        },
        {
            title: '创建时间',
            align: 'center',
            dataIndex: 'createTime',
            search: false,
            renderText: (text) => text && dayjs(text).format('YYYY-MM-DD')
        },
        {
            title: '操作',
            width: 100,
            search: false,
            align: 'center',
            render: (_, row) => (
                <Space>
                    <Button
                        type="link"
                        onClick={() => {
                            setRecord(row);
                            form.setFieldsValue(row);
                            setIsModalOpen(true);
                        }}
                    >
                        编辑
                    </Button>
                    <Popconfirm
                        title="确认"
                        description="删除该记录?"
                        onConfirm={async () => {
                            const data = await delMaterial({ id: row?.id });
                            if (data) {
                                message.success('删除成功');
                                actionRef.current?.reload();
                            }
                        }}
                        okText="是"
                        cancelText="否"
                    >
                        <Button danger type="link">
                            删除
                        </Button>
                    </Popconfirm>
                </Space>
            )
        }
    ];

    const TabsItems: TabsProps['items'] = [
        {
            label: '我的素材库',
            key: '1',
            children: (
                <div>
                    <ProTable
                        actionRef={actionRef}
                        columns={columns}
                        request={async (params) => {
                            params.pageNo = params.current;
                            const data = await getMaterialPage(params);
                            return {
                                data: data.list,
                                success: true,
                                total: data.total
                            };
                        }}
                        bordered
                        toolBarRender={() => [
                            <Button
                                type={'default'}
                                onClick={() => {
                                    setRecord(null);
                                    setIsModalOpen(true);
                                }}
                            >
                                新增
                            </Button>
                        ]}
                    />
                </div>
            )
        },
        { label: '系统素材库', key: '2', children: <div>222</div> }
    ];

    const showModal = () => {
        setIsModalOpen(true);
    };

    const handleOk = async () => {
        const values = await form.validateFields();
        const data = record ? await updateMaterial({ ...values, id: record.id }) : await addMaterial({ ...values, status: 1 });
        if (data?.id) {
            message.success('添加成功!');
            setIsModalOpen(false);
            actionRef.current?.reload();
        }
    };

    const handleCancel = () => {
        setIsModalOpen(false);
    };

    const [form] = Form.useForm();

    return (
        <div className="h-full">
            <Tabs items={TabsItems}></Tabs>
            {isModalOpen && (
                <Modal width={580} title={record ? '修改知识库' : '新增知识库'} open={isModalOpen} onOk={handleOk} onCancel={handleCancel}>
                    <Form layout="vertical" form={form}>
                        <Form.Item label="名称" name="name" rules={[{ required: true }]}>
                            <Input placeholder="填写名称" />
                        </Form.Item>
                        <Form.Item label="描述" name={'description'} rules={[{ required: true }]}>
                            <Input.TextArea placeholder="填写描述" />
                        </Form.Item>
                        <Form.Item label="分类" name="formatType" rules={[{ required: true }]}>
                            <Select placeholder="请选择分类">
                                {typeList.map((item, index) => (
                                    <Option key={index} value={item.value}>
                                        {item.label}
                                    </Option>
                                ))}
                            </Select>
                        </Form.Item>

                        <Icon component={selectIcon as any} />
                        <Form.Item label="图标" name="iconUrl" rules={[{ required: true }]}>
                            <IconSelect
                                onChange={(value) => {
                                    setSelectIcon(value);
                                }}
                                value={selectIcon}
                            />
                        </Form.Item>
                        <Form.Item name="checkbox-group" className="w-full" label="导入类型">
                            <CheckCard.Group style={{ width: '100%' }}>
                                <Row gutter={16}>
                                    <Col span={12}>
                                        <CheckCard
                                            disabled
                                            className="w-[100%]"
                                            title="本地文档"
                                            avatar={<UploadOutlined />}
                                            description="上传Excel或者CSV格式的文档"
                                            value="SpringBoot"
                                        />
                                    </Col>
                                    <Col span={12}>
                                        <CheckCard
                                            disabled
                                            className="w-[100%]"
                                            title="API"
                                            avatar={<ApiOutlined />}
                                            description="获取JSON格式API内容"
                                            value="SOFABoot"
                                        />
                                    </Col>
                                </Row>
                            </CheckCard.Group>
                        </Form.Item>
                        {/* <Form.Item label="是否系统库" rules={[{ required: true }]}>
                        <Switch />
                    </Form.Item>
                    <Form.Item label="是否分享给团队" rules={[{ required: true }]}>
                        <Switch />
                    </Form.Item> */}
                    </Form>
                </Modal>
            )}
        </div>
    );
};
export default MaterialLibrary;
