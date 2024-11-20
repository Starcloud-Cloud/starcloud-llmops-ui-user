import React, { useEffect } from 'react';

// material-ui
import { Button, CardContent, CardProps, Divider, Grid, IconButton, Modal, Tab, Tabs } from '@mui/material';
import { Input, Popover, Radio, RadioChangeEvent, Tag, InputNumber } from 'antd';

const { Search } = Input;

// project imports
import MainCard from 'ui-component/cards/MainCard';

// assets
import CloseIcon from '@mui/icons-material/Close';
import { gridSpacing } from 'store/constant';
import dayjs from 'dayjs';
import Checkbox from '@mui/material/Checkbox';
import { getDiscountList, getLickNameProduct } from 'api/vip';
import { getCouponCode } from 'api/rewards';
import './discountModal.scss';

// generate random
function rand() {
    return Math.round(Math.random() * 20) - 10;
}

// modal position
function getModalStyle() {
    const top = 50 + rand();
    const left = 50 + rand();

    return {
        top: `${top}%`,
        left: `${left}%`,
        transform: `translate(-${top}%, -${left}%)`
    };
}

interface BodyProps extends CardProps {
    modalStyle: React.CSSProperties;
    handleClose: () => void;
    url: string;
    isTimeout?: boolean;
    onRefresh: () => void;
    payPrice?: number;
}

function a11yProps(index: number) {
    return {
        id: `simple-tab-${index}`,
        'aria-controls': `simple-tabpanel-${index}`
    };
}

