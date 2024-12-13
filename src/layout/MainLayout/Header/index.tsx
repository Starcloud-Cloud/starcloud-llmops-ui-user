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
import wechat2 from 'assets/images/landing/wechat_2.png';
import mofabijiwechat from 'assets/images/landing/mofabijiwechat.png';
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
import useRouteStore, { routerName } from 'store/router';
import { isMobile } from 'react-device-detect';
import CloseIcon from '@mui/icons-material/Close';
import dayjs from 'dayjs';
import { ENUM_PERMISSION, ENUM_TENANT, getPermission, getTenant } from 'utils/permission';
import { useAllDetail } from '../../../contexts/JWTContext';

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
    const allDetail = useAllDetail();

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
    const firstMenu = wsCache
        .get(CACHE_KEY.ROLE_ROUTERS)
        ?.find((item: any) => item.name === routerName)
        ?.children.filter((item: any) => item.visible);

    const handleChange = (event: React.SyntheticEvent, newValue: number) => {
        const currentData = firstMenu[newValue];
        const reg =
            /(((^https?:(?:\/\/)?)(?:[-:&=\+\$,\w]+@)?[A-Za-z0-9.-]+(?::\d+)?|(?:www.|[-:&=\+\$,\w]+@)[A-Za-z0-9.-]+)((?:\/[\+~%\/.\w-_]*)?\??(?:[-\+=&%@.\w_]*)#?(?:[\w]*))?)$/;
        if (reg.test(currentData.path)) {
            window.open(currentData.path);
        } else {
            navigate(currentData.path);
            setRoutesIndex(newValue);
        }
    };

    useEffect(() => {
        if (allDetail?.allDetail?.id) {
            if (getPermission(ENUM_PERMISSION.COLLECT)) {
                const dateTime = localStorage.getItem(`tipsEndTime-${allDetail?.allDetail?.id}`);
                if (dateTime) {
                    if (new Date().getTime() - new Date(dateTime).getTime() > 0) {
                        // 5分钟后出来
                        setTimeout(() => {
                            setLogoPopoverOpen(true);
                        }, 1000 * 60 * 5);
                    } else {
                        setLogoPopoverOpen(false);
                    }
                } else {
                    // 5分钟后出来
                    setTimeout(() => {
                        setLogoPopoverOpen(true);
                    }, 1000 * 60 * 5);
                }
            }
        }
    }, [allDetail]);

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
                                    // 3天出来
                                    const tipsEndTime = dayjs().add(3, 'day').format('YYYY-MM-DD HH:mm:ss');
                                    localStorage.setItem(`tipsEndTime-${allDetail?.allDetail?.id}`, tipsEndTime);
                                    setLogoPopoverOpen(false);
                                }}
                            >
                                <CloseIcon className="absolute right-[-3px] top-[-35px] text-base cursor-pointer" />
                            </span>
                            {isMac() ? (
                                <p>
                                    按「command+D」收藏本站
                                    <br />
                                    或拖动LOGO到书签栏
                                </p>
                            ) : (
                                <p>
                                    按「ctrl+D」收藏本站
                                    <br />
                                    或拖动LOGO到书签栏
                                </p>
                            )}
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
                                padding: '16px 18px',
                                minWidth: 0
                            }
                        }}
                    >
                        {firstMenu?.map((item: any, index: number) => (
                            <Tab
                                key={index}
                                label={<span className="text-base  font-semibold"> {item.name} </span>}
                                {...a11yProps(index)}
                            />
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
            <Box
                display="flex"
                alignItems="center"
                sx={{ cursor: 'pointer', marginRight: '2px' }}
                onClick={() =>
                    window.open(
                        getTenant() === ENUM_TENANT.AI
                            ? 'https://support.qq.com/products/646091'
                            : 'https://alidocs.dingtalk.com/i/p/a0gX1nnO4R7ONmeJ/docs/6LeBq413JAmaNpD0SyKaQDdZJDOnGvpb'
                    )
                }
                className="sm:ml-[47px] xs:ml-[20px]"
            >
                <svg viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="7564" width="24" height="24">
                    <path
                        d="M883.2 83.2l-742.4 0c-51.2 0-92.8 41.6-92.8 89.6l0 582.4c0 48 41.6 89.6 92.8 89.6l256 0c0 0 6.4 6.4 16 19.2 3.2 3.2 6.4 6.4 9.6 12.8 0 0 6.4 9.6 9.6 12.8 28.8 44.8 51.2 67.2 86.4 67.2 35.2 0 60.8-22.4 89.6-67.2 22.4-35.2 28.8-44.8 28.8-44.8l249.6 0c51.2 0 92.8-41.6 92.8-89.6l0-582.4C976 121.6 934.4 83.2 883.2 83.2zM931.2 755.2c0 25.6-19.2 44.8-44.8 44.8l-252.8 0c-6.4 0-9.6 0-16 3.2-9.6 6.4-19.2 12.8-28.8 28.8-3.2 6.4-22.4 35.2-22.4 35.2-19.2 32-35.2 44.8-48 44.8-12.8 0-25.6-12.8-48-44.8-3.2-3.2-6.4-12.8-9.6-12.8-3.2-6.4-6.4-9.6-9.6-12.8-19.2-25.6-32-38.4-54.4-38.4l-256 0c-25.6 0-44.8-19.2-44.8-44.8l0-582.4c0-25.6 22.4-44.8 48-44.8l742.4 0c25.6 0 48 19.2 48 44.8L934.4 755.2z"
                        p-id="7565"
                    ></path>
                    <path d="M220.8 483.2a1.6 1.6 0 1 0 102.4 0 1.6 1.6 0 1 0-102.4 0Z" p-id="7566"></path>
                    <path d="M460.8 483.2a1.6 1.6 0 1 0 102.4 0 1.6 1.6 0 1 0-102.4 0Z" p-id="7567"></path>
                    <path d="M697.6 483.2a1.6 1.6 0 1 0 102.4 0 1.6 1.6 0 1 0-102.4 0Z" p-id="7568"></path>
                </svg>
                <Typography sx={{ whiteSpace: 'nowrap' }} ml={1}>
                    帮助与反馈
                </Typography>
            </Box>

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
                        className="sm:ml-[20px] xs:ml-[20px]"
                    >
                        <QrCode2Icon />
                        <Typography sx={{ whiteSpace: 'nowrap' }} ml={1}>
                            跨境卖家AI工具群
                        </Typography>
                        <KeyboardArrowDownIcon />
                    </Box>
                </Popover>
            )}
            {!getPermission(ENUM_PERMISSION.LAYOUT_SHOW_QRCODE) && (
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
                                    魔法笔记交流群
                                </Typography>
                                <Box display="flex" justifyContent="center">
                                    <CardMedia
                                        component="img"
                                        image={getTenant() === ENUM_TENANT.AI ? wechat2 : mofabijiwechat}
                                        alt="img1"
                                        sx={{ width: '100%' }}
                                    />
                                </Box>
                                <div className="text-xs my-2">进群领取权益码</div>
                                <div className="text-xs">使用反馈还有赠送哦！</div>
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
                            魔法笔记交流群
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
            {/* <Box sx={{ display: { xs: 'none', sm: 'block' } }}>
                <LocalizationSection />
            </Box> */}

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
