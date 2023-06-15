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
