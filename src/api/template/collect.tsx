import request from 'utils/axios';
//模板市场收藏列表
export const favoriteList = (data: any) => {
    return request.post({ url: '/llm/app/favorite/list', data });
};
//模板市场收藏
export const favoriteCollect = (data: any) => {
    return request.post({ url: '/llm/app/favorite/collect', data });
};
//模板市场取消收藏
export const favoriteCancel = (data: any) => {
    return request.post({ url: '/llm/app/favorite/cancel', data });
};
