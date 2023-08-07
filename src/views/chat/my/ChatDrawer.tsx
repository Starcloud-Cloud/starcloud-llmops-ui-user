import { useState } from 'react';

// material-ui
import { Box, Drawer, useMediaQuery } from '@mui/material';
import { useTheme } from '@mui/material/styles';

// third-party
import PerfectScrollbar from 'react-perfect-scrollbar';

// project imports
import useAuth from 'hooks/useAuth';
import { appDrawerWidth as drawerWidth } from 'store/constant';
import { UserProfile } from 'types/user-profile';
import MainCard from 'ui-component/cards/MainCard';
import UserList from './UserList';

// assets
import useConfig from 'hooks/useConfig';

// ==============================|| CHAT DRAWER ||============================== //

interface ChatDrawerProps {
    handleDrawerOpen: () => void;
    openChatDrawer: boolean | undefined;
    setUser: (u: UserProfile) => void;
}

const ChatDrawer = ({ handleDrawerOpen, openChatDrawer, setUser }: ChatDrawerProps) => {
    const theme = useTheme();

    const { user } = useAuth();
    const { borderRadius } = useConfig();
    const matchDownLG = useMediaQuery(theme.breakpoints.down('lg'));

    // show menu to set current user status
    const [anchorEl, setAnchorEl] = useState<Element | ((element: Element) => Element) | null | undefined>();
    const handleClickRightMenu = (event: React.MouseEvent<HTMLButtonElement> | undefined) => {
        setAnchorEl(event?.currentTarget);
    };

    const handleCloseRightMenu = () => {
        setAnchorEl(null);
    };

    // set user status on status menu click
    const [status, setStatus] = useState('available');
    const handleRightMenuItemClick = (userStatus: string) => () => {
        setStatus(userStatus);
        handleCloseRightMenu();
    };

    const drawerBG = theme.palette.mode === 'dark' ? 'dark.main' : 'grey.50';

    return (
        <Drawer
            sx={{
                width: drawerWidth,
                flexShrink: 0,
                zIndex: { xs: 1100, lg: 0 },
                '& .MuiDrawer-paper': {
                    height: matchDownLG ? '100%' : 'auto',
                    width: drawerWidth,
                    boxSizing: 'border-box',
                    position: 'relative',
                    border: 'none',
                    borderRadius: matchDownLG ? 'none' : `${borderRadius}px`
                }
            }}
            variant={matchDownLG ? 'temporary' : 'persistent'}
            anchor="left"
            open={openChatDrawer}
            ModalProps={{ keepMounted: true }}
            onClose={handleDrawerOpen}
        >
            {openChatDrawer && (
                <MainCard
                    sx={{
                        bgcolor: '#FFF'
                    }}
                    border={!matchDownLG}
                    content={false}
                >
                    <PerfectScrollbar
                        style={{
                            overflowX: 'hidden',
                            height: matchDownLG ? 'calc(100vh - 190px)' : 'calc(100vh - 445px)',
                            minHeight: matchDownLG ? 0 : 520
                        }}
                    >
                        <Box sx={{ p: 3, pt: 0 }}>
                            <UserList setUser={setUser} />
                        </Box>
                    </PerfectScrollbar>
                </MainCard>
            )}
        </Drawer>
    );
};

export default ChatDrawer;
