// material-ui
import CloseIcon from '@mui/icons-material/Close';
import { Button, CardActions, CardContent, Divider, Grid, IconButton, Modal, TextField } from '@mui/material';
import { useTheme } from '@mui/material/styles';
import { t } from 'hooks/web/useI18n';
import { useState } from 'react';
import { gridSpacing } from 'store/constant';
import MainCard from 'ui-component/cards/MainCard';
import workWechatPay from 'assets/images/landing/work_wechat_pay.png';

export default function DomainModal({ open, setOpen }: { open: boolean; setOpen: (open: boolean) => void }) {
    const handleClose = () => {
        setOpen(false);
    };
    return (
        <Modal open={open} onClose={handleClose} aria-labelledby="modal-title" aria-describedby="modal-description">
            <MainCard
                style={{
                    position: 'absolute',
                    top: '50%',
                    left: '50%',
                    transform: 'translate(-50%, -50%)'
                }}
                title={'域名部署'}
                content={false}
                className="sm:w-[700px] xs:w-[300px]"
                secondary={
                    <IconButton onClick={handleClose} size="large" aria-label="close modal">
                        <CloseIcon fontSize="small" />
                    </IconButton>
                }
            >
                <CardContent>
                    <Grid container spacing={gridSpacing} className="w-full flex justify-center pt-[24px] ml-0">
                        <div className={'w-full flex flex-col items-center'}>
                            <div className="text-sm md:text-base">当前版本不可使用该功能。</div>
                            <div className="text-sm md:text-base">如需使用，请联系产品顾问进一步了解。</div>
                            <div className="text-sm  md:text-base">更有其他丰富权益可解锁。</div>
                            <img className="mt-3" width={200} height={200} src={workWechatPay} />
                        </div>
                    </Grid>
                </CardContent>
            </MainCard>
        </Modal>
    );
}
