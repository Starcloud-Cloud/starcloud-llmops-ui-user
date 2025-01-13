import { create } from 'zustand';
// import { cloneDeep } from 'lodash-es';
import { getInfos } from 'api/login';
import { CACHE_KEY, useCache } from 'hooks/web/useCache';
import { generateRoute } from 'utils/routerHelper';
// import remainingroutes from 'router/routes';
import { AppCustomRouteRecordRaw, RouteStore } from 'types/router';
import localStorage from 'redux-persist/es/storage';
import { ENUM_PERMISSION, getPermission } from 'utils/permission';

// eslint-disable-next-line react-hooks/rules-of-hooks
const { wsCache } = useCache();
// const allRoutes: MUIRoutes[] = remainingroutes;

export const routerName = getPermission(ENUM_PERMISSION.MENU);

function filterVisibleNodes(tree: any) {
    const filteredTree: any = [];

    function filterNodes(nodes: any) {
        for (const node of nodes) {
            const filteredChildren = filterNodes(node.children || []) as any;
            if (filteredChildren?.length > 0 || !node.children) {
                const filteredNode = { ...node };
                if (filteredChildren?.length > 0) {
                    filteredNode.children = filteredChildren;
                }
                filteredTree.push(filteredNode);
            }
        }
    }

    filterNodes(tree);
    console.log(filteredTree, 'filteredTree');
    return filteredTree;
}

const useRouteStore = create<RouteStore>((set) => ({
    routes: [],
    addRouters: [],
    menuTabRouters: [],
    hasCheckedAuth: false,
    accessToken: null,
    routesIndex: 0,
    setRoutesIndex: (index: number) => {
        localStorage.setItem('routesIndex', index.toString());
        set({ routesIndex: index });
    },
    setAccessToken: (token: string | null) => set({ accessToken: token }),
    setHasCheckedAuth: (value: boolean) => set({ hasCheckedAuth: value }),
    setRoutes: (newRoutes: AppCustomRouteRecordRaw[]) => set({ routes: newRoutes }),
    // getRouters: () => get().routes,
    // getAddRouters: () => flatMultiLevelRoutes(cloneDeep(get().addRouters)),
    // getMenuTabRouters: () => get().menuTabRouters,
    generateRoutes: async () => {
        let res: any[] = [];
        if (wsCache.get(CACHE_KEY.ROLE_ROUTERS)) {
            res = wsCache.get(CACHE_KEY.ROLE_ROUTERS);
        } else if (
            location?.pathname !== '/' &&
            location?.pathname !== '/invite' &&
            location?.pathname !== '/share' &&
            location?.pathname !== '/shareVideo' &&
            location?.pathname !== '/batchShare'
        ) {
            const resData = await getInfos();
            res = resData?.menus;
            wsCache.set(CACHE_KEY.ROLE_ROUTERS, res);
        }
        const targetRoute = res.find((route) => route.name === routerName);
        // console.log(filterVisibleNodes(targetRoute?.children), 'filterVisibleNodes(targetRoute?.children)');
        const routerMap = generateRoute(filterVisibleNodes(targetRoute?.children));
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
