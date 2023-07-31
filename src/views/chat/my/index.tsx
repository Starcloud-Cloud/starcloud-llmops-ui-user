import styled from '@emotion/styled';
import { Box, Grid, Theme, useTheme } from '@mui/material';
import React from 'react';
import { appDrawerWidth as drawerWidth, gridSpacing } from 'store/constant';
import MainCard from 'ui-component/cards/MainCard';
import { Chat } from 'views/template/myChat/createChat/components/Chat';
import ChatDrawer from './ChatDrawer';

const Main = styled('main', { shouldForwardProp: (prop: string) => prop !== 'open' })(
    ({ theme, open }: { theme: Theme; open: boolean }) => ({
        flexGrow: 1,
        paddingLeft: open ? theme.spacing(3) : 0,
        transition: theme.transitions.create('margin', {
            easing: theme.transitions.easing.sharp,
            duration: theme.transitions.duration.shorter
        }),
        marginLeft: `-${drawerWidth}px`,
        [theme.breakpoints.down('lg')]: {
            paddingLeft: 0,
            marginLeft: 0
        },
        ...(open && {
            transition: theme.transitions.create('margin', {
                easing: theme.transitions.easing.easeOut,
                duration: theme.transitions.duration.shorter
            }),
            marginLeft: 0
        })
    })
);

const ChatMy = () => {
    const theme = useTheme();
    const [openChatDrawer, setOpenChatDrawer] = React.useState(true);
    const [chatBotInfo, setChatBotInfo] = React.useState({
        name: '1',
        avatar: '',
        introduction: '2'
    });

    const handleDrawerOpen = () => setOpenChatDrawer(true);

    return (
        <Box sx={{ display: 'flex' }}>
            <ChatDrawer openChatDrawer={openChatDrawer} handleDrawerOpen={handleDrawerOpen} setUser={() => null} />
            <Main theme={theme} open={openChatDrawer}>
                <Grid container spacing={gridSpacing}>
                    <Grid item xs zeroMinWidth>
                        <MainCard
                            sx={{
                                bgcolor: '#fff'
                            }}
                        >
                            <Chat chatBotInfo={chatBotInfo} />
                        </MainCard>
                    </Grid>
                </Grid>
            </Main>
        </Box>
    );
};

export default ChatMy;
