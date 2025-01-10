import request from 'utils/axios';
//模板市场列表
export const saveSetting = (data: any) => {
    return request.post({ url: '/llm/xhs/content/video/quick', data });
};
export const generateVideo = (data: any) => {
    return request.post({ url: '/llm/xhs/content/video/generate', data });
};
export const getVideoResult = (data: any) => {
    return request.post({ url: '/llm/xhs/content/video/result', data });
};
