import request from 'utils/axios';

//图片风格列表
export const imageStyles = () => {
    return request.get({ url: '/llm/creative/plan/imageStyles' });
};

//文案模板应用列表
export const copyWritingTemplates = () => {
    return request.get({ url: '/llm/creative/plan/copyWritingTemplates/XHS' });
};
//获取默认模板列表
export const listTemplates = () => {
    return request.get({ url: '/llm/creative/plan/listTemplates' });
};
//获取创作方案列表
export const schemeList = () => {
    return request.get({ url: '/llm/creative/scheme/listOption' });
};
//创建
export const planCreate = (data: any) => {
    return request.post({ url: '/llm/creative/plan/create', data });
};
//列表
export const planPage = (params: any) => {
    return request.get({ url: '/llm/creative/plan/page', params });
};
//列表1
export const planPages = () => {
    return request.get({ url: '/llm/creative/plan/list' });
};
//删除
export const planDelete = (data: any) => {
    return request.delete({ url: '/llm/creative/plan/delete/' + data });
};
//复制
export const planCopy = (data: any) => {
    return request.post({ url: '/llm/creative/plan/copy', data });
};
//详情
export const planGet = (data: any) => {
    return request.get({ url: '/llm/creative/plan/get/' + data });
};
//编辑
export const planModify = (data: any) => {
    return request.post({ url: '/llm/creative/plan/modify', data });
};
//执行
export const planExecute = (data: any) => {
    return request.post({ url: '/llm/creative/plan/execute', data });
};
//点赞
export const contentLike = (data: any) => {
    return request.post({ url: '/llm/xhs/content/like', data });
};
//取消点赞
export const contentUnlike = (data: any) => {
    return request.post({ url: '/llm/xhs/content/unlike', data });
};
//失败重试
export const failureRetry = (data: any) => {
    return request.post({ url: `/llm/xhs/content/retry`, data });
};
//失败重试
export const batchPages = (data: any) => {
    return request.get({ url: `/llm/creative/batch/page`, params: data });
};
//获取素材元数据
export const metadata = () => {
    return request.get({ url: `/llm/creative/material/metadata` });
};
//获取表头数据
export const materialTemplate = (type: any) => {
    return request.get({ url: `/llm/material/template/${type}` });
};
//导入素材
export const materialImport = (data: any) => {
    return request.upload({ url: `/llm/material/import`, data });
};
//下载素材
export const materialExport = (params: any) => {
    return request.download({ url: `/llm/material/download/template`, params });
};
//查询导入结果
export const materialResilt = (parseUid: any) => {
    return request.get({ url: `/llm/material/result/${parseUid}` });
};

//进入创作计划获取应用数据
export const getPlan = (params: any) => {
    return request.get({ url: `/llm/creative/plan/getByAppUid`, params });
};
//获取应用计划示例
export const getListExample = (uid: any) => {
    return request.get({ url: `/llm/xhs/content/listExample?uidList=${uid}` });
};
//更新版本
export const planUpgrade = (data: any) => {
    return request.post({ url: `/llm/creative/plan/upgrade`, data });
};
//小红书查询
export const materialParse = (data: any) => {
    return request.post({ url: `/llm/material/parse`, data });
};

//ai 素材
export const materialGenerate = (data: any) => {
    return request.post({ url: `/llm/creative/material/materialGenerate`, data, timeout: 60000 });
};
//ai 批量生成
export const customMaterialGenerate = (data: any) => {
    return request.post({ url: `/llm/creative/material/customMaterialGenerate`, data, timeout: 60000 });
};
