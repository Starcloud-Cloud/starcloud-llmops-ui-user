import { Input, Select, Button, Table, message, Switch, Popover } from 'antd';
const { TextArea } = Input;
const { Option } = Select;
import { useEffect, useRef, useState } from 'react';
import { QuestionCircleOutlined } from '@ant-design/icons';
import _ from 'lodash';
import React from 'react';
import { ModalForm } from '@ant-design/pro-components';
import { addPlugConfigInfo, updatePlugConfigInfo } from 'api/plug';
import { plugexEcuteResult, plugExecute } from 'api/redBook/plug';
import ChatMarkdown from 'ui-component/Markdown';

const value2JsonMd = (value: any) => `
~~~json
${JSON.stringify(value, null, 2)}
~~~
`;

const PlugAnalysis = ({
    columns,
    handleAnalysis,
    downTableData,
    setPlugMarketOpen,
    onOpenChange,
    open,
    record
}: {
    columns: any[];
    handleAnalysis: () => void;
    setPlugMarketOpen: (data: any) => void;
    downTableData: (data: any, num: number) => void;
    onOpenChange: any;
    open: any;
    record: any;
}) => {
    const [execountLoading, setExecountLoading] = useState(false);
    const [redBookData, setRedBookData] = useState<any>({});
    const [requirementStatusOpen, setrequirementStatusOpen] = useState(false);
    const [data, setData] = useState<any[]>([]);

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
    const timer = useRef<any>(null);
    const handleExecute = async () => {
        setExecountLoading(true);
        try {
            const code = await plugExecute({
                uuid: record.pluginUid,
                inputParams: {
                    URL: 'https://mp.weixin.qq.com/s/_RHcCKx-ZbqqqV7qTWGbTw'
                }
            });
            timer.current = setInterval(async () => {
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
                    downTableData(newList, 1);
                    setPlugMarketOpen(false);
                    onOpenChange(false);
                    setExecountLoading(false);
                    clearInterval(timer.current);
                    console.log(res.output);
                }
            }, 2000);
        } catch (err) {
            setExecountLoading(false);
            clearInterval(timer.current);
        }
    };

    useEffect(() => {
        return () => {
            clearInterval(timer.current);
        };
    }, []);

    useEffect(() => {
        if (!record?.fieldMap) {
            let data: any[] = [];
            redList.forEach((redItem: any) => {
                const value =
                    columns.find((item) => item.title === redItem.des)?.dataIndex ||
                    columns.find((item) => item.dataIndex === redItem.value)?.dataIndex;

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

    return (
        <ModalForm
            title={'数据新增'}
            open={open}
            onOpenChange={onOpenChange}
            modalProps={{
                destroyOnClose: true
            }}
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
                <TextArea
                    placeholder=" 使用逗号或回车来分割"
                    defaultValue={redBookData?.requirement}
                    status={!redBookData?.requirement && requirementStatusOpen ? 'error' : ''}
                    onBlur={(e) => {
                        setRedBookData({ ...redBookData, requirement: e.target.value });
                        setrequirementStatusOpen(true);
                    }}
                    rows={10}
                />
                {!redBookData?.requirement && requirementStatusOpen && (
                    <span className="text-xs text-[#ff4d4f] ml-[4px]">输入内容必填</span>
                )}

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
                                align: 'center'
                            },
                            {
                                title: '绑定到',
                                align: 'center',
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
                                                                disabled={Object.values(redBookData.bindFieldData).includes(item.dataIndex)}
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
                            if (!redBookData.requirement) {
                                setrequirementStatusOpen(true);
                                return false;
                            }
                            if (!record.fieldMap && !record.executeParams) {
                                const res = await addPlugConfigInfo({
                                    libraryUid: record.libraryUid,
                                    pluginUid: record.pluginUid,
                                    fieldMap: JSON.stringify(redBookData.bindFieldData),
                                    executeParams: JSON.stringify({})
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
                                    executeParams: JSON.stringify({})
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
                            // if (!redBookData.requirement) {
                            //     message.error('请输入小红书链接!');
                            //     return;
                            // }
                            if (!redBookData.fieldList?.length) {
                                message.error('请至少绑定一素材字段!');
                                return;
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
        </ModalForm>
    );
};
export default PlugAnalysis;
