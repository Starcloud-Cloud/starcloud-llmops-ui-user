// project import
import { useSelector } from 'store';

// assets
import { IconChartArcs, IconClipboardList, IconChartInfographic } from '@tabler/icons';
import { NavItemType } from 'types';
import { t } from 'hooks/web/useI18n';

const icons = {
    widget: IconChartArcs,
    statistics: IconChartArcs,
    data: IconClipboardList,
    chart: IconChartInfographic
};

// ==============================|| MENU ITEMS - API ||============================== //

export const Menu = () => {
    const { menu } = useSelector((state) => state.menu);

    const SubChildrenLis = (subChildrenLis: NavItemType[]) => {
        return subChildrenLis?.map((subList: NavItemType) => {
            return {
                ...subList,
                title: subList.title ? t(subList.title as string) : '默认值',
                // @ts-ignore
                icon: icons[subList.icon]
            };
        });
    };

    const menuItem = (subList: NavItemType) => {
        let list: NavItemType = {
            ...subList,
            title: subList.title ? t(subList.title as string) : '默认值',
            // @ts-ignore
            icon: icons[subList.icon]
        };

        if (subList.type === 'collapse') {
            list.children = SubChildrenLis(subList.children!);
        }
        return list;
    };

    const withoutMenu = menu?.children?.filter((item: NavItemType) => item.id !== 'no-menu');

    const ChildrenList: NavItemType[] | undefined = withoutMenu?.map((subList: NavItemType) => menuItem(subList));

    const menuList: NavItemType = {
        ...menu,
        title: menu.title ? t(menu.title as string) : '默认值',
        // @ts-ignore
        icon: icons[menu.icon],
        children: ChildrenList
    };

    return menuList;
};
