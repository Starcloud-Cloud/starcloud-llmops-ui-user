import { Typography, Breadcrumbs, Link, Box, Card, Chip, Divider } from '@mui/material';
import LoadingButton from '@mui/lab/LoadingButton';

import AccessAlarm from '@mui/icons-material/AccessAlarm';
import RemoveRedEyeIcon from '@mui/icons-material/RemoveRedEye';
import VerticalAlignBottomIcon from '@mui/icons-material/VerticalAlignBottom';
import ThumbUpIcon from '@mui/icons-material/ThumbUp';
// import StarIcon from '@mui/icons-material/Star';
// import StarBorderIcon from '@mui/icons-material/StarBorder';
import { marketDeatail, installTemplate } from 'api/template';
import CarryOut from 'views/template/carryOut';

import { t } from 'hooks/web/useI18n';
import { useLocation, useNavigate } from 'react-router-dom';
import { useEffect, useState } from 'react';
function Deatail() {
    const location = useLocation();
    const navigate = useNavigate();
    const [detailData, setDetailData] = useState({
        name: '',
        categories: [],
        scenes: [],
        example: '',
        viewCount: '',
        likeCount: '',
        installCount: '',
        uid: '',
        version: '',
        installStatus: { installStatus: '' }
    });
    const [loading, setLoading] = useState(false);
    useEffect(() => {
        const searchParams = new URLSearchParams(location.search);
        const queryParams: any = {
            version: searchParams.get('version'),
            uid: searchParams.get('uid')
        };
        marketDeatail(queryParams).then((res: any) => {
            setDetailData(res);
        });
    }, [location.search]);
    const iconStyle = {
        fontSize: '16px',
        display: 'inline-block',
        margin: '0 8px 0 4px'
    };
    const install = ({ uid, version }: { uid: string; version: number | string }) => {
        setLoading(true);
        installTemplate({ uid, version }).then((res) => {
            if (res.data) {
                setLoading(false);
                setDetailData({
                    ...detailData,
                    installStatus: { installStatus: 'INSTALLED' }
                });
            }
        });
    };
    return (
        <Card sx={{ padding: 2 }}>
            <Breadcrumbs sx={{ padding: 2 }} aria-label="breadcrumb">
                <Link
                    sx={{ cursor: 'pointer' }}
                    underline="hover"
                    color="inherit"
                    onClick={() => navigate('/template/templateMarket/list')}
                >
                    {t('market.all')}
                </Link>
                <Typography color="text.primary">Breadcrumbs</Typography>
            </Breadcrumbs>
            <Box display="flex" justifyContent="space-between" alignItems="center" my={2}>
                <Box display="flex" justifyContent="space-between" alignItems="center">
                    <AccessAlarm sx={{ fontSize: '80px' }} />
                    <Box>
                        <Box>
                            <Typography variant="h2">{detailData.name}</Typography>
                        </Box>
                        <Box my={0.5}>
                            {detailData.categories && detailData.categories.map((item: any) => <span key={item}>#{item}</span>)}
                            {detailData.scenes &&
                                detailData.scenes.map((el: any) => (
                                    <Chip key={el} sx={{ marginLeft: 1 }} size="small" label={el} variant="outlined" />
                                ))}
                        </Box>
                        <Box sx={{ display: 'flex', alignItems: 'center' }}>
                            <RemoveRedEyeIcon fontSize="small" />
                            <span style={iconStyle}>{detailData.viewCount}</span>
                            <VerticalAlignBottomIcon fontSize="small" />
                            <span style={iconStyle}>{detailData.installCount}</span>
                            <ThumbUpIcon fontSize="small" />
                            <span style={iconStyle}>{detailData.likeCount}</span>
                        </Box>
                    </Box>
                </Box>
                <LoadingButton
                    color="info"
                    disabled={detailData.installStatus.installStatus === 'INSTALLED'}
                    onClick={() => install(detailData)}
                    loading={loading}
                    loadingIndicator="downLoad..."
                    variant="outlined"
                >
                    {detailData.installStatus.installStatus === 'UNINSTALLED' ? t('market.down') : t('market.ins')}
                </LoadingButton>
            </Box>
            <Divider sx={{ my: 1 }} />
            <CarryOut config={detailData} example={detailData.example} />
        </Card>
    );
}
export default Deatail;
