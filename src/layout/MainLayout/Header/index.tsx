// material-ui
import { Avatar, Box, Button, FormControlLabel, Switch, Typography, useMediaQuery, CardMedia, Tabs, Tab } from '@mui/material';
import { Popover } from 'antd';
import { useTheme } from '@mui/material/styles';
import { useEffect, useState } from 'react';
// project imports
import LAYOUT_CONST from 'constant';
import useConfig from 'hooks/useConfig';
import LogoSection from '../LogoSection';
import LocalizationSection from './LocalizationSection';
import MobileSection from './MobileSection';
import ProfileSection from './ProfileSection';
import SearchSection from './SearchSection';
// import MegaMenuSection from './MegaMenuSection';
// import NotificationSection from './NotificationSection';
import QrCode2Icon from '@mui/icons-material/QrCode2';
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';

import { useDispatch, useSelector } from 'store';
import { openDrawer } from 'store/slices/menu';

import wechat1 from 'assets/images/landing/wechat.png';
import workWechatPay from 'assets/images/landing/work_wechat_pay.png';
// assets
import { IconMenu2 } from '@tabler/icons';
import { t } from 'hooks/web/useI18n';
import { useNavigate } from 'react-router-dom';
import { DownLoadBtn, PayBtn } from './DownloadBtn';
import { CACHE_KEY, useCache } from 'hooks/web/useCache';
const { wsCache } = useCache();
import './index.css';
import React from 'react';
import useRouteStore from 'store/router';
import { isMobile } from 'react-device-detect';
import CloseIcon from '@mui/icons-material/Close';
import dayjs from 'dayjs';
import { ENUM_PERMISSION, getPermission } from 'utils/permission';

// ==============================|| MAIN NAVBAR / HEADER ||============================== //

const isMac = () => {
    return navigator.userAgent.toUpperCase().indexOf('MAC') >= 0;
};

function a11yProps(index: number) {
    return {
        id: `simple-tab-${index}`,
        'aria-controls': `simple-tabpanel-${index}`
    };
}