// ==============================|| SIMPLE MODAL ||============================== //
export function DiscountModal({
    open,
    handleClose,
    currentSelect,
    handleFetchPay,
    setCurrentSelect,
    handleCreateOrder,
    handleCreateSignPay,
    count,
    setCount,
    categoryId
}: {
    open: boolean;
    handleClose: () => void;
    handleFetchPay: (payId: number, discountCode?: number, type?: number, isSign?: boolean) => void;
    currentSelect: any;
    setCurrentSelect: (currentSelect: any) => void;
    handleCreateOrder: (payId?: number, discountCode?: number, type?: number, payType?: number) => void;
    handleCreateSignPay: (payId?: number) => void;
    count: number;
    setCount: (payId: number) => void;
    categoryId: number;
}) {
    const [selectCode, setSelectCode] = React.useState<any>(); // payId
    const [discountCode, setDiscountCode] = React.useState<any>();
    const [discountCodeType, setDiscountCodeType] = React.useState<number>();
    const [value, setValue] = React.useState(0); // tab
    const [checked, setChecked] = React.useState(false);
    const [discount, setDiscount] = React.useState<any>([]);
    const [payType, setPayType] = React.useState(1);

    const [discountCodeList, setDiscountCodeList] = React.useState<any>([]);

    const [timeList, setTimeList] = React.useState([]);

    const discountList = React.useMemo(() => {
        return [...discountCodeList, ...discount];
    }, [discountCodeList, discount]);

    const handleGetDiscount = async (value: number) => {
        if (!value) return;
        const res = await getCouponCode({ code: value, spuId: currentSelect.spuId });
        if (res) {
            // type = 1 折扣码
            setDiscountCode('');
            setDiscountCodeList([{ ...res, type: 1, promoCode: value }]);
        } else {
            setDiscountCode('');
            setDiscountCodeList([]);
        }
    };

    const handleOnSearch = async (value: number, type?: number) => {
        // 取消
        if (discountCode === value) {
            setDiscountCode('');
            await handleFetchPay(selectCode);
        } else {
            setDiscountCode(() => value);
            await handleFetchPay(selectCode, value, type);
            setDiscountCodeType(type);
        }
    };

    // 获取年月和把payId 复制给selectCOde
    useEffect(() => {
        getLickNameProduct({ id: currentSelect.payId }).then((res) => {
            setTimeList(res);
        });
        setSelectCode(currentSelect.payId);
    }, [currentSelect]);

    // 默认选择第一个优惠券
    useEffect(() => {
        if (discountList.length) {
            if (discountList?.[0].type === 1) {
                // 折扣码
                handleOnSearch(discountList?.[0]?.promoCode, discountList?.[0]?.type);
            } else {
                // 折扣券
                handleOnSearch(discountList?.[0]?.id);
            }
        }
    }, [discountList]);

    const handleRadio = async (e: RadioChangeEvent) => {
        const isSubscribe = currentSelect?.skus.find((item: any) => item.id === e.target.value).subscribeConfig.isSubscribe;
        setCurrentSelect((pre: any) => {
            return {
                ...pre,
                payId: e.target.value,
                isSubscribe
            };
        });
        await handleFetchPay(e.target.value, discountCode);
    };

    const handlePayType = (e: RadioChangeEvent) => {
        setPayType(e.target.value);
    };

    useEffect(() => {
        getDiscountList({
            price: currentSelect.payPrice,
            spuIds: [currentSelect.spuId],
            skuIds: [currentSelect.payId],
            categoryIds: [categoryId]
        }).then((res: any) => {
            setDiscount(res);
        });
    }, []);

    const canSubmit = React.useMemo(() => {
        if (discountCode && !currentSelect.discountCouponStatus) {
            return false;
        } else {
            return true;
        }
    }, [discountCode, currentSelect.discountCouponStatus]);

    const handleChange = (event: React.SyntheticEvent, newValue: number) => {
        if (newValue === 1) {
            setValue(newValue);
            handleFetchPay(currentSelect?.payId, 0, 0, true);
        } else {
            setValue(newValue);
            handleFetchPay(currentSelect?.payId);
        }
    };

    return (
        <Grid container justifyContent="flex-end">
            <Modal open={open} onClose={handleClose} aria-labelledby="modal-title" aria-describedby="modal-description">
                <MainCard
                    style={{
                        position: 'absolute',
                        width: '600px',
                        top: '50%',
                        left: '50%',
                        transform: 'translate(-50%, -50%)'
                    }}
                    title="订单预览"
                    content={false}
                    secondary={
                        <IconButton onClick={handleClose} size="large" aria-label="close modal">
                            <CloseIcon fontSize="small" />
                        </IconButton>
                    }
                >
                    <CardContent>
                        <Grid container spacing={gridSpacing}>
                            <Grid item xs={12} sm={12} md={12}>
                                <Tabs
                                    value={value}
                                    onChange={handleChange}
                                    aria-label="basic tabs example"
                                    textColor="secondary"
                                    indicatorColor="secondary"
                                >
                                    <Tab label="购买" {...a11yProps(0)} />
                                    {currentSelect?.isSubscribe && (
                                        <Tab
                                            label={
                                                <div className="flex justify-center items-center">
                                                    <span>订阅</span>
                                                    <Tag className="ml-1" color="#f50">
                                                        立减{currentSelect?.totalPrice / 100 - currentSelect?.subscribeMoney}元
                                                    </Tag>
                                                </div>
                                            }
                                            {...a11yProps(1)}
                                        />
                                    )}
                                </Tabs>
                                <div className="flex justify-center flex-col items-center w-full p-3 min-h-[400px]">
                                    <div className="flex justify-between items-center w-full mb-3">
                                        <span className="text-[#868A91]">套餐类型</span>
                                        <span className="text-base font-semibold text-[#2B2D2F]">{currentSelect?.title}</span>
                                    </div>
                                    <div className="flex justify-between items-center w-full mb-3">
                                        <span className="text-[#868A91]">套餐原价</span>
                                        <div className="flex items-center">
                                            <span className="text-[#de4437] text-lg ">
                                                ￥{(currentSelect?.totalPrice / 100).toFixed(2)}
                                            </span>
                                            <span className="text-xs">元</span>
                                        </div>
                                    </div>
                                    {currentSelect.experience ? (
                                        <div className="flex justify-between items-center w-full mb-3">
                                            <span className="text-[#868A91]">{!value ? '购买时长' : '订阅时长'}</span>
                                            <span className="text-sm text-[#868A91]">{currentSelect?.buyTime}天</span>
                                        </div>
                                    ) : (
                                        <div className="flex justify-between items-center w-full mb-3">
                                            <span className="text-[#868A91]">{!value ? '购买时长' : '订阅时长'}</span>
                                            {!value ? (
                                                <span>
                                                    <Radio.Group onChange={handleRadio} value={selectCode}>
                                                        {currentSelect.skus.map((v: any, index: number) => (
                                                            <Radio value={v.id}>{v.properties[0].valueName}</Radio>
                                                        ))}
                                                    </Radio.Group>
                                                </span>
                                            ) : (
                                                <span className="text-sm text-[#868A91]">月付</span>
                                            )}
                                        </div>
                                    )}
                                    <div className="flex justify-between items-center w-full mb-3">
                                        <span className="text-[#868A91]">购买个数</span>
                                        <div className="flex items-center">
                                            <div
                                                className="border border-solid border-[#d9d9d9] bg-[#00000005] text-black/[88] rounded-l-[6px] w-[35px] h-[32px] flex justify-center items-center cursor-pointer"
                                                style={{ borderRight: 'none' }}
                                                onClick={async () => {
                                                    if (count > 1) {
                                                        setCount(-1);
                                                        await handleFetchPay(currentSelect?.payId, discountCode);
                                                    }
                                                }}
                                            >
                                                —
                                            </div>
                                            <InputNumber
                                                controls={false}
                                                readOnly={true}
                                                className="w-[80px] !rounded-[0px] number_input"
                                                value={count}
                                                min={1}
                                            />
                                            <div
                                                className="border border-solid border-[#d9d9d9] bg-[#00000005] text-black/[88] rounded-r-[6px] w-[35px] h-[32px] flex justify-center items-center cursor-pointer"
                                                style={{ borderLeft: 'none' }}
                                                onClick={async () => {
                                                    setCount(1);
                                                    await handleFetchPay(currentSelect?.payId, discountCode);
                                                }}
                                            >
                                                +
                                            </div>
                                        </div>
                                    </div>
                                    {!value && (
                                        <div className="flex w-full flex-col mb-3 mt-3">
                                            <span className="text-[#868A91] mb-2">折扣券</span>
                                            <div>
                                                <Search
                                                    placeholder="请输入折扣码"
                                                    enterButton={<span className="text-sm">检测有效性</span>}
                                                    size="large"
                                                    onSearch={handleGetDiscount as any}
                                                    // value={discountCode}
                                                    // onChange={(e) => {
                                                    //     setCurrentSelect((pre: any) => ({
                                                    //         ...pre,
                                                    //         discountCouponStatus: false
                                                    //     }));
                                                    //     setDiscountCode(e.target.value);
                                                    // }}
                                                />
                                            </div>
                                            <span className="text-[#919DA8] mt-1">
                                                输入/选择折扣券后系统会自动检测折扣券，如折扣券有效则显示在优惠金额
                                            </span>

                                            {!!discountList.length && (
                                                <div className="mt-4">
                                                    <div className="text-[#919DA8]">请选择下面折扣券:</div>
                                                    <div className="flex overflow-x-auto pl-2 pb-2">
                                                        {!!discountList?.length &&
                                                            discountList.map((v: any, index: number) => (
                                                                <div key={index} className="mt-2 mr-2 ">
                                                                    <div
                                                                        className={`flex items-center justify-center px-4 w-[210px] rounded-lg bg-[#ff5500] cursor-pointer ${
                                                                            (discountCode === v.id || discountCode === v.promoCode) &&
                                                                            'outline outline-offset-2 outline-1 outline-blue-500'
                                                                        }`}
                                                                    >
                                                                        <div className="mr-[2px]">
                                                                            <svg
                                                                                viewBox="0 0 1024 1024"
                                                                                version="1.1"
                                                                                xmlns="http://www.w3.org/2000/svg"
                                                                                p-id="1692"
                                                                                width="24"
                                                                                height="24"
                                                                            >
                                                                                <path
                                                                                    d="M433.28 386.88a96 96 0 0 0-65.44 32c-39.04 39.2-42.56 81.44-14.72 109.28a59.84 59.84 0 0 0 43.04 18.4 97.6 97.6 0 0 0 66.56-32c38.88-38.88 41.44-80.96 13.6-108.8a59.68 59.68 0 0 0-43.04-18.4z m-43.04 126.08a20.96 20.96 0 0 1-16-6.24c-11.2-11.36-8.32-32 20.32-60.16a70.08 70.08 0 0 1 44-25.76 21.28 21.28 0 0 1 16 6.24c11.2 11.36 9.44 31.04-19.2 59.68a72 72 0 0 1-45.12 26.24z m198.24 4.48l-307.36 96L304 636.16l307.52-96-22.88-22.88zM496 606.56a96 96 0 0 0-65.92 32c-38.88 38.88-42.24 81.76-14.56 109.28a59.04 59.04 0 0 0 42.88 18.08 97.44 97.44 0 0 0 66.56-32c39.2-39.2 41.44-81.44 13.92-109.12A59.68 59.68 0 0 0 496 606.56z m-43.04 125.92a21.28 21.28 0 0 1-16-6.24c-11.2-11.36-8.8-32 19.84-60.16A69.76 69.76 0 0 1 502.08 640a21.12 21.12 0 0 1 16 6.4c11.2 11.2 9.12 31.2-19.52 59.84a71.2 71.2 0 0 1-44.64 25.92zM868.48 212.96l-18.72 18.72a40 40 0 0 1-56.64-56.64l18.72-18.72a74.72 74.72 0 1 0 56.64 56.64z"
                                                                                    fill="#FFF"
                                                                                    p-id="1693"
                                                                                ></path>
                                                                                <path
                                                                                    d="M888.96 544l94.4-284.48a121.92 121.92 0 0 0-29.6-124.48l-3.84-3.84-33.92 33.92 3.84 3.84a73.44 73.44 0 0 1 17.92 75.36l-94.4 284.64a74.4 74.4 0 0 1-17.76 28.96L439.68 944A74.08 74.08 0 0 1 336 944l-42.08-42.08L121.28 729.92 80 688a73.92 73.92 0 0 1 0-104.16l385.12-386.08a72.96 72.96 0 0 1 28.96-17.92l284.64-94.4a73.44 73.44 0 0 1 75.36 17.92l5.44 5.44 33.92-33.92-5.44-5.44a121.6 121.6 0 0 0-124.48-29.44L479.04 134.24a122.56 122.56 0 0 0-48 29.44L45.28 549.6a121.92 121.92 0 0 0 0 172.32l42.08 41.92 172 172 42.08 42.08a121.76 121.76 0 0 0 172.16 0L859.52 592a120.64 120.64 0 0 0 29.44-48z"
                                                                                    fill="#FFF"
                                                                                    p-id="1694"
                                                                                ></path>
                                                                                <path
                                                                                    d="M821.44 227.36a24 24 0 0 1-16.96-40.96L973.44 17.44A24 24 0 1 1 1008 51.36L838.4 220.32a23.84 23.84 0 0 1-16.96 7.04z"
                                                                                    fill="#FFF"
                                                                                    p-id="1695"
                                                                                ></path>
                                                                            </svg>
                                                                        </div>
                                                                        <div
                                                                            className="flex flex-col py-1"
                                                                            onClick={() => {
                                                                                // 折扣码
                                                                                if (v.type === 1) {
                                                                                    handleOnSearch(v?.promoCode, v?.type);
                                                                                } else {
                                                                                    handleOnSearch(v?.id);
                                                                                }
                                                                            }}
                                                                        >
                                                                            <span className="text-white text-sm">{v?.name}</span>
                                                                            <div className="text-white text-sm">
                                                                                结束时间：{dayjs(v.validEndTime).format('YYYY-MM-DD')}
                                                                            </div>
                                                                        </div>
                                                                    </div>
                                                                </div>
                                                            ))}
                                                    </div>
                                                </div>
                                            )}
                                        </div>
                                    )}

                                    {!!value && (
                                        <div className="flex justify-between items-center w-full mb-3">
                                            <span className="text-[#868A91]">扣款时间</span>
                                            <span className="text-sm text-[#868A91]">
                                                下次扣费时间：{dayjs().add(1, 'month').format('YYYY年MM月DD日')}
                                            </span>
                                        </div>
                                    )}
                                    <div className="flex  items-center w-full mb-3 mt-3">
                                        <div className="flex flex-col">
                                            <span className="text-[#868A91] mb-2">
                                                优惠金额
                                                {/* {currentSelect.name && `（${currentSelect?.name}）`} */}
                                            </span>
                                            <span className="text-[#de4437] text-2xl ">
                                                ￥
                                                {(
                                                    (currentSelect?.discountPrice +
                                                        currentSelect.vipPrice +
                                                        currentSelect.pointPrice +
                                                        currentSelect.couponPrice) /
                                                    100
                                                ).toFixed(2)}
                                            </span>
                                        </div>

                                        <div className="flex flex-col ml-[30%]">
                                            <span className="text-[#868A91] mb-2">订单总价</span>
                                            <span className="text-[#de4437] text-2xl font-semibold">
                                                ￥{(currentSelect?.payPrice / 100).toFixed(2)}
                                            </span>
                                        </div>
                                    </div>
                                    {value === 1 && (
                                        <div className="flex items-center">
                                            <Checkbox
                                                checked={checked}
                                                size="small"
                                                className="p-1"
                                                onChange={() => setChecked(!checked)}
                                            />
                                            <span className="text-[#6E7378]">
                                                我已知晓 订阅后将
                                                <span className="text-[red]">每月自动续费</span>，
                                                <Popover
                                                    zIndex={999999}
                                                    content={
                                                        <div>
                                                            <div>（1）移动端：在支付宝钱包-我的-设置-支付设置-免密支付/自动扣款</div>
                                                            <div>（2）PC端：在支付宝官方平台-账户设置-应用授权和代扣-代扣</div>
                                                        </div>
                                                    }
                                                    title="如何取消自动续费："
                                                >
                                                    <span className="cursor-pointer text-blue-500">可随时一键取消</span>
                                                </Popover>
                                            </span>
                                        </div>
                                    )}

                                    <div className="flex">
                                        <Button
                                            disabled={value === 1 && !checked}
                                            onClick={() =>
                                                value === 1
                                                    ? handleCreateSignPay(currentSelect.payId)
                                                    : handleCreateOrder(currentSelect.payId, discountCode, discountCodeType, 1)
                                            }
                                            className="w-[200px] mt-4 bg-[#049fe8]"
                                            sx={{
                                                '&:hover': {
                                                    backgroundColor: '#049fe8'
                                                }
                                            }}
                                            startIcon={
                                                <svg
                                                    viewBox="0 0 1024 1024"
                                                    version="1.1"
                                                    xmlns="http://www.w3.org/2000/svg"
                                                    p-id="1575"
                                                    width="32"
                                                    height="32"
                                                >
                                                    <path
                                                        d="M492.343 777.511c-67.093 32.018-144.129 51.939-227.552 32.27-83.424-19.678-142.626-73.023-132.453-171.512 10.192-98.496 115.478-132.461 202.07-132.461 86.622 0 250.938 56.122 250.938 56.122s13.807-30.937 27.222-66.307c13.405-35.365 17.21-63.785 17.21-63.785H279.869v-35.067h169.995v-67.087l-211.925 1.526v-44.218h211.925v-100.63h111.304v100.629H788.35v44.218l-227.181 1.524v62.511l187.584 1.526s-3.391 35.067-27.17 98.852c-23.755 63.783-46.061 96.312-46.061 96.312L960 685.279V243.2C960 144.231 879.769 64 780.8 64H243.2C144.231 64 64 144.231 64 243.2v537.6C64 879.769 144.231 960 243.2 960h537.6c82.487 0 151.773-55.806 172.624-131.668L625.21 672.744s-65.782 72.748-132.867 104.767z"
                                                        p-id="1576"
                                                        fill="#fff"
                                                    ></path>
                                                    <path
                                                        d="M297.978 559.871c-104.456 6.649-129.974 52.605-129.974 94.891s25.792 101.073 148.548 101.073c122.727 0 226.909-123.77 226.909-123.77s-141.057-78.842-245.483-72.194z"
                                                        p-id="1577"
                                                        fill="#fff"
                                                    ></path>
                                                </svg>
                                            }
                                            variant="contained"
                                        >
                                            支付宝支付
                                        </Button>

                                        {value === 0 && (
                                            <Button
                                                onClick={() => handleCreateOrder(currentSelect.payId, discountCode, discountCodeType, 2)}
                                                className="w-[200px] mt-4 ml-3 bg-[#2ac446]"
                                                sx={{
                                                    '&:hover': {
                                                        backgroundColor: '#2ac446'
                                                    }
                                                }}
                                                startIcon={
                                                    <svg
                                                        viewBox="0 0 1024 1024"
                                                        version="1.1"
                                                        xmlns="http://www.w3.org/2000/svg"
                                                        p-id="1646"
                                                        width="32"
                                                        height="32"
                                                    >
                                                        <path d="M511.609097 961.619254" fill="#fff" p-id="1647"></path>
                                                        <path
                                                            d="M889.618407 787.083126c41.7468-38.149878 67.083861-88.273463 67.083861-143.163607 0-95.53382-76.727499-176.60423-183.177949-205.317179-6.348592-153.081491-162.17152-275.610128-353.493963-275.610128-195.352223 0-353.714997 127.743406-353.714997 285.319258 0 72.363098 33.395598 138.433886 88.432075 188.729385 17.22122 15.737426-2.939959 58.810431-27.714202 94.395904 41.866526-11.564383 86.519516-19.088754 125.611859-19.088754 18.300808 0 35.388998 1.65264 50.386574 5.305843 36.623106 10.348696 75.996858 15.981996 117.000737 15.981996 7.963369 0 15.862269-0.239454 23.699772-0.657986 42.0937 75.114768 135.796826 127.388319 244.639766 127.388319 31.104415 0 60.974723-4.26821 88.757486-12.126178 11.382235-2.77623 24.338315-4.028757 38.222533-4.028757 29.65439 0 63.530942 5.709025 95.28925 14.483876-18.787902-26.993794-34.088376-59.664891-21.020756-71.607898L889.620453 787.083126zM420.035472 681.516812c-35.33067 0-69.922513-4.716418-102.824877-14.014178l-0.907673-0.254803-0.916882-0.225127c-18.48398-4.50971-39.590694-6.795776-62.738903-6.795776-13.301957 0-26.589588 0.730641-39.585577 1.979074 2.76088-30.538527-8.94165-50.646494-23.152303-63.637366-22.955828-20.97573-40.786938-44.560892-52.993958-70.099545-12.261255-25.645077-18.478863-52.615335-18.478863-80.157621 0-60.140729 29.904077-117.384477 84.204797-161.187099 27.724435-22.364357 60.207243-39.98876 96.537683-52.384068 38.179554-13.029758 78.840626-19.632129 120.857579-19.632129s82.678024 6.608511 120.857579 19.632129c36.329417 12.395308 68.812225 30.019711 96.537683 52.384068 48.465828 39.09132 77.472466 88.892563 83.153862 141.900847l0.005117 0c-10.565636-1.01819-21.313422-1.561565-32.218796-1.561565-148.19725 0-268.334421 96.90812-268.334421 216.45382 0 12.8077 1.39272 25.361621 4.033873 37.559431 0 0 0 0 0-0.005117C422.719604 681.487136 421.38112 681.516812 420.035472 681.516812L420.035472 681.516812zM854.454536 748.621139c-8.422833 7.698333-19.530822 21.845541-21.547759 43.989887-5.820566-0.330528-11.689227-0.5137-17.557888-0.5137-18.566868 0-35.58138 1.854231-50.573839 5.513574l-0.916882 0.225127-0.911766 0.254803c-23.844058 6.743588-48.936549 10.157337-74.576509 10.157337-30.485315 0-59.96779-4.783956-87.620593-14.21577-26.167986-8.9263-49.516764-21.585621-69.403696-37.625946-38.174438-30.79333-59.198264-70.739111-59.198264-112.485911 0-41.7468 21.023826-81.697697 59.198264-112.491027 19.886933-16.040325 43.23571-28.699646 69.403696-37.626969 27.65178-9.431813 57.134255-14.214746 87.620593-14.214746 30.484292 0 59.966767 4.782933 87.618547 14.214746 26.167986 8.93244 49.516764 21.587668 69.399603 37.626969 38.174438 30.79333 59.20031 70.744227 59.20031 112.491027 0 19.002796-4.303003 37.636179-12.789281 55.381331C883.235023 717.207685 870.672916 733.800595 854.454536 748.621139L854.454536 748.621139zM854.454536 748.621139"
                                                            fill="#fff"
                                                            p-id="1648"
                                                        ></path>
                                                        <path
                                                            d="M264.813225 392.537188c0.284479-30.082132 19.104103-54.31914 42.286082-54.31914 23.348778 0 42.284035 24.611537 42.284035 54.966892 0 30.361495-18.930141 54.973032-42.284035 54.973032-23.181979 0-42.001603-24.241101-42.280966-54.286394L264.813225 392.537188zM264.813225 392.537188"
                                                            fill="#fff"
                                                            p-id="1649"
                                                        ></path>
                                                        <path
                                                            d="M484.761636 392.537188c0.284479-30.082132 19.104103-54.31914 42.280966-54.31914 23.353894 0 42.284035 24.611537 42.284035 54.966892 0 30.361495-18.930141 54.973032-42.284035 54.973032-23.176862 0-41.996486-24.241101-42.280966-54.286394L484.761636 392.537188zM484.761636 392.537188"
                                                            fill="#fff"
                                                            p-id="1650"
                                                        ></path>
                                                        <path
                                                            d="M582.250994 603.694375c0.284479-23.119557 14.763239-41.71917 32.584116-41.71917 17.999956 0 32.589233 18.97005 32.589233 42.366923 0 23.403013-14.589276 42.366923-32.589233 42.366923-17.821901 0-32.30066-18.599613-32.584116-41.679261L582.250994 603.694375zM582.250994 603.694375"
                                                            fill="#fff"
                                                            p-id="1651"
                                                        ></path>
                                                        <path
                                                            d="M739.250724 603.694375c0.284479-23.119557 14.767332-41.71917 32.589233-41.71917 17.999956 0 32.594349 18.97005 32.594349 42.366923 0 23.403013-14.594393 42.366923-32.594349 42.366923-17.821901 0-32.304753-18.599613-32.589233-41.679261L739.250724 603.694375zM739.250724 603.694375"
                                                            fill="#fff"
                                                            p-id="1652"
                                                        ></path>
                                                    </svg>
                                                }
                                                variant="contained"
                                            >
                                                微信支付
                                            </Button>
                                        )}
                                    </div>
                                </div>
                            </Grid>
                        </Grid>
                    </CardContent>
                    <Divider />
                </MainCard>
            </Modal>
        </Grid>
    );
}
