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
import PhoneAndroidIcon from '@mui/icons-material/PhoneAndroid';

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
import { AiOutlineWechat } from 'react-icons/ai';

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

    const handleClickShowPassword = () => {
        setShowPassword(!showPassword);
    };

    const matchDownSM = useMediaQuery(theme.breakpoints.down('md'));

    const handleMouseDownPassword = (event: React.MouseEvent) => {
        event.preventDefault()!;
    };

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
    const [qsState, setQs] = useState(false);

    useEffect(() => {
        setQs(true);
        if (open && qsState) {
            (async () => {
                const res = await LoginApi.getQRcode({ inviteCode });
                if (res) {
                    setQrurl(res?.url);
                    setTicket(res?.ticket);
                    if (intervalIdRef.current) {
                        clearInterval(intervalIdRef.current as unknown as number);
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
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [open, inviteCode, qsState]);
    useEffect(() => {
        const polling = async () => {
            const res = await LoginApi.qRcodeLogin({ ticket, inviteCode });
            if (!res?.data) {
                return;
            }
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
    }, [ticket, isLoggedIn, login, inviteCode, open]);

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
                    <Grid item display="flex" justifyContent="space-between" alignItems="center" xs={12}>
                        <Box display="flex" alignItems="center">
                            <Typography variant="subtitle1" sx={{ textDecoration: 'none' }}>
                                {t('auth.login.account')}
                            </Typography>
                            <Typography
                                component={Link}
                                color="secondary"
                                to={inviteCode ? `/register?q=${inviteCode}` : '/register'}
                                variant="subtitle1"
                                sx={{ textDecoration: 'none' }}
                            >
                                {t('auth.login.account1')}
                            </Typography>
                        </Box>
                        <Button
                            startIcon={<PhoneAndroidIcon fontSize="small" />}
                            sx={{ ml: 1 }}
                            variant="outlined"
                            size="small"
                            color="secondary"
                        >
                            使用手机号登录
                        </Button>
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
                                <AiOutlineWechat size={30} style={{ cursor: 'pointer' }} />
                                <Typography variant="caption" fontSize="16px" textAlign={matchDownSM ? 'center' : 'inherit'}>
                                    {t('auth.login.wechatLoginDes')}
                                </Typography>
                            </div>
                        </Stack>
                    </Grid>
                    <div className="flex justify-center mt-5 h-[233] w-[233]">
                        {checked ? (
                            <img
                                className="border rounded border-[#e0e0e098] border-solid"
                                height="233"
                                width="233"
                                src={qrUrl || 'https://via.placeholder.com/200'}
                                alt="QR code"
                            />
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
                        <Grid item display="flex" justifyContent="space-between" alignItems="center" xs={12}>
                            <Box display="flex">
                                <Typography variant="subtitle1" sx={{ textDecoration: 'none' }}>
                                    {t('auth.login.account')}
                                </Typography>
                                <Typography
                                    component={Link}
                                    color="secondary"
                                    to={inviteCode ? `/register?q=${inviteCode}` : '/register'}
                                    variant="subtitle1"
                                    sx={{ textDecoration: 'none' }}
                                >
                                    {t('auth.login.account1')}
                                </Typography>
                            </Box>
                            <Button
                                startIcon={<PhoneAndroidIcon fontSize="small" />}
                                sx={{ ml: 1 }}
                                variant="outlined"
                                size="small"
                                color="secondary"
                            >
                                使用手机号登录
                            </Button>
                        </Grid>
                    </Grid>
                </div>
            )}
        </div>
    );
};

export default JWTLogin;
