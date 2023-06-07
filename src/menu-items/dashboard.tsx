// assets
import { IconDashboard, IconDeviceAnalytics } from '@tabler/icons';

// type
import { NavItemType } from 'types';
import { t } from 'hooks/web/useI18n';

const icons = {
    IconDashboard: IconDashboard,
    IconDeviceAnalytics: IconDeviceAnalytics
};

// ==============================|| MENU ITEMS - DASHBOARD ||============================== //

const dashboard: NavItemType = {
    id: 'dashboard',
    title: t('dashboard'),
    icon: icons.IconDashboard,
    type: 'group',
    children: [
        {
            id: 'default',
            title: t('default'),
            type: 'item',
            url: '/dashboard/default',
            icon: icons.IconDashboard,
            breadcrumbs: false
        },
        {
            id: 'analytics',
            title: t('analytics'),
            type: 'item',
            url: '/dashboard/analytics',
            icon: icons.IconDeviceAnalytics,
            breadcrumbs: false
        }
    ]
};

export default dashboard;
