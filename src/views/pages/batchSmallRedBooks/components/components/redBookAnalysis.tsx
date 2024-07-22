import { Input, Checkbox, Select, Button, Table, message, Switch } from 'antd';
const { TextArea } = Input;
const { Option } = Select;
import { memo, useEffect, useState } from 'react';
import { pluginsXhsOcr } from 'api/redBook/batchIndex';
import { isEqual, sortBy } from 'lodash-es';
const RedBookAnalysis = ({
    columns,
    redBookData,
    setRedBookData,
    xhsAnalysis
}: {
    columns: any[];
    redBookData: any;
    setRedBookData: (data: any) => void;
    xhsAnalysis: () => void;
}) => {
    const [requirementStatusOpen, setrequirementStatusOpen] = useState(false);
    const [data, setData] = useState<any[]>([]);

    const redList = [
        { label: '小红书标题', value: 'title' },
        { label: '小红书内容', value: 'content' },
        { label: '小红书标签', value: 'tags' },
        { label: '图片 1', value: 'image1' },
        { label: '图片 2', value: 'image2' },
        { label: '图片 3', value: 'image3' },
        { label: '图片 4', value: 'image4' },
        { label: '图片 5', value: 'image5' },
        { label: '图片 6', value: 'image6' },
        { label: '图片 7', value: 'image7' },
        { label: '图片 8', value: 'image8' },
        { label: '图片 9', value: 'image9' },
        { label: '图片 10', value: 'image10' },
        { label: '全部 OCR 信息', value: 'allOcrContent' }
    ];

    useEffect(() => {
        const data = redList.map((item) => {
            return {
                label: item.label,
                label_key: item.value
            };
        });
        setData(data);
    }, [redList]);

    return (
        <div>
            <div className="text-[16px] font-bold mb-4">1.输入需要抓取的小红书链接，最大支持 20 个</div>
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
                <span className="text-xs text-[#ff4d4f] ml-[4px]">优化字段内容必填</span>
            )}

            <div className="text-[16px] font-bold my-4 flex justify-between">
                <span>2.绑定小红书字段</span>
                <div className="flex items-center justify-center">
                    <span className="text-sm font-medium mr-2">OCR内容清洗:</span>
                    <Switch checkedChildren="开启" unCheckedChildren="关闭" defaultChecked />
                </div>
            </div>
            {/* <div className="flex items-center gap-6">
                <Checkbox.Group
                    onChange={(data) =>
                        setRedBookData({
                            ...redBookData,
                            fieldList: data
                        })
                    }
                >
                    {redList?.map((item) => (
                        <div key={item.value} className="mb-4">
                            <Checkbox value={item.value}>{item.label}</Checkbox>
                            <div className="flex items-center">
                                <span className="text-xs">绑定字段：</span>
                                <Select
                                    allowClear
                                    value={redBookData?.bindFieldData && redBookData?.bindFieldData[item.value]}
                                    status={
                                        redBookData?.fieldList?.includes(item.value) && !redBookData?.bindFieldData[item.value]
                                            ? 'error'
                                            : ''
                                    }
                                    onChange={(e) =>
                                        setRedBookData({
                                            ...redBookData,
                                            bindFieldData: {
                                                ...redBookData?.bindFieldData,
                                                [item.value]: e
                                            }
                                        })
                                    }
                                    className="w-[100px]"
                                >
                                    {columns?.map((item) => (
                                        <Option value={item.dataIndex}>{item.title}</Option>
                                    ))}
                                </Select>
                            </div>
                            {redBookData?.fieldList?.includes(item.value) && !redBookData?.bindFieldData[item.value] ? (
                                <span className="text-xs text-[#ff4d4f] ml-[4px] h-[22px]">该字段为必填项</span>
                            ) : (
                                <div className="h-[22px]"> </div>
                            )}
                        </div>
                    ))}
                </Checkbox.Group>
            </div> */}
            <div>
                <Table
                    pagination={false}
                    bordered
                    size="small"
                    columns={[
                        {
                            title: '小红书字段',
                            dataIndex: 'label',
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
                                    <Select
                                        style={{ width: 160 }}
                                        allowClear
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
                                            .filter((item) => item.title !== '使用次数')
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
                                );
                            }
                        }
                    ]}
                    dataSource={data}
                />
            </div>

            <div className="flex justify-center gap-6 mt-6">
                {/* <Button
                    onClick={() => {
                        if (!redBookData.requirement) {
                            setrequirementStatusOpen(true);
                            return false;
                        }
                    }}
                    type="primary"
                >
                    保存配置
                </Button> */}
                <Button
                    onClick={() => {
                        console.log(redBookData, 'redBookData');
                        // let fieldList = redBookData.fieldList;
                        // const bindFieldData = Object.keys(redBookData.bindFieldData);
                        // const areArraysEqual = isEqual(sortBy(fieldList), sortBy(bindFieldData));
                        // if (!areArraysEqual) {
                        //     return false;
                        // }
                        if (!redBookData.fieldList?.length) {
                            message.error('请至少绑定一素材字段!');
                            return;
                        }
                        xhsAnalysis();
                    }}
                    type="primary"
                >
                    执行
                </Button>
            </div>
        </div>
    );
};
export default RedBookAnalysis;
