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
                            'https://outin-8f077b286e5d11ee8a1600163e32a995.oss-cn-shanghai.aliyuncs.com/22993e306e6371ee80796632b68f0102/d7d0dbf3cc5e1afb7f933cdb733900ec-ld.mp4?Expires=1700213465&OSSAccessKeyId=LTAIxSaOfEzCnBOj&Signature=In7hY2z5sZW9wvL6e9oK%2FpNXKuA%3D'
                        }
                    />
                </CardContent>
            </MainCard>
        </Modal>
    );
};
