import EditBackgroundImage from './component';
import { upscale } from 'api/picture/images';
const UpscaleImage = () => {
    return <EditBackgroundImage subTitle="图片变高清" scene="IMAGE_SKETCH" appUid="SKETCH_TO_IMAGE" save={upscale} />;
};
export default UpscaleImage;
