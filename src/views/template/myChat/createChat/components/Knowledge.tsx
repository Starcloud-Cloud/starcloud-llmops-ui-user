import AddIcon from '@mui/icons-material/Add';
import ArticleIcon from '@mui/icons-material/Article';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import HighlightOffIcon from '@mui/icons-material/HighlightOff';
import HelpOutlineOutlinedIcon from '@mui/icons-material/HelpOutlineOutlined';
import CloseIcon from '@mui/icons-material/Close';
import DeleteOutlineIcon from '@mui/icons-material/DeleteOutline';
import SimCardDownloadIcon from '@mui/icons-material/SimCardDownload';
import EditIcon from '@mui/icons-material/EditTwoTone';
import DeleteIcon from '@mui/icons-material/Delete';
import MoreHorizIcon from '@mui/icons-material/MoreHoriz';
import LinkIcon from '@mui/icons-material/Link';
import { Dropdown } from 'antd';
import { v4 as uuidv4 } from 'uuid';
import MoreHorizOutlinedIcon from '@mui/icons-material/MoreHorizOutlined';
import documnt from 'assets/images/upLoad/document.svg';
import formatDate, { formatYear } from 'hooks/useDate';
import zhong from 'assets/images/chat/定位-圆-1.svg';
// import fetch from 'utils/fetch';
import {
    Box,
    Button,
    CardActions,
    CardContent,
    Chip,
    Divider,
    Grid,
    IconButton,
    Link,
    Modal,
    Tab,
    Tabs,
    TextField,
    Tooltip,
    Typography,
    useTheme,
    Table,
    TableHead,
    TableRow,
    TableCell,
    TableBody,
    TableContainer,
    FormControl,
    InputLabel,
    Select,
    MenuItem
} from '@mui/material';
import LoadingButton from '@mui/lab/LoadingButton';
import { Tag } from 'antd';
import { CheckCircleOutlined, CloseCircleOutlined, LoadingOutlined } from '@ant-design/icons';
import workWechatPay from 'assets/images/landing/work_wechat_pay.png';
import { Upload, UploadProps, Popover, Progress } from 'antd';
import { useFormik } from 'formik';
import React, { useState, useEffect, useRef } from 'react';
import { dispatch, useDispatch } from 'store';
import { gridSpacing } from 'store/constant';
import { openSnackbar } from 'store/slices/snackbar';
import { TabsProps } from 'types';
import { Confirm } from 'ui-component/Confirm';
import MainCard from 'ui-component/cards/MainCard';
import SubCard from 'ui-component/cards/SubCard';
import * as yup from 'yup';
import {
    delDataset,
    getDetails,
    detailsSplit,
    getDatasetSource,
    uploadCharacters,
    uploadUrls,
    documentText
} from '../../../../../api/chat';
import { getAccessToken } from '../../../../../utils/auth';
import AddRuleModal from './modal/addRule';

function TabPanel({ children, value, index, ...other }: TabsProps) {
    return (
        <div role="tabpanel" hidden={value !== index} id={`simple-tabpanel-${index}`} aria-labelledby={`simple-tab-${index}`} {...other}>
            {value === index && (
                <Box sx={{ p: 3 }}>
                    <Typography>{children}</Typography>
                </Box>
            )}
        </div>
    );
}

function a11yProps(index: number) {
    return {
        id: `simple-tab-${index}`,
        'aria-controls': `simple-tabpanel-${index}`
    };
}

const validationSchema = yup.object({
    title: yup.string().required(''),
    context: yup.string().required('')
});

const transformDataType = (dataType: string) => {
    switch (dataType) {
        case 'DOCUMENT':
            return <ArticleIcon className="text-[#5e35b1] text-base mr-2" />;
        case 'HTML':
            return <LinkIcon className="text-[#5e35b1] text-base mr-2" />;
        case 'CHARACTERS':
            return <EditIcon className="text-[#5e35b1] text-base mr-2" />;
    }
};

const QAModal = ({ open, handleClose }: { open: boolean; handleClose: () => void }) => {
    const theme = useTheme();
    const dispatch = useDispatch();
    const [valueLabel, setValueLabel] = useState('checked');
    const [value, setValue] = React.useState(0);

    const handleChange = (event: React.SyntheticEvent, newValue: number) => {
        setValue(newValue);
    };

    const { Dragger } = Upload;

    const formik = useFormik({
        initialValues: {
            title: '',
            context: ''
        },
        validationSchema,
        onSubmit: (values) => {
            dispatch(
                openSnackbar({
                    open: true,
                    message: 'Submit Success',
                    variant: 'alert',
                    alert: {
                        color: 'success'
                    },
                    close: false
                })
            );
        }
    });

    const props: UploadProps = {
        name: 'file',
        multiple: true,
        action: 'https://www.mocky.io/v2/5cc8019d300000980a055e76',
        onChange(info) {
            const { status } = info.file;
            if (status !== 'uploading') {
                console.log(info.file, info.fileList);
            }
            if (status === 'done') {
            } else if (status === 'error') {
            }
        },
        onDrop(e) {
            console.log('Dropped files', e.dataTransfer.files);
        }
    };

    return (
        <Modal open={open} onClose={handleClose} aria-labelledby="modal-title" aria-describedby="modal-description">
            <MainCard
                style={{
                    position: 'absolute',
                    width: '800px',
                    top: '50%',
                    left: '50%',
                    transform: 'translate(-50%, -50%)'
                }}
                title="添加问答"
                content={false}
                secondary={
                    <IconButton onClick={handleClose} size="large" aria-label="close modal">
                        <CloseIcon fontSize="small" />
                    </IconButton>
                }
            >
                <CardContent>
                    <>
                        <Tabs
                            value={value}
                            variant="scrollable"
                            onChange={handleChange}
                            sx={{
                                mb: 3,
                                '& a': {
                                    minHeight: 'auto',
                                    minWidth: 10,
                                    py: 1.5,
                                    px: 1,
                                    mr: 2.2,
                                    color: theme.palette.grey[600],
                                    display: 'flex',
                                    flexDirection: 'row',
                                    alignItems: 'center',
                                    justifyContent: 'center'
                                },
                                '& a.Mui-selected': {
                                    color: theme.palette.primary.main
                                },
                                '& a > svg': {
                                    mb: '0px !important',
                                    mr: 1.1
                                }
                            }}
                        >
                            <Tab component={Link} label="批量上传" {...a11yProps(0)} />
                            <Tab component={Link} label="输入问答" {...a11yProps(1)} />
                        </Tabs>
                        <TabPanel value={value} index={0}>
                            <div className="text-sm text-[#9da3af]">
                                <a className="text-[#673ab7]">点击此处下载模板</a> 完成填写后再上传，问题总数不超过条10000条
                            </div>
                            <div className="mt-3">
                                <Dragger {...props}>
                                    <p className="ant-upload-drag-icon">
                                        <AddIcon />
                                    </p>
                                    <p className="ant-upload-text">将文件拖到此处，或点击上传</p>
                                </Dragger>
                            </div>
                        </TabPanel>
                        <TabPanel value={value} index={1}>
                            <form onSubmit={formik.handleSubmit}>
                                <TextField
                                    label={'问题'}
                                    fullWidth
                                    id="title"
                                    name="title"
                                    value={formik.values.title}
                                    onChange={formik.handleChange}
                                    error={formik.touched.title && Boolean(formik.errors.title)}
                                    helperText={formik.touched.title && formik.errors.title}
                                />
                                <TextField
                                    label={'答案'}
                                    fullWidth
                                    id="context"
                                    name="context"
                                    value={formik.values.context}
                                    onChange={formik.handleChange}
                                    error={formik.touched.context && Boolean(formik.errors.context)}
                                    helperText={formik.touched.context && formik.errors.context}
                                    className={'mt-3'}
                                    multiline
                                    minRows={6}
                                />
                            </form>
                        </TabPanel>
                    </>
                </CardContent>
                <Divider />
                <CardActions>
                    <Grid container justifyContent="flex-end">
                        <Button
                            type="submit"
                            variant="contained"
                            color="secondary"
                            onClick={() => {
                                console.log(formik);
                            }}
                        >
                            保存
                        </Button>
                    </Grid>
                </CardActions>
            </MainCard>
        </Modal>
    );
};

