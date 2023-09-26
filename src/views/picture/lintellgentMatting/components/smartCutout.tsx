import EditBackgroundImage from './component';
import { removeBackground } from 'api/picture/images';
const SmartCutout = () => {
    return <EditBackgroundImage save={removeBackground} />;
};
export default SmartCutout;
