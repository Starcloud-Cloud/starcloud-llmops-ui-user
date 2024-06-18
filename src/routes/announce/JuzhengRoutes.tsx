import { lazy } from 'react';

// routes
import Loadable from 'ui-component/Loadable';
import AuthGuard from 'utils/route-guard/AuthGuard';
import MinimalLayout from 'layout/MinimalLayout';
import MainLayout from 'layout/MainLayout';
import jsCookie from 'js-cookie';

const PagesPrice = Loadable(lazy(() => import('views/announce/pricing/member')));
const AppUserAccountProfile = Loadable(lazy(() => import('views/application/users/account-profile/Profile')));
const OrderRecord = Loadable(lazy(() => import('views/pages/pricing/orderRecord')));
const Copywriting = Loadable(lazy(() => import('views/pages/copywriting')));
const RedBookTaskList = Loadable(lazy(() => import('views/pages/redBookTaskList')));
const CopywritingModal = Loadable(lazy(() => import('views/pages/copywriting/components/addModal')));
const BatchSmallRedBook = Loadable(lazy(() => import('views/pages/batchSmallRedBooks')));
const RedBookContentList = Loadable(lazy(() => import('views/pages/redBookContentList')));
const PagesLanding = Loadable(lazy(() => import('views/announce/landing')));
const Redemption = Loadable(lazy(() => import('views/rewards/redemption')));
const Market = Loadable(lazy(() => import('views/template/market')));
const ManageMarket = Loadable(lazy(() => import('views/manageMarket')));
const MyTemplate = Loadable(lazy(() => import('views/template/myTemplate')));
const Demo = Loadable(lazy(() => import('views/pages/batchSmallRedBooks/newIndex')));

// ==============================|| ROUTING RENDER ||============================== //

const JuzhengRoutes = {
    path: '/',
    element: <AuthGuard>{jsCookie.get('isClient') ? <MinimalLayout /> : <MainLayout />}</AuthGuard>,
    children: [
        // // { path: '/', element: <PagesLanding /> },
        // { path: '/subscribe', element: <PagesPrice /> },
        // { path: '/web-view/exchange', element: <Redemption /> },
        // { path: '/web-view/orderRecord', element: <OrderRecord /> },
        // { path: '/web-view/account-profile', element: <AppUserAccountProfile /> },
        //AI媒体分发嵌入
        {
            path: '/appMarket',
            element: <Market />
        },
        { path: '/copywriting', element: <Copywriting /> },
        { path: '/redBookTaskList', element: <RedBookTaskList /> },
        { path: '/copywritingModal', element: <CopywritingModal /> },
        { path: '/batchSmallRedBook', element: <BatchSmallRedBook /> },
        { path: '/redBookContentList', element: <RedBookContentList /> },
        { path: '/manageMarket', element: <ManageMarket /> },
        { path: '/myTemplate', element: <MyTemplate /> },
        { path: '/demo', element: <Demo /> }
    ]
};

export default JuzhengRoutes;
