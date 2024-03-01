import SearchIcon from '@mui/icons-material/Search';
import KeyboardArrowLeftIcon from '@mui/icons-material/KeyboardArrowLeft';
import KeyboardArrowRightIcon from '@mui/icons-material/KeyboardArrowRight';
import { RightOutlined } from '@ant-design/icons';
import {
    Box,
    Typography,
    IconButton,
    Grid,
    InputAdornment,
    TextField,
    Tabs,
    Tab,
    FormControl,
    InputLabel,
    OutlinedInput
} from '@mui/material';
import { useNavigate, useLocation } from 'react-router-dom';
import { useEffect, useState, useContext, useRef } from 'react';
import { t } from 'hooks/web/useI18n';
import marketStore from 'store/market';
import { useTheme } from '@mui/material/styles';
import { listGroupByCategory, categories, categoryTree } from 'api/template';
import Template from 'views/template/myTemplate/components/content/template';
import { favoriteList } from 'api/template/collect';
import _ from 'lodash-es';
import { ScrollMenu, VisibilityContext } from 'react-horizontal-scrolling-menu';
import 'react-horizontal-scrolling-menu/dist/styles.css';
import { useAllDetail } from '../../../contexts/JWTContext';
import market from 'assets/images/landing/pre-apps/market.jpg';
import { MarketVideoModel } from './MarketVideoModel';
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
interface TabPanelProps {
    children?: React.ReactNode;
    index: number;
    value: number;
}

function CustomTabPanel(props: TabPanelProps) {
    const { children, value, index, ...other } = props;

    return (
        <div role="tabpanel" hidden={value !== index} id={`simple-tabpanel-${index}`} aria-labelledby={`simple-tab-${index}`} {...other}>
            <Box sx={{ display: value === index ? 'block' : 'none', pt: 2 }}>{children}</Box>
        </div>
    );
}

function a11yProps(index: number) {
    return {
        id: `simple-tab-${index}`,
        'aria-controls': `simple-tabpanel-${index}`
    };
}

