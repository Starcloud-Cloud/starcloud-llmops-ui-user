export const vipSwitch = (levelId: number) => {
    switch (levelId) {
        case 1:
            return 'free';
        case 2:
            return 'basic';
        case 3:
            return 'basic';
        case 4:
            return 'plus';
        case 5:
            return 'pro';
        case 6:
            return 'media';
        default:
            return 'free';
    }
};
