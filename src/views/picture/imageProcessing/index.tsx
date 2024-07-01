import { Card, CardMedia, CardContent, Typography, Chip } from '@mui/material';
import { ConfigProvider, Image, Slider } from 'antd';
import { LeftOutlined, RightOutlined } from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';
import { useState } from 'react';
import px from 'assets/images/styles/px.jpeg';
import dish from 'assets/images/styles/dish.jpeg';
const ImageMatting = () => {
    const navigate = useNavigate();
    const [dragDistance, setDragDistance] = useState(50);
    return (
        <div className="h-full w-full flex items-center justify-center">
            <div className="flex gap-10">
                <Card
                    onClick={(e: any) => {
                        if (e.target.tagName === 'IMG') {
                            navigate('/upscaleImage');
                        }
                    }}
                    sx={{ width: 400, textAlign: 'center', cursor: 'pointer' }}
                >
                    <div className="h-[267px] relative">
                        <img
                            className="absolute object-left left-0 object-cover h-[100%] select-none"
                            style={{ width: `${dragDistance}%`, filter: 'blur(2px)' }}
                            src={px}
                            alt=""
                        />
                        <img
                            className="absolute object-right right-0 object-cover h-[100%] select-none"
                            style={{ width: `calc(100% - (${dragDistance}%))` }}
                            src={px}
                            alt=""
                        />
                        <ConfigProvider
                            theme={{
                                components: {
                                    Slider: {
                                        handleSize: 24,
                                        handleSizeHover: 24,
                                        handleLineWidth: 0,
                                        handleLineWidthHover: 0
                                    }
                                }
                            }}
                        >
                            <Slider
                                trackStyle={{ background: 'transparent' }}
                                railStyle={{ background: 'transparent' }}
                                handleStyle={{ zIndex: 100, opacity: 0.1 }}
                                className="absolute left-0 right-0 top-0 bottom-0 m-auto z-1"
                                tooltip={{ open: false }}
                                onChange={(value: number) => {
                                    setDragDistance(value);
                                }}
                                value={dragDistance}
                            />
                        </ConfigProvider>

                        <div
                            className="flex justify-center items-center absolute w-0.5 bg-gray-100 h-full top-0"
                            style={{ left: dragDistance + '%' }}
                        >
                            <div className="w-[29px] h-[29px] flex rounded-full bg-[#fff] border border-solid border-[#673ab7]">
                                <LeftOutlined />
                                <RightOutlined />
                            </div>
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
                    onClick={() => navigate('/largementImage')}
                    sx={{ width: 400, textAlign: 'center', cursor: 'pointer', position: 'relative' }}
                >
                    <CardMedia sx={{ height: '267px' }} image={dish} title="green iguana" />
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
                            <Image preview={false} width={100} src={dish} />
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
