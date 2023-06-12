import dashboard from './dashboard';
// import application from './application';
import forms from './forms';
// import elements from './elements';
// import pages from './pages';
// import utilities from './utilities';
// import support from './support';
// import other from './other';
import { NavItemType } from 'types';
import template from './template';

// ==============================|| MENU ITEMS ||============================== //

// const menuItems: { items: NavItemType[] } = {
//     items: [template, dashboard, application, forms, elements, pages, utilities, support, other]
// };
const menuItems: { items: NavItemType[] } = {
    items: [dashboard, template, forms]
};

export default menuItems;
