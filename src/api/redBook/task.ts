import request from 'utils/axios';

//分页查询任务列表
export const notificationPage = (params: any) => {
    return request.get({ url: '/llm/notification/page', params });
};

//创建任务
export const notificationCreate = (data: any) => {
    return request.post({ url: '/llm/notification/create', data });
};
//编辑任务
export const notificationModify = (data: any) => {
    return request.delete({ url: '/llm/notification/modify', data });
};
//删除任务
export const notificationDelete = (data: any) => {
    return request.delete({ url: '/llm/notification/delete/' + data });
};
//发布取消任务
export const notificationPublish = (data: any, publish: Boolean) => {
    return request.put({ url: '/llm/notification/publish/' + data + '?publish=' + publish });
};
