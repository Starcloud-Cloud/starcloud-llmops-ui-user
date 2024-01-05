import { lazy } from 'react';
import { useRoutes } from 'react-router-dom';

// routes
import LoginRoutes from './LoginRoutes';
import MainRoutes from './MainRoutes';
import useRouteStore from 'store/router';
import Loadable from 'ui-component/Loadable';
import AuthenticationRoutes from './AuthenticationRoutes';

const PageNotFound = Loadable(lazy(() => import('views/pages/maintenance/Error')));
const PagesLanding = Loadable(lazy(() => import('views/announce/landing')));
const PagesPrice = Loadable(lazy(() => import('views/announce/pricing/member')));

// ==============================|| ROUTING RENDER ||============================== //

export default function ThemeRoutes() {
    MainRoutes.children = [...MainRoutes.children, ...useRouteStore((state) => state.addRouters)];
    return useRoutes([
        { path: '/', element: <PagesLanding /> },
        { path: '/subscribe', element: <PagesPrice /> },
        { path: '/admin-api/*', element: null },
        { path: '/app-api/*', element: null },
        LoginRoutes,
        MainRoutes,
        AuthenticationRoutes,
        { path: '*', element: <PageNotFound /> }
    ]);
}
