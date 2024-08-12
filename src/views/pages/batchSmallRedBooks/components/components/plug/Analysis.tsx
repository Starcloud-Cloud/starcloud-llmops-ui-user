import { Input, Select, Button, Table, message, Switch, Popover, Space, Tag, Form } from 'antd';
const { TextArea } = Input;
const { Option } = Select;
import { useEffect, useRef, useState, useMemo } from 'react';
import { QuestionCircleOutlined } from '@ant-design/icons';
import _ from 'lodash';
import React from 'react';
import { ModalForm } from '@ant-design/pro-components';
import { addPlugConfigInfo, updatePlugConfigInfo } from 'api/plug';
import { plugexEcuteResult, plugExecute } from 'api/redBook/plug';
import ChatMarkdown from 'ui-component/Markdown';
import ResultLoading from '../resultLoading';

const value2JsonMd = (value: any) => `
~~~json
${JSON.stringify(value, null, 2)}
~~~
`;

const PlugAnalysis = ({
    metaData,
    columns,
    handleAnalysis,
    downTableData,
    setPlugMarketOpen,
    onOpenChange,
    open,
    record
}: {
    metaData: any;
    columns: any[];
    handleAnalysis: () => void;
    setPlugMarketOpen: (data: any) => void;
    downTableData: (data: any, num: number) => void;
    onOpenChange: any;
    open: any;
    record: any;
}) => {
    const [form] = Form.useForm();
    const [execountLoading, setExecountLoading] = useState(false);
    const [redBookData, setRedBookData] = useState<any>({});
    const [requirementStatusOpen, setrequirementStatusOpen] = useState(false);
    const [data, setData] = useState<any[]>([]);

    //输入内容
    const getFormItem = () => {
        if (redBookData.requirement) {
            return Object.entries(redBookData.requirement)?.map(([key, value]) => (
                <Form.Item key={key} label={key} name={key} rules={[{ required: true, message: '该选项必填' }]}>
                    <Input />
                </Form.Item>
            ));
        } else {
            console.log(redBookData.requirement);

            return null;
        }
    };

    const redList = React.useMemo(() => {
        const outputFormart = JSON.parse(record?.outputFormart) || [];
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
        if (!record?.fieldMap) {
            let data: any[] = [];
            redList.forEach((redItem: any) => {
                const value =
                    columns.filter((item) => !item.isDefault).find((item) => item.titleText === redItem.des)?.dataIndex ||
                    columns.filter((item) => !item.isDefault).find((item) => item.dataIndex === redItem.value)?.dataIndex;

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
                fieldList: fieldList,
                bindFieldData: obj
            }));
            setData(data);
        }
    }, [columns, record]);

    useEffect(() => {
        if (record.fieldMap) {
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
                fieldList: fieldList,
                bindFieldData: obj
            }));

            setData(data);
        }
    }, [columns, record]);
    useEffect(() => {
        if (record.executeParams) {
            setRedBookData({
                ...redBookData,
                requirement: JSON.parse(record.executeParams)
            });
        } else {
            setRedBookData({
                ...redBookData,
                requirement: {}
            });
        }
    }, [record]);

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
        return ((((successCountRef.current + errorCountRef.current) / totalCountRef.current) * 100) | 0) + preeNum.current;
    }, [successCount, totalCount, prenum]);

    const materialzanListRef = useRef<any[]>([]);
    const [materialzanList, setMaterialzanList] = useState<any[]>([]);

    const timer = useRef<any>(null);
    const handleExecute = async (retry?: boolean) => {
        setExecountLoading(true);
        try {
            const formRes = await form.validateFields();
            console.log(formRes);
            return;
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
                    if (res.status !== 'in_progress') {
                        const List = res.output;
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
            }, 2000);
        } catch (err) {
            console.log(111111);

            setExecountLoading(false);
        }
    };
    const timeLoading = useRef<any>(null);
    const grupPre = useRef(0);
    useEffect(() => {
        if (materialExecutionOpen && executionCountRef.current) {
            const newNum = grupPre.current || executionCountRef.current || 1;
            console.log(newNum, totalCountRef.current);

            const newSuccessNum = ((newNum / totalCountRef.current) * 100) | 0;
            timeLoading.current = setInterval(() => {
                console.log(newNum, preeNum.current, newSuccessNum);

                if (preeNum.current < newSuccessNum - 1) {
                    preeNum.current += 1;
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
            console.log(1);
            preeNum.current = 0;
            setPrenum(preeNum.current);
            clearInterval(timer.current);
            clearInterval(timeLoading.current);
        }
    }, [open, materialExecutionOpen]);
    return (
        <ModalForm
            modalProps={{
                maskClosable: false
            }}
            title={
                <div className="flex flex-col">
                    <div className="flex  items-center mb-2">
                        <span className="text-[26px]">{record.pluginName}</span>
                        <div className="flex justify-between items-center ml-2 ">
                            <Space>
                                <Tag color="processing">{metaData.scene?.find((item: any) => item.value === record.scene).label}</Tag>
                                <Tag color="purple">{metaData.platform?.find((item: any) => item.value === record.type).label}</Tag>
                            </Space>
                        </div>
                    </div>
                    <div className="text-xs text-black/50 mt-1">{record.description}</div>
                </div>
            }
            open={open}
            onOpenChange={onOpenChange}
            submitter={false}
        >
            <div>
                <div className="text-[16px] font-bold mb-4">
                    1.输入内容
                    <Popover
                        content={
                            <div className="w-[500px] max-h-[300px] overflow-auto">
                                <ChatMarkdown textContent={value2JsonMd(JSON.parse(record.input))} />
                            </div>
                        }
                        title="参数示例"
                    >
                        <QuestionCircleOutlined className="ml-1 cursor-pointer" />
                    </Popover>
                </div>
                {/* <TextArea
                    defaultValue={redBookData?.requirement}
                    status={!redBookData?.requirement && requirementStatusOpen ? 'error' : ''}
                    onBlur={(e) => {
                        setRedBookData({ ...redBookData, requirement: e.target.value });
                        setrequirementStatusOpen(true);
                    }}
                    rows={10}
                /> */}
                <Form form={form} layout={'vertical'} labelCol={{ span: 6 }}>
                    {getFormItem()}
                </Form>
                {/* {!redBookData?.requirement && requirementStatusOpen && (
                    <span className="text-xs text-[#ff4d4f] ml-[4px]">输入内容必填</span>
                )} */}

                <div className="text-[16px] font-bold my-4 flex justify-between">
                    <span>
                        2.输出字段绑定
                        <Popover
                            content={
                                <div className="w-[500px] max-h-[300px] overflow-auto">
                                    <ChatMarkdown textContent={value2JsonMd(JSON.parse(record.output))} />
                                </div>
                            }
                            title="参数示例"
                        >
                            <QuestionCircleOutlined className="ml-1 cursor-pointer" />
                        </Popover>
                    </span>
                </div>

                <div>
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
                                                    let fieldList = redBookData.fieldList;
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
                                                                disabled={
                                                                    redBookData.bindFieldData &&
                                                                    Object.values(redBookData.bindFieldData).includes(item.dataIndex)
                                                                }
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
                </div>

                <div className="flex justify-center gap-6 mt-6">
                    <Button
                        onClick={async () => {
                            if (!record.fieldMap && !record.executeParams) {
                                const res = await addPlugConfigInfo({
                                    libraryUid: record.libraryUid,
                                    pluginUid: record.pluginUid,
                                    fieldMap: JSON.stringify(redBookData.bindFieldData),
                                    executeParams: redBookData.requirement
                                    // executeParams: JSON.stringify({})
                                });
                                if (res) {
                                    message.success('保存成功');
                                }
                            } else {
                                const res = await updatePlugConfigInfo({
                                    libraryUid: record.libraryUid,
                                    pluginUid: record.pluginUid,
                                    uid: record.uid,
                                    fieldMap: JSON.stringify(redBookData.bindFieldData),
                                    executeParams: redBookData.requirement
                                    // executeParams: JSON.stringify({})
                                });
                                if (res) {
                                    message.success('保存成功');
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
                            if (!redBookData.requirement) {
                                message.error('请输入小红书链接!');
                                return;
                            }
                            if (!redBookData.fieldList?.length) {
                                message.error('请至少绑定一素材字段!');
                                return;
                            }
                            if (!record.fieldMap && !record.executeParams) {
                                const res = await addPlugConfigInfo({
                                    libraryUid: record.libraryUid,
                                    pluginUid: record.pluginUid,
                                    fieldMap: JSON.stringify(redBookData.bindFieldData),
                                    executeParams: redBookData.requirement
                                    // executeParams: JSON.stringify({})
                                });
                                if (res) {
                                    message.success('保存成功');
                                }
                            } else {
                                const res = await updatePlugConfigInfo({
                                    libraryUid: record.libraryUid,
                                    pluginUid: record.pluginUid,
                                    uid: record.uid,
                                    fieldMap: JSON.stringify(redBookData.bindFieldData),
                                    executeParams: redBookData.requirement
                                    // executeParams: JSON.stringify({})
                                });
                                if (res) {
                                    message.success('保存成功');
                                }
                            }
                            handleExecute();
                            handleAnalysis();
                        }}
                        type="primary"
                    >
                        执行
                    </Button>
                </div>
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
        </ModalForm>
    );
};
export default PlugAnalysis;
