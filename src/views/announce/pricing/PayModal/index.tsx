import React from 'react';

// material-ui
import { CardContent, CardProps, Divider, Grid, IconButton, Modal } from '@mui/material';

// project imports
import MainCard from 'ui-component/cards/MainCard';

// assets
import CloseIcon from '@mui/icons-material/Close';
import { gridSpacing } from 'store/constant';
import { QRCode } from 'antd';

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
    isDataPlus?: boolean;
}

const Body = React.forwardRef(
    ({ modalStyle, handleClose, url, isTimeout, onRefresh, payPrice, isDataPlus }: BodyProps, ref: React.Ref<HTMLDivElement>) => (
        <div ref={ref} tabIndex={-1}>
            <MainCard
                style={{
                    position: 'absolute',
                    width: '350px',
                    top: '50%',
                    left: '50%',
                    transform: 'translate(-50%, -50%)'
                }}
                title={isDataPlus ? '加油包购买' : '套餐购买'}
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
                            <div className="flex justify-center flex-col items-center">
                                <div className="">
                                    <span className="font-semibold text-lg">支付金额:</span>
                                    <span className="text-[#f50] text-lg ml-1 font-semibold ">￥{payPrice?.toFixed(2)}</span>
                                </div>
                                <div className="text-base mb-2 ">请扫描下方二维码完成支付</div>
                                {/* <QRCode
                                    size={250}
                                    value={url || 'https://mofaai.com.cn'}
                                    errorLevel={'H'}
                                    onRefresh={() => onRefresh()}
                                    status={isTimeout ? 'expired' : url ? 'active' : 'loading'}
                                    icon={
                                        'data:image/png;base64,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'
                                    }
                                /> */}
                                {url.startsWith('weixin') ? (
                                    <QRCode
                                        size={220}
                                        value={url || 'https://mofaai.com.cn'}
                                        errorLevel={'H'}
                                        // onRefresh={() => onRefresh()}
                                        // status={isTimeout ? 'expired' : url ? 'active' : 'loading'}
                                    />
                                ) : (
                                    <iframe className={'w-[208px] h-[208px] overflow-hidden'} title={'支付码'} src={url} frameBorder={0} />
                                )}
                                <div className="text-sm mt-2">二维码将在5分钟内失效</div>
                            </div>
                        </Grid>
                    </Grid>
                </CardContent>
                <Divider />
            </MainCard>
        </div>
    )
);

// ==============================|| SIMPLE MODAL ||============================== //
export function PayModal({
    open,
    handleClose,
    url,
    isTimeout,
    onRefresh,
    isDataPlus,
    payPrice
}: {
    open: boolean;
    handleClose: () => void;
    url: string;
    isTimeout?: boolean;
    onRefresh: () => void;
    isDataPlus?: boolean;
    payPrice?: number;
}) {
    // getModalStyle is not a pure function, we roll the style only on the first render
    const [modalStyle] = React.useState(getModalStyle);

    return (
        <Grid container justifyContent="flex-end">
            <Modal
                open={open}
                onClose={(e, reason) => {
                    if (reason === 'backdropClick') return;
                    handleClose();
                }}
                aria-labelledby="modal-title"
                aria-describedby="modal-description"
            >
                <Body
                    modalStyle={modalStyle}
                    handleClose={handleClose}
                    url={url}
                    isTimeout={isTimeout}
                    onRefresh={onRefresh}
                    payPrice={payPrice}
                    isDataPlus={isDataPlus}
                />
            </Modal>
        </Grid>
    );
}
