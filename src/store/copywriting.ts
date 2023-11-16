import { create } from 'zustand';
type Copywriting = {
    tableList: any[];
    setTableList: (data: any[]) => void;
};
const copywriting = create<Copywriting>((set) => ({
    tableList: [],
    setTableList: (data) =>
        set(() => ({
            tableList: data
        }))
}));
export default copywriting;
