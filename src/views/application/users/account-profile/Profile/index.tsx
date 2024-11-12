import { useState, useEffect, SyntheticEvent, useRef } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import AltRouteIcon from '@mui/icons-material/AltRoute';
// material-ui
import { useTheme } from '@mui/material/styles';
import {
    Box,
    Grid,
    Tab,
    Tabs,
    Divider,
    List,
    ListItemButton,
    ListItemIcon,
    ListItemSecondaryAction,
    ListItemText,
    Typography,
    Fab,
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    Button
} from '@mui/material';
import MuiTooltip from '@mui/material/Tooltip';
import AddIcon from '@mui/icons-material/Add';
import infoStore from 'store/entitlementAction';
import {
    Avatar as AntAvatar,
    List as AntList,
    Button as AntBtn,
    Tag,
    Empty,
    Typography as AntTypography,
    message,
    Space,
    Popconfirm,
    Upload,
    UploadProps,
    Tooltip,
    Modal,
    Input
} from 'antd';

// project imports
// import Profile from './Profile';
import MyAccount from './MyAccount';
import ChangePassword from './ChangePassword';
import MainCard from 'ui-component/cards/MainCard';
import { gridSpacing } from 'store/constant';
import Avatar from 'ui-component/extended/Avatar';
import SubCard from 'ui-component/cards/SubCard';
import { getAuthList, ProfileVO, unBind, updateUserProfile } from 'api/system/user/profile';

// assets
import AccountCircleTwoToneIcon from '@mui/icons-material/AccountCircleTwoTone';
import EmojiEmotionsTwoToneIcon from '@mui/icons-material/EmojiEmotionsTwoTone';
import LibraryBooksTwoToneIcon from '@mui/icons-material/LibraryBooksTwoTone';
import LockTwoToneIcon from '@mui/icons-material/LockTwoTone';
import MailTwoToneIcon from '@mui/icons-material/MailTwoTone';
import PhonelinkRingTwoToneIcon from '@mui/icons-material/PhonelinkRingTwoTone';
// import Avatar3 from 'assets/images/users/avatar-3.png';
// types
import { TabsProps } from 'types';
import AvatarUpload from './Avatar';
import { getUserInfo } from 'api/login';
import { t } from 'hooks/web/useI18n';
import dayjs from 'dayjs';
import { authBind, authRedirect, updateNickname } from 'api/auth-coze';
import { ModalForm, ProFormText, ProFormTextArea, ProList } from '@ant-design/pro-components';
import { getAccessToken } from 'utils/auth';
import { PlusOutlined } from '@ant-design/icons';
import { origin_url } from 'utils/axios/config';
import { useAllDetail } from 'contexts/JWTContext';
import { dispatch } from 'store';
import { openSnackbar } from 'store/slices/snackbar';
// ==============================|| PROFILE 1 ||============================== //

// tabs panel
function TabPanel({ children, value, index, ...other }: TabsProps) {
    return (
        <div role="tabpanel" hidden={value !== index} id={`simple-tabpanel-${index}`} aria-labelledby={`simple-tab-${index}`} {...other}>
            {value === index && <Box sx={{ p: 0 }}>{children}</Box>}
        </div>
    );
}

function a11yProps(index: number) {
    return {
        id: `simple-tab-${index}`,
        'aria-controls': `simple-tabpanel-${index}`
    };
}

// tabs option
const tabsOption = [
    {
        label: '2profile.info.basicInfo',
        icon: <LibraryBooksTwoToneIcon sx={{ fontSize: '1.3rem' }} />
    },
    {
        label: '2profile.info.resetPwd',
        icon: <LockTwoToneIcon sx={{ fontSize: '1.3rem' }} />
    },
    {
        label: '第三方授权',
        icon: <AltRouteIcon sx={{ fontSize: '1.3rem' }} />
    }
    // {
    //     label: '社交信息',
    //     icon: <Diversity3TwoTone sx={{ fontSize: '1.3rem' }} />
    // }
];

