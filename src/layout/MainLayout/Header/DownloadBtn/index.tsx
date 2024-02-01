import './index.css';
// import { Popover } from 'antd';
import { usePWAInstall } from 'react-use-pwa-install';
import { useNavigate } from 'react-router-dom';
import { isMobile } from 'react-device-detect';
import { useAllDetail } from 'contexts/JWTContext';
import { useEffect, useState } from 'react';
import { InviteUser } from 'ui-component/invite-user';

export const DownLoadBtn = () => {
    const install = usePWAInstall();
    return install ? (
        <button className="btn-grad" onClick={install}>
            下载应用到桌面
        </button>
    ) : null;
};

export const PayBtn = () => {
    const navigate = useNavigate();
    const allDetail = useAllDetail();
    const [text, setText] = useState('9.9老用户专享');
    const [open, setOpen] = useState(false);

    useEffect(() => {
        if (allDetail?.allDetail?.isNewUser) {
            setText('新用户限时体验9.9元');
        }
    }, []);

    const handleClick = () => {
        if (allDetail?.allDetail?.isNewUser) {
            navigate('/subscribe');
        } else {
            setOpen(true);
        }
    };

    return !isMobile ? (
        <>
            <button className="btn-grad flex items-center" onClick={() => handleClick()}>
                <span>{text}</span>
                <svg viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="1614" width="16" height="16">
                    <path d="M377.9 114.1h358.3l-136.4 268 231.5 0.3-485.1 559.3 139.5-356.4H222.6z" fill="#FED928" p-id="1615"></path>
                </svg>
            </button>
            {open && <InviteUser onClose={() => setOpen(false)} />}
        </>
    ) : null;
};
