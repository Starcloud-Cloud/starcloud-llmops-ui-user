export const enum ENUM_TENANT {
    AI = 2,
    ANNOUNCE = 3
}

export const getTenant = () => {
    const hostname = window.location.hostname;
    if (hostname === 'cn-test.llmops-ui-user.hotsalestar.com' || hostname === 'www.mofaai.com.cn') {
        return ENUM_TENANT.AI;
    } else if (hostname === 'cn-test.juzhen.hotsalestar.com' || hostname === 'juzhen.mofaai.com.cn') {
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
    LOGINDESC = 'login_desc' //登录右边的描述
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
    [ENUM_PERMISSION.LOGINDESC]: true
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
    [ENUM_PERMISSION.LOGINDESC]: false
};

export const getPermission = (key: ENUM_PERMISSION) => {
    const hostname = window.location.hostname;
    if (hostname === 'cn-test.llmops-ui-user.hotsalestar.com' || hostname === 'www.mofaai.com.cn') {
        return list[key];
    } else if (hostname === 'cn-test.juzhen.hotsalestar.com' || hostname === 'juzhen.mofaai.com.cn') {
        return announceList[key];
    } else {
        return announceList[key];
    }
};
