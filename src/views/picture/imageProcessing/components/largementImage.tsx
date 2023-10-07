import EditBackgroundImage from './component';
import { upscale } from 'api/picture/images';
const EnlargementImage = () => {
    return <EditBackgroundImage subTitle="图片无损放大" scene="IMAGE_UPSCALING" appUid="UPSCALING_IMAGE" save={upscale} />;
};
export default EnlargementImage;
