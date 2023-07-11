import { lazy } from 'react';
import { useRoutes } from 'react-router-dom';

// routes
import LoginRoutes from './LoginRoutes';
import MainRoutes from './MainRoutes';
// import AuthenticationRoutes from './AuthenticationRoutes';
import useRouteStore from 'store/router';
import AuthSingleRouter from './AuthSingleRouter';
import Loadable from 'ui-component/Loadable';
import PictureRoutes from './PictureRoutes';

const PageNotFound = Loadable(lazy(() => import('views/pages/maintenance/Error')));
const PagesLanding = Loadable(lazy(() => import('views/pages/landing')));

// ==============================|| ROUTING RENDER ||============================== //

export default function ThemeRoutes() {
    MainRoutes.children = [...MainRoutes.children, ...useRouteStore((state) => state.addRouters)];
    return useRoutes([
        { path: '/', element: <PagesLanding /> },
        // AuthenticationRoutes,
        LoginRoutes,
        MainRoutes,
        AuthSingleRouter,
        PictureRoutes,
        { path: '*', element: <PageNotFound /> }
    ]);
}
