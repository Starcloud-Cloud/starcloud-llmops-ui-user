import request from 'utils/axios';
//获取表头
export const getColumn = (params: any) => {
    return request.get({ url: '/llm/material-library-table-column/list', params });
};
//创建表头
export const createColumn = (data: any) => {
    return request.post({ url: '/llm/material-library-table-column/create', data });
};
//更新表头
export const updateColumn = (data: any) => {
    return request.put({ url: '/llm/material-library-table-column/update', data });
};
//批量更新
export const updatesColumn = (data: any) => {
    return request.post({ url: '/llm/material-library-table-column/update-batch', data });
};
//删除表头
export const delColumn = (params: any) => {
    return request.delete({ url: '/llm/material-library-table-column/delete', params });
};
