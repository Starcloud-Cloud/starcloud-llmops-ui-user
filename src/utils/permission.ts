export const enum ENUM_TENANT {
    AI = 2,
    ANNOUNCE = 3
}

export const getTenant = () => {
    const hostname = window.location.hostname;
    if (hostname === 'cn-test.mofaai.com.cn' || hostname === 'www.mofaai.com.cn') {
        return ENUM_TENANT.AI;
    } else if (hostname === 'cn-test-juzhen.mofaai.com.cn' || hostname === 'juzhen.mofaai.com.cn') {
        return ENUM_TENANT.ANNOUNCE;
    } else {
        return ENUM_TENANT.ANNOUNCE;
    }
};

type IList = {
    [key: string]: string | number | boolean;
};

export const enum ENUM_PERMISSION {
    APP_HOME = 'app_home',
    APP_NAME = 'app_nme', // 应用名称
    APP_DES = 'app_des', // 应用描述
    App_DOWNLOAD = 'app_downLoad', //首页免费使用或者免费下载
    LAYOUT_SHOW_QRCODE = 'layout_show_qrcode', // 是否显示二维码
    LAYOUT_SHOW_CHAT_MODAL = 'layout_show_chat_modal', // 是否显示底部聊天弹窗
    LAYOUT_SHOW_SUBSCRIBE_BUTTON = 'layout_show_subscribe_button', // 是否显示顶部订阅按钮
    EQUITY = 'equity', //权益兑换 加入社区等
    LOGINDESC = 'login_desc', //登录右边的描述
    EXCHANGE_SHOW_COUNT = 'exchange_show_count',
    EXCHANGE_SHOW_LABEL = 'exchange_show_label',
    NEW_USER_ACTIVITY = 'new_user_activity', // 新手活动
    COLLECT = 'collect', // 收藏
    PHONE_CHECK = 'phone_check', // 手机校验
    MARKET_VIDEO_MODAL = 'market_video_modal'
}

const list: IList = {
    [ENUM_PERMISSION.APP_HOME]: true,
    [ENUM_PERMISSION.APP_NAME]: '魔法AI',
    [ENUM_PERMISSION.APP_DES]: '跨境营销创意大师',
    [ENUM_PERMISSION.App_DOWNLOAD]: '免费使用',
    [ENUM_PERMISSION.LAYOUT_SHOW_QRCODE]: true,
    [ENUM_PERMISSION.LAYOUT_SHOW_CHAT_MODAL]: true,
    [ENUM_PERMISSION.LAYOUT_SHOW_SUBSCRIBE_BUTTON]: true,
    [ENUM_PERMISSION.EQUITY]: true,
    [ENUM_PERMISSION.LOGINDESC]: true,
    [ENUM_PERMISSION.EXCHANGE_SHOW_COUNT]: '10魔法豆 5点作图',
    [ENUM_PERMISSION.EXCHANGE_SHOW_LABEL]: '兑换魔法AI权益',
    [ENUM_PERMISSION.NEW_USER_ACTIVITY]: true, // 新手互动
    [ENUM_PERMISSION.COLLECT]: true,
    [ENUM_PERMISSION.PHONE_CHECK]: true,
    [ENUM_PERMISSION.MARKET_VIDEO_MODAL]: true
};

const announceList: IList = {
    [ENUM_PERMISSION.APP_HOME]: false,
    [ENUM_PERMISSION.APP_NAME]: '魔法矩阵',
    [ENUM_PERMISSION.APP_DES]: 'AI内容创作运营工具',
    [ENUM_PERMISSION.App_DOWNLOAD]: '免费下载',
    [ENUM_PERMISSION.LAYOUT_SHOW_QRCODE]: false,
    [ENUM_PERMISSION.LAYOUT_SHOW_CHAT_MODAL]: false,
    [ENUM_PERMISSION.LAYOUT_SHOW_SUBSCRIBE_BUTTON]: false,
    [ENUM_PERMISSION.EQUITY]: false,
    [ENUM_PERMISSION.LOGINDESC]: false,
    [ENUM_PERMISSION.EXCHANGE_SHOW_COUNT]: '5矩阵豆',
    [ENUM_PERMISSION.EXCHANGE_SHOW_LABEL]: '兑换魔法矩阵权益',
    [ENUM_PERMISSION.NEW_USER_ACTIVITY]: false,
    [ENUM_PERMISSION.COLLECT]: false,
    [ENUM_PERMISSION.PHONE_CHECK]: false,
    [ENUM_PERMISSION.MARKET_VIDEO_MODAL]: false
};

export const getPermission = (key: ENUM_PERMISSION) => {
    const hostname = window.location.hostname;
    if (hostname === 'cn-test.mofaai.com.cn' || hostname === 'www.mofaai.com.cn') {
        return list[key];
    } else if (hostname === 'cn-test-juzhen.mofaai.com.cn' || hostname === 'juzhen.mofaai.com.cn') {
        return announceList[key];
    } else {
        return announceList[key];
    }
};
