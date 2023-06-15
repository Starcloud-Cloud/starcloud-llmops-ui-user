import Dashboard from 'views/pages/maintenance/Error';
import MyTemplate from 'views/pages/maintenance/Error';
import Limits from 'views/pages/maintenance/Error';
import TemplateMarket from 'views/pages/maintenance/Error';
import Tables from 'views/pages/maintenance/Error';
import Billing from 'views/pages/maintenance/Error';
import RTL from 'views/pages/maintenance/Error';
import Notifications from 'views/pages/maintenance/Error';
import Profile from 'views/pages/maintenance/Error';
import SignIn from 'views/pages/maintenance/Error';
import SignUp from 'views/pages/maintenance/Error';

// @mui icons
import Icon from '@mui/material/Icon';
import { MUIRoutes } from 'types/router';

const remainingroutes: MUIRoutes[] = [
    {
        type: 'collapse',
        name: 'TemplateMarket',
        icon: <Icon fontSize="small">dashboard</Icon>,
        key: 'templateMarket',
        route: '/templateMarket',
        component: <TemplateMarket />
    },
    {
        type: 'collapse',
        name: 'Limit',
        icon: <Icon fontSize="small">dashboard</Icon>,
        key: 'limit',
        route: '/limit',
        component: <Limits />
    },
    {
        type: 'collapse',
        name: 'MyTemplate',
        icon: <Icon fontSize="small">dashboard</Icon>,
        key: 'myTemplate',
        route: '/myTemplate',
        component: <MyTemplate />
    },
    {
        type: 'collapse',
        name: 'Dashboard',
        key: 'dashboard',
        icon: <Icon fontSize="small">dashboard</Icon>,
        route: '/dashboard',
        component: <Dashboard />
    },
    {
        type: 'collapse',
        name: 'Tables',
        key: 'tables',
        icon: <Icon fontSize="small">table_view</Icon>,
        route: '/tables',
        component: <Tables />
    },
    {
        type: 'collapse',
        name: 'Billing',
        key: 'billing',
        icon: <Icon fontSize="small">receipt_long</Icon>,
        route: '/billing',
        component: <Billing />
    },
    {
        type: 'collapse',
        name: 'RTL',
        key: 'rtl',
        icon: <Icon fontSize="small">format_textdirection_r_to_l</Icon>,
        route: '/rtl',
        component: <RTL />
    },
    {
        type: 'collapse',
        name: 'Notifications',
        key: 'notifications',
        icon: <Icon fontSize="small">notifications</Icon>,
        route: '/notifications',
        component: <Notifications />
    },
    {
        type: 'collapse',
        name: 'Profile',
        key: 'profile',
        icon: <Icon fontSize="small">person</Icon>,
        route: '/profile',
        component: <Profile />
    },
    {
        type: 'collapse',
        name: 'Sign In',
        key: 'sign-in',
        icon: <Icon fontSize="small">login</Icon>,
        route: '/authentication/sign-in',
        component: <SignIn />
    },
    {
        type: 'collapse',
        name: 'Sign Up',
        key: 'sign-up',
        icon: <Icon fontSize="small">assignment</Icon>,
        route: '/authentication/sign-up',
        component: <SignUp />
    }
];

// export const componentModules = remainingroutes.reduce((modules, route) => {
//     modules[route.key] = route.component;
//     return modules;
// }, {});

export default remainingroutes;
