import React, { useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useDispatch } from 'store';
import CheckCircleOutlineIcon from '@mui/icons-material/CheckCircleOutline';

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
    TextField,
    Typography,
    useMediaQuery
} from '@mui/material';
import { useTheme } from '@mui/material/styles';

// third party
import { Formik } from 'formik';
import * as Yup from 'yup';

// project imports
import useAuth from 'hooks/useAuth';
import useScriptRef from 'hooks/useScriptRef';
import { openSnackbar } from 'store/slices/snackbar';
import AnimateButton from 'ui-component/extended/AnimateButton';
import { strengthColor, strengthIndicator } from 'utils/password-strength';

// assets
import Visibility from '@mui/icons-material/Visibility';
import VisibilityOff from '@mui/icons-material/VisibilityOff';
import { t } from 'hooks/web/useI18n';
import { StringColorProps } from 'types';

// ===========================|| FIREBASE - REGISTER ||=========================== //
interface JWTRegisterProps {
    inviteCode?: string;
    [key: string]: any;
}
const JWTRegister = ({ inviteCode = '', ...others }: JWTRegisterProps) => {
    const theme = useTheme();
    const navigate = useNavigate();
    const scriptedRef = useScriptRef();
    const dispatch = useDispatch();

    const matchDownSM = useMediaQuery(theme.breakpoints.down('md'));
    const [showPassword, setShowPassword] = React.useState(false);
    const [checked, setChecked] = React.useState(true);

    const [strength, setStrength] = React.useState(0);
    const [level, setLevel] = React.useState<StringColorProps>();
    const [showMessage, setShowMessage] = React.useState(true);

    const { register } = useAuth();

    const handleClickShowPassword = () => {
        setShowPassword(!showPassword);
    };

    const handleMouseDownPassword = (event: React.SyntheticEvent) => {
        event.preventDefault();
    };

    const changePassword = (value: string) => {
        const temp = strengthIndicator(value);
        setStrength(temp);
        setLevel(strengthColor(temp));
    };

    useEffect(() => {
        changePassword('');
    }, []);

    function CheckIcon(props: any) {
        return (
            <svg
                {...props}
                xmlns="http://www.w3.org/2000/svg"
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
            >
                <polyline points="20 6 9 17 4 12" />
            </svg>
        );
    }

    return (
        <>
            <Grid container direction="column" justifyContent="center" spacing={2}>
                <Grid item xs={12} container alignItems="center" justifyContent="center">
                    <Box sx={{ mb: 2 }}>
                        <Typography variant="subtitle1"> {t('auth.register.signupwithemail')}</Typography>
                    </Box>
                </Grid>
            </Grid>

            {showMessage ? (
                <Formik
                    initialValues={{
                        email: '',
                        password: '',
                        userName: '',
                        submit: null
                    }}
                    validationSchema={Yup.object().shape({
                        email: Yup.string().email('Must be a valid email').max(255).required(t('auth.register.emailrequired')),
                        password: Yup.string().max(255).required(t('auth.register.passwordrequired'))
                    })}
                    onSubmit={async (values, { setErrors, setStatus, setSubmitting }) => {
                        if (!checked) {
                            dispatch(
                                openSnackbar({
                                    open: true,
                                    message: t('auth.register.checkTreaty'),
                                    variant: 'alert',
                                    alert: {
                                        color: 'error'
                                    },
                                    anchorOrigin: { vertical: 'top', horizontal: 'center' },
                                    close: false
                                })
                            );
                            return;
                        }

                        try {
                            const res = await register(values.email, values.password, values.userName, inviteCode);
                            if (res?.data) {
                                if (scriptedRef.current) {
                                    setStatus({ success: true });
                                    setSubmitting(false);
                                    setShowMessage(false);
                                    // dispatch(
                                    //     openSnackbar({
                                    //         open: true,
                                    //         message: t('auth.register.successful'),
                                    //         variant: 'alert',
                                    //         alert: {
                                    //             color: 'success'
                                    //         },
                                    //         close: false
                                    //     })
                                    // );

                                    // setTimeout(() => {
                                    //     navigate('/login', { replace: true });
                                    // }, 1500);
                                }
                            } else {
                                dispatch(
                                    openSnackbar({
                                        open: true,
                                        message: `${res?.msg}`,
                                        variant: 'alert',
                                        alert: {
                                            color: 'error'
                                        },
                                        anchorOrigin: { vertical: 'top', horizontal: 'center' },
                                        close: false
                                    })
                                );
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
                            <Grid container spacing={matchDownSM ? 0 : 2}>
                                <Grid item xs={12}>
                                    <TextField
                                        fullWidth
                                        label={t('user.username')}
                                        margin="normal"
                                        name="userName"
                                        type="text"
                                        value={values.userName}
                                        onBlur={handleBlur}
                                        onChange={handleChange}
                                        sx={{ ...theme.typography.customInput }}
                                    />
                                </Grid>
                            </Grid>
                            <FormControl fullWidth error={Boolean(touched.email && errors.email)} sx={{ ...theme.typography.customInput }}>
                                <InputLabel htmlFor="outlined-adornment-email-register">{t('user.emailaddress')}</InputLabel>
                                <OutlinedInput
                                    id="outlined-adornment-email-register"
                                    type="email"
                                    value={values.email}
                                    name="email"
                                    onBlur={handleBlur}
                                    onChange={handleChange}
                                    inputProps={{}}
                                />
                                {touched.email && errors.email && (
                                    <FormHelperText error id="standard-weight-helper-text--register">
                                        {errors.email}
                                    </FormHelperText>
                                )}
                            </FormControl>

                            <FormControl
                                fullWidth
                                error={Boolean(touched.password && errors.password)}
                                sx={{ ...theme.typography.customInput }}
                            >
                                <InputLabel htmlFor="outlined-adornment-password-register"> {t('user.password')}</InputLabel>
                                <OutlinedInput
                                    id="outlined-adornment-password-register"
                                    type={showPassword ? 'text' : 'password'}
                                    value={values.password}
                                    name="password"
                                    label={t('user.password')}
                                    onBlur={handleBlur}
                                    onChange={(e) => {
                                        handleChange(e);
                                        changePassword(e.target.value);
                                    }}
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
                                />
                                {touched.password && errors.password && (
                                    <FormHelperText error id="standard-weight-helper-text-password-register">
                                        {errors.password}
                                    </FormHelperText>
                                )}
                            </FormControl>

                            {strength !== 0 && (
                                <FormControl fullWidth>
                                    <Box sx={{ mb: 2 }}>
                                        <Grid container spacing={2} alignItems="center">
                                            <Grid item>
                                                <Box
                                                    style={{ backgroundColor: level?.color }}
                                                    sx={{ width: 85, height: 8, borderRadius: '7px' }}
                                                />
                                            </Grid>
                                            <Grid item>
                                                <Typography variant="subtitle1" fontSize="0.75rem">
                                                    {level?.label}
                                                </Typography>
                                            </Grid>
                                        </Grid>
                                    </Box>
                                </FormControl>
                            )}

                            <Grid container alignItems="center" justifyContent="space-between">
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
                            {errors.submit && (
                                <Box sx={{ mt: 3 }}>
                                    <FormHelperText error>{errors.submit}</FormHelperText>
                                </Box>
                            )}

                            <Box sx={{ mt: 2 }}>
                                <AnimateButton>
                                    <Button
                                        disableElevation
                                        disabled={isSubmitting}
                                        fullWidth
                                        size="large"
                                        type="submit"
                                        variant="contained"
                                        color="secondary"
                                    >
                                        {t('auth.register.signup')}
                                    </Button>
                                </AnimateButton>
                            </Box>
                        </form>
                    )}
                </Formik>
            ) : (
                // <div className="h-[375px] flex justify-center text-center items-center text-base text-red-500 flex-col">
                //     <CheckCircleOutlineIcon className="text-4xl mb-4" />
                //     {t('auth.register.successful')}
                // </div>
                // <div className="flex flex-col items-center justify-center gap-6">
                <div className="h-[375px] flex justify-center text-center items-center text-base flex-col  gap-6">
                    <div className="bg-green-500 p-4 rounded-full w-[80px] h-[80px]">
                        <CheckIcon className="h-12 w-12 text-white" />
                    </div>
                    {/* <h1 className="text-3xl font-bold">注册成功</h1> */}
                    <p className="text-gray-500 dark:text-gray-400 text-lg"> {t('auth.register.successful')}</p>
                </div>
            )}
        </>
    );
};

export default JWTRegister;
