import request from 'utils/axios';

export const createRedBookImg = (data: any) => {
    return request.post({ url: '/llm/app/xhs/bathImageExecute', data });
};

export const doCreateText = (data: any) => {
    return request.post({ url: '/llm/app/xhs/appExecute', data });
};

export const getContentPage = (data: any) => {
    return request.get({ url: '/llm/xhs/content/page', params: data });
};

export const getContentDetail = (data: any) => {
    return request.get({ url: '/llm/xhs/content/page', params: data });
};
