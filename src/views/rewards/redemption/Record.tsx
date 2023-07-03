import React from 'react';
import CloseIcon from '@mui/icons-material/Close';
import { Modal, IconButton, Typography, CardContent, CardMedia } from '@mui/material';
import MainCard from 'ui-component/cards/MainCard';
import wechat1 from 'assets/images/landing/wechat.png';

interface ShareProps {
    open: boolean;
    handleClose: () => void;
}

const Record: React.FC<ShareProps> = ({ open, handleClose }) => {
    const socialRules = [
        {
            platform: '朋友圈',
            description: '用户在朋友圈或群组里发布关于产品的种草信息，保存3小时以上或10人点赞，即可免费换取权益；'
        },
        {
            platform: '小红书',
            description:
                '用户在小红书发布产品相关的种草图文推送，保持1天以上或10人点赞，即可免费换取权益，符合要求的推送，每篇可兑换一次权益；'
        },
        {
            platform: '微博',
            description: '用户在微博推送产品相关的博文和图片，保留1天以上或10人点赞，即可免费换取权益，符合要求的博文，每篇可兑换一次权益；'
        },
        {
            platform: '知乎',
            description: '用户在知乎发布与产品相关的回答，保留1天以上或10人点赞，即可免费获取权益，符合要求的博文，每片可兑换一次权益；'
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
                        width: { xs: 500, lg: 700 }
                    }}
                    title="发布产品好评"
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
                            pt: 0, // 调整此值来减小标题和内容之间的间距
                            display: 'flex',
                            flexDirection: 'column',
                            alignItems: 'center',
                            justifyContent: 'center'
                        }}
                    >
                        <Typography id="modal-description" sx={{ mb: 1 }}>
                            在朋友圈/小红书/微博/知乎/抖音或其他社媒平台上发布产品相关文章和图片信息并符合要求，保留1天以上或10人点赞，即可免费获取权益。每条可兑换一次权益。
                        </Typography>

                        {socialRules.map((item, index) => (
                            <div key={index} style={{ marginBottom: '5px' }}>
                                <Typography variant="h6" component="h3">
                                    {item.platform}
                                </Typography>
                                <Typography>{item.description}</Typography>
                            </div>
                        ))}

                        <CardMedia component="img" image={wechat1} alt="img1" sx={{ width: { xs: '30%', sm: '30%', md: '30%' } }} />

                        <Typography sx={{ mt: 1 }}>详情加入魔法AI体验群咨询</Typography>
                    </CardContent>
                </MainCard>
            </div>
        </Modal>
    );
};

export default Record;
