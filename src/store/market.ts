import { create } from 'zustand';
import { persist } from 'zustand/middleware';
type MarketStore = {
    total: string | number | null;
    templateList: any[];
    newtemplateList: any[];
    sorllList: any[];
    categoryList: any[];
    categoryTrees: any[];
    setTotal: (data: number) => void;
    setTemplate: (data: any[]) => void;
    setNewTemplate: (data: any[]) => void;
    setSorllList: (data: any[]) => void;
    setCategoryList: (data: any[]) => void;
    setCategoryTree: (data: any[]) => void;
};
const marketStore = create<MarketStore, [['zustand/persist', MarketStore]]>(
    persist(
        (set) => ({
            total: null,
            templateList: [],
            newtemplateList: [],
            sorllList: [],
            categoryList: [],
            categoryTrees: [],
            setTotal: (data) => set(() => ({ total: data })),
            setTemplate: (data) => set(() => ({ templateList: data })),
            setNewTemplate: (data) => set(() => ({ newtemplateList: data })),
            setSorllList: (data) => set(() => ({ sorllList: data })),
            setCategoryList: (data) => set(() => ({ categoryList: data })),
            setCategoryTree: (data) => set(() => ({ categoryTrees: data }))
        }),
        {
            name: 'market', // name of the storage key
            getStorage: () => localStorage // storage object (localStorage or sessionStorage)
        }
    )
);
export default marketStore;
