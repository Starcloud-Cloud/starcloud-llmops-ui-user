import { ForwardRefExoticComponent, RefAttributes, forwardRef, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';

// material-ui
import CurrencyExchangeIcon from '@mui/icons-material/CurrencyExchange';
import SelfImprovementIcon from '@mui/icons-material/SelfImprovement';
import StarsIcon from '@mui/icons-material/Stars';
import StorefrontIcon from '@mui/icons-material/Storefront';
import ExtensionIcon from '@mui/icons-material/Extension';
import AltRouteIcon from '@mui/icons-material/AltRoute';
import BrushIcon from '@mui/icons-material/Brush';
import FourKIcon from '@mui/icons-material/FourK';
import ManageAccountsIcon from '@mui/icons-material/ManageAccounts';
import UpgradeIcon from '@mui/icons-material/Upgrade';
import ImageIcon from '@mui/icons-material/Image';
import SmartToyIcon from '@mui/icons-material/SmartToy';
import AttachFileIcon from '@mui/icons-material/AttachFile';
import VoicemailIcon from '@mui/icons-material/Voicemail';
import ChatIcon from '@mui/icons-material/Chat';
import HdOutlinedIcon from '@mui/icons-material/HdOutlined';
import Groups2Icon from '@mui/icons-material/Groups2';
import FormatShapesIcon from '@mui/icons-material/FormatShapes';
import GradingIcon from '@mui/icons-material/Grading';
import AutoGraphIcon from '@mui/icons-material/AutoGraph';
import AbcIcon from '@mui/icons-material/Abc';
import PermMedia from '@mui/icons-material/PermMedia';
import SearchOff from '@mui/icons-material/SearchOff';
import FormatShapes from '@mui/icons-material/FormatShapes';
import FolderCopy from '@mui/icons-material/FolderCopy';

import { Avatar, ButtonBase, Chip, ListItemButton, ListItemIcon, ListItemText, Typography, useMediaQuery } from '@mui/material';
import { useTheme } from '@mui/material/styles';

// project imports
import LAYOUT_CONST from 'constant';
import useConfig from 'hooks/useConfig';
import { useDispatch, useSelector } from 'store';
import { activeID, activeItem, openDrawer } from 'store/slices/menu';

// assets
import FiberManualRecordIcon from '@mui/icons-material/FiberManualRecord';
import { LinkTarget } from 'types';

// ==============================|| SIDEBAR MENU LIST ITEMS ||============================== //

interface NavItemProps {
    item: any;
    level: number;
    parentId: string;
}

const NavItem = ({ item, level, parentId }: NavItemProps) => {
    const theme = useTheme();
    const matchesSM = useMediaQuery(theme.breakpoints.down('lg'));
    const matchDownMd = useMediaQuery(theme.breakpoints.down('md'));
    const dispatch = useDispatch();
    const { pathname } = useLocation();
    const { layout, borderRadius } = useConfig();

    const { selectedItem, drawerOpen } = useSelector((state) => state.menu);
    // const isSelected = selectedItem.findIndex((id) => id === item.id) > -1;
    const isSelected = `/${item.url}` === window.location.pathname;

    const obj: { [key: string]: React.ElementType } = {
        StorefrontIcon,
        StarsIcon,
        VoicemailIcon,
        SelfImprovementIcon,
        CurrencyExchangeIcon,
        UpgradeIcon,
        ImageIcon,
        SmartToyIcon,
        AttachFileIcon,
        HdOutlinedIcon,
        ChatIcon,
        Groups2Icon,
        FormatShapesIcon,
        AltRouteIcon,
        BrushIcon,
        FourKIcon,
        ManageAccountsIcon,
        AutoGraphIcon,
        GradingIcon,
        AbcIcon,
        ExtensionIcon,
        SearchOff,
        PermMedia,
        FormatShapes,
        FolderCopy
    };
    const Icon = item?.icon ? obj[item.icon] || FiberManualRecordIcon : FiberManualRecordIcon;

    const itemIcon = item?.icon ? (
        <Icon
            stroke={1.5}
            size={drawerOpen ? '20px' : '24px'}
            style={{ color: isSelected ? theme.palette.secondary.main : theme.palette.text.primary }}
        />
    ) : (
        <FiberManualRecordIcon
            sx={{
                color: isSelected ? theme.palette.secondary.main : theme.palette.text.primary,
                width: selectedItem.findIndex((id) => id === item?.id) > -1 ? 8 : 6,
                height: selectedItem.findIndex((id) => id === item?.id) > -1 ? 8 : 6
            }}
            fontSize={level > 0 ? 'inherit' : 'medium'}
        />
    );

    let itemTarget: LinkTarget = '_self';
    if (item.target) {
        itemTarget = '_blank';
    }
    const reg =
        /(((^https?:(?:\/\/)?)(?:[-:&=\+\$,\w]+@)?[A-Za-z0-9.-]+(?::\d+)?|(?:www.|[-:&=\+\$,\w]+@)[A-Za-z0-9.-]+)((?:\/[\+~%\/.\w-_]*)?\??(?:[-\+=&%@.\w_]*)#?(?:[\w]*))?)$/;
    console.log(item);

    let listItemProps: {
        component: ForwardRefExoticComponent<RefAttributes<HTMLAnchorElement>> | string;
        href?: string;
        target?: LinkTarget;
    } = {
        component: forwardRef((props, ref) =>
            reg.test(item.url) ? (
                <Link target="_blank" ref={ref} {...props} to={item.url!} />
            ) : (
                <Link ref={ref} {...props} to={item.url!} target={itemTarget} />
            )
        )
    };
    if (item?.external) {
        listItemProps = { component: 'a', href: item.url, target: itemTarget };
    }

    const itemHandler = (id: string) => {
        dispatch(activeItem([id]));
        if (matchesSM) dispatch(openDrawer(false));
        dispatch(activeID(parentId));
    };

    // active menu item on page load
    useEffect(() => {
        const currentIndex = document.location.pathname
            .toString()
            .split('/')
            .findIndex((id) => id === item.id);
        if (currentIndex > -1) {
            dispatch(activeItem([item.id]));
        }
        // eslint-disable-next-line
    }, [pathname]);

    const textColor = theme.palette.mode === 'dark' ? 'grey.400' : 'text.primary';
    const iconSelectedColor = theme.palette.mode === 'dark' && drawerOpen ? 'text.primary' : 'secondary.main';

    return (
        <>
            {layout === LAYOUT_CONST.VERTICAL_LAYOUT || (layout === LAYOUT_CONST.HORIZONTAL_LAYOUT && matchDownMd) ? (
                <ListItemButton
                    {...listItemProps}
                    disabled={item.disabled}
                    disableRipple={!drawerOpen}
                    sx={{
                        zIndex: 1201,
                        borderRadius: `${borderRadius}px`,
                        mb: 0.5,
                        pl: drawerOpen ? `${level * 24}px` : 1.25,
                        ...(drawerOpen &&
                            level === 1 &&
                            theme.palette.mode !== 'dark' && {
                                '&:hover': {
                                    background: theme.palette.secondary.light
                                },
                                '&.Mui-selected': {
                                    background: theme.palette.secondary.light,
                                    color: iconSelectedColor,
                                    '&:hover': {
                                        color: iconSelectedColor,
                                        background: theme.palette.secondary.light
                                    }
                                }
                            }),
                        ...((!drawerOpen || level !== 1) && {
                            py: level === 1 ? 0 : 1,
                            '&:hover': {
                                bgcolor: 'transparent'
                            },
                            '&.Mui-selected': {
                                '&:hover': {
                                    bgcolor: 'transparent'
                                },
                                bgcolor: 'transparent'
                            }
                        })
                    }}
                    selected={isSelected}
                    onClick={() => itemHandler(item.id!)}
                >
                    <ButtonBase aria-label="theme-icon" sx={{ borderRadius: `${borderRadius}px` }} disableRipple={drawerOpen}>
                        <ListItemIcon
                            sx={{
                                minWidth: level === 1 ? 36 : 18,
                                color: isSelected ? iconSelectedColor : textColor,
                                ...(!drawerOpen &&
                                    level === 1 && {
                                        borderRadius: `${borderRadius}px`,
                                        width: 46,
                                        height: 46,
                                        alignItems: 'center',
                                        justifyContent: 'center',
                                        '&:hover': {
                                            bgcolor: theme.palette.mode === 'dark' ? theme.palette.secondary.main + 25 : 'secondary.light'
                                        },
                                        ...(isSelected && {
                                            bgcolor: theme.palette.mode === 'dark' ? theme.palette.secondary.main + 25 : 'secondary.light',
                                            '&:hover': {
                                                bgcolor:
                                                    theme.palette.mode === 'dark' ? theme.palette.secondary.main + 30 : 'secondary.light'
                                            }
                                        })
                                    })
                            }}
                        >
                            {itemIcon}
                        </ListItemIcon>
                    </ButtonBase>
                    {(drawerOpen || (!drawerOpen && level !== 1)) && (
                        <ListItemText
                            primary={
                                <Typography variant={isSelected ? 'h5' : 'body1'} color="inherit">
                                    {item.title}
                                </Typography>
                            }
                            secondary={
                                item.caption && (
                                    <Typography variant="caption" sx={{ ...theme.typography.subMenuCaption }} display="block" gutterBottom>
                                        {item.caption}
                                    </Typography>
                                )
                            }
                        />
                    )}

                    {drawerOpen && item.chip && (
                        <Chip
                            color={item.chip.color}
                            variant={item.chip.variant}
                            size={item.chip.size}
                            label={item.chip.label}
                            avatar={item.chip.avatar && <Avatar>{item.chip.avatar}</Avatar>}
                        />
                    )}
                </ListItemButton>
            ) : (
                <ListItemButton
                    {...listItemProps}
                    disabled={item.disabled}
                    sx={{
                        borderRadius: 0,
                        mb: 0.5,
                        alignItems: 'flex-start',
                        backgroundColor: level > 1 ? 'transparent !important' : 'inherit',
                        py: 1,
                        pl: 2
                    }}
                    selected={isSelected}
                    onClick={() => itemHandler(item.id!)}
                >
                    <ListItemIcon
                        sx={{
                            my: 'auto',
                            minWidth: !item?.icon ? 18 : 36
                        }}
                    >
                        {itemIcon}
                    </ListItemIcon>

                    <ListItemText
                        primary={
                            <Typography variant={isSelected ? 'h5' : 'body1'} color="inherit">
                                {item.title}
                            </Typography>
                        }
                        secondary={
                            item.caption && (
                                <Typography variant="caption" sx={{ ...theme.typography.subMenuCaption }} display="block" gutterBottom>
                                    {item.caption}
                                </Typography>
                            )
                        }
                    />

                    {item.chip && (
                        <Chip
                            color={item.chip.color}
                            variant={item.chip.variant}
                            size={item.chip.size}
                            label={item.chip.label}
                            avatar={item.chip.avatar && <Avatar>{item.chip.avatar}</Avatar>}
                        />
                    )}
                </ListItemButton>
            )}
        </>
    );
};

export default NavItem;
