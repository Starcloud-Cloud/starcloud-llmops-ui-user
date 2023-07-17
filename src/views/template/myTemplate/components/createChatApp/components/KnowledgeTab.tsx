import { PlusOutlined } from '@ant-design/icons';
import { Button, Grid, Switch, TextField } from '@mui/material';
import { UploadFile } from 'antd';
import React from 'react';
import { TabPanel } from '../../createTemplate/index';
import ChatAccordion from './ChatAccordion';

import InsertDriveFileIcon from '@mui/icons-material/InsertDriveFile';
import LinkIcon from '@mui/icons-material/Link';
type KnowledgeTabProps = {
    currentTab: number;
};

const KnowledgeTab = ({ currentTab }: KnowledgeTabProps) => {
    const [checkboxValue, setCheckboxValue] = React.useState('');
    const [fileList, setFileList] = React.useState<UploadFile[]>([
        {
            uid: '-1',
            name: 'image.png',
            status: 'done',
            url: 'https://zos.alipayobjects.com/rmsportal/jkjgkEfvpUPVyRjUImniVslZfWPnJuuZ.png'
        },
        {
            uid: '-2',
            name: 'image.png',
            status: 'done',
            url: 'https://zos.alipayobjects.com/rmsportal/jkjgkEfvpUPVyRjUImniVslZfWPnJuuZ.png'
        },
        {
            uid: '-3',
            name: 'image.png',
            status: 'done',
            url: 'https://zos.alipayobjects.com/rmsportal/jkjgkEfvpUPVyRjUImniVslZfWPnJuuZ.png'
        }
    ]);

    const uploadButton = (
        <div>
            <PlusOutlined rev={undefined} />
            <div style={{ marginTop: 8 }}>Upload</div>
        </div>
    );

    console.log(checkboxValue, 'checkboxValue');

    const defaultExpandData = [
        {
            id: '1',
            defaultExpand: true,
            title: (
                <div className="flex flex-col">
                    <span>Learning Knowledge</span>
                    <span className="text-xs font-normal text-slate-400">Train your Genius with customizable data.</span>
                </div>
            ),
            content: (
                <div>
                    <div>
                        <Button variant="contained" startIcon={<LinkIcon />} color="secondary">
                            链接网页地址
                        </Button>
                        <Button className="ml-2" variant="contained" startIcon={<InsertDriveFileIcon />} color="secondary">
                            上传文档
                        </Button>
                    </div>
                </div>
            )
        },
        {
            id: '2',
            title: (
                <div className="flex flex-col">
                    <div>
                        Learn from Web Search
                        <Switch />
                    </div>
                    <span className="text-xs font-normal text-slate-400">Enable to collect real-time information from the Internet.</span>
                </div>
            ),
            content: ''
        },
        {
            id: '3',
            title: (
                <div className="flex flex-col">
                    <div>When to use web search</div>
                </div>
            ),
            content: (
                <div>
                    <TextField fullWidth id="outlined-multiline-static" defaultValue="Default Value" />
                </div>
            )
        },
        {
            id: '4',
            title: (
                <div className="flex flex-col">
                    <div>Set the scope of web search</div>
                </div>
            ),
            content: (
                <div>
                    <TextField fullWidth id="outlined-multiline-static" multiline rows={2} defaultValue="Default Value" />
                </div>
            )
        }
    ];
    return (
        <TabPanel value={currentTab} index={1}>
            <Grid item xs={12} sm={6}>
                <ChatAccordion data={defaultExpandData} />
            </Grid>
        </TabPanel>
    );
};

export default KnowledgeTab;
