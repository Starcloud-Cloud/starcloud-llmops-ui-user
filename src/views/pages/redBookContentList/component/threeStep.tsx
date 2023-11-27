import { Avatar, Card, CollapseProps, Divider, Space, Button, Spin, Input } from 'antd';
import React, { useEffect } from 'react';
import { Swiper, SwiperSlide } from 'swiper/react';
import 'swiper/css';
import 'swiper/css/pagination';
import KeyboardBackspaceIcon from '@mui/icons-material/KeyboardBackspace';
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';
import { retryContent, modify } from '../../../../api/redBook/index';
import { dispatch } from 'store';
import { openSnackbar } from 'store/slices/snackbar';

export const ThreeStep = ({ data }: { data: any }) => {
    console.log(data, 'data');
    const [title, setTitle] = React.useState<string>('');
    const [text, setText] = React.useState<string>('');
    const [images, setImages] = React.useState<any[]>([]);
    const [swiperRef, setSwiperRef] = React.useState<any>(null);

    const [editType, setEditType] = React.useState(false);
    const [loading, setLoading] = React.useState<boolean>(false);

    const handleModify = async () => {
        const res = await modify({
            planUid: data.planUid,
            businessUid: data.businessUid,
            copyWritingTitle: title,
            copyWritingContent: text
        });
        setEditType(false);
        dispatch(
            openSnackbar({
                anchorOrigin: {
                    vertical: 'top',
                    horizontal: 'center'
                },
                open: true,
                message: '操作成功',
                variant: 'alert',
                alert: {
                    color: 'success'
                },
                close: false
            })
        );
    };

    useEffect(() => {
        if (data) {
            setText(data?.copyWritingContent);
            setTitle(data?.copyWritingTitle);
            setImages(data?.pictureContent || []);
        }
    }, [data]);

    const doRetry = async () => {
        const res = await retryContent(data.businessUid);
        if (res) {
            setText(res.copyWritingContent);
            setTitle(res.copyWritingTitle);
            setImages(res.pictureContent || []);
        }
    };

    const handleCopy = async () => {};

    return (
        <div className="h-full">
            <Card
                className="h-full"
                title="小红书生成"
                bodyStyle={{
                    height: 'calc(100% - 50px)',
                    overflow: 'auto'
                }}
                extra={
                    <>
                        <Button onClick={doRetry}>重新生成</Button>
                        <Divider type="vertical" />
                        {!editType ? (
                            <Button type="primary" onClick={() => setEditType(true)}>
                                编辑
                            </Button>
                        ) : (
                            <Button type="primary" onClick={handleModify}>
                                保存
                            </Button>
                        )}
                    </>
                }
            >
                <div className="w-full grid grid-cols-3 h-full">
                    <div className="col-span-2 relative h-full overflow-hidden">
                        {images.length > 0 && (
                            <>
                                <div className="flex justify-between absolute top-[46%] w-full z-10">
                                    <Button
                                        icon={<KeyboardBackspaceIcon />}
                                        shape="circle"
                                        onClick={() => {
                                            console.log(swiperRef, 'swiperRef');
                                            swiperRef?.slidePrev();
                                        }}
                                    />
                                    <Button
                                        style={{ marginLeft: '10px' }}
                                        icon={<ArrowForwardIcon />}
                                        shape="circle"
                                        onClick={() => {
                                            swiperRef?.slideNext();
                                        }}
                                    />
                                </div>
                                <div className="mt-[20px] h-full">
                                    {images.length > 0 && (
                                        <Swiper
                                            onSwiper={(swiper) => setSwiperRef(swiper)}
                                            slidesPerView={1}
                                            spaceBetween={30}
                                            centeredSlides={false}
                                            loop
                                            modules={[]}
                                            className="mySwiper h-full"
                                            autoplay={{
                                                delay: 2500,
                                                disableOnInteraction: false
                                            }}
                                        >
                                            {images.map((item: any, index) => (
                                                <SwiperSlide key={index}>
                                                    <img className="w-full h-full object-contain" src={item.url} />
                                                </SwiperSlide>
                                            ))}
                                        </Swiper>
                                    )}
                                </div>
                            </>
                        )}
                    </div>
                    <div className="col-span-1 h-full">
                        {images.length > 0 && (
                            <div className="w-full h-full p-4">
                                <div className="flex items-center justify-between">
                                    <div className="flex items-center">
                                        <Avatar />

                                        <span className="text-[rgba(51,51,51,0.8)] text-base ml-2">沾不沾果酱</span>
                                    </div>
                                    <div
                                        className="bg-[#ff2e4d] text-white text-base w-[96px] font-semibold px-6 h-[40px] cursor-pointer rounded-2xl text-center"
                                        style={{ lineHeight: '40px' }}
                                    >
                                        关注
                                    </div>
                                </div>
                                {editType ? (
                                    <Input
                                        onChange={(e) => setTitle(e.target.value)}
                                        className="font-semibold text-lg mb-2 mt-8 whitespace-pre-wrap"
                                        value={title}
                                    />
                                ) : (
                                    <div className="font-semibold text-lg mb-2 mt-8 whitespace-pre-wrap">{title}</div>
                                )}
                                <Divider />
                                <div className="max-h-[calc(100%-150px)] ">
                                    {editType ? (
                                        <Input.TextArea
                                            onChange={(e) => setText(e.target.value)}
                                            className="text-base mb-2 whitespace-pre-wrap"
                                            value={text}
                                            rows={10}
                                        />
                                    ) : (
                                        <div className="text-base mb-2 whitespace-pre-wrap">{text}</div>
                                    )}
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            </Card>
        </div>
    );
};
