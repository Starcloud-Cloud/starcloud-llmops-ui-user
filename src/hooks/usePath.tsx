import { lazy } from 'react';
import { useMemo } from 'react';
import { AppCustomRouteRecordRaw } from 'types/router';
import useRouteStore, { routerName } from 'store/router';
import Loadable from 'ui-component/Loadable';

interface NavItemType {
    id: string;
    path: string;
    element: any;
    children: any;
}

const usePath = () => {
    const route = useRouteStore((store) => store.routes);

    const routes: any[] = useMemo(() => {
        const convertToNavItemType = (routeObj: AppCustomRouteRecordRaw): NavItemType => {
            let navItem: NavItemType = {
                id: routeObj?.id.toString(),
                path: routeObj?.path,
                element: Loadable(lazy(() => import(`views${routeObj?.component}`))),
                children: routeObj.children && routeObj.children.map((childRouteObj) => convertToNavItemType(childRouteObj))
            };
            return navItem;
        };
        const convertRouteList = (routeList: AppCustomRouteRecordRaw[]) => {
            return routeList.map((routeObj) => convertToNavItemType(routeObj)); // setting isTopLevel as true for all items in routeList
        };
        if (routes) {
            const targetRoute = routes.find((route) => route.name === routerName);
            return targetRoute && targetRoute?.children && convertRouteList(targetRoute?.children);
        }
    }, [route]);
    return routes;
};
export default usePath;
