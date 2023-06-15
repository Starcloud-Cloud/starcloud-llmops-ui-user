import React, { useRef, useState } from 'react';
import AvatarEditor from 'react-avatar-editor';
import { Button, Slider, Grid } from '@mui/material';
import RotateLeftIcon from '@mui/icons-material/RotateLeft';
import RotateRightIcon from '@mui/icons-material/RotateRight';
import RestoreIcon from '@mui/icons-material/Restore';
import UploadTwoToneIcon from '@mui/icons-material/UploadTwoTone';
import { styled } from '@mui/system';
// import axios from 'axios';

interface AvatarUploadProps {
    defaultImageSrc?: string;
}

const AvatarUpload: React.FC<AvatarUploadProps> = ({ defaultImageSrc }) => {
    const [image, setImage] = useState<string | undefined>(defaultImageSrc);
    const [scale, setScale] = useState<number>(1);
    const [rotate, setRotate] = useState<number>(0);
    const editorRef = useRef<AvatarEditor | null>(null);
    const StyledUploadTwoToneIcon = styled(UploadTwoToneIcon)`
        margin: 0;
    `;

    const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files.length > 0) {
            setImage(URL.createObjectURL(e.target.files[0]));
        }
    };

    const handleScaleChange = (_event: any, newValue: number | number[]) => {
        setScale(newValue as number);
    };

    const handleRotateRight = () => {
        setRotate(rotate + 90);
    };

    const handleRotateLeft = () => {
        setRotate(rotate - 90);
    };

    const handleReset = () => {
        setScale(1);
        setRotate(0);
    };

    // const handleUpload = async () => {
    //     if (editorRef.current) {
    //         const canvas = editorRef.current.getImageScaledToCanvas();
    //         canvas.toBlob(async (blob) => {
    //             const formData = new FormData();
    //             formData.append('file', blob!, 'newFile.jpeg');
    //             // Replace url with your own backend url
    //             const url = 'https://your-backend-url/upload';
    //             await axios.post(url, formData, {
    //                 headers: {
    //                     'Content-Type': 'multipart/form-data'
    //                 }
    //             });
    //         }, 'image/jpeg');
    //     }
    // };

    return (
        <div>
            {image && (
                <div>
                    <div
                        style={{
                            display: 'flex',
                            justifyContent: 'center',
                            alignItems: 'center'
                        }}
                    >
                        <div
                            style={{
                                borderRadius: '50%',
                                overflow: 'hidden',
                                width: '250px',
                                height: '250px',
                                display: 'flex',
                                justifyContent: 'center',
                                alignItems: 'center'
                            }}
                        >
                            <AvatarEditor
                                ref={editorRef}
                                image={image}
                                width={250}
                                height={250}
                                border={50}
                                color={[0, 0, 0, 0]}
                                scale={scale}
                                rotate={rotate}
                            />
                        </div>
                    </div>
                    <br />
                    <Slider value={scale} min={1} max={3} step={0.01} onChange={handleScaleChange} />
                    <Grid container spacing={2} alignItems="center">
                        <Grid item>
                            <label htmlFor="containedButtonFile">
                                <Button
                                    variant="outlined"
                                    size="medium"
                                    startIcon={<StyledUploadTwoToneIcon />}
                                    title="上传图片"
                                    sx={{
                                        '& .MuiButton-startIcon': {
                                            margin: 0
                                        }
                                    }}
                                >
                                    {' '}
                                    <input
                                        accept="image/*"
                                        style={{
                                            opacity: 0,
                                            position: 'absolute',
                                            zIndex: 1,
                                            padding: 0.5,
                                            cursor: 'pointer',
                                            width: '100%'
                                        }}
                                        id="containedButtonFile"
                                        multiple
                                        type="file"
                                        onChange={handleImageUpload}
                                    />
                                </Button>
                            </label>
                        </Grid>
                        <Grid item>
                            <Button onClick={handleReset} size="large" startIcon={<RestoreIcon />} title="重置" />
                        </Grid>
                        <Grid item>
                            <Button onClick={handleRotateLeft} size="large" startIcon={<RotateLeftIcon />} title="向左旋转" />
                        </Grid>
                        <Grid item>
                            <Button onClick={handleRotateRight} size="large" startIcon={<RotateRightIcon />} title="向右旋转" />
                        </Grid>
                    </Grid>
                </div>
            )}
        </div>
    );
};

export default AvatarUpload;
