import { create } from 'zustand';
import { persist } from 'zustand/middleware';
interface MyChat {
    totals: number;
    totalList: any[];
    setTotalList: (data: any[]) => void;
    setTotals: (data: number) => void;
}

const myChat = create<MyChat, [['zustand/persist', MyChat]]>(
    persist(
        (set) => ({
            totals: 0,
            totalList: [],
            setTotalList: (data) => set(() => ({ totalList: data })),
            setTotals: (data) => set(() => ({ totals: data }))
        }),
        {
            name: 'myChat',
            getStorage: () => localStorage
        }
    )
);
export default myChat;
