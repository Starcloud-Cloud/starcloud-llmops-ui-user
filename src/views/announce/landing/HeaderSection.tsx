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
import './CardSection.scss';

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
    //餐饮美食
    const foodList = [
        'https://service-oss-juzhen.mofaai.com.cn/web/wayl/DM_20241020150430_002.jpg',
        'https://service-oss-juzhen.mofaai.com.cn/web/wayl/DM_20241020150430_005.jpg',
        'https://service-oss-juzhen.mofaai.com.cn/web/wayl/DM_20241020150430_013.jpg',
        'https://service-oss-juzhen.mofaai.com.cn/web/wayl/DM_20241020150430_014.jpg',
        'https://service-oss-juzhen.mofaai.com.cn/web/wayl/DM_20241020150430_023.jpg',
        'https://service-oss-juzhen.mofaai.com.cn/web/wayl/DM_20241020150431_033.gif',
        'https://service-oss-juzhen.mofaai.com.cn/web/wayl/DM_20241020150431_034.jpg',
        'https://service-oss-juzhen.mofaai.com.cn/web/wayl/DM_20241020150431_047.jpg',
        'https://service-oss-juzhen.mofaai.com.cn/web/wayl/DM_20241020150431_048.jpg',
        'https://service-oss-juzhen.mofaai.com.cn/web/wayl/DM_20241020150431_051.jpg',
        'https://service-oss-juzhen.mofaai.com.cn/web/wayl/DM_20241020150431_052.jpg',
        'https://service-oss-juzhen.mofaai.com.cn/web/wayl/DM_20241020150431_053.jpg',
        'https://service-oss-juzhen.mofaai.com.cn/web/wayl/DM_20241020150431_056.jpg',
        'https://service-oss-juzhen.mofaai.com.cn/web/wayl/DM_20241020150431_059.jpg',
        'https://service-oss-juzhen.mofaai.com.cn/web/wayl/DM_20241020150431_074.jpg',
        'https://service-oss-juzhen.mofaai.com.cn/web/wayl/DM_20241020150431_075.jpg',
        'https://service-oss-juzhen.mofaai.com.cn/web/wayl/DM_20241020150431_081.jpg',
        'https://service-oss-juzhen.mofaai.com.cn/web/wayl/DM_20241020150431_096.jpg',
        'https://service-oss-juzhen.mofaai.com.cn/web/wayl/DM_20241020150431_098.jpg',
        'https://service-oss-juzhen.mofaai.com.cn/web/wayl/DM_20241020150431_099.jpg',
        'https://service-oss-juzhen.mofaai.com.cn/web/wayl/DM_20241020150431_105.jpg',
        'https://service-oss-juzhen.mofaai.com.cn/web/wayl/DM_20241020150431_109.png',
        'https://service-oss-juzhen.mofaai.com.cn/web/wayl/DM_20241020150431_112.jpg',
        'https://service-oss-juzhen.mofaai.com.cn/web/wayl/DM_20241020150431_115.jpg',
        'https://service-oss-juzhen.mofaai.com.cn/web/wayl/DM_20241020150431_118.jpg',
        'https://service-oss-juzhen.mofaai.com.cn/web/wayl/DM_20241020150503_008.jpg',
        'https://service-oss-juzhen.mofaai.com.cn/web/wayl/DM_20241020150503_016.jpg',
        'https://service-oss-juzhen.mofaai.com.cn/web/wayl/DM_20241020150503_017.png',
        'https://service-oss-juzhen.mofaai.com.cn/web/wayl/DM_20241020150503_021.jpg',
        'https://service-oss-juzhen.mofaai.com.cn/web/wayl/DM_20241020150503_023.jpg',
        'https://service-oss-juzhen.mofaai.com.cn/web/wayl/DM_20241020150503_025.jpg',
        'https://service-oss-juzhen.mofaai.com.cn/web/wayl/DM_20241020150503_027.jpg',
        'https://service-oss-juzhen.mofaai.com.cn/web/wayl/DM_20241020150503_030.jpg',
        'https://service-oss-juzhen.mofaai.com.cn/web/wayl/DM_20241020150503_038.jpg',
        'https://service-oss-juzhen.mofaai.com.cn/web/wayl/DM_20241020150503_041.jpg',
        'https://service-oss-juzhen.mofaai.com.cn/web/wayl/DM_20241020150503_043.jpg',
        'https://service-oss-juzhen.mofaai.com.cn/web/wayl/DM_20241020150503_045.jpg',
        'https://service-oss-juzhen.mofaai.com.cn/web/wayl/DM_20241020150503_055.jpg',
        'https://service-oss-juzhen.mofaai.com.cn/web/wayl/DM_20241020150503_057.jpg',
        'https://service-oss-juzhen.mofaai.com.cn/web/wayl/DM_20241020150503_058.jpg',
        'https://service-oss-juzhen.mofaai.com.cn/web/wayl/DM_20241020150503_062.jpg',
        'https://service-oss-juzhen.mofaai.com.cn/web/wayl/DM_20241020150503_068.jpg',
        'https://service-oss-juzhen.mofaai.com.cn/web/wayl/DM_20241020150503_093.jpg',
        'https://service-oss-juzhen.mofaai.com.cn/web/wayl/DM_20241020150532_005.jpg',
        'https://service-oss-juzhen.mofaai.com.cn/web/wayl/DM_20241020150532_013.jpg',
        'https://service-oss-juzhen.mofaai.com.cn/web/wayl/DM_20241020150532_069.jpg',
        'https://service-oss-juzhen.mofaai.com.cn/web/wayl/DM_20241020150532_086.jpg',
        'https://service-oss-juzhen.mofaai.com.cn/web/wayl/DM_20241020150554_006.jpg',
        'https://service-oss-juzhen.mofaai.com.cn/web/wayl/DM_20241020150554_013.jpg',
        'https://service-oss-juzhen.mofaai.com.cn/web/wayl/DM_20241020150554_028.jpg',
        'https://service-oss-juzhen.mofaai.com.cn/web/cyms/DM_20241020122257_002.jpg',
        'https://service-oss-juzhen.mofaai.com.cn/web/cyms/DM_20241020122257_009.jpg',
        'https://service-oss-juzhen.mofaai.com.cn/web/cyms/DM_20241020122257_015.png',
        'https://service-oss-juzhen.mofaai.com.cn/web/cyms/DM_20241020122257_016.png',
        'https://service-oss-juzhen.mofaai.com.cn/web/cyms/DM_20241020122257_028.jpg',
        'https://service-oss-juzhen.mofaai.com.cn/web/cyms/DM_20241020122257_033.jpg',
        'https://service-oss-juzhen.mofaai.com.cn/web/cyms/DM_20241020122257_038.jpg',
        'https://service-oss-juzhen.mofaai.com.cn/web/cyms/DM_20241020122257_039.jpg',
        'https://service-oss-juzhen.mofaai.com.cn/web/cyms/DM_20241020122257_040.jpg',
        'https://service-oss-juzhen.mofaai.com.cn/web/cyms/DM_20241020122257_041.jpg',
        'https://service-oss-juzhen.mofaai.com.cn/web/cyms/DM_20241020122257_043.jpg',
        'https://service-oss-juzhen.mofaai.com.cn/web/cyms/DM_20241020122258_047.jpg',
        'https://service-oss-juzhen.mofaai.com.cn/web/cyms/DM_20241020122258_054.jpg',
        'https://service-oss-juzhen.mofaai.com.cn/web/cyms/DM_20241020122258_121.jpg',
        'https://service-oss-juzhen.mofaai.com.cn/web/cyms/DM_20241020122336_014.jpg',
        'https://service-oss-juzhen.mofaai.com.cn/web/cyms/DM_20241020122336_019.jpg',
        'https://service-oss-juzhen.mofaai.com.cn/web/cyms/DM_20241020122336_025.jpg',
        'https://service-oss-juzhen.mofaai.com.cn/web/cyms/DM_20241020122336_029.png',
        'https://service-oss-juzhen.mofaai.com.cn/web/cyms/DM_20241020122337_059.jpg',
        'https://service-oss-juzhen.mofaai.com.cn/web/cyms/DM_20241020122337_099.jpg',
        'https://service-oss-juzhen.mofaai.com.cn/web/cyms/DM_20241020122337_106.jpg',
        'https://service-oss-juzhen.mofaai.com.cn/web/cyms/DM_20241020122337_107.jpg',
        'https://service-oss-juzhen.mofaai.com.cn/web/cyms/DM_20241020122337_109.jpg',
        'https://service-oss-juzhen.mofaai.com.cn/web/cyms/DM_20241020122337_110.jpg',
        'https://service-oss-juzhen.mofaai.com.cn/web/cyms/DM_20241020122337_113.jpg',
        'https://service-oss-juzhen.mofaai.com.cn/web/cyms/DM_20241020122337_115.jpg',
        'https://service-oss-juzhen.mofaai.com.cn/web/cyms/DM_20241020122354_002.jpg',
        'https://service-oss-juzhen.mofaai.com.cn/web/cyms/DM_20241020122354_003.jpg',
        'https://service-oss-juzhen.mofaai.com.cn/web/cyms/DM_20241020122354_004.jpg',
        'https://service-oss-juzhen.mofaai.com.cn/web/cyms/DM_20241020122354_009.jpg',
        'https://service-oss-juzhen.mofaai.com.cn/web/cyms/DM_20241020122354_011.jpg',
        'https://service-oss-juzhen.mofaai.com.cn/web/cyms/DM_20241020122354_021.jpg',
        'https://service-oss-juzhen.mofaai.com.cn/web/cyms/DM_20241020122354_022.jpg',
        'https://service-oss-juzhen.mofaai.com.cn/web/cyms/DM_20241020122354_023.jpg',
        'https://service-oss-juzhen.mofaai.com.cn/web/cyms/DM_20241020122354_025.png',
        'https://service-oss-juzhen.mofaai.com.cn/web/cyms/DM_20241020122354_026.jpg',
        'https://service-oss-juzhen.mofaai.com.cn/web/cyms/DM_20241020122354_028.jpg',
        'https://service-oss-juzhen.mofaai.com.cn/web/jypx/DM_20241020122613_085.jpg',
        'https://service-oss-juzhen.mofaai.com.cn/web/jypx/DM_20241020122613_088.jpg',
        'https://service-oss-juzhen.mofaai.com.cn/web/jypx/DM_20241020122613_089.jpg',
        'https://service-oss-juzhen.mofaai.com.cn/web/jypx/DM_20241020122613_102.jpg',
        'https://service-oss-juzhen.mofaai.com.cn/web/jypx/DM_20241020122613_103.jpg',
        'https://service-oss-juzhen.mofaai.com.cn/web/jypx/DM_20241020122613_108.jpg',
        'https://service-oss-juzhen.mofaai.com.cn/web/jypx/DM_20241020122613_109.jpg',
        'https://service-oss-juzhen.mofaai.com.cn/web/jypx/DM_20241020122613_121.jpg',
        'https://service-oss-juzhen.mofaai.com.cn/web/jypx/DM_20241020122632_007.jpg',
        'https://service-oss-juzhen.mofaai.com.cn/web/jypx/DM_20241020122632_035.jpg',
        'https://service-oss-juzhen.mofaai.com.cn/web/jypx/DM_20241020122632_056.jpg',
        'https://service-oss-juzhen.mofaai.com.cn/web/jypx/DM_20241020122632_100.jpg',
        'https://service-oss-juzhen.mofaai.com.cn/web/jypx/DM_20241020122652_025.jpg',
        'https://service-oss-juzhen.mofaai.com.cn/web/jypx/DM_20241020122709_047.jpg'
    ];
    const furnitureList = [
        'https://service-oss-juzhen.mofaai.com.cn/web/myqz/DM_20241020150657_003.jpg',
        'https://service-oss-juzhen.mofaai.com.cn/web/myqz/DM_20241020150657_010.jpg',
        'https://service-oss-juzhen.mofaai.com.cn/web/myqz/DM_20241020150657_012.jpg',
        'https://service-oss-juzhen.mofaai.com.cn/web/myqz/DM_20241020150657_014.jpg',
        'https://service-oss-juzhen.mofaai.com.cn/web/myqz/DM_20241020150657_015.jpg',
        'https://service-oss-juzhen.mofaai.com.cn/web/myqz/DM_20241020150657_022.jpg',
        'https://service-oss-juzhen.mofaai.com.cn/web/myqz/DM_20241020150657_025.jpg',
        'https://service-oss-juzhen.mofaai.com.cn/web/myqz/DM_20241020150657_028.jpg',
        'https://service-oss-juzhen.mofaai.com.cn/web/myqz/DM_20241020150657_030.jpg',
        'https://service-oss-juzhen.mofaai.com.cn/web/myqz/DM_20241020150657_033.jpg',
        'https://service-oss-juzhen.mofaai.com.cn/web/myqz/DM_20241020150657_035.jpg',
        'https://service-oss-juzhen.mofaai.com.cn/web/myqz/DM_20241020150657_036.jpg',
        'https://service-oss-juzhen.mofaai.com.cn/web/myqz/DM_20241020150657_037.jpg',
        'https://service-oss-juzhen.mofaai.com.cn/web/myqz/DM_20241020150657_038.jpg',
        'https://service-oss-juzhen.mofaai.com.cn/web/myqz/DM_20241020150657_039.jpg',
        'https://service-oss-juzhen.mofaai.com.cn/web/myqz/DM_20241020150657_040.jpg',
        'https://service-oss-juzhen.mofaai.com.cn/web/myqz/DM_20241020150657_044.jpg',
        'https://service-oss-juzhen.mofaai.com.cn/web/myqz/DM_20241020150657_047.png',
        'https://service-oss-juzhen.mofaai.com.cn/web/myqz/DM_20241020150657_048.jpg',
        'https://service-oss-juzhen.mofaai.com.cn/web/myqz/DM_20241020150657_049.jpg',
        'https://service-oss-juzhen.mofaai.com.cn/web/myqz/DM_20241020150657_056.jpg',
        'https://service-oss-juzhen.mofaai.com.cn/web/myqz/DM_20241020150657_059.jpg',
        'https://service-oss-juzhen.mofaai.com.cn/web/myqz/DM_20241020150657_060.jpg',
        'https://service-oss-juzhen.mofaai.com.cn/web/myqz/DM_20241020150657_061.jpg',
        'https://service-oss-juzhen.mofaai.com.cn/web/myqz/DM_20241020150657_068.jpg',
        'https://service-oss-juzhen.mofaai.com.cn/web/myqz/DM_20241020150657_076.jpg',
        'https://service-oss-juzhen.mofaai.com.cn/web/myqz/DM_20241020150657_080.jpg',
        'https://service-oss-juzhen.mofaai.com.cn/web/myqz/DM_20241020150657_091.jpg',
        'https://service-oss-juzhen.mofaai.com.cn/web/myqz/DM_20241020150657_107.jpg',
        'https://service-oss-juzhen.mofaai.com.cn/web/myqz/DM_20241020150657_110.png',
        'https://service-oss-juzhen.mofaai.com.cn/web/myqz/DM_20241020150657_118.png',
        'https://service-oss-juzhen.mofaai.com.cn/web/myqz/DM_20241020150657_119.png',
        'https://service-oss-juzhen.mofaai.com.cn/web/myqz/DM_20241020150726_015.png',
        'https://service-oss-juzhen.mofaai.com.cn/web/myqz/DM_20241020150726_017.png',
        'https://service-oss-juzhen.mofaai.com.cn/web/myqz/DM_20241020150726_023.png',
        'https://service-oss-juzhen.mofaai.com.cn/web/myqz/DM_20241020150726_025.png',
        'https://service-oss-juzhen.mofaai.com.cn/web/myqz/DM_20241020150726_028.jpg',
        'https://service-oss-juzhen.mofaai.com.cn/web/myqz/DM_20241020150726_029.jpg',
        'https://service-oss-juzhen.mofaai.com.cn/web/myqz/DM_20241020150726_030.jpg',
        'https://service-oss-juzhen.mofaai.com.cn/web/myqz/DM_20241020150726_043.jpg',
        'https://service-oss-juzhen.mofaai.com.cn/web/myqz/DM_20241020150726_044.jpg',
        'https://service-oss-juzhen.mofaai.com.cn/web/myqz/DM_20241020150726_045.jpg',
        'https://service-oss-juzhen.mofaai.com.cn/web/myqz/DM_20241020150726_046.jpg',
        'https://service-oss-juzhen.mofaai.com.cn/web/myqz/DM_20241020150726_048.jpg',
        'https://service-oss-juzhen.mofaai.com.cn/web/myqz/DM_20241020150726_049.jpg',
        'https://service-oss-juzhen.mofaai.com.cn/web/myqz/DM_20241020150726_050.jpg',
        'https://service-oss-juzhen.mofaai.com.cn/web/myqz/DM_20241020150726_051.jpg',
        'https://service-oss-juzhen.mofaai.com.cn/web/myqz/DM_20241020150726_052.jpg',
        'https://service-oss-juzhen.mofaai.com.cn/web/myqz/DM_20241020150726_053.jpg',
        'https://service-oss-juzhen.mofaai.com.cn/web/myqz/DM_20241020150726_054.jpg',
        'https://service-oss-juzhen.mofaai.com.cn/web/jypx/DM_20241020122613_001.jpg',
        'https://service-oss-juzhen.mofaai.com.cn/web/jypx/DM_20241020122613_002.jpg',
        'https://service-oss-juzhen.mofaai.com.cn/web/jypx/DM_20241020122613_003.jpg',
        'https://service-oss-juzhen.mofaai.com.cn/web/jypx/DM_20241020122613_004.jpg',
        'https://service-oss-juzhen.mofaai.com.cn/web/jypx/DM_20241020122613_005.jpg',
        'https://service-oss-juzhen.mofaai.com.cn/web/jypx/DM_20241020122613_006.jpg',
        'https://service-oss-juzhen.mofaai.com.cn/web/jypx/DM_20241020122613_007.jpg',
        'https://service-oss-juzhen.mofaai.com.cn/web/jypx/DM_20241020122613_009.jpg',
        'https://service-oss-juzhen.mofaai.com.cn/web/jypx/DM_20241020122613_011.jpg',
        'https://service-oss-juzhen.mofaai.com.cn/web/jypx/DM_20241020122613_012.jpg',
        'https://service-oss-juzhen.mofaai.com.cn/web/jypx/DM_20241020122613_013.png',
        'https://service-oss-juzhen.mofaai.com.cn/web/jypx/DM_20241020122613_014.gif',
        'https://service-oss-juzhen.mofaai.com.cn/web/jypx/DM_20241020122613_015.jpg',
        'https://service-oss-juzhen.mofaai.com.cn/web/jypx/DM_20241020122613_016.jpg',
        'https://service-oss-juzhen.mofaai.com.cn/web/jypx/DM_20241020122613_017.jpg',
        'https://service-oss-juzhen.mofaai.com.cn/web/jypx/DM_20241020122613_018.jpg',
        'https://service-oss-juzhen.mofaai.com.cn/web/jypx/DM_20241020122613_019.jpg',
        'https://service-oss-juzhen.mofaai.com.cn/web/jypx/DM_20241020122613_020.jpg',
        'https://service-oss-juzhen.mofaai.com.cn/web/jypx/DM_20241020122613_022.jpg',
        'https://service-oss-juzhen.mofaai.com.cn/web/jypx/DM_20241020122613_023.jpg',
        'https://service-oss-juzhen.mofaai.com.cn/web/jypx/DM_20241020122613_024.jpg',
        'https://service-oss-juzhen.mofaai.com.cn/web/jypx/DM_20241020122613_025.jpg',
        'https://service-oss-juzhen.mofaai.com.cn/web/jypx/DM_20241020122613_026.jpg',
        'https://service-oss-juzhen.mofaai.com.cn/web/jypx/DM_20241020122613_028.jpg',
        'https://service-oss-juzhen.mofaai.com.cn/web/jypx/DM_20241020122613_030.jpg',
        'https://service-oss-juzhen.mofaai.com.cn/web/jypx/DM_20241020122613_031.jpg',
        'https://service-oss-juzhen.mofaai.com.cn/web/jypx/DM_20241020122613_033.jpg',
        'https://service-oss-juzhen.mofaai.com.cn/web/jypx/DM_20241020122613_034.png',
        'https://service-oss-juzhen.mofaai.com.cn/web/jypx/DM_20241020122613_036.jpg',
        'https://service-oss-juzhen.mofaai.com.cn/web/jypx/DM_20241020122613_037.jpg',
        'https://service-oss-juzhen.mofaai.com.cn/web/jypx/DM_20241020122613_041.jpg',
        'https://service-oss-juzhen.mofaai.com.cn/web/jypx/DM_20241020122613_043.jpg',
        'https://service-oss-juzhen.mofaai.com.cn/web/jypx/DM_20241020122613_047.jpg',
        'https://service-oss-juzhen.mofaai.com.cn/web/jypx/DM_20241020122613_048.jpg',
        'https://service-oss-juzhen.mofaai.com.cn/web/jypx/DM_20241020122613_053.jpg',
        'https://service-oss-juzhen.mofaai.com.cn/web/jypx/DM_20241020122613_054.jpg',
        'https://service-oss-juzhen.mofaai.com.cn/web/jypx/DM_20241020122613_055.jpg',
        'https://service-oss-juzhen.mofaai.com.cn/web/jypx/DM_20241020122613_058.jpg',
        'https://service-oss-juzhen.mofaai.com.cn/web/jypx/DM_20241020122613_062.jpg',
        'https://service-oss-juzhen.mofaai.com.cn/web/jypx/DM_20241020122613_063.jpg',
        'https://service-oss-juzhen.mofaai.com.cn/web/jypx/DM_20241020122613_064.jpg',
        'https://service-oss-juzhen.mofaai.com.cn/web/jypx/DM_20241020122613_065.jpg',
        'https://service-oss-juzhen.mofaai.com.cn/web/jypx/DM_20241020122613_066.jpg',
        'https://service-oss-juzhen.mofaai.com.cn/web/jypx/DM_20241020122613_067.jpg',
        'https://service-oss-juzhen.mofaai.com.cn/web/jypx/DM_20241020122613_068.jpg',
        'https://service-oss-juzhen.mofaai.com.cn/web/jypx/DM_20241020122613_073.jpg',
        'https://service-oss-juzhen.mofaai.com.cn/web/jypx/DM_20241020122613_074.jpg',
        'https://service-oss-juzhen.mofaai.com.cn/web/jypx/DM_20241020122613_075.jpg',
        'https://service-oss-juzhen.mofaai.com.cn/web/jypx/DM_20241020122613_076.jpg',
        'https://service-oss-juzhen.mofaai.com.cn/web/jypx/DM_20241020122613_081.png',
        'https://service-oss-juzhen.mofaai.com.cn/web/jypx/DM_20241020122613_082.jpg'
    ];
    const educationList = [
        'https://service-oss-juzhen.mofaai.com.cn/web/lycx/DM_20241020121226_001.jpg',
        'https://service-oss-juzhen.mofaai.com.cn/web/lycx/DM_20241020121226_002.jpg',
        'https://service-oss-juzhen.mofaai.com.cn/web/lycx/DM_20241020121226_003.jpg',
        'https://service-oss-juzhen.mofaai.com.cn/web/lycx/DM_20241020121226_004.jpg',
        'https://service-oss-juzhen.mofaai.com.cn/web/lycx/DM_20241020121226_005.jpg',
        'https://service-oss-juzhen.mofaai.com.cn/web/lycx/DM_20241020121226_006.jpg',
        'https://service-oss-juzhen.mofaai.com.cn/web/lycx/DM_20241020121227_007.jpg',
        'https://service-oss-juzhen.mofaai.com.cn/web/lycx/DM_20241020121227_009.jpg',
        'https://service-oss-juzhen.mofaai.com.cn/web/lycx/DM_20241020121227_010.jpg',
        'https://service-oss-juzhen.mofaai.com.cn/web/lycx/DM_20241020121227_011.jpg',
        'https://service-oss-juzhen.mofaai.com.cn/web/lycx/DM_20241020121227_012.jpg',
        'https://service-oss-juzhen.mofaai.com.cn/web/lycx/DM_20241020121227_013.jpg',
        'https://service-oss-juzhen.mofaai.com.cn/web/lycx/DM_20241020121227_014.jpg',
        'https://service-oss-juzhen.mofaai.com.cn/web/lycx/DM_20241020121227_015.jpg',
        'https://service-oss-juzhen.mofaai.com.cn/web/lycx/DM_20241020121227_016.jpg',
        'https://service-oss-juzhen.mofaai.com.cn/web/lycx/DM_20241020121227_017.jpg',
        'https://service-oss-juzhen.mofaai.com.cn/web/lycx/DM_20241020121227_018.jpg',
        'https://service-oss-juzhen.mofaai.com.cn/web/lycx/DM_20241020121227_020.jpg',
        'https://service-oss-juzhen.mofaai.com.cn/web/lycx/DM_20241020121227_022.jpg',
        'https://service-oss-juzhen.mofaai.com.cn/web/lycx/DM_20241020121227_023.png',
        'https://service-oss-juzhen.mofaai.com.cn/web/lycx/DM_20241020121227_024.jpg',
        'https://service-oss-juzhen.mofaai.com.cn/web/lycx/DM_20241020121227_025.jpg',
        'https://service-oss-juzhen.mofaai.com.cn/web/lycx/DM_20241020121227_026.jpg',
        'https://service-oss-juzhen.mofaai.com.cn/web/lycx/DM_20241020121227_029.jpg',
        'https://service-oss-juzhen.mofaai.com.cn/web/lycx/DM_20241020121227_030.jpg',
        'https://service-oss-juzhen.mofaai.com.cn/web/lycx/DM_20241020121227_031.jpg',
        'https://service-oss-juzhen.mofaai.com.cn/web/lycx/DM_20241020121227_032.jpg',
        'https://service-oss-juzhen.mofaai.com.cn/web/lycx/DM_20241020121227_033.jpg',
        'https://service-oss-juzhen.mofaai.com.cn/web/lycx/DM_20241020121227_034.jpg',
        'https://service-oss-juzhen.mofaai.com.cn/web/lycx/DM_20241020121227_035.jpg',
        'https://service-oss-juzhen.mofaai.com.cn/web/lycx/DM_20241020121227_036.gif',
        'https://service-oss-juzhen.mofaai.com.cn/web/lycx/DM_20241020121227_037.jpg',
        'https://service-oss-juzhen.mofaai.com.cn/web/lycx/DM_20241020121227_038.jpg',
        'https://service-oss-juzhen.mofaai.com.cn/web/lycx/DM_20241020121227_039.jpg',
        'https://service-oss-juzhen.mofaai.com.cn/web/lycx/DM_20241020121227_040.jpg',
        'https://service-oss-juzhen.mofaai.com.cn/web/lycx/DM_20241020121227_041.jpg',
        'https://service-oss-juzhen.mofaai.com.cn/web/lycx/DM_20241020121227_042.jpg',
        'https://service-oss-juzhen.mofaai.com.cn/web/lycx/DM_20241020121227_044.jpg',
        'https://service-oss-juzhen.mofaai.com.cn/web/lycx/DM_20241020121227_045.jpg',
        'https://service-oss-juzhen.mofaai.com.cn/web/lycx/DM_20241020121227_046.jpg',
        'https://service-oss-juzhen.mofaai.com.cn/web/lycx/DM_20241020121227_047.jpg',
        'https://service-oss-juzhen.mofaai.com.cn/web/lycx/DM_20241020121227_048.jpg',
        'https://service-oss-juzhen.mofaai.com.cn/web/lycx/DM_20241020121227_050.jpg',
        'https://service-oss-juzhen.mofaai.com.cn/web/lycx/DM_20241020121227_052.jpg',
        'https://service-oss-juzhen.mofaai.com.cn/web/lycx/DM_20241020121227_053.jpg',
        'https://service-oss-juzhen.mofaai.com.cn/web/lycx/DM_20241020121227_054.jpg',
        'https://service-oss-juzhen.mofaai.com.cn/web/lycx/DM_20241020121227_055.jpg',
        'https://service-oss-juzhen.mofaai.com.cn/web/lycx/DM_20241020121227_056.jpg',
        'https://service-oss-juzhen.mofaai.com.cn/web/lycx/DM_20241020121227_057.jpg',
        'https://service-oss-juzhen.mofaai.com.cn/web/lycx/DM_20241020121227_058.jpg',
        'https://service-oss-juzhen.mofaai.com.cn/web/lycx/DM_20241020121227_059.jpg',
        'https://service-oss-juzhen.mofaai.com.cn/web/lycx/DM_20241020121227_060.jpg',
        'https://service-oss-juzhen.mofaai.com.cn/web/lycx/DM_20241020121227_061.jpg',
        'https://service-oss-juzhen.mofaai.com.cn/web/lycx/DM_20241020121227_062.jpg',
        'https://service-oss-juzhen.mofaai.com.cn/web/lycx/DM_20241020121227_063.jpg',
        'https://service-oss-juzhen.mofaai.com.cn/web/lycx/DM_20241020121227_065.jpg',
        'https://service-oss-juzhen.mofaai.com.cn/web/lycx/DM_20241020121227_066.jpg',
        'https://service-oss-juzhen.mofaai.com.cn/web/lycx/DM_20241020121227_067.jpg',
        'https://service-oss-juzhen.mofaai.com.cn/web/lycx/DM_20241020121227_068.jpg',
        'https://service-oss-juzhen.mofaai.com.cn/web/lycx/DM_20241020121227_069.jpg',
        'https://service-oss-juzhen.mofaai.com.cn/web/lycx/DM_20241020121227_070.jpg',
        'https://service-oss-juzhen.mofaai.com.cn/web/lycx/DM_20241020121227_071.jpg',
        'https://service-oss-juzhen.mofaai.com.cn/web/lycx/DM_20241020121227_072.jpg',
        'https://service-oss-juzhen.mofaai.com.cn/web/lycx/DM_20241020121227_074.jpg',
        'https://service-oss-juzhen.mofaai.com.cn/web/lycx/DM_20241020121227_075.png',
        'https://service-oss-juzhen.mofaai.com.cn/web/lycx/DM_20241020121227_076.jpg',
        'https://service-oss-juzhen.mofaai.com.cn/web/lycx/DM_20241020121227_077.jpg',
        'https://service-oss-juzhen.mofaai.com.cn/web/lycx/DM_20241020121227_078.jpg',
        'https://service-oss-juzhen.mofaai.com.cn/web/lycx/DM_20241020121227_079.jpg',
        'https://service-oss-juzhen.mofaai.com.cn/web/lycx/DM_20241020121227_080.jpg',
        'https://service-oss-juzhen.mofaai.com.cn/web/lycx/DM_20241020121227_081.jpg',
        'https://service-oss-juzhen.mofaai.com.cn/web/lycx/DM_20241020121227_082.jpg',
        'https://service-oss-juzhen.mofaai.com.cn/web/lycx/DM_20241020121227_084.jpg',
        'https://service-oss-juzhen.mofaai.com.cn/web/lycx/DM_20241020121227_086.jpg',
        'https://service-oss-juzhen.mofaai.com.cn/web/lycx/DM_20241020121227_087.jpg',
        'https://service-oss-juzhen.mofaai.com.cn/web/lycx/DM_20241020121227_088.jpg',
        'https://service-oss-juzhen.mofaai.com.cn/web/lycx/DM_20241020121227_089.jpg',
        'https://service-oss-juzhen.mofaai.com.cn/web/lycx/DM_20241020121227_090.jpg',
        'https://service-oss-juzhen.mofaai.com.cn/web/lycx/DM_20241020121227_092.jpg',
        'https://service-oss-juzhen.mofaai.com.cn/web/lycx/DM_20241020121227_093.jpg',
        'https://service-oss-juzhen.mofaai.com.cn/web/lycx/DM_20241020121227_094.jpg',
        'https://service-oss-juzhen.mofaai.com.cn/web/lycx/DM_20241020121227_095.jpg',
        'https://service-oss-juzhen.mofaai.com.cn/web/lycx/DM_20241020121227_097.jpg',
        'https://service-oss-juzhen.mofaai.com.cn/web/lycx/DM_20241020121227_103.png',
        'https://service-oss-juzhen.mofaai.com.cn/web/lycx/DM_20241020121227_104.jpg',
        'https://service-oss-juzhen.mofaai.com.cn/web/lycx/DM_20241020121227_109.jpg',
        'https://service-oss-juzhen.mofaai.com.cn/web/lycx/DM_20241020121349_042.jpg',
        'https://service-oss-juzhen.mofaai.com.cn/web/lycx/DM_20241020121349_043.jpg',
        'https://service-oss-juzhen.mofaai.com.cn/web/lycx/DM_20241020121349_054.jpg',
        'https://service-oss-juzhen.mofaai.com.cn/web/lycx/DM_20241020121349_062.jpg',
        'https://service-oss-juzhen.mofaai.com.cn/web/jypx/DM_20241020122709_071.jpg',
        'https://service-oss-juzhen.mofaai.com.cn/web/jypx/DM_20241020122709_074.jpg',
        'https://service-oss-juzhen.mofaai.com.cn/web/jypx/DM_20241020122730_019.jpg',
        'https://service-oss-juzhen.mofaai.com.cn/web/jypx/DM_20241020122730_020.jpg',
        'https://service-oss-juzhen.mofaai.com.cn/web/jypx/DM_20241020122730_021.jpg',
        'https://service-oss-juzhen.mofaai.com.cn/web/jypx/DM_20241020122730_023.jpg',
        'https://service-oss-juzhen.mofaai.com.cn/web/jypx/DM_20241020122730_024.jpg',
        'https://service-oss-juzhen.mofaai.com.cn/web/jypx/DM_20241020122730_025.jpg',
        'https://service-oss-juzhen.mofaai.com.cn/web/jypx/DM_20241020122730_026.jpg',
        'https://service-oss-juzhen.mofaai.com.cn/web/jypx/DM_20241020122730_027.jpg',
        'https://service-oss-juzhen.mofaai.com.cn/web/jypx/DM_20241020122730_059.jpg'
    ];

    return (
        // <Container sx={{ height: '80vh', display: 'flex', justifyContent: 'center', alignItems: 'center', position: 'relative' }}>
        //     <Grid
        //         container
        //         justifyContent="space-between"
        //         alignItems="center"
        //         sx={{ mt: { xs: 10, sm: 6, md: 18.75 }, mb: { xs: 2.5, md: 10 } }}
        //     >
        //         <Grid item xs={12} md={5}>
        //             <Grid container spacing={5}>
        //                 <Grid item xs={12}>
        //                     <motion.div
        //                         initial={{ opacity: 0, translateY: 550 }}
        //                         animate={{ opacity: 1, translateY: 0 }}
        //                         transition={{ type: 'spring', stiffness: 150, damping: 30 }}
        //                     >
        //                         <Stack spacing={2}>
        //                             <Typography textAlign={{ xs: 'center', md: 'left' }} variant="h2" sx={headerSX}>
        //                                 {/* {t('homepage.title.slogan')} */}
        //                                 多平台多账号
        //                             </Typography>
        //                             <Typography textAlign={{ xs: 'center', md: 'left' }} variant="h2" sx={headerSX}>
        //                                 AI内容创作运营工具
        //                             </Typography>
        //                             {/* <Typography fontWeight={400} textAlign={{ xs: 'center', md: 'left' }} variant="h2">
        //                                 免费下载使用
        //                             </Typography> */}

        //                             {/* <Typography
        //                                 textAlign={{ xs: 'center', md: 'left' }}
        //                                 variant="h2"
        //                                 color="primary"
        //                                 sx={{
        //                                     '& .slick-current': {
        //                                         '.MuiTypography-root': { color: theme.palette.primary.main }
        //                                     },
        //                                     '& .slick-slider': {
        //                                         '.MuiTypography-root': {
        //                                             fontSize: { xs: '1.5rem', sm: '1.5rem', md: '1.5rem', lg: '1.5rem' },
        //                                             cursor: 'pointer'
        //                                         }
        //                                     }
        //                                 }}
        //                             >
        //                                 <Slider {...settings}>
        //                                     <div>
        //                                         <Typography color="text.hint" variant="h2">
        //                                             {t('homepage.title.pro1')}
        //                                         </Typography>
        //                                     </div>
        //                                     <div>
        //                                         <Typography color="text.hint" variant="h2">
        //                                             {t('homepage.title.pro2')}
        //                                         </Typography>
        //                                     </div>
        //                                     <div>
        //                                         <Typography color="text.hint" variant="h2">
        //                                             {t('homepage.title.pro3')}
        //                                         </Typography>
        //                                     </div>
        //                                     <div>
        //                                         <Typography color="text.hint" variant="h2">
        //                                             {t('homepage.title.pro1')}
        //                                         </Typography>
        //                                     </div>
        //                                     <div>
        //                                         <Typography color="text.hint" variant="h2">
        //                                             {t('homepage.title.pro2')}
        //                                         </Typography>
        //                                     </div>
        //                                     <div>
        //                                         <Typography color="text.hint" variant="h2">
        //                                             {t('homepage.title.pro3')}
        //                                         </Typography>
        //                                     </div>
        //                                 </Slider>
        //                             </Typography> */}
        //                         </Stack>
        //                     </motion.div>
        //                 </Grid>
        //                 <Grid item xs={12} sx={{ mt: -2.5, textAlign: { xs: 'center', md: 'left' } }}>
        //                     <motion.div
        //                         initial={{ opacity: 0, translateY: 550 }}
        //                         animate={{ opacity: 1, translateY: 0 }}
        //                         transition={{ type: 'spring', stiffness: 150, damping: 30, delay: 0.2 }}
        //                     >
        //                         <Typography
        //                             textAlign={{ xs: 'center', md: 'left' }}
        //                             color="text.primary"
        //                             variant="body1"
        //                             sx={{ fontSize: { xs: '1rem', md: '1.125rem' } }}
        //                         >
        //                             {/* {t('homepage.title.spread')} */}
        //                             主流内容创作平台多账号登录，多模态 AI 生成，作品一键分发，数据综合分析
        //                         </Typography>
        //                     </motion.div>
        //                 </Grid>
        //                 <Grid item xs={12}>
        //                     <motion.div
        //                         initial={{ opacity: 0, translateY: 550 }}
        //                         animate={{ opacity: 1, translateY: 0 }}
        //                         transition={{ type: 'spring', stiffness: 150, damping: 30, delay: 0.4 }}
        //                     >
        //                         <Grid container spacing={2} sx={{ justifyContent: { xs: 'center', md: 'flex-start' } }}>
        //                             <Grid item className="flex gap-4">
        //                                 {/* <AnimateButton> */}
        //                                 {/* <Button
        //                                         onClick={() => {
        //                                             navigate(DASHBOARD_PATH);
        //                                             setRoutesIndex(0);
        //                                         }}
        //                                         variant="contained"
        //                                         size="large"
        //                                         color="secondary"
        //                                         startIcon={<StarIcon />}
        //                                     >
        //                                         开始免费创作
        //                                     </Button> */}
        //                                 <div className="flex w-[175px] h-[50px] rounded-[50px] bg-[#673ab7] text-[16px] text-[#fff] items-center justify-center cursor-pointer">
        //                                     <Image width={20} src={windowsFill} preview={false} />
        //                                     <div className="ml-[5px] mt-[4px]" onClick={() => winClientDownload()}>
        //                                         Windows 下载
        //                                     </div>
        //                                 </div>
        //                                 <div
        //                                     className="flex w-[175px] h-[50px] rounded-[50px] bg-[#673ab7] text-[16px] text-[#fff] items-center justify-center cursor-pointer"
        //                                     onClick={() => macClientDownload()}
        //                                 >
        //                                     <Image width={20} src={iosFill} preview={false} />
        //                                     <div className="ml-[5px] mt-[4px]">MacOS 下载</div>
        //                                 </div>
        //                                 {/* <Button
        //                                         onClick={() => {
        //                                             navigate(DASHBOARD_PATH);
        //                                             setRoutesIndex(0);
        //                                         }}
        //                                         variant="contained"
        //                                         color="secondary"
        //                                         startIcon={<StarIcon />}
        //                                     >
        //                                         Windows 下载
        //                                     </Button> */}
        //                                 {/* </AnimateButton> */}
        //                             </Grid>
        //                         </Grid>
        //                         <div className="text-[14px] text-[#000]/50 mt-[20px]">
        //                             版本：{version}
        //                             <Divider type="vertical" /> 更新：{dayjs(releaseDate).format('YYYY-MM-DD')}
        //                             <Divider type="vertical" />
        //                             适应系统：Win7以上 / Mac
        //                         </div>
        //                     </motion.div>
        //                 </Grid>
        //                 <Grid item xs={12}>
        //                     <motion.div
        //                         initial={{ opacity: 0, translateY: 550 }}
        //                         animate={{ opacity: 1, translateY: 0 }}
        //                         transition={{ type: 'spring', stiffness: 150, damping: 30, delay: 0.6 }}
        //                     >
        //                         <Stack direction="row" spacing={2} alignItems="center" justifyContent={{ xs: 'center', md: 'flex-start' }}>
        //                             <CardMedia component="img" image={img1} alt="img1" sx={{ width: { xs: '8%', sm: '8%', md: '11%' } }} />
        //                             {/* <CardMedia component="img" image={img2} alt="img2" sx={{ width: { xs: '8%', sm: '8%', md: '11%' } }} /> */}
        //                             <CardMedia component="img" image={img3} alt="img3" sx={{ width: { xs: '8%', sm: '8%', md: '11%' } }} />
        //                             <CardMedia component="img" image={vodeo} alt="img4" sx={{ width: { xs: '7%', sm: '7%', md: '10%' } }} />
        //                             <CardMedia component="img" image={bili} alt="bili" sx={{ width: { xs: '6%', sm: '6%', md: '9%' } }} />
        //                             <CardMedia component="img" image={kuai} alt="kuai" sx={{ width: { xs: '6%', sm: '6%', md: '9%' } }} />
        //                             {/* <CardMedia component="img" image={img4} alt="img4" sx={{ width: { xs: '8%', sm: '8%', md: '11%' } }} />
        //                             <CardMedia component="img" image={img5} alt="img5" sx={{ width: { xs: '8%', sm: '8%', md: '11%' } }} />
        //                             <CardMedia component="img" image={img6} alt="img6" sx={{ width: { xs: '8%', sm: '8%', md: '11%' } }} />
        //                             <CardMedia component="img" image={img7} alt="img7" sx={{ width: { xs: '8%', sm: '8%', md: '11%' } }} />
        //                             <CardMedia component="img" image={img8} alt="img8" sx={{ width: { xs: '8%', sm: '8%', md: '11%' } }} />
        //                             <CardMedia component="img" image={img9} alt="img9" sx={{ width: { xs: '8%', sm: '8%', md: '11%' } }} /> */}
        //                         </Stack>
        //                     </motion.div>
        //                 </Grid>
        //             </Grid>
        //         </Grid>
        //         <Grid item xs={12} md={7} sx={{ display: { xs: 'none', md: 'flex' } }}>
        //             <Box sx={{ position: 'relative', mt: 8.75, zIndex: 9 }}>
        //                 <HeaderImage src={dashboard} alt="Berry" />
        //                 <Box
        //                     sx={{
        //                         position: 'absolute',
        //                         top: { md: -35, lg: -110 },
        //                         right: theme.direction === 'rtl' ? 170 : { md: -50, lg: -140, xl: -220 },
        //                         width: { md: 220, lg: 290 },
        //                         animation: '10s slideY linear infinite'
        //                     }}
        //                 >
        //                     <motion.div
        //                         initial={{ opacity: 0, scale: 0 }}
        //                         animate={{ opacity: 1, scale: 1 }}
        //                         transition={{ type: 'spring', stiffness: 150, damping: 30, delay: 0.2 }}
        //                     >
        //                         <HeaderAnimationImage src={widget1} alt="Berry" />
        //                     </motion.div>
        //                 </Box>
        //                 <Box
        //                     sx={{
        //                         position: 'absolute',
        //                         bottom: { md: -20, lg: -90 },
        //                         left: { md: 100, lg: 300 },
        //                         width: { md: 220, lg: 280 },
        //                         animation: '10s slideY linear infinite',
        //                         animationDelay: '2s'
        //                     }}
        //                 >
        //                     <motion.div
        //                         initial={{ opacity: 0, scale: 0 }}
        //                         animate={{ opacity: 1, scale: 1 }}
        //                         transition={{ type: 'spring', stiffness: 150, damping: 30, delay: 0.4 }}
        //                     >
        //                         <HeaderAnimationImage src={widget2} alt="Berry" />
        //                     </motion.div>
        //                 </Box>
        //             </Box>
        //             {HeaderAnimationImagememo}
        //         </Grid>
        //     </Grid>
        // </Container>
        <Box className="flex items-center flex-col" sx={{ mt: { xs: 15, sm: 11, md: 16, lg: 25 }, mb: { xs: 2.5, md: 10 } }}>
            <div className="px-4 2xl:text-8xl xs:text-2xl sm:text-4xl md:text-6xl text-6xl text-center font-[600]">
                小红书图文笔记智能创作平台
            </div>
            <div className="px-4 text-[#5b5b66] text-xl xs:text-sm sm:text-base md:text-xl text-center 2xl:my-[40px] my-[30px] sm:my-[20px] xs:my-[20px] md:my-[30px]">
                利用AI帮助品牌和创作者快速建立自动化和智能化的营销内容生产能力
            </div>
            <div
                onClick={() => {
                    navigate('/appMarket');
                }}
                className="flex justify-center items-center  cursor-pointer text-white bg-[#673ab7] px-4 py-2 rounded-md font-[600] leading-[150%] text-[20px] w-[150px] xs:w-[auto] xs:text-sm sm:text-[10px] sm:text-base md:w-[150px] md:text-lg"
            >
                开启创作
            </div>
            <div className="2xl:mt-[100px] mt-[50px] w-full flex flex-self-center overflow-hidden whitespace-nowrap">
                <div className="flex gap-4 items-center marquee-track">
                    <div className="flex items-center gap-4">
                        {foodList.map((item) => (
                            <Image
                                loading="lazy"
                                width={150}
                                src={item + '?x-oss-process=image/resize,w_150/quality,q_80'}
                                preview={false}
                                key={item}
                            />
                        ))}
                    </div>
                    {/* <div className="flex items-center gap-4">
                        {foodList.map((item) => (
                            <Image width={150} src={item} preview={false} key={item} />
                        ))}
                    </div> */}
                </div>
            </div>
            <div className="flex flex-none self-end overflow-hidden whitespace-nowrap mt-4">
                <div className="flex gap-4 items-center marquee-track-right">
                    <div className="flex items-center gap-4">
                        {furnitureList.map((item) => (
                            <Image
                                loading="lazy"
                                width={150}
                                src={item + '?x-oss-process=image/resize,w_150/quality,q_80'}
                                preview={false}
                                key={item}
                            />
                        ))}
                    </div>
                    {/* <div className="flex items-center gap-4">
                        {furnitureList.map((item) => (
                            <Image width={150} src={item} preview={false} key={item} />
                        ))}
                    </div> */}
                </div>
            </div>
            <div className="w-full flex flex-self-center overflow-hidden whitespace-nowrap mt-4">
                <div className="flex gap-4 items-center marquee-track">
                    <div className="flex items-center gap-4">
                        {educationList.map((item) => (
                            <Image
                                loading="lazy"
                                width={150}
                                src={item + '?x-oss-process=image/resize,w_150/quality,q_80'}
                                preview={false}
                                key={item}
                            />
                        ))}
                    </div>
                    {/* <div className="flex items-center gap-4">
                        {educationList.map((item) => (
                            <Image width={150} src={item} preview={false} key={item} />
                        ))}
                    </div> */}
                </div>
            </div>
        </Box>
    );
};

export default HeaderSection;
