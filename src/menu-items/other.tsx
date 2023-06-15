// assets
import { IconBrandChrome, IconHelp, IconSitemap } from '@tabler/icons';
import { NavItemType } from 'types';
import { t } from 'hooks/web/useI18n';

// constant
const icons = {
    IconBrandChrome,
    IconHelp,
    IconSitemap
};
// ==============================|| SAMPLE PAGE & DOCUMENTATION MENU ITEMS ||============================== //

const other: NavItemType = {
    id: 'sample-docs-roadmap',
    icon: IconBrandChrome,
    type: 'group',
    children: [
        {
            id: 'sample-page',
            title: t('sample-page'),
            type: 'item',
            url: '/sample-page',
            icon: icons.IconBrandChrome,
            breadcrumbs: false
        },
        {
            id: 'documentation',
            title: t('documentation'),
            type: 'item',
            url: 'https://codedthemes.gitbook.io/berry/',
            icon: icons.IconHelp,
            external: true,
            target: true
        },
        {
            id: 'roadmap',
            title: t('roadmap'),
            type: 'item',
            url: 'https://codedthemes.gitbook.io/berry/roadmap',
            icon: icons.IconSitemap,
            external: true,
            target: true
        }
    ]
};

export default other;
