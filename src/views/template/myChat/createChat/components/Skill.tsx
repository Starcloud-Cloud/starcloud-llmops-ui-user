import { InboxOutlined } from '@ant-design/icons';
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
import React, { useState } from 'react';
import { gridSpacing } from 'store/constant';
import { TabsProps } from 'types';
import MainCard from 'ui-component/cards/MainCard';

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

const QAModal = ({ open, handleClose }: { open: boolean; handleClose: () => void }) => {
    const theme = useTheme();
    const [valueLabel, setValueLabel] = useState('checked');
    const [value, setValue] = React.useState(0);

    const handleChange = (event: React.SyntheticEvent, newValue: number) => {
        setValue(newValue);
    };

    const { Dragger } = Upload;

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
                                        <InboxOutlined rev={undefined} />
                                    </p>
                                    <p className="ant-upload-text">Click or drag file to this area to upload</p>
                                    <p className="ant-upload-hint">
                                        Support for a single or bulk upload. Strictly prohibited from uploading company data or other banned
                                        files.
                                    </p>
                                </Dragger>
                            </div>
                        </TabPanel>
                        <TabPanel value={value} index={1}>
                            <TextField label={'问题'} fullWidth />
                            <TextField label={'回答'} className={'mt-3'} fullWidth multiline minRows={6} />
                        </TabPanel>
                    </>
                </CardContent>
                <Divider />
                <CardActions>
                    <Grid container justifyContent="flex-end">
                        <Button variant="contained" type="button" color="secondary">
                            保存
                        </Button>
                    </Grid>
                </CardActions>
            </MainCard>
        </Modal>
    );
};

const DocumentModal = ({ open, handleClose }: { open: boolean; handleClose: () => void }) => {
    const theme = useTheme();
    const [valueLabel, setValueLabel] = useState('checked');
    const [value, setValue] = React.useState(0);

    const handleChange = (event: React.SyntheticEvent, newValue: number) => {
        setValue(newValue);
    };

    const { Dragger } = Upload;

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
                                        <InboxOutlined rev={undefined} />
                                    </p>
                                    <p className="ant-upload-text">Click or drag file to this area to upload</p>
                                    <p className="ant-upload-hint">
                                        Support for a single or bulk upload. Strictly prohibited from uploading company data or other banned
                                        files.
                                    </p>
                                </Dragger>
                            </div>
                        </TabPanel>
                        <TabPanel value={value} index={1}>
                            <TextField label={'标题'} fullWidth />
                            <TextField label={'内容'} className={'mt-3'} fullWidth multiline minRows={6} />
                        </TabPanel>
                        <TabPanel value={value} index={2}>
                            <div className="text-sm text-[#9da3af]">
                                请避免非法抓取他人网站的侵权行为，保证链接可公开访问，且网站内容可复制
                            </div>
                            <TextField
                                label={'网页地址'}
                                className={'mt-3'}
                                fullWidth
                                multiline
                                minRows={6}
                                placeholder="输入要爬取的网页地址，使用英文,分隔"
                            />
                        </TabPanel>
                    </>
                </CardContent>
                <Divider />
                <CardActions>
                    <Grid container justifyContent="flex-end">
                        <Button variant="contained" type="button" color="secondary">
                            保存
                        </Button>
                    </Grid>
                </CardActions>
            </MainCard>
        </Modal>
    );
};

