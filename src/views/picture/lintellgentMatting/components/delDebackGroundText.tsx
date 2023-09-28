import EditBackgroundImage from './component';
import { removeText } from 'api/picture/images';
const DelDebackGroundText = () => {
    return <EditBackgroundImage scene="IMAGE_REMOVE_TEXT" appUid="REMOVE_TEXT_IMAGE" save={removeText} />;
};
export default DelDebackGroundText;
