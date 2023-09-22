import { useEffect, useMemo } from 'react';
import { Outlet, useLocation } from 'react-router-dom';

// material-ui
import { AppBar, Box, Container, CssBaseline, Toolbar, useMediaQuery } from '@mui/material';
import { Theme, styled, useTheme } from '@mui/material/styles';

// project imports
import Header from './Header';
import HorizontalBar from './HorizontalBar';
import Sidebar from './Sidebar';
// import Customization from '../Customization';
import Breadcrumbs from 'ui-component/extended/Breadcrumbs';

import LAYOUT_CONST from 'constant';
import useConfig from 'hooks/useConfig';
import getMenuItems from 'menu-items';
import { useDispatch, useSelector } from 'store';
import { drawerWidth } from 'store/constant';
import { openDrawer } from 'store/slices/menu';

// assets
import { IconChevronRight } from '@tabler/icons';

interface MainStyleProps {
    theme: Theme;
    open: boolean;
    layout: string;
}

// styles
const Main = styled('main', { shouldForwardProp: (prop) => prop !== 'open' })(({ theme, open, layout }: MainStyleProps) => ({
    ...theme.typography.mainContent,
    borderBottomLeftRadius: 0,
    borderBottomRightRadius: 0,
    ...(!open && {
        transition: theme.transitions.create('margin', {
            easing: theme.transitions.easing.sharp,
            duration: theme.transitions.duration.shorter + 200
        }),
        [theme.breakpoints.up('md')]: {
            marginLeft: layout === LAYOUT_CONST.VERTICAL_LAYOUT ? -(drawerWidth - 72) : '20px',
            width: `calc(100% - ${drawerWidth}px)`,
            marginTop: layout === LAYOUT_CONST.HORIZONTAL_LAYOUT ? 135 : 88
        },
        [theme.breakpoints.down('md')]: {
            marginLeft: '20px',
            width: `calc(100% - ${drawerWidth}px)`,
            padding: '16px',
            marginTop: 88
        },
        [theme.breakpoints.down('sm')]: {
            marginLeft: '0',
            width: `calc(100% - ${drawerWidth}px)`,
            padding: '16px',
            marginRight: '0',
            marginTop: 88
        }
    }),
    ...(open && {
        // 'margin 538ms cubic-bezier(0.4, 0, 1, 1) 0ms',
        transition: theme.transitions.create('margin', {
            easing: theme.transitions.easing.easeOut,
            duration: theme.transitions.duration.shorter + 200
        }),
        marginLeft: layout === LAYOUT_CONST.HORIZONTAL_LAYOUT ? '20px' : 0,
        marginTop: layout === LAYOUT_CONST.HORIZONTAL_LAYOUT ? 135 : 88,
        width: `calc(100% - ${drawerWidth}px)`,
        [theme.breakpoints.up('md')]: {
            marginTop: layout === LAYOUT_CONST.HORIZONTAL_LAYOUT ? 135 : 88
        },
        [theme.breakpoints.down('md')]: {
            marginLeft: '20px',
            marginTop: 88
        },
        [theme.breakpoints.down('sm')]: {
            marginLeft: '10px',
            marginTop: 88
        }
    })
}));

// ==============================|| MAIN LAYOUT ||============================== //

const MainLayout = () => {
    const navigation = getMenuItems();
    const theme = useTheme();
    const location = useLocation();

    const matchDownMd = useMediaQuery(theme.breakpoints.down('md'));
    const dispatch = useDispatch();
    const { drawerOpen } = useSelector((state) => state.menu);
    const { drawerType, container, layout } = useConfig();

    const isLarge = useMemo(() => {
        const IS_LARGE_PATH = ['/textToImage', '/createApp', '/createChat', '/chatCreate'];
        const path = location.pathname;
        return IS_LARGE_PATH.includes(path);
    }, [location]);
    // useEffect(() => {
    //     if (drawerType === LAYOUT_CONST.DEFAULT_DRAWER) {
    //         dispatch(openDrawer(true));
    //     } else {
    //         dispatch(openDrawer(false));
    //     }
    //     // eslint-disable-next-line react-hooks/exhaustive-deps
    // }, [drawerType]);

    useEffect(() => {
        if (drawerType === LAYOUT_CONST.DEFAULT_DRAWER && !matchDownMd) {
            dispatch(openDrawer(true));
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    // useEffect(() => {
    //     if (matchDownMd) {
    //         dispatch(openDrawer(true));
    //     }
    //     // eslint-disable-next-line react-hooks/exhaustive-deps
    // }, [matchDownMd]);

    const condition = layout === LAYOUT_CONST.HORIZONTAL_LAYOUT && !matchDownMd;

    const header = useMemo(
        () => (
            <Toolbar sx={{ p: condition ? '10px' : '16px' }}>
                <Header />
            </Toolbar>
        ),
        // eslint-disable-next-line react-hooks/exhaustive-deps
        [layout, matchDownMd]
    );

    return (
        <Box sx={{ display: 'flex' }}>
            <CssBaseline />
            {/* header */}
            <AppBar enableColorOnDark position="fixed" color="inherit" elevation={0} sx={{ bgcolor: theme.palette.background.default }}>
                {header}
            </AppBar>

            {/* horizontal menu-list bar */}
            {layout === LAYOUT_CONST.HORIZONTAL_LAYOUT && !matchDownMd && <HorizontalBar />}

            {/* drawer */}
            {(layout === LAYOUT_CONST.VERTICAL_LAYOUT || matchDownMd) && <Sidebar />}

            {/* main content */}
            <Main theme={theme} open={drawerOpen} layout={layout}>
                {/*<Container maxWidth={container ? 'lg' : false} {...(!container && { sx: { px: { xs: 0 } } })}>*/}
                {!isLarge ? (
                    <Container className={'max-w-[1300px] h-full'} {...(!container && { sx: { px: { xs: 0 } } })}>
                        {/* breadcrumb */}
                        <Breadcrumbs separator={IconChevronRight} navigation={navigation} icon title rightAlign />
                        <Outlet />
                    </Container>
                ) : (
                    <Container maxWidth={false} className={'h-full'} {...(!container && { sx: { px: { xs: 0 } } })}>
                        <Breadcrumbs separator={IconChevronRight} navigation={navigation} icon title rightAlign />
                        <Outlet />
                    </Container>
                )}
            </Main>
            {/*<Customization />*/}
        </Box>
    );
};

export default MainLayout;
