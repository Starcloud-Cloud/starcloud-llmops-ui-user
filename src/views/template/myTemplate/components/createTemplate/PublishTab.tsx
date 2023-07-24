import ContentCopyTwoToneIcon from '@mui/icons-material/ContentCopyTwoTone';
import ExpandLessIcon from '@mui/icons-material/ExpandLess';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import LanguageIcon from '@mui/icons-material/Language';
import ShareIcon from '@mui/icons-material/Share';
import StorefrontIcon from '@mui/icons-material/Storefront';
import WebhookIcon from '@mui/icons-material/Webhook';
import { Button, Chip, Grid, IconButton, InputAdornment, TextField, Tooltip } from '@mui/material';
import { useState } from 'react';
import CopyToClipboard from 'react-copy-to-clipboard';
import { useDispatch } from 'store';
import { openSnackbar } from 'store/slices/snackbar';
import ChatAccordion from './ChatAccordion';
import { PublishRecord } from './PublishRecord';
import { TabPanel } from './index';
type KnowledgeTabProps = {
    currentTab: number;
};

const PublishTab = ({ currentTab }: KnowledgeTabProps) => {
    const dispatch = useDispatch();
    const [text1, setText1] = useState('');
    const [visibleRecord, setVisibleRecord] = useState(false);

    const defaultExpandData = [
        {
            id: '1',
            defaultExpand: true,
            disabled: true,
            title: (
                <div className="flex items-center">
                    <ShareIcon />
                    <div className="flex flex-col ml-3">
                        <span>Share Link</span>
                        <span className="text-xs font-normal text-slate-400">
                            Share your Genius with your friends via the public genius link.
                        </span>
                    </div>
                </div>
            ),
            content: (
                <TextField
                    fullWidth
                    label="Website"
                    type="text"
                    value={text1}
                    onChange={(e) => {
                        setText1(e.target.value);
                    }}
                    InputProps={{
                        endAdornment: (
                            <InputAdornment position="end">
                                <CopyToClipboard
                                    text={text1}
                                    onCopy={() =>
                                        dispatch(
                                            openSnackbar({
                                                open: true,
                                                message: 'Text Copied',
                                                variant: 'alert',
                                                alert: {
                                                    color: 'success'
                                                },
                                                close: false,
                                                anchorOrigin: { vertical: 'top', horizontal: 'right' },
                                                transition: 'SlideLeft'
                                            })
                                        )
                                    }
                                >
                                    <Tooltip title="Copy">
                                        <IconButton aria-label="Copy from another element" edge="end" size="large">
                                            <ContentCopyTwoToneIcon sx={{ fontSize: '1.1rem' }} />
                                        </IconButton>
                                    </Tooltip>
                                </CopyToClipboard>
                            </InputAdornment>
                        )
                    }}
                />
            )
        },
        {
            id: '2',
            defaultExpand: false,
            title: (
                <div className="flex items-center">
                    <StorefrontIcon />
                    <div className="flex flex-col ml-3">
                        <div>
                            <span>Marketplace</span>
                            <Chip className="ml-2" label="未发布" variant="outlined" disabled size="small" />
                            <Chip className="ml-2" label="发布成功" variant="outlined" color="primary" size="small" />
                            <Chip className="ml-2" label="待审批" variant="outlined" color="warning" size="small" />
                            <Chip className="ml-2" label="拒绝" variant="outlined" color="error" size="small" />
                        </div>
                        <span className="text-xs font-normal text-slate-400">
                            Publish Genius to Marketplace, where all the other users can interact with it.
                        </span>
                    </div>
                </div>
            ),
            content: (
                <div>
                    <div className="flex items-center">
                        <Button color="secondary" type="submit" variant="contained" size="small">
                            发布
                        </Button>
                        <div className="flex items-center cursor-pointer ml-3" onClick={() => setVisibleRecord(!visibleRecord)}>
                            <span>查看发记录</span>
                            {!visibleRecord ? <ExpandLessIcon /> : <ExpandMoreIcon />}
                        </div>
                    </div>
                    {visibleRecord && <PublishRecord />}
                </div>
            )
        },
        {
            id: '3',
            defaultExpand: false,
            disabled: true,
            title: (
                <div className="flex items-center">
                    <LanguageIcon />
                    <div className="flex flex-col ml-3">
                        <div>
                            <span>Web Widget (Canary testing)</span>
                        </div>
                        <span className="text-xs font-normal text-slate-400">Enable Genius to 'Float' in the site.</span>
                    </div>
                </div>
            ),
            content: <></>
        },
        {
            id: '4',
            defaultExpand: false,
            disabled: true,
            title: (
                <div className="flex items-center">
                    <WebhookIcon />
                    <div className="flex flex-col ml-3">
                        <div>
                            <span>View API Key (Canary testing)</span>
                        </div>
                        <span className="text-xs font-normal text-slate-400">
                            Export as API for other clients to call, including mobile apps, game apps, etc.
                        </span>
                    </div>
                </div>
            ),
            content: <></>
        }
    ];
    return (
        <TabPanel value={currentTab} index={2}>
            <Grid item xs={12} sm={6}>
                <ChatAccordion data={defaultExpandData} />
            </Grid>
        </TabPanel>
    );
};

export default PublishTab;