function TemplateMarket() {
    const theme = useTheme();
    const navigate = useNavigate();
    const location = useLocation();
    const searchParams = new URLSearchParams(location.search);
    const { total, templateList, newtemplateList, sorllList, setNewTemplate, setSorllList, categoryTrees, setCategoryTree } = marketStore();
    const [page, setPage] = useState<Page>({ pageNo: 1, pageSize: 30 });
    //应用列表
    const [appList, setAppList] = useState<any[]>([]);
    const [newList, setNewList] = useState<any[]>([]);
    //类别选中
    const [menuList, setMenuList] = useState<{ name: string; icon: string; code: string }[]>([]);
    const [active, setActive] = useState<number | string>(0);
    //类别树
    const [cateTree, setCateTree] = useState<any[]>([]);
    useEffect(() => {
        //列表
        listGroupByCategory({ isHot: true }).then((res) => {
            setAppList(res);
            if (queryParams.category !== 'ALL') {
                const newData = categoryTrees.filter((item) => {
                    return item.code === queryParams.category;
                })[0]?.children;
                const newList = res.filter((item: any) => item.code === queryParams.category)[0]?.appList;
                const changeList = newList ? _.cloneDeep(newList) : [];
                newData?.forEach((item: any) => {
                    item.appList = [];
                    item.appList.push(
                        ...(newList
                            ? newList.filter((el: any) => {
                                  if (changeList && item.code === el.category) {
                                      changeList.splice(
                                          changeList.findIndex((value: any) => value.code === el.category),
                                          1
                                      );
                                  }
                                  return item.code === el.category;
                              })
                            : [])
                    );
                });
                const newData1 = _.cloneDeep(newData);
                newData1?.push({
                    sort: 9999,
                    children: [],
                    name: '其他',
                    appList: [...changeList],
                    code: 'OTHER',
                    parentCode: 'AMAZON',
                    icon: 'amazon',
                    image: 'https://download.hotsalecloud.com/mofaai/images/category/amazon.jpg'
                });
                scrollRef.current.scrollTop = 0;
                setNewList(newData1);
            } else {
                const newData = _.cloneDeep(res);
                newData.forEach((item: any) => {
                    if (item.code !== 'HOT') {
                        item.appList = item.appList?.splice(0, 8);
                    }
                });
                setNewList(newData);
            }
        });
        //类别
        categories().then((res) => {
            setMenuList(res);
        });
        //类别树
        categoryTree().then((res) => {
            setCateTree(res);
            setCategoryTree(res);
        });
    }, []);
    useEffect(() => {
        if (menuList.length > 0) {
            setActive(searchParams.get('category') ? menuList.findIndex((item) => item.code === searchParams.get('category')) : 0);
        }
    }, [menuList]);
    const [queryParams, setQueryParams] = useState({
        name: '',
        sort: '',
        category: searchParams.get('category') || 'ALL'
    });
    useEffect(() => {
        searchList();
    }, [queryParams]);
    const searchList = () => {
        if (queryParams.category !== 'ALL') {
            const newData = cateTree.filter((item) => {
                return item.code === queryParams.category;
            })[0]?.children;
            const newList = appList.filter((item) => item.code === queryParams.category)[0]?.appList;
            const changeList = newList ? _.cloneDeep(newList) : [];
            newData?.forEach((item: any) => {
                item.appList = [];
                item.appList.push(
                    ...(newList
                        ? newList.filter((el: any) => {
                              if (changeList && item.code === el.category) {
                                  changeList.splice(
                                      changeList.findIndex((value: any) => value.code === el.category),
                                      1
                                  );
                              }
                              return item.code === el.category;
                          })
                        : [])
                );
            });
            const newData1 = _.cloneDeep(newData);
            newData1?.push({
                sort: 9999,
                children: [],
                name: '其他',
                appList: [...changeList],
                code: 'OTHER',
                parentCode: 'AMAZON',
                icon: 'amazon',
                image: 'https://download.hotsalecloud.com/mofaai/images/category/amazon.jpg'
            });
            const filterData = newData1?.map((item: any) => {
                return {
                    ...item,
                    appList: item.appList.filter((el: any) => el.name?.toLowerCase().includes(queryParams.name.toLowerCase()))
                };
            });
            scrollRef.current.scrollTop = 0;
            setNewList(filterData);
        } else {
            const newData = _.cloneDeep(appList);
            const filterData = newData.map((item: any) => {
                return {
                    ...item,
                    appList: item.appList.filter(
                        (el: any) =>
                            el.name?.toLowerCase().includes(queryParams.name.toLowerCase()) ||
                            el.spell?.toLowerCase().includes(queryParams.name.toLowerCase())
                    )
                };
            });
            filterData.forEach((item: any) => {
                if (item.code !== 'HOT') {
                    item.appList = item.appList?.splice(0, 8);
                }
            });
            setNewList(filterData);
        }
    };
    //title筛选
    const timer: any = useRef(null);
    const [marketTitle, setMarketTitle] = useState('');
    const handleChange = (event: any) => {
        const { name, value } = event.target;
        setMarketTitle(value);
        clearTimeout(timer.current);
        timer.current = setTimeout(() => {
            // @ts-ignore
            _hmt.push(['_trackEvent', '应用市场', '搜索', '搜索词', value]);
            setQueryParams({
                ...queryParams,
                [name]: value
            });
        }, 300);
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
    //切换category
    const changeCategory = (item: any, index: number) => {
        if (active === index) {
            setActive(0);
            setQueryParams({
                ...queryParams,
                category: 'ALL'
            });
        } else {
            setActive(index);
            setQueryParams({
                ...queryParams,
                category: item.code
            });
        }
    };
    const handleDetail = (data: { uid: string }) => {
        navigate(`/appMarketDetail/${data.uid}`);
    };
    const LeftArrow = () => {
        const { isFirstItemVisible, scrollPrev } = useContext(VisibilityContext);
        return (
            <>
                {!isFirstItemVisible ? (
                    <Box sx={{ width: '40px' }}>
                        <IconButton onClick={() => scrollPrev()}>
                            <KeyboardArrowLeftIcon />
                        </IconButton>
                    </Box>
                ) : (
                    ''
                )}
            </>
        );
    };
    const RightArrow = () => {
        const { isFirstItemVisible, scrollNext } = useContext(VisibilityContext);
        return (
            <Box sx={{ width: '40px' }}>
                {!isFirstItemVisible ? (
                    <IconButton onClick={() => scrollNext()}>
                        <KeyboardArrowRightIcon />
                    </IconButton>
                ) : (
                    ''
                )}
            </Box>
        );
    };
    const focus = {
        textAlign: 'center',
        paddingRight: '20px',
        borderRadius: 15,
        cursor: 'pointer',
        fontSize: '12px',
        border: '1px solid transparent',
        paddingTop: '5px',
        marginBottom: 2
    };
    const focuos = {
        textAlign: 'center',
        paddingRight: '20px',
        borderRadius: 15,
        cursor: 'pointer',
        paddingTop: '5px',
        color: theme.palette.secondary[800],
        fontWeight: 600,
        fontSize: '12px',
        marginBottom: 2
    };
    const [value, setValue] = useState(0);
    const [collectList, setCollectList] = useState<any[]>([]);
    const [openMarketVideo, setOpenMarketVideo] = useState(false);

    useEffect(() => {
        favoriteList({}).then((res) => {
            setCollectList(res);
        });
    }, [value]);
    const scrollRef: any = useRef(null);

    const allDetail = useAllDetail();

    useEffect(() => {
        const result = localStorage.getItem(`marketVideo-${allDetail?.allDetail?.id}`);
        if (!result) {
            setOpenMarketVideo(true);
        }
    }, []);

    return (
        // <Box
        //     sx={{
        //         position: 'relative',
        //         '&::after': {
        //             content: '" "',
        //             position: 'absolute',
        //             top: '0',
        //             right: '0px',
        //             width: '5px',
        //             height: maxHeight + 'px',
        //             backgroundColor: theme.palette.mode === 'dark' ? '#1a223f' : 'rgb(244, 246, 248)',
        //             pointerEvents: 'none'
        //         }
        //     }}
        // >
        <Box
            height="calc(100vh - 128px)"
            overflow="hidden"
            ref={scrollRef}
            sx={{
                padding: { xs: 0, sm: '0 20px' },
                scrollbarGutter: 'stable',
                '&:hover': {
                    overflow: 'scroll'
                }
            }}
        >
            <Box className="flex mb-[8px] flex-wrap items-end gap-3">
                <Typography variant="h2" lineHeight={1}>
                    {t('market.title')}
                </Typography>
                <FormControl color="secondary" size="small" sx={{ width: '300px' }} variant="outlined">
                    <OutlinedInput
                        name="name"
                        value={marketTitle}
                        onChange={handleChange}
                        endAdornment={
                            <InputAdornment position="end">
                                <IconButton size="small" onClick={searchList} edge="end">
                                    <SearchIcon />
                                </IconButton>
                            </InputAdornment>
                        }
                        placeholder={t('market.place')}
                    />
                </FormControl>
            </Box>
            <ScrollMenu LeftArrow={LeftArrow} RightArrow={RightArrow}>
                {menuList?.map((item, index) => (
                    <Box
                        onClick={() => {
                            changeCategory(item, index);
                        }}
                        sx={active === index ? focuos : focus}
                        key={index}
                    >
                        <img
                            style={{ width: '25px', height: '25px' }}
                            src={require('../../../assets/images/category/' + item.icon + '.svg')}
                            alt="Icon"
                        />
                        <Box sx={{ whiteSpace: 'nowrap', fontSize: '14px' }}>{item.name}</Box>
                    </Box>
                ))}
            </ScrollMenu>
            {newList?.map((item, index) => (
                <div key={index}>
                    {item.appList?.length > 0 && (
                        <>
                            {item?.code !== 'HOT' && (
                                <div className="flex justify-between items-center my-[24px]">
                                    <div className="text-[20px] line-[25px] font-bold flex items-end gap-2">
                                        {queryParams.category === 'ALL' && (
                                            <img
                                                height="20px"
                                                src={require('../../../assets/images/category/' + item.icon + '.svg')}
                                                alt=""
                                            />
                                        )}
                                        <span>{item.name}</span>
                                    </div>
                                    {queryParams.category === 'ALL' && item?.code !== 'HOT' && (
                                        <div
                                            onClick={() => {
                                                changeCategory(
                                                    item,
                                                    menuList.findIndex((value) => value.code === item.code)
                                                );
                                            }}
                                            className="text-[#673ab7] cursor-pointer"
                                        >
                                            更多应用
                                            <RightOutlined rev={undefined} />
                                        </div>
                                    )}
                                </div>
                            )}
                            {queryParams.category === 'ALL' && item?.code === 'HOT' && (
                                <Tabs
                                    textColor="secondary"
                                    indicatorColor="secondary"
                                    sx={{ color: 'red', '& .MuiTabs-flexContainer': { borderColor: 'transparent' } }}
                                    value={value}
                                    onChange={(event: React.SyntheticEvent, value: number) => setValue(value)}
                                    aria-label="basic tabs example"
                                >
                                    <Tab
                                        label={
                                            <div className="!text-[20px] !line-[25px] font-bold flex items-end gap-2">
                                                <img
                                                    height="20px"
                                                    src={require('../../../assets/images/category/' + item.icon + '.svg')}
                                                    alt=""
                                                />
                                                <span>{item.name}</span>
                                            </div>
                                        }
                                        {...a11yProps(0)}
                                    />
                                    <Tab
                                        label={
                                            <div className="text-[20px] line-[25px] font-bold flex items-end gap-2">
                                                <span>我的收藏</span>
                                            </div>
                                        }
                                        {...a11yProps(1)}
                                    />
                                    <div
                                        className="cursor-pointer text-[#6839b7] ml-1 flex justify-center items-center"
                                        onClick={() => setOpenMarketVideo(true)}
                                    >
                                        应用市场使用视频
                                    </div>
                                </Tabs>
                            )}
                        </>
                    )}
                    {item.appList.length > 0 &&
                        (item?.code === 'HOT' ? (
                            <>
                                <CustomTabPanel value={value} index={0}>
                                    <Grid container display="flex" flexWrap={'wrap'} spacing={2}>
                                        {item.appList.map((el: any, index: number) => (
                                            <Grid flexShrink={0} xl={1.5} lg={2.4} md={3} sm={6} xs={6} key={el.uid + index} item>
                                                <Template like="market" handleDetail={handleDetail} data={el} />
                                            </Grid>
                                        ))}
                                    </Grid>
                                </CustomTabPanel>
                                <CustomTabPanel value={value} index={1}>
                                    <div className="relative">
                                        <Grid
                                            container
                                            className="min-h-[178px] max-h-[492px] overflow-hidden"
                                            display="flex"
                                            flexWrap={'wrap'}
                                            spacing={2}
                                        >
                                            {collectList.map((el: any, index: number) => (
                                                <Grid flexShrink={0} xl={1.5} lg={2.4} md={3} sm={6} xs={6} key={el.uid + index} item>
                                                    <Template handleDetail={handleDetail} data={el} />
                                                </Grid>
                                            ))}
                                        </Grid>
                                        {collectList.length > 0 && (
                                            <div
                                                onClick={() => {
                                                    navigate('/collect');
                                                }}
                                                className="absolute right-0 top-[-10px] text-[#673ab7] cursor-pointer"
                                            >
                                                更多收藏
                                                <RightOutlined rev={undefined} />
                                            </div>
                                        )}
                                    </div>
                                </CustomTabPanel>
                            </>
                        ) : (
                            <Grid
                                container
                                display="flex"
                                flexWrap={queryParams.category === 'ALL' ? 'nowrap' : 'wrap'}
                                overflow="hidden"
                                spacing={2}
                            >
                                {item.appList.map((el: any, index: number) => (
                                    <Grid flexShrink={0} xl={1.5} lg={2.4} md={3} sm={6} xs={6} key={el.uid + index} item>
                                        <Template like="market" handleDetail={handleDetail} data={el} />
                                    </Grid>
                                ))}
                            </Grid>
                        ))}
                </div>
            ))}
            <MarketVideoModel
                open={openMarketVideo}
                handleClose={() => {
                    setOpenMarketVideo(false);
                    localStorage.setItem(`marketVideo-${allDetail?.allDetail?.id}`, 'true');
                }}
            />
        </Box>
        // </Box>
    );
}
export default TemplateMarket;
