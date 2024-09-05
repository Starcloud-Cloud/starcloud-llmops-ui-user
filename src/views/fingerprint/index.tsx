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
    },
    {
        key: 'JavascriptStatus',
        label: 'Javascript状态',
        children: <span id="JavascriptStatus"></span>
    },
    {
        key: 'DNTStatue',
        label: 'DNT状态',
        children: <span id="DNTStatus"></span>
    },
    {
        key: 'screenSize',
        label: '显示器尺寸',
        children: <span id="screenSize"></span>
    }
];

const Fingerprint = () => {
    return (
        <div style={{ width: '100vw', height: '100vh' }}>
            <iframe style={{ display: 'none' }} src="https://ip77.net/" />
            <div
                style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    flexDirection: 'column',
                    padding: '30px 0',
                    background: '#3774a4'
                }}
            >
                <div>
                    <EnvironmentOutlined style={{ fontSize: '40px', color: '#fff' }} />
                    <span id="ip" style={{ fontSize: '40px', color: '#fff' }}></span>
                </div>
                <div id="ipAddress" style={{ fontSize: '28px', marginTop: '12px', color: '#fff' }}></div>
            </div>
            <div className="flex w-[100%] justify-center mt-4">
                <div className="w-[80%]">
                    <Descriptions bordered items={items} column={2} />
                </div>
            </div>
        </div>
    );
};

export default Fingerprint;
