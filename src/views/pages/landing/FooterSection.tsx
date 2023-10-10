// material-ui
import { useTheme, styled } from '@mui/material/styles';
import { Box, CardMedia, Container, Grid, Link, Stack, Typography } from '@mui/material'; // Divider

// assets
import wechat1 from 'assets/images/landing/wechat.png';
import wechat2 from 'assets/images/landing/wechattube.jpg';
import wechat3 from 'assets/images/landing/wechatpublic.bmp';
import tiktok from 'assets/images/landing/douyin.png';

import { t } from 'hooks/web/useI18n';

// Link - custom style
const FooterLink = styled(Link)(({ theme }) => ({
    color: theme.palette.mode === 'dark' ? theme.palette.text.secondary : theme.palette.text.hint,
    '&:hover': {
        color: theme.palette.primary.main
    },
    '&:active': {
        color: theme.palette.primary.main
    }
}));

// =============================|| LANDING - FOOTER SECTION ||============================= //

const FooterSection = () => {
    const theme = useTheme();
    const textColor = theme.palette.mode === 'dark' ? 'text.secondary' : 'text.hint';

    // const dividerSX = {
    //     borderImageSlice: 1,
    //     borderImageSource: `linear-gradient(90deg, rgba(255, 255, 255, 0) -0.01%, rgba(255, 255, 255, 0.56) 51.97%, rgba(255, 255, 255, 0.03) 99.99%)`,
    //     opacity: 0.5
    // };

    return (
        <>
            <Container sx={{ mb: 15 }}>
                <Grid container spacing={6}>
                    {/* <Grid item xs={12}>
                        <Stack spacing={4.25}>
                            <Divider sx={dividerSX} />
                            <Stack
                                direction="row"
                                justifyContent="center"
                                spacing={{ xs: 1.5, sm: 6, md: 10, lg: 12 }}
                                sx={{ overflow: 'hidden' }}
                            >
                                <img src={Dribble} alt="dribble" />
                                <img src={Freepik} alt="freepik" />
                                <img src={Awards} alt="awards" />
                            </Stack>
                            <Divider sx={dividerSX} />
                        </Stack>
                    </Grid> */}
                    <Grid item xs={12}>
                        <Grid container spacing={8}>
                            <Grid item xs={12} md={4}>
                                <Stack spacing={{ xs: 2, md: 5 }}>
                                    <Typography variant="h4" color={textColor} sx={{ fontWeight: 500 }}>
                                        {t('homepage.foot.about')}
                                    </Typography>
                                    <Typography variant="body2" color={textColor}>
                                        {t('homepage.foot.desc')}
                                    </Typography>
                                </Stack>
                            </Grid>
                            <Grid item xs={12} md={8}>
                                <Grid container spacing={{ xs: 5, md: 2 }}>
                                    <Grid item xs={12} sm={4}>
                                        <Stack spacing={{ xs: 3, md: 5 }} textAlign="center">
                                            <Typography variant="h4" color={textColor} sx={{ fontWeight: 500 }}>
                                                {t('homepage.foot.help')}
                                            </Typography>
                                            <Stack spacing={{ xs: 1.5, md: 2.5 }}>
                                                <FooterLink href="/" target="_blank" underline="none">
                                                    {t('homepage.foot.documentation')}
                                                </FooterLink>
                                                <FooterLink href="/" target="_blank" underline="none">
                                                    {t('homepage.foot.support')}
                                                </FooterLink>
                                            </Stack>
                                        </Stack>
                                    </Grid>
                                    <Grid item xs={3} sm={2}>
                                        <Stack spacing={{ xs: 3, md: 5 }} alignItems="center">
                                            <CardMedia
                                                component="img"
                                                image={wechat1}
                                                alt="img1"
                                                sx={{ width: { xs: '100%', sm: '100%', md: '100%' } }}
                                            />
                                            <Typography variant="h4" color={textColor} align="center" sx={{ fontWeight: 500 }}>
                                                企业微信群
                                            </Typography>
                                        </Stack>
                                    </Grid>
                                    <Grid item xs={3} sm={2}>
                                        <Stack spacing={{ xs: 3, md: 5 }} alignItems="center">
                                            <CardMedia
                                                component="img"
                                                image={wechat2}
                                                alt="img2"
                                                sx={{ width: { xs: '100%', sm: '100%', md: '100%' } }}
                                            />
                                            <Typography variant="h4" color={textColor} align="center" sx={{ fontWeight: 500 }}>
                                                视频号
                                            </Typography>
                                        </Stack>
                                    </Grid>
                                    <Grid item xs={3} sm={2}>
                                        <Stack spacing={{ xs: 3, md: 5 }} alignItems="center">
                                            <CardMedia
                                                component="img"
                                                image={tiktok}
                                                alt="img1"
                                                sx={{ width: { xs: '100%', sm: '100%', md: '100%' } }}
                                            />
                                            <Typography variant="h4" color={textColor} align="center" sx={{ pt: 0, fontWeight: 500 }}>
                                                抖音
                                            </Typography>
                                        </Stack>
                                    </Grid>
                                    <Grid item xs={3} sm={2}>
                                        <Stack spacing={{ xs: 3, md: 5 }} alignItems="center">
                                            <CardMedia
                                                component="img"
                                                image={wechat3}
                                                alt="img3"
                                                sx={{ width: { xs: '100%', sm: '100%', md: '100%' } }}
                                            />
                                            <Typography variant="h4" color={textColor} align="center" sx={{ fontWeight: 500 }}>
                                                公众号
                                            </Typography>
                                        </Stack>
                                    </Grid>
                                </Grid>
                            </Grid>
                        </Grid>
                    </Grid>
                </Grid>
            </Container>
            <div className="flex justify-center">
                <div className="flex pb-3 max-w-[1200px] px-[24px] w-full">
                    <span className="mr-2 text-white">友情链接:</span>
                    <a target="_blank" className="text-[#2196f3]" href="https://www.amz123.com">
                        AMZ123亚马逊导航
                    </a>
                    <a target="_blank" className="text-[#2196f3] ml-2" href="https://www.aiwht.com">
                        AI万花筒
                    </a>
                    <a target="_blank" className="text-[#2196f3] ml-2" href="https://www.aitop100.cn">
                        AI Top100
                    </a>
                </div>
            </div>
            <Box sx={{ bgcolor: 'dark.dark', py: { xs: 3, sm: 1.5 } }}>
                <Container>
                    <Stack
                        direction={{ xs: 'column', sm: 'row' }}
                        alignItems="center"
                        justifyContent="space-between"
                        spacing={{ xs: 1.5, sm: 1, md: 3 }}
                    >
                        <Typography color="text.secondary">
                            版权所有 © 星河云海(杭州)网络技术有限公司{' '}
                            <Link href="https://beian.miit.gov.cn" target="_blank" underline="hover">
                                浙ICP备 2022002996号
                            </Link>{' '}
                            <Link
                                href="http://www.beian.gov.cn/portal/registerSystemInfo?recordcode=33011002017175"
                                target="_blank"
                                underline="hover"
                            >
                                浙公网安备 33011002017175号
                            </Link>
                        </Typography>
                    </Stack>
                </Container>
            </Box>
        </>
    );
};

export default FooterSection;
