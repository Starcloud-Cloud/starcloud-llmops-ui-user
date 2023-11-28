import {
    Modal as Modals,
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
    Tooltip,
    FormControlLabel,
    TableContainer,
    TableHead,
    Table as Tables,
    TableRow,
    TableCell,
    TableBody,
    Button as Buttons
} from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import ErrorIcon from '@mui/icons-material/Error';
import AddIcon from '@mui/icons-material/Add';
import SettingsIcon from '@mui/icons-material/Settings';
import DeleteIcon from '@mui/icons-material/Delete';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import KeyboardBackspace from '@mui/icons-material/KeyboardBackspace';
import MainCard from 'ui-component/cards/MainCard';
import SubCard from 'ui-component/cards/SubCard';
import React, { useEffect, useState, useRef } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { UploadProps, Upload, Table, Button, Divider, Tabs, Popover, Image, TreeSelect, Input, Popconfirm, Spin } from 'antd';
import type { ColumnsType } from 'antd/es/table';
import { PlusOutlined, DeleteOutlined, LeftOutlined, InfoCircleOutlined, LoadingOutlined } from '@ant-design/icons';
import { getAccessToken } from 'utils/auth';
import { imageTemplates } from 'api/template';
import { schemeCreate, schemeGet, schemeModify, schemeMetadata, schemeDemand, schemeExample } from 'api/redBook/copywriting';
import imgLoading from 'assets/images/picture/loading.gif';
import StyleTabs from './styleTabs';
import { dispatch } from 'store';
import { openSnackbar } from 'store/slices/snackbar';
import { v4 as uuidv4 } from 'uuid';
import _ from 'lodash-es';
import copywriting from 'store/copywriting';
import '../index.scss';
import { t } from 'hooks/web/useI18n';
import VariableModal from './variableModal';
import useUserStore from 'store/user';
type TargetKey = React.MouseEvent | React.KeyboardEvent | string;
const AddModal = () => {
    const permissions = useUserStore((state) => state.permissions);
    const { tableList, setTableList } = copywriting();
    const location = useLocation();
    const navigate = useNavigate();
    const searchParams = new URLSearchParams(location.search);
    // 1.模板名称
    const [params, setParams] = useState<any>({});
    const [titleOpen, setTitleOpen] = useState(false);
    const [tagOpen, setTagOpen] = useState(false);
    const [categoryOpen, setCategoryOpen] = useState(false);
    const changeParams = (data: any) => {
        setParams({
            ...params,
            [data.name]: data.value
        });
    };
    //风格类型
    const [typeList, setTypeList] = useState<any[]>([]);
    //类目列表
    const [categoryList, setCategoryList] = useState<any[]>([]);
    //参考来源列表
    const [sourceList, setSourceList] = useState<any[]>([]);
    const columns: ColumnsType<any> = [
        {
            title: '参考标题',
            dataIndex: 'title'
        },
        {
            title: '参考内容',
            width: '40%',
            dataIndex: 'content',
            render: (_, row) => <div className="line-clamp-3">{row.content}</div>
        },
        {
            title: '参考图片',
            key: 'images',
            render: (_, row) => (
                <div className="flex wrap gap-2">
                    {row.images?.map((item: any, index: number) => (
                        <Image className="mr-[5px]" key={index} width={30} height={30} preview={false} src={item.url} />
                    ))}
                </div>
            )
        },
        {
            title: '参考来源',
            render: (_, row) => <div>{sourceList?.filter((item: any) => item.value === row.source)[0]?.label}</div>
        },
        {
            title: '参考链接地址',
            dataIndex: 'link',
            key: 'link'
        },
        {
            title: '操作',
            width: 140,
            key: 'action',
            render: (_, row, index) => (
                <div className="whitespace-nowrap">
                    <Buttons
                        color="secondary"
                        size="small"
                        onClick={() => {
                            setRowIndex(index);
                            setAccoutQuery({
                                ...row,
                                fileList: row?.images?.map((item: any) => {
                                    return {
                                        uid: uuidv4(),
                                        percent: 100,
                                        thumbUrl: item?.url,
                                        response: {
                                            data: {
                                                url: item?.url
                                            }
                                        }
                                    };
                                })
                            });
                            setImageContent(
                                row?.images?.map((item: any) => {
                                    return item.title;
                                })
                            );
                            setImageSubContent(
                                row?.images?.map((item: any) => {
                                    return item.subTitle;
                                })
                            );
                            setAddTitle('编辑参考账号');
                            setAddOpen(true);
                        }}
                    >
                        编辑
                    </Buttons>
                    <Buttons
                        onClick={() => {
                            const newList = JSON.parse(JSON.stringify(tableData));
                            newList.splice(rowIndex, 1);
                            setTableData(newList);
                        }}
                        color="error"
                        size="small"
                    >
                        删除
                    </Buttons>
                </div>
            )
        }
    ];
    const [addOpen, setAddOpen] = useState(false);
    const [rowIndex, setRowIndex] = useState(-1);
    const [tableData, setTableData] = useState<any[]>([]);
    //新增文案与风格
    const [activeKey, setActiveKey] = useState('1');
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
    const onChange = (newActiveKey: string) => {
        setActiveKey(newActiveKey);
    };
    const digui = () => {
        const newData = imageStyleData.map((item) => item.name.split(' ')[1]);
        if (newData.every((item) => !item)) {
            return 1;
        }
        return newData?.sort((a, b) => b - a)[0] * 1 + 1;
    };

    //文案生成模板
    const [copyWritingTemplate, setCopyWritingTemplate] = useState<any>({});
    //modal
    const [addTitle, setAddTitle] = useState('');
    const [accoutQuery, setAccoutQuery] = useState<any>({});
    const [sourceOpen, setSourceOpen] = useState(false);
    const [valueOpen, setValueOpen] = useState(false);
    const [contentOpen, setContentOpen] = useState(false);
    const props: UploadProps = {
        name: 'image',
        listType: 'picture-card',
        multiple: true,
        showUploadList: false,
        fileList: accoutQuery.fileList,
        action: `${process.env.REACT_APP_BASE_URL}${process.env.REACT_APP_API_URL}/llm/image/uploadLimitPixel`,
        headers: {
            Authorization: 'Bearer ' + getAccessToken()
        },
        maxCount: 20,
        onChange(info) {
            console.log(info);

            setAccoutQuery({
                ...accoutQuery,
                fileList: info.fileList
            });
        },
        onDrop(e) {
            console.log('Dropped files', e.dataTransfer.files);
        }
    };
    const [imageConent, setImageContent] = useState<any[]>([]);
    const [imageSubConent, setImageSubContent] = useState<any[]>([]);
    useEffect(() => {
        imageTemplates().then((res) => {
            setTypeList(res);
        });
        schemeMetadata().then((res) => {
            setCategoryList(res.category);
            setSourceList(res.refersSource);
        });
    }, []);
    useEffect(() => {
        if (!addOpen) {
            setValueOpen(false);
            setContentOpen(false);
            setAccoutQuery({
                source: 'SMALL_RED_BOOK'
            });
            setImageContent([]);
            setImageSubContent([]);
        }
    }, [addOpen]);
    //改变值
    const changeAccoutQuery = (data: { name: string; value: number | string }) => {
        setAccoutQuery({
            ...accoutQuery,
            [data.name]: data.value
        });
    };
    useEffect(() => {
        if (searchParams.get('uid')) {
            schemeGet(searchParams.get('uid')).then((res) => {
                if (res) {
                    setRows(res.configuration?.copyWritingTemplate?.variables);
                    setParams({
                        name: res.name,
                        category: res.category,
                        tags: res.tags,
                        type: res.type === 'USER' ? false : true,
                        description: res.description
                    });
                    setTableData(res.refers);
                    setTestTableList(res.configuration.copyWritingTemplate.example);
                    setCopyWritingTemplate(res.configuration.copyWritingTemplate);
                    setImageStyleData(res.configuration.imageTemplate.styleList);
                }
            });
        } else {
            setTableData(tableList);
        }
    }, []);
    const iptRef: any = useRef(null);
    const [current, setCurrent] = useState(1);
    const [pageSize, setPageSize] = useState(20);
    const [rows, setRows] = useState<any[]>([]);
    const [title, setTitle] = useState('');
    const [variableOpen, setVariableOpen] = useState(false);
    const [summaryOpen, setSummaryOpen] = useState(false);
    const [varIndex, setVarIndex] = useState(-1);
    const [itemData, setItemData] = useState<any>({});
    const saveContent = (data: any) => {
        if (title === '增加变量') {
            setRows([...rows, data]);
            setVariableOpen(false);
        } else {
            const newList = _.cloneDeep(rows);
            newList[varIndex] = data;
            setRows(newList);
            setVariableOpen(false);
        }
    };
    const valueRef: any = useRef('');
    const [valueLoading, setValueLoading] = useState(false);
    const [buttonLoading, setButtonLoading] = useState(false);
    const testColumn: ColumnsType<any> = [
        {
            title: '标题',
            dataIndex: 'title'
        },
        {
            title: '内容',
            width: '60%',
            dataIndex: 'content'
        }
    ];
    const [testOpen, setTestOpen] = useState(false);
    const [testTableList, setTestTableList] = useState<any[]>([]);
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
                        <span className="text-[#673ab7] font-[500]">- {'新建创作方案'}</span>
                    </div>
                    <div></div>
                </SubCard>
                <Grid sx={{ ml: 0 }} container>
                    <Grid item md={12} sm={12}>
                        <TextField
                            sx={{ width: '300px', mt: 2 }}
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
                <div className="flex justify-between items-center mt-[20px]">
                    <div className="text-[18px] font-[600]">参考内容</div>
                    <Button
                        onClick={() => {
                            setAddTitle('新增参考账号');
                            setAddOpen(true);
                        }}
                        className="mb-[20px]"
                        type="primary"
                        icon={<PlusOutlined rev={undefined} />}
                    >
                        新增
                    </Button>
                </div>
                <Table
                    pagination={{
                        current,
                        pageSize,
                        total: tableData.length,
                        showSizeChanger: true,
                        pageSizeOptions: [20, 50, 100],
                        onChange: (data) => {
                            setCurrent(data);
                        },
                        onShowSizeChange: (data, size) => {
                            setPageSize(size);
                        }
                    }}
                    rowKey={'title'}
                    scroll={{ y: 500 }}
                    size="small"
                    columns={columns}
                    dataSource={tableData}
                />
                <div className="text-[18px] font-[600] my-[20px]">生成配置</div>
                <Tabs
                    activeKey={activeKey}
                    items={[
                        {
                            key: '1',
                            label: '文案生成模板',
                            children: (
                                <div>
                                    <div className="flex justify-between items-end mb-[10px]">
                                        <div className="text-[16px] font-[600]">参考文案分析</div>
                                        <Button
                                            disabled={buttonLoading}
                                            onClick={async () => {
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
                                                            close: false
                                                        })
                                                    );
                                                    return false;
                                                }
                                                if (
                                                    imageStyleData
                                                        ?.map((i) => i?.templateList?.some((item: any) => !item.id))
                                                        ?.some((el) => el)
                                                ) {
                                                    dispatch(
                                                        openSnackbar({
                                                            open: true,
                                                            message: '图片生成模板风格必选',
                                                            variant: 'alert',
                                                            alert: {
                                                                color: 'error'
                                                            },
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
                                                    refers: tableData,
                                                    configuration: {
                                                        copyWritingTemplate: {
                                                            ...copyWritingTemplate,
                                                            example: testTableList,
                                                            variables: rows
                                                        },
                                                        imageTemplate: {
                                                            styleList: imageStyleData
                                                        }
                                                    }
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
                                                                    close: false
                                                                })
                                                            );
                                                        } else if (bufferObj && bufferObj.code !== 200 && bufferObj.code !== 300900000) {
                                                            dispatch(
                                                                openSnackbar({
                                                                    open: true,
                                                                    message: t('market.warning'),
                                                                    variant: 'alert',
                                                                    alert: {
                                                                        color: 'error'
                                                                    },
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
                                        <TextField
                                            color="secondary"
                                            inputRef={iptRef}
                                            placeholder={''}
                                            value={copyWritingTemplate.summary}
                                            required
                                            name="summary"
                                            multiline
                                            minRows={4}
                                            maxRows={4}
                                            InputLabelProps={{ shrink: true }}
                                            error={summaryOpen && !copyWritingTemplate.summary}
                                            helperText={summaryOpen && !copyWritingTemplate.summary ? '参考文案分析必填' : ''}
                                            onChange={(e) => {
                                                setCopyWritingTemplate({
                                                    ...copyWritingTemplate,
                                                    summary: e.target.value
                                                });
                                            }}
                                            fullWidth
                                        />
                                        {valueLoading && (
                                            <div className="w-full h-full absolute flex justify-center items-center top-0 bg-[#000]/40">
                                                <Spin
                                                    spinning={valueLoading}
                                                    indicator={<LoadingOutlined rev={undefined} style={{ fontSize: 30 }} spin />}
                                                />
                                            </div>
                                        )}
                                    </div>
                                    <div className="mt-[20px] mb-[10px] text-[16px] font-[600] flex items-end">
                                        文案生成要求
                                        <span className="text-[12px] text-[#15273799]">
                                            （对生成的文案内容就行自定义要求，直接告诉AI你想怎么改文案）
                                        </span>
                                        <Popover
                                            placement="top"
                                            title="可以这样提要求"
                                            content={
                                                <div>
                                                    <div>把品牌替换为 "xxxxxx"</div>
                                                    <div>把价格替换为 "20-50元"</div>
                                                    <div>使用更夸张的表达方式</div>
                                                </div>
                                            }
                                        >
                                            <ErrorIcon sx={{ cursor: 'pointer', fontSize: '16px' }} fontSize="small" />
                                        </Popover>
                                    </div>
                                    <TextField
                                        color="secondary"
                                        inputRef={iptRef}
                                        placeholder={''}
                                        value={copyWritingTemplate.demand}
                                        required
                                        name="demand"
                                        multiline
                                        minRows={4}
                                        maxRows={4}
                                        InputLabelProps={{ shrink: true }}
                                        onChange={(e) => {
                                            setCopyWritingTemplate({
                                                ...copyWritingTemplate,
                                                demand: e.target.value
                                            });
                                        }}
                                        fullWidth
                                    />
                                    <Box>
                                        <div className="my-[10px] font-[600]">点击变量，增加到文案生成要求</div>
                                        {rows.length > 0 &&
                                            rows?.map((item, index: number) => (
                                                <Tooltip key={index} placement="top" title={t('market.fields')}>
                                                    <Chip
                                                        sx={{ mr: 1, mt: 1 }}
                                                        size="small"
                                                        color="primary"
                                                        onClick={() => {
                                                            const newVal = _.cloneDeep(copyWritingTemplate.demand);
                                                            if (newVal) {
                                                                const part1 = newVal?.slice(0, iptRef.current?.selectionStart);
                                                                const part2 = newVal?.slice(iptRef.current?.selectionStart);
                                                                setCopyWritingTemplate({
                                                                    ...copyWritingTemplate,
                                                                    demand: `${part1}{${item.field}}${part2}`
                                                                });
                                                            } else {
                                                                setCopyWritingTemplate({
                                                                    ...copyWritingTemplate,
                                                                    demand: `{${item.field}}`
                                                                });
                                                            }
                                                        }}
                                                        label={item.field}
                                                    ></Chip>
                                                </Tooltip>
                                            ))}
                                    </Box>
                                    <MainCard sx={{ borderRadius: 0 }} contentSX={{ p: 0 }}>
                                        <Box display="flex" justifyContent="space-between" alignItems="center">
                                            <Typography variant="h5" sx={{ display: 'flex', alignItems: 'center' }}>
                                                <Box mr={1}>{t('myApp.table')}</Box>
                                                <Tooltip placement="top" title={t('market.varableDesc')}>
                                                    <ErrorIcon sx={{ cursor: 'pointer' }} fontSize="small" />
                                                </Tooltip>
                                            </Typography>
                                            <Buttons
                                                size="small"
                                                color="secondary"
                                                onClick={() => {
                                                    setTitle('增加变量');
                                                    setVariableOpen(true);
                                                }}
                                                variant="outlined"
                                                startIcon={<AddIcon />}
                                            >
                                                {t('myApp.add')}
                                            </Buttons>
                                        </Box>
                                        <Divider style={{ margin: '10px 0' }} />
                                        <TableContainer>
                                            <Tables size="small">
                                                <TableHead>
                                                    <TableRow>
                                                        <TableCell>{t('myApp.field')}</TableCell>
                                                        <TableCell>{t('myApp.name')}</TableCell>
                                                        <TableCell>变量默认值</TableCell>
                                                        <TableCell>{t('myApp.type')}</TableCell>
                                                        <TableCell>{t('myApp.operation')}</TableCell>
                                                    </TableRow>
                                                </TableHead>
                                                <TableBody>
                                                    {rows.length > 0 &&
                                                        rows?.map((row: any, i: number) => (
                                                            <TableRow hover key={row.field}>
                                                                <TableCell>{row.field}</TableCell>
                                                                <TableCell>{row.label}</TableCell>
                                                                <TableCell>{row.defaultValue}</TableCell>
                                                                <TableCell>{t('myApp.' + row.style?.toLowerCase())}</TableCell>
                                                                <TableCell sx={{ width: 120 }}>
                                                                    <IconButton
                                                                        onClick={() => {
                                                                            setVarIndex(i);
                                                                            setItemData(row);
                                                                            setTitle('编辑变量');
                                                                            setVariableOpen(true);
                                                                        }}
                                                                        color="primary"
                                                                    >
                                                                        <SettingsIcon />
                                                                    </IconButton>
                                                                    <Popconfirm
                                                                        title={t('myApp.del')}
                                                                        description={t('myApp.delDesc')}
                                                                        onConfirm={() => {
                                                                            const newList = _.cloneDeep(rows);
                                                                            newList?.splice(i, 1);
                                                                            setRows(newList);
                                                                        }}
                                                                        onCancel={() => {}}
                                                                        okText={t('myApp.confirm')}
                                                                        cancelText={t('myApp.cancel')}
                                                                    >
                                                                        <IconButton color="error">
                                                                            <DeleteIcon />
                                                                        </IconButton>
                                                                    </Popconfirm>
                                                                </TableCell>
                                                            </TableRow>
                                                        ))}
                                                </TableBody>
                                            </Tables>
                                        </TableContainer>
                                    </MainCard>
                                    {variableOpen && (
                                        <VariableModal
                                            title={title}
                                            open={variableOpen}
                                            setOpen={setVariableOpen}
                                            itemData={itemData}
                                            saveContent={saveContent}
                                        />
                                    )}
                                    {/* <div className="text-[14px] font-[600] my-[20px]">文案生成参数</div>
                                    <Grid container spacing={2}>
                                        <Grid item md={4}>
                                            <TextField
                                                sx={{ mb: 2 }}
                                                fullWidth
                                                size="small"
                                                color="secondary"
                                                InputLabelProps={{ shrink: true }}
                                                name="desc"
                                                label="参数1"
                                                value={params.desc}
                                                onChange={(e: any) => {}}
                                            />
                                        </Grid>
                                        <Grid item md={4}>
                                            <TextField
                                                fullWidth
                                                size="small"
                                                color="secondary"
                                                InputLabelProps={{ shrink: true }}
                                                name="desc"
                                                label="参数2"
                                                value={params.desc}
                                                onChange={(e: any) => {}}
                                            />
                                        </Grid>
                                    </Grid> */}
                                    <Button
                                        onClick={() => {
                                            if (!params.name) {
                                                setTitleOpen(true);
                                                setCategoryOpen(true);
                                                setTagOpen(true);
                                                setSummaryOpen(true);
                                                dispatch(
                                                    openSnackbar({
                                                        open: true,
                                                        message: '方案名称必填',
                                                        variant: 'alert',
                                                        alert: {
                                                            color: 'error'
                                                        },
                                                        close: false
                                                    })
                                                );
                                                return false;
                                            }
                                            if (!params.category) {
                                                setTitleOpen(true);
                                                setCategoryOpen(true);
                                                setTagOpen(true);
                                                setSummaryOpen(true);
                                                dispatch(
                                                    openSnackbar({
                                                        open: true,
                                                        message: '类目必选',
                                                        variant: 'alert',
                                                        alert: {
                                                            color: 'error'
                                                        },
                                                        close: false
                                                    })
                                                );
                                                return false;
                                            }
                                            if (!params.tags || params.tags?.length === 0) {
                                                setTitleOpen(true);
                                                setCategoryOpen(true);
                                                setTagOpen(true);
                                                setSummaryOpen(true);
                                                dispatch(
                                                    openSnackbar({
                                                        open: true,
                                                        message: '标签最少输入一个',
                                                        variant: 'alert',
                                                        alert: {
                                                            color: 'error'
                                                        },
                                                        close: false
                                                    })
                                                );
                                                return false;
                                            }
                                            if (!copyWritingTemplate.summary) {
                                                setSummaryOpen(true);
                                                return false;
                                            }
                                            if (
                                                imageStyleData?.map((i) => i?.templateList?.some((item: any) => !item.id))?.some((el) => el)
                                            ) {
                                                dispatch(
                                                    openSnackbar({
                                                        open: true,
                                                        message: '图片生成模板风格必选',
                                                        variant: 'alert',
                                                        alert: {
                                                            color: 'error'
                                                        },
                                                        close: false
                                                    })
                                                );
                                                return false;
                                            }
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
                                                        }
                                                    }
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
                                        }}
                                        loading={testOpen}
                                        className="mt-[20px]"
                                        type="primary"
                                        icon={<PlusOutlined rev={undefined} />}
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
                                </div>
                            )
                        },
                        {
                            key: '2',
                            label: (
                                <div>
                                    图片生成模板
                                    {imageStyleData?.map((i) => i?.templateList?.some((item: any) => !item.id))?.some((el) => el) && (
                                        <InfoCircleOutlined className="text-[#ff4d4f] ml-[5px]" rev={undefined} />
                                    )}
                                </div>
                            ),
                            children: (
                                <div>
                                    <Button
                                        className="mb-[20px]"
                                        onClick={() => {
                                            const newData = _.cloneDeep(imageStyleData);
                                            newData.push({
                                                name: `风格 ${digui()}`,
                                                key: digui().toString(),
                                                id: digui().toString(),
                                                templateList: [
                                                    {
                                                        key: '1',
                                                        name: '首图',
                                                        variables: []
                                                    }
                                                ]
                                            });
                                            setImageStyleData(newData);
                                        }}
                                        type="primary"
                                        icon={<PlusOutlined rev={undefined} />}
                                    >
                                        增加风格
                                    </Button>
                                    <Tabs
                                        tabPosition="left"
                                        items={imageStyleData.map((item, i) => {
                                            return {
                                                label: (
                                                    <div>
                                                        {item.name}
                                                        {item?.templateList?.some((item: any) => !item.id) && (
                                                            <InfoCircleOutlined className="text-[#ff4d4f] ml-[5px]" rev={undefined} />
                                                        )}
                                                    </div>
                                                ),
                                                key: item.id,
                                                children: (
                                                    <div>
                                                        <div className="bg-[#edf0f2]/80 rounded py-[12px] px-[16px] flex justify-between items-center">
                                                            {!focuActive[i] ? (
                                                                <div
                                                                    className="cursor-pointer"
                                                                    onClick={() => {
                                                                        const newData = _.cloneDeep(focuActive);
                                                                        newData[i] = true;
                                                                        setFocuActive(newData);
                                                                    }}
                                                                >
                                                                    {item.name}
                                                                </div>
                                                            ) : (
                                                                <TextField
                                                                    autoFocus
                                                                    onBlur={(e) => {
                                                                        const newList = _.cloneDeep(focuActive);
                                                                        newList[i] = false;
                                                                        setFocuActive(newList);
                                                                        if (e.target.value) {
                                                                            const newData = _.cloneDeep(imageStyleData);
                                                                            newData[i].name = e.target.value;
                                                                            setImageStyleData(newData);
                                                                        }
                                                                    }}
                                                                    color="secondary"
                                                                    variant="standard"
                                                                />
                                                            )}

                                                            <div>
                                                                <Popover
                                                                    zIndex={9999}
                                                                    content={
                                                                        <Button
                                                                            onClick={(e: any) => {
                                                                                const newData = _.cloneDeep(imageStyleData);
                                                                                newData.splice(i, 1);
                                                                                setImageStyleData(newData);
                                                                                e.stopPropagation();
                                                                            }}
                                                                            danger
                                                                            icon={<DeleteOutlined rev={undefined} />}
                                                                        >
                                                                            删除
                                                                        </Button>
                                                                    }
                                                                    trigger="click"
                                                                >
                                                                    <IconButton size="small" onClick={(e: any) => e.stopPropagation()}>
                                                                        <MoreVertIcon />
                                                                    </IconButton>
                                                                </Popover>
                                                            </div>
                                                        </div>
                                                        <StyleTabs
                                                            imageStyleData={item?.templateList}
                                                            typeList={typeList}
                                                            setDetailData={(data: any) => {
                                                                const newData = _.cloneDeep(imageStyleData);
                                                                newData[i].templateList = data;
                                                                setImageStyleData(newData);
                                                            }}
                                                        />
                                                    </div>
                                                )
                                            };
                                        })}
                                    />
                                </div>
                            )
                        }
                    ]}
                    onChange={onChange}
                />
                <Modals open={addOpen} onClose={() => setAddOpen(false)} aria-labelledby="modal-title" aria-describedby="modal-description">
                    <MainCard
                        style={{
                            position: 'absolute',
                            top: '10%',
                            left: '50%',
                            transform: 'translate(-50%, -10%)',
                            maxHeight: '80%',
                            overflow: 'auto'
                        }}
                        title={addTitle}
                        content={false}
                        className="w-[80%] max-w-[700px]"
                        secondary={
                            <IconButton onClick={() => setAddOpen(false)} size="large" aria-label="close modal">
                                <CloseIcon fontSize="small" />
                            </IconButton>
                        }
                    >
                        <CardContent>
                            <Grid container spacing={2}>
                                <Grid item md={12}>
                                    <FormControl error={sourceOpen && !accoutQuery.source} size="small" color="secondary" fullWidth>
                                        <InputLabel id="sources">参考来源</InputLabel>
                                        <Select
                                            labelId="sources"
                                            value={accoutQuery.source}
                                            label="参考来源"
                                            name="source"
                                            onChange={(e) => {
                                                setSourceOpen(true);
                                                changeAccoutQuery(e.target);
                                            }}
                                        >
                                            {sourceList.map((item) => (
                                                <MenuItem key={item.value} value={item.value}>
                                                    {item.label}
                                                </MenuItem>
                                            ))}
                                        </Select>
                                        <FormHelperText>{sourceOpen && !accoutQuery.source ? '参考来源必选' : ''}</FormHelperText>
                                    </FormControl>
                                </Grid>
                                <Grid item md={12}>
                                    <TextField
                                        size="small"
                                        fullWidth
                                        color="secondary"
                                        InputLabelProps={{ shrink: true }}
                                        label="参考标题"
                                        name="title"
                                        error={!accoutQuery.title && valueOpen}
                                        helperText={!accoutQuery.title && valueOpen ? '参考标题必填' : ''}
                                        value={accoutQuery.title}
                                        onChange={(e: any) => {
                                            setValueOpen(true);
                                            changeAccoutQuery(e.target);
                                        }}
                                    />
                                </Grid>
                                <Grid item md={12}>
                                    <TextField
                                        fullWidth
                                        multiline
                                        sx={{
                                            '& textarea': {
                                                borderRadius: '0 !important'
                                            }
                                        }}
                                        minRows={4}
                                        maxRows={6}
                                        color="secondary"
                                        InputLabelProps={{ shrink: true }}
                                        label="参考内容"
                                        name="content"
                                        error={!accoutQuery.content && contentOpen}
                                        helperText={!accoutQuery.content && contentOpen ? '参考标题必填' : ''}
                                        value={accoutQuery.content}
                                        onChange={(e: any) => {
                                            setContentOpen(true);
                                            changeAccoutQuery(e.target);
                                        }}
                                    />
                                </Grid>
                                <Grid item md={12}>
                                    <TextField
                                        size="small"
                                        fullWidth
                                        color="secondary"
                                        InputLabelProps={{ shrink: true }}
                                        label="参考链接地址"
                                        name="link"
                                        value={accoutQuery.link}
                                        onChange={(e: any) => {
                                            changeAccoutQuery(e.target);
                                        }}
                                    />
                                </Grid>
                            </Grid>
                            <div className="flex flex-wrap gap-2 my-[20px]">
                                {accoutQuery.fileList?.map((item: any, index: number) => (
                                    <div key={index}>
                                        <div className="rounded-[8px] border border-solid border-[#d9d9d9] p-[8px]">
                                            <div className="relative w-[160px] h-[160px]">
                                                <Image
                                                    width={160}
                                                    height={160}
                                                    src={item?.response?.data?.url}
                                                    preview={false}
                                                    fallback="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAMIAAADDCAYAAADQvc6UAAABRWlDQ1BJQ0MgUHJvZmlsZQAAKJFjYGASSSwoyGFhYGDIzSspCnJ3UoiIjFJgf8LAwSDCIMogwMCcmFxc4BgQ4ANUwgCjUcG3awyMIPqyLsis7PPOq3QdDFcvjV3jOD1boQVTPQrgSkktTgbSf4A4LbmgqISBgTEFyFYuLykAsTuAbJEioKOA7DkgdjqEvQHEToKwj4DVhAQ5A9k3gGyB5IxEoBmML4BsnSQk8XQkNtReEOBxcfXxUQg1Mjc0dyHgXNJBSWpFCYh2zi+oLMpMzyhRcASGUqqCZ16yno6CkYGRAQMDKMwhqj/fAIcloxgHQqxAjIHBEugw5sUIsSQpBobtQPdLciLEVJYzMPBHMDBsayhILEqEO4DxG0txmrERhM29nYGBddr//5/DGRjYNRkY/l7////39v///y4Dmn+LgeHANwDrkl1AuO+pmgAAADhlWElmTU0AKgAAAAgAAYdpAAQAAAABAAAAGgAAAAAAAqACAAQAAAABAAAAwqADAAQAAAABAAAAwwAAAAD9b/HnAAAHlklEQVR4Ae3dP3PTWBSGcbGzM6GCKqlIBRV0dHRJFarQ0eUT8LH4BnRU0NHR0UEFVdIlFRV7TzRksomPY8uykTk/zewQfKw/9znv4yvJynLv4uLiV2dBoDiBf4qP3/ARuCRABEFAoBEgghggQAQZQKAnYEaQBAQaASKIAQJEkAEEegJmBElAoBEgghggQAQZQKAnYEaQBAQaASKIAQJEkAEEegJmBElAoBEgghggQAQZQKAnYEaQBAQaASKIAQJEkAEEegJmBElAoBEgghggQAQZQKAnYEaQBAQaASKIAQJEkAEEegJmBElAoBEgghggQAQZQKAnYEaQBAQaASKIAQJEkAEEegJmBElAoBEgghggQAQZQKAnYEaQBAQaASKIAQJEkAEEegJmBElAoBEgghggQAQZQKAnYEaQBAQaASKIAQJEkAEEegJmBElAoBEgghggQAQZQKAnYEaQBAQaASKIAQJEkAEEegJmBElAoBEgghggQAQZQKAnYEaQBAQaASKIAQJEkAEEegJmBElAoBEgghggQAQZQKAnYEaQBAQaASKIAQJEkAEEegJmBElAoBEgghggQAQZQKAnYEaQBAQaASKIAQJEkAEEegJmBElAoBEgghggQAQZQKAnYEaQBAQaASKIAQJEkAEEegJmBElAoBEgghgg0Aj8i0JO4OzsrPv69Wv+hi2qPHr0qNvf39+iI97soRIh4f3z58/u7du3SXX7Xt7Z2enevHmzfQe+oSN2apSAPj09TSrb+XKI/f379+08+A0cNRE2ANkupk+ACNPvkSPcAAEibACyXUyfABGm3yNHuAECRNgAZLuYPgEirKlHu7u7XdyytGwHAd8jjNyng4OD7vnz51dbPT8/7z58+NB9+/bt6jU/TI+AGWHEnrx48eJ/EsSmHzx40L18+fLyzxF3ZVMjEyDCiEDjMYZZS5wiPXnyZFbJaxMhQIQRGzHvWR7XCyOCXsOmiDAi1HmPMMQjDpbpEiDCiL358eNHurW/5SnWdIBbXiDCiA38/Pnzrce2YyZ4//59F3ePLNMl4PbpiL2J0L979+7yDtHDhw8vtzzvdGnEXdvUigSIsCLAWavHp/+qM0BcXMd/q25n1vF57TYBp0a3mUzilePj4+7k5KSLb6gt6ydAhPUzXnoPR0dHl79WGTNCfBnn1uvSCJdegQhLI1vvCk+fPu2ePXt2tZOYEV6/fn31dz+shwAR1sP1cqvLntbEN9MxA9xcYjsxS1jWR4AIa2Ibzx0tc44fYX/16lV6NDFLXH+YL32jwiACRBiEbf5KcXoTIsQSpzXx4N28Ja4BQoK7rgXiydbHjx/P25TaQAJEGAguWy0+2Q8PD6/Ki4R8EVl+bzBOnZY95fq9rj9zAkTI2SxdidBHqG9+skdw43borCXO/ZcJdraPWdv22uIEiLA4q7nvvCug8WTqzQveOH26fodo7g6uFe/a17W3+nFBAkRYENRdb1vkkz1CH9cPsVy/jrhr27PqMYvENYNlHAIesRiBYwRy0V+8iXP8+/fvX11Mr7L7ECueb/r48eMqm7FuI2BGWDEG8cm+7G3NEOfmdcTQw4h9/55lhm7DekRYKQPZF2ArbXTAyu4kDYB2YxUzwg0gi/41ztHnfQG26HbGel/crVrm7tNY+/1btkOEAZ2M05r4FB7r9GbAIdxaZYrHdOsgJ/wCEQY0J74TmOKnbxxT9n3FgGGWWsVdowHtjt9Nnvf7yQM2aZU/TIAIAxrw6dOnAWtZZcoEnBpNuTuObWMEiLAx1HY0ZQJEmHJ3HNvGCBBhY6jtaMoEiJB0Z29vL6ls58vxPcO8/zfrdo5qvKO+d3Fx8Wu8zf1dW4p/cPzLly/dtv9Ts/EbcvGAHhHyfBIhZ6NSiIBTo0LNNtScABFyNiqFCBChULMNNSdAhJyNSiECRCjUbEPNCRAhZ6NSiAARCjXbUHMCRMjZqBQiQIRCzTbUnAARcjYqhQgQoVCzDTUnQIScjUohAkQo1GxDzQkQIWejUogAEQo121BzAkTI2agUIkCEQs021JwAEXI2KoUIEKFQsw01J0CEnI1KIQJEKNRsQ80JECFno1KIABEKNdtQcwJEyNmoFCJAhELNNtScABFyNiqFCBChULMNNSdAhJyNSiECRCjUbEPNCRAhZ6NSiAARCjXbUHMCRMjZqBQiQIRCzTbUnAARcjYqhQgQoVCzDTUnQIScjUohAkQo1GxDzQkQIWejUogAEQo121BzAkTI2agUIkCEQs021JwAEXI2KoUIEKFQsw01J0CEnI1KIQJEKNRsQ80JECFno1KIABEKNdtQcwJEyNmoFCJAhELNNtScABFyNiqFCBChULMNNSdAhJyNSiECRCjUbEPNCRAhZ6NSiAARCjXbUHMCRMjZqBQiQIRCzTbUnAARcjYqhQgQoVCzDTUnQIScjUohAkQo1GxDzQkQIWejUogAEQo121BzAkTI2agUIkCEQs021JwAEXI2KoUIEKFQsw01J0CEnI1KIQJEKNRsQ80JECFno1KIABEKNdtQcwJEyNmoFCJAhELNNtScABFyNiqFCBChULMNNSdAhJyNSiEC/wGgKKC4YMA4TAAAAABJRU5ErkJggg=="
                                                />
                                                {item?.percent !== 100 && (
                                                    <div className="absolute bg-[#f3f3f3] top-0 w-full h-full flex justify-center items-center">
                                                        <Image className="!w-[20px] !h-[20px]" src={imgLoading} preview={false} />
                                                    </div>
                                                )}
                                                {item?.percent === 100 && item?.response?.data?.url && (
                                                    <div className="absolute top-0 w-full h-full flex justify-center items-center hover:bg-[#000]/20 text-transparent hover:text-[#ff4d4f]">
                                                        <DeleteOutlined
                                                            onClick={() => {
                                                                const newData = _.cloneDeep(accoutQuery);
                                                                newData.fileList?.splice(index, 1);
                                                                setAccoutQuery(newData);
                                                            }}
                                                            rev={undefined}
                                                            className="cursor-pointer"
                                                        />
                                                    </div>
                                                )}
                                            </div>
                                        </div>
                                        {item?.percent === 100 && item?.response?.data?.url && (
                                            <>
                                                <Input
                                                    value={imageConent[index]}
                                                    onChange={(e) => {
                                                        const newList = _.cloneDeep(imageConent);
                                                        newList[index] = e.target.value;
                                                        setImageContent(newList);
                                                    }}
                                                    placeholder="图片标题"
                                                    className="mt-[8px] w-[178px] block"
                                                />
                                                <Input
                                                    value={imageSubConent[index]}
                                                    onChange={(e) => {
                                                        const newList = _.cloneDeep(imageSubConent);
                                                        newList[index] = e.target.value;
                                                        setImageSubContent(newList);
                                                    }}
                                                    placeholder="图片副标题"
                                                    className="mt-[8px] w-[178px]"
                                                />
                                            </>
                                        )}
                                    </div>
                                ))}
                                <Upload className="inline-block uploads" {...props}>
                                    <div>
                                        <PlusOutlined rev={undefined} />
                                        <div style={{ marginTop: 8 }}>Upload</div>
                                    </div>
                                </Upload>
                            </div>
                        </CardContent>
                        <Divider />
                        <CardActions>
                            <Grid container justifyContent="flex-end">
                                <Button
                                    type="primary"
                                    onClick={() => {
                                        if (!accoutQuery.title || !accoutQuery.content || !accoutQuery.source) {
                                            setSourceOpen(true);
                                            setValueOpen(true);
                                            setContentOpen(true);
                                        } else {
                                            const newList = _.cloneDeep(tableData);
                                            const obj = {
                                                ...accoutQuery,
                                                fileList: undefined,
                                                images:
                                                    accoutQuery.fileList
                                                        ?.map((item: any, i: number) => {
                                                            if (item?.response?.data?.url) {
                                                                return {
                                                                    url: item?.response?.data?.url,
                                                                    title: imageConent[i],
                                                                    subTitle: imageSubConent[i]
                                                                };
                                                            } else {
                                                                return undefined;
                                                            }
                                                        })
                                                        ?.filter((el: any) => el !== undefined) || []
                                            };
                                            if (addTitle === '新增参考账号') {
                                                newList.push(obj);
                                                setTableData(newList);
                                                setAddOpen(false);
                                            } else {
                                                newList.splice(rowIndex, 1, obj);
                                                setTableData(newList);
                                                setAddOpen(false);
                                            }
                                        }
                                    }}
                                >
                                    保存
                                </Button>
                            </Grid>
                        </CardActions>
                    </MainCard>
                </Modals>
                <Divider />
                <CardActions>
                    <Grid container justifyContent="flex-end">
                        <Button
                            type="primary"
                            onClick={() => {
                                if (!params.name) {
                                    setTitleOpen(true);
                                    setCategoryOpen(true);
                                    setTagOpen(true);
                                    setSummaryOpen(true);
                                    dispatch(
                                        openSnackbar({
                                            open: true,
                                            message: '方案名称必填',
                                            variant: 'alert',
                                            alert: {
                                                color: 'error'
                                            },
                                            close: false
                                        })
                                    );
                                    return false;
                                }
                                if (!params.category) {
                                    setTitleOpen(true);
                                    setCategoryOpen(true);
                                    setTagOpen(true);
                                    setSummaryOpen(true);
                                    dispatch(
                                        openSnackbar({
                                            open: true,
                                            message: '类目必选',
                                            variant: 'alert',
                                            alert: {
                                                color: 'error'
                                            },
                                            close: false
                                        })
                                    );
                                    return false;
                                }
                                if (!params.tags || params.tags?.length === 0) {
                                    setTitleOpen(true);
                                    setCategoryOpen(true);
                                    setTagOpen(true);
                                    setSummaryOpen(true);
                                    dispatch(
                                        openSnackbar({
                                            open: true,
                                            message: '标签最少输入一个',
                                            variant: 'alert',
                                            alert: {
                                                color: 'error'
                                            },
                                            close: false
                                        })
                                    );
                                    return false;
                                }
                                if (!copyWritingTemplate.summary) {
                                    setSummaryOpen(true);
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
                                        refers: tableData,
                                        configuration: {
                                            copyWritingTemplate: {
                                                ...copyWritingTemplate,
                                                example: testTableList,
                                                variables: rows
                                            },
                                            imageTemplate: {
                                                styleList: imageStyleData
                                            }
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
                                        }
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
                                                close: false
                                            })
                                        );
                                    }
                                });
                            }}
                        >
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
