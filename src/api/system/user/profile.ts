import request from 'utils/axios';

export interface ProfileDept {
    id: number;
    name: string;
}
export interface ProfileRole {
    id: number;
    name: string;
}
export interface ProfilePost {
    id: number;
    name: string;
}
export interface SocialUser {
    id: number;
    type: number;
    openid: string;
    token: string;
    rawTokenInfo: string;
    nickname: string;
    avatar: string;
    rawUserInfo: string;
    code: string;
    state: string;
}
export interface ProfileVO {
    id: number;
    username: string;
    nickname: string;
    dept: ProfileDept;
    roles: ProfileRole[];
    posts: ProfilePost[];
    socialUsers: SocialUser[];
    email: string;
    mobile: string;
    sex: number;
    avatar: string;
    status: number;
    remark: string;
    loginIp: string;
    loginDate: Date;
    createTime: Date;
}

export interface UserProfileUpdateReqVO {
    username: string;
    nickname: string;
    email: string;
    mobile: string;
    sex: number;
}

// 查询用户个人信息
export const getUserProfile = () => {
    return request.get({ url: '/system/user/profile/get' });
};

// 修改用户个人信息
export const updateUserProfile = (data: UserProfileUpdateReqVO) => {
    return request.put({ url: '/llm/auth/user/update', data });
};

// 用户密码重置
export const updateUserPassword = (oldPassword: string, newPassword: string) => {
    return request.put({
        url: '/system/user/profile/update-password',
        data: {
            oldPassword: oldPassword,
            newPassword: newPassword
        }
    });
};

// 用户头像上传
export const uploadAvatar = (data: any) => {
    return request.upload({ url: '/system/user/profile/update-avatar', data: data });
};

// 获取授权列表
export const getAuthList = (data: any) => {
    return request.get({ url: '/system/social-user/page', params: data });
};

// 取消绑定
export const unBind = (data: any) => {
    return request.delete({ url: '/system/social-user/unbind', data });
};
