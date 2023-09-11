import { Button, CardContent, IconButton, Modal } from '@mui/material';
import MainCard from 'ui-component/cards/MainCard';
import CloseIcon from '@mui/icons-material/Close';
import upgradeModel from 'assets/images/chat/online-update.png';
import { useNavigate } from 'react-router-dom';

export const UpgradeOnlineModal = ({ handleClose, open }: { handleClose: () => void; open: boolean }) => {
    const navigate = useNavigate();
    return (
        <Modal open={open} onClose={handleClose} aria-labelledby="modal-title" aria-describedby="modal-description">
            <MainCard
                style={{
                    position: 'absolute',
                    width: '530px',
                    top: '50%',
                    left: '50%',
                    transform: 'translate(-50%, -50%)'
                }}
                title="联网查询功能仅为VIP用户开放"
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
                            <img width={204} src={upgradeModel} />
                            <div className="text-sm text-[#152737] my-4">
                                升级后，魔法AI可智能利用互联网，实时获取全网最新数据，提高精度和速度
                            </div>
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
