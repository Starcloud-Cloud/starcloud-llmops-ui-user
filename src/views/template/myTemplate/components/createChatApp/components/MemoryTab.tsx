import { Button, Grid, TextField } from '@mui/material';
import { TabPanel } from '../../createTemplate/index';
import ChatAccordion from './ChatAccordion';

import LinkIcon from '@mui/icons-material/Link';
type KnowledgeTabProps = {
    currentTab: number;
};

const MemoryTab = ({ currentTab }: KnowledgeTabProps) => {
    const defaultExpandData = [
        {
            id: '1',
            defaultExpand: true,
            title: (
                <div className="flex flex-col">
                    <span>Structured Memory</span>
                    <span className="text-xs font-normal text-slate-400">
                        Enable Genius to record structured information for users, with features such as accounting and to-do lists.
                    </span>
                </div>
            ),
            content: (
                <div>
                    <Button variant="contained" startIcon={<LinkIcon />} color="secondary">
                        Add a Table
                    </Button>
                </div>
            )
        },
        {
            id: '2',
            title: (
                <div className="flex flex-col">
                    <div>How to use memory</div>
                    <span className="text-xs font-normal text-slate-400">
                        A brief introduction to the genius, including identity, personality, hobbies, dreams, etc.
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
        <TabPanel value={currentTab} index={3}>
            <Grid item xs={12} sm={6}>
                <ChatAccordion data={defaultExpandData} />
            </Grid>
        </TabPanel>
    );
};

export default MemoryTab;
