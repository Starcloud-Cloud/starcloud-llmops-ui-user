import { Grid, TextField } from '@mui/material';
import { TabPanel } from '../../createTemplate/index';
import ChatAccordion from './ChatAccordion';

type KnowledgeTabProps = {
    currentTab: number;
};

const PublishTab = ({ currentTab }: KnowledgeTabProps) => {
    const defaultExpandData = [
        {
            id: '1',
            defaultExpand: true,
            title: (
                <div className="flex flex-col">
                    <span>Genius description</span>
                    <span className="text-xs font-normal text-slate-400">Use one line to describe what your Genius can do.</span>
                </div>
            ),
            content: <TextField fullWidth id="outlined-multiline-static" defaultValue="Default Value" />
        },
        {
            id: '2',
            title: (
                <div className="flex flex-col">
                    <div>User Guide</div>
                    <span className="text-xs font-normal text-slate-400">
                        Introduce users to the capabilities of Genius and best practices of interacting with it.
                    </span>
                </div>
            ),
            content: (
                <div>
                    <div className="container">
                        {/* <MDEditor value={value} onChange={setValue} /> */}
                        {/* <MDEditor.Markdown source={value} style={{ whiteSpace: 'pre-wrap' }} /> */}
                    </div>
                </div>
            )
        },
        {
            id: '3',
            title: (
                <div className="flex flex-col">
                    <div>Teamwork</div>
                    <span className="text-xs font-normal text-slate-400">
                        Enable Genius to work in teams and collaborate effectively. Each Genius has expertise in a specific field, and
                        through teamwork, their ability to solve problems can be significantly enhanced.
                    </span>
                </div>
            ),
            content: ''
        }
    ];
    return (
        <TabPanel value={currentTab} index={5}>
            <Grid item xs={12} sm={6}>
                <ChatAccordion data={defaultExpandData} />
            </Grid>
        </TabPanel>
    );
};

export default PublishTab;
