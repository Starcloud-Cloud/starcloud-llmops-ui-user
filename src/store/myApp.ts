import { create } from 'zustand';
import { persist } from 'zustand/middleware';
interface MyApp {
    totals: number;
    totalList: any[];
    setTotalList: (data: any[]) => void;
    setTotals: (data: number) => void;
}

const myApp = create<MyApp, [['zustand/persist', MyApp]]>(
    persist(
        (set) => ({
            totals: 0,
            totalList: [],
            setTotalList: (data) => set(() => ({ totalList: data })),
            setTotals: (data) => set(() => ({ totals: data }))
        }),
        {
            name: 'myApp',
            getStorage: () => localStorage
        }
    )
);
export default myApp;
