import request from 'utils/axios';
import { vipSwitch } from 'utils/vipSwtich';
//模板市场列表
export const marketPage = (params: PageParam) => {
    return request.get({ url: '/llm/app/market/page', params });
};
//模板市场新列表
export const listGroupByCategory = (params: any) => {
    return request.get({ url: '/llm/app/market/listGroupByCategory', params });
};
//模板市场类别树
export const categoryTree = () => {
    return request.get({ url: '/llm/app/categoryTree' });
};
//模板市场详情
export const marketDeatail = (data: { uid: string }) => {
    return request.get({ url: `/llm/app/market/get/${data.uid}` });
};
//删除模板市场
export const delMarket = (uid: any) => {
    return request.delete({ url: `/llm/app/market/delete/${uid}` });
};

//获取等级
export const userBenefits = async () => {
    const res = await request.get({ url: '/llm/auth/user/all_detail' });
    const { rights, levels } = res;
    const { levelName, levelId, levelConfigDTO } = levels?.[0];

    return { benefits: rights, userLevelName: levelName, userLevel: vipSwitch(levelId), levelConfigDTO };
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
//复制应用
export const copy = (uid: string) => {
    return request.post({ url: `/llm/app/copy/${uid}` });
};
//应用类型
export const metadata = () => {
    return request.get({ url: `/llm/app/metadata` });
};

//执行记录echart
export const logStatistics = (data: any) => {
    return request.post({ url: '/llm/app/log/statistics', data });
};
//执行记录echart
export const statisticsByAppUid = (data: any) => {
    return request.post({ url: '/llm/app/log/statisticsByAppUid', data });
};
//获取时间
export const logMetaData = (data: string) => {
    return request.get({ url: `/llm/app/log/logMetaData/${data}` });
};
//执行记录列表
export const infoPage = (data: any) => {
    return request.post({ url: 'llm/app/log/infoPage', data });
};
//执行记录列表
export const infoPageByAppUid = (data: any) => {
    return request.post({ url: 'llm/app/log/infoPageByAppUid', data });
};
//弹窗执行记录列表
export const infoPageByMarketUid = (data: any) => {
    return request.post({ url: 'llm/app/log/infoPageByMarketUid', data });
};
//执行记录图片详情
export const detailImage = (data: any) => {
    return request.post({ url: 'llm/app/log/detail/image', data });
};

//执行记录执行详情
export const detailApp = (data: any) => {
    return request.post({ url: 'llm/app/log/detail/app', data });
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
export const stepList = (secnse: any) => {
    return request.get({ url: `/llm/app/stepList/${secnse}` });
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
export const getLatest = (appUid: string | undefined) => {
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

// 启用禁用状态
export const changeStatus = (data: any) => {
    return request.post({ url: `/llm/app/publish/channel/operate`, data });
};

// 创建站点
export const channelCreate = (data: any) => {
    return request.post({ url: `/llm/app/publish/channel/create`, data });
};
// 微信公众号
export const bindCreateUrl = (data: any) => {
    return request.post({ url: `/llm/wechat/bind/createUrl`, data });
};
// 修改站点
export const channelUpload = (data: any) => {
    return request.post({ url: `/llm/app/publish/channel/modify`, data });
};
// 删除站点
export const channelDelete = (data: any) => {
    return request.post({ url: `/llm/app/publish/channel/delete`, data });
};

// 创建微信群聊
export const addFriend = (data: any) => {
    return request.post({ url: `/llm/wecom/add/friend`, data });
};

// 创建微信群聊
export const listMarketAppOption = (params: any) => {
    return request.get({ url: `/llm/app/market/listMarketAppOption`, params });
};

// 获取应用限制
export const getLimit = (params: any) => {
    return request.get({ url: `/llm/app/publish/limit/get`, params });
};

// 创建应用限制
export const createLimit = (data: any) => {
    return request.post({ url: `/llm/app/publish/limit/create`, data });
};

// 修改应用限制
export const modifyLimit = (data: any) => {
    return request.post({ url: `/llm/app/publish/limit/modify`, data });
};
// 获取图片模板列表
export const imageTemplates = () => {
    return request.get({ url: `/llm/creative/scheme/templates` });
};
// 获取应用信息
export const xhsApp = (uid: any) => {
    return request.get({ url: `/llm/app/xhs/app/${uid}` });
};

// 获取模版分类
export const getImageTemplateTypes = () => {
    return request.get({ url: `/llm/creative/scheme/templateGroupByType` });
};
