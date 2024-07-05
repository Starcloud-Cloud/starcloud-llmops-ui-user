import { Input, Checkbox, Select, Button } from 'antd';
const { TextArea } = Input;
const { Option } = Select;
import { useState } from 'react';
import { pluginsXhsOcr } from 'api/redBook/batchIndex';
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
    const redList = [
        { label: ' 小红书标题', value: 'title' },
        { label: ' 小红书内容', value: 'content' },
        { label: ' 小红书标签', value: 'tags' },
        { label: ' 图片 1', value: 'image1' },
        { label: ' 图片 2', value: 'image2' },
        { label: ' 图片 3', value: 'image3' },
        { label: ' 图片 4', value: 'image4' },
        { label: ' 图片 5', value: 'image5' },
        { label: ' 图片 6', value: 'image6' },
        { label: ' 图片 7', value: 'image7' },
        { label: ' 图片 8', value: 'image8' },
        { label: ' 图片 9', value: 'image9' },
        { label: ' 图片 10', value: 'image10' }
    ];
    return (
        <div>
            <div className="text-[16px] font-bold mb-4">1.输入需要抓取的小红书链接，最大支持 20 个</div>
            <TextArea
                placeholder=" 使用逗号或回车来分割"
                defaultValue={redBookData.requirement}
                status={!redBookData.requirement && requirementStatusOpen ? 'error' : ''}
                onBlur={(e) => {
                    setRedBookData({ ...redBookData, requirement: e.target.value });
                    setrequirementStatusOpen(true);
                }}
                rows={10}
            />
            {!redBookData.requirement && requirementStatusOpen && <span className="text-xs text-[#ff4d4f] ml-[4px]">优化字段内容必填</span>}

            <div className="text-[16px] font-bold my-4">2.绑定小红书字段</div>
            <div className="flex items-center gap-6">
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
                                    value={redBookData.bindFieldData[item.value]}
                                    onChange={(e) =>
                                        setRedBookData({
                                            ...redBookData,
                                            bindFieldData: {
                                                ...redBookData.bindFieldData,
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
                        </div>
                    ))}
                </Checkbox.Group>
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
                        if (!redBookData.requirement) {
                            setrequirementStatusOpen(true);
                            return false;
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
