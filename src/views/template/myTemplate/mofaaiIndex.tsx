import { Box, Pagination, TextField, Typography, Button } from '@mui/material';
import { TreeSelect, Row, Col, Modal } from 'antd';
import Template from './components/content/template';
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
    const location = useLocation();
    const searchParams = new URLSearchParams(location.search);
    const [recommendList, setRecommends] = useState([]);
    const [appList, setAppList] = useState<any[]>([]);
    const [newAppList, setNewApp] = useState<any[]>([]);
    const [pageQuery, setPageQuery] = useState({
        pageNo: 1,
        pageSize: 20
    });
    const [cateTree, setCateTree] = useState<any[]>([]);
    const categoryList = marketStore((state) => state.categoryList);
    const [queryParams, setQueryParams] = useState<{ name: string; categories: string; tags: (string | null)[] }>({
        name: '',
        categories: '',
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
    const paginationChange = (event: any, value: number) => {
        setPageQuery({
            ...pageQuery,
            pageNo: value
        });
        setNewApp(appList.slice((value - 1) * pageQuery.pageSize, (value - 1) * pageQuery.pageSize + pageQuery.pageSize));
    };
    const [botOpen, setBotOpen] = useState(false);
    const allDetail = useAllDetail();
    const { user } = useUserStore();
    //弹窗
    const [open, setOpen] = useState(false);
    const [appNameOpen, setAppNameOpen] = useState(false);
    const [appName, setAppName] = useState('');
    const [saveDetail, setSaveDetail] = useState<any>(null);
    const handleDetail = (data: { uid: string }) => {
        if (
            allDetail?.allDetail?.levels[0]?.levelConfigDTO?.usableApp === -1 ||
            totalList.filter((item) => Number(item.creator) === user.id).length < allDetail?.allDetail?.levels[0]?.levelConfigDTO?.usableApp
        ) {
            getRecommendApp({ recommend: data.uid as string }).then((res) => {
                setSaveDetail(res);
                setOpen(true);
            });
        } else if (
            totalList.filter((item) => Number(item.creator) === user.id).length >=
            allDetail?.allDetail?.levels[0]?.levelConfigDTO?.usableApp
        ) {
            setBotOpen(true);
        }
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
            <Row className="mt-4" gutter={[16, 16]}>
                <Col span={6}>
                    <TextField
                        color="secondary"
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
                </Col>
                <Col span={6}>
                    <div className="myApp relative w-full">
                        <TreeSelect
                            placeholder="请选择类目"
                            className="bg-[#f8fafc]  h-[51px] border border-solid border-[#697586ad] rounded-[6px] antdSel"
                            showSearch
                            style={{
                                width: '100%'
                            }}
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
                                clearTimeout(timeoutRef.current);
                                timeoutRef.current = setTimeout(() => {
                                    query({ name: 'categories', value: data });
                                }, 200);
                            }}
                            onClear={() => {
                                setQueryParams({
                                    ...queryParams,
                                    categories: ''
                                });
                                clearTimeout(timeoutRef.current);
                                timeoutRef.current = setTimeout(() => {
                                    query({ name: 'categories', value: '' });
                                }, 200);
                            }}
                            fieldNames={{
                                label: 'name',
                                value: 'code'
                            }}
                            treeData={cateTree}
                        />
                        <span className=" block bg-gradient-to-b from-[#F4F6F8] to-[#f8fafc] px-[5px] absolute top-[-7px] left-5 text-[12px] text-[#697586]">
                            类目
                        </span>
                    </div>
                </Col>
            </Row>
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
            {botOpen && (
                <UpgradeModel
                    open={botOpen}
                    handleClose={() => setBotOpen(false)}
                    title={`添加应用个数(${allDetail?.allDetail?.levels[0]?.levelConfigDTO?.usableApp})已用完`}
                    from={'usableApp_0'}
                />
            )}
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
                                    anchorOrigin: { vertical: 'top', horizontal: 'center' },
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
