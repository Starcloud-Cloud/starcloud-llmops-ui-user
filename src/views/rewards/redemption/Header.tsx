// project imports

import { useTheme } from '@mui/material/styles';
import { Button, Card, CardContent, CardMedia, Grid, TextField, Typography } from '@mui/material';

// assets
import Card3 from 'assets/images/cards/card-3.jpg';
import useMediaQuery from '@mui/material/useMediaQuery';

import React, { useState } from 'react';
import MainCard from 'ui-component/cards/MainCard';
import { styled } from '@mui/system';
import { redeemBenefits } from 'api/rewards';
import { dispatch } from 'store';
import { closeSnackbar, openSnackbar } from 'store/slices/snackbar';

const CustomMainCard = styled(MainCard)({
    '& .MuiCardContent-root': {
        padding: 0,
        paddingBottom: '0 !important'
    },
    '& .MuiCardContent-root .MuiPaper-root ': {
        borderRadius: 0
    }
});
const RedemptionHeader = () => {
    const theme = useTheme();
    const isMobile = useMediaQuery('(max-width:680px)');
    const [code, setCode] = useState(''); // 创建一个状态变量来保存用户的输入
    const timerRef = React.useRef<NodeJS.Timeout | null>(null);

    const alertSuccess = () => {
        dispatch(
            openSnackbar({
                open: true,
                message: '兑换成功',
                variant: 'alert',
                anchorOrigin: { vertical: 'top', horizontal: 'center' },
                alert: {
                    color: 'success'
                },
                close: false
            })
        );
        timerRef.current = setTimeout(() => {
            dispatch(closeSnackbar());
        }, 2000);
    };
    const alertFailed = (msg: string) => {
        dispatch(
            openSnackbar({
                open: true,
                message: msg, // 使用响应中的消息
                variant: 'alert',
                anchorOrigin: { vertical: 'top', horizontal: 'center' },
                alert: {
                    color: 'error' // 设置颜色为错误
                },
                close: false
            })
        );
        timerRef.current = setTimeout(() => {
            dispatch(closeSnackbar());
        }, 2000);
    };
    const handleRedeem = async () => {
        try {
            // 尝试发送请求
            const res = await redeemBenefits(code);
            if (res.data) {
                alertSuccess();
            } else {
                alertFailed(res.msg);
            }
        } catch (error) {
            alertFailed('请求失败');
        }
    };
    React.useEffect(() => {
        return () => {
            if (timerRef.current) {
                clearTimeout(timerRef.current);
            }
        };
    }, []);

    return (
        <CustomMainCard title="注册即获取免费基础权益包 5000字文案权益/10张AI配图权益/5个AI视频权益">
            <Card>
                <CardMedia image={Card3} title="Card 3">
                    <CardContent sx={{ height: '300px', display: 'flex', alignItems: 'center' }}>
                        <Grid container spacing={2} direction={isMobile ? 'column' : 'row'} justifyContent="center" alignItems="center">
                            <Grid item xs={isMobile ? 12 : 9}>
                                <Grid container spacing={2} direction="column" justifyContent="center" alignItems="center">
                                    <Grid item>
                                        <Typography variant="h1">免费兑换mofaai创作权益</Typography>
                                    </Grid>
                                    <Grid
                                        item
                                        container
                                        direction="row"
                                        alignItems="stretch"
                                        justifyContent="center"
                                        spacing={2}
                                        sx={{ width: '500px' }}
                                    >
                                        <Grid item xs={8}>
                                            <TextField
                                                id="outlined-basic"
                                                fullWidth
                                                placeholder="请输入兑换码"
                                                value={code}
                                                onChange={(e) => setCode(e.target.value)}
                                                sx={{ height: '100%', boxSizing: 'border-box' }}
                                            />
                                        </Grid>
                                        <Grid item xs={4}>
                                            <Button
                                                variant="contained"
                                                size="large"
                                                fullWidth
                                                onClick={handleRedeem}
                                                sx={{
                                                    height: '100%',
                                                    boxShadow: theme.customShadows.primary,
                                                    ':hover': {
                                                        boxShadow: 'none'
                                                    },
                                                    boxSizing: 'border-box'
                                                }}
                                            >
                                                兑换权益
                                            </Button>
                                        </Grid>
                                    </Grid>
                                </Grid>
                            </Grid>
                            <Grid
                                item
                                xs={isMobile ? 12 : 3}
                                sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}
                            >
                                <div
                                    style={{
                                        display: 'flex',
                                        flexDirection: 'column',
                                        alignItems: 'center',
                                        justifyContent: 'center',
                                        padding: '10px 5px',
                                        background: 'linear-gradient(180deg, rgba(74,237,255,.44), rgba(122,120,255,.22))',
                                        gap: '5px'
                                    }}
                                >
                                    <CardMedia component="img" image={Card3} title="QR Code" sx={{ width: '100px', height: '100px' }} />
                                    <Typography variant="body1" textAlign="center">
                                        扫码入群 获取权益
                                    </Typography>
                                </div>
                            </Grid>
                        </Grid>
                    </CardContent>
                </CardMedia>
            </Card>
        </CustomMainCard>
    );
};

export default RedemptionHeader;
