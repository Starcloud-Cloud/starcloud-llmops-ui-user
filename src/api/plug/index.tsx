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
/**
 * 元素局
 * @param data
 * @returns
 */
export const getMetadata = () => {
    return request.get({ url: '/llm/job/config/metadata' });
};
/**
 * 查询定时任务
 * @param data
 * @returns
 */
export const configDetail = (data: any) => {
    return request.get({ url: '/llm/job/config/detail/' + data });
};
/**
 * 新建定时任务
 * @param data
 * @returns
 */
export const modifyConfig = (data: any) => {
    return request.post({ url: '/llm/job/config/modify', data });
};
/**
 * 编辑定时任务
 * @param data
 * @returns
 */
export const createConfig = (data: any) => {
    return request.post({ url: '/llm/job/config/create', data });
};
