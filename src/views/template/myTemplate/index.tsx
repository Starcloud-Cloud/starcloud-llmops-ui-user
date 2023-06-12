import Box from '@mui/material/Box';
import Grid from '@mui/material/Grid';
import Link from '@mui/material/Link';
import ChevronRight from '@mui/icons-material/ChevronRight';
import Pagination from '@mui/material/Pagination';
import TextField from '@mui/material/TextField';
import Typography from '@mui/material/Typography';
import Dialog from '@mui/material/Dialog';
import AppBar from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import Button from '@mui/material/Button';

import ArrowBackIcon from '@mui/icons-material/ArrowBack';

import Template from './components/template';
import Basis from './components/createTemplate/basis';
import MyselfTemplate from './components/mySelfTemplate';

import { useState, useEffect } from 'react';
function MyTemplate() {
    useEffect(() => {
        getList();
    }, []);
    const getList = () => {
        console.log('页面第一次进入');
    };
    const [pageQuery, setPageQuery] = useState({
        page: 1,
        pageSize: 40
    });
    let total = 10000;
    const paginationChange = (event: any, value: number) => {
        setPageQuery({
            ...pageQuery,
            page: value
        });
    };
    const [open, setOpen] = useState(false);
    const handleDetail = () => {
        setOpen(true);
    };
    return (
        <Box>
            <Grid container spacing={2}>
                <Grid item lg={3}>
                    <TextField v-model="queryParams.name" label="模板名称" InputLabelProps={{ shrink: true }} fullWidth />
                </Grid>
                <Grid item lg={3}>
                    <TextField v-model="queryParams.topics" label="模板名称" InputLabelProps={{ shrink: true }} fullWidth />
                </Grid>
                <Grid item lg={3}>
                    <TextField v-model="queryParams.tags" label="模板名称" InputLabelProps={{ shrink: true }} fullWidth />
                </Grid>
            </Grid>
            <Box display="flex" alignItems="end" my={2}>
                <Typography variant="h5">推荐模板</Typography>
                <Link href="#" fontSize={14} color="#7367f0" ml={1}>
                    使用说明
                </Link>
            </Box>
            <Box display="flex">
                <Template handleDetail={handleDetail} />
                <Template handleDetail={handleDetail} />
            </Box>
            <Box display="flex" justifyContent="space-between" alignItems="end" my={2}>
                <Typography variant="h5">收藏模板</Typography>
                <Box fontSize={25} color="#7367f0" display="flex" alignItems="center">
                    <Link href="#" fontSize={14}>
                        More
                    </Link>
                    <ChevronRight />
                </Box>
            </Box>
            <Box display="flex">
                <Template handleDetail={handleDetail} />
                <Template handleDetail={handleDetail} />
            </Box>
            <Typography variant="h5" my={2}>
                我的模板
            </Typography>
            <MyselfTemplate />
            <Box my={2}>
                <Pagination page={pageQuery.page} count={Math.ceil(total / pageQuery.pageSize)} onChange={paginationChange} />
            </Box>
            <Dialog fullScreen open={open} onClose={() => setOpen(false)}>
                <AppBar sx={{ position: 'relative' }}>
                    <Toolbar sx={{ justifyContent: 'space-between' }}>
                        <Button startIcon={<ArrowBackIcon />} color="inherit" onClick={() => setOpen(false)}>
                            Back
                        </Button>
                        <Button autoFocus color="inherit" onClick={() => setOpen(false)}>
                            save
                        </Button>
                    </Toolbar>
                </AppBar>
                <Grid container spacing={2}>
                    <Grid item lg={4}>
                        <Basis />
                    </Grid>
                    <Grid item lg={8}></Grid>
                </Grid>
            </Dialog>
        </Box>
    );
}

export default MyTemplate;
