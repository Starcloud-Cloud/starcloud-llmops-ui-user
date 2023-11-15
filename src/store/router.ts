import { create } from 'zustand';
// import { cloneDeep } from 'lodash-es';
import { getAsyncRoutes } from 'api/login';
import { CACHE_KEY, useCache } from 'hooks/web/useCache';
import { generateRoute } from 'utils/routerHelper';
// import remainingroutes from 'router/routes';
import { AppCustomRouteRecordRaw, RouteStore } from 'types/router';

// eslint-disable-next-line react-hooks/rules-of-hooks
const { wsCache } = useCache();
// const allRoutes: MUIRoutes[] = remainingroutes;

const useRouteStore = create<RouteStore>((set) => ({
    routes: [],
    addRouters: [],
    menuTabRouters: [],
    hasCheckedAuth: false,
    accessToken: null,
    routesIndex: 0,
    setRoutesIndex: (index: number) => set({ routesIndex: index }),
    setAccessToken: (token: string | null) => set({ accessToken: token }),
    setHasCheckedAuth: (value: boolean) => set({ hasCheckedAuth: value }),
    setRoutes: (newRoutes: AppCustomRouteRecordRaw[]) => set({ routes: newRoutes }),
    // getRouters: () => get().routes,
    // getAddRouters: () => flatMultiLevelRoutes(cloneDeep(get().addRouters)),
    // getMenuTabRouters: () => get().menuTabRouters,
    generateRoutes: async () => {
        let res: any[];
        if (wsCache.get(CACHE_KEY.ROLE_ROUTERS)) {
            res = wsCache.get(CACHE_KEY.ROLE_ROUTERS);
        } else {
            res = await getAsyncRoutes();
            wsCache.set(CACHE_KEY.ROLE_ROUTERS, res);
        }
        const targetRoute = res.find((route) => route.name === 'mofaai');
        const routerMap = generateRoute(targetRoute?.children);
        // const routerMap = [];
        // ...use transformRoutes with your AppRouteRecordRaw routes array
        // const newRoutes = transformRoutes(routerMap);
        // console.log(newRoutes);
        set((state) => ({
            ...state,
            routes: res,
            addRouters: routerMap
        }));
    },
    setMenuTabRouters: (routers) =>
        set((state) => ({
            ...state,
            menuTabRouters: routers
        }))
}));

export default useRouteStore;
