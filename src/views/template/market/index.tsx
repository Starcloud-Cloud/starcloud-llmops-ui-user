import Typography from '@mui/material/Typography';
import Grid from '@mui/material/Grid';
import Box from '@mui/material/Box';
import TextField from '@mui/material/TextField';

import ScrollMenus from './ScrollMenu';

import { Outlet } from 'react-router-dom';

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
                    <ScrollMenus />
                </Grid>
                <Grid item xs={12} md={2}>
                    <TextField value={queryParams.name} label="Name" InputLabelProps={{ shrink: true }} fullWidth />
                </Grid>
            </Grid>
            <Outlet />
        </Box>
    );
}
export default TemplateMarket;
