import CloseIcon from '@mui/icons-material/Close';
import { CardContent, CardMedia, IconButton, Modal, Typography } from '@mui/material';
import douyin from 'assets/images/landing/douyin.png';
import redBook from 'assets/images/landing/red-book-qrcode.png';
import MainCard from 'ui-component/cards/MainCard';
import { Popover } from 'antd';
import workWechatPay from 'assets/images/landing/work_wechat_pay.png';
import sph from 'assets/images/pages/sph.jpg';

interface ShareProps {
    open: boolean;
    handleClose: () => void;
}

const Follow: React.FC<ShareProps> = ({ open, handleClose }) => {
    const socialPlatforms = [
        {
            name: '视频号',
            // link: 'https://www.xiaohongshu.com/user/profile/630d7122000000000f0056da',
            link: '',
            image: sph
        },
        {
            name: '官方抖音账号',
            link: 'https://www.douyin.com/user/MS4wLjABAAAAr50QU2RZbGT7mWYL66Sex9dN988l3Nc0R5v3ZpM3RPx0Rc06U0RQkbAa-9MhnqPw',
            image: douyin
        }
    ];

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
                <MainCard
                    sx={{
                        p: 2,
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'center',
                        justifyContent: 'center',
                        maxHeight: '90vh', // 将高度稍微减小一些
                        overflowY: 'auto',
                        width: { xs: 500, lg: 700 },
                        '.MuiCardContent-root': {
                            paddingTop: '0 !important'
                        }
                    }}
                    title="关注赢好礼"
                >
                    <IconButton
                        aria-label="close"
                        onClick={handleClose}
                        sx={{ position: 'absolute', right: 15, top: 15, bgcolor: '#ffffff' }}
                    >
                        <CloseIcon />
                    </IconButton>

                    <CardContent
                        sx={{
                            pt: 0,
                            display: 'flex',
                            flexDirection: 'column',
                            alignItems: 'center',
                            justifyContent: 'center'
                        }}
                    >
                        <Typography id="modal-description" sx={{ mb: 1 }}>
                            关注魔法AI的官方抖音号、小红书号，后台私信发送 "mofaai"
                            ，即可获取权益兑换码，可免费兑换基础权益5000字和2张图片。如有问题请加入魔法AI
                            <Popover
                                zIndex={9999}
                                content={
                                    <div className="flex justify-start items-center flex-col">
                                        <img className="w-40" src={workWechatPay} alt="" />
                                    </div>
                                }
                                trigger="hover"
                            >
                                <span className="text-[#1e88e5] cursor-pointer">微信群联系运营人员</span>
                            </Popover>
                            。
                        </Typography>

                        <div style={{ display: 'flex', flexDirection: 'row', justifyContent: 'space-between' }}>
                            {socialPlatforms.map((platform, index) => (
                                <div
                                    key={index}
                                    style={{ marginBottom: '5px', display: 'flex', flexDirection: 'column', alignItems: 'center', flex: 1 }}
                                >
                                    <CardMedia
                                        component="img"
                                        image={platform.image}
                                        alt={platform.name}
                                        sx={{ width: { xs: '80%', sm: '80%', md: '80%' } }}
                                    />
                                    <Typography variant="h6" component="h3">
                                        {platform.name}
                                    </Typography>
                                </div>
                            ))}
                        </div>

                        <Typography sx={{ mt: 1 }}>详情加入魔法AI体验群咨询</Typography>
                    </CardContent>
                </MainCard>
            </div>
        </Modal>
    );
};

export default Follow;
