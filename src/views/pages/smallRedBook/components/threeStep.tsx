import { Avatar, Card, CollapseProps, Divider, Space, Button, Spin } from 'antd';
import React from 'react';
import { Swiper, SwiperSlide } from 'swiper/react';
import 'swiper/css';
import 'swiper/css/pagination';
import KeyboardBackspaceIcon from '@mui/icons-material/KeyboardBackspace';
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';
import { fetchRequestCanCancel } from 'utils/fetch';
import { createRedBookImg, doCreateText } from '../../../../api/redBook/index';
import { dispatch } from 'store';
import { openSnackbar } from 'store/slices/snackbar';

export const ThreeStep = ({ data }: { data: any }) => {
    console.log(data, 'data');
    const [text, setText] = React.useState<string>('');
    const [title, setTitle] = React.useState<string>('');
    const [images, setImages] = React.useState<any[]>([]);
    const [swiperRef, setSwiperRef] = React.useState<any>(null);
    const [imgLoading, setImgLoading] = React.useState<boolean>(false);
    const [textLoading, setTextLoading] = React.useState<boolean>(false);

    // const handleCreateText = async () => {
    //     const res = await doCreateText({ ...data.appRequest });
    //     console.log(res, 'res');
    //     if (res) {
    //         setText(res.content);
    //         setTitle(res.title);
    //         setTextLoading(false);
    //     }
    // };

    const handleCreateText = async () => {
        const { promise, controller } = fetchRequestCanCancel('/llm/app/xhs/appExecute', 'post', { ...data.appRequest });
        let resp: any = await promise;

        const reader = resp.getReader();
        const textDecoder = new TextDecoder();
        let outerJoins = '';

        while (true) {
            const { done, value } = await reader.read();
            if (done) {
                setTextLoading(false);
                break;
            }
            const str = textDecoder.decode(value);
            outerJoins += str;

            // 查找事件结束标志，例如"}\n"
            let eventEndIndex = outerJoins.indexOf('}\n');

            while (eventEndIndex !== -1) {
                const eventData = outerJoins.slice(0, eventEndIndex + 1);
                const subString = eventData.substring(5);
                const bufferObj = JSON.parse(subString);
                console.log(bufferObj, 'bufferObj');
                if (bufferObj.type === 'm') {
                    setText((pre) => pre + bufferObj.content);
                }
                outerJoins = outerJoins.slice(eventEndIndex + 3);
                eventEndIndex = outerJoins.indexOf('}\n');
            }
        }
    };

    const handleCreateImg = async () => {
        const res = await createRedBookImg({
            imageRequests: data.imageRequests
        });
        if (res) {
            if (res.some((item: any) => !item.success)) {
                dispatch(
                    openSnackbar({
                        open: true,
                        message: '图片生成失败',
                        variant: 'alert',
                        alert: {
                            color: 'error'
                        },
                        anchorOrigin: { vertical: 'top', horizontal: 'center' },
                        close: false
                    })
                );
                return;
            }
            setImages(res);
            setImgLoading(false);
        }
    };

    const handleCreate = async () => {
        setImages([]);
        setText('');
        setTextLoading(true);
        setImgLoading(true);
        await handleCreateImg();
        await handleCreateText();
    };

    return (
        <div>
            <Space direction="vertical" size={16} className="w-full">
                <Card title="小红书生成" extra={<Button onClick={handleCreate}>生成</Button>}>
                    <div className="w-full grid grid-cols-3 min-h-[60vh]">
                        <div className="col-span-2 relative">
                            <Spin tip="Loading..." spinning={imgLoading}>
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
                                        <div className="mt-[20px]">
                                            {images.length > 0 && (
                                                <Swiper
                                                    onSwiper={(swiper) => setSwiperRef(swiper)}
                                                    slidesPerView={1}
                                                    spaceBetween={30}
                                                    centeredSlides={false}
                                                    loop
                                                    modules={[]}
                                                    className="mySwiper"
                                                    autoplay={{
                                                        delay: 2500,
                                                        disableOnInteraction: false
                                                    }}
                                                >
                                                    {images.map((item: any, index) => (
                                                        <SwiperSlide key={index}>
                                                            <img className="w-full" src={item.url} />
                                                        </SwiperSlide>
                                                    ))}
                                                </Swiper>
                                            )}
                                        </div>
                                    </>
                                )}
                            </Spin>
                        </div>
                        <div className="col-span-1">
                            <Spin tip="Loading..." spinning={textLoading}>
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
                                        <div className="font-semibold text-lg mb-2 mt-8 whitespace-pre-wrap">{text}</div>
                                        <Divider />
                                        {/* <div className="text-base mb-2 mt-8 whitespace-pre-wrap">{text}</div> */}
                                    </div>
                                )}
                            </Spin>
                        </div>
                    </div>
                </Card>
            </Space>
        </div>
    );
};
