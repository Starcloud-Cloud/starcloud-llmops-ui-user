import LAYOUT_CONST from 'constant';

// types
import { ConfigProps } from 'types/config';
import { getTenant, ENUM_TENANT } from 'utils/permission';

// basename: only at build time to set, and Don't add '/' at end off BASENAME for breadcrumbs, also Don't put only '/' use blank('') instead,
// like '/berry-material-react/react/default'
export const BASE_PATH = '';

export const DASHBOARD_PATH = getTenant() === ENUM_TENANT.AI ? '/appMarket' : '/';
export const HORIZONTAL_MAX_ITEM = 6;

//不需要登录的页面
export const NO_LOGIN_PAGES = ['/', '/invite', '/share', '/shareVideo', '/batchShare', '/dataShare'];

const config: ConfigProps = {
    layout: LAYOUT_CONST.VERTICAL_LAYOUT, // vertical, horizontal
    drawerType: LAYOUT_CONST.DEFAULT_DRAWER, // default, mini-drawer
    fontFamily: `'Roboto', sans-serif`,
    borderRadius: 8,
    outlinedFilled: true,
    navType: 'light', // light, dark
    presetColor: 'default', // default, theme1, theme2, theme3, theme4, theme5, theme6
    locale: 'en', // 'en' - English, 'fr' - French, 'ro' - Romanian, 'zh' - Chinese
    rtlLayout: false,
    container: true
};

export default config;
