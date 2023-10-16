import { Button, CardActions, CardContent, Divider, Grid, IconButton, Modal, Tab, Tabs, TextField } from '@mui/material';
import MainCard from 'ui-component/cards/MainCard';
import CloseIcon from '@mui/icons-material/Close';
import { InboxOutlined } from '@ant-design/icons';
import type { UploadProps } from 'antd';
import { message, Upload } from 'antd';
import { useState } from 'react';
import { TabPanel } from 'views/template/myChat/createChat';

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

function a11yProps(index: number) {
    return {
        id: `simple-tab-${index}`,
        'aria-controls': `simple-tabpanel-${index}`
    };
}

export const AddKeywordModal = ({ open, handleClose }: IAddKeywordModalProps) => {
    const [tab, setTab] = useState(0);

    return (
        <Modal open={open} onClose={handleClose} aria-labelledby="modal-title" aria-describedby="modal-description">
            <MainCard
                style={{
                    position: 'absolute',
                    top: '50%',
                    left: '50%',
                    transform: 'translate(-50%, -50%)'
                }}
                title={'新增'}
                content={false}
                className="sm:w-[700px] xs:w-[300px]"
                secondary={
                    <IconButton onClick={handleClose} size="large" aria-label="close modal">
                        <CloseIcon fontSize="small" />
                    </IconButton>
                }
            >
                <CardContent
                    sx={{
                        p: 1
                    }}
                >
                    <Tabs
                        value={tab}
                        onChange={(e, v) => {
                            setTab(v);
                        }}
                        aria-label="basic tabs example"
                    >
                        <Tab label="新增" {...a11yProps(0)} />
                        <Tab label="导入" {...a11yProps(1)} />
                    </Tabs>
                    <TabPanel value={tab} index={0}>
                        <TextField multiline rows={4} label={'关键词'} className="w-full" />
                    </TabPanel>
                    <TabPanel value={tab} index={1}>
                        <Dragger {...props}>
                            <p className="ant-upload-drag-icon">
                                <InboxOutlined rev={undefined} />
                            </p>
                            <p className="ant-upload-text">Click or drag file to this area to upload</p>
                            <p className="ant-upload-hint">
                                Support for a single or bulk upload. Strictly prohibited from uploading company data or other banned files.
                            </p>
                        </Dragger>
                    </TabPanel>
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
