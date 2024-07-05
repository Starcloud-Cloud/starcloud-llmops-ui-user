import request from 'utils/axios';
export const getDict = () => {
    return request.get({ url: '/system/dict-data/list-all-simple' });
};
export const material_library_plugins = () => {
    return request.get({ url: '/system/dict-data/material_library_plugins' });
};
