import MinimalLayout from 'layout/MinimalLayout';
import { lazy } from 'react';
import Loadable from '../ui-component/Loadable';
import AuthGuard from '../utils/route-guard/AuthGuard';

const PagesPrice1 = Loadable(lazy(() => import('views/pages/pricing/Price1')));

const AuthSingleRouter = {
    path: '/',
    element: (
        <AuthGuard>
            <MinimalLayout />
        </AuthGuard>
    ),
    children: [
        {
            path: '/pages/vip',
            element: <PagesPrice1 />
        }
    ]
};

export default AuthSingleRouter;