const Profilnew = () => {
    const theme = useTheme();
    const [value, setValue] = useState<number>(0);
    const [userProfile, setUserProfile] = useState<ProfileVO | null>(null);
    const [updateCount, setUpdateCount] = useState(0);
    const { setuse } = infoStore();
    const [authCount, setAuthCount] = useState(0);
    const forceUpdate = () => setUpdateCount((pre) => pre + 1);
    const location = useLocation();
    const searchParams = new URLSearchParams(location.search);
    const type = searchParams.get('type') || 0;
    const [authDialogOpen, setAuthDialogOpen] = useState(false);
    const actionRef = useRef<any>();
    const all_detail = useAllDetail();

    useEffect(() => {
        setValue(Number(type));
    }, [type]);

    const navigate = useNavigate();

    const fetchAuthList = async () => {
        const result = await getAuthList({
            pageNo: 1,
            pageSize: 100,
            type: 35
        });
        setAuthCount(result.total);
    };

    useEffect(() => {
        fetchAuthList();
    }, []);

    useEffect(() => {
        const fetchData = async () => {
            const result = await getUserInfo();
            setUserProfile(result);
            setuse(result);
        };
        fetchData();
    }, [updateCount]);

    const handleChange = (event: SyntheticEvent, newValue: number) => {
        setValue(newValue);
    };
    const [dialogOpen, setDialogOpen] = useState(false);

    // 点击事件处理器
    const handleClickOpen = () => {
        setDialogOpen(true);
    };

    const handleClose = () => {
        setDialogOpen(false);
    };

    const handleUpload = (dataUrl: string) => {
        // 在这里处理裁剪后的图像数据，例如上传到服务器
        async function uploadImage(imageData: string) {
            const response = await fetch('/your-upload-url', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ image: imageData })
            });

            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
        }
        uploadImage(dataUrl);
    };
    interface AvatarUploadHandles {
        upload: () => void;
    }
    const avatarUploadRef = useRef<AvatarUploadHandles | null>(null);

    const handleConfirm = () => {
        avatarUploadRef.current?.upload();
        handleClose();
    };

    const handleDelete = async (item: any) => {
        const data: any = await unBind({
            type: item.type,
            openid: item.openid
        });
        if (data) {
            message.success('删除成功');
            fetchAuthList();
            actionRef.current?.reload();
        }
    };

    const props: UploadProps = {
        name: 'image',
        showUploadList: false,
        listType: 'picture-circle',
        action: `${origin_url}${process.env.REACT_APP_API_URL}/llm/creative/plan/uploadImage`,
        headers: {
            Authorization: 'Bearer ' + getAccessToken()
        },
        maxCount: 20,
        onChange: (info) => {
            if (info.file.status === 'done') {
                // setUserProfile({ ...userProfile, avatar: info?.file?.response?.data?.url } as any);
                updateUserProfile({
                    avatar: info?.file?.response?.data?.url,
                    username: userProfile?.username,
                    nickname: userProfile?.nickname
                }).then((res) => {
                    if (res) {
                        all_detail?.setPre(all_detail?.pre + 1);
                        forceUpdate();
                        message.success('上传成功');
                    }
                });
            }
        }
    };

    const uploadButton =
        // <button style={{ border: 0, background: 'none' }} type="button">
        {
            /* <PlusOutlined /> */
        };
    // <Avatar alt={userProfile?.nickname} src={userProfile?.avatar} size="xl" />
    // </button>

    const [open, setOpen] = useState(false);
    const [id, setId] = useState(0);
    const [nameValue, setNameValue] = useState('');

    return (
        <MainCard>
            <Grid container spacing={gridSpacing}>
                <Grid item lg={4} xs={12}>
                    <SubCard
                        title={
                            <Grid container spacing={2} alignItems="center" justifyContent="center">
                                <Grid item>
                                    <Upload {...props} className="cursor-pointer !w-[82px] !h-[82px]">
                                        {userProfile?.avatar ? (
                                            <img className="rounded-full w-full h-full" src={userProfile?.avatar} alt="avatar" />
                                        ) : (
                                            <Avatar alt={userProfile?.nickname} src={userProfile?.avatar} size="xl" />
                                        )}
                                    </Upload>
                                </Grid>
                            </Grid>
                        }
                    >
                        <List component="nav" aria-label="main mailbox folders">
                            <ListItemButton>
                                <ListItemIcon>
                                    <AccountCircleTwoToneIcon sx={{ fontSize: '1.3rem' }} />
                                </ListItemIcon>
                                <ListItemText primary={<Typography variant="subtitle1">{t('2profile.user.username')}</Typography>} />
                                <ListItemSecondaryAction>
                                    <Typography variant="subtitle2" align="right">
                                        {userProfile?.username || t('sys.app.unknown')}
                                    </Typography>
                                </ListItemSecondaryAction>
                            </ListItemButton>
                            <Divider />
                            <ListItemButton>
                                <ListItemIcon>
                                    <EmojiEmotionsTwoToneIcon sx={{ fontSize: '1.3rem' }} />
                                </ListItemIcon>
                                <ListItemText primary={<Typography variant="subtitle1">{t('2profile.user.nickname')}</Typography>} />
                                <ListItemSecondaryAction>
                                    <Typography variant="subtitle2" align="right">
                                        {userProfile?.nickname || t('sys.app.unknown')}
                                    </Typography>
                                </ListItemSecondaryAction>
                            </ListItemButton>
                            <Divider />
                            <ListItemButton>
                                <ListItemIcon>
                                    <PhonelinkRingTwoToneIcon sx={{ fontSize: '1.3rem' }} />
                                </ListItemIcon>
                                <ListItemText primary={<Typography variant="subtitle1">{t('2profile.user.mobile')}</Typography>} />
                                <ListItemSecondaryAction>
                                    <Typography variant="subtitle2" align="right">
                                        {userProfile?.mobile || t('sys.app.unknown')}
                                    </Typography>
                                </ListItemSecondaryAction>
                            </ListItemButton>
                            <Divider />
                            <ListItemButton>
                                <ListItemIcon>
                                    <MailTwoToneIcon sx={{ fontSize: '1.3rem' }} />
                                </ListItemIcon>
                                <ListItemText primary={<Typography variant="subtitle1">{t('2profile.user.email')}</Typography>} />
                                <ListItemSecondaryAction>
                                    <Typography variant="subtitle2" align="right">
                                        {userProfile?.email || t('sys.app.unknown')}
                                    </Typography>
                                </ListItemSecondaryAction>
                            </ListItemButton>
                        </List>
                    </SubCard>
                    <Dialog open={dialogOpen} onClose={handleClose} aria-labelledby="form-dialog-title">
                        <DialogTitle id="form-dialog-title">{t('2profile.user.upload')}</DialogTitle>
                        <DialogContent>
                            <AvatarUpload ref={avatarUploadRef} defaultImageSrc={userProfile?.avatar} onUpload={handleUpload} />
                        </DialogContent>
                        <DialogActions>
                            <Button onClick={handleConfirm} color="primary">
                                {t('2profile.user.confirm')}
                            </Button>
                        </DialogActions>
                    </Dialog>
                </Grid>
                <Grid item lg={8} xs={12}>
                    <Tabs
                        value={value}
                        indicatorColor="primary"
                        textColor="primary"
                        onChange={handleChange}
                        aria-label="simple tabs example"
                        variant="scrollable"
                        sx={{
                            mb: 1,
                            '& a': {
                                minHeight: 'auto',
                                minWidth: 10,
                                py: 1.5,
                                px: 1,
                                mr: 2.25,
                                color: theme.palette.grey[600],
                                display: 'flex',
                                flexDirection: 'row',
                                alignItems: 'center',
                                justifyContent: 'center'
                            },
                            '& a.Mui-selected': {
                                color: theme.palette.primary.main
                            },
                            '& .MuiTabs-indicator': {
                                bottom: 2
                            },
                            '& a > svg': {
                                marginBottom: '0px !important',
                                mr: 1.25
                            }
                        }}
                    >
                        {tabsOption.map((tab, index) => (
                            <Tab key={index} component={Link} to="#" icon={tab.icon} label={t(tab.label)} {...a11yProps(index)} />
                        ))}
                    </Tabs>
                    <TabPanel value={value} index={0}>
                        <MyAccount userProfile={userProfile} forceUpdate={forceUpdate} />
                    </TabPanel>
                    <TabPanel value={value} index={1}>
                        <ChangePassword />
                    </TabPanel>
                    <TabPanel value={value} index={2}>
                        <div className="mb-2">
                            <AntTypography.Text type="secondary">扣子授权</AntTypography.Text>
                            <AntBtn
                                className="mt-2 ml-1"
                                type="primary"
                                size="small"
                                onClick={async () => {
                                    const url = await authRedirect({
                                        type: 35,
                                        redirectUri: `${window.location.origin}/auth-coze`
                                    });
                                    window.location.href = url;
                                    // setAuthDialogOpen(true)
                                }}
                            >
                                添加授权
                            </AntBtn>
                        </div>
                        <Divider />

                        {authCount > 0 ? (
                            <ProList
                                actionRef={actionRef}
                                search={false}
                                request={async (params) => {
                                    const data = await getAuthList({
                                        pageNo: params.current,
                                        pageSize: 5,
                                        type: 35
                                    });
                                    return {
                                        data: data.list,
                                        total: data.total
                                    };
                                }}
                                pagination={{
                                    pageSize: 5
                                }}
                                metas={{
                                    title: {
                                        dataIndex: 'code',
                                        title: '用户',
                                        render: (_, row: any) => {
                                            return <span className="text-[#000] cursor-default">{row?.code}</span>;
                                        }
                                    },
                                    avatar: {
                                        dataIndex: 'avatar',
                                        search: false,
                                        render: (_, row: any) => {
                                            return <AntAvatar className="bg-[#673ab7]">{row?.code[0]?.toUpperCase()}</AntAvatar>;
                                        }
                                    },
                                    description: {
                                        dataIndex: 'nickname',
                                        search: false,
                                        render: (_, row) => (
                                            <div className="flex gap-2">
                                                <div>{row.nickname}</div>
                                                <Tooltip title="过期时间">
                                                    <div className="cursoe-pointer">
                                                        {row.refreshTokenExpireIn === -1
                                                            ? '永久有效'
                                                            : dayjs(row.refreshTokenExpireIn).format('YYYY-MM-DD HH-mm-ss')}
                                                    </div>
                                                </Tooltip>
                                            </div>
                                        )
                                    },
                                    actions: {
                                        render: (text, row) => [
                                            <Popconfirm
                                                title="提示"
                                                description="确认删除?"
                                                onConfirm={() => handleDelete(row)}
                                                okText="是"
                                                cancelText="否"
                                            >
                                                <AntBtn danger type="text">
                                                    删除
                                                </AntBtn>
                                            </Popconfirm>,
                                            <AntBtn
                                                type="text"
                                                onClick={() => {
                                                    setId(row.id);
                                                    setNameValue(row.nickname);
                                                    setOpen(true);
                                                }}
                                            >
                                                编辑
                                            </AntBtn>
                                        ],
                                        search: false
                                    }
                                }}
                            />
                        ) : (
                            <Empty
                                image="https://gw.alipayobjects.com/zos/antfincdn/ZHrcdLPrvN/empty.svg"
                                imageStyle={{ height: 60 }}
                                description={'暂无授权'}
                            >
                                <AntBtn
                                    type="primary"
                                    size="small"
                                    onClick={async () => {
                                        const url = await authRedirect({
                                            type: 35,
                                            redirectUri: `${window.location.origin}/auth-coze`
                                        });
                                        window.location.href = url;
                                        // setAuthDialogOpen(true);
                                    }}
                                >
                                    添加授权
                                </AntBtn>
                            </Empty>
                        )}
                    </TabPanel>
                    {/* <TabPanel value={value} index={2}>
                        <Profile />
                    </TabPanel> */}
                </Grid>
            </Grid>
            {authDialogOpen && (
                <ModalForm
                    open={authDialogOpen}
                    onOpenChange={setAuthDialogOpen}
                    title="新增授权"
                    onFinish={async (values) => {
                        const result = await authBind({
                            type: 35,
                            code: values.code,
                            remark: values.remark,
                            state: values.code,
                            auto: false
                        });
                        if (result) {
                            message.success('绑定成功');
                            actionRef.current?.reload();
                            setAuthDialogOpen(false);
                        }
                    }}
                >
                    <ProFormText required name="code" rules={[{ required: true }]} label="授权码" placeholder="请输入授权" />
                    <ProFormTextArea name="remark" label="备注" placeholder="请输入备注" />
                </ModalForm>
            )}
            <Modal
                onOk={async () => {
                    await updateNickname({
                        id,
                        nickname: nameValue
                    });
                    setOpen(false);
                    dispatch(
                        openSnackbar({
                            open: true,
                            message: '修改成功',
                            variant: 'alert',
                            alert: {
                                color: 'success'
                            },
                            anchorOrigin: { vertical: 'top', horizontal: 'center' },
                            close: false
                        })
                    );
                    fetchAuthList();
                    actionRef.current?.reload();
                }}
                title={'编辑绑定名称'}
                open={open}
                onCancel={() => setOpen(false)}
            >
                <Input placeholder="请输入绑定名称" value={nameValue} onChange={(e) => setNameValue(e.target.value)} />
            </Modal>
        </MainCard>
    );
};

export default Profilnew;
