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

// ==============================|| ROUTING RENDER ||============================== //

export default function ThemeRoutes() {
    MainRoutes.children = [...MainRoutes.children, ...useRouteStore((state) => state.addRouters)];
    return useRoutes([
        { path: '/', element: <PagesLanding /> },
        { path: '/subscribe', element: <PagesPrice /> },
        { path: '/chat-bot/:mode/:mediumUid', element: <PagesChatBot /> },
        AuthenticationRoutes,
        LoginRoutes,
        MainRoutes,
        { path: '*', element: <PageNotFound /> }
    ]);
}
