import React, { useState } from 'react';

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
    Typography
} from '@mui/material';
import { useTheme } from '@mui/material/styles';
import { Popover, Radio, Tag } from 'antd';

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
import { createOrder } from 'api/vip';
import useAuth from 'hooks/useAuth';
import { useNavigate } from 'react-router-dom';
import { submitOrder } from '../../../api/vip/index';
import FooterSection from '../landing/FooterSection';
import { SectionWrapper } from '../landing/index';
import { PayModal } from './PayModal';

const plans = [
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
        yearCode: 'pro_year'
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
const Price1 = () => {
    const navigate = useNavigate();
    const { isLoggedIn } = useAuth();
    const theme = useTheme();

    const [openDialog, setOpenDialog] = useState(false);

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

    const handleOpen = () => {
        setOpen(true);
    };

    const handleClose = () => {
        setOpen(false);
    };

    const onChange = (e: RadioChangeEvent) => {
        setValue(e.target.value);
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
                const res = await createOrder({ productCode: code, timestamp: new Date().getTime(), timeZone });
                const resOrder = await submitOrder({
                    id: res,
                    channelCode: 'alipay_pc',
                    channelExtras: { qr_pay_mode: '4', qr_code_width: 100 },
                    displayMode: 'qr_code'
                });
                setPayUrl(resOrder.displayContent);
                handleOpen();
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
                return navigate('/dashboard/default');
            case 1:
                return handleCreateOrder(code);
            case 2:
                return handleCreateOrder(code);
            case 3:
                return;
        }
    };

    return (
        <div>
            <HeaderWrapper id="vip">
                <VipBar />
            </HeaderWrapper>
            <div className="flex w-full bg-[#f4f6f8] mt-[100px] pt-10 pb-10 justify-center">
                <div className="w-4/5">
                    <div className="flex justify-center mb-10 text-5xl">立即订阅，创作无限可能！</div>
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
                                                                <img
                                                                    className="w-40"
                                                                    src={'/static/media/wechat.707dac08a28c8844005e.png'}
                                                                    alt=""
                                                                />
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
                </div>
            </div>
            <SectionWrapper sx={{ bgcolor: theme.palette.mode === 'dark' ? 'background.default' : 'dark.900', pb: 0 }}>
                <FooterSection />
            </SectionWrapper>
            <PayModal open={open} handleClose={() => handleClose()} url={payUrl} />
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
        </div>
    );
};

export default Price1;
