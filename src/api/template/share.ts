import request from 'utils/axios/indexShare';
import fetch from 'utils/fetch/indexShare';

//获取分享的详情
export const appDetail = (data: any) => {
    return request.get({ url: `/share/app/detail/${data}` });
};
//分享执行
export const shareMessageSSE = (data: any) => {
    return fetch('/share/chat/conversation', 'post', data);
};
