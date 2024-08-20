import request from 'utils/axios';

/**
 * 插件详情
 * @param uid
 * @returns
 */
export const getPlugInfo = (uid: string) => {
    return request.post({ url: `/llm/plugin/definition/detail/${uid}` });
};

/**
 * 新增插件配置
 * @param data
 * @returns
 */
export const addPlugConfigInfo = (data: any) => {
    return request.post({ url: `/llm/plugin/config/create`, data });
};

/**
 * 修改插件配置
 * @param data
 * @returns
 */
export const updatePlugConfigInfo = (data: any) => {
    return request.post({ url: `/llm/plugin/config/modify`, data });
};

/**
 * 获取查查配置
 * @param data
 * @returns
 */
export const getPlugConfigInfo = (data: any) => {
    return request.get({ url: '/llm/plugin/config/detail', params: data });
};
