export const enum ENUM_TENANT {
    AI = 'ai',
    ANNOUNCE = 'announce'
}

export const getTenant = () => {
    const hostname = window.location.hostname;
    if (hostname === 'cn-test.llmops-ui-user.hotsalestar.com' || hostname === 'www.mofaai.com.cn') {
        return ENUM_TENANT.AI;
    } else {
        return ENUM_TENANT.ANNOUNCE;
    }
};

type IList = {
    [key: string]: string | number;
};

export const enum ENUM_PERMISSION {
    APP_NAME = 'app_nme',
    APP_DES = 'app_des'
}

const list: IList = {
    [ENUM_PERMISSION.APP_NAME]: '魔法AI',
    [ENUM_PERMISSION.APP_DES]: '跨境营销创意大师'
};

const announceList: IList = {
    [ENUM_PERMISSION.APP_NAME]: '魔法通告',
    [ENUM_PERMISSION.APP_DES]: '跨境营销创意大师'
};

export const getPermission = (key: ENUM_PERMISSION) => {
    const hostname = window.location.hostname;
    if (hostname === 'cn-test.llmops-ui-user.hotsalestar.com' || hostname === 'www.mofaai.com.cn') {
        return list[key];
    } else {
        return announceList[key];
    }
};
