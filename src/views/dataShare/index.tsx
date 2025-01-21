import { Tabs, Carousel, Image, Button, Modal, QRCode, Spin, List } from 'antd';
import { DownloadOutlined } from '@ant-design/icons';
import React, { useState, useEffect, useRef } from 'react';
import { useLocation } from 'react-router-dom';
import { getShareResource } from 'api/video/h5';

const Share = () => {
    const location = useLocation();
    const query = new URLSearchParams(location.search);
    const [detailData, setDetailData] = useState<any>(null);

    const [loading, setLoading] = useState(false);
    const getDetail = async () => {
        setLoading(true);
        try {
            const result = await getShareResource(query.get('uid'));
            setLoading(false);
            setDetailData(result?.executeResult);
        } catch (err) {
            setLoading(false);
        }
    };
    //获取文件后缀
    const getFileExtension = (url: string, key?: string) => {
        if (!url) {
            if (key === 'imagePdfUrl' || key === 'wordbookPdfUrl') {
                return 'PDF';
            } else if (key === 'completeVideoUrl') {
                return 'MP4';
            } else {
                return 'MP3';
            }
        } else {
            const match = url.match(/\.([^.]+)$/);
            return match ? match[1].toUpperCase() : '';
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
    }, []);

    const [videoHeight, setVideoHeight] = useState<number>(0);

    const handleLoadedMetadata = (e: React.SyntheticEvent<HTMLVideoElement>) => {
        const video = e.target as HTMLVideoElement;
        setVideoHeight((video.videoHeight * (video.parentElement?.clientWidth || 0)) / video.videoWidth);
    };
    const download = async (url: string, extension: string) => {
        const response = await fetch(url);
        const arrayBuffer = await response.arrayBuffer();
        const blob = new Blob([arrayBuffer], { type: 'application/octet-stream' });
        const link = document.createElement('a');
        link.href = URL.createObjectURL(blob);
        link.download = detailData?.copyWriting?.title + '.' + extension;
        link.click();
    };
    return (
        <div className="share w-full flex justify-center">
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
                                                    draggable={true}
                                                    adaptiveHeight
                                                    dots={false}
                                                    style={{ height: videoHeight }}
                                                >
                                                    {detailData?.resource?.completeVideoUrl ? (
                                                        <div className="px-[30px]">
                                                            <video
                                                                width="100%"
                                                                height="100%"
                                                                controls
                                                                src={detailData?.resource?.completeVideoUrl}
                                                                onLoadedMetadata={handleLoadedMetadata}
                                                            />
                                                        </div>
                                                    ) : (
                                                        detailData?.resource?.videoList
                                                            ?.filter((item: any) => item.videoUrl)
                                                            .map((item: any) => (
                                                                <div className="px-[30px]" key={item.videoUrl}>
                                                                    <video
                                                                        width="100%"
                                                                        height="100%"
                                                                        controls
                                                                        src={item.videoUrl}
                                                                        onLoadedMetadata={handleLoadedMetadata}
                                                                    />
                                                                </div>
                                                            ))
                                                    )}
                                                </Carousel>
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
                                                dataSource={
                                                    detailData?.resource ? (Object.entries(detailData?.resource) as [string, string][]) : []
                                                }
                                                renderItem={([key, value], index) => (
                                                    <List.Item>
                                                        <List.Item.Meta
                                                            title={`${detailData?.copyWriting?.title}${
                                                                key === 'wordbookPdfUrl' ? '--抗遗忘写本' : ''
                                                            }.${getFileExtension(value, key)}`}
                                                        />
                                                        <Button
                                                            disabled={!value}
                                                            onClick={() => {
                                                                download(value, getFileExtension(value));
                                                            }}
                                                            type="primary"
                                                        >
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
