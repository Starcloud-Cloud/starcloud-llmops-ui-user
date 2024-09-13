import KeyboardArrowLeftIcon from '@mui/icons-material/KeyboardArrowLeft';
import KeyboardArrowRightIcon from '@mui/icons-material/KeyboardArrowRight';
import { PlusOutlined, RightOutlined } from '@ant-design/icons';
import { Box, Typography, IconButton } from '@mui/material';
import { Tabs } from 'antd';
import { useNavigate, useLocation } from 'react-router-dom';
import { useEffect, useState, useContext, useRef } from 'react';
import { t } from 'hooks/web/useI18n';
import marketStore from 'store/market';
import { useTheme } from '@mui/material/styles';
import { listGroupByCategory, categories, categoryTree } from 'api/template';
import { favoriteList } from 'api/template/collect';
import _ from 'lodash-es';
import { ScrollMenu, VisibilityContext } from 'react-horizontal-scrolling-menu';
import 'react-horizontal-scrolling-menu/dist/styles.css';
import { useAllDetail } from '../../../contexts/JWTContext';
import market from 'assets/images/landing/pre-apps/market.jpg';
import { MarketVideoModel } from './MarketVideoModel';
import { NewUserVip } from '../../../ui-component/new-user-vip/index';
import MarketTemplate from '../myTemplate/components/content/marketTemplate';
import dayjs from 'dayjs';
import { ENUM_PERMISSION, getPermission } from 'utils/permission';
import { appPage } from 'api/template';
import jsCookie from 'js-cookie';
import { ENUM_TENANT, getTenant } from 'utils/permission';
import { Image, Row, Col } from 'antd';
import './index.scss';
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
    const handleDetail = (data: { uid: string; type: string }) => {
        if (data.type === 'MEDIA_MATRIX') {
            navigate(`/batchSmallRedBook?appUid=${data.uid}`);
        } else {
            navigate(`/appMarketDetail/${data.uid}`);
        }
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

    const [value, setValue] = useState(getTenant() !== ENUM_TENANT.AI ? '0' : '2');
    const [collectList, setCollectList] = useState<any[]>([]);
    const [myAppList, setmyAppList] = useState<any[]>([]);
    const [openMarketVideo, setOpenMarketVideo] = useState(false);
    const [newUserVipOpen, setNewUserVipOpen] = useState(false);

    useEffect(() => {
        favoriteList({}).then((res) => {
            setCollectList(res);
        });
        appPage({
            pageNo: 1,
            pageSize: 10
        }).then((res) => {
            setmyAppList(res.list);
        });
    }, [value]);
    const scrollRef: any = useRef(null);

    const allDetail = useAllDetail();

    useEffect(() => {
        if (allDetail?.allDetail?.id) {
            if (getPermission(ENUM_PERMISSION.MARKET_VIDEO_MODAL)) {
                const result = localStorage.getItem(`marketVideo-${allDetail?.allDetail?.id}`);
                if (!result) {
                    setOpenMarketVideo(true);
                }
            }
        }
    }, [allDetail]);
    const getImage = (active: string) => {
        let image;
        try {
            image = require('../../../assets/images/category/' + active + '.svg');
        } catch (_) {
            image =
                'data:image/png;base64,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';
        }
        return image;
    };

    return (
        <Box
            className="Rows"
            height={jsCookie.get('isClient') ? '100vh' : '100%'}
            overflow="hidden"
            ref={scrollRef}
            sx={{
                scrollbarGutter: 'stable',
                // '&:hover': {
                //     overflow: 'scroll'
                // },
                background: '#f4f6f8',
                borderRadius: '8px'
            }}
        >
            <Tabs activeKey={value} onChange={setValue} aria-label="basic tabs example" className="h-full">
                <Tabs.TabPane tab={<div className="!text-[20px] !line-[25px] font-bold">应用市场</div>} key="0">
                    <div className="mt-4 pb-4 flex gap-3 w-full overflow-x-scroll">
                        {menuList?.map((item, index) => (
                            <div
                                onClick={() => {
                                    changeCategory(item, index);
                                }}
                                key={item.name}
                                className="h-[31px] px-3 py-1 cursor-pointer font-[600] bg-white shadow-md rounded-[6px] text-[rgb(75,74,88)] flex items-center gap-1 hover:bg-[#2E2E3814]"
                                style={{
                                    background: active === index ? '#673ab7' : '#fff',
                                    color: active === index ? '#fff' : 'rgb(75,74,88)'
                                }}
                            >
                                <Image width={20} height={20} preview={false} src={getImage(item.icon)} />
                                <span className="whitespace-nowrap">{item.name}</span>
                            </div>
                        ))}
                    </div>
                    <div style={{ scrollbarGutter: 'stable' }} className="h-full overflow-x-hidden overflow-y-scroll">
                        {newList?.map((item, index) => (
                            <div key={index}>
                                {item.appList?.length > 0 && (
                                    <>
                                        {item?.code !== 'HOT' && (
                                            <div className="flex justify-between items-center my-[24px]">
                                                <div className="text-[20px] line-[25px] font-bold flex items-end gap-2">
                                                    {queryParams.category === 'ALL' && (
                                                        <img height="20px" src={getImage(item.icon)} alt="" />
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
                                                        <RightOutlined />
                                                    </div>
                                                )}
                                            </div>
                                        )}
                                    </>
                                )}
                                {item.appList.length > 0 && item?.code !== 'HOT' && (
                                    <Row className="overflow-x-hidden pb-[5px] " gutter={[16, 16]} wrap={false}>
                                        {item.appList.map((el: any, index: number) => (
                                            <Col key={el?.uid} className={`xxxl-col aspect-[.75] flex-shrink-0`}>
                                                <MarketTemplate like="market" type="MARKET" handleDetail={handleDetail} data={el} />
                                            </Col>
                                        ))}
                                    </Row>
                                    // <div
                                    //     className="grid gap-4 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5 3xl:grid-cols-6 4xl:grid-cols-7 5xl:grid-cols-8"
                                    //     style={{
                                    //         // height: queryParams.category === 'ALL' ? '190px' : 'auto',
                                    //         overflowY: queryParams.category === 'ALL' ? 'hidden' : 'visible',
                                    //         paddingBottom: queryParams.category === 'ALL' ? '0px' : '10px'
                                    //     }}
                                    // >
                                    //     {item.appList.map((el: any, index: number) => (
                                    //         <MarketTemplate like="market" type="MARKET" key={el?.uid} handleDetail={handleDetail} data={el} />
                                    //     ))}
                                    // </div>
                                )}
                            </div>
                        ))}
                    </div>
                </Tabs.TabPane>
                {getTenant() !== ENUM_TENANT.AI && (
                    <Tabs.TabPane tab={<div className="!text-[20px] !line-[25px] font-bold">我的应用</div>} key="1">
                        <div className="relative">
                            <div
                                className="grid gap-4 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5 3xl:grid-cols-6 4xl:grid-cols-7 5xl:grid-cols-8"
                                style={{
                                    height: '190px',
                                    overflowY: 'hidden'
                                }}
                            >
                                <div
                                    className="rounded-[12px] shadow-md border border-solid border-[transparent] hover:border-[#CECAD5] cursor-pointer h-[185px] bg-white p-4 flex gap-2 justify-center items-center flex-col"
                                    onClick={() => navigate('/my-app')}
                                >
                                    <PlusOutlined className="text-[30px]" />
                                    <div className="text-black/60 text-[14px]">找不到合适的？ 创建新应用</div>
                                </div>
                                {myAppList.map((el: any, index: number) => (
                                    <MarketTemplate
                                        type="APP"
                                        key={el?.uid}
                                        handleDetail={({ uid }: { uid: string }) => {
                                            navigate('/createApp?uid=' + uid + '&source=market');
                                        }}
                                        data={el}
                                    />
                                ))}
                            </div>
                            {myAppList.length > 0 && (
                                <div
                                    onClick={() => {
                                        navigate('/my-app');
                                    }}
                                    className="absolute right-0 top-[-35px] text-[#673ab7] cursor-pointer"
                                >
                                    更多应用
                                    <RightOutlined />
                                </div>
                            )}
                        </div>
                    </Tabs.TabPane>
                )}
                {newList?.some((item) => item?.code === 'HOT') && (
                    <Tabs.TabPane
                        tab={
                            <div className="!text-[20px] !line-[25px] font-bold flex items-end gap-2">
                                <img height="20px" src={getImage(newList?.find((item) => item?.code === 'HOT').icon)} alt="" />
                                <span>{newList?.find((item) => item?.code === 'HOT').name}</span>
                            </div>
                        }
                        key="2"
                    >
                        <div
                            style={{
                                minHeight: '190px'
                            }}
                            className="grid gap-4 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5 3xl:grid-cols-6 4xl:grid-cols-7 5xl:grid-cols-8"
                        >
                            {newList
                                ?.find((item) => item.code === 'HOT')
                                ?.appList.map((el: any, index: number) => (
                                    <MarketTemplate type="APP" like="market" key={el?.uid} handleDetail={handleDetail} data={el} />
                                ))}
                        </div>
                    </Tabs.TabPane>
                )}
                <Tabs.TabPane tab={<div className="!text-[20px] !line-[25px] font-bold">我的收藏</div>} key="3">
                    <div className="relative">
                        <div
                            style={{
                                height: '190px',
                                overflowY: 'hidden'
                            }}
                            className="grid gap-4 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5 3xl:grid-cols-6 4xl:grid-cols-7 5xl:grid-cols-8"
                        >
                            {collectList.map((el: any, index: number) => (
                                <MarketTemplate type="APP" key={el?.uid} handleDetail={handleDetail} data={el} />
                            ))}
                        </div>
                        {collectList.length > 0 && (
                            <div
                                onClick={() => {
                                    navigate('/collect');
                                }}
                                className="absolute right-0 top-[-35px] text-[#673ab7] cursor-pointer"
                            >
                                更多收藏
                                <RightOutlined />
                            </div>
                        )}
                    </div>
                </Tabs.TabPane>
            </Tabs>
            <MarketVideoModel
                open={openMarketVideo}
                handleClose={() => {
                    setOpenMarketVideo(false);
                    localStorage.setItem(`marketVideo-${allDetail?.allDetail?.id}`, 'true');
                    const newUserVip = localStorage.getItem(`newUserVipEndTime-${allDetail?.allDetail.id}`);
                    // 第一次打开
                    if (!newUserVip && allDetail?.allDetail?.isNewUser) {
                        setNewUserVipOpen(true);
                    }
                }}
            />
            {newUserVipOpen && (
                <NewUserVip
                    onClose={() => {
                        const newUserVipEndTime = dayjs().add(3, 'day').format('YYYY-MM-DD HH:mm:ss');
                        localStorage.setItem(`newUserVipEndTime-${allDetail?.allDetail.id}`, newUserVipEndTime);
                        setNewUserVipOpen(false);
                    }}
                />
            )}
        </Box>
    );
}
export default TemplateMarket;

// 第一次视频关闭后弹出新用户活动
// 后面每3天弹一次
