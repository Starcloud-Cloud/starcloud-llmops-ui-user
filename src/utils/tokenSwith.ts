import jsCookie from 'js-cookie';

export const tokenSwitch = (token: string, expires: number) => {
    const name = process.env.REACT_APP_ENV === 'production' ? `prod-token` : 'test-token';
    jsCookie.set(name, token, {
        expires,
        domain: '.mofabiji.com'
    });
    jsCookie.set('token', token, {
        expires
    });
};
