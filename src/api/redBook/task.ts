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

//分页查询单条任务
export const singlePage = (params: any) => {
    return request.get({ url: '/llm/single/page', params });
};
//增加单条任务
export const singleAdd = (data: any) => {
    return request.put({ url: `/llm/single/add/${data}` });
};
//修改单条任务
export const singleModify = (data: any) => {
    return request.put({ url: `/llm/single/modify`, data });
};
//删除单条任务
export const singleDelete = (data: any) => {
    return request.delete({ url: `/llm/single/delete/${data}` });
};
