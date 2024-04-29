import { Button, Divider, Image, Dropdown, Space, Drawer, Collapse, Modal, Switch, message, Tooltip, Spin, Checkbox } from 'antd';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import { useEffect, useImperativeHandle, useRef, useState } from 'react';
import { FormControl, InputLabel, MenuItem, InputAdornment, IconButton, TextField } from '@mui/material';
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
import { Navigation, Pagination, Mousewheel, Keyboard } from 'swiper';
import { appModify } from 'api/template';

const AddStyle = React.forwardRef(({ record, details, appUid, mode = 1, materialType }: any, ref: any) => {
    const [visible, setVisible] = useState(false);
    const [styleData, setStyleData] = useState<any>([]);
    const [selectImgs, setSelectImgs] = useState<any>(null);

    const [query, setQuery] = useState<any | null>({
        picNum: ''
    });
    const [hoverIndex, setHoverIndex] = useState<any>('');
    const [chooseImageIndex, setChooseImageIndex] = useState<any>('');
    const [type, setType] = useState<any>();
    const [editIndex, setEditIndex] = useState<any>('');
    const [templateList, setTemplateList] = useState<any[]>([]);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [currentStyle, setCurrentStyle] = useState<any>(null);
    const [switchCheck, setSwitchCheck] = useState(false);
    const [updIndex, setUpdIndex] = useState<any>('');
    const [previewShow, setPreviewShow] = useState(false);
    const [addType, setAddType] = useState(0);

    const currentStyleRef: any = useRef(null);
    const collapseIndexRef: any = useRef(null);
    const templateRef: any = useRef(null);

    const submitData = React.useMemo(() => {
        const copyRecord = _.cloneDeep(record);
        copyRecord.variable.variables.forEach((item: any) => {
            // addType
            if (addType === 1) {
            } else {
                // 风格产生===2 -> POSTER_STYLE
                if (mode === 1) {
                    if (item.field === 'POSTER_STYLE_CONFIG') {
                        item.value = styleData;
                    }
                } else {
                    if (item.field === 'POSTER_STYLE') {
                        item.value = JSON.stringify(styleData?.[0] || {});
                    }
                }
            }
        });
        return copyRecord;
    }, [styleData, record]);

    useEffect(() => {
        // 系统的初始化为关闭
        if (currentStyle?.system) {
            setSwitchCheck(false);
        } else {
            // 自定义的只能是开启 不能关闭
            setSwitchCheck(true);
        }
    }, [currentStyle?.system]);

    useImperativeHandle(ref, () => ({
        record: submitData
    }));

    useEffect(() => {
        if (record) {
            const tempList =
                record?.flowStep?.variable.variables.find((item: any) => item.field === 'SYSTEM_POSTER_STYLE_CONFIG')?.value || [];
            const sysTempList = tempList.filter((item: any) => item.system);
            setTemplateList(sysTempList);
            templateRef.current = tempList;
        }
    }, [record]);

    React.useEffect(() => {
        if (record) {
            let list: any = [];
            if (mode === 2) {
                const value = record.variable.variables.find((item: any) => item.field === 'POSTER_STYLE')?.value;
                if (value) {
                    list = [JSON.parse(value)];
                }
            } else {
                list = record.variable.variables.find((item: any) => item.field === 'POSTER_STYLE_CONFIG')?.value || [];
            }

            const typeList = list?.map((item: any) => ({ ...item, type: 1 }));
            setStyleData(typeList);
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
        setChooseImageIndex(index);
        const list: any = templateList[index];
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
                              }}
                          >
                              编辑
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
                  },
                  {
                      key: '2',
                      label: (
                          <span
                              onClick={(e) => {
                                  e.stopPropagation();
                                  const index: any = collapseIndexRef.current;
                                  let copyStyleData = [...styleData];
                                  copyStyleData = [
                                      ...copyStyleData,
                                      { ...copyStyleData[index], name: `${copyStyleData[index].name}_复制` }
                                  ];
                                  setStyleData(copyStyleData);
                              }}
                          >
                              复制
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
                              }}
                          >
                              编辑
                          </span>
                      )
                  }
              ];

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
            setStyleData([
                ...styleData,
                {
                    ...selectImgs
                }
            ]);
        }
        if (type === 1) {
            styleData[editIndex] = selectImgs;
            setStyleData([...styleData]);
        }
        setVisible(false);
        setSelectImgs(null);
        setChooseImageIndex('');
    };

    const collapseList = React.useMemo(() => {
        return styleData.map((item: any, index: number) => ({
            key: index,
            label: (
                <div className="flex justify-between h-[22px]">
                    <span>{item.name}</span>
                    <div className="flex justify-center">
                        <span>共{item?.templateList?.length || 0}张图片</span>
                        <Dropdown menu={{ items }} placement="bottom" arrow>
                            <span
                                onClick={(e) => {
                                    collapseIndexRef.current = index;
                                    e.stopPropagation();
                                }}
                            >
                                <MoreVertIcon className="cursor-pointer" />
                            </span>
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
                                        src={`${item.example}?x-oss-process=image/resize,w_300/quality,q_80`}
                                        fallback="data:image/png;base64,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"
                                        placeholder={
                                            <div className="w-[160px] h-[200px] flex justify-center items-center">
                                                <Spin />
                                            </div>
                                        }
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
                        {/* <div
                            className="flex justify-center items-center cursor-pointer"
                            onClick={() => {
                                setCurrentStyle(item);
                                currentStyleRef.current = item;
                                setIsModalOpen(true);
                                setUpdIndex(index);
                            }}
                        >
                            <span>点击放大编辑</span>
                            <SearchOutlined />
                        </div> */}
                    </div>
                </div>
            )
        }));
    }, [styleData]);

    const handleCancel = () => {
        setUpdIndex('');
        setAddType(0);
        setIsModalOpen(false);
    };

    // 根据Index 来判断
    const handleOk = () => {
        // 新增
        if (addType === 1) {
            const copyRecord = _.cloneDeep(record);
            const copyDetails = _.cloneDeep(details);

            const indexList = copyRecord.flowStep.variable.variables
                .find((item: any) => item.field === 'SYSTEM_POSTER_STYLE_CONFIG')
                .value.map((item: any) => item.index)
                .filter((item: any) => typeof item === 'number')
                .filter(Boolean);

            const index = Math.max(...indexList);
            copyRecord.flowStep.variable.variables.forEach((item: any) => {
                if (item.field === 'SYSTEM_POSTER_STYLE_CONFIG') {
                    item.value = [
                        ...item.value,
                        {
                            ...currentStyle,
                            enable: true,
                            index: index + 1,
                            system: true,
                            totalImageCount: 0,
                            uuid: uuidv4()?.split('-')?.join('')
                        }
                    ];
                }
            });

            copyDetails.workflowConfig.steps.forEach((item: any) => {
                if (item.flowStep.handler === 'PosterActionHandler') {
                    // 将该步骤的属性值更改为 copyRecord 的值
                    Object.assign(item, copyRecord);
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

            appModify(copyDetails).then((res: any) => {
                console.log(res, 'res');
            });
        }

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
    };

    const onCheckboxChange = (e: any, index: number) => {
        // console.log(`checked = ${e.target.checked}`);
        setChooseImageIndex(index);
        const list: any = templateList[index];
        setSelectImgs(list);
    };

    return (
        <div className="addStyle">
            {mode === 1 && (
                <div className="pb-3 flex">
                    <Button size="small" type="primary" onClick={() => handleAdd()}>
                        增加风格
                    </Button>
                    <div className="ml-3 flex items-center justify-center">
                        <InfoIcon
                            style={{
                                fontSize: '12px'
                            }}
                        />
                        <span>生成图片时会按照风格模板的顺序去使用</span>
                    </div>
                </div>
            )}
            <div>
                <Collapse items={collapseList} defaultActiveKey={[0]} />
            </div>
            <Drawer
                // zIndex={99999}
                title="选择风格模版"
                // mask={false}
                // maskClosable={false}
                onClose={() => {
                    setVisible(false);
                    setSelectImgs(null);
                    setChooseImageIndex('');
                }}
                bodyStyle={{
                    background: 'rgb(244, 246, 248)'
                }}
                open={visible}
                placement={'left'}
                width={680}
                footer={
                    <div className="flex justify-between">
                        <div className="flex items-center">
                            <p>选择模版：</p>
                            <div className="max-w-[260px] overflow-x-auto whitespace-nowrap">
                                <Space>
                                    {selectImgs?.templateList?.map((item: any, index: number) => (
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
                                        setSelectImgs(null);
                                        setChooseImageIndex('');
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
                <div className="grid grid-cols-3 gap-3 bg-[rgb(244, 246, 248)]">
                    {/* <FormControl key={query?.picNum} color="secondary" size="small" fullWidth>
                        <InputLabel id="types">图片数量</InputLabel> */}
                    {/* <Select
                            value={query?.picNum}
                            onChange={(e: any) => handleQuery({ label: 'picNum', value: e.target.value })}
                            endAdornment={
                                query?.picNum && (
                                    <InputAdornment className="mr-[10px]" position="end">
                                        <IconButton
                                            size="small"
                                            onClick={() => {
                                                handleQuery({ label: 'picNum', value: '' });
                                            }}
                                        >
                                            <ClearIcon
                                                style={{
                                                    fontSize: '14px'
                                                }}
                                            />
                                        </IconButton>
                                    </InputAdornment>
                                )
                            }
                            labelId="types"
                            label="图片数量"
                        >
                            <MenuItem value={1}>1</MenuItem>
                            <MenuItem value={2}>2</MenuItem>
                            <MenuItem value={3}>3</MenuItem>
                            <MenuItem value={4}>4</MenuItem>
                            <MenuItem value={5}>5</MenuItem>
                            <MenuItem value={6}>6</MenuItem>
                        </Select> */}
                    {/* </FormControl> */}
                    {/* <Select
                        allowClear
                        placeholder={'图片数量'}
                        value={query?.picNum}
                        onChange={(value) => handleQuery({ label: 'picNum', value })}
                        options={[
                            {
                                value: '',
                                label: '所有'
                            },
                            {
                                value: 1,
                                label: '1'
                            },
                            {
                                value: 2,
                                label: '2'
                            },
                            {
                                value: 3,
                                label: '3'
                            },
                            {
                                value: 4,
                                label: '4'
                            },
                            {
                                value: 5,
                                label: '5'
                            },
                            {
                                value: 6,
                                label: '6'
                            }
                        ]}
                    /> */}
                </div>
                <div className="flex justify-between bg-[#fff] mb-3 p-2">
                    <div className="flex items-center mt-1">
                        <InfoIcon
                            style={{
                                fontSize: '12px'
                            }}
                        />
                        <p className="text-xs">系统根据您的创作笔记类型，为您找到了{templateList?.length || 0}款风格模版供您选择</p>
                    </div>
                    <div>
                        <Button
                            onClick={() => {
                                setAddType(1);
                                setIsModalOpen(true);
                            }}
                        >
                            创建自定义风格
                        </Button>
                    </div>
                </div>
                <div className="bg-white p-6 h-[94%]">
                    <div className="grid gap-4 grid-cols-4 mt-3">
                        {templateList?.map((item, index) => {
                            return (
                                <div
                                    className={`flex overflow-x-auto cursor-pointer w-full ${
                                        hoverIndex === index || chooseImageIndex === index
                                            ? 'outline outline-offset-2 outline-1 outline-[#673ab7]'
                                            : 'outline outline-offset-2 outline-1 outline-[#ccc]'
                                    } rounded-sm relative`}
                                    // onClick={() => handleChoose(index)}
                                    onMouseEnter={() => setHoverIndex(index)}
                                    onMouseLeave={() => setHoverIndex('')}
                                >
                                    <Checkbox
                                        checked={index === chooseImageIndex}
                                        className="absolute z-50 right-[2px]"
                                        onChange={(e) => {
                                            const value = e.target.checked;
                                            if (value) {
                                                handleChoose(index);
                                            } else {
                                                handleChoose(-1);
                                            }
                                        }}
                                    />
                                    <Swiper
                                        spaceBetween={30}
                                        pagination={{
                                            clickable: true
                                        }}
                                        modules={[Pagination]}
                                        autoplay
                                    >
                                        <Image.PreviewGroup
                                            items={templateList?.[index]?.templateList?.map((item: any) => ({ src: item.example }))}
                                            preview={{
                                                onChange: (current, prev) => console.log(`current index: ${current}, prev index: ${prev}`),
                                                visible: previewShow,
                                                onVisibleChange: (visible) => {
                                                    setPreviewShow(visible);
                                                }
                                            }}
                                        >
                                            <div className="w-[145px] h-[200px] flex">
                                                {item?.templateList?.map((v: any, vi: number) => (
                                                    <SwiperSlide>
                                                        <Image
                                                            style={{
                                                                width: '145px'
                                                            }}
                                                            key={vi}
                                                            width={145}
                                                            height={200}
                                                            src={`${v.example}?x-oss-process=image/resize,w_300/quality,q_80`}
                                                            preview={false}
                                                            placeholder={
                                                                <div className="w-[145px] h-[200px] flex justify-center items-center">
                                                                    <Spin />
                                                                </div>
                                                            }
                                                            fallback="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAMIAAADDCAYAAADQvc6UAAABRWlDQ1BJQ0MgUHJvZmlsZQAAKJFjYGASSSwoyGFhYGDIzSspCnJ3UoiIjFJgf8LAwSDCIMogwMCcmFxc4BgQ4ANUwgCjUcG3awyMIPqyLsis7PPOq3QdDFcvjV3jOD1boQVTPQrgSkktTgbSf4A4LbmgqISBgTEFyFYuLykAsTuAbJEioKOA7DkgdjqEvQHEToKwj4DVhAQ5A9k3gGyB5IxEoBmML4BsnSQk8XQkNtReEOBxcfXxUQg1Mjc0dyHgXNJBSWpFCYh2zi+oLMpMzyhRcASGUqqCZ16yno6CkYGRAQMDKMwhqj/fAIcloxgHQqxAjIHBEugw5sUIsSQpBobtQPdLciLEVJYzMPBHMDBsayhILEqEO4DxG0txmrERhM29nYGBddr//5/DGRjYNRkY/l7////39v///y4Dmn+LgeHANwDrkl1AuO+pmgAAADhlWElmTU0AKgAAAAgAAYdpAAQAAAABAAAAGgAAAAAAAqACAAQAAAABAAAAwqADAAQAAAABAAAAwwAAAAD9b/HnAAAHlklEQVR4Ae3dP3PTWBSGcbGzM6GCKqlIBRV0dHRJFarQ0eUT8LH4BnRU0NHR0UEFVdIlFRV7TzRksomPY8uykTk/zewQfKw/9znv4yvJynLv4uLiV2dBoDiBf4qP3/ARuCRABEFAoBEgghggQAQZQKAnYEaQBAQaASKIAQJEkAEEegJmBElAoBEgghggQAQZQKAnYEaQBAQaASKIAQJEkAEEegJmBElAoBEgghggQAQZQKAnYEaQBAQaASKIAQJEkAEEegJmBElAoBEgghggQAQZQKAnYEaQBAQaASKIAQJEkAEEegJmBElAoBEgghggQAQZQKAnYEaQBAQaASKIAQJEkAEEegJmBElAoBEgghggQAQZQKAnYEaQBAQaASKIAQJEkAEEegJmBElAoBEgghggQAQZQKAnYEaQBAQaASKIAQJEkAEEegJmBElAoBEgghggQAQZQKAnYEaQBAQaASKIAQJEkAEEegJmBElAoBEgghggQAQZQKAnYEaQBAQaASKIAQJEkAEEegJmBElAoBEgghggQAQZQKAnYEaQBAQaASKIAQJEkAEEegJmBElAoBEgghggQAQZQKAnYEaQBAQaASKIAQJEkAEEegJmBElAoBEgghggQAQZQKAnYEaQBAQaASKIAQJEkAEEegJmBElAoBEgghgg0Aj8i0JO4OzsrPv69Wv+hi2qPHr0qNvf39+iI97soRIh4f3z58/u7du3SXX7Xt7Z2enevHmzfQe+oSN2apSAPj09TSrb+XKI/f379+08+A0cNRE2ANkupk+ACNPvkSPcAAEibACyXUyfABGm3yNHuAECRNgAZLuYPgEirKlHu7u7XdyytGwHAd8jjNyng4OD7vnz51dbPT8/7z58+NB9+/bt6jU/TI+AGWHEnrx48eJ/EsSmHzx40L18+fLyzxF3ZVMjEyDCiEDjMYZZS5wiPXnyZFbJaxMhQIQRGzHvWR7XCyOCXsOmiDAi1HmPMMQjDpbpEiDCiL358eNHurW/5SnWdIBbXiDCiA38/Pnzrce2YyZ4//59F3ePLNMl4PbpiL2J0L979+7yDtHDhw8vtzzvdGnEXdvUigSIsCLAWavHp/+qM0BcXMd/q25n1vF57TYBp0a3mUzilePj4+7k5KSLb6gt6ydAhPUzXnoPR0dHl79WGTNCfBnn1uvSCJdegQhLI1vvCk+fPu2ePXt2tZOYEV6/fn31dz+shwAR1sP1cqvLntbEN9MxA9xcYjsxS1jWR4AIa2Ibzx0tc44fYX/16lV6NDFLXH+YL32jwiACRBiEbf5KcXoTIsQSpzXx4N28Ja4BQoK7rgXiydbHjx/P25TaQAJEGAguWy0+2Q8PD6/Ki4R8EVl+bzBOnZY95fq9rj9zAkTI2SxdidBHqG9+skdw43borCXO/ZcJdraPWdv22uIEiLA4q7nvvCug8WTqzQveOH26fodo7g6uFe/a17W3+nFBAkRYENRdb1vkkz1CH9cPsVy/jrhr27PqMYvENYNlHAIesRiBYwRy0V+8iXP8+/fvX11Mr7L7ECueb/r48eMqm7FuI2BGWDEG8cm+7G3NEOfmdcTQw4h9/55lhm7DekRYKQPZF2ArbXTAyu4kDYB2YxUzwg0gi/41ztHnfQG26HbGel/crVrm7tNY+/1btkOEAZ2M05r4FB7r9GbAIdxaZYrHdOsgJ/wCEQY0J74TmOKnbxxT9n3FgGGWWsVdowHtjt9Nnvf7yQM2aZU/TIAIAxrw6dOnAWtZZcoEnBpNuTuObWMEiLAx1HY0ZQJEmHJ3HNvGCBBhY6jtaMoEiJB0Z29vL6ls58vxPcO8/zfrdo5qvKO+d3Fx8Wu8zf1dW4p/cPzLly/dtv9Ts/EbcvGAHhHyfBIhZ6NSiIBTo0LNNtScABFyNiqFCBChULMNNSdAhJyNSiECRCjUbEPNCRAhZ6NSiAARCjXbUHMCRMjZqBQiQIRCzTbUnAARcjYqhQgQoVCzDTUnQIScjUohAkQo1GxDzQkQIWejUogAEQo121BzAkTI2agUIkCEQs021JwAEXI2KoUIEKFQsw01J0CEnI1KIQJEKNRsQ80JECFno1KIABEKNdtQcwJEyNmoFCJAhELNNtScABFyNiqFCBChULMNNSdAhJyNSiECRCjUbEPNCRAhZ6NSiAARCjXbUHMCRMjZqBQiQIRCzTbUnAARcjYqhQgQoVCzDTUnQIScjUohAkQo1GxDzQkQIWejUogAEQo121BzAkTI2agUIkCEQs021JwAEXI2KoUIEKFQsw01J0CEnI1KIQJEKNRsQ80JECFno1KIABEKNdtQcwJEyNmoFCJAhELNNtScABFyNiqFCBChULMNNSdAhJyNSiECRCjUbEPNCRAhZ6NSiAARCjXbUHMCRMjZqBQiQIRCzTbUnAARcjYqhQgQoVCzDTUnQIScjUohAkQo1GxDzQkQIWejUogAEQo121BzAkTI2agUIkCEQs021JwAEXI2KoUIEKFQsw01J0CEnI1KIQJEKNRsQ80JECFno1KIABEKNdtQcwJEyNmoFCJAhELNNtScABFyNiqFCBChULMNNSdAhJyNSiEC/wGgKKC4YMA4TAAAAABJRU5ErkJggg=="
                                                        />
                                                    </SwiperSlide>
                                                ))}
                                            </div>
                                        </Image.PreviewGroup>
                                    </Swiper>
                                </div>
                            );
                        })}
                    </div>
                </div>
            </Drawer>
            <Modal
                width={'60%'}
                open={isModalOpen}
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
                    <div className="flex justify-center">
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
                    </div>
                </div>

                <StyleTabs
                    schemaList={[]}
                    imageStyleData={currentStyle?.templateList || []}
                    typeList={[]}
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
        </div>
    );
});

export default AddStyle;
