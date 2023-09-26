import React, { useEffect } from 'react';
import { checkSignInStatus, signIn } from 'api/rewards';
import MiddleCard from './MiddleCard';
import AccountBoxIcon from '@mui/icons-material/AccountBox';
import EventNoteIcon from '@mui/icons-material/EventNote';
import Grid from '@mui/material/Grid';
import useUserStore from 'store/user';
import { userBenefits } from 'api/template';
import userInfoStore from 'store/entitlementAction';

const MiddleCards = () => {
    const signInStatus = useUserStore((state) => state.signInStatus);
    const setSignInStatus = useUserStore((state) => state.setSignInStatus);
    const { setUserInfo }: any = userInfoStore();
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
                userBenefits().then((res) => {
                    setUserInfo(res);
                });
            }
        });
    };

    const cardInfo = [
        {
            Icon: AccountBoxIcon,
            title: '注册魔法AI账号',
            description: '送5000字/5张图片',
            buttonText: '已注册',
            isDisabled: true,
            onClick: undefined
        },
        {
            Icon: EventNoteIcon,
            title: '每日签到',
            description: '送3000字/2张图片',
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
