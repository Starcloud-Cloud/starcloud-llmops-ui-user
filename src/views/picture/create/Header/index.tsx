import { HomeFilled } from '@ant-design/icons';
import { Button, Col, Divider, Row, Typography } from 'antd';

export const PictureCreateHeader = () => {
    return (
        <Row justify={'space-between'} style={{ padding: '8px 15px', border: '0.5px solid #d9d9d9', height: '60px' }}>
            <Col style={{ display: 'flex', alignItems: 'center' }}>
                <HomeFilled rev={undefined} />
                <Divider type={'vertical'} />
                <Typography.Text aria-level={2}>智能设计</Typography.Text>
            </Col>
            <Col>
                <Button>打包下载</Button>
            </Col>
        </Row>
    );
};
