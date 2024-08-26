import { EnvironmentOutlined } from '@ant-design/icons';
import { Descriptions, DescriptionsProps } from 'antd';

const items: DescriptionsProps['items'] = [
    {
        key: 'browserCode',
        label: '内核版本',
        children: <span id="browserCode"></span>
    },
    {
        key: 'os',
        label: '操作系统',
        children: <span id="os"></span>
    },
    {
        key: 'userAgent',
        label: 'User Agent',
        span: 2,
        children: <span id="userAgent">{navigator.userAgent}</span>
    },
    {
        key: 'language',
        label: '语言',
        children: <span id="language"></span>
    },
    {
        key: 'timeZone',
        label: '时区',
        children: <span id="timeZone"></span>
    },
    {
        key: 'canvas',
        label: 'Canvas指纹',
        children: <span id="canvas"></span>
    },
    {
        key: 'webgl',
        label: 'Webgl指纹',
        children: <span id="webgl"></span>
    },
    {
        key: 'plugins',
        label: 'Plugins指纹',
        children: <span id="plugins"></span>
    },
    {
        key: 'audio',
        label: 'Audio指纹',
        children: <span id="audio"></span>
    },
    {
        key: 'screen',
        label: 'Screen指纹',
        children: <span id="screen"></span>
    },
    {
        key: 'font',
        label: 'Font指纹',
        children: <span id="font"></span>
    }
];

const Fingerprint = () => {
    return (
        <div style={{ width: '100vw', height: '100vh' }}>
            <iframe className="hidden" src="https://ip77.net/" />

            <div>
                <div>
                    <EnvironmentOutlined />
                    <span id="ip" className="text-4xl"></span>
                </div>
                <div className="ipAddress"></div>
            </div>
            <div className="w-[100%] justify-center">
                <div className="w-[80%]">
                    <Descriptions title="指纹" bordered items={items} column={2} />
                </div>
            </div>
        </div>
    );
};

export default Fingerprint;
