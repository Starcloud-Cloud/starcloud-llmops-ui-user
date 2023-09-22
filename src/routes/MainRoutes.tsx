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
//智能抠图
const SmartCutout = Loadable(lazy(() => import('views/picture/smartCutout')));
//删除背景文字
const DelDebackGroundText = Loadable(lazy(() => import('views/picture/delDebackGroundText')));
//放大图片
const EnlargementImage = Loadable(lazy(() => import('views/picture/enlargementImage')));
//放大图片清晰度
const UpscaleImage = Loadable(lazy(() => import('views/picture/upscaleImage')));
//weShop
const WeShop = Loadable(lazy(() => import('views/picture/weShop')));
//轮廓出图
const ContourImage = Loadable(lazy(() => import('views/picture/contourImage')));

// 聊天
const MyChat = Loadable(lazy(() => import('views/template/myChat')));
const CreateChat = Loadable(lazy(() => import('views/template/myChat/createChat')));
const ChatMarket = Loadable(lazy(() => import('views/chat/market')));
const ChatCreate = Loadable(lazy(() => import('views/chat/create')));

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
            path: '/smartImage',
            element: <SmartCutout />
        },
        {
            path: '/delImageText',
            element: <DelDebackGroundText />
        },
        {
            path: '/largementImage',
            element: <EnlargementImage />
        },
        {
            path: '/upscaleImage',
            element: <UpscaleImage />
        },
        {
            path: '/shopImage',
            element: <WeShop />
        },
        {
            path: '/contourImage',
            element: <ContourImage />
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
        },
        {
            path: '/chatMarket',
            element: <ChatMarket />
        },
        {
            path: '/chatCreate',
            element: <ChatCreate />
        }
    ]
};

export default MainRoutes;
