import { Button, CardContent, IconButton, Modal } from '@mui/material';
import MainCard from 'ui-component/cards/MainCard';
import CloseIcon from '@mui/icons-material/Close';
import { useNavigate } from 'react-router-dom';
import workWechatPay from 'assets/images/landing/work_wechat_pay.png';
import { Alert, Divider } from 'antd';

const list = [
    '立享最低3000魔法豆300图片',
    '解锁GPT4、通义千问等大模型语言',
    '聊天机器人个性定制，多渠道发布',
    'Google/Amazon联网查询',
    '专属客服顾问提供专业指导'
];

export const PermissionUpgradeModal = ({
    handleClose,
    open,
    title = '您暂无该功能权限，升级会员，立享五折优惠！',
    from
}: {
    handleClose: () => void;
    open: boolean;
    title?: string;
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
                <CardContent className="p-[12px]">
                    <div className="flex justify-center flex-col items-center">
                        <div className="flex items-center justify-center flex-col">
                            <div className="text-sm text-[#152737] flex items-center flex-col">
                                <Alert message={title} type="warning" showIcon />
                                <div className="text-2xl py-2 text-[#6E48AA] mb-5">升级魔法AI，解锁更多权益</div>
                                {list.map((item, index) => (
                                    <>
                                        <div key={index} className="flex items-center justify-start w-full ml-10 text-base">
                                            <svg
                                                className="icon"
                                                viewBox="0 0 1024 1024"
                                                version="1.1"
                                                xmlns="http://www.w3.org/2000/svg"
                                                p-id="4338"
                                                width="20"
                                                height="20"
                                            >
                                                <path
                                                    d="M448 576 256 384 192 512 448 768 832 320 768 192Z"
                                                    fill="#666666"
                                                    p-id="4339"
                                                ></path>
                                            </svg>
                                            <span>{item}</span>
                                        </div>
                                        <Divider className="!my-2" />
                                    </>
                                ))}

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
