import request from 'utils/axios';
//模板市场列表
export const marketPage = (params: PageParam) => {
    return request.get({ url: '/llm/app/market/page', params });
};
//模板市场详情
export const marketDeatail = (data: { uid: string; version: string }) => {
    return request.get({ url: `llm/app/market/get/${data.uid}/${data.version}` });
};
//获取等级
export const userBenefits = () => {
    return request.post({ url: 'llm/user-benefits/info' });
};
//获取分类
export const categories = () => {
    return request.get({ url: '/llm/app/categories' });
};
