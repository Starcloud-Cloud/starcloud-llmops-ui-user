import { lazy } from 'react';
import { useRoutes } from 'react-router-dom';

// routes
import LoginRoutes from './LoginRoutes';
import MainRoutes from './MainRoutes';
// import AuthenticationRoutes from './AuthenticationRoutes';
import useRouteStore from 'store/router';
import Loadable from 'ui-component/Loadable';
import AuthenticationRoutes from './AuthenticationRoutes';

const PageNotFound = Loadable(lazy(() => import('views/pages/maintenance/Error')));
const PagesLanding = Loadable(lazy(() => import('views/pages/landing')));
const PagesPrice = Loadable(lazy(() => import('views/pages/pricing/member')));
const PagesChatBot = Loadable(lazy(() => import('views/chat/bot')));
const Execute = Loadable(lazy(() => import('views/iframeExecute')));

// ==============================|| ROUTING RENDER ||============================== //

export default function ThemeRoutes() {
    MainRoutes.children = [...MainRoutes.children, ...useRouteStore((state) => state.addRouters)];
    return useRoutes([
        { path: '/', element: <PagesLanding /> },
        { path: '/subscribe', element: <PagesPrice /> },
        { path: '/app_i/:mediumUid', element: <Execute /> },
        { path: '/app_js/:mediumUid', element: <Execute /> },
        { path: '/app_web/:mediumUid', element: <Execute /> },
        { path: '/cb_i/:mediumUid', element: <PagesChatBot /> },
        { path: '/cb_js/:mediumUid', element: <PagesChatBot /> },
        { path: '/cb_web/:mediumUid', element: <PagesChatBot /> },
        AuthenticationRoutes,
        LoginRoutes,
        MainRoutes
        // { path: '*', element: <PageNotFound /> }
    ]);
}
