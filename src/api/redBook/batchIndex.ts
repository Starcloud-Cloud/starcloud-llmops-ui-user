import request from 'utils/axios';
import fetch from 'utils/fetch';
//执行
export const executeTest = (data: any) => {
    return fetch('/llm/app/execute/test', 'post', data);
};
//执行后绘画 id
export const detailPrompt = (data: any) => {
    return request.post({ url: '/llm/app/log/detail/prompt', data });
};

//图片风格列表
export const imageStyles = () => {
    return request.get({ url: '/llm/creative/plan/imageStyles' });
};
//全部取消
export const planCancel = (data: any) => {
    return request.post({ url: '/llm/creative/plan/cancel', data });
};
//获取分享列表
export const shareList = (data: any) => {
    return request.get({ url: '/llm/xhs/content/share-list?batchUid=' + data });
};
//生成二维码
export const qrCode = (data: any) => {
    return request.post({ url: '/llm/xhs/content/qrCode', data });
};

//文案模板应用列表
export const copyWritingTemplates = () => {
    return request.get({ url: '/llm/creative/plan/copyWritingTemplates/XHS' });
};
//获取默认模板列表
export const listTemplates = () => {
    return request.get({ url: '/llm/creative/plan/listTemplates' });
};
//获取创作方案列表
export const schemeList = () => {
    return request.get({ url: '/llm/creative/scheme/listOption' });
};
//创建
export const planCreate = (data: any) => {
    return request.post({ url: '/llm/creative/plan/create', data });
};
//列表
export const planPage = (params: any) => {
    return request.get({ url: '/llm/creative/plan/page', params });
};
//列表1
export const planPages = () => {
    return request.get({ url: '/llm/creative/plan/list' });
};
//删除
export const planDelete = (data: any) => {
    return request.delete({ url: '/llm/creative/plan/delete/' + data });
};
//复制
export const planCopy = (data: any) => {
    return request.post({ url: '/llm/creative/plan/copy', data });
};
//详情
export const planGet = (data: any) => {
    return request.get({ url: '/llm/creative/plan/get/' + data });
};
//获取详情 不需要 token
export const contentShare = (data: any) => {
    return request.get({ url: '/llm/xhs/content/share?uid=' + data });
};
//获取签名
export const shareBuildSignature = () => {
    return request.get({ url: '/llm/xhs/content/shareBuildSignature' });
};
//编辑
export const planModify = (data: any) => {
    return request.post({ url: '/llm/creative/plan/modify', data });
};
//编辑ziduan
export const planModifyConfig = (data: any) => {
    return request.post({ url: '/llm/creative/plan/modifyConfig', data });
};
//执行
export const planExecute = (data: any) => {
    return request.post({ url: '/llm/creative/plan/execute', data });
};
//点赞
export const contentLike = (data: any) => {
    return request.post({ url: '/llm/xhs/content/like', data });
};
//取消点赞
export const contentUnlike = (data: any) => {
    return request.post({ url: '/llm/xhs/content/unlike', data });
};
//失败重试
export const failureRetry = (data: any) => {
    return request.post({ url: `/llm/xhs/content/retry`, data });
};
//失败重试
export const batchPages = (data: any) => {
    return request.get({ url: `/llm/creative/batch/page`, params: data });
};
//获取素材元数据
export const metadata = () => {
    return request.get({ url: `/llm/creative/material/metadata` });
};
//获取表头数据
export const materialTemplate = (type: any) => {
    return request.get({ url: `/llm/material/template/${type}` });
};
//导入素材
export const materialImport = (data: any) => {
    return request.upload({ url: `/llm/material/import`, data });
};
//下载素材
export const materialExport = (params: any) => {
    return request.download({ url: `/llm/material/download/template`, params });
};
//查询导入结果
export const materialResilt = (parseUid: any) => {
    return request.get({ url: `/llm/material/result/${parseUid}` });
};

//进入创作计划获取应用数据
export const getPlan = (params: any) => {
    return request.get({ url: `/llm/creative/plan/getByAppUid`, params });
};
//获取应用计划示例
export const getListExample = (uid: any) => {
    return request.get({ url: `/llm/xhs/content/listExample?uidList=${uid}` });
};
//更新版本
export const planUpgrade = (data: any) => {
    return request.post({ url: `/llm/creative/plan/upgrade`, data });
};
//小红书查询
export const materialParse = (data: any) => {
    return request.post({ url: `/llm/material/parse`, data });
};

//ai 素材
export const materialGenerate = (data: any) => {
    return request.post({ url: `/llm/creative/material/materialGenerate`, data, timeout: 60000 });
};
//ai 批量生成
export const customMaterialGenerate = (data: any) => {
    return request.post({ url: `/llm/creative/material/customMaterialGenerate`, data, timeout: 60000 });
};
//获取表格 Code
export const materialFieldCode = (data: any) => {
    return request.post({ url: `/llm/creative/material/fieldCode`, data });
};
//获取全量表格 Code
export const appFieldCode = (data: any) => {
    return request.post({ url: `/llm/app/fieldCode`, data });
};
//判断是表格还是图片
export const materialJudge = (params: any) => {
    return request.post({ url: `/llm/creative/material/judge`, params });
};
//判断是表格还是图片
export const createSameApp = (data: any) => {
    return request.post({ url: `/llm/creative/plan/createSameApp`, data });
};
//历史详情
export const createMaterialInfoPageByMarketUid = (data: any) => {
    return request.post({ url: `/llm/creative/material/infoPageByMarketUid`, data });
};

//小红书分析
export const pluginsXhsOcr = (data: any) => {
    return request.post({ url: `/llm/creative/plugins/xhsOcr`, data });
};
//文本智能提取
export const extraction = (data: any) => {
    return request.post({ url: `/llm/creative/plugins/extraction`, data });
};

//ocr
export const imageOcr = (data: any) => {
    return request.post({ url: `/llm/creative/plugins/imageOcr`, data });
};
//微信公共号
export const plugChat = (data: any) => {
    return request.post({ url: `/llm/coze/temp/chat`, data });
};
//ocr
export const plugList = (params: any) => {
    return request.get({ url: `llm/coze/temp/chat/result`, params });
};
//查询智能生成
export const bindPlugin = (data: any) => {
    return request.post({ url: `/llm/plugin/definition/bindPlugin`, data });
};
