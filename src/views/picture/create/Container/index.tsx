import { CloseCircleOutlined, CloudDownloadOutlined, LeftOutlined, RightOutlined, ShareAltOutlined } from '@ant-design/icons';
import { Divider, Space } from 'antd';
import React from 'react';
import { useState } from 'react';
import './index.scss';

export const PictureCreateContainer = ({ menuVisible }: { menuVisible?: boolean }) => {
    const [visible, setVisible] = useState(false);
    const [hoveredIndex, setHoveredIndex] = useState<number | undefined>(undefined);
    const [currentIndex, setCurrentIndex] = useState<number>(0);

    const handleMouseEnter = (index: number) => {
        setHoveredIndex(index);
    };

    const handleMouseLeave = () => {
        setHoveredIndex(undefined);
    };
    const imgList = [
        'https://aigc.meitudata.com/editor/out/d3ed5ddd-6239-400c-40b5-63e2b0370ed1.png?imageMogr2/thumbnail/480x480&k=95673745db4e97165c83738aae22e8c3&t=64b19158',
        'https://aigc.meitudata.com/editor/out/198672c7-e4a0-4260-48eb-268a19d54519.png?imageMogr2/thumbnail/480x480&k=853be54dd50963363b3fe12f5f659d77&t=64b19158',
        'https://aigc.meitudata.com/editor/out/400f2c80-b659-4a5e-4374-8946cf19d8a7.png?imageMogr2/thumbnail/480x480&k=610aced190d0f3862121b47a5dcd1d81&t=64b19158'
    ];

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
        if (currentIndex === imgList.length - 1) {
            obj.nextDis = true;
        }
        return obj;
    }, [currentIndex, imgList.length]);

    const handleNext = () => {
        const length = imgList.length - 1;
        if (currentIndex === length) {
            return;
        }
        setCurrentIndex((pre) => pre + 1);
    };

    return (
        <div className="pcm_container" style={menuVisible ? {} : { width: '100vw' }}>
            <div className="pcm_container_wrapper">
                {!visible ? (
                    <>
                        <div className="flex flex-col">
                            <div className="flex justify-between">
                                <p className="overflow-hidden overflow-ellipsis whitespace-nowrap w-1/2 text-base font-medium">
                                    <span className="font-normal">2023/01/10</span>
                                    <span className="ml-1">
                                        在这里输入你对图片的描述，例如：大海边，蓝天白云，一座小房子，房子旁边有许多椰子树，或者，帅气的年轻男子，上身穿一件皮夹克，裤子是牛仔裤，站在纽约的时代广场，电影感，4K像素
                                    </span>
                                </p>
                                <Space>
                                    <div className="bg-slate-900 opacity-80 w-7 h-7 flex justify-center items-center rounded-md cursor-pointer">
                                        <CloudDownloadOutlined rev={undefined} style={{ color: '#fff' }} />
                                    </div>
                                    <div className="bg-slate-900 opacity-80 w-7 h-7 flex justify-center items-center rounded-md cursor-pointer">
                                        <ShareAltOutlined rev={undefined} style={{ color: '#fff' }} />
                                    </div>
                                </Space>
                            </div>
                            <div className="flex overflow-y-auto">
                                {imgList.map((item, index) => (
                                    <div
                                        className="w-200 mr-4 relative"
                                        key={index}
                                        onMouseEnter={() => handleMouseEnter(index)}
                                        onMouseLeave={handleMouseLeave}
                                        onClick={() => setCurrentIndex(index)}
                                    >
                                        <img onClick={() => setVisible(true)} className="rounded-md cursor-pointer" src={item} alt={item} />
                                        {hoveredIndex === index && (
                                            <Space className="absolute top-2 right-2">
                                                <div className="bg-slate-900 opacity-80 w-7 h-7 flex justify-center items-center rounded-md cursor-pointer">
                                                    <CloudDownloadOutlined rev={undefined} style={{ color: '#fff' }} />
                                                </div>
                                                <div className="bg-slate-900 opacity-80 w-7 h-7 flex justify-center items-center rounded-md cursor-pointer">
                                                    <ShareAltOutlined rev={undefined} style={{ color: '#fff' }} />
                                                </div>
                                            </Space>
                                        )}
                                    </div>
                                ))}
                            </div>
                        </div>
                        <Divider type={'horizontal'} />
                    </>
                ) : (
                    <div className="h-full flex justify-center items-center relative">
                        <div className="absolute right-0 top-10 flex flex-col">
                            <div
                                className="bg-slate-900 opacity-80 w-7 h-7 flex justify-center items-center rounded-md cursor-pointer"
                                onClick={() => setVisible(false)}
                            >
                                <CloseCircleOutlined rev={undefined} style={{ color: '#fff' }} />
                            </div>
                            <div className="bg-slate-900 opacity-80 w-7 h-7 flex justify-center items-center rounded-md cursor-pointer mt-2">
                                <CloudDownloadOutlined rev={undefined} style={{ color: '#fff' }} />
                            </div>
                            <div className="bg-slate-900 opacity-80 w-7 h-7 flex justify-center items-center rounded-md cursor-pointer mt-2">
                                <ShareAltOutlined rev={undefined} style={{ color: '#fff' }} />
                            </div>
                        </div>
                        <div className="flex justify-center items-center">
                            <button
                                className={`bg-slate-900 opacity-80 flex-none w-7 h-7 flex justify-center items-center rounded-md cursor-pointer border-none`}
                                onClick={() => handlePrev()}
                                disabled={btnDisable.preDis}
                            >
                                <LeftOutlined rev={undefined} style={{ color: '#fff' }} />
                            </button>
                            <div className="flex flex-col justify-center text-center">
                                <div className="w-full cursor-pointer">
                                    <img className="rounded-md xs:w-9/12 sm:w-4/12" src={imgList[currentIndex]} alt="" />
                                </div>
                                <div className="w-full mt-2">
                                    {imgList.map((item, index) => (
                                        <img className="rounded-md xs:w-3/12 sm:w-1/12 mr-2 cursor-pointer" src={item} alt={item} />
                                    ))}
                                </div>
                            </div>
                            <button
                                className="bg-slate-900 opacity-80 flex-none w-7 h-7 flex justify-center items-center rounded-md cursor-pointer border-none"
                                onClick={() => handleNext()}
                                disabled={btnDisable.nextDis}
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
