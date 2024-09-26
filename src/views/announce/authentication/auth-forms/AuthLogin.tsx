import React, { useEffect, useRef, useState } from 'react';
import { Link, useLocation } from 'react-router-dom';

// material-ui
import {
    Box,
    Button,
    Checkbox,
    FormControl,
    FormControlLabel,
    FormHelperText,
    Grid,
    IconButton,
    InputAdornment,
    InputLabel,
    OutlinedInput,
    Typography
} from '@mui/material';
import { useTheme } from '@mui/material/styles';

// third party
import pcLogin from 'assets/images/auth/pc_login.png';
import { Formik } from 'formik';
import * as Yup from 'yup';

// project imports
import useAuth from 'hooks/useAuth';
import useScriptRef from 'hooks/useScriptRef';
import AnimateButton from 'ui-component/extended/AnimateButton';

// assets
import Visibility from '@mui/icons-material/Visibility';
import VisibilityOff from '@mui/icons-material/VisibilityOff';

//Ruoyi API
import * as LoginApi from 'api/login';
import { t } from 'hooks/web/useI18n';
import * as authUtil from 'utils/auth';
// import { TrendingUp } from '@mui/icons-material';
import { Divider, Stack, useMediaQuery } from '@mui/material';
import MuiTooltip from '@mui/material/Tooltip';
import jsCookie from 'js-cookie';

// ===============================|| JWT LOGIN ||=============================== //

