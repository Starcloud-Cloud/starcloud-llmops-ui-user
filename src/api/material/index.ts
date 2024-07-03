import request from 'utils/axios';

/**
 * 素材分页
 * @param data
 * @returns
 */
export const getMaterialPage = (data: any) => {
    return request.get({ url: '/llm/material-library/page', params: data });
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
