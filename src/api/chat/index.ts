import request from 'utils/axios';
import fetch from 'utils/fetch';

/**
 * 对话
 * @returns
 */
export const messageSSE = (data: any) => {
    return fetch('/llm/chat/completions', 'post', data);
};

/**
 * 查询模板
 * @param data
 */
export const getChatTemplate = (data: any) => {
    return request.get({ url: '/llm/app/recommends', params: data });
};

/**
 * 查询我的聊天机器人
 * @param data
 */
export const getChatPage = (data: any) => {
    return request.get({ url: '/llm/app/page', params: data });
};

/**
 * 获取数据集
 * @param data
 */
export const getDatasetSource = (data: any) => {
    return request.get({ url: `/llm/dataset-source-data/list/document/${data.datasetId}` });
};

/**
 * 上传字符
 * @param data
 */
export const uploadCharacters = (data: any) => {
    return request.post({ url: `/llm/dataset-source-data/uploadCharacters`, data });
};

/**
 * 上传url
 * @param data
 */
export const uploadUrls = (data: any) => {
    return request.post({ url: `/llm/dataset-source-data/uploadUrls`, data });
};

/**
 * 删除数据集
 * @param data
 */
export const delDataset = (data: any) => {
    return request.delete({ url: `/llm/dataset-source-data/delete`, params: data });
};
/**
 * 获取文档数据集详情
 * @param data
 */
export const getDetails = (data: string) => {
    return request.get({ url: `/llm/dataset-source-data/details/${data}` });
};
/**
 * 获取文档数据集详情块
 * @param data
 */
export const detailsSplit = (data: any) => {
    return request.post({ url: `/llm/dataset-source-data/details/split`, data });
};

/**
 * 修改数据集
 * @param data
 */
export const updDateset = (data: any) => {
    return request.put({ url: `/llm/dataset-source-data/update`, data });
};

/**
 * 聊天应用详情
 * @param data
 * @returns
 */
export const getChatInfo = (data: any) => {
    return request.get({ url: `/llm/app/get/${data.appId}` });
};

/**
 * 创建新应用
 * @param data
 * @returns
 */
export const createChat = (data: any) => {
    return request.post({ url: `llm/chat/app/create?uid=${data.uid}&robotName=${data.robotName}` });
};

/**
 * 保存聊天
 * @param data
 * @returns
 */
export const chatSave = (data: any) => {
    return request.put({ url: '/llm/app/modify', data });
};

/**
 * 查询会话
 */
export const getChat = (data: any) => {
    return request.get({ url: '/llm/chat/conversation', params: data });
};

/**
 * 聊天历史
 * @param data
 * @returns
 */
export const getChatHistory = (data: any) => {
    return request.get({ url: '/llm/chat/history', params: data });
};

/**
 * 获取声音列表
 * @returns
 */
export const getVoiceList = () => {
    return request.get({ url: '/llm/chat/voice/list' });
};

/**
 * 语音合成
 * @param data
 * @returns
 */
export const speaker = (data: any) => {
    return fetch('/llm/chat/voice/speak', 'post', data);
};

/**
 * 测试声音
 * @returns
 */
export const testSpeakerSSE = (data: any) => {
    return fetch('/llm/chat/voice/example', 'post', data);
};

/**
 * 获取默认头像
 * @returns
 */
export const getAvatarList = () => {
    return request.get({ url: '/llm/chat/avatar/default' });
};

/**
 * 删除
 * @returns
 */
export const deleteApp = (appUid: string) => {
    return request.delete({ url: `/llm/app/delete/${appUid}` });
};

/**
 * 聊天记录
 * @returns
 */
export const getChatRecord = (data: any) => {
    return request.post({ url: '/llm/app/log/detail/chat', data });
};

/**
 * 规则设定列表
 * @returns
 */
export const rulePage = (data: any) => {
    return request.post({ url: '/llm/dataset/rule/page', data });
};

/**
 * 转化格式列表
 * @returns
 */
export const ruleFormatType = () => {
    return request.post({ url: '/llm/dataset/rule/formatType' });
};

/**
 * 新增数据集规则
 * @returns
 */
export const ruleCreateRule = (data: any) => {
    return request.post({ url: '/llm/dataset/rule/createRule', data });
};

/**
 * 编辑数据集规则
 * @returns
 */
export const ruleUpdateRule = (data: any) => {
    return request.post({ url: '/llm/dataset/rule/update', data });
};

/**
 * 规则类型
 * @returns
 */
export const ruleRuleType = () => {
    return request.post({ url: '/llm/dataset/rule/ruleType' });
};

/**
 * 规则类型
 * @returns
 */
export const ruleDel = (data: any) => {
    return request.post({ url: '/llm/dataset/rule/delete?ruleId=' + data.ruleId });
};

/**
 * 规则调试
 * @returns
 */
export const ruleDebugRule = (data: any) => {
    return request.post({ url: '/llm/dataset/rule/debugRule', data });
};

/**
 * 获取所有技能
 * @returns
 */
export const getListAll = () => {
    return request.get({ url: '/llm/chatskill/all' });
};

/**
 * 创建
 * @returns
 */
export const skillCreate = (data: any) => {
    return request.post({ url: '/llm/chat/config/create', data });
};

/**
 * 获取所有技能
 * @param appConfigId
 * @returns
 */
export const getSkillList = (appConfigId: string) => {
    return request.get({ url: `/llm/chat/config/detail/${appConfigId}` });
};

/**
 * 修改/编辑
 * @param data
 * @returns
 */
export const modifySkill = (data: any) => {
    return request.post({ url: '/llm/chat/config/modify', data });
};

/**
 * 删除技能
 * @param uid
 * @returns
 */
export const delSkill = (uid: string) => {
    return request.delete({ url: `/llm/chat/config/delete/${uid}` });
};
