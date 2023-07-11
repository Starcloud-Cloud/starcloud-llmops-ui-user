import { Row } from 'antd';
import { useState } from 'react';
import { useWindowSize } from '../../../hooks/useWindowSize';
import { PictureCreateContainer } from './Container/index';
import { PictureCreateHeader } from './Header';
import { PictureCreateMenu } from './Menu';

const PictureCreate = () => {
    const [menuVisible, setMenuVisible] = useState<boolean>(true);
    const size = useWindowSize();

    if (size.width < 768) {
        return (
            <div>
                <PictureCreateHeader />
                <Row style={{ height: 'calc(100vh - 60px)' }} className={menuVisible ? '' : 'justify-between'}>
                    <PictureCreateMenu menuVisible={menuVisible} setMenuVisible={setMenuVisible} />
                    {!menuVisible && <PictureCreateContainer />}
                </Row>
            </div>
        );
    }

    return (
        <div>
            <PictureCreateHeader />
            <Row style={{ height: 'calc(100vh - 60px)' }} className="justify-between">
                <PictureCreateMenu menuVisible={menuVisible} setMenuVisible={setMenuVisible} />
                <PictureCreateContainer menuVisible={menuVisible} />
            </Row>
        </div>
    );
};

export default PictureCreate;
