import request from 'utils/axios';

export const createRedBookImg = (data: any) => {
    return request.post({ url: '/llm/app/xhs/bathImageExecute', data });
};
