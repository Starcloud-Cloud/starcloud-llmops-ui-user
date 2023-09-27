import SearchIcon from '@mui/icons-material/Search';
import { Box, FormControl, Grid, InputAdornment, InputLabel, MenuItem, Select, TextField, Typography } from '@mui/material';
import { Outlet, useNavigate } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { t } from 'hooks/web/useI18n';
import marketStore from 'store/market';
import ScrollMenus from './ScrollMenu';
import { useTheme } from '@mui/material/styles';
import infoStore from 'store/entitlementAction';
import Phone from 'ui-component/login/phone';
import { getUserInfo } from 'api/login';

interface MarketList {
    name: string;
    tags: string[];
    createTime: number;
    viewCount: number;
    categories: any;
}
interface Page {
    pageNo: number;
    pageSize: number;
}
function TemplateMarket() {
    //绑定手机号
    const { use, setuse } = infoStore();
    const [phoneOpne, setPhoneOpen] = useState(false);
    useEffect(() => {
        if (!use?.mobile) {
            setPhoneOpen(true);
        } else {
            setPhoneOpen(false);
        }
    }, [use?.mobile]);
    const theme = useTheme();
    const navigate = useNavigate();
    const { total, templateList, newtemplateList, sorllList, setNewTemplate, setSorllList } = marketStore();
    const [page, setPage] = useState<Page>({ pageNo: 1, pageSize: 30 });
    const [queryParams, setQueryParams] = useState({
        name: '',
        sort: '',
        category: 'AMAZON'
    });
    useEffect(() => {
        handleSearch();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [queryParams, templateList]);
    const sortList = [
        { text: t('market.new'), key: 'gmt_create' },
        { text: t('market.popular'), key: 'like' },
        { text: t('market.recommend'), key: 'step' }
    ];
    //更改筛选
    const handleChange = (event: any) => {
        navigate('/appMarket/list');
        const { name, value } = event.target;
        setQueryParams({
            ...queryParams,
            [name]: value
        });
    };
    //当用户更改了筛选触发的逻辑
    const handleSearch = () => {
        let newList = templateList.filter((item: MarketList) => {
            let nameMatch = true;
            if (queryParams.name) {
                nameMatch = item.name?.toLowerCase().includes(queryParams.name.toLowerCase());
            }
            let categoryMatch = true;
            if (queryParams.category) {
                if (queryParams.category === 'ALL') {
                    categoryMatch = true;
                } else {
                    categoryMatch = item.categories?.includes(queryParams.category);
                }
            }
            return nameMatch && categoryMatch;
        });
        if (queryParams.sort && queryParams.sort === 'like') {
            newList.sort((a: MarketList, b: MarketList) => {
                return b.viewCount - a.viewCount;
            });
        }
        if (queryParams.sort && queryParams.sort === 'step') {
            const fristList = newList.filter((item: MarketList) => item.tags?.includes('recommend'));
            const lastList = newList.filter((item: MarketList) => !item.tags?.includes('recommend'));
            newList = [...fristList, ...lastList];
        }
        if (queryParams.sort && queryParams.sort === 'gmt_create') {
            newList.sort((a: MarketList, b: MarketList) => {
                return (b.createTime = a.createTime);
            });
        }
        setPage({
            ...page,
            pageNo: 1
        });
        setNewTemplate(newList);
        setSorllList(newList.slice(0, page.pageSize));
    };
    //页面滚动
    const goodsScroll = (event: any) => {
        const container = event.target;
        const scrollTop = container.scrollTop;
        if (scrollTop <= 133) {
            setHeight(133 - scrollTop);
        }
        const clientHeight = container.clientHeight;
        const scrollHeight = container.scrollHeight;
        if (scrollTop + clientHeight >= scrollHeight - 20) {
            if (Math.ceil(newtemplateList.length / page.pageSize) > page.pageNo) {
                setPage((oldValue: Page) => {
                    let newValue = { ...oldValue };
                    newValue.pageNo = newValue.pageNo + 1;
                    setSorllList([
                        ...sorllList,
                        ...newtemplateList.slice(
                            (newValue.pageNo - 1) * newValue.pageSize,
                            (newValue.pageNo - 1) * newValue.pageSize + newValue.pageSize
                        )
                    ]);
                    return newValue;
                });
            }
        }
    };
    //切换category
    const changeCategory = (data: string) => {
        setQueryParams({
            ...queryParams,
            category: data
        });
    };
    const [maxHeight, setHeight] = useState(133);

    return (
        <Box
            sx={{
                position: 'relative',
                '&::after': {
                    content: '" "',
                    position: 'absolute',
                    top: '0',
                    right: '0px',
                    width: '5px',
                    height: maxHeight + 'px',
                    backgroundColor: theme.palette.mode === 'dark' ? '#1a223f' : 'rgb(244, 246, 248)',
                    pointerEvents: 'none'
                }
            }}
        >
            <Box
                maxWidth="1300px"
                margin="0 auto"
                height="calc(100vh - 128px)"
                overflow="hidden"
                onScroll={goodsScroll}
                sx={{
                    scrollbarGutter: 'stable',
                    '&:hover': {
                        overflow: 'scroll'
                    }
                }}
            >
                <Box>
                    <Box className="flex mb-[8px] flex-wrap items-end gap-3">
                        <Typography variant="h2" lineHeight={1}>
                            {t('market.title')}
                        </Typography>
                        {/* <Typography color="#697586" fontSize="12px" ml={0.5} fontWeight={500}>
                                {t('market.subLeft')} {total} + {t('market.subright')}
                            </Typography> */}
                        <TextField
                            size="small"
                            id="filled-start-adornment"
                            sx={{ width: '300px' }}
                            placeholder={t('market.place')}
                            name="name"
                            value={queryParams.name}
                            onChange={handleChange}
                            InputProps={{
                                startAdornment: (
                                    <InputAdornment position="start">
                                        <SearchIcon />
                                    </InputAdornment>
                                )
                            }}
                        />
                    </Box>

                    <Grid container spacing={2} mb={1}>
                        <Grid item xs={12} md={10}>
                            <ScrollMenus change={changeCategory} />
                        </Grid>
                        <Grid item xs={12} md={2}>
                            <FormControl fullWidth>
                                <InputLabel id="sort">{t('market.sortby')}</InputLabel>
                                <Select id="sort" onChange={handleChange} name="sort" value={queryParams.sort} label={t('market.sortby')}>
                                    {sortList.map((el: any) => (
                                        <MenuItem key={el.key} value={el.key}>
                                            {el.text}
                                        </MenuItem>
                                    ))}
                                </Select>
                            </FormControl>
                        </Grid>
                    </Grid>
                </Box>
                <Outlet />
            </Box>
            <Phone
                phoneOpne={phoneOpne}
                title="绑定手机号"
                submitText="绑定"
                onClose={() => {}}
                emits={async () => {
                    setPhoneOpen(false);
                    const result = await getUserInfo();
                    setuse(result);
                }}
            />
        </Box>
    );
}
export default TemplateMarket;
