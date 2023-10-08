import { Card, CardMedia, CardContent, Typography } from '@mui/material';
import { useNavigate } from 'react-router-dom';
const LintellgentMatting = () => {
    const navigate = useNavigate();

    return (
        <div className="h-full w-full flex items-center justify-center">
            <div className="flex gap-10">
                <Card onClick={() => navigate('/smartImage')} sx={{ width: 345, textAlign: 'center', cursor: 'pointer' }}>
                    <CardMedia
                        sx={{ height: 224 }}
                        image="https://linkfoxai-ailab-prod.oss-cn-shenzhen.aliyuncs.com/UPLOAD/example/cutout-auto.png"
                        title="green iguana"
                    />
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
                <Card onClick={() => navigate('/delImageText')} sx={{ width: 345, textAlign: 'center', cursor: 'pointer' }}>
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
