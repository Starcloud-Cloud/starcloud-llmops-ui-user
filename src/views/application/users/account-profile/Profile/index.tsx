import { useState, useEffect, SyntheticEvent } from 'react';
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
// import AddIcon from '@mui/icons-material/Add';

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
// import { AccountTreeTwoTone, CalendarMonthTwoTone, Diversity3TwoTone, GroupTwoTone, WorkTwoTone } from '@mui/icons-material';

// types
import { TabsProps } from 'types';
import AvatarUpload from './Avatar';
import { getUserInfo } from 'api/login';

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
        label: '基本资料',
        icon: <LibraryBooksTwoToneIcon sx={{ fontSize: '1.3rem' }} />
    },
    {
        label: '修改密码',
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
        // setDialogOpen(true);
    };

    const handleClose = () => {
        setDialogOpen(false);
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
                                        <Avatar alt={userProfile?.nickname} src={userProfile?.avatar} size="xl" />
                                    </Grid>
                                ) : (
                                    <Grid item>
                                        <MuiTooltip title="Add" aria-label="add">
                                            <Fab color="primary" sx={{ m: 2 }}>
                                                {/* <AddIcon /> */}
                                            </Fab>
                                        </MuiTooltip>
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
                                <ListItemText primary={<Typography variant="subtitle1">用户名称</Typography>} />
                                <ListItemSecondaryAction>
                                    <Typography variant="subtitle2" align="right">
                                        {userProfile?.username || '未知'}
                                    </Typography>
                                </ListItemSecondaryAction>
                            </ListItemButton>
                            <Divider />
                            <ListItemButton>
                                <ListItemIcon>
                                    <EmojiEmotionsTwoToneIcon sx={{ fontSize: '1.3rem' }} />
                                </ListItemIcon>
                                <ListItemText primary={<Typography variant="subtitle1">用户昵称</Typography>} />
                                <ListItemSecondaryAction>
                                    <Typography variant="subtitle2" align="right">
                                        {userProfile?.nickname || '未知'}
                                    </Typography>
                                </ListItemSecondaryAction>
                            </ListItemButton>
                            <Divider />
                            <ListItemButton>
                                <ListItemIcon>
                                    <PhonelinkRingTwoToneIcon sx={{ fontSize: '1.3rem' }} />
                                </ListItemIcon>
                                <ListItemText primary={<Typography variant="subtitle1">手机号码</Typography>} />
                                <ListItemSecondaryAction>
                                    <Typography variant="subtitle2" align="right">
                                        {userProfile?.mobile || '未知'}
                                    </Typography>
                                </ListItemSecondaryAction>
                            </ListItemButton>
                            <Divider />
                            <ListItemButton>
                                <ListItemIcon>
                                    <MailTwoToneIcon sx={{ fontSize: '1.3rem' }} />
                                </ListItemIcon>
                                <ListItemText primary={<Typography variant="subtitle1">用户邮箱</Typography>} />
                                <ListItemSecondaryAction>
                                    <Typography variant="subtitle2" align="right">
                                        {userProfile?.email || '未知'}
                                    </Typography>
                                </ListItemSecondaryAction>
                            </ListItemButton>
                            {/* <Divider />
                            <ListItemButton>
                                <ListItemIcon>
                                    <AccountTreeTwoTone sx={{ fontSize: '1.3rem' }} />
                                </ListItemIcon>
                                <ListItemText primary={<Typography variant="subtitle1">所属部门</Typography>} />
                                <ListItemSecondaryAction>
                                    <Typography variant="subtitle2" align="right">
                                        {userProfile?.dept?.name || '未知'}
                                    </Typography>
                                </ListItemSecondaryAction>
                            </ListItemButton>
                            <Divider />
                            <ListItemButton>
                                <ListItemIcon>
                                    <WorkTwoTone sx={{ fontSize: '1.3rem' }} />
                                </ListItemIcon>
                                <ListItemText primary={<Typography variant="subtitle1">所属岗位</Typography>} />
                                <ListItemSecondaryAction>
                                    <Typography variant="subtitle2" align="right">
                                        {userProfile?.posts?.map((post) => post.name).join(', ') || '未知'}
                                    </Typography>
                                </ListItemSecondaryAction>
                            </ListItemButton>
                            <Divider />
                            <ListItemButton>
                                <ListItemIcon>
                                    <GroupTwoTone sx={{ fontSize: '1.3rem' }} />
                                </ListItemIcon>
                                <ListItemText primary={<Typography variant="subtitle1">所属角色</Typography>} />
                                <ListItemSecondaryAction>
                                    <Typography variant="subtitle2" align="right">
                                        {userProfile?.roles?.map((role) => role.name).join(', ') || '未知'}
                                    </Typography>
                                </ListItemSecondaryAction>
                            </ListItemButton>
                            <Divider />
                            <ListItemButton>
                                <ListItemIcon>
                                    <CalendarMonthTwoTone sx={{ fontSize: '1.3rem' }} />
                                </ListItemIcon>
                                <ListItemText primary={<Typography variant="subtitle1">创建日期</Typography>} />
                                <ListItemSecondaryAction>
                                    <Typography variant="subtitle2" align="right">
                                        {userProfile?.createTime ? new Date(userProfile.createTime).toLocaleString() : '未知'}
                                    </Typography>
                                </ListItemSecondaryAction>
                            </ListItemButton> */}
                        </List>
                    </SubCard>
                    <Dialog open={dialogOpen} onClose={handleClose} aria-labelledby="form-dialog-title">
                        <DialogTitle id="form-dialog-title">Upload Avatar</DialogTitle>
                        <DialogContent>
                            <AvatarUpload defaultImageSrc={userProfile?.avatar} />
                        </DialogContent>
                        <DialogActions>
                            <Button onClick={handleClose} color="primary">
                                Confirm
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
                            <Tab key={index} component={Link} to="#" icon={tab.icon} label={tab.label} {...a11yProps(index)} />
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
