import { FormControl, FormHelperText, TextField } from '@mui/material';
import { Input, Popover, Tree, Image, Row, Col, Menu, Switch, Select } from 'antd';
import type { TreeDataNode } from 'antd';
import { PlusCircleOutlined } from '@ant-design/icons';
import { useEffect, useState, useRef, useMemo } from 'react';
import _ from 'lodash-es';
import { SelectTemplateModal } from './SelectTemplateModal';
import React from 'react';
import { getImageTemplateTypes } from 'api/template';
import VariableInput from './variableInput';
import { BorderColor } from '@mui/icons-material';
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
    }, [wrapperRef]);

    const currentJson = {
        version: '5.3.0',
        objects: [
            {
                type: 'rect',
                version: '5.3.0',
                originX: 'left',
                originY: 'top',
                left: 0,
                top: 0,
                width: 900,
                height: 1200,
                fill: '#B23554',
                stroke: null,
                strokeWidth: 1,
                strokeDashArray: null,
                strokeLineCap: 'butt',
                strokeDashOffset: 0,
                strokeLineJoin: 'miter',
                strokeUniform: false,
                strokeMiterLimit: 4,
                scaleX: 1,
                scaleY: 1,
                angle: 0,
                flipX: false,
                flipY: false,
                opacity: 1,
                shadow: null,
                visible: true,
                backgroundColor: '',
                fillRule: 'nonzero',
                paintFirst: 'fill',
                globalCompositeOperation: 'source-over',
                skewX: 0,
                skewY: 0,
                rx: 0,
                ry: 0,
                id: 'workspace',
                selectable: false,
                hasControls: false
            },
            {
                type: 'image',
                version: '5.3.0',
                originX: 'left',
                originY: 'top',
                left: 600,
                top: 0,
                width: 1200,
                height: 1200,
                fill: 'rgb(0,0,0)',
                stroke: null,
                strokeWidth: 0,
                strokeDashArray: null,
                strokeLineCap: 'butt',
                strokeDashOffset: 0,
                strokeLineJoin: 'miter',
                strokeUniform: false,
                strokeMiterLimit: 4,
                scaleX: 0.2507,
                scaleY: 0.2507,
                angle: 0,
                flipX: false,
                flipY: false,
                opacity: 1,
                shadow: null,
                visible: true,
                backgroundColor: '',
                fillRule: 'nonzero',
                paintFirst: 'fill',
                globalCompositeOperation: 'source-over',
                skewX: 0,
                skewY: 0,
                cropX: 0,
                cropY: 0,
                id: '2f7b70a9-a630-4177-9701-26567d975342',
                selectable: true,
                hasControls: true,
                name: '图片3',
                src: 'https://download.hotsalecloud.com/mofaai/images/upload/435f11ab91bd437ba3a261184fb85bf2.jpg',
                crossOrigin: null,
                filters: []
            },
            {
                type: 'image',
                version: '5.3.0',
                originX: 'left',
                originY: 'top',
                left: 0,
                top: 0,
                width: 1200,
                height: 1200,
                fill: 'rgb(0,0,0)',
                stroke: null,
                strokeWidth: 0,
                strokeDashArray: null,
                strokeLineCap: 'butt',
                strokeDashOffset: 0,
                strokeLineJoin: 'miter',
                strokeUniform: false,
                strokeMiterLimit: 4,
                scaleX: 0.2507,
                scaleY: 0.2507,
                angle: 0,
                flipX: false,
                flipY: false,
                opacity: 1,
                shadow: null,
                visible: true,
                backgroundColor: '',
                fillRule: 'nonzero',
                paintFirst: 'fill',
                globalCompositeOperation: 'source-over',
                skewX: 0,
                skewY: 0,
                cropX: 0,
                cropY: 0,
                id: '8e1fd457-2e30-4f0f-901e-8ae9dd935567',
                selectable: true,
                hasControls: true,
                name: '图片1',
                src: 'https://download.hotsalecloud.com/mofaai/images/upload/eb5d250107484a0a959e54ba3bbac92e.jpg',
                crossOrigin: null,
                filters: []
            },
            {
                type: 'image',
                version: '5.3.0',
                originX: 'left',
                originY: 'top',
                left: 300,
                top: 0,
                width: 1200,
                height: 1200,
                fill: 'rgb(0,0,0)',
                stroke: null,
                strokeWidth: 0,
                strokeDashArray: null,
                strokeLineCap: 'butt',
                strokeDashOffset: 0,
                strokeLineJoin: 'miter',
                strokeUniform: false,
                strokeMiterLimit: 4,
                scaleX: 0.2507,
                scaleY: 0.2507,
                angle: 0,
                flipX: false,
                flipY: false,
                opacity: 1,
                shadow: null,
                visible: true,
                backgroundColor: '',
                fillRule: 'nonzero',
                paintFirst: 'fill',
                globalCompositeOperation: 'source-over',
                skewX: 0,
                skewY: 0,
                cropX: 0,
                cropY: 0,
                id: '7d32fe37-37fa-43dc-8e6d-7845b8ac3b94',
                selectable: true,
                hasControls: true,
                name: '图片2',
                src: 'https://download.hotsalecloud.com/mofaai/images/upload/667e28944ed7429eaa3c219f0d0109e3.jpg',
                crossOrigin: null,
                filters: []
            },
            {
                type: 'image',
                version: '5.3.0',
                originX: 'left',
                originY: 'top',
                left: 0,
                top: 900,
                width: 1200,
                height: 1200,
                fill: 'rgb(0,0,0)',
                stroke: null,
                strokeWidth: 0,
                strokeDashArray: null,
                strokeLineCap: 'butt',
                strokeDashOffset: 0,
                strokeLineJoin: 'miter',
                strokeUniform: false,
                strokeMiterLimit: 4,
                scaleX: 0.2507,
                scaleY: 0.2507,
                angle: 0,
                flipX: false,
                flipY: false,
                opacity: 1,
                shadow: null,
                visible: true,
                backgroundColor: '',
                fillRule: 'nonzero',
                paintFirst: 'fill',
                globalCompositeOperation: 'source-over',
                skewX: 0,
                skewY: 0,
                cropX: 0,
                cropY: 0,
                id: '00b28c01-0fda-4c69-a47f-569fb683a219',
                selectable: true,
                hasControls: true,
                name: '图片6',
                src: 'https://download.hotsalecloud.com/mofaai/images/upload/fb3fbf5fc18f4cef871c9ad52d4a228d.jpg',
                crossOrigin: null,
                filters: []
            },
            {
                type: 'image',
                version: '5.3.0',
                originX: 'left',
                originY: 'top',
                left: 300,
                top: 900,
                width: 1200,
                height: 1200,
                fill: 'rgb(0,0,0)',
                stroke: null,
                strokeWidth: 0,
                strokeDashArray: null,
                strokeLineCap: 'butt',
                strokeDashOffset: 0,
                strokeLineJoin: 'miter',
                strokeUniform: false,
                strokeMiterLimit: 4,
                scaleX: 0.2507,
                scaleY: 0.2508,
                angle: 0,
                flipX: false,
                flipY: false,
                opacity: 1,
                shadow: null,
                visible: true,
                backgroundColor: '',
                fillRule: 'nonzero',
                paintFirst: 'fill',
                globalCompositeOperation: 'source-over',
                skewX: 0,
                skewY: 0,
                cropX: 0,
                cropY: 0,
                id: 'c19b3426-8b4d-4c56-a1fd-2c7d49d39f96',
                selectable: true,
                hasControls: true,
                name: '图片7',
                src: 'https://download.hotsalecloud.com/mofaai/images/upload/45c12a6a09874935bbe8740195824df0.jpg',
                crossOrigin: null,
                filters: []
            },
            {
                type: 'image',
                version: '5.3.0',
                originX: 'left',
                originY: 'top',
                left: 600,
                top: 900,
                width: 1200,
                height: 1200,
                fill: 'rgb(0,0,0)',
                stroke: null,
                strokeWidth: 0,
                strokeDashArray: null,
                strokeLineCap: 'butt',
                strokeDashOffset: 0,
                strokeLineJoin: 'miter',
                strokeUniform: false,
                strokeMiterLimit: 4,
                scaleX: 0.2507,
                scaleY: 0.2507,
                angle: 0,
                flipX: false,
                flipY: false,
                opacity: 1,
                shadow: null,
                visible: true,
                backgroundColor: '',
                fillRule: 'nonzero',
                paintFirst: 'fill',
                globalCompositeOperation: 'source-over',
                skewX: 0,
                skewY: 0,
                cropX: 0,
                cropY: 0,
                id: 'c05a6b4b-8e72-4344-81c4-6c7d646d910f',
                selectable: true,
                hasControls: true,
                name: '图片8',
                src: 'https://download.hotsalecloud.com/mofaai/images/upload/2f7b83d6da014ae1b2ab51d50f7a1cd1.jpg',
                crossOrigin: null,
                filters: []
            },
            {
                type: 'image',
                version: '5.3.0',
                originX: 'left',
                originY: 'top',
                left: 449.8712,
                top: 296.3502,
                width: 1200,
                height: 1200,
                fill: 'rgb(0,0,0)',
                stroke: null,
                strokeWidth: 0,
                strokeDashArray: null,
                strokeLineCap: 'butt',
                strokeDashOffset: 0,
                strokeLineJoin: 'miter',
                strokeUniform: false,
                strokeMiterLimit: 4,
                scaleX: 0.3759,
                scaleY: 0.5032,
                angle: 0,
                flipX: false,
                flipY: false,
                opacity: 1,
                shadow: null,
                visible: true,
                backgroundColor: '',
                fillRule: 'nonzero',
                paintFirst: 'fill',
                globalCompositeOperation: 'source-over',
                skewX: 0,
                skewY: 0,
                cropX: 0,
                cropY: 0,
                id: '3827eb86-35a2-44a0-a19b-3355962947dc',
                selectable: true,
                hasControls: true,
                name: '图片5',
                src: 'https://download.hotsalecloud.com/mofaai/images/upload/45c12a6a09874935bbe8740195824df0.jpg',
                crossOrigin: null,
                filters: []
            },
            {
                type: 'image',
                version: '5.3.0',
                originX: 'left',
                originY: 'top',
                left: 0,
                top: 300,
                width: 1200,
                height: 1200,
                fill: 'rgb(0,0,0)',
                stroke: null,
                strokeWidth: 0,
                strokeDashArray: null,
                strokeLineCap: 'butt',
                strokeDashOffset: 0,
                strokeLineJoin: 'miter',
                strokeUniform: false,
                strokeMiterLimit: 4,
                scaleX: 0.3747,
                scaleY: 0.5015,
                angle: 0,
                flipX: false,
                flipY: false,
                opacity: 1,
                shadow: null,
                visible: true,
                backgroundColor: '',
                fillRule: 'nonzero',
                paintFirst: 'fill',
                globalCompositeOperation: 'source-over',
                skewX: 0,
                skewY: 0,
                cropX: 0,
                cropY: 0,
                id: 'f9c41a53-3ef1-404c-89b0-593cd12b4eee',
                selectable: true,
                hasControls: true,
                name: '图片4',
                src: 'https://download.hotsalecloud.com/mofaai/images/upload/2075142ccc4549c98e307d70af37910e.jpg',
                crossOrigin: null,
                filters: []
            },
            {
                type: 'textbox',
                version: '5.3.0',
                originX: 'left',
                originY: 'top',
                left: 29.4988,
                top: 342.4567,
                width: 568.9205,
                height: 67.8,
                fill: 'rgba(234,208,44,1)',
                stroke: '',
                strokeWidth: 0,
                strokeDashArray: null,
                strokeLineCap: 'butt',
                strokeDashOffset: 0,
                strokeLineJoin: 'miter',
                strokeUniform: false,
                strokeMiterLimit: 4,
                scaleX: 1.48,
                scaleY: 1.48,
                angle: 0,
                flipX: false,
                flipY: false,
                opacity: 1,
                shadow: {
                    color: 'rgb(0,0,0)',
                    blur: 0,
                    offsetX: 2,
                    offsetY: 3,
                    affectStroke: false,
                    nonScaling: false
                },
                visible: true,
                backgroundColor: '',
                fillRule: 'nonzero',
                paintFirst: 'fill',
                globalCompositeOperation: 'source-over',
                skewX: 0,
                skewY: 0,
                fontFamily: '华康金刚黑',
                fontWeight: 'bold',
                fontSize: 60,
                text: '图片主标题',
                underline: false,
                overline: false,
                linethrough: false,
                textAlign: 'center',
                fontStyle: 'normal',
                lineHeight: 1.16,
                textBackgroundColor: '',
                charSpacing: 0,
                styles: [],
                direction: 'ltr',
                path: null,
                pathStartOffset: 0,
                pathSide: 'left',
                pathAlign: 'baseline',
                minWidth: 20,
                splitByGrapheme: true,
                id: 'TITLE',
                selectable: true,
                hasControls: true,
                name: '主标题'
            }
        ],
        clipPath: {
            type: 'rect',
            version: '5.3.0',
            originX: 'left',
            originY: 'top',
            left: 0,
            top: 0,
            width: 900,
            height: 1200,
            fill: '#B23554',
            stroke: null,
            strokeWidth: 1,
            strokeDashArray: null,
            strokeLineCap: 'butt',
            strokeDashOffset: 0,
            strokeLineJoin: 'miter',
            strokeUniform: false,
            strokeMiterLimit: 4,
            scaleX: 1,
            scaleY: 1,
            angle: 0,
            flipX: false,
            flipY: false,
            opacity: 1,
            shadow: null,
            visible: true,
            backgroundColor: '',
            fillRule: 'nonzero',
            paintFirst: 'fill',
            globalCompositeOperation: 'source-over',
            skewX: 0,
            skewY: 0,
            rx: 0,
            ry: 0,
            selectable: true,
            hasControls: true
        }
    };

    const scale = useMemo(() => {
        return imgRef?.current ? imgRef?.current?.offsetWidth / currentJson.clipPath.width : 1;
    }, [windowWidth, imgRef?.current]);

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
                        {/* {(imageStyleData?.variableList?.some((value: any) => value?.field === 'TITLE') ||
                            imageStyleData?.variableList?.some((value: any) => value?.field === 'SUB_TITLE')) && (
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
                                    <span className="text-[#673ab7]">{imageStyleData?.mode === 'SEQUENCE' ? '顺序生成' : '随机生成'}</span>
                                </div>
                            </>
                        )} */}
                        <div className="flex">
                            <div className="flex-1">
                                <div className="text-[12px]">风格示例图</div>
                                <div className="relative w-[50%] mx-auto" ref={imgRef}>
                                    <Image preview={false} src={currentTemp?.example} />
                                    {currentJson.objects
                                        .filter((item) => item.type === 'image' || item.type.includes('text'))
                                        .map((item, index) => (
                                            <div
                                                key={index}
                                                onClick={() => setCurrentElementId(item.id)}
                                                className={`${
                                                    item.id === currentElementId
                                                        ? 'outline-dashed outline-1 outline-offset-1 outline-[#673ab7] rounded-lg w-full'
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
                            <div className="flex-1">
                                <div>
                                    <div className="text-xl">图片生成配置</div>
                                    <div>用上传素材的图片类型字段绑定到图片模板上的图片位置</div>
                                    <div className="flex flex-wrap">
                                        {imageStyleData?.variableList
                                            .filter((el: any) => el.type === 'IMAGE')
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
                                <div className="mt-2">
                                    <div className="text-xl">图片文字配置</div>
                                    <div>可绑定数据或输入内容到图片模版上具体文字位置上</div>
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
