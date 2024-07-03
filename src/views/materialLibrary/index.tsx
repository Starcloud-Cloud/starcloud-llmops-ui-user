import { Select, Input, Row, Col, Tabs, Table, Space, Button, Modal, Form, Switch, Avatar } from 'antd';
import type { TabsProps, TableProps } from 'antd';
import { useEffect, useState } from 'react';
import IconSelect from 'ui-component/IconSelect';
import Icon, { ApiOutlined, UploadOutlined } from '@ant-design/icons';
import { CheckCard } from '@ant-design/pro-components';
const { Option } = Select;

const MaterialLibrary = () => {
    const [tableData, setTableData] = useState<any[]>([]);
    const [isModalOpen, setIsModalOpen] = useState(true);
    const [selectIcon, setSelectIcon] = useState('');

    const columns: TableProps<any>['columns'] = [
        {
            title: '名称',
            align: 'center',
            dataIndex: 'name'
        },
        {
            title: '类型',
            align: 'center',
            dataIndex: 'type'
        },
        {
            title: '数量',
            align: 'center',
            dataIndex: 'num'
        },
        {
            title: '创建时间',
            align: 'center',
            dataIndex: 'num'
        },
        {
            title: '操作',
            width: 100,
            align: 'center',
            render: (_, row) => (
                <Space>
                    <Button type="link">编辑</Button>
                    <Button danger type="link">
                        删除
                    </Button>
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
                    <Table columns={columns} dataSource={tableData} />
                </div>
            )
        },
        { label: '系统素材库', key: '2', children: <div>222</div> }
    ];

    useEffect(() => {}, []);

    const showModal = () => {
        setIsModalOpen(true);
    };

    const handleOk = () => {
        setIsModalOpen(false);
    };

    const handleCancel = () => {
        setIsModalOpen(false);
    };

    return (
        <div className="bg-white h-full p-4">
            <Row gutter={[16, 16]}>
                <Col xxl={4} lg={6} md={8} xs={12} sm={24}>
                    <Input placeholder="搜索" />
                </Col>
                <Col xxl={4} lg={6} md={8} xs={12} sm={24}>
                    <Select className="w-full">
                        <Option value={1}>123</Option>
                    </Select>
                </Col>
            </Row>
            <Tabs items={TabsItems}></Tabs>
            <Modal width={580} title="创建知识库" open={isModalOpen} onOk={handleOk} onCancel={handleCancel}>
                <Form layout="vertical">
                    <Form.Item label="名称" name="disabled" rules={[{ required: true }]}>
                        <Input placeholder="填写名称" />
                    </Form.Item>
                    <Form.Item label="描述" rules={[{ required: true }]}>
                        <Input.TextArea placeholder="填写描述" />
                    </Form.Item>
                    <Form.Item label="分类" rules={[{ required: true }]}>
                        <Select>
                            <Option value={1}>123</Option>
                            <Option value={2}>123</Option>
                        </Select>
                    </Form.Item>

                    <Icon component={selectIcon as any} />
                    <Form.Item label="图标" rules={[{ required: true }]}>
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
                                        className="w-[100%]"
                                        title="本地文档"
                                        avatar={<UploadOutlined />}
                                        description="上传Excel或者CSV格式的文档"
                                        value="SpringBoot"
                                    />
                                </Col>
                                <Col span={12}>
                                    <CheckCard
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
                    <Form.Item label="是否系统库" rules={[{ required: true }]}>
                        <Switch />
                    </Form.Item>
                    <Form.Item label="是否分享给团队" rules={[{ required: true }]}>
                        <Switch />
                    </Form.Item>
                </Form>
            </Modal>
        </div>
    );
};
export default MaterialLibrary;
