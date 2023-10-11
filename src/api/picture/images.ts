import request from 'utils/axios';

/**
 * 去除图片背景
 * @returns
 */
export const removeBackground = (data: any) => {
    return request.post({ url: '/llm/image/removeBackground', data, timeout: 3000000 });
};

/**
 * 去除图片背景文字
 * @returns
 */
export const removeText = (data: any) => {
    return request.post({ url: '/llm/image/removeText', data, timeout: 3000000 });
};

/**
 * 图片放大、增加清晰度
 * @returns
 */
export const upscale = (data: any) => {
    return request.post({ url: '/llm/image/upscale', data, timeout: 3000000 });
};

/**
 * 图片历史记录
 * @returns
 */
export const history = (data: any) => {
    return request.post({ url: '/llm/image/history', data });
};
