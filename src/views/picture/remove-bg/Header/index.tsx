import { HomeFilled } from '@ant-design/icons';
import { Button, Col, Divider, Row, Space } from 'antd';
import { useNavigate } from 'react-router-dom';

export const PictureCreateHeader = () => {
    const navigate = useNavigate();
    return (
        <Row justify={'space-between'} style={{ padding: '8px 15px', border: '0.5px solid #d9d9d9', height: '60px' }}>
            <Col className="flex items-center">
                <HomeFilled
                    rev={undefined}
                    style={{ fontSize: '22px' }}
                    className="cursor-pointer"
                    onClick={() => {
                        navigate('/appMarket/list');
                    }}
                />
                <Divider type={'vertical'} />
                <span className="text-base font-medium">批量商品抠图</span>
            </Col>
            <Col className="flex items-center">
                <Space>
                    <Button>批量保存</Button>
                    <Button>打包下载</Button>
                </Space>
            </Col>
        </Row>
    );
};
