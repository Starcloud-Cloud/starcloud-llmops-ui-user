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
import Record from './Record';
import { Button } from '@mui/material';

const BottomCards: React.FC = () => {
    const [openGroupAdd, setOpenGroupAdd] = useState(false);
    const [openShare, setOpenShare] = useState(false); // 新增的状态
    const [openRecord, setOpenRecord] = useState(false); // 新增的状态
    const timerRef = useRef<NodeJS.Timeout | null>(null);

    // Define handle functions
    const handleOpenGroupAdd = () => setOpenGroupAdd(true);
    const handleCloseGroupAdd = () => setOpenGroupAdd(false);
    const handleOpenShare = () => setOpenShare(true); // 新增的打开函数
    const handleCloseShare = () => setOpenShare(false); // 新增的关闭函数
    const handleOpenRecord = () => setOpenRecord(true); // 新增的打开函数
    const handleCloseRecord = () => setOpenRecord(false); // 新增的关闭函数

    const handleInvite = async () => {
        try {
            const response = await axios.get({
                url: '/llm/auth/user/detail',
                headersType: 'application/json'
            });
            if (response?.inviteCode) {
                const currentURL = window.location.protocol + '//' + window.location.host;
                const inviteURL = `${currentURL}/register?q=${response.inviteCode}`; // 创建邀请链接

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
            description: '加入魔法AI官方社群即可获得相应权益包',
            buttonText: '点击加入',
            Icon: GroupAddIcon,
            endText: '送5000字/2张图片',
            onClick: handleOpenGroupAdd
        },
        {
            title: '方法二',
            subtitle: '邀请注册',
            description: '注册一位送一次，无上限,发送链接邀请注册，每注册一位获取一个权益包',
            buttonText: '复制链接',
            Icon: PersonAddIcon,
            endText: '送5000字/2张图片',
            onClick: handleInvite
        },
        {
            title: '方法三',
            subtitle: '社媒分享',
            description: '分享一次送一次，无上限,社交媒体发布测评，截图认证可获取权益包',
            buttonText: '点击参加',
            Icon: ShareIcon,
            endText: '送5000字/2张图片',
            onClick: handleOpenShare
        },
        {
            title: '方法四',
            subtitle: '参与用户调研',
            description: '需要什么模板?哪些模板不满意？您的建议是我们改进的动力。',
            buttonText: '点击参加',
            Icon: PollIcon,
            endText: '送5000字/2张图片',
            onClick: () => window.open('http://ov9t0w4iwaq9xq9l.mikecrm.com/OX02r3z', '_blank')
        }
    ];
    return (
        <div>
            <Grid container spacing={2}>
                {cardsData.map((card, index) => (
                    <Grid item xs={12} md={6} lg={4} xl={3} key={index}>
                        <BottomCard {...card} height={{ xs: '220px', md: '260px', lg: '280px', xl: '300px' }} onClick={card.onClick} />
                    </Grid>
                ))}
            </Grid>

            <Grid container justifyContent="center">
                <Button variant="outlined" onClick={handleOpenRecord}>
                    权益记录页面
                </Button>
            </Grid>
            <GroupAdd open={openGroupAdd} handleClose={handleCloseGroupAdd} />
            <Share open={openShare} handleClose={handleCloseShare} />
            <Record open={openRecord} handleClose={handleCloseRecord} />
        </div>
    );
};

export default BottomCards;
