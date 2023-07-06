import { useState, useEffect, SyntheticEvent, useRef } from 'react';
import { Link } from 'react-router-dom';

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

// project imports
// import Profile from './Profile';
import MyAccount from './MyAccount';
import ChangePassword from './ChangePassword';
import MainCard from 'ui-component/cards/MainCard';
import { gridSpacing } from 'store/constant';
import Avatar from 'ui-component/extended/Avatar';
import SubCard from 'ui-component/cards/SubCard';
import { ProfileVO } from 'api/system/user/profile';

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

    useEffect(() => {
        const fetchData = async () => {
            const result = await getUserInfo();
            setUserProfile(result);
        };
        fetchData();
    }, []);

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

    return (
        <MainCard>
            <Grid container spacing={gridSpacing}>
                <Grid item lg={4} xs={12}>
                    <SubCard
                        title={
                            <Grid container spacing={2} alignItems="center" justifyContent="center" onClick={handleClickOpen}>
                                {userProfile?.avatar ? (
                                    <Grid item>
                                        <MuiTooltip title="Add" aria-label="add">
                                            <Fab color="secondary" sx={{ m: 2 }}>
                                                <AddIcon />
                                            </Fab>
                                        </MuiTooltip>
                                    </Grid>
                                ) : (
                                    <Grid item>
                                        <Avatar alt={userProfile?.nickname} src={userProfile?.avatar} size="xl" />
                                    </Grid>
                                )}
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
                            mb: 3,
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
                        <MyAccount userProfile={userProfile} />
                    </TabPanel>
                    <TabPanel value={value} index={1}>
                        <ChangePassword />
                    </TabPanel>
                    {/* <TabPanel value={value} index={2}>
                        <Profile />
                    </TabPanel> */}
                </Grid>
            </Grid>
        </MainCard>
    );
};

export default Profilnew;