const DocumentModal = ({
    open,
    datasetId,
    handleClose,
    forceUpdate
}: {
    open: boolean;
    datasetId: string;
    handleClose: () => void;
    forceUpdate: () => void;
}) => {
    const theme = useTheme();
    const dispatch = useDispatch();
    const [valueLabel, setValueLabel] = useState('checked');
    const [value, setValue] = React.useState(0);

    const handleChange = (event: React.SyntheticEvent, newValue: number) => {
        setValue(newValue);
    };

    const { Dragger } = Upload;
    // TODO 最大20M, 以及错误的提示
    const props: UploadProps = {
        name: 'file',
        multiple: true,
        action: `${process.env.REACT_APP_BASE_URL}${process.env.REACT_APP_API_URL}/llm/dataset-source-data/uploadFiles`,
        data: {
            appId: datasetId,
            batch: uuidv4()
        },
        headers: {
            Authorization: 'Bearer ' + getAccessToken()
        },
        accept: '.pdf, .docx, .txt, .pptx, .epub, .md, .csv',
        maxCount: 20,
        onChange(info) {
            // const { status } = info.file;
            // if (status !== 'uploading') {
            //     console.log(info.file, info.fileList);
            // }
            if (info.fileList.every((value) => value.status !== 'uploading')) {
                const errMsg = info.fileList.map((item: any) => {
                    if (!item.response.data.status) {
                        return item.response.data.errMsg;
                    }
                });
                if (errMsg.length > 0 && errMsg[0] !== undefined) {
                    dispatch(
                        openSnackbar({
                            open: true,
                            message: errMsg.map((item: any) => <Typography key={item}>{item}</Typography>),
                            variant: 'alert',
                            alert: {
                                color: 'error'
                            },
                            close: false
                        })
                    );
                }
                handleClose();
                forceUpdate();
            }
            // else if (status === 'error') {
            // }
        },
        onDrop(e) {
            console.log('Dropped files', e.dataTransfer.files);
        }
    };

    const formik = useFormik({
        initialValues: {
            title: `文本：${formatDate(new Date().getTime())}`,
            context: ''
        },
        validationSchema: yup.object({
            title: yup.string().required('标题是必填的'),
            context: yup.string().max(150000, '文本过长、请减少到150000字以内').required('内容是必填的')
        }),
        onSubmit: (values) => {
            uploadCharacters({ characterVOS: [values], appId: datasetId, batch: uuidv4() }).then((res) => {
                dispatch(
                    openSnackbar({
                        open: true,
                        message: 'Submit Success',
                        variant: 'alert',
                        alert: {
                            color: 'success'
                        },
                        close: false
                    })
                );
                handleClose();
                forceUpdate();
            });
        }
    });
    const [isValid, setIsValid] = useState(true);
    const [websiteCount, setWebsiteCount] = useState(0);
    const [url, setUrl] = useState<string>('');
    const saveUrl = () => {
        if (url && isValid) {
            uploadUrls({ urls: url.split('\n').filter((value) => value !== ''), batch: uuidv4(), appId: datasetId }).then((res) => {
                const errMsg = res.filter((item: any) => {
                    if (!item.status) {
                        return item.errMsg;
                    }
                });
                errMsg.length > 0 &&
                    dispatch(
                        openSnackbar({
                            open: true,
                            message: errMsg.map((item: any) => <Typography key={item}>{item}</Typography>),
                            variant: 'alert',
                            alert: {
                                color: 'error'
                            },
                            close: false
                        })
                    );
                handleClose();
                forceUpdate();
            });
        } else {
            setIsValid(false);
        }
    };
    useEffect(() => {
        if (url) {
            const websites = url
                .trim()
                .split('\n')
                .map((item) => item.trim());
            // 简单验证每个网站地址
            const isValidInput =
                websites.every((website) => /^(http:\/\/|https:\/\/|www\.)[^\s,，]*$/.test(website)) && websites.length <= 25;
            setIsValid(isValidInput);
            // 设置网站地址的数量
            setWebsiteCount(websites.length);
        }
    }, [url]);
    return (
        <Modal open={open} onClose={handleClose} aria-labelledby="modal-title" aria-describedby="modal-description">
            <MainCard
                style={{
                    position: 'absolute',
                    width: '800px',
                    maxHeight: '80%',
                    overflowY: 'auto',
                    top: '10%',
                    left: '50%',
                    transform: 'translate(-50%, 0)'
                }}
                title="添加文档"
                content={false}
                secondary={
                    <IconButton onClick={handleClose} size="large" aria-label="close modal">
                        <CloseIcon fontSize="small" />
                    </IconButton>
                }
            >
                <CardContent sx={{ p: '0 16px !important' }}>
                    <>
                        <Tabs
                            value={value}
                            variant="scrollable"
                            onChange={handleChange}
                            sx={{
                                '& a': {
                                    minHeight: 'auto',
                                    minWidth: 10,
                                    py: 1.5,
                                    px: 1,
                                    mr: 2.2,
                                    color: theme.palette.grey[600],
                                    display: 'flex',
                                    flexDirection: 'row',
                                    alignItems: 'center',
                                    justifyContent: 'center'
                                },
                                '& a.Mui-selected': {
                                    color: theme.palette.primary.main
                                },
                                '& a > svg': {
                                    mb: '0px !important',
                                    mr: 1.1
                                }
                            }}
                        >
                            <Tab component={Link} label="上传文档" {...a11yProps(0)} />
                            <Tab component={Link} label="文本输入" {...a11yProps(1)} />
                            <Tab component={Link} label="网页抓取" {...a11yProps(2)} />
                        </Tabs>
                        {value === 0 && (
                            <Box py={2}>
                                <div className="text-sm text-[#9da3af]">
                                    格式支持 .pdf .docx .txt .md .csv，请确保内容可复制，每个30MB以内，单次最多上传20个。
                                    文档中的表格和图片暂时无法学习。
                                </div>
                                <div className="mt-3">
                                    <Dragger {...props}>
                                        <p className="ant-upload-drag-icon">
                                            <AddIcon />
                                        </p>
                                        <p className="ant-upload-text">将文件拖到此处，或点击上传</p>
                                    </Dragger>
                                </div>
                            </Box>
                        )}
                        {value === 1 && (
                            <Box pt={2}>
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
                                            helperText={(formik.touched.context && formik.errors.context) || ' '}
                                            className={'mt-3'}
                                            multiline
                                            minRows={6}
                                        />
                                        <Box position="absolute" bottom="0px" right="5px" fontSize="0.75rem">
                                            {formik.values.context.length}/150000个
                                        </Box>
                                    </Box>
                                    <Divider sx={{ mt: 2 }} />
                                    <CardActions sx={{ py: 2, px: 0 }}>
                                        <Grid container justifyContent="flex-end">
                                            <Button variant="contained" type="submit" color="secondary">
                                                保存
                                            </Button>
                                        </Grid>
                                    </CardActions>
                                </form>
                            </Box>
                        )}
                        {value === 2 && (
                            <Box pt={2}>
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
                                />
                                <div className="flex justify-between">
                                    {!isValid ? (
                                        <div className="text-[#f44336] mt-1">
                                            {websiteCount <= 25 ? '请输入正确的网络地址' : '网址不能超过20个'}
                                        </div>
                                    ) : (
                                        <div className="mt-1">网站通过http://、https://、www.开头多个网站通过换行分割避免解析错误</div>
                                    )}
                                    <div className="text-right text-stone-600 mr-1 mt-1">{websiteCount || 0}/25个</div>
                                </div>
                                <Divider sx={{ mt: 2 }} />
                                <CardActions sx={{ py: 2, px: 0 }}>
                                    <Grid container justifyContent="flex-end">
                                        <Button variant="contained" onClick={saveUrl} color="secondary">
                                            保存
                                        </Button>
                                    </Grid>
                                </CardActions>
                            </Box>
                        )}
                    </>
                </CardContent>
            </MainCard>
        </Modal>
    );
};
interface DetaData {
    name?: string;
    description?: string;
    dataType?: string;
    cleanContent?: string;
    summary?: string | null;
    dataSourceInfo?: {
        initAddress?: string;
    };
    ruleVO?: {
        ruleName: string;
    };
    storageVO?: {
        storageKey?: string;
    };
}
const DetailModal = ({
    detailOpen,
    uid,
    dataId,
    dataType,
    datasetId,
    detailClose
}: {
    detailOpen: boolean;
    dataType: string | undefined;
    dataId: number | undefined;
    uid: string | undefined;
    datasetId: string;
    detailClose: () => void;
}) => {
    const [detaData, setDetaData] = useState<DetaData>({});
    const [detaList, setDetaList] = useState<{ content: string }[]>([]);
    const [detailPage, setDetailPage] = useState({
        pageNo: 1,
        pageSize: 10
    });
    const [detaotal, setDetaotal] = useState(0);
    const getList = async () => {
        const result = await getDetails(uid as string);
        setDetaData(result);
    };
    useEffect(() => {
        const fn = async () => {
            const res = await detailsSplit({ datasetId, uid, ...detailPage });
            setDetaotal(res.total);
            setDetaList([...detaList, ...res.list]);
        };
        fn();
    }, [detailPage.pageNo]);
    useEffect(() => {
        getList();
    }, []);
    //切换tabs
    const [value, setValue] = useState(0);
    const handleChange = (event: React.SyntheticEvent, newValue: number) => {
        setValue(newValue);
    };
    //页面滚动
    const goodsScroll = (event: any) => {
        const container = event.target;
        const scrollTop = container.scrollTop;
        const clientHeight = container.clientHeight;
        const scrollHeight = container.scrollHeight;
        if (scrollTop + clientHeight >= scrollHeight - 20) {
            if (Math.ceil(detaotal / detailPage.pageSize) > detailPage.pageNo) {
                setDetailPage({
                    ...detailPage,
                    pageNo: detailPage.pageNo + 1
                });
            }
        }
    };
    //命中测试
    const [text, setText] = useState('');
    const [loading, setLoading] = useState(false);
    const [minScore, setMinScore] = useState('');
    const [record, setRecord] = useState<any[]>([]);
    const hitTest = async () => {
        setLoading(true);
        try {
            const res = await documentText({
                text,
                k: 5,
                minScore,
                docId: [dataId]
            });
            setLoading(false);
            setRecord(res.records);
        } catch (err) {
            setLoading(false);
        }
    };
    return (
        <Modal open={detailOpen} onClose={detailClose} aria-labelledby="modal-title" aria-describedby="modal-description">
            <MainCard
                style={{
                    position: 'absolute',
                    width: '800px',
                    top: '10%',
                    left: '50%',
                    transform: 'translate(-50%, 0)',
                    maxHeight: '80%',
                    overflow: 'auto'
                }}
                title="详情"
                content={false}
                secondary={
                    <IconButton onClick={detailClose} size="large" aria-label="close modal">
                        <CloseIcon fontSize="small" />
                    </IconButton>
                }
            >
                <CardContent sx={{ p: 2, pt: 0 }}>
                    <Tabs value={value} onChange={handleChange}>
                        <Tab label="内容" {...a11yProps(0)} />
                        <Tab label="详情" {...a11yProps(1)} />
                        <Tab label="命中测试" {...a11yProps(2)} />
                    </Tabs>
                    {value === 0 && (
                        <Box pt={2}>
                            <Typography variant="h4">标题</Typography>
                            <TextField disabled value={detaData.name} sx={{ mt: 2 }} fullWidth InputLabelProps={{ shrink: true }} />
                            <Typography mt={2} mb={1} variant="h4">
                                原始链接
                            </Typography>
                            <Box>
                                {detaData.dataType === 'HTML' ? detaData.dataSourceInfo?.initAddress : detaData.storageVO?.storageKey}
                                {/* {detaData.dataType === 'HTML' && (
                                    <Button
                                        color="secondary"
                                        variant="outlined"
                                        size="small"
                                        onClick={() => {
                                            window.open(detaData.dataSourceInfo?.initAddress);
                                        }}
                                    >
                                        点击跳转
                                    </Button>
                                )}
                                {detaData.dataType !== 'HTML' && (
                                    <Button
                                        onClick={() => {
                                            fetch(detaData.storageVO?.storageKey as string)
                                                .then((response) => {
                                                    if (response.ok) {
                                                        return response.blob();
                                                    }
                                                })
                                                .then((blob) => {
                                                    // 创建一个临时链接
                                                    const url = window.URL.createObjectURL(blob as Blob);
                                                    // 创建一个临时链接的<a>标签
                                                    const link = document.createElement('a');
                                                    link.href = url;
                                                    link.download = detaData.name as string; // 设置下载的文件名
                                                    link.click();
                                                    // 释放临时链接的资源
                                                    window.URL.revokeObjectURL(url);
                                                })
                                                .catch((error) => {
                                                    console.error('下载文件时出错:', error);
                                                });
                                        }}
                                        color="secondary"
                                        variant="outlined"
                                        size="small"
                                        startIcon={<SimCardDownloadIcon />}
                                    >
                                        下载
                                    </Button>
                                )} */}
                            </Box>
                            <Typography mt={2} variant="h4">
                                规则名称：{detaData.ruleVO?.ruleName}
                            </Typography>
                            <Typography mt={2} mb={2} variant="h4">
                                描述
                            </Typography>
                            <TextField
                                multiline
                                minRows={4}
                                maxRows={4}
                                disabled
                                value={detaData.description}
                                fullWidth
                                InputLabelProps={{ shrink: true }}
                            />
                            <Typography mt={2} mb={2} variant="h4">
                                总结
                            </Typography>
                            <TextField
                                disabled
                                value={detaData.summary}
                                multiline
                                minRows={6}
                                maxRows={6}
                                fullWidth
                                InputLabelProps={{ shrink: true }}
                            />
                        </Box>
                    )}
                    {value === 1 && (
                        <Box sx={{ height: '640px', overflowY: 'auto' }} py={2} onScroll={goodsScroll}>
                            {detaList.length > 0 && <Typography variant="h4">Content</Typography>}
                            <Grid container spacing={2}>
                                {detaList?.map((item) => (
                                    <Grid item md={6} xs={12}>
                                        <TextField
                                            multiline
                                            minRows={4}
                                            maxRows={4}
                                            disabled
                                            value={item.content}
                                            sx={{ mt: 2 }}
                                            fullWidth
                                        />
                                    </Grid>
                                ))}
                            </Grid>
                        </Box>
                    )}
                    {value === 2 && (
                        <Box>
                            <Typography fontSize="18px" mt={2} variant="h5">
                                命中测试
                            </Typography>
                            <Typography mt={1} mb={2} fontSize="12px" color="#697586">
                                基于给定的查询文本测试数据集的命中效果
                            </Typography>
                            <Grid container spacing={2}>
                                <Grid item md={6}>
                                    <TextField
                                        color="secondary"
                                        size="small"
                                        InputLabelProps={{ shrink: true }}
                                        label="源文本"
                                        placeholder="请输入文本，建议使用简短的陈述句"
                                        multiline
                                        value={text}
                                        onChange={(e) => setText(e.target.value)}
                                        minRows={4}
                                        maxRows={4}
                                        fullWidth
                                    />
                                </Grid>
                                <Grid item md={6}>
                                    <TextField
                                        color="secondary"
                                        InputLabelProps={{ shrink: true }}
                                        onChange={(event) => {
                                            const inputValue = event.target.value;
                                            if (!isNaN(Number(inputValue))) {
                                                if ((parseFloat(inputValue) >= 0 && parseFloat(inputValue) <= 1) || inputValue === '') {
                                                    setMinScore(inputValue);
                                                }
                                            }
                                        }}
                                        type="text"
                                        label="最低打分"
                                        value={minScore}
                                        fullWidth
                                        size="small"
                                    />
                                </Grid>
                            </Grid>
                            <Box my={1} display="flex" justifyContent="right">
                                <LoadingButton
                                    sx={{ width: '100px' }}
                                    color="secondary"
                                    onClick={hitTest}
                                    disabled={!text || !minScore}
                                    loading={loading}
                                    loadingIndicator="Loading…"
                                    variant="outlined"
                                >
                                    测试
                                </LoadingButton>
                            </Box>
                            <Typography mb={1} variant="h4">
                                命中段落
                            </Typography>
                            <Grid spacing={3} container>
                                {record.map((item, index: number) => (
                                    <Grid item md={6}>
                                        <Tooltip placement="top" title="分数越高说明查询文本与段落内容越相关，最大值为1">
                                            <Typography display="flex" alignItems="flex-start">
                                                <img style={{ marginRight: '8px' }} width="20px" src={zhong} alt="" />
                                                <Progress
                                                    size="small"
                                                    percent={item.score * 100}
                                                    format={(percent) => `${((percent as number) / 100).toFixed(3)}`}
                                                />
                                            </Typography>
                                        </Tooltip>

                                        <TextField
                                            color="secondary"
                                            size="small"
                                            value={item.content}
                                            disabled
                                            InputLabelProps={{ shrink: true }}
                                            label={`分段序号${item.position}`}
                                            placeholder="请输入文本，建议使用简短的陈述句"
                                            multiline
                                            minRows={4}
                                            maxRows={4}
                                            fullWidth
                                        />
                                        <Typography fontSize="12px" ml={1} fontWeight={500}>
                                            {item.wordCount}字符 &nbsp;&nbsp;&nbsp; {item.hitCount}命中次数
                                        </Typography>
                                    </Grid>
                                ))}
                            </Grid>
                        </Box>
                    )}
                </CardContent>
            </MainCard>
        </Modal>
    );
};

