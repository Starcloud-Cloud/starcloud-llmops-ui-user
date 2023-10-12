import { Modal, IconButton, CardContent, Chip } from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import ArrowCircleDownIcon from '@mui/icons-material/ArrowCircleDown';
import MainCard from 'ui-component/cards/MainCard';
import downLoadImages from 'hooks/useDownLoadImage';
import { Image } from 'antd';
const ImageDetail = ({ detailOpen, detailData, handleClose }: { detailOpen: boolean; detailData: any; handleClose: () => void }) => {
    //下载图片
    const downLoadImage = () => {
        downLoadImages(detailData?.images[0].url, detailData?.images[0].mediaType.split('/')[1]);
    };
    return (
        <Modal open={detailOpen} onClose={handleClose} aria-labelledby="modal-title" aria-describedby="modal-description">
            <MainCard
                style={{
                    position: 'absolute',
                    width: '90%',
                    top: '10%',
                    left: '50%',
                    transform: 'translate(-50%, 0)',
                    maxHeight: '80%',
                    overflow: 'auto'
                }}
                title="图片历史记录"
                content={false}
                secondary={
                    <IconButton onClick={handleClose} size="large" aria-label="close modal">
                        <CloseIcon fontSize="small" />
                    </IconButton>
                }
            >
                <CardContent sx={{ p: 2, height: '100%', position: 'relative' }}>
                    <div className="min-h-[300px] flex items-center bg-[#fff]">
                        <div className="w-[50%] min-h-[300px] flex justify-center items-center border-r border-solid border-[#E8E8E8] relative">
                            <Image width="70%" preview={false} src={detailData?.originalUrl} />
                            <Chip className="absolute top-[0] right-[10px] text-[12px]" size="small" label="原图" variant="outlined" />
                        </div>
                        <div className="w-[50%] min-h-[300px] flex justify-center items-center relative">
                            <Image
                                style={{
                                    backgroundImage:
                                        'linear-gradient(45deg,#ccc 25%,transparent 25%,transparent 75%,#ccc 75%),linear-gradient(45deg,#ccc 25%,transparent 25%,transparent 75%,#ccc 75%)',
                                    backgroundSize: '6px 6px',
                                    backgroundPosition: '0 0,3px 3px'
                                }}
                                width="70%"
                                preview={false}
                                src={detailData?.images && detailData?.images[0]?.url}
                            />
                            <Chip className="absolute top-[0] left-[10px] text-[12px]" size="small" label="抠图后" variant="outlined" />
                        </div>
                    </div>
                    <IconButton onClick={downLoadImage} className="absolute right-[10px] bottom-[10px]" size="small" color="secondary">
                        <ArrowCircleDownIcon />
                    </IconButton>
                </CardContent>
            </MainCard>
        </Modal>
    );
};
export default ImageDetail;
