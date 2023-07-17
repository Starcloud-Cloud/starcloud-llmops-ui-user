import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import { Button, Card, CardHeader, Divider, Tab, Tabs } from '@mui/material';
import Link from '@mui/material/Link';
import { t } from 'i18next';
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { a11yProps } from '../createTemplate/index';
import AutoNoMyTab from './components/AutoNoMyTab';
import KnowledgeTab from './components/KnowledgeTab';
import MemoryTab from './components/MemoryTab';
import PersonTab from './components/PersonTab';
import PublishTab from './components/PublishTab';
import SkillTab from './components/SkillTab';
const CreateChatApp = () => {
    const navigate = useNavigate();
    const [value, setValue] = React.useState(1);
    const handleChange = (event: React.SyntheticEvent, newValue: number) => {
        setValue(newValue);
    };
    return (
        <div>
            <Card className="w-9/12">
                <CardHeader
                    sx={{ padding: 2 }}
                    avatar={
                        <Button
                            variant="contained"
                            startIcon={<ArrowBackIcon />}
                            color="secondary"
                            onClick={() => navigate('/template/createCenter')}
                        >
                            {t('myApp.back')}
                        </Button>
                    }
                    title={'SamaBlog'}
                    action={
                        <Button variant="contained" color="secondary">
                            {t('myApp.save')}
                        </Button>
                    }
                />
                <Divider />
                <Tabs
                    sx={{
                        m: 3,
                        '& a': {
                            minHeight: 'auto',
                            minWidth: 10,
                            py: 1.5,
                            px: 1,
                            mr: 2.2,
                            display: 'flex',
                            flexDirection: 'row',
                            alignItems: 'center',
                            justifyContent: 'center'
                        },
                        '& a > svg': {
                            mb: '0px !important',
                            mr: 1.1
                        }
                    }}
                    value={value}
                    variant="scrollable"
                    onChange={handleChange}
                >
                    <Tab component={Link} label={'角色'} {...a11yProps(0)} />
                    <Tab component={Link} label={'知识'} {...a11yProps(1)} />
                    <Tab component={Link} label={'技能'} {...a11yProps(2)} />
                    <Tab component={Link} label={'记忆'} {...a11yProps(3)} />
                    <Tab component={Link} label={'自治'} {...a11yProps(4)} />
                    <Tab component={Link} label={'发布'} {...a11yProps(5)} />
                </Tabs>
                <PersonTab currentTab={value} />
                <KnowledgeTab currentTab={value} />
                <SkillTab currentTab={value} />
                <MemoryTab currentTab={value} />
                <AutoNoMyTab currentTab={value} />
                <PublishTab currentTab={value} />
            </Card>
            <div className="w-3/12"></div>
        </div>
    );
};

export default CreateChatApp;
