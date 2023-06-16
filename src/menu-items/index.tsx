import template from './template';
import { NavItemType } from 'types';
import { RuoyiMenu } from 'menu-items/ruoyi';

const initialMenuItems: { items: NavItemType[] } = {
    items: [template]
};

const targetIds = ['2164', '2168', '2170', '2171']; // 添加或删除你需要的id

const getMenuItems = () => {
    let menuItems = { ...initialMenuItems };
    let getRuoyiMenu = RuoyiMenu();

    const ruoyiItemsToAdd = [];

    for (let id of targetIds) {
        const isFound = menuItems.items.some((element) => element.id === id);
        const ruoyiMenuItem = getRuoyiMenu?.find((item) => item.id === id);

        if (ruoyiMenuItem && ruoyiMenuItem?.children && !isFound) {
            ruoyiItemsToAdd.push(ruoyiMenuItem);
        }
    }

    menuItems.items = [...ruoyiItemsToAdd, ...menuItems.items];

    return menuItems;
};

export default getMenuItems;
