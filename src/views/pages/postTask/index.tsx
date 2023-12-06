import { Card, Descriptions, Space, Button } from 'antd';

const PostTask = () => {
    return (
        <div className="p-4">
            <Space direction="vertical" size={16} className="w-full">
                <Card title="通告信息" style={{ width: '100%' }}>
                    <Descriptions
                        bordered
                        // title="Custom Size"
                        // size={size}
                        layout="vertical"
                        items={[
                            {
                                key: '1',
                                label: '文案标题',
                                children: 'Cloud Database'
                            },
                            {
                                key: '2',
                                label: '文案内容',
                                children: 'Prepaid'
                            },
                            {
                                key: '标签',
                                label: 'Automatic Renewal',
                                children: 'YES'
                            },
                            {
                                key: '标签',
                                label: '图片列表',
                                children: 'YES'
                            }
                        ]}
                    />
                </Card>
                <Card title="提交信息" style={{ width: '100%' }}>
                    <Descriptions
                        bordered
                        // title="Custom Size"
                        // size={size}
                        layout="vertical"
                        items={[
                            {
                                key: '1',
                                label: '认领人',
                                children: 'Cloud Database'
                            },
                            {
                                key: '2',
                                label: '发布地址',
                                children: 'Prepaid'
                            }
                        ]}
                    />
                    <Button type="primary" block className="mt-4">
                        提交
                    </Button>
                </Card>
            </Space>
        </div>
    );
};

export default PostTask;
