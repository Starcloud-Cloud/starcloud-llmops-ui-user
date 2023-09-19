import { Grid, Card, Typography, TextField } from '@mui/material';
import { Upload, Progress, Image } from 'antd';
import type { UploadProps } from 'antd';
import { PlusOutlined } from '@ant-design/icons';
import { useState } from 'react';
import { getAccessToken } from 'utils/auth';
const EditBackgroundImage = () => {
    const [widthScale, setWidthScale] = useState<number | null>(100);
    const [heightScale, setHeightScale] = useState<number | null>(100);
    const [imageList, setImageList] = useState<any[]>([]);

    //上传图片
    const { Dragger } = Upload;
    const props: UploadProps = {
        name: 'imageFile',
        data: {
            width: widthScale,
            height: heightScale
        },
        showUploadList: false,
        action: `${process.env.REACT_APP_BASE_URL}${process.env.REACT_APP_API_URL}/llm/image/upscale`,
        headers: {
            Authorization: 'Bearer ' + getAccessToken()
        },
        multiple: true,
        maxCount: 20,
        accept: '.png, .jpg, .webp',
        onChange(info) {
            if (info.file.status === 'uploading') {
                setImageList(
                    info.fileList.map((item) => {
                        if (item.response) {
                            return item;
                        } else {
                            return [];
                        }
                    })
                );
            } else if (info.file.status === 'done') {
                setImageList(info.fileList.map((item) => item));
            }
        },
        onDrop(e) {
            console.log('Dropped files', e.dataTransfer.files);
        }
    };
    return (
        <div>
            <Grid container spacing={2}>
                <Grid item md={3}>
                    <Card sx={{ height: '100vh', p: 2 }}>
                        <Typography mb={2} variant="h4">
                            放大像素值
                        </Typography>
                        <div className="flex gap-2">
                            <TextField
                                size="small"
                                name="chunkSize"
                                color="secondary"
                                label="放大宽度"
                                fullWidth
                                inputProps={{
                                    step: 1, // 设置输入步长
                                    min: 100, // 设置最小值
                                    max: 9999 // 设置最大值
                                }}
                                value={widthScale}
                                type="number"
                                onChange={(e: any) => {
                                    const { value } = e.target;
                                    setWidthScale(value);
                                }}
                                InputLabelProps={{ shrink: true }}
                            />
                            <TextField
                                size="small"
                                name="chunkSize"
                                color="secondary"
                                label="放大高度"
                                fullWidth
                                inputProps={{
                                    step: 1, // 设置输入步长
                                    min: 100, // 设置最小值
                                    max: 9999 // 设置最大值
                                }}
                                value={heightScale}
                                type="number"
                                onChange={(e: any) => {
                                    const { value } = e.target;
                                    setHeightScale(value);
                                }}
                                InputLabelProps={{ shrink: true }}
                            />
                        </div>
                    </Card>
                </Grid>
                <Grid item md={9}>
                    {imageList.length > 0 ? (
                        <div className="flex flex-wrap gap-2">
                            <Dragger className="w-[240px] h-[240px]" {...props}>
                                <div>
                                    <p className="ant-upload-drag-icon">
                                        <PlusOutlined rev={undefined} />
                                    </p>
                                    <p className="ant-upload-text">点击上传或直接将图片拖入区域</p>
                                    <p className="ant-upload-hint">仅支持 .jpg/.png/.webp 格式</p>
                                </div>
                            </Dragger>
                            {imageList.map((item, index) => (
                                <div
                                    key={index}
                                    className="w-[240px] h-[240px] rounded-lg overflow-hidden relative border border-solid border-[#d9d9d9]"
                                >
                                    <Image
                                        width="100%"
                                        className="object-cover	"
                                        src={'data:image/jpeg;base64,' + item.response?.data.binary}
                                        fallback="data:image/png;base64,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"
                                    />
                                    {item.percent !== 100 && (
                                        <div className="absolute bg-[#e5e7eb] left-0 top-0 w-full h-full opacity-70 flex items-center justify-center">
                                            <Progress type="circle" percent={item.percent} />
                                        </div>
                                    )}
                                </div>
                            ))}
                        </div>
                    ) : (
                        <div className="flex justify-center h-full items-center">
                            <Dragger className="w-[300px] h-[180px]" {...props}>
                                <div>
                                    <p className="ant-upload-drag-icon">
                                        <PlusOutlined rev={undefined} />
                                    </p>
                                    <p className="ant-upload-text">点击上传或直接将图片拖入区域</p>
                                    <p className="ant-upload-hint">仅支持 .jpg/.png/.webp 格式</p>
                                </div>
                            </Dragger>
                        </div>
                    )}
                </Grid>
            </Grid>
        </div>
    );
};
export default EditBackgroundImage;
