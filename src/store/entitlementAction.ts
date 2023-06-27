import { create } from 'zustand';

const userInfoStore = create<any>((set: any) => ({
    userInfo: null,
    setUserInfo: (data: string) =>
        set(() => ({
            userInfo: data
        }))
}));
export default userInfoStore;
