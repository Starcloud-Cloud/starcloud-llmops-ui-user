import AddIcon from '@mui/icons-material/Add';
import CloseIcon from '@mui/icons-material/Close';
import {
    Box,
    Button,
    CardActions,
    CardContent,
    Divider,
    Grid,
    IconButton,
    Link,
    Modal,
    Tab,
    Tabs,
    TextField,
    Typography,
    useTheme
} from '@mui/material';
import { Popover, Upload, UploadProps } from 'antd';
import workWechatPay from 'assets/images/landing/work_wechat_pay.png';
import { useFormik } from 'formik';
import React, { useState } from 'react';
import { useDispatch } from 'store';
import { gridSpacing } from 'store/constant';
import { openSnackbar } from 'store/slices/snackbar';
import { TabsProps } from 'types';
import { Confirm } from 'ui-component/Confirm';
import MainCard from 'ui-component/cards/MainCard';
import * as yup from 'yup';
import { delDataset, uploadCharacters, uploadUrls } from '../../../../../api/chat';
import { getAccessToken } from '../../../../../utils/auth';

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

const QAModal = ({ open, handleClose }: { open: boolean; handleClose: () => void }) => {
    const theme = useTheme();
    const dispatch = useDispatch();
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
                                <span className="text-[#673ab7]">点击此处下载模板</span> 完成填写后再上传，问题总数不超过条10000条
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

const DocumentModal = ({ open, handleClose, forceUpdate }: { open: boolean; handleClose: () => void; forceUpdate: () => void }) => {
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
        name: 'files',
        multiple: true,
        action: `${process.env.REACT_APP_BASE_URL}${process.env.REACT_APP_API_URL}/llm/dataset-source-data/uploadFiles/1683395894274936832`,
        headers: {
            Authorization: 'Bearer ' + getAccessToken()
        },
        accept: '.pdf, .docx, .txt, .pptx, .epub, .md, .csv',
        maxCount: 20,
        onChange(info) {
            const { status } = info.file;
            if (status !== 'uploading') {
                console.log(info.file, info.fileList);
            }
            if (status === 'done') {
                handleClose();
                forceUpdate();
            } else if (status === 'error') {
            }
        },
        onDrop(e) {
            console.log('Dropped files', e.dataTransfer.files);
        }
    };

    const formik = useFormik({
        initialValues: {
            title: '',
            context: ''
        },
        validationSchema: yup.object({
            title: yup.string().required('12jl'),
            context: yup.string().required('12')
        }),
        onSubmit: (values) => {
            uploadCharacters({ datasetId: '1683395894274936832', uploadCharacterReqVOs: [values] }).then((res) => {
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
    const formikUrl = useFormik({
        initialValues: {
            url: ''
        },
        validationSchema: yup.object({
            url: yup.string().required('12jl')
        }),
        onSubmit: (values) => {
            uploadUrls({ datasetId: '1683395894274936832', urls: values.url.split(',') }).then((res) => {
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
                title="添加文档"
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
                            <Tab component={Link} label="上传文档" {...a11yProps(0)} />
                            <Tab component={Link} label="文本输入" {...a11yProps(1)} />
                            <Tab component={Link} label="网页抓取" {...a11yProps(2)} />
                        </Tabs>
                        <TabPanel value={value} index={0}>
                            <div className="text-sm text-[#9da3af]">
                                格式支持 .pdf .docx .txt .pptx .epub .md .csv，请确保内容可复制，每个30MB以内，单次最多上传20个。
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
                        </TabPanel>
                        <TabPanel value={value} index={1}>
                            <form onSubmit={formik.handleSubmit}>
                                <TextField
                                    label={'标题'}
                                    fullWidth
                                    id="title"
                                    name="title"
                                    value={formik.values.title}
                                    onChange={formik.handleChange}
                                    error={formik.touched.title && Boolean(formik.errors.title)}
                                    helperText={formik.touched.title && formik.errors.title}
                                />
                                <TextField
                                    label={'内容'}
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
                                <Divider />
                                <CardActions>
                                    <Grid container justifyContent="flex-end">
                                        <Button variant="contained" type="submit" color="secondary">
                                            保存
                                        </Button>
                                    </Grid>
                                </CardActions>
                            </form>
                        </TabPanel>
                        <TabPanel value={value} index={2}>
                            <div className="text-sm text-[#9da3af]">
                                请避免非法抓取他人网站的侵权行为，保证链接可公开访问，且网站内容可复制
                            </div>
                            <form onSubmit={formikUrl.handleSubmit}>
                                <TextField
                                    label={'网页地址'}
                                    fullWidth
                                    id="url"
                                    name="url"
                                    value={formikUrl.values.url}
                                    onChange={formikUrl.handleChange}
                                    error={formikUrl.touched.url && Boolean(formikUrl.errors.url)}
                                    helperText={formikUrl.touched.url && formikUrl.errors.url}
                                    className={'mt-3'}
                                    multiline
                                    minRows={6}
                                />
                                <Divider />
                                <CardActions>
                                    <Grid container justifyContent="flex-end">
                                        <Button variant="contained" type="submit" color="secondary">
                                            保存
                                        </Button>
                                    </Grid>
                                </CardActions>
                            </form>
                        </TabPanel>
                    </>
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
    position: number;
    dataSourceInfo?: any;
    batch?: any;
    status?: any;
    wordCount: number;
    tokens?: any;
    dataType: string;
};

export const Knowledge = () => {
    const [qaVisible, setQaVisible] = useState(false);
    const [documentVisible, setDocumentVisible] = useState(false);
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const [update, setUpdate] = useState(0);
    const [openConfirm, setOpenConfirm] = useState(false);
    const [current, setCurrent] = useState<typeDocumentChild | null>(null);

    const forceUpdate = () => setUpdate((pre) => pre + 1);

    const handleDelDocument = async () => {
        await delDataset({ id: current?.uid });
        forceUpdate();
        setCurrent(null);
        setOpenConfirm(false);
    };

    return (
        <div>
            <div>
                <div>
                    <span
                        className={
                            "before:bg-[#673ab7] before:left-0 before:top-[7px] before:content-[''] before:w-[3px] before:h-[14px] before:absolute before:ml-0.5 block text-lg font-medium pl-[12px] relative text-black"
                        }
                    >
                        文档式
                    </span>
                    <div className={'mt-3'}>
                        <MainCard>
                            <Grid
                                container
                                direction="row"
                                spacing={gridSpacing}
                                className={'h-[220px] flex justify-center items-center flex-col cursor-pointer'}
                            >
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
                            </Grid>
                        </MainCard>
                    </div>
                </div>
            </div>
            <div>
                <span
                    className={
                        "before:bg-[#673ab7] before:left-0 before:top-[7px] before:content-[''] before:w-[3px] before:h-[14px] before:absolute before:ml-0.5 block text-lg font-medium pl-[12px] relative text-black"
                    }
                >
                    问答式
                </span>
                <div className={'mt-3'}>
                    <MainCard>
                        <Grid
                            container
                            direction="row"
                            spacing={gridSpacing}
                            className={'h-[220px] flex justify-center items-center flex-col cursor-pointer'}
                        >
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
                        </Grid>
                    </MainCard>
                </div>
            </div>

            <Confirm
                open={openConfirm}
                handleOk={handleDelDocument}
                handleClose={() => setOpenConfirm(false)}
                content="确认删除该条记录？"
            />
            {qaVisible && <QAModal open={qaVisible} handleClose={() => setQaVisible(false)} />}
            {documentVisible && (
                <DocumentModal open={documentVisible} handleClose={() => setDocumentVisible(false)} forceUpdate={forceUpdate} />
            )}
        </div>
    );
};
