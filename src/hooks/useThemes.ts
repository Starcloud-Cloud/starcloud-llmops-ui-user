export const themesLight = (leves: string, theme: any, index: number) => {
    let colors: string = '';
    if (leves === 'basic') {
        colors = index === 1 ? theme.palette.secondary.light : index === 2 ? theme.palette.secondary[200] : theme.palette.secondary[800];
    } else if (leves === 'pro' || leves === 'plus') {
        colors = index === 1 ? theme.palette.warning.light : index === 2 ? theme.palette.warning.main : theme.palette.warning.dark;
    } else if (leves === 'media') {
        colors = index === 1 ? theme.palette.success.light : index === 2 ? theme.palette.success[200] : theme.palette.success[800];
    } else {
        colors = index === 1 ? theme.palette.primary.light : index === 2 ? theme.palette.primary[200] : theme.palette.primary[800];
    }
    return colors;
};
export const themesDarkAfter = (leves: string, theme: any) => {
    let colors: string = '';
    if (leves === 'basic') {
        colors = `linear-gradient(210.04deg, ${theme.palette.secondary.dark} -50.94%, rgba(144, 202, 249, 0) 95.49%)`;
    } else if (leves === 'pro' || leves === 'plus') {
        colors = `linear-gradient(210.04deg, ${theme.palette.warning.dark} -50.94%, rgba(144, 202, 249, 0) 95.49%)`;
    } else if (leves === 'media') {
        colors = `linear-gradient(210.04deg, ${theme.palette.success.dark} -50.94%, rgba(144, 202, 249, 0) 95.49%)`;
    } else {
        colors = `linear-gradient(210.04deg, ${theme.palette.primary.dark} -50.94%, rgba(144, 202, 249, 0) 95.49%)`;
    }
    return colors;
};
export const themesDarkBefor = (leves: string, theme: any) => {
    let colors: string = '';
    if (leves === 'basic') {
        colors = `linear-gradient(140.9deg, ${theme.palette.secondary.dark} -14.02%, rgba(144, 202, 249, 0) 82.50%)`;
    } else if (leves === 'pro' || leves === 'plus') {
        colors = `linear-gradient(140.9deg, ${theme.palette.warning.dark} -14.02%, rgba(144, 202, 249, 0) 82.50%)`;
    } else if (leves === 'media') {
        colors = `linear-gradient(140.9deg, ${theme.palette.success.dark} -14.02%, rgba(144, 202, 249, 0) 82.50%)`;
    } else {
        colors = `linear-gradient(140.9deg, ${theme.palette.primary.dark} -14.02%, rgba(144, 202, 249, 0) 82.50%)`;
    }
    return colors;
};
