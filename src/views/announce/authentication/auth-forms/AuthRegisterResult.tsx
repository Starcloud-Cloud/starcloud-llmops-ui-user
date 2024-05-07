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
const JWTRegisterResult = ({ inviteCode = '', isSuccess, errorMsg, isFetch, ...others }: JWTRegisterProps) => {
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

    function ErrorIcon(props: any) {
        return (
            <svg viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="4261" width="36" height="36">
                <path
                    d="M925.468404 822.294069 622.19831 512.00614l303.311027-310.331931c34.682917-27.842115 38.299281-75.80243 8.121981-107.216907-30.135344-31.369452-82.733283-34.259268-117.408013-6.463202L512.000512 399.25724 207.776695 87.993077c-34.675754-27.796066-87.272669-24.90625-117.408013 6.463202-30.178323 31.414477-26.560936 79.375815 8.121981 107.216907l303.311027 310.331931L98.531596 822.294069c-34.724873 27.820626-38.341237 75.846432-8.117888 107.195418 30.135344 31.43699 82.72919 34.326806 117.408013 6.485715l304.178791-311.219137 304.177767 311.219137c34.678824 27.841092 87.271646 24.951275 117.408013-6.485715C963.808618 898.140501 960.146205 850.113671 925.468404 822.294069z"
                    fill="#fff"
                    p-id="4262"
                ></path>
            </svg>
        );
    }

    function LoadingIcon(props: any) {
        return (
            <svg viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="6172" width="48" height="48">
                <path
                    d="M510.5 958.7c-60.4 0-119-11.8-174.2-35.2-53.3-22.5-101.1-54.8-142.2-95.9s-73.3-88.9-95.9-142.2C74.9 630.2 63 571.6 63 511.2s11.8-119 35.2-174.2c22.5-53.3 54.8-101.1 95.9-142.2S283 121.5 336.3 99c55.2-23.3 113.8-35.2 174.2-35.2 49.3 0 97.8 8 144.1 23.7 26.1 8.9 40.1 37.3 31.2 63.4-7.1 20.8-26.5 33.9-47.3 33.9-5.3 0-10.8-0.9-16.1-2.7-35.9-12.2-73.6-18.4-111.9-18.4-92.8 0-180 36.1-245.7 101.8C199.2 331.1 163 418.4 163 511.2c0 92.8 36.1 180 101.8 245.7 65.6 65.6 152.9 101.8 245.7 101.8s180-36.1 245.7-101.8C821.8 691.3 858 604 858 511.2c0-58.6-14.9-116.6-43-167.6-13.3-24.2-4.6-54.6 19.6-67.9 24.2-13.3 54.6-4.6 67.9 19.6 36.3 65.7 55.4 140.4 55.4 215.9 0 60.4-11.8 119-35.2 174.2-22.5 53.3-54.8 101.1-95.9 142.2-41.1 41.1-88.9 73.3-142.2 95.9-55.1 23.3-113.7 35.2-174.1 35.2z"
                    p-id="6173"
                    fill="#fff"
                ></path>
            </svg>
        );
    }

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

    if (isFetch) {
        return (
            <>
                <Grid container direction="column" justifyContent="center" spacing={2}>
                    <Grid item xs={12} container alignItems="center" justifyContent="center">
                        <Box sx={{ mb: 2 }}>
                            <Typography variant="subtitle1"> {t('auth.register.signupwithemail')}</Typography>
                        </Box>
                    </Grid>
                </Grid>

                <div className="h-[375px] flex justify-center text-center items-center text-base flex-col  gap-6">
                    <div className="bg-gray-800 p-4 rounded-full w-[80px] h-[80px] flex justify-center items-center">
                        <LoadingIcon className="h-12 w-12 text-white" />
                    </div>
                    <h1 className="text-3xl font-bold">请求中</h1>
                    <p className="text-gray-500 dark:text-gray-400">{errorMsg}</p>
                </div>
            </>
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

            {isSuccess ? (
                <div className="h-[375px] flex justify-center text-center items-center text-base flex-col  gap-6">
                    <div className="bg-green-500 p-4 rounded-full w-[80px] h-[80px]">
                        <CheckIcon className="h-12 w-12 text-white" />
                    </div>
                    <h1 className="text-3xl font-bold">注册成功</h1>
                    <p className="text-gray-500 dark:text-gray-400">3s后跳转至登录页</p>
                </div>
            ) : (
                <div className="h-[375px] flex justify-center text-center items-center text-base flex-col  gap-6">
                    <div className="bg-red-500 p-4 rounded-full w-[80px] h-[80px] flex justify-center items-center">
                        <ErrorIcon className="h-12 w-12 text-white" />
                    </div>
                    <h1 className="text-3xl font-bold">注册失败</h1>
                    <p className="text-gray-500 dark:text-gray-400">{errorMsg}</p>
                </div>
            )}
        </>
    );
};

export default JWTRegisterResult;
