import request from 'utils/axios';

export const notificationPage = (params: any) => {
    return request.get({ url: '/llm/notification/page', params });
};
