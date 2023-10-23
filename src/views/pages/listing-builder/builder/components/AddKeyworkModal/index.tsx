import { Button, CardActions, CardContent, Divider, Grid, IconButton, Modal, Tab, Tabs, TextField } from '@mui/material';
import MainCard from 'ui-component/cards/MainCard';
import CloseIcon from '@mui/icons-material/Close';
import { useState } from 'react';
import { TabPanel } from 'views/template/myChat/createChat';
import { addKey, saveListing } from 'api/listing/build';
import { useListing } from 'contexts/ListingContext';
import { useLocation, useNavigate } from 'react-router-dom';

type IAddKeywordModalProps = {
    open: boolean;
    handleClose: () => void;
};

function a11yProps(index: number) {
    return {
        id: `simple-tab-${index}`,
        'aria-controls': `simple-tabpanel-${index}`
    };
}

/**
 * 添加导入关键词弹窗
 */
export const AddKeywordModal = ({ open, handleClose }: IAddKeywordModalProps) => {
    const [tab, setTab] = useState(0);
    const [keyWord, setKeyWord] = useState<string>('');
    const { uid, setVersion, setUid, country, version } = useListing();
    const navigate = useNavigate();

    const handleOk = async () => {
        const lines = keyWord.split('\n');
        if (uid) {
            const res = addKey({ uid, version, addKey: lines });
        } else {
            const res = await saveListing({ keys: lines, endpoint: country.key });
            navigate(`/listingBuilder?uid=${res.uid}&version=${res.version}`);
            setVersion(res.version);
            setUid(res.uid);
            handleClose();
        }
    };

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
                        <TextField
                            multiline
                            rows={4}
                            label={'关键词'}
                            className="w-full"
                            onChange={(e) => {
                                setKeyWord(e.target.value);
                            }}
                        />
                    </TabPanel>
                    <TabPanel value={tab} index={1}></TabPanel>
                </CardContent>
                <Divider />
                <CardActions>
                    <Grid container justifyContent="flex-end">
                        <Button variant="contained" type="button" color="secondary" onClick={handleOk}>
                            确认
                        </Button>
                    </Grid>
                </CardActions>
            </MainCard>
        </Modal>
    );
};
