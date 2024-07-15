import request from 'utils/axios';

/**
 * 素材分页
 * @param data
 * @returns
 */
export const getMaterialPage = (data: any) => {
    return request.post({ url: '/llm/material-library/page', data });
};

/**
 * 新增
 * @param data
 * @returns
 */
export const addMaterial = (data: any) => {
    return request.post({ url: '/llm/material-library/create', data });
};

/**
 * 新增
 * @param data
 * @returns
 */
export const updateMaterial = (data: any) => {
    return request.put({ url: '/llm/material-library/update', data });
};

/**
 * 新增
 * @param data
 * @returns
 */
export const delMaterial = (data: any) => {
    return request.delete({ url: '/llm/material-library/delete', params: data });
};

/**
 * 获取素材表头
 * @param data
 * @returns
 */
export const getMaterialLibraryTitleList = (data: any) => {
    return request.get({ url: '/llm/material-library/get', params: data });
};

/**
 * 修改列表信息
 */
export const updateMaterialLibraryTitle = (data: any) => {
    return request.put({ url: '/llm/material-library-table-column/update', data });
};

/**
 * 获取素材table
 * @param data
 * @returns
 */
export const getMaterialLibraryDataPage = (data: any) => {
    return request.get({ url: '/llm/material-library-slice/page', params: data });
};

/**
 * 获取素材库list
 * @param data
 * @returns
 */
export const getMaterialLibraryDataList = (data: any) => {
    return request.get({ url: '/llm/material-library-slice/list', params: data });
};

/**
 * 创建素材库知识
 * @param data
 * @returns
 */
export const createMaterialLibrarySlice = (data: any) => {
    return request.post({ url: '/llm/material-library-slice/create', data });
};

/**
 * 修改素材库知识
 * @param data
 * @returns
 */
export const updateMaterialLibrarySlice = (data: any) => {
    return request.put({ url: '/llm/material-library-slice/update', data });
};

/**
 * 删除素材库知识
 * @param data
 * @returns
 */
export const delMaterialLibrarySlice = (data: any) => {
    return request.delete({ url: '/llm/material-library-slice/delete', params: data });
};

/**
 * 批量删除
 * @param data
 * @returns
 */
export const delBatchMaterialLibrarySlice = (data: any) => {
    return request.post({ url: '/llm/material-library-slice/delete-batch', data });
};
