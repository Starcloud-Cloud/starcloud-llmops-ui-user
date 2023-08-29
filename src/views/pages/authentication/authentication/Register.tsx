import { Link } from 'react-router-dom';

// material-ui
import { Box, Divider, Grid, Stack, Typography, useMediaQuery } from '@mui/material';
import MuiTooltip from '@mui/material/Tooltip';
import { useTheme } from '@mui/material/styles';

// project imports
import { useLocation } from 'react-router-dom';
import { AuthSliderProps } from 'types';
import Logo from 'ui-component/Logo';
import AuthFooter from 'ui-component/cards/AuthFooter';
import AuthSlider from 'ui-component/cards/AuthSlider';
import BackgroundPattern2 from 'ui-component/cards/BackgroundPattern2';
import AuthCardWrapper from '../AuthCardWrapper';
import AuthWrapper2 from '../AuthWrapper2';
import AuthRegister from '../auth-forms/AuthRegister';
import AuthLoginRegister from '../auth-forms/AuthLoginRegister';

// assets
import imgMain from 'assets/images/auth/img-a2-signup.svg';
import shouji from 'assets/images/register/shouji.svg';
import youxiang from 'assets/images/register/youxiang.svg';
import { t } from 'hooks/web/useI18n';
import { useEffect, useState } from 'react';

// carousel items
const items: AuthSliderProps[] = [
    {
        title: '海量优质模板',
        description: '300+模板免费使用'
    },
    {
        title: 'AI文案一键生成',
        description: '10秒生成专业文案'
    },
    {
        title: '自定义AI模板',
        description: '可以创建自己的AI模板,分享给好友使用'
    }
];

// ===============================|| AUTH2 - REGISTER ||=============================== //

