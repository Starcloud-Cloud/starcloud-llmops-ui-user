import EditBackgroundImage from './component';
import { removeBackground } from 'api/picture/images';
const SmartCutout = () => {
    return <EditBackgroundImage scene="IMAGE_REMOVE_BACKGROUND" appUid="REMOVE_BACKGROUND_IMAGE" save={removeBackground} />;
};
export default SmartCutout;
