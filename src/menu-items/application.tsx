import { NavItemType } from 'types';

// assets
import { IconApps, IconUserCheck, IconBasket, IconMessages, IconLayoutKanban, IconMail, IconCalendar, IconNfc } from '@tabler/icons';

import { t } from 'hooks/web/useI18n';

// constant
const icons = {
    IconApps,
    IconUserCheck,
    IconBasket,
    IconMessages,
    IconLayoutKanban,
    IconMail,
    IconCalendar,
    IconNfc
};

// ==============================|| APPLICATION MENU ITEMS ||============================== //

const application: NavItemType = {
    id: 'application',
    title: t('application'),
    icon: icons.IconApps,
    type: 'group',
    children: [
        {
            id: 'users',
            title: t('users'),
            type: 'collapse',
            icon: icons.IconUserCheck,
            children: [
                {
                    id: 'posts',
                    title: t('social-profile'),
                    type: 'item',
                    url: '/user/social-profile/posts'
                },
                {
                    id: 'account-profile',
                    title: t('account-profile'),
                    type: 'collapse',
                    children: [
                        {
                            id: 'profile1',
                            title: <>t('profile') 01</>,
                            type: 'item',
                            url: '/user/account-profile/profile1'
                        },
                        {
                            id: 'profile2',
                            title: <>t('profile') 02</>,
                            type: 'item',
                            url: '/user/account-profile/profile2'
                        },
                        {
                            id: 'profile3',
                            title: <>t('profile') 03</>,
                            type: 'item',
                            url: '/user/account-profile/profile3'
                        }
                    ]
                },
                {
                    id: 'user-card',
                    title: t('cards'),
                    type: 'collapse',
                    children: [
                        {
                            id: 'card1',
                            title: <>t('style') 01</>,
                            type: 'item',
                            url: '/user/card/card1'
                        },
                        {
                            id: 'card2',
                            title: <>t('style') 02</>,
                            type: 'item',
                            url: '/user/card/card2'
                        },
                        {
                            id: 'card3',
                            title: <>t('style') 03</>,
                            type: 'item',
                            url: '/user/card/card3'
                        }
                    ]
                },
                {
                    id: 'user-list',
                    title: t('list'),
                    type: 'collapse',
                    children: [
                        {
                            id: 'list1',
                            title: <>t('style') 01</>,
                            type: 'item',
                            url: '/user/list/list1'
                        },
                        {
                            id: 'list2',
                            title: <>t('style') 02</>,
                            type: 'item',
                            url: '/user/list/list2'
                        }
                    ]
                }
            ]
        },
        {
            id: 'customer',
            title: t('customer'),
            type: 'collapse',
            icon: icons.IconBasket,
            children: [
                {
                    id: 'customer-list',
                    title: t('customer-list'),
                    type: 'item',
                    url: '/customer/customer-list',
                    breadcrumbs: false
                },
                {
                    id: 'order-list',
                    title: t('order-list'),
                    type: 'item',
                    url: '/customer/order-list',
                    breadcrumbs: false
                },
                {
                    id: 'create-invoice',
                    title: t('create-invoice'),
                    type: 'item',
                    url: '/customer/create-invoice',
                    breadcrumbs: false
                },
                {
                    id: 'order-details',
                    title: t('order-details'),
                    type: 'item',
                    url: '/customer/order-details'
                },
                {
                    id: 'product',
                    title: t('product'),
                    type: 'item',
                    url: '/customer/product',
                    breadcrumbs: false
                },
                {
                    id: 'product-review',
                    title: t('product-review'),
                    type: 'item',
                    url: '/customer/product-review',
                    breadcrumbs: false
                }
            ]
        },
        {
            id: 'chat',
            title: t('chat'),
            type: 'item',
            icon: icons.IconMessages,
            url: '/app/chat'
        },
        {
            id: 'kanban',
            title: 'Kanban',
            type: 'item',
            icon: icons.IconLayoutKanban,
            url: '/app/kanban/board'
        },
        {
            id: 'mail',
            title: t('mail'),
            type: 'item',
            icon: icons.IconMail,
            url: '/app/mail'
        },
        {
            id: 'calendar',
            title: t('calendar'),
            type: 'item',
            url: '/app/calendar',
            icon: icons.IconCalendar,
            breadcrumbs: false
        },
        {
            id: 'contact',
            title: t('contact'),
            type: 'collapse',
            icon: icons.IconNfc,
            children: [
                {
                    id: 'c-card',
                    title: t('cards'),
                    type: 'item',
                    url: '/app/contact/c-card',
                    breadcrumbs: false
                },
                {
                    id: 'c-list',
                    title: t('list'),
                    type: 'item',
                    url: '/app/contact/c-list',
                    breadcrumbs: false
                }
            ]
        },
        {
            id: 'e-commerce',
            title: t('e-commerce'),
            type: 'collapse',
            icon: icons.IconBasket,
            children: [
                {
                    id: 'products',
                    title: t('products'),
                    type: 'item',
                    url: '/e-commerce/products'
                },
                {
                    id: 'product-details',
                    title: t('product-details'),
                    type: 'item',
                    url: '/e-commerce/product-details/1',
                    breadcrumbs: false
                },
                {
                    id: 'product-list',
                    title: t('product-list'),
                    type: 'item',
                    url: '/e-commerce/product-list',
                    breadcrumbs: false
                },
                {
                    id: 'checkout',
                    title: t('checkout'),
                    type: 'item',
                    url: '/e-commerce/checkout'
                }
            ]
        }
    ]
};

export default application;
