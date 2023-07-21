import { RuoyiMenu } from 'menu-items/ruoyi';
import { NavItemType } from 'types';
import template from './template';

const initialMenuItems: { items: NavItemType[] } = {
    items: [template]
};

const targetIds = ['2164', '2168', '2170', '2178', '2171']; // 添加或删除你需要的id

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

    // const arr: any[] = [
    //     {
    //         id: 2163,
    //         parentId: 0,
    //         title: 'mofaai',
    //         type: 'group',
    //         icon: '',
    //         children: [
    //             {
    //                 id: 2164,
    //                 breadcrumbs: false,
    //                 title: '应用市场',
    //                 type: 'item',
    //                 url: 'template/templateMarket/list'
    //             }
    //         ]
    //     }
    // ];

    menuItems.items = [
        ...(getRuoyiMenu || [])
        // ...menuItems.items
    ];

    return menuItems;
};

export default getMenuItems;
