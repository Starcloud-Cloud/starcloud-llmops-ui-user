import { discountNewUser } from 'api/vip';
import vipModal from 'assets/images/pay/inviteUser.png';
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import type { CountdownProps } from 'antd';
import { Statistic } from 'antd';
import dayjs from 'dayjs';
import infoStore from 'store/entitlementAction';
import copy from 'clipboard-copy';
import { dispatch } from 'store';
import { openSnackbar } from 'store/slices/snackbar';
const { Countdown } = Statistic;

export const InviteUser = ({ onClose }: { onClose: any }) => {
    const { use } = infoStore();
    const navigate = useNavigate();
    const [endTime, setEndTime] = useState('');

    useEffect(() => {
        discountNewUser().then((res) => {
            if (res.isInviteUser) {
                setEndTime(res.inviteEndTime);
            }
        });
    }, []);

    return (
        <div className={'fixed inset-0 flex items-center justify-center z-[9999] bg-[#00000073] cursor-pointer'}>
            <div className="relative">
                <img
                    className="w-[365px]"
                    src={vipModal}
                    onClick={() => {
                        navigate('/subscribe');
                    }}
                />
                <div className="flex items-baseline text-[#f0d6a4] absolute top-[112px] left-[82px]">
                    <span>距离结束还剩</span>
                    {endTime && (
                        <Countdown
                            valueStyle={{
                                color: '#f0d6a4',
                                fontSize: '14px'
                            }}
                            title=""
                            value={endTime}
                            format="D天H时m分s秒"
                        />
                    )}
                </div>
                <div
                    style={{
                        bottom: '125px',
                        left: '50px'
                    }}
                    className={'absolute text-[#d4c399]'}
                >
                    每邀请3名好友注册即可以9.9元享周体验包
                </div>
                <div
                    style={{
                        bottom: '105px',
                        left: '45px'
                    }}
                    className={'absolute bottom-[104px] text-[#d4c399] left-[35px] '}
                >
                    {window.location.protocol + '//' + window.location.host + '/login?q=' + use?.inviteCode}
                </div>

                <div
                    onClick={() => {
                        navigate('/subscribe');
                    }}
                    className={'absolute  bottom-[40px] text-[#1d0b04] left-[143px] text-xl cursor-pointer font-semibold'}
                >
                    立即购买
                </div>
                <svg
                    onClick={() => {
                        onClose();
                    }}
                    // className="absolute right-[-32px] top-[-32px] cursor-pointer"
                    className="absolute right-[175px] bottom-[-45px] cursor-pointer"
                    viewBox="0 0 1024 1024"
                    version="1.1"
                    xmlns="http://www.w3.org/2000/svg"
                    p-id="5690"
                    width="32"
                    height="32"
                >
                    <path
                        d="M512 451.6608 403.3536 343.0144a42.606933 42.606933 0 0 0-60.305067 0.034133 42.666667 42.666667 0 0 0-0.034133 60.305067L451.6608 512 343.0144 620.6464a42.606933 42.606933 0 0 0 0.034133 60.305067 42.666667 42.666667 0 0 0 60.305067 0.034133L512 572.3392l108.6464 108.6464a42.606933 42.606933 0 0 0 60.305067-0.034133 42.666667 42.666667 0 0 0 0.034133-60.305067L572.3392 512l108.6464-108.6464a42.606933 42.606933 0 0 0-0.034133-60.305067 42.666667 42.666667 0 0 0-60.305067-0.034133L512 451.6608zM512 1024C229.666133 1024 0 794.333867 0 512S229.666133 0 512 0s512 229.666133 512 512-229.666133 512-512 512zm0-938.666667c-235.264 0-426.666667 191.402667-426.666667 426.666667s191.402667 426.666667 426.666667 426.666667 426.666667-191.402667 426.666667-426.666667-191.402667-426.666667-426.666667-426.666667z"
                        fill="#ecd2ad"
                        p-id="5691"
                    ></path>
                </svg>
            </div>
        </div>
    );
};
