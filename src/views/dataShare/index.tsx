import { Tabs, Carousel, Image, Button, Modal, QRCode, Spin, List } from 'antd';
import { DownloadOutlined } from '@ant-design/icons';
import React, { useState, useEffect, useRef } from 'react';
import { useLocation } from 'react-router-dom';
import { contentShare } from 'api/redBook/batchIndex';

const Share = () => {
    const location = useLocation();
    const query = new URLSearchParams(location.search);
    const type = query.get('type');
    const [carouselValue, setCarouselValue] = useState(0);
    const [open, setOpen] = useState(false);
    const [detailData, setDetailData] = useState<any>(null);

    const [loading, setLoading] = useState(false);
    const getDetail = async () => {
        setLoading(true);
        try {
            const result = await contentShare(query.get('uid'));
            setLoading(false);
            setDetailData(result.executeResult);
            // @ts-ignore
            document.querySelector('title') &&
                // @ts-ignore
                (document.querySelector('title').innerHTML = '魔法笔记｜' + result?.executeResult?.copyWriting?.title);
        } catch (err) {
            setLoading(false);
        }
    };
    const faterDom = useRef<any>(null);
    const [windowHeight, setWindowHeight] = useState('100vh');
    useEffect(() => {
        const handleResize = () => {
            setWindowHeight(window.innerHeight - 40 + 'px');
        };

        window.addEventListener('resize', handleResize);
        handleResize();
        return () => {
            window.removeEventListener('resize', handleResize);
        };
    }, []);
    useEffect(() => {
        getDetail();
        const script = document.createElement('script');
        script.src = 'https://fe-static.xhscdn.com/biz-static/goten/xhs-1.0.1.js';
        script.async = true;
        document.body.appendChild(script);
        return () => {
            document.body.removeChild(script); // 清理脚本
        };
    }, []);

    const [videoHeight, setVideoHeight] = useState<number>(0);

    const handleLoadedMetadata = (e: React.SyntheticEvent<HTMLVideoElement>) => {
        const video = e.target as HTMLVideoElement;
        setVideoHeight((video.videoHeight * (video.parentElement?.clientWidth || 0)) / video.videoWidth);
    };

    const data = [
        {
            title: 'C109 元旦.mp3'
        },
        {
            title: 'C109 元旦——段对照.pdf'
        },
        {
            title: 'C109 元旦——抗遗忘默写本.pdf'
        },
        {
            title: 'C109 元旦——文章标注.pdf'
        },
        {
            title: 'C109 元旦——无标注文章.pdf'
        },
        {
            title: 'C109 元旦——中文翻译.pdf'
        }
    ];
    return (
        <div style={{ height: `calc(${windowHeight} + '40px')` }} className="share w-full flex justify-center">
            {loading ? (
                <Spin className="h-full w-full flex justify-center items-center"></Spin>
            ) : (
                <div className="w-full max-w-[500px] shadow-lg">
                    <Tabs
                        centered
                        items={[
                            {
                                label: '视频',
                                key: '1',
                                children: (
                                    <div
                                        style={{
                                            height: `calc(${windowHeight} - 46px)`
                                        }}
                                        ref={faterDom}
                                        className=" relative"
                                    >
                                        <div className="h-full overflow-y-scroll">
                                            <div className="relative max-h-[666px]">
                                                <Carousel
                                                    className="h-full"
                                                    afterChange={setCarouselValue}
                                                    draggable={true}
                                                    adaptiveHeight
                                                    dots={{ className: 'uls' }}
                                                    style={{ height: type === 'video' ? videoHeight : 'auto' }}
                                                >
                                                    {type === 'video' ? (
                                                        detailData?.video?.completeVideoUrl ? (
                                                            <div className="px-[30px]">
                                                                <video
                                                                    width="100%"
                                                                    height="100%"
                                                                    controls
                                                                    src={detailData?.video?.completeVideoUrl}
                                                                    onLoadedMetadata={handleLoadedMetadata}
                                                                />
                                                            </div>
                                                        ) : (
                                                            detailData?.video?.videoList?.map((item: any, index: number) => (
                                                                <div className="px-[30px]" key={index}>
                                                                    <video
                                                                        width="100%"
                                                                        height="100%"
                                                                        controls
                                                                        src={item?.videoUrl}
                                                                        onLoadedMetadata={handleLoadedMetadata}
                                                                    />
                                                                </div>
                                                            ))
                                                        )
                                                    ) : (
                                                        detailData?.imageList?.map((item: any) => (
                                                            <div className="px-[30px]" key={item?.url}>
                                                                <Image preview={false} src={item?.url} />
                                                            </div>
                                                        ))
                                                    )}
                                                </Carousel>
                                                <div className="absolute right-[15px] top-[10px] bg-[#2f3334] text-white rounded-[20px] text-md px-[5px] py-[2px] z-10 leading-[14px]">
                                                    {carouselValue + 1}/
                                                    {detailData?.video?.completeVideoUrl ? 1 : detailData?.imageList?.length}
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                )
                            },
                            {
                                label: '资料下载',
                                key: '2',
                                children: (
                                    <div
                                        style={{
                                            height: `calc(${windowHeight} - 46px)`
                                        }}
                                        className="relative"
                                    >
                                        <div className="h-full overflow-y-scroll px-4">
                                            <List
                                                itemLayout="horizontal"
                                                dataSource={data}
                                                renderItem={(item, index) => (
                                                    <List.Item>
                                                        <List.Item.Meta title={<a href="https://ant.design">{item.title}</a>} />
                                                        <Button type="primary">
                                                            <DownloadOutlined />
                                                            下载
                                                        </Button>
                                                    </List.Item>
                                                )}
                                            />
                                        </div>
                                    </div>
                                )
                            }
                        ]}
                    ></Tabs>
                </div>
            )}
        </div>
    );
};

export default Share;
