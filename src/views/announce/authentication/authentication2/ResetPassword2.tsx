import { Link, useLocation, useNavigate } from 'react-router-dom';

// material-ui
import { Box, Grid, Stack, Typography, useMediaQuery } from '@mui/material';
import { useTheme } from '@mui/material/styles';

// project imports
import { AuthSliderProps } from 'types';
import Logo from 'ui-component/Logo';
import AuthFooter from 'ui-component/cards/AuthFooter';
import AuthSlider from 'ui-component/cards/AuthSlider';
import BackgroundPattern2 from 'ui-component/cards/BackgroundPattern2';
import AuthCardWrapper from '../AuthCardWrapper';
import AuthWrapper2 from '../AuthWrapper2';
import AuthResetPassword from '../auth-forms/AuthResetPassword';

// assets
import imgMain from 'assets/images/auth/img-a2-resetpass.svg';
import { CheckIcon, ErrorIcon } from 'views/announce/authentication/auth-forms/AuthRegisterResult';
import { useEffect } from 'react';
import { verificationCode } from 'api/login';
import React from 'react';

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

// ============================|| AUTH2 - RESET PASSWORD ||============================ //

const ResetPassword = () => {
    const location = useLocation();
    const searchParams = new URLSearchParams(location.search);
    const code = searchParams.get('verificationCode');

    const theme = useTheme();
    const matchDownSM = useMediaQuery(theme.breakpoints.down('md'));
    const matchDownMD = useMediaQuery(theme.breakpoints.down('lg'));
    const [isSuccess, setIsSuccess] = React.useState(false);
    const [isFetch, setIsFetch] = React.useState(undefined);

    useEffect(() => {
        verificationCode(code).then((res: any) => {
            setIsSuccess(res.data);
        });
    }, []);

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
                            <Link to="#" aria-label="theme logo">
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
                                <Box component={Link} to="#" sx={{ display: { xs: 'block', md: 'none' } }}>
                                    <Logo />
                                </Box>
                                <AuthCardWrapper border={matchDownMD}>
                                    <Grid container spacing={2} justifyContent="center">
                                        {(isSuccess || isFetch) && (
                                            <Grid item xs={12}>
                                                <Stack alignItems="center" justifyContent="center" spacing={1}>
                                                    <Typography
                                                        color={theme.palette.secondary.main}
                                                        gutterBottom
                                                        variant={matchDownSM ? 'h3' : 'h2'}
                                                    >
                                                        重置密码
                                                    </Typography>
                                                    <Typography variant="caption" fontSize="16px" textAlign="center">
                                                        请选择你的新密码
                                                    </Typography>
                                                </Stack>
                                            </Grid>
                                        )}
                                        <Grid item xs={12}>
                                            {isFetch === undefined ? (
                                                isSuccess ? (
                                                    <AuthResetPassword setIsFetch={setIsFetch} />
                                                ) : (
                                                    <div className="h-[375px] flex justify-center text-center items-center text-base flex-col  gap-6">
                                                        <div className="bg-red-500 p-4 rounded-full w-[80px] h-[80px] flex justify-center items-center">
                                                            <ErrorIcon className="h-12 w-12 text-white" />
                                                        </div>
                                                        <h1 className="text-3xl font-bold">验证码失效</h1>
                                                        <p className="text-gray-500 dark:text-gray-400">
                                                            验证码失效, 请重新发送邮箱获取连接
                                                        </p>
                                                    </div>
                                                )
                                            ) : isFetch ? (
                                                <div className="h-[375px] flex justify-center text-center items-center text-base flex-col  gap-6">
                                                    <div className="bg-green-500 p-4 rounded-full w-[80px] h-[80px]">
                                                        <CheckIcon className="h-12 w-12 text-white" />
                                                    </div>
                                                    <h1 className="text-3xl font-bold">重置成功</h1>
                                                    <p className="text-gray-500 dark:text-gray-400">3s后跳转至登录页</p>
                                                </div>
                                            ) : (
                                                <div className="h-[375px] flex justify-center text-center items-center text-base flex-col  gap-6">
                                                    <div className="bg-red-500 p-4 rounded-full w-[80px] h-[80px]">
                                                        <ErrorIcon className="h-12 w-12 text-white" />
                                                    </div>
                                                    <h1 className="text-3xl font-bold">重置失败</h1>
                                                    <p className="text-gray-500 dark:text-gray-400">验证码失效, 请重新发送邮箱获取连接</p>
                                                </div>
                                            )}
                                        </Grid>
                                        {(!isSuccess || isFetch === false) && (
                                            <Grid item xs={12}>
                                                <Grid item container alignItems="center" justifyContent={'space-between'} xs={12}>
                                                    <Typography
                                                        component={Link}
                                                        to={'/'}
                                                        variant="subtitle1"
                                                        sx={{ textDecoration: 'none' }}
                                                    >
                                                        {'首页>'}
                                                    </Typography>
                                                    <Typography
                                                        component={Link}
                                                        to={'/login'}
                                                        variant="subtitle1"
                                                        sx={{ textDecoration: 'none' }}
                                                    >
                                                        {'登录>'}
                                                    </Typography>
                                                </Grid>
                                            </Grid>
                                        )}
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

export default ResetPassword;
