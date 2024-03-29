export const validateEmail = (value: string) => {
    const regex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    return regex.test(value);
};

// 验证电话号码，这是一个非常基本的验证，可能无法处理所有情况
export const validatePhone = (value: string) => {
    const regex = /^\d{3}-\d{3}-\d{4}$/;
    return regex.test(value);
};

// 验证 URL
export const validateURL = (value: string) => {
    try {
        new URL(value);
        return true;
    } catch (_) {
        return false;
    }
};

// 验证颜色格式 #RRGGBB
export const validateColor = (value: string) => {
    const regex = /^#[0-9A-Fa-f]{6}$/;
    return regex.test(value);
};

export function removeFalseProperties(obj: any) {
    for (const key in obj) {
        if (obj[key] === '' || obj[key] === null || obj[key] === undefined || obj[key] === 'null' || obj[key] === 'undefined') {
            delete obj[key];
        }
    }
    return obj;
}

/**
 * 判断是否包含中文字和中文符号
 * @param text
 * @returns
 */
export function containsChineseCharactersAndSymbols(text: string): boolean {
    const chineseCharactersAndSymbolsRegex = /[\u4e00-\u9fa5\u3000-\u303F\uFF00-\uFFEF]/;
    return chineseCharactersAndSymbolsRegex.test(text);
}
