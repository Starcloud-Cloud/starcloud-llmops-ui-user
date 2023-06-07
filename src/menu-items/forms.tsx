// assets
import { IconClipboardCheck, IconPictureInPicture, IconForms, IconBorderAll, IconChartDots, IconStairsUp } from '@tabler/icons';
import { NavItemType } from 'types';
import { t } from 'hooks/web/useI18n';

// constant
const icons = {
    IconClipboardCheck,
    IconPictureInPicture,
    IconForms,
    IconBorderAll,
    IconChartDots,
    IconStairsUp
};
// ==============================|| UI FORMS MENU ITEMS ||============================== //

const forms: NavItemType = {
    id: 'ui-forms',
    title: t('forms'),
    icon: icons.IconPictureInPicture,
    type: 'group',
    children: [
        {
            id: 'components',
            title: t('components'),
            type: 'collapse',
            icon: icons.IconPictureInPicture,
            children: [
                {
                    id: 'autocomplete',
                    title: t('autocomplete'),
                    type: 'item',
                    url: '/components/autocomplete',
                    breadcrumbs: false
                },
                {
                    id: 'button',
                    title: t('button'),
                    type: 'item',
                    url: '/components/button',
                    breadcrumbs: false
                },
                {
                    id: 'checkbox',
                    title: t('checkbox'),
                    type: 'item',
                    url: '/components/checkbox',
                    breadcrumbs: false
                },
                {
                    id: 'date-time',
                    title: t('date-time'),
                    type: 'item',
                    url: '/components/date-time',
                    breadcrumbs: false
                },
                {
                    id: 'radio',
                    title: t('radio'),
                    type: 'item',
                    url: '/components/radio',
                    breadcrumbs: false
                },
                {
                    id: 'slider',
                    title: t('slider'),
                    type: 'item',
                    url: '/components/slider',
                    breadcrumbs: false
                },
                {
                    id: 'switch',
                    title: t('switch'),
                    type: 'item',
                    url: '/components/switch',
                    breadcrumbs: false
                },
                {
                    id: 'text-field',
                    title: t('text-field'),
                    type: 'item',
                    url: '/components/text-field',
                    breadcrumbs: false
                }
            ]
        },
        {
            id: 'plugins',
            title: t('plugins'),
            type: 'collapse',
            icon: icons.IconForms,
            children: [
                {
                    id: 'frm-autocomplete',
                    title: t('autocomplete'),
                    type: 'item',
                    url: '/forms/frm-autocomplete',
                    breadcrumbs: false
                },
                {
                    id: 'frm-mask',
                    title: t('mask'),
                    type: 'item',
                    url: '/forms/frm-mask',
                    breadcrumbs: false
                },
                {
                    id: 'frm-clipboard',
                    title: t('clipboard'),
                    type: 'item',
                    url: '/forms/frm-clipboard',
                    breadcrumbs: false
                },
                {
                    id: 'frm-recaptcha',
                    title: t('recaptcha'),
                    type: 'item',
                    url: '/forms/frm-recaptcha',
                    breadcrumbs: false
                },
                {
                    id: 'frm-wysiwug',
                    title: t('wysiwug-editor'),
                    type: 'item',
                    url: '/forms/frm-wysiwug',
                    breadcrumbs: false
                },
                {
                    id: 'frm-modal',
                    title: t('modal'),
                    type: 'item',
                    url: '/forms/frm-modal',
                    breadcrumbs: false
                },
                {
                    id: 'frm-tooltip',
                    title: t('tooltip'),
                    type: 'item',
                    url: '/forms/frm-tooltip'
                }
            ]
        },
        {
            id: 'layouts',
            title: 'Layouts',
            type: 'collapse',
            icon: icons.IconForms,
            children: [
                {
                    id: 'frm-layouts',
                    title: t('layouts'),
                    type: 'item',
                    url: '/forms/layouts/layouts'
                },
                {
                    id: 'frm-multi-column-forms',
                    title: t('multi-column-forms'),
                    type: 'item',
                    url: '/forms/layouts/multi-column-forms'
                },
                {
                    id: 'frm-action-bar',
                    title: t('action-bar'),
                    type: 'item',
                    url: '/forms/layouts/action-bar'
                },
                {
                    id: 'frm-sticky-action-bar',
                    title: t('sticky-action-bar'),
                    type: 'item',
                    url: '/forms/layouts/sticky-action-bar'
                }
            ]
        },
        {
            id: 'tables',
            title: t('table'),
            type: 'collapse',
            icon: icons.IconBorderAll,
            children: [
                {
                    id: 'tbl-basic',
                    title: t('table-basic'),
                    type: 'item',
                    url: '/tables/tbl-basic',
                    breadcrumbs: false
                },
                {
                    id: 'tbl-dense',
                    title: t('table-dense'),
                    type: 'item',
                    url: '/tables/tbl-dense',
                    breadcrumbs: false
                },
                {
                    id: 'tbl-enhanced',
                    title: t('table-enhanced'),
                    type: 'item',
                    url: '/tables/tbl-enhanced',
                    breadcrumbs: false
                },
                {
                    id: 'tbl-data',
                    title: t('table-data'),
                    type: 'item',
                    url: '/tables/tbl-data',
                    breadcrumbs: false
                },
                {
                    id: 'tbl-customized',
                    title: t('table-customized'),
                    type: 'item',
                    url: '/tables/tbl-customized',
                    breadcrumbs: false
                },
                {
                    id: 'tbl-sticky-header',
                    title: t('table-sticky-header'),
                    type: 'item',
                    url: '/tables/tbl-sticky-header',
                    breadcrumbs: false
                },
                {
                    id: 'tbl-collapse',
                    title: t('table-collapse'),
                    type: 'item',
                    url: '/tables/tbl-collapse',
                    breadcrumbs: false
                }
            ]
        },
        {
            id: 'charts',
            title: t('charts'),
            type: 'collapse',
            icon: icons.IconChartDots,
            children: [
                {
                    id: 'apexchart',
                    title: t('apexchart'),
                    type: 'item',
                    url: '/forms/charts/apexchart',
                    breadcrumbs: false
                },
                {
                    id: 'organization-chart',
                    title: t('organization-chart'),
                    type: 'item',
                    url: '/forms/charts/orgchart',
                    breadcrumbs: false
                }
            ]
        },
        {
            id: 'forms-validation',
            title: t('forms-validation'),
            type: 'item',
            url: '/forms/forms-validation',
            icon: icons.IconClipboardCheck
        },
        {
            id: 'forms-wizard',
            title: t('forms-wizard'),
            type: 'item',
            url: '/forms/forms-wizard',
            icon: icons.IconStairsUp
        }
    ]
};

export default forms;
