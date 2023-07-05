// assets
import { IconDashboard, IconDeviceAnalytics } from '@tabler/icons';

// type
import { NavItemType } from 'types';

import { t } from 'hooks/web/useI18n';

const icons = {
    IconDashboard: IconDashboard,
    IconDeviceAnalytics: IconDeviceAnalytics
};

// ==============================|| MENU ITEMS - TEMPLATE ||============================== //

const template: NavItemType = {
    id: 'template',
    title: t('template'),
    icon: icons.IconDashboard,
    type: 'group',
    children: [
        {
            id: 'templateMarket',
            title: t('templateMarket'),
            type: 'item',
            url: '/appMarkrt/list',
            icon: icons.IconDashboard,
            breadcrumbs: false
        },
        {
            id: 'createCenter',
            title: t('create-center'),
            type: 'item',
            url: '/template/createCenter',
            icon: icons.IconDeviceAnalytics,
            breadcrumbs: false
        },
        {
            id: 'applicationAnalysis',
            title: t('application-analysis'),
            type: 'item',
            url: '/template/applicationAnalysis',
            icon: icons.IconDeviceAnalytics,
            breadcrumbs: false
        }
    ]
};

export default template;
