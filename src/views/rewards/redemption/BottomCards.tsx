import React, { useEffect, useRef, useState } from 'react';
import Grid from '@mui/material/Grid';
import BottomCard from './BottomCard';
import GroupAddIcon from '@mui/icons-material/GroupAdd';
import PersonAddIcon from '@mui/icons-material/PersonAdd';
import ShareIcon from '@mui/icons-material/Share';
import PollIcon from '@mui/icons-material/Poll';
import GroupAdd from './GroupAdd';
import Share from './Share';
import axios from 'utils/axios';
import { closeSnackbar, openSnackbar } from 'store/slices/snackbar';
import { dispatch } from 'store';

const BottomCards: React.FC = () => {
    const [openGroupAdd, setOpenGroupAdd] = useState(false);
    const [openShare, setOpenShare] = useState(false); // 新增的状态
    const timerRef = useRef<NodeJS.Timeout | null>(null);

    // Define handle functions
    const handleOpenGroupAdd = () => setOpenGroupAdd(true);
    const handleCloseGroupAdd = () => setOpenGroupAdd(false);
    const handleOpenShare = () => setOpenShare(true); // 新增的打开函数
    const handleCloseShare = () => setOpenShare(false); // 新增的关闭函数
    const handleInvite = async () => {
        try {
            const response = await axios.get({
                url: '/llm/auth/user/detail',
                headersType: 'application/json'
            });
            if (response?.inviteCode) {
                const currentURL = window.location.protocol + '//' + window.location.host;
                const inviteURL = `${currentURL}/register?inviteCode=${response.inviteCode}`; // 创建邀请链接

                navigator.clipboard
                    .writeText(inviteURL)
                    .then(() => {
                        dispatch(
                            openSnackbar({
                                open: true,
                                message: '链接复制成功',
                                variant: 'alert',
                                anchorOrigin: { vertical: 'top', horizontal: 'center' },
                                alert: {
                                    color: 'success'
                                },
                                close: false
                            })
                        );
                        timerRef.current = setTimeout(() => {
                            dispatch(closeSnackbar());
                        }, 2000);
                    })
                    .catch((err) => {
                        console.error('Could not copy text: ', err);
                    });
            } else {
                console.error('请求失败');
            }
        } catch (err: any) {
            console.error('请求失败');
        }
    };
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
            description: '加入copydnoe官方体验群即可获取相应免费权益包',
            buttonText: '点击加入',
            Icon: GroupAddIcon,
            endText: '字: 5000 / 图: 10 / 视频: 5',
            onClick: handleOpenGroupAdd
        },
        {
            title: '方法二',
            subtitle: '邀请注册',
            description: '邀请多少，送多少，无上限发送链接邀请注册后，即可获取相应免费权益包',
            buttonText: '复制链接',
            Icon: PersonAddIcon,
            endText: '字: 10000 / 图: 20 / 视频: 8',
            onClick: handleInvite
        },
        {
            title: '方法三',
            subtitle: '社媒分享',
            description: '多分享，多次送，无上限社交媒体发布测评，截图认证即可获取免费权益',
            buttonText: '点击参加',
            Icon: ShareIcon,
            endText: '字: 5000 / 图: 30 / 视频: 10',
            onClick: handleOpenShare
        },
        {
            title: '方法四',
            subtitle: '参与用户调研',
            description: '模型不够满意？你的需求我们帮你实现',
            buttonText: '点击参加',
            Icon: PollIcon,
            endText: '字: 5000 / 图: 10 / 视频: 5',
            onClick: () => alert('点击参加')
        }
    ];
    return (
        <div>
            <Grid container spacing={2}>
                {cardsData.map((card, index) => (
                    <Grid item xs={12} md={6} lg={3} key={index}>
                        <BottomCard {...card} height={{ xs: '220px', sm: '240px', md: '260px' }} onClick={card.onClick} />
                    </Grid>
                ))}
            </Grid>
            <GroupAdd open={openGroupAdd} handleClose={handleCloseGroupAdd} />
            <Share open={openShare} handleClose={handleCloseShare} />
        </div>
    );
};

export default BottomCards;
