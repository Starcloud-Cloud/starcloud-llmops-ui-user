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

export const getContentDetail = (businessUid: string) => {
    return request.get({ url: `/llm/xhs/content/detail/${businessUid}` });
};

export const delContent = (businessUid: string) => {
    return request.delete({ url: `/llm/xhs/content/delete/${businessUid}` });
};

export const retryContent = (businessUid: string) => {
    return request.get({ url: `/llm/xhs/content/retry/${businessUid}` });
};
