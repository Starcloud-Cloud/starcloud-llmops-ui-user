// assets
import { IconBrandFramer, IconTypography, IconPalette, IconShadow, IconWindmill, IconLayoutGridAdd } from '@tabler/icons';
import { NavItemType } from 'types';
import { t } from 'hooks/web/useI18n';

// constant
const icons = {
    IconTypography,
    IconPalette,
    IconShadow,
    IconWindmill,
    IconBrandFramer,
    IconLayoutGridAdd
};
// ==============================|| UTILITIES MENU ITEMS ||============================== //

const utilities: NavItemType = {
    id: 'utilities',
    title: t('utilities'),
    icon: icons.IconTypography,
    type: 'group',
    children: [
        {
            id: 'util-typography',
            title: t('typography'),
            type: 'item',
            url: '/utils/util-typography',
            icon: icons.IconTypography,
            breadcrumbs: false
        },
        {
            id: 'util-color',
            title: t('color'),
            type: 'item',
            url: '/utils/util-color',
            icon: icons.IconPalette,
            breadcrumbs: false
        },
        {
            id: 'util-shadow',
            title: t('shadow'),
            type: 'item',
            url: '/utils/util-shadow',
            icon: icons.IconShadow,
            breadcrumbs: false
        },
        {
            id: 'icons',
            title: t('icons'),
            type: 'collapse',
            icon: icons.IconWindmill,
            children: [
                {
                    id: 'tabler-icons',
                    title: t('tabler-icons'),
                    type: 'item',
                    url: 'https://tabler-icons.io/',
                    external: true,
                    target: true,
                    breadcrumbs: false
                },
                {
                    id: 'material-icons',
                    title: t('material-icons'),
                    type: 'item',
                    url: 'https://mui.com/material-ui/material-icons/#main-content',
                    external: true,
                    target: true,
                    breadcrumbs: false
                }
            ]
        },
        {
            id: 'util-animation',
            title: t('animation'),
            type: 'item',
            url: '/utils/util-animation',
            icon: icons.IconBrandFramer,
            breadcrumbs: false
        },
        {
            id: 'util-grid',
            title: t('grid'),
            type: 'item',
            url: '/utils/util-grid',
            icon: icons.IconLayoutGridAdd,
            breadcrumbs: false
        }
    ]
};

export default utilities;
