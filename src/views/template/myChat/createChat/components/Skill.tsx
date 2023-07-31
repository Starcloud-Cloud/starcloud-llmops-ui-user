import { InboxOutlined } from '@ant-design/icons';
import AddIcon from '@mui/icons-material/Add';
import CloseIcon from '@mui/icons-material/Close';
import EditIcon from '@mui/icons-material/EditTwoTone';
import MoreHorizOutlinedIcon from '@mui/icons-material/MoreHorizOutlined';
import {
    Box,
    Button,
    Card,
    CardActions,
    CardContent,
    Divider,
    Grid,
    IconButton,
    Link,
    Menu,
    MenuItem,
    Modal,
    Switch,
    Tab,
    Tabs,
    TextField,
    Typography,
    useTheme
} from '@mui/material';
import { Upload, UploadProps } from 'antd';
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
                            "before:bg-[#673ab7] before:left-0 before:top-[7px] before:content-[''] before:w-[3px] before:h-[14px] before:absolute before:ml-0.5 block text-lg font-medium pl-[12px] relative"
                        }
                    >
                        学习API
                    </span>
                    <div className="text-sm text-[#9da3af] ml-3">释放您的天才，访问实时信息并无缝操作数据。</div>
                </div>
                <div className={'mt-5'}>
                    <div className="flex justify-end">
                        <div className="w-[300px] flex ">
                            <Button
                                variant={'contained'}
                                startIcon={<AddIcon />}
                                color={'secondary'}
                                size={'small'}
                                // onClick={() => setQaVisible(true)}
                            >
                                官方技能库
                            </Button>
                            <Button
                                className="ml-3"
                                variant={'contained'}
                                startIcon={<AddIcon />}
                                color={'secondary'}
                                size={'small'}
                                // onClick={() => setQaVisible(true)}
                            >
                                API开发
                            </Button>
                        </div>
                    </div>
                    <div className="mt-3">
                        <MainCard>
                            <Grid container direction="row" spacing={gridSpacing}>
                                <Grid item xs={12} sm={6} lg={4} xl={3}>
                                    <Card
                                        sx={{
                                            p: 2,
                                            background: theme.palette.mode === 'dark' ? theme.palette.dark.main : theme.palette.grey[50],
                                            border:
                                                theme.palette.mode === 'dark'
                                                    ? '1px solid transparent'
                                                    : `1px solid${theme.palette.grey[100]}`,
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
                                                                旅行计划
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
                                                                <MenuItem onClick={handleClose}>Edit</MenuItem>
                                                                <MenuItem onClick={handleClose}>Delete</MenuItem>
                                                            </Menu>
                                                        )}
                                                    </Grid>
                                                </Grid>
                                            </Grid>
                                            <Grid item xs={12}>
                                                <Typography variant="h5" component="div" color={'#0009'}>
                                                    该API用于为用户生成详细的出行计划。
                                                </Typography>
                                            </Grid>
                                            <Grid item xs={12}>
                                                <Divider variant="fullWidth" />
                                            </Grid>
                                            <Grid item xs={12} className="!pt-[10px]">
                                                <Typography variant="caption">未验证</Typography>
                                            </Grid>
                                        </Grid>
                                    </Card>
                                </Grid>
                            </Grid>
                        </MainCard>
                    </div>
                </div>
            </div>
            <div className="mt-5">
                <div>
                    <div>
                        <span
                            className={
                                "before:bg-[#673ab7] before:left-0 before:top-[7px] before:content-[''] before:w-[3px] before:h-[14px] before:absolute before:ml-0.5 block text-lg font-medium pl-[12px] relative"
                            }
                        >
                            学习工作流程
                        </span>
                        <div className="text-sm text-[#9da3af] ml-3">利用可定制的思路链，实现全面分析、深度输出。</div>
                    </div>
                    <div className={'mt-5'}>
                        <div className="flex justify-end">
                            <div className="w-[300px] flex ">
                                <Button
                                    variant={'contained'}
                                    startIcon={<AddIcon />}
                                    color={'secondary'}
                                    size={'small'}
                                    // onClick={() => setDocumentVisible(true)}
                                >
                                    工作流程库
                                </Button>
                                <Button
                                    className="ml-3"
                                    variant={'contained'}
                                    startIcon={<AddIcon />}
                                    color={'secondary'}
                                    size={'small'}
                                    // onClick={() => setDocumentVisible(true)}
                                >
                                    构建新的工作流程
                                </Button>
                            </div>
                        </div>
                        <div className="mt-3">
                            <MainCard>
                                <Grid container direction="row" spacing={gridSpacing}>
                                    <Grid item xs={12} sm={6} lg={4} xl={3}>
                                        <Card
                                            sx={{
                                                p: 2,
                                                background:
                                                    theme.palette.mode === 'dark' ? theme.palette.dark.main : theme.palette.grey[50],
                                                border:
                                                    theme.palette.mode === 'dark'
                                                        ? '1px solid transparent'
                                                        : `1px solid${theme.palette.grey[100]}`,
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
                                                                    旅行计划
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
                                                                    <MenuItem onClick={handleClose}>Edit</MenuItem>
                                                                    <MenuItem onClick={handleClose}>Delete</MenuItem>
                                                                </Menu>
                                                            )}
                                                        </Grid>
                                                    </Grid>
                                                </Grid>
                                                <Grid item xs={12}>
                                                    <Typography variant="h5" component="div" color={'#0009'}>
                                                        该API用于为用户生成详细的出行计划。
                                                    </Typography>
                                                </Grid>
                                                <Grid item xs={12}>
                                                    <Divider variant="fullWidth" />
                                                </Grid>
                                                <Grid item xs={12} className="!pt-[10px]">
                                                    <Typography variant="caption">未验证</Typography>
                                                </Grid>
                                            </Grid>
                                        </Card>
                                    </Grid>
                                </Grid>
                            </MainCard>
                        </div>
                    </div>
                </div>
            </div>
            <div className="mt-5">
                <div>
                    <span
                        className={
                            "before:bg-[#673ab7] before:left-0 before:top-[7px] before:content-[''] before:w-[3px] before:h-[14px] before:absolute before:ml-0.5 block text-lg font-medium pl-[12px] relative"
                        }
                    >
                        如何使用技能
                    </span>
                    <div className="text-sm text-[#9da3af] ml-3">指导天才如何以及何时使用技能。</div>
                </div>
                <div className={'mt-5'}>
                    <TextField label={'指导'} className={'mt-3 w-3/4'} fullWidth multiline minRows={1} size="small" />
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
                        <Switch className="ml-3" checked={checked} onChange={(e) => setChecked(e.target.checked)} color="secondary" />
                    </div>
                    <div className="text-sm text-[#9da3af] ml-3">能够从互联网收集实时信息。 </div>
                </div>
                {checked && (
                    <div className={'mt-5'}>
                        <TextField label={'何时使用网络搜索'} className={'w-3/4'} fullWidth multiline minRows={1} size="small" />
                        <TextField label={'设置网络搜索范围'} className={'mt-3 w-3/4'} fullWidth multiline minRows={3} size="small" />
                    </div>
                )}
            </div>
            <QAModal open={qaVisible} handleClose={() => setQaVisible(false)} />
            <DocumentModal open={documentVisible} handleClose={() => setDocumentVisible(false)} />
        </div>
    );
};
