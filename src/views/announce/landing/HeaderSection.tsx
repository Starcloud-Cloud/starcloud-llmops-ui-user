import { Link as RouterLink, useNavigate } from 'react-router-dom';
import { useEffect, useMemo, useState } from 'react';

// material-ui
import { useTheme, styled } from '@mui/material/styles';
import { Box, Button, CardMedia, Container, Grid, Stack, Typography } from '@mui/material';
import { Image, Divider } from 'antd';

// third party
import { motion } from 'framer-motion';

// project imports
import AnimateButton from 'ui-component/extended/AnimateButton';
import useConfig from 'hooks/useConfig';

// assets
import StarIcon from '@mui/icons-material/Star';

import img1 from 'assets/images/landing/1.png';
import img2 from 'assets/images/landing/2.png';
import img3 from 'assets/images/landing/3.png';
import img4 from 'assets/images/landing/4.png';
import img5 from 'assets/images/landing/5.png';
import img6 from 'assets/images/landing/6.png';
import img7 from 'assets/images/landing/7.png';
import img8 from 'assets/images/landing/8.png';
import img9 from 'assets/images/landing/9.png';
import vodeo from 'assets/images/landing/视频号.svg';
import bili from 'assets/images/landing/哔哩哔哩.svg';
import kuai from 'assets/images/landing/快手.svg';
import iosFill from 'assets/images/landing/ios.svg';
import windowsFill from 'assets/images/landing/windows-fill.svg';
import downArrow from 'assets/images/landing/down-arrow.gif';
// import TechLight from 'assets/images/landing/tech-light.svg';
// import TechDark from 'assets/images/landing/tech-dark.svg';
import dashboard from 'assets/images/landing/hero-dashboard.png';
import widget1 from 'assets/images/landing/hero-widget-1.png';
import widget2 from 'assets/images/landing/hero-widget-2.png';
import BgDark from 'assets/images/landing/bg-hero-block-dark.png';
import BgLight from 'assets/images/landing/bg-hero-block-light.png';
import { t } from 'hooks/web/useI18n';
import Slider from 'react-slick';
import useRouteStore from 'store/router';
import { DASHBOARD_PATH } from 'config';
import { format } from 'date-fns';
import dayjs from 'dayjs';
import useAuth from 'hooks/useAuth';

// styles
const HeaderImage = styled('img')(({ theme }) => ({
    maxWidth: '100%',
    borderRadius: 20,
    transform: 'scale(1.7)',
    transformOrigin: theme.direction === 'rtl' ? '100% 50%' : '0 50%',
    [theme.breakpoints.down('xl')]: {
        transform: 'scale(1.5)'
    },
    [theme.breakpoints.down('lg')]: {
        transform: 'scale(1.2)'
    }
}));

const HeaderAnimationImage = styled('img')({
    maxWidth: '100%',
    filter: 'drop-shadow(0px 0px 50px rgb(33 150 243 / 30%))'
});

// ==============================|| LANDING - HEADER PAGE ||============================== //

