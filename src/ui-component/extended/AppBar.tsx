import { cloneElement, useState, ReactElement } from 'react';
import { Link as RouterLink, useNavigate } from 'react-router-dom';
import { ENUM_PERMISSION, ENUM_TENANT, getPermission, getTenant } from 'utils/permission';
import mofabijiwechat from 'assets/images/landing/mofabijiwechat.png';

// material-ui
import {
    AppBar as MuiAppBar,
    Box,
    Button,
    Container,
    Drawer,
    IconButton,
    Link,
    List,
    ListItemButton,
    ListItemIcon,
    ListItemText,
    Stack,
    Toolbar,
    useScrollTrigger,
    useTheme,
    Typography,
    CardMedia
} from '@mui/material';

// project imports
import Logo, { LogoOriginal } from 'ui-component/Logo';

// assets
import { IconDashboard, IconHome2 } from '@tabler/icons';
import MenuIcon from '@mui/icons-material/Menu';
import useRouteStore from 'store/router';
import { DASHBOARD_PATH } from 'config';
import { Alert, Modal } from 'antd';
import Marquee from 'react-fast-marquee';

// elevation scroll
interface ElevationScrollProps {
    children: ReactElement;
    window?: Window | Node;
}

function ElevationScroll({ children, window }: ElevationScrollProps) {
    const theme = useTheme();
    const trigger = useScrollTrigger({
        disableHysteresis: true,
        threshold: 0,
        target: window!
    });

    return cloneElement(children, {
        elevation: trigger ? 1 : 0,
        style: {
            backgroundColor: theme.palette.mode === 'dark' && trigger ? theme.palette.dark[800] : theme.palette.background.default,
            color: theme.palette.text.dark
        }
    });
}

// ==============================|| MINIMAL LAYOUT APP BAR ||============================== //

