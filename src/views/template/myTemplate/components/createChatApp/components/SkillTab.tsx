import { Button, Grid, TextField } from '@mui/material';
import { TabPanel } from '../../createTemplate/index';
import ChatAccordion from './ChatAccordion';

import InsertDriveFileIcon from '@mui/icons-material/InsertDriveFile';
import LinkIcon from '@mui/icons-material/Link';
type KnowledgeTabProps = {
    currentTab: number;
};

const SkillTab = ({ currentTab }: KnowledgeTabProps) => {
    const defaultExpandData = [
        {
            id: '1',
            defaultExpand: true,
            title: (
                <div className="flex flex-col">
                    <span>Learning APIs</span>
                    <span className="text-xs font-normal text-slate-400">
                        Unleash your Genius with the power to access real-time information and seamlessly operate data.
                    </span>
                </div>
            ),
            content: (
                <div>
                    <div>
                        <Button variant="contained" startIcon={<LinkIcon />} color="secondary">
                            Official Skill Library
                        </Button>
                        <Button className="ml-2" variant="contained" startIcon={<InsertDriveFileIcon />} color="secondary">
                            API Development
                        </Button>
                    </div>
                </div>
            )
        },
        {
            id: '2',
            defaultExpand: true,
            title: (
                <div className="flex flex-col">
                    <span>Learning Workflows</span>
                    <span className="text-xs font-normal text-slate-400">
                        Utilize a customizable chain of thought to achieve comprehensive analysis and in-depth output.
                    </span>
                </div>
            ),
            content: (
                <div>
                    <div>
                        <Button variant="contained" startIcon={<LinkIcon />} color="secondary">
                            Workflows Library
                        </Button>
                        <Button className="ml-2" variant="contained" startIcon={<InsertDriveFileIcon />} color="secondary">
                            Build New Workflow
                        </Button>
                    </div>
                </div>
            )
        },
        {
            id: '3',
            title: (
                <div className="flex flex-col">
                    <div>How to use skills</div>
                    <span className="text-xs font-normal text-slate-400">
                        Instruct the Genius on how and when they should be using skills.
                    </span>
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
                    <div>Shortcuts</div>
                    <span className="text-xs font-normal text-slate-400">
                        Shortcuts allow Genius to offer users convenient services, such as timed services and instant button triggers.
                    </span>
                </div>
            ),
            content: (
                <div>
                    <Button className="ml-2" variant="contained" startIcon={<InsertDriveFileIcon />} color="secondary">
                        Add a shortcut
                    </Button>
                </div>
            )
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

export default SkillTab;
