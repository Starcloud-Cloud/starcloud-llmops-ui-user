import { lazy } from 'react';

// project imports
import GuestGuard from 'utils/route-guard/GuestGuard';
import MinimalLayout from 'layout/MinimalLayout';
import NavMotion from 'layout/NavMotion';
import Loadable from 'ui-component/Loadable';

// login routing
const AuthLogin = Loadable(lazy(() => import('views/announce/authentication/authentication/Login')));
const AuthRegister = Loadable(lazy(() => import('views/announce/authentication/authentication/Register')));
const AuthRegisterResult = Loadable(lazy(() => import('views/announce/authentication/authentication/RegisterResult')));
const AuthForgotPassword = Loadable(lazy(() => import('views/announce/authentication/authentication/ForgotPassword')));

// ==============================|| AUTH ROUTING ||============================== //

const LoginRoutes = {
    path: '/',
    element: (
        <NavMotion>
            <GuestGuard>
                <MinimalLayout />
            </GuestGuard>
        </NavMotion>
    ),
    children: [
        {
            path: '/login',
            element: <AuthLogin />
        },
        {
            path: '/register',
            element: <AuthRegister />
        },
        {
            path: '/registerResult',
            element: <AuthRegisterResult />
        },
        {
            path: '/forgot',
            element: <AuthForgotPassword />
        }
    ]
};

export default LoginRoutes;
