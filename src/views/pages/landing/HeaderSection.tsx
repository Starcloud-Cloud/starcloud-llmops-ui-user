import { Link as RouterLink } from 'react-router-dom';
import { useMemo } from 'react';

// material-ui
import { useTheme, styled } from '@mui/material/styles';
import { Box, Button, CardMedia, Container, Grid, Stack, Typography } from '@mui/material';

// third party
import { motion } from 'framer-motion';

// project imports
import AnimateButton from 'ui-component/extended/AnimateButton';
import useConfig from 'hooks/useConfig';

// assets
import PlayArrowIcon from '@mui/icons-material/PlayArrow';

import img1 from 'assets/images/landing/1.png';
import img2 from 'assets/images/landing/2.png';
import img3 from 'assets/images/landing/3.png';
import img4 from 'assets/images/landing/4.png';
import img5 from 'assets/images/landing/5.png';
import img6 from 'assets/images/landing/6.png';
import img7 from 'assets/images/landing/7.png';
import img8 from 'assets/images/landing/8.png';
import img9 from 'assets/images/landing/9.png';
// import TechLight from 'assets/images/landing/tech-light.svg';
// import TechDark from 'assets/images/landing/tech-dark.svg';
import dashboard from 'assets/images/landing/hero-dashboard.png';
import widget1 from 'assets/images/landing/hero-widget-1.png';
import widget2 from 'assets/images/landing/hero-widget-2.png';
import BgDark from 'assets/images/landing/bg-hero-block-dark.png';
import BgLight from 'assets/images/landing/bg-hero-block-light.png';
import { t } from 'hooks/web/useI18n';
import Slider from 'react-slick';

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

    const headerSX = { fontSize: { xs: '2rem', sm: '3rem', md: '3rem', lg: '3rem' } };

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

    return (
        <Container sx={{ height: '100vh', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
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
                                    <Typography textAlign={{ xs: 'center', md: 'left' }} variant="h1" sx={headerSX}>
                                        {t('homepage.title.slogan')}
                                    </Typography>

                                    <Typography
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
                                    </Typography>
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
                                    {t('homepage.title.spread')}
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
                                    <Grid item>
                                        <AnimateButton>
                                            <Button
                                                component={RouterLink}
                                                to="/dashboard/default"
                                                target="_blank"
                                                size="large"
                                                variant="contained"
                                                color="secondary"
                                                startIcon={<PlayArrowIcon />}
                                            >
                                                Live Preview
                                            </Button>
                                        </AnimateButton>
                                    </Grid>
                                </Grid>
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
                                    <CardMedia component="img" image={img2} alt="img2" sx={{ width: { xs: '8%', sm: '8%', md: '11%' } }} />
                                    <CardMedia component="img" image={img3} alt="img3" sx={{ width: { xs: '8%', sm: '8%', md: '11%' } }} />
                                    <CardMedia component="img" image={img4} alt="img4" sx={{ width: { xs: '8%', sm: '8%', md: '11%' } }} />
                                    <CardMedia component="img" image={img5} alt="img5" sx={{ width: { xs: '8%', sm: '8%', md: '11%' } }} />
                                    <CardMedia component="img" image={img6} alt="img6" sx={{ width: { xs: '8%', sm: '8%', md: '11%' } }} />
                                    <CardMedia component="img" image={img7} alt="img7" sx={{ width: { xs: '8%', sm: '8%', md: '11%' } }} />
                                    <CardMedia component="img" image={img8} alt="img8" sx={{ width: { xs: '8%', sm: '8%', md: '11%' } }} />
                                    <CardMedia component="img" image={img9} alt="img9" sx={{ width: { xs: '8%', sm: '8%', md: '11%' } }} />
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
