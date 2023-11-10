export const splitThousandth = (value: number | undefined) => {
    if (typeof value !== 'number') {
        return '';
    }
    return value.toLocaleString();
};
