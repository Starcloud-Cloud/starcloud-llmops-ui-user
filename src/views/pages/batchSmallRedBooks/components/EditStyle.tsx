import { FormControl, FormHelperText, TextField } from '@mui/material';
import { Input, Popover, Tree, Image, Row, Col, Menu, Switch, Select } from 'antd';
import type { TreeDataNode } from 'antd';
import { PlusCircleOutlined } from '@ant-design/icons';
import { useEffect, useState, useRef } from 'react';
import _ from 'lodash-es';
import { SelectTemplateModal } from './SelectTemplateModal';
import React from 'react';
import { getImageTemplateTypes } from 'api/template';
import VariableInput from './variableInput';
const { SubMenu } = Menu;
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
    const [perOpen, setPerOpen] = useState<any[]>([]);
    const [items, setItem] = useState<any[]>([]);

    useEffect(() => {
        setItem(schemaList as any[]);
    }, []);
    const handleMenu = ({ index, newValue }: any) => {
        const newData = _.cloneDeep(imageStyleData);
        newData.variableList[index].value = newValue;
        setData(newData);
    };
    const wrapperRef: any = useRef(null);
    const [popoverWidth, setPopoverWidth] = useState(undefined);
    useEffect(() => {
        if (wrapperRef.current) {
            setPopoverWidth(wrapperRef.current?.offsetWidth);
        }
    }, [wrapperRef, currentTemp?.name]);
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
                            {imageStyleData?.variableList?.map((el: any, index: number) => (
                                <Col key={index} sm={12} xs={24} className="mb-[20px]">
                                    <div className="w-full" ref={wrapperRef}>
                                        <VariableInput
                                            open={perOpen[index]}
                                            setOpen={(flag) => {
                                                const newData = _.cloneDeep(perOpen);
                                                newData[index] = flag;
                                                setPerOpen(newData);
                                            }}
                                            popoverWidth={popoverWidth}
                                            handleMenu={handleMenu}
                                            items={items}
                                            index={index}
                                            title={el?.label}
                                            value={el.value}
                                            setValue={(value) => {
                                                const newData = _.cloneDeep(imageStyleData);
                                                newData.variableList[index].value = value;
                                                setData(newData);
                                            }}
                                        />
                                    </div>
                                </Col>
                            ))}
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