const HeaderSection = () => {
    const theme = useTheme();
    const { rtlLayout } = useConfig();
    const navigate = useNavigate();
    const { setRoutesIndex } = useRouteStore((state) => state);
    const settings = {
        className: 'center',
        dots: false,
        arrows: false,
        centerPadding: '0',
        centerMode: true,
        slidesToShow: 1,
        slidesToScroll: 1,
        vertical: true,
        verticalSwiping: true,
        focusOnSelect: true,
        autoplay: true,
        autoplaySpeed: 2000
    };
    const [version, setVersion] = useState('');
    const [macDownload, setMacDownload] = useState('');
    const [releaseDate, setReleaseDate] = useState('');
    const [winDownload, setWinDownload] = useState('');
    const { isLoggedIn } = useAuth();

    const handleScroll = () => {
        window.scrollTo(0, window.innerHeight - 80);
    };

    console.log(releaseDate, 'releaseDate');
    const headerSX = { fontSize: { xs: '1rem', sm: '2rem', md: '2rem', lg: '2rem' } };

    const HeaderAnimationImagememo = useMemo(
        () => (
            <HeaderAnimationImage
                src={theme.palette.mode === 'dark' ? BgDark : BgLight}
                alt="Berry"
                sx={{
                    display: { xs: 'none', md: 'flex' },
                    position: 'absolute',
                    filter: 'none',
                    bottom: { md: 0 },
                    right: 0,
                    width: '50%',
                    transformOrigin: '50% 50%',
                    transform: rtlLayout ? 'rotateY(180deg)' : 'rotateY(0deg)'
                }}
            />
        ),
        [rtlLayout, theme]
    );

    useEffect(() => {
        (async () => {
            const response = await fetch(`${process.env.REACT_APP_MOFA_PUSH_CLIENT_URL}/latest-mac.yml`);
            const responseWin = await fetch(`${process.env.REACT_APP_MOFA_PUSH_CLIENT_URL}/latest.yml`);
            const text = await response.text();
            const winText = await responseWin.text();
            let match = text.match(/url: (https?:\/\/[^\s]+)/g);
            let winMatch = winText.match(/url: (https?:\/\/[^\s]+)/g);
            let secondUrl = match && match[0].replace('url: ', '');
            let winSecondUrl = winMatch && winMatch[0].replace('url: ', '');
            if (secondUrl) {
                setMacDownload(secondUrl);
            }
            if (winSecondUrl) {
                setWinDownload(winSecondUrl);
            }
            let matchVersion = text.match(/version: ([^\s]+)/);
            let version = matchVersion && matchVersion[1];
            if (version) {
                setVersion(version);
            }
            let matchReleaseDate = text.match(/releaseDate: '([^']+)/);
            let releaseDate = matchReleaseDate && matchReleaseDate[1];
            if (releaseDate) {
                setReleaseDate(releaseDate);
            }
        })();
    }, []);

    const macClientDownload = async () => {
        if (!isLoggedIn) {
            navigate('/login');
            return;
        }
        window.open(macDownload);
    };

    const winClientDownload = async () => {
        if (!isLoggedIn) {
            navigate('/login');
            return;
        }
        window.open(winDownload);
    };

    return (
        <Container sx={{ height: '80vh', display: 'flex', justifyContent: 'center', alignItems: 'center', position: 'relative' }}>
            <Grid
                container
                justifyContent="space-between"
                alignItems="center"
                sx={{ mt: { xs: 10, sm: 6, md: 18.75 }, mb: { xs: 2.5, md: 10 } }}
            >
                <Grid item xs={12} md={5}>
                    <Grid container spacing={5}>
                        <Grid item xs={12}>
                            <motion.div
                                initial={{ opacity: 0, translateY: 550 }}
                                animate={{ opacity: 1, translateY: 0 }}
                                transition={{ type: 'spring', stiffness: 150, damping: 30 }}
                            >
                                <Stack spacing={2}>
                                    <Typography textAlign={{ xs: 'center', md: 'left' }} variant="h2" sx={headerSX}>
                                        {/* {t('homepage.title.slogan')} */}
                                        多平台多账号
                                    </Typography>
                                    <Typography textAlign={{ xs: 'center', md: 'left' }} variant="h2" sx={headerSX}>
                                        AI内容创作运营工具
                                    </Typography>
                                    {/* <Typography fontWeight={400} textAlign={{ xs: 'center', md: 'left' }} variant="h2">
                                        免费下载使用
                                    </Typography> */}

                                    {/* <Typography
                                        textAlign={{ xs: 'center', md: 'left' }}
                                        variant="h2"
                                        color="primary"
                                        sx={{
                                            '& .slick-current': {
                                                '.MuiTypography-root': { color: theme.palette.primary.main }
                                            },
                                            '& .slick-slider': {
                                                '.MuiTypography-root': {
                                                    fontSize: { xs: '1.5rem', sm: '1.5rem', md: '1.5rem', lg: '1.5rem' },
                                                    cursor: 'pointer'
                                                }
                                            }
                                        }}
                                    >
                                        <Slider {...settings}>
                                            <div>
                                                <Typography color="text.hint" variant="h2">
                                                    {t('homepage.title.pro1')}
                                                </Typography>
                                            </div>
                                            <div>
                                                <Typography color="text.hint" variant="h2">
                                                    {t('homepage.title.pro2')}
                                                </Typography>
                                            </div>
                                            <div>
                                                <Typography color="text.hint" variant="h2">
                                                    {t('homepage.title.pro3')}
                                                </Typography>
                                            </div>
                                            <div>
                                                <Typography color="text.hint" variant="h2">
                                                    {t('homepage.title.pro1')}
                                                </Typography>
                                            </div>
                                            <div>
                                                <Typography color="text.hint" variant="h2">
                                                    {t('homepage.title.pro2')}
                                                </Typography>
                                            </div>
                                            <div>
                                                <Typography color="text.hint" variant="h2">
                                                    {t('homepage.title.pro3')}
                                                </Typography>
                                            </div>
                                        </Slider>
                                    </Typography> */}
                                </Stack>
                            </motion.div>
                        </Grid>
                        <Grid item xs={12} sx={{ mt: -2.5, textAlign: { xs: 'center', md: 'left' } }}>
                            <motion.div
                                initial={{ opacity: 0, translateY: 550 }}
                                animate={{ opacity: 1, translateY: 0 }}
                                transition={{ type: 'spring', stiffness: 150, damping: 30, delay: 0.2 }}
                            >
                                <Typography
                                    textAlign={{ xs: 'center', md: 'left' }}
                                    color="text.primary"
                                    variant="body1"
                                    sx={{ fontSize: { xs: '1rem', md: '1.125rem' } }}
                                >
                                    {/* {t('homepage.title.spread')} */}
                                    主流内容创作平台多账号登录，多模态 AI 生成，作品一键分发，数据综合分析
                                </Typography>
                            </motion.div>
                        </Grid>
                        <Grid item xs={12}>
                            <motion.div
                                initial={{ opacity: 0, translateY: 550 }}
                                animate={{ opacity: 1, translateY: 0 }}
                                transition={{ type: 'spring', stiffness: 150, damping: 30, delay: 0.4 }}
                            >
                                <Grid container spacing={2} sx={{ justifyContent: { xs: 'center', md: 'flex-start' } }}>
                                    <Grid item className="flex gap-4">
                                        {/* <AnimateButton> */}
                                        {/* <Button
                                                onClick={() => {
                                                    navigate(DASHBOARD_PATH);
                                                    setRoutesIndex(0);
                                                }}
                                                variant="contained"
                                                size="large"
                                                color="secondary"
                                                startIcon={<StarIcon />}
                                            >
                                                开始免费创作
                                            </Button> */}
                                        <div className="flex w-[175px] h-[50px] rounded-[50px] bg-[#673ab7] text-[16px] text-[#fff] items-center justify-center cursor-pointer">
                                            <Image width={20} src={windowsFill} preview={false} />
                                            <div className="ml-[5px] mt-[4px]" onClick={() => winClientDownload()}>
                                                Windows 下载
                                            </div>
                                        </div>
                                        <div
                                            className="flex w-[175px] h-[50px] rounded-[50px] bg-[#673ab7] text-[16px] text-[#fff] items-center justify-center cursor-pointer"
                                            onClick={() => macClientDownload()}
                                        >
                                            <Image width={20} src={iosFill} preview={false} />
                                            <div className="ml-[5px] mt-[4px]">MacOS 下载</div>
                                        </div>
                                        {/* <Button
                                                onClick={() => {
                                                    navigate(DASHBOARD_PATH);
                                                    setRoutesIndex(0);
                                                }}
                                                variant="contained"
                                                color="secondary"
                                                startIcon={<StarIcon />}
                                            >
                                                Windows 下载
                                            </Button> */}
                                        {/* </AnimateButton> */}
                                    </Grid>
                                </Grid>
                                <div className="text-[14px] text-[#000]/50 mt-[20px]">
                                    版本：{version}
                                    <Divider type="vertical" /> 更新：{dayjs(releaseDate).format('YYYY-MM-DD')}
                                    <Divider type="vertical" />
                                    适应系统：Win7以上 / Mac
                                </div>
                            </motion.div>
                        </Grid>
                        <Grid item xs={12}>
                            <motion.div
                                initial={{ opacity: 0, translateY: 550 }}
                                animate={{ opacity: 1, translateY: 0 }}
                                transition={{ type: 'spring', stiffness: 150, damping: 30, delay: 0.6 }}
                            >
                                <Stack direction="row" spacing={2} alignItems="center" justifyContent={{ xs: 'center', md: 'flex-start' }}>
                                    <CardMedia component="img" image={img1} alt="img1" sx={{ width: { xs: '8%', sm: '8%', md: '11%' } }} />
                                    {/* <CardMedia component="img" image={img2} alt="img2" sx={{ width: { xs: '8%', sm: '8%', md: '11%' } }} /> */}
                                    <CardMedia component="img" image={img3} alt="img3" sx={{ width: { xs: '8%', sm: '8%', md: '11%' } }} />
                                    <CardMedia component="img" image={vodeo} alt="img4" sx={{ width: { xs: '7%', sm: '7%', md: '10%' } }} />
                                    <CardMedia component="img" image={bili} alt="bili" sx={{ width: { xs: '6%', sm: '6%', md: '9%' } }} />
                                    <CardMedia component="img" image={kuai} alt="kuai" sx={{ width: { xs: '6%', sm: '6%', md: '9%' } }} />
                                    {/* <CardMedia component="img" image={img4} alt="img4" sx={{ width: { xs: '8%', sm: '8%', md: '11%' } }} />
                                    <CardMedia component="img" image={img5} alt="img5" sx={{ width: { xs: '8%', sm: '8%', md: '11%' } }} />
                                    <CardMedia component="img" image={img6} alt="img6" sx={{ width: { xs: '8%', sm: '8%', md: '11%' } }} />
                                    <CardMedia component="img" image={img7} alt="img7" sx={{ width: { xs: '8%', sm: '8%', md: '11%' } }} />
                                    <CardMedia component="img" image={img8} alt="img8" sx={{ width: { xs: '8%', sm: '8%', md: '11%' } }} />
                                    <CardMedia component="img" image={img9} alt="img9" sx={{ width: { xs: '8%', sm: '8%', md: '11%' } }} /> */}
                                </Stack>
                            </motion.div>
                        </Grid>
                    </Grid>
                </Grid>
                <Grid item xs={12} md={7} sx={{ display: { xs: 'none', md: 'flex' } }}>
                    <Box sx={{ position: 'relative', mt: 8.75, zIndex: 9 }}>
                        <HeaderImage src={dashboard} alt="Berry" />
                        <Box
                            sx={{
                                position: 'absolute',
                                top: { md: -35, lg: -110 },
                                right: theme.direction === 'rtl' ? 170 : { md: -50, lg: -140, xl: -220 },
                                width: { md: 220, lg: 290 },
                                animation: '10s slideY linear infinite'
                            }}
                        >
                            <motion.div
                                initial={{ opacity: 0, scale: 0 }}
                                animate={{ opacity: 1, scale: 1 }}
                                transition={{ type: 'spring', stiffness: 150, damping: 30, delay: 0.2 }}
                            >
                                <HeaderAnimationImage src={widget1} alt="Berry" />
                            </motion.div>
                        </Box>
                        <Box
                            sx={{
                                position: 'absolute',
                                bottom: { md: -20, lg: -90 },
                                left: { md: 100, lg: 300 },
                                width: { md: 220, lg: 280 },
                                animation: '10s slideY linear infinite',
                                animationDelay: '2s'
                            }}
                        >
                            <motion.div
                                initial={{ opacity: 0, scale: 0 }}
                                animate={{ opacity: 1, scale: 1 }}
                                transition={{ type: 'spring', stiffness: 150, damping: 30, delay: 0.4 }}
                            >
                                <HeaderAnimationImage src={widget2} alt="Berry" />
                            </motion.div>
                        </Box>
                    </Box>
                    {HeaderAnimationImagememo}
                </Grid>
            </Grid>
        </Container>
    );
};

export default HeaderSection;
