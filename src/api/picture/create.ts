import request from 'utils/axios';

/**
 * 获取图片信息
 * @returns
 */
export const getImgMeta = () => {
    return request.get({ url: '/llm/image/meta' });
};

/**
 * 文本生成图片
 * @param data
 */
export const createText2Img = (data: any) => {
    return request.post({ url: '/llm/image/generate', data });
};

/**
 * 获取图片列表
 * @returns
 */
export const getImgList = (data: any) => {
    return request.post({ url: '/llm/image/history', data });
};

/**
 * 翻译文本
 * @returns
 */
export const translateText = (data: any) => {
    return request.post({ url: '/llm/mt/translate', data });
};
