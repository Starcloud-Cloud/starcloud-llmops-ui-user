import request from 'utils/axios';
//模板市场列表
export const marketPage = (params: PageParam) => {
    return request.get({ url: '/llm/app/market/page', params });
};
//模板市场详情
export const marketDeatail = (data: { uid: string }) => {
    return request.get({ url: `/llm/app/market/get/${data.uid}` });
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
export const recommends = (params?: any) => {
    return request.get({ url: '/llm/app/recommends', params });
};
//我的应用
export const appPage = (params: { pageNo: number; pageSize: number; mode?: string }) => {
    return request.get({ url: '/llm/app/page', params });
};
//删除应用
export const del = (uid: string) => {
    return request.delete({ url: `/llm/app/delete/${uid}` });
};

//执行记录echart
export const logStatistics = (data: { appName: string; timeType: string }) => {
    return request.post({ url: '/llm/app/log/statistics', data });
};
//获取时间
export const logTimeType = () => {
    return request.get({ url: '/llm/app/log/timeType' });
};
//执行记录列表
export const infoPage = (data: any) => {
    return request.post({ url: 'llm/app/log/infoPage', data });
};

//获取我的应用
export const getApp = (data: { uid: string }) => {
    return request.get({ url: `/llm/app/get/${data.uid}` });
};
//获取推荐
export const getRecommendApp = (data: { recommend: string }) => {
    return request.get({ url: `/llm/app/getRecommendApp/${data.recommend}` });
};
//创建应用
export const appCreate = (data: any) => {
    return request.postOriginal({ url: `/llm/app/create`, data });
};
//更新应用
export const appModify = (data: any) => {
    return request.putOriginal({ url: `/llm/app/modify`, data });
};
//增加步骤
export const stepList = () => {
    return request.get({ url: `/llm/app/stepList` });
};

//创建发布记录
export const publishCreate = (data: { appUid: string }) => {
    return request.post({ url: `/llm/app/publish/create`, data });
};
//发布
export const publishOperate = (data: { uid: string; status: number; appUid: string }) => {
    return request.post({ url: `/llm/app/publish/operate`, data });
};
//发布记录
export const publishPage = (params: { appUid: string }) => {
    return request.get({ url: `/llm/app/publish/page`, params });
};
//是否可更新发布
export const getLatest = (appUid: string) => {
    return request.get({ url: `/llm/app/publish/getLatest/${appUid}` });
};
//管理员审核发布
export const pageAdmin = (params: { pageNo: number; pageSize: number; name?: string; model?: string; audit?: number | string }) => {
    return request.get({ url: `/llm/app/publish/pageAdmin`, params });
};
//管理员审核
export const setAudit = (data: { uid: string; appUid: string; status: number }) => {
    return request.post({ url: `/llm/app/publish/audit`, data });
};
