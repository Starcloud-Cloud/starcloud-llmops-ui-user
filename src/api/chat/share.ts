import request from 'utils/axios/indexShare';
import fetch from 'utils/fetch/indexShare';

/**
 * 获取聊天记录
 * @returns 
 */
export const getShareChatHistory= (data: any) => {
    return request.get({ url: '/share/chat/history', params: data });
};

/**
 * 游客聊天
 * @returns
 */
export const shareMessageSSE = (data: any) => {
    return fetch('/share/chat/conversation', 'post', data);
};

/**
 *  应用明细
 * @returns 
 */
export const getChatDetail = (id: string) => {
    return request.get({ url: `/share/chat/detail/${id}` });
};

