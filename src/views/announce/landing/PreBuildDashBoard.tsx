import { Link } from 'react-router-dom';

// material-ui
import { styled, useTheme } from '@mui/material/styles';
import { Box, Grid, IconButton, Typography, Stack, useMediaQuery } from '@mui/material';

// third-party
import { Carousel } from 'react-responsive-carousel';

// assets
import { IconChevronRight, IconChevronLeft, IconLink } from '@tabler/icons';

// import SliderLight1 from 'assets/images/landing/pre-apps/slider-light-1.png';
// import SliderDark1 from 'assets/images/landing/pre-apps/slider-dark-1.png';
// import SliderLight2 from 'assets/images/landing/pre-apps/slider-light-2.png';
// import SliderDark2 from 'assets/images/landing/pre-apps/slider-dark-2.png';
// import SliderLight3 from 'assets/images/landing/pre-apps/slider-light-3.png';
// import SliderDark3 from 'assets/images/landing/pre-apps/slider-dark-3.png';
// import SliderLight4 from 'assets/images/landing/pre-apps/slider-light-4.png';
// import SliderDark4 from 'assets/images/landing/pre-apps/slider-dark-4.png';
// import SliderLight5 from 'assets/images/landing/pre-apps/slider-light-5.png';
// import SliderDark5 from 'assets/images/landing/pre-apps/slider-dark-5.png';
// import SliderLight6 from 'assets/images/landing/pre-apps/slider-light-6.png';
// import SliderDark6 from 'assets/images/landing/pre-apps/slider-dark-6.png';

import market from 'assets/images/landing/pre-apps/market.jpg';
import amzon from 'assets/images/landing/pre-apps/amzon.jpg';
import site from 'assets/images/landing/pre-apps/site.jpg';
import social from 'assets/images/landing/pre-apps/social.jpg';
import template from 'assets/images/landing/pre-apps/template.jpg';

// styles
const Images = styled('img')({
    width: '100%',
    height: 'auto',
    marginBottom: 32,
    backgroundSize: 'cover',
    objectFit: 'cover'
});

function SampleNextArrow(props: any) {
    const theme = useTheme();
    const { onClickHandler } = props;

    return (
        <IconButton
            onClick={onClickHandler}
            sx={{
                position: 'absolute',
                zIndex: 2,
                top: 'calc(50% - 70px)',
                cursor: 'pointer',
                background: `${theme.palette.background.paper} !important`,
                width: { xs: '40px !important', xl: '65px !important' },
                height: { xs: '40px !important', xl: '65px !important' },
                boxShadow: '0px 24px 38px rgba(9, 15, 37, 0.07)',
                '&:after': {
                    content: '""',
                    position: 'absolute',
                    top: 0,
                    left: 0,
                    bottom: 0,
                    right: 0,
                    transform: 'scale(9)'
                },
                svg: {
                    height: { md: 20, lg: 40, xl: '40px' },
                    width: { md: 20, lg: 40, xl: '40px' }
                },
                right: { xs: '50px', md: '80px', lg: '120px', xl: '220px' }
            }}
            aria-label="button"
        >
            <IconChevronRight fontSize={25} color={theme.palette.grey[900]} />
        </IconButton>
    );
}

function SamplePrevArrow(props: any) {
    const { onClickHandler } = props;
    const theme = useTheme();
    return (
        <IconButton
            onClick={onClickHandler}
            sx={{
                position: 'absolute',
                zIndex: 2,
                top: 'calc(50% - 70px)',
                cursor: 'pointer',
                background: `${theme.palette.background.paper} !important`,
                width: { xs: '40px !important', xl: '65px !important' },
                height: { xs: '40px !important', xl: '65px !important' },
                boxShadow: '0px 24px 38px rgba(9, 15, 37, 0.07)',
                '&:after': {
                    content: '""',
                    position: 'absolute',
                    top: 0,
                    left: 0,
                    bottom: 0,
                    right: 0,
                    transform: 'scale(9)'
                },
                svg: {
                    height: { md: 20, lg: 40, xl: '40px' },
                    width: { md: 20, lg: 40, xl: '40px' }
                },
                left: { xs: '50px', md: '80px', lg: '120px', xl: '220px' }
            }}
            aria-label="button"
        >
            <IconChevronLeft fontSize={25} color={theme.palette.grey[900]} />
        </IconButton>
    );
}

