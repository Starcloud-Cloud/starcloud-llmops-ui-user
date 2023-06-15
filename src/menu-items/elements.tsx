// assets
import { IconBrush, IconTools } from '@tabler/icons';
import { NavItemType } from 'types';
import { t } from 'hooks/web/useI18n';

// constant
const icons = {
    IconBrush,
    IconTools
};

// ==============================|| UI ELEMENTS MENU ITEMS ||============================== //

const elements: NavItemType = {
    id: 'ui-element',
    title: t('ui-element'),
    icon: icons.IconBrush,
    type: 'group',
    children: [
        {
            id: 'basic',
            title: t('basic'),
            caption: t('basic-caption'),
            type: 'collapse',
            icon: icons.IconBrush,
            children: [
                {
                    id: 'accordion',
                    title: t('accordion'),
                    type: 'item',
                    url: '/basic/accordion',
                    breadcrumbs: false
                },
                {
                    id: 'avatar',
                    title: t('avatar'),
                    type: 'item',
                    url: '/basic/avatar',
                    breadcrumbs: false
                },
                {
                    id: 'badges',
                    title: t('badges'),
                    type: 'item',
                    url: '/basic/badges',
                    breadcrumbs: false
                },
                {
                    id: 'breadcrumb',
                    title: t('breadcrumb'),
                    type: 'item',
                    url: '/basic/breadcrumb'
                },
                {
                    id: 'cards',
                    title: t('cards'),
                    type: 'item',
                    url: '/basic/cards',
                    breadcrumbs: false
                },
                {
                    id: 'chip',
                    title: t('chip'),
                    type: 'item',
                    url: '/basic/chip',
                    breadcrumbs: false
                },
                {
                    id: 'list',
                    title: t('list'),
                    type: 'item',
                    url: '/basic/list',
                    breadcrumbs: false
                },
                {
                    id: 'tabs',
                    title: t('tabs'),
                    type: 'item',
                    url: '/basic/tabs',
                    breadcrumbs: false
                }
            ]
        },
        {
            id: 'advance',
            title: t('advance'),
            type: 'collapse',
            icon: icons.IconTools,
            children: [
                {
                    id: 'alert',
                    title: t('alert'),
                    type: 'item',
                    url: '/advance/alert',
                    breadcrumbs: false
                },
                {
                    id: 'dialog',
                    title: t('dialog'),
                    type: 'item',
                    url: '/advance/dialog',
                    breadcrumbs: false
                },
                {
                    id: 'pagination',
                    title: t('pagination'),
                    type: 'item',
                    url: '/advance/pagination',
                    breadcrumbs: false
                },
                {
                    id: 'progress',
                    title: t('progress'),
                    type: 'item',
                    url: '/advance/progress',
                    breadcrumbs: false
                },
                {
                    id: 'rating',
                    title: t('rating'),
                    type: 'item',
                    url: '/advance/rating',
                    breadcrumbs: false
                },
                {
                    id: 'snackbar',
                    title: t('snackbar'),
                    type: 'item',
                    url: '/advance/snackbar',
                    breadcrumbs: false
                },
                {
                    id: 'skeleton',
                    title: t('skeleton'),
                    type: 'item',
                    url: '/advance/skeleton',
                    breadcrumbs: false
                },
                {
                    id: 'speeddial',
                    title: t('speeddial'),
                    type: 'item',
                    url: '/advance/speeddial',
                    breadcrumbs: false
                },
                {
                    id: 'timeline',
                    title: t('timeline'),
                    type: 'item',
                    url: '/advance/timeline',
                    breadcrumbs: false
                },
                {
                    id: 'toggle-button',
                    title: t('toggle-button'),
                    type: 'item',
                    url: '/advance/toggle-button',
                    breadcrumbs: false
                },
                {
                    id: 'treeview',
                    title: t('treeview'),
                    type: 'item',
                    url: '/advance/treeview',
                    breadcrumbs: false
                }
            ]
        }
    ]
};

export default elements;
