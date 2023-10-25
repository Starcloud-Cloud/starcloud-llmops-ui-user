import request from 'utils/axios';

/**
 * 新增关键词
 * @param data
 * @returns
 */
export const addKey = (data: any) => {
    return request.post({ url: '/listing/draft/key/add', data });
};

/**
 * 删除关键词
 * @param data
 * @returns
 */
export const delKey = (data: any) => {
    return request.delete({ url: '/listing/draft/key/remove', data });
};

/**
 * 分页查询
 */
export const getListingPage = (data: any) => {
    return request.get({ url: '/listing/draft/page', params: data });
};

/**
 * 获取详情
 * @param uid
 * @param version
 * @returns
 */
export const getListingDetail = (uid: string, version: number) => {
    return request.get({ url: `/listing/draft/detail/${uid}/${version} ` });
};

/**
 * 保存
 * @param data
 * @returns
 */
export const saveListing = (data: any) => {
    return request.put({ url: '/listing/draft/save', data });
};

/**
 * 删除草稿
 * @param data
 * @returns
 */
export const delListing = (data: any) => {
    return request.delete({ url: '/listing/draft/delete', data });
};

/**
 * 评分
 * @param data
 * @returns
 */
export const getGrade = (data: any) => {
    return request.put({ url: '/listing/draft/score', data });
};

//导入词库
export const importDict = (data: any) => {
    return request.put({ url: '/listing/draft/import/dict', data });
};

// 克隆
export const draftClone = (data: any) => {
    return request.post({ url: 'listing/draft/clone', data });
};

// 导出
export const draftExport = (data: any) => {
    return request.get({ url: 'listing/draft/export', params: data });
};
