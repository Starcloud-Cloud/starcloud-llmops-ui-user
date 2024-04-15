import { FormControl, FormHelperText, TextField } from '@mui/material';
import { Input, Popover, Tree, Image, Row, Col, Menu, Switch, Button, Divider } from 'antd';
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
import { v4 as uuidv4 } from 'uuid';
const { SubMenu } = Menu;
const EditStyle = ({
    schemaList,
    typeList,
    imageStyleData,
    setData,
    setCopyData,
    appData = {}
}: {
    schemaList?: any[];
    typeList: any[];
    imageStyleData: any;
    setData: (data: any) => void;
    setCopyData: (data: any) => void;
    appData?: any;
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
        newData.example = temp.example;
        newData.code = temp.code;
        newData.variableList = temp.variableList?.map((item: any) => ({
            ...item,
            uuid: uuidv4()?.split('-')?.join('')
        }));
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
        if (imageStyleData.code) {
            const data = tempList.find((v: any) => v.code === imageStyleData?.code);
            setCurrentTemp({ ...data });
        }
    }, [imageStyleData, tempList]);
    const [perOpen, setPerOpen] = useState<any[]>([]);
    const [items, setItem] = useState<any[]>([]);
    const handleCopy = () => {
        setCopyData(imageStyleData);
    };
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
        if (currentTemp && currentTemp.code) {
            getImageTemplateJSON(currentTemp.code).then((res) => {
                const json = JSON.parse(res.json);
                setCurrentJson({ ...json });
            });
        }
    }, [currentTemp?.code]);

    const scale = useMemo(() => {
        return imgRef?.current && currentJson ? imgRef?.current?.offsetWidth / currentJson?.clipPath?.width : 1;
    }, [currentJson, windowWidth, imgRef?.current]);

    return (
        <div className="flex min-h-[250px]">
            <div className="flex-1">
                {open && (
                    <SelectTemplateModal open={open} imageTypeList={imageTypeList} handleClose={() => setOpen(false)} handleOk={handleOk} />
                )}
                <div className="pr-4 flex justify-between">
                    <div className="!w-[40%]">
                        <FormControl fullWidth error={!imageStyleData?.code} sx={{ flex: 1 }} color="secondary">
                            <TextField
                                color="secondary"
                                className="!cursor-pointer"
                                id="outlined-basic"
                                label="图片模版"
                                variant="outlined"
                                InputLabelProps={{ shrink: true }}
                                value={currentTemp?.name}
                                onClick={() => setOpen(true)}
                                error={!imageStyleData?.code}
                            />
                            <FormHelperText>{!imageStyleData?.code ? '请选择图片模版后进行设置' : ' '}</FormHelperText>
                        </FormControl>
                    </div>
                    <Button className="mt-[7px]" type="primary" onClick={handleCopy}>
                        复制
                    </Button>
                </div>
                {imageStyleData?.code && (
                    <div>
                        <div className="flex">
                            <div className="w-[40%]">
                                <div className="text-lg">图片模版示意图</div>
                                <div className="relative w-[85%] mx-auto" ref={imgRef}>
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
                            <div>
                                <Divider type="vertical" style={{ height: '100%' }} />
                            </div>
                            <div className="flex-1">
                                <div>
                                    <div className="text-lg">图片生成配置</div>
                                    <div className="text-xs text-black/50">用上传素材的图片类型字段绑定到图片模板上的图片位置</div>
                                    <div className="flex flex-wrap">
                                        {appData?.materialType === 'picture' ? (
                                            <>
                                                <div className="flex items-center gap-4 min-h-[32px]">
                                                    <span>图片生成模式</span>
                                                    <Switch
                                                        checked={imageStyleData?.mode === 'RANDOM' ? true : false}
                                                        onChange={(e) => {
                                                            const newData = _.cloneDeep(imageStyleData);
                                                            if (e) {
                                                                newData.mode = 'RANDOM';
                                                            } else {
                                                                newData.mode = 'SEQUENCE';
                                                            }
                                                            setData(newData);
                                                        }}
                                                    />
                                                    <span className="text-[#673ab7]">
                                                        {imageStyleData?.mode === 'RANDOM' ? '随机生成' : '顺序生成'}
                                                    </span>
                                                </div>
                                            </>
                                        ) : (
                                            imageStyleData?.variableList?.map(
                                                (el: any, index: number) =>
                                                    el.type === 'IMAGE' && (
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
                                                                appUid={appData.appUid}
                                                                details={appData.appReqVO}
                                                                index={index}
                                                                title={el?.label}
                                                                value={el.value}
                                                                setValue={(value) => {
                                                                    const newData = _.cloneDeep(imageStyleData);
                                                                    newData.variableList[index].value = value;
                                                                    newData.variableList[index].uuid = uuidv4()?.split('-')?.join('');
                                                                    setData(newData);
                                                                }}
                                                            />
                                                        </div>
                                                    )
                                            )
                                        )}
                                    </div>
                                </div>
                                <div className="mt-2">
                                    <div className="text-lg">图片文字配置</div>
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
                                        {imageStyleData?.variableList?.map(
                                            (el: any, index: number) =>
                                                el.type === 'TEXT' && (
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
                                                            appUid={appData.appUid}
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
                                                )
                                        )}
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
