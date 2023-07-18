import { CloudDownloadOutlined, LeftOutlined, RightOutlined } from '@ant-design/icons';
import { Divider, Space } from 'antd';
import React from 'react';
import { useState } from 'react';
import './index.scss';
import { IImageListType, IImageListTypeChildImages } from '../index';
import dayjs from 'dayjs';
import { Button, IconButton } from '@mui/material';
import MenuRoundedIcon from '@mui/icons-material/MenuRounded';
import ArrowBackIosIcon from '@mui/icons-material/ArrowBackIos';

export const PictureCreateContainer = ({
    menuVisible,
    imgList,
    setMenuVisible
}: {
    menuVisible?: boolean;
    imgList: IImageListType;
    setMenuVisible: (menuVisible: boolean) => void;
}) => {
    const [visible, setVisible] = useState(false);
    const [hoveredIndex, setHoveredIndex] = useState<string | undefined>(undefined);
    const [currentIndex, setCurrentIndex] = useState<number>(0);
    const [currentImageList, setCurrentImageList] = useState<IImageListTypeChildImages[]>([]);

    const handleMouseEnter = (index: string) => {
        setHoveredIndex(index);
    };

    const handleMouseLeave = () => {
        setHoveredIndex(undefined);
    };

    const handlePrev = () => {
        if (currentIndex === 0) {
            return;
        }
        setCurrentIndex((pre) => pre - 1);
    };

    const btnDisable = React.useMemo(() => {
        const obj = { preDis: false, nextDis: false };
        if (currentIndex === 0) {
            obj.preDis = true;
        }
        if (currentIndex === currentImageList.length - 1) {
            obj.nextDis = true;
        }
        return obj;
    }, [currentIndex, currentImageList.length]);

    const handleNext = () => {
        const length = currentImageList.length - 1;
        if (currentIndex === length) {
            return;
        }
        setCurrentIndex((pre) => pre + 1);
    };

    return (
        <div className="pcm_container" style={menuVisible ? {} : { width: '100%' }}>
            {!visible && (
                <div>
                    <IconButton onClick={() => setMenuVisible(!menuVisible)} size="large" aria-label="chat menu collapse">
                        <MenuRoundedIcon />
                    </IconButton>
                </div>
            )}
            <div className="h-full overflow-y-hidden hover:overflow-y-auto">
                {!visible ? (
                    <div>
                        {imgList.map((item, index) => (
                            <div key={index}>
                                <div className="flex flex-col">
                                    <div className="flex justify-between">
                                        <p className="overflow-hidden overflow-ellipsis whitespace-nowrap w-1/2 text-base font-medium">
                                            <span className="font-normal text-zinc-400">
                                                {dayjs(item.createTime).format('YYYY-MM-DD HH:mm:ss')}
                                            </span>
                                            <span className="ml-1">{item.prompt}</span>
                                        </p>
                                        <Space>
                                            <div className="bg-black/50 w-7 h-7 flex justify-center items-center rounded-md cursor-pointer">
                                                <CloudDownloadOutlined rev={undefined} style={{ color: '#fff' }} />
                                            </div>
                                            {/*<div className="bg-slate-900 w-7 h-7 flex justify-center items-center rounded-md cursor-pointer">*/}
                                            {/*    <ShareAltOutlined rev={undefined} style={{ color: '#fff' }} />*/}
                                            {/*</div>*/}
                                        </Space>
                                    </div>
                                    <div className="flex overflow-x-hidden hover:overflow-x-auto">
                                        {item.images.map((img, imgIndex) => (
                                            <div
                                                className="mr-4 relative"
                                                key={img.uuid}
                                                onMouseEnter={() => handleMouseEnter(img.uuid)}
                                                onMouseLeave={handleMouseLeave}
                                                onClick={() => setCurrentIndex(imgIndex)}
                                            >
                                                <img
                                                    onClick={() => {
                                                        setVisible(true);
                                                        setCurrentImageList(item.images);
                                                    }}
                                                    className="rounded-md cursor-pointer h-[450px]"
                                                    src={img.url}
                                                    alt={img.uuid}
                                                />
                                                {hoveredIndex === img.uuid && (
                                                    <Space className="absolute top-2 right-2">
                                                        <div className="bg-black/50 w-7 h-7 flex justify-center items-center rounded-md cursor-pointer">
                                                            <CloudDownloadOutlined rev={undefined} style={{ color: '#fff' }} />
                                                        </div>
                                                        {/*<div className="bg-black/50  w-7 h-7 flex justify-center items-center rounded-md cursor-pointer">*/}
                                                        {/*    <ShareAltOutlined rev={undefined} style={{ color: '#fff' }} />*/}
                                                        {/*</div>*/}
                                                    </Space>
                                                )}
                                            </div>
                                        ))}
                                    </div>
                                </div>
                                <Divider type={'horizontal'} />
                            </div>
                        ))}
                    </div>
                ) : (
                    <div className="h-full flex justify-center items-center relative">
                        <div className={'absolute left-0 top-0'}>
                            <Button
                                className="ml-2"
                                variant="contained"
                                startIcon={<ArrowBackIosIcon />}
                                color="secondary"
                                onClick={() => setVisible(false)}
                            >
                                返回
                            </Button>
                        </div>
                        <div className="absolute right-0 top-0 flex flex-col">
                            <div className="bg-black/50 w-7 h-7 flex justify-center items-center rounded-md cursor-pointer">
                                <CloudDownloadOutlined rev={undefined} style={{ color: '#fff' }} />
                            </div>
                            {/*<div className="bg-black/50 w-7 h-7 flex justify-center items-center rounded-md cursor-pointer mt-2">*/}
                            {/*    <ShareAltOutlined rev={undefined} style={{ color: '#fff' }} />*/}
                            {/*</div>*/}
                        </div>
                        <div className="flex justify-center items-center">
                            <button
                                className={`${
                                    btnDisable.preDis ? 'bg-black/20 cursor-not-allowed' : 'bg-black/50 cursor-pointer'
                                } flex-none w-10 h-10 flex justify-center items-center rounded-md  border-none`}
                                onClick={() => handlePrev()}
                                disabled={btnDisable.preDis}
                            >
                                <LeftOutlined rev={undefined} style={{ color: '#fff' }} />
                            </button>
                            <div className="flex flex-col justify-center text-center">
                                <div className="w-full cursor-pointer">
                                    <img
                                        className="rounded-md xs:h-[140px] sm:h-[250px] md:h-[350px] lg:h-[600px]"
                                        src={currentImageList[currentIndex].url}
                                        alt={currentImageList[currentIndex].uuid}
                                    />
                                </div>
                                <div className="w-full mt-2 flex justify-center overflow-y-auto">
                                    {currentImageList.map((item, index) => (
                                        <img
                                            key={index}
                                            className="rounded-md xs:w-3/12 sm:w-1/12 mr-2 cursor-pointer"
                                            src={item.url}
                                            alt={item.uuid}
                                        />
                                    ))}
                                </div>
                            </div>
                            <button
                                className={`${
                                    btnDisable.nextDis ? 'bg-black/20 cursor-not-allowed' : 'bg-black/50 cursor-pointer'
                                } bg-black/50 flex-none w-10 h-10 flex justify-center items-center rounded-md border-none`}
                                onClick={() => handleNext()}
                            >
                                <RightOutlined rev={undefined} style={{ color: '#fff' }} />
                            </button>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};
