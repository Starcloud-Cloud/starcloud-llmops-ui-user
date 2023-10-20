import { Box, Grid, TextField, Typography, Modal, CardContent, Button, Link, CardMedia, IconButton } from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import { Popover } from 'antd';
import workWechatPay from 'assets/images/landing/work_wechat_pay.png';
import { dispatch } from 'store';
import { openSnackbar } from 'store/slices/snackbar';
import { useState, useEffect, useRef } from 'react';
import { Formik } from 'formik';
import * as Yup from 'yup';
import MainCard from 'ui-component/cards/MainCard';
import AnimateButton from 'ui-component/extended/AnimateButton';
import { validateCode, sendCode } from 'api/login';
const Phone = ({
    phoneOpne,
    title,
    submitText,
    onClose,
    emits
}: {
    phoneOpne: boolean;
    title: string;
    submitText: string;
    onClose: () => void;
    emits: () => void;
}) => {
    //手机号绑定

    useEffect(() => {
        setVCode('获取验证码');
        setVTime(59);
        timeRef.current = 60;
    }, []);
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
            const res = await sendCode({
                tool: 2,
                scene: 23,
                account: values.phone
            });
            setVCodeOpen(false);
        }
    };
    return (
        <Modal disableAutoFocus open={phoneOpne} aria-labelledby="modal-title" aria-describedby="modal-description">
            <MainCard
                sx={{
                    position: 'absolute',
                    width: '300px',
                    top: '10%',
                    left: '50%',
                    transform: 'translate(-50%, 0)'
                }}
                headerSX={{ p: '16px !important' }}
                contentSX={{ p: '16px !important' }}
                title={title}
                content={false}
            >
                {/* <IconButton
                    onClick={() => onClose()}
                    size="large"
                    aria-label="close modal"
                    sx={{
                        position: 'absolute',
                        top: 8,
                        right: 8
                    }}
                >
                    <CloseIcon fontSize="small" />
                </IconButton> */}
                <CardContent sx={{ p: '16px !important' }}>
                    <Formik
                        initialValues={{
                            phone: '',
                            vcode: ''
                        }}
                        validationSchema={Yup.object().shape({
                            phone: Yup.string()
                                .required('手机号必填')
                                .matches(/^1[3-9]\d{9}$/, '请输入有效的手机号'),
                            vcode: Yup.string().max(6, '验证码格式错误').required('请输入验证码')
                        })}
                        onSubmit={async (values, { setErrors, setStatus }) => {
                            //手机号绑定
                            const res = await validateCode({
                                scene: 23,
                                tool: 2,
                                account: values.phone,
                                code: values.vcode
                            });
                            if (res) {
                                dispatch(
                                    openSnackbar({
                                        open: true,
                                        message: '绑定成功',
                                        variant: 'alert',
                                        alert: {
                                            color: 'success'
                                        },
                                        close: false
                                    })
                                );
                            }
                            emits();
                        }}
                    >
                        {({ errors, handleBlur, handleChange, validateField, handleSubmit, touched, values }) => (
                            <form noValidate onSubmit={handleSubmit}>
                                <Grid container>
                                    <Grid item md={12}>
                                        {title === '绑定手机号' && (
                                            <Typography mb={2} variant="body2" color="text.secondary">
                                                为保障帐号安全，请完成手机号绑定
                                            </Typography>
                                        )}
                                    </Grid>
                                    <Grid item md={12}>
                                        <TextField
                                            fullWidth
                                            size="small"
                                            label="手机号"
                                            name="phone"
                                            type="text"
                                            value={values.phone}
                                            onBlur={handleBlur}
                                            onChange={handleChange}
                                            error={touched.phone && Boolean(errors.phone)}
                                            helperText={(touched.phone && errors.phone && String(errors.phone)) || ' '}
                                        />
                                    </Grid>
                                    <Grid sx={{ mt: 1 }} item md={12}>
                                        <Box display="flex">
                                            <TextField
                                                fullWidth
                                                size="small"
                                                label="验证码"
                                                name="vcode"
                                                error={touched.vcode && Boolean(errors.vcode)}
                                                helperText={(touched.vcode && errors.vcode && String(errors.vcode)) || ' '}
                                                value={values.vcode}
                                                onBlur={handleBlur}
                                                onChange={(e: any) => {
                                                    if (/^\d+$/.test(e.target.value) || e.target.value === '') {
                                                        handleChange(e);
                                                    }
                                                }}
                                            />
                                            <Box mt="5px">
                                                <Button
                                                    disabled={!vcodeOpen}
                                                    onClick={() => {
                                                        getvCode(values, validateField);
                                                    }}
                                                    size="small"
                                                    color="secondary"
                                                    variant="outlined"
                                                    sx={{ whiteSpace: 'nowrap', ml: 1, width: '90px' }}
                                                >
                                                    {vcodeOpen ? vcode : vTime + 'S'}
                                                </Button>
                                            </Box>
                                        </Box>
                                    </Grid>
                                    <Typography fontSize="12px" color="text.secondary">
                                        收不到验证码？
                                        <Popover
                                            zIndex={9999}
                                            placement="bottom"
                                            content={<CardMedia sx={{ width: '200px' }} component="img" image={workWechatPay} alt="img1" />}
                                            arrow={false}
                                        >
                                            <Link sx={{ cursor: 'pointer' }} color="secondary">
                                                联系客服
                                            </Link>
                                        </Popover>
                                    </Typography>
                                    <Grid item md={12}>
                                        <Box sx={{ mt: 2 }}>
                                            <AnimateButton>
                                                <Button
                                                    disableElevation
                                                    fullWidth
                                                    size="large"
                                                    variant="contained"
                                                    color="secondary"
                                                    type="submit"
                                                >
                                                    {submitText}
                                                </Button>
                                            </AnimateButton>
                                        </Box>
                                    </Grid>
                                </Grid>
                            </form>
                        )}
                    </Formik>
                </CardContent>
            </MainCard>
        </Modal>
    );
};
export default Phone;
