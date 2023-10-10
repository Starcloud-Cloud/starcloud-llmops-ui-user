import { ReactElement, cloneElement } from 'react';

// material-ui
import { Button, Container, AppBar as MuiAppBar, Stack, Toolbar, useScrollTrigger, useTheme } from '@mui/material';

// project imports
import Logo from 'ui-component/Logo';

// assets
import { Link as RouterLink, useNavigate } from 'react-router-dom';
import useAuth from 'hooks/useAuth';
import ProfileSection from 'layout/MainLayout/Header/ProfileSection';

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

export const VipBar = ({ ...others }) => {
    const navigate = useNavigate();
    const { isLoggedIn } = useAuth();
    return (
        <ElevationScroll {...others}>
            <MuiAppBar>
                <Container>
                    <Toolbar sx={{ display: 'flex', justifyContent: 'space-between', py: 2.5, px: `0 !important` }}>
                        <div className="cursor-pointer" onClick={() => navigate('/appMarket')}>
                            <Logo />
                        </div>
                        <Stack direction="row" sx={{ display: { xs: 'block', sm: 'block' } }} spacing={{ xs: 1.5, md: 2.5 }}>
                            {isLoggedIn ? (
                                <ProfileSection />
                            ) : (
                                <Button
                                    component={RouterLink}
                                    to="/login"
                                    target="_blank"
                                    disableElevation
                                    variant="contained"
                                    color="secondary"
                                >
                                    登录/注册
                                </Button>
                            )}
                        </Stack>
                    </Toolbar>
                </Container>
            </MuiAppBar>
        </ElevationScroll>
    );
};