export type typeDocument = typeDocumentChild[];
export type typeDocumentChild = {
    id: number;
    uid: string;
    name: string;
    type: string;
    description?: string;
    position: number;
    dataSourceInfo?: any;
    batch?: any;
    storageVO?: {
        type: string;
        size?: number;
    };
    errorMessage?: string;
    status?: any;
    tokens?: any;
    summaryContent?: string;
    dataType: string;
    updateTime: number;
    wordCount: number;
};

export const Knowledge = ({ datasetId }: { datasetId: string }) => {
    const theme = useTheme();
    const timeoutRef = useRef<any>();
    const InterRef = useRef<any>();
    const [anchorEl, setAnchorEl] = useState<Element | ((element: Element) => Element) | null | undefined>(null);
    const [qaVisible, setQaVisible] = useState(false);
    const [detailOpen, setDetailOpen] = useState(false);
    const [documentVisible, setDocumentVisible] = useState(false);
    const [documentList, setDocumentList] = useState<typeDocument>([]);
    const [QAList, setQAList] = useState([]);
    const [update, setUpdate] = useState(0);
    const [openConfirm, setOpenConfirm] = useState(false);
    const [current, setCurrent] = useState<typeDocumentChild | null>(null);

    const forceUpdate = () => setUpdate((pre) => pre + 1);

    React.useEffect(() => {
        (async () => {
            clearInterval(timeoutRef.current);
            clearTimeout(InterRef.current);
            const res = await getDatasetSource({ datasetId });
            if (
                !res.every(
                    (value: { status: number }) =>
                        value.status >= 90 ||
                        value.status === 0 ||
                        value.status === 15 ||
                        value.status === 25 ||
                        value.status === 35 ||
                        value.status === 45 ||
                        value.status === 55
                )
            ) {
                InterRef.current = setInterval(() => {
                    getDatasetSource({ datasetId }).then((response) => {
                        setDocumentList(response);
                        if (
                            response.every(
                                (value: { status: number }) =>
                                    value.status >= 90 ||
                                    value.status === 0 ||
                                    value.status === 15 ||
                                    value.status === 25 ||
                                    value.status === 35 ||
                                    value.status === 45 ||
                                    value.status === 55
                            )
                        ) {
                            clearInterval(timeoutRef.current);
                            clearTimeout(InterRef.current);
                        }
                    });
                }, 10000);
                timeoutRef.current = setTimeout(() => {
                    clearInterval(InterRef.current);
                }, 300000);
            }
            setDocumentList(res);
        })();
        return () => {
            clearInterval(timeoutRef.current);
            clearTimeout(InterRef.current);
        };
    }, [update]);

    const handleClick = (event: React.MouseEvent<HTMLButtonElement> | undefined) => {
        setAnchorEl(event?.currentTarget);
    };

    const handleClose = async () => {
        setAnchorEl(null);
    };

    const handleDel = async (item: typeDocumentChild) => {
        setAnchorEl(null);
        const res = await delDataset({ id: item.id });
    };

    const handleDelDocument = async () => {
        await delDataset({ id: current?.uid });
        forceUpdate();
        setCurrent(null);
        setOpenConfirm(false);
    };

    //增加规则弹窗
    const [ruleOpen, setRuleOpen] = useState(false);
    return (
        <div>
            <div>
                <div>
                    <Box display="flex" justifyContent="space-between" alignContent="center">
                        <span
                            className={
                                "before:bg-[#673ab7] before:left-0 before:top-[2px] before:content-[''] before:w-[3px] before:h-[14px] before:absolute before:ml-0.5 block text-[1.125rem] font-medium pl-[12px] relative text-black"
                            }
                        >
                            文档式
                            <Tooltip
                                placement="top"
                                title={
                                    <Typography>
                                        完成添加后，AI 将快速完成文档的浏览和学习，并通过 5-10 分钟消化知识，随后可在调试聊天中测试效果。
                                    </Typography>
                                }
                            >
                                <HelpOutlineOutlinedIcon sx={{ display: 'inline-block', verticalAlign: 'middle' }} fontSize="small" />
                            </Tooltip>
                        </span>
                        <Box>
                            <Button
                                variant={'contained'}
                                color={'secondary'}
                                size={'small'}
                                sx={{ mr: 1 }}
                                onClick={() => {
                                    setRuleOpen(true);
                                }}
                            >
                                清洗和分段规则设定
                            </Button>
                            <Button
                                variant={'contained'}
                                startIcon={<AddIcon />}
                                color={'secondary'}
                                size={'small'}
                                onClick={() => {
                                    if (documentList.length >= 2) {
                                        dispatch(
                                            openSnackbar({
                                                open: true,
                                                message: '最多添加两个文档',
                                                variant: 'alert',
                                                alert: {
                                                    color: 'error'
                                                },
                                                close: false
                                            })
                                        );
                                        return;
                                    }
                                    setDocumentVisible(true);
                                }}
                            >
                                添加文档
                            </Button>
                        </Box>
                    </Box>
                    {/* <div
                        className={'mt-3'}
                        style={{
                            margin: '0 auto',
                            textAlign: 'center',
                            height: '350px',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center'
                        }}
                    >
                        <Box>
                            <Popover
                                content={
                                    <div className="flex justify-start items-center flex-col">
                                        <div className="text-sm text-center w-[330px]">
                                            <div>功能正在封闭测试中。</div>
                                            <div>可联系我们产品顾问进一步了解，</div>
                                            <div>并获得提前免费使用的权利。</div>
                                        </div>
                                        <img className="w-40" src={workWechatPay} alt="" />
                                    </div>
                                }
                                trigger="hover"
                            >
                                <svg viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" width="128" height="128">
                                    <path
                                        d="M880.64 358.4h-819.2v423.936c0 34.816 26.624 61.44 61.44 61.44h491.52c12.288 0 20.48 8.192 20.48 20.48s-8.192 20.48-20.48 20.48h-491.52c-57.344 0-102.4-45.056-102.4-102.4v-552.96c0-57.344 45.056-102.4 102.4-102.4h696.32c57.344 0 102.4 45.056 102.4 102.4v176.128c0 12.288-8.192 20.48-20.48 20.48s-20.48-8.192-20.48-20.48v-47.104z m0-40.96v-88.064c0-34.816-26.624-61.44-61.44-61.44h-696.32c-34.816 0-61.44 26.624-61.44 61.44v88.064h819.2z m-204.8-51.2c-12.288 0-20.48-8.192-20.48-20.48s8.192-20.48 20.48-20.48 20.48 8.192 20.48 20.48-8.192 20.48-20.48 20.48z m61.44 0c-12.288 0-20.48-8.192-20.48-20.48s8.192-20.48 20.48-20.48 20.48 8.192 20.48 20.48-8.192 20.48-20.48 20.48z m61.44 0c-12.288 0-20.48-8.192-20.48-20.48s8.192-20.48 20.48-20.48 20.48 8.192 20.48 20.48-8.192 20.48-20.48 20.48z m-448.512 241.664c6.144-10.24 18.432-12.288 28.672-8.192 10.24 6.144 12.288 18.432 8.192 28.672l-102.4 178.176c-6.144 10.24-18.432 12.288-28.672 8.192s-12.288-18.432-8.192-28.672l102.4-178.176z m-126.976 6.144l-55.296 90.112 55.296 94.208c6.144 10.24 2.048 22.528-8.192 28.672-10.24 6.144-22.528 2.048-28.672-8.192l-67.584-114.688 67.584-110.592c6.144-10.24 18.432-12.288 28.672-6.144 10.24 4.096 12.288 16.384 8.192 26.624z m188.416 184.32l55.296-94.208-55.296-90.112c-6.144-10.24-2.048-22.528 6.144-28.672 10.24-6.144 22.528-2.048 28.672 6.144l67.584 110.592-67.584 114.688c-6.144 10.24-18.432 12.288-28.672 8.192-8.192-4.096-10.24-18.432-6.144-26.624z m577.536-122.88l4.096 10.24-40.96 51.2c-8.192 10.24-8.192 26.624 0 36.864l38.912 47.104-4.096 10.24c-8.192 26.624-22.528 51.2-38.912 71.68l-8.192 10.24-61.44-10.24c-12.288-2.048-26.624 6.144-30.72 18.432l-20.48 61.44-10.24 2.048c-32.768 8.192-69.632 8.192-102.4 0l-12.288-2.048-20.48-61.44c-4.096-12.288-18.432-20.48-30.72-18.432l-63.488 10.24-8.192-8.192c-8.192-10.24-16.384-20.48-22.528-32.768-8.192-12.288-14.336-26.624-18.432-40.96l-4.096-10.24 40.96-49.152c8.192-10.24 8.192-26.624 0-36.864l-40.96-49.152 4.096-10.24c10.24-26.624 22.528-51.2 40.96-73.728l8.192-8.192 61.44 10.24c12.288 2.048 26.624-6.144 30.72-18.432l22.528-61.44 10.24-2.048c32.768-6.144 67.584-6.144 100.352 0l12.288 2.048 20.48 59.392c4.096 12.288 18.432 20.48 30.72 20.48l63.488-8.192 8.192 8.192c8.192 10.24 16.384 20.48 22.528 32.768 8.192 12.288 14.336 24.576 18.432 38.912z m-53.248-20.48l-12.288-18.432-38.912 4.096c-32.768 4.096-65.536-16.384-75.776-47.104l-12.288-36.864c-20.48-4.096-40.96-4.096-61.44 0l-14.336 38.912c-10.24 30.72-45.056 51.2-75.776 45.056l-36.864-6.144c-10.24 12.288-16.384 26.624-22.528 40.96l26.624 30.72c20.48 24.576 20.48 63.488 0 90.112l-26.624 30.72c4.096 8.192 6.144 16.384 12.288 24.576 4.096 6.144 6.144 12.288 10.24 16.384l40.96-6.144c32.768-4.096 65.536 16.384 75.776 47.104l12.288 38.912c20.48 4.096 40.96 4.096 61.44 0l14.336-40.96c10.24-30.72 45.056-51.2 75.776-45.056l36.864 6.144c8.192-12.288 16.384-26.624 22.528-40.96l-24.576-28.672c-20.48-24.576-20.48-63.488-2.048-88.064l26.624-32.768c-4.096-6.144-8.192-14.336-12.288-22.528z m-169.984 202.752c-57.344 0-102.4-45.056-102.4-102.4s45.056-102.4 102.4-102.4 102.4 45.056 102.4 102.4c0 55.296-47.104 102.4-102.4 102.4z m0-40.96c34.816 0 61.44-26.624 61.44-61.44s-26.624-61.44-61.44-61.44-61.44 26.624-61.44 61.44 26.624 61.44 61.44 61.44z"
                                        fill="#515151"
                                        p-id="6181"
                                    ></path>
                                </svg>
                            </Popover>
                            <div className="text-base">即将推出</div>
                        </Box>
                    </div> */}

                    <div className={'mt-3'}>
                        <MainCard contentSX={{ p: 0 }}>
                            {documentList.length > 0 && (
                                <TableContainer sx={{ height: '650px' }}>
                                    <Table size="small" stickyHeader aria-label="simple table">
                                        <TableHead>
                                            <TableRow>
                                                <TableCell width="200px">文件名</TableCell>
                                                <TableCell>类型</TableCell>
                                                <TableCell>大小/字符</TableCell>
                                                <TableCell>
                                                    <span style={{ display: 'inline-block', verticalAlign: 'middle' }}>全部状态</span>
                                                    <Tooltip
                                                        title={
                                                            <>
                                                                <Typography>上传失败</Typography>
                                                                <Typography my={0.5}>上传成功</Typography>
                                                                <Typography>同步中</Typography>
                                                                <Typography my={0.5}>同步失败</Typography>
                                                                <Typography>同步完成</Typography>
                                                                <Typography my={0.5}>学习中</Typography>
                                                                <Typography>学习失败</Typography>
                                                                <Typography my={0.5}>学习完成</Typography>
                                                            </>
                                                        }
                                                    >
                                                        <HelpOutlineOutlinedIcon
                                                            sx={{ display: 'inline-block', verticalAlign: 'middle' }}
                                                            fontSize="small"
                                                        />
                                                    </Tooltip>
                                                </TableCell>
                                                <TableCell>创建时间</TableCell>
                                                <TableCell width="90px">操作</TableCell>
                                            </TableRow>
                                        </TableHead>
                                        <TableBody>
                                            {documentList.map((item) => (
                                                <TableRow key={item.uid} sx={{ '&:last-child td, &:last-child th': { border: 0 } }}>
                                                    <TableCell component="th" width="200px" scope="row">
                                                        <Tooltip placement="top" title={<Typography>{item.name}</Typography>}>
                                                            <Typography width="200px" display="flex" alignItems="center" noWrap>
                                                                {transformDataType(item.dataType)}&nbsp;{item.name}
                                                            </Typography>
                                                        </Tooltip>
                                                    </TableCell>
                                                    <TableCell>
                                                        <Typography sx={{ display: 'flex', alignItems: 'center' }}>
                                                            {item.dataType === 'HTML'
                                                                ? '网页'
                                                                : item.dataType === 'DOCUMENT'
                                                                ? '文档'
                                                                : item.dataType === 'CHARACTERS'
                                                                ? '文本'
                                                                : null}
                                                        </Typography>
                                                    </TableCell>
                                                    <TableCell>
                                                        <Typography>{item.wordCount}&nbsp;字符</Typography>
                                                        <Typography>
                                                            {((item.storageVO?.size as number) / 1024).toFixed(2) + ' KB'}
                                                        </Typography>
                                                    </TableCell>
                                                    <TableCell>
                                                        {item.status === 0 ? (
                                                            <Tag color="error">上传失败</Tag>
                                                        ) : item.status === 15 ? (
                                                            <Tag color="error">上传失败</Tag>
                                                        ) : item.status === 20 ? (
                                                            <Tag color="success">上传成功</Tag>
                                                        ) : item.status === 21 ? (
                                                            <Tag color="processing">同步中</Tag>
                                                        ) : item.status === 25 ? (
                                                            <Tag color="error">同步失败</Tag>
                                                        ) : item.status === 30 ? (
                                                            <Tag color="success">同步完成</Tag>
                                                        ) : item.status === 31 ? (
                                                            <Tag color="processing">学习中</Tag>
                                                        ) : item.status === 35 ? (
                                                            <Tag color="error">学习失败</Tag>
                                                        ) : item.status === 40 ? (
                                                            <Tag color="processing">学习中</Tag>
                                                        ) : item.status === 41 ? (
                                                            <Tag color="processing">学习中</Tag>
                                                        ) : item.status === 45 ? (
                                                            <Tag color="error">学习失败</Tag>
                                                        ) : item.status === 50 ? (
                                                            <Tag color="processing">学习中</Tag>
                                                        ) : item.status === 51 ? (
                                                            <Tag color="processing">学习中</Tag>
                                                        ) : item.status === 55 ? (
                                                            <Tag color="error">学习失败</Tag>
                                                        ) : item.status === 60 ? (
                                                            <Tag color="processing">学习中</Tag>
                                                        ) : item.status >= 90 ? (
                                                            <Tag color="success">学习完成</Tag>
                                                        ) : null}
                                                    </TableCell>
                                                    <TableCell>{formatDate(item.updateTime)}</TableCell>
                                                    <TableCell>
                                                        <span
                                                            style={{
                                                                marginRight: '10px',
                                                                cursor: 'pointer',
                                                                color: '#673ab7',
                                                                fontSize: '12px',
                                                                fontWeight: 500
                                                            }}
                                                            onClick={() => {
                                                                setCurrent(item);
                                                                setDetailOpen(true);
                                                            }}
                                                            color="secondary"
                                                        >
                                                            详情
                                                        </span>
                                                        <span
                                                            style={{
                                                                cursor: 'pointer',
                                                                color: '#f44336',
                                                                fontSize: '12px',
                                                                fontWeight: 500
                                                            }}
                                                            onClick={() => {
                                                                setOpenConfirm(true);
                                                                setCurrent(item);
                                                            }}
                                                        >
                                                            删除
                                                        </span>
                                                    </TableCell>
                                                </TableRow>
                                            ))}
                                        </TableBody>
                                    </Table>
                                </TableContainer>
                                // <Grid container spacing={2}>
                                //     {documentList.map((item, index) => {
                                //         return (
                                //             <Grid item xs={12} sm={6} md={6} xl={4} key={index}>
                                //                 <SubCard
                                //                     sx={{
                                //                         cursor: 'pointer',
                                //                         background:
                                //                             theme.palette.mode === 'dark' ? theme.palette.dark.main : theme.palette.grey[50]
                                //                     }}
                                //                     contentSX={{ p: '10px !important' }}
                                //                 >
                                //                     <Grid
                                //                         onClick={() => {
                                //                             setCurrent(item);
                                //                             setDetailOpen(true);
                                //                         }}
                                //                         container
                                //                         spacing={gridSpacing}
                                //                     >
                                //                         <Grid item xs={12}>
                                //                             <Grid container spacing={gridSpacing}>
                                //                                 <Grid item xs zeroMinWidth>
                                //                                     <div className="flex items-center">
                                //                                         {transformDataType(item.dataType)}
                                //                                         <Tooltip title={item.name}>
                                //                                             <Typography
                                //                                                 variant="h4"
                                //                                                 component="div"
                                //                                                 color={'#0009'}
                                //                                                 className={
                                //                                                     'overflow-ellipsis whitespace-nowrap w-full overflow-hidden'
                                //                                                 }
                                //                                             >
                                //                                                 {item?.name}
                                //                                             </Typography>
                                //                                         </Tooltip>
                                //                                     </div>
                                //                                 </Grid>

                                //                                 <Grid item>
                                //                                     <Dropdown
                                //                                         trigger={['click']}
                                //                                         menu={{
                                //                                             items: [
                                //                                                 {
                                //                                                     key: '1',
                                //                                                     label: (
                                //                                                         <Box
                                //                                                             onClick={(event) => {
                                //                                                                 event.stopPropagation();
                                //                                                                 setOpenConfirm(true);
                                //                                                                 setCurrent(item);
                                //                                                             }}
                                //                                                             color="error"
                                //                                                             display="flex"
                                //                                                             alignItems="center"
                                //                                                         >
                                //                                                             <DeleteIcon color="error" /> 删除
                                //                                                         </Box>
                                //                                                     )
                                //                                                 }
                                //                                             ]
                                //                                         }}
                                //                                         placement="bottom"
                                //                                         arrow={{ pointAtCenter: true }}
                                //                                     >
                                //                                         <IconButton
                                //                                             size="small"
                                //                                             sx={{ mt: -0.75, mr: -0.75 }}
                                //                                             onClick={(event) => {
                                //                                                 event.stopPropagation();
                                //                                             }}
                                //                                         >
                                //                                             <MoreHorizIcon />
                                //                                         </IconButton>
                                //                                     </Dropdown>
                                //                                 </Grid>
                                //                             </Grid>
                                //                         </Grid>
                                //                         <Grid item xs={12} className="!pt-[10px]">
                                //                             <Typography
                                //                                 fontSize="12px"
                                //                                 height="48px"
                                //                                 white-space="nowrap"
                                //                                 overflow="hidden"
                                //                                 text-overflow="ellipsis"
                                //                                 display="-webkit-box"
                                //                                 sx={{ '-webkit-line-clamp': '3', '-webkit-box-orient': 'vertical' }}
                                //                                 component="div"
                                //                                 color={'#0006'}
                                //                             >
                                //                                 {item?.description}
                                //                             </Typography>
                                //                         </Grid>
                                //                         <Grid
                                //                             item
                                //                             xs={12}
                                //                             sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}
                                //                             className="!pt-[10px]"
                                //                         >
                                //                             <Tooltip
                                //                                 placement="top"
                                //                                 title={((item.storageVO?.size as number) / 1024).toFixed(2) + ' KB'}
                                //                             >
                                //                                 <Typography variant="caption">{item.wordCount}&nbsp;字符</Typography>
                                //                             </Tooltip>
                                //                             <Box>
                                //                                 <Tooltip placement="top" title={formatDate(item.updateTime)}>
                                //                                     <Typography variant="caption">{formatYear(item.updateTime)}</Typography>
                                //                                 </Tooltip>
                                //                             </Box>
                                //                         </Grid>
                                //                         <Grid item xs={12} className="!pt-[5px]">
                                //                             <Divider variant="fullWidth" />
                                //                         </Grid>
                                //                         <Grid
                                //                             item
                                //                             xs={12}
                                //                             className="!pt-[10px] flex items-center"
                                //                             sx={{
                                //                                 display: 'flex',
                                //                                 alignContent: 'center',
                                //                                 justifyContent: 'space-between'
                                //                             }}
                                //                         >
                                //                             <Box display="flex" alignItems="center">
                                //                                 {item.status === 0 ||
                                //                                 item.status === 15 ||
                                //                                 item.status === 25 ||
                                //                                 item.status === 35 ||
                                //                                 item.status === 45 ||
                                //                                 item.status === 55 ? (
                                //                                     <Tooltip title={item.errorMessage}>
                                //                                         <HighlightOffIcon
                                //                                             sx={{
                                //                                                 color: 'error.dark',
                                //                                                 width: 14,
                                //                                                 height: 14
                                //                                             }}
                                //                                         />
                                //                                     </Tooltip>
                                //                                 ) : item.status >= 90 ? (
                                //                                     <CheckCircleIcon
                                //                                         sx={{
                                //                                             color: 'success.dark',
                                //                                             width: 14,
                                //                                             height: 14
                                //                                         }}
                                //                                     />
                                //                                 ) : (
                                //                                     <LoadingOutlined
                                //                                         style={{ fontSize: '14px', color: '#673ab7' }}
                                //                                         rev={undefined}
                                //                                     />
                                //                                 )}
                                //                                 <Typography ml={0.5} variant="caption">
                                //                                     {item.status === 0
                                //                                         ? '上传失败'
                                //                                         : item.status === 15
                                //                                         ? '上传失败'
                                //                                         : item.status === 20
                                //                                         ? '上传成功'
                                //                                         : item.status === 21
                                //                                         ? '同步中'
                                //                                         : item.status === 25
                                //                                         ? '同步失败'
                                //                                         : item.status === 30
                                //                                         ? '同步完成'
                                //                                         : item.status === 31
                                //                                         ? '学习中'
                                //                                         : item.status === 35
                                //                                         ? '学习失败'
                                //                                         : item.status === 40
                                //                                         ? '学习中'
                                //                                         : item.status === 41
                                //                                         ? '学习中'
                                //                                         : item.status === 45
                                //                                         ? '学习失败'
                                //                                         : item.status === 50
                                //                                         ? '学习中'
                                //                                         : item.status === 51
                                //                                         ? '学习中'
                                //                                         : item.status === 55
                                //                                         ? '学习失败'
                                //                                         : item.status === 60
                                //                                         ? '学习中'
                                //                                         : item.status >= 90
                                //                                         ? '学习完成'
                                //                                         : null}
                                //                                 </Typography>
                                //                             </Box>
                                //                         </Grid>
                                //                     </Grid>
                                //                 </SubCard>
                                //             </Grid>
                                //         );
                                //     })}
                                // </Grid>
                            )}

                            {documentList.length === 0 && (
                                <Box height="626px" display="flex" justifyContent="center" alignItems="center">
                                    <Box position="relative" display="flex" flexDirection="column" alignItems="center">
                                        <img src={documnt} alt="" />
                                        <Typography color="#9da3af">您还没有增加文档，快去添加吧！</Typography>
                                        <Button
                                            variant={'outlined'}
                                            startIcon={<AddIcon />}
                                            color={'secondary'}
                                            sx={{ mt: 3 }}
                                            onClick={() => {
                                                if (documentList.length >= 2) {
                                                    dispatch(
                                                        openSnackbar({
                                                            open: true,
                                                            message: '最多添加两个文档',
                                                            variant: 'alert',
                                                            alert: {
                                                                color: 'error'
                                                            },
                                                            close: false
                                                        })
                                                    );
                                                    return;
                                                }
                                                setDocumentVisible(true);
                                            }}
                                        >
                                            添加文档
                                        </Button>
                                        <Chip
                                            size="small"
                                            color="info"
                                            sx={{ position: 'absolute', left: '-70px', top: '20px' }}
                                            label="无限次上传"
                                        />
                                        <Chip
                                            size="small"
                                            color="secondary"
                                            sx={{ position: 'absolute', right: '-70px', top: '20px' }}
                                            label="2-5分钟完成学习"
                                        />
                                        <Chip
                                            size="small"
                                            color="secondary"
                                            sx={{ position: 'absolute', left: '-30px', bottom: '106px' }}
                                            label="AI自动优化学习"
                                        />
                                        <Chip
                                            size="small"
                                            color="info"
                                            sx={{ position: 'absolute', right: '-30px', bottom: '106px' }}
                                            label="支持多种格式"
                                        />
                                    </Box>
                                </Box>
                            )}
                        </MainCard>
                    </div>
                </div>
            </div>
            <Box mt={3} display="flex" justifyContent="space-between" alignContent="center">
                <span
                    className={
                        "before:bg-[#673ab7] before:left-0 before:top-[7px] before:content-[''] before:w-[3px] before:h-[14px] before:absolute before:ml-0.5 block text-lg font-medium pl-[12px] relative"
                    }
                >
                    问答式
                </span>
                {/* <Button
                    variant={'contained'}
                    startIcon={<AddIcon />}
                    color={'secondary'}
                    size={'small'}
                    onClick={() => {
                        setQaVisible(true);
                    }}
                >
                    添加问答
                </Button> */}
            </Box>
            <Box display="flex" justifyContent="center" mt={3}>
                <div className={'mt-3'} style={{ margin: '0 auto', textAlign: 'center' }}>
                    <Popover
                        content={
                            <div className="flex justify-start items-center flex-col">
                                <div className="text-sm text-center w-[330px]">
                                    <div>功能正在封闭测试中。</div>
                                    <div>可联系我们产品顾问进一步了解，</div>
                                    <div>并获得提前免费使用的权利。</div>
                                </div>
                                <img className="w-40" src={workWechatPay} alt="" />
                            </div>
                        }
                        trigger="hover"
                    >
                        <svg viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" width="128" height="128">
                            <path
                                d="M880.64 358.4h-819.2v423.936c0 34.816 26.624 61.44 61.44 61.44h491.52c12.288 0 20.48 8.192 20.48 20.48s-8.192 20.48-20.48 20.48h-491.52c-57.344 0-102.4-45.056-102.4-102.4v-552.96c0-57.344 45.056-102.4 102.4-102.4h696.32c57.344 0 102.4 45.056 102.4 102.4v176.128c0 12.288-8.192 20.48-20.48 20.48s-20.48-8.192-20.48-20.48v-47.104z m0-40.96v-88.064c0-34.816-26.624-61.44-61.44-61.44h-696.32c-34.816 0-61.44 26.624-61.44 61.44v88.064h819.2z m-204.8-51.2c-12.288 0-20.48-8.192-20.48-20.48s8.192-20.48 20.48-20.48 20.48 8.192 20.48 20.48-8.192 20.48-20.48 20.48z m61.44 0c-12.288 0-20.48-8.192-20.48-20.48s8.192-20.48 20.48-20.48 20.48 8.192 20.48 20.48-8.192 20.48-20.48 20.48z m61.44 0c-12.288 0-20.48-8.192-20.48-20.48s8.192-20.48 20.48-20.48 20.48 8.192 20.48 20.48-8.192 20.48-20.48 20.48z m-448.512 241.664c6.144-10.24 18.432-12.288 28.672-8.192 10.24 6.144 12.288 18.432 8.192 28.672l-102.4 178.176c-6.144 10.24-18.432 12.288-28.672 8.192s-12.288-18.432-8.192-28.672l102.4-178.176z m-126.976 6.144l-55.296 90.112 55.296 94.208c6.144 10.24 2.048 22.528-8.192 28.672-10.24 6.144-22.528 2.048-28.672-8.192l-67.584-114.688 67.584-110.592c6.144-10.24 18.432-12.288 28.672-6.144 10.24 4.096 12.288 16.384 8.192 26.624z m188.416 184.32l55.296-94.208-55.296-90.112c-6.144-10.24-2.048-22.528 6.144-28.672 10.24-6.144 22.528-2.048 28.672 6.144l67.584 110.592-67.584 114.688c-6.144 10.24-18.432 12.288-28.672 8.192-8.192-4.096-10.24-18.432-6.144-26.624z m577.536-122.88l4.096 10.24-40.96 51.2c-8.192 10.24-8.192 26.624 0 36.864l38.912 47.104-4.096 10.24c-8.192 26.624-22.528 51.2-38.912 71.68l-8.192 10.24-61.44-10.24c-12.288-2.048-26.624 6.144-30.72 18.432l-20.48 61.44-10.24 2.048c-32.768 8.192-69.632 8.192-102.4 0l-12.288-2.048-20.48-61.44c-4.096-12.288-18.432-20.48-30.72-18.432l-63.488 10.24-8.192-8.192c-8.192-10.24-16.384-20.48-22.528-32.768-8.192-12.288-14.336-26.624-18.432-40.96l-4.096-10.24 40.96-49.152c8.192-10.24 8.192-26.624 0-36.864l-40.96-49.152 4.096-10.24c10.24-26.624 22.528-51.2 40.96-73.728l8.192-8.192 61.44 10.24c12.288 2.048 26.624-6.144 30.72-18.432l22.528-61.44 10.24-2.048c32.768-6.144 67.584-6.144 100.352 0l12.288 2.048 20.48 59.392c4.096 12.288 18.432 20.48 30.72 20.48l63.488-8.192 8.192 8.192c8.192 10.24 16.384 20.48 22.528 32.768 8.192 12.288 14.336 24.576 18.432 38.912z m-53.248-20.48l-12.288-18.432-38.912 4.096c-32.768 4.096-65.536-16.384-75.776-47.104l-12.288-36.864c-20.48-4.096-40.96-4.096-61.44 0l-14.336 38.912c-10.24 30.72-45.056 51.2-75.776 45.056l-36.864-6.144c-10.24 12.288-16.384 26.624-22.528 40.96l26.624 30.72c20.48 24.576 20.48 63.488 0 90.112l-26.624 30.72c4.096 8.192 6.144 16.384 12.288 24.576 4.096 6.144 6.144 12.288 10.24 16.384l40.96-6.144c32.768-4.096 65.536 16.384 75.776 47.104l12.288 38.912c20.48 4.096 40.96 4.096 61.44 0l14.336-40.96c10.24-30.72 45.056-51.2 75.776-45.056l36.864 6.144c8.192-12.288 16.384-26.624 22.528-40.96l-24.576-28.672c-20.48-24.576-20.48-63.488-2.048-88.064l26.624-32.768c-4.096-6.144-8.192-14.336-12.288-22.528z m-169.984 202.752c-57.344 0-102.4-45.056-102.4-102.4s45.056-102.4 102.4-102.4 102.4 45.056 102.4 102.4c0 55.296-47.104 102.4-102.4 102.4z m0-40.96c34.816 0 61.44-26.624 61.44-61.44s-26.624-61.44-61.44-61.44-61.44 26.624-61.44 61.44 26.624 61.44 61.44 61.44z"
                                fill="#515151"
                                p-id="6181"
                            ></path>
                        </svg>
                    </Popover>
                    <div className="text-base">即将推出</div>
                    {/* <div>
                    <MainCard>
                        <Grid container direction="row" spacing={gridSpacing}>
                            <Grid item xs={12} sm={6} xl={4}>
                                <Card
                                    sx={{
                                        p: 2,
                                        background: theme.palette.mode === 'dark' ? theme.palette.dark.main : theme.palette.grey[50],
                                        border:
                                            theme.palette.mode === 'dark' ? '1px solid transparent' : `1px solid${theme.palette.grey[100]}`,
                                        '&:hover': {
                                            borderColor: theme.palette.primary.main
                                        }
                                    }}
                                >
                                    <Grid container spacing={gridSpacing}>
                                        <Grid item xs={12}>
                                            <Grid container spacing={gridSpacing}>
                                                <Grid item xs zeroMinWidth>
                                                    <div className="flex items-center">
                                                        <EditIcon className="text-[#0009] text-lg" />
                                                        <Typography variant="h4" component="div" color={'#0009'}>
                                                            这里是问题
                                                        </Typography>
                                                    </div>
                                                </Grid>

                                                <Grid item>
                                                    <IconButton
                                                        size="small"
                                                        sx={{ mt: -0.75, mr: -0.75 }}
                                                        onClick={handleClick}
                                                        aria-label="more-options"
                                                    >
                                                        <MoreHorizOutlinedIcon
                                                            fontSize="small"
                                                            color="inherit"
                                                            aria-controls="menu-friend-card"
                                                            aria-haspopup="true"
                                                            sx={{ opacity: 0.6 }}
                                                        />
                                                    </IconButton>
                                                    {anchorEl && (
                                                        <Menu
                                                            id="menu-user-details-card"
                                                            anchorEl={anchorEl}
                                                            keepMounted
                                                            open={Boolean(anchorEl)}
                                                            onClose={handleClose}
                                                            variant="selectedMenu"
                                                            anchorOrigin={{
                                                                vertical: 'bottom',
                                                                horizontal: 'right'
                                                            }}
                                                            transformOrigin={{
                                                                vertical: 'top',
                                                                horizontal: 'right'
                                                            }}
                                                        >
                                                            <MenuItem onClick={handleClose}>删除</MenuItem>
                                                        </Menu>
                                                    )}
                                                </Grid>
                                            </Grid>
                                        </Grid>
                                        <Grid item xs={12}>
                                            <Typography variant="h5" component="div" color={'#0009'}>
                                                这里是答案
                                            </Typography>
                                        </Grid>
                                        <Grid item xs={12}>
                                            <Divider variant="fullWidth" />
                                        </Grid>
                                        <Grid item xs={12} className="!pt-[3px]">
                                            <Typography variant="caption">From Custom Input</Typography>
                                        </Grid>
                                    </Grid>
                                </Card>
                            </Grid>
                        </Grid>
                    </MainCard>
                </div> */}
                </div>
            </Box>
            <Confirm
                open={openConfirm}
                handleOk={handleDelDocument}
                handleClose={() => setOpenConfirm(false)}
                content="确认删除该条记录？"
            />
            {qaVisible && <QAModal open={qaVisible} handleClose={() => setQaVisible(false)} />}
            {documentVisible && (
                <DocumentModal
                    datasetId={datasetId}
                    open={documentVisible}
                    handleClose={() => setDocumentVisible(false)}
                    forceUpdate={forceUpdate}
                />
            )}
            {detailOpen && (
                <DetailModal
                    detailOpen={detailOpen}
                    dataType={current?.dataType}
                    dataId={current?.id}
                    datasetId={datasetId}
                    uid={current?.uid}
                    detailClose={() => setDetailOpen(false)}
                />
            )}
            {ruleOpen && <AddRuleModal open={ruleOpen} datasetUid={datasetId} handleClose={setRuleOpen} />}
        </div>
    );
};
