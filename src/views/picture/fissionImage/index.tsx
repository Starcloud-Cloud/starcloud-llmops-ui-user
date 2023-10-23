import { Drawer, useMediaQuery, useTheme } from '@mui/material';
import { Row } from 'antd';
import { useEffect, useMemo, useState } from 'react';
import { openDrawer } from 'store/slices/menu';
import { history } from '../../../api/picture/create';
import useConfig from '../../../hooks/useConfig';
import { useWindowSize } from '../../../hooks/useWindowSize';
import { appDrawerWidth as drawerWidth } from '../../../store/constant';
import { PictureCreateContainer } from '../create/Container';
import { PictureCreateMenu } from '../create/Menu';

import dayjs from 'dayjs';
import { useDispatch } from 'store';
export type IImageListType = IImageListTypeChild[];
export type IImageListTypeChildImages = {
    uuid: string;
    url: string;
    mediaType?: string;
};
export type IImageListTypeChild = {
    prompt: string;
    createTime: number;
    images: IImageListTypeChildImages[];
    engine: string;
    width: number;
    height: number;
    create: boolean;
    stylePreset?: string;
};

const PictureCreate = () => {
    const [loading, setLoading] = useState(false);
    const theme = useTheme();
    const [menuVisible, setMenuVisible] = useState<boolean>(true);
    const size = useWindowSize();
    const [imgList, setImgList] = useState<IImageListType>([]);
    const [width, setWidth] = useState(512);
    const [height, setHeight] = useState(512);
    const [samples, setSamples] = useState(4);
    const [inputValue, setInputValue] = useState('');
    const [isFirst, setIsFirst] = useState(true);
    const [isFetch, setIsFetch] = useState(false);
    const [hasMore, setHasMore] = useState(true);
    const [pageNo, setPageNo] = useState(1);
    const [total, setTotal] = useState(0);
    const [inputValueTranslate, setInputValueTranslate] = useState(false);

    const matchDownLG = useMediaQuery(theme.breakpoints.down('lg'));
    const { borderRadius } = useConfig();

    const dispatch = useDispatch();

    useEffect(() => {
        dispatch(openDrawer(false));
        // eslint-disable-next-line react-hooks/exhaustive-deps
        return () => {
            dispatch(openDrawer(true));
        };
    }, []);
    // useEffect(() => {
    //     (async () => {
    //         const res = await history({ pageNo, pageSize: 10, scenes: ['IMAGE_VARIANTS'], status: 'SUCCESS' });
    //         setImgList(
    //             res?.list?.map((item: any) => ({
    //                 ...item.imageInfo,
    //                 createTime: item.createTime
    //             })) || []
    //         );
    //         setTotal(res.total || 0);
    //     })();
    // }, []);

    const fetchMoreData = async () => {
        // if (imgList.length >= total) {
        //     setHasMore(false);
        //     return;
        // }
        // const newPageNo = pageNo + 1;
        // setPageNo(newPageNo);
        // const res = await history({ pageNo, pageSize: 10, scenes: ['IMAGE_VARIANTS'], status: 'SUCCESS' });
        // setImgList([
        //     ...imgList,
        //     ...(res?.list?.map((item: any) => ({
        //         ...item.imageInfo,
        //         createTime: item.createTime
        //     })) || [])
        // ]);
    };

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
                        setLoading={(data) => setLoading(data)}
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
                        setIsFirst={setIsFirst}
                        setIsFetch={setIsFetch}
                        inputValueTranslate={inputValueTranslate}
                        setInputValueTranslate={setInputValueTranslate}
                        mode="裂变"
                    />
                </Drawer>
                <PictureCreateContainer
                    fetchMoreData={fetchMoreData}
                    loading={loading}
                    hasMore={hasMore}
                    menuVisible={menuVisible}
                    imgList={images as any}
                    setMenuVisible={setMenuVisible}
                    width={width}
                    height={height}
                    isFetch={isFetch}
                    setInputValue={setInputValue}
                    setInputValueTranslate={setInputValueTranslate}
                    mode={'裂变'}
                />
            </Row>
        );
    }

    return (
        <Row className="justify-between h-full">
            <PictureCreateMenu
                menuVisible={menuVisible}
                setLoading={(data) => setLoading(data)}
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
                setIsFirst={setIsFirst}
                setIsFetch={setIsFetch}
                inputValueTranslate={inputValueTranslate}
                setInputValueTranslate={setInputValueTranslate}
                mode="裂变"
            />
            <PictureCreateContainer
                fetchMoreData={fetchMoreData}
                loading={loading}
                hasMore={hasMore}
                menuVisible={menuVisible}
                imgList={images as any}
                setMenuVisible={setMenuVisible}
                width={width}
                height={height}
                isFetch={isFetch}
                setInputValue={setInputValue}
                setInputValueTranslate={setInputValueTranslate}
                mode="裂变"
            />
        </Row>
    );
};

export default PictureCreate;
