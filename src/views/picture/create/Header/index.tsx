import { HomeFilled } from '@ant-design/icons';
import { Button } from '@mui/material';
import { Col, Divider, Row } from 'antd';
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
                <span className="text-base font-medium">智能设计</span>
            </Col>
            <Col className="flex items-center">
                <Button variant="outlined" color="secondary">
                    下载
                </Button>
            </Col>
        </Row>
    );
};
