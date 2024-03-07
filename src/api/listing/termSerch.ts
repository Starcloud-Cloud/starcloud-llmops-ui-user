import request from 'utils/axios';
//新增关键词
export const dictAdd = (uid: string, data: any) => {
    return request.put({ url: '/listing/dict/key/add/' + uid, data });
};
//新增关键词库
export const dictCreate = (data: any) => {
    return request.put({ url: '/listing/dict/create', data });
};
//获取词库列表
export const dictPage = (params: any) => {
    return request.get({ url: '/listing/dict/page', params });
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
//导出
export const exportExtendAsin = (data: any) => {
    return request.post({ url: '/listing/KeywordMetadata/exportExtendAsin', data });
};
