export const themesLight = (leves: string, theme: any) => {
    let colors: string = '';
    if (leves === 'plus') {
        colors = theme.palette.secondary.light;
    } else if (leves === 'pro') {
        colors = theme.palette.warning.light;
    } else {
        colors = theme.palette.primary.light;
    }
    return colors;
};
export const themesTwo = (leves: string, theme: any) => {
    let colors: string = '';
    if (leves === 'plus') {
        colors = theme.palette.secondary[200];
    } else if (leves === 'pro') {
        colors = theme.palette.warning.main;
    } else {
        colors = theme.palette.primary[200];
    }
    return colors;
};
export const themesEight = (leves: string, theme: any) => {
    let colors: string = '';
    if (leves === 'plus') {
        colors = theme.palette.secondary[800];
    } else if (leves === 'pro') {
        colors = theme.palette.warning.dark;
    } else {
        colors = theme.palette.primary[800];
    }
    return colors;
};
