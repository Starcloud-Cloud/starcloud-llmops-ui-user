import { lazy } from 'react';

// project imports
import MainLayout from 'layout/MainLayout';
import Loadable from 'ui-component/Loadable';
import AuthGuard from 'utils/route-guard/AuthGuard';

// template routing
const Market = Loadable(lazy(() => import('views/template/market')));
const MarketDetail = Loadable(lazy(() => import('views/template/market/components/detail')));
const CreateCenter = Loadable(lazy(() => import('views/template/myTemplate')));
const CreateDetail = Loadable(lazy(() => import('views/template/myTemplate/components/createTemplate')));

// Rewards
const Redemption = Loadable(lazy(() => import('views/rewards/redemption')));
const OrderRecord = Loadable(lazy(() => import('views/pages/pricing/orderRecord')));

// pic
const PictureCreate = Loadable(lazy(() => import('views/picture/create')));
//智能抠图
const SmartCutout = Loadable(lazy(() => import('views/picture/lintellgentMatting/components/smartCutout')));
//删除背景文字
const DelDebackGroundText = Loadable(lazy(() => import('views/picture/lintellgentMatting/components/delDebackGroundText')));
//放大图片
const EnlargementImage = Loadable(lazy(() => import('views/picture/imageProcessing/components/largementImage')));
//放大图片清晰度
const UpscaleImage = Loadable(lazy(() => import('views/picture/imageProcessing/components/upscaleImage')));
//历史记录
const ImageHistory = Loadable(lazy(() => import('views/picture/components/imageHistory')));
//weShop
const WeShop = Loadable(lazy(() => import('views/picture/weShop')));
//轮廓出图
const ContourImage = Loadable(lazy(() => import('views/picture/contourImage')));
//图片裂变
const FissionImage = Loadable(lazy(() => import('views/picture/fissionImage')));

// 聊天
const MyChat = Loadable(lazy(() => import('views/template/myChat')));
const CreateChat = Loadable(lazy(() => import('views/template/myChat/createChat')));
const ChatMarket = Loadable(lazy(() => import('views/chat/market')));

// listing-builder
const ListingBuilder = Loadable(lazy(() => import('views/pages/listing-builder/builder')));
const ListingBuilderPage = Loadable(lazy(() => import('views/pages/listing-builder/page')));
const ThesaurusDetail = Loadable(lazy(() => import('views/pages/thesaurusDetail')));

//小红书图文
const SmallRedBook = Loadable(lazy(() => import('views/pages/smallRedBook/index')));
//批量小红书图文
const BatchSmallRedBook = Loadable(lazy(() => import('views/pages/batchSmallRedBooks')));
//创作文案
const Copywriting = Loadable(lazy(() => import('views/pages/copywriting')));
//新增创作文案
const CopywritingModal = Loadable(lazy(() => import('views/pages/copywriting/components/addModal')));
//任务中心
const TaskCenter = Loadable(lazy(() => import('views/pages/taskCenter')));
//新增任务中心
const TaskModal = Loadable(lazy(() => import('views/pages/taskCenter/components/addModal')));
//查看通告任务
const Announce = Loadable(lazy(() => import('views/pages/taskCenter/components/announce')));

const RedBookTaskList = Loadable(lazy(() => import('views/pages/redBookTaskList')));

const RedBookContentList = Loadable(lazy(() => import('views/pages/redBookContentList')));

//词库
const Thesaurus = Loadable(lazy(() => import('views/pages/thesaurus')));
// 个人设置
const AppUserAccountProfile = Loadable(lazy(() => import('views/application/users/account-profile/Profile')));
//空间权益
const SpaceEquity = Loadable(lazy(() => import('views/spaceEquity')));

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
            element: <Market />
            // children: [
            //     {
            //         path: 'list',
            //         element: <MarketList />
            //     },
            //     {
            //         path: 'detail/:uid',
            //         element: <MarketDetail />
            //     }
            // ]
        },
        {
            path: '/appMarketDetail/:uid',
            element: <MarketDetail />
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
            path: '/imageHistory',
            element: <ImageHistory />
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
            path: '/fissionImage',
            element: <FissionImage />
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
            path: '/listingBuilder',
            element: <ListingBuilder />
        },
        {
            path: '/listingBuilderOptimize',
            element: <ListingBuilder />
        },
        {
            path: '/ListingBuilderPage',
            element: <ListingBuilderPage />
        },
        {
            path: '/thesaurus',
            element: <Thesaurus />
        },
        {
            path: '/thesaurusDetail',
            element: <ThesaurusDetail />
        },
        {
            path: '/smallRedBook',
            element: <SmallRedBook />
        },
        {
            path: '/batchSmallRedBook',
            element: <BatchSmallRedBook />
        },
        {
            path: '/redBookTaskList',
            element: <RedBookTaskList />
        },
        {
            path: '/redBookContentList',
            element: <RedBookContentList />
        },
        {
            path: '/copywriting',
            element: <Copywriting />
        },
        {
            path: '/copywritingModal',
            element: <CopywritingModal />
        },
        {
            path: '/taskCenter',
            element: <TaskCenter />
        },
        {
            path: '/taskModal',
            element: <TaskModal />
        },
        {
            path: '/announce',
            element: <Announce />
        },
        {
            path: '/spaceEquity',
            element: <SpaceEquity />
        }
    ]
};

export default MainRoutes;
