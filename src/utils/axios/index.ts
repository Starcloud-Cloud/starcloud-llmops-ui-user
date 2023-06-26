import { service } from './service';

import { config } from './config';

const { default_headers } = config;

const request = (option: any) => {
    const { baseUrl, url, method, params, data, headersType, responseType } = option;
    return service({
        baseURL: baseUrl,
        url: url,
        method,
        params,
        data,
        responseType: responseType,
        headers: {
            'Content-Type': headersType || default_headers
        }
    });
};
interface MyResponseData {
    code: number;
    data: any;
    msg: string;
    // 其他可能的字段...
}

const axiosServices = {
    get: async <T = any>(option: any) => {
        const res = await request({ method: 'GET', ...option });
        return res.data as unknown as T;
    },
    post: async <T = any>(option: any) => {
        const res = await request({ method: 'POST', ...option });
        return res.data as unknown as T;
    },
    postOriginal: async <T = MyResponseData>(option: any) => {
        const res = await request({ method: 'POST', ...option });
        return res as unknown as T;
    },
    delete: async <T = any>(option: any) => {
        const res = await request({ method: 'DELETE', ...option });
        return res.data as unknown as T;
    },
    put: async <T = any>(option: any) => {
        const res = await request({ method: 'PUT', ...option });
        return res.data as unknown as T;
    },
    download: async <T = any>(option: any) => {
        const res = await request({ method: 'GET', responseType: 'blob', ...option });
        return res as unknown as Promise<T>;
    },
    upload: async <T = any>(option: any) => {
        option.headersType = 'multipart/form-data';
        const res = await request({ method: 'POST', ...option });
        return res as unknown as Promise<T>;
    }
};
export default axiosServices;
