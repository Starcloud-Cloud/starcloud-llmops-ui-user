import CloseIcon from '@mui/icons-material/Close';
import { CardContent, CardMedia, IconButton, Modal, Typography } from '@mui/material';
import mofabijiwechat from 'assets/images/landing/juzhen/wechat.png';
import redbook from 'assets/images/landing/juzhen/redbook.jpg';
import MainCard from 'ui-component/cards/MainCard';
import { Popover } from 'antd';

interface ShareProps {
    open: boolean;
    handleClose: () => void;
}

const Follow: React.FC<ShareProps> = ({ open, handleClose }) => {
    const socialPlatforms = [
        {
            name: '官方小红书账号',
            link: 'https://www.douyin.com/user/MS4wLjABAAAAr50QU2RZbGT7mWYL66Sex9dN988l3Nc0R5v3ZpM3RPx0Rc06U0RQkbAa-9MhnqPw',
            image: redbook
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
                            关注魔法笔记的官方小红书，公共号，后台私信发送 "mofabiji" ，即可获取权益兑换码。如有问题请加入魔法笔记
                            微信群联系运营人员。
                            <Popover
                                zIndex={9999}
                                content={
                                    <div className="flex justify-start items-center flex-col">
                                        <img className="w-40" src={mofabijiwechat} alt="" />
                                    </div>
                                }
                                trigger="hover"
                            >
                                <span className="text-[#1e88e5] cursor-pointer">详情加入魔法笔记体验群咨询</span>
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
                                    <Typography mt={1} variant="h6" component="h3">
                                        {platform.name}
                                    </Typography>
                                </div>
                            ))}
                        </div>

                        <Typography sx={{ mt: 1 }}>详情加入魔法笔记体验群咨询</Typography>
                    </CardContent>
                </MainCard>
            </div>
        </Modal>
    );
};

export default Follow;
