import { create } from 'zustand';

const marketStore = create<any>((set: any) => ({
    total: null,
    templateList: [],
    newtemplateList: [],
    categoryList: [],
    setTotal: (data: string | number) => set(() => ({ total: data })),
    setTemplate: (data: any[]) => set(() => ({ templateList: data })),
    setNewTemplate: (data: any[]) => set(() => ({ newtemplateList: data })),
    setCategoryList: (data: any[]) => set(() => ({ categoryList: data }))
}));
export default marketStore;
