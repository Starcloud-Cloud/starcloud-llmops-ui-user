import EditBackgroundImage from './component';
import { removeText } from 'api/picture/images';
const DelDebackGroundText = () => {
    return <EditBackgroundImage save={removeText} />;
};
export default DelDebackGroundText;
