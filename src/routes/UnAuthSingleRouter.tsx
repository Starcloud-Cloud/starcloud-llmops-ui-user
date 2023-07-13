import MinimalLayout from 'layout/MinimalLayout';
import NavMotion from 'layout/NavMotion';
import { lazy } from 'react';
import Loadable from '../ui-component/Loadable';

const PagesPrice = Loadable(lazy(() => import('views/pages/pricing/member')));

const UnAuthSingleRouter = {
    path: '/',
    element: (
        <NavMotion>
            <MinimalLayout />
        </NavMotion>
    ),
    children: [
        {
            path: '/subscribe',
            element: <PagesPrice />
        }
    ]
};

export default UnAuthSingleRouter;
