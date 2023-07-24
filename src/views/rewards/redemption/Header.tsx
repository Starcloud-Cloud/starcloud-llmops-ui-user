// project imports

import { Button, Card, CardContent, CardMedia, Grid, TextField, Typography } from '@mui/material';
import { useTheme } from '@mui/material/styles';

// assets
import Card3 from 'assets/images/cards/card-3.jpg';
import wechat1 from 'assets/images/landing/wechat.png';

import { styled } from '@mui/system';
import { redeemBenefits } from 'api/rewards';
import { t } from 'hooks/web/useI18n';
import { useState } from 'react';
import { dispatch } from 'store';
import { openSnackbar } from 'store/slices/snackbar';
import MainCard from 'ui-component/cards/MainCard';

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
        <CustomMainCard
            sx={{
                '.MuiCardHeader-root': {
                    padding: '12px !important'
                },
                '.MuiCardHeader-title': {
                    fontSize: { xs: '0.875rem !important', md: '1rem !important', xl: '1rem !important' }
                }
            }}
            title="注册即获取基础权益：5000字数 10张图片"
        >
            <Card>
                <CardMedia image={Card3} title="Card 3">
                    <CardContent sx={{ height: '260px', display: 'flex', alignItems: 'center' }}>
                        <Grid
                            container
                            spacing={2}
                            direction={{ xs: 'column' }}
                            justifyContent="center"
                            alignItems="center"
                            textAlign="center"
                            sx={{
                                '> .MuiGrid-root': {
                                    width: '100%',
                                    marginTop: '10px'
                                }
                            }}
                        >
                            <Grid item>
                                <Typography
                                    variant="h1"
                                    sx={{
                                        fontSize: { xs: '1.2rem', md: '2.125rem', xl: '2.125rem', marginTop: '30px' }
                                    }}
                                >
                                    {t('redemption.title')}
                                </Typography>
                            </Grid>
                            <Grid
                                item
                                xs={12}
                                container
                                spacing={2}
                                direction={{ xs: 'column', sm: 'row' }}
                                justifyContent="center" // Change this line
                                alignItems="center"
                                sx={{
                                    width: '90% !important',
                                    marginTop: '0 !important',
                                    position: 'relative',
                                    top: { sm: '-40px', xs: '-17px' }
                                }} // Add this line
                            >
                                <Grid
                                    item
                                    xs={12}
                                    sm={9}
                                    container
                                    direction="row"
                                    alignItems="center"
                                    justifyContent="center"
                                    spacing={2}
                                    sx={{ paddingLeft: { xs: '0', sm: '100px !important' } }}
                                >
                                    <Grid item xs={7} sm={7} md={6} lg={5}>
                                        <TextField
                                            id="outlined-basic"
                                            fullWidth
                                            placeholder={t('redemption.code')}
                                            value={code}
                                            onChange={(e) => setCode(e.target.value)}
                                            sx={{ height: '100%', boxSizing: 'border-box' }}
                                        />
                                    </Grid>
                                    <Grid item xs={5} sm={4} md={3} lg={2}>
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
                                                boxSizing: 'border-box',
                                                fontSize: { xs: '0.65rem !important', md: '0.7rem !important', xl: '1rem !important' }
                                            }}
                                        >
                                            {t('redemption.redeem')}
                                        </Button>
                                    </Grid>
                                </Grid>
                                <Grid
                                    item
                                    xs={12}
                                    sm={3}
                                    container
                                    direction="row"
                                    alignItems="center"
                                    justifyContent="center"
                                    sx={{
                                        paddingTop: '6 !important'
                                    }}
                                >
                                    <div
                                        style={{
                                            display: 'flex',
                                            flexDirection: 'column',
                                            alignItems: 'center',
                                            justifyContent: 'center',
                                            padding: '10px 5px',
                                            background: 'linear-gradient(180deg, rgba(74,237,255,.44), rgba(122,120,255,.22))',
                                            gap: '5px',
                                            marginBottom: '20px'
                                        }}
                                    >
                                        <CardMedia
                                            component="img"
                                            image={wechat1}
                                            title="QR Code"
                                            sx={{ width: '100px', height: '100px' }}
                                        />
                                        <Typography variant="body1" textAlign="center" color="white">
                                            {t('redemption.scancode')}
                                        </Typography>
                                    </div>
                                </Grid>
                            </Grid>
                        </Grid>
                    </CardContent>
                </CardMedia>
            </Card>
        </CustomMainCard>
    );
};

export default RedemptionHeader;
