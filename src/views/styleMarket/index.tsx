import { RightOutlined } from '@ant-design/icons';
import { Box } from '@mui/material';
import { useNavigate, useLocation } from 'react-router-dom';
import { useEffect, useState, useRef } from 'react';
import marketStore from 'store/market';
import { categories, categoryTree } from 'api/template';
import { listGroupTemplateByCategory } from 'api/template/style';
import _ from 'lodash-es';
import 'react-horizontal-scrolling-menu/dist/styles.css';
import MarketTemplate from '../template/myTemplate/components/content/marketTemplate';
import jsCookie from 'js-cookie';
import { Row, Col, Spin } from 'antd';
import '../template/market/index.scss';

function StyleMarket() {
    const navigate = useNavigate();
    const location = useLocation();
    const searchParams = new URLSearchParams(location.search);
    const { categoryTrees, setCategoryTree } = marketStore();
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
        listGroupTemplateByCategory({ isHot: false }).then((res) => {
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
                    name: menuList?.find((item: any, index) => index === active)?.name,
                    appList: [...changeList],
                    code: 'OTHER',
                    parentCode: 'AMAZON',
                    icon: menuList?.find((item: any, index) => index === active)?.icon,
                    image: 'https://download.hotsalecloud.com/mofaai/images/category/amazon.jpg'
                });
                scrollRef.current.scrollTop = 0;
                setNewList(newData1);
            } else {
                const newData = _.cloneDeep(res);
                newData.forEach((item: any) => {
                    if (item.code !== 'HOT') {
                        item.appList = item.appList?.splice(0, 16);
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
                name: menuList?.find((item: any, index) => index === active)?.name,
                appList: [...changeList],
                code: 'OTHER',
                parentCode: 'AMAZON',
                icon: menuList?.find((item: any, index) => index === active)?.icon,
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
                    item.appList = item.appList?.splice(0, 16);
                }
            });
            setNewList(filterData);
        }
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
    const handleDetail = (data: any) => {
        if (data.type === 'MEDIA_MATRIX') {
            navigate(`/batchSmallRedBook?appUid=${data.uid}${data?.style?.uuid ? `&styleUid=${data?.style?.uuid}` : ''}`);
        } else {
            navigate(`/appMarketDetail/${data.uid}`);
        }
    };

    const scrollRef: any = useRef(null);

    const getImage = (active: string) => {
        let image;
        try {
            image = require('../../assets/images/category/' + active + '.svg');
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
                background: '#f4f6f8',
                borderRadius: '8px'
            }}
        >
            {newList?.length === 0 ? (
                <Spin className="w-full h-full flex justify-center items-center" />
            ) : (
                <>
                    <div className="pb-2 flex gap-3 w-full overflow-x-scroll">
                        {menuList?.map((item, index) => (
                            <div
                                onClick={() => {
                                    changeCategory(item, index);
                                }}
                                key={item.name}
                                className="h-[31px] px-3 py-1 cursor-pointer font-[600] bg-white shadow-md rounded-[6px] text-[rgb(75,74,88)] flex items-center gap-1 hover:!bg-[#2E2E3814]"
                                style={{
                                    background: active === index ? '#ede7f6' : '#fff'
                                }}
                            >
                                <img className="w-[20px] h-[20px]" src={getImage(item.icon)} />
                                <span className="whitespace-nowrap">{item.name}</span>
                            </div>
                        ))}
                    </div>
                    <div style={{ scrollbarGutter: 'stable' }} className="h-[calc(100%-36px)] overflow-x-hidden overflow-y-scroll">
                        {newList?.map((item, index) => (
                            <div key={index}>
                                {item.appList?.length > 0 && (
                                    <div className="flex justify-between items-center my-4">
                                        <div className="flex items-center gap-2">
                                            <img height="20px" src={getImage(item.icon)} alt="" />
                                            <span className="text-[20px] line-[25px] font-bold">{item.name}</span>
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
                                {item.appList.length > 0 && (
                                    <Row
                                        className="overflow-x-hidden pb-[5px]"
                                        style={{
                                            maxHeight: 'auto',
                                            overflowY: queryParams.category === 'ALL' ? 'hidden' : 'auto'
                                        }}
                                        gutter={[16, 16]}
                                        // wrap={queryParams.category === 'ALL' ? false : true}
                                    >
                                        {item.appList.map((el: any, i: number) => (
                                            <Col key={el?.uid + i} className={`xxxl-col flex-shrink-0`}>
                                                <MarketTemplate like="market" type="STYLE" handleDetail={handleDetail} data={el} />
                                            </Col>
                                        ))}
                                    </Row>
                                )}
                            </div>
                        ))}
                    </div>
                </>
            )}
        </Box>
    );
}
export default StyleMarket;
