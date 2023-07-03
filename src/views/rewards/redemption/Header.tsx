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
import { openSnackbar } from 'store/slices/snackbar';
import { t } from 'hooks/web/useI18n';

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

    const alertSuccess = () => {
        dispatch(
            openSnackbar({
                open: true,
                message: t('redemption.successful'),
                variant: 'alert',
                anchorOrigin: { vertical: 'top', horizontal: 'center' },
                alert: {
                    color: 'success'
                },
                close: false
            })
        );
    };
    const alertFailed = (msg: string) => {
        dispatch(
            openSnackbar({
                open: true,
                message: msg,
                variant: 'alert',
                anchorOrigin: { vertical: 'top', horizontal: 'center' },
                alert: {
                    color: 'error' // 设置颜色为错误
                },
                close: false
            })
        );
    };
    const handleRedeem = async () => {
        const res: { data: any; msg: string } = await redeemBenefits(code);
        if (res.data) {
            alertSuccess();
        } else {
            alertFailed(res.msg);
        }
    };

    return (
        <CustomMainCard title="注册即获取基础权益：5000字数 10张图片">
            <Card>
                <CardMedia image={Card3} title="Card 3">
                    <CardContent sx={{ height: '300px', display: 'flex', alignItems: 'center' }}>
                        <Grid container spacing={2} direction={isMobile ? 'column' : 'row'} justifyContent="center" alignItems="center">
                            <Grid item xs={isMobile ? 12 : 9}>
                                <Grid container spacing={2} direction="column" justifyContent="center" alignItems="center">
                                    <Grid item>
                                        <Typography variant="h1">{t('redemption.title')}</Typography>
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
                                                placeholder={t('redemption.code')}
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
                                                {t('redemption.redeem')}
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
                                        {t('redemption.scancode')}
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
