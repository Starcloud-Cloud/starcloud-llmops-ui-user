import request from 'utils/axios';

//获取素材库表头
export const getMaterialTitle = (params: any) => {
    return request.get({ url: '/llm/material-library/get-uid', params });
};
//获取素材库表格内容
export const getMaterialPage = (params: any) => {
    return request.get({ url: '/llm/material-library-slice/page-uid', params });
};
