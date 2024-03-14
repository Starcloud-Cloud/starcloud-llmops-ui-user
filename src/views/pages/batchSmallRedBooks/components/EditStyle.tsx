import { FormControl, FormHelperText, TextField } from '@mui/material';
import { Input, Popover, Tree, Image, Row, Col, Menu, Switch, Select } from 'antd';
import type { TreeDataNode } from 'antd';
import type { MenuProps } from 'antd';
import { DownOutlined, PlusCircleOutlined } from '@ant-design/icons';
import { useEffect, useState } from 'react';
import _ from 'lodash-es';
import Form from 'views/pages/smallRedBook/components/form';
import { SelectTemplateModal } from './SelectTemplateModal';

import React from 'react';
import { getImageTemplateTypes } from 'api/template';
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
    const [perOpen, setPerOpen] = useState(false);
    const [tipValue, setTipValue] = useState('');
    const [items, setItem] = useState<any[]>([]);
    useEffect(() => {
        if (!perOpen) {
            setTipValue('');
        }
    }, [perOpen]);
    const convertSchemaToJson = (schema: any): any => {
        const result = [];

        if (schema.title && schema.description) {
            result.push({ label: schema.title, description: schema.description });
        }

        if (schema.properties) {
            for (const key in schema.properties) {
                const property = schema.properties[key];
                if (property.title && property.description) {
                    result.push({ label: property.title, description: property.description });
                }
                if (property.items && property.items.title && property.items.description) {
                    result.push({ label: property.items.title, description: property.items.description });
                }
            }
        }

        return result;
    };
    useEffect(() => {
        const newList = schemaList?.map((item) => ({
            label: item.name,
            key: item.code,
            description: item.description,
            children: convertSchemaToJson(JSON.parse(item.outJsonSchema))
        }));
        console.log(newList);
        setItem(newList as any[]);
    }, []);
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
                                            {/* <Form
                                                flag={true}
                                                index={index}
                                                changeValue={(data: any) => {
                                                    const newData = _.cloneDeep(imageStyleData);
                                                    newData.variableList[data.index].value = data.value;
                                                    setData(newData);
                                                }}
                                                item={el}
                                            /> */}
                                            <Popover
                                                trigger="click"
                                                arrow={false}
                                                placement="bottom"
                                                open={perOpen}
                                                onOpenChange={() => setPerOpen(false)}
                                                content={
                                                    <div className="w-[80vh] max-w-[800px] flex items-stretch gap-2">
                                                        {/* <Tree
                                                            className="flex-1"
                                                            showLine
                                                            blockNode
                                                            switcherIcon={<DownOutlined rev={undefined} />}
                                                            defaultExpandAll={true}
                                                            onSelect={(selectedKeys, info) => {
                                                                console.log('selected', selectedKeys, info);
                                                            }}
                                                            treeData={treeData}
                                                        /> */}
                                                        <Menu
                                                            onClick={(data) => {
                                                                setPerOpen(false);
                                                                const newData = _.cloneDeep(imageStyleData);
                                                                newData.variableList[index].value = data.key;
                                                                setData(newData);
                                                            }}
                                                            className="flex-1"
                                                            defaultSelectedKeys={[]}
                                                            mode="inline"
                                                            items={items?.map((item: any, index: number) => ({
                                                                key: item.label,
                                                                label: (
                                                                    <div
                                                                        onMouseEnter={() => {
                                                                            setTipValue(item.description);
                                                                        }}
                                                                        className="w-full flex justify-between items-center"
                                                                    >
                                                                        <div>{item.label}</div>
                                                                        <div className="text-xs text-black/50">{item.description}</div>
                                                                    </div>
                                                                ),
                                                                children: item?.children?.map((el: any, i: number) => ({
                                                                    key: el.label,
                                                                    label: (
                                                                        <div
                                                                            onMouseEnter={() => {
                                                                                setTipValue(el.description);
                                                                            }}
                                                                            className="w-full flex justify-between items-center"
                                                                        >
                                                                            <div>{el.label}</div>
                                                                            <div className="text-xs text-black/50">{el.description}</div>
                                                                        </div>
                                                                    )
                                                                }))
                                                            }))}
                                                        />
                                                        <div className="flex-1 border border-solid border-[#d9d9d9] h-[300px] rounded-lg p-4">
                                                            {tipValue}
                                                        </div>
                                                    </div>
                                                }
                                            >
                                                <div className="flex items-stretch">
                                                    <TextArea
                                                        key={el.value}
                                                        defaultValue={el.value}
                                                        onBlur={(e) => {
                                                            const newData = _.cloneDeep(imageStyleData);
                                                            newData.variableList[index].value = e.target.value;
                                                            setData(newData);
                                                        }}
                                                        className="rounded-r-[0px]"
                                                        allowClear
                                                    />
                                                    <div
                                                        onClick={(e) => {
                                                            setPerOpen(true);
                                                            e.stopPropagation();
                                                        }}
                                                        className="w-[50px] flex justify-center items-center border border-solid border-[#d9d9d9] ml-[-4px] bg-[#f8fafc] rounded-r-[6px] cursor-pointer"
                                                        style={{ borderLeft: 'none' }}
                                                    >
                                                        fx
                                                    </div>
                                                </div>
                                            </Popover>
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
