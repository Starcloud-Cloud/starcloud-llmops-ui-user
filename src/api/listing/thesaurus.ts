import request from 'utils/axios';

// 新增词库
// {
//     "name": "",
//     "endpoint": "",
//   }
export const dictAdd = (data: any) => {
    return request.put({ url: '/listing/dict/create', data });
};

// 分页查询词库列表
export const dictPage = (data: any) => {
    return request.get({ url: '/listing/dict/page', params: data });
};

// 删除
export const delPage = (data: any) => {
    return request.get({ url: '/listing/dict/delete', data });
};
