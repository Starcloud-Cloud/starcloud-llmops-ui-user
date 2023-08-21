import React, { useEffect, useState } from 'react';

// material-ui
import {
    Button,
    Dialog,
    DialogContent,
    DialogContentText,
    DialogTitle,
    Divider,
    Grid,
    List,
    ListItem,
    ListItemIcon,
    ListItemText,
    OutlinedInput,
    Typography
} from '@mui/material';
import { useTheme } from '@mui/material/styles';
import { Popover, Radio, Tag, Button as AntButton } from 'antd';
import KeyboardBackspaceIcon from '@mui/icons-material/KeyboardBackspace';
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';

// project imports
import { gridSpacing } from 'store/constant';
import MainCard from 'ui-component/cards/MainCard';

// assets
import AirportShuttleTwoToneIcon from '@mui/icons-material/AirportShuttleTwoTone';
import CheckTwoToneIcon from '@mui/icons-material/CheckTwoTone';
import DirectionsBoatTwoToneIcon from '@mui/icons-material/DirectionsBoatTwoTone';
import TwoWheelerTwoToneIcon from '@mui/icons-material/TwoWheelerTwoTone';
import { HeaderWrapper } from '../landing';
import { VipBar } from './VipBar';
// import PeopleSection from './PeopleSection'
import type { RadioChangeEvent } from 'antd';
import { createOrder, getOrderIsPay } from 'api/vip';
import useAuth from 'hooks/useAuth';
import { useNavigate } from 'react-router-dom';
import { submitOrder } from '../../../api/vip/index';
import FooterSection from '../landing/FooterSection';
import { SectionWrapper } from '../landing/index';
import { PayModal } from './PayModal';
import workWechatPay from 'assets/images/landing/work_wechat_pay.png';
import { Swiper, SwiperSlide } from 'swiper/react';
import HorizontalRuleIcon from '@mui/icons-material/HorizontalRule';

import 'swiper/css';
import 'swiper/css/pagination';
import AddIcon from '@mui/icons-material/Add';
import copy from 'clipboard-copy';

const recommendList = [
    {
        title: '跨境人'
    },
    {
        title: '跨境人'
    },
    {
        title: '跨境人'
    },
    { title: '跨境人' }
];

const plansDefault = [
    {
        active: false,
        icon: <TwoWheelerTwoToneIcon fontSize="large" color="inherit" />,
        title: '免费版',
        description: '无需信用卡，每天签到获取字数/图片使用数',
        monthPrice: '免费',
        yearPrice: '免费',
        permission: [0, 1, 2, 4],
        btnText: '免费使用'
    },
    {
        active: true,
        icon: <TwoWheelerTwoToneIcon fontSize="large" color="inherit" />,
        title: '高级版',
        description: '200000字数创作，400张图片',
        monthPrice: 99,
        yearPrice: 999,
        permission: [0, 1, 2, 3, 4, 5, 6],
        btnText: '立即购买',
        monthCode: 'plus_month',
        yearCode: 'plus_year'
    },
    {
        active: false,
        icon: <AirportShuttleTwoToneIcon fontSize="large" />,
        title: '团队版',
        description: '6个账号，无限字数创作，1000张图片',
        monthPrice: 499,
        yearPrice: 4999,
        permission: [0, 1, 2, 3, 4, 5, 6],
        btnText: '立即购买',
        monthCode: 'pro_month',
        yearCode: 'pro_year',
        count: 5
    },
    {
        active: false,
        icon: <DirectionsBoatTwoToneIcon fontSize="large" />,
        title: '企业版',
        description: '拥有企业个性化的AI模型和系统',
        price: '专属顾问',
        monthPrice: '专属顾问',
        yearPrice: '专属顾问',
        permission: [0, 1, 2, 3, 4, 5],
        btnText: '扫码咨询'
    }
];

