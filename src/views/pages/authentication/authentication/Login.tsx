import { Link } from 'react-router-dom';

// material-ui
import { Box, Grid, Stack, useMediaQuery } from '@mui/material';
import { useTheme } from '@mui/material/styles';

// project imports
import { AuthSliderProps } from 'types';
import Logo from 'ui-component/Logo';
import AuthFooter from 'ui-component/cards/AuthFooter';
import AuthSlider from 'ui-component/cards/AuthSlider';
import BackgroundPattern2 from 'ui-component/cards/BackgroundPattern2';
import { AuthLoginCardWrapper } from '../AuthCardWrapper';
import AuthWrapper2 from '../AuthWrapper2';
import AuthLogin from '../auth-forms/AuthLogin';
import { useEffect, useState } from 'react';
import infoStore from 'store/entitlementAction';

// assets
import imgMain from 'assets/images/auth/img-a2-login.svg';
// import imgMain from 'assets/images/auth/des.png';

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

// ================================|| AUTH2 - LOGIN ||================================ //

const Login = () => {
    const [open, setOpen] = useState(false);
    const theme = useTheme();
    const matchDownSM = useMediaQuery(theme.breakpoints.down('md'));
    const matchDownMD = useMediaQuery(theme.breakpoints.down('lg'));
    const { setuse } = infoStore();
    useEffect(() => {
        setuse({});
    }, []);
    return (
        <AuthWrapper2>
            <Grid container justifyContent={matchDownSM ? 'center' : 'space-between'} alignItems="center" className="relative">
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
                                <Box sx={{ display: { xs: 'block', md: 'none' } }}>
                                    <Logo />
                                </Box>
                                <AuthLoginCardWrapper border={matchDownMD} className="border rounded border-[#e0e0e098] border-solid">
                                    <Grid container spacing={2} justifyContent="center">
                                        <Grid item xs={12}>
                                            <AuthLogin />
                                        </Grid>
                                    </Grid>
                                </AuthLoginCardWrapper>
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
                            <Grid item xs={12} sx={{ position: 'relative' }}>
                                {/* <div className="relative" onClick={() => setOpen(true)}> */}
                                <div>
                                    {/* <svg
                                        className="absolute left-[50%] top-[50%] ml-[-24px] mt-[-24px] z-10 cursor-pointer"
                                        viewBox="0 0 1024 1024"
                                        version="1.1"
                                        xmlns="http://www.w3.org/2000/svg"
                                        p-id="1565"
                                        width="48"
                                        height="48"
                                    >
                                        <path
                                            d="M374.272 333.312v355.328c0 30.208 20.992 40.448 45.568 26.112l288.768-175.104c25.088-15.872 25.088-40.448 0-54.784L419.84 309.76c-7.68-5.12-14.336-6.656-20.992-6.656-14.336-2.56-24.576 9.216-24.576 30.208zM1024 512c0 282.624-229.376 512-512 512S0 794.624 0 512 229.376 0 512 0s512 229.376 512 512z"
                                            p-id="1566"
                                            fill="#8a8a8a"
                                        ></path>
                                    </svg> */}

                                    <img
                                        alt="Auth method"
                                        src={imgMain}
                                        style={{
                                            maxWidth: '100%',
                                            margin: '0 auto',
                                            display: 'block',
                                            width: 300,
                                            position: 'relative',
                                            zIndex: 5
                                            // cursor: 'pointer'
                                        }}
                                    />
                                </div>
                            </Grid>
                        </Grid>
                    </BackgroundPattern2>
                </Grid>

                {open && (
                    <>
                        <div className="fixed left-0 right-0 h-screen z-10 cursor-pointer" onClick={() => setOpen(false)}></div>
                        <video
                            className="absolute top-[23%] left-[22%] z-20"
                            controls
                            autoPlay
                            style={{
                                maxWidth: '960px',
                                width: '80%',
                                objectFit: 'fill'
                            }}
                            src={
                                'https://mofaai-others.oss-cn-hangzhou.aliyuncs.com/mofaai_web/%E9%AD%94%E6%B3%95ai%E5%AE%A3%E4%BC%A0%E7%89%87.mp4'
                            }
                        />
                    </>
                )}
            </Grid>
        </AuthWrapper2>
    );
};

export default Login;
