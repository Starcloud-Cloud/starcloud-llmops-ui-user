import { Card, Box, Grid, Link, AppBar, Toolbar, Button, Tab, Tabs } from '@mui/material';
import { getApp } from 'api/template/index';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import { executeApp } from 'api/template/fetch';
import Basis from './basis';
import Arrange from './arrange';
import Upload from './upLoad';
import Perform from 'views/template/carryOut/perform';
import { useEffect, useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { TabsProps } from 'types';
import { Details, Execute } from 'types/template';
function TabPanel({ children, value, index, ...other }: TabsProps) {
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
function a11yProps(index: number) {
    return {
        id: `simple-tab-${index}`,
        'aria-controls': `simple-tabpanel-${index}`
    };
}
function CreateDetail() {
    //路由跳转
    const navigate = useNavigate();
    const location = useLocation();
    const searchParams = new URLSearchParams(location.search);
    const changeData = (data: Execute) => {
        const { stepId, index }: { stepId: string; index: number } = data;
        setStepID(stepId);
        setNum(index);
        setDetail({
            ...detail,
            workflowConfig: {
                steps: [
                    ...detail.workflowConfig.steps.slice(0, index),
                    data.steps,
                    ...detail.workflowConfig.steps.slice(index + 1, detail.workflowConfig.steps.length)
                ]
            }
        });
    };
    const [detail, setDetail] = useState({} as Details);
    const [stepID, setStepID] = useState('');
    const [num, setNum] = useState<number | null>(null);
    useEffect(() => {
        const fetchData = async () => {
            if (!stepID || (!num && num !== 0)) return;
            let resp: any = await executeApp({
                appUid: searchParams.get('uid'),
                stepId: stepID,
                appReqVO: detail
            });
            setStepID('');
            setNum(null);
            const reader = resp.getReader();
            const textDecoder = new TextDecoder();
            while (1) {
                const { done, value } = await reader.read();
                if (done) {
                    break;
                }
                const str = textDecoder.decode(value);
                console.log(str);

                setDetail({
                    ...detail,
                    workflowConfig: {
                        steps: [
                            ...detail.workflowConfig.steps.slice(0, num),
                            {
                                ...detail.workflowConfig.steps[num],
                                flowStep: {
                                    ...detail.workflowConfig.steps[num].flowStep,
                                    response: {
                                        ...detail.workflowConfig.steps[num].flowStep.response,
                                        answer: str
                                    }
                                }
                            },
                            ...detail.workflowConfig.steps.slice(num + 1, detail.workflowConfig.steps.length)
                        ]
                    }
                });
            }
        };
        fetchData();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [num, stepID, detail.workflowConfig?.steps]);
    useEffect(() => {
        getApp({ uid: searchParams.get('uid') as string }).then((res) => {
            setDetail(res);
        });
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    const [edit, setEdit] = useState<any>({});
    const editChange = (data: any) => {
        const { index } = data;
        const { name, value } = data.e.target;
        setEdit(() => {
            const update = [...edit];
            update[index] = {
                ...update[index],
                [name]: value
            };
            return update;
        });
    };
    const variableChange = (data: any) => {
        const { value } = data.e;
        const { index, i } = data;
        setEdit(() => {
            const update = [...edit];
            update[index].stepModule.variables[i] = {
                ...update[index].stepModule.variables[i],
                value: value
            };
            return update;
        });
    };
    const basisChange = (data: any) => {
        const { value } = data.e as { value: string };
        const { index, i } = data;
        setEdit(() => {
            const updatedEdit = [...edit];
            updatedEdit[index].variables[i] = { ...updatedEdit[index].variables[i], value: value };
            return updatedEdit;
        });
    };
    //tabs
    const [value, setValue] = useState(0);
    const handleChange = (event: React.SyntheticEvent, newValue: number) => {
        setValue(newValue);
    };
    return (
        <Card>
            <AppBar sx={{ position: 'relative' }}>
                <Toolbar sx={{ justifyContent: 'space-between' }}>
                    <Button startIcon={<ArrowBackIcon />} color="inherit" onClick={() => navigate('/template/createCenter')}>
                        Back
                    </Button>
                </Toolbar>
            </AppBar>
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
                <Tab component={Link} label="基础设置" {...a11yProps(0)} />
                <Tab component={Link} label="提示词编排" {...a11yProps(1)} />
                <Tab component={Link} label="应用发布" {...a11yProps(2)} />
            </Tabs>
            <TabPanel value={value} index={0}>
                <Grid container spacing={5}>
                    <Grid item lg={5}>
                        <Basis name={detail.name} desc={detail.description} />
                    </Grid>
                    <Grid item lg={7}>
                        <Perform config={detail.workflowConfig} changeSon={changeData} source="myApp" />
                    </Grid>
                </Grid>
            </TabPanel>
            <TabPanel value={value} index={1}>
                <Grid container spacing={5}>
                    <Grid item lg={5}>
                        <Arrange edit={edit} editChange={editChange} variableChange={variableChange} basisChange={basisChange} />
                    </Grid>
                    <Grid item lg={7}>
                        {/* <Perform config={edit} /> */}
                    </Grid>
                </Grid>
            </TabPanel>
            <TabPanel value={value} index={2}>
                <Upload />
            </TabPanel>
        </Card>
    );
}
export default CreateDetail;
