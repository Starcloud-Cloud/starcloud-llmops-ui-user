import { Button, CardActions, CardContent, Divider, Grid, IconButton, Modal } from '@mui/material';
import MainCard from 'ui-component/cards/MainCard';
import CloseIcon from '@mui/icons-material/Close';
import { gridSpacing } from 'store/constant';
import { InboxOutlined } from '@ant-design/icons';
import type { UploadProps } from 'antd';
import { message, Upload } from 'antd';

type IAddKeywordModalProps = {
    open: boolean;
    handleClose: () => void;
};

const { Dragger } = Upload;

const props: UploadProps = {
    name: 'file',
    multiple: true,
    action: 'https://run.mocky.io/v3/435e224c-44fb-4773-9faf-380c5e6a2188',
    onChange(info) {
        const { status } = info.file;
        if (status !== 'uploading') {
            console.log(info.file, info.fileList);
        }
        if (status === 'done') {
            message.success(`${info.file.name} file uploaded successfully.`);
        } else if (status === 'error') {
            message.error(`${info.file.name} file upload failed.`);
        }
    },
    onDrop(e) {
        console.log('Dropped files', e.dataTransfer.files);
    }
};

export const AddKeywordModal = ({ open, handleClose }: IAddKeywordModalProps) => {
    return (
        <Modal open={open} onClose={handleClose} aria-labelledby="modal-title" aria-describedby="modal-description">
            <MainCard
                style={{
                    position: 'absolute',
                    top: '50%',
                    left: '50%',
                    transform: 'translate(-50%, -50%)'
                }}
                title={'导入关键词'}
                content={false}
                className="sm:w-[700px] xs:w-[300px]"
                secondary={
                    <IconButton onClick={handleClose} size="large" aria-label="close modal">
                        <CloseIcon fontSize="small" />
                    </IconButton>
                }
            >
                <CardContent>
                    <Grid container spacing={gridSpacing} className="w-full flex justify-center pt-[24px] ml-0">
                        <Dragger {...props}>
                            <p className="ant-upload-drag-icon">
                                <InboxOutlined rev={undefined} />
                            </p>
                            <p className="ant-upload-text">Click or drag file to this area to upload</p>
                            <p className="ant-upload-hint">
                                Support for a single or bulk upload. Strictly prohibited from uploading company data or other banned files.
                            </p>
                        </Dragger>
                    </Grid>
                </CardContent>
                <Divider />
                <CardActions>
                    <Grid container justifyContent="flex-end">
                        <Button variant="contained" type="button" color="secondary" onClick={() => {}}>
                            确认
                        </Button>
                    </Grid>
                </CardActions>
            </MainCard>
        </Modal>
    );
};
