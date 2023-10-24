import { create } from 'zustand';
import { persist } from 'zustand/middleware';
type UserInfo = {
    use: {
        inviteCode?: string;
        inviteUrl?: string;
        mobile?: string;
    };
    userInfo: null | any;
    twoUser: null | any;
    status: boolean;
    setUserInfo: (data: string | null) => void;
    setuse: (data: any) => void;
    setStatus: (data: any) => void;
    setTwoUser: (data: any) => void;
};
const userInfoStore = create<UserInfo, [['zustand/persist', UserInfo]]>(
    persist(
        (set) => ({
            userInfo: null,
            status: false,
            use: {},
            twoUser: null,
            setUserInfo: (data) =>
                set(() => ({
                    userInfo: data
                })),
            setuse: (data) =>
                set(() => ({
                    use: data
                })),
            setStatus: (data) =>
                set(() => ({
                    status: data
                })),
            setTwoUser: (data: any) =>
                set(() => ({
                    twoUser: data
                }))
        }),
        {
            name: 'userInfo',
            getStorage: () => localStorage
        }
    )
);
export default userInfoStore;
