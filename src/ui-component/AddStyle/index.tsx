import { SearchOutlined } from '@mui/icons-material';
import { Button, Card, Divider, Image, Dropdown, Space, Drawer, Collapse, Modal, Switch, message } from 'antd';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import { useEffect, useImperativeHandle, useRef, useState } from 'react';
import { FormControl, InputLabel, MenuItem, InputAdornment, IconButton, Select } from '@mui/material';
import InfoIcon from '@mui/icons-material/Info';
import ClearIcon from '@mui/icons-material/Clear';
import React from 'react';
import StyleTabs from '../../views/pages/copywriting/components/styleTabs';
import _ from 'lodash-es';

const AddStyle = React.forwardRef(({ record, details, appUid, mode = 1 }: any, ref: any) => {
    console.log(record, 'record');
    const [visible, setVisible] = useState(false);
    const [styleData, setStyleData] = useState<any>([]);
    const [selectImgs, setSelectImgs] = useState<any>(null);

    const [query, setQuery] = useState<any | null>(null);
    const [hoverIndex, setHoverIndex] = useState<any>('');
    const [chooseImageIndex, setChooseImageIndex] = useState<any>('');
    const [type, setType] = useState<any>();
    const [editIndex, setEditIndex] = useState<any>('');
    const [templateList, setTemplateList] = useState<any[]>([]);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [currentStyle, setCurrentStyle] = useState<any>(null);
    const [switchCheck, setSwitchCheck] = useState(false);

    const collapseIndexRef: any = useRef(null);
    const templateRef: any = useRef(null);

    const submitData = React.useMemo(() => {
        const copyRecord = _.cloneDeep(record);
        copyRecord.variable.variables.forEach((item: any) => {
            if (item.field === 'POSTER_STYLE_CONFIG') {
                item.value = styleData;
            }
        });
        return copyRecord;
    }, [styleData, record]);

    console.log('🚀 ~ AddStyle ~ currentStyle:', currentStyle);
    useEffect(() => {
        console.log(currentStyle, 'currentStyle');
        if (currentStyle?.system) {
            // true
        } else {
            //false
        }
    }, [currentStyle]);

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

            console.log(list, 'list');
            const typeList = list.map((item: any) => ({ ...item, type: 1 }));
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
            const filterList = templateRef.current.filter((item: any) => item.templateList.length >= query?.picNum || 0);
            setTemplateList(filterList);
        }
    }, [query]);

    const handleChoose = (index: number) => {
        setChooseImageIndex(index);
        const list: any = templateList[index];
        setSelectImgs(list);
    };

    const items: any = [
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
                        const copyStyleData = [...styleData];
                        copyStyleData.splice(index + 1, 0, { ...copyStyleData[index], name: `${copyStyleData[index].name}_复制` });
                        setStyleData(copyStyleData);
                    }}
                >
                    复制
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
                <div className="flex justify-between">
                    <span>{item.name}</span>
                    <div className="flex justify-center">
                        <span>共{item?.templateList?.length || 0}张图片</span>
                        {mode === 1 && (
                            <Dropdown menu={{ items }} placement="bottom" arrow trigger={['click']}>
                                <span
                                    onClick={(e) => {
                                        collapseIndexRef.current = index;
                                        e.stopPropagation();
                                    }}
                                >
                                    <MoreVertIcon className="cursor-pointer" />
                                </span>
                            </Dropdown>
                        )}
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
                                <div className="w-[160px] h-[200px]">
                                    <Image width={160} height={200} src={item.example} />
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
                            选择风格模版
                        </Button>
                        <div
                            className="flex justify-center items-center cursor-pointer"
                            onClick={() => {
                                setCurrentStyle(item);
                                setIsModalOpen(true);
                            }}
                        >
                            <span>点击放大编辑</span>
                            <SearchOutlined />
                        </div>
                    </div>
                </div>
            )
        }));
    }, [styleData]);

    const handleCancel = () => {
        setIsModalOpen(false);
    };

    const handleOk = () => {
        const copyStyleData = _.cloneDeep(styleData);
        copyStyleData.forEach((item: any, index: number) => {
            if (item.id === currentStyle.id) {
                copyStyleData[index] = currentStyle;
            }
        });
        setStyleData(copyStyleData);
        setIsModalOpen(false);
    };

    return (
        <div>
            {mode === 1 && (
                <div className="pb-3">
                    <Button size="small" type="primary" onClick={() => handleAdd()}>
                        增加风格
                    </Button>
                </div>
            )}
            <div>
                <Collapse items={collapseList} defaultActiveKey={[0]} />
            </div>
            <Drawer
                title="选择风格模版"
                onClose={() => {
                    setVisible(false);
                    setSelectImgs(null);
                    setChooseImageIndex('');
                }}
                open={visible}
                width={500}
                footer={
                    <div className="flex justify-between">
                        <div className="flex items-center">
                            <p>选择模版：</p>
                            <div className="max-w-[260px] overflow-x-auto">
                                {selectImgs?.templateList?.map((item: any, index: number) => (
                                    <Image preview={false} width={32} height={40} src={item.example} />
                                ))}
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
                <div className="grid grid-cols-3 gap-3">
                    <FormControl key={query?.picNum} color="secondary" size="small" fullWidth>
                        <InputLabel id="types">图片数量</InputLabel>
                        <Select
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
                        </Select>
                    </FormControl>
                </div>
                <div>
                    <div className="flex items-center mt-1">
                        <InfoIcon
                            style={{
                                fontSize: '12px'
                            }}
                        />
                        <p className="text-xs">系统根据您的创作笔记类型，为您找到了{templateList?.length || 0}款风格模版供您选择</p>
                    </div>
                    <div className="mt-3">
                        {templateList?.map((item, index) => {
                            return (
                                <div className="mt-3">
                                    <span>{item.name}</span>
                                    <div
                                        className={`flex overflow-x-auto cursor-pointer ${
                                            hoverIndex === index || chooseImageIndex === index
                                                ? 'outline outline-offset-2 outline-1 outline-[#673ab7]'
                                                : 'outline outline-offset-2 outline-1 outline-[#ccc]'
                                        } rounded-sm my-3`}
                                        onClick={() => handleChoose(index)}
                                        onMouseEnter={() => setHoverIndex(index)}
                                        onMouseLeave={() => setHoverIndex('')}
                                    >
                                        {item?.templateList?.map((v: any, vi: number) => (
                                            <img key={vi} width={145} height={200} src={v.example} />
                                        ))}
                                    </div>
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
                <div className="flex justify-between mt-5">
                    <span className="text-base">{currentStyle?.name}</span>
                    <div className="flex justify-center">
                        <span className="mr-2">开启编辑</span>
                        <Switch
                            checked={switchCheck}
                            onChange={(checked) => {
                                setSwitchCheck(checked);
                            }}
                        />
                    </div>
                </div>

                <StyleTabs
                    schemaList={[]}
                    imageStyleData={currentStyle?.templateList}
                    typeList={[]}
                    appData={{
                        appUid,
                        appReqVO: details,
                        materialType: ''
                    }}
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
