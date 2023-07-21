import { Drawer, useMediaQuery, useTheme } from '@mui/material';
import { Row } from 'antd';
import { useEffect, useMemo, useState } from 'react';
import { openDrawer } from 'store/slices/menu';
import { getImgList } from '../../../api/picture/create';
import useConfig from '../../../hooks/useConfig';
import { useWindowSize } from '../../../hooks/useWindowSize';
import { appDrawerWidth as drawerWidth } from '../../../store/constant';
import { PictureCreateContainer } from './Container';
import { PictureCreateMenu } from './Menu';

import dayjs from 'dayjs';
import { useDispatch } from 'store';
export type IImageListType = IImageListTypeChild[];
export type IImageListTypeChildImages = {
    uuid: string;
    url: string;
    media_type?: string;
};
export type IImageListTypeChild = {
    prompt: string;
    createTime: number;
    images: IImageListTypeChildImages[];
    engine: string;
    width: number;
    height: number;
    create: boolean;
};

const PictureCreate = () => {
    const theme = useTheme();
    const [menuVisible, setMenuVisible] = useState<boolean>(true);
    const size = useWindowSize();
    const [imgList, setImgList] = useState<IImageListType>([]);
    const [width, setWidth] = useState(512);
    const [height, setHeight] = useState(512);
    const [samples, setSamples] = useState(4);
    const [inputValue, setInputValue] = useState('');
    const [conversationId, setConversationId] = useState('');
    const [isFirst, setIsFirst] = useState(true);
    const [isFetch, setIsFetch] = useState(false);

    const matchDownLG = useMediaQuery(theme.breakpoints.down('lg'));
    const { borderRadius } = useConfig();

    const dispatch = useDispatch();

    useEffect(() => {
        dispatch(openDrawer(false));
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    useEffect(() => {
        (async () => {
            const res = await getImgList();
            setConversationId(res.conversationUid);
            setImgList(res.messages);
        })();
    }, []);

    const images = useMemo(() => {
        if (isFirst) {
            return [
                {
                    prompt: inputValue,
                    createTime: dayjs().format('YYYY-MM-DD HH:mm:ss'),
                    images: Array.from({ length: samples }, (_, index) => index).map(() => ({ uuid: 'uuid', url: 'new_img' })),
                    width,
                    height,
                    isFetch,
                    create: true
                },
                ...imgList
            ];
        }
        if (!isFirst && !isFetch) {
            return imgList;
        }
        if (!isFirst && isFetch) {
            return [
                {
                    prompt: inputValue,
                    createTime: dayjs().format('YYYY-MM-DD HH:mm:ss'),
                    images: Array.from({ length: samples }, (_, index) => index).map(() => ({ uuid: 'uuid', url: 'new_img' })),
                    width,
                    height,
                    isFetch,
                    create: true
                },
                ...imgList
            ];
        }
    }, [height, imgList, inputValue, samples, width, isFirst, isFetch]);

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
                        width={width}
                        setWidth={setWidth}
                        height={height}
                        setHeight={setHeight}
                        samples={samples}
                        setSamples={setSamples}
                        inputValue={inputValue}
                        setInputValue={setInputValue}
                        conversationId={conversationId}
                        setIsFirst={setIsFirst}
                        setIsFetch={setIsFetch}
                    />
                </Drawer>
                <PictureCreateContainer
                    menuVisible={menuVisible}
                    imgList={images as any}
                    setMenuVisible={setMenuVisible}
                    width={width}
                    height={height}
                    isFetch={isFetch}
                    setInputValue={setInputValue}
                />
            </Row>
        );
    }

    return (
        <Row className="justify-between h-full">
            <PictureCreateMenu
                menuVisible={menuVisible}
                setMenuVisible={setMenuVisible}
                setImgList={setImgList}
                imgList={imgList}
                width={width}
                setWidth={setWidth}
                height={height}
                setHeight={setHeight}
                samples={samples}
                setSamples={setSamples}
                inputValue={inputValue}
                setInputValue={setInputValue}
                conversationId={conversationId}
                setIsFirst={setIsFirst}
                setIsFetch={setIsFetch}
            />
            <PictureCreateContainer
                menuVisible={menuVisible}
                imgList={images as any}
                setMenuVisible={setMenuVisible}
                width={width}
                height={height}
                isFetch={isFetch}
                setInputValue={setInputValue}
            />
        </Row>
    );
};

export default PictureCreate;
