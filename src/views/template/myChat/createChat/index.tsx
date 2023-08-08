import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import { Box, Button, Card, CardHeader, Divider, Link, Tab, Tabs } from '@mui/material';
import { chatSave, getChatInfo } from 'api/chat';
import { t } from 'hooks/web/useI18n';
import { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { dispatch } from 'store';
import { openSnackbar } from 'store/slices/snackbar';
import { TabsProps } from 'types';
import { Details } from 'types/template';
import { Chat } from './components/Chat';
import { FashionStyling } from './components/FashionStyling';
import { Knowledge } from './components/Knowledge';
import { Regulation } from './components/Regulation';
import { Skill } from './components/Skill';

export function TabPanel({ children, value, index, ...other }: TabsProps) {
    return (
        <div role="tabpanel" hidden={value !== index} id={`simple-tabpanel-${index}`} aria-labelledby={`simple-tab-${index}`} {...other}>
            <Box sx={{ p: 3 }}>
                <Box>{children}</Box>
            </Box>
        </div>
    );
}

export function a11yProps(index: number) {
    return {
        id: `simple-tab-${index}`,
        'aria-controls': `simple-tabpanel-${index}`
    };
}

export type IChatInfo = {
    name?: string;
    avatar?: string;
    prePrompt?: string;
    statement?: string; // 欢迎语
    temperature?: number;
    guideList?: string[];
    introduction?: string; // 简介
    enableIntroduction?: boolean;
    enableVoice?: boolean;
    defaultImg?: string;
    voiceName?: string;
    voiceStyle?: string;
    voicePitch?: number;
    voiceSpeed?: number;
};

function CreateDetail() {
    //路由跳转
    const navigate = useNavigate();
    const location = useLocation();
    const searchParams = new URLSearchParams(location.search);
    const [detail, setDetail] = useState(null as unknown as Details);
    const [chatBotInfo, setChatBotInfo] = useState<IChatInfo>({
        guideList: ['', '']
    });

    useEffect(() => {
        if (searchParams.get('appId')) {
            getChatInfo({ appId: searchParams.get('appId') as string }).then((res) => {
                setDetail(res);
                setChatBotInfo({
                    ...chatBotInfo,
                    name: res.name,
                    avatar: res?.images?.[0],
                    introduction: res.description, // 简介
                    enableIntroduction: res.chatConfig.description.enabled,
                    statement: res.chatConfig.openingStatement.statement,
                    prePrompt: res.chatConfig.prePrompt,
                    temperature: res.chatConfig.modelConfig.completionParams.temperature,
                    defaultImg: res?.images?.[0]
                });
            });
        }
    }, []);

    //保存更改
    const saveDetail = async () => {
        const data: any = detail;
        data.name = chatBotInfo.name;
        data.images = [chatBotInfo.avatar];
        data.chatConfig.prePrompt = chatBotInfo.prePrompt;
        data.chatConfig.modelConfig.completionParams.temperature = chatBotInfo.temperature;
        data.chatConfig.openingStatement.statement = chatBotInfo.statement;
        data.chatConfig.description.enabled = chatBotInfo.enableIntroduction;
        data.description = chatBotInfo.introduction;
        await chatSave(data);
        dispatch(
            openSnackbar({
                open: true,
                message: '保存成功',
                variant: 'alert',
                alert: {
                    color: 'success'
                },
                close: false
            })
        );
    };

    //tabs
    const [value, setValue] = useState(0);
    const handleChange = (event: React.SyntheticEvent, newValue: number) => {
        setValue(newValue);
    };

    return (
        <div className="grid grid-cols-12 gap-4">
            <Card className="xl:col-span-8 xs:col-span-12">
                <CardHeader
                    sx={{ padding: 2 }}
                    avatar={
                        <Button variant="contained" startIcon={<ArrowBackIcon />} color="secondary" onClick={() => navigate('/my-chat')}>
                            {t('myApp.back')}
                        </Button>
                    }
                    title={chatBotInfo?.name}
                    action={
                        (value === 0 || value === 1) && (
                            <Button variant="contained" color="secondary" autoFocus onClick={saveDetail}>
                                {t('myApp.save')}
                            </Button>
                        )
                    }
                ></CardHeader>
                <Divider />
                <Tabs
                    sx={{
                        m: 3,
                        mb: 0,
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
                    <Tab component={Link} label={'形象设计'} {...a11yProps(0)} />
                    <Tab component={Link} label={'规则设定'} {...a11yProps(1)} />
                    <Tab component={Link} label={'知识库'} {...a11yProps(2)} />
                    <Tab component={Link} label={'技能'} {...a11yProps(3)} />
                </Tabs>
                <TabPanel value={value} index={0}>
                    <FashionStyling setChatBotInfo={setChatBotInfo} chatBotInfo={chatBotInfo} />
                </TabPanel>
                <TabPanel value={value} index={1}>
                    <Regulation setChatBotInfo={setChatBotInfo} chatBotInfo={chatBotInfo} />
                </TabPanel>
                <TabPanel value={value} index={2}>
                    <Knowledge />
                </TabPanel>
                <TabPanel value={value} index={3}>
                    <Skill />
                </TabPanel>
            </Card>
            {value !== 4 && (
                <Card className="xl:col-span-4 xl:block xs:hidden h-[calc(100vh-130px)]">
                    <Chat chatBotInfo={chatBotInfo} />
                </Card>
            )}
        </div>
    );
}

export default CreateDetail;