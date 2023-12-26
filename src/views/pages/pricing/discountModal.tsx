import React, { useEffect } from 'react';

// material-ui
import { Button, CardContent, CardProps, Divider, Grid, IconButton, Modal, Tab, Tabs } from '@mui/material';
import { Input, Radio, RadioChangeEvent, Tag } from 'antd';

// project imports
import MainCard from 'ui-component/cards/MainCard';

// assets
import CloseIcon from '@mui/icons-material/Close';
import { gridSpacing } from 'store/constant';
import dayjs from 'dayjs';
import Checkbox from '@mui/material/Checkbox';
import { getDiscountList, getLickNameProduct } from 'api/vip';

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
    categoryId
}: {
    open: boolean;
    handleClose: () => void;
    handleFetchPay: (payId: number, discountCode?: number) => void;
    currentSelect: any;
    setCurrentSelect: (currentSelect: any) => void;
    handleCreateOrder: (payId?: number, discountCode?: number, type?: number) => void;
    categoryId: number;
}) {
    const [selectCode, setSelectCode] = React.useState<any>(); // payId
    const [discountCode, setDiscountCode] = React.useState<any>();
    const [value, setValue] = React.useState(0); // tab
    const [checked, setChecked] = React.useState(false);
    const [discount, setDiscount] = React.useState<any>({});

    const [timeList, setTimeList] = React.useState([]);

    const handleOnSearch = async (value: number) => {
        if (discountCode) {
            setDiscountCode('');
            await handleFetchPay(selectCode);
        } else {
            setDiscountCode(value);
            await handleFetchPay(selectCode, value);
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
        if (discount.length) {
            handleOnSearch(discount?.[0]?.id);
        }
    }, [discount]);

    const handleRadio = async (e: RadioChangeEvent) => {
        setCurrentSelect((pre: any) => {
            return {
                ...pre,
                payId: e.target.value
            };
        });
        await handleFetchPay(e.target.value, discountCode);
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
        setValue(newValue);
        setCurrentSelect((pre: any) => {
            return {
                ...pre,
                select: '1'
            };
        });
        setSelectCode(currentSelect.monthCode);
        handleFetchPay(currentSelect.monthCode);
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
                                    {/* {!currentSelect.experience && (
                                        <Tab
                                            // disabled={!currentSelect.monthCode.includes('basic')}
                                            label={
                                                <div className="flex justify-center items-center">
                                                    <span>订阅</span>
                                                    <Tag className="ml-1" color="#f50">
                                                        立减10元
                                                    </Tag>
                                                </div>
                                            }
                                            {...a11yProps(1)}
                                        />
                                    )} */}
                                </Tabs>
                                <div className="flex justify-center flex-col items-center w-full p-3">
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
                                            <span className="text-xs">/元</span>
                                        </div>
                                    </div>
                                    {currentSelect.experience ? (
                                        <div className="flex justify-between items-center w-full mb-3">
                                            <span className="text-[#868A91]">{!value ? '购买时长' : '订阅时长'}</span>
                                            <span className="text-sm text-[#868A91]">1周</span>
                                        </div>
                                    ) : (
                                        <div className="flex justify-between items-center w-full mb-3">
                                            <span className="text-[#868A91]">{!value ? '购买时长' : '订阅时长'}</span>
                                            {!value ? (
                                                <span>
                                                    <Radio.Group onChange={handleRadio} value={selectCode}>
                                                        <Radio value={timeList?.[0]}>月</Radio>
                                                        <Radio value={timeList?.[1]}>年</Radio>
                                                    </Radio.Group>
                                                </span>
                                            ) : (
                                                <span className="text-sm text-[#868A91]">月付</span>
                                            )}
                                        </div>
                                    )}
                                    {!currentSelect.experience && !value && (
                                        <div className="flex w-full flex-col mb-3 mt-3">
                                            {/* <span className="text-[#868A91] mb-2">折扣券</span>
                                            <div>
                                                <Search
                                                    placeholder="请输入折扣码"
                                                    enterButton={<span className="text-sm">检测有效性</span>}
                                                    size="large"
                                                    onSearch={handleOnSearch}
                                                    value={discountCode}
                                                    onChange={(e) => {
                                                        setCurrentSelect((pre: any) => ({
                                                            ...pre,
                                                            discountCouponStatus: false
                                                        }));
                                                        setDiscountCode(e.target.value);
                                                    }}
                                                />
                                            </div>
                                            <span className="text-[#919DA8] mt-1">
                                                输入/选择折扣券后系统会自动检测折扣券，如折扣券有效则显示在优惠金额
                                            </span> */}

                                            {!!discount?.length &&
                                                discount.map((v: any, index: number) => (
                                                    <div key={index} className="mt-4">
                                                        <div className="text-[#919DA8]">请选择下面折扣券:</div>
                                                        <div className="mt-2">
                                                            <div
                                                                className={`flex items-center justify-center px-4 max-w-[210px] rounded-lg bg-[#ff5500] cursor-pointer ${
                                                                    discountCode && 'outline outline-offset-2 outline-1 outline-blue-500'
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
                                                                <div className="flex flex-col py-1" onClick={() => handleOnSearch(v?.id)}>
                                                                    <span className="text-white text-sm">{v?.name}</span>
                                                                    <div className="text-white text-sm">
                                                                        结束时间：{dayjs(v.endTime).format('YYYY-MM-DD')}
                                                                    </div>
                                                                </div>
                                                            </div>
                                                        </div>
                                                    </div>
                                                ))}
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
                                        {!value ? (
                                            <div className="flex flex-col">
                                                <span className="text-[#868A91] mb-2">
                                                    优惠金额
                                                    {/* {currentSelect.name && `（${currentSelect?.name}）`} */}
                                                </span>
                                                <span className="text-[#de4437] text-2xl ">
                                                    ￥{(currentSelect?.discountPrice / 100).toFixed(2)}
                                                </span>
                                            </div>
                                        ) : (
                                            <div className="flex flex-col">
                                                <span className="text-[#868A91] mb-2">优惠金额</span>
                                                <span className="text-[#de4437] text-2xl ">￥{(1000 / 100).toFixed(2)}</span>
                                            </div>
                                        )}
                                        {!value ? (
                                            <div className="flex flex-col ml-[30%]">
                                                <span className="text-[#868A91] mb-2">订单总价</span>
                                                <span className="text-[#de4437] text-2xl font-semibold">
                                                    ￥{(currentSelect?.payPrice / 100).toFixed(2)}
                                                </span>
                                            </div>
                                        ) : (
                                            <div className="flex flex-col ml-[30%]">
                                                <span className="text-[#868A91] mb-2">订单总价</span>
                                                <span className="text-[#de4437] text-2xl font-semibold">￥{(4900 / 100).toFixed(2)}</span>
                                            </div>
                                        )}
                                    </div>
                                    {!!value && (
                                        <div className="flex items-center">
                                            <Checkbox
                                                checked={checked}
                                                size="small"
                                                className="p-1"
                                                onChange={() => setChecked(!checked)}
                                            />
                                            <span className="text-[#6E7378]">
                                                我已知晓 订阅后将
                                                <span className="text-[red]">每月自动续费</span>
                                                ，可随时一键取消
                                            </span>
                                        </div>
                                    )}
                                    <Button
                                        // disabled={!value ? !canSubmit : !checked}
                                        onClick={() =>
                                            // !value
                                            //     ? handleCreateOrder(selectCode, currentSelect.discountCouponStatus ? discountCode : '')
                                            //     : handleCreateOrder(currentSelect.payId, '', 2)
                                            handleCreateOrder(currentSelect.payId)
                                        }
                                        className="w-[300px] mt-4"
                                        color="secondary"
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
                                        立即支付
                                    </Button>
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