export const Skill = () => {
    const theme = useTheme();
    const [anchorEl, setAnchorEl] = useState<Element | ((element: Element) => Element) | null | undefined>(null);
    const [qaVisible, setQaVisible] = useState(false);
    const [documentVisible, setDocumentVisible] = useState(false);
    const [checked, setChecked] = useState(false);
    const handleClick = (event: React.MouseEvent<HTMLButtonElement> | undefined) => {
        setAnchorEl(event?.currentTarget);
    };

    const handleClose = () => {
        setAnchorEl(null);
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
                        学习API
                    </span>
                    <div className="text-sm text-[#9da3af] ml-3">
                        让你的机器人可以实时查询信息和操作其他API数据的能力，让你的机器人帮助你完成更多真实的工作。
                    </div>
                    <div className={'mt-3'}>
                        <MainCard>
                            <Popover
                                content={
                                    <div className="flex justify-start items-center flex-col">
                                        <div className="text-sm text-center">
                                            <div>功能正在封闭测试中。</div>
                                            <div>可联系我们产品顾问进一步了解，并获得提前免费使用的权利。</div>
                                        </div>
                                        <img className="w-40" src={workWechatPay} alt="" />
                                    </div>
                                }
                                trigger="hover"
                            >
                                <Grid
                                    container
                                    direction="row"
                                    spacing={gridSpacing}
                                    className={'h-[220px] flex justify-center items-center flex-col cursor-pointer'}
                                >
                                    <svg viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" width="128" height="128">
                                        <path
                                            d="M880.64 358.4h-819.2v423.936c0 34.816 26.624 61.44 61.44 61.44h491.52c12.288 0 20.48 8.192 20.48 20.48s-8.192 20.48-20.48 20.48h-491.52c-57.344 0-102.4-45.056-102.4-102.4v-552.96c0-57.344 45.056-102.4 102.4-102.4h696.32c57.344 0 102.4 45.056 102.4 102.4v176.128c0 12.288-8.192 20.48-20.48 20.48s-20.48-8.192-20.48-20.48v-47.104z m0-40.96v-88.064c0-34.816-26.624-61.44-61.44-61.44h-696.32c-34.816 0-61.44 26.624-61.44 61.44v88.064h819.2z m-204.8-51.2c-12.288 0-20.48-8.192-20.48-20.48s8.192-20.48 20.48-20.48 20.48 8.192 20.48 20.48-8.192 20.48-20.48 20.48z m61.44 0c-12.288 0-20.48-8.192-20.48-20.48s8.192-20.48 20.48-20.48 20.48 8.192 20.48 20.48-8.192 20.48-20.48 20.48z m61.44 0c-12.288 0-20.48-8.192-20.48-20.48s8.192-20.48 20.48-20.48 20.48 8.192 20.48 20.48-8.192 20.48-20.48 20.48z m-448.512 241.664c6.144-10.24 18.432-12.288 28.672-8.192 10.24 6.144 12.288 18.432 8.192 28.672l-102.4 178.176c-6.144 10.24-18.432 12.288-28.672 8.192s-12.288-18.432-8.192-28.672l102.4-178.176z m-126.976 6.144l-55.296 90.112 55.296 94.208c6.144 10.24 2.048 22.528-8.192 28.672-10.24 6.144-22.528 2.048-28.672-8.192l-67.584-114.688 67.584-110.592c6.144-10.24 18.432-12.288 28.672-6.144 10.24 4.096 12.288 16.384 8.192 26.624z m188.416 184.32l55.296-94.208-55.296-90.112c-6.144-10.24-2.048-22.528 6.144-28.672 10.24-6.144 22.528-2.048 28.672 6.144l67.584 110.592-67.584 114.688c-6.144 10.24-18.432 12.288-28.672 8.192-8.192-4.096-10.24-18.432-6.144-26.624z m577.536-122.88l4.096 10.24-40.96 51.2c-8.192 10.24-8.192 26.624 0 36.864l38.912 47.104-4.096 10.24c-8.192 26.624-22.528 51.2-38.912 71.68l-8.192 10.24-61.44-10.24c-12.288-2.048-26.624 6.144-30.72 18.432l-20.48 61.44-10.24 2.048c-32.768 8.192-69.632 8.192-102.4 0l-12.288-2.048-20.48-61.44c-4.096-12.288-18.432-20.48-30.72-18.432l-63.488 10.24-8.192-8.192c-8.192-10.24-16.384-20.48-22.528-32.768-8.192-12.288-14.336-26.624-18.432-40.96l-4.096-10.24 40.96-49.152c8.192-10.24 8.192-26.624 0-36.864l-40.96-49.152 4.096-10.24c10.24-26.624 22.528-51.2 40.96-73.728l8.192-8.192 61.44 10.24c12.288 2.048 26.624-6.144 30.72-18.432l22.528-61.44 10.24-2.048c32.768-6.144 67.584-6.144 100.352 0l12.288 2.048 20.48 59.392c4.096 12.288 18.432 20.48 30.72 20.48l63.488-8.192 8.192 8.192c8.192 10.24 16.384 20.48 22.528 32.768 8.192 12.288 14.336 24.576 18.432 38.912z m-53.248-20.48l-12.288-18.432-38.912 4.096c-32.768 4.096-65.536-16.384-75.776-47.104l-12.288-36.864c-20.48-4.096-40.96-4.096-61.44 0l-14.336 38.912c-10.24 30.72-45.056 51.2-75.776 45.056l-36.864-6.144c-10.24 12.288-16.384 26.624-22.528 40.96l26.624 30.72c20.48 24.576 20.48 63.488 0 90.112l-26.624 30.72c4.096 8.192 6.144 16.384 12.288 24.576 4.096 6.144 6.144 12.288 10.24 16.384l40.96-6.144c32.768-4.096 65.536 16.384 75.776 47.104l12.288 38.912c20.48 4.096 40.96 4.096 61.44 0l14.336-40.96c10.24-30.72 45.056-51.2 75.776-45.056l36.864 6.144c8.192-12.288 16.384-26.624 22.528-40.96l-24.576-28.672c-20.48-24.576-20.48-63.488-2.048-88.064l26.624-32.768c-4.096-6.144-8.192-14.336-12.288-22.528z m-169.984 202.752c-57.344 0-102.4-45.056-102.4-102.4s45.056-102.4 102.4-102.4 102.4 45.056 102.4 102.4c0 55.296-47.104 102.4-102.4 102.4z m0-40.96c34.816 0 61.44-26.624 61.44-61.44s-26.624-61.44-61.44-61.44-61.44 26.624-61.44 61.44 26.624 61.44 61.44 61.44z"
                                            fill="#515151"
                                            p-id="6181"
                                        ></path>
                                    </svg>
                                    <div className="text-base">即将推出</div>
                                </Grid>
                            </Popover>
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
                    学习工作流程
                </span>
                <div className="text-sm text-[#9da3af] ml-3">
                    让你的机器人可直接执行定制的AI应用，实现更复杂和深度的内容创作和工作内容。{' '}
                </div>
                <div className={'mt-3'}>
                    <MainCard>
                        <Popover
                            content={
                                <div className="flex justify-start items-center flex-col">
                                    <div className="text-sm text-center">
                                        <div>功能正在封闭测试中。</div>
                                        <div>可联系我们产品顾问进一步了解，并获得提前免费使用的权利。</div>
                                    </div>
                                    <img className="w-40" src={workWechatPay} alt="" />
                                </div>
                            }
                            trigger="hover"
                        >
                            <Grid
                                container
                                direction="row"
                                spacing={gridSpacing}
                                className={'h-[220px] flex justify-center items-center flex-col cursor-pointer'}
                            >
                                <svg viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" width="128" height="128">
                                    <path
                                        d="M880.64 358.4h-819.2v423.936c0 34.816 26.624 61.44 61.44 61.44h491.52c12.288 0 20.48 8.192 20.48 20.48s-8.192 20.48-20.48 20.48h-491.52c-57.344 0-102.4-45.056-102.4-102.4v-552.96c0-57.344 45.056-102.4 102.4-102.4h696.32c57.344 0 102.4 45.056 102.4 102.4v176.128c0 12.288-8.192 20.48-20.48 20.48s-20.48-8.192-20.48-20.48v-47.104z m0-40.96v-88.064c0-34.816-26.624-61.44-61.44-61.44h-696.32c-34.816 0-61.44 26.624-61.44 61.44v88.064h819.2z m-204.8-51.2c-12.288 0-20.48-8.192-20.48-20.48s8.192-20.48 20.48-20.48 20.48 8.192 20.48 20.48-8.192 20.48-20.48 20.48z m61.44 0c-12.288 0-20.48-8.192-20.48-20.48s8.192-20.48 20.48-20.48 20.48 8.192 20.48 20.48-8.192 20.48-20.48 20.48z m61.44 0c-12.288 0-20.48-8.192-20.48-20.48s8.192-20.48 20.48-20.48 20.48 8.192 20.48 20.48-8.192 20.48-20.48 20.48z m-448.512 241.664c6.144-10.24 18.432-12.288 28.672-8.192 10.24 6.144 12.288 18.432 8.192 28.672l-102.4 178.176c-6.144 10.24-18.432 12.288-28.672 8.192s-12.288-18.432-8.192-28.672l102.4-178.176z m-126.976 6.144l-55.296 90.112 55.296 94.208c6.144 10.24 2.048 22.528-8.192 28.672-10.24 6.144-22.528 2.048-28.672-8.192l-67.584-114.688 67.584-110.592c6.144-10.24 18.432-12.288 28.672-6.144 10.24 4.096 12.288 16.384 8.192 26.624z m188.416 184.32l55.296-94.208-55.296-90.112c-6.144-10.24-2.048-22.528 6.144-28.672 10.24-6.144 22.528-2.048 28.672 6.144l67.584 110.592-67.584 114.688c-6.144 10.24-18.432 12.288-28.672 8.192-8.192-4.096-10.24-18.432-6.144-26.624z m577.536-122.88l4.096 10.24-40.96 51.2c-8.192 10.24-8.192 26.624 0 36.864l38.912 47.104-4.096 10.24c-8.192 26.624-22.528 51.2-38.912 71.68l-8.192 10.24-61.44-10.24c-12.288-2.048-26.624 6.144-30.72 18.432l-20.48 61.44-10.24 2.048c-32.768 8.192-69.632 8.192-102.4 0l-12.288-2.048-20.48-61.44c-4.096-12.288-18.432-20.48-30.72-18.432l-63.488 10.24-8.192-8.192c-8.192-10.24-16.384-20.48-22.528-32.768-8.192-12.288-14.336-26.624-18.432-40.96l-4.096-10.24 40.96-49.152c8.192-10.24 8.192-26.624 0-36.864l-40.96-49.152 4.096-10.24c10.24-26.624 22.528-51.2 40.96-73.728l8.192-8.192 61.44 10.24c12.288 2.048 26.624-6.144 30.72-18.432l22.528-61.44 10.24-2.048c32.768-6.144 67.584-6.144 100.352 0l12.288 2.048 20.48 59.392c4.096 12.288 18.432 20.48 30.72 20.48l63.488-8.192 8.192 8.192c8.192 10.24 16.384 20.48 22.528 32.768 8.192 12.288 14.336 24.576 18.432 38.912z m-53.248-20.48l-12.288-18.432-38.912 4.096c-32.768 4.096-65.536-16.384-75.776-47.104l-12.288-36.864c-20.48-4.096-40.96-4.096-61.44 0l-14.336 38.912c-10.24 30.72-45.056 51.2-75.776 45.056l-36.864-6.144c-10.24 12.288-16.384 26.624-22.528 40.96l26.624 30.72c20.48 24.576 20.48 63.488 0 90.112l-26.624 30.72c4.096 8.192 6.144 16.384 12.288 24.576 4.096 6.144 6.144 12.288 10.24 16.384l40.96-6.144c32.768-4.096 65.536 16.384 75.776 47.104l12.288 38.912c20.48 4.096 40.96 4.096 61.44 0l14.336-40.96c10.24-30.72 45.056-51.2 75.776-45.056l36.864 6.144c8.192-12.288 16.384-26.624 22.528-40.96l-24.576-28.672c-20.48-24.576-20.48-63.488-2.048-88.064l26.624-32.768c-4.096-6.144-8.192-14.336-12.288-22.528z m-169.984 202.752c-57.344 0-102.4-45.056-102.4-102.4s45.056-102.4 102.4-102.4 102.4 45.056 102.4 102.4c0 55.296-47.104 102.4-102.4 102.4z m0-40.96c34.816 0 61.44-26.624 61.44-61.44s-26.624-61.44-61.44-61.44-61.44 26.624-61.44 61.44 26.624 61.44 61.44 61.44z"
                                        fill="#515151"
                                        p-id="6181"
                                    ></path>
                                </svg>
                                <div className="text-base">即将推出</div>
                            </Grid>
                        </Popover>
                    </MainCard>
                </div>
            </div>
            <div className="mt-5">
                <div>
                    <div className="flex items-center">
                        <span
                            className={
                                "before:bg-[#673ab7] before:left-0 before:top-[7px] before:content-[''] before:w-[3px] before:h-[14px] before:absolute before:ml-0.5 block text-lg font-medium pl-[12px] relative"
                            }
                        >
                            从网络搜索中学习
                        </span>
                        {/* <Switch className="ml-3" checked={checked} onChange={(e) => setChecked(e.target.checked)} color="secondary" /> */}
                    </div>
                    <div className="text-sm text-[#9da3af] ml-3">能够从互联网上收集实时信息，你可以问机器人最新最近的信息。 </div>
                    <MainCard>
                        <Popover
                            content={
                                <div className="flex justify-start items-center flex-col">
                                    <div className="text-sm text-center">
                                        <div>功能正在封闭测试中。</div>
                                        <div>可联系我们产品顾问进一步了解，并获得提前免费使用的权利。</div>
                                    </div>
                                    <img className="w-40" src={workWechatPay} alt="" />
                                </div>
                            }
                            trigger="hover"
                        >
                            <Grid
                                container
                                direction="row"
                                spacing={gridSpacing}
                                className={'h-[220px] flex justify-center items-center flex-col cursor-pointer'}
                            >
                                <svg viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" width="128" height="128">
                                    <path
                                        d="M880.64 358.4h-819.2v423.936c0 34.816 26.624 61.44 61.44 61.44h491.52c12.288 0 20.48 8.192 20.48 20.48s-8.192 20.48-20.48 20.48h-491.52c-57.344 0-102.4-45.056-102.4-102.4v-552.96c0-57.344 45.056-102.4 102.4-102.4h696.32c57.344 0 102.4 45.056 102.4 102.4v176.128c0 12.288-8.192 20.48-20.48 20.48s-20.48-8.192-20.48-20.48v-47.104z m0-40.96v-88.064c0-34.816-26.624-61.44-61.44-61.44h-696.32c-34.816 0-61.44 26.624-61.44 61.44v88.064h819.2z m-204.8-51.2c-12.288 0-20.48-8.192-20.48-20.48s8.192-20.48 20.48-20.48 20.48 8.192 20.48 20.48-8.192 20.48-20.48 20.48z m61.44 0c-12.288 0-20.48-8.192-20.48-20.48s8.192-20.48 20.48-20.48 20.48 8.192 20.48 20.48-8.192 20.48-20.48 20.48z m61.44 0c-12.288 0-20.48-8.192-20.48-20.48s8.192-20.48 20.48-20.48 20.48 8.192 20.48 20.48-8.192 20.48-20.48 20.48z m-448.512 241.664c6.144-10.24 18.432-12.288 28.672-8.192 10.24 6.144 12.288 18.432 8.192 28.672l-102.4 178.176c-6.144 10.24-18.432 12.288-28.672 8.192s-12.288-18.432-8.192-28.672l102.4-178.176z m-126.976 6.144l-55.296 90.112 55.296 94.208c6.144 10.24 2.048 22.528-8.192 28.672-10.24 6.144-22.528 2.048-28.672-8.192l-67.584-114.688 67.584-110.592c6.144-10.24 18.432-12.288 28.672-6.144 10.24 4.096 12.288 16.384 8.192 26.624z m188.416 184.32l55.296-94.208-55.296-90.112c-6.144-10.24-2.048-22.528 6.144-28.672 10.24-6.144 22.528-2.048 28.672 6.144l67.584 110.592-67.584 114.688c-6.144 10.24-18.432 12.288-28.672 8.192-8.192-4.096-10.24-18.432-6.144-26.624z m577.536-122.88l4.096 10.24-40.96 51.2c-8.192 10.24-8.192 26.624 0 36.864l38.912 47.104-4.096 10.24c-8.192 26.624-22.528 51.2-38.912 71.68l-8.192 10.24-61.44-10.24c-12.288-2.048-26.624 6.144-30.72 18.432l-20.48 61.44-10.24 2.048c-32.768 8.192-69.632 8.192-102.4 0l-12.288-2.048-20.48-61.44c-4.096-12.288-18.432-20.48-30.72-18.432l-63.488 10.24-8.192-8.192c-8.192-10.24-16.384-20.48-22.528-32.768-8.192-12.288-14.336-26.624-18.432-40.96l-4.096-10.24 40.96-49.152c8.192-10.24 8.192-26.624 0-36.864l-40.96-49.152 4.096-10.24c10.24-26.624 22.528-51.2 40.96-73.728l8.192-8.192 61.44 10.24c12.288 2.048 26.624-6.144 30.72-18.432l22.528-61.44 10.24-2.048c32.768-6.144 67.584-6.144 100.352 0l12.288 2.048 20.48 59.392c4.096 12.288 18.432 20.48 30.72 20.48l63.488-8.192 8.192 8.192c8.192 10.24 16.384 20.48 22.528 32.768 8.192 12.288 14.336 24.576 18.432 38.912z m-53.248-20.48l-12.288-18.432-38.912 4.096c-32.768 4.096-65.536-16.384-75.776-47.104l-12.288-36.864c-20.48-4.096-40.96-4.096-61.44 0l-14.336 38.912c-10.24 30.72-45.056 51.2-75.776 45.056l-36.864-6.144c-10.24 12.288-16.384 26.624-22.528 40.96l26.624 30.72c20.48 24.576 20.48 63.488 0 90.112l-26.624 30.72c4.096 8.192 6.144 16.384 12.288 24.576 4.096 6.144 6.144 12.288 10.24 16.384l40.96-6.144c32.768-4.096 65.536 16.384 75.776 47.104l12.288 38.912c20.48 4.096 40.96 4.096 61.44 0l14.336-40.96c10.24-30.72 45.056-51.2 75.776-45.056l36.864 6.144c8.192-12.288 16.384-26.624 22.528-40.96l-24.576-28.672c-20.48-24.576-20.48-63.488-2.048-88.064l26.624-32.768c-4.096-6.144-8.192-14.336-12.288-22.528z m-169.984 202.752c-57.344 0-102.4-45.056-102.4-102.4s45.056-102.4 102.4-102.4 102.4 45.056 102.4 102.4c0 55.296-47.104 102.4-102.4 102.4z m0-40.96c34.816 0 61.44-26.624 61.44-61.44s-26.624-61.44-61.44-61.44-61.44 26.624-61.44 61.44 26.624 61.44 61.44 61.44z"
                                        fill="#515151"
                                        p-id="6181"
                                    ></path>
                                </svg>
                                <div className="text-base">即将推出</div>
                            </Grid>
                        </Popover>
                    </MainCard>
                </div>
                {checked && (
                    <div className={'mt-5'}>
                        <TextField label={'设置网络搜索范围'} className={'mt-3 w-3/4'} fullWidth multiline minRows={3} size="small" />
                    </div>
                )}
            </div>
            <QAModal open={qaVisible} handleClose={() => setQaVisible(false)} />
            <DocumentModal open={documentVisible} handleClose={() => setDocumentVisible(false)} />
        </div>
    );
};
