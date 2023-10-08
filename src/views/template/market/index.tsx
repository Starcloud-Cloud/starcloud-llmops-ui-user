import SearchIcon from '@mui/icons-material/Search';
import { RightOutlined } from '@ant-design/icons';
import { Box, FormControl, Grid, InputAdornment, InputLabel, MenuItem, Select, TextField, Typography } from '@mui/material';
import { Outlet, useNavigate } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { t } from 'hooks/web/useI18n';
import marketStore from 'store/market';
import ScrollMenus from './ScrollMenu';
import { useTheme } from '@mui/material/styles';
import { listGroupByCategory } from 'api/template';
import Template from 'views/template/myTemplate/components/content/template';
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
    const theme = useTheme();
    const navigate = useNavigate();
    const { total, templateList, newtemplateList, sorllList, setNewTemplate, setSorllList } = marketStore();
    const [page, setPage] = useState<Page>({ pageNo: 1, pageSize: 30 });
    const [appList, setAppList] = useState<any[]>([]);
    const [newList, setNewList] = useState<any[]>([]);
    useEffect(() => {
        listGroupByCategory({ isSearchHot: true }).then((res) => {
            setAppList(res);
            setNewList(res);
        });
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);
    const [queryParams, setQueryParams] = useState({
        name: '',
        sort: '',
        category: 'ALL'
    });
    // useEffect(() => {
    //     handleSearch();
    //     // eslint-disable-next-line react-hooks/exhaustive-deps
    // }, [queryParams, templateList]);
    useEffect(() => {
        if (queryParams.category !== 'ALL') {
            setNewList(
                appList.map((item) => {
                    if (item.code === queryParams.category) {
                        return item;
                    }
                })
            );
        }
    }, [queryParams]);
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
    const handleDetail = (data: { uid: string }) => {
        navigate(`/appMarket/detail/${data.uid}`);
    };
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
                <Grid alignItems="center" container spacing={2} mb={1}>
                    <Grid item xs={12} md={9}>
                        <ScrollMenus change={changeCategory} />
                    </Grid>
                    <Grid item xs={12} md={3}>
                        <TextField
                            size="small"
                            id="filled-start-adornment"
                            fullWidth
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
                    </Grid>
                </Grid>
                {newList.map((item) => (
                    <div key={item.code}>
                        <div className="flex justify-between items-center my-[24px]">
                            <div className="text-[20px] line-[25px] font-bold flex items-end gap-2">
                                <img height="20px" src={require('../../../assets/images/category/' + item.icon + '.svg')} alt="" />
                                <span>{item.name}</span>
                            </div>
                            <div className="text-[#673ab7] cursor-pointer">
                                更多模板
                                <RightOutlined rev={undefined} />
                            </div>
                        </div>
                        <Grid container display="flex" flexWrap="nowrap" overflow="hidden" spacing={2}>
                            {item.appList.map((item: any, index: number) => (
                                <Grid flexShrink={0} lg={2} md={3} sm={6} xs={6} key={item.uid + index} item>
                                    <Template handleDetail={handleDetail} data={item} />
                                </Grid>
                            ))}
                        </Grid>
                    </div>
                ))}
            </Box>
        </Box>
    );
}
export default TemplateMarket;
