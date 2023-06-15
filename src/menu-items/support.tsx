// assets
import { IconMenu, IconBoxMultiple, IconCircleOff, IconCircle, IconBrandGravatar, IconShape } from '@tabler/icons';
import { NavItemType } from 'types';
import { t } from 'hooks/web/useI18n';

// constant
const icons = {
    IconMenu,
    IconBoxMultiple,
    IconCircleOff,
    IconCircle,
    IconBrandGravatar,
    IconShape
};
// ==============================|| SUPPORT MENU ITEMS ||============================== //

const support: NavItemType = {
    id: 'support',
    title: t('others'),
    icon: icons.IconMenu,
    type: 'group',
    children: [
        {
            id: 'menu-level',
            title: t('menu-level'),
            type: 'collapse',
            icon: icons.IconMenu,
            children: [
                {
                    id: 'menu-level-1.1',
                    title: <>t('level') 1</>,
                    type: 'item',
                    url: '#'
                },
                {
                    id: 'menu-level-1.2',
                    title: <>t('level') 1</>,
                    type: 'collapse',
                    children: [
                        {
                            id: 'menu-level-2.1',
                            title: <>t('level') 2</>,
                            type: 'item',
                            url: '#'
                        },
                        {
                            id: 'menu-level-2.2',
                            title: <>t('level') 2</>,
                            type: 'collapse',
                            children: [
                                {
                                    id: 'menu-level-3.1',
                                    title: <>t('level') 3</>,
                                    type: 'item',
                                    url: '#'
                                },
                                {
                                    id: 'menu-level-3.2',
                                    title: <>t('level') 3</>,
                                    type: 'item',
                                    url: '#'
                                }
                            ]
                        }
                    ]
                }
            ]
        },
        {
            id: 'menu-level-subtitle',
            title: t('menu-level-subtitle'),
            caption: t('menu-level-subtitle-caption'),
            type: 'collapse',
            icon: icons.IconBoxMultiple,
            children: [
                {
                    id: 'sub-menu-level-1.1',
                    title: <>t('level') 1</>,
                    caption: t('menu-level-subtitle-item'),
                    type: 'item',
                    url: '#'
                },
                {
                    id: 'sub-menu-level-1.2',
                    title: <>t('level') 1</>,
                    caption: t('menu-level-subtitle-collapse'),
                    type: 'collapse',
                    children: [
                        {
                            id: 'sub-menu-level-2.1',
                            title: <>t('level') 2</>,
                            caption: t('menu-level-subtitle-sub-item'),
                            type: 'item',
                            url: '#'
                        }
                    ]
                }
            ]
        },
        {
            id: 'disabled-menu',
            title: t('disabled-menu'),
            type: 'item',
            url: '#',
            icon: icons.IconCircleOff,
            disabled: true
        },
        {
            id: 'oval-chip-menu',
            title: t('oval-chip-menu'),
            type: 'item',
            url: '#',
            icon: icons.IconCircle,
            chip: {
                label: '9',
                color: 'primary'
            }
        },
        {
            id: 'user-chip-menu',
            title: t('avatar'),
            type: 'item',
            url: '#',
            icon: icons.IconBrandGravatar,
            chip: {
                label: t('coded'),
                color: 'primary',
                // avatar: t('c'),
                size: 'small'
            }
        },
        {
            id: 'outline-chip-menu',
            title: t('outlined'),
            type: 'item',
            url: '#',
            icon: icons.IconShape,
            chip: {
                label: t('outlined'),
                variant: 'outlined',
                color: 'primary'
            }
        }
    ]
};

export default support;
