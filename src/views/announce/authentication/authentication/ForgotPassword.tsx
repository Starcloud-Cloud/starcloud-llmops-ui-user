import { Link } from 'react-router-dom';

// material-ui
import { useTheme } from '@mui/material/styles';
import { Box, Divider, Grid, Stack, Typography, useMediaQuery } from '@mui/material';

// project imports
import AuthWrapper2 from '../AuthWrapper2';
import AuthCardWrapper from '../AuthCardWrapper';
import Logo from 'ui-component/Logo';
import AuthForgotPassword from '../auth-forms/AuthForgotPassword';
import BackgroundPattern2 from 'ui-component/cards/BackgroundPattern2';
import AuthFooter from 'ui-component/cards/AuthFooter';
import AuthSlider from 'ui-component/cards/AuthSlider';
import { AuthSliderProps } from 'types';

// assets
import imgMain from 'assets/images/auth/img-a2-forgotpass.svg';
import { t } from 'hooks/web/useI18n';

// carousel items
const items: AuthSliderProps[] = [
    {
        title: '应用市场',
        description: '集成了300+跨境工作的预训练应用，10S生成文案'
    },
    {
        title: '自由绘图',
        description: '一步生成精美图片，快速抠图，提升图片质量'
    },
    {
        title: '定制机器人',
        description: '通过角色设定和学习素材，生成定制版机器人'
    }
];

// ============================|| AUTH2 - FORGOT PASSWORD ||============================ //

const ForgotPassword = () => {
    const theme = useTheme();
    const matchDownSM = useMediaQuery(theme.breakpoints.down('md'));
    const matchDownMD = useMediaQuery(theme.breakpoints.down('lg'));

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
                                    <Grid container spacing={2} justifyContent="center">
                                        <Grid item xs={12}>
                                            <Stack alignItems="center" justifyContent="center" spacing={1}>
                                                <Typography
                                                    color={theme.palette.secondary.main}
                                                    gutterBottom
                                                    variant={matchDownSM ? 'h3' : 'h2'}
                                                >
                                                    {t('auth.login.forgotpassword')}
                                                </Typography>
                                                <Typography variant="caption" fontSize="16px" textAlign="center">
                                                    {t('auth.login.requirepassword')}
                                                </Typography>
                                            </Stack>
                                        </Grid>
                                        <Grid item xs={12}>
                                            <AuthForgotPassword />
                                        </Grid>
                                        <Grid item xs={12}>
                                            <Divider />
                                        </Grid>
                                        <Grid item xs={12}>
                                            <Grid item container direction="column" alignItems="center" xs={12}>
                                                <Typography
                                                    component={Link}
                                                    to="/login"
                                                    variant="subtitle1"
                                                    sx={{ textDecoration: 'none' }}
                                                >
                                                    {t('auth.register.tologin')}
                                                </Typography>
                                            </Grid>
                                        </Grid>
                                    </Grid>
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
                                    style={{ maxWidth: '100%', margin: '0 auto', display: 'block', width: 300 }}
                                />
                            </Grid>
                        </Grid>
                    </BackgroundPattern2>
                </Grid>
            </Grid>
        </AuthWrapper2>
    );
};

export default ForgotPassword;