const planList = [
    [
        '签到每天可免费', // 0
        '签到可免费获取图片2张', // 1
        'GPT-3.5', // 2
        'GPT-4', // 3
        '4个自定义应用', // 4
        'Baidu/Google/Amazon联网查询', // 5
        '上传信息库/文档问答' // 6
    ],
    [
        '200000字数生成', // 0
        '生成图片400张', // 1
        'GPT-3.5', // 2
        'GPT-4', // 3
        '无限自定义应用数量', // 4
        'Baidu/Google/Amazon联网查询', // 5
        '上传信息库/文档问答' // 6
    ],
    [
        '无限字数生成', // 0
        '生成图片1000张', // 1
        'GPT-3.5', // 2
        'GPT-4', // 3
        '无限自定义应用数量', // 4
        'Baidu/Google/Amazon联网查询', // 5
        '上传信息库/文档问答' // 6
    ],
    [
        '模型定制，打造符合企业特定需求（如文风、规则）的AI生成系统', // 0
        '企业可以用API方式接入MoFaAI能力，将AI嵌入现有系统', // 1
        '私有的企业知识库存储空间', // 2
        '按需提供企业所需的数据接入和发布方式', // 3
        '定制化的联网查询/企业数据查询', // 4
        '个性化域名' // 6
    ]
];

// ===============================|| PRICING - PRICE 1 ||=============================== //

let interval: any;

