import { Box, Pagination, TextField, Typography, Button } from '@mui/material';
import { TreeSelect, Row, Col, Modal, Input, Select } from 'antd';
import MarketTemplate from './components/content/marketTemplate';
import MyselfTemplate from './components/content/mySelfTemplate';
import { UpgradeModel } from 'views/template/myChat/components/upgradeRobotModel';

import { recommends, appPage, categoryTree } from 'api/template/index';

import { useState, useRef, useEffect, useContext } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { dispatch } from 'store';
import { openSnackbar } from 'store/slices/snackbar';

import KeyboardArrowLeftIcon from '@mui/icons-material/KeyboardArrowLeft';
import KeyboardArrowRightIcon from '@mui/icons-material/KeyboardArrowRight';

import { ScrollMenu, VisibilityContext } from 'react-horizontal-scrolling-menu';
import 'react-horizontal-scrolling-menu/dist/styles.css';
import marketStore from 'store/market';
import myApp from 'store/myApp';
import { Item } from 'types/template';
import { t } from 'hooks/web/useI18n';
import { useAllDetail } from 'contexts/JWTContext';
import useUserStore from 'store/user';
import _ from 'lodash-es';
import './index.css';
import { getRecommendApp, appCreate } from 'api/template/index';
import { ENUM_TENANT, getTenant } from 'utils/permission';
import jsCookie from 'js-cookie';
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
    const navigate = useNavigate();
    const { Option } = Select;
    const [recommendList, setRecommends] = useState([]);
    const [appList, setAppList] = useState<any[]>([]);
    const [newAppList, setNewApp] = useState<any[]>([]);
    const [pageQuery, setPageQuery] = useState({
        pageNo: 1,
        pageSize: 20
    });
    const [cateTree, setCateTree] = useState<any[]>([]);
    const categoryList = marketStore((state) => state.categoryList);
    const [queryParams, setQueryParams] = useState<any>({
        name: '',
        categories: '',
        tags: [],
        searchSel: 'all'
    });
    const { totals, totalList, setTotals, setTotalList } = myApp();
    const query = () => {
        const newValue: any = _.cloneDeep(queryParams);
        const setValue = totalList.filter((item) => {
            let nameMatch = true;
            let topicMatch = true;
            let tagMatch = true;
            let searchSel = true;
            if (newValue.name) {
                nameMatch = item.name.toLowerCase().includes(newValue.name.toLowerCase());
            }
            if (newValue.searchSel !== 'all' && allDetail?.allDetail?.id?.toString() !== item.creator) {
                searchSel = false;
            }
            if (newValue.categories) {
                if (item.category) {
                    topicMatch = item.category === newValue.categories;
                    // newValue.categories.some((topic) => item.categories.includes(topic));
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
            return nameMatch && topicMatch && tagMatch && searchSel;
        });
        setAppList(setValue);
        setTotals(setValue.length);
        setNewApp(setValue.slice(0, pageQuery.pageSize));
    };
    useEffect(() => {
        timeoutRef.current = setTimeout(() => {
            query();
        }, 200);
    }, [queryParams]);
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
        //类别树
        categoryTree().then((res) => {
            const newData = _.cloneDeep(res);
            if (getTenant() === ENUM_TENANT.AI) {
                newData.forEach((item: any) => {
                    item.disabled = true;
                });
            }
            setCateTree(newData);
        });
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);
    const [botOpen, setBotOpen] = useState(false);
    const allDetail = useAllDetail();
    //弹窗
    const [open, setOpen] = useState(false);
    const [appNameOpen, setAppNameOpen] = useState(false);
    const [appName, setAppName] = useState('');
    const [saveDetail, setSaveDetail] = useState<any>(null);
    const handleDetail = (data: { uid: string }) => {
        // if (
        //     allDetail?.allDetail?.levels[0]?.levelConfigDTO?.usableApp === -1 ||
        //     totalList.filter((item) => Number(item.creator) === user.id).length < allDetail?.allDetail?.levels[0]?.levelConfigDTO?.usableApp
        // ) {
        getRecommendApp({ recommend: data.uid as string }).then((res) => {
            setSaveDetail(res);
            setOpen(true);
        });
        // }
        //  else if (
        //     totalList.filter((item) => Number(item.creator) === user.id).length >=
        //     allDetail?.allDetail?.levels[0]?.levelConfigDTO?.usableApp
        // ) {
        //     setBotOpen(true);
        // }
    };
    const timeoutRef = useRef<any>();
    return (
        <Box
            style={{
                padding: jsCookie.get('isClient') ? '16px' : 0,
                borderRadius: '16px',
                overflow: 'hidden'
            }}
        >
            <Box display="flex" alignItems="end" mt={2} mb={2}>
                <Typography variant="h3">{t('apply.recommend')}</Typography>
                <Typography fontSize="12px" ml={1}>
                    {t('apply.AppDesc')}
                    <span
                        className="cursor-pointer text-[#673AB7]"
                        onClick={() =>
                            window.open('https://alidocs.dingtalk.com/i/p/a0gX1nnO4R7ONmeJ/docs/m9bN7RYPWdRDbn2kimo9o77RJZd1wyK0')
                        }
                    >
                        【如何创建应用】
                    </span>
                </Typography>
            </Box>
            <div className="grid gap-4 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5 3xl:grid-cols-6 4xl:grid-cols-7 5xl:grid-cols-8">
                {recommendList.map((el: any, index: number) => (
                    <MarketTemplate type="APP" scene="template" key={el?.uid} handleDetail={handleDetail} data={el} />
                ))}
            </div>
            {botOpen && (
                <UpgradeModel
                    open={botOpen}
                    handleClose={() => setBotOpen(false)}
                    title={`添加应用个数(${allDetail?.allDetail?.levels[0]?.levelConfigDTO?.usableApp})已用完`}
                    from={'usableApp_0'}
                />
            )}
            <Box>
                <div className="flex justify-between items-center">
                    <div className="text-lg font-bold mt-8 mb-4">我的应用</div>
                    <div className="flex items-center">
                        <div className="text-xs whitespace-nowrap">应用名称：</div>
                        <Input
                            className="w-[150px] bg-white"
                            value={queryParams.name}
                            onChange={(e) => {
                                setQueryParams({
                                    ...queryParams,
                                    name: e.target.value
                                });
                                clearTimeout(timeoutRef.current);
                            }}
                        />
                        <div className="text-xs whitespace-nowrap ml-2">类目：</div>
                        <TreeSelect
                            className="w-[150px] mr-2"
                            placeholder="请选择类目"
                            showSearch
                            value={queryParams?.categories}
                            dropdownStyle={{ maxHeight: 600, overflow: 'auto' }}
                            allowClear
                            treeCheckable={false}
                            treeDefaultExpandAll
                            onChange={(data: string) => {
                                setQueryParams({
                                    ...queryParams,
                                    categories: data
                                });
                            }}
                            onClear={() => {
                                setQueryParams({
                                    ...queryParams,
                                    categories: ''
                                });
                            }}
                            fieldNames={{
                                label: 'name',
                                value: 'code'
                            }}
                            treeData={cateTree}
                        />
                        <Select
                            className="w-[150px]"
                            value={queryParams.searchSel}
                            onChange={(data) => {
                                setQueryParams({
                                    ...queryParams,
                                    searchSel: data
                                });
                            }}
                        >
                            <Option value="all">所有人</Option>
                            <Option value="myself">由我创建</Option>
                        </Select>
                    </div>
                </div>
                <div className="grid gap-4 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5 3xl:grid-cols-6 4xl:grid-cols-7 5xl:grid-cols-8 pb-4">
                    {appList.map((el: any, index: number) => (
                        <MarketTemplate
                            type="APP"
                            key={el?.uid}
                            handleDetail={({ uid }: { uid: string }) => {
                                navigate('/createApp?uid=' + uid);
                            }}
                            data={el}
                        />
                    ))}
                </div>
            </Box>
            <Modal
                title="创建应用"
                open={open}
                onCancel={() => setOpen(false)}
                onOk={() => {
                    if (!appName) {
                        setAppNameOpen(true);
                        return false;
                    }
                    appCreate({
                        ...saveDetail,
                        name: appName
                    }).then((res) => {
                        if (res.data) {
                            navigate('/createApp?uid=' + res.data.uid);
                            dispatch(
                                openSnackbar({
                                    open: true,
                                    message: t('market.create'),
                                    variant: 'alert',
                                    alert: {
                                        color: 'success'
                                    },
                                    close: false
                                })
                            );
                        }
                    });
                }}
            >
                <TextField
                    color="secondary"
                    label="应用名称"
                    placeholder="请输入需要创建的应用名称"
                    onChange={(e) => {
                        setAppNameOpen(true);
                        setAppName(e.target.value);
                    }}
                    error={!appName && appNameOpen ? true : false}
                    helperText={!appName && appNameOpen ? '应用名称不能为空' : ''}
                    value={appName}
                    InputLabelProps={{ shrink: true }}
                    fullWidth
                />
            </Modal>
        </Box>
    );
}
export default MyTemplate;
