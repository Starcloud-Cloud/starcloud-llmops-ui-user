import React from 'react';
import Modal from '@mui/material/Modal';
import Typography from '@mui/material/Typography';
import IconButton from '@mui/material/IconButton';
import CloseIcon from '@mui/icons-material/Close';
import MainCard from 'ui-component/cards/MainCard';
import mofabijiwechat from 'assets/images/landing/mofabijiwechat.png';
import { CardContent, CardMedia } from '@mui/material';

interface CustomModalProps {
    open: boolean;
    handleClose: () => void;
}

const GroupAdd: React.FC<CustomModalProps> = ({ open, handleClose }) => {
    return (
        <Modal open={open} onClose={handleClose} aria-labelledby="modal-title" aria-describedby="modal-description">
            <div
                style={{
                    position: 'absolute',
                    top: '50%',
                    left: '50%',
                    transform: 'translate(-50%, -50%)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center'
                }}
            >
                <IconButton
                    onClick={handleClose}
                    size="large"
                    aria-label="close modal"
                    sx={{
                        position: 'absolute',
                        top: 8,
                        right: 8
                    }}
                >
                    <CloseIcon fontSize="small" />
                </IconButton>
                <MainCard
                    sx={{
                        p: 4,
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'center',
                        justifyContent: 'center',
                        width: { lg: 450 }
                    }}
                    title="加入官方体验群"
                >
                    <CardContent
                        sx={{
                            display: 'flex',
                            flexDirection: 'column',
                            alignItems: 'center',
                            justifyContent: 'center'
                        }}
                    >
                        <CardMedia component="img" image={mofabijiwechat} alt="img1" sx={{ width: { xs: '80%', sm: '80%', md: '80%' } }} />
                        <Typography id="modal-description" variant="body1" sx={{ mt: 2 }}>
                            扫码加入用户群，可获取基础免费权益包
                        </Typography>
                        <Typography variant="body2" sx={{ mt: 2 }}>
                            送50魔法豆
                        </Typography>
                    </CardContent>
                </MainCard>
            </div>
        </Modal>
    );
};

export default GroupAdd;