const Price1 = () => {
    const navigate = useNavigate();
    const { isLoggedIn } = useAuth();
    const theme = useTheme();

    const [openDialog, setOpenDialog] = useState(false);
    const [openPayDialog, setOpenPayDialog] = useState(false);
    const [swiperRef, setSwiperRef] = useState<any>(null);
    const [plans, setPlans] = useState(plansDefault);

    const priceListDisable = {
        opacity: '0.4',
        '& >div> svg': {
            fill: theme.palette.secondary.light
        }
    };

    // 从服务端请求vip数据
    // useEffect(() => {
    //     getVipList().then((res) => {
    //         if (res.code === 0) {
    //         }
    //     });
    // }, []);

    const [value, setValue] = useState('1');

    const [open, setOpen] = React.useState(false);

    const [payUrl, setPayUrl] = useState('');

    const [isTimeout, setIsTimeout] = useState(false);

    const [orderId, setOrderId] = useState('');

    const handleOpen = () => {
        setOpen(true);
    };

    const handleClose = () => {
        setPayUrl('');
        setOpen(false);
        clearInterval(interval);
    };

    useEffect(() => {
        return () => {
            clearInterval(interval);
        };
    }, []);

    const onChange = (e: RadioChangeEvent) => {
        setValue(e.target.value);
    };

    const onRefresh = async () => {
        const resOrder = await submitOrder({
            orderId,
            channelCode: 'alipay_pc',
            channelExtras: { qr_pay_mode: '4', qr_code_width: 250 },
            displayMode: 'qr_code'
        });
        setPayUrl(resOrder.displayContent);
        setIsTimeout(false);
        interval = setInterval(() => {
            getOrderIsPay({ orderId }).then((isPayRes) => {
                if (isPayRes) {
                    handleClose();
                    setOpenPayDialog(true);
                    setTimeout(() => {
                        navigate('/orderRecord');
                    }, 3000);
                }
            });
        }, 1000);

        setTimeout(() => {
            clearInterval(interval);
            setIsTimeout(true);
        }, 5 * 60 * 1000);
    };

    const handleCreateOrder = async (code?: string) => {
        if (!isLoggedIn) {
            setOpenDialog(true);
            setTimeout(() => {
                navigate('/login');
            }, 3000);
        } else {
            try {
                const options = Intl.DateTimeFormat().resolvedOptions();
                const timeZone = options.timeZone;
                handleOpen();
                const res = await createOrder({ productCode: code, timestamp: new Date().getTime(), timeZone });
                setOrderId(res);
                const resOrder = await submitOrder({
                    orderId: res,
                    channelCode: 'alipay_pc',
                    channelExtras: { qr_pay_mode: '4', qr_code_width: 250 },
                    displayMode: 'qr_code'
                });
                setPayUrl(resOrder.displayContent);

                interval = setInterval(() => {
                    getOrderIsPay({ orderId: res }).then((isPayRes) => {
                        if (isPayRes) {
                            handleClose();
                            setOpenPayDialog(true);
                            setTimeout(() => {
                                navigate('/orderRecord');
                            }, 3000);
                        }
                    });
                }, 1000);

                setTimeout(() => {
                    clearInterval(interval);
                    setIsTimeout(true);
                }, 5 * 60 * 1000);
            } catch (e) {
                const TEXT_MESSAGE = '登录超时,请重新登录!';
                if (e === TEXT_MESSAGE) {
                    setOpenDialog(true);
                    setTimeout(() => {
                        navigate('/login');
                    }, 3000);
                } else {
                    PubSub.publish('global.error', { message: e as string, type: 'error' });
                }
            }
        }
    };

    const handleClick = (index: number, code?: string) => {
        switch (index) {
            case 0:
                return navigate('/exchange');
            case 1:
                return handleCreateOrder(code);
            case 2:
                return handleCreateOrder(code);
            case 3:
                return;
        }
    };

    console.log(openPayDialog, 'openPayDialog');
    return (
        <div>
            <HeaderWrapper id="vip">
                <VipBar />
            </HeaderWrapper>
            <div className="flex w-full bg-[#f4f6f8] mt-[100px] pt-10 pb-10 justify-center">
                <div className="w-4/5">
                    <div className="flex justify-center mb-10 xs:text-2xl md:text-5xl">立即订阅，创作无限可能！</div>
                    <div className="flex justify-center mb-10">
                        <Radio.Group onChange={onChange} buttonStyle="solid" size="large" value={value}>
                            <Radio.Button value="1" style={{ width: '150px', textAlign: 'center' }}>
                                月付
                            </Radio.Button>
                            <Radio.Button value="2" style={{ width: '150px', textAlign: 'center' }}>
                                年付 <Tag color="#f50">8折</Tag>
                            </Radio.Button>
                        </Radio.Group>
                    </div>
                    <Grid container spacing={gridSpacing}>
                        {plans.map((plan, index) => {
                            const darkBorder =
                                theme.palette.mode === 'dark' ? theme.palette.background.default : theme.palette.primary[200] + 75;
                            return (
                                <Grid item xs={12} sm={6} md={3} key={index}>
                                    <MainCard
                                        boxShadow
                                        sx={{
                                            pt: 1.75,
                                            border: plan.active ? '2px solid' : '1px solid',
                                            borderColor: plan.active ? 'secondary.main' : darkBorder
                                        }}
                                    >
                                        <Grid container textAlign="center" spacing={gridSpacing}>
                                            {/* <Grid item xs={12}>
                                                <Box
                                                    sx={{
                                                        display: 'inline-flex',
                                                        alignItems: 'center',
                                                        justifyContent: 'center',
                                                        borderRadius: '50%',
                                                        width: 80,
                                                        height: 80,
                                                        background:
                                                            theme.palette.mode === 'dark'
                                                                ? theme.palette.dark[800]
                                                                : theme.palette.primary.light,
                                                        color: theme.palette.primary.main,
                                                        '& > svg': {
                                                            width: 35,
                                                            height: 35
                                                        }
                                                    }}
                                                >
                                                    {plan.icon}
                                                </Box>
                                            </Grid> */}
                                            <Grid item xs={12}>
                                                <Typography
                                                    variant="h6"
                                                    sx={{
                                                        fontSize: '1.5625rem',
                                                        fontWeight: 500,
                                                        position: 'relative',
                                                        mb: 1.875,
                                                        '&:after': {
                                                            content: '""',
                                                            position: 'absolute',
                                                            bottom: -15,
                                                            left: 'calc(50% - 25px)',
                                                            width: 50,
                                                            height: 4,
                                                            background: theme.palette.primary.main,
                                                            borderRadius: '3px'
                                                        }
                                                    }}
                                                >
                                                    {plan.title}
                                                </Typography>
                                            </Grid>
                                            <Grid item xs={12}>
                                                <Typography variant="body2">{plan.description}</Typography>
                                            </Grid>
                                            {index === 2 && (
                                                <Grid xs={12}>
                                                    <div className="flex justify-center items-center">
                                                        <AntButton
                                                            type="primary"
                                                            icon={<HorizontalRuleIcon />}
                                                            onClick={() => {
                                                                const copyPlans = [...plans];
                                                                if (copyPlans[index].count === 5) return;
                                                                copyPlans[index].count = (plan.count || 0) - 1;
                                                                setPlans(copyPlans);
                                                            }}
                                                        />
                                                        <OutlinedInput
                                                            className="mx-2"
                                                            placeholder="Please enter text"
                                                            size={'small'}
                                                            type={'number'}
                                                            value={plan.count}
                                                            onChange={(e) => {
                                                                const copyPlans = [...plans];
                                                                copyPlans[index].count = Number(e.target.value);
                                                                setPlans(copyPlans);
                                                            }}
                                                        />
                                                        <AntButton
                                                            type="primary"
                                                            icon={<AddIcon />}
                                                            onClick={() => {
                                                                const copyPlans = [...plans];
                                                                copyPlans[index].count = (plan.count || 0) + 1;
                                                                setPlans(copyPlans);
                                                            }}
                                                        />
                                                    </div>
                                                </Grid>
                                            )}
                                            <Grid item xs={12}>
                                                <Typography
                                                    component="div"
                                                    variant="body2"
                                                    sx={{
                                                        fontSize: '2.1875rem',
                                                        fontWeight: 700,
                                                        '& > span': {
                                                            fontSize: '1.25rem',
                                                            fontWeight: 500
                                                        }
                                                    }}
                                                >
                                                    {(index === 1 || index === 2) && <span>￥</span>}
                                                    {value === '1' ? plan.monthPrice : plan.yearPrice}
                                                    {(index === 1 || index === 2) && <span>/{value === '1' ? '月' : '年'}</span>}
                                                </Typography>
                                            </Grid>
                                            <Grid item xs={12}>
                                                {index === 3 ? (
                                                    <Popover
                                                        content={
                                                            <div className="flex justify-start items-center flex-col">
                                                                <img className="w-40" src={workWechatPay} alt="" />
                                                                <div className="text-sm">微信扫码咨询</div>
                                                            </div>
                                                        }
                                                        trigger="hover"
                                                    >
                                                        <Button
                                                            className={'w-4/5'}
                                                            variant="outlined"
                                                            onClick={() => handleClick(index)}
                                                            color="secondary"
                                                        >
                                                            {plan.btnText}
                                                        </Button>
                                                    </Popover>
                                                ) : (
                                                    <Button
                                                        className={'w-4/5'}
                                                        variant={plan.active ? 'contained' : 'outlined'}
                                                        onClick={() => handleClick(index, value === '1' ? plan.monthCode : plan.yearCode)}
                                                        color="secondary"
                                                    >
                                                        {plan.btnText}
                                                    </Button>
                                                )}
                                            </Grid>
                                            <Grid item xs={12}>
                                                <List
                                                    sx={{
                                                        m: 0,
                                                        p: 0,
                                                        '&> li': {
                                                            px: 0,
                                                            py: 0.625,
                                                            '& svg': {
                                                                fill: theme.palette.success.dark
                                                            }
                                                        }
                                                    }}
                                                    component="ul"
                                                >
                                                    {planList[index].map((list, i) => (
                                                        <React.Fragment key={i}>
                                                            <ListItem sx={!plan.permission.includes(i) ? priceListDisable : {}}>
                                                                <ListItemIcon>
                                                                    <CheckTwoToneIcon sx={{ fontSize: '1.3rem' }} />
                                                                </ListItemIcon>
                                                                <ListItemText primary={list} />
                                                            </ListItem>
                                                            <Divider />
                                                        </React.Fragment>
                                                    ))}
                                                </List>
                                            </Grid>
                                        </Grid>
                                    </MainCard>
                                </Grid>
                            );
                        })}
                    </Grid>
                    <div className="flex justify-center text-xs mt-10">注：如之前已购买权益并在有效期内的，将自动升级到新权益</div>
                    <div>
                        <div className="text-2xl font-semibold w-full text-center my-[20px]">跨境人和团队选择 mofaai</div>
                        <div className="flex justify-end">
                            <AntButton
                                icon={<KeyboardBackspaceIcon className="text-white" />}
                                type="primary"
                                shape="circle"
                                onClick={() => {
                                    swiperRef?.slidePrev();
                                }}
                            />
                            <AntButton
                                style={{ marginLeft: '10px' }}
                                icon={<ArrowForwardIcon className="text-white" />}
                                type="primary"
                                shape="circle"
                                onClick={() => {
                                    swiperRef?.slideNext();
                                }}
                            />
                        </div>
                        <div className="mt-[20px]">
                            <Swiper
                                onSwiper={(swiper) => setSwiperRef(swiper)}
                                slidesPerView={4}
                                spaceBetween={30}
                                centeredSlides={true}
                                loop
                                modules={[]}
                                className="mySwiper"
                                autoplay
                            >
                                <SwiperSlide>
                                    <div className="!bg-white rounded-2xl p-5 space-y-2.5 border border-neutral-100">
                                        <div className="flex items-center gap-2">
                                            <div>
                                                <img src="/assets/avatar-pricing-case-8-01b15496.png" className="rounded-full w-9 h-9" />
                                            </div>
                                            <div className="text-xs font-semibold">某精铺大卖CEO</div>
                                        </div>
                                        <div className="font-semibold leading-7">
                                            “kua.ai 在选品方面跟传统选品工具是不一样的，传统选品是BI,
                                            是纯粹的数据逻辑。AI则更多能贡献欧美当地的风土人情，用户习惯，习俗禁忌，更像是一个
                                            <span className="text-violet-500">选品顾问</span>。kua.ai的一些选品功能我用过，还是能
                                            <span className="text-carnation">拓宽思路</span>，很多
                                            <span className="text-carnation">小众品选</span>
                                            出来我们也觉得脑洞大开。有尝试乃至开模的价值的。”
                                        </div>
                                    </div>
                                </SwiperSlide>
                                <SwiperSlide>Slide 2</SwiperSlide>
                                <SwiperSlide>Slide 3</SwiperSlide>
                                <SwiperSlide>Slide 4</SwiperSlide>
                                <SwiperSlide>Slide 5</SwiperSlide>
                                <SwiperSlide>Slide 6</SwiperSlide>
                                <SwiperSlide>Slide 7</SwiperSlide>
                                <SwiperSlide>Slide 8</SwiperSlide>
                                <SwiperSlide>Slide 9</SwiperSlide>
                            </Swiper>
                        </div>
                    </div>
                </div>
            </div>
            <SectionWrapper sx={{ bgcolor: theme.palette.mode === 'dark' ? 'background.default' : 'dark.900', pb: 0 }}>
                <FooterSection />
            </SectionWrapper>
            <PayModal open={open} handleClose={() => handleClose()} url={payUrl} isTimeout={isTimeout} onRefresh={onRefresh} />
            {/* <Record open={openRecord} handleClose={handleCloseRecord} /> */}
            <Dialog
                open={openDialog}
                onClose={handleClose}
                aria-labelledby="alert-dialog-title"
                aria-describedby="alert-dialog-description"
                sx={{ p: 2 }}
            >
                {openDialog && (
                    <>
                        <DialogTitle id="alert-dialog-title">提示</DialogTitle>
                        <DialogContent>
                            <DialogContentText id="alert-dialog-description">
                                <Typography variant="h5" component="span">
                                    当前用户未登录，3S后跳转至登录页...
                                </Typography>
                            </DialogContentText>
                        </DialogContent>
                    </>
                )}
            </Dialog>
            <Dialog
                open={openPayDialog}
                onClose={() => setOpenPayDialog(false)}
                aria-labelledby="alert-dialog-title"
                aria-describedby="alert-dialog-description"
                sx={{ p: 2 }}
            >
                {openPayDialog && (
                    <>
                        <DialogTitle id="alert-dialog-title">提示</DialogTitle>
                        <DialogContent>
                            <DialogContentText id="alert-dialog-description">
                                <Typography variant="h5" component="span">
                                    支付成功，3S后跳转至订单记录页...
                                </Typography>
                            </DialogContentText>
                        </DialogContent>
                    </>
                )}
            </Dialog>
        </div>
    );
};

export default Price1;
