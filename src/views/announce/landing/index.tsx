// material-ui
import { styled, useTheme } from '@mui/material/styles';

// project imports
// import Customization from 'layout/Customization';
import AppBar from 'ui-component/extended/AppBar';
import CardSection from './CardSection';
import FeatureSection from './FeatureSection';
import HeaderSection from './HeaderSection';
// import PeopleSection from './PeopleSection';
// import FrameworkSection from './FrameworkSection';
import FooterSection from './FooterSection';
// import CustomizeSection from './CustomizeSection';
import PreBuildDashBoard from './PreBuildDashBoard';
import StartupProjectSection from './StartupProjectSection';
import { useLocation } from 'react-router-dom';
import CustomizeSection from './CustomizeSection';
import VideoSection from './VideoSection';
import { getTenant, ENUM_TENANT } from 'utils/permission';
// import IncludeSection from './IncludeSection';
//import RtlInfoSection from './RtlInfoSection';

// custom stlye
export const HeaderWrapper = styled('div')(({ theme }) => ({
    overflowX: 'hidden',
    overflowY: 'clip',
    background:
        theme.palette.mode === 'dark'
            ? theme.palette.background.default
            : `linear-gradient(360deg, ${theme.palette.grey[100]} 1.09%, ${theme.palette.background.paper} 100%)`,
    [theme.breakpoints.down('md')]: {}
}));

export const SectionWrapper = styled('div')({
    paddingTop: 100,
    paddingBottom: 100
});

// =============================|| LANDING MAIN ||============================= //

const Landing = () => {
    const theme = useTheme();
    const location = useLocation();
    const searchParams = new URLSearchParams(location.search);
    const inviteCode = searchParams.get('q');
    if (inviteCode) {
        const currentTime = new Date().getTime();
        const expiryTime = currentTime + 24 * 60 * 60 * 1000; // 24 hours from now
        localStorage.setItem('inviteCode', inviteCode);
        localStorage.setItem('inviteCodeExpiry', expiryTime.toString());
    }

    return (
        <>
            {/* 1. header and hero section */}
            <HeaderWrapper id="home">
                <AppBar />
                <HeaderSection />
            </HeaderWrapper>

            {getTenant() === ENUM_TENANT.AI && (
                <SectionWrapper sx={{ bgcolor: theme.palette.mode === 'dark' ? 'dark.dark' : 'background.default', pt: '45px' }}>
                    <VideoSection />
                </SectionWrapper>
            )}

            {/* 2. card section */}
            <SectionWrapper sx={{ bgcolor: theme.palette.mode === 'dark' ? 'dark.dark' : 'background.default' }}>
                <CardSection />
            </SectionWrapper>

            {/* 4. Developer Experience section */}

            {/* 3. about section */}
            {/* <SectionWrapper sx={{ bgcolor: theme.palette.mode === 'dark' ? 'dark.dark' : 'background.default' }}>
                <FeatureSection />
            </SectionWrapper> */}

            {/* 4. Apps */}
            {/* <SectionWrapper sx={{ bgcolor: theme.palette.mode === 'dark' ? 'background.default' : 'grey.100' }}>
                <PreBuildDashBoard />
            </SectionWrapper> */}

            {/* 5. people section */}
            {/* <SectionWrapper sx={{ bgcolor: theme.palette.mode === 'dark' ? 'dark.dark' : 'background.default' }}>
                <PeopleSection />
            </SectionWrapper> */}

            {/* 6. startup section */}
            {/* <SectionWrapper sx={{ py: 0 }}>
                <StartupProjectSection />
            </SectionWrapper> */}

            {/* multi-language section */}

            {/*  <SectionWrapper sx={{ py: 0 }}>
                <RtlInfoSection />
            </SectionWrapper> */}

            {/* framework section */}
            {/* <SectionWrapper sx={{ bgcolor: theme.palette.mode === 'dark' ? 'dark.dark' : 'background.default' }}>
                <FrameworkSection />
            </SectionWrapper> */}

            {/* 7. inculde section */}
            {/* <SectionWrapper sx={{ bgcolor: theme.palette.mode === 'dark' ? 'dark.dark' : 'background.default' }}>
                <IncludeSection />
            </SectionWrapper> */}

            {/* footer section */}
            <SectionWrapper sx={{ bgcolor: theme.palette.mode === 'dark' ? 'background.default' : 'dark.900', pb: 0 }}>
                <FooterSection />
            </SectionWrapper>
            {/*<Customization />*/}
        </>
    );
};

export default Landing;
