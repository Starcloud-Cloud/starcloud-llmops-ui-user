import request from 'utils/axios';
export const marketPage = (params: PageParam) => {
    return request.get({ url: '/llm/app/market/page', params });
};
export const marketDeatail = (params: PageParam) => {
    return request.get({ url: 'llm/app/market/get', params });
};
export const userBenefits = () => {
    return request.post({ url: 'llm/user-benefits/info' });
};
