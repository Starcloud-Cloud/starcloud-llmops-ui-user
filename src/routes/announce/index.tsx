import { lazy } from 'react';
import { useRoutes } from 'react-router-dom';

// routes
import LoginRoutes from './LoginRoutes';
import MainRoutes from './MainRoutes';
import useRouteStore from 'store/router';
import Loadable from 'ui-component/Loadable';
import AuthenticationRoutes from './AuthenticationRoutes';
import WebviewRoutes from './webviewRoutes';
import JuzhengRoutes from './JuzhengRoutes';

const PageNotFound = Loadable(lazy(() => import('views/pages/maintenance/Error')));
const PagesLanding = Loadable(lazy(() => import('views/announce/landing')));
const PagesPrice = Loadable(lazy(() => import('views/announce/pricing/member')));
const AppUserAccountProfile = Loadable(lazy(() => import('views/application/users/account-profile/Profile')));
const OrderRecord = Loadable(lazy(() => import('views/pages/pricing/orderRecord')));
const Copywriting = Loadable(lazy(() => import('views/pages/copywriting')));
const RedBookTaskList = Loadable(lazy(() => import('views/pages/redBookTaskList')));
const CopywritingModal = Loadable(lazy(() => import('views/pages/copywriting/components/addModal')));
const BatchSmallRedBook = Loadable(lazy(() => import('views/pages/batchSmallRedBooks')));
const RedBookContentList = Loadable(lazy(() => import('views/pages/redBookContentList')));
const Fingerprint = Loadable(lazy(() => import('views/fingerprint')));
const Invite = Loadable(lazy(() => import('views/invite')));

// ==============================|| ROUTING RENDER ||============================== //

export default function ThemeRoutes() {
    MainRoutes.children = [...MainRoutes.children, ...useRouteStore((state) => state.addRouters)];
    return useRoutes([
        { path: '/', element: <PagesLanding /> },
        { path: '/fingerprint', element: <Fingerprint /> },
        { path: '/invite', element: <Invite /> },
        // { path: '/subscribe', element: <PagesPrice /> },
        // { path: '/web-view/orderRecord', element: <OrderRecord /> },
        // { path: '/web-view/account-profile', element: <AppUserAccountProfile /> },
        // //AI媒体分发嵌入
        // { path: '/copywriting', element: <Copywriting /> },
        // { path: '/redBookTaskList', element: <RedBookTaskList /> },
        // { path: '/copywritingModal', element: <CopywritingModal /> },
        // { path: '/batchSmallRedBook', element: <BatchSmallRedBook /> },
        // { path: '/redBookContentList', element: <RedBookContentList /> },
        //
        { path: '/admin-api/*', element: null },
        { path: '/app-api/*', element: null },
        WebviewRoutes,
        JuzhengRoutes,
        LoginRoutes,
        MainRoutes,
        AuthenticationRoutes,
        { path: '*', element: <PageNotFound /> }
    ]);
}
