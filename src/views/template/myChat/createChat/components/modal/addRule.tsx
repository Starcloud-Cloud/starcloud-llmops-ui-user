import {
    Modal,
    IconButton,
    CardContent,
    Box,
    Divider,
    CardActions,
    Grid,
    Button,
    Table,
    TableHead,
    TableRow,
    TableCell,
    TableBody,
    Autocomplete,
    Chip,
    TextField,
    FormControl,
    InputLabel,
    Select,
    MenuItem,
    Switch,
    Typography,
    Pagination,
    FormHelperText,
    Stepper,
    Step,
    Tooltip,
    StepLabel
} from '@mui/material';
import SubCard from 'ui-component/cards/SubCard';
import Tips from 'assets/images/icons/tips.svg';
import { Close, HelpOutline } from '@mui/icons-material';
import { Popconfirm, ConfigProvider } from 'antd';
import formatDate from 'hooks/useDate';
import { ruleDebugRule } from 'api/chat';
import AddIcon from '@mui/icons-material/Add';
import MainCard from 'ui-component/cards/MainCard';
import { dispatch } from 'store';
import { openSnackbar } from 'store/slices/snackbar';
import _ from 'lodash-es';
import { useFormik } from 'formik';
import * as yup from 'yup';
import { useEffect, useState } from 'react';
import { rulePage, ruleFormatType, ruleCreateRule, ruleUpdateRule, ruleRuleType, ruleDel } from 'api/chat';
import Item from 'antd/es/list/Item';
interface Basis {
    ruleName?: string;
    ruleType?: string;
    enable: boolean;
    ruleFilter?: string[];
}
type CleanRule = {
    whiteList: string[];
    blackList: string[];
    convertFormat: string;
    acceptLanguage: string;
};
const AddRuleModal = ({
    open,
    datasetUid,
    handleClose
}: {
    open: boolean;
    datasetUid: string | undefined;
    handleClose: (open: boolean) => void;
}) => {
    const [addOpen, setAddOpen] = useState(false);
    const [title, setTitle] = useState('新增规则');
    const [queryParams, setQueryParams] = useState({
        pageNo: 1,
        pageSize: 10
    });
    const [tableData, setTableData] = useState([]);
    const [total, setTotal] = useState(0);
    const getList = async () => {
        const res = await rulePage({ ...queryParams, appId: datasetUid });
        setTableData(res.list);
        setTotal(res.total);
    };
    const paginationChange = (e: any, value: number) => {
        setQueryParams({
            ...queryParams,
            pageNo: value
        });
    };
    const [ruleFormatList, setRuleFormatList] = useState([]);
    const [typeList, setTypeList] = useState([]);
    const getRuleFormatType = async () => {
        const result = await ruleFormatType();
        setRuleFormatList(result);
        const res = await ruleRuleType();
        setTypeList(res);
    };
    useEffect(() => {
        getList();
    }, [queryParams.pageNo]);
    useEffect(() => {
        getRuleFormatType();
    }, []);
    useEffect(() => {
        if (!addOpen) {
            setBasis({
                enable: true,
                ruleType: 'DOCUMENT',
                ruleFilter: []
            });
            setCleanRule({
                whiteList: [],
                blackList: [],
                convertFormat: 'TXT',
                acceptLanguage: 'zh-CN'
            });
            setCommonCleanRule({
                removeAllHtmlTags: false,
                removeAllImage: false,
                removeConsecutiveSpaces: false,
                removeConsecutiveNewlines: false,
                removeConsecutiveTabs: false,
                removeUrlsEmails: false
            });
            setSplitRule({
                separator: ['\\n', '。', '\\.', '！', '!', ' '],
                chunkSize: 500
            });
            setEditData({});
            setActive(0);
            setNameOpen(false);
            setCondOpen(false);
            setSizeOpen(false);
        }
    }, [addOpen]);
    //基础规则
    const [basis, setBasis] = useState<Basis>({
        ruleType: 'DOCUMENT',
        enable: true,
        ruleFilter: []
    });
    const [nameOpen, setNameOpen] = useState(false);
    const [condOpen, setCondOpen] = useState(false);
    const handleBasis = (e: any) => {
        const { name, value } = e.target;
        setBasis({
            ...basis,
            [name]: value
        });
    };
    //白名单、黑名单、转化格式、网页语言
    const [cleanRule, setCleanRule] = useState<CleanRule>({
        whiteList: [],
        blackList: [],
        convertFormat: 'TXT',
        acceptLanguage: 'zh-CN'
    });
    const handleCleanRule = (e: any) => {
        const { name, value } = e.target;
        setCleanRule({
            ...cleanRule,
            [name]: value
        });
    };
    //通用规则
    const [commonCleanRule, setCommonCleanRule] = useState<{ [key: string]: boolean }>({
        removeAllHtmlTags: false,
        removeAllImage: false,
        removeConsecutiveSpaces: false,
        removeConsecutiveNewlines: false,
        removeConsecutiveTabs: false,
        removeUrlsEmails: false
    });
    const handleCommonCleanRule = (e: any) => {
        const { name } = e.target;
        setCommonCleanRule({
            ...commonCleanRule,
            [name]: !commonCleanRule[name]
        });
    };
    //分段规则
    const [splitRule, setSplitRule] = useState<any>({
        separator: ['\\n', '。', '\\.', '！', '!', ' '],
        chunkSize: 500
    });
    const [sizeOpen, setSizeOpen] = useState(false);
    //编辑保存的数据
    const [editData, setEditData] = useState<any>({});
    //新增编辑
    const addSave = async (e: any) => {
        const newArr = [...Object.values(basis), ...Object.values(commonCleanRule), ...Object.values(splitRule)];
        if (basis.ruleType === 'HTML') {
            newArr.push(cleanRule.convertFormat);
            newArr.push(cleanRule.acceptLanguage);
        }
        const res = newArr.every((item: any) => {
            return item === true || item === false || item.length > 0 || typeof item === 'number';
        });
        if (res) {
            if (!editData.id) {
                const result = await ruleCreateRule({
                    ...basis,
                    appId: datasetUid,
                    cleanRule: {
                        htmlCleanRule: cleanRule,
                        commonCleanRule
                    },
                    splitRule
                });
                if (result) {
                    getList();
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
                    setAddOpen(false);
                    setSaveBtn(true);
                    setActiveStep(0);
                    setUrl('');
                    setResult('');
                    formik.handleReset(e);
                }
            } else {
                const result = await ruleUpdateRule({
                    ...editData,
                    ...basis,
                    appId: datasetUid,
                    cleanRule: {
                        ..._.cloneDeep(editData),
                        htmlCleanRule: cleanRule,
                        commonCleanRule
                    },
                    splitRule
                });
                if (result) {
                    getList();
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
                    setAddOpen(false);
                    setSaveBtn(true);
                    setActiveStep(0);
                }
            }
        }
    };
    //删除
    const handleDel = async (row: any) => {
        await ruleDel({ ruleId: row.id });
        getList();
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
    };

    //规则调试
    const [active, setActive] = useState(0);
    const steps = ['清洗', '分段', '调试与保存'];
    const [activeStep, setActiveStep] = useState(0);
    const publishStep = (value: any, index: number) => {
        const newVal = Object.values(value);
        const flag = newVal.every((item: any) => {
            if (!(item === true || item === false || item.length > 0 || typeof item === 'number')) {
                if (index === 0) {
                    setNameOpen(true);
                    setCondOpen(true);
                } else if (index === 1) {
                    setSizeOpen(true);
                }
            }
            return item === true || item === false || item.length > 0 || typeof item === 'number';
        });
        return flag;
    };
    //上一步下一步
    const handleStep = (step: string) => {
        if (step === 'next') {
            if (activeStep === 0 && publishStep(basis, 0)) {
                setActiveStep(activeStep + 1);
            } else if (activeStep === 1 && publishStep(splitRule, 1)) {
                setActiveStep(activeStep + 1);
            } else {
                dispatch(
                    openSnackbar({
                        open: true,
                        message: '还有必填未填',
                        variant: 'alert',
                        alert: {
                            color: 'error'
                        },
                        close: false
                    })
                );
            }
        } else {
            setActiveStep(activeStep - 1);
        }
    };
    //文本
    const formik = useFormik({
        initialValues: {
            title: `文本：${formatDate(new Date().getTime())}`,
            context: ''
        },
        validationSchema: yup.object({
            title: yup.string().required('标题是必填的'),
            context: yup.string().max(150000, '文本过长、请减少到150000字以内').required('内容是必填的')
        }),
        onSubmit: async (values) => {
            try {
                const res = await ruleDebugRule({
                    ...basis,
                    cleanRule: {
                        htmlCleanRule: cleanRule,
                        commonCleanRule
                    },
                    splitRule,
                    url: '',
                    title: values.title,
                    context: values.context,
                    dataType: 'CHARACTERS'
                });
                setSaveBtn(false);
                setResult(res.data);
            } catch (error) {
                setSaveBtn(true);
            }
        }
    });
    //网页
    const [isValid, setIsValid] = useState(true);
    const [url, setUrl] = useState('');
    //保存按钮是否可点
    const [saveBtn, setSaveBtn] = useState(true);
    const saveUrl = async () => {
        if (url && isValid) {
            try {
                const res = await ruleDebugRule({
                    ...basis,
                    cleanRule: {
                        htmlCleanRule: cleanRule,
                        commonCleanRule
                    },
                    splitRule,
                    url,
                    title: '',
                    context: '',
                    dataType: 'HTML'
                });
                setSaveBtn(false);
                setResult(res.data);
            } catch (error) {
                setSaveBtn(true);
            }
        } else {
            setIsValid(false);
        }
    };
    useEffect(() => {
        if (url) {
            const isValidInput = /^(http:\/\/|https:\/\/|www\.)[^\s,，]*$/.test(url);
            setIsValid(isValidInput);
        }
    }, [url]);
    //调试结果
    const [result, setResult] = useState('');
    return (
        <Modal open={open} onClose={() => handleClose(false)} aria-labelledby="modal-title" aria-describedby="modal-description">
            <MainCard
                sx={{
                    position: 'absolute',
                    width: { lg: '60%', md: '70%', xs: '80%' },
                    top: '10%',
                    left: '50%',
                    transform: 'translate(-50%, 0)'
                }}
                headerSX={{ p: '16px !important' }}
                contentSX={{ p: '16px !important' }}
                title="规则列表"
                content={false}
                secondary={
                    <IconButton onClick={() => handleClose(false)}>
                        <Close fontSize="small" />
                    </IconButton>
                }
            >
                <CardContent sx={{ p: '16px !important' }}>
                    <Box my={2} display="flex" justifyContent="right">
                        <Button
                            startIcon={<AddIcon />}
                            onClick={() => {
                                setEditData({});
                                setTitle('新建规则');
                                setAddOpen(true);
                            }}
                            size="small"
                            color="secondary"
                            variant="contained"
                        >
                            新增规则
                        </Button>
                    </Box>
                    <Table aria-label="simple table">
                        <TableHead>
                            <TableRow>
                                <TableCell align="center">规则名称</TableCell>
                                <TableCell align="center">类型</TableCell>
                                <TableCell align="center">命中条件</TableCell>
                                <TableCell align="center">修改时间</TableCell>
                                <TableCell align="center">创建时间</TableCell>
                                <TableCell align="center">操作</TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {tableData.map((row: any) => (
                                <TableRow key={row.id}>
                                    <TableCell align="center" width="200px">
                                        {row.ruleName}
                                    </TableCell>
                                    <TableCell align="center">{row.ruleType}</TableCell>
                                    <TableCell align="center">
                                        {row.ruleFilter.map((item: string) => (
                                            <Typography key={item}>{item}</Typography>
                                        ))}
                                    </TableCell>
                                    <TableCell align="center" width="200px">
                                        {formatDate(row.updateTime)}
                                    </TableCell>{' '}
                                    <TableCell align="center" width="200px">
                                        {formatDate(row.createTime)}
                                    </TableCell>
                                    <TableCell align="center" width="200px">
                                        <Button
                                            onClick={() => {
                                                setEditData(row);
                                                setTitle('编辑规则');
                                                setAddOpen(true);
                                                setBasis({
                                                    ruleName: row.ruleName,
                                                    ruleType: row.ruleType,
                                                    ruleFilter: row.ruleFilter,
                                                    enable: row.enable
                                                });
                                                setCleanRule(row.cleanRule.htmlCleanRule);
                                                setCommonCleanRule(row.cleanRule.commonCleanRule);
                                                setSplitRule(row.splitRule);
                                            }}
                                            color="secondary"
                                            size="small"
                                        >
                                            修改
                                        </Button>
                                        <ConfigProvider
                                            theme={{
                                                components: {
                                                    Popconfirm: {
                                                        zIndexPopup: 9999
                                                    }
                                                }
                                            }}
                                        >
                                            <Popconfirm
                                                placement="top"
                                                title="请再次确认是否删除"
                                                onConfirm={() => {
                                                    handleDel(row);
                                                }}
                                                okText="Yes"
                                                cancelText="No"
                                            >
                                                <Button color="error" size="small">
                                                    删除
                                                </Button>
                                            </Popconfirm>
                                        </ConfigProvider>
                                    </TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                    {total > 0 && (
                        <Box my={2}>
                            <Pagination
                                page={queryParams.pageNo}
                                count={Math.ceil(total / queryParams.pageSize)}
                                onChange={paginationChange}
                            />
                        </Box>
                    )}
                    {addOpen && (
                        <Modal
                            open={addOpen}
                            onClose={(e) => {
                                setAddOpen(false);
                                setSaveBtn(true);
                                setActiveStep(0);
                                setUrl('');
                                setResult('');
                                formik.handleReset(e);
                            }}
                            aria-labelledby="modal-title"
                            aria-describedby="modal-description"
                        >
                            <MainCard
                                sx={{
                                    position: 'absolute',
                                    width: '60%',
                                    top: '10%',
                                    left: '50%',
                                    maxHeight: '80%',
                                    overflowY: 'auto',
                                    transform: 'translate(-50%, 0)'
                                }}
                                headerSX={{ p: '16px !important' }}
                                contentSX={{ p: '16px !important' }}
                                title={title}
                                content={false}
                                secondary={
                                    <IconButton
                                        onClick={(e) => {
                                            setAddOpen(false);
                                            setSaveBtn(true);
                                            setActiveStep(0);
                                            setUrl('');
                                            setResult('');
                                            formik.handleReset(e);
                                        }}
                                    >
                                        <Close fontSize="small" />
                                    </IconButton>
                                }
                            >
                                <CardContent sx={{ p: '16px !important' }}>
                                    {activeStep === 0 && (
                                        <Grid container justifyContent="space-between" spacing={2}>
                                            <Grid item md={6}>
                                                <TextField
                                                    size="small"
                                                    label="规划名称"
                                                    name="ruleName"
                                                    color="secondary"
                                                    fullWidth
                                                    error={!basis.ruleName && nameOpen}
                                                    helperText={!basis.ruleName && nameOpen ? '规划名称必填' : ' '}
                                                    value={basis.ruleName}
                                                    onChange={(e) => {
                                                        setNameOpen(true);
                                                        handleBasis(e);
                                                    }}
                                                    InputLabelProps={{ shrink: true }}
                                                />
                                                <span className={'text-#697586'}>规则状态</span>
                                                <Switch
                                                    name="removeAllHtmlTags"
                                                    checked={basis.enable}
                                                    onChange={() => {
                                                        setBasis({
                                                            ...basis,
                                                            enable: !basis.enable
                                                        });
                                                    }}
                                                    color="secondary"
                                                />
                                                <Grid mt={1} container display="flex" spacing={1}>
                                                    {typeList.map((item: any, index: number) => (
                                                        <Grid item md={4}>
                                                            <SubCard
                                                                sx={{
                                                                    mb: 1,
                                                                    cursor: 'pointer',
                                                                    borderColor: active === index ? '#673ab7' : 'rgba(230,230,231,1)'
                                                                }}
                                                                contentSX={{ p: '10px !important' }}
                                                            >
                                                                <Box
                                                                    onClick={() => {
                                                                        setActive(index);
                                                                        setBasis({
                                                                            ...basis,
                                                                            ruleType: item.type
                                                                        });
                                                                    }}
                                                                >
                                                                    <Typography variant="h4" mb={1}>
                                                                        {item.typeName}
                                                                    </Typography>
                                                                    <Typography
                                                                        height="32px"
                                                                        className="line-clamp-2"
                                                                        color="#697586"
                                                                        fontSize="12px"
                                                                    >
                                                                        {item.description}
                                                                    </Typography>
                                                                </Box>
                                                            </SubCard>
                                                        </Grid>
                                                    ))}
                                                </Grid>
                                            </Grid>
                                            <Grid item md={4}>
                                                <SubCard
                                                    sx={{ p: '0 !important', background: 'rgba(230,230,231,.4)' }}
                                                    contentSX={{ p: '10px !important' }}
                                                >
                                                    <Typography mb={1} variant="h5">
                                                        清洗分段说明 <img style={{ verticalAlign: 'sub' }} width="18px" src={Tips} alt="" />
                                                    </Typography>
                                                    <Typography fontSize="12px">
                                                        在处理文本数据时，清洗和分段是两个重要的预处理步骤
                                                    </Typography>
                                                    <Typography my={1} fontSize="12px">
                                                        分段的目的是将长文本拆分成较小的段落，以便模型更有效地处理和理解。这有助于提高模型生成的结果的质量和相关性
                                                    </Typography>
                                                    <Typography fontSize="12px">
                                                        通过对数据集进行适当的清洗和分段，可以提高模型在实际应用中的表现，从而为用户提供更准确、更有价值的结果
                                                    </Typography>
                                                </SubCard>
                                            </Grid>
                                        </Grid>
                                    )}
                                    <Stepper sx={{ my: 5 }} nonLinear activeStep={activeStep}>
                                        {steps.map((label, index) => (
                                            <Step color="secondary" key={label}>
                                                <StepLabel color="inherit">{label}</StepLabel>
                                            </Step>
                                        ))}
                                    </Stepper>
                                    {activeStep === 0 && (
                                        <Box>
                                            <Grid container spacing={2}>
                                                <Grid item md={6}>
                                                    <FormControl
                                                        error={basis.ruleFilter && basis.ruleFilter.length === 0 && condOpen}
                                                        size="small"
                                                        fullWidth
                                                    >
                                                        <InputLabel
                                                            sx={{
                                                                background: '#f8fafc',
                                                                pl: '10px',
                                                                pr: '4px',
                                                                fontSize: '1.07rem',
                                                                left: '-5px',
                                                                display: 'flex',
                                                                alignItems: 'center'
                                                            }}
                                                            shrink
                                                            color="secondary"
                                                            id="filter"
                                                        >
                                                            命中条件
                                                        </InputLabel>
                                                        <Autocomplete
                                                            multiple
                                                            size="small"
                                                            options={[]}
                                                            defaultValue={basis.ruleFilter}
                                                            freeSolo
                                                            renderTags={(value: readonly string[], getTagProps) =>
                                                                value.map((option: string, index: number) => (
                                                                    <Chip
                                                                        size="small"
                                                                        key={index}
                                                                        label={option}
                                                                        onDelete={getTagProps({ index }).onDelete}
                                                                    />
                                                                ))
                                                            }
                                                            onChange={(e: any, newValue) => {
                                                                setCondOpen(true);
                                                                setBasis({
                                                                    ...basis,
                                                                    ruleFilter: newValue
                                                                });
                                                            }}
                                                            renderInput={(params: any) => (
                                                                <TextField
                                                                    labelId="filter"
                                                                    error={basis.ruleFilter && basis.ruleFilter.length === 0 && condOpen}
                                                                    InputLabelProps={{ shrink: true }}
                                                                    size="small"
                                                                    helperText={
                                                                        basis.ruleFilter && basis.ruleFilter.length === 0 && condOpen
                                                                            ? '命中条件必填'
                                                                            : '命中条件可以输入多个，输入之后回车完成输入'
                                                                    }
                                                                    name="ruleFilter"
                                                                    color="secondary"
                                                                    {...params}
                                                                />
                                                            )}
                                                        />
                                                    </FormControl>
                                                </Grid>
                                                <Grid item md={6}>
                                                    <SubCard
                                                        sx={{ p: '0 !important', background: 'rgba(230,230,231,.4)' }}
                                                        contentSX={{ p: '10px !important' }}
                                                    >
                                                        <Typography mb={1} variant="h5">
                                                            说明 <img style={{ verticalAlign: 'sub' }} width="18px" src={Tips} alt="" />
                                                        </Typography>
                                                        {basis.ruleType === 'HTML' && (
                                                            <Box>
                                                                <Typography fontSize="12px">
                                                                    单个匹配：直接输入要过滤的 URL 地址即可，例如：http://www.baidu.com
                                                                </Typography>
                                                                <Typography fontSize="12px">
                                                                    多个匹配：在 URL 后面增加/*，即可匹配以该 URL 开头的所有 URL
                                                                    地址，例如：http://www.baidu.com/*
                                                                </Typography>
                                                            </Box>
                                                        )}
                                                        {basis.ruleType === 'DOCUMENT' && (
                                                            <>
                                                                <Typography fontSize="12px">
                                                                    单个匹配：输入文件名及其后缀即可，例如：测试.doc
                                                                </Typography>
                                                                <Typography fontSize="12px">
                                                                    多个匹配：支持根据文件名或后缀进行匹配
                                                                </Typography>
                                                                <Typography fontSize="12px">
                                                                    文件名匹配：例如测试.*，会匹配以测试为文件名的任意格式文件
                                                                </Typography>
                                                                <Typography fontSize="12px">
                                                                    文件后缀匹配：例如*.doc，会匹配以.doc为后缀的任意文件名文件
                                                                </Typography>
                                                            </>
                                                        )}
                                                        {basis.ruleType === 'CHARACTERS' && (
                                                            <>
                                                                <Typography fontSize="12px">
                                                                    单个匹配：直接输入完整的文本标题即可
                                                                </Typography>
                                                                <Typography fontSize="12px">
                                                                    多个匹配：在文本标题后面加上_*，即可匹配到以该文件标题开头的
                                                                </Typography>
                                                            </>
                                                        )}
                                                    </SubCard>
                                                </Grid>
                                            </Grid>
                                            {basis.ruleType === 'HTML' && (
                                                <>
                                                    <span
                                                        className={
                                                            "!mt-[16px] !mb-[16px] before:bg-[#673ab7] before:left-0 before:top-[2px] before:content-[''] before:w-[3px] before:h-[14px] before:absolute before:ml-0.5 block text-[1.125rem] font-medium pl-[12px] relative text-black"
                                                        }
                                                    >
                                                        网页清洗规则
                                                    </span>
                                                    <Grid container spacing={2}>
                                                        <Grid item md={6}>
                                                            <FormControl size="small" fullWidth>
                                                                <InputLabel
                                                                    sx={{
                                                                        background: '#f8fafc',
                                                                        pl: '10px',
                                                                        pr: '4px',
                                                                        fontSize: '1.07rem',
                                                                        left: '-5px'
                                                                    }}
                                                                    shrink
                                                                    color="secondary"
                                                                    id="whiteList"
                                                                >
                                                                    白名单
                                                                </InputLabel>
                                                                <Autocomplete
                                                                    size="small"
                                                                    multiple
                                                                    options={[]}
                                                                    defaultValue={cleanRule.whiteList}
                                                                    freeSolo
                                                                    renderTags={(value: readonly string[], getTagProps) =>
                                                                        value.map((option: string, index: number) => (
                                                                            <Chip
                                                                                size="small"
                                                                                key={index}
                                                                                label={option}
                                                                                onDelete={getTagProps({ index }).onDelete}
                                                                            />
                                                                        ))
                                                                    }
                                                                    onChange={(e: any, newValue) => {
                                                                        setCleanRule({
                                                                            ...cleanRule,
                                                                            whiteList: newValue
                                                                        });
                                                                    }}
                                                                    renderInput={(params: any) => (
                                                                        <TextField
                                                                            size="small"
                                                                            helperText="白名单可以输入多个，输入之后回车完成输入"
                                                                            labelId="whiteList"
                                                                            name="whiteList"
                                                                            color="secondary"
                                                                            {...params}
                                                                        />
                                                                    )}
                                                                />
                                                            </FormControl>
                                                        </Grid>
                                                        <Grid item md={6}>
                                                            <SubCard
                                                                sx={{ p: '0 !important', background: 'rgba(230,230,231,.4)' }}
                                                                contentSX={{ p: '10px !important' }}
                                                            >
                                                                <Typography mb={1} variant="h5">
                                                                    说明
                                                                    <img style={{ verticalAlign: 'sub' }} width="18px" src={Tips} alt="" />
                                                                </Typography>
                                                                <Typography fontSize="12px">
                                                                    白名单：获取指定标签或ID下的网页数据
                                                                </Typography>
                                                                <Typography fontSize="12px">标签格式：.＋具体标签，例：.body</Typography>
                                                                <Typography fontSize="12px">ID格式：#＋具体ID，例：#dda21</Typography>
                                                            </SubCard>
                                                        </Grid>
                                                        <Grid item md={6}>
                                                            <FormControl size="small" fullWidth>
                                                                <InputLabel
                                                                    sx={{
                                                                        background: '#f8fafc',
                                                                        pl: '10px',
                                                                        pr: '4px',
                                                                        fontSize: '1.07rem',
                                                                        left: '-5px'
                                                                    }}
                                                                    shrink
                                                                    color="secondary"
                                                                    id="blackList"
                                                                >
                                                                    黑名单
                                                                </InputLabel>
                                                                <Autocomplete
                                                                    size="small"
                                                                    multiple
                                                                    options={[]}
                                                                    defaultValue={cleanRule.blackList}
                                                                    freeSolo
                                                                    renderTags={(value: readonly string[], getTagProps) =>
                                                                        value.map((option: string, index: number) => (
                                                                            <Chip
                                                                                size="small"
                                                                                key={index}
                                                                                label={option}
                                                                                onDelete={getTagProps({ index }).onDelete}
                                                                            />
                                                                        ))
                                                                    }
                                                                    onChange={(e: any, newValue) => {
                                                                        setCleanRule({
                                                                            ...cleanRule,
                                                                            blackList: newValue
                                                                        });
                                                                    }}
                                                                    renderInput={(params: any) => (
                                                                        <TextField
                                                                            size="small"
                                                                            helperText="黑名单可以输入多个，输入之后回车完成输入"
                                                                            labelId="blackList"
                                                                            name="blackList"
                                                                            color="secondary"
                                                                            {...params}
                                                                        />
                                                                    )}
                                                                />
                                                            </FormControl>
                                                        </Grid>
                                                        <Grid item md={6}>
                                                            <SubCard
                                                                sx={{ p: '0 !important', background: 'rgba(230,230,231,.4)' }}
                                                                contentSX={{ p: '10px !important' }}
                                                            >
                                                                <Typography mb={1} variant="h5">
                                                                    说明
                                                                    <img style={{ verticalAlign: 'sub' }} width="18px" src={Tips} alt="" />
                                                                </Typography>
                                                                <Typography fontSize="12px">
                                                                    黑名单：清除指定标签或ID下的网页数据
                                                                </Typography>
                                                                <Typography fontSize="12px">标签格式：.＋具体标签，例：.a</Typography>
                                                                <Typography fontSize="12px">ID格式：#＋具体ID，例：#dda23</Typography>
                                                            </SubCard>
                                                        </Grid>
                                                        <Grid item md={4}>
                                                            <FormControl size="small" error={!cleanRule.convertFormat} fullWidth>
                                                                <InputLabel
                                                                    sx={{
                                                                        background: '#f8fafc',
                                                                        pl: '10px',
                                                                        pr: '4px',
                                                                        fontSize: '1.07rem',
                                                                        left: '-5px',
                                                                        display: 'flex',
                                                                        alignItems: 'center'
                                                                    }}
                                                                    shrink
                                                                    color="secondary"
                                                                    id="type"
                                                                >
                                                                    转化格式
                                                                    <Tooltip
                                                                        title={
                                                                            <Box>
                                                                                <Typography>
                                                                                    txt：仅保存网页内文本信息，无图片格式
                                                                                </Typography>
                                                                                <Typography>markdown：包含网页图片及格式信息</Typography>
                                                                            </Box>
                                                                        }
                                                                        placement="top"
                                                                    >
                                                                        <HelpOutline fontSize="small" />
                                                                    </Tooltip>
                                                                </InputLabel>
                                                                <Select
                                                                    name="convertFormat"
                                                                    value={cleanRule.convertFormat}
                                                                    onChange={handleCleanRule}
                                                                    fullWidth
                                                                    color="secondary"
                                                                    labelId="type"
                                                                    label="转化格式"
                                                                >
                                                                    {ruleFormatList.map((item: any) => (
                                                                        <MenuItem key={item.type} value={item.type}>
                                                                            {item.typeName}
                                                                        </MenuItem>
                                                                    ))}
                                                                </Select>
                                                                {!cleanRule.convertFormat && <FormHelperText>转化格式必填</FormHelperText>}
                                                                {cleanRule.convertFormat && <FormHelperText> </FormHelperText>}
                                                            </FormControl>
                                                        </Grid>
                                                        <Grid item md={4}>
                                                            <FormControl size="small" error={!cleanRule.acceptLanguage} fullWidth>
                                                                <InputLabel
                                                                    sx={{
                                                                        background: '#f8fafc',
                                                                        pl: '10px',
                                                                        pr: '4px',
                                                                        fontSize: '1.07rem',
                                                                        left: '-5px',
                                                                        display: 'flex',
                                                                        alignItems: 'center'
                                                                    }}
                                                                    shrink
                                                                    color="secondary"
                                                                    id="type"
                                                                >
                                                                    网页语言
                                                                    <Tooltip
                                                                        title={
                                                                            <Box>
                                                                                <Typography>
                                                                                    网页语言：根据网站语言设置获取网页的语言
                                                                                </Typography>
                                                                                <Typography>默认：中文</Typography>
                                                                            </Box>
                                                                        }
                                                                        placement="top"
                                                                    >
                                                                        <HelpOutline fontSize="small" />
                                                                    </Tooltip>
                                                                </InputLabel>
                                                                <Select
                                                                    fullWidth
                                                                    name="acceptLanguage"
                                                                    value={cleanRule.acceptLanguage}
                                                                    onChange={handleCleanRule}
                                                                    color="secondary"
                                                                    labelId="type"
                                                                    label="网页语言"
                                                                >
                                                                    <MenuItem value="zh-CN">中文</MenuItem>
                                                                    <MenuItem value="en-US">英文</MenuItem>
                                                                </Select>
                                                                {!cleanRule.acceptLanguage && <FormHelperText>转化格式必填</FormHelperText>}
                                                                {cleanRule.acceptLanguage && <FormHelperText> </FormHelperText>}
                                                            </FormControl>
                                                        </Grid>
                                                    </Grid>
                                                </>
                                            )}
                                            <span
                                                className={
                                                    "!mt-[16px] before:bg-[#673ab7] before:left-0 before:top-[2px] before:content-[''] before:w-[3px] before:h-[14px] before:absolute before:ml-0.5 block text-[1.125rem] font-medium pl-[12px] relative text-black"
                                                }
                                            >
                                                通用清洗规则
                                            </span>
                                            <Grid container spacing={2}>
                                                <Grid item md={4}>
                                                    <span style={{ verticalAlign: 'middle' }} className={'text-#697586'}>
                                                        清除html标签
                                                    </span>
                                                    <Tooltip
                                                        placement="top"
                                                        title="此功能可以帮助您去除文本中的HTML标签，使文本更纯净，适用于从网页上提取文本时去除不必要的HTML标签"
                                                    >
                                                        <HelpOutline style={{ verticalAlign: 'middle' }} fontSize="small" />
                                                    </Tooltip>
                                                    <Switch
                                                        name="removeAllHtmlTags"
                                                        checked={commonCleanRule.removeAllHtmlTags}
                                                        onChange={handleCommonCleanRule}
                                                        color="secondary"
                                                    />
                                                </Grid>
                                                <Grid item md={4}>
                                                    <span style={{ verticalAlign: 'middle' }} className={'text-#697586'}>
                                                        清除所有图片
                                                    </span>
                                                    <Tooltip
                                                        placement="top"
                                                        title="此功能将移除文本中的所有图片，适用于需要纯文字处理的情况"
                                                    >
                                                        <HelpOutline style={{ verticalAlign: 'middle' }} fontSize="small" />
                                                    </Tooltip>
                                                    <Switch
                                                        name="removeAllImage"
                                                        checked={commonCleanRule.removeAllImage}
                                                        onChange={handleCommonCleanRule}
                                                        color="secondary"
                                                    />
                                                </Grid>
                                                {/* <Grid item md={4}>
                                                            <span className={'text-#697586'}>清除连续换行符</span>
                                                            <Switch
                                                                name="removeConsecutiveNewlines"
                                                                checked={commonCleanRule.removeConsecutiveNewlines}
                                                                onChange={handleCommonCleanRule}
                                                                color="secondary"
                                                            />
                                                        </Grid>
                                                        <Grid item md={4}>
                                                            <span className={'text-#697586'}>清除制表符</span>
                                                            <Switch
                                                                name="removeConsecutiveTabs"
                                                                checked={commonCleanRule.removeConsecutiveTabs}
                                                                onChange={handleCommonCleanRule}
                                                                color="secondary"
                                                            />
                                                        </Grid> */}
                                                <Grid item md={4}>
                                                    <span style={{ verticalAlign: 'middle' }} className={'text-#697586'}>
                                                        清除电子邮箱地址
                                                    </span>
                                                    <Tooltip
                                                        placement="top"
                                                        title="此功能可以检测并移除文本中的所有电子邮件地址，保护您的隐私和安全"
                                                    >
                                                        <HelpOutline style={{ verticalAlign: 'middle' }} fontSize="small" />
                                                    </Tooltip>
                                                    <Switch
                                                        name="removeUrlsEmails"
                                                        checked={commonCleanRule.removeUrlsEmails}
                                                        onChange={handleCommonCleanRule}
                                                        color="secondary"
                                                    />
                                                </Grid>
                                                <Grid item md={12}>
                                                    <span style={{ verticalAlign: 'middle' }} className={'text-#697586'}>
                                                        替换掉连续的空格、换行符和制表符
                                                    </span>
                                                    <Tooltip
                                                        placement="top"
                                                        title="此功能可以将连续的空格、换行符和制表符替换为单个实例，使文本更整洁，适用于文本格式化和清理"
                                                    >
                                                        <HelpOutline style={{ verticalAlign: 'middle' }} fontSize="small" />
                                                    </Tooltip>
                                                    <Switch
                                                        name="removeConsecutiveSpaces"
                                                        checked={commonCleanRule.removeConsecutiveSpaces}
                                                        onChange={() => {
                                                            setCommonCleanRule({
                                                                ...commonCleanRule,
                                                                removeConsecutiveSpaces: !commonCleanRule.removeConsecutiveSpaces,
                                                                removeConsecutiveNewlines: !commonCleanRule.removeConsecutiveNewlines,
                                                                removeConsecutiveTabs: !commonCleanRule.removeConsecutiveTabs
                                                            });
                                                        }}
                                                        color="secondary"
                                                    />
                                                </Grid>
                                            </Grid>
                                        </Box>
                                    )}
                                    {activeStep === 1 && (
                                        <Box>
                                            <span
                                                className={
                                                    "!mt-[24px] !mb-[16px] before:bg-[#673ab7] before:left-0 before:top-[2px] before:content-[''] before:w-[3px] before:h-[14px] before:absolute before:ml-0.5 block text-[1.125rem] font-medium pl-[12px] relative text-black"
                                                }
                                            >
                                                分段清洗规则
                                            </span>
                                            <Grid container spacing={2}>
                                                <Grid item md={4}>
                                                    <FormControl size="small" error={!splitRule.chunkSize && sizeOpen} fullWidth>
                                                        <InputLabel
                                                            sx={{
                                                                background: '#f8fafc',
                                                                pl: '10px',
                                                                pr: '4px',
                                                                fontSize: '1.07rem',
                                                                left: '-5px',
                                                                display: 'flex',
                                                                alignItems: 'center'
                                                            }}
                                                            shrink
                                                            color="secondary"
                                                            id="chunkSize"
                                                        >
                                                            分段大小
                                                            <Tooltip
                                                                title="根据文本内容设定合理的数据块大小，以实现更准确的数据查询"
                                                                placement="top"
                                                            >
                                                                <HelpOutline fontSize="small" />
                                                            </Tooltip>
                                                        </InputLabel>
                                                        <TextField
                                                            size="small"
                                                            name="chunkSize"
                                                            color="secondary"
                                                            fullWidth
                                                            error={!splitRule.chunkSize && sizeOpen}
                                                            helperText={!splitRule.chunkSize && sizeOpen ? '分段大小必填' : ' '}
                                                            value={splitRule.chunkSize}
                                                            type="number"
                                                            onChange={(e: any) => {
                                                                setSizeOpen(true);
                                                                const { name, value } = e.target;
                                                                setSplitRule({
                                                                    ...splitRule,
                                                                    [name]: value
                                                                });
                                                            }}
                                                            InputLabelProps={{ shrink: true }}
                                                        />
                                                    </FormControl>
                                                </Grid>
                                                <Grid item md={12}>
                                                    <FormControl
                                                        error={splitRule.separator && splitRule.separator.length === 0}
                                                        size="small"
                                                        fullWidth
                                                    >
                                                        <InputLabel
                                                            sx={{
                                                                background: '#f8fafc',
                                                                pl: '10px',
                                                                pr: '4px',
                                                                fontSize: '1.07rem',
                                                                left: '-5px',
                                                                display: 'flex',
                                                                alignItems: 'center'
                                                            }}
                                                            shrink
                                                            color="secondary"
                                                            id="splitRule"
                                                        >
                                                            分隔符
                                                            <Tooltip
                                                                title="支持逗号、句号、换行等分隔符，对数据进行分块，有助于更准确的分析文件"
                                                                placement="top"
                                                            >
                                                                <HelpOutline fontSize="small" />
                                                            </Tooltip>
                                                        </InputLabel>
                                                        <Autocomplete
                                                            size="small"
                                                            multiple
                                                            options={[]}
                                                            defaultValue={splitRule.separator}
                                                            freeSolo
                                                            renderTags={(value: readonly string[], getTagProps) =>
                                                                value.map((option: string, index: number) => (
                                                                    <Chip
                                                                        size="small"
                                                                        key={index}
                                                                        label={option}
                                                                        onDelete={getTagProps({ index }).onDelete}
                                                                    />
                                                                ))
                                                            }
                                                            onChange={(e: any, newValue) => {
                                                                setSplitRule({
                                                                    ...splitRule,
                                                                    separator: newValue
                                                                });
                                                            }}
                                                            renderInput={(params: any) => (
                                                                <TextField
                                                                    size="small"
                                                                    error={splitRule.separator && splitRule.separator.length === 0}
                                                                    helperText={
                                                                        splitRule.separator && splitRule.separator.length === 0
                                                                            ? '分隔符必填'
                                                                            : ' '
                                                                    }
                                                                    labelId="splitRule"
                                                                    name="splitRule"
                                                                    color="secondary"
                                                                    {...params}
                                                                />
                                                            )}
                                                        />
                                                    </FormControl>
                                                </Grid>
                                            </Grid>
                                        </Box>
                                    )}
                                    {activeStep === 2 && basis.ruleType !== 'DOCUMENT' && (
                                        <>
                                            <CardContent sx={{ p: '0px !important' }}>
                                                <Grid sx={{ mt: 2 }} flexWrap="nowrap" container spacing={2}>
                                                    <Grid item md={6} xs={12}>
                                                        {basis.ruleType === 'CHARACTERS' && (
                                                            <Box>
                                                                <form onSubmit={formik.handleSubmit}>
                                                                    <TextField
                                                                        label={'标题'}
                                                                        fullWidth
                                                                        id="title"
                                                                        name="title"
                                                                        color="secondary"
                                                                        InputLabelProps={{ shrink: true }}
                                                                        value={formik.values.title}
                                                                        onChange={formik.handleChange}
                                                                        error={formik.touched.title && Boolean(formik.errors.title)}
                                                                        helperText={formik.touched.title && formik.errors.title}
                                                                    />
                                                                    <Box position="relative">
                                                                        <TextField
                                                                            label={'内容'}
                                                                            fullWidth
                                                                            id="context"
                                                                            name="context"
                                                                            color="secondary"
                                                                            placeholder="文本内容，请输入 150000 字符以内"
                                                                            InputLabelProps={{ shrink: true }}
                                                                            value={formik.values.context}
                                                                            onChange={formik.handleChange}
                                                                            error={formik.touched.context && Boolean(formik.errors.context)}
                                                                            helperText={
                                                                                (formik.touched.context && formik.errors.context) || ' '
                                                                            }
                                                                            className={'mt-3'}
                                                                            multiline
                                                                            minRows={6}
                                                                            maxRows={6}
                                                                        />
                                                                        <Box
                                                                            position="absolute"
                                                                            bottom="0px"
                                                                            right="5px"
                                                                            fontSize="0.75rem"
                                                                        >
                                                                            {formik.values.context.length}/150000个
                                                                        </Box>
                                                                    </Box>
                                                                </form>
                                                            </Box>
                                                        )}
                                                        {basis.ruleType === 'HTML' && (
                                                            <Box>
                                                                <div className="text-sm text-[#9da3af]">
                                                                    请避免非法抓取他人网站的侵权行为，保证链接可公开访问，且网站内容可复制
                                                                </div>
                                                                <TextField
                                                                    label="网页地址"
                                                                    fullWidth
                                                                    focused
                                                                    id="url"
                                                                    name="url"
                                                                    color="secondary"
                                                                    value={url}
                                                                    onChange={(e) => {
                                                                        setUrl(e.target.value);
                                                                    }}
                                                                    error={!isValid}
                                                                    placeholder="网站通过http://、https://、www.开头多个网站通过换行分割避免解析错误"
                                                                    className={'mt-3'}
                                                                    multiline
                                                                    minRows={6}
                                                                    maxRows={6}
                                                                />
                                                                {!isValid && (
                                                                    <div className="text-[#f44336] mt-1">{'请输入正确的网络地址'}</div>
                                                                )}
                                                            </Box>
                                                        )}
                                                    </Grid>
                                                    <Divider
                                                        sx={{ ml: 2, display: { md: 'block', xs: 'none' } }}
                                                        orientation="vertical"
                                                        flexItem
                                                    />
                                                    <Grid item md={6} xs={12}>
                                                        <TextField
                                                            multiline
                                                            minRows={8}
                                                            maxRows={8}
                                                            fullWidth
                                                            color="secondary"
                                                            value={result}
                                                            label="调试结果"
                                                            InputLabelProps={{ shrink: true }}
                                                        />
                                                    </Grid>
                                                </Grid>
                                            </CardContent>
                                            <Divider />
                                            <CardActions sx={{ p: 2 }}>
                                                <Grid container justifyContent="flex-end">
                                                    <Button
                                                        variant="contained"
                                                        onClick={() => {
                                                            if (basis.ruleType === 'HTML') {
                                                                saveUrl();
                                                            } else {
                                                                formik.handleSubmit();
                                                            }
                                                        }}
                                                        color="secondary"
                                                    >
                                                        调试
                                                    </Button>
                                                </Grid>
                                            </CardActions>
                                        </>
                                    )}
                                    {activeStep === 2 && basis.ruleType === 'DOCUMENT' && (
                                        <Typography textAlign="center">文档暂不支持调试</Typography>
                                    )}
                                    <Box mt={5} display="flex" justifyContent="center">
                                        {activeStep > 0 && (
                                            <Button
                                                onClick={() => {
                                                    handleStep('on');
                                                }}
                                                color="secondary"
                                                variant="outlined"
                                            >
                                                上一步
                                            </Button>
                                        )}
                                        {activeStep < 2 && (
                                            <Button
                                                sx={{ ml: 1 }}
                                                onClick={() => {
                                                    handleStep('next');
                                                }}
                                                color="secondary"
                                                variant="outlined"
                                            >
                                                下一步
                                            </Button>
                                        )}
                                        {activeStep === 2 && (
                                            <Button
                                                sx={{ ml: 1 }}
                                                disabled={basis.ruleType !== 'DOCUMENT' && saveBtn}
                                                onClick={addSave}
                                                variant="outlined"
                                                color="secondary"
                                            >
                                                保存
                                            </Button>
                                        )}
                                    </Box>
                                </CardContent>
                            </MainCard>
                        </Modal>
                    )}
                </CardContent>
            </MainCard>
        </Modal>
    );
};
export default AddRuleModal;
