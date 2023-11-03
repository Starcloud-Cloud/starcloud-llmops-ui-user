import { Avatar, Card, CollapseProps, Divider, Space, Button } from 'antd';
import React from 'react';
import { Swiper, SwiperSlide } from 'swiper/react';
import 'swiper/css';
import 'swiper/css/pagination';
import KeyboardBackspaceIcon from '@mui/icons-material/KeyboardBackspace';
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';
import { fetchRequestCanCancel } from 'utils/fetch';
import { createRedBookImg } from '../../../../api/redBook/index';

export interface Param {
    BRAND_NAME: string;
}

export interface AppRequest {
    uid: string;
    params: Param;
}

export interface ImageRequest {
    imageTemplate: string;
    params: any;
}

export interface ThreeStepProps {
    appRequest: AppRequest;
    imageRequests: ImageRequest[];
}

const items: CollapseProps['items'] = [
    {
        key: '1',
        label: 'This is panel header 1',
        children: <div>1</div>,
        extra: <Button>生成</Button>
    },
    {
        key: '2',
        label: 'This is panel header 2',
        children: <div>1</div>,
        extra: <Button>生成</Button>
    }
];

export const ThreeStep = () => {
    const [text, setText] = React.useState<string>('');
    const [images, setImages] = React.useState<any[]>([]);
    const [swiperRef, setSwiperRef] = React.useState<any>(null);

    const onChange = (key: string | string[]) => {
        console.log(key);
        ``;
    };

    const handleCreateText = async () => {
        const { promise, controller } = fetchRequestCanCancel('/llm/app/xhs/appExecute', 'post', {
            uid: '0df9889631344ccabbc05b8541c2a1c7',
            params: {
                BRAND_NAME: '美女'
            }
        });
        let resp: any = await promise;

        const reader = resp.getReader();
        const textDecoder = new TextDecoder();
        let outerJoins = '';

        while (true) {
            const { done, value } = await reader.read();
            if (done) {
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
            imageRequests: [
                {
                    imageTemplate: 'EIGHT_BOX_GRID',
                    params: {
                        IMAGE_1: 'https://download.hotsalecloud.com/mofaai/images/ai-generation/00814b133d4607649e93d5ca903149e2.png',
                        IMAGE_2: 'https://download.hotsalecloud.com/mofaai/images/ai-generation/008b3ba25fe0edd9e13b12a52f2e0112.png',
                        IMAGE_3: 'https://download.hotsalecloud.com/mofaai/images/ai-generation/00c297aa35b651313caadbd9e832f433.png',
                        IMAGE_4: 'https://download.hotsalecloud.com/mofaai/images/ai-generation/00cce449bc2c5e3930b9f1a056715d25.png',
                        IMAGE_5: 'https://download.hotsalecloud.com/mofaai/images/ai-generation/00e3a142e6288392a817c363548ac37c.png',
                        IMAGE_6: 'https://download.hotsalecloud.com/mofaai/images/ai-generation/010097441176b6fa2a48696f43e429ce.png',
                        IMAGE_7: 'https://download.hotsalecloud.com/mofaai/images/ai-generation/0113baffc0a41662b589550e712cda7f.png',
                        IMAGE_8: 'https://download.hotsalecloud.com/mofaai/images/ai-generation/0118ab046580533c85e1b3e978c8af25.png',
                        TITLE: '测试生成图片，你猜能成功不！'
                    }
                },
                {
                    imageTemplate: 'TWO_BOX_GRID',
                    params: {
                        IMAGE_1: 'https://download.hotsalecloud.com/mofaai/images/ai-generation/00814b133d4607649e93d5ca903149e2.png',
                        IMAGE_2: 'https://download.hotsalecloud.com/mofaai/images/ai-generation/008b3ba25fe0edd9e13b12a52f2e0112.png'
                    }
                }
            ]
        });
        if (res) {
            setImages(res);
        }
    };

    const handleCreate = async () => {
        await handleCreateImg();
        await handleCreateText();
    };

    console.log(images, 'images');
    return (
        <div>
            <Space direction="vertical" size={16} className="w-full">
                <Card title="小红书生成" extra={<Button onClick={handleCreate}>生成</Button>}>
                    <div className="w-full grid grid-cols-3">
                        <div className="col-span-2 relative">
                            <div className="flex justify-between absolute top-[4%] w-full">
                                <Button
                                    icon={<KeyboardBackspaceIcon />}
                                    // type="primary"
                                    shape="circle"
                                    onClick={() => {
                                        swiperRef?.slidePrev();
                                    }}
                                />
                                <Button
                                    style={{ marginLeft: '10px' }}
                                    icon={<ArrowForwardIcon />}
                                    // type="primary"
                                    shape="circle"
                                    onClick={() => {
                                        swiperRef?.slideNext();
                                    }}
                                />
                            </div>
                            <div className="mt-[20px]">
                                <Swiper
                                    onSwiper={(swiper) => setSwiperRef(swiper)}
                                    // slidesPerView={onCol()}
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
                                        <SwiperSlide key={index}>{item.url}</SwiperSlide>
                                    ))}
                                </Swiper>
                            </div>
                        </div>
                        <div className="col-span-1">
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
                                <div className="font-semibold text-lg mb-2 mt-8">{text}</div>
                                <Divider />
                            </div>
                        </div>
                    </div>
                </Card>
            </Space>
        </div>
    );
};