const JWTLogin = ({ loginProp, ...others }: { loginProp?: number }) => {
    const theme = useTheme();
    const { login } = useAuth();
    const [ticket, setTicket] = useState('');
    const scriptedRef = useScriptRef();
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const [loginData, setLoginData] = useState({
        isShowPassword: false,
        captchaEnable: process.env.REACT_APP_CAPTCHA_ENABLE,
        // tenantEnable: process.env.REACT_APP_TENANT_ENABLE,
        loginForm: {
            // tenantName: '',
            username: 'admin',
            password: 'admin123',
            captchaVerification: '',
            rememberMe: false
        }
    });
    const [showPassword, setShowPassword] = useState(false);
    const [qrUrl, setQrurl] = useState(null);
    const [inviteCode, setInviteCode] = useState('');
    const [open, setOpen] = useState(true);
    const [checked, setChecked] = React.useState(true);
    const location = useLocation();
    const query = new URLSearchParams(location.search);
    const urlInviteCode = query.get('q');
    const loginType = query.get('loginType');
    const [refreshCount, setRefreshCount] = useState(0);
    const [needRefresh, setNeedRefresh] = useState(false);

    const handleClickShowPassword = () => {
        setShowPassword(!showPassword);
    };

    const matchDownSM = useMediaQuery(theme.breakpoints.down('md'));

    const handleMouseDownPassword = (event: React.MouseEvent) => {
        event.preventDefault()!;
    };

    useEffect(() => {
        if (loginType === 'pwd') {
            setOpen(false);
        }
    }, [loginType]);

    // const getTenantId = async () => {
    //     if (loginData.tenantEnable === 'true') {
    //         const res = await LoginApi.getTenantIdByName(loginData.loginForm.tenantName);
    //         authUtil.setTenantId(res);
    //         console.log('getTenantId', authUtil.getTenantId());
    //     }
    // };

    // 获取存储在localStorage的inviteCode及其过期时间
    useEffect(() => {
        const storedInviteCode = localStorage.getItem('inviteCode');
        const inviteCodeExpiry = localStorage.getItem('inviteCodeExpiry');

        // 如果url中没有inviteCode，且localStorage中的inviteCode未过期，那么使用localStorage中的inviteCode
        if (!urlInviteCode && storedInviteCode && inviteCodeExpiry && new Date().getTime() < Number(inviteCodeExpiry)) {
            setInviteCode(storedInviteCode);
        }
        // 如果url中有inviteCode，那么使用url中的inviteCode，并更新localStorage
        else if (urlInviteCode) {
            const currentTime = new Date().getTime();
            const expiryTime = currentTime + 24 * 60 * 60 * 1000; // 24 hours from now
            localStorage.setItem('inviteCode', urlInviteCode);
            localStorage.setItem('inviteCodeExpiry', expiryTime.toString());
            setInviteCode(urlInviteCode);
        }
    }, [urlInviteCode]);

    // 增加一个登录状态的state

    const intervalIdRef = useRef<ReturnType<typeof setInterval> | null>(null); // 使用ref存储定时器id
    const isClearedRef = useRef(false); // 用来跟踪是否已经清除了定时器
    const setTimeOutRef = useRef<ReturnType<typeof setTimeout> | null>(null); // 用来跟踪是否已经清除了定时器
    const [qsState, setQs] = useState(false);

    useEffect(() => {
        setQs(true);
        if (open && qsState) {
            (async () => {
                const res = await LoginApi.getQRcode({ inviteCode });
                if (res) {
                    setNeedRefresh(false);
                    setQrurl(res?.url);
                    setTicket(res?.ticket);
                    if (intervalIdRef.current) {
                        clearInterval(intervalIdRef.current as unknown as number);
                    }
                    if (setTimeOutRef.current) {
                        clearTimeout(setTimeOutRef.current);
                    } else {
                        setTimeOutRef.current = setTimeout(() => {
                            setNeedRefresh(true);
                        }, 1000 * 60 * 3);
                    }

                    isClearedRef.current = false;
                }
            })();
        } else {
            if (intervalIdRef.current) {
                clearInterval(intervalIdRef.current as unknown as number);
            }
            isClearedRef.current = true;
        }
        return () => {
            if (setTimeOutRef.current) {
                clearTimeout(setTimeOutRef.current);
            }
        };
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [open, inviteCode, qsState, refreshCount]);

    useEffect(() => {
        const polling = async () => {
            const res = await LoginApi.qRcodeLogin({ ticket, inviteCode });
            if (!res?.data) {
                return;
            }
            const expires = (res.data.expiresTime - new Date().getTime()) / (1000 * 60 * 60 * 24);
            jsCookie.set('token', res.data.accessToken, {
                expires,
                domain: '.mofaai.com.cn'
            });
            authUtil.setToken(res?.data);
            await login();
            setIsLoggedIn(true);

            // 登录成功后立即清除定时器
            clearInterval(intervalIdRef.current as unknown as number);
            isClearedRef.current = true; // 更新已清除定时器的状态
        };

        if (ticket && !isLoggedIn && !isClearedRef.current) {
            if (intervalIdRef.current) {
                clearInterval(intervalIdRef.current as unknown as number);
            }

            const id = setInterval(polling, 2000);
            intervalIdRef.current = id; // 更新定时器id
        }

        return () => {
            if (intervalIdRef.current && !isClearedRef.current) {
                clearInterval(intervalIdRef.current as unknown as number);
            }
        };
    }, [ticket, isLoggedIn, login, inviteCode, open, refreshCount]);

    return (
        <div className="relative">
            <div className="right-[0] top-[0]  absolute cursor-pointer" onClick={() => setOpen(!open)}>
                {!open ? (
                    <MuiTooltip title="扫码登录更安全~" arrow placement="top">
                        <svg viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="4759" width="52" height="52">
                            <path
                                d="M11.2 12.8L1.6 0h384v387.2L11.2 12.8zM321.6 320V62.4H67.2L321.6 320z m-68.8-65.6L129.6 128v-3.2h129.6v129.6h-6.4z m769.6 128H640V0h384v382.4z m-320-62.4h254.4V62.4H702.4V320z m144 544h46.4v-62.4h62.4v160h62.4V1024h-22.4l-148.8-160zM576 587.2l-128-131.2V156.8h94.4V32h62.4v192h-94.4v94.4h62.4v62.4h-62.4v94.4h222.4v126.4h-62.4v-62.4H576v48z m81.6 84.8h172.8V480h62.4v-62.4h62.4V480h62.4v65.6h-129.6V672h129.6v62.4H718.4c3.2 0-60.8-62.4-60.8-62.4zM768 124.8h129.6v129.6H768V124.8z"
                                fill="#673ab7"
                                p-id="4760"
                            ></path>
                        </svg>
                    </MuiTooltip>
                ) : (
                    <MuiTooltip title="用户名密码登录" arrow placement="top">
                        <img src={pcLogin} alt="qrCode" className="w-[52px]" />
                    </MuiTooltip>
                )}
            </div>
            {!open ? (
                <div>
                    <Grid item>
                        <Stack alignItems="center" justifyContent="center" spacing={1}>
                            <Typography color={theme.palette.secondary.main} gutterBottom variant={matchDownSM ? 'h3' : 'h2'}>
                                {t('auth.login.welcome')}
                            </Typography>
                            <Typography variant="caption" fontSize="16px" textAlign={matchDownSM ? 'center' : 'inherit'}>
                                {t('auth.login.credentials')}
                            </Typography>
                        </Stack>
                    </Grid>
                    <Formik
                        initialValues={{
                            email: '',
                            password: '',
                            captchaVerification: '', // Add this line
                            submit: null
                        }}
                        validationSchema={Yup.object().shape({
                            // email: Yup.string().email('Must be a valid email').max(255).required('Email is required'),
                            password: Yup.string().max(255).required('Password is required'),
                            captchaVerification: Yup.string() // And this line (optional, if you want validation for captchaVerification)
                        })}
                        onSubmit={async (values, { setErrors, setStatus, setSubmitting }) => {
                            try {
                                // await getTenantId();
                                const updatedLoginForm = {
                                    ...loginData.loginForm,
                                    username: values.email,
                                    password: values.password,
                                    captchaVerification: values?.captchaVerification
                                };
                                const res = await LoginApi.login(updatedLoginForm);
                                if (!res) {
                                    return;
                                }
                                console.log(res);
                                const expires = (res.expiresTime - new Date().getTime()) / (1000 * 60 * 60 * 24);
                                jsCookie.set('token', res.accessToken, {
                                    expires,
                                    domain: '.mofaai.com.cn'
                                });
                                setLoginData((prevState) => ({
                                    ...prevState,
                                    loginForm: updatedLoginForm
                                }));
                                if (loginData.loginForm.rememberMe) {
                                    authUtil.setLoginForm(updatedLoginForm);
                                } else {
                                    authUtil.removeLoginForm();
                                }
                                authUtil.setToken(res);
                                await login();
                                if (scriptedRef.current) {
                                    setStatus({ success: true });
                                    setSubmitting(false);
                                }
                            } catch (err: any) {
                                console.error(err);
                                if (scriptedRef.current) {
                                    setStatus({ success: false });
                                    setErrors({ submit: err.message });
                                    setSubmitting(false);
                                }
                            }
                        }}
                    >
                        {({ errors, handleBlur, handleChange, handleSubmit, isSubmitting, touched, values }) => (
                            <form noValidate onSubmit={handleSubmit} {...others}>
                                <FormControl
                                    fullWidth
                                    error={Boolean(touched.email && errors.email)}
                                    sx={{ ...theme.typography.customInput }}
                                >
                                    <InputLabel htmlFor="outlined-adornment-email-login">{t('user.username')}</InputLabel>
                                    <OutlinedInput
                                        id="outlined-adornment-email-login"
                                        type="email"
                                        value={values.email}
                                        name="email"
                                        onBlur={handleBlur}
                                        onChange={handleChange}
                                        inputProps={{}}
                                    />
                                    {touched.email && errors.email && (
                                        <FormHelperText error id="standard-weight-helper-text-email-login">
                                            {errors.email}
                                        </FormHelperText>
                                    )}
                                </FormControl>

                                <FormControl
                                    fullWidth
                                    error={Boolean(touched.password && errors.password)}
                                    sx={{ ...theme.typography.customInput }}
                                >
                                    <InputLabel htmlFor="outlined-adornment-password-login">{t('user.password')}</InputLabel>
                                    <OutlinedInput
                                        id="outlined-adornment-password-login"
                                        type={showPassword ? 'text' : 'password'}
                                        value={values.password}
                                        name="password"
                                        onBlur={handleBlur}
                                        onChange={handleChange}
                                        endAdornment={
                                            <InputAdornment position="end">
                                                <IconButton
                                                    aria-label="toggle password visibility"
                                                    onClick={handleClickShowPassword}
                                                    onMouseDown={handleMouseDownPassword}
                                                    edge="end"
                                                    size="large"
                                                >
                                                    {showPassword ? <Visibility /> : <VisibilityOff />}
                                                </IconButton>
                                            </InputAdornment>
                                        }
                                        inputProps={{}}
                                        label="Password"
                                    />
                                    {touched.password && errors.password && (
                                        <FormHelperText error id="standard-weight-helper-text-password-login">
                                            {errors.password}
                                        </FormHelperText>
                                    )}
                                </FormControl>

                                <Grid container alignItems="center" justifyContent="space-between">
                                    <Grid item>
                                        <FormControlLabel
                                            control={
                                                <Checkbox
                                                    checked={loginData.loginForm.rememberMe}
                                                    onChange={(event) =>
                                                        setLoginData({
                                                            ...loginData,
                                                            loginForm: {
                                                                ...loginData.loginForm,
                                                                rememberMe: event.target.checked
                                                            }
                                                        })
                                                    }
                                                    name="rememberMe"
                                                    color="primary"
                                                />
                                            }
                                            label={t('sys.login.rememberMe')}
                                        />
                                    </Grid>
                                    <Grid item>
                                        <Typography
                                            variant="subtitle1"
                                            component={Link}
                                            to={loginProp ? `/pages/forgot-password/forgot-password${loginProp}` : '/forgot'}
                                            color="secondary"
                                            sx={{ textDecoration: 'none' }}
                                        >
                                            {t('auth.login.forgotpassword')}
                                        </Typography>
                                    </Grid>
                                </Grid>

                                {errors.submit && (
                                    <Box sx={{ mt: 3 }}>
                                        <FormHelperText error>{errors.submit}</FormHelperText>
                                    </Box>
                                )}
                                <Box sx={{ mt: 2 }}>
                                    <AnimateButton>
                                        <Button
                                            color="secondary"
                                            disabled={isSubmitting}
                                            fullWidth
                                            size="large"
                                            type="submit"
                                            variant="contained"
                                        >
                                            {t('auth.login.signin')}
                                        </Button>
                                    </AnimateButton>
                                </Box>
                            </form>
                        )}
                    </Formik>
                    <Grid item xs={12} className="pt-3 pb-3">
                        <Divider />
                    </Grid>
                    <Grid item xs={12}>
                        <Grid item container direction="column" alignItems="center" xs={12}>
                            <Typography
                                component={Link}
                                to={inviteCode ? `/register?q=${inviteCode}` : '/register'}
                                variant="subtitle1"
                                sx={{ textDecoration: 'none' }}
                            >
                                {t('auth.login.account')}
                            </Typography>
                        </Grid>
                    </Grid>
                </div>
            ) : (
                <div>
                    <Grid item>
                        <Stack alignItems="center" justifyContent="center" spacing={1}>
                            <Typography color={theme.palette.secondary.main} gutterBottom variant={matchDownSM ? 'h3' : 'h2'}>
                                {t('auth.login.welcome')}
                            </Typography>
                            <div className={'flex items-center'}>
                                <svg
                                    viewBox="0 0 1024 1024"
                                    version="1.1"
                                    xmlns="http://www.w3.org/2000/svg"
                                    p-id="4595"
                                    width="30"
                                    height="30"
                                >
                                    <path
                                        d="M669.03 317.396c10.18 0 20.235 0.748 30.237 1.865C672.1 192.728 536.831 98.731 382.415 98.731 209.797 98.73 68.38 216.39 68.38 365.797c0 86.242 47.044 157.061 125.674 211.988l-31.406 94.468L272.403 617.2c39.303 7.781 70.81 15.765 110.01 15.765 9.85 0 19.626-0.482 29.324-1.243-6.144-20.996-9.698-42.983-9.698-65.793 0.002-137.196 117.806-248.533 266.99-248.533z m-168.862-85.14c23.639 0 39.302 15.55 39.302 39.186 0 23.536-15.664 39.3-39.302 39.3-23.536 0-47.147-15.765-47.147-39.3 0-23.635 23.612-39.185 47.147-39.185z m-219.765 78.487c-23.538 0-47.3-15.765-47.3-39.3 0-23.635 23.764-39.185 47.3-39.185 23.534 0 39.2 15.55 39.2 39.185 0 23.535-15.666 39.3-39.2 39.3z"
                                        p-id="4596"
                                        fill="#8a8a8a"
                                    ></path>
                                    <path
                                        d="M955.618 562.147c0-125.543-125.622-227.882-266.734-227.882-149.413 0-267.09 102.339-267.09 227.882 0 125.77 117.677 227.88 267.09 227.88 31.279 0 62.838-7.898 94.243-15.766l86.12 47.17-23.612-78.473c63.04-47.286 109.983-109.993 109.983-180.81z m-353.311-39.289c-15.639 0-31.431-15.549-31.431-31.416 0-15.652 15.792-31.405 31.43-31.405 23.74 0 39.304 15.754 39.304 31.405 0 15.867-15.563 31.416-39.303 31.416z m172.72 0c-15.538 0-31.201-15.549-31.201-31.416 0-15.652 15.664-31.405 31.202-31.405 23.536 0 39.3 15.754 39.3 31.405 0.001 15.867-15.764 31.416-39.3 31.416z"
                                        p-id="4597"
                                        fill="#8a8a8a"
                                    ></path>
                                </svg>
                                <Typography variant="caption" fontSize="16px" textAlign={matchDownSM ? 'center' : 'inherit'}>
                                    {t('auth.login.wechatLoginDes')}
                                </Typography>
                            </div>
                        </Stack>
                    </Grid>
                    <div className="flex justify-center mt-5 h-[233] w-[233]">
                        {checked ? (
                            <div className="relative flex justify-center items-center">
                                <img
                                    className="border rounded border-[#e0e0e098] border-solid"
                                    height="233"
                                    width="233"
                                    src={qrUrl || 'https://via.placeholder.com/200'}
                                    alt="QR code"
                                />
                                {needRefresh && (
                                    <div className="absolute flex justify-center items-center bg-black bg-opacity-50 left-0 top-0 w-[233px] h-[233px]">
                                        <svg
                                            onClick={() => {
                                                if (setTimeOutRef.current) {
                                                    clearTimeout(setTimeOutRef.current);
                                                    setTimeOutRef.current = null;
                                                }
                                                setRefreshCount((pre) => pre + 1);
                                            }}
                                            className="absolute flex justify-center items-center cursor-pointer"
                                            viewBox="0 0 1024 1024"
                                            version="1.1"
                                            xmlns="http://www.w3.org/2000/svg"
                                            p-id="1918"
                                            width="48"
                                            height="48"
                                        >
                                            <path
                                                d="M938.336973 255.26894c-16.685369-6.020494-35.090879 2.752226-40.939358 19.437594l-24.770032 69.493701c-29.070385-65.537376-74.998152-123.162103-133.48295-166.337645-185.947253-137.611288-450.848984-100.112212-590.180413 83.942886C81.534688 350.908785 52.980346 460.653788 68.805644 570.742819c15.825298 110.605073 74.48211 208.481102 164.789518 275.394591 75.686209 55.904586 164.273476 83.082815 252.172686 83.082815 128.494541 0 255.26894-57.624727 338.007727-166.853687 36.639006-48.335965 61.581052-102.348396 74.48211-160.833193 3.78431-17.373425-7.224593-34.402822-24.426004-38.187133-17.201411-3.78431-34.402822 7.052579-38.187133 24.426004-10.836889 49.36805-31.994625 95.123803-62.957164 135.891147-118.173694 156.016798-342.996136 187.839409-500.90509 70.869814-76.546279-56.592642-126.086343-139.33143-139.503444-232.907106-13.417101-93.059634 10.664875-185.775239 67.77356-261.11742C318.05409 144.491853 542.704519 112.497228 700.785486 229.466823c57.280699 42.315471 100.112212 100.972283 123.334117 167.197715l-110.261045-43.003528c-16.513355-6.364522-35.090879 1.720141-41.627415 18.233496-6.536536 16.513355 1.720141 35.090879 18.233496 41.627415l162.38132 63.473207c3.78431 1.548127 7.740635 2.236183 11.69696 2.236183 0.516042 0 1.032085-0.172014 1.548127-0.172014 1.204099 0.172014 2.408198 0.688056 3.612296 0.688056 13.245087 0 25.630102-8.256677 30.274483-21.32975l57.796741-161.693264C963.623047 279.694944 955.022342 261.289434 938.336973 255.26894z"
                                                fill="#FFF"
                                                p-id="1919"
                                            ></path>
                                        </svg>
                                        <div className="absolute flex justify-center items-center cursor-pointer bottom-[70px] text-[#FFF]">
                                            已过期 点击刷新
                                        </div>
                                    </div>
                                )}
                            </div>
                        ) : (
                            <img
                                className="border rounded border-[#e0e0e098] border-solid"
                                height="233"
                                width="233"
                                src={'https://via.placeholder.com/200'}
                                alt="QR code"
                            />
                        )}
                    </div>
                    <Grid item xs={12} className="pt-3 pb-3">
                        <Divider />
                    </Grid>
                    <Grid container alignItems="center" justifyContent="center">
                        <Grid item>
                            <FormControlLabel
                                control={
                                    <Checkbox
                                        checked={checked}
                                        onChange={(event) => setChecked(event.target.checked)}
                                        name="checked"
                                        color="primary"
                                    />
                                }
                                label={
                                    <Typography variant="subtitle1">
                                        {t('auth.require.agree')} &nbsp;
                                        <Typography variant="subtitle1" component={Link} to="/pages/privacy-policy">
                                            {t('auth.require.terms')}
                                        </Typography>
                                    </Typography>
                                }
                            />
                        </Grid>
                    </Grid>
                    <Grid item xs={12}>
                        <Grid item container direction="column" alignItems="center" xs={12}>
                            <Typography
                                component={Link}
                                to={inviteCode ? `/register?q=${inviteCode}` : '/register'}
                                variant="subtitle1"
                                sx={{ textDecoration: 'none' }}
                            >
                                {t('auth.login.account')}
                            </Typography>
                        </Grid>
                    </Grid>
                </div>
            )}
        </div>
    );
};

export default JWTLogin;
