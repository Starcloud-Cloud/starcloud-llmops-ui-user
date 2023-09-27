import ContentCopyIcon from '@mui/icons-material/ContentCopy';
import ErrorOutlineIcon from '@mui/icons-material/ErrorOutline';
import copy from 'clipboard-copy';
import { useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
// material-ui
import {
    Avatar,
    Box,
    Card,
    // CardContent,
    Chip,
    ClickAwayListener,
    Divider,
    Grid,
    // Switch,
    IconButton,
    // InputAdornment,
    List,
    ListItemButton,
    ListItemIcon,
    ListItemText,
    // OutlinedInput,
    Paper,
    Popper,
    Stack,
    Tooltip,
    Typography
} from '@mui/material';
import { useTheme } from '@mui/material/styles';
import { getUserInfo } from 'api/login';
import QRCode from 'qrcode.react';
import infoStore from 'store/entitlementAction';
import useUserStore from 'store/user';

// third-party
import PerfectScrollbar from 'react-perfect-scrollbar';

// project imports
import User1 from 'assets/images/users/user-round.svg';
import useAuth from 'hooks/useAuth';
import { t } from 'hooks/web/useI18n';
import MainCard from 'ui-component/cards/MainCard';
import Transitions from 'ui-component/extended/Transitions';
import UpgradePlanCard from './UpgradePlanCard';

// assets
import DoneIcon from '@mui/icons-material/Done';
import {
    IconLogout,
    //  IconSearch,
    IconSettings,
    IconShoppingBag
    // IconUser
} from '@tabler/icons';
import useConfig from 'hooks/useConfig';

// ==============================|| PROFILE MENU ||============================== //

const ProfileSection = () => {
    const data = useUserStore();
    const theme = useTheme();
    const { borderRadius } = useConfig();
    const navigate = useNavigate();

    // const [sdm, setSdm] = useState(true);
    // const [value, setValue] = useState('');
    // const [notification, setNotification] = useState(false);
    const [selectedIndex, setSelectedIndex] = useState(-1);
    const { logout } = useAuth();
    const [open, setOpen] = useState(false);
    /**
     * anchorRef is used on different components and specifying one type leads to other components throwing an error
     * */
    const anchorRef = useRef<any>(null);
    const handleLogout = async () => {
        try {
            await logout();
        } catch (err) {
            console.error(err);
        }
    };
    const handleListItemClick = (event: React.MouseEvent<HTMLDivElement>, index: number, route: string = '') => {
        setSelectedIndex(index);
        handleClose(event);

        if (route && route !== '') {
            navigate(route);
        }
    };
    const handleToggle = () => {
        setOpen((prevOpen) => !prevOpen);
    };
    const handleClose = (event: React.MouseEvent<HTMLDivElement> | MouseEvent | TouchEvent) => {
        if (anchorRef.current && anchorRef.current.contains(event.target)) {
            return;
        }

        setOpen(false);
    };
    const prevOpen = useRef(open);
    const { use, setuse } = infoStore();
    const fetchData = async () => {
        if (!use?.inviteCode) {
            const result = await getUserInfo();
            setuse(result);
        }
    };
    const [loading, setLoading] = useState(false);
    const copyCode = () => {
        copy(window.location.protocol + '//' + window.location.host + '/login?q=' + use?.inviteCode);
        setLoading(true);
        setTimeout(() => {
            setLoading(false);
        }, 1000);
    };
    useEffect(() => {
        if (prevOpen.current === true && open === false) {
            anchorRef.current.focus();
        }
        fetchData();
        prevOpen.current = open;
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [open]);

    return (
        <>
            <Chip
                sx={{
                    height: '48px',
                    alignItems: 'center',
                    borderRadius: '27px',
                    transition: 'all .2s ease-in-out',
                    borderColor: theme.palette.mode === 'dark' ? theme.palette.dark.main : theme.palette.secondary.light,
                    backgroundColor: theme.palette.mode === 'dark' ? theme.palette.dark.main : theme.palette.secondary.light,
                    '&[aria-controls="menu-list-grow"], &:hover': {
                        borderColor: theme.palette.secondary.main,
                        background: `${theme.palette.secondary.main}!important`,
                        color: theme.palette.secondary.light,
                        '& svg': {
                            stroke: theme.palette.secondary.light
                        }
                    },
                    '& .MuiChip-label': {
                        lineHeight: 0
                    }
                }}
                icon={
                    <Avatar
                        src={User1}
                        alt="user-images"
                        sx={{
                            ...theme.typography.mediumAvatar,
                            margin: '8px 0 8px 8px !important',
                            cursor: 'pointer'
                        }}
                        ref={anchorRef}
                        aria-controls={open ? 'menu-list-grow' : undefined}
                        aria-haspopup="true"
                        color="inherit"
                    />
                }
                label={<IconSettings stroke={1.5} size="24px" color={theme.palette.secondary.main} />}
                variant="outlined"
                ref={anchorRef}
                aria-controls={open ? 'menu-list-grow' : undefined}
                aria-haspopup="true"
                onClick={handleToggle}
                color="primary"
                aria-label="user-account"
            />

            <Popper
                placement="bottom"
                open={open}
                anchorEl={anchorRef.current}
                role={undefined}
                transition
                disablePortal
                modifiers={[
                    {
                        name: 'offset',
                        options: {
                            offset: [0, 14]
                        }
                    }
                ]}
            >
                {({ TransitionProps }) => (
                    <ClickAwayListener onClickAway={handleClose}>
                        <Transitions in={open} {...TransitionProps}>
                            <Paper>
                                {open && (
                                    <MainCard border={false} elevation={16} content={false} boxShadow shadow={theme.shadows[16]}>
                                        <Box sx={{ p: 2 }}>
                                            <Stack>
                                                <Stack direction="row" spacing={0.5} alignItems="center">
                                                    <Typography variant="h4">{t('market.welcome')},</Typography>
                                                    <Typography component="span" variant="h4" sx={{ fontWeight: 400 }}>
                                                        {data.user.nickname}
                                                    </Typography>
                                                </Stack>
                                            </Stack>
                                        </Box>
                                        <PerfectScrollbar style={{ height: '100%', overflowX: 'hidden', width: '260px' }}>
                                            <Box sx={{ p: 2, pt: 0 }}>
                                                <UpgradePlanCard />
                                                <Divider sx={{ mt: 1 }} />
                                                <Card>
                                                    <Grid container justifyContent="space-between" alignItems="center">
                                                        <Grid item md={9}>
                                                            <Box display="flex" alignItems="center">
                                                                <Typography variant="body1">{t('market.invitation')}</Typography>
                                                                <Tooltip
                                                                    arrow
                                                                    placement="top"
                                                                    title={<Box sx={{ p: 0.5, fontSize: '14px' }}>{t('market.tips')}</Box>}
                                                                >
                                                                    <ErrorOutlineIcon
                                                                        fontSize="small"
                                                                        sx={{ marginLeft: '5px', cursor: 'pointer' }}
                                                                    />
                                                                </Tooltip>
                                                            </Box>
                                                        </Grid>
                                                        <Grid item md={3}>
                                                            {loading ? (
                                                                <IconButton size="small" disabled>
                                                                    <DoneIcon fontSize="small" />
                                                                </IconButton>
                                                            ) : (
                                                                <Tooltip
                                                                    arrow
                                                                    placement="top"
                                                                    title={<Box sx={{ p: 0.5, fontSize: '14px' }}>{t('market.copy')}</Box>}
                                                                >
                                                                    <IconButton size="small" onClick={copyCode}>
                                                                        <ContentCopyIcon fontSize="small" />
                                                                    </IconButton>
                                                                </Tooltip>
                                                            )}
                                                        </Grid>
                                                    </Grid>
                                                    <Typography variant="body1" sx={{ width: '220px', textDecoration: 'underline' }}>
                                                        {window.location.protocol +
                                                            '//' +
                                                            window.location.host +
                                                            '/login?q=' +
                                                            use?.inviteCode}
                                                    </Typography>
                                                    <Box marginTop={1} textAlign="center">
                                                        <QRCode
                                                            size={100}
                                                            value={
                                                                window.location.protocol +
                                                                '//' +
                                                                window.location.host +
                                                                '/login?q=' +
                                                                use?.inviteCode
                                                            }
                                                        />
                                                        <Typography variant="h5" mb={1}>
                                                            {t('market.invitation')}
                                                        </Typography>
                                                    </Box>
                                                </Card>
                                                <Divider />
                                                <List
                                                    component="nav"
                                                    sx={{
                                                        width: '100%',
                                                        backgroundColor: theme.palette.background.paper,
                                                        borderRadius: '10px',
                                                        [theme.breakpoints.down('md')]: {
                                                            minWidth: '100%'
                                                        },
                                                        '& .MuiListItemButton-root': {
                                                            mt: 0.5
                                                        }
                                                    }}
                                                >
                                                    <ListItemButton
                                                        sx={{ borderRadius: `${borderRadius}px` }}
                                                        selected={selectedIndex === 0}
                                                        onClick={(event: React.MouseEvent<HTMLDivElement>) =>
                                                            handleListItemClick(event, 0, '/user/account-profile/profile')
                                                        }
                                                    >
                                                        <ListItemIcon>
                                                            <IconSettings stroke={1.5} size="20px" />
                                                        </ListItemIcon>
                                                        <ListItemText
                                                            primary={<Typography variant="body2">{t('account-settings')}</Typography>}
                                                        />
                                                    </ListItemButton>
                                                    <ListItemButton
                                                        sx={{ borderRadius: `${borderRadius}px` }}
                                                        selected={selectedIndex === 1}
                                                        onClick={(event: React.MouseEvent<HTMLDivElement>) =>
                                                            handleListItemClick(event, 1, '/orderRecord')
                                                        }
                                                    >
                                                        <ListItemIcon>
                                                            <IconShoppingBag stroke={1.5} size="20px" />
                                                        </ListItemIcon>
                                                        <ListItemText
                                                            primary={<Typography variant="body2">{t('order-record')}</Typography>}
                                                        />
                                                    </ListItemButton>
                                                    <ListItemButton
                                                        sx={{ borderRadius: `${borderRadius}px` }}
                                                        selected={selectedIndex === 4}
                                                        onClick={handleLogout}
                                                    >
                                                        <ListItemIcon>
                                                            <IconLogout stroke={1.5} size="20px" />
                                                        </ListItemIcon>
                                                        <ListItemText primary={<Typography variant="body2">{t('logout')}</Typography>} />
                                                    </ListItemButton>
                                                </List>
                                            </Box>
                                        </PerfectScrollbar>
                                    </MainCard>
                                )}
                            </Paper>
                        </Transitions>
                    </ClickAwayListener>
                )}
            </Popper>
        </>
    );
};

export default ProfileSection;
