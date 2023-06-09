import { memo, useEffect } from 'react';

// material-ui
import { useTheme } from '@mui/material/styles';
import { Typography, useMediaQuery } from '@mui/material';

// project imports
import menuItem from 'menu-items';
import NavGroup from './NavGroup';
import useConfig from 'hooks/useConfig';
import { Menu } from 'menu-items/widget';
import { RuoyiMenu } from 'menu-items/ruoyi';

import LAYOUT_CONST from 'constant';
import { HORIZONTAL_MAX_ITEM } from 'config';

// types
import { NavItemType } from 'types';

// ==============================|| SIDEBAR MENU LIST ||============================== //

const MenuList = () => {
    const theme = useTheme();
    const { layout } = useConfig();

    const matchDownMd = useMediaQuery(theme.breakpoints.down('md'));

    useEffect(() => {
        handlerMenuItem();
        // eslint-disable-next-line
    }, []);

    let getMenu = Menu();
    let getRuoyiMenu = RuoyiMenu();
    const handlerMenuItem = () => {
        // const isMenuFound = menuItem.items.some((element) => element.id === 'widget');
        const isRuoyiMenuFound = menuItem.items.some((element) => element.id === 'ruoyi'); // 假设 RuoyiMenu 的 id 为 'ruoyi'

        // if (getMenu?.id !== undefined && !isMenuFound) {
        //     menuItem.items.splice(1, 0, getMenu);
        // }

        if (getRuoyiMenu?.id !== undefined && !isRuoyiMenuFound) {
            // 添加这段代码，判断并添加 RuoyiMenu
            menuItem.items.splice(2, 0, getRuoyiMenu); // 假设你想要将它添加到第三个位置
        }
    };

    // last menu-item to show in horizontal menu bar
    const lastItem = layout === LAYOUT_CONST.HORIZONTAL_LAYOUT && !matchDownMd ? HORIZONTAL_MAX_ITEM : null;

    let lastItemIndex = menuItem.items.length - 1;
    let remItems: NavItemType[] = [];
    let lastItemId: string;

    if (lastItem && lastItem < menuItem.items.length) {
        lastItemId = menuItem.items[lastItem - 1].id!;
        lastItemIndex = lastItem - 1;
        remItems = menuItem.items.slice(lastItem - 1, menuItem.items.length).map((item) => ({
            title: item.title,
            elements: item.children
        }));
    }

    const navItems = menuItem.items.slice(0, lastItemIndex + 1).map((item) => {
        switch (item.type) {
            case 'group':
                return <NavGroup key={item.id} item={item} lastItem={lastItem!} remItems={remItems} lastItemId={lastItemId} />;
            default:
                return (
                    <Typography key={item.id} variant="h6" color="error" align="center">
                        Menu Items Error
                    </Typography>
                );
        }
    });

    return <>{navItems}</>;
};

export default memo(MenuList);
