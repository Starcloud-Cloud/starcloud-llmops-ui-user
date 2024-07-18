import { Radio, Checkbox, Select, Input, Button, Row, Col } from 'antd';
const { Option } = Select;
import { PlusOutlined, DeleteOutlined } from '@ant-design/icons';
import _ from 'lodash-es';
import { memo } from 'react';
const TextExtraction = ({
    requirementList,
    textData,
    setRequirementList,
    setTextData,
    checkedList,
    selListLength,
    tableDataLength,
    setSelOpen,
    handleTextData
}: {
    requirementList: any[];
    textData: any;
    setRequirementList: (data: any) => void;
    setTextData: (data: any) => void;
    checkedList: any[];
    selListLength: number;
    tableDataLength: number;
    setSelOpen: (data: boolean) => void;
    handleTextData: (num: number) => void;
}) => {
    const handleAdd = () => {
        let newList = _.cloneDeep(requirementList);
        newList = [...requirementList, { title: '', value: '' }];
        setRequirementList(newList);
    };
    const handleEdit = (title: string, value: string, index: number) => {
        const newData = _.cloneDeep(textData);
        const newList = _.cloneDeep(requirementList);
        if (newData.bindFieldData[value]) {
            delete newData.bindFieldData[value];
        }
        const i = newData.fieldList.findIndex((item: any) => item === value);
        if (index !== -1) {
            newData.fieldList.splice(i, i + 1);
        }
        setTextData(newData);
        newList[index] = {
            ...newList[index],
            [title]: value
        };
        setRequirementList(newList);
    };
    const handleDel = (index: number) => {
        const newList = _.cloneDeep(requirementList);
        newList.splice(index, 1);
        setRequirementList(newList);
    };
    const handleExe = (num: number) => {
        if (!textData.checkedFieldList) {
            console.log(1);

            return false;
        }
        if (requirementList.length === 0 || requirementList.some((item: any) => !item.title)) {
            console.log(1);
            return false;
        }
        const arr = requirementList?.map((item) => item.title);
        if (new Set(arr).size !== arr.length) {
            console.log(1);
            return false;
        }
        if (textData.fieldList.length === 0) {
            console.log(1);
            return false;
        }
        let flag = false;
        textData.fieldList?.map((item: any) => {
            if (textData.bindFieldData[item]) {
                console.log(1);
                flag = false;
            } else {
                console.log(1);
                flag = true;
            }
        });
        if (flag) {
            console.log(1);
            return false;
        }
        console.log(11111);
        handleTextData(num);
    };
    const fieldState = (title: string) => {
        return requirementList?.filter((el) => el.title === title)?.length >= 2;
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
            {requirementList.length === 0 && <div className="text-xs text-[#ff4d4f] ml-[5px]">最少添加一个内容和要求</div>}
            <Row gutter={[16, 16]} align={'top'}>
                {requirementList?.map((item: any, index: number) => (
                    <>
                        <Col span={9}>
                            <Input
                                status={fieldState(item.title) || !item.title ? 'error' : ''}
                                value={item.title}
                                onChange={(e) => handleEdit('title', e.target.value, index)}
                                placeholder="字段描述"
                            />
                            {fieldState(item.title) && <span className="text-xs text-[#ff4d4f] ml-[5px]">字段描述不能重复</span>}
                            {!item.title && <span className="text-xs text-[#ff4d4f] ml-[5px]">字段描述必填</span>}
                        </Col>
                        <Col span={13}>
                            <Input value={item.value} onChange={(e) => handleEdit('value', e.target.value, index)} placeholder="字段要求" />
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
            <div className="text-[16px] font-bold my-4">3. 绑定内容提取的字段</div>
            <Checkbox.Group
                key={JSON.stringify(requirementList)}
                value={textData.fieldList}
                onChange={(data) => {
                    setTextData({
                        ...textData,
                        fieldList: data
                    });
                }}
            >
                {requirementList?.map((item: any, i: number) => (
                    <div key={String(item.title) + i} className="mb-4">
                        <Checkbox key={String(item.title) + i} value={item.title}>
                            {item.title}
                        </Checkbox>
                        <div className="flex items-center">
                            <span className="text-xs">绑定字段：</span>
                            <Select
                                status={textData.fieldList.includes(item.title) && !textData.bindFieldData[item.title] ? 'error' : ''}
                                value={textData.bindFieldData[item.title]}
                                onChange={(e) => {
                                    setTextData({
                                        ...textData,
                                        bindFieldData: {
                                            ...textData.bindFieldData,
                                            [item.title]: e
                                        }
                                    });
                                }}
                                className="w-[100px]"
                            >
                                {checkedList?.map((item) => (
                                    <Option key={item.dataIndex} value={item.dataIndex}>
                                        {item.title}
                                    </Option>
                                ))}
                            </Select>
                        </div>
                        {textData.fieldList.includes(item.title) && !textData.bindFieldData[item.title] ? (
                            <span className="text-xs text-[#ff4d4f] ml-[4px] h-[22px]">该字段为必填项</span>
                        ) : (
                            <div className="h-[22px]"> </div>
                        )}
                    </div>
                ))}
            </Checkbox.Group>
            <div className="text-[16px] font-bold my-4">4. 如何处理素材</div>
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
        _.isEqual(pre.requirementList, next.requirementList) &&
        _.isEqual(pre.textData, next.textData) &&
        _.isEqual(pre.checkedList, next.checkedList) &&
        _.isEqual(pre.selListLength, next.selListLength) &&
        _.isEqual(pre.tableDataLength, next.tableDataLength)
    );
};
export default memo(TextExtraction, memoTextExtraction);
