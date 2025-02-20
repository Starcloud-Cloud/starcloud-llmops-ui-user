import request from 'utils/axios';
//模板市场列表
export const listGroupTemplateByCategory = (params: any) => {
    return request.get({ url: '/llm/app/market/listGroupTemplateByCategory', params });
};
