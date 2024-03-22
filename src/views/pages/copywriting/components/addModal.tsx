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
import { InputNumber, Radio, Row, Col, Select } from 'antd';
import KeyboardBackspace from '@mui/icons-material/KeyboardBackspace';
import MainCard from 'ui-component/cards/MainCard';
import SubCard from 'ui-component/cards/SubCard';
import { useEffect, useState, useRef } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { UploadProps, Upload, Button, Divider, Image, TreeSelect, Input, Modal, Collapse, Steps } from 'antd';
import { PlusOutlined, HomeOutlined, ContainerOutlined, SettingOutlined, FileImageOutlined, UserOutlined } from '@ant-design/icons';
import { getAccessToken } from 'utils/auth';
import {
    schemeCreate,
    schemeGet,
    schemeModify,
    schemeMetadata,
    schemeExample,
    appList,
    getExample,
    schemeOptions
} from 'api/redBook/copywriting';
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
import SelectApp from './selectApp';
import { DetailModal } from '../../redBookContentList/component/detailModal';
import Form from '../../smallRedBook/components/form';
import VariableInput from 'views/pages/batchSmallRedBooks/components/variableInput';
const AddModal = () => {
    const { TextArea } = Input;
    const { Panel } = Collapse;
    const { Option } = Select;
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
    const [materialTypeList, setmaterialTypeList] = useState<any[]>([]);

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
            setmaterialTypeList(res.materialType);
            setModeList(res.generateMode);
        });
    }, []);
    const valueListRef: any = useRef(null);
    useEffect(() => {
        if (searchParams.get('uid')) {
            schemeGet(searchParams.get('uid')).then((res) => {
                if (res) {
                    setParams({
                        name: res.name,
                        category: res.category,
                        tags: res.tags,
                        type: res.type === 'USER' ? false : true,
                        description: res.description,
                        mode: res.mode
                    });
                    valueListRef.current = res.configuration?.steps;
                    setValueList(valueListRef.current);
                    appDataRef.current = res.configuration;
                    setAppData(appDataRef.current);
                }
            });
        } else {
            setTableData(tableList);
        }
    }, []);
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
            if ((item.model === 'RANDOM' || item.model === 'AI_PARODY') && item?.materialList?.length === 0) {
                flag = true;
                content = '笔记生成 参考来源最少一个';
            } else if (item.model === 'AI_CUSTOM' && !item.requirement) {
                flag = true;
                content = '笔记生成 文案生成要求必填';
            } else if (item.code === 'ParagraphActionHandler' && !item.paragraphCount) {
                flag = true;
                content = '笔记生成 文案段落数量必填';
            } else {
                flag = false;
            }
        } else if (item.code === 'AssembleActionHandler' && !item.content) {
            flag = true;
            content = '笔记生成 文案拼接配置必填';
        } else if (item.code === 'PosterActionHandler' && item?.styleList?.some((el: any) => el?.templateList.some((i: any) => !i.id))) {
            flag = true;
            content = '图片生成 风格必选';
        } else if (item.code === 'MaterialActionHandler' && !item.materialType) {
            flag = true;
            content = '笔记生成 资料库必选';
        } else {
            flag = false;
        }
        return {
            flag,
            content
        };
    };
    //保存
    const handleSave = (flag?: boolean) => {
        if (!params.name) {
            setTitleOpen(true);
            setCategoryOpen(true);
            setPre(pre + 1);
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
            setPre(pre + 1);
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
        if (valueList[0]?.variableList?.some((item: any) => !item.defaultValue && !item.value)) {
            setCurrent(1);
            dispatch(
                openSnackbar({
                    open: true,
                    message: '基础信息每个变量必须要有默认值或者值',
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
        if (
            valueList?.some((item) => {
                if (verifyItem(item).flag) {
                    dispatch(
                        openSnackbar({
                            open: true,
                            message: verifyItem(item).content,
                            variant: 'alert',
                            alert: {
                                color: 'error'
                            },
                            anchorOrigin: { vertical: 'top', horizontal: 'center' },
                            transition: 'SlideDown',
                            close: false
                        })
                    );
                    if (verifyItem(item).content === '图片生成 风格必选') {
                        setCurrent(3);
                    } else {
                        setCurrent(2);
                    }
                }
                return verifyItem(item).flag;
            })
        ) {
            return false;
        }
        if (searchParams.get('uid')) {
            schemeModify({
                uid: searchParams.get('uid'),
                ...params,
                type: params.type ? 'SYSTEM' : 'USER',
                configuration: {
                    ...appData,
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
                                materialList: []
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
                ...appData,
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
                            materialList: []
                        };
                    } else {
                        return item;
                    }
                })
            }
        }).then((res) => {
            if (res) {
                setTableList([]);
                if (flag) {
                    navigate('/copywritingModal?uid=' + res);
                    exeTest(res);
                } else {
                    navigate('/copywriting');
                }
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

    //选中应用之后需要循环的数据
    const [valueList, setValueList] = useState<any[]>([]);

    //生成模式
    const [modeList, setModeList] = useState<any[]>([]);
    useEffect(() => {
        appList().then((res) => {
            setAppLIst(res);
        });
    }, []);
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
    const [hadleCode, setHandleCode] = useState('');
    //选择应用
    const [appOpen, setAppOpen] = useState(false);
    const [AppList, setAppLIst] = useState<any[]>([]);
    //选中的值
    const [appData, setAppData] = useState<any>(null);
    const appDataRef = useRef<any>(null);
    const handleOk = (data: any) => {
        appDataRef.current = data;
        setAppData(appDataRef.current);
        setAppOpen(false);
        setCurrent(0);
        valueListRef.current = data?.steps;
        setValueList(valueListRef.current);
    };
    const [goodList, setGoodList] = useState<any[]>([]);
    //json schema
    const [schemaList, setSchemaList] = useState<any[]>([]);
    useEffect(() => {
        if (appData?.example) {
            const newList = appData?.example?.split(', ');
            getExample(newList).then((res) => {
                setGoodList(res);
            });
        }
        if (appData) {
            schemeOptions({ appUid: appData?.appUid, stepCode: '海报生成' }).then((res) => {
                const newList = res
                    ?.filter((item: any) => item.inJsonSchema || item.outJsonSchema)
                    ?.map((item: any) => {
                        return {
                            label: item.name,
                            key: item.code,
                            description: item.description,
                            children: item.inJsonSchema
                                ? getjsonschma(getJSON(item), item.name)
                                : item.outJsonSchema
                                ? getjsonschma(JSON.parse(item.outJsonSchema), item.name)
                                : []
                        };
                    });
                setSchemaList(newList);
            });
        }
    }, [appData?.example]);
    const [businessUid, setBusinessUid] = useState('');
    const [detailOpen, setDetailOpen] = useState(false);
    //测试生成
    const exeTest = (uid?: string) => {
        setTestOpen(true);
        try {
            schemeExample({
                uid: uid || searchParams.get('uid'),
                ...params,
                type: params.type ? 'SYSTEM' : 'USER',
                configuration: {
                    ...appData,
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
                                materialList: []
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
    };
    //步骤
    const [stepItem, setStepItem] = useState<any[]>([]);
    useEffect(() => {
        if (appData) {
            if (
                appData?.steps?.findIndex((item: any) => item?.code === 'PosterActionHandler') !== -1 &&
                appData?.steps?.findIndex((item: any) => item?.code === 'VariableActionHandler') !== -1
            ) {
                setStepItem([
                    { icon: <HomeOutlined rev={undefined} />, title: '模版说明' },
                    { icon: <ContainerOutlined rev={undefined} />, title: '基础信息' },
                    { icon: <SettingOutlined rev={undefined} />, title: '笔记生成' },
                    { icon: <FileImageOutlined rev={undefined} />, title: '图片生成' },
                    { icon: <UserOutlined rev={undefined} />, title: '生成测试' }
                ]);
            } else if (
                appData?.steps?.findIndex((item: any) => item?.code === 'PosterActionHandler') !== -1 &&
                appData?.steps?.findIndex((item: any) => item?.code === 'VariableActionHandler') === -1
            ) {
                setStepItem([
                    { icon: <HomeOutlined rev={undefined} />, title: '模版说明' },
                    { icon: <SettingOutlined rev={undefined} />, title: '笔记生成' },
                    { icon: <FileImageOutlined rev={undefined} />, title: '图片生成' },
                    { icon: <UserOutlined rev={undefined} />, title: '生成测试' }
                ]);
            } else {
                setStepItem([
                    { icon: <HomeOutlined rev={undefined} />, title: '模版说明' },
                    { icon: <ContainerOutlined rev={undefined} />, title: '基础信息' },
                    { icon: <SettingOutlined rev={undefined} />, title: '笔记生成' },
                    { icon: <UserOutlined rev={undefined} />, title: '生成测试' }
                ]);
            }
        }
    }, [appData]);

    const getJSON = (item: any) => {
        let obj: any = {};
        try {
            obj = {
                ...JSON.parse(item.inJsonSchema),
                properties: {
                    ...JSON.parse(item.inJsonSchema).properties,
                    ...JSON.parse(item.outJsonSchema)
                }
            };
        } catch (err) {
            obj = {};
        }
        return obj;
    };
    function getjsonschma(json: any, name?: string, jsonType?: string) {
        const arr: any = [];
        const arrList = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10];
        for (const key in json.properties) {
            const property = json.properties[key];
            if (property.type === 'object') {
                const convertedProperty = getjsonschma(property, name);
                arr.push(convertedProperty);
            } else if (property.type === 'array') {
                arr.push(
                    {
                        key: key + 'index',
                        label: key,
                        title: property?.title,
                        desc: property?.description,
                        children: [
                            ...arrList.map((item: number, index: number) => ({
                                key: `${key}[${index}]`,
                                label: `${key}[${index}]`,
                                title: property?.title,
                                desc: property?.description,
                                children: getjsonschma(property?.items, `${name}.${key}[${index}]`)
                            }))
                        ]
                    },
                    {
                        key: name + '.' + key,
                        label: `${key}.list.(*)`,
                        title: property?.title,
                        desc: property?.description,
                        children: getjsonschma(property?.items, `${name}.${key}`, '*')
                    }
                );
            } else {
                arr.push({
                    key: jsonType ? name + '[' + key + ']' : name + '.' + key,
                    label: key,
                    title: property?.title,
                    desc: property?.description,
                    type: jsonType
                });
            }
        }
        return arr;
    }
    const [valOpen, setValOpen] = useState(false);
    const [conOpen, setConOpen] = useState(false);
    const widthRef: any = useRef(null);
    const [popoverWidth, setPopoverWidth] = useState(undefined);
    const [coll, setColl] = useState<any[]>([]);
    useEffect(() => {
        if (widthRef.current) {
            setPopoverWidth(widthRef.current?.offsetWidth);
        }
    }, [widthRef, coll]);
    return (
        <MainCard content={false}>
            <CardContent className="pb-[72px]">
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
                    <Grid item xs={12} sm={12}>
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
                    <Grid item xs={12} sm={6}>
                        <FormControl key={params.tags} color="secondary" size="small" fullWidth>
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
                                        color="secondary"
                                        {...param}
                                        label="标签"
                                        placeholder="请输入标签然后回车"
                                    />
                                )}
                            />
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
                    <Grid item xs={12} sm={6}>
                        <TextField
                            sx={{ mt: 2 }}
                            fullWidth
                            multiline
                            minRows={2}
                            maxRows={4}
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
                    </Grid>
                </Grid>

                <Divider />
                <div className="text-[18px] font-[600]">方案创作</div>
                <div className="flex gap-2 items-end my-[20px]">
                    <TextField
                        label="创作模版"
                        size="small"
                        color="secondary"
                        InputLabelProps={{ shrink: true }}
                        value={appData?.appName}
                        disabled={searchParams.get('uid') ? true : false}
                        onClick={() => {
                            if (!searchParams.get('uid')) {
                                setAppOpen(true);
                            }
                        }}
                    />
                    <div className="text-xs text-black/50">选择创作模版后，进行具体的方案配置</div>
                </div>
                {stepItem?.length > 0 && (
                    <div className="p-4 border border-solid border-black/30 rounded-lg mb-[20px]">
                        <Steps
                            current={current}
                            onChange={(current) => {
                                if (appData) {
                                    setCurrent(current);
                                }
                            }}
                            items={stepItem}
                        />
                    </div>
                )}
                <div>
                    {stepItem[current]?.title === '模版说明' && appData && (
                        <div className="flex">
                            <div className="w-[40%] flex items-center flex-col">
                                <div className="text-lg font-bold">{appData?.appName}</div>
                                <div className="text-xs mt-[10px]">{appData?.description}</div>
                            </div>
                            <div className="w-[1px] bg-black/20 mx-[40px]"></div>
                            <div className="flex-1 w-[60%]">
                                {goodList?.length > 0 && (
                                    <>
                                        <div className="text-[20px] font-bold mb-[10px] text-center">生成示例</div>
                                        <div className="flex justify-center">
                                            <Row gutter={16} className="max-w-[600px]">
                                                {goodList?.map((item) => (
                                                    <Col span={12} key={item?.businessUid}>
                                                        <Goods
                                                            item={item}
                                                            setBusinessUid={setBusinessUid}
                                                            setDetailOpen={setDetailOpen}
                                                            show={true}
                                                        />
                                                    </Col>
                                                ))}
                                            </Row>
                                        </div>
                                    </>
                                )}
                            </div>
                        </div>
                    )}
                    {stepItem[current]?.title === '基础信息' && (
                        <>
                            <div className="mb-[10px] font-bold text-[16px]">
                                模版基础信息
                                <span className="text-xs font-[400] text-black/50">（为了更好的创作内容，请填写AI模版中需要的字段）</span>
                            </div>
                            <Row gutter={20}>
                                <Col md={24} lg={10}>
                                    <Row gutter={10}>
                                        {valueList
                                            ?.find((el) => el.code === 'VariableActionHandler')
                                            ?.variableList?.map((item: any, de: number) => (
                                                <Col key={item?.field} span={24}>
                                                    <Form
                                                        item={item}
                                                        index={de}
                                                        changeValue={(data: any) => {
                                                            const newList = _.cloneDeep(valueList);
                                                            const num = valueList?.findIndex(
                                                                (item) => item.code === 'VariableActionHandler'
                                                            );
                                                            newList[num].variableList[data?.index].value = data.value;
                                                            setValueList(newList);
                                                        }}
                                                        flag={false}
                                                    />
                                                </Col>
                                            ))}
                                    </Row>
                                </Col>
                                <Col md={24} lg={14}>
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
                                </Col>
                            </Row>
                        </>
                    )}
                    {stepItem[current]?.title === '笔记生成' && (
                        <Collapse
                            onChange={(data) => {
                                if (data?.length > 0) {
                                    setColl(data as any[]);
                                }
                            }}
                            bordered={false}
                            style={{ background: 'transparent' }}
                        >
                            {valueList?.map(
                                (el, index) =>
                                    el?.code !== 'VariableActionHandler' &&
                                    el?.code !== 'PosterActionHandler' &&
                                    el?.code !== 'MaterialActionHandler' && (
                                        <Panel
                                            style={{ marginBottom: 20, background: '#fafafa', border: '1px solod #d9d9d9' }}
                                            header={
                                                <div className="relative">
                                                    <span className="text-[18px] font-[600]">
                                                        {appData?.steps?.find((item: any) => item?.code === 'VariableActionHandler')
                                                            ? index - 1
                                                            : index + '.'}{' '}
                                                        {el?.name}
                                                    </span>
                                                    {verifyItem(el).flag && (
                                                        <span className="text-[#ff4d4f] ml-[10px]">（{verifyItem(el)?.content}）</span>
                                                    )}
                                                </div>
                                            }
                                            key={el.code}
                                        >
                                            <>
                                                {/* {el.code === 'MaterialActionHandler' && (
                                                    <Select
                                                        className="w-[200px] border border-solid border-[#d9d9d9] rounded-[6px]"
                                                        size="large"
                                                        value={el.materialType}
                                                        onChange={(data) => {
                                                            console.log(data);
                                                            setValues('materialType', data, index);
                                                        }}
                                                    >
                                                        {materialTypeList.map((i: any) => (
                                                            <Option key={i.value} value={i.value}>
                                                                {i.label}
                                                            </Option>
                                                        ))}
                                                    </Select>
                                                )} */}
                                                {(el.code === 'CustomActionHandler' ||
                                                    el.code === 'ParagraphActionHandler' ||
                                                    el.code === 'TitleActionHandler') && (
                                                    <>
                                                        <div className="text-[16px] mb-[10px] font-[600]">1. 生成模式</div>
                                                        <div>
                                                            <Radio.Group
                                                                value={el.model}
                                                                onChange={(e) => {
                                                                    setValues('model', e.target.value, index);
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
                                                                    tableData={el?.materialList}
                                                                    sourceList={sourceList}
                                                                    code={el?.code}
                                                                    materialType={el?.materialType}
                                                                    setTableData={(data: any) => {
                                                                        setValues('materialList', data, index);
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
                                                                    schemaList={schemaList}
                                                                    setValue={(data: string) => {
                                                                        setValues('requirement', data, index);
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
                                                                            setValues('paragraphCount', data, index);
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
                                                        <div ref={widthRef} className="w-full relative">
                                                            {/* <Input
                                                                size="large"
                                                                status={!el?.title ? 'error' : ''}
                                                                defaultValue={el?.title}
                                                                onBlur={(data) => {
                                                                    setValues('title', data.target.value, index);
                                                                }}
                                                            /> */}
                                                            <VariableInput
                                                                open={valOpen}
                                                                setOpen={setValOpen}
                                                                popoverWidth={popoverWidth}
                                                                handleMenu={({ i, newValue }) => {
                                                                    let newData = _.cloneDeep(el?.title);
                                                                    newData = newValue;
                                                                    setValues('title', newData, index);
                                                                }}
                                                                title="标题"
                                                                items={schemaList}
                                                                index={undefined}
                                                                value={el?.title}
                                                                setValue={(value) => {
                                                                    setValues('title', value, index);
                                                                }}
                                                            />
                                                            {/* <span
                                                                style={{ color: !el?.title ? '#f44336' : '#000' }}
                                                                className=" block bg-[#fff] px-[5px] absolute top-[-10px] left-2 text-[12px] bg-gradient-to-b from-[#fff] to-[#f8fafc]"
                                                            >
                                                                标题
                                                            </span> */}
                                                        </div>
                                                        {!el?.title && (
                                                            <span className="text-[12px] text-[#f44336] mt-[5px] ml-[5px]">标题必填</span>
                                                        )}
                                                        {/* <div className="relative mt-[20px]">
                                                            <TextArea
                                                                status={!el?.content ? 'error' : ''}
                                                                defaultValue={el?.content}
                                                                onBlur={(data) => {
                                                                    setValues('content', data.target.value, index);
                                                                }}
                                                                rows={10}
                                                            />
                                                            <span
                                                                style={{ color: !el?.content ? '#f44336' : '#000' }}
                                                                className=" block bg-[#fff] px-[5px] absolute top-[-10px] left-2 text-[12px] bg-gradient-to-b from-[#fff] to-[#f8fafc]"
                                                            >
                                                                文案拼接配置
                                                            </span>
                                                        </div> */}
                                                        <div ref={widthRef} className="w-full mt-[20px]">
                                                            <VariableInput
                                                                open={conOpen}
                                                                setOpen={setConOpen}
                                                                popoverWidth={popoverWidth}
                                                                handleMenu={({ i, newValue }) => {
                                                                    let newData = _.cloneDeep(el?.content);
                                                                    newData = newValue;
                                                                    setValues('content', newData, index);
                                                                }}
                                                                title="文案拼接配置"
                                                                row={6}
                                                                items={schemaList}
                                                                index={undefined}
                                                                value={el?.content}
                                                                setValue={(value) => {
                                                                    setValues('content', value, index);
                                                                }}
                                                            />
                                                        </div>

                                                        {!el?.content && (
                                                            <span className="text-[12px] text-[#f44336] mt-[5px] ml-[5px]">
                                                                文案拼接配置必填
                                                            </span>
                                                        )}
                                                    </>
                                                )}
                                            </>
                                        </Panel>
                                    )
                            )}
                        </Collapse>
                    )}
                    {stepItem[current]?.title === '图片生成' && (
                        <>
                            <CreateTab
                                appData={appData}
                                mode={valueList?.find((item: any) => item?.code === 'PosterActionHandler')?.mode}
                                schemaList={schemaList}
                                setModel={(data) => {
                                    setValues(
                                        'mode',
                                        data,
                                        valueList?.findIndex((item: any) => item?.code === 'PosterActionHandler')
                                    );
                                }}
                                imageStyleData={valueList?.find((item: any) => item?.code === 'PosterActionHandler')?.styleList}
                                setImageStyleData={(data) => {
                                    setValues(
                                        'styleList',
                                        data,
                                        valueList?.findIndex((item: any) => item?.code === 'PosterActionHandler')
                                    );
                                }}
                                focuActive={focuActive}
                                setFocuActive={setFocuActive}
                                digui={() => {
                                    const newData = valueList
                                        ?.find((item: any) => item?.code === 'PosterActionHandler')
                                        ?.styleList?.map((i: any) => i.name.split(' ')[1]);
                                    if (!newData || newData?.every((i: any) => !i)) {
                                        return 1;
                                    }
                                    return newData?.sort((a: any, b: any) => b - a)[0] * 1 + 1;
                                }}
                            />
                        </>
                    )}
                    {stepItem[current]?.title === '生成测试' && (
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
                                        exeTest();
                                    } else {
                                        handleSave(true);
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
                </div>
                {appData && (
                    <div className="my-[20px] flex justify-center gap-2">
                        <Button type="primary" onClick={() => setCurrent(current - 1)} disabled={current === 0}>
                            上一步
                        </Button>
                        <Button type="primary" onClick={() => setCurrent(current + 1)} disabled={current === 3}>
                            下一步
                        </Button>
                    </div>
                )}
                {appOpen && <SelectApp open={appOpen} imageTypeList={AppList} handleClose={() => setAppOpen(false)} handleOk={handleOk} />}
                {detailOpen && (
                    <DetailModal open={detailOpen} handleClose={() => setDetailOpen(false)} businessUid={businessUid} show={true} />
                )}
            </CardContent>
            <div className="fixed bottom-0 w-full h-[60px] px-4 flex items-center justify-end z-[1000] bg-white border-t border-solid border-black/10">
                <Button className="w-[100px]" size="large" type="primary" onClick={() => handleSave()}>
                    保存
                </Button>
            </div>
        </MainCard>
    );
};
export default AddModal;
