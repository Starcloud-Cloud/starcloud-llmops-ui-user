import { Row } from 'antd';
import React, { useEffect, useState } from 'react';
import { useWindowSize } from '../../../hooks/useWindowSize';
import { PictureCreateContainer } from './Container';
import { PictureCreateMenu } from './Menu';
import { getImgList } from '../../../api/picture/create';
import { appDrawerWidth as drawerWidth } from '../../../store/constant';
import { Drawer, useMediaQuery, useTheme } from '@mui/material';
import useConfig from '../../../hooks/useConfig';

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
    const theme = useTheme();
    const [menuVisible, setMenuVisible] = useState<boolean>(true);
    const size = useWindowSize();
    const [imgList, setImgList] = useState<IImageListType>([]);

    const matchDownLG = useMediaQuery(theme.breakpoints.down('lg'));
    const { borderRadius } = useConfig();

    useEffect(() => {
        (async () => {
            const res = await getImgList();
            setImgList(res.messages);
        })();
    }, []);

    if (size.width < 768) {
        return (
            <Row className={menuVisible ? 'h-full' : 'justify-between h-full'}>
                <Drawer
                    sx={{
                        width: drawerWidth,
                        flexShrink: 0,
                        zIndex: { xs: 1100, lg: 0 },
                        '& .MuiDrawer-paper': {
                            height: matchDownLG ? '100%' : 'auto',
                            width: drawerWidth,
                            boxSizing: 'border-box',
                            position: 'relative',
                            border: 'none',
                            borderRadius: matchDownLG ? 'none' : `${borderRadius}px`
                        }
                    }}
                    variant={matchDownLG ? 'temporary' : 'persistent'}
                    anchor="left"
                    open={menuVisible}
                    ModalProps={{ keepMounted: true }}
                    onClose={() => setMenuVisible(false)}
                >
                    <PictureCreateMenu
                        menuVisible={menuVisible}
                        setMenuVisible={setMenuVisible}
                        setImgList={setImgList}
                        imgList={imgList}
                    />
                </Drawer>
                <PictureCreateContainer menuVisible={menuVisible} imgList={imgList} setMenuVisible={setMenuVisible} />
            </Row>
        );
    }

    return (
        <Row className="justify-between h-full">
            <PictureCreateMenu menuVisible={menuVisible} setMenuVisible={setMenuVisible} setImgList={setImgList} imgList={imgList} />
            <PictureCreateContainer menuVisible={menuVisible} imgList={imgList} setMenuVisible={setMenuVisible} />
        </Row>
    );
};

export default PictureCreate;