const AppBar = ({ ...others }) => {
    const [drawerToggle, setDrawerToggle] = useState<boolean>(false);
    const navigate = useNavigate();
    const { setRoutesIndex } = useRouteStore((state) => state);

    const drawerToggler = (open: boolean) => (event: any) => {
        if (event.type! === 'keydown' && (event.key! === 'Tab' || event.key! === 'Shift')) {
            return;
        }
        setDrawerToggle(open);
    };
    const [open, setOpen] = useState(false);
    return (
        <ElevationScroll {...others}>
            <MuiAppBar>
                {/Mobi|Android/i.test(navigator.userAgent) && (
                    <Alert
                        banner
                        className="mt-2"
                        message={
                            <Marquee pauseOnHover gradient={false}>
                                请使用电脑访问以获得更好的操作体验！
                            </Marquee>
                        }
                        type="warning"
                    />
                )}
                {getPermission(ENUM_PERMISSION.SPRING_SALE) && (
                    // <img
                    //     src={require('../../assets/images/header/presents.jpg')}
                    //     className="cursor-pointer w-full"
                    //     onClick={() => {
                    //         navigate('/subscribe');
                    //     }}
                    // />
                    <div
                        onClick={() => {
                            window.open(process.env.REACT_APP_SHARE_URL);
                        }}
                        className="h-[40px] font-[400] text-white text-xl bg-[rgb(128,102,225)] flex justify-center items-center gap-4 cursor-pointer"
                    >
                        <svg viewBox="0 0 1094 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="26183" width="25" height="25">
                            <path
                                d="M14.724414 787.950345a102.4 102.4 0 0 0 138.134069 36.369655c48.057379-27.436138 65.112276-87.675586 37.111172-135.379862-28.001103-47.704276-89.441103-63.805793-138.134069-36.369655-48.692966 27.436138-65.112276 88.275862-37.111172 135.379862z"
                                fill="#FD8D4B"
                                p-id="26184"
                            ></path>
                            <path
                                d="M678.629517 430.08c37.711448 64.406069 121.679448 85.874759 186.791724 48.904828a132.413793 132.413793 0 0 0 49.893518-183.119449c-37.711448-64.406069-121.679448-86.510345-186.791725-48.904827-65.112276 37.570207-87.640276 119.278345-49.893517 183.119448z"
                                fill="#FDAD4A"
                                p-id="26185"
                            ></path>
                            <path
                                d="M488.130207 7.768276a51.023448 51.023448 0 0 1 68.784552 17.902345l418.074482 710.373517c13.982897 23.869793 5.437793 53.671724-18.290758 67.442759a51.023448 51.023448 0 0 1-68.749242-17.937656l-418.074482-709.737931A49.081379 49.081379 0 0 1 488.130207 7.768276z"
                                fill="#FFDF78"
                                p-id="26186"
                            ></path>
                            <path
                                d="M278.810483 811.784828l49.893517-28.001104a21.256828 21.256828 0 0 1 29.201655 7.768276l101.022897 171.749517a20.409379 20.409379 0 0 1-7.909518 28.63669l-49.893517 28.036414a21.256828 21.256828 0 0 1-29.201655-7.768276l-100.987586-171.749517c-6.10869-9.533793-2.471724-22.669241 7.874207-28.63669z"
                                fill="#FD8D4B"
                                p-id="26187"
                            ></path>
                            <path
                                d="M141.912276 734.878897c101.623172-144.34869 177.081379-259.460414 225.739034-345.335173a1919.611586 1919.611586 0 0 0 127.187862-271.430621l367.54538 624.498759c-57.202759-16.701793-156.989793-26.235586-298.796138-28.036414-141.170759-1.165241-282.341517 5.367172-421.676138 20.303449z"
                                fill="#FFCC63"
                                p-id="26188"
                            ></path>
                            <path
                                d="M29.943172 544.591448l200.209656-113.346207a43.502345 43.502345 0 0 1 59.003586 15.536552l172.808827 294.629517c12.182069 20.303448 4.872828 45.938759-15.819034 57.873656l-200.209655 113.346206a43.502345 43.502345 0 0 1-59.003586-15.536551L13.488552 603.10069a43.008 43.008 0 0 1 16.45462-58.473931z"
                                fill="#FDAD4A"
                                p-id="26189"
                            ></path>
                            <path
                                d="M373.76 457.516138c13.982897-19.703172 48.057379-76.976552 57.202759-100.811035 2.401103-5.367172 8.474483-8.333241 13.982896-5.967448 0.600276 0 0.600276 0.600276 1.200552 0.600276a14.124138 14.124138 0 0 1 6.708965 17.302069c-10.946207 26.835862-42.01931 78.742069-57.202758 100.210759a14.547862 14.547862 0 0 1-18.255448 4.766896 10.769655 10.769655 0 0 1-4.872828-14.300689c0.600276-1.200552 1.235862-1.800828 1.235862-1.800828z m84.568276-155.68331c10.345931-21.46869 12.782345-27.436138 17.655172-49.505104a10.875586 10.875586 0 0 1 12.782345-8.333241c0.600276 0 0.600276 0 1.200552 0.564965 6.708966 2.401103 10.946207 8.968828 9.145379 16.136828-5.473103 22.068966-7.309241 28.001103-17.655172 49.505103a13.594483 13.594483 0 0 1-17.054897 7.13269 10.804966 10.804966 0 0 1-6.708965-13.700414c0-1.200552 0-1.200552 0.635586-1.765517z"
                                fill="#FFFFFF"
                                p-id="26190"
                            ></path>
                            <path
                                d="M925.66069 192.688552a19.773793 19.773793 0 0 1-11.546483-1.765518 14.477241 14.477241 0 0 1-4.872828-20.303448l55.366621-85.910069a15.148138 15.148138 0 0 1 20.691862-4.766896 14.477241 14.477241 0 0 1 4.872828 20.303448L935.406345 186.085517a15.148138 15.148138 0 0 1-9.745655 6.567724z m45.056 78.742069a13.488552 13.488552 0 0 1-8.545104-7.768276 14.653793 14.653793 0 0 1 6.708966-19.667862l103.45931-48.940138a15.254069 15.254069 0 0 1 20.056276 6.567724 14.653793 14.653793 0 0 1-6.708966 19.703172l-103.424 48.904828a13.312 13.312 0 0 1-11.546482 1.200552z"
                                fill="#FFCB61"
                                p-id="26191"
                            ></path>
                        </svg>
                        内测邀请：领取小红书笔记智能创作权益
                    </div>
                )}
                <Container>
                    <Toolbar sx={{ display: 'flex', justifyContent: 'space-between', py: 2.5, px: `0 !important` }}>
                        <LogoOriginal />
                        <Stack direction="row" sx={{ display: { xs: 'block', sm: 'block' } }} spacing={{ xs: 1.5, md: 2.5 }}>
                            {/Mobi|Android/i.test(navigator.userAgent) ? (
                                <Button onClick={() => setOpen(true)} variant="contained" color="secondary">
                                    联系我们
                                </Button>
                            ) : (
                                <Button
                                    onClick={() => {
                                        if (getTenant() === ENUM_TENANT.AI) {
                                            navigate(DASHBOARD_PATH);
                                            setRoutesIndex(0);
                                        } else {
                                            navigate('/appMarket');
                                        }
                                    }}
                                    disableElevation
                                    variant="contained"
                                    color="secondary"
                                >
                                    {getPermission(ENUM_PERMISSION.App_DOWNLOAD)}
                                </Button>
                            )}
                        </Stack>
                        <Box sx={{ display: { xs: 'none', sm: 'none' } }}>
                            <IconButton color="inherit" onClick={drawerToggler(true)} size="large">
                                <MenuIcon />
                            </IconButton>
                            <Drawer anchor="top" open={drawerToggle} onClose={drawerToggler(false)}>
                                {drawerToggle && (
                                    <Box
                                        sx={{ width: 'auto' }}
                                        role="presentation"
                                        onClick={drawerToggler(false)}
                                        onKeyDown={drawerToggler(false)}
                                    >
                                        <List>
                                            <Link style={{ textDecoration: 'none' }} href="#" target="_blank">
                                                <ListItemButton component="a">
                                                    <ListItemIcon>
                                                        <IconHome2 />
                                                    </ListItemIcon>
                                                    <ListItemText primary="Home" />
                                                </ListItemButton>
                                            </Link>
                                            <Link style={{ textDecoration: 'none' }} href="/login" target="_blank">
                                                <ListItemButton component="a">
                                                    <ListItemIcon>
                                                        <IconDashboard />
                                                    </ListItemIcon>
                                                    <ListItemText primary="Dashboard" />
                                                </ListItemButton>
                                            </Link>
                                        </List>
                                    </Box>
                                )}
                            </Drawer>
                        </Box>
                    </Toolbar>
                </Container>
                <Modal zIndex={1200} width="80%" open={open} onCancel={() => setOpen(false)} title="魔法笔记交流群" footer={false}>
                    <div className="flex flex-col justify-center text-center">
                        <Typography mt={2} variant="h3">
                            微信扫码入群
                        </Typography>
                        <Typography my={1} fontSize="12px" color="#697586">
                            魔法AI矩阵交流群
                        </Typography>
                        <Box display="flex" justifyContent="center">
                            <CardMedia component="img" image={mofabijiwechat} alt="img1" sx={{ width: '200px' }} />
                        </Box>
                    </div>
                </Modal>
            </MuiAppBar>
        </ElevationScroll>
    );
};

export default AppBar;
