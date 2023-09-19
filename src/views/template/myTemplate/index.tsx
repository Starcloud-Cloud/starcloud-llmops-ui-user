import {
    Box,
    Grid,
    Pagination,
    TextField,
    Typography,
    Button,
    OutlinedInput,
    FormControl,
    InputLabel,
    Chip,
    MenuItem,
    Select
} from '@mui/material';

import Template from './components/content/template';
import MyselfTemplate from './components/content/mySelfTemplate';
import { UpgradeModel } from 'views/template/myChat/components/upgradeRobotModel';

import { recommends, appPage } from 'api/template/index';

import { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

import KeyboardArrowLeftIcon from '@mui/icons-material/KeyboardArrowLeft';
import KeyboardArrowRightIcon from '@mui/icons-material/KeyboardArrowRight';

import { ScrollMenu, VisibilityContext } from 'react-horizontal-scrolling-menu';
import 'react-horizontal-scrolling-menu/dist/styles.css';
import marketStore from 'store/market';
import myApp from 'store/myApp';
import { useContext } from 'react';
import { Item } from 'types/template';
import { t } from 'hooks/web/useI18n';
import userInfoStore from 'store/entitlementAction';
import useUserStore from 'store/user';
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
    const [appList, setAppList] = useState<any[]>([]);
    const [newAppList, setNewApp] = useState<any[]>([]);
    const [pageQuery, setPageQuery] = useState({
        pageNo: 1,
        pageSize: 20
    });
    const categoryList = marketStore((state) => state.categoryList);
    const [queryParams, setQueryParams] = useState<{ name: string; categories: (string | null)[]; tags: (string | null)[] }>({
        name: '',
        categories: [],
        tags: []
    });
    const { totals, totalList, setTotals, setTotalList } = myApp();
    const changeParams = (e: any) => {
        const { name, value } = e.target;
        setQueryParams({
            ...queryParams,
            [name]: value
        });
    };
    const query = ({ name, value }: any) => {
        const newValue = { ...queryParams };
        (newValue as any)[name] = value;
        const setValue = totalList.filter((item) => {
            let nameMatch = true;
            let topicMatch = true;
            let tagMatch = true;
            if (newValue.name) {
                nameMatch = item.name.toLowerCase().includes(newValue.name.toLowerCase());
            }
            if (newValue.categories && newValue.categories.length > 0) {
                if (item.categories) {
                    topicMatch = newValue.categories.some((topic) => item.categories.includes(topic));
                } else {
                    topicMatch = false;
                }
            }
            // if (newValue.tags && newValue.tags.length > 0) {
            //     if (item.tags) {
            //         tagMatch = newValue.tags.some((tag) => item.tags.includes(tag));
            //     } else {
            //         tagMatch = false;
            //     }
            // }
            return nameMatch && topicMatch && tagMatch;
        });
        setAppList(setValue);
        setTotals(setValue.length);
        setNewApp(setValue.slice(0, pageQuery.pageSize));
    };
    useEffect(() => {
        recommends().then((res) => {
            setRecommends(res);
        });
        appPage({ pageNo: 1, pageSize: 1000 }).then((res) => {
            setAppList(res.list);
            setTotalList(res.list);
            setTotals(res.page.total);
            setNewApp(res.list.slice(0, pageQuery.pageSize));
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
    const [botOpen, setBotOpen] = useState(false);
    const { userInfo }: any = userInfoStore();
    const { user } = useUserStore();
    //弹窗
    const handleDetail = (data: { uid: string }) => {
        if (
            totalList.filter((item) => Number(item.creator) === user.id).length >= userInfo.benefits[2].totalNum ||
            userInfo.benefits[2].totalNum === -1
        ) {
            setBotOpen(true);
            return;
        }
        navigate('/createApp?recommend=' + data.uid);
    };
    const timeoutRef = useRef<any>();
    return (
        <Box>
            <Grid container spacing={2} sx={{ mt: 2 }}>
                <Grid item lg={3}>
                    <TextField
                        label={t('apply.name')}
                        onChange={(e) => {
                            changeParams(e);
                            clearTimeout(timeoutRef.current);
                            timeoutRef.current = setTimeout(() => {
                                query(e.target);
                            }, 200);
                        }}
                        name="name"
                        value={queryParams.name}
                        InputLabelProps={{ shrink: true }}
                        fullWidth
                    />
                </Grid>
                <Grid item lg={3}>
                    <FormControl fullWidth>
                        <InputLabel color="secondary" id="categories">
                            {t('myApp.categary')}
                        </InputLabel>
                        <Select
                            labelId="categories"
                            name="categories"
                            multiple
                            color="secondary"
                            value={queryParams?.categories}
                            onChange={(e) => {
                                changeParams(e);
                                clearTimeout(timeoutRef.current);
                                timeoutRef.current = setTimeout(() => {
                                    query(e.target);
                                }, 200);
                            }}
                            input={<OutlinedInput id="select-multiple-chip" label="Chip" />}
                            renderValue={(selected) => (
                                <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
                                    {selected?.map((value) => (
                                        <Chip key={value} label={value} />
                                    ))}
                                </Box>
                            )}
                            label={t('myApp.categary')}
                        >
                            {categoryList?.map(
                                (item) =>
                                    item.name !== 'All' && (
                                        <MenuItem key={item.code} value={item.code}>
                                            {item.name}
                                        </MenuItem>
                                    )
                            )}
                        </Select>
                    </FormControl>
                </Grid>
                {/* <Grid item lg={3}>
                    <FormControl fullWidth>
                        <InputLabel color="secondary" id="tags">
                            {t('apply.tag')}
                        </InputLabel>
                        <Select
                            labelId="tags"
                            name="tags"
                            multiple
                            color="secondary"
                            value={queryParams?.tags}
                            onChange={(e) => {
                                changeParams(e);
                                clearTimeout(timeoutRef.current);
                                timeoutRef.current = setTimeout(() => {
                                    query(e.target);
                                }, 200);
                            }}
                            input={<OutlinedInput id="select-multiple-chip" label="Chip" />}
                            renderValue={(selected) => (
                                <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
                                    {selected?.map((value) => (
                                        <Chip key={value} label={value} />
                                    ))}
                                </Box>
                            )}
                            label={t('apply.tag')}
                        >
                            {categoryList?.map((item) => (
                                <MenuItem key={item.code} value={item.code}>
                                    {item.name}
                                </MenuItem>
                            ))}
                        </Select>
                    </FormControl>
                </Grid> */}
            </Grid>
            <Box display="flex" alignItems="end" mt={2} mb={2}>
                <Typography variant="h3">{t('apply.recommend')}</Typography>
                <Typography fontSize="12px" ml={1}>
                    {t('apply.AppDesc')}
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
            <UpgradeModel
                open={botOpen}
                handleClose={() => setBotOpen(false)}
                title={`添加应用个数(${userInfo.benefits[2].totalNum})已用完`}
            />
            {totals > 0 && (
                <Box>
                    <Typography variant="h3" mt={4} mb={2}>
                        {t('apply.self')}
                    </Typography>
                    <MyselfTemplate appList={newAppList} />
                    <Box my={2}>
                        <Pagination page={pageQuery.pageNo} count={Math.ceil(totals / pageQuery.pageSize)} onChange={paginationChange} />
                    </Box>
                </Box>
            )}
        </Box>
    );
}

export default MyTemplate;
