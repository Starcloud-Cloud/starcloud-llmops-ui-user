import request from 'utils/axios';
import { getRefreshToken } from 'utils/auth';
import type { UserLoginVO } from './types';

export interface SmsCodeVO {
    mobile: string;
    scene: number;
}

export interface SmsLoginVO {
    mobile: string;
    code: string;
}

// 登录 | Login
export const login = (data: UserLoginVO) => {
    return request.post({ url: '/system/auth/login', data });
};

// 刷新访问令牌 | Refresh access token
export const refreshToken = () => {
    return request.post({ url: '/system/auth/refresh-token?refreshToken=' + getRefreshToken() });
};

// 使用租户名，获得租户编号 | Get tenant ID by tenant name
export const getTenantIdByName = (name: string) => {
    return request.get({ url: '/system/tenant/get-id-by-name?name=' + name });
};

// 登出 | Logout
export const loginOut = () => {
    return request.post({ url: '/system/auth/logout' });
};

// 获取用户权限信息 | Get user permission information
export const getInfo = () => {
    return request.get({ url: '/system/auth/get-permission-info' });
};

// 路由 | Routes
export const getAsyncRoutes = () => {
    return request.get({ url: '/system/auth/list-menus' });
};

//获取登录验证码 | Get login verification code
export const sendSmsCode = (data: SmsCodeVO) => {
    return request.post({ url: '/system/auth/send-sms-code', data });
};

// 短信验证码登录 | Login with SMS verification code
export const smsLogin = (data: SmsLoginVO) => {
    return request.post({ url: '/system/auth/sms-login', data });
};

// 社交授权的跳转 | Social authorization redirect
export const socialAuthRedirect = (type: number, redirectUri: string) => {
    return request.get({
        url: '/system/auth/social-auth-redirect?type=' + type + '&redirectUri=' + redirectUri
    });
};

// 获取验证图片以及 token | Get verification image and token
export const getCode = (data: any) => {
    return request.postOriginal({ url: 'system/captcha/get', data });
};

// 滑动或者点选验证 | Slide or select validation
export const reqCheck = (data: any) => {
    return request.postOriginal({ url: 'system/captcha/check', data });
};

// 获取用户身份信息 | Get user identity information
export const getUserInfo = () => {
    return request.get({ url: '/llm/auth/user/detail' });
};

// 获取登陆二维码 | QRcode
export const getQRcode = (data: { inviteCode: string | null }) => {
    return request.get({ url: '/llm/wechat/qr?inviteCode=' + data.inviteCode });
};

// 注册 | Register
export const oriregister = (data: any) => {
    return request.postOriginal({ url: '/llm/auth/register', data });
};

// 二维码登陆 | QRcodeLogin
export const qRcodeLogin = (data: any) => {
    return request.postOriginal({ url: 'llm/wechat/qr/login', data });
};
