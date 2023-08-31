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
    Stack,
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
    StepButton
} from '@mui/material';
import { Close } from '@mui/icons-material';
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
import DeBug from './debug';
import { useEffect, useState } from 'react';
import { rulePage, ruleFormatType, ruleCreateRule, ruleUpdateRule, ruleRuleType, ruleDel } from 'api/chat';
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
                ruleFilter: []
            });
            setCleanRule({
                whiteList: [],
                blackList: [],
                convertFormat: '',
                acceptLanguage: ''
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
                separator: []
            });
            setEditData({});
        }
    }, [addOpen]);
    //基础规则
    const [basis, setBasis] = useState<Basis>({
        enable: true,
        ruleFilter: []
    });
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
        convertFormat: '',
        acceptLanguage: ''
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
        separator: []
    });
    //编辑保存的数据
    const [editData, setEditData] = useState<any>({});
    //新增编辑
    const addSave = async () => {
        const newArr = [...Object.values(basis), ...Object.values(commonCleanRule), ...Object.values(splitRule)];
        if (basis.ruleType === 'HTML') {
            newArr.push(...Object.values(cleanRule));
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
    const steps = ['清洗', '分段', '调试与保存'];
    const [activeStep, setActiveStep] = useState(0);
    const [completed, setCompleted] = useState<{
        [k: number]: boolean;
    }>({});
    const handleStep = (step: number) => () => {
        setActiveStep(step);
        // setCompleted({
        //     ...completed,
        //     [step]: true
        // });
    };
    //调试
    const [deBugData, setDeBugData] = useState<{ ruleType: string }>({
        ruleType: 'HTML'
    });
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
            const res = await ruleDebugRule({
                appId: datasetUid,
                url: '',
                title: values.title,
                context: values.context,
                dataType: 'CHARACTERS'
            });
            setRuleName(res.ruleName);
            setResult(res.data);
        }
    });
    //网页
    const [isValid, setIsValid] = useState(true);
    const [url, setUrl] = useState('');
    const saveUrl = async () => {
        if (url && isValid) {
            const res = await ruleDebugRule({
                appId: datasetUid,
                url,
                title: '',
                context: '',
                dataType: 'HTML'
            });
            setRuleName(res.ruleName);
            setResult(res.data);
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
    //规则名称
    const [ruleName, setRuleName] = useState('');
    //调试结果
    const [result, setResult] = useState('');
    return (
        <Modal open={open} onClose={() => handleClose(false)} aria-labelledby="modal-title" aria-describedby="modal-description">
            <MainCard
                style={{
                    position: 'absolute',
                    width: '80%',
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
                                <TableCell align="center">过滤项</TableCell>
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
                            onClose={() => setAddOpen(false)}
                            aria-labelledby="modal-title"
                            aria-describedby="modal-description"
                        >
                            <MainCard
                                style={{
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
                                    <IconButton onClick={() => setAddOpen(false)}>
                                        <Close fontSize="small" />
                                    </IconButton>
                                }
                            >
                                <CardContent sx={{ p: '16px !important' }}>
                                    <Stepper nonLinear activeStep={activeStep}>
                                        {steps.map((label, index) => (
                                            <Step color="secondary" key={label} completed={completed[index]}>
                                                <StepButton color="inherit" onClick={handleStep(index)}>
                                                    {label}
                                                </StepButton>
                                            </Step>
                                        ))}
                                    </Stepper>
                                    {activeStep === 0 && (
                                        <Box mt={2}>
                                            <Grid container spacing={2}>
                                                <Grid item md={4}>
                                                    <TextField
                                                        size="small"
                                                        label="规划名称"
                                                        name="ruleName"
                                                        color="secondary"
                                                        fullWidth
                                                        error={!basis.ruleName}
                                                        helperText={!basis.ruleName ? '规划名称必填' : ' '}
                                                        value={basis.ruleName}
                                                        onChange={handleBasis}
                                                        InputLabelProps={{ shrink: true }}
                                                    />
                                                </Grid>
                                                <Grid item md={4}>
                                                    <FormControl size="small" error={!basis.ruleType} fullWidth>
                                                        <InputLabel color="secondary" id="type">
                                                            类型
                                                        </InputLabel>
                                                        <Select
                                                            fullWidth
                                                            name="ruleType"
                                                            value={basis.ruleType}
                                                            onChange={handleBasis}
                                                            color="secondary"
                                                            labelId="type"
                                                            label="类型"
                                                        >
                                                            {typeList.map((item: any) => (
                                                                <MenuItem key={item.type} value={item.type}>
                                                                    {item.typeName}
                                                                </MenuItem>
                                                            ))}
                                                        </Select>
                                                        {!basis.ruleType && <FormHelperText>类型必填</FormHelperText>}
                                                        {basis.ruleType && <FormHelperText> </FormHelperText>}
                                                    </FormControl>
                                                </Grid>
                                                <Grid item md={4}>
                                                    <Stack>
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
                                                                setBasis({
                                                                    ...basis,
                                                                    ruleFilter: newValue
                                                                });
                                                            }}
                                                            renderInput={(params: any) => (
                                                                <TextField
                                                                    InputLabelProps={{ shrink: true }}
                                                                    size="small"
                                                                    error={basis.ruleFilter && basis.ruleFilter.length === 0}
                                                                    helperText={
                                                                        basis.ruleFilter && basis.ruleFilter.length === 0
                                                                            ? '过滤项必填'
                                                                            : ' '
                                                                    }
                                                                    name="ruleFilter"
                                                                    color="secondary"
                                                                    {...params}
                                                                    label="过滤项"
                                                                />
                                                            )}
                                                        />
                                                    </Stack>
                                                </Grid>
                                                <Grid item md={4}>
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
                                                </Grid>
                                            </Grid>
                                            {basis.ruleType === 'HTML' && (
                                                <>
                                                    <span
                                                        className={
                                                            "!mb-[16px] before:bg-[#673ab7] before:left-0 before:top-[2px] before:content-[''] before:w-[3px] before:h-[14px] before:absolute before:ml-0.5 block text-[1.125rem] font-medium pl-[12px] relative text-black"
                                                        }
                                                    >
                                                        网页规则
                                                    </span>
                                                    <Grid container spacing={2}>
                                                        <Grid item md={12}>
                                                            <Stack>
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
                                                                            error={cleanRule.whiteList && cleanRule.whiteList.length === 0}
                                                                            helperText={
                                                                                cleanRule.whiteList && cleanRule.whiteList.length === 0
                                                                                    ? '白名单必填'
                                                                                    : ' '
                                                                            }
                                                                            name="whiteList"
                                                                            color="secondary"
                                                                            {...params}
                                                                            label="白名单"
                                                                        />
                                                                    )}
                                                                />
                                                            </Stack>
                                                        </Grid>
                                                        <Grid item md={12}>
                                                            <Stack>
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
                                                                            error={cleanRule.blackList && cleanRule.blackList.length === 0}
                                                                            helperText={
                                                                                cleanRule.blackList && cleanRule.blackList.length === 0
                                                                                    ? '黑名单必填'
                                                                                    : ' '
                                                                            }
                                                                            name="blackList"
                                                                            color="secondary"
                                                                            {...params}
                                                                            label="黑名单"
                                                                        />
                                                                    )}
                                                                />
                                                            </Stack>
                                                        </Grid>
                                                        <Grid item md={4}>
                                                            <FormControl size="small" error={!cleanRule.convertFormat} fullWidth>
                                                                <InputLabel color="secondary" id="type">
                                                                    转化格式
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
                                                                <InputLabel color="secondary" id="type">
                                                                    网页语言
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
                                                                    <MenuItem value="Chinese">中文</MenuItem>
                                                                    <MenuItem value="English">英文</MenuItem>
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
                                                    "!mt-[24px] before:bg-[#673ab7] before:left-0 before:top-[2px] before:content-[''] before:w-[3px] before:h-[14px] before:absolute before:ml-0.5 block text-[1.125rem] font-medium pl-[12px] relative text-black"
                                                }
                                            >
                                                通用规则
                                            </span>
                                            <Grid container spacing={2}>
                                                <Grid item md={4}>
                                                    <span className={'text-#697586'}>清除html标签</span>
                                                    <Switch
                                                        name="removeAllHtmlTags"
                                                        checked={commonCleanRule.removeAllHtmlTags}
                                                        onChange={handleCommonCleanRule}
                                                        color="secondary"
                                                    />
                                                </Grid>
                                                <Grid item md={4}>
                                                    <span className={'text-#697586'}>清除所有图片</span>
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
                                                    <span className={'text-#697586'}>清除电子邮箱地址</span>
                                                    <Switch
                                                        name="removeUrlsEmails"
                                                        checked={commonCleanRule.removeUrlsEmails}
                                                        onChange={handleCommonCleanRule}
                                                        color="secondary"
                                                    />
                                                </Grid>
                                                <Grid item md={12}>
                                                    <span className={'text-#697586'}>替换掉连续的空格、换行符和制表符</span>
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
                                        <Box mt={2}>
                                            <span
                                                className={
                                                    "!mt-[24px] !mb-[16px] before:bg-[#673ab7] before:left-0 before:top-[2px] before:content-[''] before:w-[3px] before:h-[14px] before:absolute before:ml-0.5 block text-[1.125rem] font-medium pl-[12px] relative text-black"
                                                }
                                            >
                                                分段规则
                                            </span>
                                            <Grid container spacing={2}>
                                                <Grid item md={4}>
                                                    <TextField
                                                        size="small"
                                                        label="分段大小"
                                                        name="chunkSize"
                                                        color="secondary"
                                                        fullWidth
                                                        error={!splitRule.chunkSize}
                                                        helperText={!splitRule.chunkSize ? '规划名称必填' : ' '}
                                                        value={splitRule.chunkSize}
                                                        type="number"
                                                        onChange={(e: any) => {
                                                            const { name, value } = e.target;
                                                            setSplitRule({
                                                                ...splitRule,
                                                                [name]: value
                                                            });
                                                        }}
                                                        InputLabelProps={{ shrink: true }}
                                                    />
                                                </Grid>
                                                <Grid item md={12}>
                                                    <Stack>
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
                                                                            ? '白名单必填'
                                                                            : ' '
                                                                    }
                                                                    name="whiteList"
                                                                    color="secondary"
                                                                    {...params}
                                                                    label="分隔符"
                                                                />
                                                            )}
                                                        />
                                                    </Stack>
                                                </Grid>
                                            </Grid>
                                        </Box>
                                    )}
                                    {activeStep === 2 && (
                                        <>
                                            <CardContent sx={{ p: '16px !important' }}>
                                                <Grid container spacing={6}>
                                                    <Grid item md={6} xs={12}>
                                                        <FormControl fullWidth>
                                                            <InputLabel color="secondary" id="type">
                                                                选择类型
                                                            </InputLabel>
                                                            <Select
                                                                fullWidth
                                                                name="ruleType"
                                                                value={deBugData.ruleType}
                                                                onChange={(e) => {
                                                                    setDeBugData({
                                                                        ...deBugData,
                                                                        ruleType: e.target.value
                                                                    });
                                                                }}
                                                                color="secondary"
                                                                labelId="type"
                                                                label="选择类型"
                                                            >
                                                                {typeList.map((item: any) => (
                                                                    <MenuItem
                                                                        disabled={item.type === 'DOCUMENT'}
                                                                        key={item.type}
                                                                        value={item.type}
                                                                    >
                                                                        {item.typeName}
                                                                    </MenuItem>
                                                                ))}
                                                            </Select>
                                                        </FormControl>
                                                    </Grid>
                                                    <Grid item md={6} xs={12}>
                                                        <TextField
                                                            fullWidth
                                                            value={ruleName}
                                                            InputLabelProps={{ shrink: true }}
                                                            disabled
                                                            label="规则名称"
                                                        />
                                                    </Grid>
                                                </Grid>
                                                <Grid sx={{ mt: 2 }} flexWrap="nowrap" container spacing={2}>
                                                    <Grid item md={6} xs={12}>
                                                        {deBugData.ruleType === 'CHARACTERS' && (
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
                                                        {deBugData.ruleType === 'HTML' && (
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
                                                            if (deBugData.ruleType === 'HTML') {
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
                                </CardContent>
                                <Divider sx={{ mt: 2 }} />
                                <CardActions sx={{ p: 2 }}>
                                    <Grid container justifyContent="flex-end">
                                        <Button onClick={addSave} variant="contained" color="secondary">
                                            保存
                                        </Button>
                                    </Grid>
                                </CardActions>
                            </MainCard>
                        </Modal>
                    )}
                </CardContent>
            </MainCard>
        </Modal>
    );
};
export default AddRuleModal;
