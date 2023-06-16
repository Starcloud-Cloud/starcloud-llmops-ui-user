import { Typography, Breadcrumbs, Link, Button, Box, Card, Chip } from '@mui/material';

import AccessAlarm from '@mui/icons-material/AccessAlarm';

import { marketDeatail } from 'api/template';
import CarryOut from 'views/template/carryOut';

import { useLocation } from 'react-router-dom';
import { useEffect, useState } from 'react';
function Deatail() {
    const location = useLocation();
    const [detailData, setDetailData] = useState({
        name: '',
        categories: [],
        scenes: [],
        config: [],
        example: ''
    });
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
    return (
        <Card sx={{ padding: 2 }}>
            <Breadcrumbs sx={{ padding: 2 }} aria-label="breadcrumb">
                <Link underline="hover" color="inherit" href="#">
                    MUI
                </Link>
                <Link underline="hover" color="inherit" href="##">
                    Core
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
                        <Box my={1}>
                            {detailData.categories && detailData.categories.map((item: any) => <span key={item}>#{item}</span>)}

                            {detailData.scenes &&
                                detailData.scenes.map((el: any) => (
                                    <Chip key={el} sx={{ marginLeft: 1 }} size="small" label={el} variant="outlined" />
                                ))}
                        </Box>
                        <Box sx={{ verticalAlign: 'middle' }}>
                            <AccessAlarm />
                            <span>826</span>
                        </Box>
                    </Box>
                </Box>
                <Button variant="contained" color="info">
                    收藏模板
                </Button>
            </Box>
            <CarryOut config={detailData.config} example={detailData.example} />
        </Card>
    );
}
export default Deatail;
