import { Fragment, useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';

// material-ui
import { styled, useTheme } from '@mui/material/styles';
import {
    Box,
    ClickAwayListener,
    Divider,
    List,
    ListItemButton,
    ListItemIcon,
    ListItemText,
    Paper,
    Popper,
    Typography,
    useMediaQuery
} from '@mui/material';

// project imports
import LAYOUT_CONST from 'constant';
import NavCollapse from '../NavCollapse';
import NavItem from '../NavItem';
import useConfig from 'hooks/useConfig';
import Transitions from 'ui-component/extended/Transitions';
import { dispatch, useSelector } from 'store';
import { t } from 'hooks/web/useI18n';

// assets
import { IconChevronDown, IconChevronRight, IconMinusVertical } from '@tabler/icons';
import { NavItemType } from 'types';
import { activeID } from 'store/slices/menu';

// mini-menu - wrapper
const PopperStyled = styled(Popper)(({ theme }) => ({
    overflow: 'visible',
    zIndex: 1202,
    minWidth: 180,
    '&:before': {
        content: '""',
        display: 'block',
        position: 'absolute',
        top: 5,
        left: 32,
        width: 12,
        height: 12,
        transform: 'translateY(-50%) rotate(45deg)',
        zIndex: 120,
        borderWidth: '6px',
        borderStyle: 'solid',
        borderColor: `${theme.palette.background.paper}  transparent transparent ${theme.palette.background.paper}`
    }
}));

// ==============================|| SIDEBAR MENU LIST GROUP ||============================== //

type VirtualElement = {
    getBoundingClientRect: () => ClientRect | DOMRect;
    contextElement?: Element;
};

interface NavGroupProps {
    item: NavItemType;
    lastItem: number;
    remItems: NavItemType[];
    lastItemId: string;
}

const NavGroup = ({ item, lastItem, remItems, lastItemId }: NavGroupProps) => {
    const theme = useTheme();

    const { pathname } = useLocation();
    const { drawerOpen, selectedID } = useSelector((state) => state.menu);
    const { layout, borderRadius } = useConfig();
    const matchDownMd = useMediaQuery(theme.breakpoints.down('md'));
    const [anchorEl, setAnchorEl] = useState<VirtualElement | (() => VirtualElement) | null | undefined>(null);
    const [currentItem, setCurrentItem] = useState(item);

    const openMini = Boolean(anchorEl);

    useEffect(() => {
        if (lastItem) {
            if (item.id === lastItemId) {
                const localItem: any = { ...item };
                const elements = remItems.map((ele: NavItemType) => ele.elements);
                localItem.children = elements.flat(1);
                setCurrentItem(localItem);
            } else {
                setCurrentItem(item);
            }
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [item, lastItem, layout, matchDownMd]);

    const checkOpenForParent = (child: NavItemType[], id: string) => {
        child.forEach((ele: NavItemType) => {
            if (ele.children?.length) {
                checkOpenForParent(ele.children, currentItem.id!);
            }
            if (ele.url === pathname) {
                dispatch(activeID(id));
            }
        });
    };

    const checkSelectedOnload = (data: NavItemType) => {
        const childrens = data.children ? data.children : [];
        childrens.forEach((itemCheck: NavItemType) => {
            if (itemCheck.children?.length) {
                checkOpenForParent(itemCheck.children, currentItem.id!);
            }
            if (itemCheck.url === pathname) {
                dispatch(activeID(currentItem.id!));
            }
        });
    };

    // keep selected-menu on page load and use for horizontal menu close on change routes
    useEffect(() => {
        checkSelectedOnload(currentItem);
        if (openMini) setAnchorEl(null);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [pathname, currentItem]);

    const handleClick = (event: React.MouseEvent<HTMLAnchorElement> | React.MouseEvent<HTMLDivElement, MouseEvent> | undefined) => {
        if (!openMini) {
            setAnchorEl(event?.currentTarget);
        }
    };

    const handleClose = () => {
        setAnchorEl(null);
    };
    const Icon = currentItem?.icon!;
    const itemIcon = currentItem?.icon ? <Icon stroke={1.5} size="20px" /> : null;
    // menu list collapse & items
    const items = currentItem.children?.map((menu) => {
        switch (menu.type) {
            case 'collapse':
                return <NavCollapse key={menu.id} menu={menu} level={1} parentId={currentItem.id!} />;
            case 'item':
                return <NavItem key={menu.id} item={menu} level={1} parentId={currentItem.id!} />;
            default:
                return (
                    <Typography key={menu.id} variant="h6" color="error" align="center">
                        Menu Items Error
                    </Typography>
                );
        }
    });

    const moreItems = remItems.map((itemRem: NavItemType, i) => (
        <Fragment key={i}>
            {itemRem.title && (
                <Typography variant="caption" sx={{ pl: 2 }}>
                    {itemRem.title}
                </Typography>
            )}
            {itemRem.elements?.map((menu) => {
                switch (menu.type) {
                    case 'collapse':
                        return <NavCollapse key={menu.id} menu={menu} level={1} parentId={currentItem.id!} />;
                    case 'item':
                        return <NavItem key={menu.id} item={menu} level={1} parentId={currentItem.id!} />;
                    default:
                        return (
                            <Typography key={menu.id} variant="h6" color="error" align="center">
                                Menu Items Error
                            </Typography>
                        );
                }
            })}
        </Fragment>
    ));

    const popperId = openMini ? `group-pop-${item.id}` : undefined;

    return (
        <>
            {layout === LAYOUT_CONST.VERTICAL_LAYOUT || (layout === LAYOUT_CONST.HORIZONTAL_LAYOUT && matchDownMd) ? (
                <>
                    <List
                        disablePadding={!drawerOpen}
                        subheader={
                            currentItem.title &&
                            drawerOpen && (
                                <Typography variant="caption" sx={{ ...theme.typography.menuCaption }} display="block" gutterBottom>
                                    {currentItem.id === '2208' ? (
                                        <div className="flex items-center">
                                            <span>{currentItem.title}</span>
                                            <svg
                                                viewBox="0 0 1024 1024"
                                                version="1.1"
                                                xmlns="http://www.w3.org/2000/svg"
                                                p-id="1594"
                                                width="36"
                                                height="36"
                                            >
                                                <path
                                                    d="M889.6 272l-758.4 0c-41.6 0-73.6 32-73.6 73.6l0 361.6c0 41.6 32 73.6 73.6 73.6l758.4 0c41.6 0 73.6-32 73.6-73.6l0-361.6C963.2 304 931.2 272 889.6 272zM320 646.4l-51.2 0-99.2-195.2 0 195.2-32 0 0-233.6 44.8 0 102.4 201.6 3.2 0 0-201.6 32 0L320 646.4zM400 512l124.8 0 0 32-124.8 0c0 3.2 0 3.2 0 6.4l0 0c0 41.6 12.8 60.8 38.4 60.8l89.6 0 0 32-89.6 0c-19.2 0-35.2-6.4-48-22.4-12.8-16-19.2-41.6-19.2-70.4 0-12.8 0-28.8 0-54.4 0-54.4 35.2-76.8 70.4-83.2l0 0c12.8 0 80 0 86.4 0l0 32c-28.8 0-73.6 0-83.2 0-12.8 3.2-41.6 12.8-41.6 51.2C400 502.4 400 505.6 400 512zM816 646.4l-44.8 0-44.8-185.6-51.2 185.6-48 0-67.2-233.6 35.2 0 57.6 192 3.2 0 51.2-192 38.4 0 51.2 201.6 60.8-201.6 32 0L816 646.4z"
                                                    p-id="1595"
                                                    fill="#f82307"
                                                ></path>
                                            </svg>
                                        </div>
                                    ) : (
                                        currentItem.title
                                    )}

                                    {currentItem.caption && (
                                        <Typography
                                            variant="caption"
                                            sx={{ ...theme.typography.subMenuCaption }}
                                            display="block"
                                            gutterBottom
                                        >
                                            {currentItem.caption}
                                        </Typography>
                                    )}
                                </Typography>
                            )
                        }
                    >
                        {items}
                    </List>

                    {/* group divider */}
                    {drawerOpen && <Divider sx={{ mt: 0.25, mb: 1.25 }} />}
                </>
            ) : (
                <List>
                    <ListItemButton
                        selected={selectedID === currentItem.id}
                        sx={{
                            borderRadius: `${borderRadius}px`,
                            p: 1,
                            my: 0.5,
                            mr: 1,
                            display: 'flex',
                            alignItems: 'center',
                            backgroundColor: 'inherit'
                        }}
                        onMouseEnter={handleClick}
                        onClick={handleClick}
                        onMouseLeave={handleClose}
                        aria-describedby={popperId}
                    >
                        {itemIcon && (
                            <ListItemIcon sx={{ minWidth: 28 }}>
                                {currentItem.id === lastItemId ? <IconMinusVertical stroke={1.5} size="20px" /> : itemIcon}
                            </ListItemIcon>
                        )}
                        <ListItemText
                            sx={{ mr: 1 }}
                            primary={
                                <Typography variant={selectedID === currentItem.id ? 'h5' : 'body1'} color="inherit">
                                    {currentItem.id === lastItemId ? t('more-items') : currentItem.title}
                                </Typography>
                            }
                        />
                        {openMini ? <IconChevronDown stroke={1.5} size="16px" /> : <IconChevronRight stroke={1.5} size="16px" />}
                        {anchorEl && (
                            <PopperStyled
                                id={popperId}
                                open={openMini}
                                anchorEl={anchorEl}
                                placement="bottom-start"
                                style={{
                                    zIndex: 2001
                                }}
                            >
                                {({ TransitionProps }) => (
                                    <Transitions in={openMini} {...TransitionProps}>
                                        <Paper
                                            sx={{
                                                mt: 0.5,
                                                py: 1.25,
                                                boxShadow: theme.shadows[8],
                                                backgroundImage: 'none'
                                            }}
                                        >
                                            <ClickAwayListener onClickAway={handleClose}>
                                                <Box
                                                    sx={{
                                                        maxHeight: 'calc(100vh - 170px)',
                                                        overflowY: 'auto',
                                                        '&::-webkit-scrollbar': {
                                                            opacity: 0,
                                                            width: 4,
                                                            '&:hover': {
                                                                opacity: 0.7
                                                            }
                                                        },
                                                        '&::-webkit-scrollbar-track': {
                                                            background: 'transparent'
                                                        },
                                                        '&::-webkit-scrollbar-thumb': {
                                                            background: theme.palette.divider,
                                                            borderRadius: 4
                                                        }
                                                    }}
                                                >
                                                    {currentItem.id !== lastItemId ? items : moreItems}
                                                </Box>
                                            </ClickAwayListener>
                                        </Paper>
                                    </Transitions>
                                )}
                            </PopperStyled>
                        )}
                    </ListItemButton>
                </List>
            )}
        </>
    );
};

export default NavGroup;
