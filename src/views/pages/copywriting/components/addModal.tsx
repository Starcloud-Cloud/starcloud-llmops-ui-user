import {
    IconButton,
    CardContent,
    TextField,
    FormControl,
    InputLabel,
    Select,
    MenuItem,
    FormHelperText,
    CardActions,
    Grid,
    Switch,
    Autocomplete,
    Chip,
    Box,
    Typography,
    FormLabel
} from '@mui/material';
import { InputNumber, Radio } from 'antd';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import KeyboardBackspace from '@mui/icons-material/KeyboardBackspace';
import MainCard from 'ui-component/cards/MainCard';
import SubCard from 'ui-component/cards/SubCard';
import React, { useEffect, useState, useRef } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import {
    UploadProps,
    Upload,
    Table,
    Button,
    Divider,
    Tabs,
    Popover,
    Image,
    TreeSelect,
    Input,
    Popconfirm,
    Spin,
    Modal,
    Collapse,
    Tag
} from 'antd';
import type { ColumnsType } from 'antd/es/table';
import { PlusOutlined, DeleteOutlined, LeftOutlined, InfoCircleOutlined, LoadingOutlined } from '@ant-design/icons';
import { getAccessToken } from 'utils/auth';
import { schemeCreate, schemeGet, schemeModify, schemeMetadata, schemeDemand, schemeExample, appList } from 'api/redBook/copywriting';
import StyleTabs from './styleTabs';
import { dispatch } from 'store';
import { openSnackbar } from 'store/slices/snackbar';
import { v4 as uuidv4 } from 'uuid';
import _ from 'lodash-es';
import copywriting from 'store/copywriting';
import '../index.scss';
import { t } from 'hooks/web/useI18n';
import useUserStore from 'store/user';
import CreateTable from './spliceCmponents/table';
import CreateVariable from './spliceCmponents/variable';
import CreateTab from './spliceCmponents/tab';
type TargetKey = React.MouseEvent | React.KeyboardEvent | string;
const AddModal = () => {
    const { TextArea } = Input;
    const permissions = useUserStore((state) => state.permissions);
    const { tableList, setTableList } = copywriting();
    const location = useLocation();
    const navigate = useNavigate();
    const searchParams = new URLSearchParams(location.search);
    // 1.模板名称
    const [params, setParams] = useState<any>({
        mode: 'RANDOM_IMAGE_TEXT'
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
    const [paragraphCount, setparagraphCount] = useState<null | number>(1);
    //风格类型
    const [typeList, setTypeList] = useState<any[]>([]);
    //类目列表
    const [categoryList, setCategoryList] = useState<any[]>([]);
    //参考来源列表
    const [sourceList, setSourceList] = useState<any[]>([]);

    const [tableData, setTableData] = useState<any[]>([]);
    //新增文案与风格
    const [focuActive, setFocuActive] = useState<any[]>([]);
    const [imageStyleData, setImageStyleData] = useState<any[]>([
        {
            name: '风格 1',
            key: '1',
            id: '1',
            templateList: [
                {
                    key: '1',
                    name: '首图',
                    variables: []
                }
            ]
        }
    ]);

    const digui = () => {
        const newData = imageStyleData.map((item) => item.name.split(' ')[1]);
        if (newData.every((item) => !item)) {
            return 1;
        }
        return newData?.sort((a, b) => b - a)[0] * 1 + 1;
    };

    //文案生成模板
    const [copyWritingTemplate, setCopyWritingTemplate] = useState<any>({});

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
                    if (res.mode !== 'CUSTOM_IMAGE_TEXT') {
                        setRows(res.configuration?.copyWritingTemplate?.variables);
                        setTableData(res.refers);
                        setTestImageList(
                            res.useImages?.map((item: any) => {
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
                        setTestTableList(res.configuration.copyWritingTemplate.example);
                        setCopyWritingTemplate(res.configuration.copyWritingTemplate);
                        setImageStyleData(res.configuration.imageTemplate.styleList);
                        setparagraphCount(res.configuration.paragraphCount);
                    } else {
                        setSplitValue(res.customConfiguration?.appUid);
                        valueListRef.current = res.customConfiguration?.steps;
                        setValueList(valueListRef.current);
                    }
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

    const valueRef: any = useRef('');
    const [valueLoading, setValueLoading] = useState(false);
    const [buttonLoading, setButtonLoading] = useState(false);
    const testColumn: ColumnsType<any> = [
        {
            title: '标题',
            render: (_, row, index) => <span>{row?.copyWriting?.title}</span>
        },
        {
            title: '内容',
            render: (_, row) => <span>{row?.copyWriting?.content}</span>
        },
        {
            title: '图片标题',
            render: (_, row) => <span>{row?.copyWriting?.imgTitle}</span>
        },
        {
            title: '图片副标题',
            render: (_, row) => <span>{row?.copyWriting?.imgSubTitle}</span>
        },
        {
            title: '图片内容',
            render: (_, row) => (
                <div className="flex gap-2">
                    {row?.images?.map((item: any) => (
                        <Image width={50} height={50} key={item?.url} src={item?.url} preview={false} />
                    ))}
                </div>
            )
        }
    ];
    //测试
    const [testOpen, setTestOpen] = useState(false);
    const [testTableList, setTestTableList] = useState<any[]>([]);
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

    //校验
    const verify = (flag?: boolean) => {
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
        if (!copyWritingTemplate.summary) {
            setPre(pre + 1);
            setSummaryOpen(true);
            dispatch(
                openSnackbar({
                    open: true,
                    message: '参考文案分析必填',
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
        if (!copyWritingTemplate.demand) {
            dispatch(
                openSnackbar({
                    open: true,
                    message: '文案生成要求必填',
                    variant: 'alert',
                    alert: {
                        color: 'error'
                    },
                    anchorOrigin: { vertical: 'top', horizontal: 'center' },
                    transition: 'SlideDown',
                    close: false
                })
            );
            setPre(pre + 1);
            setSummaryOpen(true);
            return false;
        }
        if (imageStyleData?.length === 0) {
            dispatch(
                openSnackbar({
                    open: true,
                    message: '图片生成模板中最少添加一个风格',
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
        if (imageStyleData?.map((i) => i?.templateList?.some((item: any) => !item.id))?.some((el) => el)) {
            dispatch(
                openSnackbar({
                    open: true,
                    message: '图片生成模板风格必选',
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
        if (flag && (!testImageList || testImageList.length === 0)) {
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
        return true;
    };
    //保存
    const handleSave = () => {
        if (params.mode !== 'CUSTOM_IMAGE_TEXT' && verify()) {
            if (searchParams.get('uid')) {
                schemeModify({
                    uid: searchParams.get('uid'),
                    ...params,
                    type: params.type ? 'SYSTEM' : 'USER',
                    refers: tableData,
                    configuration: {
                        copyWritingTemplate: {
                            ...copyWritingTemplate,
                            example: testTableList,
                            variables: rows
                        },
                        imageTemplate: {
                            styleList: imageStyleData
                        },
                        paragraphCount: params.mode === 'PRACTICAL_IMAGE_TEXT' ? paragraphCount : null
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
                refers: tableData,
                configuration: {
                    copyWritingTemplate: {
                        ...copyWritingTemplate,
                        example: testTableList,
                        variables: rows
                    },
                    imageTemplate: {
                        styleList: imageStyleData
                    },
                    paragraphCount: params.mode === 'PRACTICAL_IMAGE_TEXT' ? paragraphCount : null
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
        } else if (params.mode === 'CUSTOM_IMAGE_TEXT') {
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
            if (searchParams.get('uid')) {
                schemeModify({
                    uid: searchParams.get('uid'),
                    ...params,
                    type: params.type ? 'SYSTEM' : 'USER',
                    customConfiguration: {
                        ...splitList.filter((item) => item.appUid === splitValue)[0],
                        steps: valueList
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
                customConfiguration: {
                    ...splitList.filter((item) => item.appUid === splitValue)[0],
                    steps: valueList
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
        }
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

        setValueList(newData);
    };
    return (
        // <Modals open={detailOpen} aria-labelledby="modal-title" aria-describedby="modal-description">
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
                    <SubCard
                        sx={{
                            mb: 1,
                            cursor: searchParams.get('uid') ? 'not-allowed' : 'pointer',
                            borderColor: params.mode === 'RANDOM_IMAGE_TEXT' ? '#673ab7' : 'rgba(230,230,231,1)'
                        }}
                        contentSX={{ p: '10px !important', width: '200px' }}
                    >
                        <Box
                            onClick={() => {
                                if (!searchParams.get('uid')) {
                                    setParams({ ...params, mode: 'RANDOM_IMAGE_TEXT' });
                                }
                            }}
                        >
                            <Typography variant="h4" mb={1}>
                                图文随机组合
                            </Typography>
                            <Typography height="48px" className="line-clamp-3" color="#697586" fontSize="12px">
                                {'根据参考文案，自动生成相似内容，并根据上传的图片自动替换风格模版中的图片'}
                            </Typography>
                        </Box>
                    </SubCard>
                    <SubCard
                        sx={{
                            mb: 1,
                            borderColor: params.mode === 'PRACTICAL_IMAGE_TEXT' ? '#673ab7' : 'rgba(230,230,231,1)',
                            cursor: searchParams.get('uid') ? 'not-allowed' : 'pointer'
                        }}
                        contentSX={{ p: '10px !important', width: '200px' }}
                    >
                        <Box
                            onClick={() => {
                                if (!searchParams.get('uid')) {
                                    setParams({ ...params, mode: 'PRACTICAL_IMAGE_TEXT' });
                                }
                            }}
                        >
                            <Typography variant="h4" mb={1}>
                                干货文生成
                            </Typography>
                            <Typography height="48px" className="line-clamp-3" color="#697586" fontSize="12px">
                                {'根据话题 和 参考文案，自动生成认知文，每个段落随机适配一张风格图片，会生成多个段落和多张图'}
                            </Typography>
                        </Box>
                    </SubCard>
                    {/* <SubCard
                        sx={{
                            mb: 1,
                            borderColor: params.mode === 'CUSTOM_IMAGE_TEXT' ? '#673ab7' : 'rgba(230,230,231,1)',
                            cursor: searchParams.get('uid') ? 'not-allowed' : 'pointer'
                        }}
                        contentSX={{ p: '10px !important', width: '200px' }}
                    >
                        <Box
                            onClick={() => {
                                if (!searchParams.get('uid')) {
                                    setParams({ ...params, mode: 'CUSTOM_IMAGE_TEXT' });
                                }
                            }}
                        >
                            <Typography variant="h4" mb={1}>
                                自定义内容拼接生成
                            </Typography>
                            <Typography height="48px" className="line-clamp-3" color="#697586" fontSize="12px">
                                {'根据话题 和 参考文案，自动生成认知文，每个段落随机适配一张风格图片，会生成多个段落和多张图'}
                            </Typography>
                        </Box>
                    </SubCard> */}
                </div>
                {params.mode !== 'CUSTOM_IMAGE_TEXT' ? (
                    <Collapse
                        bordered={false}
                        style={{ background: 'transparent' }}
                        items={[
                            {
                                key: '1',
                                style: { marginBottom: 20, background: '#fafafa', border: '1px solod #d9d9d9' },
                                label: (
                                    <div className="relative">
                                        1.参考内容
                                        {oneLoading && tableData?.length === 0 && (
                                            <span className="text-[#ff4d4f] ml-[10px]">（参考内容最少添加一个）</span>
                                        )}
                                        {oneLoading && tableData?.length === 0 && (
                                            <div className="absolute h-[46px] w-[7px] bg-[#ff4d4f] left-[-40px] top-[-12px] rounded-sm"></div>
                                        )}
                                    </div>
                                ),
                                children: (
                                    <>
                                        <CreateTable
                                            tableData={tableData}
                                            sourceList={sourceList}
                                            setTableData={setTableData}
                                            params={params}
                                        />
                                    </>
                                )
                            },
                            {
                                key: '2',
                                style: {
                                    marginBottom: 20,
                                    background: '#fafafa',
                                    border: '1px solod #d9d9d9'
                                },
                                label: (
                                    <div className="relative">
                                        2.文案生成模板
                                        {oneLoading && !copyWritingTemplate.summary && (
                                            <span className="text-[#ff4d4f] ml-[10px]">（参考文案分析必填）</span>
                                        )}
                                        {oneLoading && !copyWritingTemplate.demand && (
                                            <span className="text-[#ff4d4f] ml-[10px]">（文案生成要求必填）</span>
                                        )}
                                        {oneLoading && (!copyWritingTemplate.summary || !copyWritingTemplate.demand) && (
                                            <div className="absolute h-[46px] w-[7px] bg-[#ff4d4f] left-[-40px] top-[-12px] rounded-sm"></div>
                                        )}
                                    </div>
                                ),
                                children: (
                                    <div>
                                        <div className="flex justify-between items-end mb-[10px]">
                                            <div className="text-[16px] font-[600]">参考文案分析</div>
                                            <Button
                                                disabled={buttonLoading}
                                                onClick={async () => {
                                                    setSummaryOpen(false);
                                                    if (!params.name) {
                                                        setTitleOpen(true);
                                                        setCategoryOpen(true);
                                                        setTagOpen(true);
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
                                                    setButtonLoading(true);
                                                    setValueLoading(true);
                                                    const result: any = await schemeDemand({
                                                        ...params,
                                                        type: params.type ? 'SYSTEM' : 'USER',
                                                        refers: tableData
                                                    });
                                                    const reader = result.getReader();
                                                    const textDecoder = new TextDecoder();
                                                    valueRef.current = '';
                                                    setCopyWritingTemplate({
                                                        ...copyWritingTemplate,
                                                        summary: ''
                                                    });
                                                    let outerJoins: any;
                                                    while (1) {
                                                        let joins = outerJoins;
                                                        const { done, value } = await reader.read();
                                                        setValueLoading(false);
                                                        if (done) {
                                                            setButtonLoading(false);
                                                            break;
                                                        }
                                                        let str = textDecoder.decode(value);
                                                        const lines = str.split('\n');
                                                        lines.forEach((message, i: number) => {
                                                            if (i === 0 && joins) {
                                                                message = joins + message;
                                                                joins = undefined;
                                                            }
                                                            if (i === lines.length - 1) {
                                                                if (message && message.indexOf('}') === -1) {
                                                                    joins = message;
                                                                    return;
                                                                }
                                                            }
                                                            if (message.indexOf('"code":400') !== -1) {
                                                                setButtonLoading(false);
                                                                dispatch(
                                                                    openSnackbar({
                                                                        open: true,
                                                                        message: JSON.parse(message)?.msg,
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
                                                            let bufferObj;
                                                            if (message?.startsWith('data:')) {
                                                                bufferObj = message.substring(5) && JSON.parse(message.substring(5));
                                                            }
                                                            if (bufferObj?.code === 200 && bufferObj.type !== 'ads-msg') {
                                                                valueRef.current = valueRef.current + bufferObj.content;
                                                                setCopyWritingTemplate({
                                                                    ...copyWritingTemplate,
                                                                    summary: valueRef.current
                                                                });
                                                            } else if (bufferObj?.code === 200 && bufferObj.type === 'ads-msg') {
                                                                dispatch(
                                                                    openSnackbar({
                                                                        open: true,
                                                                        message: bufferObj.content,
                                                                        variant: 'alert',
                                                                        alert: {
                                                                            color: 'success'
                                                                        },
                                                                        anchorOrigin: { vertical: 'top', horizontal: 'center' },
                                                                        transition: 'SlideDown',
                                                                        close: false
                                                                    })
                                                                );
                                                            } else if (
                                                                bufferObj &&
                                                                bufferObj.code !== 200 &&
                                                                bufferObj.code !== 300900000
                                                            ) {
                                                                dispatch(
                                                                    openSnackbar({
                                                                        open: true,
                                                                        message: t('market.warning'),
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
                                                        });
                                                        outerJoins = joins;
                                                    }
                                                }}
                                                type="primary"
                                            >
                                                AI分析参考文案
                                            </Button>
                                        </div>
                                        <div className="relative">
                                            <TextArea
                                                status={summaryOpen && !copyWritingTemplate.summary ? 'error' : ''}
                                                style={{ height: '300px' }}
                                                value={copyWritingTemplate.summary}
                                                onChange={(e) => {
                                                    setCopyWritingTemplate({
                                                        ...copyWritingTemplate,
                                                        summary: e.target.value
                                                    });
                                                }}
                                            />
                                            {summaryOpen && !copyWritingTemplate.summary && (
                                                <span className="text-[12px] text-[#f44336] mt-[5px] ml-[5px]">参考文案分析必填</span>
                                            )}
                                            {valueLoading && (
                                                <div className="w-full h-full absolute flex justify-center items-center top-0 bg-[#000]/40">
                                                    <Spin
                                                        spinning={valueLoading}
                                                        indicator={<LoadingOutlined rev={undefined} style={{ fontSize: 30 }} spin />}
                                                    />
                                                </div>
                                            )}
                                        </div>
                                        <CreateVariable
                                            pre={pre}
                                            value={copyWritingTemplate.demand}
                                            setValue={(data) => {
                                                setCopyWritingTemplate({
                                                    ...copyWritingTemplate,
                                                    demand: data
                                                });
                                            }}
                                            rows={rows}
                                            setRows={setRows}
                                        />
                                        {params.mode === 'PRACTICAL_IMAGE_TEXT' && (
                                            <div className="relative mt-[20px]">
                                                <InputNumber
                                                    size="large"
                                                    className="w-[300px] bg-[#f8fafc]"
                                                    min={1}
                                                    value={paragraphCount}
                                                    onChange={(value: number | null) => {
                                                        setparagraphCount(value);
                                                    }}
                                                />
                                                <span className=" block bg-[#fff] px-[5px] absolute top-[-7px] left-2 text-[12px] bg-gradient-to-b from-[#fff] to-[#f8fafc]">
                                                    文案段落数量
                                                </span>
                                            </div>
                                        )}
                                    </div>
                                )
                            },
                            {
                                key: '3',
                                style: {
                                    background: '#fafafa',
                                    border: '1px solod #d9d9d9'
                                },
                                label: (
                                    <div className="relative">
                                        3.图片生成模板
                                        {oneLoading && imageStyleData?.length === 0 && (
                                            <span className="text-[#ff4d4f] ml-[10px]">（最少添加一个风格）</span>
                                        )}
                                        {oneLoading &&
                                            imageStyleData
                                                ?.map((i) => i?.templateList?.some((item: any) => !item.id))
                                                ?.some((el) => el) && <span className="text-[#ff4d4f] ml-[10px]">（图片风格必选）</span>}
                                        {oneLoading &&
                                            (imageStyleData?.length === 0 ||
                                                imageStyleData
                                                    ?.map((i) => i?.templateList?.some((item: any) => !item.id))
                                                    ?.some((el) => el)) && (
                                                <div className="absolute h-[46px] w-[7px] bg-[#ff4d4f] left-[-40px] top-[-12px] rounded-sm"></div>
                                            )}
                                    </div>
                                ),
                                children: (
                                    <CreateTab
                                        imageStyleData={imageStyleData}
                                        setImageStyleData={setImageStyleData}
                                        focuActive={focuActive}
                                        setFocuActive={setFocuActive}
                                        digui={digui}
                                    />
                                )
                            }
                        ]}
                    />
                ) : (
                    <div>
                        <FormControl fullWidth>
                            <FormLabel>选择应用</FormLabel>
                            <Select
                                label="选择应用"
                                name="source"
                                value={splitValue}
                                onChange={(e) => {
                                    setChangeFalg(false);
                                    setSplitValue(e.target.value);
                                }}
                            >
                                {splitList.map((item) => (
                                    <MenuItem key={item.appUid} value={item.appUid}>
                                        {item.appName}
                                    </MenuItem>
                                ))}
                            </Select>
                        </FormControl>
                        {valueList?.map((el: any, index: number) => (
                            <div>
                                {
                                    <>
                                        {(el.code === 'ContentActionHandler' || el.code === 'ParagraphActionHandler') && (
                                            <SubCard sx={{ mt: 2 }}>
                                                <div className="text-[18px] mb-[20px] font-[600]">{el?.name}</div>
                                                <div className="text-[14px] mb-[10px] font-[600]">1.参考文案</div>
                                                <CreateTable
                                                    tableData={el?.referList}
                                                    sourceList={sourceList}
                                                    setTableData={(data) => setValues('referList', data, index)}
                                                    params={params}
                                                />
                                                <div className="text-[14px] my-[10px] font-[600]">2. 生成模式</div>
                                                <Radio.Group
                                                    value={el.model}
                                                    onChange={(e) => {
                                                        setValues('model', e.target.value, index);
                                                    }}
                                                >
                                                    {modeList?.map((item) => (
                                                        <Radio key={item.value} value={item.value}>
                                                            {item.label}
                                                        </Radio>
                                                    ))}
                                                </Radio.Group>
                                                <CreateVariable
                                                    pre={pre}
                                                    value={el?.requirement}
                                                    setValue={(data: string) => setValues('requirement', data, index)}
                                                    rows={el?.variableList}
                                                    setRows={(data: any[]) => setValues('variableList', data, index)}
                                                />
                                                {el.code === 'ParagraphActionHandler' && (
                                                    <div className="relative mt-[20px]">
                                                        <InputNumber
                                                            size="large"
                                                            className="w-[300px] bg-[#f8fafc]"
                                                            min={1}
                                                            value={el?.paragraphCount}
                                                            onChange={(data) => setValues('paragraphCount', data, index)}
                                                        />
                                                        <span className=" block bg-[#fff] px-[5px] absolute top-[-7px] left-2 text-[12px] bg-gradient-to-b from-[#fff] to-[#f8fafc]">
                                                            文案段落数量
                                                        </span>
                                                    </div>
                                                )}
                                            </SubCard>
                                        )}
                                        {el.code === 'AssembleActionHandler' && (
                                            <SubCard sx={{ mt: 2 }}>
                                                <div className="text-[18px] mb-[20px] font-[600]">{el?.name}</div>
                                                <div className="relative">
                                                    <TextArea
                                                        defaultValue={el?.requirement}
                                                        onBlur={(data) => setValues('requirement', data.target.value, index)}
                                                        rows={4}
                                                    />
                                                    <span className=" block bg-[#fff] px-[5px] absolute top-[-10px] left-2 text-[12px] bg-gradient-to-b from-[#fff] to-[#f8fafc]">
                                                        文案拼接配置
                                                    </span>
                                                </div>
                                            </SubCard>
                                        )}
                                        {el.code === 'PosterActionHandler' && (
                                            <SubCard sx={{ mt: 2 }}>
                                                <div className="text-[18px] mb-[20px] font-[600]">{el?.name}</div>
                                                <CreateTab
                                                    imageStyleData={el?.styleList}
                                                    setImageStyleData={(data) => setValues('styleList', data, index)}
                                                    focuActive={focuActive}
                                                    setFocuActive={setFocuActive}
                                                    digui={digui}
                                                />
                                            </SubCard>
                                        )}
                                    </>
                                }
                            </div>
                        ))}
                    </div>
                )}
                <Divider />
                <div className="text-[18px] my-[20px] font-[600]">测试生成</div>
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
                        if (verify(true)) {
                            setTestOpen(true);
                            try {
                                schemeExample({
                                    ...params,
                                    type: params.type ? 'SYSTEM' : 'USER',
                                    refers: tableData,
                                    configuration: {
                                        copyWritingTemplate: {
                                            ...copyWritingTemplate,
                                            example: testTableList,
                                            variables: rows
                                        },
                                        imageTemplate: {
                                            styleList: imageStyleData
                                        },
                                        paragraphCount: params.mode === 'PRACTICAL_IMAGE_TEXT' ? paragraphCount : null
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
                                        setTestTableList(res);
                                    })
                                    .catch((err) => {
                                        setTestOpen(false);
                                    });
                            } catch (err) {
                                setTestOpen(false);
                            }
                        }
                    }}
                    loading={testOpen}
                    className="mt-[20px]"
                    type="primary"
                >
                    测试生成
                </Button>
                {testTableList?.length > 0 && (
                    <Table
                        className="mt-[20px]"
                        scroll={{ y: 500 }}
                        rowKey={'title'}
                        size="small"
                        columns={testColumn}
                        dataSource={testTableList}
                    />
                )}
                <Divider />
                <CardActions>
                    <Grid container justifyContent="flex-end">
                        <Button type="primary" onClick={handleSave}>
                            保存
                        </Button>
                    </Grid>
                </CardActions>
            </CardContent>
        </MainCard>
        // </Modals>
    );
};
export default AddModal;