const Header = () => {
    const theme = useTheme();
    const { navType, onChangeMenuType } = useConfig();
    const dispatch = useDispatch();
    const { drawerOpen } = useSelector((state) => state.menu);
    const navigate = useNavigate();

    const matchDownMd = useMediaQuery(theme.breakpoints.down('md'));
    const { layout } = useConfig();

    const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
    const open = Boolean(anchorEl);
    const { setRoutesIndex, routesIndex } = useRouteStore((state) => state);
    const [logoPopoverOpen, setLogoPopoverOpen] = useState(false);
    const handleClick = (event: React.MouseEvent<HTMLElement>) => {
        setAnchorEl(event.currentTarget);
    };
    const handleClose = () => {
        setAnchorEl(null);
    };
    const firstMenu = wsCache.get(CACHE_KEY.ROLE_ROUTERS)?.find((item: any) => item.name === 'mofaai')?.children;

    const handleChange = (event: React.SyntheticEvent, newValue: number) => {
        const currentData = firstMenu[newValue];
        navigate(currentData.path);
        setRoutesIndex(newValue);
    };

    useEffect(() => {
        const dateTime = localStorage.getItem('tipsEndTime');
        if (dateTime) {
            if (new Date().getTime() - new Date(dateTime).getTime() > 0) {
                setLogoPopoverOpen(true);
            } else {
                setLogoPopoverOpen(false);
            }
        } else {
            setLogoPopoverOpen(true);
        }
    }, []);

    useEffect(() => {
        const tabIndex = Number(localStorage.getItem('routesIndex') || '0');
        setRoutesIndex(tabIndex);
    }, []);

    // @ts-ignore
    return (
        <>
            {/* logo & toggler button */}
            <Box
                sx={{
                    width: 208,
                    display: 'flex',
                    alignItems: 'center',
                    [theme.breakpoints.down('md')]: {
                        width: 'auto'
                    }
                }}
            >
                <Popover
                    open={logoPopoverOpen}
                    rootClassName="logo_popover"
                    placement="bottomRight"
                    title={'小提示:'}
                    content={
                        <div className="relative">
                            <span
                                onClick={() => {
                                    const tipsEndTime = dayjs().add(3, 'day').format('YYYY-MM-DD HH:mm:ss');
                                    localStorage.setItem('tipsEndTime', tipsEndTime);
                                    setLogoPopoverOpen(false);
                                }}
                            >
                                <CloseIcon className="absolute right-[-3px] top-[-35px] text-base cursor-pointer" />
                            </span>
                            {isMac() ? <p>按「command+D」收藏本站 或 拖动LOGO到书签栏</p> : <p>按「ctrl+D」收藏本站 或 拖动LOGO到书签栏</p>}
                        </div>
                    }
                    zIndex={9999}
                >
                    <Box component="span" sx={{ display: { xs: 'none', md: 'block' }, flexGrow: 1 }}>
                        <LogoSection />
                    </Box>
                </Popover>
                {(layout === LAYOUT_CONST.VERTICAL_LAYOUT || (layout === LAYOUT_CONST.HORIZONTAL_LAYOUT && matchDownMd)) && (
                    <Avatar
                        variant="rounded"
                        sx={{
                            ...theme.typography.commonAvatar,
                            ...theme.typography.mediumAvatar,
                            overflow: 'hidden',
                            transition: 'all .2s ease-in-out',
                            background: theme.palette.mode === 'dark' ? theme.palette.dark.main : theme.palette.secondary.light,
                            color: theme.palette.mode === 'dark' ? theme.palette.secondary.main : theme.palette.secondary.dark,
                            '&:hover': {
                                background: theme.palette.mode === 'dark' ? theme.palette.secondary.main : theme.palette.secondary.dark,
                                color: theme.palette.mode === 'dark' ? theme.palette.secondary.light : theme.palette.secondary.light
                            }
                        }}
                        onClick={() => dispatch(openDrawer(!drawerOpen))}
                        color="inherit"
                    >
                        <IconMenu2 stroke={1.5} size="20px" />
                    </Avatar>
                )}
            </Box>
            {!isMobile && (
                <>
                    <Tabs
                        indicatorColor={'secondary'}
                        className="ml-3"
                        textColor={'secondary'}
                        value={routesIndex}
                        onChange={handleChange}
                        sx={{
                            '.MuiTabs-flexContainer': {
                                borderBottom: 0
                            },
                            '.MuiTab-textColorSecondary': {
                                padding: '32px 18px',
                                minWidth: 0
                            }
                        }}
                    >
                        {firstMenu?.map((item: any, index: number) => (
                            <Tab key={index} label={<span className="text-lg font-semibold"> {item.name} </span>} {...a11yProps(index)} />
                        ))}
                    </Tabs>
                    {getPermission(ENUM_PERMISSION.LAYOUT_SHOW_SUBSCRIBE_BUTTON) && (
                        <div className="mr-2">
                            <PayBtn />
                        </div>
                    )}
                    <Box sx={{ flexGrow: 1 }} />
                    <Box sx={{ flexGrow: 1 }} />
                </>
            )}
            {getPermission(ENUM_PERMISSION.LAYOUT_SHOW_QRCODE) && (
                <Popover
                    zIndex={9999}
                    placement="bottom"
                    content={
                        <Box display="flex" textAlign="center">
                            <Box width="200px">
                                <Typography mt={2} variant="h3">
                                    微信扫码入群
                                </Typography>
                                <Typography my={1} fontSize="12px" color="#697586">
                                    魔法AI跨境交流群
                                </Typography>
                                <Box display="flex" justifyContent="center">
                                    <CardMedia component="img" image={wechat1} alt="img1" sx={{ width: '50%' }} />
                                </Box>
                                <Typography textAlign="left" my={1} fontSize="12px" color="#697586">
                                    讨论如何使用、使用技巧、新场景开发、亚马逊，独立者，外贸B2B成功案例、以及跨境相关运营、热点、技能、经营技巧等。
                                </Typography>
                            </Box>
                            <Box width="200px" ml={3}>
                                <Typography mt={2} variant="h3">
                                    专属客服企微
                                </Typography>
                                <Typography my={1} fontSize="12px" color="#697586">
                                    专属客服
                                </Typography>
                                <Box display="flex" justifyContent="center">
                                    <CardMedia component="img" image={workWechatPay} alt="img1" sx={{ width: '50%' }} />
                                </Box>
                                <Typography textAlign="left" my={1} fontSize="12px" color="#697586">
                                    产品功能吐槽、改进建议、跨境AI合作等， 不定期有折扣码发放哦~
                                </Typography>
                            </Box>
                        </Box>
                    }
                    arrow={false}
                >
                    <Box
                        display="flex"
                        alignItems="center"
                        sx={{ cursor: 'pointer', marginRight: '12px' }}
                        onClick={handleClick}
                        className="sm:ml-[47px] xs:ml-[20px]"
                    >
                        <QrCode2Icon />
                        <Typography sx={{ whiteSpace: 'nowrap' }} ml={1}>
                            跨境卖家AI工具群
                        </Typography>
                        <KeyboardArrowDownIcon />
                    </Box>
                </Popover>
            )}
            {/* header search */}
            <SearchSection />

            {isMobile && (
                <>
                    <Box sx={{ flexGrow: 1 }} />
                    <Box sx={{ flexGrow: 1 }} />
                </>
            )}
            {/* mega-menu */}
            {/* <Box sx={{ display: { xs: 'none', sm: 'block' } }}>
                <MegaMenuSection />
            </Box> */}
            {/* <DownLoadBtn /> */}

            {/* <Button
                className="mr-10"
                color={'secondary'}
                size={'small'}
                variant="contained"
                sx={{ display: { xs: 'none', md: 'block' }, boxShadow: 'none' }}
                onClick={() => {
                    navigate('/exchange');
                }}
            >
                {t('EntitlementCard.ppFreegrades')}
            </Button> */}
            {/* <Box sx={{ display: { xs: 'none', sm: 'block' } }}>
                <FormControlLabel
                    value={navType === 'light'}
                    onChange={(e: any) => onChangeMenuType(e.target?.checked ? 'light' : 'dark')}
                    control={<Switch defaultChecked color="secondary" />}
                    label={navType === 'dark' ? 'Dark' : 'Light'}
                    sx={{
                        '& .MuiSvgIcon-root': { fontSize: 28 },
                        '& .MuiFormControlLabel-label': { color: theme.palette.grey[900] }
                    }}
                />
            </Box> */}

            {/* live customization & localization */}
            <Box sx={{ display: { xs: 'none', sm: 'block' } }}>
                <LocalizationSection />
            </Box>

            {/* notification & profile */}
            {/* <NotificationSection /> */}
            <ProfileSection />

            {/* mobile header */}
            <Box sx={{ display: { xs: 'block', sm: 'none' } }}>
                <MobileSection />
            </Box>
        </>
    );
};

export default Header;
