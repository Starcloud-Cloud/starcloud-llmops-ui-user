import { Modal, Form, Input, Select, Space, Button, Switch, message, Radio, Tag, Upload, Tabs } from 'antd';
import { EditableProTable } from '@ant-design/pro-components';
import type { UploadProps } from 'antd';
import { CheckCard } from '@ant-design/pro-components';
import { PlusOutlined } from '@ant-design/icons';
import { useEffect, useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { v4 as uuidv4 } from 'uuid';
import './index.scss';
import { plugVerify, createPlug, modifyPlug, cozePage, spaceBots, getSpaceList, plugVerifyResult, plugPrompt } from 'api/redBook/plug';
import { aiIdentify } from 'api/plug/index';
import _ from 'lodash-es';
import Editor, { loader } from '@monaco-editor/react';
import ChatMarkdown from 'ui-component/Markdown';
import CopyToClipboard from 'react-copy-to-clipboard';
import { getAccessToken } from 'utils/auth';
import useUserStore from 'store/user';
import { openSnackbar } from 'store/slices/snackbar';
import { dispatch } from 'store';
import { origin_url } from 'utils/axios/config';
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
    const [handfilData, setHandfilData] = useState({
        arguments: '',
        output: ''
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
    const [spaceList, setSpaceList] = useState<any[]>([]);
    const getSpaceLists = async (accessTokenId: string) => {
        const result = await getSpaceList({
            accessTokenId,
            pageIndex: 1,
            pageSize: 50
        });
        form.setFieldValue('spaceId', result.workspaces[0].id);
        getBotList('spaceId', result.workspaces[0].id);
        setSpaceList(result.workspaces);
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
            editable: false,
            render: (a: any, row: any, index: number) => (
                <div className="line-clamp-3">
                    {row?.variableType === 'Boolean' ? (
                        <Select
                            defaultValue={row?.variableValue}
                            onChange={(e) => {
                                const newList = _.cloneDeep(inputTable);
                                newList[index].variableValue = e;
                                setInputTable(newList);
                            }}
                            options={[
                                { label: 'true', value: true },
                                { label: 'false', value: false }
                            ]}
                        />
                    ) : (
                        <Input
                            defaultValue={row?.variableValue}
                            onChange={(e) => {
                                const newList = _.cloneDeep(inputTable);
                                newList[index].variableValue = e.target.value;
                                setInputTable(newList);
                            }}
                        />
                    )}
                </div>
            )
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
    const getType = (parsed: any) => {
        try {
            if (Array.isArray(parsed) && parsed.every((item) => typeof item === 'string')) {
                return true;
            } else {
                return false;
            }
        } catch (e) {
            return false;
        }
    };
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
                variableType: getType(outputObj[key]) ? 'Array<String>' : typeof outputObj[key] === 'boolean' ? 'Boolean' : 'String'
            });
        }
        setUuid(newoutputObj?.map((item: any) => item.uuid));
        setTable(newoutputObj);
    };
    const handleOk = async () => {
        const result = await form.validateFields();
        if (rows) {
            let obj = {};
            if (aidistinguish?.enableAi) {
                obj = { ...aidistinguish };
            } else {
                obj = {
                    enableAi: aidistinguish?.enableAi,
                    userPrompt: rows?.userPrompt,
                    userInput: rows?.userInput,
                    aiResult: rows?.aiResult
                };
            }
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
                uid: rows.uid,
                ...obj
            });
            message.success('编辑成功');
        } else {
            let obj = {};
            if (aidistinguish?.enableAi) {
                obj = { ...aidistinguish };
            }
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
            setaidistinguish({
                enableAi: rows?.enableAi || false,
                userPrompt: rows?.userPrompt || '',
                userInput: rows?.userInput || '',
                aiResult: rows?.aiResult || ''
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
        action: `${origin_url}${process.env.REACT_APP_API_URL}/llm/creative/plan/uploadImage`,
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
    const [typeDisable, setTypeDisable] = useState<boolean>(false);
    const [typeValue, setTypeValue] = useState<any>('接口验证');
    useEffect(() => {
        loader.config({
            paths: {
                vs: 'https://cdnjs.cloudflare.com/ajax/libs/monaco-editor/0.43.0/min/vs'
            }
        });
    }, []);

    //ai 识别
    const [aidistinguish, setaidistinguish] = useState<any>(undefined);
    const [aiLoading, setAiLoading] = useState<boolean>(false);

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
            className="relative"
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
                                    key={item.value}
                                    title={item.label}
                                    description={<div className="line-clamp-2 h-[44px]">{item.description}</div>}
                                    value={item.value}
                                />
                            ))}
                        </CheckCard.Group>
                    </Form.Item>
                    <Form.Item label="实现方式">
                        <Form.Item name="type" initialValue={'coze'}>
                            <Radio.Group
                                onChange={() => form.setFieldValue('botId', undefined)}
                                size="small"
                                options={wayList}
                                disabled={rows ? true : false}
                            />
                        </Form.Item>
                        <Form.Item shouldUpdate={(prevValues, currentValues) => prevValues.type !== currentValues.type}>
                            {({ getFieldValue }) => {
                                const firstInputValue = getFieldValue('type');
                                return firstInputValue === 'coze' || firstInputValue === 'coze_workflow' ? (
                                    <>
                                        <Space wrap={true}>
                                            <div>
                                                <Form.Item
                                                    className="w-[400px]"
                                                    label="Coze 绑定的账号"
                                                    name="accessTokenId"
                                                    rules={[{ required: true, message: 'Coze 绑定的账号必填' }]}
                                                >
                                                    <Select
                                                        onChange={(e) => {
                                                            form.setFieldValue('spaceId', undefined);
                                                            if (form.getFieldValue('type') !== 'coze_workflow') {
                                                                getBotList('accessTokenId', e);
                                                                getSpaceLists(e);
                                                            }
                                                        }}
                                                    >
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
                                            {firstInputValue === 'coze' && (
                                                <Form.Item
                                                    className="w-[400px]"
                                                    label="空间 ID"
                                                    name="spaceId"
                                                    rules={[{ required: true, message: '空间 ID必填' }]}
                                                >
                                                    <Select onChange={(e) => getBotList('spaceId', e)}>
                                                        {spaceList?.map((item) => (
                                                            <Option value={item.id}>{item.name}</Option>
                                                        ))}
                                                    </Select>
                                                </Form.Item>
                                            )}
                                            <Form.Item
                                                className="!mb-0"
                                                shouldUpdate={(prevValues, currentValues) => prevValues.type !== currentValues.type}
                                            >
                                                {({ getFieldValue }) => {
                                                    const type = getFieldValue('type');
                                                    return type === 'coze' ? (
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
                                                                <div className="text-xs text-[#ff4d4f]  ml-[137px] mt-[-20px]">
                                                                    {errmessage}
                                                                </div>
                                                            )}
                                                        </div>
                                                    ) : (
                                                        <Form.Item
                                                            className="w-[400px]"
                                                            label="Coze 工作流 ID"
                                                            name="botId"
                                                            rules={[
                                                                { required: true, message: 'Coze 工作流 ID 必填' },
                                                                { pattern: /^\d+$/, message: 'Coze 工作流 ID 必须为数字' },
                                                                { len: 19, message: 'Coze 工作流 ID 长度必须为 19 位' }
                                                            ]}
                                                        >
                                                            <Input />
                                                        </Form.Item>
                                                    );
                                                }}
                                            </Form.Item>
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
                                                    if (form.getFieldValue('type') === 'coze_workflow') {
                                                        setTypeDisable(true);
                                                    } else {
                                                        setTypeDisable(false);
                                                    }
                                                    setHandfilData({
                                                        arguments: form.getFieldValue('input')
                                                            ? JSON.stringify(JSON.parse(form.getFieldValue('input')), null, 2)
                                                            : '',
                                                        output: form.getFieldValue('output')
                                                            ? JSON.stringify(JSON.parse(form.getFieldValue('output')), null, 2)
                                                            : ''
                                                    });
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
                                },
                                {
                                    label: 'Ai 识别',
                                    key: '3',
                                    children: (
                                        <div>
                                            <div className="text-xs text-black/40">
                                                开启AI识别后，用户输入自然语言会自动生成入参去执行插件，并执行笔记生成流程。
                                            </div>
                                            <div className="text-sm font-bold flex gap-2 items-end mb-6 mt-2">
                                                是否开启:
                                                <Switch
                                                    value={aidistinguish?.enableAi}
                                                    onChange={(e) => {
                                                        if (!e) {
                                                            setaidistinguish({ ...aidistinguish, enableAi: e });
                                                        }
                                                    }}
                                                />
                                                <span className="text-black/40 text-xs">(Tips:无法手动开启，验证成功后会自动开启!)</span>
                                            </div>

                                            <div className="flex gap-4 items-start">
                                                <div className="flex-1">
                                                    <div className="text-xs flex justify-between mb-2">
                                                        <div>提示词</div>
                                                        <div
                                                            onClick={async () => {
                                                                if (!aidistinguish?.enableAi) {
                                                                    const res = await plugPrompt({
                                                                        ...aidistinguish,
                                                                        enableAi: undefined,
                                                                        aiResult: undefined,
                                                                        userPrompt: undefined,
                                                                        pluginName: rows?.pluginName,
                                                                        description: rows?.description,
                                                                        inputFormart: rows?.inputFormart
                                                                    });
                                                                    setaidistinguish({
                                                                        ...aidistinguish,
                                                                        userPrompt: res
                                                                    });
                                                                }
                                                            }}
                                                            className="cursor-pointer"
                                                            style={{ color: !aidistinguish?.enableAi ? '#673ab7' : 'black' }}
                                                        >
                                                            恢复系统默认
                                                        </div>
                                                    </div>
                                                    <TextArea
                                                        value={aidistinguish?.userPrompt}
                                                        onChange={(data) => {
                                                            setaidistinguish({
                                                                ...aidistinguish,
                                                                userPrompt: data.target.value
                                                            });
                                                        }}
                                                        disabled={aidistinguish?.enableAi}
                                                        rows={20}
                                                    />
                                                </div>
                                                <div className="w-[50%] markDown">
                                                    <div className="text-xs mb-2">用户输入</div>
                                                    <TextArea
                                                        value={aidistinguish?.userInput}
                                                        onChange={(data) => {
                                                            setaidistinguish({
                                                                ...aidistinguish,
                                                                userInput: data.target.value
                                                            });
                                                        }}
                                                        disabled={aidistinguish?.enableAi}
                                                        rows={6}
                                                    />
                                                    <div className="text-xs mb-2 mt-6">识别结果</div>
                                                    <ChatMarkdown
                                                        textContent={`
~~~json
${aidistinguish?.aiResult}
                                                                            `}
                                                    />
                                                </div>
                                            </div>
                                            <div className="mt-4 flex justify-center">
                                                <Button
                                                    loading={aiLoading}
                                                    type="primary"
                                                    onClick={async () => {
                                                        setAiLoading(true);
                                                        try {
                                                            const result = await aiIdentify({
                                                                ...aidistinguish,
                                                                enableAi: undefined,
                                                                pluginName: rows?.pluginName,
                                                                description: rows?.description,
                                                                inputFormart: rows?.inputFormart
                                                            });
                                                            setAiLoading(false);
                                                            setaidistinguish({
                                                                ...aidistinguish,
                                                                enableAi: true,
                                                                aiResult: JSON.stringify(result, null, 2)
                                                            });
                                                        } catch (err) {
                                                            setAiLoading(false);
                                                        }
                                                    }}
                                                >
                                                    验证
                                                </Button>
                                            </div>
                                        </div>
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
                        <Form labelAlign="left" labelCol={{ span: 4 }}>
                            <Form.Item label="实现方式">
                                <div className="font-bold">{wayList?.find((item) => item.value === form.getFieldValue('type'))?.label}</div>
                            </Form.Item>
                            {!typeDisable ? (
                                <Form.Item label="机器人名称">
                                    <div className="font-bold">
                                        {botList?.find((item) => item.bot_id === form.getFieldValue('botId'))?.bot_name}
                                    </div>
                                </Form.Item>
                            ) : (
                                <Form.Item label="工作流ID">{form.getFieldValue('botId')}</Form.Item>
                            )}
                            <Radio.Group className="my-4" value={typeValue} onChange={(e) => setTypeValue(e.target.value)}>
                                <Radio value={'接口验证'}>接口验证</Radio>
                                <Radio value={'手动填写'}>手动填写</Radio>
                            </Radio.Group>
                            {typeValue === '接口验证' ? (
                                <div>
                                    <Form.Item label="Coze参数验证">
                                        <div className="flex gap-2 items-center">
                                            {!typeDisable ? (
                                                <TextArea
                                                    className="w-full"
                                                    placeholder="可输入触发机器人的对话"
                                                    rows={4}
                                                    value={bindData.content}
                                                    onChange={(e) => setBindData({ ...bindData, content: e.target.value })}
                                                />
                                            ) : (
                                                <div className="w-full">
                                                    <div className="flex items-center relative text-gray-200 bg-gray-800 px-4 py-2 text-xs font-sans justify-between rounded-t-md">
                                                        <span>json</span>
                                                    </div>
                                                    <Editor
                                                        height="100px"
                                                        defaultLanguage="json"
                                                        theme={'vs-dark'}
                                                        options={{
                                                            minimap: { enabled: false }
                                                        }}
                                                        value={bindData.content}
                                                        onChange={(value: any) => setBindData({ ...bindData, content: value })}
                                                    />
                                                </div>
                                            )}
                                            <Button
                                                loading={bindLoading}
                                                onClick={async () => {
                                                    let data = undefined;
                                                    try {
                                                        data = JSON.parse(bindData.content);
                                                    } catch (err) {}
                                                    if (typeDisable && bindData.content && !data) {
                                                        dispatch(
                                                            openSnackbar({
                                                                open: true,
                                                                message: 'Coze参数验证必须为 JSON',
                                                                variant: 'alert',
                                                                alert: {
                                                                    color: 'error'
                                                                },
                                                                close: false,
                                                                anchorOrigin: { vertical: 'top', horizontal: 'center' }
                                                            })
                                                        );
                                                        return false;
                                                    }
                                                    setBindLoading(true);
                                                    try {
                                                        const res = await plugVerify({
                                                            type: form.getFieldValue('type'),
                                                            accessTokenId: form.getFieldValue('accessTokenId'),
                                                            content: bindData.content,
                                                            entityUid: form.getFieldValue('botId')
                                                        });
                                                        timer.current = setInterval(async () => {
                                                            try {
                                                                const result = await plugVerifyResult({
                                                                    type: form.getFieldValue('type'),
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
                                                        setTimeout(() => {
                                                            dispatch(
                                                                openSnackbar({
                                                                    open: true,
                                                                    message: '系统异常，请联系管理员',
                                                                    variant: 'alert',
                                                                    alert: {
                                                                        color: 'error'
                                                                    },
                                                                    anchorOrigin: { vertical: 'top', horizontal: 'center' }
                                                                })
                                                            );
                                                            setBindLoading(false);
                                                            clearInterval(timer.current);
                                                        }, 240000);
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
                                        <div className="text-xs mt-2">
                                            {!typeDisable && '直接输入可触发机器人调用具体工作流的对话内容，详细请看'}
                                            {typeDisable && '复制成功运行的Coze工作流的“开始”节点的运行结果，详细请看'}
                                            <span
                                                onClick={() =>
                                                    window.open(
                                                        'https://alidocs.dingtalk.com/i/p/a0gX1nnO4R7ONmeJ/docs/YQBnd5ExVE0n2RNGSypQ2E7nWyeZqMmz'
                                                    )
                                                }
                                                className="text-[#673ab7] cursor-pointer"
                                            >
                                                【如何添加插件】
                                            </span>
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
                                    <div className="flex justify-center">
                                        <Button
                                            className="w-[100px]"
                                            disabled={!bindData.output && !bindData.arguments && verifyStatus ? true : false}
                                            onClick={() => {
                                                let newoutputObj: any = {};
                                                let newoutputflag: boolean = false;
                                                try {
                                                    newoutputObj = JSON.parse(bindData.output);
                                                } catch (err) {}
                                                if (Array.isArray(newoutputObj)) {
                                                    newoutputObj.map((item) => {
                                                        for (let key in item) {
                                                            if (typeof item[key] === 'object' && item[key] !== null) {
                                                                newoutputflag = true;
                                                            }
                                                        }
                                                    });
                                                } else {
                                                    for (let key in newoutputObj) {
                                                        if (typeof newoutputObj[key] === 'object' && newoutputObj[key] !== null) {
                                                            newoutputflag = true;
                                                        }
                                                    }
                                                }
                                                if (newoutputflag) {
                                                    dispatch(
                                                        openSnackbar({
                                                            open: true,
                                                            message: '出参示例中字段类型不能为对象或数组结构',
                                                            variant: 'alert',
                                                            alert: {
                                                                color: 'error'
                                                            },
                                                            close: false,
                                                            anchorOrigin: { vertical: 'top', horizontal: 'center' }
                                                        })
                                                    );
                                                    return false;
                                                }
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
                                                setHandfilData({
                                                    arguments: '',
                                                    output: ''
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
                                </div>
                            ) : (
                                <div>
                                    <div className="mb-2 text-xs text-black/50">请填写 coze工作流真实执行完后的出入参数</div>
                                    <Form.Item label="入参数据">
                                        <div className="flex items-center relative text-gray-200 bg-gray-800 px-4 py-2 text-xs font-sans justify-between rounded-t-md">
                                            <span>json</span>
                                            <CopyToClipboard
                                                text={handfilData.arguments}
                                                onCopy={() =>
                                                    dispatch(
                                                        openSnackbar({
                                                            open: true,
                                                            message: '复制成功',
                                                            variant: 'alert',
                                                            alert: {
                                                                color: 'success'
                                                            },
                                                            close: false,
                                                            anchorOrigin: { vertical: 'top', horizontal: 'right' },
                                                            transition: 'SlideLeft'
                                                        })
                                                    )
                                                }
                                            >
                                                <button className="flex ml-auto gap-2 text-white border-0 bg-transparent cursor-pointer">
                                                    <svg
                                                        stroke="currentColor"
                                                        fill="none"
                                                        strokeWidth="2"
                                                        viewBox="0 0 24 24"
                                                        strokeLinecap="round"
                                                        strokeLinejoin="round"
                                                        className="h-4 w-4"
                                                        height="1em"
                                                        width="1em"
                                                        xmlns="http://www.w3.org/2000/svg"
                                                    >
                                                        <path d="M16 4h2a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h2"></path>
                                                        <rect x="8" y="2" width="8" height="4" rx="1" ry="1"></rect>
                                                    </svg>
                                                    Copy code
                                                </button>
                                            </CopyToClipboard>
                                        </div>
                                        <Editor
                                            height="300px"
                                            defaultLanguage="json"
                                            theme={'vs-dark'}
                                            options={{
                                                minimap: { enabled: false }
                                            }}
                                            value={handfilData.arguments}
                                            onChange={(value: any) => {
                                                setHandfilData({
                                                    ...handfilData,
                                                    arguments: value
                                                });
                                            }}
                                        />
                                    </Form.Item>
                                    <Form.Item label="出参数据">
                                        <div className="flex items-center relative text-gray-200 bg-gray-800 px-4 py-2 text-xs font-sans justify-between rounded-t-md">
                                            <span>json</span>
                                            <CopyToClipboard
                                                text={handfilData.output}
                                                onCopy={() =>
                                                    dispatch(
                                                        openSnackbar({
                                                            open: true,
                                                            message: '复制成功',
                                                            variant: 'alert',
                                                            alert: {
                                                                color: 'success'
                                                            },
                                                            close: false,
                                                            anchorOrigin: { vertical: 'top', horizontal: 'right' },
                                                            transition: 'SlideLeft'
                                                        })
                                                    )
                                                }
                                            >
                                                <button className="flex ml-auto gap-2 text-white border-0 bg-transparent cursor-pointer">
                                                    <svg
                                                        stroke="currentColor"
                                                        fill="none"
                                                        strokeWidth="2"
                                                        viewBox="0 0 24 24"
                                                        strokeLinecap="round"
                                                        strokeLinejoin="round"
                                                        className="h-4 w-4"
                                                        height="1em"
                                                        width="1em"
                                                        xmlns="http://www.w3.org/2000/svg"
                                                    >
                                                        <path d="M16 4h2a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h2"></path>
                                                        <rect x="8" y="2" width="8" height="4" rx="1" ry="1"></rect>
                                                    </svg>
                                                    Copy code
                                                </button>
                                            </CopyToClipboard>
                                        </div>
                                        <Editor
                                            height="300px"
                                            defaultLanguage="json"
                                            theme={'vs-dark'}
                                            value={handfilData.output}
                                            options={{
                                                minimap: { enabled: false }
                                            }}
                                            onChange={(value: any) => {
                                                setHandfilData({
                                                    ...handfilData,
                                                    output: value
                                                });
                                            }}
                                        />
                                    </Form.Item>
                                    <div className="flex justify-center">
                                        <Button
                                            className="w-[100px]"
                                            disabled={!handfilData.output || !handfilData.arguments}
                                            onClick={() => {
                                                let argument: any = '';
                                                let output: any = '';
                                                try {
                                                    argument = JSON.parse(handfilData.arguments);
                                                    output = JSON.parse(handfilData.output);
                                                } catch (err) {
                                                    dispatch(
                                                        openSnackbar({
                                                            open: true,
                                                            message: '入参数据和出参数据格式需要 JSON',
                                                            variant: 'alert',
                                                            alert: {
                                                                color: 'error'
                                                            },
                                                            close: false,
                                                            anchorOrigin: { vertical: 'top', horizontal: 'center' }
                                                        })
                                                    );
                                                    return false;
                                                }
                                                if (typeof argument !== 'object' || typeof output !== 'object') {
                                                    dispatch(
                                                        openSnackbar({
                                                            open: true,
                                                            message: '入参数据和出参数据格式需要 JSON',
                                                            variant: 'alert',
                                                            alert: {
                                                                color: 'error'
                                                            },
                                                            close: false,
                                                            anchorOrigin: { vertical: 'top', horizontal: 'center' }
                                                        })
                                                    );
                                                    return false;
                                                }
                                                let newoutputObj: any = {};
                                                let newoutputflag: boolean = false;
                                                try {
                                                    newoutputObj = JSON.parse(handfilData.output);
                                                } catch (err) {}
                                                if (Array.isArray(newoutputObj)) {
                                                    newoutputObj.map((item) => {
                                                        for (let key in item) {
                                                            if (typeof item[key] === 'object' && item[key] !== null) {
                                                                newoutputflag = true;
                                                            }
                                                        }
                                                    });
                                                } else {
                                                    for (let key in newoutputObj) {
                                                        if (typeof newoutputObj[key] === 'object' && newoutputObj[key] !== null) {
                                                            newoutputflag = true;
                                                        }
                                                    }
                                                }
                                                if (newoutputflag) {
                                                    dispatch(
                                                        openSnackbar({
                                                            open: true,
                                                            message: '出参示例中字段类型不能为对象或数组结构',
                                                            variant: 'alert',
                                                            alert: {
                                                                color: 'error'
                                                            },
                                                            close: false,
                                                            anchorOrigin: { vertical: 'top', horizontal: 'center' }
                                                        })
                                                    );
                                                    return false;
                                                }
                                                setStatus('success');
                                                setVerErrmessage('');
                                                setOutputType(Array.isArray(output) ? 'list' : 'obj');
                                                form.setFieldValue('input', handfilData.arguments);
                                                form.setFieldValue('output', handfilData.output);
                                                setBindData({
                                                    content: '',
                                                    arguments: '',
                                                    output: '',
                                                    outputType: ''
                                                });
                                                setHandfilData({
                                                    arguments: '',
                                                    output: ''
                                                });
                                                setverifyStatus('gold');
                                                getTableData(handfilData.arguments, setInputTable, setinputKeys);
                                                getTableData(handfilData.output, setOutputTable, setoutuptKeys);
                                                setPlugOpen(false);
                                            }}
                                            type="primary"
                                        >
                                            确认
                                        </Button>
                                    </div>
                                </div>
                            )}
                        </Form>
                    </Modal>
                )}
                <div className="h-[25px]"></div>
                <div className="absolute w-[calc(100%-40px)] bg-white bottom-0 flex justify-center py-4 border-t border-solid border-black/10">
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
