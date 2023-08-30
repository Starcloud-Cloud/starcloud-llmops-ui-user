import React, { useEffect, useState, useRef } from 'react';
import { Link } from 'react-router-dom';
import { useDispatch } from 'store';

// material-ui
import { Box, Button, Checkbox, FormControlLabel, Grid, TextField, Typography, useMediaQuery } from '@mui/material';
import { useTheme } from '@mui/material/styles';

// third party
import { Formik } from 'formik';
import * as Yup from 'yup';

// project imports
import { openSnackbar } from 'store/slices/snackbar';
import AnimateButton from 'ui-component/extended/AnimateButton';

import { sendCode, registerCode } from 'api/login';
// assets
import { t } from 'hooks/web/useI18n';

// ===========================|| FIREBASE - REGISTER ||=========================== //
interface JWTRegisterProps {
    inviteCode?: string;
    [key: string]: any;
}
const PhoneRegister = ({ inviteCode = '', ...others }: JWTRegisterProps) => {
    const theme = useTheme();
    const dispatch = useDispatch();

    const matchDownSM = useMediaQuery(theme.breakpoints.down('md'));
    const [checked, setChecked] = React.useState(true);
    //获取验证码
    const timer: any = useRef(null);
    const [vcodeOpen, setVCodeOpen] = useState(true);
    const [vcode, setVCode] = useState('获取验证码');
    const [vTime, setVTime] = useState(59);
    const timeRef: any = useRef(60);
    useEffect(() => {
        if (!vcodeOpen) {
            timer.current = setInterval(() => {
                if (timeRef.current === 0) {
                    setVCode('重新获取');
                    setVCodeOpen(true);
                    clearInterval(timer.current);
                    setVTime(60);
                    timeRef.current = 60;
                }
                setVTime(timeRef.current - 1);
                timeRef.current = timeRef.current - 1;
            }, 1000);
        }
    }, [vcodeOpen]);
    const getvCode = async (values: any, validateField: (data: any) => void) => {
        if (!/^1[3-9]\d{9}$/.test(values.phone)) {
            validateField('phone');
        } else {
            setVCodeOpen(false);
            const res = await sendCode({
                tool: 2,
                scene: 21,
                account: values.phone
            });
        }
    };
    return (
        <>
            <Grid container direction="column" justifyContent="center" spacing={2}>
                <Grid item xs={12} container alignItems="center" justifyContent="center">
                    <Box sx={{ mb: 2 }}>
                        <Typography variant="subtitle1"> 手机号注册</Typography>
                    </Box>
                </Grid>
            </Grid>

            <Formik
                initialValues={{
                    phone: '',
                    vcode: ''
                }}
                validationSchema={Yup.object().shape({
                    phone: Yup.string()
                        .required('手机号必填')
                        .matches(/^1[3-9]\d{9}$/, '请输入有效的手机号'),
                    vcode: Yup.string().max(4, '验证码格式错误').required('请输入验证码')
                })}
                onSubmit={async (values, { setErrors, setStatus }) => {
                    if (!checked) {
                        dispatch(
                            openSnackbar({
                                open: true,
                                message: t('auth.register.checkTreaty'),
                                variant: 'alert',
                                alert: {
                                    color: 'error'
                                },
                                close: false
                            })
                        );
                        return;
                    }
                    const res = await registerCode({
                        sence: 22,
                        tool: 2,
                        account: values.phone,
                        code: values.vcode
                    });
                }}
            >
                {({ errors, handleBlur, handleChange, validateField, handleSubmit, touched, values }) => (
                    <form noValidate onSubmit={handleSubmit} {...others}>
                        <Grid container spacing={matchDownSM ? 0 : 2}>
                            <Grid item xs={12}>
                                <TextField
                                    fullWidth
                                    label="手机号"
                                    margin="normal"
                                    name="phone"
                                    type="text"
                                    value={values.phone}
                                    onBlur={handleBlur}
                                    onChange={handleChange}
                                    error={touched.phone && Boolean(errors.phone)}
                                    helperText={touched.phone && errors.phone && String(errors.phone)}
                                    sx={{ ...theme.typography.customInput }}
                                />
                            </Grid>
                            <Grid item xs={12} display="flex" alignItems="center">
                                <TextField
                                    fullWidth
                                    label="验证码"
                                    margin="normal"
                                    name="vcode"
                                    error={touched.vcode && Boolean(errors.vcode)}
                                    helperText={touched.vcode && errors.vcode && String(errors.vcode)}
                                    value={values.vcode}
                                    onBlur={handleBlur}
                                    onChange={(e: any) => {
                                        if (/^\d+$/.test(e.target.value) || e.target.value === '') {
                                            handleChange(e);
                                        }
                                    }}
                                    sx={{ ...theme.typography.customInput }}
                                />
                                <Button
                                    disabled={!vcodeOpen}
                                    onClick={() => {
                                        getvCode(values, validateField);
                                    }}
                                    color="secondary"
                                    variant="outlined"
                                    sx={{ whiteSpace: 'nowrap', ml: 1, width: '90px' }}
                                >
                                    {vcodeOpen ? vcode : vTime + 'S'}
                                </Button>
                            </Grid>
                        </Grid>
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
                        <Box sx={{ mt: 2 }}>
                            <AnimateButton>
                                <Button disableElevation fullWidth size="large" variant="contained" color="secondary" type="submit">
                                    {t('auth.register.signup')}
                                </Button>
                            </AnimateButton>
                        </Box>
                    </form>
                )}
            </Formik>
        </>
    );
};

export default PhoneRegister;
