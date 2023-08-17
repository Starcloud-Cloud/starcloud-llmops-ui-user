import { lazy } from 'react';

// project imports
import MainLayout from 'layout/MainLayout';
import Loadable from 'ui-component/Loadable';
import AuthGuard from 'utils/route-guard/AuthGuard';

// template routing
const Market = Loadable(lazy(() => import('views/template/market')));
const MarketList = Loadable(lazy(() => import('views/template/market/components/list')));
const MarketDetail = Loadable(lazy(() => import('views/template/market/components/detail')));
const CreateCenter = Loadable(lazy(() => import('views/template/myTemplate')));
const CreateDetail = Loadable(lazy(() => import('views/template/myTemplate/components/createTemplate')));

// Rewards
const Redemption = Loadable(lazy(() => import('views/rewards/redemption')));
const OrderRecord = Loadable(lazy(() => import('views/pages/pricing/orderRecord')));

// pic
const PictureCreate = Loadable(lazy(() => import('views/picture/create')));

// 聊天
const MyChat = Loadable(lazy(() => import('views/template/myChat')));
const CreateChat = Loadable(lazy(() => import('views/template/myChat/createChat')));

// 个人设置
const AppUserAccountProfile = Loadable(lazy(() => import('views/application/users/account-profile/Profile')));

// ==============================|| MAIN ROUTING ||============================== //

const MainRoutes = {
    path: '/',
    element: (
        <AuthGuard>
            <MainLayout />
        </AuthGuard>
    ),
    children: [
        {
            path: '/user/account-profile/profile',
            element: <AppUserAccountProfile />
        },
        {
            path: '/appMarket',
            element: <Market />,
            children: [
                {
                    path: 'list',
                    element: <MarketList />
                },
                {
                    path: 'detail/:uid',
                    element: <MarketDetail />
                }
            ]
        },
        {
            path: '/template/createCenter',
            element: <CreateCenter />
        },
        {
            path: '/createApp',
            element: <CreateDetail />
        },
        {
            path: '/exchange',
            element: <Redemption />
        },
        {
            path: '/orderRecord',
            element: <OrderRecord />
        },
        {
            path: '/textToImage',
            element: <PictureCreate />
        },
        {
            path: '/user/account-profile/profile',
            element: <AppUserAccountProfile />
        },
        {
            path: '/my-chat',
            element: <MyChat />
        },
        {
            path: '/createChat',
            element: <CreateChat />
        }
    ]
};

export default MainRoutes;
