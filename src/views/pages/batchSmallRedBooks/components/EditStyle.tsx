import { FormControl, FormHelperText, TextField } from '@mui/material';
import { Input, Popover, Tree, Image, Row, Col, Menu, Switch, Select } from 'antd';
import type { TreeDataNode } from 'antd';
import { PlusCircleOutlined } from '@ant-design/icons';
import { useEffect, useState, useRef } from 'react';
import _ from 'lodash-es';
import { SelectTemplateModal } from './SelectTemplateModal';

import React from 'react';
import { getImageTemplateTypes } from 'api/template';
const { SubMenu } = Menu;
const treeData: TreeDataNode[] = [
    {
        title: 'parent 1',
        key: '0-0',
        children: [
            {
                title: (
                    <div className="flex items-center gap-2">
                        <Input className="flex-1" size="small" />
                        <Select className="flex-1" size="small"></Select>
                        <PlusCircleOutlined rev={undefined} />
                    </div>
                ),
                key: '0-0-0',
                children: [
                    {
                        title: 'leaf',
                        key: '0-0-0-0'
                    },
                    {
                        title: 'leaf',
                        key: '0-0-0-1'
                    },
                    {
                        title: 'leaf',
                        key: '0-0-0-2'
                    }
                ]
            },
            {
                title: 'parent 1-1',
                key: '0-0-1',
                children: [
                    {
                        title: 'leaf',
                        key: '0-0-1-0'
                    }
                ]
            },
            {
                title: 'parent 1-2',
                key: '0-0-2',
                children: [
                    {
                        title: 'leaf',
                        key: '0-0-2-0'
                    },
                    {
                        title: 'leaf',
                        key: '0-0-2-1'
                    }
                ]
            }
        ]
    }
];
const EditStyle = ({
    schemaList,
    typeList,
    imageStyleData,
    setData
}: {
    schemaList?: any[];
    typeList: any[];
    imageStyleData: any;
    setData: (data: any) => void;
}) => {
    const [open, setOpen] = React.useState(false);
    const [currentTemp, setCurrentTemp] = React.useState<any>(null);
    const [tempList, setTempList] = React.useState<any>([]);
    const [imageTypeList, setImageTypeList] = React.useState<any[]>([]);
    const handleOk = (temp: any) => {
        setCurrentTemp(temp);
        const newData = _.cloneDeep(imageStyleData);
        newData.id = temp.id;
        newData.variableList = temp.variableList;
        setData(newData);
        setOpen(false);
    };
    useEffect(() => {
        getImageTemplateTypes().then((res) => {
            setImageTypeList(res);
            const list = res.map((element: any) => {
                return element.list;
            });
            setTempList(list.flat());
        });
    }, []);
    useEffect(() => {
        if (imageStyleData.id) {
            const data = tempList.find((v: any) => v.id === imageStyleData?.id);
            setCurrentTemp(data);
        }
    }, [imageStyleData, tempList]);
    const { TextArea } = Input;
    const [perOpen, setPerOpen] = useState<any[]>([]);
    const [tipValue, setTipValue] = useState('');
    const [items, setItem] = useState<any[]>([]);
    useEffect(() => {
        setTipValue('');
    }, [JSON.stringify(perOpen)]);
    const convertSchemaToLabelTitleArray = (schema: any) => {
        const result: any = [];
        const processProperties = (properties: any, parentName = '') => {
            for (const key in properties) {
                const property = properties[key];
                const label = parentName ? `${parentName}.${key}` : key;
                if (property.type === 'object' && property.properties) {
                    processProperties(property.properties, label);
                } else if (property.type === 'array' && property.items && property.items.properties) {
                    processProperties(property.items.properties, label);
                } else {
                    result.push({ label: label, title: property.title });
                }
            }
        };

        if (schema.properties) {
            processProperties(schema.properties);
        }
        return result;
    };
    const getJSON = (item: any) => {
        let obj: any = {};
        try {
            obj = {
                ...JSON.parse(item.inJsonSchema),
                properties: {
                    ...JSON.parse(item.inJsonSchema).properties,
                    ...JSON.parse(item.outJsonSchema)
                }
            };
        } catch (err) {
            obj = {};
        }
        return obj;
    };
    function getjsonschma(json: any) {
        const arr: any = [];
        for (const key in json.properties) {
            const property = json.properties[key];
            if (property.type === 'object') {
                const convertedProperty = getjsonschma(property);
                arr.push(convertedProperty);
            } else if (property.type === 'array') {
                arr.push(
                    ...Object.values(property)
                        ?.filter((item) => typeof item === 'object')
                        ?.map((item, index) => ({
                            key: key,
                            label: `${key}[${index}]`,
                            title: property?.title,
                            desc: property?.description,
                            children: getjsonschma(item)
                        }))
                );
            } else if (property.type === 'list') {
                arr.push(
                    ...Object.values(property)
                        ?.filter((item) => typeof item === 'object')
                        ?.map((item, index) => ({
                            key: key,
                            label: `${key}.(*)`,
                            title: property?.title,
                            desc: property?.description,
                            children: getjsonschma(item)
                        }))
                );
            } else {
                arr.push({
                    key,
                    label: key,
                    title: property?.title,
                    desc: property?.description
                });
            }
        }
        return arr;
    }
    function renderMenuItems(data: any) {
        return data.map((item: any, index: number) => {
            if (item.children && item.children.length > 0) {
                return (
                    <SubMenu title={item.label} key={item.key}>
                        {renderMenuItems(item.children)}
                    </SubMenu>
                );
            } else {
                return (
                    <Menu.Item
                        onClick={(data: any) => {
                            const newData = _.cloneDeep(imageStyleData);
                            if (!newData.variableList[index].value) {
                                newData.variableList[index].value = '';
                            }
                            const part1 = newData.variableList[index].value.slice(
                                0,
                                inputList?.current[index]?.resizableTextArea?.textArea?.selectionStart
                            );
                            const part2 = newData.variableList[index].value.slice(
                                inputList?.current[index]?.resizableTextArea?.textArea?.selectionStart
                            );
                            newData.variableList[index].value = `${part1}{{${data?.keyPath[1]}.${data?.keyPath[0]}}}${part2}`;
                            const newData1 = _.cloneDeep(perOpen);
                            newData1[index] = false;
                            setPerOpen(newData1);
                            setData(newData);
                        }}
                        key={item.key}
                    >
                        <div
                            onMouseEnter={() => {
                                setTipValue(item.title);
                            }}
                            className="w-full flex justify-between items-center"
                        >
                            <div>{item.label}</div>
                            <div className="text-xs text-black/50">{item.desc}</div>
                        </div>
                    </Menu.Item>
                );
            }
        });
    }
    useEffect(() => {
        const newList = schemaList
            ?.filter((item) => item.inJsonSchema || item.outJsonSchema)
            ?.map((item) => {
                return {
                    label: item.name,
                    key: item.code,
                    description: item.description,
                    children: item.inJsonSchema
                        ? getjsonschma(getJSON(item))
                        : item.outJsonSchema
                        ? getjsonschma(JSON.parse(item.outJsonSchema))
                        : []
                };
            });
        console.log(newList);

        setItem(newList as any[]);
    }, []);
    const wrapperRef: any = useRef(null);
    const [popoverWidth, setPopoverWidth] = useState(null);
    useEffect(() => {
        if (wrapperRef.current) {
            setPopoverWidth(wrapperRef.current?.offsetWidth);
        }
    }, [wrapperRef]);
    //输入框的节点
    const inputList: any = useRef([]);
    return (
        <div className="flex min-h-[250px]">
            <div className="flex-1">
                {open && (
                    <SelectTemplateModal open={open} imageTypeList={imageTypeList} handleClose={() => setOpen(false)} handleOk={handleOk} />
                )}
                <FormControl error={!imageStyleData?.id} sx={{ flex: 1 }} color="secondary" fullWidth>
                    <TextField
                        color="secondary"
                        className="!cursor-pointer"
                        id="outlined-basic"
                        label="风格"
                        variant="outlined"
                        InputLabelProps={{ shrink: true }}
                        value={currentTemp?.name}
                        onClick={() => setOpen(true)}
                        error={!imageStyleData?.id}
                    />
                    <FormHelperText>{!imageStyleData?.id ? '图片风格是必选项' : ' '}</FormHelperText>
                </FormControl>
                {imageStyleData?.id && (
                    <div>
                        {(imageStyleData?.variableList?.some((value: any) => value?.field === 'TITLE') ||
                            imageStyleData?.variableList?.some((value: any) => value?.field === 'SUB_TITLE')) && (
                            <>
                                <div className="flex items-center gap-4 min-h-[32px]">
                                    <span>图片标题生成</span>
                                    <Switch
                                        checked={imageStyleData?.titleGenerateMode === 'AI' ? true : false}
                                        onChange={(e) => {
                                            const newData = _.cloneDeep(imageStyleData);
                                            if (e) {
                                                newData.titleGenerateMode = 'AI';
                                            } else {
                                                newData.titleGenerateMode = 'DEFAULT';
                                            }
                                            setData(newData);
                                        }}
                                    />
                                    <span className="text-[#673ab7]">
                                        {imageStyleData?.titleGenerateMode === 'AI' ? 'AI 生成' : '默认'}
                                    </span>
                                    {imageStyleData?.titleGenerateMode === 'AI' && (
                                        <Input
                                            className="w-[400px]"
                                            value={imageStyleData?.titleGenerateRequirement}
                                            onChange={(e) => {
                                                const newData = _.cloneDeep(imageStyleData);
                                                newData.titleGenerateRequirement = e.target.value;
                                                setData(newData);
                                            }}
                                            placeholder="可填写对图片上标题生成内容的要求，默认可不填写"
                                        />
                                    )}
                                </div>
                                <div className="flex items-center gap-4 min-h-[32px]">
                                    <span>图片生成模式</span>
                                    <Switch
                                        checked={imageStyleData?.mode === 'SEQUENCE' ? true : false}
                                        onChange={(e) => {
                                            const newData = _.cloneDeep(imageStyleData);
                                            if (e) {
                                                newData.mode = 'SEQUENCE';
                                            } else {
                                                newData.mode = 'RANDOM';
                                            }
                                            setData(newData);
                                        }}
                                    />
                                    <span className="text-[#673ab7]">{imageStyleData?.mode === 'SEQUENCE' ? '顺序生成' : '随机生成'}</span>
                                </div>
                            </>
                        )}
                        <Row className="items-center mt-[20px]" gutter={20}>
                            {imageStyleData?.variableList?.map(
                                (el: any, index: number) =>
                                    el.style === 'INPUT' && (
                                        <Col key={index} sm={12} xs={24}>
                                            <div>
                                                <Popover
                                                    trigger="click"
                                                    arrow={false}
                                                    placement="bottom"
                                                    open={perOpen[index]}
                                                    onOpenChange={() => {
                                                        const newData = _.cloneDeep(perOpen);
                                                        newData[index] = false;
                                                        setPerOpen(newData);
                                                    }}
                                                    content={
                                                        <div style={{ width: popoverWidth + 'px' }} className={'flex items-stretch gap-2'}>
                                                            <Menu
                                                                className="flex-1 h-[300px] overflow-y-auto"
                                                                defaultSelectedKeys={[]}
                                                                mode="inline"
                                                            >
                                                                {renderMenuItems(items)}
                                                            </Menu>
                                                            <div className="flex-1 border border-solid border-[#d9d9d9] h-[300px] rounded-lg p-4">
                                                                {tipValue}
                                                            </div>
                                                        </div>
                                                    }
                                                >
                                                    <div ref={wrapperRef} className="flex items-stretch">
                                                        <TextArea
                                                            rows={1}
                                                            value={el.value}
                                                            ref={(ref) => (inputList.current[index] = ref)}
                                                            onChange={(e) => {
                                                                const newData = _.cloneDeep(imageStyleData);
                                                                newData.variableList[index].value = e.target.value;
                                                                setData(newData);
                                                            }}
                                                            className="rounded-r-[0px]"
                                                            allowClear
                                                        />
                                                        <div
                                                            onClick={(e) => {
                                                                const newData = _.cloneDeep(perOpen);
                                                                newData[index] = true;
                                                                setPerOpen(newData);
                                                                e.stopPropagation();
                                                            }}
                                                            className="w-[50px] flex justify-center items-center border border-solid border-[#d9d9d9] ml-[-4px] bg-[#f8fafc] rounded-r-[6px] cursor-pointer"
                                                            style={{ borderLeft: 'none' }}
                                                        >
                                                            fx
                                                        </div>
                                                    </div>
                                                </Popover>
                                            </div>
                                        </Col>
                                    )
                            )}
                        </Row>
                        <div className="float-right">
                            <div className="text-[12px]">风格示例图</div>
                            <Image width={200} preview={false} src={currentTemp?.example} />
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};
export default EditStyle;
