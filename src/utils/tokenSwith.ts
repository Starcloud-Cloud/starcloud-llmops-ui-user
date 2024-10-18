import jsCookie from 'js-cookie';

export const tokenSwitch = (token: string, expires: number) => {
    const name = process.env.REACT_APP_ENV === 'cn-test' ? 'test-token' : `prod-token`;
    jsCookie.set(name, token, {
        expires,
        domain: '.mofabiji.com'
    });
    jsCookie.set('token', token, {
        expires
    });
};
