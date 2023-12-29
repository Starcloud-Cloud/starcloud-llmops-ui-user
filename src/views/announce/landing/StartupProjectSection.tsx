// material-ui
import { styled, useTheme } from '@mui/material/styles';
import { Box, Container, Stack, Typography } from '@mui/material';

// third-party
import Slider from 'react-slick';

// assets
import BackgroundImag from 'assets/images/landing/bg-heand.png';
import { t } from 'hooks/web/useI18n';

// styles
const HeaderAnimationImage = styled('img')({
    maxWidth: '100%',
    filter: 'drop-shadow(0px 0px 50px rgb(33 150 243 / 30%))'
});

// =============================|| LANDING - STARTUP PROJECT ||============================= //

const RtlInfoSection = () => {
    const theme = useTheme();
    const settings = {
        className: 'center',
        dots: false,
        arrows: false,
        centerPadding: '0',
        centerMode: true,
        slidesToShow: 4,
        slidesToScroll: 1,
        vertical: true,
        verticalSwiping: true,
        focusOnSelect: true,
        autoplay: true,
        autoplaySpeed: 2000
    };

    return (
        <Box
            className="project-info"
            sx={{
                bgcolor: 'dark.900',
                height: { xs: 200, md: 340, lg: 450, xl: 520 },
                overflow: 'hidden',
                position: 'relative'
            }}
        >
            <Container sx={{ position: 'relative', zIndex: 1 }}>
                <Box sx={{ mt: { xs: 4, md: 6, lg: 12, xl: 15 }, zIndex: 2 }}>
                    <Stack
                        direction="row"
                        alignItems="center"
                        justifyContent="flex-start"
                        spacing={2}
                        sx={{
                            '& .slick-current': {
                                '.MuiTypography-root': { color: theme.palette.primary.main }
                            },
                            '& .slick-slider': {
                                textAlign: 'left',
                                '.MuiTypography-root': {
                                    fontSize: { xs: '1.3rem', md: '2.5rem', xl: '3.125rem' },
                                    cursor: 'pointer'
                                }
                            }
                        }}
                    >
                        <Box
                            sx={{
                                marginTop: { sm: '5%', lg: '4%' },
                                width: { xs: '38%', md: '100%' },
                                paddingLeft: { xs: 2, md: 0, xl: 0 }
                            }}
                        >
                            <Typography
                                variant="h2"
                                sx={{
                                    color: '#fff',
                                    textAlign: 'center',
                                    width: { xs: '90px', sm: 'max-content', xl: 'max-content' },
                                    fontSize: { xs: '1.2rem', md: '2.5rem', xl: '3.125rem' }
                                }}
                            >
                                {t('homepage.startup.pro')}
                            </Typography>
                        </Box>
                        <Slider {...settings}>
                            <Typography color="text.hint" variant="h2">
                                {t('homepage.startup.pro1')}
                            </Typography>
                            <Typography color="text.hint" variant="h2">
                                {t('homepage.startup.pro2')}
                            </Typography>
                            <Typography color="text.hint" variant="h2">
                                {t('homepage.startup.pro3')}
                            </Typography>
                            <Typography color="text.hint" variant="h2">
                                {t('homepage.startup.pro4')}
                            </Typography>
                            <Typography color="text.hint" variant="h2">
                                {t('homepage.startup.pro5')}
                            </Typography>
                            <Typography color="text.hint" variant="h2">
                                {t('homepage.startup.pro6')}
                            </Typography>
                        </Slider>
                    </Stack>
                </Box>
            </Container>
            <HeaderAnimationImage
                src={BackgroundImag}
                alt="Berry"
                sx={{
                    position: 'absolute',
                    filter: 'none',
                    bottom: { sm: -40, md: -80 },
                    right: { sm: 30, md: 50, lg: 80 },
                    width: { xl: 240, lg: 220, md: 150, sm: 100, xs: 0 }
                }}
            />
        </Box>
    );
};

export default RtlInfoSection;
