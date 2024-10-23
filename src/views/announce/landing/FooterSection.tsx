// material-ui
import { useTheme, styled } from '@mui/material/styles';
import { Box, CardMedia, Container, Grid, Link, Stack, Typography } from '@mui/material'; // Divider

// assets
import wechat1 from 'assets/images/landing/wechat.png';
import wechat2 from 'assets/images/landing/wechattube.jpg';
import wechat3 from 'assets/images/landing/wechatpublic.jpg';
import tiktok from 'assets/images/landing/douyin.png';
import qiwei from 'assets/images/landing/qiwei.png';
import mofabijiwechat from 'assets/images/landing/mofabijiwechat.png';
import { ENUM_TENANT, getTenant } from 'utils/permission';
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
                    <a target="_blank" className="text-[#2196f3] ml-2" href="https://www.deepdhai.com/">
                        深度导航
                    </a>
                    <a target="_blank" className="text-[#2196f3] ml-2" href="https://tools.ikjzd.com">
                        跨境导航
                    </a>
                    <a target="_blank" className="text-[#2196f3] ml-2" href="https://hao.logosc.cn">
                        神器集
                    </a>
                    <a target="_blank" className="text-[#2196f3] ml-2" href="https://www.234.cn">
                        234跨境导航
                    </a>
                    <a target="_blank" className="text-[#2196f3] ml-2" href="https://www.h1z1tmc.com/">
                        AI导航猫
                    </a>
                    <a target="_blank" className="text-[#2196f3] ml-2" href="https://www.surfcg.com/index?by=2">
                        SurfCG
                    </a>
                    <a target="_blank" className="text-[#2196f3] ml-2" href="https://luban.bluemediagroup.cn/about/index?utm_source=mofaai">
                        鲁班跨境通
                    </a>
                    <a target="_blank" className="text-[#2196f3] ml-2" href="https://bewiser1.com/">
                        见远导航
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
                        <Typography color="text.secondary" className="flex items-center gap-2">
                            版权所有 © 星河云海(杭州)网络技术有限公司
                            <img className="w-[15px]" src={'https://beian.mps.gov.cn/web/assets/logo01.6189a29f.png'} />
                            <Link href="https://beian.miit.gov.cn" target="_blank" underline="hover">
                                浙ICP备2022033524号
                            </Link>
                            <Link
                                href="http://www.beian.gov.cn/portal/registerSystemInfo?recordcode=33011002017908"
                                target="_blank"
                                underline="hover"
                            >
                                浙公网安备33011002017908号
                            </Link>
                        </Typography>
                    </Stack>
                </Container>
            </Box>
        </>
    );
};

export default FooterSection;
