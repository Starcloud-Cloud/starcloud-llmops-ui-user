import { lazy } from 'react';

// routes
import Loadable from 'ui-component/Loadable';
import AuthGuard from 'utils/route-guard/AuthGuard';
import MinimalLayout from 'layout/MinimalLayout';

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

// ==============================|| ROUTING RENDER ||============================== //

const WebviewRoutes = {
    path: '/',
    element: (
        <AuthGuard>
            <MinimalLayout />
        </AuthGuard>
    ),
    children: [
        // { path: '/', element: <PagesLanding /> },
        { path: '/subscribe', element: <PagesPrice /> },
        { path: '/web-view/exchange', element: <Redemption /> },
        { path: '/web-view/orderRecord', element: <OrderRecord /> },
        { path: '/web-view/account-profile', element: <AppUserAccountProfile /> },
        //AI媒体分发嵌入
        { path: '/copywriting', element: <Copywriting /> },
        { path: '/redBookTaskList', element: <RedBookTaskList /> },
        { path: '/copywritingModal', element: <CopywritingModal /> },
        { path: '/batchSmallRedBook', element: <BatchSmallRedBook /> },
        { path: '/redBookContentList', element: <RedBookContentList /> }
    ]
};

export default WebviewRoutes;
