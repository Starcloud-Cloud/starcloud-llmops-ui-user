import { Row } from 'antd';
import { PictureCreateHeader } from './Header';
import { PictureCreateMenu } from './Menu';

const PictureCreate = () => {
    return (
        <div>
            <PictureCreateHeader />
            <Row style={{ height: 'calc(100vh - 60px)' }}>
                <PictureCreateMenu />
            </Row>
        </div>
    );
};

export default PictureCreate;
