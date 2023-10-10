import { create } from 'zustand';
type UserInfo = {
    use: {
        inviteCode?: string;
        inviteUrl?: string;
        mobile?: string;
    };
    userInfo: null | any;
    setUserInfo: (data: string | null) => void;
    setuse: (data: any) => void;
};
const userInfoStore = create<UserInfo>((set) => ({
    userInfo: null,
    use: {},
    setUserInfo: (data) =>
        set(() => ({
            userInfo: data
        })),
    setuse: (data) =>
        set(() => ({
            use: data
        }))
}));
export default userInfoStore;
