import { create } from 'zustand';
interface MarketStore {
    total: string | number | null;
    templateList: any[];
    newtemplateList: any[];
    categoryList: any[];
    setTotal: (data: number) => void;
    setTemplate: (data: any[]) => void;
    setNewTemplate: (data: any[]) => void;
    setCategoryList: (data: any[]) => void;
}
const marketStore = create<MarketStore>((set) => ({
    total: null,
    templateList: [],
    newtemplateList: [],
    categoryList: [],
    setTotal: (data) => set(() => ({ total: data })),
    setTemplate: (data) => set(() => ({ templateList: data })),
    setNewTemplate: (data) => set(() => ({ newtemplateList: data })),
    setCategoryList: (data) => set(() => ({ categoryList: data }))
}));
export default marketStore;
