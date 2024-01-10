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
        return ENUM_TENANT.AI;
    }
};

type IList = {
    [key: string]: string | number | boolean;
};

export const enum ENUM_PERMISSION {
    APP_NAME = 'app_nme', // 应用名称
    APP_DES = 'app_des', // 应用描述
    LAYOUT_SHOW_QRCODE = 'layout_show_qrcode', // 是否显示二维码
    LAYOUT_SHOW_CHAT_MODAL = 'layout_show_chat_modal', // 是否显示底部聊天弹窗
    LAYOUT_SHOW_SUBSCRIBE_BUTTON = 'layout_show_subscribe_button' // 是否显示顶部订阅按钮
}

const list: IList = {
    [ENUM_PERMISSION.APP_NAME]: '魔法AI',
    [ENUM_PERMISSION.APP_DES]: '跨境营销创意大师',
    [ENUM_PERMISSION.LAYOUT_SHOW_QRCODE]: true,
    [ENUM_PERMISSION.LAYOUT_SHOW_CHAT_MODAL]: true,
    [ENUM_PERMISSION.LAYOUT_SHOW_SUBSCRIBE_BUTTON]: true
};

const announceList: IList = {
    [ENUM_PERMISSION.APP_NAME]: '魔法通告',
    [ENUM_PERMISSION.APP_DES]: '跨境营销创意大师',
    [ENUM_PERMISSION.LAYOUT_SHOW_QRCODE]: false,
    [ENUM_PERMISSION.LAYOUT_SHOW_CHAT_MODAL]: false,
    [ENUM_PERMISSION.LAYOUT_SHOW_SUBSCRIBE_BUTTON]: false
};

export const getPermission = (key: ENUM_PERMISSION) => {
    const hostname = window.location.hostname;
    if (hostname === 'cn-test.llmops-ui-user.hotsalestar.com' || hostname === 'www.mofaai.com.cn') {
        return list[key];
    } else if (hostname === 'cn-test.juzhen.hotsalestar.com' || hostname === 'juzhen.mofaai.com.cn') {
        return announceList[key];
    } else {
        return list[key];
    }
};
