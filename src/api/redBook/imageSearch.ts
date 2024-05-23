import request from 'utils/axios';

export const imageSearch = (data?: any) => {
    return request.post({ url: `/llm/image/search`, data });
};
