import React, { useState, useEffect, useRef } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { TextField, FormControl, OutlinedInput, InputLabel, Select, MenuItem, Box, Chip } from '@mui/material';
import { Button, Upload, UploadProps, Image, Carousel, Transfer, Radio, Modal, Row, Col, InputNumber, Popover, Skeleton } from 'antd';
import type { TransferDirection } from 'antd/es/transfer';
import type { RadioChangeEvent } from 'antd';
import { PlusOutlined } from '@ant-design/icons';
import { getAccessToken } from 'utils/auth';
import { imageTemplates } from 'api/template';
import { schemeList } from 'api/redBook/batchIndex';
import { planCreate, planGet, planModify, listTemplates } from 'api/redBook/batchIndex';
import { dispatch } from 'store';
import { openSnackbar } from 'store/slices/snackbar';
import _ from 'lodash-es';
import { v4 as uuidv4 } from 'uuid';
const BatcSmallRedBooks = () => {
    const location = useLocation();
    const navigate = useNavigate();
    const searchParams = new URLSearchParams(location.search);
    const [value, setValue] = useState('');
    const [valueOpen, setValueOpen] = useState(false);
    const newTabIndex = useRef(1);
    //1.批量上传图片素材
    const [open, setOpen] = useState(false);
    const [previewImage, setpreviewImage] = useState('');
    const [imageList, setImageList] = useState<any[]>([]);
    const props: UploadProps = {
        name: 'image',
        multiple: true,
        listType: 'picture-card',
        fileList: imageList,
        action: `${process.env.REACT_APP_BASE_URL}${process.env.REACT_APP_API_URL}/llm/image/upload`,
        headers: {
            Authorization: 'Bearer ' + getAccessToken()
        },
        maxCount: 500,
        onChange(info) {
            console.log(info);

            setImageList(info.fileList);
        },
        onPreview: (file) => {
            setpreviewImage(file?.response?.data?.url);
            setOpen(true);
        },
        onDrop(e) {
            console.log('Dropped files', e.dataTransfer.files);
        }
    };
    //2.文案模板
    const [mockData, setMockData] = useState<any[]>([]);
    const [targetKeys, setTargetKeys] = useState<any[]>(['1']);
    const [selectedKeys, setSelectedKeys] = useState<any[]>([]);

    const deduplicateArray = (arr: any[], prop: string) => {
        const uniqueValues = new Set();
        const deduplicatedArray: any[] = [];
        for (const item of arr) {
            const value = item[prop];
            if (!uniqueValues.has(value)) {
                uniqueValues.add(value);
                deduplicatedArray.push(item);
            }
        }
        return deduplicatedArray;
    };
    useEffect(() => {
        if (targetKeys?.length > 0) {
            const arr: any[] = [];
            const newList = mockData?.filter((item: any) => targetKeys?.some((el) => item.uid === el));
            newList.map((item) => {
                item.variables?.map((el: any) => {
                    arr.push(el);
                });
            });
            const newData = _.cloneDeep(detailData);
            newData.variableList = deduplicateArray(arr, 'field');
            setDetailData(newData);
        } else {
            if (detailData?.variableList) {
                const newData = _.cloneDeep(detailData);
                newData.variableList = [];
                setDetailData(newData);
            }
        }
    }, [targetKeys]);
    const onChange = (nextTargetKeys: string[], direction: TransferDirection, moveKeys: string[]) => {
        setTargetKeys(nextTargetKeys);
    };
    const onSelectChange = (sourceSelectedKeys: string[], targetSelectedKeys: string[]) => {
        setSelectedKeys([...sourceSelectedKeys, ...targetSelectedKeys]);
    };
    //3.图片模板
    const [typeList, setTypeList] = useState<any[]>([]); //选择格式的列表（四宫格、六宫格、九宫格）
    useEffect(() => {
        if (searchParams.get('uid')) {
            planGet(searchParams.get('uid')).then((result) => {
                if (result) {
                    const res = _.cloneDeep(result);
                    setValue(res.name);
                    setDetailData({
                        ...res.config,
                        total: res.total,
                        randomType: res.randomType
                    });
                    setTargetKeys(res.config?.schemeUidList);
                    setImageList(
                        res.config?.imageUrlList?.map((item: any) => {
                            return {
                                uid: uuidv4(),
                                thumbUrl: item,
                                response: {
                                    data: {
                                        url: item
                                    }
                                }
                            };
                        })
                    );
                }
            });
        }
        if (searchParams.get('template')) {
            listTemplates().then((result) => {
                if (result) {
                    const res = result[searchParams.get('template') as string];
                    setValue(res.name);
                    setDetailData({
                        ...res.config,
                        total: res.total,
                        randomType: res.randomType
                    });
                    setTargetKeys(res.config?.schemeUidList);
                    setImageList(
                        res.config?.imageUrlList?.map((item: any) => {
                            return {
                                uid: uuidv4(),
                                thumbUrl: item,
                                response: {
                                    data: {
                                        url: item
                                    }
                                }
                            };
                        })
                    );
                }
            });
        }
        imageTemplates().then((res) => {
            setTypeList(res);
        });
        schemeList().then((res: any) => {
            setMockData(res);
        });
    }, []);

    const addStyle = () => {
        let newData = _.cloneDeep(detailData);
        if (!newData.imageStyleList) {
            newData.imageStyleList = [];
        }
        const newList = newData?.imageStyleList?.map((item: any) => item.name.split(' ')[1]);
        if (newList.every((item: any) => !item)) {
            newData.imageStyleList.push({
                id: uuidv4(),
                name: `风格 1`,
                templateList: [
                    {
                        id: '',
                        name: '首图',
                        variables: []
                    }
                ]
            });
        } else {
            newData.imageStyleList.push({
                id: uuidv4(),
                name: `风格 ${newList?.sort((a: any, b: any) => b - a)[0] * 1 + 1}`,
                templateList: [
                    {
                        id: '',
                        name: '首图',
                        variables: []
                    }
                ]
            });
        }

        setDetailData(newData);
    };

    //保存
    const [detailData, setDetailData] = useState<any>({
        randomType: 'RANDOM',
        total: 5
    });
    const handleSave = () => {
        if (!value) {
            setValueOpen(true);
            dispatch(
                openSnackbar({
                    open: true,
                    message: '模板名称必填',
                    variant: 'alert',
                    alert: {
                        color: 'error'
                    },
                    close: false
                })
            );
            return false;
        }
        if (!imageList || imageList.length === 0) {
            dispatch(
                openSnackbar({
                    open: true,
                    message: '没有上传图片',
                    variant: 'alert',
                    alert: {
                        color: 'error'
                    },
                    close: false
                })
            );
            return false;
        }
        const newData = _.cloneDeep(detailData);
        newData.imageUrlList = imageList.map((item: any) => item?.response?.data?.url)?.filter((el: any) => el);
        newData.schemeUidList = targetKeys;
        if (searchParams.get('uid')) {
            planModify({
                name: value,
                randomType: newData.randomType,
                total: newData.total,
                config: { ...newData, total: undefined, randomType: undefined, imageStyleList: undefined, variableList: undefined },
                type: 'XHS',
                uid: searchParams.get('uid')
            }).then((res) => {
                if (res) {
                    navigate('/redBookTaskList');
                }
            });
        } else {
            planCreate({
                name: value,
                randomType: newData.randomType,
                total: newData.total,
                config: { ...newData, total: undefined, randomType: undefined, imageStyleList: undefined, variableList: undefined },
                type: 'XHS'
            }).then((res) => {
                if (res) {
                    navigate('/redBookTaskList');
                }
            });
        }
    };
    //页面滚动
    const scrollRef: any = useRef(null);
    const [planList, setPlanList] = useState<any[]>([{ contentOpen: true, imageOpen: true }]);
    const [queryPage, setQueryPage] = useState({
        pageNo: 1,
        pageSize: 10
    });
    const handleScroll = () => {
        const { current } = scrollRef;
        if (current) {
            if (current.scrollHeight - current.scrollTop === current.clientHeight) {
                setQueryPage({
                    ...queryPage,
                    pageNo: queryPage.pageNo + 1
                });
                console.log(111);
            }
        }
    };
    const getList = () => {
        setPlanList([
            ...planList
            // ...res
        ]);
    };
    useEffect(() => {
        getList();
    }, [queryPage.pageNo]);
    return (
        <div className="h-full">
            <Row gutter={40} className="h-full">
                <Col span={6} className="relative bg-[#fff] !px-[0]">
                    <div className="!m-[20px]">
                        <div className="text-[18px] font-[600] my-[20px]">1. 批量上传素材图片</div>
                        <div className="flex flex-wrap gap-[10px] h-[300px] overflow-y-auto shadow">
                            <Modal open={open} footer={null} onCancel={() => setOpen(false)}>
                                <Image preview={false} alt="example" src={previewImage} />
                            </Modal>
                            <div>
                                <Upload {...props}>
                                    <div className=" w-[100px] h-[100px] border border-dashed border-[#d9d9d9] rounded-[5px] bg-[#000]/[0.02] flex justify-center items-center flex-col cursor-pointer">
                                        <PlusOutlined rev={undefined} />
                                        <div style={{ marginTop: 8 }}>Upload</div>
                                    </div>
                                </Upload>
                            </div>
                        </div>
                        <div className="text-[18px] font-[600] my-[20px]">2. 选择生成方案</div>
                        <FormControl color="secondary" size="small" fullWidth>
                            <InputLabel id="example">选择文案模版</InputLabel>
                            <Select
                                labelId="example"
                                value={targetKeys}
                                label="选择文案模版"
                                multiple
                                onChange={(e: any) => {
                                    setTargetKeys(e.target.value);
                                }}
                                input={<OutlinedInput id="select-multiple-chip" label="Chip" />}
                                renderValue={(selected) => (
                                    <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
                                        {selected.map((value) => (
                                            <Chip size="small" key={value} label={value} />
                                        ))}
                                    </Box>
                                )}
                            >
                                {mockData?.map((item) => (
                                    <MenuItem key={item.uid} value={item.uid}>
                                        {item.name}
                                    </MenuItem>
                                ))}
                            </Select>
                        </FormControl>
                        {/* <div className="text-[18px] font-[600] my-[20px]">3. 方案参数</div> */}
                        <div className="text-[18px] font-[600] my-[20px]">3. 批量生成参数</div>
                        <div>
                            <Radio.Group
                                value={detailData?.randomType}
                                onChange={(e: RadioChangeEvent) => {
                                    const newData = _.cloneDeep(detailData);
                                    newData.randomType = e.target.value;
                                    setDetailData(newData);
                                }}
                            >
                                <Radio value="RANDOM">全部随机</Radio>
                                <Radio value="SEQUENCE">按顺序</Radio>
                            </Radio.Group>
                        </div>
                        <InputNumber
                            value={detailData?.total}
                            onChange={(e: any) => {
                                const newData = _.cloneDeep(detailData);
                                newData.total = e;
                                setDetailData(newData);
                            }}
                            min={1}
                            max={500}
                            className="mt-[20px] w-full"
                        />
                        <div className="absolute bottom-[20px]" style={{ width: 'calc(100% - 60px)' }}>
                            <Button type="primary" className="w-full">
                                智能生成设置
                            </Button>
                        </div>
                    </div>
                </Col>
                <Col span={18} className="overflow-hidden">
                    <div
                        className="flex flex-wrap gap-4 overflow-auto"
                        ref={scrollRef}
                        onScroll={handleScroll}
                        style={{ height: 'calc(100vh - 128px)' }}
                    >
                        {planList.map((item, index: number) => (
                            <div
                                key={index}
                                className="w-[400px] h-[330px] rounded-[16px] shadow p-[20px] border border-solid border-[#EBEEF5]"
                            >
                                {item.imageOpen ? (
                                    <Skeleton.Image className="!w-full !h-[160px]" active={true} />
                                ) : (
                                    <Carousel className="h-[160px]" autoplay effect="fade">
                                        {[1, 2, 3].map((item) => (
                                            <div>
                                                <img
                                                    src={
                                                        'data:image/jpeg;base64,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'
                                                    }
                                                    alt="Image 1"
                                                    style={{ height: '160px', width: '100%' }}
                                                />
                                            </div>
                                        ))}
                                    </Carousel>
                                )}
                                {item.contentOpen ? (
                                    <Skeleton className="mt-[20px]" active />
                                ) : (
                                    <div className="mt-[20px]">
                                        <div className="line-clamp-2 text-[20px] font-bold">我是一个图片的标题</div>
                                        <div className="line-clamp-4 mt-[10px] text-[13px] text-[#15273799]">
                                            我是一个图片的描述我是一个图片的描述我是#15273799#15273799#15273799一个图片的描述我是一个图片的描述我是一个图片的描述我是一个图片的描述我是一个图片的描述我是一个图片的描述我是一个图片的描述
                                        </div>
                                    </div>
                                )}
                            </div>
                        ))}
                    </div>
                </Col>
            </Row>
            {/* <TextField
                sx={{ width: '300px', mb: 2 }}
                size="small"
                color="secondary"
                InputLabelProps={{ shrink: true }}
                error={valueOpen && !value}
                helperText={valueOpen && !value ? '模板名称必填' : ' '}
                label="模板名称"
                value={value}
                onChange={(e: any) => {
                    setValueOpen(true);
                    setValue(e.target.value);
                }}
            />

            <div className="text-[18px] font-[600] my-[20px]">2. 文案模板</div>
            <Transfer
                dataSource={mockData.map((item) => {
                    return {
                        key: item.uid,
                        title: item.name,
                        description: item.description
                    };
                })}
                listStyle={{
                    width: 400,
                    height: 400
                }}
                titles={['精选文案', '已选择的文案']}
                targetKeys={targetKeys}
                selectedKeys={selectedKeys}
                onChange={onChange}
                onSelectChange={onSelectChange}
                render={(item) => (
                    <Popover zIndex={9999} content={<div className="w-[500px]">{item.description}</div>} placement="top">
                        <div>{item.title}</div>
                    </Popover>
                )}
            />
            <div className="text-[18px] font-[600] my-[20px]">4. 生成随机参数</div>
            <div>
                <Radio.Group
                    value={detailData?.randomType}
                    onChange={(e: RadioChangeEvent) => {
                        const newData = _.cloneDeep(detailData);
                        newData.randomType = e.target.value;
                        setDetailData(newData);
                    }}
                >
                    <Radio value="RANDOM">全部随机</Radio>
                    <Radio value="SEQUENCE">按顺序</Radio>
                </Radio.Group>
            </div>
            <InputNumber
                value={detailData?.total}
                onChange={(e: any) => {
                    const newData = _.cloneDeep(detailData);
                    newData.total = e;
                    setDetailData(newData);
                }}
                min={1}
                max={500}
                className="mt-[20px] w-[300px]"
            />
            <div className="mt-[40px] flex justify-center items-center">
                <Button onClick={handleSave} type="primary" className="w-[300px]">
                    {searchParams.get('uid') ? '更新' : '创建'}
                </Button>
            </div> */}
        </div>
    );
};
export default BatcSmallRedBooks;
