import request from 'utils/axios';
//模板市场列表
export const getH5 = (data: any) => {
    return request.get({ url: '/llm/xhs/content/resource/' + data });
};

//生成图片PDF
export const PdfExecute = (data: any) => {
    return request.post({ url: '/llm/xhs/content/resource/imagePdf', data });
};
//生成单词列表
export const listWordbookTemplate = () => {
    return request.get({ url: '/llm/poster/material/u/listWordbookTemplate' });
};
//生成单词PDF
export const WordbookExecute = (data: any) => {
    return request.post({ url: '/llm/xhs/content/resource/wordbook', data });
};
//保存配置
export const saveConfig = (data: any) => {
    return request.post({ url: '/llm/xhs/content/resource/save', data });
};
//h5 获取配置
export const getShareResource = (data: any) => {
    return request.get({ url: '/llm/xhs/content/shareResource/' + data });
};
