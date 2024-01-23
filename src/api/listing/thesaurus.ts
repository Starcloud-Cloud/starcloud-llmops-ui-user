import request from 'utils/axios';

// 新增词库
export const dictAdd = (data: any) => {
    return request.put({ url: '/listing/dict/create', data });
};

// 分页查询词库列表
export const dictPage = (data: any) => {
    return request.get({ url: '/listing/dict/page', params: data });
};

// 删除词库
export const delDict = (data: any) => {
    return request.post({ url: '/listing/dict/delete', data });
};

// 修改词库
export const editDict = (data: any) => {
    return request.put({ url: '/listing/dict/modify', data });
};

// 删除关键词
export const delKeyword = (data: any) => {
    return request.put({ url: `/listing/dict/key/remove/${data.uid}`, data: data.data });
};

// 新增关键词
export const addKeyword = (data: any) => {
    return request.put({ url: `/listing/dict/key/add/${data.uid}`, data: data.data });
};

// 词库列表
export const keywordPage = (data: any) => {
    return request.post({ url: `/listing/dict/key/page`, data });
};

// 词库详情
export const keywordDetail = (data: any) => {
    return request.get({ url: `/listing/dict/detail/${data.uid}` });
};
