import { Row } from 'antd';
import { useEffect, useState } from 'react';
import { useWindowSize } from '../../../hooks/useWindowSize';
import { PictureCreateContainer } from './Container';
import { PictureCreateHeader } from './Header';
import { PictureCreateMenu } from './Menu';
import { getImgList } from '../../../api/picture/create';

export type IImageListType = IImageListTypeChild[];
export type IImageListTypeChildImages = {
    uuid: string;
    url: string;
    media_type: string;
};
export type IImageListTypeChild = {
    prompt: string;
    createTime: number;
    images: IImageListTypeChildImages[];
};

const PictureCreate = () => {
    const [menuVisible, setMenuVisible] = useState<boolean>(true);
    const size = useWindowSize();
    const [imgList, setImgList] = useState<IImageListType>([]);

    useEffect(() => {
        (async () => {
            const res = await getImgList();
            setImgList(res.messages);
        })();
    }, []);

    if (size.width < 768) {
        return (
            <div>
                <PictureCreateHeader />
                <Row style={{ height: 'calc(100vh - 60px)' }} className={menuVisible ? '' : 'justify-between'}>
                    <PictureCreateMenu menuVisible={menuVisible} setMenuVisible={setMenuVisible} setImgList={setImgList} />
                    {!menuVisible && <PictureCreateContainer imgList={imgList} />}
                </Row>
            </div>
        );
    }

    return (
        <div>
            <PictureCreateHeader />
            <Row style={{ height: 'calc(100vh - 60px)' }} className="justify-between">
                <PictureCreateMenu menuVisible={menuVisible} setMenuVisible={setMenuVisible} setImgList={setImgList} />
                <PictureCreateContainer menuVisible={menuVisible} imgList={imgList} />
            </Row>
        </div>
    );
};

export default PictureCreate;
