// project import

import { IconChartArcs, IconClipboardList, IconChartInfographic } from '@tabler/icons';
import { NavItemType } from 'types';
import useRouteStore from 'store/router';
import { AppCustomRouteRecordRaw } from 'types/router';
import { useMemo } from 'react';

const icons = {
    widget: IconChartArcs,
    statistics: IconChartArcs,
    data: IconClipboardList,
    chart: IconChartInfographic
};
// ==============================|| MENU ITEMS - API ||============================== //

export const RuoyiMenu = () => {
    const routes = useRouteStore((store) => store.routes);

    const ruoyiMenu = useMemo(() => {
        const convertToNavItemType = (routeObj: AppCustomRouteRecordRaw): NavItemType => {
            let navItem: NavItemType = {
                id: 'ruoyi',
                //@ts-ignore
                icon: icons[routeObj?.icon],
                url: routeObj?.path,
                title: routeObj?.name,
                type: routeObj?.children ? 'collapse' : 'item'
            };

            if (routeObj.children) {
                navItem = { ...navItem, children: routeObj.children.map((childRouteObj) => convertToNavItemType(childRouteObj)) };
            }

            return navItem;
        };
        const convertRouteList = (routeList: AppCustomRouteRecordRaw[]) => {
            return routeList.map((routeObj) => convertToNavItemType(routeObj));
        };
        if (routes) {
            const convertedMenuList = convertRouteList(routes);
            const newRuoyiMenu: NavItemType = {
                id: 'ruoyi',
                type: 'group',
                title: 'Ruoyi',
                color: 'primary',
                children: convertedMenuList
            };
            return newRuoyiMenu;
        }
    }, [routes]); // 仅当 routes 变化时重新计算 getMenu 的值

    return ruoyiMenu;
};
