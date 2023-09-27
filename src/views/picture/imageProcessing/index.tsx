import { Card, CardMedia, CardContent, Typography } from '@mui/material';
import { useNavigate } from 'react-router-dom';
const ImageMatting = () => {
    const navigate = useNavigate();
    return (
        <div className="h-full w-full flex items-center justify-center">
            <div className="flex gap-10">
                <Card onClick={() => navigate('/smartImage')} sx={{ width: 345, textAlign: 'center', cursor: 'pointer' }}>
                    <CardMedia
                        sx={{ height: 140 }}
                        image="https://linkfoxai-ailab-prod.oss-cn-shenzhen.aliyuncs.com/UPLOAD/example/cutout-auto.png"
                        title="green iguana"
                    />
                    <CardContent>
                        <Typography gutterBottom variant="h3">
                            画质变高清
                        </Typography>
                        <Typography my={1} variant="h3" color="text.secondary">
                            超清画质重生，告别渣画质
                        </Typography>
                    </CardContent>
                </Card>
                <Card onClick={() => navigate('/delImageText')} sx={{ width: 345, textAlign: 'center', cursor: 'pointer' }}>
                    <CardMedia
                        sx={{ height: 140 }}
                        image="https://linkfoxai-ailab-prod.oss-cn-shenzhen.aliyuncs.com/UPLOAD/example/cutout-by-select.png"
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
                </Card>
            </div>
        </div>
    );
};
export default ImageMatting;
