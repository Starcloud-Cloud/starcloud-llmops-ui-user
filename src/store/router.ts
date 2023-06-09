import { create } from 'zustand';
// import { cloneDeep } from 'lodash-es';
import { getAsyncRoutes } from 'api/login';
import { CACHE_KEY, useCache } from 'hooks/web/useCache';
// import { generateRoute, transformRoutes } from 'utils/routerHelper';
// import remainingroutes from 'router/routes';
import { MUIRoutes, RouteStore } from 'types/router';

// eslint-disable-next-line react-hooks/rules-of-hooks
const { wsCache } = useCache();

// const allRoutes: MUIRoutes[] = remainingroutes;

const useRouteStore = create<RouteStore>((set) => ({
    routes: [],
    //   addRouters: [],
    menuTabRouters: [],
    hasCheckedAuth: false,
    accessToken: null,
    setAccessToken: (token: string | null) => set({ accessToken: token }),
    setHasCheckedAuth: (value: boolean) => set({ hasCheckedAuth: value }),
    setRoutes: (newRoutes: MUIRoutes[]) => set({ routes: newRoutes }),
    // getRouters: () => get().routes,
    // getAddRouters: () => flatMultiLevelRoutes(cloneDeep(get().addRouters)),
    // getMenuTabRouters: () => get().menuTabRouters,
    generateRoutes: async () => {
        let res;
        if (wsCache.get(CACHE_KEY.ROLE_ROUTERS)) {
            res = wsCache.get(CACHE_KEY.ROLE_ROUTERS);
        } else {
            res = await getAsyncRoutes();
            wsCache.set(CACHE_KEY.ROLE_ROUTERS, res);
        }
        // const routerMap = generateRoute(res);
        // // const routerMap = [];
        // // ...use transformRoutes with your AppRouteRecordRaw routes array
        // const newRoutes = transformRoutes(routerMap);
        // console.log(newRoutes);
        set({
            routes: res
        });
    },
    setMenuTabRouters: (routers) =>
        set((state) => ({
            ...state,
            menuTabRouters: routers
        }))
}));

export default useRouteStore;
