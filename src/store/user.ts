import { create } from 'zustand';
import { getAccessToken, removeToken } from 'utils/auth';
import { CACHE_KEY, useCache } from 'hooks/web/useCache';
import { getInfo, loginOut } from 'api/login';
// eslint-disable-next-line react-hooks/rules-of-hooks
const { wsCache } = useCache();

interface UserVO {
    id: number;
    avatar: string;
    nickname: string;
    [key: string]: any;
}
type UserStore = {
    [x: string]: any;
    permissions: string[];
    roles: string[];
    isSetUser: boolean;
    user: UserVO;
    signInStatus: boolean | null;
    setSignInStatus: (status: boolean) => void;
    setUserInfoAction: () => Promise<null | undefined>;
    loginOut: () => Promise<void>;
    resetState: () => void;
};

const useUserStore = create<UserStore>((set) => ({
    permissions: [],
    roles: [],
    isSetUser: false,
    user: {
        id: 0,
        avatar: '',
        nickname: ''
    },
    setUserInfoAction: async () => {
        if (!getAccessToken()) {
            set({
                permissions: [],
                roles: [],
                isSetUser: false,
                user: {
                    id: 0,
                    avatar: '',
                    nickname: ''
                }
            });
            return null;
        }
        let userInfo = wsCache.get(CACHE_KEY.INFO);
        // if (!userInfo) {
        userInfo = await getInfo();
        // }
        set({
            permissions: userInfo.permissions,
            roles: userInfo.roles,
            user: userInfo.user,
            isSetUser: true
        });
        wsCache.set(CACHE_KEY.INFO, userInfo);
        wsCache.set(CACHE_KEY.ROLE_ROUTERS, userInfo?.menus);
    },
    loginOut: async () => {
        await loginOut();
        removeToken();
        wsCache.delete(CACHE_KEY.USER);
        wsCache.delete(CACHE_KEY.INFO);
        wsCache.delete('userInfo');
        wsCache.delete('market');
        wsCache.delete('myChat');
        wsCache.delete('myApp');
        wsCache.delete('roleRouters');
        // wsCache.clear();
        set({
            permissions: [],
            roles: [],
            isSetUser: false,
            user: {
                id: 0,
                avatar: '',
                nickname: ''
            }
        });
    },
    resetState: () => {
        set({
            permissions: [],
            roles: [],
            isSetUser: false,
            user: {
                id: 0,
                avatar: '',
                nickname: ''
            }
        });
    },
    signInStatus: null,
    setSignInStatus: (status: boolean) => {
        set({ signInStatus: status });
    }
}));

export default useUserStore;
