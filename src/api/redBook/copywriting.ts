import request from 'utils/axios';

//列表
export const schemePage = (data: any) => {
    return request.get({ url: '/llm/creative/scheme/page', data });
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
