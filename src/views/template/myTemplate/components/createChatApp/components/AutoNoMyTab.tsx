import { Grid } from '@mui/material';
import { TabPanel } from '../../createTemplate/index';
import ChatAccordion from './ChatAccordion';

type KnowledgeTabProps = {
    currentTab: number;
};

const AutoNoMyTab = ({ currentTab }: KnowledgeTabProps) => {
    const defaultExpandData = [
        {
            id: '1',
            defaultExpand: true,
            title: (
                <div className="flex flex-col">
                    <span>Deep Thinking</span>
                    <span className="text-xs font-normal text-slate-400">
                        Enable Genius to engage in deep thinking and enhance its ability to solve complex problems.
                    </span>
                </div>
            ),
            content: ''
        },
        {
            id: '2',
            title: (
                <div className="flex flex-col">
                    <div>Self Learning</div>
                    <span className="text-xs font-normal text-slate-400">
                        Enable Genius to self-learn and grow during interactions with users, and learn to provide services in a way that is
                        tailored to users' habits.
                    </span>
                </div>
            ),
            content: ''
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
        <TabPanel value={currentTab} index={4}>
            <Grid item xs={12} sm={6}>
                <ChatAccordion data={defaultExpandData} />
            </Grid>
        </TabPanel>
    );
};

export default AutoNoMyTab;
