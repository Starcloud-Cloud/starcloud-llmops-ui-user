// material-ui
import CloseIcon from '@mui/icons-material/Close';
import { Button, CardActions, CardContent, Divider, Grid, IconButton, Modal, TextField } from '@mui/material';
import { useTheme } from '@mui/material/styles';
import { t } from 'hooks/web/useI18n';
import { useState } from 'react';
import { gridSpacing } from 'store/constant';
import MainCard from 'ui-component/cards/MainCard';
import QRCode from 'qrcode.react';
import CopyToClipboard from 'react-copy-to-clipboard';
import { dispatch } from 'store';
import { openSnackbar } from 'store/slices/snackbar';

export default function CopySiteModal({
    open,
    setOpen,
    uid,
    mode
}: {
    open: boolean;
    setOpen: (open: boolean) => void;
    uid: string;
    mode: undefined | string;
}) {
    const handleClose = () => {
        setOpen(false);
    };

    const downloadQRCode = () => {
        const canvas = document.getElementById('qrCode')?.querySelector<HTMLCanvasElement>('canvas');
        if (canvas) {
            const url = canvas.toDataURL();
            const a = document.createElement('a');
            a.download = 'QRCode.png';
            a.href = url;
            document.body.appendChild(a);
            a.click();
            document.body.removeChild(a);
        }
    };

    const URL = `${window.location.origin}/${mode === 'CHAT' ? 'cb_web' : 'app_web'}/${uid}`;

    return (
        <Modal open={open} onClose={handleClose} aria-labelledby="modal-title" aria-describedby="modal-description">
            <MainCard
                style={{
                    position: 'absolute',
                    top: '50%',
                    left: '50%',
                    transform: 'translate(-50%, -50%)'
                }}
                title={'复制链接'}
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
                        <div className={'w-full flex flex-col'}>
                            <div>
                                <div className="text-lg">复制链接</div>
                                <div className="text-base">
                                    <span className="text-base">{URL}</span>
                                    <CopyToClipboard
                                        text={URL}
                                        onCopy={() =>
                                            dispatch(
                                                openSnackbar({
                                                    open: true,
                                                    message: '复制成功',
                                                    variant: 'alert',
                                                    alert: {
                                                        color: 'success'
                                                    },
                                                    close: false,
                                                    anchorOrigin: { vertical: 'top', horizontal: 'right' },
                                                    transition: 'SlideLeft'
                                                })
                                            )
                                        }
                                    >
                                        <span className="text-[#5e35b1] cursor-pointer text-base ml-3">复制</span>
                                    </CopyToClipboard>
                                </div>
                            </div>
                            <Divider className="my-5" />
                            <div id="qrCode">
                                <div className="text-lg mt-1">二维码</div>
                                <div className="text-base items-center flex">
                                    <QRCode value={URL} />
                                    <span className="text-[#5e35b1] cursor-pointer text-base ml-3" onClick={downloadQRCode}>
                                        保存
                                    </span>
                                </div>
                            </div>
                        </div>
                    </Grid>
                </CardContent>
            </MainCard>
        </Modal>
    );
}
