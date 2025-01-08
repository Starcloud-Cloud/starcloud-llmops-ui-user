import request from 'utils/axios';
//模板市场列表
export const generateVideo = (data: any) => {
    return request.post({ url: '/llm/xhs/content/video/generate', data });
};
