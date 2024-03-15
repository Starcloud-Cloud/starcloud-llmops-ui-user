import request from 'utils/axios';
import fetch from 'utils/fetch';

//获取类目
export const schemeMetadata = () => {
    return request.get({ url: '/llm/creative/scheme/metadata' });
};
//列表
export const schemePage = (params: any) => {
    return request.get({ url: '/llm/creative/scheme/page', params });
};
//创建
export const schemeCreate = (data: any) => {
    return request.post({ url: '/llm/creative/scheme/create', data });
};
//详情
export const schemeGet = (data: any) => {
    return request.get({ url: `/llm/creative/scheme/get/${data}` });
};
//编辑
export const schemeModify = (data: any) => {
    return request.post({ url: `/llm/creative/scheme/modify`, data });
};
//复制
export const schemeCopy = (data: any) => {
    return request.post({ url: `/llm/creative/scheme/copy`, data });
};
//删除
export const schemeDelete = (data: any) => {
    return request.delete({ url: `/llm/creative/scheme/delete/${data}` });
};
//小红书需求生成
export const schemeDemand = (data: any) => {
    return fetch(`/llm/creative/scheme/summary`, 'post', data);
};
//小红书文案测试生成
export const schemeExample = (data: any) => {
    return request.post({ url: `/llm/creative/scheme/example`, data });
};
//小红书笔记内容
export const noteDetail = (data: any) => {
    return request.post({ url: `/llm/xhs/note/detail`, data });
};
//自定义内容拼接生成
export const appList = () => {
    return request.get({ url: `/llm/creative/scheme/appGroupList` });
};

export const getExample = (data: any) => {
    return request.post({ url: `/llm/xhs/content/getExample`, data });
};
export const schemeOptions = (data: any) => {
    return request.post({ url: `llm/creative/scheme/appStepOptions`, data });
};
