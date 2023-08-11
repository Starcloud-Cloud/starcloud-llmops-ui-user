import { create } from 'zustand';
type UserInfo = {
    invitationCode: null | string;
    userInfo: null | any;
    setUserInfo: (data: string | null) => void;
    setInvitationCode: (data: string | null) => void;
};
const userInfoStore = create<UserInfo>((set) => ({
    userInfo: null,
    invitationCode: null,
    setUserInfo: (data) =>
        set(() => ({
            userInfo: data
        })),
    setInvitationCode: (data) =>
        set(() => ({
            invitationCode: data
        }))
}));
export default userInfoStore;
