import { create } from 'zustand';
interface MyApp {
    totals: number;
    totalList: any[];
    setTotalList: (data: any[]) => void;
    setTotals: (data: number) => void;
}
const myApp = create<MyApp>((set) => ({
    totals: 0,
    totalList: [],
    setTotalList: (data) => set(() => ({ totalList: data })),
    setTotals: (data) => set(() => ({ totals: data }))
}));
export default myApp;
