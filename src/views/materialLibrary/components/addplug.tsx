import { Modal, Form, Input, Select, Space, Button, Switch, Tree, Checkbox, message, Radio, Tag, Tabs, Table, Upload } from 'antd';
import { EditableProTable } from '@ant-design/pro-components';
import type { TableProps, UploadProps } from 'antd';
import { CheckCard } from '@ant-design/pro-components';
import { DownOutlined, SisternodeOutlined, DeleteOutlined, PlusOutlined } from '@ant-design/icons';
import { useEffect, useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { v4 as uuidv4 } from 'uuid';
import './index.scss';
import { plugVerify, createPlug, modifyPlug, cozePage, spaceBots, plugPublish, plugVerifyResult } from 'api/redBook/plug';
import _ from 'lodash-es';
import ChatMarkdown from 'ui-component/Markdown';
import { getAccessToken } from 'utils/auth';
import useUserStore from 'store/user';
const AddPlug = ({
    open,
    setOpen,
    wayList,
    sceneList,
    rows,
    setRows,
    getTablePlugList,
    getDefinitionList
}: {
    open: boolean;
    setOpen: (data: boolean) => void;
    wayList: any[];
    sceneList: any[];
    rows: any;
    setRows: (data: any) => void;
    getTablePlugList: () => void;
    getDefinitionList: () => void;
}) => {
    const permissions = useUserStore((state) => state.permissions);

    const [form] = Form.useForm();
    const { TextArea } = Input;
    const { Option } = Select;
    const navigate = useNavigate();

    const timer = useRef<any>(null);
    const [status, setStatus] = useState('gold');
    const [verifyStatus, setverifyStatus] = useState('gold');
    const [errmessage, seterrmessage] = useState('');
    const [verErrmessage, setVerErrmessage] = useState('');
    const [accountList, setAccountList] = useState<any[]>([]);
    const [botList, setBotList] = useState<any[]>([]);
    const [outputType, setOutputType] = useState('');
    const [bindData, setBindData] = useState({
        content: '',
        arguments: '',
        output: '',
        outputType: ''
    });
    const getBotList = async (label: string, value: any) => {
        if (label === 'spaceId') {
            if (value && form.getFieldValue('accessTokenId')) {
                try {
                    const res = await spaceBots({
                        accessTokenId: form.getFieldValue('accessTokenId'),
                        spaceId: value
                    });
                    seterrmessage('');
                    setBotList(res.space_bots);
                } catch (err: any) {
                    setBotList([]);
                    seterrmessage(err.msg);
                    form.setFieldValue('botId', '');
                    console.log(err);
                }
            }
        } else {
            if (value && form.getFieldValue('spaceId')) {
                try {
                    const res = await spaceBots({
                        accessTokenId: value,
                        spaceId: form.getFieldValue('spaceId')
                    });
                    seterrmessage('');
                    setBotList(res.space_bots);
                } catch (err: any) {
                    setBotList([]);
                    seterrmessage(err.msg);
                    form.setFieldValue('botId', '');
                    console.log(err);
                }
            }
        }
    };
    const value2JsonMd = (value: any) => {
        if (value) {
            return `
~~~json
${JSON.stringify(JSON.parse(value), null, 2)}
                    `;
        } else {
            return ` ~~~json
            `;
        }
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

    const inputColumns: any = [
        {
            title: '字段名称',
            dataIndex: 'variableKey',
            align: 'center',
            editable: false
        },
        {
            title: '字段描述',
            dataIndex: 'variableDesc',
            align: 'center'
        },
        {
            title: '字段类型',
            dataIndex: 'variableType',
            align: 'center',
            valueType: 'select',
            fieldProps: {
                options: typeList
            },
            editable: false
        },
        {
            title: '是否必填',
            dataIndex: 'required',
            align: 'center',
            valueType: 'switch',
            editable: false,
            render: (_: any, row: any) => (row?.required ? <Tag color="processing">必填</Tag> : '')
        },
        {
            title: '默认值',
            width: 200,
            dataIndex: 'variableValue',
            align: 'center',
            render: (_: any, row: any) => <div className="line-clamp-3">{row.variableValue}</div>
        }
    ];
    const outputColumns: any = [
        {
            title: '字段名称',
            dataIndex: 'variableKey',
            align: 'center',
            editable: false
        },
        {
            title: '字段描述',
            dataIndex: 'variableDesc',
            align: 'center'
        },
        {
            title: '字段类型',
            dataIndex: 'variableType',
            align: 'center',
            valueType: 'select',
            fieldProps: {
                options: typeList
            },
            editable: false
        }
    ];
    const [inputKeys, setinputKeys] = useState<any[]>([]);
    const [outuptKeys, setoutuptKeys] = useState<any[]>([]);
    const [inputTable, setInputTable] = useState<any[]>([]);
    const [outputTable, setOutputTable] = useState<any[]>([]);
    const getTableData = (value: any, setTable: (data: any) => void, setUuid: (data: any) => void) => {
        let outputObj: any = {};
        let newoutputObj: any = [];
        try {
            const res = JSON.parse(value) || {};
            if (Array.isArray(res)) {
                outputObj = res[0];
            } else {
                outputObj = res;
            }
        } catch (errr) {}
        for (let key in outputObj) {
            newoutputObj.push({
                uuid: uuidv4(),
                variableKey: key,
                require: true,
                // variableValue: outputObj[key],
                variableType: 'String'
            });
        }
        setUuid(newoutputObj?.map((item: any) => item.uuid));
        setTable(newoutputObj);
    };
    const handleOk = async () => {
        const result = await form.validateFields();
        console.log(outputType);

        if (rows) {
            await modifyPlug({
                ...result,
                botId: undefined,
                avatar: imageUrl,
                accessTokenId: undefined,
                entityUid: result.botId,
                cozeTokenId: result.accessTokenId,
                verifyState: status === 'success' ? true : false,
                inputFormart: JSON.stringify(inputTable),
                outputFormart: JSON.stringify(outputTable),
                outputType,
                uid: rows.uid
            });
            message.success('编辑成功');
            // if (rows.published) {
            //     await plugPublish(rows.uid);
            //     message.success('发布成功');
            // }
        } else {
            await createPlug({
                ...result,
                botId: undefined,
                avatar: imageUrl,
                accessTokenId: undefined,
                entityUid: result.botId,
                verifyState: status === 'success' ? true : false,
                inputFormart: JSON.stringify(inputTable),
                outputFormart: JSON.stringify(outputTable),
                cozeTokenId: result.accessTokenId,
                outputType
            });
            message.success('新增成功');
        }

        setRows(null);
        setOpen(false);
        form.resetFields();
        getTablePlugList();
        getDefinitionList();
    };

    useEffect(() => {
        cozePage({ pageNo: 1, pageSize: 100 }).then((res) => {
            const newList = res.list?.filter((item: any) => item.type === 35);
            setAccountList(newList);
        });
        return () => {
            clearInterval(timer.current);
        };
    }, []);
    useEffect(() => {
        if (rows) {
            form.setFieldsValue({
                ...rows,
                botId: rows.entityUid,
                accessTokenId: rows.cozeTokenId
            });
            setOutputType(rows.outputType);
            if (rows.avatar) {
                setImageUrl(rows.avatar);
            }
            if (rows.inputFormart) {
                const newList = JSON.parse(rows.inputFormart);
                setInputTable(newList);
                setinputKeys(newList?.map((item: any) => item.uuid));
            }
            if (rows.outputFormart) {
                const newList = JSON.parse(rows.outputFormart);
                setOutputTable(newList);
                setoutuptKeys(newList?.map((item: any) => item.uuid));
            }
            // if(accountList?.find(item=>) rows.cozeTokenId)
            setStatus(rows.verifyState ? 'success' : 'error');
            getBotList('spaceId', rows.spaceId);
        }
    }, [rows]);
    useEffect(() => {
        if (rows?.cozeTokenId && accountList.length > 0) {
            if (accountList.findIndex((item) => item.id?.toString() === rows.cozeTokenId) === -1) {
                form.setFieldsValue({
                    accessTokenId: ''
                });
            }
        }
    }, [rows?.cozeTokenId, accountList]);

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
    const [imageUrl, setImageUrl] = useState('');

    const uploadButton = (
        <button style={{ border: 0, background: 'none' }} type="button">
            <PlusOutlined />
        </button>
    );
    const props: UploadProps = {
        name: 'image',
        showUploadList: false,
        listType: 'picture-card',
        action: `${process.env.REACT_APP_BASE_URL}${process.env.REACT_APP_API_URL}/llm/creative/plan/uploadImage`,
        headers: {
            Authorization: 'Bearer ' + getAccessToken()
        },
        maxCount: 20,
        onChange(info) {
            if (info.file.status === 'done') {
                setImageUrl(info?.file?.response?.data?.url);
            }
        }
    };

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
            <div className="h-[80vh] overflow-y-auto">
                <Form form={form} labelAlign="left" labelCol={{ span: 4 }}>
                    <Form.Item label="插件名称" name="pluginName" rules={[{ required: true, message: '插件名称必填' }]}>
                        <Input />
                    </Form.Item>
                    <Form.Item label="插件图标" name="pluginLogo">
                        <Upload {...props} className="!w-[auto] cursor-pointer">
                            {imageUrl ? (
                                <img className="rounded-full" src={imageUrl} alt="avatar" style={{ width: '100%' }} />
                            ) : (
                                uploadButton
                            )}
                        </Upload>
                    </Form.Item>
                    <Form.Item label="插件描述" name="description">
                        <Input.TextArea rows={3} />
                    </Form.Item>
                    <Form.Item label="使用场景" name="scene" initialValue={'DATA_ADDED'}>
                        <CheckCard.Group disabled={rows ? true : false} size="small">
                            {sceneList.map((item) => (
                                <CheckCard
                                    title={item.label}
                                    description={<div className="line-clamp-2 h-[44px]">{item.description}</div>}
                                    value={item.value}
                                />
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
                                            <div>
                                                <Form.Item
                                                    className="w-[400px]"
                                                    label="Coze 绑定的账号"
                                                    name="accessTokenId"
                                                    rules={[{ required: true, message: 'Coze 绑定的账号必填' }]}
                                                >
                                                    <Select onChange={(e) => getBotList('accessTokenId', e)}>
                                                        {accountList?.map((item) => (
                                                            <Option key={item.id} value={item.id.toString()}>
                                                                {item.nickname}
                                                            </Option>
                                                        ))}
                                                    </Select>
                                                </Form.Item>
                                                {accountList?.length === 0 && (
                                                    <div
                                                        className="text-xs text-[#673ab7] hover:underline cursor-pointer ml-[137px] mt-[-20px]"
                                                        onClick={() => navigate('/user/account-profile/profile?type=2')}
                                                    >
                                                        没有账号？去绑定
                                                    </div>
                                                )}
                                            </div>
                                            <Form.Item
                                                className="w-[400px]"
                                                label="空间 ID"
                                                name="spaceId"
                                                rules={[{ required: true, message: '空间 ID必填' }]}
                                            >
                                                <Input onBlur={async (e) => getBotList('spaceId', e.target.value)} />
                                            </Form.Item>
                                            <div>
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
                                                {errmessage && (
                                                    <div className="text-xs text-[#ff4d4f]  ml-[137px] mt-[-20px]">{errmessage}</div>
                                                )}
                                            </div>
                                        </Space>
                                        <Space align="end">
                                            验证状态：
                                            <Tag color={status}>
                                                {status === 'success' ? '校验成功' : status === 'error' ? '检验失败' : '待校验'}
                                            </Tag>
                                            <Button
                                                type="primary"
                                                onClick={async () => {
                                                    await form.validateFields(['accessTokenId', 'spaceId', 'botId']);
                                                    setPlugOpen(true);
                                                }}
                                            >
                                                验证执行结果
                                            </Button>
                                        </Space>
                                    </>
                                ) : null;
                            }}
                        </Form.Item>
                    </Form.Item>
                    <Form.Item>
                        <Tabs
                            items={[
                                {
                                    label: '入参数据示例',
                                    key: '1',
                                    children: (
                                        <Form.Item name="input">
                                            <Form.Item
                                                shouldUpdate={(prevValues, currentValues) => prevValues.input !== currentValues.input}
                                            >
                                                <ChatMarkdown textContent={value2JsonMd(form.getFieldValue('input'))} />
                                            </Form.Item>
                                        </Form.Item>
                                    )
                                },
                                {
                                    label: '入参数据结构',
                                    key: '2',
                                    children: (
                                        <EditableProTable<any>
                                            rowKey={'uuid'}
                                            tableAlertRender={false}
                                            rowSelection={false}
                                            toolBarRender={false}
                                            columns={inputColumns}
                                            value={inputTable}
                                            pagination={false}
                                            recordCreatorProps={false}
                                            editable={{
                                                type: 'multiple',
                                                editableKeys: inputKeys,
                                                onValuesChange: (record, recordList) => {
                                                    setInputTable(recordList);
                                                },
                                                onChange: setinputKeys
                                            }}
                                        />
                                    )
                                }
                            ]}
                        />
                    </Form.Item>
                    <Form.Item>
                        <Tabs
                            items={[
                                {
                                    label: '出参数据示例',
                                    key: '1',
                                    children: (
                                        <Form.Item name="output">
                                            <Form.Item
                                                shouldUpdate={(prevValues, currentValues) => prevValues.output !== currentValues.output}
                                            >
                                                <ChatMarkdown textContent={value2JsonMd(form.getFieldValue('output'))} />
                                            </Form.Item>
                                        </Form.Item>
                                    )
                                },
                                {
                                    label: '出参数据结构',
                                    key: '2',
                                    children: (
                                        <EditableProTable<any>
                                            rowKey={'uuid'}
                                            tableAlertRender={false}
                                            rowSelection={false}
                                            toolBarRender={false}
                                            columns={outputColumns}
                                            value={outputTable}
                                            pagination={false}
                                            recordCreatorProps={false}
                                            editable={{
                                                type: 'multiple',
                                                editableKeys: outuptKeys,
                                                onValuesChange: (record, recordList) => {
                                                    setOutputTable(recordList);
                                                },
                                                onChange: setoutuptKeys
                                            }}
                                        />
                                    )
                                }
                            ]}
                        />
                    </Form.Item>
                    {permissions.includes('plugin_published') && rows && (
                        <Form.Item label="发布到应用市场" name="published" valuePropName="checked" initialValue={false}>
                            <Switch />
                        </Form.Item>
                    )}
                </Form>
                {plugOpen && (
                    <Modal width="60%" title="绑定验证" open={plugOpen} footer={null} onCancel={() => setPlugOpen(false)}>
                        <Form labelCol={{ span: 6 }}>
                            <Form.Item label="机器人名称">
                                <div className="font-bold">
                                    {botList?.find((item) => item.bot_id === form.getFieldValue('botId'))?.bot_name}
                                </div>
                            </Form.Item>
                            <Form.Item label="Coze参数验证">
                                <div className="flex gap-2 items-center">
                                    <TextArea
                                        className="w-full"
                                        placeholder="可输入触发机器人的对话"
                                        rows={4}
                                        value={bindData.content}
                                        onChange={(e) => setBindData({ ...bindData, content: e.target.value })}
                                    />
                                    <Button
                                        loading={bindLoading}
                                        onClick={async () => {
                                            setBindLoading(true);
                                            try {
                                                const res = await plugVerify({
                                                    accessTokenId: form.getFieldValue('accessTokenId'),
                                                    content: bindData.content,
                                                    botId: form.getFieldValue('botId')
                                                });
                                                timer.current = setInterval(async () => {
                                                    try {
                                                        const result = await plugVerifyResult({
                                                            code: res,
                                                            accessTokenId: form.getFieldValue('accessTokenId')
                                                        });
                                                        if (result.verifyState) {
                                                            clearInterval(timer.current);
                                                            setverifyStatus('success');
                                                            setBindData({
                                                                ...bindData,
                                                                arguments: result.arguments ? JSON.stringify(result.arguments) : '',
                                                                output: result.output ? JSON.stringify(result.output) : '',
                                                                outputType: result.outputType
                                                            });
                                                            setBindLoading(false);
                                                            setVerErrmessage('');
                                                        } else if (
                                                            result.status === 'failed' ||
                                                            result.status === 'requires_action' ||
                                                            result.status === 'canceled'
                                                        ) {
                                                            clearInterval(timer.current);
                                                            setverifyStatus('error');
                                                            setVerErrmessage(
                                                                result.status === 'failed'
                                                                    ? '对话失败'
                                                                    : result.status === 'requires_action'
                                                                    ? '对话中断，需要进一步处理'
                                                                    : result.status === 'canceled'
                                                                    ? '对话已取消'
                                                                    : ''
                                                            );
                                                            setBindLoading(false);
                                                        }
                                                    } catch (err: any) {
                                                        clearInterval(timer.current);
                                                        setverifyStatus('error');
                                                        setVerErrmessage(err.msg);
                                                        setBindLoading(false);
                                                    }
                                                }, 4000);
                                            } catch (err: any) {
                                                clearInterval(timer.current);

                                                setBindLoading(false);
                                            }
                                        }}
                                        type="primary"
                                    >
                                        绑定验证
                                    </Button>
                                </div>
                            </Form.Item>
                            <Form.Item label="验证状态">
                                <Tag color={verifyStatus}>
                                    {verifyStatus === 'success' ? '校验成功' : verifyStatus === 'error' ? '检验失败' : '待校验'}
                                </Tag>
                                <span className="text-xs text-[#ff4d4f]">{verErrmessage}</span>
                            </Form.Item>
                            <Form.Item label="入参数据示例">
                                <ChatMarkdown textContent={value2JsonMd(bindData.arguments)} />
                                <div className="text-xs text-black/50 mt-[5px]">验证通过之后会自动更新，无法直接修改</div>
                            </Form.Item>
                            <Form.Item label="出参数据示例">
                                <ChatMarkdown textContent={value2JsonMd(bindData.output)} />
                                <div className="text-xs text-black/50 mt-[5px]">验证通过之后会自动更新，无法直接修改</div>
                            </Form.Item>
                        </Form>
                        <div className="flex justify-center">
                            <Button
                                className="w-[100px]"
                                disabled={!bindData.output && !bindData.arguments && verifyStatus ? true : false}
                                onClick={() => {
                                    setStatus('success');
                                    setVerErrmessage('');
                                    console.log(bindData.outputType);

                                    setOutputType(bindData.outputType);
                                    form.setFieldValue('input', bindData.arguments);
                                    form.setFieldValue('output', bindData.output);
                                    setBindData({
                                        content: '',
                                        arguments: '',
                                        output: '',
                                        outputType: ''
                                    });
                                    setverifyStatus('gold');
                                    getTableData(bindData.arguments, setInputTable, setinputKeys);
                                    getTableData(bindData.output, setOutputTable, setoutuptKeys);
                                    setPlugOpen(false);
                                }}
                                type="primary"
                            >
                                确认
                            </Button>
                        </div>
                    </Modal>
                )}
                <div className="flex justify-center">
                    <Button onClick={handleOk} type="primary" className="w-[100px]">
                        保存
                    </Button>
                </div>
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
