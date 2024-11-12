import request from 'utils/axios';

/**
 * coze获取code
 * @param data
 * @returns
 */
export const authRedirect = (data: any) => {
    return request.get({ url: '/system/auth/social-auth-redirect', params: data });
};

export const authBind = (data: any) => {
    return request.post({ url: '/system/social-user/bind', data });
};
//编辑
export const updateNickname = (data: any) => {
    return request.post({ url: '/system/social-user/update-nickname', data });
};
