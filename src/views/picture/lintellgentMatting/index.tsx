import { Card, CardMedia, CardContent, Typography } from '@mui/material';
import { Slider } from 'antd';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import background from 'assets/images/styles/background.jpeg';
import backgrounds from 'assets/images/styles/backgrounds.jpeg';
const LintellgentMatting = () => {
    const navigate = useNavigate();
    const [dragDistance, setDragDistance] = useState(50);
    return (
        <div className="h-full w-full flex items-center justify-center">
            <div className="flex gap-10">
                <Card
                    onClick={(e: any) => {
                        if (e.target.tagName === 'IMG') {
                            navigate('/smartImage');
                        }
                    }}
                    sx={{ width: 400, textAlign: 'center', cursor: 'pointer' }}
                >
                    <div className="h-[267px] relative">
                        <img
                            className="absolute object-left left-0 object-cover h-[100%] select-none"
                            style={{ width: `${dragDistance}%` }}
                            src={backgrounds}
                            alt=""
                        />
                        <img
                            className="absolute object-right right-0 object-cover h-[100%] select-none"
                            style={{ width: `calc(100% - (${dragDistance}%))` }}
                            src={background}
                            alt=""
                        />
                        <Slider
                            trackStyle={{ background: 'transparent' }}
                            railStyle={{ background: 'transparent' }}
                            className="absolute left-0 right-0 top-0 bottom-0 m-auto"
                            tooltip={{ open: false }}
                            onChange={(value: number) => {
                                setDragDistance(value);
                            }}
                            value={dragDistance}
                        />
                        <div className="absolute w-0.5 bg-gray-100 h-full top-0" style={{ left: dragDistance + '%' }}></div>
                    </div>
                    <CardContent>
                        <Typography gutterBottom variant="h3">
                            批量自动抠图
                        </Typography>
                        <Typography my={1} variant="h3" color="text.secondary">
                            全品类智能识别
                        </Typography>
                        <Typography variant="h3" color="text.secondary">
                            一键批量自动抠出主体
                        </Typography>
                    </CardContent>
                </Card>
                <Card onClick={() => navigate('/delImageText')} sx={{ width: 400, textAlign: 'center', cursor: 'pointer' }}>
                    <CardMedia
                        sx={{ height: 224 }}
                        image="https://linkfoxai-ailab-prod.oss-cn-shenzhen.aliyuncs.com/UPLOAD/example/cutout-by-select.png"
                        title="green iguana"
                    />
                    <CardContent>
                        <Typography gutterBottom variant="h3" component="div">
                            批量自动去除背景文字
                        </Typography>
                        <Typography my={1} variant="h3" color="text.secondary">
                            全品类智能识别
                        </Typography>
                        <Typography variant="h3" color="text.secondary">
                            一键去除背景文字
                        </Typography>
                    </CardContent>
                </Card>
            </div>
        </div>
    );
};
export default LintellgentMatting;
