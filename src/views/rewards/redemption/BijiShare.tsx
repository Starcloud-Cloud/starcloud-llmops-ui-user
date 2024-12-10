import React, { useState } from 'react';
import CloseIcon from '@mui/icons-material/Close';
import { Modal, IconButton, Typography, CardContent, CardMedia, Tooltip, Button, Grid } from '@mui/material';
import MainCard from 'ui-component/cards/MainCard';
import mofabijiwechat from 'assets/images/landing/juzhen/wechat.png';
import { CopyToClipboard } from 'react-copy-to-clipboard';
import { openSnackbar } from '../../../store/slices/snackbar';
import ContentCopyTwoToneIcon from '@mui/icons-material/ContentCopyTwoTone';
import { useDispatch } from '../../../store';

interface ShareProps {
    open: boolean;
    handleClose: () => void;
}

const Share: React.FC<ShareProps> = ({ open, handleClose }) => {
    const [openExample, setOpenExample] = useState(false);
    const dispatch = useDispatch();

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

    const texts = [
        '我最近在使用魔法笔记，发现还挺有用，推荐你试试',
        '分享一个我最近非常喜欢的AI工具，让我上瘾了！你也试试',
        '我最近非常喜欢的AI工具，有它我就不用加班了，不信你试试',
        '最近爆粉了吗，这款AI出的一键批量生产笔记，粉丝涨了不少，你也试试'
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
                        <div className={'w-full'}>
                            <Typography
                                variant="h5"
                                textAlign="right"
                                sx={{ cursor: 'pointer', color: '#7e7e7e', my: 3, mr: 2 }}
                                onClick={() => setOpenExample(true)}
                            >
                                {'查看示例 >'}
                            </Typography>
                        </div>
                        <CardMedia component="img" image={mofabijiwechat} alt="img1" sx={{ width: { xs: '30%', sm: '30%', md: '30%' } }} />

                        <Typography sx={{ mt: 1 }}>详情加入魔法笔记体验群咨询</Typography>
                    </CardContent>
                </MainCard>
                <Modal
                    open={openExample}
                    onClose={() => setOpenExample(false)}
                    aria-labelledby="modal-title"
                    aria-describedby="modal-description"
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
                        <MainCard
                            sx={{
                                p: 2,
                                display: 'flex',
                                flexDirection: 'column',
                                alignItems: 'center',
                                justifyContent: 'center',
                                maxHeight: '90vh', // 将高度稍微减小一些
                                overflowY: 'auto',
                                width: { xs: 450, lg: 650 }
                            }}
                            title="分享示例"
                        >
                            <IconButton
                                aria-label="close"
                                onClick={() => setOpenExample(false)}
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
                                <Grid container direction="column" spacing={1}>
                                    {texts.map((item, index) => (
                                        <Grid item>
                                            <Typography id="modal-description" sx={{ mb: 1 }} gutterBottom>
                                                {`${index + 1}、${item}`}
                                                <CopyToClipboard
                                                    text={item}
                                                    onCopy={() =>
                                                        dispatch(
                                                            openSnackbar({
                                                                open: true,
                                                                message: '复制成功',
                                                                variant: 'alert',
                                                                alert: {
                                                                    color: 'success'
                                                                },
                                                                close: false,
                                                                anchorOrigin: { vertical: 'top', horizontal: 'right' },
                                                                transition: 'SlideLeft'
                                                            })
                                                        )
                                                    }
                                                >
                                                    <Tooltip title="复制">
                                                        <Button variant="contained" sx={{ ml: 1.5, px: 1, minWidth: 'auto' }}>
                                                            <ContentCopyTwoToneIcon sx={{ fontSize: '1rem' }} />
                                                        </Button>
                                                    </Tooltip>
                                                </CopyToClipboard>
                                            </Typography>
                                        </Grid>
                                    ))}
                                </Grid>
                            </CardContent>
                        </MainCard>
                    </div>
                </Modal>
            </div>
        </Modal>
    );
};

export default Share;
