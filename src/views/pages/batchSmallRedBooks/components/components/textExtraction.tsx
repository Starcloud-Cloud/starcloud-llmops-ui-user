import { Radio, Checkbox, Select, Input, Button, Row, Col } from 'antd';
const { Option } = Select;
import { PlusOutlined, DeleteOutlined } from '@ant-design/icons';
import _ from 'lodash-es';
import { memo } from 'react';
const TextExtraction = ({
    textData,
    setTextData,
    checkedList,
    selListLength,
    tableDataLength,
    setSelOpen,
    handleTextData
}: {
    textData: any;
    setTextData: (data: any) => void;
    checkedList: any[];
    selListLength: number;
    tableDataLength: number;
    setSelOpen: (data: boolean) => void;
    handleTextData: (num: number) => void;
}) => {
    const handleAdd = () => {
        let newList = _.cloneDeep(textData.requirementList);
        newList = [...textData.requirementList, { title: '', value: '' }];
        setTextData({
            ...textData,
            requirementList: newList
        });
    };
    const handleEdit = (title: string, value: string, index: number) => {
        const newList = _.cloneDeep(textData.requirementList);
        newList[index] = {
            ...newList[index],
            [title]: value
        };
        setTextData({
            ...textData,
            requirementList: newList
        });
    };
    const handleDel = (index: number) => {
        let newList = _.cloneDeep(textData.requirementList);
        newList.splice(index, 1);
        setTextData({
            ...textData,
            requirementList: newList
        });
    };
    const handleExe = (num: number) => {
        handleTextData(num);
    };
    return (
        <div>
            <div className="text-[16px] font-bold mb-4">1.选择需要 AI 智能提取的字段</div>
            <Radio.Group
                onChange={(e) => {
                    setTextData({
                        ...textData,
                        checkedFieldList: e.target.value
                    });
                }}
                value={textData.checkedFieldList}
            >
                {checkedList?.map((item) => (
                    <Radio key={item.dataIndex} value={item.dataIndex}>
                        {item.title}
                    </Radio>
                ))}
            </Radio.Group>
            {!textData.checkedFieldList && <div className="text-xs text-[#ff4d4f] ml-[5px]">选择需要提取的字段</div>}
            <div className="text-[16px] font-bold my-4">2.写出相提取的字段和内容要求</div>
            {textData.requirementList.length === 0 && <div className="text-xs text-[#ff4d4f] ml-[5px]">最少添加一个内容和要求</div>}
            <Row gutter={[16, 16]} align={'top'}>
                {textData.requirementList?.map((item: any, index: number) => (
                    <>
                        <Col span={15}>
                            <Input
                                value={item.title}
                                onChange={(e) => handleEdit('title', e.target.value, index)}
                                placeholder="想提取内容的要求"
                            />
                        </Col>
                        <Col span={7}>
                            <Select
                                placeholder="写入到"
                                allowClear
                                value={item.value}
                                onChange={(e) => handleEdit('value', e, index)}
                                className="w-full"
                            >
                                {checkedList?.map((item) => (
                                    <Option
                                        disabled={textData.requirementList.map((i: any) => i.value).includes(item.dataIndex)}
                                        value={item.dataIndex}
                                    >
                                        {item.title}
                                    </Option>
                                ))}
                            </Select>
                        </Col>
                        <Col span={2}>
                            <Button onClick={() => handleDel(index)} type="text" danger shape="circle" icon={<DeleteOutlined />} />
                        </Col>
                    </>
                ))}
            </Row>
            <Button className="mt-4" onClick={handleAdd} type="primary" icon={<PlusOutlined />}>
                增加
            </Button>
            <div className="text-[16px] font-bold my-4">3. 如何处理素材</div>
            <Button className="mb-4" type="primary" size="small" onClick={() => setSelOpen(true)}>
                选择素材
            </Button>
            <div className="flex justify-center gap-2">
                <Button className="h-[50px]" disabled={selListLength === 0} onClick={() => handleExe(1)} type="primary">
                    <div className="flex flex-col items-center">
                        处理选中的素材
                        <div>({selListLength})</div>
                    </div>
                </Button>
                <Button
                    className="h-[50px]"
                    disabled={tableDataLength === 0}
                    onClick={() => {
                        handleExe(2);
                    }}
                    type="primary"
                >
                    <div className="flex flex-col items-center">
                        处理全部素材
                        <div>({tableDataLength})</div>
                    </div>
                </Button>
            </div>
        </div>
    );
};
const memoTextExtraction = (pre: any, next: any) => {
    return (
        _.isEqual(pre.textData, next.textData) &&
        _.isEqual(pre.checkedList, next.checkedList) &&
        _.isEqual(pre.selListLength, next.selListLength) &&
        _.isEqual(pre.tableDataLength, next.tableDataLength)
    );
};
export default memo(TextExtraction, memoTextExtraction);
