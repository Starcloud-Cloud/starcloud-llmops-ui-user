import React, { useCallback, useEffect, useState } from 'react';

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
    Tooltip,
    Typography
} from '@mui/material';
import { useTheme } from '@mui/material/styles';
import { Popover, Radio, Tag, Button as AntButton, Descriptions } from 'antd';

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
import {
    createOrder,
    getOrderIsPay,
    getPrice,
    createSign,
    submitSign,
    getIsSignV2,
    discountNewUser,
    getPayType,
    getPayList,
    getNewUserProduct,
    getSignPrice,
    createSignV2,
    submitSignV2
} from 'api/vip';
import useAuth from 'hooks/useAuth';
import { useLocation, useNavigate } from 'react-router-dom';
import { submitOrder } from '../../../api/vip/index';
import FooterSection from '../landing/FooterSection';
import { SectionWrapper } from '../landing/index';
import { PayModal } from './PayModal';
import workWechatPay from 'assets/images/landing/work_wechat_pay.png';
import { Swiper, SwiperSlide } from 'swiper/react';
import 'swiper/css';
import 'swiper/css/pagination';
import KeyboardBackspaceIcon from '@mui/icons-material/KeyboardBackspace';
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';
import people1 from 'assets/images/pay/people1.png';
import people2 from 'assets/images/pay/people2.png';
import people3 from 'assets/images/pay/people3.png';
import people4 from 'assets/images/pay/people4.png';
import people5 from 'assets/images/pay/people5.png';
import people6 from 'assets/images/pay/people6.png';
import people7 from 'assets/images/pay/people7.png';
import people8 from 'assets/images/pay/people8.png';
import { useWindowSize } from 'hooks/useWindowSize';
import { PlayArrow } from '@mui/icons-material';
import HelpOutlineIcon from '@mui/icons-material/HelpOutline';
import { DiscountModal } from './discountModal';
import { dispatch } from 'store';
import { openSnackbar } from 'store/slices/snackbar';
import { SignModal } from './SignModal';
import { ENUM_PERMISSION, getPermission } from 'utils/permission';

const recommendList = [
    {
        avatar: people1,
        title: '某独立站运营主管',
        content: (
            <span>
                我们通过魔法AI的独立站应用模块，辅助我们完成了独立站的搭建，它可以给我们写网站slogan，产品描述，做市场调研，我们通过他们的产品调研应用在一周之内开发出了好几个流量款，既
                <span className="text-red-600">提高了我们网站的流量</span>也降低了我们的试错成本。
            </span>
        )
    },
    {
        avatar: people5,
        title: '某创业型亚马逊合伙人',
        content: (
            <span>
                我是自己创业做亚马逊的，目前团队有5个人，一个财务，一个美工，三个运营。我是偶然在网上看到魔法AI这个工具的，好奇的试了一个月，
                <span className="text-red-600">效率真的惊人</span>,
                以前我们打造一款产品需要一个月，现在一周就可以搞定了。本来打算扩招业务，再招几个员工的，现在都不需要扩招，给我节省了好几个员工的成本，我也鼓励我的团队使用它，大家反馈都不错～
            </span>
        )
    },
    {
        avatar: people2,
        title: '某公司亚马逊运营总监',
        content: (
            <span>
                chatgpt一出来，我们公司就一直在尝试寻找适合跨境电商运营的AI工具，但很多反馈的结果都不好。魔法AI是在朋友圈看到朋友推荐的，抱着试试的心态试用了几天，效果出乎意料。
                <span className="text-red-600"> 不仅可以生成高质量文案，还可以选品，选关键词，回邮件</span>,
                我让我们运营团队的小伙伴试用了一个月，工作效率比平时提高了3倍!
            </span>
        )
    },
    {
        avatar: people3,
        title: '某跨境海外红人营销负责人',
        content: (
            <span>
                我们公司是做红人营销的，需要给公司签约的红人运营社交账号，接产品推广，拍视频等等，魔法AI可以完全满足我们的需求。几秒钟就可以给我们写好几帖子，还可以提供Youtube的脚本，生成图片等，再也不怕想不出好的点子了。
                <span className="text-red-600"> 同时运营十几个账号都没问题，简直太方便了！</span>
            </span>
        )
    },
    {
        avatar: people4,
        title: '某跨境电商产品研发负责人',
        content: (
            <span>
                魔法AI的一系列选品应用模板，给了我很多选品思路和灵感。选品不仅需要调研产品是否符合需求，还需要了解当地的生活和消费习惯，这对于我们跨境电商来说尤为重要。
                <span className="text-red-600">
                    使用AI工具可以快速了解一个市场的消费模式和习惯，从而更快地节约我的时间成本，并且让我对开发的产品更有信心。
                </span>
            </span>
        )
    },
    {
        avatar: people6,
        title: '某B2B产品营销经理',
        content: (
            <span>
                写产品开发信一直是我们这类外贸公司营销的重点，魔法AI很好的解决了我们如何写好开发信的难题，它可以提供各种场景的开发信应用模板，让我们轻松完成客户开发的目标。并且回复率比之前高了
                <span className="text-red-600"> 50%</span>
                ，给我们的业绩带来了
                <span className="text-red-600">5倍</span>
                的增长。
            </span>
        )
    },
    {
        avatar: people7,
        title: '某独立站品牌运营负责人',
        content: (
            <span>
                我是用魔法AI来写SEO文章的，以前一周最多写三篇文章的，现在一周可以写10篇，还可以避免查重和过于AI风格，文章看起来就像一个资深的SEO专家写的，用魔法AI写文章的收录率比我之前人工写的高了
                <span className="text-red-600">50%</span>, 网站流量增长了
                <span className="text-red-600">20%</span>。 价格也很实惠， 只要99一个月，与其他写作工具相比真的太划算了！
            </span>
        )
    },
    {
        avatar: people8,
        title: '某公司亚马逊运营专员',
        content: (
            <span>
                之前一直在用chatgpt，复杂的prompt让我一度怀疑AI是否真的能提高我的工作效率。偶然发现了魔法AI这个工具，只需要使用预设好的应用模板，就可以生成高质量的文案，让我们团队的工作流程更顺畅。与其他类似产品相比，魔法AI只需要99元每月，而ChatGPT需要20美金，Jasper需要39美金，
                <span className="text-red-600">团队版还更加优惠</span>。
            </span>
        )
    }
];

