// assets
import { IconKey, IconReceipt2, IconBug, IconBellRinging, IconPhoneCall, IconQuestionMark, IconShieldLock } from '@tabler/icons';
import { NavItemType } from 'types';
import { t } from 'hooks/web/useI18n';

// constant
const icons = {
    IconKey,
    IconReceipt2,
    IconBug,
    IconBellRinging,
    IconPhoneCall,
    IconQuestionMark,
    IconShieldLock
};
// ==============================|| EXTRA PAGES MENU ITEMS ||============================== //

const pages: NavItemType = {
    id: 'pages',
    title: t('pages'),
    caption: t('pages-caption'),
    icon: icons.IconKey,
    type: 'group',
    children: [
        {
            id: 'authentication',
            title: t('authentication'),
            type: 'collapse',
            icon: icons.IconKey,
            children: [
                {
                    id: 'authentication1',
                    title: <>t('authentication') 1</>,
                    type: 'collapse',
                    children: [
                        {
                            id: 'login1',
                            title: t('login'),
                            type: 'item',
                            url: '/pages/login/login1',
                            target: true
                        },
                        {
                            id: 'register1',
                            title: t('register'),
                            type: 'item',
                            url: '/pages/register/register1',
                            target: true
                        },
                        {
                            id: 'forgot-password1',
                            title: t('forgot-password'),
                            type: 'item',
                            url: '/pages/forgot-password/forgot-password1',
                            target: true
                        },
                        {
                            id: 'check-mail1',
                            title: t('check-mail'),
                            type: 'item',
                            url: '/pages/check-mail/check-mail1',
                            target: true
                        },
                        {
                            id: 'reset-password1',
                            title: t('reset-password'),
                            type: 'item',
                            url: '/pages/reset-password/reset-password1',
                            target: true
                        },
                        {
                            id: 'code-verification1',
                            title: t('code-verification'),
                            type: 'item',
                            url: '/pages/code-verification/code-verification1',
                            target: true
                        }
                    ]
                },
                {
                    id: 'authentication2',
                    title: <>t('authentication') 2</>,
                    type: 'collapse',
                    children: [
                        {
                            id: 'login2',
                            title: t('login'),
                            type: 'item',
                            url: '/pages/login/login2',
                            target: true
                        },
                        {
                            id: 'register2',
                            title: t('register'),
                            type: 'item',
                            url: '/pages/register/register2',
                            target: true
                        },
                        {
                            id: 'forgot-password2',
                            title: t('forgot-password'),
                            type: 'item',
                            url: '/pages/forgot-password/forgot-password2',
                            target: true
                        },
                        {
                            id: 'check-mail2',
                            title: t('check-mail'),
                            type: 'item',
                            url: '/pages/check-mail/check-mail2',
                            target: true
                        },
                        {
                            id: 'reset-password2',
                            title: t('reset-password'),
                            type: 'item',
                            url: '/pages/reset-password/reset-password2',
                            target: true
                        },
                        {
                            id: 'code-verification2',
                            title: t('code-verification'),
                            type: 'item',
                            url: '/pages/code-verification/code-verification2',
                            target: true
                        }
                    ]
                },
                {
                    id: 'authentication3',
                    title: <>t('authentication') 3</>,
                    type: 'collapse',
                    children: [
                        {
                            id: 'login3',
                            title: t('login'),
                            type: 'item',
                            url: '/pages/login/login3',
                            target: true
                        },
                        {
                            id: 'register3',
                            title: t('register'),
                            type: 'item',
                            url: '/pages/register/register3',
                            target: true
                        },
                        {
                            id: 'forgot-password3',
                            title: t('forgot-password'),
                            type: 'item',
                            url: '/pages/forgot-password/forgot-password3',
                            target: true
                        },
                        {
                            id: 'check-mail3',
                            title: t('check-mail'),
                            type: 'item',
                            url: '/pages/check-mail/check-mail3',
                            target: true
                        },
                        {
                            id: 'reset-password3',
                            title: t('reset-password'),
                            type: 'item',
                            url: '/pages/reset-password/reset-password3',
                            target: true
                        },
                        {
                            id: 'code-verification3',
                            title: t('code-verification'),
                            type: 'item',
                            url: '/pages/code-verification/code-verification3',
                            target: true
                        }
                    ]
                }
            ]
        },
        {
            id: 'price',
            title: t('pricing'),
            type: 'collapse',
            icon: icons.IconReceipt2,
            children: [
                {
                    id: 'price1',
                    title: <>t('price') 01</>,
                    type: 'item',
                    url: '/pages/price/price1'
                },
                {
                    id: 'price2',
                    title: <>t('price') 02</>,
                    type: 'item',
                    url: '/pages/price/price2'
                }
            ]
        },
        {
            id: 'maintenance',
            title: t('maintenance'),
            type: 'collapse',
            icon: icons.IconBug,
            children: [
                {
                    id: 'error',
                    title: t('error-404'),
                    type: 'item',
                    url: '/pages/error',
                    target: true
                },
                {
                    id: 'coming-soon',
                    title: t('coming-soon'),
                    type: 'collapse',
                    children: [
                        {
                            id: 'coming-soon1',
                            title: <>t('coming-soon') 01</>,
                            type: 'item',
                            url: '/pages/coming-soon1',
                            target: true
                        },
                        {
                            id: 'coming-soon2',
                            title: <>t('coming-soon') 02</>,
                            type: 'item',
                            url: '/pages/coming-soon2',
                            target: true
                        }
                    ]
                },
                {
                    id: 'under-construction',
                    title: t('under-construction'),
                    type: 'item',
                    url: '/pages/under-construction',
                    target: true
                }
            ]
        },
        {
            id: 'landing',
            title: t('landing'),
            type: 'item',
            icon: icons.IconBellRinging,
            url: '/pages/landing',
            target: true
        },
        {
            id: 'contact-us',
            title: t('contact-us'),
            type: 'item',
            icon: icons.IconPhoneCall,
            url: '/pages/contact-us',
            target: true
        },
        {
            id: 'faqs',
            title: t('faqs'),
            type: 'item',
            icon: icons.IconQuestionMark,
            url: '/pages/faqs',
            target: true
        },
        {
            id: 'privacy-policy',
            title: t('privacy-policy'),
            type: 'item',
            icon: icons.IconShieldLock,
            url: '/pages/privacy-policy',
            target: true
        }
    ]
};

export default pages;
