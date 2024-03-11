import request from 'utils/axios';
export const getDict = () => {
    return request.get({ url: '/system/dict-data/list-all-simple' });
};
