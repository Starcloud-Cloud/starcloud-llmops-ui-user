import Typography from '@mui/material/Typography';
import Grid from '@mui/material/Grid';
import Box from '@mui/material/Box';
import TextField from '@mui/material/TextField';
import FormControl from '@mui/material/FormControl';
import InputLabel from '@mui/material/InputLabel';
import Select from '@mui/material/Select';
import MenuItem from '@mui/material/MenuItem';

import ScrollMenus from './ScrollMenu';

import { Outlet } from 'react-router-dom';

import { useState } from 'react';

function TemplateMarket() {
    const [queryParams, setQueryParams] = useState({
        name: '',
        sort: ''
    });
    const sortList = [
        { text: '最新的', key: 'gmt_create' },
        { text: '受欢迎的', key: 'like' },
        { text: '推荐的', key: 'step' }
    ];
    const handleChange = (event: any) => {
        const { name, value } = event.target;
        setQueryParams({
            ...queryParams,
            [name]: value
        });
    };
    return (
        <Box>
            <Typography variant="h1" mt={3} textAlign="center">
                模板市场
            </Typography>
            <Typography variant="h4" my={2} textAlign="center">
                浏览 354+ 最佳AI工作流程
            </Typography>
            <TextField fullWidth name="name" value={queryParams.name} onChange={handleChange} />
            <Grid container spacing={2} my={2}>
                <Grid item xs={12} md={10}>
                    <ScrollMenus />
                </Grid>
                <Grid item xs={12} md={2}>
                    <FormControl fullWidth>
                        <InputLabel id="sort">Age</InputLabel>
                        <Select id="sort" onChange={handleChange} name="sort" value={queryParams.sort} label="Sort">
                            {sortList.map((el: any) => (
                                <MenuItem key={el.key} value={el.key}>
                                    {el.text}
                                </MenuItem>
                            ))}
                        </Select>
                    </FormControl>
                </Grid>
            </Grid>
            <Outlet />
        </Box>
    );
}
export default TemplateMarket;
