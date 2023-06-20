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
