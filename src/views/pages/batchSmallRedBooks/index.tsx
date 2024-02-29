import { useState, useEffect, useRef } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import {
    TextField,
    IconButton,
    FormControl,
    OutlinedInput,
    InputLabel,
    Select,
    MenuItem,
    Box,
    Chip,
    FormHelperText,
    Autocomplete
} from '@mui/material';
import { KeyboardBackspace } from '@mui/icons-material';
import { Button, Upload, UploadProps, Image, Radio, Modal, Row, Col, InputNumber, Popover, Skeleton, Tag } from 'antd';
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
import { DetailModal } from '../redBookContentList/component/detailModal';
import './index.scss';
import Goods from './good';
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
        action: `${process.env.REACT_APP_BASE_URL}${process.env.REACT_APP_API_URL}/llm/creative/plan/uploadImage`,
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
    const [targetKeys, setTargetKeys] = useState<''>('');
    const [tags, setTags] = useState<any>([]);
    const [tagOpen, setTagOpen] = useState(false);
    const uidRef = useRef('');
    const [preform, setPerform] = useState(1);
    useEffect(() => {
        if (targetKeys) {
            if (preform > 1) {
                setTags(mockData.filter((value) => value.uid === targetKeys)[0]?.tags);
                schemeRef.current = mockData.filter((value) => value.uid === targetKeys)[0]?.variableList;
                setSchemeList(schemeRef.current);
            } else {
                setPerform(preform + 1);
            }
        } else {
            setTags([]);
        }
    }, [targetKeys]);
    const setDetail = (result: any) => {
        const res = _.cloneDeep(result);
        setTargetKeys(res.configuration?.schemeUid);
        setValue(res.name);
        setTags(res?.tags ? res?.tags : []);
        setDetailData({
            ...res.configuration,
            total: res.total,
            randomType: res.randomType,
            status: res.status
        });
        schemeRef.current = res.configuration?.variableList ? res.configuration?.variableList : [];
        setSchemeList(schemeRef.current);
        setImageList(
            res.configuration?.imageUrlList?.map((item: any) => {
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
                    if (result.status !== 'PENDING') {
                        getList();
                        timer.current[0] = setInterval(() => {
                            if (
                                plabListRef.current.slice(0, 20)?.every((item: any) => {
                                    return (
                                        item?.pictureStatus !== 'executing' &&
                                        item?.pictureStatus !== 'init' &&
                                        item?.copyWritingStatus !== 'executing' &&
                                        item?.copyWritingStatus !== 'init'
                                    );
                                })
                            ) {
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
    const [exedisabled, setExeDisabled] = useState(false);
    const handleSave = async (flag?: boolean) => {
        if (!value) {
            setValueOpen(true);
            dispatch(
                openSnackbar({
                    open: true,
                    message: '计划名称必填',
                    variant: 'alert',
                    alert: {
                        color: 'error'
                    },
                    anchorOrigin: { vertical: 'top', horizontal: 'center' },
                    transition: 'SlideDown',
                    close: false
                })
            );
            return false;
        }
        if (!targetKeys) {
            settargetKeysOpen(true);
            dispatch(
                openSnackbar({
                    open: true,
                    message: '没有选择生成方案',
                    variant: 'alert',
                    alert: {
                        color: 'error'
                    },
                    anchorOrigin: { vertical: 'top', horizontal: 'center' },
                    transition: 'SlideDown',
                    close: false
                })
            );
            return false;
        }
        if (targetKeys && (!tags || tags?.length === 0)) {
            setTagOpen(true);
            dispatch(
                openSnackbar({
                    open: true,
                    message: '标签必填',
                    variant: 'alert',
                    alert: {
                        color: 'error'
                    },
                    anchorOrigin: { vertical: 'top', horizontal: 'center' },
                    transition: 'SlideDown',
                    close: false
                })
            );
            return false;
        }
        if (schemesList && schemesList?.length > 0 && schemesList?.some((item) => !item.value)) {
            dispatch(
                openSnackbar({
                    open: true,
                    message: '方案参数全部必填',
                    variant: 'alert',
                    alert: {
                        color: 'error'
                    },
                    anchorOrigin: { vertical: 'top', horizontal: 'center' },
                    transition: 'SlideDown',
                    close: false
                })
            );
            return false;
        }
        const newData = _.cloneDeep(detailData);
        newData.imageUrlList = imageList.map((item: any) => item?.response?.data?.url)?.filter((el: any) => el);
        newData.schemeUid = targetKeys;
        if (flag) {
            setExeDisabled(true);
            plabListRef.current = [];
            setPlanList(plabListRef.current);
        }
        if (searchParams.get('uid')) {
            const res = await planModify({
                name: value,
                randomType: newData.randomType,
                total: newData.total,
                tags,
                configuration: {
                    ...newData,
                    total: undefined,
                    randomType: undefined,
                    imageStyleList: undefined,
                    variableList: schemesList
                },
                type: 'XHS',

                uid: searchParams.get('uid')
            });
            if (res) {
                uidRef.current = res;
                dispatch(
                    openSnackbar({
                        open: true,
                        message: '编辑成功',
                        variant: 'alert',
                        alert: {
                            color: 'success'
                        },
                        anchorOrigin: { vertical: 'top', horizontal: 'center' },
                        transition: 'SlideDown',
                        close: false
                    })
                );
                if (flag) {
                    planExecute({ uid: searchParams.get('uid') }).then((res) => {
                        if (res) {
                            getList();
                            timer.current[0] = setInterval(() => {
                                if (
                                    plabListRef.current.slice(0, 20)?.every((item: any) => {
                                        return (
                                            item?.pictureStatus !== 'executing' &&
                                            item?.pictureStatus !== 'init' &&
                                            item?.copyWritingStatus !== 'executing' &&
                                            item?.copyWritingStatus !== 'init'
                                        );
                                    })
                                ) {
                                    clearInterval(timer.current[0]);
                                }
                                getLists(1);
                            }, 3000);
                        }
                    });
                }
            }
        } else {
            const res = await planCreate({
                name: value,
                randomType: newData.randomType,
                total: newData.total,
                tags,
                configuration: {
                    ...newData,
                    total: undefined,
                    randomType: undefined,
                    imageStyleList: undefined,
                    variableList: schemesList
                },
                type: 'XHS'
            });
            if (res) {
                uidRef.current = res;
                dispatch(
                    openSnackbar({
                        open: true,
                        message: '创建成功',
                        variant: 'alert',
                        alert: {
                            color: 'success'
                        },
                        anchorOrigin: { vertical: 'top', horizontal: 'center' },
                        transition: 'SlideDown',
                        close: false
                    })
                );

                navigate('/batchSmallRedBook?uid=' + res);
                if (flag) {
                    planExecute({ uid: res }).then((result) => {
                        if (result) {
                            getList();
                            timer.current[0] = setInterval(() => {
                                if (
                                    plabListRef.current.slice(0, 20)?.every((item: any) => {
                                        return (
                                            item?.pictureStatus !== 'executing' &&
                                            item?.pictureStatus !== 'init' &&
                                            item?.copyWritingStatus !== 'executing' &&
                                            item?.copyWritingStatus !== 'init'
                                        );
                                    })
                                ) {
                                    clearInterval(timer.current[0]);
                                }
                                getLists(1);
                            }, 3000);
                        }
                    });
                }
            }
        }
    };
    //页面滚动
    const scrollRef: any = useRef(null);
    const [successCount, setSuccessCount] = useState(0);
    const [errorCount, setErrorCount] = useState(0);
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
            if (current.scrollHeight - current.scrollTop === current.clientHeight && queryPage.pageNo * queryPage.pageSize < total) {
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
            planUid: searchParams.get('uid') || uidRef.current
        }).then((res) => {
            setTotal(res.total);
            setSuccessCount(res.successCount);
            setErrorCount(res.errorCount);
            plabListRef.current = [...planList, ...res.list];
            setPlanList(plabListRef.current);
        });
    };
    const getLists = (pageNo: number) => {
        getContentPage({
            ...queryPage,
            pageNo,
            planUid: searchParams.get('uid') || uidRef.current
        }).then((res) => {
            setTotal(res.total);
            setSuccessCount(res.successCount);
            setErrorCount(res.errorCount);
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
                        ?.every(
                            (item: any) =>
                                item?.pictureStatus !== 'executing' &&
                                item?.pictureStatus !== 'init' &&
                                item?.copyWritingStatus !== 'executing' &&
                                item?.copyWritingStatus !== 'init'
                        )
                ) {
                    clearInterval(timer.current[queryPage.pageNo - 1]);
                }
                getLists(queryPage.pageNo);
            }, 3000);
        }
    }, [queryPage.pageNo]);
    //变量
    const [schemesList, setSchemeList] = useState<any[]>([]);
    const schemeRef: any = useRef(null);

    const [detailOpen, setDetailOpen] = useState(false);
    const [businessUid, setBusinessUid] = useState('');
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
                    <span className="text-[#673ab7] font-[500]">- {!searchParams.get('uid') ? '新建创作计划' : '编辑创作计划'}</span>
                </div>
                <div></div>
            </SubCard>
            <Row gutter={40} className="!ml-0">
                <Col span={6} className="relative h-full bg-[#fff] !px-[0]">
                    <div className="!mx-[20px] py-[20px]  overflow-y-auto pb-[72px]" style={{ height: 'calc(100vh - 210px)' }}>
                        <TextField
                            fullWidth
                            size="small"
                            color="secondary"
                            InputLabelProps={{ shrink: true }}
                            error={valueOpen && !value}
                            helperText={valueOpen && !value ? '计划名称必填' : ''}
                            label="计划名称"
                            value={value}
                            onChange={(e: any) => {
                                setValueOpen(true);
                                setValue(e.target.value);
                            }}
                        />
                        <div className="text-[18px] font-[600] mt-[20px] mb-[10px]">1. 批量上传素材图片</div>
                        <div className="text-[12px] font-[500] flex items-center justify-between">
                            <div>图片总量：{imageList?.length}</div>
                            {imageList?.length > 0 && (
                                <Button
                                    danger
                                    onClick={() => {
                                        setImageList([]);
                                    }}
                                    size="small"
                                    type="text"
                                >
                                    全部清除
                                </Button>
                            )}
                        </div>
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
                        <div className="text-[18px] font-[600] my-[20px]">2. 选择创作方案</div>
                        <FormControl error={targetKeysOpen && !targetKeys} color="secondary" size="small" fullWidth>
                            <InputLabel id="example">选择文案模版</InputLabel>
                            <Select
                                labelId="example"
                                value={targetKeys}
                                label="选择文案模版"
                                onChange={(e: any) => {
                                    setPerform(preform + 1);
                                    settargetKeysOpen(true);
                                    setTargetKeys(e.target.value);
                                }}
                            >
                                {mockData?.map((item, index) => (
                                    <MenuItem key={index} value={item.uid}>
                                        {item.name}
                                    </MenuItem>
                                ))}
                            </Select>
                            <FormHelperText>{targetKeysOpen && !targetKeys ? '请选择文案模板' : ''}</FormHelperText>
                        </FormControl>

                        {targetKeys && (
                            <>
                                <div className="text-[18px] font-[600] mt-[20px]">3. 标签</div>
                                <FormControl
                                    key={tags}
                                    error={(!tags || tags?.length === 0) && tagOpen}
                                    color="secondary"
                                    size="small"
                                    fullWidth
                                >
                                    <Autocomplete
                                        sx={{ mt: 2 }}
                                        multiple
                                        size="small"
                                        id="tags-filled"
                                        color="secondary"
                                        options={[]}
                                        defaultValue={tags}
                                        freeSolo
                                        renderTags={(value: readonly string[], getTagProps) =>
                                            value.map((option: string, index: number) => (
                                                <Chip variant="outlined" label={option} {...getTagProps({ index })} />
                                            ))
                                        }
                                        onChange={(e: any, newValue) => {
                                            setTagOpen(true);
                                            setTags(newValue);
                                        }}
                                        renderInput={(param) => (
                                            <TextField
                                                onBlur={(e: any) => {
                                                    if (e.target.value) {
                                                        let newValue = tags;
                                                        if (!newValue) {
                                                            newValue = [];
                                                        }
                                                        newValue.push(e.target.value);
                                                        setTags(newValue);
                                                    }
                                                }}
                                                error={(!tags || tags?.length === 0) && tagOpen}
                                                color="secondary"
                                                {...param}
                                                label="标签"
                                                placeholder="请输入标签然后回车"
                                            />
                                        )}
                                    />
                                    <FormHelperText>{(!tags || tags?.length === 0) && tagOpen ? '标签最少输入一个' : ''}</FormHelperText>
                                </FormControl>
                            </>
                        )}
                        {targetKeys && (
                            <div>
                                <div className="text-[18px] font-[600] mt-[20px]">4. 方案参数</div>
                                <div className="text-[14px] font-[600] mt-[10px]">
                                    {mockData.filter((value) => value.uid === targetKeys)[0]?.name}
                                    <span
                                        onClick={() => {
                                            navigate(`/copywritingModal?uid=${mockData?.filter((val) => val?.uid === targetKeys)[0]?.uid}`);
                                        }}
                                        className=" ml-[10px] text-[12px] font-[400] cursor-pointer text-[#673ab7] border-b border-solid border-[#673ab7]"
                                    >
                                        查看方案
                                    </span>
                                </div>
                                {schemesList?.map((item, de) => (
                                    <Form
                                        key={item?.field}
                                        item={item}
                                        index={de}
                                        changeValue={(data: any) => {
                                            const newData = _.cloneDeep(schemeRef.current);
                                            newData[de].value = data.value;
                                            schemeRef.current = newData;
                                            setSchemeList(schemeRef.current);
                                        }}
                                        flag={false}
                                    />
                                ))}
                            </div>
                        )}
                        <div className="text-[18px] font-[600] my-[20px]">5. 批量生成参数</div>
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
                                {/* <Radio value="SEQUENCE">按顺序</Radio> */}
                            </Radio.Group>
                        </div>
                        <div className="mt-[20px]">生成数量：</div>
                        <InputNumber
                            size="large"
                            value={detailData?.total}
                            onChange={(e: any) => {
                                const newData = _.cloneDeep(detailData);
                                newData.total = e;
                                setDetailData(newData);
                            }}
                            min={1}
                            max={100}
                            className="w-full"
                        />
                    </div>
                    <div className="z-100 absolute bottom-0 flex gap-2 bg-[#fff] p-[20px] w-[100%]">
                        <Button
                            className="w-full"
                            disabled={exedisabled || (detailData.status && detailData.status !== 'PENDING' ? true : false)}
                            icon={<SaveOutlined rev={undefined} />}
                            onClick={() => handleSave(false)}
                            type="primary"
                        >
                            保存配置
                        </Button>
                        <Button
                            disabled={exedisabled || (detailData.status && detailData.status !== 'PENDING' ? true : false)}
                            className="w-full"
                            type="primary"
                            onClick={() => handleSave(true)}
                        >
                            保存并开始生成
                        </Button>
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
                        <>
                            <SubCard contentSX={{ p: '10px !important' }}>
                                {/* <Tag
                                    className="mr-[10px]"
                                    color={
                                        detailData.status === 'PENDING'
                                            ? 'default'
                                            : detailData.status === 'RUNNING'
                                            ? 'green'
                                            : detailData.status === 'PAUSE'
                                            ? 'warning'
                                            : detailData.status === 'CANCELED'
                                            ? 'warning'
                                            : detailData.status === 'COMPLETE'
                                            ? 'blue'
                                            : detailData.status === 'FAILURE'
                                            ? 'error'
                                            : 'default'
                                    }
                                >
                                    {detailData.status === 'PENDING'
                                        ? '待执行'
                                        : detailData.status === 'RUNNING'
                                        ? '执行中'
                                        : detailData.status === 'PAUSE'
                                        ? '已暂停'
                                        : detailData.status === 'CANCELED'
                                        ? '已取消'
                                        : detailData.status === 'COMPLETE'
                                        ? '已完成'
                                        : detailData.status === 'FAILURE'
                                        ? '已失败'
                                        : ''}
                                </Tag> */}
                                <span className="font-[600]">生成成功数：</span>
                                {successCount}&nbsp;&nbsp;
                                <span className="font-[600]">生成失败数：</span>
                                {errorCount}&nbsp;&nbsp;
                                <span className="font-[600]">生成总数：</span>
                                {total}
                            </SubCard>
                            <div
                                className="overflow-y-auto overflow-x-hidden flex flex-wrap gap-2 mt-[20px]"
                                ref={scrollRef}
                                onScroll={handleScroll}
                                style={{ height: 'calc(100vh - 270px)' }}
                            >
                                <Row gutter={20} className="h-[fit-content] w-full">
                                    {planList.map((item, index: number) => (
                                        <Col key={index} span={6} className="inline-block">
                                            <Goods item={item} setBusinessUid={setBusinessUid} setDetailOpen={setDetailOpen} />
                                        </Col>
                                    ))}
                                </Row>
                            </div>
                        </>
                    )}
                </Col>
            </Row>
            {detailOpen && <DetailModal open={detailOpen} handleClose={() => setDetailOpen(false)} businessUid={businessUid} />}
        </div>
    );
};
export default BatcSmallRedBooks;
