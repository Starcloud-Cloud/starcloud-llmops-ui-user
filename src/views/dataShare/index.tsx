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
            setDetailData(result);
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
    }, []);

    const [videoHeight, setVideoHeight] = useState<number>(0);

    const handleLoadedMetadata = (e: React.SyntheticEvent<HTMLVideoElement>) => {
        const video = e.target as HTMLVideoElement;
        setVideoHeight((video.videoHeight * (video.parentElement?.clientWidth || 0)) / video.videoWidth);
    };
    const download = (url: string) => {
        // window.open(url, '_blank');
    };
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
                                                    draggable={true}
                                                    adaptiveHeight
                                                    dots={{ className: 'uls' }}
                                                    style={{ height: videoHeight }}
                                                >
                                                    <div className="px-[30px]">
                                                        <video
                                                            width="100%"
                                                            height="100%"
                                                            controls
                                                            src={detailData?.resource?.completeVideoUrl}
                                                            onLoadedMetadata={handleLoadedMetadata}
                                                        />
                                                    </div>
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
                                                dataSource={detailData?.resource ? Object.entries(detailData?.resource) : []}
                                                renderItem={([key, value], index) => (
                                                    <List.Item>
                                                        <List.Item.Meta title={key} />
                                                        <Button onClick={() => {}} type="primary">
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
