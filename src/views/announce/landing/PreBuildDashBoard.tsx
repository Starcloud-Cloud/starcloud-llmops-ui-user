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
import { DASHBOARD_PATH } from 'config';

// styles
const Images = styled('img')({
    width: '60% !important',
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
    subTitle: string;
    description: string;
}

const Items = ({ title, caption, image, link, subTitle, description }: ItemProps) => {
    const theme = useTheme();
    return (
        <>
            <div className="flex gap-4 items-center">
                <Images
                    src={image}
                    alt="dashboard"
                    sx={{
                        objectFit: 'contain',
                        direction: 'initial'
                    }}
                />
                <div className="w-[50%]">
                    <div className="text-[32px] text-[#051d32] font-[500] leading-[50px]">{subTitle}</div>
                    <p className="text-[#76838f] text-[16px] mt-[24px] leading-[30px]">{description}</p>
                </div>
            </div>
            <Stack spacing={1} sx={{ pt: 1 }}>
                {/* <Stack
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
                </Stack> */}
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
                                多平台场景营销
                            </Typography>
                        </Grid>
                        <Grid item xs={12}>
                            <Typography variant="h4" sx={{ fontWeight: 400 }} align="center">
                                AIGC智能引擎,丰富的平台内容模板,专为内容营销而生,有效提升各大平台曝光，种草等内容工作的效率
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
                            centerSlidePercentage={60}
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
                            <Items
                                title="多平台账号登录"
                                subTitle="多平台账号登录"
                                description="支持小红书等多个主流内容创作平台等多个账号同时登录；保存长时间在线状态；一站式管理您多平台账号，提高内容运营效率。"
                                image={theme.palette.mode === 'dark' ? market : market}
                                link={DASHBOARD_PATH}
                            />
                            <Items
                                title="多平台内容AI一键批量创作"
                                subTitle="多平台内容AI一键批量创作"
                                description="支持多种平台和场景的文案AI生成，可精细化控制AI生成的内容。同时支持图片自动拼接，图片内容识别等最新多模态大模型能力。"
                                image={theme.palette.mode === 'dark' ? amzon : amzon}
                                link={DASHBOARD_PATH}
                            />
                            <Items
                                title="多平台作品一键发布"
                                subTitle="多平台作品一键发布"
                                description="支持一键分发多个作品到多个主流媒体平台；减少重复性工作，提高内容发布效率与管理效率"
                                image={theme.palette.mode === 'dark' ? site : site}
                                link={DASHBOARD_PATH}
                            />
                            <Items
                                title="多平台数据综合分析"
                                subTitle="多平台数据综合分析"
                                description="支持小红书等多个主流内容创作平台的账号作品数据，粉丝数据以及互动数据进行聚合查看，并支持指定时间段数据统计与图表展示；提高数据分析效率，助力您的数据运营。"
                                image={theme.palette.mode === 'dark' ? social : social}
                                link={DASHBOARD_PATH}
                            />
                        </Carousel>
                    </Box>
                </Grid>
            </Grid>
        </>
    );
};

export default PreBuildDashBoard;
