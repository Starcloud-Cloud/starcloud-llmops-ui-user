import request from 'utils/axios';
import fetch from 'utils/fetch';

/**
 * 对话
 * @returns
 */
export const marketMessageSSE = (data: any) => {
    return fetch('/llm/market/chat', 'post', data);
};

/**
 * 查询应用市场列表
 * @param data
 * @returns
 */
export const marketPage = (data: any) => {
    return request.get({ url: '/llm/app/market/page', params: data });
};

/**
 * 查询当前用户的会话
 * @param data
 * @returns
 */
export const conversation = (data: any) => {
    return request.get({ url: '/llm/market/conversation', params: data });
};

/**
 * 查询聊天会话历史
 * @param data
 * @returns
 */
export const getChatHistory = (data: any) => {
    return request.get({ url: '/llm/chat/history', params: data });
};

/**
 * 获取机器人信息
 * @param appuid
 * @returns
 */
export const getChatInfo = (appUid: any) => {
    return request.get({ url: `/llm/app/market/get/${appUid}` });
};
