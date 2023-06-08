import Typography from '@mui/material/Typography';
import Grid from '@mui/material/Grid';
import Breadcrumbs from '@mui/material/Breadcrumbs';
import Link from '@mui/material/Link';
import AccessAlarm from '@mui/icons-material/AccessAlarm';
import Button from '@mui/material/Button';
import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import TextField from '@mui/material/TextField';
import Chip from '@mui/material/Chip';

// import Template from 'views/template/myTemplate/components/template';
import CarryOut from 'views/template/carryOut';

import { useState } from 'react';
function TemplateMarket() {
    const [queryParams, setQueryParams] = useState({
        name: ''
    });
    return (
        <Box>
            <Typography variant="h1" mt={3} textAlign="center">
                模板市场
            </Typography>
            <Typography variant="h4" my={2} textAlign="center">
                浏览 354+ 最佳AI工作流程
            </Typography>
            <TextField fullWidth />
            <Grid container spacing={2} my={2}>
                <Grid item xs={12} md={10}>
                    <TextField value={queryParams.name} label="Name" InputLabelProps={{ shrink: true }} fullWidth />
                </Grid>
                <Grid item xs={12} md={2}>
                    <TextField value={queryParams.name} label="Name" InputLabelProps={{ shrink: true }} fullWidth />
                </Grid>
            </Grid>
            {/* <Template /> */}
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
                                <Typography variant="h2">生成亚马逊Listing</Typography>
                            </Box>
                            <Box my={1}>
                                <span>#sbc</span>
                                <Chip sx={{ marginRight: 1 }} size="small" label="Chip Outlined" variant="outlined" />
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
                <CarryOut />
            </Card>
        </Box>
    );
}
export default TemplateMarket;
