import {
    Button,
    Divider,
    Image,
    Dropdown,
    Space,
    Drawer,
    Collapse,
    Modal,
    Switch,
    message,
    Tooltip,
    Spin,
    Checkbox,
    Tag,
    Popconfirm
} from 'antd';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import { useEffect, useImperativeHandle, useRef, useState } from 'react';
import { FormControl, TextField } from '@mui/material';
import InfoIcon from '@mui/icons-material/Info';
import React from 'react';
import StyleTabs from '../../views/pages/copywriting/components/styleTabs';
import './index.css';
import _ from 'lodash-es';
import { v4 as uuidv4 } from 'uuid';
import { Swiper, SwiperSlide } from 'swiper/react';
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';
import { Pagination } from 'swiper';
import { planModifyConfig } from '../../api/redBook/batchIndex';
import {
    PlusOutlined,
    EyeOutlined,
    ExclamationCircleOutlined,
    DeleteOutlined,
    SettingOutlined,
    InfoCircleOutlined
} from '@ant-design/icons';
import CreateTab from 'views/pages/copywriting/components/spliceCmponents/tab';
import { dispatch } from 'store';
import { openSnackbar } from 'store/slices/snackbar';
import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';
import Preview from './preview';
import { useAllDetail } from 'contexts/JWTContext';

