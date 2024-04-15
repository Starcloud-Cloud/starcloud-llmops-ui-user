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
export const getContentDetail1 = (businessUid: string) => {
    return request.get({ url: `/llm/xhs/content/exampleDetail/${businessUid}` });
};

export const delContent = (businessUid: string) => {
    return request.delete({ url: `/llm/xhs/content/delete/${businessUid}` });
};

export const retryContent = (data: string) => {
    return request.post({ url: `/llm/xhs/content/regenerate`, data });
};

export const modify = (data: any) => {
    return request.put({ url: `/llm/xhs/content/modify`, data });
};
