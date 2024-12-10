import React, { useEffect, useRef, useState } from 'react';
import Grid from '@mui/material/Grid';
import BottomCard from './BottomCard';
import GroupAddIcon from '@mui/icons-material/GroupAdd';
import ShareIcon from '@mui/icons-material/Share';
import PollIcon from '@mui/icons-material/Poll';
import GroupAdd from './BijiGroupAdd';
import Share from './BijiShare';
import Follow from './BijiFollow';

const BijiBottomCards: React.FC = () => {
    const [openGroupAdd, setOpenGroupAdd] = useState(false);
    const [openShare, setOpenShare] = useState(false); // 新增的状态
    const [openFollow, setOpenFollow] = useState(false); // 新增的状态

    const timerRef = useRef<NodeJS.Timeout | null>(null);

    // Define handle functions
    const handleOpenGroupAdd = () => setOpenGroupAdd(true);
    const handleCloseGroupAdd = () => setOpenGroupAdd(false);
    const handleOpenShare = () => setOpenShare(true); // 新增的打开函数
    const handleCloseShare = () => setOpenShare(false); // 新增的关闭函数

    const handleOpenFollow = () => setOpenFollow(true); // 新增的打开函数
    const handleCloseFollow = () => setOpenFollow(false); // 新增的关闭函数
    useEffect(() => {
        return () => {
            if (timerRef.current) {
                clearTimeout(timerRef.current);
            }
        };
    }, []);
    const cardsData = [
        {
            title: '方法一',
            subtitle: '加入社群',
            description: '加入魔法笔记官方社群即可获得相应权益兑换码',
            buttonText: '点击加入',
            Icon: GroupAddIcon,
            endText: '送 10 魔法豆',
            onClick: handleOpenGroupAdd
        },
        {
            title: '方法二',
            subtitle: '社媒分享',
            description: '分享一次送一次，无上限,社交媒体发布测评，截图认证可获取权益兑换码',
            buttonText: '点击参加',
            Icon: ShareIcon,
            endText: '送10魔法豆',
            onClick: handleOpenShare
        },
        {
            title: '方法三',
            subtitle: '参与用户调研',
            description: '需要什么图片模板?哪些模板不满意？您的建议是我们改进的动力。',
            buttonText: '点击参加',
            Icon: PollIcon,
            endText: '送10魔法豆',
            onClick: () => window.open('http://www.mofabiji.com', '_blank')
        },
        {
            title: '方法四',
            subtitle: '关注 魔法笔记',
            description: '关注魔法笔记的官方小红书，后台私信发送 "mofabiji" ，即可获取权益兑换码',
            buttonText: '点击参加',
            Icon: ShareIcon,
            endText: '送10魔法豆',
            onClick: handleOpenFollow
        }
    ];
    return (
        <div>
            <Grid container spacing={2}>
                {cardsData.map((card, index) => (
                    <Grid item xs={12} md={6} lg={4} xl={3} key={index}>
                        <BottomCard {...card} height={{ xs: '220px', md: '240px', lg: '240px', xl: '240px' }} onClick={card.onClick} />
                    </Grid>
                ))}
            </Grid>

            <GroupAdd open={openGroupAdd} handleClose={handleCloseGroupAdd} />
            <Share open={openShare} handleClose={handleCloseShare} />
            <Follow open={openFollow} handleClose={handleCloseFollow} />
        </div>
    );
};

export default BijiBottomCards;
