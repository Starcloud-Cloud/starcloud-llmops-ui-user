import React, { useEffect } from 'react';
import { checkSignInStatus, signIn } from 'api/rewards';
import MiddleCard from './MiddleCard';
import AccountBoxIcon from '@mui/icons-material/AccountBox';
import EventNoteIcon from '@mui/icons-material/EventNote';
import Grid from '@mui/material/Grid';
import useUserStore from 'store/user';
import { useAllDetail } from 'contexts/JWTContext';

const MiddleCards = () => {
    const allDetail = useAllDetail();
    const signInStatus = useUserStore((state) => state.signInStatus);
    const setSignInStatus = useUserStore((state) => state.setSignInStatus);
    useEffect(() => {
        checkSignInStatus().then((data) => {
            if (data.todaySignIn) {
                setSignInStatus(true);
            }
        });
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);
    const handleSignIn = () => {
        signIn().then((result) => {
            if (result) {
                setSignInStatus(true);
                allDetail?.setPre(allDetail?.pre + 1);
            }
        });
    };

    const cardInfo = [
        {
            Icon: AccountBoxIcon,
            title: '注册魔法AI账号',
            description: <div className="h-[63px]">送10魔法豆/5点作图</div>,
            buttonText: '已注册',
            isDisabled: true,
            onClick: undefined
        },
        {
            Icon: EventNoteIcon,
            title: '每日签到',
            description: (
                <div>
                    <span>方式一：点击右边“签到”即可获得2魔法豆/1点作图</span>
                    <br />
                    <span>方式二：魔法AI小助手公众号“菜单栏--权益领取--点击签到”即可</span>
                </div>
            ),
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
