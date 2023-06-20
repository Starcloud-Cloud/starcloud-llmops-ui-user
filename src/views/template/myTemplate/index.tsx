import { Box, Grid, Link, Pagination, TextField, Typography, Button } from '@mui/material';

import ChevronRight from '@mui/icons-material/ChevronRight';

import Template from './components/content/template';
import MyselfTemplate from './components/content/mySelfTemplate';

import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

import KeyboardArrowLeftIcon from '@mui/icons-material/KeyboardArrowLeft';
import KeyboardArrowRightIcon from '@mui/icons-material/KeyboardArrowRight';

import { ScrollMenu, VisibilityContext } from 'react-horizontal-scrolling-menu';
import 'react-horizontal-scrolling-menu/dist/styles.css';

import { useContext } from 'react';

//左右切换的按钮
const LeftArrow = () => {
    const { isFirstItemVisible, scrollPrev } = useContext(VisibilityContext);
    return (
        <Box position="absolute" top="0" bottom="0" margin="auto" zIndex="9999" lineHeight="350px">
            {!isFirstItemVisible ? (
                <Button
                    sx={{ borderRadius: '50%', left: '10px', padding: 1, minWidth: 'auto' }}
                    variant="outlined"
                    onClick={() => scrollPrev()}
                >
                    <KeyboardArrowLeftIcon />
                </Button>
            ) : (
                ''
            )}
        </Box>
    );
};
const RightArrow = () => {
    const { isLastItemVisible, scrollNext } = useContext(VisibilityContext);
    return (
        <Box position="absolute" top="0" bottom="0" right="10px" margin="auto" zIndex="9999" lineHeight="350px">
            {!isLastItemVisible ? (
                <Button sx={{ borderRadius: '50%', padding: 1, minWidth: 'auto' }} variant="outlined" onClick={() => scrollNext()}>
                    <KeyboardArrowRightIcon />
                </Button>
            ) : (
                ''
            )}
        </Box>
    );
};

function MyTemplate() {
    //路由跳转
    const navigate = useNavigate();
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
    //弹窗
    const handleDetail = () => {
        navigate('/template/createDetail');
    };
    const items = [1, 2, 3, 4, 5, 6, 7, 8];
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
            <Box sx={{ position: 'relative' }}>
                <ScrollMenu LeftArrow={LeftArrow} RightArrow={RightArrow}>
                    {items.map((id, index) => (
                        <Box key={index} style={{ marginLeft: index === 0 ? 0 : '16px' }}>
                            <Template data="{}" handleDetail={handleDetail} />
                        </Box>
                    ))}
                </ScrollMenu>
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
            <Box sx={{ position: 'relative' }}>
                <ScrollMenu LeftArrow={LeftArrow} RightArrow={RightArrow}>
                    {items.map((id, index) => (
                        <Box key={index} style={{ marginLeft: index === 0 ? 0 : '16px' }}>
                            <Template data="{}" handleDetail={handleDetail} />
                        </Box>
                    ))}
                </ScrollMenu>
            </Box>
            <Typography variant="h5" my={2}>
                我的模板
            </Typography>
            <MyselfTemplate />
            <Box my={2}>
                <Pagination page={pageQuery.page} count={Math.ceil(total / pageQuery.pageSize)} onChange={paginationChange} />
            </Box>
        </Box>
    );
}

export default MyTemplate;