const plansDefault = (value: number) => [
    {
        keyword: 'free',
        active: false,
        icon: <TwoWheelerTwoToneIcon fontSize="large" color="inherit" />,
        title: '免费版',
        description: '每天签到获取魔法豆/图片使用数',
        monthPrice: '免费',
        yearPrice: '免费',
        des: '适用于新用户体验，打卡获得魔法豆',
        permission: [0, 1, 2, 5, 6, 7, 8, 9, 10],
        btnText: '免费使用'
    },
    {
        keyword: 'basic',
        active: true,
        icon: <TwoWheelerTwoToneIcon fontSize="large" color="inherit" />,
        title: '基础版',
        description: value === 1 ? '3000魔法豆，300点作图' : '36000魔法豆，3600点作图',
        monthPrice: 59,
        yearPrice: 599,
        preMonthPrice: 49.91,
        des: '适用于普通用户',
        permission: [0, 1, 2, 3, 5, 6, 7, 8, 9, 10, 11, 12],
        btnText: (
            <div>
                立即购买
                {/* <Tag className="ml-1" color="#f50">
                    {'订阅立减10元'}
                </Tag> */}
            </div>
        ),
        btnTextNew: (
            <div>
                新用户一周体验包
                <Tag className="ml-1" color="#f50">
                    <span className="text-base">9.9元</span>
                </Tag>
            </div>
        ),
        monthCode: 'basic_month',
        yearCode: 'basic_year'
    },
    {
        keyword: 'plus',
        active: false,
        icon: <TwoWheelerTwoToneIcon fontSize="large" color="inherit" />,
        title: '高级版',
        description: value === 1 ? '10000魔法豆，1000点作图' : '120000魔法豆，12000点作图',
        monthPrice: 199,
        yearPrice: 1999,
        preMonthPrice: 166.58,
        des: '适用于专业卖家',
        permission: [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12],
        btnText: '立即购买',
        monthCode: 'plus_month',
        yearCode: 'plus_year'
    },
    {
        keyword: 'pro',
        active: false,
        icon: <AirportShuttleTwoToneIcon fontSize="large" />,
        title: '团队版',
        description: value === 1 ? '6个账号，25000魔法豆，2000点作图' : '6个账号，300000魔法豆，24000点作图',
        monthPrice: 499,
        yearPrice: 4999,
        preMonthPrice: 416.58,
        des: '适用于公司团队',
        permission: [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12],
        btnText: '立即购买',
        monthCode: 'pro_month',
        yearCode: 'pro_year'
    },
    {
        keyword: 'business',
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

const planListDefault = (value: number) => [
    [
        '签到可免费获得2魔法豆', // 0
        '签到可免费获取图片1张', // 1
        'GPT-3.5/开源模型', // 2
        'GPT-4', // 3
        '个人空间',
        '1个自定义应用', // 4
        '1个自定义机器人', // 4
        '1个微信群机器人', // 4
        '多渠道发布机器人客服', // 4
        '上传信息库/文档问答', // 4
        '每个机器人1个文档上传', // 4
        'Google/Amazon联网查询', // 5
        '机器人插件扩展' // 6
    ],
    [
        <div className="flex items-center">
            <span>{value === 1 ? '3000魔法豆' : '36000魔法豆'}</span>
            <Tooltip title={'执行应用或聊天消耗一点'}>
                <HelpOutlineIcon className="text-base ml-1 cursor-pointer tips" />
            </Tooltip>
        </div>, // 0
        `生成图片${value === 1 ? 300 : 3600}张`, // 1
        'GPT-3.5/开源模型', // 2
        <div className="flex items-center">
            <span>GPT-4</span>
            <Tooltip title={'消耗30点魔法豆'}>
                <HelpOutlineIcon className="text-base ml-1 cursor-pointer tips" />
            </Tooltip>
        </div>,
        '个人空间',
        <div className="flex items-center">
            <span>5个自定义应用</span>
            <Tooltip title={'可自定义提示词应用'}>
                <HelpOutlineIcon className="text-base ml-1 cursor-pointer tips" />
            </Tooltip>
        </div>,
        <div className="flex items-center">
            <span>5个自定义机器人</span>
            <Tooltip title={'可自定义自己的问答机器人'}>
                <HelpOutlineIcon className="text-base ml-1 cursor-pointer tips" />
            </Tooltip>
        </div>,
        <div className="flex items-center">
            <span>1个微信群机器人</span>
            <Tooltip title={'机器人可发布到微信群使用'}>
                <HelpOutlineIcon className="text-base ml-1 cursor-pointer tips" />
            </Tooltip>
        </div>,
        <div className="flex items-center">
            <span>多渠道发布机器人客服</span>
            <Tooltip title={'可把配置好的机器人部署到 公共号,微信群,个人网站等地方,即可直接使用'}>
                <HelpOutlineIcon className="text-base ml-1 cursor-pointer tips" />
            </Tooltip>
        </div>,
        <div className="flex items-center">
            <span>上传信息库/文档问答</span>
            <Tooltip title={'可上传私有文档，机器人可自动参考文档的内容，并进行最合理的回答'}>
                <HelpOutlineIcon className="text-base ml-1 cursor-pointer tips" />
            </Tooltip>
        </div>,

        '每个机器人5个文档上传', // 4
        'Google/Amazon联网查询', // 5
        '1个机器人插件扩展' // 6
    ],
    [
        <div className="flex items-center">
            <span>{value === 1 ? '10000魔法豆' : '120000魔法豆'}</span>
            <Tooltip title={'执行应用或聊天消耗一点'}>
                <HelpOutlineIcon className="text-base ml-1 cursor-pointer tips" />
            </Tooltip>
        </div>, // 0
        `生成图片${value === 1 ? 1000 : 12000}张`, // 1
        'GPT-3.5/开源模型', // 2
        <div className="flex items-center">
            <span>GPT-4</span>
            <Tooltip title={'消耗30点魔法豆'}>
                <HelpOutlineIcon className="text-base ml-1 cursor-pointer tips" />
            </Tooltip>
        </div>,
        <div className="flex items-center">
            <span>个人空间</span>
            <Tooltip title={'可邀请3名好友在空间创作'}>
                <HelpOutlineIcon className="text-base ml-1 cursor-pointer tips" />
            </Tooltip>
        </div>,
        <div className="flex items-center">
            <span>20个自定义应用</span>
            <Tooltip title={'可自定义提示词应用'}>
                <HelpOutlineIcon className="text-base ml-1 cursor-pointer tips" />
            </Tooltip>
        </div>,
        <div className="flex items-center">
            <span>20个自定义机器人</span>
            <Tooltip title={'可自定义自己的问答机器人'}>
                <HelpOutlineIcon className="text-base ml-1 cursor-pointer tips" />
            </Tooltip>
        </div>,
        <div className="flex items-center">
            <span>10个微信群机器人</span>
            <Tooltip title={'机器人可发布到微信群使用'}>
                <HelpOutlineIcon className="text-base ml-1 cursor-pointer tips" />
            </Tooltip>
        </div>,
        <div className="flex items-center">
            <span>多渠道发布机器人客服</span>
            <Tooltip title={'可把配置好的机器人部署到 公共号,微信群,个人网站等地方,即可直接使用'}>
                <HelpOutlineIcon className="text-base ml-1 cursor-pointer tips" />
            </Tooltip>
        </div>,
        <div className="flex items-center">
            <span>上传信息库/文档问答</span>
            <Tooltip title={'可上传私有文档，机器人可自动参考文档的内容，并进行最合理的回答'}>
                <HelpOutlineIcon className="text-base ml-1 cursor-pointer tips" />
            </Tooltip>
        </div>,
        '每个机器人20个文档上传', // 4
        'Google/Amazon联网查询', // 5
        '3个机器人插件扩展' // 6
    ],
    [
        <div className="flex items-center">
            <span>{value === 1 ? '25000魔法豆' : '300000魔法豆'}</span>
            <Tooltip title={'执行应用或聊天消耗一点'}>
                <HelpOutlineIcon className="text-base ml-1 cursor-pointer tips" />
            </Tooltip>
        </div>, // 0
        `生成图片${value === 1 ? 2000 : 24000}张`, // 1
        'GPT-3.5/开源模型', // 2
        'GPT-4', // 3
        <div className="flex items-center">
            <span>个人空间</span>
            <Tooltip title={'可邀请6名好友在空间创作'}>
                <HelpOutlineIcon className="text-base ml-1 cursor-pointer tips" />
            </Tooltip>
        </div>,
        '无限自定义应用', // 4
        '无限自定义机器人', // 4
        '无限个微信群机器人', // 4
        '多渠道发布机器人客服', // 4
        '上传信息库/文档问答', // 4
        '无限文档上传', // 4
        'Google/Amazon联网查询', // 4
        '10个机器人插件扩展' // 5
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
    const [planList, setPlanList] = useState<any[]>(planListDefault(1));
    const [plans, setPlans] = useState<any[]>(plansDefault(1));
    const { isLoggedIn } = useAuth();
    const theme = useTheme();
    const [openDialog, setOpenDialog] = useState(false);
    const [openPayDialog, setOpenPayDialog] = useState(false);
    const [swiperRef, setSwiperRef] = useState<any>(null);
    const [currentSelect, setCurrentSelect] = useState<any>(null);
    const [openSignDialog, setOpenSignDialog] = useState(false);

    const [showTrial, setShowTrial] = useState(false);
    const [tabs, setTabs] = useState<any[]>([]);

    const [value, setValue] = useState<any>();

    const [open, setOpen] = React.useState(false);
    const [openSign, setOpenSign] = React.useState(false);

    const [payUrl, setPayUrl] = useState('');

    const [isTimeout, setIsTimeout] = useState(false);

    const [order, setOrder] = useState<any>({});

    const [discountOpen, setDiscountOpen] = useState(false);
    const [beanTypeId, setBeanTypeId] = useState('');

    const [newUserProductId, setNewUserProductId] = useState<any>();
    const [beanProducts, setBeanProducts] = useState<any[]>([]);
    console.log('🚀 ~ Price1 ~ beanProducts:', beanProducts);

    const { width } = useWindowSize();
    const myRef = React.useRef<any>(null);

    const navigate = useNavigate();

    const location = useLocation();
    const searchParams = new URLSearchParams(location.search);
    const from = searchParams.get('from');

    const priceListDisable = {
        opacity: '0.4',
        '& >div> svg': {
            fill: theme.palette.secondary.light
        }
    };

    useEffect(() => {
        discountNewUser().then((res) => {
            if (res.isNewUser) {
                setShowTrial(true);
                getNewUserProduct().then((res) => {
                    setNewUserProductId(res?.skus?.[0]?.id);
                });
            }
        });
    }, []);

    useEffect(() => {
        getPayType().then((res) => {
            const result = res.filter((item: any) => item.parentId === 0) || [];
            setValue(result?.[0]?.id);
            setTabs(result);

            // 加油包
            const data = res.filter((v: any) => v.name === '加油包' && v.parentId === 0);
            setBeanTypeId(data?.[0]?.id);
            getPayList(data?.[0]?.id).then((payRes) => {
                setBeanProducts(payRes.list);
            });
        });
    }, []);

    useEffect(() => {
        const monthId = tabs?.find((v) => v.name === '月付')?.id;
        if (value) {
            getPayList(value).then((res) => {
                let newList: any[] = [];
                res.list.forEach((item: any, index: number) => {
                    // 是月付
                    if (value === monthId) {
                        const monthPlans = plansDefault(1);
                        monthPlans.forEach((v: any) => {
                            if (item.keyword?.startsWith(v.keyword)) {
                                if (index === 0) {
                                    newList.push({ ...v, payPrice: '免费', id: item?.skus?.[0]?.id });
                                } else if (index === 4) {
                                    newList.push({ ...v, payPrice: '专属顾问', id: item?.skus?.[0]?.id });
                                } else {
                                    newList.push({
                                        ...v,
                                        id: item?.skus?.[0]?.id,
                                        payPrice: item.price / 100,
                                        marketPrice: item.marketPrice / 100,
                                        unitName: item.unitName,
                                        isSubscribe: item.subscribeConfig?.isSubscribe
                                    });
                                }
                            }
                        });
                        setPlans(newList);
                        setPlanList(planListDefault(1));
                    } else {
                        const yearPlans = plansDefault(2);
                        yearPlans.forEach((v: any) => {
                            if (item.keyword?.startsWith(v.keyword)) {
                                if (index === 0) {
                                    newList.push({ ...v, payPrice: '免费', id: item?.skus?.[0]?.id });
                                } else if (index === 4) {
                                    newList.push({ ...v, payPrice: '专属顾问', id: item?.skus?.[0]?.id });
                                } else {
                                    newList.push({
                                        ...v,
                                        id: item?.skus?.[0]?.id,
                                        payPrice: item.price / 100,
                                        marketPrice: item.marketPrice / 100,
                                        unitName: item.unitName,
                                        isSubscribe: item.subscribeConfig?.isSubscribe
                                    });
                                }
                            }
                        });
                        setPlans(newList);
                        setPlanList(planListDefault(2));
                    }
                });
            });
        }
    }, [value]);

    const handleOpen = () => {
        setOpen(true);
    };

    const handleClose = () => {
        setPayUrl('');
        setOpen(false);
        clearInterval(interval);
    };

    const handleSignClose = () => {
        setPayUrl('');
        setOpenSign(false);
        clearInterval(interval);
    };

    useEffect(() => {
        return () => {
            clearInterval(interval);
        };
    }, []);

    const onChange = (e: RadioChangeEvent) => {
        if (e.target.value === beanTypeId) {
            handleClickRef();
        } else {
            setValue(e.target.value);
        }
    };

    const onRefresh = async () => {
        const resOrder = await submitOrder({
            id: order.payOrderId,
            channelCode: 'alipay_pc',
            channelExtras: { qr_pay_mode: '4', qr_code_width: 250 },
            displayMode: 'qr_code'
        });
        setPayUrl(resOrder.displayContent);
        setIsTimeout(false);
        interval = setInterval(() => {
            getOrderIsPay({ id: order.id }).then((isPayRes) => {
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

    // type之前用来判断是否是签约，现在用来判断折扣码类型
    const handleCreateOrder = async (payId?: number, discountCode?: number, type?: number) => {
        if (!isLoggedIn) {
            setOpenDialog(true);
            setTimeout(() => {
                navigate('/login');
            }, 3000);
        } else {
            let res: any;
            const options = Intl.DateTimeFormat().resolvedOptions();
            const timeZone = options.timeZone;
            if (type === 1) {
                res = await createOrder({
                    terminal: 20,
                    items: [{ skuId: payId, count: 1 }],
                    promoCode: discountCode,
                    pointStatus: false,
                    deliveryType: 3,
                    from
                });
            } else {
                res = await createOrder({
                    terminal: 20,
                    items: [{ skuId: payId, count: 1 }],
                    couponId: discountCode,
                    pointStatus: false,
                    deliveryType: 3,
                    from
                });
            }
            if (res) {
                handleOpen();
                setOrder(res);
                const resOrder = await submitOrder({
                    id: res.payOrderId,
                    channelCode: 'alipay_pc',
                    channelExtras: { qr_pay_mode: '4', qr_code_width: 250 },
                    displayMode: 'qr_code'
                });
                setPayUrl(resOrder.displayContent);

                interval = setInterval(() => {
                    getOrderIsPay({ id: res.id }).then((isPayRes) => {
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
            }
        }
    };

    const handleCreateSignPay = async (payId?: number) => {
        if (!isLoggedIn) {
            setOpenDialog(true);
            setTimeout(() => {
                navigate('/login');
            }, 3000);
        } else {
            let res: any;

            res = await createSignV2({
                terminal: 20,
                items: [{ skuId: payId, count: 1 }],
                pointStatus: false,
                deliveryType: 3,
                from
            });
            if (res) {
                const resOrder = await submitSignV2({
                    id: res.paySignId,
                    channelCode: 'alipay_pc',
                    displayMode: 'url'
                });
                setPayUrl(resOrder);
                setOpenSign(true);

                interval = setInterval(() => {
                    getIsSignV2({ id: res.id }).then((isPayRes) => {
                        if (isPayRes) {
                            handleSignClose();
                            setOpenSignDialog(true);
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
            }
        }
    };

    // 获取价格
    const handleFetchPay = async (payId?: number, discountCode?: number, type?: number, isSign = false) => {
        if (!isLoggedIn) {
            setOpenDialog(true);
            setTimeout(() => {
                navigate('/login');
            }, 3000);
            return;
        }
        let res: any;
        if (!isSign) {
            // 不是签约
            if (type === 1) {
                res = await getPrice({ items: [{ skuId: payId, count: 1 }], promoCode: discountCode, pointStatus: false, deliveryType: 3 });
            } else {
                res = await getPrice({ items: [{ skuId: payId, count: 1 }], couponId: discountCode, pointStatus: false, deliveryType: 3 });
            }
        } else {
            // 是签约
            res = await getSignPrice({ items: [{ skuId: payId, count: 1 }], pointStatus: false, deliveryType: 3 });
        }
        if (res) {
            setDiscountOpen(true);
            setCurrentSelect((pre: any) => {
                return {
                    ...pre,
                    ...res.price,
                    spuId: res?.items?.[0]?.spuId
                };
            });
        }
    };

    const handleClick = (index: number, payId?: number) => {
        switch (index) {
            case 0:
                return navigate('/exchange');
            case 1:
            case 2:
            case 3:
                return handleFetchPay(payId);
            case 4:
                return;
        }
    };

    const onCol = () => {
        if (width > 900) {
            return 4;
        } else if (width < 900 && width > 600) {
            return 2;
        } else {
            return 1;
        }
    };

    const handleClickRef = () => {
        if (myRef?.current) {
            myRef?.current.scrollIntoView({ behavior: 'smooth' });
        }
    };
    return (
        <div>
            <HeaderWrapper id="vip">
                <VipBar />
            </HeaderWrapper>
            <div className="flex w-full bg-[#f4f6f8] mt-[100px] pt-10 pb-10 justify-center">
                <div className="w-[94%]">
                    <div className="flex justify-center mb-10 xs:text-2xl md:text-5xl">立即订阅，创作无限可能！</div>
                    <div className="flex justify-center mb-10">
                        <Radio.Group onChange={onChange} buttonStyle="solid" size="large" value={value}>
                            {tabs.map((item: any) => {
                                return (
                                    <Radio.Button value={item.id} style={{ width: '150px', textAlign: 'center' }}>
                                        {item.name} {item.name === '年付' && <Tag color="#f50">8折优惠</Tag>}
                                    </Radio.Button>
                                );
                            })}
                        </Radio.Group>
                        {/* <span className="flex items-end ml-1 cursor-pointer text-blue-500" onClick={handleClickRef}>
                            加油包购买
                        </span> */}
                    </div>
                    <Grid container spacing={gridSpacing} columns={20}>
                        {plans.map((plan, index) => {
                            const darkBorder =
                                theme.palette.mode === 'dark' ? theme.palette.background.default : theme.palette.primary[200] + 75;
                            return (
                                <Grid item xs={20} sm={10} md={4} key={index}>
                                    <MainCard
                                        boxShadow
                                        sx={{
                                            pt: 1.75,
                                            border: plan.active ? '2px solid' : '1px solid',
                                            borderColor: plan.active ? 'secondary.main' : darkBorder
                                        }}
                                    >
                                        <Grid container textAlign="center" spacing={gridSpacing}>
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
                                                {index === 1 || index === 2 || index === 3 ? (
                                                    <div className="text-sm text-center text-[#d7d7d7] line-through">
                                                        ￥{plan?.marketPrice}/{plan?.unitName}
                                                    </div>
                                                ) : (
                                                    <div className="h-[24px]"></div>
                                                )}
                                                <Typography
                                                    component="div"
                                                    variant="body2"
                                                    sx={{
                                                        fontSize: '2.1875rem',
                                                        fontWeight: 700,
                                                        lineHeight: '1.2em',
                                                        '& > span': {
                                                            fontSize: '1.25rem',
                                                            fontWeight: 500
                                                        }
                                                    }}
                                                >
                                                    {(index === 1 || index === 2 || index === 3) && <span>￥</span>}
                                                    {plan.payPrice}
                                                    {(index === 1 || index === 2 || index === 3) && (
                                                        <span className="text-[#aaa]">/{plan?.unitName}</span>
                                                    )}
                                                </Typography>
                                                <div className="text-[#aaa] text-sm text-center">{plan?.des}</div>
                                            </Grid>
                                            <Grid item xs={12}>
                                                {index === 4 ? (
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
                                                        onClick={() => {
                                                            setCurrentSelect({
                                                                title: plan.title,
                                                                select: value,
                                                                payId: plan.id,
                                                                isSubscribe: plan?.isSubscribe
                                                            });
                                                            handleClick(index, plan.id);
                                                        }}
                                                        color="secondary"
                                                    >
                                                        <div className="flex flex-col">
                                                            <div> {plan.btnText}</div>
                                                            {plan?.isSubscribe && (
                                                                <div>
                                                                    <Tag className="ml-1" color="#f50">
                                                                        订阅优惠10元
                                                                    </Tag>
                                                                </div>
                                                            )}
                                                        </div>
                                                    </Button>
                                                )}
                                            </Grid>
                                            {plan.btnTextNew && showTrial && (
                                                <Grid item xs={12}>
                                                    <Button
                                                        className={'w-4/5'}
                                                        variant={plan.active ? 'contained' : 'outlined'}
                                                        onClick={() => {
                                                            setCurrentSelect({
                                                                title: '体验版',
                                                                select: value,
                                                                payId: newUserProductId,
                                                                experience: true,
                                                                isSubscribe: false
                                                            });
                                                            handleClick(index, newUserProductId);
                                                        }}
                                                        color="secondary"
                                                    >
                                                        {plan.btnTextNew}
                                                    </Button>
                                                </Grid>
                                            )}
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
                                                    {planList?.[index]?.map((list: any, i: number) => (
                                                        <React.Fragment key={i}>
                                                            <ListItem sx={!plan.permission.includes(i) ? priceListDisable : {}}>
                                                                <ListItemIcon>
                                                                    <CheckTwoToneIcon sx={{ fontSize: '1.3rem' }} />
                                                                </ListItemIcon>
                                                                <ListItemText
                                                                    sx={{
                                                                        '& .tips': { fill: '#000' }
                                                                    }}
                                                                    primary={list}
                                                                />
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
                    <div className="flex justify-center mt-10" ref={myRef}>
                        注：如之前已购买权益并在有效期内的，将自动升级到新权益
                    </div>

                    <div className="flex justify-center">
                        <Divider className="py-3 w-[70%]" />
                    </div>
                    <div className="flex w-full mt-[40px]  pb-10 justify-center flex-col items-center">
                        <div className="xs:w-[100%] md:w-[40%]">
                            <div className="flex justify-center mt-3 mb-5 xs:text-2xl md:text-5xl">加油包</div>
                            <div className="flex justify-center mt-5 mb-7">购买后立即生效，有效期7天</div>
                        </div>
                        <div className="xs:w-[100%] md:w-[40%]">
                            <Grid container spacing={gridSpacing} columns={20} className="flex justify-center">
                                {beanProducts.map((plan, index) => (
                                    <Grid item xs={20} sm={10} md={10} key={index} className="max-w-[320px] ">
                                        <MainCard
                                            boxShadow
                                            sx={{
                                                pt: 1.75,
                                                border: '1px solid',
                                                borderColor: 'secondary.main'
                                            }}
                                        >
                                            <Grid container textAlign="center" spacing={gridSpacing}>
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
                                                        {plan.name}
                                                    </Typography>
                                                </Grid>
                                                <Grid item xs={12}>
                                                    <Typography variant="body2">{`${plan?.giveRights?.giveMagicBean}魔法豆, ${plan?.giveRights?.giveImage}点作图`}</Typography>
                                                </Grid>
                                                <Grid item xs={12}>
                                                    {/* <div className="text-sm text-center text-[#d7d7d7] line-through">
                                                        ￥{plan?.marketPrice / 100}/{plan?.unitName}
                                                    </div> */}
                                                    <Typography
                                                        component="div"
                                                        variant="body2"
                                                        sx={{
                                                            fontSize: '2.1875rem',
                                                            fontWeight: 700,
                                                            lineHeight: '1.2em',
                                                            '& > span': {
                                                                fontSize: '1.25rem',
                                                                fontWeight: 500
                                                            }
                                                        }}
                                                    >
                                                        <span>￥</span>
                                                        {plan.price / 100}
                                                    </Typography>
                                                    <div className="text-[#aaa] text-sm text-center">{'七天加油包'}</div>
                                                </Grid>
                                                <Grid item xs={12}>
                                                    <Button
                                                        className={'w-4/5'}
                                                        variant={plan.active ? 'contained' : 'outlined'}
                                                        onClick={() => {
                                                            setCurrentSelect({
                                                                isDataPlus: true,
                                                                payPrice: plan.price
                                                            });
                                                            handleCreateOrder(plan?.skus?.[0]?.id);
                                                        }}
                                                        color="secondary"
                                                    >
                                                        <div className="flex flex-col">
                                                            <div>购买加油包</div>
                                                        </div>
                                                    </Button>
                                                </Grid>
                                            </Grid>
                                        </MainCard>
                                    </Grid>
                                ))}
                            </Grid>
                        </div>
                    </div>

                    <>
                        <div className="flex justify-center">
                            <Divider className="py-3 w-[70%]" />
                        </div>
                        <div>
                            <div className="text-3xl font-semibold w-full text-center my-[20px]">
                                跨境人都选择
                                <span className="text-violet-500">“魔法AI”</span>
                            </div>
                            <div className="flex justify-center">
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
                                    slidesPerView={onCol()}
                                    spaceBetween={30}
                                    centeredSlides={false}
                                    loop
                                    modules={[]}
                                    className="mySwiper"
                                    autoplay={{
                                        delay: 2500,
                                        disableOnInteraction: false
                                    }}
                                >
                                    {recommendList.map((item, index) => (
                                        <SwiperSlide>
                                            <div className="!bg-white rounded-2xl p-5 space-y-2.5 border border-neutral-100">
                                                <div className="flex items-center gap-2">
                                                    <div>
                                                        <img src={item.avatar} className="rounded-full w-9 h-9" />
                                                    </div>
                                                    <div className="text-xs font-semibold">{item.title}</div>
                                                </div>
                                                <div className="font-semibold leading-7">“{item.content}”</div>
                                            </div>
                                        </SwiperSlide>
                                    ))}
                                </Swiper>
                            </div>
                        </div>
                    </>
                </div>
            </div>
            <SectionWrapper sx={{ bgcolor: theme.palette.mode === 'dark' ? 'background.default' : 'dark.900', pb: 0 }}>
                <FooterSection />
            </SectionWrapper>
            <PayModal
                open={open}
                handleClose={() => handleClose()}
                url={payUrl}
                isTimeout={isTimeout}
                onRefresh={onRefresh}
                payPrice={currentSelect?.payPrice / 100 || 0}
                isDataPlus={currentSelect?.isDataPlus}
            />
            <SignModal
                open={openSign}
                handleClose={() => setOpenSign(false)}
                url={payUrl}
                isTimeout={isTimeout}
                onRefresh={() => null}
                payPrice={currentSelect?.payPrice / 100 || 0}
            />
            {discountOpen && (
                <DiscountModal
                    open={discountOpen}
                    handleClose={() => setDiscountOpen(false)}
                    handleFetchPay={handleFetchPay}
                    setCurrentSelect={setCurrentSelect}
                    currentSelect={currentSelect}
                    handleCreateOrder={handleCreateOrder}
                    handleCreateSignPay={handleCreateSignPay}
                    categoryId={value}
                />
            )}
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
            <Dialog
                open={openSignDialog}
                onClose={() => setOpenSignDialog(false)}
                aria-labelledby="alert-dialog-title"
                aria-describedby="alert-dialog-description"
                sx={{ p: 2 }}
            >
                {openSignDialog && (
                    <>
                        <DialogTitle id="alert-dialog-title">提示</DialogTitle>
                        <DialogContent>
                            <DialogContentText id="alert-dialog-description">
                                <Typography variant="h5" component="span">
                                    签约成功，3S后跳转至订单记录页...
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
