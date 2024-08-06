import { Modal, Form, Input, Select, Space, Button, Switch, Tree, Checkbox } from 'antd';
import { CheckCard } from '@ant-design/pro-components';
import { DownOutlined, SisternodeOutlined, DeleteOutlined } from '@ant-design/icons';
import { useState } from 'react';
import { v4 as uuidv4 } from 'uuid';
import './index.scss';
const AddPlug = ({ open, setOpen }: { open: boolean; setOpen: (data: boolean) => void }) => {
    const [form] = Form.useForm();
    const { TextArea } = Input;
    const sceneList = [
        {
            label: '数据新增',
            value: 1
        },
        {
            label: '数据补齐',
            value: 2
        },
        {
            label: '数据提取',
            value: 3
        },
        {
            label: '数据修改',
            value: 4
        },
        {
            label: '图片分析',
            value: 5
        }
    ];
    const wayList = [
        {
            label: 'coze',
            value: 1
        },
        {
            label: '应用市场',
            value: 2
        }
    ];
    const accountList = [
        {
            label: '账号 1',
            value: 1
        },
        {
            label: '账号 2',
            value: 2
        }
    ];
    const botList = [
        {
            label: '机器人 1',
            value: 1
        },
        {
            label: '机器人 2',
            value: 2
        }
    ];
    const handleOk = async () => {
        const result = await form.validateFields();
        console.log(result);
    };

    const typeList = [
        { label: 'String', value: 'String' },
        { label: 'Integer', value: 'Integer' },
        { label: 'Boolean', value: 'Boolean' },
        { label: 'Number', value: 'Number' },
        { label: 'Object', value: 'Object' },
        { label: 'Array<String>', value: 'Array<String>' },
        { label: 'Array<Integer>', value: 'Array<Integer>' },
        { label: 'Array<Boolean>', value: 'Array<Boolean>' },
        { label: 'Array<Object>', value: 'Array<Object>' }
    ];
    const [treeData, setTreeData] = useState<any[]>([]);
    const removeTree = (key: string | number) => {
        const removeNodeRecursively = (data: any) => {
            return data
                .filter((node: any) => node.key !== key)
                .map((node: any) => ({
                    ...node,
                    children: node.children ? removeNodeRecursively(node.children) : []
                }));
        };
        setTreeData(removeNodeRecursively(treeData));
    };
    const addTree = (key: string | number, newNode: any) => {
        const addNodeRecursively = (data: any[]) => {
            return data.map((node: any) => {
                if (node.key === key) {
                    if (!node.children) {
                        node.children = [];
                    }
                    node.children.push(newNode);
                } else if (node.children) {
                    node.children = addNodeRecursively(node.children);
                }
                return node;
            });
        };
        setTreeData(addNodeRecursively(treeData));
    };
    const updateTree = (key: string | number, label: string, value: string | boolean) => {
        const editNodeRecursively = (data: any) => {
            return data.map((nodes: any) => {
                if (nodes.key === key) {
                    return {
                        ...nodes,
                        [label]: value,
                        children: label === 'variableType' && value !== 'Object' && value !== 'Array<Object>' ? [] : nodes.children
                    };
                } else if (nodes.children) {
                    nodes.children = editNodeRecursively(nodes.children);
                }
                return nodes;
            });
        };
        setTreeData(editNodeRecursively(treeData));
    };

    const [plugOpen, setPlugOpen] = useState(false);
    const [bindLoading, setBindLoading] = useState(false);

    return (
        <Modal title="插件配置" width={'60%'} onOk={handleOk} open={open} onCancel={() => setOpen(false)}>
            <Form form={form} labelCol={{ span: 6 }}>
                <Form.Item label="插件名称" name="name" rules={[{ required: true, message: '插件名称必填' }]}>
                    <Input />
                </Form.Item>
                <Form.Item label="使用场景" name="scene" initialValue={1}>
                    <CheckCard.Group size="small">
                        {sceneList.map((item) => (
                            <CheckCard title={item.label} description={item.label} value={item.value} />
                        ))}
                    </CheckCard.Group>
                </Form.Item>
                <Form.Item label="实现方式">
                    <Form.Item name="way" initialValue={1}>
                        <CheckCard.Group size="small">
                            {wayList.map((item) => (
                                <CheckCard title={item.label} description={item.label} value={item.value} />
                            ))}
                        </CheckCard.Group>
                    </Form.Item>
                    <Space wrap={true}>
                        <Form.Item
                            className="w-[310px]"
                            label="Coze 绑定的账号"
                            name="account"
                            rules={[{ required: true, message: 'Coze 绑定的账号必填' }]}
                        >
                            <Select options={accountList} />
                        </Form.Item>
                        <Form.Item label="空间 ID" name="spaceID" rules={[{ required: true, message: '空间 ID必填' }]}>
                            <Input />
                        </Form.Item>
                        <Form.Item
                            className="w-[310px]"
                            label="选择 Coze 机器人"
                            name="bot"
                            rules={[{ required: true, message: 'Bot 必填' }]}
                        >
                            <Select options={botList} />
                        </Form.Item>
                    </Space>
                    <Button type="primary" onClick={() => setPlugOpen(true)}>
                        验证执行结果返回结果
                    </Button>
                </Form.Item>
                <Form.Item label="入参数据示例" name="result">
                    <TextArea rows={6} />
                </Form.Item>
                <Form.Item label="出参数据示例" name="res">
                    <TextArea rows={6} />
                </Form.Item>
                <Form.Item label="发布到应用市场" name="switch" valuePropName="checked" initialValue={true}>
                    <Switch />
                </Form.Item>
            </Form>
            <div className="tree">
                <Tree
                    showLine
                    selectable={false}
                    switcherIcon={<DownOutlined />}
                    treeData={treeData}
                    titleRender={(node) => (
                        <div className="flex gap-4 items-center">
                            <Input
                                placeholder="请输入变量名"
                                defaultValue={node.variableName}
                                onBlur={(e) => {
                                    if (e.target.value !== node.variableName && e.target.value) {
                                        updateTree(node.key, 'variableName', e.target.value);
                                    }
                                }}
                                className="flex-1"
                            />
                            <Select
                                value={node.variableType}
                                onChange={(value) => {
                                    updateTree(node.key, 'variableType', value);
                                }}
                                className="w-[143px]"
                                options={typeList}
                            />
                            <TextArea
                                defaultValue={node.variableDesc}
                                placeholder="请描述变量的用途"
                                onBlur={(e) => {
                                    if (e.target.value !== node.variableName && e.target.value) {
                                        updateTree(node.key, 'variableDesc', e.target.value);
                                    }
                                }}
                                rows={1}
                                className="w-[243px]"
                            />
                            <Checkbox checked={node.required} onChange={(e) => updateTree(node.key, 'required', e.target.checked)} />
                            <div className="w-[24px]">
                                {(node.variableType === 'Object' || node.variableType === 'Array<Object>') && (
                                    <Button
                                        size="small"
                                        type="primary"
                                        shape="circle"
                                        icon={
                                            <SisternodeOutlined
                                                onClick={() =>
                                                    addTree(node.key, {
                                                        key: uuidv4(),
                                                        variableName: '',
                                                        variableType: 'String',
                                                        variableDesc: '',
                                                        required: false,
                                                        children: []
                                                    })
                                                }
                                            />
                                        }
                                    />
                                )}
                            </div>

                            <Button danger size="small" shape="circle" icon={<DeleteOutlined onClick={() => removeTree(node.key)} />} />
                        </div>
                    )}
                />
            </div>
            <Button
                onClick={() => {
                    setTreeData([
                        ...treeData,
                        {
                            key: uuidv4(),
                            variableName: '',
                            variableType: 'String',
                            variableDesc: '',
                            required: false,
                            children: []
                        }
                    ]);
                }}
            >
                新增
            </Button>
            <Modal width="60%" title="绑定验证" open={plugOpen} onCancel={() => setPlugOpen(false)}>
                <Form labelCol={{ span: 6 }}>
                    <Form.Item label="机器人名称">
                        <div>(验证状态)</div>
                    </Form.Item>
                    <Form.Item label="Coze参数验证">
                        <Space>
                            <Input />
                            <Button
                                loading={bindLoading}
                                onClick={() => {
                                    setBindLoading(true);
                                }}
                                type="primary"
                            >
                                绑定验证
                            </Button>
                        </Space>
                    </Form.Item>
                    {/* <div className='text-xs text-black/50'></div> */}
                    <Form.Item label="入参数据示例">
                        <TextArea rows={6} />
                        <div className="text-xs text-black/50 mt-[5px]">验证通过之后会自动更新，无法直接修改</div>
                    </Form.Item>
                    <Form.Item label="出参数据示例">
                        <TextArea rows={6} />
                        <div className="text-xs text-black/50 mt-[5px]">验证通过之后会自动更新，无法直接修改</div>
                    </Form.Item>
                </Form>
            </Modal>
        </Modal>
    );
};
export default AddPlug;
