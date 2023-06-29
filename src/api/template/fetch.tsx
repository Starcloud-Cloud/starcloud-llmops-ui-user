import fetch from 'utils/fetch';
//执行
export const executeMarket = (data: any) => {
    return fetch('/llm/app/execute/market', 'post', data);
};
//执行
export const executeApp = (data: any) => {
    return fetch('/llm/app/execute/app', 'post', data);
};
