import { Box, Button, Grid, Pagination, TextField, Typography, useTheme } from '@mui/material';

import MyselfTemplate from './components/mySelfTemplate';
import Template from './components/template';

import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

import KeyboardArrowLeftIcon from '@mui/icons-material/KeyboardArrowLeft';
import KeyboardArrowRightIcon from '@mui/icons-material/KeyboardArrowRight';

import { ScrollMenu, VisibilityContext } from 'react-horizontal-scrolling-menu';
import 'react-horizontal-scrolling-menu/dist/styles.css';

import { t } from 'hooks/web/useI18n';
import { useContext } from 'react';
import { Item } from 'types/template';
import { createChat, getChatPage, getChatTemplate } from '../../../api/chat';
import FormDialog from './components/FormDialog';
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
    const [recommendList, setRecommends] = useState([]);
    const [appList, setAppList] = useState([]);
    const [newAppList, setNewApp] = useState([]);
    const [pageQuery, setPageQuery] = useState({
        pageNo: 1,
        pageSize: 20
    });
    const [total, setTotal] = useState(0);
    const [open, setOpen] = useState(false);
    const [robotName, setRobotName] = useState('');
    const [currentRow, setCurrentRow] = useState<any>(null);
    const theme = useTheme();

    useEffect(() => {
        getChatTemplate({ model: 'CHAT' }).then((res) => {
            setRecommends(res);
        });
        getChatPage({ pageNo: 1, pageSize: 1000, model: 'CHAT' }).then((res) => {
            setAppList(res.list);
            setNewApp(res.list.slice(0, pageQuery.pageSize));
            setTotal(res.page.total);
        });
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);
    const paginationChange = (event: any, value: number) => {
        setPageQuery({
            ...pageQuery,
            pageNo: value
        });
        setNewApp(appList.slice((value - 1) * pageQuery.pageSize, (value - 1) * pageQuery.pageSize + pageQuery.pageSize));
    };
    //弹窗
    const handleDetail = (item: any) => {
        setOpen(true);
        setCurrentRow(item);
    };

    const handleCreate = async () => {
        const res = await createChat({ robotName: robotName, uid: currentRow?.uid });
        setOpen(false);
        setCurrentRow(null);
        navigate(`/createChat?appId=${res}`);
    };

    return (
        <Box>
            <Grid container spacing={2} sx={{ mt: 2 }}>
                <Grid item lg={3}>
                    <TextField v-model="queryParams.name" label={t('chat.name')} InputLabelProps={{ shrink: true }} fullWidth />
                </Grid>
                {/*<Grid item lg={3}>*/}
                {/*    <TextField v-model="queryParams.topics" label={t('apply.category')} InputLabelProps={{ shrink: true }} fullWidth />*/}
                {/*</Grid>*/}
                {/*<Grid item lg={3}>*/}
                {/*    <TextField v-model="queryParams.tags" label={t('apply.tag')} InputLabelProps={{ shrink: true }} fullWidth />*/}
                {/*</Grid>*/}
            </Grid>
            <Box display="flex" alignItems="end" my={2}>
                <Typography variant="h3">{t('chat.recommend')}</Typography>
                <Typography fontSize="12px" ml={1}>
                    {t('chat.recommendDes')}
                </Typography>
            </Box>
            <Box sx={{ position: 'relative' }}>
                <ScrollMenu LeftArrow={LeftArrow} RightArrow={RightArrow}>
                    {recommendList.map((item: Item, index) => (
                        <Box key={index} style={{ marginLeft: index === 0 ? 0 : '16px', width: '203.33px' }}>
                            <Template data={item} handleDetail={handleDetail} />
                        </Box>
                    ))}
                </ScrollMenu>
            </Box>
            {total > 0 && (
                <Box>
                    <Typography variant="h3" my={2}>
                        {t('chat.myRobot')}
                    </Typography>
                    <MyselfTemplate appList={newAppList} />
                    <Box my={2}>
                        <Pagination page={pageQuery.pageNo} count={Math.ceil(total / pageQuery.pageSize)} onChange={paginationChange} />
                    </Box>
                </Box>
            )}
            <FormDialog open={open} setOpen={() => setOpen(false)} handleOk={handleCreate} setValue={setRobotName} value={robotName} />
        </Box>
    );
}

export default MyTemplate;
