import './index.css';
// import { Popover } from 'antd';
import { usePWAInstall } from 'react-use-pwa-install';
import { useNavigate } from 'react-router-dom';
import { isMobile } from 'react-device-detect';

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
    return !isMobile ? (
        <button className="btn-grad" onClick={() => navigate('/subscribe')}>
            限时5折升级套餐
        </button>
    ) : null;
};
