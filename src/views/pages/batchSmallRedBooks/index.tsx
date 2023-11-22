import { useState, useEffect, useRef } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { TextField, IconButton, FormControl, OutlinedInput, InputLabel, Select, MenuItem, Box, Chip, FormHelperText } from '@mui/material';
import { KeyboardBackspace } from '@mui/icons-material';
import { Button, Upload, UploadProps, Image, Carousel, Transfer, Radio, Modal, Row, Col, InputNumber, Popover, Skeleton } from 'antd';
import type { TransferDirection } from 'antd/es/transfer';
import type { RadioChangeEvent } from 'antd';
import { PlusOutlined, SaveOutlined } from '@ant-design/icons';
import { getAccessToken } from 'utils/auth';
import { getContentPage } from 'api/redBook';
import { planCreate, planGet, planModify, schemeList, planExecute } from 'api/redBook/batchIndex';
import SubCard from 'ui-component/cards/SubCard';
import { dispatch } from 'store';
import { openSnackbar } from 'store/slices/snackbar';
import _ from 'lodash-es';
import { v4 as uuidv4 } from 'uuid';
import Form from '../smallRedBook/components/form';
const BatcSmallRedBooks = () => {
    const location = useLocation();
    const navigate = useNavigate();
    const searchParams = new URLSearchParams(location.search);
    const timer: any = useRef([]);
    const [value, setValue] = useState('');
    const [valueOpen, setValueOpen] = useState(false);
    const [targetKeysOpen, settargetKeysOpen] = useState(false);
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
    const [targetKeys, setTargetKeys] = useState<any[]>([]);

    // const deduplicateArray = (arr: any[], prop: string) => {
    //     const uniqueValues = new Set();
    //     const deduplicatedArray: any[] = [];
    //     for (const item of arr) {
    //         const value = item[prop];
    //         if (!uniqueValues.has(value)) {
    //             uniqueValues.add(value);
    //             deduplicatedArray.push(item);
    //         }
    //     }
    //     return deduplicatedArray;
    // };
    // useEffect(() => {
    //     if (targetKeys?.length > 0) {
    //         const arr: any[] = [];
    //         const newList = mockData?.filter((item: any) => targetKeys?.some((el) => item.uid === el));
    //         newList.map((item) => {
    //             item.variables?.map((el: any) => {
    //                 arr.push(el);
    //             });
    //         });
    //         const newData = _.cloneDeep(detailData);
    //         newData.variableList = deduplicateArray(arr, 'field');
    //         setDetailData(newData);
    //     } else {
    //         if (detailData?.variableList) {
    //             const newData = _.cloneDeep(detailData);
    //             newData.variableList = [];
    //             setDetailData(newData);
    //         }
    //     }
    // }, [targetKeys]);
    const setDetail = (result: any) => {
        const res = _.cloneDeep(result);
        setValue(res.name);
        setDetailData({
            ...res.config,
            total: res.total,
            randomType: res.randomType,
            status: res.status
        });
        setVariables(res.config?.paramMap);
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
    };
    useEffect(() => {
        if (searchParams.get('uid')) {
            planGet(searchParams.get('uid')).then((result) => {
                if (result) {
                    setDetail(result);
                    if (result.status === 'RUNNING') {
                        getList();
                        timer.current[0] = setInterval(() => {
                            if (plabListRef.current.slice(0, 20)?.every((item: any) => item?.pictureContent?.every((el: any) => el.url))) {
                                clearInterval(timer.current[0]);
                            }
                            getLists(1);
                        }, 3000);
                    }
                }
            });
        }
        schemeList().then((res: any) => {
            setMockData(res);
        });
    }, []);
    useEffect(() => {
        return () => {
            timer.current?.map((item: any) => {
                clearInterval(item);
            });
        };
    }, []);
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
        if (!targetKeys || targetKeys.length === 0) {
            settargetKeysOpen(true);
            dispatch(
                openSnackbar({
                    open: true,
                    message: '没有选择生成方案',
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
                config: {
                    ...newData,
                    total: undefined,
                    randomType: undefined,
                    imageStyleList: undefined,
                    variableList: undefined,
                    paramMap: { ...variables }
                },
                type: 'XHS',
                uid: searchParams.get('uid')
            }).then((res) => {
                if (res) {
                    dispatch(
                        openSnackbar({
                            open: true,
                            message: '编辑成功',
                            variant: 'alert',
                            alert: {
                                color: 'success'
                            },
                            close: false
                        })
                    );
                }
            });
        } else {
            planCreate({
                name: value,
                randomType: newData.randomType,
                total: newData.total,
                config: {
                    ...newData,
                    total: undefined,
                    randomType: undefined,
                    imageStyleList: undefined,
                    variableList: undefined,
                    paramMap: { ...variables }
                },
                type: 'XHS'
            }).then((res) => {
                if (res) {
                    dispatch(
                        openSnackbar({
                            open: true,
                            message: '创建成功',
                            variant: 'alert',
                            alert: {
                                color: 'success'
                            },
                            close: false
                        })
                    );
                    navigate('/batchSmallRedBook?uid=' + res);
                }
            });
        }
    };
    //页面滚动
    const scrollRef: any = useRef(null);
    const [total, setTotal] = useState(0);
    const [planList, setPlanList] = useState<any[]>([]);
    const plabListRef: any = useRef(null);
    const [queryPage, setQueryPage] = useState({
        pageNo: 1,
        pageSize: 20
    });
    const handleScroll = () => {
        const { current } = scrollRef;
        if (current) {
            if (current.scrollHeight - current.scrollTop === current.clientHeight && (queryPage.pageNo + 1) * queryPage.pageSize < total) {
                setQueryPage({
                    ...queryPage,
                    pageNo: queryPage.pageNo + 1
                });
            }
        }
    };
    const getList = () => {
        getContentPage({
            ...queryPage,
            planUid: searchParams.get('uid')
        }).then((res) => {
            setTotal(res.total);
            plabListRef.current = [...planList, ...res.list];
            setPlanList(plabListRef.current);
        });
    };
    const getLists = (pageNo: number) => {
        getContentPage({
            ...queryPage,
            pageNo,
            planUid: searchParams.get('uid')
        }).then((res) => {
            setTotal(res.total);
            const newList = _.cloneDeep(plabListRef.current);
            newList.splice((queryPage.pageNo - 1) * queryPage.pageSize, queryPage.pageSize, ...res.list);
            plabListRef.current = newList;
            setPlanList(plabListRef.current);
        });
    };
    useEffect(() => {
        if (queryPage.pageNo > 1) {
            getList();
            timer.current[queryPage.pageNo - 1] = setInterval(() => {
                if (
                    plabListRef.current
                        .slice((queryPage.pageNo - 1) * queryPage.pageSize, queryPage.pageNo * queryPage.pageSize)
                        ?.every((item: any) => item?.pictureContent?.every((el: any) => el.url))
                ) {
                    clearInterval(timer.current[queryPage.pageNo - 1]);
                }
                getLists(queryPage.pageNo);
            }, 3000);
        }
    }, [queryPage.pageNo]);

    //变量
    const [variables, setVariables] = useState<any>({});
    useEffect(() => {
        if (targetKeys && targetKeys.length > 0) {
            const obj: any = {};
            targetKeys.map((item: string) => {
                obj[item] = mockData?.filter((el: any) => el.uid === item)[0]?.variables;
            });
            setVariables(obj);
        } else if (targetKeys && targetKeys.length === 0) {
            setVariables([]);
        }
    }, [targetKeys]);
    //执行按钮
    const [executeOpen, setExecuteOpen] = useState(false);
    return (
        <div className="h-full">
            <SubCard
                sx={{ mb: 3 }}
                contentSX={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', p: '10px !important' }}
            >
                <div>
                    <IconButton onClick={() => navigate('/redBookTaskList')} color="secondary">
                        <KeyboardBackspace fontSize="small" />
                    </IconButton>
                    <span className="text-[#000c] font-[500]">创作计划</span>&nbsp;
                    <span className="text-[#673ab7] font-[500]">- {'新建创作计划'}</span>
                </div>
                <div>
                    <Button
                        disabled={detailData.status === 'RUNNING' ? true : false}
                        icon={<SaveOutlined rev={undefined} />}
                        onClick={handleSave}
                        type="primary"
                    >
                        保存
                    </Button>
                </div>
            </SubCard>
            <Row gutter={40} className="!ml-0">
                <Col span={6} className="relative bg-[#fff] !px-[0]">
                    <div className="!m-[20px]">
                        <TextField
                            fullWidth
                            sx={{ mb: 2 }}
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
                        <div className="text-[18px] font-[600] my-[20px]">1. 批量上传素材图片</div>
                        <div className="flex flex-wrap gap-[10px] h-[300px] overflow-y-auto shadow">
                            <Modal open={open} footer={null} onCancel={() => setOpen(false)}>
                                <Image className="min-w-[472px]" preview={false} alt="example" src={previewImage} />
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
                        <FormControl
                            error={targetKeysOpen && (!targetKeys || targetKeys.length === 0)}
                            color="secondary"
                            size="small"
                            fullWidth
                        >
                            <InputLabel id="example">选择文案模版</InputLabel>
                            <Select
                                labelId="example"
                                value={targetKeys}
                                label="选择文案模版"
                                multiple
                                onChange={(e: any) => {
                                    settargetKeysOpen(true);
                                    setTargetKeys(e.target.value);
                                }}
                                input={<OutlinedInput id="select-multiple-chip" label="Chip" />}
                                renderValue={(selected) => (
                                    <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
                                        {selected.map((value, i) => (
                                            <Chip size="small" key={value} label={mockData.filter((item) => item.uid === value)[0]?.name} />
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
                            <FormHelperText>
                                {targetKeysOpen && (!targetKeys || targetKeys.length === 0) ? '请选择文案模板' : ''}
                            </FormHelperText>
                        </FormControl>
                        {targetKeys && targetKeys.length > 0 && (
                            <div>
                                <div className="text-[18px] font-[600] mt-[20px]">3. 方案参数</div>
                                {Object.keys(variables)?.map((item) =>
                                    variables[item]?.map((el: any, i: number) => (
                                        <Form
                                            key={JSON.stringify(item)}
                                            item={el}
                                            index={i}
                                            changeValue={(data: any) => {
                                                const newData = _.cloneDeep(variables);
                                                newData[item][data.index].value = data.value;
                                                setVariables(newData);
                                            }}
                                            flag={false}
                                        />
                                    ))
                                )}
                            </div>
                        )}
                        <div className="text-[18px] font-[600] my-[20px]">4. 批量生成参数</div>
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
                            <Button
                                disabled={
                                    !searchParams.get('uid') ? true : false || detailData.status === 'RUNNING' ? true : false || executeOpen
                                }
                                type="primary"
                                className="w-full"
                                onClick={() => {
                                    planExecute({ uid: searchParams.get('uid') }).then((res) => {
                                        if (res) {
                                            setExecuteOpen(true);
                                            getList();
                                            timer.current[0] = setInterval(() => {
                                                if (
                                                    plabListRef.current
                                                        .slice(0, 20)
                                                        ?.every((item: any) => item?.pictureContent?.every((el: any) => el.url))
                                                ) {
                                                    clearInterval(timer.current[0]);
                                                }
                                                getLists(1);
                                            }, 3000);
                                        }
                                    });
                                }}
                            >
                                智能生成设置
                            </Button>
                        </div>
                    </div>
                </Col>
                <Col span={18} className="overflow-hidden">
                    {planList?.length === 0 ? (
                        <div style={{ height: 'calc(100vh - 210px)' }} className="flex justify-center items-center">
                            <div className="text-center">
                                <img
                                    className="w-[300px]"
                                    src="https://www.chuangkit.com/ai-design/assets/right-panel-editor-47905452.png"
                                    alt=""
                                />
                                <div className="font-[500] text-[20px] text-[#1b2337] my-[8px]">魔法AI创作计划</div>
                                <div>在左侧输入你的创意吧</div>
                            </div>
                        </div>
                    ) : (
                        <div
                            className="overflow-auto flex flex-wrap gap-2"
                            ref={scrollRef}
                            onScroll={handleScroll}
                            style={{ height: 'calc(100vh - 210px)' }}
                        >
                            {planList.map((item, index: number) => (
                                <div
                                    key={index}
                                    className="w-[200px] h-[330px] rounded-[16px] shadow p-[10px] border border-solid border-[#EBEEF5]"
                                >
                                    {!item.pictureContent ? (
                                        <Skeleton.Image className="!w-full !h-[200px]" active={true} />
                                    ) : (
                                        <Carousel className="h-[200px]" autoplay effect="fade">
                                            {item.pictureContent?.map((el: any) => (
                                                <div>
                                                    <img
                                                        src={el.url}
                                                        alt="el.index"
                                                        style={{ height: '200px', width: '100%', borderRadius: '10px' }}
                                                    />
                                                </div>
                                            ))}
                                        </Carousel>
                                    )}
                                    {!item.copyWritingTitle ? (
                                        <>
                                            <Skeleton paragraph={false} className="mt-[20px]" active />
                                            <Skeleton paragraph={false} className="mt-[20px]" active />
                                            <Skeleton paragraph={false} className="mt-[10px]" active />
                                        </>
                                    ) : (
                                        <div className="mt-[20px]">
                                            <div className="line-clamp-1 text-[20px] font-bold">{item.copyWritingTitle}</div>
                                            <div className="line-clamp-3 mt-[10px] text-[13px] text-[#15273799]">
                                                {item.copyWritingContent}
                                            </div>
                                        </div>
                                    )}
                                </div>
                            ))}
                        </div>
                    )}
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
