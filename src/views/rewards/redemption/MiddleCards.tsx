import React, { useEffect } from 'react';
import { checkSignInStatus, signIn } from 'api/rewards';
import MiddleCard from './MiddleCard';
import AccountBoxIcon from '@mui/icons-material/AccountBox';
import EventNoteIcon from '@mui/icons-material/EventNote';
import Grid from '@mui/material/Grid';
import useUserStore from 'store/user';

const MiddleCards = () => {
    const signInStatus = useUserStore((state) => state.signInStatus);
    const setSignInStatus = useUserStore((state) => state.setSignInStatus);
    useEffect(() => {
        checkSignInStatus().then((status) => {
            setSignInStatus(status);
        });
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);
    const handleSignIn = () => {
        signIn().then((result) => {
            if (result) {
                setSignInStatus(true);
            }
        });
    };

    const cardInfo = [
        {
            Icon: AccountBoxIcon,
            title: '注册 copydone账号',
            description: '字: 5000 / 图: 10 / 视频: 5',
            buttonText: '已注册',
            isDisabled: true,
            onClick: undefined
        },
        {
            Icon: EventNoteIcon,
            title: '每日签到即送',
            description: '字: 3000 / 图: 2 / 视频: 1',
            buttonText: signInStatus ? '已签到' : '立即签到',
            isDisabled: signInStatus ? true : false,
            onClick: !signInStatus ? handleSignIn : undefined
        }
    ];

    return (
        <Grid container spacing={2}>
            {cardInfo.map((card, index) => (
                <Grid key={index} item xs={12} md={6} sx={{ pb: 2, width: '100%' }}>
                    <MiddleCard
                        key={index}
                        Icon={card.Icon}
                        title={card.title}
                        description={card.description}
                        buttonText={card.buttonText}
                        isDisabled={card.isDisabled}
                        onClick={card?.onClick}
                    />
                </Grid>
            ))}
        </Grid>
    );
};

export default MiddleCards;
