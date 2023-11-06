import React, { useState, useRef, useEffect } from 'react';
import { Button, message, Steps, Upload, UploadProps, Carousel, Row, Col, Tabs, Tooltip } from 'antd';
import { FormControl, InputLabel, Select, MenuItem, Divider } from '@mui/material';
import type { UploadFile } from 'antd/es/upload/interface';
import { PlusOutlined, SubnodeOutlined } from '@ant-design/icons';
import { getAccessToken } from 'utils/auth';
import EditStyle from './components/editStyle';
import _ from 'lodash-es';
import Form from './components/form';
import { listMarketAppOption, xhsApp, imageTemplates } from 'api/template';
import { ThreeStep } from './components/threeStep';
import { dispatch } from 'store';
import { openSnackbar } from 'store/slices/snackbar';
const SmallRedBook = () => {
    const { TabPane } = Tabs;
    const [fileList, setFileList] = useState<UploadFile[]>([]);
    const props: UploadProps = {
        name: 'image',
        multiple: true,
        listType: 'picture-card',
        showUploadList: {
            showPreviewIcon: true,
            showRemoveIcon: false,
            previewIcon: (
                <Tooltip placement="top" title={'添加到风格里边'}>
                    <SubnodeOutlined className="!text-[#fff] text-5xl " rev={undefined} />
                </Tooltip>
            )
        },
        fileList,
        action: `${process.env.REACT_APP_BASE_URL}${process.env.REACT_APP_API_URL}/llm/image/upload`,
        headers: {
            Authorization: 'Bearer ' + getAccessToken()
        },
        maxCount: 20,
        onChange(info) {
            setFileList(info.fileList);
        },
        onDrop(e) {
            console.log('Dropped files', e.dataTransfer.files);
        },
        onPreview(e) {
            const newData = _.cloneDeep(tabImage);
            if (e?.response?.data?.url) {
                if (!newData[activeKey]) {
                    setTabImage({
                        ...newData,
                        [activeKey]: [e?.response?.data?.url]
                    });
                } else {
                    if (!newData[activeKey].some((item: any) => item === e?.response?.data?.url)) {
                        newData[activeKey].push(e?.response?.data?.url);
                        setTabImage(newData);
                    }
                }
            }
        }
    };
    //类型下拉框
    const [styles, setStyles] = useState('');
    //类型下拉框列表
    const [styleList, setStyleList] = useState<any[]>([]);
    //跟觉类型获取详情
    const [detaData, setDetaData] = useState<any>(null);
    const changeDetail = (data: any) => {
        const newData = _.cloneDeep(detaData);
        newData.variables[data.index].value = data.value;
        setDetaData(newData);
    };
    const getList = async () => {
        imageTemplates().then((res) => {
            setTypeList(res);
        });
        const result = await listMarketAppOption({ tagType: 'XIAO_HONG_SHU_WRITING' });
        if (result) {
            setStyles(result[0].value);
            setStyleList(result);
            const res = await xhsApp(result[0].value);
            setDetaData(res);
        }
    };
    useEffect(() => {
        getList();
    }, []);

    //存储图片的地址
    const [tabImage, setTabImage] = useState<any>({});
    //删除存储的图片
    const detailImage = (label: string, index: number) => {
        const newData = _.cloneDeep(tabImage);
        newData[label].splice(index, 1);
        setTabImage(newData);
    };
    //步骤
    const [current, setCurrent] = useState(0);
    //改变值
    const changeImages = (data: any) => {
        const newData = _.cloneDeep(consList);
        newData[items.findIndex((item: any) => item.key === activeKey)][data.field] = data.value;
        if (data.flag) {
            newData[items.findIndex((item: any) => item.key === activeKey)].TITLE = undefined;
            newData[items.findIndex((item: any) => item.key === activeKey)].SUB_TITLE = undefined;
        }
        setConsList(newData);
    };
    //风格列表 Item
    const [typeList, setTypeList] = useState<any>(null);
    //Tabs 选中的值
    const [activeKey, setActiveKey] = useState('one');
    //Tabs 子项
    const [items, setItems] = useState<any>([
        { label: '头图', closable: false, key: 'one' },
        { label: '图片 1', key: 'two' }
    ]);
    const newTabIndex = useRef(0);
    const onChange = (newActiveKey: string) => {
        setActiveKey(newActiveKey);
    };
    const onEdit = (targetKey: React.MouseEvent | React.KeyboardEvent | string, action: 'add' | 'remove') => {
        if (action === 'add') {
            add();
        } else {
            remove(targetKey);
        }
    };
    const add = () => {
        const newActiveKey = `newTab${newTabIndex.current++}`;
        const newPanes = [...items];
        newPanes.push({
            label: '图片 ' + newPanes.length,
            key: newActiveKey
        });
        const newValue = _.cloneDeep(consList);
        newValue.push({ key: newActiveKey });
        setConsList(newValue);
        setItems(newPanes);
        setActiveKey(newActiveKey);
    };
    const remove = (targetKey: any) => {
        let newActiveKey = activeKey;
        let lastIndex = -1;
        items.forEach((item: any, i: number) => {
            if (item.key === targetKey) {
                lastIndex = i - 1;
            }
        });
        const newPanes = items.filter((item: any) => item.key !== targetKey);
        if (newPanes.length && newActiveKey === targetKey) {
            if (lastIndex >= 0) {
                newActiveKey = newPanes[lastIndex].key;
            } else {
                newActiveKey = newPanes[0].key;
            }
        }
        const newData = _.cloneDeep(tabImage);
        newData[newActiveKey] = undefined;
        const newValue = _.cloneDeep(consList);
        newValue.splice(
            items.findIndex((item: any) => item.key === targetKey),
            1
        );
        setConsList(newValue);
        setTabImage(newData);
        setItems(newPanes);
        setActiveKey(newActiveKey);
    };
    const [allResult, setAllResult] = useState<any>(null);
    const [consList, setConsList] = useState<any[]>([{ key: 'one' }, { key: 'two' }]);
    return (
        <div className="h-full bg-[#fff] p-[20px]">
            <Steps
                className="px-[30%]"
                current={current}
                items={[
                    { title: '第一步', description: '配置' },
                    { title: '第二步', description: '生成' }
                ]}
            />
            <div className="min-h-[500px] my-[20px] rounded border border-dashed border-[#d4d4d4] p-[20px]">
                {current === 0 && (
                    <div>
                        <div className="text-[18px] font-[600] my-[20px]">1. 选择文案类型</div>
                        <FormControl color="secondary" fullWidth>
                            <InputLabel id="type">类型</InputLabel>
                            <Select
                                value={styles}
                                onChange={(e) => {
                                    setStyles(e.target.value);
                                }}
                                labelId="type"
                                label="类型"
                            >
                                {styleList.map((item) => (
                                    <MenuItem key={item.value} value={item.value}>
                                        {item.label}
                                    </MenuItem>
                                ))}
                            </Select>
                        </FormControl>
                        <div className="mt-[20px]">
                            <Row gutter={20}>
                                {detaData?.variables?.map((item: any, index: number) => (
                                    <Col key={index} sm={12} xs={24} md={6}>
                                        <Form changeValue={changeDetail} item={item} index={index} />
                                    </Col>
                                ))}
                            </Row>
                        </div>
                        <Divider sx={{ my: '20px' }} />
                        <div className="text-[18px] font-[600] mb-[20px]">2. 上传图片</div>
                        <Upload {...props}>
                            <div>
                                <PlusOutlined className="text-4xl " rev={undefined} />
                                <div style={{ marginTop: 8 }}>Upload</div>
                            </div>
                        </Upload>
                        <Divider sx={{ my: '20px' }} />
                        <div className="text-[18px] font-[600] mb-[20px]">3. 图片风格选择</div>
                        <Tabs type="editable-card" onChange={onChange} activeKey={activeKey} onEdit={onEdit}>
                            {items.map((item: any, index: number) => (
                                <TabPane tab={item.label} key={item.key}>
                                    <div>
                                        <EditStyle
                                            tabImage={tabImage[item.key]}
                                            consData={consList[index]}
                                            changeDetail={changeImages}
                                            label={item.key}
                                            typeList={typeList}
                                            detailImage={detailImage}
                                            key={JSON.stringify(item)}
                                        />
                                    </div>
                                </TabPane>
                            ))}
                        </Tabs>
                    </div>
                )}
                {current === 1 && <ThreeStep data={allResult} />}
            </div>
            <div>
                {current === 0 && (
                    <Button
                        type="primary"
                        onClick={() => {
                            const arr: any = [];
                            const result = consList.every((item, index) => {
                                return (
                                    tabImage[item.key]?.length >=
                                        typeList
                                            .filter((el: any) => el.id === item.imageTemplate)[0]
                                            ?.variables.filter((i: any) => i.style === 'IMAGE')?.length &&
                                    tabImage[item.key]?.length !== undefined &&
                                    typeList
                                        .filter((el: any) => el.id === item.imageTemplate)[0]
                                        ?.variables.filter((i: any) => i.style !== 'IMAGE')
                                        ?.every((int: any) => item[int.field])
                                );
                            });
                            if (result && detaData.variables.every((item: any) => item.value)) {
                                consList.map((item, index) => {
                                    const aa: any = {};
                                    typeList.map((tpye: any) => {
                                        if (tpye.id === item.imageTemplate) {
                                            tpye.variables
                                                .filter((don: any) => don.style === 'IMAGE')
                                                ?.map((n: any, num: number) => {
                                                    aa[n.field] = tabImage[item.key][num];
                                                });
                                        }
                                    });
                                    arr[index] = {
                                        imageTemplate: item?.imageTemplate,
                                        params: {
                                            ...item,
                                            key: undefined,
                                            imageTemplate: undefined,
                                            ...aa
                                        }
                                    };
                                });
                                const app: any = {};
                                detaData.variables.map((item: any) => {
                                    app[item.field] = item.value;
                                });
                                const obj = {
                                    appRequest: {
                                        uid: detaData.uid,
                                        params: {
                                            ...app
                                        }
                                    },
                                    imageRequests: arr
                                };
                                setAllResult(obj);
                                setCurrent(current + 1);
                            } else {
                                dispatch(
                                    openSnackbar({
                                        open: true,
                                        message: '图片没有选择完整或标题没有输入',
                                        variant: 'alert',
                                        alert: {
                                            color: 'error'
                                        },
                                        close: false
                                    })
                                );
                            }
                        }}
                    >
                        下一步
                    </Button>
                )}
                {current === 1 && <Button onClick={() => setCurrent(0)}>上一步</Button>}
            </div>
        </div>
    );
};
export default SmallRedBook;
