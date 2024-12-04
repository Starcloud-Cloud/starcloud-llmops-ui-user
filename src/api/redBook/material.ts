import request from 'utils/axios';

//获取素材库表头
export const getMaterialTitle = (params: any) => {
    return request.post({ url: '/llm/material-library/get-app-uid', params });
};
//获取素材库表格内容
export const getMaterialPage = (data: any) => {
    return request.post({ url: '/llm/material-library-slice/page-app-uid', data });
};
//创建表格
export const createMaterial = (data: any) => {
    return request.post({ url: '/llm/material-library-slice/create', data });
};
//批量创建表格
export const createBatchMaterial = (data: any) => {
    return request.post({ url: '/llm/material-library-slice/create-batch', data });
};
//编辑表格
export const updateMaterial = (data: any) => {
    return request.put({ url: '/llm/material-library-slice/update', data });
};
//批量编辑表格
export const updateBatchMaterial = (data: any) => {
    return request.put({ url: '/llm/material-library-slice/update-batch', data });
};
//复制表格
export const copyMaterial = (params: any) => {
    return request.post({ url: '/llm/material-library-slice/copy', params });
};
//删除表格
export const delMaterial = (params: any) => {
    return request.delete({ url: '/llm/material-library-slice/delete', params });
};
//批量删除表格
export const delsMaterial = (data: any) => {
    return request.post({ url: '/llm/material-library-slice/delete-batch', data });
};
//下载模板
export const templateExport = (params: any) => {
    return request.download({ url: `/llm/material-library/export-template`, params });
};
//批量导入
export const templateImport = (data: any) => {
    return request.upload({ url: `/llm/material-library/import`, data });
};

//更新插件市场的配置
export const templateUpdate = (data: any) => {
    return request.post({ url: `/llm/material-library/update-plugin-Config`, data });
};
