import React, { forwardRef, useImperativeHandle, useRef, useState } from 'react';
import Cropper from 'react-cropper';
import 'cropperjs/dist/cropper.css';
import { Button, Grid } from '@mui/material';
import RotateLeftIcon from '@mui/icons-material/RotateLeft';
import RotateRightIcon from '@mui/icons-material/RotateRight';
import RestoreIcon from '@mui/icons-material/Restore';
import UploadTwoToneIcon from '@mui/icons-material/UploadTwoTone';
import FlipCameraAndroidIcon from '@mui/icons-material/FlipCameraAndroid';
import FlipCameraIosIcon from '@mui/icons-material/FlipCameraIos';
import ZoomInIcon from '@mui/icons-material/ZoomIn';
import ZoomOutIcon from '@mui/icons-material/ZoomOut';
import { styled } from '@mui/system';
import AnimateButton from 'ui-component/extended/AnimateButton';
import { useTheme } from '@mui/material/styles';

interface AvatarUploadProps {
    defaultImageSrc?: string;
    onUpload?: (image: string) => void;
}

interface AvatarUploadHandles {
    upload: () => void;
}

const AvatarUpload: React.ForwardRefRenderFunction<AvatarUploadHandles, AvatarUploadProps> = ({ defaultImageSrc, onUpload }, ref) => {
    const [image, setImage] = useState<string | undefined>(defaultImageSrc);
    const theme = useTheme();
    const cropperRef = useRef<HTMLImageElement>(null);

    const StyledUploadTwoToneIcon = styled(UploadTwoToneIcon)`
        margin: 0;
    `;

    const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files.length > 0) {
            setImage(URL.createObjectURL(e.target.files[0]));
        }
    };

    const handleRotateRight = () => {
        const currentCropper: any = cropperRef?.current;
        currentCropper.cropper.rotate(90);
    };

    const handleRotateLeft = () => {
        const currentCropper: any = cropperRef?.current;
        currentCropper.cropper.rotate(-90);
    };

    const handleReset = () => {
        const currentCropper: any = cropperRef?.current;
        currentCropper.cropper.reset();
    };

    const handleFlipHorizontal = () => {
        const currentCropper: any = cropperRef?.current;
        currentCropper.cropper.scaleX(-1);
    };

    const handleFlipVertical = () => {
        const currentCropper: any = cropperRef?.current;
        currentCropper.cropper.scaleY(-1);
    };

    const handleZoomIn = () => {
        const currentCropper: any = cropperRef?.current;
        currentCropper.cropper.zoom(0.1);
    };

    const handleZoomOut = () => {
        const currentCropper: any = cropperRef?.current;
        currentCropper.cropper.zoom(-0.1);
    };
    const handleUpload = () => {
        const currentCropper: any = cropperRef?.current;
        if (currentCropper) {
            const croppedCanvas = currentCropper.cropper.getCroppedCanvas();
            const dataUrl = croppedCanvas.toDataURL();
            onUpload && onUpload(dataUrl);
        }
    };
    useImperativeHandle(ref, () => ({
        upload: handleUpload
    }));

    return (
        <div>
            {image && (
                <div>
                    <div style={{ width: '100%', display: 'flex', justifyContent: 'center' }}>
                        <Cropper ref={cropperRef} src={image} style={{ height: 400, width: '100%' }} aspectRatio={1} guides={false} />
                    </div>
                    <br />
                    <Grid container spacing={1} alignItems="center" direction="row" wrap="nowrap">
                        <Grid item>
                            <label htmlFor="containedButtonFile">
                                <AnimateButton
                                    scale={{
                                        hover: 1.1,
                                        tap: 0.9
                                    }}
                                >
                                    <Button
                                        variant="outlined"
                                        size="medium"
                                        startIcon={<StyledUploadTwoToneIcon />}
                                        title="上传图片"
                                        sx={{
                                            '& .MuiButton-startIcon': {
                                                margin: 0
                                            },
                                            boxShadow: theme.customShadows.secondary,
                                            ':hover': {
                                                boxShadow: 'none'
                                            }
                                        }}
                                    >
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
                                </AnimateButton>
                            </label>
                        </Grid>
                        <Grid item>
                            <AnimateButton
                                scale={{
                                    hover: 1.1,
                                    tap: 0.9
                                }}
                            >
                                <Button
                                    onClick={handleReset}
                                    variant="outlined"
                                    size="medium"
                                    startIcon={<RestoreIcon />}
                                    title="重置"
                                    sx={{
                                        '& .MuiButton-startIcon': {
                                            margin: 0
                                        },
                                        boxShadow: theme.customShadows.secondary,
                                        ':hover': {
                                            boxShadow: 'none'
                                        }
                                    }}
                                />
                            </AnimateButton>
                        </Grid>
                        <Grid item>
                            <AnimateButton
                                scale={{
                                    hover: 1.1,
                                    tap: 0.9
                                }}
                            >
                                <Button
                                    onClick={handleRotateLeft}
                                    variant="outlined"
                                    size="medium"
                                    startIcon={<RotateLeftIcon />}
                                    title="向左旋转"
                                    sx={{
                                        '& .MuiButton-startIcon': {
                                            margin: 0
                                        },
                                        boxShadow: theme.customShadows.secondary,
                                        ':hover': {
                                            boxShadow: 'none'
                                        }
                                    }}
                                />
                            </AnimateButton>
                        </Grid>
                        <Grid item>
                            <AnimateButton
                                scale={{
                                    hover: 1.1,
                                    tap: 0.9
                                }}
                            >
                                <Button
                                    onClick={handleRotateRight}
                                    variant="outlined"
                                    size="medium"
                                    startIcon={<RotateRightIcon />}
                                    title="向右旋转"
                                    sx={{
                                        '& .MuiButton-startIcon': {
                                            margin: 0
                                        },
                                        boxShadow: theme.customShadows.secondary,
                                        ':hover': {
                                            boxShadow: 'none'
                                        }
                                    }}
                                />
                            </AnimateButton>
                        </Grid>
                        <Grid item>
                            <AnimateButton
                                scale={{
                                    hover: 1.1,
                                    tap: 0.9
                                }}
                            >
                                <Button
                                    onClick={handleFlipHorizontal}
                                    variant="outlined"
                                    size="medium"
                                    startIcon={<FlipCameraAndroidIcon />}
                                    title="水平翻转"
                                    sx={{
                                        '& .MuiButton-startIcon': {
                                            margin: 0
                                        },
                                        boxShadow: theme.customShadows.secondary,
                                        ':hover': {
                                            boxShadow: 'none'
                                        }
                                    }}
                                />
                            </AnimateButton>
                        </Grid>
                        <Grid item>
                            <AnimateButton
                                scale={{
                                    hover: 1.1,
                                    tap: 0.9
                                }}
                            >
                                <Button
                                    onClick={handleFlipVertical}
                                    variant="outlined"
                                    size="medium"
                                    startIcon={<FlipCameraIosIcon />}
                                    title="垂直翻转"
                                    sx={{
                                        '& .MuiButton-startIcon': {
                                            margin: 0
                                        },
                                        boxShadow: theme.customShadows.secondary,
                                        ':hover': {
                                            boxShadow: 'none'
                                        }
                                    }}
                                />
                            </AnimateButton>
                        </Grid>
                        <Grid item>
                            <AnimateButton
                                scale={{
                                    hover: 1.1,
                                    tap: 0.9
                                }}
                            >
                                <Button
                                    onClick={handleZoomIn}
                                    variant="outlined"
                                    size="medium"
                                    startIcon={<ZoomInIcon />}
                                    title="放大"
                                    sx={{
                                        '& .MuiButton-startIcon': {
                                            margin: 0
                                        },
                                        boxShadow: theme.customShadows.secondary,
                                        ':hover': {
                                            boxShadow: 'none'
                                        }
                                    }}
                                />
                            </AnimateButton>
                        </Grid>
                        <Grid item>
                            <AnimateButton
                                scale={{
                                    hover: 1.1,
                                    tap: 0.9
                                }}
                            >
                                <Button
                                    onClick={handleZoomOut}
                                    variant="outlined"
                                    size="medium"
                                    startIcon={<ZoomOutIcon />}
                                    title="缩小"
                                    sx={{
                                        '& .MuiButton-startIcon': {
                                            margin: 0
                                        },
                                        boxShadow: theme.customShadows.secondary,
                                        ':hover': {
                                            boxShadow: 'none'
                                        }
                                    }}
                                />
                            </AnimateButton>
                        </Grid>
                    </Grid>
                </div>
            )}
        </div>
    );
};

export default forwardRef(AvatarUpload);
