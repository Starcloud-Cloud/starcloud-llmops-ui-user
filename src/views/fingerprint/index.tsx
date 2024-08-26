import { EnvironmentOutlined } from '@ant-design/icons';
import { Badge, Descriptions, DescriptionsProps } from 'antd';

const items: DescriptionsProps['items'] = [
    {
        key: 'browserCode',
        label: '内核版本',
        span: 2,
        children: ''
    },
    {
        key: 'os',
        label: '操作系统',
        span: 2,
        children: 'Prepaid'
    },
    {
        key: 'userAgent',
        label: 'User Agent',
        children: 'YES'
    },
    {
        key: 'language',
        label: '语言',
        children: '2018-04-24 18:00:00'
    },
    {
        key: 'timezone',
        label: '时区',
        children: '2018-04-24 18:00:00'
    },
    {
        key: 'canvas',
        label: 'Canvas指纹',
        children: '2019-04-24 18:00:00',
        span: 2
    },
    {
        key: 'webgl',
        label: 'Webgl指纹',
        children: '',
        span: 3
    },
    {
        key: 'plugins',
        label: 'Plugins指纹',
        children: '$80.00'
    },
    {
        key: 'audio',
        label: 'Audio指纹',
        children: '$20.00'
    },
    {
        key: 'screen',
        label: 'Screen指纹',
        children: '$60.00'
    },
    {
        key: 'font',
        label: 'Font指纹',
        children: ''
    }
];

const Fingerprint = () => {
    return (
        <div style={{ width: '100vw', height: '100vh' }}>
            <div>
                <div>
                    <EnvironmentOutlined />
                    <span className="text-4xl">125.119.44.163</span>
                </div>
                <div>中国 内地 / zhejiang / hangzhou</div>
            </div>
            <div className="w-[100%] justify-center">
                <div className="w-[80%]">
                    <Descriptions title="指纹" bordered items={items} />
                </div>
            </div>
        </div>
    );
};

export default Fingerprint;
