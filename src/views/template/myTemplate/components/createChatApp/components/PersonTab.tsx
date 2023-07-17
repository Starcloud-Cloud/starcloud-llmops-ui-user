import { PlusOutlined } from '@ant-design/icons';
import AddIcon from '@mui/icons-material/Add';
import GraphicEqIcon from '@mui/icons-material/GraphicEq';
import { Button, Checkbox, Grid, Switch, TextField } from '@mui/material';
import { Upload, UploadFile } from 'antd';
import React from 'react';
import { TabPanel } from '../../createTemplate/index';
import ChatAccordion from './ChatAccordion';

import RemoveIcon from '@mui/icons-material/Remove';
type PersonTabProps = {
    currentTab: number;
};

const PersonTab = ({ currentTab }: PersonTabProps) => {
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
                    <span>Avatar</span>
                    <span className="text-xs font-normal text-slate-400">Customize the appearance of your Genius.</span>
                </div>
            ),
            content: (
                <div>
                    <Upload
                        action="https://www.mocky.io/v2/5cc8019d300000980a055e76"
                        listType="picture-card"
                        fileList={fileList}
                        // onPreview={handlePreview}
                        // onChange={handleChange}
                    >
                        {uploadButton}
                    </Upload>
                </div>
            )
        },
        {
            id: '2',
            title: (
                <div className="flex flex-col">
                    <div>
                        Voice <Switch />
                    </div>
                    <span className="text-xs font-normal text-slate-400">Enable voices to hear your Genius speak.</span>
                </div>
            ),
            content: (
                <div>
                    <div>
                        <Button variant="contained" startIcon={<GraphicEqIcon />}>
                            选择声音
                        </Button>
                    </div>
                    <div></div>
                </div>
            )
        },
        {
            id: '3',
            title: (
                <div className="flex flex-col">
                    <span>Biography</span>
                    <span className="text-xs font-normal text-slate-400">
                        A brief introduction of your Genius that includes descriptions of their background, identity, personality, etc.
                    </span>
                </div>
            ),
            content: (
                <div>
                    <TextField fullWidth id="outlined-multiline-static" multiline rows={2} defaultValue="Default Value" />
                </div>
            )
        },
        {
            id: '4',
            title: (
                <div className="flex flex-col">
                    <span>Greeting</span>
                    <span className="text-xs font-normal text-slate-400">
                        Write an opening dialogue for your character to start its conversation with the user.
                    </span>
                </div>
            ),
            content: (
                <div>
                    <TextField fullWidth id="outlined-multiline-static" defaultValue="Default Value" />
                    <div className="flex flex-col">
                        <div className="flex items-center">
                            <Checkbox defaultChecked color="secondary" onChange={(e) => setCheckboxValue(e.target.value)} />
                            <span className="text-sm text-slate-500">Set common questions to guide users on how to use Genius</span>
                        </div>
                        <div className="flex items-center">
                            <div className="w-6/12">
                                <TextField fullWidth id="outlined-multiline-static" defaultValue="Default Value" />
                            </div>
                            <div className="w-6/12 flex ml-2">
                                <div className="flex w-[50px] h-[50px] justify-center items-center border rounded border-solid border-slate-300 cursor-pointer">
                                    <AddIcon />
                                </div>
                                <div className="flex w-[50px] h-[50px] justify-center items-center border rounded border-solid border-slate-300 ml-2 cursor-pointer">
                                    <RemoveIcon />
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            )
        },
        {
            id: '5',
            title: (
                <div className="flex flex-col">
                    <span>General Instruction</span>
                    <span className="text-xs font-normal text-slate-400">
                        Instructions can help dictate how the Genius will react in certain scenarios.
                    </span>
                </div>
            ),
            content: (
                <div>
                    <TextField fullWidth id="outlined-multiline-static" defaultValue="Default Value" />
                </div>
            )
        }
    ];
    return (
        <TabPanel value={currentTab} index={0}>
            <Grid item xs={12} sm={6}>
                <ChatAccordion data={defaultExpandData} />
            </Grid>
        </TabPanel>
    );
};

export default PersonTab;
