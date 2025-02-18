import { FormControl, FormHelperText, TextField } from '@mui/material';
import { Input, Image, Menu, Switch, Button, Divider, Tooltip, Spin, Tabs } from 'antd';
import { ExclamationCircleOutlined, SwapOutlined } from '@ant-design/icons';
import { useEffect, useState, useRef, useMemo, Fragment } from 'react';
import _ from 'lodash-es';
import { SelectTemplateModal } from './SelectTemplateModal';
import React from 'react';
import { getImageTemplateTypes, materialGroup_page } from 'api/template';
import VariableInput from './variableInput';
import { getImageTemplateJSON } from '../../../../api/template/index';
import { v4 as uuidv4 } from 'uuid';
import copy from 'clipboard-copy';
import { dispatch } from 'store';
import { openSnackbar } from 'store/slices/snackbar';
import { useCache, CACHE_KEY } from 'hooks/web/useCache';
import VideoSetting from 'views/videoSetting';
import { debounce } from 'lodash-es';
import CustomRight from 'views/template/components/customRight';
const { wsCache } = useCache();
const EditStyle = ({
    activeKey,
    schemaList,
    typeList,
    imageStyleData,
    setImageStyleDataList,
    setData,
    setCopyData,
    appData = {},
    selModal,
    materialStatus,
    canEdit = false
}: {
    activeKey?: string;
    schemaList?: any[];
    typeList: any[];
    imageStyleData: any;
    setImageStyleDataList?: (data: any) => void;
    setData: (data: any) => void;
    setCopyData: (data: any) => void;
    appData?: any;
    selModal?: string;
    materialStatus?: string;
    canEdit?: boolean;
}) => {
    const [open, setOpen] = React.useState(false);
    const [currentTemp, setCurrentTemp] = React.useState<any>(null);
    const [tempList, setTempList] = React.useState<any>([]);
    const [imageTypeList, setImageTypeList] = React.useState<any[]>([]);
    const [windowWidth, setWindowWidth] = useState(window.innerWidth);
    const [currentElementId, setCurrentElementId] = useState('');
    const [currentJson, setCurrentJson] = useState<any>({});
    const [spinLoading, setSpinLoading] = useState(false);
    const [isVideoOpen, setIsVideoOpen] = useState(false);

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

    // const handleOk = (temp: any) => {
    //     setCurrentTemp(temp);
    //     const newData = _.cloneDeep(imageStyleData);
    //     newData.example = temp.example;
    //     newData.code = temp.code;
    //     newData.variableList = temp.variableList?.map((item: any) => ({
    //         ...item,
    //         value: '',
    //         uuid: uuidv4()?.split('-')?.join('')
    //     }));
    //     setPre(pre + 1);
    //     setData(newData);
    //     setOpen(false);
    // };
    const handleOk = (tempList: any[]) => {
        setCurrentTemp(tempList[0]);
        const newList = tempList?.map((item, index) => ({
            ...item,
            variableList: item?.variableList?.map((el: any) => ({
                ...el,
                value: '',
                uuid: uuidv4()?.split('-')?.join('')
            }))
        }));
        setImageStyleDataList && setImageStyleDataList(newList);
        setPre(pre + 1);
        setOpen(false);
    };
    useEffect(() => {
        setSpinLoading(true);
        const groupList = wsCache
            .get(CACHE_KEY.INFO)
            ?.menus?.find((item: any) => item.name === 'poster')
            ?.children?.find((item: any) => item.path === 'template')?.children;
        materialGroup_page().then((res) => {
            const newGroupList = groupList?.map((item: any) => ({
                ...item,
                list: res.list?.filter((el: any) => el.categoryId === item.id)
            }));
            setImageTypeList([
                {
                    name: '所有',
                    id: '0',
                    key: '0',
                    list: res.list
                },
                ...newGroupList
            ]);
            const list = newGroupList.map((element: any) => {
                return element.list;
            });
            setTempList(list.flat());
            setSpinLoading(false);
        });
        // getImageTemplateTypes().then((res) => {
        //     setImageTypeList(res);
        //     const list = res.map((element: any) => {
        //         return element.list;
        //     });
        //     setTempList(list.flat());
        //     setSpinLoading(false);
        // });
    }, []);
    // useEffect(() => {
    //     if (imageStyleData.code && tempList) {
    //         console.log(tempList, imageStyleData);

    //         const data = tempList.find((v: any) => v.code === imageStyleData?.code);
    //         console.log(data);

    //         if (imageStyleData?.example !== data?.example) {
    //             const newData = _.cloneDeep(imageStyleData);
    //             newData.example = data?.example;
    //             setData(newData);
    //         }
    //         setCurrentTemp({ ...data });
    //     }
    // }, [imageStyleData, tempList]);
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
        if (imageStyleData && imageStyleData.code) {
            getImageTemplateJSON(imageStyleData.code).then((res) => {
                setCurrentTemp({
                    ...currentTemp,
                    name: res?.name,
                    groupName: res?.groupName,
                    example: res?.example
                });
                const json = JSON.parse(res.json);
                setCurrentJson({ ...json });
                const newData = _.cloneDeep(imageStyleData);
                const newList = res?.variableList?.map((item: any) => ({
                    ...item,
                    isCustom: imageStyleData?.variableList?.find((el: any) => el?.field === item?.field)?.isCustom,
                    value: imageStyleData?.variableList?.find((el: any) => el?.field === item?.field)?.value
                }));
                setData({
                    ...newData,
                    variableList: newList
                });
            });
        }
    }, [imageStyleData?.code]);

    const scale = useMemo(() => {
        return imgRef?.current && currentJson ? imgRef?.current?.offsetWidth / currentJson?.clipPath?.width : 1;
    }, [currentJson, windowWidth, imgRef?.current]);
    const [pre, setPre] = useState(0);

    const isPageInputId = currentJson?.objects?.find((item: any) => item.isTextPage)?.id;
    useEffect(() => {
        if (selModal && selModal === imageStyleData.uuid) {
            setOpen(true);
        }
    }, [selModal]);
    const textCopy = (data: string) => {
        copy(data);
        dispatch(
            openSnackbar({
                open: true,
                message: '复制成功',
                variant: 'alert',
                alert: {
                    color: 'success'
                },
                anchorOrigin: { vertical: 'top', horizontal: 'center' },
                close: false
            })
        );
    };
    const imageStyleLength = useMemo(() => {
        return imageStyleData?.variableList?.filter((item: any) => item.type === 'IMAGE')?.length || 0;
    }, [imageStyleData]);
    const textStyle = useMemo(() => {
        if (imageStyleData?.videoConfig) {
            const videoConfig = JSON.parse(imageStyleData?.videoConfig);
            return videoConfig?.globalSettings?.subtitles;
        }
        return {};
    }, [imageStyleData?.videoConfig]);

    const [visible, setVisible] = useState(false);
    const [position, setPosition] = useState({ x: 0, y: 0 });
    // 点击其他地方关闭菜单
    useEffect(() => {
        const handleClick = () => setVisible(false);
        document.addEventListener('click', handleClick);
        return () => document.removeEventListener('click', handleClick);
    }, []);
    const [rowId, setRowId] = useState('');
    const [rowType, setRowType] = useState('');
    return (
        <div className="flex min-h-[250px]">
            <div className="flex-1">
                {open && (
                    <SelectTemplateModal
                        open={open}
                        imageTypeList={imageTypeList}
                        handleClose={() => setOpen(false)}
                        handleOk={handleOk}
                        spinLoading={spinLoading}
                    />
                )}
                <div className="pr-4 flex justify-between">
                    <div className="!w-[40%]">
                        <FormControl fullWidth error={!imageStyleData?.code} sx={{ flex: 1 }} color="secondary">
                            <TextField
                                size="small"
                                color="secondary"
                                className="!cursor-pointer"
                                id="outlined-basic"
                                label="图片模版"
                                variant="outlined"
                                InputLabelProps={{ shrink: true }}
                                value={currentTemp?.groupName}
                                onClick={() => setOpen(true)}
                                error={!imageStyleData?.code}
                                disabled={canEdit}
                            />
                            <FormHelperText>{!imageStyleData?.code ? '请选择图片模版后进行设置' : '点击可切换图片'}</FormHelperText>
                        </FormControl>
                    </div>
                    <div className="flex flex-col items-end gap-2">
                        <Button
                            icon={<SwapOutlined />}
                            size="small"
                            type="link"
                            onClick={() => {
                                setIsVideoOpen(!isVideoOpen);
                            }}
                        >
                            {isVideoOpen ? '图片模版配置' : '图片视频配置'}
                        </Button>
                        <div className="flex items-center gap-2">
                            <div className="text-xs inline-block">
                                是否复制图片{' '}
                                <Tooltip title="设置分组字段后，需开启此功能，保证一组素材使用相同的模版风格">
                                    <ExclamationCircleOutlined className="cursor-pointer" />
                                </Tooltip>
                            </div>
                            <Switch
                                checked={imageStyleData?.isCopy}
                                onChange={(e) => {
                                    const newData = _.cloneDeep(imageStyleData);
                                    newData.isCopy = e;
                                    setData(newData);
                                }}
                            />
                            {/* <div className="text-xs inline-block">是否使用全部素材 </div>
                        <Switch
                            checked={imageStyleData?.isUseAllMaterial}
                            onChange={(e) => {
                                const newData = _.cloneDeep(imageStyleData);
                                newData.isUseAllMaterial = e;
                                setData(newData);
                            }}
                        /> */}

                            {!canEdit && (
                                <Button type="primary" onClick={handleCopy}>
                                    复制
                                </Button>
                            )}
                        </div>
                    </div>
                </div>
                {imageStyleData?.code && (
                    <div>
                        <div className="flex">
                            <div className={`${isVideoOpen ? '!w-[40%]' : '!w-[80%]'}`}>
                                <div className="text-lg">图片模版示意图</div>
                                <div className="overflow-hidden p-3">
                                    <div className="relative w-[85%] mx-auto" ref={imgRef}>
                                        {currentTemp?.example ? (
                                            <Image
                                                width={'100%'}
                                                preview={false}
                                                src={currentTemp?.example + '?x-oss-process=image/resize,w_380/quality,q_80'}
                                                placeholder
                                            />
                                        ) : (
                                            <Spin className="w-full flex justify-center items-center aspect-[9/16]" />
                                        )}
                                        {currentJson?.objects
                                            ?.filter((item: any) => item.type === 'image' || item.type.includes('text'))
                                            ?.map((item: any, index: number) => {
                                                return (
                                                    <div
                                                        key={`${item.id}-${index}`}
                                                        onMouseEnter={() => setCurrentElementId(item.id)}
                                                        onMouseLeave={() => setCurrentElementId('')}
                                                        className={`${
                                                            item.id === currentElementId ||
                                                            (!isVideoOpen &&
                                                                imageStyleData?.variableList?.find((el: any) => el.field === item.id)
                                                                    ?.value)
                                                                ? 'outline outline-offset-2 outline-blue-500 w-full'
                                                                : 'w-full'
                                                        }`}
                                                        style={{
                                                            width: `${item.width * item.scaleX * scale}px`,
                                                            height: `${item.height * item.scaleY * scale}px`,
                                                            left: `${item.left * scale}px`,
                                                            top: `${item.top * scale}px`,
                                                            position: 'absolute',
                                                            transform: `rotate(${item.angle}deg)`
                                                        }}
                                                        onContextMenu={(e) => {
                                                            if (item.type === 'image') {
                                                                setRowType('image');
                                                            } else {
                                                                setRowType('text');
                                                            }
                                                            e.preventDefault();
                                                            setRowId(item.id);
                                                            setPosition({ x: e.clientX, y: e.clientY });
                                                            setVisible(true);
                                                        }}
                                                    >
                                                        {!isVideoOpen && (
                                                            <div className="w-full h-full relative group">
                                                                <div className="absolute top-0 left-0 text-xs bg-white rounded-md p-1 shadow-xl">
                                                                    {imageStyleData?.variableList?.find((el: any) => el.field === item.id)
                                                                        ?.isCustom
                                                                        ? '自定义'
                                                                        : imageStyleData?.variableList?.find(
                                                                              (el: any) => el.field === item.id
                                                                          )?.value}
                                                                </div>
                                                            </div>
                                                        )}
                                                    </div>
                                                );
                                            })}
                                        {visible && (
                                            <div
                                                style={{
                                                    position: 'fixed',
                                                    top: position.y + 'px',
                                                    left: position.x + 'px',
                                                    background: 'white',
                                                    boxShadow: '0 2px 8px rgba(0,0,0,0.15)',
                                                    padding: '8px 16px',
                                                    width: '628px',
                                                    zIndex: 1000
                                                }}
                                            >
                                                <div className="w-full h-full relative">
                                                    <Tabs
                                                        items={[
                                                            {
                                                                label: '字段选择',
                                                                key: '1',
                                                                children: (
                                                                    <div onClick={(e) => e.stopPropagation()}>
                                                                        <CustomRight
                                                                            open={visible}
                                                                            setOpen={setVisible}
                                                                            setData={(data) => {
                                                                                const newData = _.cloneDeep(imageStyleData);
                                                                                const index = newData.variableList.findIndex(
                                                                                    (item: any) => item.field === rowId
                                                                                );
                                                                                newData.variableList[index].isCustom = false;
                                                                                newData.variableList[index].value = `{{${data}}}`;
                                                                                newData.variableList[index].uuid = uuidv4()
                                                                                    ?.split('-')
                                                                                    ?.join('');
                                                                                setData(newData);
                                                                                setPre(pre + 1);
                                                                            }}
                                                                            rowType={rowType}
                                                                            details={appData.appReqVO}
                                                                            stepCode="PosterActionHandler"
                                                                        />
                                                                    </div>
                                                                )
                                                            },
                                                            {
                                                                label: '自定义',
                                                                key: '2',
                                                                children: (
                                                                    <div onClick={(e) => e.stopPropagation()}>
                                                                        <Input.TextArea
                                                                            onBlur={(e) => {
                                                                                console.log(e.target.value);
                                                                                const newData = _.cloneDeep(imageStyleData);
                                                                                newData.variableList.find(
                                                                                    (el: any) => el.field === rowId
                                                                                ).value = e.target.value;
                                                                                newData.variableList.find(
                                                                                    (el: any) => el.field === rowId
                                                                                ).isCustom = true;
                                                                                setData(newData);
                                                                                setPre(pre + 1);
                                                                                setVisible(false);
                                                                            }}
                                                                            rows={6}
                                                                        />
                                                                    </div>
                                                                )
                                                            }
                                                        ]}
                                                    />
                                                </div>
                                                <Button
                                                    type="primary"
                                                    size="small"
                                                    disabled={!imageStyleData?.variableList?.find((el: any) => el.field === rowId)?.value}
                                                    onClick={() => {
                                                        const newData = _.cloneDeep(imageStyleData);
                                                        newData.variableList.find((el: any) => el.field === rowId).value = '';
                                                        newData.variableList.find((el: any) => el.field === rowId).isCustom = false;
                                                        setData(newData);
                                                    }}
                                                    className="absolute top-4 right-4 cursor-pointer"
                                                >
                                                    取消绑定
                                                </Button>
                                            </div>
                                        )}
                                        {textStyle?.enable && (
                                            <div
                                                style={{
                                                    bottom: scale * textStyle?.position?.y || 0,
                                                    fontSize: scale * textStyle?.fontSize || 16 + 'px',
                                                    color: textStyle?.color || 'transparent',
                                                    background: textStyle?.bgColor || 'transparent',
                                                    fontFamily: textStyle?.font ? `${textStyle.font}, Arial` : 'Arial'
                                                }}
                                                className="absolute left-[50%] translate-x-[-50%] w-[80%] text-center"
                                            >
                                                <style>
                                                    {textStyle?.font &&
                                                        `
            @font-face {
                font-family: '${textStyle.font}';
                src: local('${textStyle.font}'),
                     url('https://service-oss-poster.mofaai.com.cn/font/font/${encodeURIComponent(textStyle.font)}.ttf') format('truetype');
            }
        `}
                                                </style>
                                                魔法笔记字幕
                                            </div>
                                        )}
                                        {!isVideoOpen && (
                                            <>
                                                <div className="w-full text-center text-xs mt-2">
                                                    模版元素
                                                    {currentJson?.objects?.filter(
                                                        (item: any) => item.type === 'image' || item.type.includes('text')
                                                    )?.length || 0}{' '}
                                                    个
                                                </div>
                                                <div className="w-full text-center text-xs">
                                                    已绑定数据{' '}
                                                    {imageStyleData?.variableList?.filter((item: any) => item.value)?.length || 0} 个
                                                </div>
                                            </>
                                        )}
                                    </div>
                                </div>
                            </div>
                            {isVideoOpen && (
                                <div>
                                    <Divider type="vertical" style={{ height: '100%' }} />
                                </div>
                            )}
                            <div className="flex-1">
                                {isVideoOpen ? (
                                    <div className="h-full mt-4">
                                        <div className="text-lg">视频生成配置</div>
                                        <div className="text-xs text-black/50">修改配置保存后，新生成的笔记才能生效</div>
                                        <div className="flex items-center gap-2 my-4">
                                            开启图文视频生成
                                            <Switch
                                                disabled={canEdit}
                                                checked={imageStyleData?.openVideoMode || false}
                                                onChange={(e) => {
                                                    const newData = _.cloneDeep(imageStyleData);
                                                    newData.openVideoMode = e;
                                                    setData(newData);
                                                }}
                                            />
                                        </div>
                                        {imageStyleData?.openVideoMode && (
                                            <VideoSetting
                                                canEdit={canEdit}
                                                quickConfiguration={
                                                    imageStyleData?.quickConfiguration
                                                        ? JSON.parse(imageStyleData?.quickConfiguration)
                                                        : {
                                                              isVoiceRole: false,
                                                              isRepeatEnable: false,
                                                              isRepeatRole: false,
                                                              isRepeatCount: false
                                                          }
                                                }
                                                setQuickConfiguration={(value: any) => {
                                                    const newData = _.cloneDeep(imageStyleData);
                                                    newData.quickConfiguration = JSON.stringify(value);
                                                    setData(newData);
                                                }}
                                                currentElementId={currentElementId}
                                                setCurrentElementId={setCurrentElementId}
                                                currentJson={currentJson}
                                                variableList={imageStyleData?.variableList?.filter((item: any) => item.type !== 'IMAGE')}
                                                videoConfig={imageStyleData?.videoConfig}
                                                upDateData={debounce(async (data: any) => {
                                                    console.log(data);
                                                    const newData = _.cloneDeep(imageStyleData);
                                                    newData.videoConfig = JSON.stringify(data);
                                                    setData(newData);
                                                }, 500)}
                                            />
                                        )}
                                    </div>
                                ) : (
                                    <div>
                                        {/* {materialStatus === 'default' && (
                                            <div>
                                                {imageStyleLength > 0 && (
                                                    <>
                                                        <div className="text-lg">图片生成配置</div>
                                                        <div className="text-xs text-black/50">
                                                            {appData?.materialType === 'picture'
                                                                ? '用上传素材的图片随机绑定到图片模板上'
                                                                : '用上传素材的图片类型字段绑定到图片模板上的图片位置'}
                                                        </div>
                                                    </>
                                                )}
                                                <div className="flex flex-wrap">
                                                    {appData?.materialType === 'picture' ? (
                                                        <>
                                                            <div className="flex items-center gap-4 min-h-[32px]">
                                                                <span>图片生成模式</span>
                                                                <Switch
                                                                    disabled={canEdit}
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
                                                                el.type === 'IMAGE' &&
                                                                el.field && (
                                                                    <div
                                                                        key={index}
                                                                        className="w-[50%] p-3"
                                                                        ref={wrapperRef}
                                                                        onClick={() => setCurrentElementId(el.field)}
                                                                        onMouseEnter={() => setCurrentElementId(el.field)}
                                                                        onMouseLeave={() => setCurrentElementId('')}
                                                                    >
                                                                        <VariableInput
                                                                            disabled={canEdit}
                                                                            styles={
                                                                                currentElementId === el.field
                                                                                    ? {
                                                                                          border: '2px solid #673ab7'
                                                                                      }
                                                                                    : {}
                                                                            }
                                                                            open={perOpen[index]}
                                                                            setOpen={(flag) => {
                                                                                const newData = _.cloneDeep(perOpen);
                                                                                newData[index] = flag;
                                                                                setPerOpen(newData);
                                                                            }}
                                                                            code="PosterActionHandler"
                                                                            popoverWidth={popoverWidth}
                                                                            handleMenu={handleMenu}
                                                                            details={appData.appReqVO}
                                                                            index={index}
                                                                            title={el?.label}
                                                                            value={el.value}
                                                                            pre={pre}
                                                                            setValue={(value) => {
                                                                                console.log(value);

                                                                                const newData = _.cloneDeep(imageStyleData);
                                                                                newData.variableList[index].value = value;
                                                                                newData.variableList[index].uuid = uuidv4()
                                                                                    ?.split('-')
                                                                                    ?.join('');
                                                                                setData(newData);
                                                                            }}
                                                                        />
                                                                    </div>
                                                                )
                                                        )
                                                    )}
                                                </div>
                                            </div>
                                        )}

                                        {imageStyleData?.variableList?.filter((item: any) => item?.type === 'TEXT')?.length > 0 && (
                                            <div className="mt-2">
                                                <div className="text-lg">图片文字配置</div>
                                                <div className="text-xs text-black/50">可绑定数据或输入内容到图片模版上具体文字位置上</div>
                                                <div className="flex items-center gap-4 min-h-[32px] ml-3">
                                                    <span>AI 图片分析生产标题</span>
                                                    <Switch
                                                        disabled={canEdit}
                                                        checked={imageStyleData?.isMultimodalTitle}
                                                        onChange={(e) => {
                                                            const newData = _.cloneDeep(imageStyleData);
                                                            newData.isMultimodalTitle = e;
                                                            setData(newData);
                                                        }}
                                                    />
                                                </div>
                                                {imageStyleData?.isMultimodalTitle && (
                                                    <>
                                                        <Input
                                                            className="w-[400px] ml-3"
                                                            value={imageStyleData?.multimodalTitleRequirement}
                                                            onChange={(e) => {
                                                                const newData = _.cloneDeep(imageStyleData);
                                                                newData.multimodalTitleRequirement = e.target.value;
                                                                setData(newData);
                                                            }}
                                                            placeholder="可填写对图片上标题生成内容的要求，默认可不填写"
                                                        />
                                                        <div className="ml-3 text-xs text-black/50 my-2">
                                                            <span className="text-[#673ab7] font-bold">Tips：</span>
                                                            可使用下面的变量替换到图片文字字段中
                                                        </div>
                                                        <div className="ml-3 flex gap-2 text-xs mb-4">
                                                            <Tooltip title="点击复制">
                                                                <div
                                                                    onClick={() => textCopy(`{{AI分析.图片标题}}`)}
                                                                    className="cursor-pointer"
                                                                >{`{{AI分析.图片标题}}`}</div>
                                                            </Tooltip>
                                                            <Tooltip title="点击复制">
                                                                <div
                                                                    onClick={() => textCopy(`{{AI分析.图片副标题}}`)}
                                                                    className="cursor-pointer"
                                                                >{`{{AI分析.图片副标题}}`}</div>
                                                            </Tooltip>
                                                        </div>
                                                    </>
                                                )}
                                                <div className="flex flex-wrap">
                                                    {imageStyleData?.variableList?.map(
                                                        (el: any, index: number) =>
                                                            el.type === 'TEXT' &&
                                                            el.field && (
                                                                <div
                                                                    key={index}
                                                                    className="w-[50%] p-3"
                                                                    ref={wrapperRef}
                                                                    onClick={() => setCurrentElementId(el.field)}
                                                                    onMouseEnter={() => setCurrentElementId(el.field)}
                                                                    onMouseLeave={() => setCurrentElementId('')}
                                                                >
                                                                    <VariableInput
                                                                        row={el.field === isPageInputId ? 4 : 1}
                                                                        isPageText={el.field === isPageInputId}
                                                                        disabled={canEdit}
                                                                        styles={
                                                                            currentElementId === el.field
                                                                                ? {
                                                                                      border: '2px solid #673ab7'
                                                                                  }
                                                                                : {}
                                                                        }
                                                                        open={perOpen[index]}
                                                                        setOpen={(flag) => {
                                                                            const newData = _.cloneDeep(perOpen);
                                                                            newData[index] = flag;
                                                                            setPerOpen(newData);
                                                                        }}
                                                                        code="title"
                                                                        popoverWidth={popoverWidth}
                                                                        handleMenu={handleMenu}
                                                                        details={appData.appReqVO}
                                                                        index={index}
                                                                        title={el?.label}
                                                                        value={el.value}
                                                                        pre={pre}
                                                                        setValue={(value) => {
                                                                            console.log(value);

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
                                        )} */}
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};
export default EditStyle;
