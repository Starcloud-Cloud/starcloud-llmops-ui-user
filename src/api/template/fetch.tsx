import fetch from 'utils/fetch';
//执行
export const executeMarket = (data: any) => {
    return fetch('/llm/app/execute/market', 'post', data);
};
//执行
export const executeApp = (data: any) => {
    return fetch('/llm/app/execute/app', 'post', data);
};
//AI 字段生成
export const customMaterialGenerate = (data: any) => {
    return fetch(`/llm/creative/material/customMaterialGenerate`, 'post', data);
};