const Register = () => {
    const theme = useTheme();
    const location = useLocation();
    const query = new URLSearchParams(location.search);
    const urlInviteCode = query.get('q');

    const [inviteCode, setInviteCode] = useState('');

    // 获取存储在localStorage的inviteCode及其过期时间
    useEffect(() => {
        const storedInviteCode = localStorage.getItem('inviteCode');
        const inviteCodeExpiry = localStorage.getItem('inviteCodeExpiry');

        // 如果url中没有inviteCode，且localStorage中的inviteCode未过期，那么使用localStorage中的inviteCode
        if (!urlInviteCode && storedInviteCode && inviteCodeExpiry && new Date().getTime() < Number(inviteCodeExpiry)) {
            setInviteCode(storedInviteCode);
        }
        // 如果url中有inviteCode，那么使用url中的inviteCode，并更新localStorage
        else if (urlInviteCode) {
            const currentTime = new Date().getTime();
            const expiryTime = currentTime + 24 * 60 * 60 * 1000; // 24 hours from now
            localStorage.setItem('inviteCode', urlInviteCode);
            localStorage.setItem('inviteCodeExpiry', expiryTime.toString());
            setInviteCode(urlInviteCode);
        }
    }, [urlInviteCode]);
    const matchDownSM = useMediaQuery(theme.breakpoints.down('md'));
    const matchDownMD = useMediaQuery(theme.breakpoints.down('lg'));

    //手机号或者邮箱注册
    const [open, setOpen] = useState(false);
    return (
        <AuthWrapper2>
            <Grid container justifyContent={matchDownSM ? 'center' : 'space-between'} alignItems="center">
                <Grid item md={6} lg={7} xs={12} sx={{ minHeight: '100vh' }}>
                    <Grid
                        sx={{ minHeight: '100vh' }}
                        container
                        alignItems={matchDownSM ? 'center' : 'flex-start'}
                        justifyContent={matchDownSM ? 'center' : 'space-between'}
                    >
                        <Grid item sx={{ display: { xs: 'none', md: 'block' }, m: 3 }}>
                            <Link to="/" aria-label="theme logo" style={{ textDecoration: 'none' }}>
                                <Logo />
                            </Link>
                        </Grid>
                        <Grid
                            item
                            xs={12}
                            container
                            justifyContent="center"
                            alignItems="center"
                            sx={{ minHeight: { xs: 'calc(100vh - 68px)', md: 'calc(100vh - 152px)' } }}
                        >
                            <Stack justifyContent="center" alignItems="center" spacing={5} m={2}>
                                <Box component={Link} to="#" sx={{ display: { xs: 'block', md: 'none' }, textDecoration: 'none' }}>
                                    <Logo />
                                </Box>
                                <AuthCardWrapper border={matchDownMD}>
                                    <Box position="relative">
                                        <div className="right-[0] top-[0]  absolute cursor-pointer" onClick={() => setOpen(!open)}>
                                            {!open ? (
                                                <MuiTooltip title="邮箱注册~" arrow placement="top">
                                                    <Box
                                                        position="relative"
                                                        width="52px"
                                                        height="52px"
                                                        overflow="hidden"
                                                        sx={{
                                                            '&::before': {
                                                                content: '""',
                                                                position: 'absolute',
                                                                bottom: 0,
                                                                left: 0,
                                                                width: 0,
                                                                height: 0,
                                                                borderStyle: 'solid',
                                                                borderWidth: '20px',
                                                                borderColor: 'transparent transparent #fff #fff'
                                                            }
                                                        }}
                                                    >
                                                        <img src={youxiang} alt="emall" className="w-[52px]" style={{ display: 'block' }} />
                                                    </Box>
                                                </MuiTooltip>
                                            ) : (
                                                <MuiTooltip title="手机号注册~" arrow placement="top">
                                                    <Box
                                                        position="relative"
                                                        width="52px"
                                                        height="52px"
                                                        overflow="hidden"
                                                        sx={{
                                                            '&::before': {
                                                                content: '""',
                                                                position: 'absolute',
                                                                bottom: 0,
                                                                left: 0,
                                                                width: 0,
                                                                height: 0,
                                                                borderStyle: 'solid',
                                                                borderWidth: '20px',
                                                                borderColor: 'transparent transparent #fff #fff'
                                                            }
                                                        }}
                                                    >
                                                        <img src={shouji} alt="phone" className="w-[52px]" />
                                                    </Box>
                                                </MuiTooltip>
                                            )}
                                        </div>
                                        <Grid container spacing={2} justifyContent="center">
                                            <Grid item xs={12}>
                                                <Stack alignItems="center" justifyContent="center" spacing={1}>
                                                    <Typography
                                                        color={theme.palette.secondary.main}
                                                        gutterBottom
                                                        variant={matchDownSM ? 'h3' : 'h2'}
                                                    >
                                                        {t('auth.register.signup')}
                                                    </Typography>
                                                    <Typography
                                                        variant="caption"
                                                        fontSize="16px"
                                                        textAlign={matchDownSM ? 'center' : 'inherit'}
                                                    >
                                                        {t('auth.login.credentials')}
                                                    </Typography>
                                                </Stack>
                                            </Grid>
                                            <Grid item xs={12}>
                                                {open && <AuthRegister inviteCode={inviteCode} />}
                                                {!open && <AuthLoginRegister inviteCode={inviteCode} />}
                                            </Grid>
                                            <Grid item xs={12}>
                                                <Divider />
                                            </Grid>
                                            <Grid item xs={12}>
                                                <Grid item container direction="column" alignItems="center" xs={12}>
                                                    <Typography
                                                        component={Link}
                                                        to={inviteCode ? `/login?q=${inviteCode}` : '/login'}
                                                        variant="subtitle1"
                                                        sx={{ textDecoration: 'none' }}
                                                    >
                                                        {t('auth.register.tologin')}
                                                    </Typography>
                                                </Grid>
                                            </Grid>
                                        </Grid>
                                    </Box>
                                </AuthCardWrapper>
                            </Stack>
                        </Grid>
                        <Grid item xs={12} sx={{ m: 3 }}>
                            <AuthFooter />
                        </Grid>
                    </Grid>
                </Grid>
                <Grid item md={6} lg={5} sx={{ position: 'relative', alignSelf: 'stretch', display: { xs: 'none', md: 'block' } }}>
                    <BackgroundPattern2>
                        <Grid item container justifyContent="center">
                            <Grid item xs={12}>
                                <Grid item container justifyContent="center" sx={{ pb: 8 }}>
                                    <Grid item xs={10} lg={8} sx={{ '& .slick-list': { pb: 2 } }}>
                                        <AuthSlider items={items} />
                                    </Grid>
                                </Grid>
                            </Grid>
                            <Grid item xs={12}>
                                <img
                                    alt="Auth method"
                                    src={imgMain}
                                    style={{
                                        maxWidth: '100%',
                                        margin: '0 auto',
                                        display: 'block',
                                        width: 300
                                    }}
                                />
                            </Grid>
                        </Grid>
                    </BackgroundPattern2>
                </Grid>
            </Grid>
        </AuthWrapper2>
    );
};

export default Register;
