import request from 'utils/axios';

//获取元数据
export const metadataData = () => {
    return request.get({ url: '/llm/plugin/definition/metadata' });
};
//获取插件列表
export const publishedList = () => {
    return request.get({ url: '/llm/plugin/definition/published' });
};
//获取未发布插件列表
export const ownerListList = () => {
    return request.get({ url: '/llm/plugin/definition/ownerList' });
};
//删除插件
export const delOwner = (uid: string) => {
    return request.delete({ url: '/llm/plugin/definition/delete/' + uid });
};
//空间列表
export const getSpaceList = (params: any) => {
    return request.get({ url: '/llm/plugin/definition/spaceList', params });
};
//验证
export const plugVerify = (data: any) => {
    return request.post({ url: '/llm/plugin/definition/verify', data });
};
//验证执行结果
export const plugVerifyResult = (data: any) => {
    return request.post({ url: '/llm/plugin/definition/verifyResult', data });
};
//新增
export const createPlug = (data: any) => {
    return request.post({ url: '/llm/plugin/definition/create', data });
};
//编辑
export const modifyPlug = (data: any) => {
    return request.put({ url: '/llm/plugin/definition/modify', data });
};
//插件详情
export const detailPlug = (data: any) => {
    return request.post({ url: '/llm/plugin/definition/detail/' + data });
};
//coze List
export const cozePage = (params: any) => {
    return request.get({ url: '/system/social-user/page', params });
};
//bot List
export const spaceBots = (params: any) => {
    return request.get({ url: '/llm/plugin/definition/spaceBots', params });
};
//发布
export const plugPublish = (uid: any) => {
    return request.get({ url: '/llm/plugin/definition/publish/' + uid });
};
//执行插件
export const plugExecute = (data: any) => {
    return request.post({ url: '/llm/creative/plugins/execute', data });
};
//获取执行结果
export const plugexEcuteResult = (data: any) => {
    return request.post({ url: '/llm/creative/plugins/executeResult', data });
};
