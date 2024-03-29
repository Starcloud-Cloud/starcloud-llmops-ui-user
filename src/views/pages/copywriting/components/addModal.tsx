import {
    IconButton,
    CardContent,
    TextField,
    FormControl,
    FormHelperText,
    CardActions,
    Grid,
    Switch,
    Autocomplete,
    Chip,
    Box,
    Typography
} from '@mui/material';
import { InputNumber, Radio, Row, Col } from 'antd';
import KeyboardBackspace from '@mui/icons-material/KeyboardBackspace';
import MainCard from 'ui-component/cards/MainCard';
import SubCard from 'ui-component/cards/SubCard';
import { useEffect, useState, useRef } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { UploadProps, Upload, Button, Divider, Image, TreeSelect, Input, Modal, Collapse, Steps } from 'antd';
import { PlusOutlined, HomeOutlined, ContainerOutlined, SettingOutlined, UserOutlined } from '@ant-design/icons';
import { getAccessToken } from 'utils/auth';
import { schemeCreate, schemeGet, schemeModify, schemeMetadata, schemeExample, appList } from 'api/redBook/copywriting';
import { dispatch } from 'store';
import { openSnackbar } from 'store/slices/snackbar';
import _ from 'lodash-es';
import copywriting from 'store/copywriting';
import '../index.scss';
import useUserStore from 'store/user';
import CreateTable from './spliceCmponents/table';
import CreateVariable from './spliceCmponents/variable';
import CreateVariables from './spliceCmponents/variables';
import CreateTab from './spliceCmponents/tab';
import Goods from '../../batchSmallRedBooks/good';
import { getContentPage } from 'api/redBook';
import Form from '../../smallRedBook/components/form';
const AddModal = () => {
    const { TextArea } = Input;
    const permissions = useUserStore((state) => state.permissions);
    const { tableList, setTableList } = copywriting();
    const location = useLocation();
    const navigate = useNavigate();
    const searchParams = new URLSearchParams(location.search);
    // 1.模板名称
    const [params, setParams] = useState<any>({
        mode: 'CUSTOM_IMAGE_TEXT'
    });
    const [titleOpen, setTitleOpen] = useState(false);
    const [tagOpen, setTagOpen] = useState(false);
    const [categoryOpen, setCategoryOpen] = useState(false);
    const changeParams = (data: any) => {
        setParams({
            ...params,
            [data.name]: data.value
        });
    };
    //类目列表
    const [categoryList, setCategoryList] = useState<any[]>([]);
    //参考来源列表
    const [sourceList, setSourceList] = useState<any[]>([]);

    const [tableData, setTableData] = useState<any[]>([]);
    //新增文案与风格
    const [focuActive, setFocuActive] = useState<any[]>([]);

    useEffect(() => {
        // imageTemplates().then((res) => {
        //     setTypeList(res);
        // });
        schemeMetadata().then((res) => {
            setCategoryList(res.category);
            setSourceList(res.refersSource);
            setModeList(res.generateMode);
        });
    }, []);
    const [oneLoading, setOneLoading] = useState(false);
    const valueListRef: any = useRef(null);
    useEffect(() => {
        if (searchParams.get('uid')) {
            setChangeFalg(true);
            schemeGet(searchParams.get('uid')).then((res) => {
                if (res) {
                    setOneLoading(true);
                    setParams({
                        name: res.name,
                        category: res.category,
                        tags: res.tags,
                        type: res.type === 'USER' ? false : true,
                        description: res.description,
                        mode: res.mode
                    });
                    setSplitValue(res.configuration?.appUid);
                    valueListRef.current = res.configuration?.steps;
                    setValueList(valueListRef.current);
                }
            });
        } else {
            setOneLoading(true);
            setTableData(tableList);
        }
    }, []);
    const [rows, setRows] = useState<any[]>([]);
    const [summaryOpen, setSummaryOpen] = useState(false);
    const [pre, setPre] = useState(1);

    //测试
    const [testOpen, setTestOpen] = useState(false);
    //测试图片上传
    const [imageOpen, setImageOpen] = useState(false);
    const [previewImage, setPreviewImage] = useState('');
    const [testImageList, setTestImageList] = useState<any[]>([]);
    const testProps: UploadProps = {
        name: 'image',
        listType: 'picture-card',
        multiple: true,
        fileList: testImageList,
        action: `${process.env.REACT_APP_BASE_URL}${process.env.REACT_APP_API_URL}/llm/creative/plan/uploadImage`,
        headers: {
            Authorization: 'Bearer ' + getAccessToken()
        },
        maxCount: 20,
        onChange(info) {
            console.log(info);

            setTestImageList(info.fileList);
        },
        onPreview: (file) => {
            setPreviewImage(file?.response?.data?.url);
            setImageOpen(true);
        },
        onDrop(e) {
            console.log('Dropped files', e.dataTransfer.files);
        }
    };
    //每一个内容校验
    const verifyItem = (item: any) => {
        let content = '';
        let flag;
        if (item.code === 'CustomActionHandler' || item.code === 'TitleActionHandler' || item.code === 'ParagraphActionHandler') {
            if ((item.model === 'RANDOM' || item.model === 'AI_PARODY') && item?.referList?.length === 0) {
                flag = true;
                content = '参考来源最少一个';
            } else if (item.model === 'AI_CUSTOM' && !item.requirement) {
                flag = true;
                content = '文案生成要求必填';
            } else if (item.code === 'ParagraphActionHandler' && !item.paragraphCount) {
                flag = true;
                content = '文案段落数量必填';
            } else {
                flag = false;
            }
        } else if (item.code === 'AssembleActionHandler' && !item.requirement) {
            flag = true;
            content = '文案拼接配置必填';
        } else if (item.code === 'PosterActionHandler' && item?.styleList?.some((el: any) => el?.templateList.some((i: any) => !i.id))) {
            flag = true;
            content = '风格必选';
        } else {
            flag = false;
        }
        return {
            flag,
            content
        };
    };
    //保存
    const handleSave = () => {
        if (!params.name) {
            setTitleOpen(true);
            setCategoryOpen(true);
            setTagOpen(true);
            setPre(pre + 1);
            setSummaryOpen(true);
            dispatch(
                openSnackbar({
                    open: true,
                    message: '方案名称必填',
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
        if (!params.category) {
            setTitleOpen(true);
            setCategoryOpen(true);
            setTagOpen(true);
            setPre(pre + 1);
            setSummaryOpen(true);
            dispatch(
                openSnackbar({
                    open: true,
                    message: '类目必选',
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
        if (!params.tags || params.tags?.length === 0) {
            setTitleOpen(true);
            setCategoryOpen(true);
            setTagOpen(true);
            setPre(pre + 1);
            setSummaryOpen(true);
            dispatch(
                openSnackbar({
                    open: true,
                    message: '标签最少输入一个',
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
        if (valueList?.some((item) => verifyItem(item).flag)) {
            dispatch(
                openSnackbar({
                    open: true,
                    message: '创作方式有未填项',
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
        if (searchParams.get('uid')) {
            schemeModify({
                uid: searchParams.get('uid'),
                ...params,
                type: params.type ? 'SYSTEM' : 'USER',
                configuration: {
                    ...splitList.filter((item) => item.appUid === splitValue)[0],
                    steps: valueList?.map((item) => {
                        if (item?.model === 'RANDOM') {
                            return {
                                ...item,
                                variableList: [],
                                requirement: ''
                            };
                        } else if (item?.model === 'AI_CUSTOM') {
                            return {
                                ...item,
                                referList: []
                            };
                        } else {
                            return item;
                        }
                    })
                }
            }).then((res) => {
                if (res) {
                    navigate('/copywriting');
                    dispatch(
                        openSnackbar({
                            open: true,
                            message: ' 编辑成功',
                            variant: 'alert',
                            alert: {
                                color: 'success'
                            },
                            anchorOrigin: { vertical: 'top', horizontal: 'center' },
                            transition: 'SlideDown',
                            close: false
                        })
                    );
                }
            });
            return false;
        }
        schemeCreate({
            ...params,
            type: params.type ? 'SYSTEM' : 'USER',
            configuration: {
                ...splitList.filter((item) => item.appUid === splitValue)[0],
                steps: valueList?.map((item) => {
                    if (item?.model === 'RANDOM') {
                        return {
                            ...item,
                            variableList: [],
                            requirement: ''
                        };
                    } else if (item?.model === 'AI_CUSTOM') {
                        return {
                            ...item,
                            referList: []
                        };
                    } else {
                        return item;
                    }
                })
            }
        }).then((res) => {
            if (res) {
                setTableList([]);
                navigate('/copywriting');
                dispatch(
                    openSnackbar({
                        open: true,
                        message: ' 创建成功',
                        variant: 'alert',
                        alert: {
                            color: 'success'
                        },
                        anchorOrigin: { vertical: 'top', horizontal: 'center' },
                        transition: 'SlideDown',
                        close: false
                    })
                );
            }
        });
    };

    //自定义内容拼接
    const [splitValue, setSplitValue] = useState<any>(null);
    const [splitList, setSplitList] = useState<any[]>([]);
    //选中应用之后需要循环的数据
    const [valueList, setValueList] = useState<any[]>([]);

    //生成模式
    const [modeList, setModeList] = useState<any[]>([]);
    useEffect(() => {
        appList().then((res) => {
            setSplitList(res);
            if (!searchParams.get('uid')) {
                setSplitValue(res[0]?.appUid);
            }
        });
    }, []);
    const [changeFalg, setChangeFalg] = useState(false);
    useEffect(() => {
        if (splitValue) {
            if (!changeFalg) {
                valueListRef.current = splitList.filter((item) => item.appUid === splitValue)[0]?.steps;
                setValueList(splitList.filter((item) => item.appUid === splitValue)[0]?.steps);
            }
        } else {
            valueListRef.current = [];
            setValueList([]);
        }
    }, [splitValue]);
    const setValues = (key: string, data: any, index: number) => {
        const newData = _.cloneDeep(valueListRef.current);
        newData[index] = {
            ...newData[index],
            [key]: data
        };
        valueListRef.current = newData;
        setValueList(valueListRef.current);
    };

    //测试生成
    const timer: any = useRef([]);
    const [total, setTotal] = useState(0);
    const [planList, setPlanList] = useState<any[]>([]);
    const plabListRef: any = useRef(null);
    const [queryPage, setQueryPage] = useState({
        pageNo: 1,
        pageSize: 20
    });
    const getList = () => {
        getContentPage({
            ...queryPage,
            isTest: true,
            schemeUid: searchParams.get('uid')
        }).then((res) => {
            setTotal(res.total);
            plabListRef.current = [...planList, ...res.list];
            setPlanList(plabListRef.current);
        });
    };
    const getLists = (pageNo: number) => {
        getContentPage({
            ...queryPage,
            isTest: true,
            pageNo,
            schemeUid: searchParams.get('uid')
        }).then((res) => {
            setTotal(res.total);
            const newList = _.cloneDeep(plabListRef.current);
            newList.splice((queryPage.pageNo - 1) * queryPage.pageSize, queryPage.pageSize, ...res.list);
            plabListRef.current = newList;
            setPlanList(plabListRef.current);
        });
    };
    const scrollRef: any = useRef(null);
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
    useEffect(() => {
        if (searchParams.get('uid')) {
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

    const [current, setCurrent] = useState(0);
    const [variableLists, setvariableLists] = useState<any[]>([]);
    return (
        <MainCard content={false}>
            <CardContent>
                <SubCard
                    sx={{ mb: 3 }}
                    contentSX={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', p: '10px !important' }}
                >
                    <div>
                        <IconButton
                            onClick={() => {
                                if (tableData.length > 0 && !searchParams.get('uid')) {
                                    setTableList(tableData);
                                }
                                navigate('/copywriting');
                            }}
                            color="secondary"
                        >
                            <KeyboardBackspace fontSize="small" />
                        </IconButton>
                        <span className="text-[#000c] font-[500]">创作方案</span>&nbsp;
                        <span className="text-[#673ab7] font-[500]">- {!searchParams.get('uid') ? '新建创作方案' : '编辑创作方案'}</span>
                    </div>
                    <div></div>
                </SubCard>
                <div className="text-[18px] my-[20px] font-[600]">方案信息</div>
                <Grid sx={{ ml: 0 }} container>
                    <Grid item md={12} sm={12}>
                        <TextField
                            sx={{ width: '300px' }}
                            size="small"
                            color="secondary"
                            InputLabelProps={{ shrink: true }}
                            label="方案名称"
                            name="name"
                            value={params.name}
                            error={!params.name && titleOpen}
                            helperText={!params.name && titleOpen ? '方案名称必填' : ''}
                            onChange={(e: any) => {
                                setTitleOpen(true);
                                changeParams(e.target);
                            }}
                        />
                    </Grid>
                    <Grid item md={12} sm={12}>
                        <div className="relative mt-[16px] max-w-[300px]">
                            <TreeSelect
                                className="bg-[#f8fafc]  h-[40px] border border-solid rounded-[6px] antdSel"
                                showSearch
                                style={{ width: '100%', borderColor: !params.category && categoryOpen ? '#f44336' : '#697586ad' }}
                                value={params.category}
                                dropdownStyle={{ maxHeight: 600, overflow: 'auto' }}
                                allowClear
                                treeCheckable={false}
                                treeDefaultExpandAll
                                onChange={(e) => {
                                    setCategoryOpen(true);
                                    changeParams({ name: 'category', value: e });
                                }}
                                onClear={() => {
                                    setCategoryOpen(true);
                                    changeParams({ name: 'category', value: '' });
                                }}
                                fieldNames={{
                                    label: 'name',
                                    value: 'code'
                                }}
                                treeData={categoryList}
                            />
                            <span
                                className=" block bg-[#fff] px-[5px] absolute top-[-7px] left-2 text-[12px]"
                                style={{ color: !params.category && categoryOpen ? '#f44336' : '#697586' }}
                            >
                                类目
                            </span>
                        </div>
                    </Grid>
                    <Grid item md={12} sm={12}>
                        <FormControl
                            key={params.tags}
                            error={(!params.tags || params.tags.length === 0) && tagOpen}
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
                                defaultValue={params.tags}
                                freeSolo
                                renderTags={(value: readonly string[], getTagProps) =>
                                    value.map((option: string, index: number) => (
                                        <Chip variant="outlined" label={option} {...getTagProps({ index })} />
                                    ))
                                }
                                onChange={(e: any, newValue) => {
                                    changeParams({
                                        name: 'tags',
                                        value: newValue
                                    });
                                }}
                                renderInput={(param) => (
                                    <TextField
                                        onBlur={(e: any) => {
                                            if (e.target.value) {
                                                let newValue = params.tags;
                                                if (!newValue) {
                                                    newValue = [];
                                                }
                                                newValue.push(e.target.value);
                                                changeParams({
                                                    name: 'tags',
                                                    value: newValue
                                                });
                                            }
                                        }}
                                        error={(!params.tags || params.tags.length === 0) && tagOpen}
                                        color="secondary"
                                        {...param}
                                        label="标签"
                                        placeholder="请输入标签然后回车"
                                    />
                                )}
                            />
                            <FormHelperText>
                                {(!params.tags || params.tags.length === 0) && tagOpen ? '标签最少输入一个' : ''}
                            </FormHelperText>
                        </FormControl>
                    </Grid>
                    {permissions.includes('creative:scheme:publish') && (
                        <Grid item md={12} sm={12}>
                            <div className="flex items-center">
                                <Switch
                                    color={'secondary'}
                                    checked={params.type}
                                    onClick={() => setParams({ ...params, type: !params.type })}
                                />{' '}
                                公开
                            </div>
                        </Grid>
                    )}
                </Grid>
                <TextField
                    sx={{ mt: 2 }}
                    fullWidth
                    multiline
                    minRows={4}
                    maxRows={6}
                    size="small"
                    color="secondary"
                    InputLabelProps={{ shrink: true }}
                    label="备注"
                    name="description"
                    value={params.description}
                    onChange={(e: any) => {
                        changeParams(e.target);
                    }}
                />
                <Divider />
                <div className="text-[18px] font-[600]">创作方式</div>
                <div className="my-[20px] flex gap-2 flex-wrap">
                    {splitList?.map((item) => (
                        <SubCard
                            key={item?.appUid}
                            sx={{
                                mb: 1,
                                cursor: searchParams.get('uid') ? 'not-allowed' : 'pointer',
                                borderColor: splitValue === item.appUid ? '#673ab7' : 'rgba(230,230,231,1)'
                            }}
                            contentSX={{ p: '10px !important', width: '200px' }}
                        >
                            <Box
                                onClick={() => {
                                    if (!searchParams.get('uid')) {
                                        setSplitValue(item.appUid);
                                    }
                                }}
                            >
                                <Typography variant="h4" mb={1}>
                                    {item.appName}
                                </Typography>
                                <Typography height="48px" className="line-clamp-3" color="#697586" fontSize="12px">
                                    {item?.description}
                                </Typography>
                            </Box>
                        </SubCard>
                    ))}
                </div>
                <div className="p-4 border border-solid border-black/30 rounded-lg mb-[20px]">
                    <Steps
                        current={current}
                        items={[
                            {
                                icon: <HomeOutlined rev={undefined} />,
                                title: '应用说明'
                            },
                            { icon: <ContainerOutlined rev={undefined} />, title: '基础信息' },
                            { icon: <SettingOutlined rev={undefined} />, title: '创作配置' },
                            { icon: <UserOutlined rev={undefined} />, title: '生成测试' }
                        ]}
                    />
                </div>
                {current === 0 && (
                    <div className="flex justify-center items-center">
                        <div className="w-[200px] rounded-lg border border-solid border-black/30 shadow-sm p-4">
                            <div className="text-lg font-bold">{splitList?.find((item) => item.appUid === splitValue)?.appName}</div>
                            <div className="text-xs mt-[10px]">{splitList?.find((item) => item.appUid === splitValue)?.description}</div>
                        </div>
                        <div></div>
                    </div>
                )}
                {current === 1 && (
                    <>
                        <Row gutter={20}>
                            {valueList
                                ?.find((el) => el.code === 'VariableActionHandler')
                                ?.variableList?.map((item: any, de: number) => (
                                    <Col key={item?.field} xs={24} sm={12} lg={6}>
                                        <Form
                                            item={item}
                                            index={de}
                                            changeValue={(data: any) => {
                                                const newList = _.cloneDeep(valueList);
                                                const num = valueList?.findIndex((item) => item.code === 'VariableActionHandler');
                                                newList[num].variableList[data?.index].value = data.value;
                                                setValueList(newList);
                                            }}
                                            flag={false}
                                        />
                                    </Col>
                                ))}
                        </Row>
                        <CreateVariable
                            rows={valueList?.find((item) => item.code === 'VariableActionHandler')?.variableList}
                            setRows={(data: any[]) =>
                                setValues(
                                    'variableList',
                                    data,
                                    valueList?.findIndex((item) => item.code === 'VariableActionHandler')
                                )
                            }
                        />
                    </>
                )}
                {current === 2 && (
                    <Collapse
                        bordered={false}
                        style={{ background: 'transparent' }}
                        items={valueList
                            ?.filter((item) => item.code !== 'VariableActionHandler')
                            ?.map((el: any, index: number) => {
                                return {
                                    key: index,
                                    style: { marginBottom: 20, background: '#fafafa', border: '1px solod #d9d9d9' },
                                    label: (
                                        <div className="relative">
                                            <span className="text-[18px] font-[600]">
                                                {index + 1 + '.'} {el?.name}
                                            </span>
                                            {verifyItem(el)?.flag && (
                                                <span className="text-[#ff4d4f] ml-[10px]">（{verifyItem(el)?.content}）</span>
                                            )}
                                        </div>
                                    ),
                                    children: (
                                        <>
                                            {(el.code === 'CustomActionHandler' ||
                                                el.code === 'ParagraphActionHandler' ||
                                                el.code === 'TitleActionHandler') && (
                                                <>
                                                    <div className="text-[16px] mb-[10px] font-[600]">1. 生成模式</div>
                                                    <div>
                                                        <Radio.Group
                                                            value={el.model}
                                                            onChange={(e) => {
                                                                if (valueList.find((item) => item.code === 'VariableActionHandler')) {
                                                                    setValues('model', e.target.value, index + 1);
                                                                } else {
                                                                    setValues('model', e.target.value, index);
                                                                }
                                                            }}
                                                        >
                                                            {modeList?.map((item) =>
                                                                el?.code === 'ParagraphActionHandler' ? (
                                                                    item.label !== '随机获取' && (
                                                                        <Radio key={item.value} value={item.value}>
                                                                            {item.label}
                                                                        </Radio>
                                                                    )
                                                                ) : (
                                                                    <Radio key={item.value} value={item.value}>
                                                                        {item.label}
                                                                    </Radio>
                                                                )
                                                            )}
                                                        </Radio.Group>
                                                    </div>
                                                    <div className="p-[10px] inline-block rounded-md text-[12px] mt-[5px]">
                                                        <span className="font-[600] text-[#673ab7]">Tips：</span>
                                                        {el.model === 'RANDOM'
                                                            ? '从参考内容中随机获取一条内容使用'
                                                            : el.model === 'AI_PARODY'
                                                            ? '从参考内容中随机获取几条内容作为参考，并用AI进行仿写'
                                                            : '直接让AI生成内容，要求越详细越好'}
                                                    </div>
                                                    {el.model !== 'AI_CUSTOM' && (
                                                        <>
                                                            <div className="text-[16px] mt-[20px] mb-[10px] font-[600]">2.参考文案</div>
                                                            <CreateTable
                                                                tableData={el?.referList}
                                                                sourceList={sourceList}
                                                                code={el?.code}
                                                                setTableData={(data) => {
                                                                    if (valueList.find((item) => item.code === 'VariableActionHandler')) {
                                                                        setValues('referList', data, index + 1);
                                                                    } else {
                                                                        setValues('referList', data, index);
                                                                    }
                                                                }}
                                                                params={params}
                                                            />
                                                        </>
                                                    )}
                                                    {el.model !== 'RANDOM' && (
                                                        <>
                                                            <div className="text-[16px] mt-[20px] mb-[10px] font-[600]">
                                                                {el.model !== 'AI_CUSTOM' ? 3 : 2}. 文案生成要求
                                                            </div>
                                                            <CreateVariables
                                                                pre={pre}
                                                                model={el?.model}
                                                                value={el?.requirement}
                                                                setValue={(data: string) => {
                                                                    if (valueList.find((item) => item.code === 'VariableActionHandler')) {
                                                                        setValues('requirement', data, index + 1);
                                                                    } else {
                                                                        setValues('requirement', data, index);
                                                                    }
                                                                }}
                                                            />
                                                        </>
                                                    )}
                                                    {el.code === 'ParagraphActionHandler' && (
                                                        <>
                                                            <div className="relative mt-[20px]">
                                                                <InputNumber
                                                                    status={!el?.paragraphCount ? 'error' : ''}
                                                                    size="large"
                                                                    className="w-[300px] bg-[#f8fafc]"
                                                                    min={1}
                                                                    value={el?.paragraphCount}
                                                                    onChange={(data) => {
                                                                        if (
                                                                            valueList.find((item) => item.code === 'VariableActionHandler')
                                                                        ) {
                                                                            setValues('paragraphCount', data, index + 1);
                                                                        } else {
                                                                            setValues('paragraphCount', data, index);
                                                                        }
                                                                    }}
                                                                />
                                                                <span
                                                                    style={{ color: !el?.paragraphCount ? '#f44336' : '#000' }}
                                                                    className=" block bg-[#fff] px-[5px] absolute top-[-7px] left-2 text-[12px] bg-gradient-to-b from-[#fff] to-[#f8fafc]"
                                                                >
                                                                    文案段落数量
                                                                </span>
                                                            </div>
                                                            {!el?.paragraphCount && (
                                                                <span className="text-[12px] text-[#f44336] mt-[5px] ml-[5px]">
                                                                    文案段落数量必填
                                                                </span>
                                                            )}
                                                        </>
                                                    )}
                                                </>
                                            )}
                                            {el.code === 'AssembleActionHandler' && (
                                                <>
                                                    <div className="relative">
                                                        <TextArea
                                                            status={!el?.requirement ? 'error' : ''}
                                                            defaultValue={el?.requirement}
                                                            onBlur={(data) => {
                                                                if (valueList.find((item) => item.code === 'VariableActionHandler')) {
                                                                    setValues('requirement', data.target.value, index + 1);
                                                                } else {
                                                                    setValues('requirement', data.target.value, index);
                                                                }
                                                            }}
                                                            rows={10}
                                                        />
                                                        <span
                                                            style={{ color: !el?.requirement ? '#f44336' : '#000' }}
                                                            className=" block bg-[#fff] px-[5px] absolute top-[-10px] left-2 text-[12px] bg-gradient-to-b from-[#fff] to-[#f8fafc]"
                                                        >
                                                            文案拼接配置
                                                        </span>
                                                    </div>
                                                    {!el?.requirement && (
                                                        <span className="text-[12px] text-[#f44336] mt-[5px] ml-[5px]">
                                                            文案拼接配置必填
                                                        </span>
                                                    )}
                                                </>
                                            )}
                                            {el.code === 'PosterActionHandler' && (
                                                <>
                                                    <CreateTab
                                                        mode={el?.mode}
                                                        setModel={(data) => {
                                                            if (valueList.find((item) => item.code === 'VariableActionHandler')) {
                                                                setValues('mode', data, index + 1);
                                                            } else {
                                                                setValues('mode', data, index);
                                                            }
                                                        }}
                                                        imageStyleData={el?.styleList}
                                                        setImageStyleData={(data) => {
                                                            if (valueList.find((item) => item.code === 'VariableActionHandler')) {
                                                                setValues('styleList', data, index + 1);
                                                            } else {
                                                                setValues('styleList', data, index);
                                                            }
                                                        }}
                                                        focuActive={focuActive}
                                                        setFocuActive={setFocuActive}
                                                        digui={() => {
                                                            const newData = el?.styleList?.map((i: any) => i.name.split(' ')[1]);
                                                            if (!newData || newData?.every((i: any) => !i)) {
                                                                return 1;
                                                            }
                                                            return newData?.sort((a: any, b: any) => b - a)[0] * 1 + 1;
                                                        }}
                                                    />
                                                </>
                                            )}
                                        </>
                                    )
                                };
                            })}
                    />
                )}
                {current === 3 && (
                    <>
                        <div className="flex flex-wrap gap-[10px] max-h-[300px] overflow-y-auto shadow">
                            <Modal open={imageOpen} footer={null} onCancel={() => setImageOpen(false)}>
                                <Image className="min-w-[472px]" preview={false} alt="example" src={previewImage} />
                            </Modal>
                            <div>
                                <Upload {...testProps}>
                                    <div className=" w-[100px] h-[100px] border border-dashed border-[#d9d9d9] rounded-[5px] bg-[#000]/[0.02] flex justify-center items-center flex-col cursor-pointer">
                                        <PlusOutlined rev={undefined} />
                                        <div style={{ marginTop: 8 }}>Upload</div>
                                    </div>
                                </Upload>
                            </div>
                        </div>
                        <Button
                            onClick={() => {
                                if (!testImageList || testImageList.length === 0) {
                                    dispatch(
                                        openSnackbar({
                                            open: true,
                                            message: '没有上传测试图片',
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
                                if (searchParams.get('uid')) {
                                    setTestOpen(true);
                                    try {
                                        schemeExample({
                                            uid: searchParams.get('uid'),
                                            ...params,
                                            type: params.type ? 'SYSTEM' : 'USER',
                                            configuration: {
                                                ...splitList.filter((item) => item.appUid === splitValue)[0],
                                                steps: valueList?.map((item) => {
                                                    if (item?.model === 'RANDOM') {
                                                        return {
                                                            ...item,
                                                            variableList: [],
                                                            requirement: ''
                                                        };
                                                    } else if (item?.model === 'AI_CUSTOM') {
                                                        return {
                                                            ...item,
                                                            referList: []
                                                        };
                                                    } else {
                                                        return item;
                                                    }
                                                })
                                            },
                                            useImages: testImageList
                                                ?.map((item: any, i: number) => {
                                                    if (item?.response?.data?.url) {
                                                        return item?.response?.data?.url;
                                                    } else {
                                                        return undefined;
                                                    }
                                                })
                                                ?.filter((item) => item)
                                        })
                                            .then((res) => {
                                                setTestOpen(false);
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
                                            })
                                            .catch((err) => {
                                                setTestOpen(false);
                                            });
                                    } catch (err) {
                                        setTestOpen(false);
                                    }
                                } else {
                                    dispatch(
                                        openSnackbar({
                                            open: true,
                                            message: '保存之后才能测试生成',
                                            variant: 'alert',
                                            alert: {
                                                color: 'error'
                                            },
                                            anchorOrigin: { vertical: 'top', horizontal: 'center' },
                                            transition: 'SlideDown',
                                            close: false
                                        })
                                    );
                                }
                            }}
                            loading={testOpen}
                            className="mt-[20px]"
                            type="primary"
                        >
                            测试生成
                        </Button>
                        <div onScroll={handleScroll} ref={scrollRef} className="h-[600px] overflow-auto shadow-lg mt-[20px]">
                            <Row gutter={20} className="h-[fit-content] w-full">
                                {planList.map((item, index: number) => (
                                    <Col key={index} span={6} className="inline-block">
                                        <Goods item={item} setBusinessUid={item.setBusinessUid} setDetailOpen={() => {}} />
                                    </Col>
                                ))}
                            </Row>
                        </div>
                    </>
                )}
                <div className="my-[20px] flex justify-center gap-2">
                    <Button type="primary" onClick={() => setCurrent(current - 1)} disabled={current === 0}>
                        上一步
                    </Button>
                    <Button type="primary" onClick={() => setCurrent(current + 1)} disabled={current === 3}>
                        下一步
                    </Button>
                </div>
                <Divider />
                <CardActions>
                    <Grid container justifyContent="flex-end">
                        <Button className="w-[100px]" size="large" type="primary" onClick={handleSave}>
                            保存
                        </Button>
                    </Grid>
                </CardActions>
            </CardContent>
        </MainCard>
    );
};
export default AddModal;
