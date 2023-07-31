import request from 'utils/axios';
import fetch from 'utils/fetch';

/**
 * 对话
 * @returns
 */
export const messageSSE = (data: any) => {
    return fetch('/llm/chat/completions', 'post', data);
};

/**
 * 查询模板
 * @param data
 */
export const getChatTemplate = (data: any) => {
    return request.get({ url: '/llm/app/recommends', params: data });
};

/**
 * 获取数据集
 * @param data
 */
export const getDatasetSource = (data: any) => {
    return request.get({ url: `/llm/dataset-source-data/list/${data.datasetId}` });
};

/**
 * 上传字符
 * @param data
 */
export const uploadCharacters = (data: any) => {
    return request.post({ url: `/llm/dataset-source-data/uploadCharacters/${data.datasetId}`, data: data.uploadCharacterReqVOs });
};

/**
 * 上传url
 * @param data
 */
export const uploadUrls = (data: any) => {
    return request.post({ url: `/llm/dataset-source-data/uploadUrls/${data.datasetId}`, data: data.urls });
};

/**
 * 删除数据集
 * @param data
 */
export const delDataset = (data: any) => {
    return request.delete({ url: `/llm/dataset-source-data/delete`, params: data });
};

/**
 * 修改数据集
 * @param data
 */
export const updDateset = (data: any) => {
    return request.put({ url: `/llm/dataset-source-data/update`, data });
};
