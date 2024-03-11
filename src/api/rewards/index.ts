import request from 'utils/axios';

// 检查是否签到 | Check sign in status
export const checkSignInStatus = () => {
    return request.get({ url: '/admin/sign-in/record/u/get-summary' });
};

// 进行签到 | Sign in
export const signIn = () => {
    return request.post({ url: '/admin/sign-in/record/u/create' });
};

// 兑换权益 | Redeem benefits
// export const redeemBenefits = (data: string) => {
//     return request.postOriginal({ url: `/llm/user-benefits/code?code=${data}` });
// };

export const redeemBenefits = (data: string) => {
    return request.postOriginal({ url: `/llm/promotion/code/u/use_rights_code?code=${data}` });
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
// export const getUserBenefitsPage = (pageVO: any): Promise<GetUserBenefitsPageRes> => {
//     return request.get({ url: `llm/user-benefits/page?pageNo=${pageVO.pageNo}&pageSize=${pageVO.pageSize}` });
// };

export const getUserBenefitsPage = (pageVO: any): Promise<GetUserBenefitsPageRes> => {
    return request.get({ url: `/llm/rights/u/page?pageNo=${pageVO.pageNo}&pageSize=${pageVO.pageSize}&bizId=${pageVO.bizId}` });
};

// 响应接口
export interface SubmitPayOrder {
    displayMode: string;
    displayContent: string;
}

export function submitPayOrder(data: any): Promise<SubmitPayOrder> {
    return request.post({ url: `/llm/pay/order/submit`, data });
}

export function getProductList() {
    return request.post({ url: `/llm/pay/order/product/list` });
}

export function getCouponCode(data: any) {
    return request.get({ url: `/llm/promotion/code/u/get_coupon_code`, params: data });
}
