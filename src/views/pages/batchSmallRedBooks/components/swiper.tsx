import { Button, Image } from 'antd';
import { Swiper, SwiperSlide } from 'swiper/react';
import 'swiper/css';
import 'swiper/css/pagination';
import KeyboardBackspaceIcon from '@mui/icons-material/KeyboardBackspace';
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';
import { useState } from 'react';
import { Pagination } from 'swiper';

const Swipers = ({ item, show }: { item: any; show?: boolean }) => {
    const [swiperRef, setSwiperRef] = useState<any>(null);
    return (
        <div
            style={{
                aspectRatio: item?.executeResult?.imageList?.length === 0 ? '263 / 351' : 'auto'
            }}
            className="relative swiperImages overflow-hidden"
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
                        <Image
                            width={'100%'}
                            height={'100%'}
                            preview={false}
                            src={`${el?.url}?x-oss-process=image/resize,w_${show ? 380 : 300}/quality,q_80`}
                        />
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
            {item?.executeResult?.video && (
                <div className="absolute top-[calc(50%-20px)] left-[calc(50%-20px)] z-[1] w-[40px] h-[40px] rounded-full bg-[#673ab7] flex justify-center items-center">
                    <svg viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="3280" width="20" height="20">
                        <path
                            d="M897.143467 597.051733l-464.648534 311.5264c-46.976 31.488-110.592 18.944-142.08-28.023466A102.4 102.4 0 0 1 273.066667 823.5264V200.4736c0-56.5504 45.8496-102.4 102.4-102.4a102.4 102.4 0 0 1 57.028266 17.348267l464.64 311.5264c46.976 31.488 59.528533 95.104 28.032 142.08a102.4 102.4 0 0 1-28.023466 28.023466z"
                            p-id="3281"
                            fill="#ffffff"
                        ></path>
                    </svg>
                </div>
            )}
        </div>
    );
};
export default Swipers;
