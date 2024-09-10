import { Input, Select, Button, Table, message, Collapse, Popover, Space, Tag, Form, Avatar } from 'antd';
const { Option } = Select;
import { useEffect, useRef, useState, useMemo } from 'react';
import { QuestionCircleOutlined, HistoryOutlined, AppstoreFilled } from '@ant-design/icons';
import _ from 'lodash';
import React from 'react';
import { ModalForm } from '@ant-design/pro-components';
import Editor from '@monaco-editor/react';
import { addPlugConfigInfo, updatePlugConfigInfo, configDetail } from 'api/plug';
import { plugexEcuteResult, plugExecute } from 'api/redBook/plug';
import ChatMarkdown from 'ui-component/Markdown';
import ResultLoading from '../resultLoading';
import dayjs from 'dayjs';
import { dispatch } from 'store';
import { openSnackbar } from 'store/slices/snackbar';
import TriggerModal from './triggerModal';
import './analysis.scss';

const value2JsonMd = (value: any) => `
~~~json
${JSON.stringify(value, null, 2)}
~~~
`;

const PlugAnalysis = ({
    setForceUpdate,
    metaData,
    columns,
    handleAnalysis,
    downTableData,
    setPlugMarketOpen,
    onOpenChange,
    open,
    record,
    libraryUid
}: {
    setForceUpdate: any;
    metaData: any;
    columns: any[];
    handleAnalysis: () => void;
    setPlugMarketOpen: (data: any) => void;
    downTableData: (data: any, num: number) => void;
    onOpenChange: any;
    open: any;
    record: any;
    libraryUid: string;
}) => {
    const [form] = Form.useForm();
    const [execountLoading, setExecountLoading] = useState(false);
    const [redBookData, setRedBookData] = useState<any>({});
    const [data, setData] = useState<any[]>([]);

    const redList = React.useMemo(() => {
        const outputFormart = JSON.parse(record?.outputFormart || '[]') || [];
        return (
            outputFormart?.map((item: any) => ({
                label: item.variableKey,
                des: item.variableDesc,
                value: item.variableKey,
                tip: item.variableValue
            })) || []
        );
    }, [record]);

    useEffect(() => {
        if (record && !record?.fieldMap) {
            let data: any[] = [];
            redList.forEach((redItem: any) => {
                const value =
                    columns
                        .filter((item) => !item.isDefault)
                        .filter((item) => item.type !== 5) // 只有文本
                        .find((item) => item.titleText === redItem.des)?.dataIndex ||
                    columns
                        .filter((item) => !item.isDefault)
                        .filter((item) => item.type !== 5) // 只有文本
                        .find((item) => item.dataIndex === redItem.value)?.dataIndex;

                data.push({
                    label: redItem.label,
                    label_key: redItem.value,
                    des: redItem.des,
                    value: value
                });
            });

            const filterData = data.filter((item: any) => item.value);
            const fieldList = filterData.map((item: any) => item.label_key);
            const obj: any = {};
            filterData.forEach((item: any) => {
                obj[item.label_key] = item.value;
            });

            setRedBookData((pre: any) => ({
                ...pre,
                requirement: JSON.parse(record.inputFormart || '[]')?.map((item: any, index: number) => ({
                    ...item,
                    variableDesc:
                        JSON.parse(record.executeParams || '[]')?.find((i: any) => i.variableKey === item.variableKey)?.variableDesc ||
                        item?.variableDesc,
                    variableValue:
                        JSON.parse(record.executeParams || '[]')?.find((i: any) => i.variableKey === item.variableKey)?.variableValue ||
                        item?.variableValue
                })),
                fieldList: fieldList,
                bindFieldData: obj
            }));
            setData(data);
        }
    }, [columns, record]);

    useEffect(() => {
        if (record?.fieldMap) {
            const fieldMap = JSON.parse(record.fieldMap || '{}');

            const data = redList.map((redItem: any, index: number) => {
                return {
                    label: redItem.label,
                    label_key: redItem.value,
                    des: redItem.des,
                    value: columns.map((item) => item.dataIndex).includes(fieldMap?.[redItem.value]) ? fieldMap?.[redItem.value] : ''
                };
            });

            const filterData = data.filter((item: any) => item.value);
            const fieldList = filterData.map((item: any) => item.label_key);
            const obj: any = {};
            filterData.forEach((item: any) => {
                obj[item.label_key] = item.value;
            });

            setRedBookData((pre: any) => ({
                ...pre,
                requirement: JSON.parse(record.inputFormart || '[]')?.map((item: any, index: number) => ({
                    ...item,
                    variableDesc:
                        JSON.parse(record.executeParams || '[]')?.find((i: any) => i.variableKey === item.variableKey)?.variableDesc ||
                        item?.variableDesc ||
                        '',
                    variableValue:
                        JSON.parse(record.executeParams || '[]')?.find((i: any) => i.variableKey === item.variableKey)?.variableValue ||
                        item?.variableValue
                })),
                fieldList: fieldList,
                bindFieldData: obj
            }));

            setData(data);
        }
    }, [columns, record]);

    const [materialExecutionOpen, setMaterialExecutionOpen] = useState(false);
    //处理过的素材数据
    const aref = useRef(false);
    const totalCountRef = useRef(0);
    const [totalCount, setTotalCount] = useState(0);
    const executionCountRef = useRef(0);
    const [executionCount, setExecutionCount] = useState(0);
    const successCountRef = useRef(0);
    const [successCount, setSuccessCount] = useState(0);
    const errorCountRef = useRef(0);
    const [errorCount, setErrorCount] = useState(0);
    const errorMessageRef = useRef<any[]>([]);
    const [errorMessage, setErrorMessage] = useState<any[]>([]);

    const preeNum = useRef(0);
    const [prenum, setPrenum] = useState(0);
    const materialPre = useMemo(() => {
        return (((((successCountRef.current + errorCountRef.current) / totalCountRef.current) * 100) | 0) + preeNum.current) | 0;
    }, [successCount, totalCount, prenum]);

    const materialzanListRef = useRef<any[]>([]);
    const [materialzanList, setMaterialzanList] = useState<any[]>([]);

    const timer = useRef<any>(null);
    const handleExecute = async (retry?: boolean) => {
        setExecountLoading(true);
        try {
            const formRes = await form.validateFields();
            const code = await plugExecute({
                uuid: record.pluginUid,
                inputParams: formRes
            });
            setExecountLoading(false);
            if (!retry) {
                materialzanListRef.current = [];
                setMaterialzanList(materialzanListRef.current);
            }
            aref.current = false;
            totalCountRef.current = 1;
            setTotalCount(totalCountRef.current);
            executionCountRef.current = 1;
            setExecutionCount(executionCountRef.current);
            setMaterialExecutionOpen(true);
            timer.current = setInterval(async () => {
                try {
                    const res = await plugexEcuteResult({
                        code,
                        uuid: record.pluginUid
                    });
                    if (res.status === 'completed') {
                        let List;
                        if (Array.isArray(res.output) && record.outputType === 'list') {
                            List = res.output;
                        } else if (typeof res.output === 'object' && res.output !== null && record.outputType === 'obj') {
                            List = [res.output];
                        } else {
                            executionCountRef.current = 0;
                            setExecutionCount(executionCountRef.current);
                            errorCountRef.current = 1;
                            setErrorCount(errorCountRef.current);
                            dispatch(
                                openSnackbar({
                                    open: true,
                                    message: '返回数据类型有误，请稍后再试',
                                    variant: 'alert',
                                    alert: {
                                        color: 'error'
                                    },
                                    anchorOrigin: { vertical: 'top', horizontal: 'center' },
                                    close: false
                                })
                            );
                            return false;
                        }
                        const newList = List.map((item: any) => {
                            const newItem: any = {};
                            for (let key in item) {
                                if (redBookData.bindFieldData[key]) {
                                    newItem[redBookData.bindFieldData[key]] = item[key];
                                } else {
                                    newItem[key] = item[key];
                                }
                            }
                            return newItem;
                        });
                        executionCountRef.current = 0;
                        setExecutionCount(executionCountRef.current);
                        successCountRef.current = 1;
                        setSuccessCount(successCountRef.current);
                        materialzanListRef.current = newList;
                        setMaterialzanList(materialzanListRef.current);
                        clearInterval(timer.current);
                    } else if (res.status === 'failed' || res.status === 'requires_action' || res.status === 'canceled') {
                        executionCountRef.current = 0;
                        setExecutionCount(executionCountRef.current);
                        errorCountRef.current = 1;
                        setErrorCount(errorCountRef.current);
                        errorMessageRef.current.push(
                            res.status === 'failed'
                                ? '对话失败'
                                : res.status === 'requires_action'
                                ? '对话中断，需要进一步处理'
                                : res.status === 'canceled'
                                ? '对话已取消'
                                : ''
                        );
                        setErrorMessage(errorMessageRef.current);
                        clearInterval(timer.current);
                    }
                } catch (err: any) {
                    console.log(err);
                    executionCountRef.current = 0;
                    setExecutionCount(executionCountRef.current);
                    errorCountRef.current = 1;
                    setErrorCount(errorCountRef.current);
                    errorMessageRef.current.push(err.msg);
                    setErrorMessage(errorMessageRef.current);
                    clearInterval(timer.current);
                    clearInterval(timeLoading.current);
                }
            }, 4000);
        } catch (err) {
            console.log(111111);

            setExecountLoading(false);
        }
    };
    const timeLoading = useRef<any>(null);
    const grupPre = useRef(0);
    useEffect(() => {
        if (materialExecutionOpen && executionCountRef.current) {
            const newNum = grupPre.current || executionCountRef.current;
            const newSuccessNum = ((newNum / totalCountRef.current) * 100) | 0;
            timeLoading.current = setInterval(() => {
                if (preeNum.current < newSuccessNum - 1) {
                    preeNum.current += (100 / ((record?.executeTimeAvg * 1.1) / 800)) | 0;
                    setPrenum(preeNum.current);
                } else {
                    clearInterval(timeLoading.current);
                }
            }, 800);
        } else {
            clearInterval(timeLoading.current);
        }
    }, [materialExecutionOpen, executionCount]);
    useEffect(() => {
        if (successCount || errorCount) {
            preeNum.current = 0;
            setPrenum(preeNum.current);
            clearInterval(timeLoading.current);
            console.log(11111, preeNum.current);
        }
    }, [successCount, errorCount]);
    useEffect(() => {
        if (!materialExecutionOpen) {
            errorMessageRef.current = [];
            setErrorMessage(errorMessageRef.current);
            executionCountRef.current = 0;
            setExecutionCount(executionCountRef.current);
            errorCountRef.current = 0;
            setErrorCount(errorCountRef.current);
            successCountRef.current = 0;
            setSuccessCount(successCountRef.current);
        }
    }, [materialExecutionOpen]);
    useEffect(() => {
        if (!open || !materialExecutionOpen) {
            preeNum.current = 0;
            setPrenum(preeNum.current);
            clearInterval(timer.current);
            clearInterval(timeLoading.current);
        }
    }, [open, materialExecutionOpen]);

    const [triggerOpen, setTriggerOpen] = useState(false);
    const [rowPre, setRowPre] = useState(0);
    const [rowData, setRowData] = useState<any>(null);
    useEffect(() => {
        if (record) {
            configDetail(record?.uid).then((result) => {
                if (result) {
                    setRowData(result);
                }
            });
        }
    }, [rowPre, record]);

    //form 表单校验
    const parseInputToArray = (input: any) => {
        try {
            const parsed = JSON.parse(input);
            if (Array.isArray(parsed) && parsed.every((item) => typeof item === 'string')) {
                return parsed;
            }
        } catch (e) {
            return input;
        }
    };
    const isArrayString = (value: any) => {
        return Array.isArray(value) && value.every((item) => typeof item === 'string');
    };

    return (
        <ModalForm
            modalProps={{
                maskClosable: false
            }}
            title={
                <div className=" flex flex-col">
                    <div className="flex gap-4 items-end mb-2">
                        <div className="flex items-end">
                            {record?.avatar ? (
                                <Avatar shape="square" size={50} src={record.avatar} />
                            ) : (
                                <Avatar shape="square" size={50} icon={<AppstoreFilled />} />
                            )}
                            <div className="flex gap-2 ml-2 flex-col">
                                <Space align="center">
                                    <span className="font-bold">{record?.pluginName}</span>
                                    <Tag color="processing">{metaData.scene?.find((item: any) => item.value === record?.scene)?.label}</Tag>
                                    <Tag color="purple">{metaData.platform?.find((item: any) => item.value === record?.type)?.label}</Tag>
                                    <div className="text-[14px] flex items-center gap-1">
                                        <HistoryOutlined
                                            style={{
                                                color: rowData?.enable ? '#673ab7' : ''
                                            }}
                                        />
                                        定时执行
                                    </div>
                                </Space>
                                <div className="flex gap-2">
                                    <div className="text-xs text-[#673ab7]">
                                        <HistoryOutlined /> 预计耗时：{((record?.executeTimeAvg * 1.1) / 1000) | 0}s
                                    </div>
                                    {record?.updateTime && (
                                        <span className="text-xs text-black/50">
                                            更新时间: {dayjs(record?.updateTime).format('YYYY-MM-DD HH:mm:ss')}
                                        </span>
                                    )}
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="text-xs text-black/50 mt-1">{record?.description}</div>
                </div>
            }
            open={open}
            onOpenChange={onOpenChange}
            submitter={false}
        >
            <div className="text-[16px] font-bold mb-4">
                1.输入内容
                <Popover
                    content={
                        <div className="w-[500px] max-h-[300px] overflow-auto">
                            <ChatMarkdown textContent={value2JsonMd(JSON.parse(record?.input || '{}'))} />
                        </div>
                    }
                    title="参数示例"
                >
                    <QuestionCircleOutlined className="ml-1 cursor-pointer" />
                </Popover>
            </div>
            <Form form={form} layout={'vertical'} labelCol={{ span: 12 }}>
                {redBookData.requirement?.map((item: any) =>
                    item.variableType === 'String' ? (
                        <Form.Item
                            initialValue={item.variableValue}
                            key={item.uuid}
                            label={item.variableKey + (item.variableDesc ? `(${item.variableDesc})` : '')}
                            name={item.variableType === 'String' ? item.variableKey : ''}
                            rules={item.variableType === 'String' ? [{ required: true, message: item.variableKey + '是必填项' }] : []}
                        >
                            <Input />
                        </Form.Item>
                    ) : (
                        <Form.Item required label={item.variableKey + (item.variableDesc ? `(${item.variableDesc})` : '')}>
                            <div className="flex items-center relative bg-[#F4F4F6] px-4 py-2 text-xs font-sans justify-between rounded-t-md">
                                <span>json</span>
                            </div>
                            <Form.Item
                                initialValue={item.variableValue || '[]'}
                                name={item.variableKey}
                                rules={[
                                    { required: true, message: item.variableKey + '是必填项' },
                                    {
                                        validator: (_, value) => {
                                            if (!value) {
                                                return Promise.resolve();
                                            }
                                            const parsedValue = parseInputToArray(value);
                                            if (isArrayString(parsedValue)) {
                                                return Promise.resolve();
                                            }
                                            return Promise.reject(new Error('请输入正确的JSON结构'));
                                        }
                                    }
                                ]}
                            >
                                <Editor
                                    className="border border-solid border-[#e1e1e4] rounded-b-md overflow-hidden border-t-transparent"
                                    height="200px"
                                    defaultLanguage="json"
                                    options={{
                                        minimap: { enabled: false }
                                    }}
                                    onChange={(value: any) => {}}
                                />
                            </Form.Item>
                        </Form.Item>
                    )
                )}
            </Form>
            <Collapse
                className="analysis"
                collapsible="icon"
                ghost
                expandIconPosition="end"
                defaultActiveKey={['1']}
                items={[
                    {
                        key: '1',
                        label: (
                            <div className="text-[16px] font-bold flex">
                                2.输出字段绑定
                                <Popover
                                    content={
                                        <div className="w-[500px] max-h-[300px] overflow-auto">
                                            <ChatMarkdown textContent={value2JsonMd(JSON.parse(record?.output || '{}'))} />
                                        </div>
                                    }
                                    title="参数示例"
                                >
                                    <QuestionCircleOutlined className="ml-1 cursor-pointer" />
                                </Popover>
                            </div>
                        ),
                        children: (
                            <Table
                                pagination={false}
                                bordered
                                size="small"
                                columns={[
                                    {
                                        title: '字段',
                                        dataIndex: 'des',
                                        align: 'center',
                                        width: '40%',
                                        render: (_, record) => record.des || record.label
                                    },
                                    {
                                        title: '绑定到',
                                        align: 'center',
                                        width: '20%',
                                        render: () => (
                                            <svg
                                                viewBox="0 0 1024 1024"
                                                version="1.1"
                                                xmlns="http://www.w3.org/2000/svg"
                                                p-id="7263"
                                                width="20"
                                                height="20"
                                            >
                                                <path
                                                    d="M170.666667 426.666667v170.666666h384l-149.333334 149.333334 103.253334 103.253333L846.506667 512l-337.92-337.92L405.333333 277.333333 554.666667 426.666667H170.666667z"
                                                    fill="#8a8a8a"
                                                    p-id="7264"
                                                ></path>
                                            </svg>
                                        )
                                    },
                                    {
                                        title: '素材字段',
                                        dataIndex: 'value',
                                        align: 'center',
                                        width: '40%',
                                        render: (_, record) => {
                                            return (
                                                data.length > 0 && (
                                                    <Select
                                                        style={{ width: 160 }}
                                                        allowClear
                                                        value={record.value}
                                                        onChange={(value) => {
                                                            let fieldList = redBookData.fieldList || [];
                                                            console.log(fieldList);

                                                            let bindFieldData = redBookData.bindFieldData;
                                                            if (value) {
                                                                fieldList = [...fieldList, record.label_key];
                                                                bindFieldData[record.label_key] = value;
                                                            } else {
                                                                fieldList = fieldList.filter((item: any) => item !== record.label_key);
                                                                delete bindFieldData[record.label_key];
                                                            }

                                                            const copyData = [...data];
                                                            const index = copyData.findIndex((item) => item.label_key === record.label_key);
                                                            copyData[index].value = value;
                                                            setData(copyData);

                                                            setRedBookData((pre: any) => {
                                                                return {
                                                                    ...pre,
                                                                    fieldList,
                                                                    bindFieldData
                                                                };
                                                            });
                                                        }}
                                                    >
                                                        {columns
                                                            .filter((item) => !item.isDefault)
                                                            ?.map((item) => {
                                                                return (
                                                                    <Option
                                                                        key={item.dataIndex}
                                                                        value={item.dataIndex}
                                                                        disabled={Object.values(redBookData.bindFieldData || {}).includes(
                                                                            item.dataIndex
                                                                        )}
                                                                    >
                                                                        {item.title}
                                                                    </Option>
                                                                );
                                                            })}
                                                    </Select>
                                                )
                                            );
                                        }
                                    }
                                ]}
                                dataSource={data}
                            />
                        )
                    }
                ]}
            />
            <div className="flex justify-center gap-6 mt-6">
                <Button
                    onClick={async () => {
                        const result = await form.validateFields();
                        const newList = redBookData.requirement?.map((item: any) => ({
                            ...item,
                            variableValue: result[item.variableKey]
                        }));
                        if (!record?.uid) {
                            const res = await addPlugConfigInfo({
                                libraryUid: record.libraryUid,
                                pluginUid: record.pluginUid,
                                fieldMap: JSON.stringify(redBookData.bindFieldData),
                                executeParams: JSON.stringify(newList)
                            });
                            if (res) {
                                message.success('保存成功');
                                setForceUpdate((pre: any) => pre + 1);
                            }
                        } else {
                            const res = await updatePlugConfigInfo({
                                libraryUid: record.libraryUid,
                                pluginUid: record.pluginUid,
                                uid: record.uid,
                                fieldMap: JSON.stringify(redBookData.bindFieldData),
                                executeParams: JSON.stringify(newList)
                            });
                            if (res) {
                                message.success('保存成功');
                                setForceUpdate((pre: any) => pre + 1);
                            }
                        }
                    }}
                    type="primary"
                >
                    保存配置
                </Button>
                <Button
                    loading={execountLoading}
                    onClick={async () => {
                        if (!redBookData.fieldList?.length) {
                            message.error('请至少绑定一素材字段!');
                            return;
                        }
                        const result = await form.validateFields();
                        const newList = redBookData.requirement?.map((item: any) => ({
                            ...item,
                            variableValue: result[item.variableKey]
                        }));
                        await updatePlugConfigInfo({
                            libraryUid: record.libraryUid,
                            pluginUid: record.pluginUid,
                            uid: record.uid,
                            fieldMap: JSON.stringify(redBookData.bindFieldData),
                            executeParams: JSON.stringify(newList)
                        });
                        setForceUpdate((pre: any) => pre + 1);

                        handleExecute();
                        handleAnalysis();
                    }}
                    type="primary"
                >
                    执行
                </Button>
                <Button
                    type="primary"
                    onClick={() => {
                        setRowPre(rowPre + 1);
                        setTriggerOpen(true);
                    }}
                >
                    定时任务
                </Button>
            </div>
            <ResultLoading
                materialExecutionOpen={materialExecutionOpen}
                setMaterialExecutionOpen={setMaterialExecutionOpen}
                materialPre={materialPre}
                executionCount={executionCount}
                totalCount={totalCount}
                successCount={successCount}
                errorCount={errorCount}
                materialzanList={materialzanList}
                errorMessage={errorMessage}
                timeSpent={((record?.executeTimeAvg * 1.1) / 1000) | 0 || 40}
                columns={[
                    { title: '序号', width: 70, render: (_: any, row: any, index: number) => <span>{index + 1}</span> },
                    ...columns?.filter((item: any) => Object.values(redBookData.bindFieldData || {}).includes(item.dataIndex))
                ]}
                resetExe={() => {
                    errorCountRef.current = 0;
                    successCountRef.current = 0;
                    executionCountRef.current = 0;
                    errorMessageRef.current = [];
                    setErrorCount(errorCountRef.current);
                    setSuccessCount(successCountRef.current);
                    setExecutionCount(executionCountRef.current);
                    setErrorMessage(errorMessageRef.current);
                    handleExecute();
                }}
                reTryExe={() => {
                    errorCountRef.current = 0;
                    executionCountRef.current = 0;
                    errorMessageRef.current = [];
                    setErrorCount(errorCountRef.current);
                    setExecutionCount(executionCountRef.current);
                    setErrorMessage(errorMessageRef.current);
                    handleExecute(true);
                }}
                handleSave={() => {
                    downTableData(materialzanListRef.current, 1);
                    setPlugMarketOpen(false);
                    onOpenChange(false);
                    setMaterialExecutionOpen(false);
                }}
                handleCancel={() => {
                    executionCountRef.current = 0;
                    setExecutionCount(executionCountRef.current);
                    aref.current = true;
                }}
            />
            {triggerOpen && (
                <TriggerModal
                    triggerOpen={triggerOpen}
                    setTriggerOpen={setTriggerOpen}
                    libraryUid={record?.libraryUid}
                    foreignKey={record?.uid}
                    rowData={rowData}
                    columns={columns}
                    record={record}
                    setRowPre={() => {
                        setRowPre(rowPre + 1);
                    }}
                />
            )}
        </ModalForm>
    );
};
export default PlugAnalysis;
