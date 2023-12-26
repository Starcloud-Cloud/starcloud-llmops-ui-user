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
// export const createOrder = (data: any) => {
//     return request.post({ url: '/llm/pay/order/create', data });
// };

export const createOrder = (data: any) => {
    return request.post({ url: '/llm/trade/order/u/create', data });
};

/**
 * 创建订单
 * @returns
 */
// export const submitOrder = (data: any) => {
//     return request.post({ url: '/llm/pay/order/submit', data });
// };

export const submitOrder = (data: any) => {
    return request.post({ url: '/pay/order/submit', data });
};

/**
 * 获取支付记录
 * @param data
 * @returns
 */
// export const getOrderRecord = (data: any) => {
//     return request.post({ url: '/llm/pay/order/user/page', data });
// };

export const getOrderRecord = (data: any) => {
    return request.get({ url: '/llm/trade/order/u/page', params: data });
};

export const getOrderIsPay = (data: any) => {
    return request.get({ url: '/llm/trade/order/u/is-success', params: data });
};

// export const getVipTimeOut = () => {
//     return request.post({ url: '/llm/user-benefits/expiredReminder' });
// };

export const getVipTimeOut = () => {
    return request.put({ url: '/llm/auth/user/notify_expiring' });
};

// 获取折扣价格
// export const getPrice = (data: any) => {
//     return request.post({ url: '/llm/pay/order/product/discount', data });
// };

export const getPrice = (data: any) => {
    return request.post({ url: '/llm/trade/order/u/settlement', data });
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

// export const discountNewUser = () => {
//     return request.post({ url: '/llm/pay/order/discount/newuser' });
// };

export const discountNewUser = () => {
    return request.get({ url: '/llm/auth/user/all_detail' });
};

// export const getDiscountList = () => {
//     return request.post({ url: '/llm/pay/order/discount/list' });
// };

export const getDiscountList = (data: any) => {
    return request.get({ url: '/llm/promotion/coupon/u/match-list', params: data });
};

export const getPayType = () => {
    return request.get({ url: '/llm/product/category/u/list' });
};

export const getPayList = (categoryId: number) => {
    return request.get({ url: '/llm/product/spu/u/page', params: { pageNo: 1, pageSize: 100, categoryId } });
};

export const getLickNameProduct = (data: any) => {
    return request.get({ url: '/llm/product/spu/u/like_name', params: data });
};

export const getNewUserProduct = () => {
    return request.get({ url: '/llm/product/spu/u/special_offer' });
};
