import { ComponentType } from 'react';

/**
 * RouteMeta properties are used for custom handling within the application
 * These properties are not natively supported by React Router
 **/
interface RouteMeta {
    hidden?: boolean;
    alwaysShow?: boolean;
    title?: string;
    icon?: string;
    noCache?: boolean;
    breadcrumb?: boolean;
    affix?: boolean;
    activeMenu?: string;
    noTagsView?: boolean;
    followAuth?: string;
    canTo?: boolean;
}

interface AppRouteRecordRaw {
    path: string;
    element: React.ReactNode;
    meta: RouteMeta;
    children?: AppRouteRecordRaw[];
    fullPath?: string;
    keepAlive?: boolean;
}
interface Component {
    (): Promise<{ default: ComponentType }>;
}
interface MUIRoutes {
    key: string;
    type?: 'route' | 'collapse' | 'divider' | 'title';
    name?: string;
    icon?: React.ReactNode;
    route?: string;
    component?: React.ReactNode;
    collapse?: NewRoutes;
}
interface AppCustomRouteRecordRaw {
    id: number;
    icon: any;
    name: string;
    meta: RouteMeta;
    component: string;
    componentName?: string;
    path: string;
    redirect: string;
    children?: AppCustomRouteRecordRaw[];
    keepAlive?: boolean;
    visible?: boolean;
    parentId?: number;
    alwaysShow?: boolean;
}

interface RouteInfo {
    pathname: string;
    search: string;
    hash: string;
    state: unknown;
    params: ReturnType<typeof useParams>;
    // meta: (typeof routeMeta)[string];
}

interface RouteStore {
    routes: AppCustomRouteRecordRaw[];
    menuTabRouters: MUIRoutes[];
    hasCheckedAuth: boolean;
    accessToken: string | null;
    setAccessToken: (token: string | null) => void;
    setHasCheckedAuth: (value: boolean) => void;
    setRoutes: (newRoutes: MUIRoutes[]) => void;
    generateRoutes: () => Promise<void>;
    setMenuTabRouters: (routers: MUIRoutes[]) => void;
}
