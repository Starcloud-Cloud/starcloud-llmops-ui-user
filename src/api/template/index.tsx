import request from 'utils/axios';
//模板市场列表
export const marketPage = (params: PageParam) => {
    return request.get({ url: '/llm/app/market/page', params });
};
//模板市场详情
export const marketDeatail = (data: { uid: string }) => {
    return request.get({ url: `/llm/app/market/getByUid/${data.uid}` });
};
//获取等级
export const userBenefits = () => {
    return request.post({ url: '/llm/user-benefits/info' });
};
//获取分类
export const categories = () => {
    return request.get({ url: '/llm/app/categories' });
};
//安装应用市场
export const installTemplate = (data: { uid: string }) => {
    return request.postOriginal({ url: '/llm/app/market/install', data });
};
//执行
export const executeMarket = (data: any) => {
    return request.postOriginal({ url: '/llm/app/execute/market', data });
};

//推荐应用
export const recommends = () => {
    return request.get({ url: '/llm/app/recommends' });
};
//我的应用
export const appPage = (params: { pageNo: number; pageSize: number }) => {
    return request.get({ url: '/llm/app/page', params });
};

//执行记录图标
export const logStatistics = () => {
    return request.post({ url: '/llm/app/log/statistics' });
};
//执行记录列表
export const infoPage = (data: any) => {
    return request.post({ url: 'llm/app/log/infoPage', data });
};
