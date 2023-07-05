import Modal from '@mui/material/Modal';
// import Typography from '@mui/material/Typography';
import IconButton from '@mui/material/IconButton';
import CloseIcon from '@mui/icons-material/Close';
import MainCard from 'ui-component/cards/MainCard';
import { CardMedia, Typography } from '@mui/material';

interface CustomModalProps {
    open: boolean;
    qrUrl: string | null;
    handleClose: () => void;
}

const LoginModal: React.FC<CustomModalProps> = ({ open, qrUrl, handleClose }) => {
    return (
        <Modal
            open={open}
            onClose={handleClose}
            aria-labelledby="modal-title"
            aria-describedby="modal-description"
            sx={{
                '& > div:focus-visible': { outline: 'none' }
            }}
        >
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
                        p: 2,
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'center',
                        justifyContent: 'center',
                        width: { lg: 270 },
                        '.MuiCardContent-root': {
                            paddingTop: '0 !important'
                        },
                        '.MuiCardHeader-root': {
                            paddingBottom: '0 !important'
                        },
                        '&:focus-visible': { outline: 'none' }
                    }}
                    title="扫码登录"
                >
                    <Typography sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
                        请打开微信扫码
                    </Typography>
                    <CardMedia component="img" height="200" image={qrUrl ? qrUrl : 'https://via.placeholder.com/200'} alt="QR code" />
                </MainCard>
            </div>
        </Modal>
    );
};

export default LoginModal;
