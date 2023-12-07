import request from 'utils/axios';

/**
 * 获取任务详情
 * @returns
 */
export const getTaskDetail = (uid: string) => {
    return request.get({ url: `/llm/xhs/customer/detail/${uid}` });
};

/**
 * 认领任务
 * @param uid
 * @returns
 */
export const claimTask = (data: any) => {
    return request.put({ url: `/llm/xhs/customer/claim`, data });
};
