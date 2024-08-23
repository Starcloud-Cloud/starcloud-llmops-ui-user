import { Input, Select, Modal, Table, message, Switch, Popover, Space, Tag, Form, Button } from 'antd';
const { Option } = Select;
import { useEffect, useRef, useState, useMemo } from 'react';
import { QuestionCircleOutlined } from '@ant-design/icons';
import _ from 'lodash';
import React from 'react';
import ChatMarkdown from 'ui-component/Markdown';
import dayjs from 'dayjs';

const value2JsonMd = (value: any) => `
~~~json
${JSON.stringify(value, null, 2)}
~~~
`;

const PlugAnalysis = ({
    metaData,
    columns,
    onOpenChange,
    open,
    record,
    redBookData,
    setRedBookData,
    form
}: {
    metaData: any;
    columns: any[];
    onOpenChange: any;
    open: any;
    record: any;
    redBookData: any;
    setRedBookData: (data: any) => void;
    form: any;
}) => {
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
        if (!record?.fieldMap) {
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
                requirement: JSON.parse(record?.inputFormart || '[]')?.map((item: any, index: number) => ({
                    ...item,
                    variableDesc:
                        JSON.parse(record?.executeParams || '[]')?.find((i: any) => i.variableKey === item.variableKey)?.variableDesc ||
                        item?.variableDesc,
                    variableValue:
                        JSON.parse(record?.executeParams || '[]')?.find((i: any) => i.variableKey === item.variableKey)?.variableValue ||
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
            console.log(record, record.inputFormart);

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
    return (
        <Modal
            width="60%"
            title={
                <div className=" flex flex-col">
                    <div className="flex  items-center mb-2">
                        <span className="text-[26px]">{record?.pluginName}</span>
                        <div className="flex justify-between items-center ml-2 ">
                            <Space>
                                <Tag color="processing">{metaData.scene?.find((item: any) => item.value === record?.scene)?.label}</Tag>
                                <Tag color="purple">{metaData.platform?.find((item: any) => item.value === record?.type)?.label}</Tag>
                                {record?.updateTime && (
                                    <span className="text-xs text-black/50">
                                        更新时间: {dayjs(record?.updateTime).format('YYYY-MM-DD HH:mm:ss')}
                                    </span>
                                )}
                            </Space>
                        </div>
                    </div>
                    <div className="text-xs text-black/50 mt-1">{record?.description}</div>
                </div>
            }
            open={open}
            onCancel={() => onOpenChange(false)}
            footer={false}
        >
            <div className="text-[16px] font-bold mb-4">
                1.输入内容
                <Popover
                    content={
                        <div className="w-[500px] max-h-[300px] overflow-auto">
                            <ChatMarkdown textContent={record?.input && value2JsonMd(JSON.parse(record?.input))} />
                        </div>
                    }
                    title="参数示例"
                >
                    <QuestionCircleOutlined className="ml-1 cursor-pointer" />
                </Popover>
            </div>
            <Form form={form} layout={'vertical'} labelCol={{ span: 12 }}>
                {redBookData.requirement?.map((item: any) => (
                    <Form.Item
                        initialValue={item.variableValue}
                        key={item.uuid}
                        label={item.variableKey + (item.variableDesc ? `(${item.variableDesc})` : '')}
                        name={item.variableKey}
                        rules={[{ required: true, message: item.variableKey + '是必填项' }]}
                    >
                        <Input />
                    </Form.Item>
                ))}
            </Form>
            <div className="text-[16px] font-bold my-4 flex">
                2.输出字段绑定
                <Popover
                    content={
                        <div className="w-[500px] max-h-[300px] overflow-auto">
                            <ChatMarkdown textContent={record?.output && value2JsonMd(JSON.parse(record?.output))} />
                        </div>
                    }
                    title="参数示例"
                >
                    <QuestionCircleOutlined className="ml-1 cursor-pointer" />
                </Popover>
            </div>
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
                                                        disabled={Object.values(redBookData.bindFieldData || {}).includes(item.dataIndex)}
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
            <div className="mt-4 flex justify-center">
                <Button className="w-[100px]" type="primary" onClick={() => onOpenChange(false)}>
                    保存
                </Button>
            </div>
        </Modal>
    );
};
export default PlugAnalysis;
