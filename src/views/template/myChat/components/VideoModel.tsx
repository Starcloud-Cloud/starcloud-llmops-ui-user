import { Button, CardContent, IconButton, Modal } from '@mui/material';
import MainCard from 'ui-component/cards/MainCard';
import CloseIcon from '@mui/icons-material/Close';
import { useEffect } from 'react';

export const VideoModel = ({ handleClose, open }: { handleClose: () => void; open: boolean }) => {
    return (
        <Modal open={open} onClose={handleClose} aria-labelledby="modal-title" aria-describedby="modal-description">
            <MainCard
                style={{
                    position: 'absolute',
                    width: '80%',
                    maxWidth: '960px',
                    top: '50%',
                    left: '50%',
                    transform: 'translate(-50%, -50%)'
                }}
                title="AI机器人教程"
                content={false}
                secondary={
                    <IconButton onClick={handleClose} size="large" aria-label="close modal">
                        <CloseIcon fontSize="small" />
                    </IconButton>
                }
            >
                <CardContent>
                    <video
                        controls
                        autoPlay
                        style={{
                            width: '100%',
                            height: '100%',
                            objectFit: 'fill'
                        }}
                        src={
                            'https://mofaai-others.oss-cn-hangzhou.aliyuncs.com/mofaai_web/%E9%AD%94%E6%B3%95AI%E6%9C%BA%E5%99%A8%E4%BA%BA%E4%BD%BF%E7%94%A8.mp4'
                        }
                    />
                </CardContent>
            </MainCard>
        </Modal>
    );
};
