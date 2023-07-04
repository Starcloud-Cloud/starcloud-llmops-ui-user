import request from 'utils/axios';

// 检查是否签到 | Check sign in status
export const checkSignInStatus = () => {
    return request.post({ url: '/llm/user-benefits/checkSignIn' });
};

// 进行签到 | Sign in
export const signIn = () => {
    return request.post({ url: '/llm/user-benefits/signIn' });
};

// 兑换权益 | Redeem benefits
export const redeemBenefits = (data: string) => {
    return request.postOriginal({ url: `/llm/user-benefits/code?code=${data}` });
};

// 参数接口

// 响应接口
export interface GetUserBenefitsPageRes {
    list: {
        benefitsName: string;
        benefitsList: {
            name: string;
            type: string;
            amount: number;
        }[];
        effectiveTime: number;
        expirationTime: number;
        enabled: boolean;
        validity: number;
        validityUnit: string;
    }[];
    total: number;
}

/**
 * 获得用户权益 - 分页
 * @param {string} pageVO 管理后台 - 用户权益分页 Request VO
 * @returns
 */
export const getUserBenefitsPage = (pageVO: string): Promise<GetUserBenefitsPageRes> => {
    return request.get({ url: `llm/user-benefits/page?pageVO=${pageVO}` });
};
