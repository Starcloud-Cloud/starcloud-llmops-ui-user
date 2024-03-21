import { FormControl, FormHelperText, TextField } from '@mui/material';
import { Input, Popover, Tree, Image, Row, Col, Menu, Switch, Select, Divider } from 'antd';
import type { TreeDataNode } from 'antd';
import { PlusCircleOutlined } from '@ant-design/icons';
import { useEffect, useState, useRef, useMemo } from 'react';
import _ from 'lodash-es';
import { SelectTemplateModal } from './SelectTemplateModal';
import React from 'react';
import { getImageTemplateTypes } from 'api/template';
import VariableInput from './variableInput';
import { BorderColor } from '@mui/icons-material';
import { getImageTemplateJSON } from '../../../../api/template/index';
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
    const [windowWidth, setWindowWidth] = useState(window.innerWidth);
    const [currentElementId, setCurrentElementId] = useState('');
    const [currentJson, setCurrentJson] = useState<any>({});

    const imgRef: any = useRef(null);
    useEffect(() => {
        const handleResize = () => {
            setWindowWidth(window.innerWidth);
        };

        window.addEventListener('resize', handleResize);

        return () => {
            window.removeEventListener('resize', handleResize);
        };
    }, []);

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
            setCurrentTemp({ ...data });
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
    }, [wrapperRef]);

    useEffect(() => {
        if (currentTemp && currentTemp.id) {
            getImageTemplateJSON(currentTemp.id).then((res) => {
                const json = JSON.parse(res.json);
                setCurrentJson({ ...json });
            });
        }
    }, [currentTemp]);

    const scale = useMemo(() => {
        return imgRef?.current && currentJson ? imgRef?.current?.offsetWidth / currentJson?.clipPath?.width : 1;
    }, [currentJson, windowWidth, imgRef?.current]);

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
                        label="图片模版"
                        variant="outlined"
                        InputLabelProps={{ shrink: true }}
                        value={currentTemp?.name}
                        onClick={() => setOpen(true)}
                        error={!imageStyleData?.id}
                    />
                    <FormHelperText>{!imageStyleData?.id ? '请选择图片模版后进行设置' : ' '}</FormHelperText>
                </FormControl>
                {imageStyleData?.id && (
                    <div>
                        <div className="flex">
                            <div className="flex-1">
                                <div className="text-[12px]">风格示例图</div>
                                <div className="relative w-[70%] mx-auto" ref={imgRef}>
                                    <Image preview={false} src={currentTemp?.example} />
                                    {currentJson?.objects
                                        ?.filter((item: any) => item.type === 'image' || item.type.includes('text'))
                                        ?.map((item: any, index: number) => (
                                            <div
                                                key={index}
                                                onMouseEnter={() => setCurrentElementId(item.id)}
                                                onMouseLeave={() => setCurrentElementId('')}
                                                className={`${
                                                    item.id === currentElementId
                                                        ? 'outline outline-offset-2 outline-blue-500 w-full'
                                                        : 'w-full'
                                                }`}
                                                style={{
                                                    width: `${item.width * item.scaleX * scale}px`,
                                                    height: `${item.height * item.scaleY * scale}px`,
                                                    left: `${item.left * scale}px`,
                                                    top: `${item.top * scale}px`,
                                                    position: 'absolute'
                                                }}
                                            />
                                        ))}
                                </div>
                            </div>
                            <Divider type="vertical" />
                            <div className="flex-1">
                                <div>
                                    <div className="text-xl">图片生成配置</div>
                                    <div className="text-xs text-black/50">用上传素材的图片类型字段绑定到图片模板上的图片位置</div>
                                    <div className="flex flex-wrap">
                                        {/* TODO 图片类型没有图片配置 appGroupList */}
                                        {false ? (
                                            <>
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
                                                    <span className="text-[#673ab7]">
                                                        {imageStyleData?.mode === 'SEQUENCE' ? '顺序生成' : '随机生成'}
                                                    </span>
                                                </div>
                                            </>
                                        ) : (
                                            imageStyleData?.variableList
                                                .filter((el: any) => el.type === 'IMAGE')
                                                ?.map((el: any, index: number) => (
                                                    <div
                                                        className="w-[50%] p-3"
                                                        ref={wrapperRef}
                                                        onClick={() => setCurrentElementId(el.field)}
                                                    >
                                                        <VariableInput
                                                            styles={
                                                                currentElementId === el.field
                                                                    ? {
                                                                          border: '1px solid #673ab7'
                                                                      }
                                                                    : {}
                                                            }
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
                                                ))
                                        )}
                                    </div>
                                </div>
                                <div className="mt-2">
                                    <div className="text-xl">图片文字配置</div>
                                    <div className="text-xs text-black/50">可绑定数据或输入内容到图片模版上具体文字位置上</div>
                                    <div className="flex items-center gap-4 min-h-[32px] ml-3">
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
                                    <div className="flex flex-wrap">
                                        {imageStyleData?.variableList
                                            .filter((el: any) => el.type === 'TEXT')
                                            ?.map((el: any, index: number) => (
                                                <div className="w-[50%] p-3" ref={wrapperRef} onClick={() => setCurrentElementId(el.field)}>
                                                    <VariableInput
                                                        styles={
                                                            currentElementId === el.field
                                                                ? {
                                                                      border: '1px solid #673ab7'
                                                                  }
                                                                : {}
                                                        }
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
                                            ))}
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};
export default EditStyle;
