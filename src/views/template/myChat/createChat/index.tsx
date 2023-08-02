import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import { Box, Button, Card, CardHeader, Divider, Link, Tab, Tabs } from '@mui/material';
import { getChatInfo } from 'api/chat';
import { appCreate, appModify } from 'api/template/index';
import { t } from 'hooks/web/useI18n';
import { useEffect, useRef, useState } from 'react';
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
            {value === index && (
                <Box sx={{ p: 3 }}>
                    <Box>{children}</Box>
                </Box>
            )}
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
    introduction?: string;
    prePrompt?: string;
    statement?: string;
    guideList?: string[];
};

function CreateDetail() {
    //路由跳转
    const navigate = useNavigate();
    const location = useLocation();
    const searchParams = new URLSearchParams(location.search);
    const [detail, setDetail] = useState(null as unknown as Details);
    const basis = useRef<any>(null);
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
                    avatar: res.avatar,
                    introduction: res.description,
                    statement: res.chatConfig.openingStatement.statement,
                    prePrompt: res.chatConfig.prePrompt
                });
            });
        }
    }, []);

    //保存更改
    const saveDetail = () => {
        if (basis?.current?.submit()) {
            if (searchParams.get('uid')) {
                appModify(detail).then((res) => {
                    if (res.data) {
                        navigate('/my-app');
                        dispatch(
                            openSnackbar({
                                open: true,
                                message: t('market.modify'),
                                variant: 'alert',
                                alert: {
                                    color: 'success'
                                },
                                close: false
                            })
                        );
                    }
                });
            } else {
                appCreate(detail).then((res) => {
                    if (res.data) {
                        navigate('/my-app');
                        dispatch(
                            openSnackbar({
                                open: true,
                                message: t('market.create'),
                                variant: 'alert',
                                alert: {
                                    color: 'success'
                                },
                                close: false
                            })
                        );
                    }
                });
            }
        }
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
                        <Button
                            variant="contained"
                            startIcon={<ArrowBackIcon />}
                            color="secondary"
                            onClick={() => navigate('/template/createCenter')}
                        >
                            {t('myApp.back')}
                        </Button>
                    }
                    title={detail?.name}
                    action={
                        <Button variant="contained" color="secondary" disabled={value !== 0} autoFocus onClick={saveDetail}>
                            {t('myApp.save')}
                        </Button>
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
