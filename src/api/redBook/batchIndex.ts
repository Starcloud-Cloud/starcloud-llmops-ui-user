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
    return request.get({ url: '/llm/creative/scheme/list' });
};
//创建
export const planCreate = (data: any) => {
    return request.post({ url: '/llm/creative/plan/create', data });
};
//列表
export const planPage = (params: any) => {
    return request.get({ url: '/llm/creative/plan/page', params });
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
