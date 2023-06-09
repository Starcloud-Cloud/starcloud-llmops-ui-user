import React, { useEffect, useRef, useState } from 'react';
import { Link, useLocation } from 'react-router-dom';

// material-ui
import { useTheme } from '@mui/material/styles';
import {
    Box,
    Button,
    Checkbox,
    Divider,
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

// third party
import * as Yup from 'yup';
import { Formik } from 'formik';
import { AiOutlineWechat } from 'react-icons/ai';

// project imports
import AnimateButton from 'ui-component/extended/AnimateButton';
import useAuth from 'hooks/useAuth';
import useScriptRef from 'hooks/useScriptRef';

// assets
import Visibility from '@mui/icons-material/Visibility';
import VisibilityOff from '@mui/icons-material/VisibilityOff';

//Ruoyi API
import * as LoginApi from 'api/login';
import * as authUtil from 'utils/auth';
import { t } from 'hooks/web/useI18n';
import LoginModal from './AuthLoginModal';
// import { TrendingUp } from '@mui/icons-material';

// ===============================|| JWT LOGIN ||=============================== //

const JWTLogin = ({ loginProp, ...others }: { loginProp?: number }) => {
    const theme = useTheme();
    const { login } = useAuth();
    const [open, setOpen] = useState(false);
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

    const location = useLocation();
    const handleClickShowPassword = () => {
        setShowPassword(!showPassword);
    };

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
    const handleWeChat = async () => {
        const res = await LoginApi.getQRcode();
        if (res) {
            setQrurl(res?.url);
            setOpen(true);
            setTicket(res?.ticket);
            if (intervalIdRef.current) {
                clearInterval(intervalIdRef.current as unknown as number);
            }
        }
    };
    const getInviteCodeFromLocalStorage = () => {
        const localInviteCode = localStorage.getItem('inviteCode');
        return localInviteCode || '';
    };
    useEffect(() => {
        // 获取URL中的邀请码
        const query = new URLSearchParams(location.search);
        let inviteCodeFromUrl = query.get('q') || '';

        if (!inviteCodeFromUrl) {
            // 如果URL中没有邀请码，尝试从localStorage获取
            inviteCodeFromUrl = getInviteCodeFromLocalStorage();
        }

        // 设置邀请码
        setInviteCode(inviteCodeFromUrl);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    // 增加一个登录状态的state

    const intervalIdRef = useRef<ReturnType<typeof setInterval> | null>(null); // 使用ref存储定时器id
    const isClearedRef = useRef(false); // 用来跟踪是否已经清除了定时器

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
    }, [ticket, isLoggedIn, login, inviteCode]);

    return (
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
                    <FormControl fullWidth error={Boolean(touched.email && errors.email)} sx={{ ...theme.typography.customInput }}>
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

                    <FormControl fullWidth error={Boolean(touched.password && errors.password)} sx={{ ...theme.typography.customInput }}>
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
                            <Button color="secondary" disabled={isSubmitting} fullWidth size="large" type="submit" variant="contained">
                                {t('auth.login.signin')}
                            </Button>
                        </AnimateButton>
                    </Box>
                    <Box sx={{ mt: 2, display: 'flex', alignItems: 'center' }}>
                        <Divider sx={{ flexGrow: 1 }} />
                        <Box px={2}>{t('auth.login.otherLogin')}</Box>
                        <Divider sx={{ flexGrow: 1 }} />
                    </Box>
                    <Box sx={{ mt: 2, display: 'flex', justifyContent: 'center' }}>
                        <AiOutlineWechat size={30} onClick={handleWeChat} style={{ cursor: 'pointer' }} />
                    </Box>

                    <LoginModal
                        open={open}
                        qrUrl={qrUrl}
                        handleClose={() => {
                            setOpen(false);
                            if (intervalIdRef.current) {
                                clearInterval(intervalIdRef.current as unknown as number);
                            }
                            isClearedRef.current = true; // 更新已清除定时器的状态
                        }}
                    />
                </form>
            )}
        </Formik>
    );
};

export default JWTLogin;
