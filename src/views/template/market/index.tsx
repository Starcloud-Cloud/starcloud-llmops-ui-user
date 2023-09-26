import SearchIcon from '@mui/icons-material/Search';
import {
    Box,
    FormControl,
    Grid,
    InputAdornment,
    InputLabel,
    MenuItem,
    Select,
    TextField,
    Typography,
    Modal,
    CardContent,
    Button
} from '@mui/material';
import AnimateButton from 'ui-component/extended/AnimateButton';
import { Outlet, useNavigate } from 'react-router-dom';
import { useEffect, useState, useRef } from 'react';

import { t } from 'hooks/web/useI18n';
import marketStore from 'store/market';
import ScrollMenus from './ScrollMenu';
import { useTheme } from '@mui/material/styles';
import MainCard from 'ui-component/cards/MainCard';
import { Formik } from 'formik';
import * as Yup from 'yup';

import { validateCode, sendCode } from 'api/login';
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
    //手机号绑定
    useEffect(() => {
        setPhoneOpen(true);
        setVCode('获取验证码');
        setVTime(59);
        timeRef.current = 60;
    }, []);
    const [phoneOpne, setPhoneOpen] = useState(false);
    const timer: any = useRef(null);
    const [vcodeOpen, setVCodeOpen] = useState(true);
    const [vcode, setVCode] = useState('获取验证码');
    const [vTime, setVTime] = useState(59);
    const timeRef: any = useRef(60);
    useEffect(() => {
        if (!vcodeOpen) {
            timer.current = setInterval(() => {
                if (timeRef.current === 0) {
                    setVCode('重新获取');
                    setVCodeOpen(true);
                    clearInterval(timer.current);
                    setVTime(60);
                    timeRef.current = 60;
                }
                setVTime(timeRef.current - 1);
                timeRef.current = timeRef.current - 1;
            }, 1000);
        }
    }, [vcodeOpen]);
    const getvCode = async (values: any, validateField: (data: any) => void) => {
        if (!/^1[3-9]\d{9}$/.test(values.phone)) {
            validateField('phone');
        } else {
            setVCodeOpen(false);
            const res = await sendCode({
                tool: 2,
                scene: 23,
                account: values.phone
            });
        }
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
            <Modal
                onClose={() => {
                    setPhoneOpen(false);
                }}
                open={phoneOpne}
                aria-labelledby="modal-title"
                aria-describedby="modal-description"
            >
                <MainCard
                    sx={{
                        position: 'absolute',
                        width: '300px',
                        top: '10%',
                        left: '50%',
                        transform: 'translate(-50%, 0)'
                    }}
                    headerSX={{ p: '16px !important' }}
                    contentSX={{ p: '16px !important' }}
                    title="绑定手机号"
                    content={false}
                >
                    <CardContent sx={{ p: '16px !important' }}>
                        <Formik
                            initialValues={{
                                phone: '',
                                vcode: ''
                            }}
                            validationSchema={Yup.object().shape({
                                phone: Yup.string()
                                    .required('手机号必填')
                                    .matches(/^1[3-9]\d{9}$/, '请输入有效的手机号'),
                                vcode: Yup.string().max(6, '验证码格式错误').required('请输入验证码')
                            })}
                            onSubmit={async (values, { setErrors, setStatus }) => {
                                //手机号绑定
                                const res = await validateCode({
                                    scene: 23,
                                    tool: 2,
                                    account: values.phone,
                                    code: values.vcode
                                });
                            }}
                        >
                            {({ errors, handleBlur, handleChange, validateField, handleSubmit, touched, values }) => (
                                <form noValidate onSubmit={handleSubmit}>
                                    <Grid container>
                                        <Grid item md={12}>
                                            <Typography variant="body1">为保障帐号安全，请完成手机号绑定</Typography>
                                        </Grid>
                                        <Grid item md={12}>
                                            <TextField
                                                fullWidth
                                                size="small"
                                                label="手机号"
                                                name="phone"
                                                type="text"
                                                value={values.phone}
                                                onBlur={handleBlur}
                                                onChange={handleChange}
                                                error={touched.phone && Boolean(errors.phone)}
                                                helperText={(touched.phone && errors.phone && String(errors.phone)) || ' '}
                                            />
                                        </Grid>
                                        <Grid item md={12}>
                                            <Box display="flex">
                                                <TextField
                                                    fullWidth
                                                    size="small"
                                                    label="验证码"
                                                    name="vcode"
                                                    error={touched.vcode && Boolean(errors.vcode)}
                                                    helperText={(touched.vcode && errors.vcode && String(errors.vcode)) || ' '}
                                                    value={values.vcode}
                                                    onBlur={handleBlur}
                                                    onChange={(e: any) => {
                                                        if (/^\d+$/.test(e.target.value) || e.target.value === '') {
                                                            handleChange(e);
                                                        }
                                                    }}
                                                />
                                                <Box mt="5px">
                                                    <Button
                                                        disabled={!vcodeOpen}
                                                        onClick={() => {
                                                            getvCode(values, validateField);
                                                        }}
                                                        size="small"
                                                        color="secondary"
                                                        variant="outlined"
                                                        sx={{ whiteSpace: 'nowrap', ml: 1, width: '90px' }}
                                                    >
                                                        {vcodeOpen ? vcode : vTime + 'S'}
                                                    </Button>
                                                </Box>
                                            </Box>
                                        </Grid>
                                        <Grid item md={12}>
                                            <Box sx={{ mt: 2 }}>
                                                <AnimateButton>
                                                    <Button
                                                        disableElevation
                                                        fullWidth
                                                        size="large"
                                                        variant="contained"
                                                        color="secondary"
                                                        type="submit"
                                                    >
                                                        绑定
                                                    </Button>
                                                </AnimateButton>
                                            </Box>
                                        </Grid>
                                    </Grid>
                                </form>
                            )}
                        </Formik>
                    </CardContent>
                </MainCard>
            </Modal>
        </Box>
    );
}
export default TemplateMarket;
