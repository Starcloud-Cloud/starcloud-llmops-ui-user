import { Modal, Form, Input, Select, Space, Button, Switch, Tree, Checkbox, message, Radio } from 'antd';
import { CheckCard } from '@ant-design/pro-components';
import { DownOutlined, SisternodeOutlined, DeleteOutlined } from '@ant-design/icons';
import { useEffect, useState } from 'react';
import { v4 as uuidv4 } from 'uuid';
import './index.scss';
import { plugVerify, createPlug, modifyPlug, cozePage, spaceBots, plugPublish } from 'api/redBook/plug';
import _ from 'lodash-es';
const AddPlug = ({
    open,
    setOpen,
    wayList,
    sceneList,
    rows,
    setRows,
    getTablePlugList
}: {
    open: boolean;
    setOpen: (data: boolean) => void;
    wayList: any[];
    sceneList: any[];
    rows: any;
    setRows: (data: any) => void;
    getTablePlugList: () => void;
}) => {
    const [form] = Form.useForm();
    const { TextArea } = Input;
    const { Option } = Select;

    const [accountList, setAccountList] = useState<any[]>([]);
    const [botList, setBotList] = useState<any[]>([]);
    const [bindData, setBindData] = useState({
        content: '',
        arguments: '',
        output: ''
    });
    const getBotList = async (label: string, value: any) => {
        if (label === 'spaceId') {
            if (value && form.getFieldValue('accessTokenId')) {
                const res = await spaceBots({
                    accessTokenId: form.getFieldValue('accessTokenId'),
                    spaceId: value
                });
                setBotList(res.space_bots);
            }
        } else {
            if (value && form.getFieldValue('spaceId')) {
                const res = await spaceBots({
                    accessTokenId: value,
                    spaceId: form.getFieldValue('spaceId')
                });
                setBotList(res.space_bots);
            }
        }
    };
    const handleOk = async () => {
        const result = await form.validateFields();
        if (rows) {
            await plugPublish(rows.uid);
            message.success('发布成功');
            await modifyPlug({
                ...result,
                botId: undefined,
                accessTokenId: undefined,
                entityUid: result.botId,
                cozeTokenId: result.accessTokenId,
                uid: rows.uid
            });
            message.success('编辑成功');
        } else {
            await createPlug({
                ...result,
                botId: undefined,
                accessTokenId: undefined,
                entityUid: '7398039516847767602',
                cozeTokenId: '1'
                // entityUid:result.botId ,
                // cozeTokenId: result.accessTokenId,
            });
            message.success('新增成功');
        }

        setRows(null);
        setOpen(false);
        form.resetFields();
        getTablePlugList();
    };

    useEffect(() => {
        cozePage({ pageNo: 1, pageSize: 100 }).then((res) => {
            const newList = res.list?.filter((item: any) => item.type === 35);
            setAccountList(newList);
        });
    }, []);
    useEffect(() => {
        if (rows) {
            form.setFieldsValue({
                ...rows,
                botId: rows.entityUid,
                accessTokenId: rows.cozeTokenId
            });
        }
    }, [rows]);

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
        <Modal
            title="插件配置"
            width={'60%'}
            footer={false}
            open={open}
            onCancel={() => {
                setOpen(false);
                setRows(null);
                form.resetFields();
            }}
        >
            <Form form={form} labelCol={{ span: 4 }}>
                <Form.Item label="插件名称" name="pluginName" rules={[{ required: true, message: '插件名称必填' }]}>
                    <Input />
                </Form.Item>
                <Form.Item label="使用场景" name="scene" initialValue={'DATA_ADDED'}>
                    <CheckCard.Group size="small">
                        {sceneList.map((item) => (
                            <CheckCard disabled={rows ? true : false} title={item.label} description={item.label} value={item.value} />
                        ))}
                    </CheckCard.Group>
                </Form.Item>
                <Form.Item label="实现方式">
                    <Form.Item name="type" initialValue={'coze'}>
                        <Radio.Group size="small" options={wayList} disabled={rows ? true : false} />
                    </Form.Item>
                    <Form.Item shouldUpdate={(prevValues, currentValues) => prevValues.type !== currentValues.type}>
                        {({ getFieldValue }) => {
                            const firstInputValue = getFieldValue('type');
                            return firstInputValue === 'coze' ? (
                                <>
                                    <Space wrap={true}>
                                        <Form.Item
                                            className="w-[400px]"
                                            label="Coze 绑定的账号"
                                            name="accessTokenId"
                                            rules={[{ required: true, message: 'Coze 绑定的账号必填' }]}
                                        >
                                            <Select onChange={(e) => getBotList('accessTokenId', e)}>
                                                {accountList?.map((item) => (
                                                    <Option key={item.id} value={item.id}>
                                                        {item.nickname}
                                                    </Option>
                                                ))}
                                            </Select>
                                        </Form.Item>
                                        <Form.Item
                                            className="w-[400px]"
                                            label="空间 ID"
                                            name="spaceId"
                                            rules={[{ required: true, message: '空间 ID必填' }]}
                                        >
                                            <Input onBlur={async (e) => getBotList('spaceId', e.target.value)} />
                                        </Form.Item>
                                        <Form.Item
                                            className="w-[400px]"
                                            label="选择 Coze 机器人"
                                            name="botId"
                                            rules={[{ required: true, message: 'Bot 必填' }]}
                                        >
                                            <Select>
                                                {botList.map((item) => (
                                                    <Option key={item.bot_id} value={item.bot_id}>
                                                        {item.bot_name}
                                                    </Option>
                                                ))}
                                            </Select>
                                        </Form.Item>
                                    </Space>
                                    <Button
                                        type="primary"
                                        onClick={async () => {
                                            await form.validateFields(['accessTokenId', 'spaceId', 'botId']);
                                            setPlugOpen(true);
                                        }}
                                    >
                                        验证执行结果
                                    </Button>
                                </>
                            ) : null;
                        }}
                    </Form.Item>
                </Form.Item>
                <Form.Item label="入参数据示例" name="input">
                    <TextArea disabled rows={6} />
                </Form.Item>
                <Form.Item label="出参数据示例" name="output">
                    <TextArea disabled rows={6} />
                </Form.Item>
                {rows && (
                    <Form.Item label="发布到应用市场" name="published" valuePropName="checked" initialValue={false}>
                        <Switch />
                    </Form.Item>
                )}
            </Form>
            <Modal width="60%" title="绑定验证" open={plugOpen} footer={null} onCancel={() => setPlugOpen(false)}>
                <Form labelCol={{ span: 6 }}>
                    <Form.Item label="机器人名称">
                        <div>({botList?.find((item) => item.bot_id)?.bot_name})</div>
                    </Form.Item>
                    <Form.Item label="Coze参数验证">
                        <Space>
                            <Input value={bindData.content} onChange={(e) => setBindData({ ...bindData, content: e.target.value })} />
                            <Button
                                loading={bindLoading}
                                onClick={async () => {
                                    setBindLoading(true);
                                    try {
                                        const res = await plugVerify({
                                            botId: '7398039516847767602',
                                            accessTokenId: '1',
                                            content: 'https://mp.weixin.qq.com/s/_RHcCKx-ZbqqqV7qTWGbTw'
                                            // accessTokenId: form.getFieldValue('accessTokenId'),
                                            // content: bindData.content,
                                            // botId: form.getFieldValue('botId')
                                        });
                                        setBindData({
                                            ...bindData,
                                            arguments: JSON.stringify(res.arguments),
                                            output: JSON.stringify(res.output)
                                        });
                                        setBindLoading(false);
                                    } catch (err) {
                                        setBindLoading(false);
                                    }
                                }}
                                type="primary"
                            >
                                绑定验证
                            </Button>
                        </Space>
                    </Form.Item>
                    <Form.Item label="验证状态">
                        <div className="text-xs"></div>
                    </Form.Item>
                    <Form.Item label="入参数据示例">
                        <TextArea value={bindData.arguments} disabled rows={6} />
                        <div className="text-xs text-black/50 mt-[5px]">验证通过之后会自动更新，无法直接修改</div>
                    </Form.Item>
                    <Form.Item label="出参数据示例">
                        <TextArea value={bindData.output} disabled rows={6} />
                        <div className="text-xs text-black/50 mt-[5px]">验证通过之后会自动更新，无法直接修改</div>
                    </Form.Item>
                </Form>
                <div className="flex justify-center">
                    <Button
                        className="w-[100px]"
                        disabled={!bindData.output && !bindData.arguments ? true : false}
                        onClick={() => {
                            form.setFieldValue('input', bindData.arguments);
                            form.setFieldValue('output', bindData.output);
                            setBindData({
                                content: '',
                                arguments: '',
                                output: ''
                            });
                            setPlugOpen(false);
                        }}
                        type="primary"
                    >
                        确认
                    </Button>
                </div>
            </Modal>
            <div className="flex justify-center">
                <Button onClick={handleOk} type="primary" className="w-[100px]">
                    保存
                </Button>
            </div>
            {/* <div className="tree">
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
            </Button> */}
        </Modal>
    );
};
export default AddPlug;
