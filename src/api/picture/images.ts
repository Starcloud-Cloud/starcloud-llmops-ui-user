import request from 'utils/axios';

/**
 * 去除图片背景
 * @returns
 */
export const removeBackground = (data: any) => {
    return request.post({ url: '/llm/image/removeBackground', data });
};

/**
 * 去除图片背景文字
 * @returns
 */
export const removeText = (data: any) => {
    return request.post({ url: '/llm/image/removeText', data });
};
