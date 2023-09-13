import { Button, CardContent, IconButton, Modal } from '@mui/material';
import MainCard from 'ui-component/cards/MainCard';
import CloseIcon from '@mui/icons-material/Close';
import { useNavigate } from 'react-router-dom';
import workWechatPay from 'assets/images/landing/work_wechat_pay.png';

export const UpgradeSkillModel = ({ handleClose, open }: { handleClose: () => void; open: boolean }) => {
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
                            <img width={204} src={workWechatPay} />
                            <div className="text-sm text-[#152737] my-4 flex items-center flex-col">
                                <p>添加技能个数已用完。</p>
                                <p>如需创建更多，请联系产品顾问进一步了解。</p>
                                <p>更有其他丰富权益可解锁。</p>
                            </div>
                        </div>
                        {/* <Button variant="contained" color={'secondary'} className="w-[200px]" onClick={() => navigate('/subscribe')}>
                            升级
                        </Button> */}
                    </div>
                </CardContent>
            </MainCard>
        </Modal>
    );
};
