import { Button, CardContent, IconButton, Modal } from '@mui/material';
import MainCard from 'ui-component/cards/MainCard';
import CloseIcon from '@mui/icons-material/Close';
import gpt from 'assets/images/chat/gpt.png';
import { useNavigate } from 'react-router-dom';

export const UpgradeModelModal = ({ handleClose, open }: { handleClose: () => void; open: boolean }) => {
    const navigate = useNavigate();
    return (
        <Modal open={open} onClose={handleClose} aria-labelledby="modal-title" aria-describedby="modal-description">
            <MainCard
                style={{
                    position: 'absolute',
                    width: '350px',
                    top: '50%',
                    left: '50%',
                    transform: 'translate(-50%, -50%)'
                }}
                title="升级"
                content={false}
                secondary={
                    <IconButton onClick={handleClose} size="large" aria-label="close modal">
                        <CloseIcon fontSize="small" />
                    </IconButton>
                }
            >
                <CardContent>
                    <div className="flex justify-center flex-col items-center">
                        <div className="flex items-center justify-center flex-col">
                            <img width={204} src={gpt} />
                            <div className="text-sm text-[#152737] my-4">升级后，魔法AI为您提供更好的语言理解能力和更强大的对话系统</div>
                        </div>
                        <Button variant="contained" color={'secondary'} className="w-[200px]" onClick={() => navigate('/subscribe')}>
                            升级
                        </Button>
                    </div>
                </CardContent>
            </MainCard>
        </Modal>
    );
};
