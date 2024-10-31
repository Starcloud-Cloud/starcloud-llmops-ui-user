export const origin_url =
    window.location.origin.includes('localhost') ||
    window.location.origin.includes('192.168') ||
    window.location.origin.includes('127.0.0.1')
        ? process.env.REACT_APP_BASE_URL
        : window.location.origin;

const config: {
    base_url: string;
    share_base_url: string;
    result_code: number | string;
    default_headers: AxiosHeaders;
    request_timeout: number;
} = {
    /**
     * api请求基础路径
     */
    base_url: origin_url + process.env.REACT_APP_API_URL!,

    /**
     * 分享页url
     */
    share_base_url: origin_url + process.env.REACT_APP_SHARE_API_URL!,
    /**
     * 接口成功返回状态码
     */
    result_code: 200,

    /**
     * 接口请求超时时间
     */
    request_timeout: 30000 * 1000,

    /**
     * 默认接口请求类型
     * 可选值：application/x-www-form-urlencoded multipart/form-data
     */
    default_headers: 'application/json'
};

export { config };
