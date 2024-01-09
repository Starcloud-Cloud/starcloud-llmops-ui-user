import { Button, CardContent, IconButton, Modal } from '@mui/material';
import MainCard from 'ui-component/cards/MainCard';
import CloseIcon from '@mui/icons-material/Close';
import { useNavigate } from 'react-router-dom';
import workWechatPay from 'assets/images/landing/work_wechat_pay.png';

export const UpgradeModel = ({
    handleClose,
    open,
    title,
    from
}: {
    handleClose: () => void;
    open: boolean;
    title: string;
    from: string;
}) => {
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
                            <div className="text-sm text-[#152737] my-4 flex items-center flex-col">
                                <img width={204} src={workWechatPay} />
                                <p className="text-lg text-center mb-1">{title}</p>
                                <p className=" text-center text-[#364152]">
                                    如需创建更多，可直接升级或联系产品顾问进一步了解，更有其他丰富权益可解锁。
                                </p>
                                <Button
                                    variant="contained"
                                    color={'secondary'}
                                    className="w-[200px] my-2"
                                    onClick={() => navigate(`/subscribe?from=${from}`)}
                                >
                                    直接升级
                                </Button>
                            </div>
                        </div>
                    </div>
                </CardContent>
            </MainCard>
        </Modal>
    );
};
