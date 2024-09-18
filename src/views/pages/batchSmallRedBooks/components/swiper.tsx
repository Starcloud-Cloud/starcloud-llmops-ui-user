import { Button, Image } from 'antd';
import { Swiper, SwiperSlide } from 'swiper/react';
import 'swiper/css';
import 'swiper/css/pagination';
import KeyboardBackspaceIcon from '@mui/icons-material/KeyboardBackspace';
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';
import { useState } from 'react';
import { Pagination } from 'swiper';

const Swipers = ({ item }: { item: any }) => {
    const [swiperRef, setSwiperRef] = useState<any>(null);
    return (
        <div
            style={{
                aspectRatio: item?.executeResult?.imageList?.length === 0 ? '263 / 351' : 'auto'
            }}
            className="relative swiperImages rounded-[16px] overflow-hidden"
        >
            <Swiper
                onSwiper={(swiper) => {
                    setSwiperRef(swiper);
                }}
                slidesPerView={1}
                // spaceBetween={30}
                centeredSlides={false}
                loop
                pagination={{ clickable: true }}
                modules={[Pagination]}
                className="mySwiper w-full h-full"
                autoplay={{
                    delay: 2500,
                    disableOnInteraction: false
                }}
            >
                {item?.executeResult?.imageList?.map((el: any, index: number) => (
                    <SwiperSlide key={el?.url}>
                        <Image width={'100%'} height={'100%'} preview={false} src={el?.url} />
                    </SwiperSlide>
                ))}
            </Swiper>
            <div className="w-full swiperImage absolute top-[46%] z-10">
                <div className="flex justify-between w-full">
                    <Button
                        icon={<KeyboardBackspaceIcon />}
                        shape="circle"
                        onClick={(e) => {
                            swiperRef?.slidePrev();
                            e.stopPropagation();
                        }}
                    />
                    <Button
                        className="float-right"
                        style={{ marginLeft: '10px' }}
                        icon={<ArrowForwardIcon />}
                        shape="circle"
                        onClick={(e) => {
                            swiperRef?.slideNext();
                            e.stopPropagation();
                        }}
                    />
                </div>
            </div>
        </div>
    );
};
export default Swipers;