interface ItemProps {
    title: string;
    caption?: string;
    image: string;
    link: string;
}

const Items = ({ title, caption, image, link }: ItemProps) => {
    const theme = useTheme();
    return (
        <>
            <Images
                src={image}
                alt="dashboard"
                sx={{
                    width: { xs: '100%', xl: 743 },
                    objectFit: 'contain',
                    direction: 'initial'
                }}
            />
            <Stack spacing={1} sx={{ pt: 1 }}>
                <Stack
                    direction="row"
                    spacing={1}
                    alignItems="center"
                    justifyContent="center"
                    component={Link}
                    to={link}
                    target="_blank"
                    sx={{ textDecoration: 'none' }}
                >
                    <Typography variant="h3" sx={{ fontWeight: 500 }}>
                        {title}
                    </Typography>
                    <IconButton size="small">
                        <IconLink aria-label="link button" size={18} color={theme.palette.text.primary} />
                    </IconButton>
                </Stack>
                <Typography variant="subtitle2" color="text.primary" sx={{ fontSize: { xs: '1rem', xl: '1.125rem' } }}>
                    {caption}
                </Typography>
            </Stack>
        </>
    );
};

const PreBuildDashBoard = () => {
    const theme = useTheme();
    const matchUpSM = useMediaQuery(theme.breakpoints.down('md'));

    return (
        <>
            <Grid container spacing={7.5} justifyContent="center" sx={{ px: 1.25 }}>
                <Grid item xs={12} md={6} sx={{ textAlign: 'center' }}>
                    <Grid container spacing={1.5}>
                        <Grid item xs={12}>
                            <Typography variant="h2" sx={{ fontSize: { xs: '1.5rem', sm: '2.125rem' } }}>
                                AI个性模板
                            </Typography>
                        </Grid>
                        <Grid item xs={12}>
                            <Typography variant="h4" sx={{ fontWeight: 400 }} align="center">
                                丰富多样的AI模板，10秒生成专业内容，使得写作更加简单和高效。
                            </Typography>
                        </Grid>
                    </Grid>
                </Grid>
                <Grid item xs={12}>
                    <Box
                        className="preBuildDashBoard-slider"
                        sx={{
                            direction: 'initial',
                            '.slider': { height: { xs: 'auto' }, '& .slide:not(.selected)': { transformOrigin: 'center !important' } }
                        }}
                    >
                        <Carousel
                            showArrows={true}
                            showThumbs={false}
                            showIndicators={false}
                            centerMode={matchUpSM ? false : true}
                            centerSlidePercentage={50}
                            infiniteLoop={true}
                            autoFocus={true}
                            emulateTouch={true}
                            swipeable={true}
                            autoPlay={true}
                            interval={2000}
                            renderArrowPrev={(onClickHandler, hasPrev, label) =>
                                hasPrev && <SamplePrevArrow onClickHandler={onClickHandler} hasPrev={hasPrev} label={label} />
                            }
                            renderArrowNext={(onClickHandler, hasNext, label) =>
                                hasNext && <SampleNextArrow onClickHandler={onClickHandler} hasNext={hasNext} label={label} />
                            }
                        >
                            <Items title="应用市场" image={theme.palette.mode === 'dark' ? market : market} link="/appMarket" />
                            <Items title="亚马逊" image={theme.palette.mode === 'dark' ? amzon : amzon} link="/appMarket" />
                            <Items title="独立站" image={theme.palette.mode === 'dark' ? site : site} link="/appMarket" />
                            <Items title="社交媒体" image={theme.palette.mode === 'dark' ? social : social} link="/appMarket" />
                            <Items title="生成示例" image={theme.palette.mode === 'dark' ? template : template} link="/appMarket" />
                        </Carousel>
                    </Box>
                </Grid>
            </Grid>
        </>
    );
};

export default PreBuildDashBoard;
