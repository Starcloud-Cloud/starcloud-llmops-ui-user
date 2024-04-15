import { Button } from 'antd';
import { Swiper, SwiperSlide } from 'swiper/react';
import 'swiper/css';
import 'swiper/css/pagination';
import KeyboardBackspaceIcon from '@mui/icons-material/KeyboardBackspace';
import ContentCopyIcon from '@mui/icons-material/ContentCopy';
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';
import { useState, useRef } from 'react';
import { Pagination } from 'swiper';

const Swipers = ({ item }: { item: any }) => {
    const [swiperRef, setSwiperRef] = useState<any>(null);
    return (
        <div className="w-full flex justify-center items-center aspect-[250/335] relative swiperImages m-auto">
            <Swiper
                onSwiper={(swiper) => {
                    setSwiperRef(swiper);
                }}
                slidesPerView={1}
                spaceBetween={30}
                centeredSlides={false}
                loop
                pagination={{ clickable: true }}
                modules={[Pagination]}
                className="mySwiper h-full"
                autoplay={{
                    delay: 2500,
                    disableOnInteraction: false
                }}
            >
                {item?.executeResult?.imageList?.map((el: any, index: number) => (
                    <SwiperSlide key={el.url}>
                        <img className="w-full h-full object-contain" src={el.url} />
                    </SwiperSlide>
                ))}
            </Swiper>
            <div className="w-full swiperImage absolute top-[46%] z-10">
                <div className="flex justify-between w-full">
                    <Button
                        icon={<KeyboardBackspaceIcon />}
                        shape="circle"
                        onClick={() => {
                            swiperRef?.slidePrev();
                        }}
                    />
                    <Button
                        className="float-right"
                        style={{ marginLeft: '10px' }}
                        icon={<ArrowForwardIcon />}
                        shape="circle"
                        onClick={() => {
                            swiperRef?.slideNext();
                        }}
                    />
                </div>
            </div>
        </div>
    );
};
export default Swipers;
