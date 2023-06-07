// third-party
import { FormattedMessage } from 'react-intl';

// assets
import { IconDashboard, IconDeviceAnalytics } from '@tabler/icons';

// type
import { NavItemType } from 'types';

const icons = {
    IconDashboard: IconDashboard,
    IconDeviceAnalytics: IconDeviceAnalytics
};

// ==============================|| MENU ITEMS - TEMPLATE ||============================== //

const template: NavItemType = {
    id: 'template',
    title: <FormattedMessage id="template" />,
    icon: icons.IconDashboard,
    type: 'group',
    children: [
        {
            id: 'templateMarket',
            title: <FormattedMessage id="templateMarket" />,
            type: 'item',
            url: '/template/templateMarket',
            icon: icons.IconDashboard,
            breadcrumbs: false
        },
        {
            id: 'createCenter',
            title: <FormattedMessage id="create-center" />,
            type: 'item',
            url: '/template/createCenter',
            icon: icons.IconDeviceAnalytics,
            breadcrumbs: false
        }
    ]
};

export default template;
