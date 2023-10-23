import './index.css';
// import { Popover } from 'antd';
import { usePWAInstall } from 'react-use-pwa-install';

export const DownLoadBtn = () => {
    const install = usePWAInstall();
    return install ? (
        <button className="btn-grad" onClick={install}>
            下载到桌面
        </button>
    ) : null;
};
