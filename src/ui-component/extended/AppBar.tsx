import { cloneElement, useState, ReactElement } from 'react';
import { Link as RouterLink, useNavigate } from 'react-router-dom';
import { ENUM_PERMISSION, getPermission } from 'utils/permission';

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
    useTheme
} from '@mui/material';

// project imports
import Logo from 'ui-component/Logo';

// assets
import { IconDashboard, IconHome2 } from '@tabler/icons';
import MenuIcon from '@mui/icons-material/Menu';
import useRouteStore from 'store/router';
import { DASHBOARD_PATH } from 'config';

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

    return (
        <ElevationScroll {...others}>
            <MuiAppBar>
                <Container>
                    <Toolbar sx={{ display: 'flex', justifyContent: 'space-between', py: 2.5, px: `0 !important` }}>
                        <Logo />
                        <Stack direction="row" sx={{ display: { xs: 'block', sm: 'block' } }} spacing={{ xs: 1.5, md: 2.5 }}>
                            <Button
                                onClick={() => {
                                    navigate(DASHBOARD_PATH);
                                    setRoutesIndex(0);
                                }}
                                disableElevation
                                variant="contained"
                                color="secondary"
                            >
                                {getPermission(ENUM_PERMISSION.App_DOWNLOAD)}
                            </Button>
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
            </MuiAppBar>
        </ElevationScroll>
    );
};

export default AppBar;
