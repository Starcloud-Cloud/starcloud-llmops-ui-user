import { lazy } from 'react';

// project imports
import MinimalLayout from 'layout/MinimalLayout';
import Loadable from 'ui-component/Loadable';
import AuthGuard from 'utils/route-guard/AuthGuard';

// login routing
const PictureCreate = Loadable(lazy(() => import('views/picture/create')));

// ==============================|| AUTH ROUTING ||============================== //

const PictureRoutes = {
    path: '/picture',
    element: (
        <AuthGuard>
            <MinimalLayout />
        </AuthGuard>
    ),
    children: [
        {
            path: '/picture/create1',
            element: <PictureCreate />
        }
    ]
};

export default PictureRoutes;
