import request from 'utils/axios';

/**
 * 获取商品列表
 * @returns
 */
export const getVipList = () => {
    return request.post({ url: '/llm/pay/order/product/list' });
};

/**
 * 创建订单
 * @returns
 */
export const createOrder = (data: any) => {
    return request.post({ url: '/llm/pay/order/create', data });
};

/**
 * 创建订单
 * @returns
 */
export const submitOrder = (data: any) => {
    return request.post({ url: '/llm/pay/order/submit', data });
};

/**
 * 获取支付记录
 * @param data
 * @returns
 */
export const getOrderRecord = (data: any) => {
    return request.post({ url: '/llm/pay/order/user/page', data });
};

export const getOrderIsPay = (data: any) => {
    return request.post({ url: '/llm/pay/order/is-success', data });
};

// export const getVipTimeOut = () => {
//     return request.post({ url: '/llm/user-benefits/expiredReminder' });
// };

export const getVipTimeOut = () => {
    return request.put({ url: '/llm/auth/user/notify_expiring' });
};

// 获取折扣价格
export const getPrice = (data: any) => {
    return request.post({ url: '/llm/pay/order/product/discount', data });
};

export const createSign = (data: any) => {
    return request.post({ url: '/llm/pay/sign/createSign', data });
};

export const submitSign = (data: any) => {
    return request.post({ url: '/llm/pay/sign/submitSign', data });
};

export const getIsSign = (data: any) => {
    return request.post({ url: '/llm/pay/sign/IsSuccess', data });
};

export const discountNewUser = () => {
    return request.post({ url: '/llm/pay/order/discount/newuser' });
};

export const getDiscountList = () => {
    return request.post({ url: '/llm/pay/order/discount/list' });
};
