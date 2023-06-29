// project import

import { NavItemType } from 'types';
import useRouteStore from 'store/router';
import { AppCustomRouteRecordRaw } from 'types/router';
import { useMemo } from 'react';

// ==============================|| MENU ITEMS - API ||============================== //

export const RuoyiMenu = () => {
    const routes = useRouteStore((store) => store.routes);
    const ruoyiMenu = useMemo(() => {
        const convertToNavItemType = (routeObj: AppCustomRouteRecordRaw, isTopLevel: boolean = false): NavItemType => {
            let navItem: NavItemType = {
                id: routeObj?.id.toString(),
                //@ts-ignore
                icon: routeObj?.icon,
                url: routeObj?.path,
                title: routeObj?.name,
                type: routeObj?.children ? 'collapse' : 'item',
                ...(isTopLevel && { color: 'primary', type: 'group' }) // Only add color if it's a top-level item
            };

            if (routeObj.children) {
                navItem = { ...navItem, children: routeObj.children.map((childRouteObj) => convertToNavItemType(childRouteObj)) };
            }

            return navItem;
        };
        const convertRouteList = (routeList: AppCustomRouteRecordRaw[]) => {
            return routeList.map((routeObj) => convertToNavItemType(routeObj, true)); // setting isTopLevel as true for all items in routeList
        };
        if (routes) {
            const targetRoute = routes.find((route) => route.name === 'mofaai');
            return targetRoute && targetRoute?.children && convertRouteList(targetRoute?.children);
        }
    }, [routes]); // 仅当 routes 变化时重新计算 getMenu 的值

    return ruoyiMenu;
};
