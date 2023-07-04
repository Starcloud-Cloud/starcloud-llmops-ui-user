import Modal from '@mui/material/Modal';
// import Typography from '@mui/material/Typography';
import IconButton from '@mui/material/IconButton';
import CloseIcon from '@mui/icons-material/Close';
import MainCard from 'ui-component/cards/MainCard';
import { CardMedia } from '@mui/material';

interface CustomModalProps {
    open: boolean;
    qrUrl: string | null;
    handleClose: () => void;
}

const LoginModal: React.FC<CustomModalProps> = ({ open, qrUrl, handleClose }) => {
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
                        p: 2,
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'center',
                        justifyContent: 'center',
                        width: { lg: 300 },
                        '.MuiCardContent-root': {
                            paddingTop: '0 !important'
                        }
                    }}
                    title="扫码登录"
                >
                    <CardMedia component="img" height="150" image={qrUrl ? qrUrl : 'https://via.placeholder.com/150'} alt="QR code" />
                </MainCard>
            </div>
        </Modal>
    );
};

export default LoginModal;
