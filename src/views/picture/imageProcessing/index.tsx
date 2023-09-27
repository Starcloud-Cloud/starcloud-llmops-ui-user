import { Card, CardMedia, CardContent, Typography, Chip } from '@mui/material';
import { Image } from 'antd';
import { useNavigate } from 'react-router-dom';
import { useState, useRef } from 'react';
const ImageMatting = () => {
    const navigate = useNavigate();
    const [isDragging, setIsDragging] = useState(false);
    const [startX, setStartX] = useState<number>(0);
    const startRef = useRef<number>(0);
    const [dragDistance, setDragDistance] = useState(0);
    const dragRef = useRef<number>(0);
    const flagRef = useRef(false);
    return (
        <div className="h-full w-full flex items-center justify-center">
            <div className="flex gap-10">
                <Card onClick={() => {}} sx={{ width: 400, textAlign: 'center', cursor: 'pointer' }}>
                    <div
                        onMouseMove={(e: any) => {
                            if (isDragging) {
                                let distance = e.clientX - startRef.current;
                                if (dragRef.current && flagRef.current) {
                                    flagRef.current = false;
                                    distance += dragRef.current;
                                }
                                dragRef.current = distance;
                                setDragDistance(dragRef.current);
                            }
                        }}
                        onMouseUp={() => {
                            startRef.current = 0;
                            flagRef.current = true;
                            setStartX(startRef.current);
                            setIsDragging(false);
                        }}
                        className="h-[267px] relative"
                    >
                        <img
                            className="absolute object-left left-0 object-cover h-[100%]"
                            style={{ width: `calc(50% + (${dragDistance}px))` }}
                            src="https://linkfoxai-ailab-prod.oss-cn-shenzhen.aliyuncs.com/UPLOAD/example/img-enhance-before.png"
                            alt=""
                        />
                        <img
                            className="absolute object-right right-0 object-cover h-[100%]"
                            style={{ width: `calc(50% - (${dragDistance}px))` }}
                            src="https://linkfoxai-ailab-prod.oss-cn-shenzhen.aliyuncs.com/UPLOAD/example/img-enhance-after.png"
                            alt=""
                        />
                        <div className="absolute w-0.5 bg-gray-100 h-full top-0" style={{ left: `calc(50% + (${dragDistance}px))` }}>
                            <div
                                onMouseDown={(e: any) => {
                                    setIsDragging(true);
                                    startRef.current = e.clientX;
                                    setStartX(startRef.current);
                                }}
                                className="w-[20px] h-[20px] rounded-full bg-[red] ml-[-10px] mt-[65px] cursor-pointer"
                            ></div>
                        </div>
                    </div>
                    <CardContent>
                        <Typography gutterBottom variant="h3">
                            画质变高清
                        </Typography>
                        <Typography my={1} variant="h3" color="text.secondary">
                            超清画质重生，告别渣画质
                        </Typography>
                    </CardContent>
                </Card>
                <Card
                    onClick={() => navigate('/delImageText')}
                    sx={{ width: 400, textAlign: 'center', cursor: 'pointer', position: 'relative' }}
                >
                    <CardMedia
                        sx={{ height: '267px' }}
                        image="https://linkfoxai-ailab-prod.oss-cn-shenzhen.aliyuncs.com/UPLOAD/example/upscale-after.png"
                        title="green iguana"
                    />
                    <CardContent>
                        <Typography gutterBottom variant="h3">
                            图片无损放大
                        </Typography>
                        <Typography mt={1} variant="h3" color="text.secondary">
                            放大清晰不失真，细节更丰富
                        </Typography>
                    </CardContent>
                    <div className="absolute top-[5px] left-[5px] rounded-lg overflow-hidden border-[5px] border-solid border-[#fff]">
                        <div className="relative">
                            <Image
                                preview={false}
                                width={100}
                                src="https://linkfoxai-ailab-prod.oss-cn-shenzhen.aliyuncs.com/UPLOAD/example/upscale-after.png"
                            />
                            <Chip color="secondary" className="absolute text-[12px] top-[1px] right-[1px]" size="small" label="原图" />
                        </div>
                    </div>
                    <Chip color="secondary" className="absolute text-[12px] top-[5px] right-[5px]" size="small" label="无损放大后" />
                </Card>
            </div>
        </div>
    );
};
export default ImageMatting;
