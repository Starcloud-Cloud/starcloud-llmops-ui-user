import request from 'utils/axios';

//获取素材库表头
export const getMaterialTitle = (params: any) => {
    return request.get({ url: '/llm/material-library/get-uid', params });
};
//获取素材库表格内容
export const getMaterialPage = (params: any) => {
    return request.get({ url: '/llm/material-library-slice/page-uid', params });
};
//创建表格
export const createMaterial = (data: any) => {
    return request.post({ url: '/llm/material-library-slice/create', data });
};
//编辑表格
export const updateMaterial = (data: any) => {
    return request.put({ url: '/llm/material-library-slice/update', data });
};
//删除表格
export const delMaterial = (params: any) => {
    return request.delete({ url: '/llm/material-library-slice/delete', params });
};
//批量删除表格
export const delsMaterial = (data: any) => {
    return request.post({ url: '/llm/material-library-slice/delete-batch', data });
};
