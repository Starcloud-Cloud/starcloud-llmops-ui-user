import request from 'utils/axios';
//新增关键词
export const KeywordMetadataAdd = (data: any) => {
    return request.put({ url: '/listing/KeywordMetadata/add', data });
};
//获取关键词列表
export const KeywordMetadataBasic = () => {
    return request.get({ url: '/listing/KeywordMetadata/basic' });
};
//分页查询关键词列表
export const KeywordMetadataPage = (params: any) => {
    return request.get({ url: '/listing/KeywordMetadata/page', params });
};
//根据ASIN获取变体
export const KeywordMetadataExtendPrepare = (params: any) => {
    return request.get({ url: '/listing/KeywordMetadata/extendPrepare', params });
};
//根据ASIN获取拓展词变体
export const KeywordMetadataExtendAsin = (params: any) => {
    return request.get({ url: '/listing/KeywordMetadata/extendAsin', params });
};
//根据ASIN获取Listing数据
export const KeywordMetadataListing = (params: any) => {
    return request.get({ url: '/listing/KeywordMetadata/Listing', params });
};
