import React, { useEffect } from 'react';

// material-ui
import { Button, CardContent, CardProps, Divider, Grid, IconButton, Modal, Tab, Tabs } from '@mui/material';
import { Input, Radio, RadioChangeEvent } from 'antd';

const { Search } = Input;

// project imports
import MainCard from 'ui-component/cards/MainCard';

// assets
import CloseIcon from '@mui/icons-material/Close';
import { gridSpacing } from 'store/constant';
import dayjs from 'dayjs';
import Checkbox from '@mui/material/Checkbox';

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
    handleCreateOrder
}: {
    open: boolean;
    handleClose: () => void;
    handleFetchPay: (productCode?: string, noNeedProductCode?: string, discountCode?: string) => void;
    currentSelect: any;
    setCurrentSelect: (currentSelect: any) => void;
    handleCreateOrder: (code?: string, discountCode?: string, type?: number) => void;
}) {
    const [selectCode, setSelectCode] = React.useState('');
    const [discountCode, setDiscountCode] = React.useState('');
    const [value, setValue] = React.useState(0);
    const [checked, setChecked] = React.useState(false);

    const handleOnSearch = async (value: string) => {
        setDiscountCode(value);
        await handleFetchPay(selectCode, currentSelect.monthCode === selectCode ? currentSelect.yearCode : currentSelect.monthCode, value);
    };

    const handleRadio = async (e: RadioChangeEvent) => {
        setCurrentSelect((pre: any) => {
            return {
                ...pre,
                select: e.target.value === pre.monthCode ? '1' : '2'
            };
        });
        setSelectCode(e.target.value);
        await handleFetchPay(e.target.value, currentSelect.monthCode === e.target.value ? currentSelect.yearCode : currentSelect.monthCode);
    };

    useEffect(() => {
        setSelectCode(currentSelect?.select === '1' ? currentSelect?.monthCode : currentSelect?.yearCode);
    }, [currentSelect]);

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
                                    <Tab disabled={!currentSelect.monthCode.includes('basic')} label="订阅(立减10元)" {...a11yProps(1)} />
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
                                                ￥{(currentSelect?.originalAmount / 100).toFixed(2)}
                                            </span>
                                            <span className="text-xs">/元</span>
                                        </div>
                                    </div>
                                    <div className="flex justify-between items-center w-full mb-3">
                                        <span className="text-[#868A91]">{!value ? '购买时长' : '订阅时长'}</span>
                                        {!value ? (
                                            <span>
                                                <Radio.Group onChange={handleRadio} value={selectCode}>
                                                    <Radio value={currentSelect?.monthCode}>月</Radio>
                                                    <Radio value={currentSelect?.yearCode}>年</Radio>
                                                </Radio.Group>
                                            </span>
                                        ) : (
                                            <span className="text-sm text-[#868A91]">月付</span>
                                        )}
                                    </div>
                                    {!value && (
                                        <div className="flex w-full flex-col mb-3 mt-3">
                                            <span className="text-[#868A91] mb-2">折扣券</span>
                                            <div>
                                                <Search
                                                    placeholder="请输入折扣码"
                                                    enterButton={<span className="text-sm">检测有效性</span>}
                                                    size="large"
                                                    onSearch={handleOnSearch}
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
                                            </span>
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
                                                    {currentSelect.discountCouponName ? `（${currentSelect?.discountCouponName}）` : ''}
                                                </span>
                                                <span className="text-[#de4437] text-2xl ">
                                                    ￥{(currentSelect?.discountAmount / 100).toFixed(2)}
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
                                                    ￥{(currentSelect?.discountedAmount / 100).toFixed(2)}
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
                                        disabled={!value ? !canSubmit : !checked}
                                        onClick={() =>
                                            !value
                                                ? handleCreateOrder(selectCode, currentSelect.discountCouponStatus ? discountCode : '')
                                                : handleCreateOrder(currentSelect.monthCode, '', 2)
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
