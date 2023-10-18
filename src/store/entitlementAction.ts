import { create } from 'zustand';
type UserInfo = {
    use: {
        inviteCode?: string;
        inviteUrl?: string;
        mobile?: string;
    };
    userInfo: null | any;
    status: boolean;
    setUserInfo: (data: string | null) => void;
    setuse: (data: any) => void;
    setStatus: (data: any) => void;
};
const userInfoStore = create<UserInfo>((set) => ({
    userInfo: null,
    status: false,
    use: {},
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
        }))
}));
export default userInfoStore;