const AddStyle = React.forwardRef(
    (
        {
            selectImgLoading,
            record,
            details,
            appUid,
            mode = 1,
            materialType,
            getList,
            hasAddStyle = true,
            setImageVar,
            allData,
            canAddCustomStyle = true,
            saveTemplate,
            materialStatus,
            setAppData
        }: any,
        ref: any
    ) => {
        const useInfo = useAllDetail();
        const [visible, setVisible] = useState(false);

        const [systemOPen, setSystemOPen] = useState(false);
        const [systemVariable, setSystemVariable] = useState<any>([]); //系统变量
        const [syszanVariable, setSyszanVariable] = useState<any>([]);

        //新增文案与风格
        const [focuActive, setFocuActive] = useState<any[]>([]);
        const [styleData, setStyleData] = useState<any>([]);
        const [selectImgs, setSelectImgs] = useState<any>([]);

        const [query, setQuery] = useState<any | null>({
            picNum: ''
        });
        const [hoverIndex, setHoverIndex] = useState<any>('');
        const [chooseImageIndex, setChooseImageIndex] = useState<any>([]);
        const [type, setType] = useState<any>();
        const [editIndex, setEditIndex] = useState<any>('');
        const [templateList, setTemplateList] = useState<any[]>([]);
        const [customList, setCustomList] = useState<any[]>([]);
        const [isModalOpen, setIsModalOpen] = useState(false);
        const [currentStyle, setCurrentStyle] = useState<any>(null);
        const [switchCheck, setSwitchCheck] = useState(false);
        const [updIndex, setUpdIndex] = useState<any>('');
        const [addType, setAddType] = useState(0);
        const [originStyleData, setOriginStyleData] = useState([]);

        const currentStyleRef: any = useRef(null);
        const collapseIndexRef: any = useRef(null);
        const templateRef: any = useRef(null);

        const submitData = React.useMemo(() => {
            if (record) {
                const copyRecord = _.cloneDeep(record);
                copyRecord?.variable?.variables?.forEach((item: any) => {
                    // addType
                    if (addType === 1) {
                    } else {
                        // 风格产生===2 -> POSTER_STYLE
                        if (mode === 1) {
                            if (item.field === 'POSTER_STYLE_CONFIG') {
                                item.value = JSON.stringify(styleData);
                            }
                        } else {
                            if (item.field === 'POSTER_STYLE') {
                                item.value = JSON.stringify(styleData?.[0] || {});
                            }
                        }
                    }
                });
                copyRecord.flowStep.variable.variables.find((item: any) => item.field === 'SYSTEM_POSTER_STYLE_CONFIG').value =
                    JSON.stringify(systemVariable);
                return copyRecord;
            } else {
                return {};
            }
        }, [styleData, record, systemVariable]);

        // useEffect(() => {
        //     // 系统的初始化为关闭
        //     if (currentStyle?.system) {
        //         setSwitchCheck(false);
        //     } else {
        //         // 自定义的只能是开启 不能关闭
        //         setSwitchCheck(true);
        //     }
        // }, [currentStyle?.system]);

        useImperativeHandle(ref, () => ({
            record: submitData
        }));

        useEffect(() => {
            const newList = _.cloneDeep(submitData);
            if (newList?.variable?.variables) {
                newList.variable.variables.find((item: any) => item.field === 'CUSTOM_POSTER_STYLE_CONFIG').value = JSON.parse(
                    newList.variable.variables.find((item: any) => item.field === 'CUSTOM_POSTER_STYLE_CONFIG').value
                );
                console.log(newList);
                setImageVar && setImageVar(newList);
            } else {
                setImageVar([]);
            }
        }, [submitData]);

        useEffect(() => {
            if (record) {
                const tempList =
                    record?.flowStep?.variable.variables.find((item: any) => item.field === 'SYSTEM_POSTER_STYLE_CONFIG')?.value || [];
                const sysTempList = tempList.filter((item: any) => item.system);
                setTemplateList(sysTempList);
                templateRef.current = tempList;

                const customList =
                    record?.variable?.variables.find((item: any) => item.field === 'CUSTOM_POSTER_STYLE_CONFIG')?.value || '[]';
                const json = JSON.parse(customList);
                const list = json.map((item: any) => ({
                    ...item,
                    uuid: uuidv4()?.split('-')?.join('')
                }));
                setCustomList([...list]);
            }
        }, [record]);

        React.useEffect(() => {
            if (record) {
                let list: any = [];
                if (mode === 2) {
                    const value = record.variable.variables.find((item: any) => item.field === 'POSTER_STYLE')?.value;
                    if (value) {
                        list = [typeof value === 'object' ? value : JSON.parse(value)];
                    }
                } else {
                    list = record.variable.variables.find((item: any) => item.field === 'POSTER_STYLE_CONFIG')?.value || [];
                }
                const systemList =
                    record?.flowStep?.variable?.variables?.find((item: any) => item.field === 'SYSTEM_POSTER_STYLE_CONFIG')?.value || [];
                const typeList = list?.map((item: any) => ({ ...item, type: 1 }));
                setOriginStyleData(typeList);
                setStyleData(typeList);
                setSystemVariable(systemList);
            }
        }, [record, mode]);

        const handleAdd = () => {
            setType(0);
            setVisible(true);
        };

        const handleQuery = ({ label, value }: { label: string; value: string }) => {
            setQuery({
                ...query,
                [label]: value
            });
        };

        useEffect(() => {
            if (query?.picNum) {
                const filterList = templateRef.current.filter((item: any) => item.templateList.length === query?.picNum);
                setTemplateList(filterList);
            } else {
                setTemplateList(templateRef.current);
            }
        }, [query]);

        const handleChoose = (index: number) => {
            const currentIndex = chooseImageIndex.indexOf(index);
            let copyChooseImageIndex = [...chooseImageIndex];
            // 新增
            if (type === 0) {
                if (currentIndex > -1) {
                    copyChooseImageIndex.splice(currentIndex, 1);
                } else {
                    copyChooseImageIndex.push(index);
                }
            } else {
                // 切换
                if (currentIndex > -1) {
                    copyChooseImageIndex.splice(currentIndex, 1);
                } else {
                    copyChooseImageIndex = [index];
                }
            }
            setChooseImageIndex([...copyChooseImageIndex]);
            const combineList = [...templateList, ...customList];
            const list: any = combineList.filter((item) => copyChooseImageIndex.includes(item.uuid));
            setSelectImgs(list);
        };

        const items: any =
            mode === 1
                ? [
                      {
                          key: '0',
                          label: (
                              <span
                                  onClick={(e) => {
                                      e.stopPropagation();
                                      const index: any = collapseIndexRef.current;
                                      const copyStyleData = [...styleData];
                                      const item = copyStyleData[index];
                                      setCurrentStyle(item);
                                      currentStyleRef.current = item;
                                      setIsModalOpen(true);
                                      setUpdIndex(index);
                                      setSwitchCheck(false);
                                  }}
                              >
                                  查看
                              </span>
                          )
                      },
                      {
                          key: '1',
                          label: (
                              <span
                                  onClick={(e) => {
                                      e.stopPropagation();
                                      const index: any = collapseIndexRef.current;
                                      const copyStyleData = [...styleData];
                                      copyStyleData.splice(index, 1);
                                      setStyleData(copyStyleData);
                                  }}
                              >
                                  删除
                              </span>
                          )
                      }
                  ]
                : [
                      {
                          key: '0',
                          label: (
                              <span
                                  onClick={(e) => {
                                      e.stopPropagation();
                                      const index: any = collapseIndexRef.current;
                                      const copyStyleData = [...styleData];
                                      const item = copyStyleData[index];
                                      setCurrentStyle(item);
                                      currentStyleRef.current = item;
                                      setIsModalOpen(true);
                                      setUpdIndex(index);
                                      setSwitchCheck(false);
                                  }}
                              >
                                  查看
                              </span>
                          )
                      }
                  ];

        // 重试
        const handleOK = () => {
            if (!selectImgs) {
                message.warning('请选择图片模版');
                return;
            }
            // 取最大的+1
            if (type === 0) {
                const list = styleData.map((item: any) => item.name);
                let maxNumber;
                if (list.length === 0) {
                    maxNumber = 0;
                } else {
                    maxNumber = Math.max(...list.map((item: any) => parseInt(item.match(/\d+/))));
                }
                // setStyleData([...styleData, ...selectImgs]);
                setStyleData([...selectImgs]);
                setVisible(false);
                setSelectImgs([]);
                setChooseImageIndex([]);
                setTimeout(() => {
                    saveTemplate && saveTemplate();
                });
            }
            if (type === 1) {
                const newData = _.cloneDeep(allData);
                newData.executeParam.appInformation.workflowConfig.steps
                    .find((item: any) => item.flowStep.handler === 'PosterActionHandler')
                    .variable.variables.find((item: any) => item.field === 'POSTER_STYLE').value = selectImgs?.[0];
                console.log(newData);
                setAppData(newData);
                setVisible(false);
                setSelectImgs([]);
                setChooseImageIndex([]);
                // styleData[editIndex] = selectImgs?.[0];
                // setStyleData([...styleData]);
            }
        };

        const handleOkV2 = () => {
            if (type === 0) {
                // 新增
                const copyOriginStyleData = [...originStyleData];
                const imageStyleList = [...copyOriginStyleData, selectImgs];

                const saveData: any = {};
                saveData.configuration = {
                    appInformation: allData.configuration.appInformation,
                    imageStyleList: imageStyleList.map((item, index) => ({ ...item, index: index + 1 })),
                    materialList: allData.configuration.materialList
                };
                saveData.source = allData.source;
                saveData.totalCount = allData.totalCount;
                saveData.uid = allData.uid;

                planModifyConfig({ ...saveData, validate: false })
                    .then((res: any) => {
                        setIsModalOpen(false);
                        setUpdIndex('');
                        setAddType(0);
                        setCurrentStyle(null);
                        getList();
                        setVisible(false);
                        setSelectImgs([]);
                        setChooseImageIndex([]);
                        dispatch(
                            openSnackbar({
                                open: true,
                                message: '创作计划保存成功',
                                variant: 'alert',
                                alert: {
                                    color: 'success'
                                },
                                anchorOrigin: { vertical: 'top', horizontal: 'center' },
                                close: false
                            })
                        );
                    })
                    .catch((e: any) => {
                        return;
                    });
            }
            if (type === 1) {
                //切换
                const copyOriginStyleData: any = [...originStyleData];
                copyOriginStyleData[editIndex] = selectImgs;

                const saveData: any = {};
                saveData.configuration = {
                    appInformation: allData.configuration.appInformation,
                    imageStyleList: copyOriginStyleData.map((item: any, index: number) => ({ ...item, index: index + 1 })),
                    materialList: allData.configuration.materialList
                };
                saveData.source = allData.source;
                saveData.totalCount = allData.totalCount;
                saveData.uid = allData.uid;

                planModifyConfig({ ...saveData, validate: false })
                    .then((res: any) => {
                        setIsModalOpen(false);
                        setUpdIndex('');
                        setAddType(0);
                        setCurrentStyle(null);
                        getList();
                        setVisible(false);
                        setSelectImgs([]);
                        setChooseImageIndex([]);
                        dispatch(
                            openSnackbar({
                                open: true,
                                message: '创作计划保存成功',
                                variant: 'alert',
                                alert: {
                                    color: 'success'
                                },
                                anchorOrigin: { vertical: 'top', horizontal: 'center' },
                                close: false
                            })
                        );
                    })
                    .catch((e: any) => {
                        return;
                    });
            }
        };

        const collapseList = React.useMemo(() => {
            return styleData.map((item: any, index: number) => ({
                key: index,
                label: (
                    <div className="flex justify-between h-[22px]">
                        <span>
                            {item.name} {!item.system && <Tag color="blue">自定义</Tag>}
                        </span>
                        <div className="flex justify-center">
                            <span>共{item?.templateList?.length || 0}张图片</span>
                            <Dropdown
                                menu={{ items }}
                                placement="bottom"
                                arrow
                                onOpenChange={() => {
                                    collapseIndexRef.current = index;
                                }}
                            >
                                <MoreVertIcon className="cursor-pointer" onClick={(e) => e.stopPropagation()} />
                            </Dropdown>
                        </div>
                    </div>
                ),
                children: (
                    <div>
                        <div className="mb-3">风格示意图</div>
                        <div className="overflow-x-auto flex">
                            <Image.PreviewGroup
                                preview={{
                                    onChange: (current, prev) => console.log(`current index: ${current}, prev index: ${prev}`)
                                }}
                            >
                                {item?.templateList?.map((item: any, index: number) => (
                                    <div className="w-[160px] h-[200px] mx-1">
                                        <Image
                                            width={160}
                                            height={200}
                                            src={`${item.example}?x-oss-process=image/resize,w_160/quality,q_80`}
                                            fallback="data:image/png;base64,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"
                                            placeholder={
                                                <div className="w-[160px] h-[200px] flex justify-center items-center">
                                                    <Spin />
                                                </div>
                                            }
                                            preview={{
                                                src: item.example
                                            }}
                                        />
                                    </div>
                                ))}
                            </Image.PreviewGroup>
                        </div>
                        <Divider
                            style={{
                                margin: '16px 0'
                            }}
                        />
                        <div className="flex justify-between">
                            <Button
                                onClick={() => {
                                    setType(1);
                                    setVisible(true);
                                    setEditIndex(index);
                                }}
                            >
                                切换风格模版
                            </Button>
                        </div>
                    </div>
                )
            }));
        }, [styleData]);

        const handleCancel = () => {
            setUpdIndex('');
            setAddType(0);
            setIsModalOpen(false);
            setCurrentStyle(null);
        };

        // 根据Index 来判断
        const handleOk = () => {
            if (!currentStyle.name) {
                message.warning('请填写风格名称');
                return;
            }
            // 新增
            if (addType === 1) {
                const copyRecord = _.cloneDeep(record);
                const copyDetails = _.cloneDeep(details);
                const valueString =
                    copyRecord.variable.variables.find((item: any) => item.field === 'CUSTOM_POSTER_STYLE_CONFIG')?.value || '[]';
                const indexList = JSON.parse(valueString)
                    .map((item: any) => item.index)
                    .filter((item: any) => typeof item === 'number')
                    .filter(Boolean);

                const index = Math.max(...indexList);
                copyRecord.variable.variables.forEach((item: any) => {
                    if (item.field === 'CUSTOM_POSTER_STYLE_CONFIG') {
                        item.value = [
                            ...JSON.parse(item.value),
                            {
                                ...currentStyle,
                                enable: true,
                                index: index + 1,
                                system: false,
                                totalImageCount: 0,
                                uuid: uuidv4()?.split('-')?.join('')
                            }
                        ];
                    }
                });

                copyDetails?.workflowConfig?.steps?.forEach((item: any) => {
                    if (item.flowStep.handler === 'PosterActionHandler') {
                        // 将该步骤的属性值更改为 copyRecord 的值
                        item && copyRecord && Object.assign(item, copyRecord);
                    }
                });

                copyDetails?.workflowConfig?.steps?.forEach((item: any) => {
                    const arr = item?.variable?.variables;
                    const arr1 = item?.flowStep?.variable?.variables;
                    arr?.forEach((el: any) => {
                        if (el.value && typeof el.value === 'object') {
                            el.value = JSON.stringify(el.value);
                        }
                    });
                    arr1?.forEach((el: any) => {
                        if (el.value && typeof el.value === 'object') {
                            el.value = JSON.stringify(el.value);
                        }
                    });
                });

                const saveData: any = {};
                saveData.configuration = {
                    appInformation: copyDetails,
                    imageStyleList: allData.configuration.imageStyleList,
                    materialList: allData.configuration.materialList
                };
                saveData.source = allData.source;
                saveData.totalCount = allData.totalCount;
                saveData.uid = allData.uid;

                planModifyConfig({ ...saveData, validate: false })
                    .then((res: any) => {
                        setIsModalOpen(false);
                        setUpdIndex('');
                        setAddType(0);
                        setCurrentStyle(null);
                        getList();
                        dispatch(
                            openSnackbar({
                                open: true,
                                message: '创作计划保存成功',
                                variant: 'alert',
                                alert: {
                                    color: 'success'
                                },
                                anchorOrigin: { vertical: 'top', horizontal: 'center' },
                                close: false
                            })
                        );
                    })
                    .catch((e: any) => {
                        return;
                    });
            } else {
                const copyStyleData = _.cloneDeep(styleData);
                // 非系统的uuid需要变
                if (!currentStyle.system) {
                    currentStyle.uuid = uuidv4()?.split('-')?.join('');
                    currentStyle.templateList.forEach((item: any) => {
                        item.uuid = uuidv4()?.split('-')?.join('');
                        item.variableList.forEach((item1: any) => {
                            item1.uuid = uuidv4()?.split('-')?.join('');
                        });
                    });
                }

                copyStyleData[updIndex] = currentStyle;
                setStyleData(copyStyleData);
                setIsModalOpen(false);
                setUpdIndex('');
                setAddType(0);
                setCurrentStyle(null);
            }
        };

        const handleDel = (index: number) => {
            const copyRecord = _.cloneDeep(record);
            const copyDetails = _.cloneDeep(details);
            const valueString =
                copyRecord?.variable?.variables?.find((item: any) => item.field === 'CUSTOM_POSTER_STYLE_CONFIG')?.value || '[]';
            const value = JSON.parse(valueString);
            value.splice(index, 1);
            console.log(value, 'del');

            copyRecord.variable.variables.forEach((item: any) => {
                if (item.field === 'CUSTOM_POSTER_STYLE_CONFIG') {
                    item.value = value;
                }
            });

            copyDetails?.workflowConfig?.steps?.forEach((item: any) => {
                if (item.flowStep.handler === 'PosterActionHandler') {
                    // 将该步骤的属性值更改为 copyRecord 的值
                    item && copyRecord && Object.assign(item, copyRecord);
                }
            });

            copyDetails?.workflowConfig?.steps?.forEach((item: any) => {
                const arr = item?.variable?.variables;
                const arr1 = item?.flowStep?.variable?.variables;
                arr?.forEach((el: any) => {
                    if (el.value && typeof el.value === 'object') {
                        el.value = JSON.stringify(el.value);
                    }
                });
                arr1?.forEach((el: any) => {
                    if (el.value && typeof el.value === 'object') {
                        el.value = JSON.stringify(el.value);
                    }
                });
            });

            const saveData: any = {};
            saveData.configuration = {
                appInformation: copyDetails,
                imageStyleList: allData.configuration.imageStyleList,
                materialList: allData.configuration.materialList
            };
            saveData.source = allData.source;
            saveData.totalCount = allData.totalCount;
            saveData.uid = allData.uid;

            planModifyConfig({ ...saveData, validate: false }).then((res: any) => {
                getList();
                dispatch(
                    openSnackbar({
                        open: true,
                        message: '创作计划保存成功',
                        variant: 'alert',
                        alert: {
                            color: 'success'
                        },
                        anchorOrigin: { vertical: 'top', horizontal: 'center' },
                        close: false
                    })
                );
            });
        };

        const [previewOpen, setPreviewOpen] = useState<boolean>(false);
        const [demoId, setDemoId] = useState<string>('');
        useEffect(() => {
            if (visible) {
                setChooseImageIndex(styleData?.map((item: any) => item.uuid));
                setSelectImgs(styleData);
            }
        }, [visible]);

        //自定义图片预览
        const [previewIndex, setPreviewIndex] = useState<any>(null);
        const [previewIndex1, setPreviewIndex1] = useState<any>(null);

        return (
            <div className="addStyle">
                {/* <div className="flex items-center mb-2">
                    <Tooltip title="生成图片时会按照风格模板的顺序去使用">
                        <InfoCircleOutlined className="cursor-pointer" />
                    </Tooltip>
                    <div className="w-full flex gap-2 justify-between">
                        <span className="text-sm ml-1 text-stone-600">配置笔记图片生成的风格模版，支持不同风格模版组合生成</span>
                        <Tooltip title="风格模版配置">
                            <Button
                                icon={<SettingOutlined />}
                                shape="circle"
                                size="small"
                                type="primary"
                                onClick={() => {
                                    setSyszanVariable(
                                        _.cloneDeep(
                                            systemVariable?.map((item: any) => ({
                                                ...item,
                                                noExecuteIfEmpty: item.noExecuteIfEmpty || false
                                            }))
                                        )
                                    );
                                    setSystemOPen(true);
                                }}
                            />
                        </Tooltip>
                    </div>
                </div> */}
                <div className="flex justify-between items-end">
                    <div className="text-base font-semibold">图片模版</div>
                    {mode === 1 ? (
                        <Button size="small" type="primary" onClick={() => handleAdd()}>
                            增加模版
                        </Button>
                    ) : (
                        <Button
                            size="small"
                            type="primary"
                            onClick={() => {
                                setType(1);
                                setVisible(true);
                                setSwitchCheck(true);
                            }}
                        >
                            重新选择模版
                        </Button>
                    )}
                </div>
                <div className="text-xs text-black/50 mt-1 mb-2">配置笔记图片生成的图片模版，支持不同风格模版组合生成</div>
                {/* <Collapse items={collapseList} defaultActiveKey={[0]} /> */}
                <div className="flex overflow-x-auto p-1">
                    {styleData?.map((item: any, index: number) => {
                        return (
                            <div
                                className={`flex overflow-x-auto cursor-pointer max-w-[150px] min-w-[150px] mr-4 ${
                                    hoverIndex === item.uuid || chooseImageIndex.includes(item.uuid)
                                        ? 'outline outline-offset-2 outline-1 outline-[#673ab7]'
                                        : 'outline outline-offset-2 outline-1 outline-[#ccc]'
                                } rounded-sm relative`}
                                onMouseEnter={() => setHoverIndex(item.uuid)}
                                onMouseLeave={() => setHoverIndex('')}
                            >
                                {/* <Checkbox
                                    checked={chooseImageIndex.includes(item.uuid)}
                                    className="absolute z-50 right-[2px]"
                                    onChange={(e) => {
                                        const value = e.target.checked;
                                        handleChoose(item.uuid);
                                    }}
                                /> */}

                                <div className="absolute z-50 bottom-0 w-[150px] flex justify-around bg-[rgba(0,0,0,0.4)] py-1">
                                    {/* <Tooltip title="复制">
                                        <span onClick={() => handleCopy(index)}>
                                            <ContentCopyIcon className="text-sm text-white" />
                                        </span>
                                    </Tooltip> */}
                                    <Tooltip title="查看">
                                        <span
                                            onClick={() => {
                                                const copyStyleData = [...styleData];
                                                const item = copyStyleData[index];
                                                setCurrentStyle(item);
                                                currentStyleRef.current = item;
                                                setIsModalOpen(true);
                                                setUpdIndex(index);
                                                setSwitchCheck(false);
                                            }}
                                        >
                                            {/* <EditIcon className="text-sm text-white" /> */}
                                            <EyeOutlined className="text-sm text-white" />
                                        </span>
                                    </Tooltip>
                                    <Popconfirm
                                        placement="top"
                                        title={`确认删除[${item?.name}]`}
                                        // description={description}
                                        okText="是"
                                        cancelText="否"
                                        onConfirm={async () => {
                                            const copyStyleData = [...styleData];
                                            copyStyleData.splice(index, 1);
                                            setStyleData(copyStyleData);
                                        }}
                                    >
                                        <Tooltip title="删除">
                                            <DeleteIcon className="text-sm text-white" />
                                        </Tooltip>
                                    </Popconfirm>
                                </div>
                                <Swiper
                                    spaceBetween={30}
                                    pagination={{
                                        clickable: true
                                    }}
                                    modules={[Pagination]}
                                    autoplay
                                >
                                    <div className="w-[145px] h-[200px] flex relative">
                                        {item?.templateList?.map((v: any, vi: number) => (
                                            <SwiperSlide className="relative group">
                                                <Image.PreviewGroup
                                                    preview={{
                                                        visible: previewIndex1?.index === index && previewIndex1?.vi === vi,
                                                        onVisibleChange: (visible) => {
                                                            setPreviewIndex1(null);
                                                        }
                                                    }}
                                                    items={styleData?.[index]?.templateList?.map((item: any) => item.example || '')}
                                                >
                                                    <Image
                                                        style={{
                                                            width: '150px'
                                                        }}
                                                        preview={false}
                                                        width={150}
                                                        key={vi}
                                                        height={200}
                                                        src={`${v.example}?x-oss-process=image/resize,w_150/quality,q_80`}
                                                        placeholder={
                                                            <div className="w-[145px] h-[200px] flex justify-center items-center">
                                                                <Spin />
                                                            </div>
                                                        }
                                                        fallback="data:image/png;base64,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"
                                                    />
                                                    {item?.saleConfig?.openSale && (
                                                        <div className="absolute bottom-[calc(50%-13px)] right-[calc(50%-37px)] rounded-full bg-[#717476] text-white text-xs font-semibold flex items-center gap-1 px-2 py-1">
                                                            <svg
                                                                viewBox="0 0 1024 1024"
                                                                version="1.1"
                                                                xmlns="http://www.w3.org/2000/svg"
                                                                p-id="11435"
                                                                width="18"
                                                                height="18"
                                                            >
                                                                <path
                                                                    d="M816.49 909H211.21c-1.1 0-2-0.9-2-2v-68.18c0-1.1 0.9-2 2-2h605.28c1.1 0 2 0.9 2 2V907c0 1.1-0.9 2-2 2z"
                                                                    fill="#FFAA22"
                                                                    p-id="11436"
                                                                ></path>
                                                                <path
                                                                    d="M910.24 316.23c-27.11 0-49.1 22.52-49.1 50.31 0 7.28 1.58 14.16 4.3 20.4l-176.13 80.21-147.2-258.57c14.56-8.73 24.46-24.74 24.46-43.28 0-27.79-21.98-50.31-49.1-50.31s-49.1 22.52-49.1 50.31c0 17.99 9.29 33.66 23.15 42.55l-158.16 259.3-176.13-80.21c2.71-6.25 4.3-13.12 4.3-20.4 0-27.78-21.98-50.31-49.1-50.31s-49.1 22.52-49.1 50.31c0 27.78 21.98 50.31 49.1 50.31 3.99 0 7.82-0.62 11.53-1.54l86.65 366.28h601.43l86.65-366.28c3.71 0.92 7.54 1.54 11.53 1.54 27.12 0 49.1-22.52 49.1-50.31 0.01-27.78-21.97-50.31-49.08-50.31z"
                                                                    fill="#FFD68D"
                                                                    p-id="11437"
                                                                ></path>
                                                            </svg>
                                                            高级版
                                                        </div>
                                                    )}
                                                    <div
                                                        onClick={() => {
                                                            setPreviewIndex1({
                                                                index,
                                                                vi
                                                            });
                                                        }}
                                                        className=" absolute top-0 left-0 w-full h-full bg-black/50 text-white hidden group-hover:block"
                                                    >
                                                        <div className="w-full h-full flex justify-center items-center gap-1">
                                                            <EyeOutlined />
                                                            预览
                                                        </div>
                                                    </div>
                                                    {v?.openVideoMode && (
                                                        <div className="text-xs text-[#673ab7] absolute left-1 top-1 z-50 bg-white px-1 rounded-md">
                                                            视频生成
                                                        </div>
                                                    )}
                                                </Image.PreviewGroup>
                                            </SwiperSlide>
                                        ))}
                                    </div>
                                </Swiper>
                            </div>
                        );
                    })}
                </div>
                <Drawer
                    // zIndex={99999}
                    title="选择图片模板"
                    // mask={false}
                    // maskClosable={false}
                    onClose={() => {
                        setVisible(false);
                        setSelectImgs([]);
                        setChooseImageIndex([]);
                    }}
                    bodyStyle={{
                        background: 'rgb(244, 246, 248)'
                    }}
                    open={visible}
                    placement={'left'}
                    width={720}
                    footer={
                        <div className="flex justify-between">
                            <div className="flex items-center">
                                <p>选择模版：</p>
                                <div className="max-w-[260px] overflow-x-auto whitespace-nowrap">
                                    <Space>
                                        {selectImgs
                                            ?.map((item: any) => item.templateList)
                                            ?.flat()
                                            ?.map((item: any, index: number) => (
                                                <Image
                                                    preview={false}
                                                    width={32}
                                                    height={40}
                                                    src={item.example}
                                                    fallback="data:image/png;base64,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"
                                                />
                                            ))}
                                    </Space>
                                </div>
                            </div>
                            <div className="flex">
                                <Space>
                                    <Button
                                        onClick={() => {
                                            setVisible(false);
                                            setSelectImgs([]);
                                            setChooseImageIndex([]);
                                        }}
                                    >
                                        取消
                                    </Button>
                                    <Button type="primary" onClick={() => handleOK()}>
                                        确定
                                    </Button>
                                </Space>
                            </div>
                        </div>
                    }
                >
                    <div className="flex justify-between bg-[#fff] mb-3 p-2">
                        <div className="flex items-center mt-1">
                            <InfoIcon
                                style={{
                                    fontSize: '12px'
                                }}
                            />
                            <p className="text-xs">系统根据您的创作笔记类型，为您找到了{templateList?.length || 0}款图片模版供您选择</p>
                        </div>
                        {/* <div>
                            {hasAddStyle && (
                                <Button
                                    onClick={() => {
                                        setAddType(1);
                                        setIsModalOpen(true);
                                    }}
                                >
                                    创建自定义风格
                                </Button>
                            )}
                        </div> */}
                    </div>
                    {/* <Spin spinning={selectImgLoading}> */}
                    <div className="h-[calc(100% - 60px)] fengge">
                        <div className="bg-white p-3">
                            <span className="text-stone-700 font-semibold">
                                系统图片风格<span className="text-xs text-black/50 ml-2">勾选想使用的图片模版</span>
                            </span>
                            <div className="grid gap-4 grid-cols-4 mt-3">
                                {templateList?.map((item, index) => {
                                    return (
                                        <div
                                            className={`flex overflow-x-auto cursor-pointer w-full ${
                                                hoverIndex === item.uuid || chooseImageIndex.includes(item.uuid)
                                                    ? 'outline outline-offset-2 outline-1 outline-[#673ab7]'
                                                    : 'outline outline-offset-2 outline-1 outline-[#ccc]'
                                            } rounded-sm relative`}
                                            // onClick={() => handleChoose(index)}
                                            onMouseEnter={() => setHoverIndex(item.uuid)}
                                            onMouseLeave={() => setHoverIndex('')}
                                        >
                                            <Checkbox
                                                checked={chooseImageIndex.includes(item.uuid)}
                                                className="absolute z-50 right-[2px]"
                                                onChange={(e) => {
                                                    const value = e.target.checked;
                                                    handleChoose(item.uuid);
                                                }}
                                            />
                                            {styleData?.some((el: any) => item.uuid === el.uuid) && (
                                                <div className="text-xs text-[#673ab7] absolute left-1 top-1 z-50 bg-white px-1 rounded-md">
                                                    已添加
                                                </div>
                                            )}
                                            <Swiper
                                                spaceBetween={30}
                                                pagination={{
                                                    clickable: true
                                                }}
                                                modules={[Pagination]}
                                                autoplay
                                            >
                                                <div className="w-[145px] h-[200px] flex">
                                                    {item?.templateList?.map((v: any, vi: number) => (
                                                        <SwiperSlide className="relative group">
                                                            <Image.PreviewGroup
                                                                items={templateList?.[index]?.templateList?.map(
                                                                    (item: any) => item.example || ''
                                                                )}
                                                                preview={{
                                                                    visible: index === previewIndex?.index && vi === previewIndex?.vi,
                                                                    onVisibleChange: (visible) => {
                                                                        setPreviewIndex(null);
                                                                    }
                                                                }}
                                                            >
                                                                <Image
                                                                    style={{
                                                                        width: '100%'
                                                                    }}
                                                                    key={vi}
                                                                    height={200}
                                                                    width={150}
                                                                    preview={false}
                                                                    src={`${v.example}?x-oss-process=image/resize,w_150/quality,q_80`}
                                                                    placeholder={
                                                                        <div className="w-[145px] h-[200px] flex justify-center items-center">
                                                                            <Spin />
                                                                        </div>
                                                                    }
                                                                    fallback="data:image/png;base64,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"
                                                                />
                                                                {v?.openVideoMode && (
                                                                    <div
                                                                        style={{
                                                                            left: styleData?.some((el: any) => item.uuid === el.uuid)
                                                                                ? '56px'
                                                                                : '4px'
                                                                        }}
                                                                        className="text-xs text-[#673ab7] absolute top-1 z-50 bg-white px-1 rounded-md"
                                                                    >
                                                                        视频生成
                                                                    </div>
                                                                )}
                                                                {item?.saleConfig?.openSale && (
                                                                    <div className="absolute bottom-[calc(50%-13px)] right-[calc(50%-37px)] rounded-full bg-[#717476] text-white text-xs font-semibold flex items-center gap-1 px-2 py-1">
                                                                        <svg
                                                                            viewBox="0 0 1024 1024"
                                                                            version="1.1"
                                                                            xmlns="http://www.w3.org/2000/svg"
                                                                            p-id="11435"
                                                                            width="18"
                                                                            height="18"
                                                                        >
                                                                            <path
                                                                                d="M816.49 909H211.21c-1.1 0-2-0.9-2-2v-68.18c0-1.1 0.9-2 2-2h605.28c1.1 0 2 0.9 2 2V907c0 1.1-0.9 2-2 2z"
                                                                                fill="#FFAA22"
                                                                                p-id="11436"
                                                                            ></path>
                                                                            <path
                                                                                d="M910.24 316.23c-27.11 0-49.1 22.52-49.1 50.31 0 7.28 1.58 14.16 4.3 20.4l-176.13 80.21-147.2-258.57c14.56-8.73 24.46-24.74 24.46-43.28 0-27.79-21.98-50.31-49.1-50.31s-49.1 22.52-49.1 50.31c0 17.99 9.29 33.66 23.15 42.55l-158.16 259.3-176.13-80.21c2.71-6.25 4.3-13.12 4.3-20.4 0-27.78-21.98-50.31-49.1-50.31s-49.1 22.52-49.1 50.31c0 27.78 21.98 50.31 49.1 50.31 3.99 0 7.82-0.62 11.53-1.54l86.65 366.28h601.43l86.65-366.28c3.71 0.92 7.54 1.54 11.53 1.54 27.12 0 49.1-22.52 49.1-50.31 0.01-27.78-21.97-50.31-49.08-50.31z"
                                                                                fill="#FFD68D"
                                                                                p-id="11437"
                                                                            ></path>
                                                                        </svg>
                                                                        高级版
                                                                    </div>
                                                                )}
                                                                <div
                                                                    onClick={() => {
                                                                        // const remaining = useInfo?.allDetail?.rights?.find(
                                                                        //     (item: any) => item.type === 'TEMPLATE'
                                                                        // )?.remaining;
                                                                        // if (item?.saleConfig?.openSale&&remaining === 0) {
                                                                        //     setDemoId(item.saleConfig?.demoId);
                                                                        //     setPreviewOpen(true);
                                                                        // } else {
                                                                        setPreviewIndex({
                                                                            index,
                                                                            vi
                                                                        });
                                                                        // }
                                                                    }}
                                                                    className=" absolute top-0 left-0 w-full h-full bg-black/50 text-white hidden group-hover:block"
                                                                >
                                                                    <div className="w-full h-full flex justify-center items-center gap-1">
                                                                        <EyeOutlined />
                                                                        预览
                                                                    </div>
                                                                </div>
                                                            </Image.PreviewGroup>
                                                        </SwiperSlide>
                                                    ))}
                                                </div>
                                            </Swiper>
                                        </div>
                                    );
                                })}
                            </div>
                        </div>

                        {hasAddStyle && (
                            <div className="bg-white p-3 mt-2">
                                <div>
                                    <span className="text-stone-700 font-semibold">
                                        自定义图片风格
                                        <span className="text-xs text-black/50 ml-2">勾选想使用的图片模版</span>
                                    </span>
                                    <div className="grid gap-4 grid-cols-4 mt-3">
                                        {canAddCustomStyle && (
                                            <div
                                                className={`flex overflow-x-auto cursor-pointer w-full outline outline-offset-2 outline-1 outline-[#ccc] rounded-sm relative  h-[200px]`}
                                                onClick={() => {
                                                    setAddType(1);
                                                    setIsModalOpen(true);
                                                }}
                                            >
                                                <div className="flex flex-col justify-center items-center w-full h-[200px]">
                                                    <PlusOutlined
                                                        style={{
                                                            fontSize: '24px'
                                                        }}
                                                    />
                                                    <span className="mt-3">创建自定义图片风格</span>
                                                </div>
                                            </div>
                                        )}
                                        {customList?.map((item, index) => {
                                            return (
                                                <div
                                                    className={`flex overflow-x-auto cursor-pointer w-full ${
                                                        hoverIndex === item.uuid || chooseImageIndex.includes(item.uuid)
                                                            ? 'outline outline-offset-2 outline-1 outline-[#673ab7]'
                                                            : 'outline outline-offset-2 outline-1 outline-[#ccc]'
                                                    } rounded-sm relative`}
                                                    onMouseEnter={() => setHoverIndex(item.uuid)}
                                                    onMouseLeave={() => setHoverIndex('')}
                                                >
                                                    <Checkbox
                                                        checked={chooseImageIndex.includes(item.uuid)}
                                                        className="absolute z-50 right-[2px]"
                                                        onChange={(e) => {
                                                            const value = e.target.checked;
                                                            handleChoose(item.uuid);
                                                        }}
                                                    />
                                                    {/* <Popconfirm
                                                    <div className="flex flex-col justify-center items-center w-full h-[200px]">
                                                        <PlusOutlined
                                                            style={{
                                                                fontSize: '24px'
                                                            }}
                                                        />
                                                        <span className="mt-3">创建自定义风格</span>
                                                    </div>
                                                </div>
                                            )}
                                            {customList?.map((item, index) => {
                                                return (
                                                    <div
                                                        className={`flex overflow-x-auto cursor-pointer w-full ${
                                                            hoverIndex === item.uuid || chooseImageIndex.includes(item.uuid)
                                                                ? 'outline outline-offset-2 outline-1 outline-[#673ab7]'
                                                                : 'outline outline-offset-2 outline-1 outline-[#ccc]'
                                                        } rounded-sm relative`}
                                                        onMouseEnter={() => setHoverIndex(item.uuid)}
                                                        onMouseLeave={() => setHoverIndex('')}
                                                    >
                                                        <Checkbox
                                                            checked={chooseImageIndex.includes(item.uuid)}
                                                            className="absolute z-50 right-[2px]"
                                                            onChange={(e) => {
                                                                const value = e.target.checked;
                                                                handleChoose(item.uuid);
                                                            }}
                                                        />
                                                        {/* <Popconfirm
                                                        placement="top"
                                                        title={'确认删除'}
                                                        // description={description}
                                                        okText="是"
                                                        cancelText="否"
                                                        onConfirm={() => handleDel(index)}
                                                    >
                                                        <DeleteOutlined
                                                            
                                                            className="absolute z-50 py-[3px] left-[2px] text-red-600"
                                                        />
                                                    </Popconfirm> */}
                                                    <Swiper
                                                        spaceBetween={30}
                                                        pagination={{
                                                            clickable: true
                                                        }}
                                                        modules={[Pagination]}
                                                        autoplay
                                                    >
                                                        <div className="w-[145px] h-[200px] flex">
                                                            {selectImgs
                                                                ?.map((item: any) => item.templateList)
                                                                ?.flat()
                                                                ?.map((v: any, vi: number) => (
                                                                    <SwiperSlide>
                                                                        <Image.PreviewGroup
                                                                            items={templateList?.[index]?.templateList?.map(
                                                                                (item: any) => item.example
                                                                            )}
                                                                        >
                                                                            <Image
                                                                                style={{
                                                                                    width: '150px'
                                                                                }}
                                                                                width={150}
                                                                                key={vi}
                                                                                height={200}
                                                                                src={`${v.example}?x-oss-process=image/resize,w_150/quality,q_80`}
                                                                                placeholder={
                                                                                    <div className="w-[145px] h-[200px] flex justify-center items-center">
                                                                                        <Spin />
                                                                                    </div>
                                                                                }
                                                                                fallback="data:image/png;base64,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"
                                                                            />
                                                                        </Image.PreviewGroup>
                                                                    </SwiperSlide>
                                                                ))}
                                                        </div>
                                                    </Swiper>
                                                </div>
                                            );
                                        })}
                                    </div>
                                </div>
                            </div>
                        )}
                    </div>
                    {/* </Spin> */}
                </Drawer>
                {isModalOpen && (
                    <Modal
                        width={'60%'}
                        open={isModalOpen}
                        zIndex={1001}
                        onCancel={handleCancel}
                        footer={
                            <div>
                                <Space>
                                    <Button onClick={() => handleCancel()}>取消</Button>
                                    <Button type="primary" disabled={!switchCheck} onClick={() => handleOk()}>
                                        确定
                                    </Button>
                                </Space>
                            </div>
                        }
                    >
                        <div className="flex justify-between mt-6">
                            <FormControl color="secondary" size="small">
                                <TextField
                                    disabled={!switchCheck}
                                    size="small"
                                    color="secondary"
                                    label="风格名称"
                                    variant="outlined"
                                    value={currentStyle?.name}
                                    onChange={(e) => {
                                        let value = e.target.value;
                                        setCurrentStyle((pre: any) => ({
                                            ...pre,
                                            name: value
                                        }));
                                    }}
                                />
                            </FormControl>
                            {/* <div className="flex justify-center">
                                <span className="mr-2">开启编辑</span>
                                <Tooltip
                                    title={
                                        <div>
                                            <div>开启编辑后，会从系统模版复制一份进行编辑，并且不再与系统模版同步配置</div>
                                            <div>开启编辑后，如需继续使用系统模版，请删除后重新选择模版</div>
                                        </div>
                                    }
                                >
                                    <Switch
                                        // 非系统不可编辑
                                        disabled={!currentStyleRef?.current?.system}
                                        checked={switchCheck}
                                        onChange={(checked) => {
                                            setSwitchCheck(checked);
                                            setCurrentStyle((pre: any) => ({
                                                ...pre,
                                                system: !checked
                                            }));
                                        }}
                                    />
                                </Tooltip>
                            </div> */}
                        </div>

                        <StyleTabs
                            schemaList={[]}
                            imageStyleData={currentStyle?.templateList || []}
                            typeList={[]}
                            materialStatus={materialStatus}
                            appData={{
                                appUid,
                                appReqVO: details,
                                materialType
                            }}
                            canEdit={!switchCheck}
                            setDetailData={(data: any) => {
                                const copyCurrentStyle = { ...currentStyle };
                                copyCurrentStyle.templateList = data;
                                setCurrentStyle(copyCurrentStyle);
                            }}
                        />
                    </Modal>
                )}
                {systemOPen && (
                    <Modal
                        width={'80%'}
                        open={systemOPen}
                        title="系统图片模版配置"
                        onCancel={() => {
                            setSystemOPen(false);
                            setSyszanVariable([]);
                        }}
                        footer={false}
                    >
                        <div className="relative mt-[30px]">
                            <Button
                                className="w-[100px] absolute right-[10px]"
                                type="primary"
                                onClick={() => {
                                    setSystemVariable(_.cloneDeep(syszanVariable));
                                    setTimeout(() => {
                                        saveTemplate && saveTemplate();
                                    }, 0);
                                    setSystemOPen(false);
                                }}
                            >
                                保存
                            </Button>

                            <CreateTab
                                materialStatus={materialStatus}
                                appData={{ materialType, appReqVO: details }}
                                imageStyleData={syszanVariable}
                                setImageStyleData={(data) => {
                                    setSyszanVariable(data);
                                }}
                                focuActive={focuActive}
                                setFocuActive={setFocuActive}
                                digui={() => {
                                    const newData = syszanVariable?.map((i: any) => i.name.split(' ')[1]);
                                    if (!newData || newData?.every((i: any) => !i)) {
                                        return 1;
                                    }
                                    return newData?.map((i: any) => Number(i))?.sort((a: any, b: any) => b - a)[0] * 1 + 1;
                                }}
                            />
                        </div>
                    </Modal>
                )}
                {previewOpen && <Preview demoId={demoId} open={previewOpen} setOpen={setPreviewOpen} />}
            </div>
        );
    }
);

export default AddStyle;
