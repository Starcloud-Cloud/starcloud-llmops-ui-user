import { Card, Box, Grid, Link, AppBar, Toolbar, Button, Tab, Tabs } from '@mui/material';

import ArrowBackIcon from '@mui/icons-material/ArrowBack';

import Basis from './basis';
import Arrange from './arrange';
import Upload from './upLoad';
// import Perform from 'views/template/carryOut/perform';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { TabsProps } from 'types';
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
    //改变label desc 和variable的值
    const [edit, setEdit] = useState<any>({
        variables: [
            {
                key: 'TextVariableModule',
                field: 'max_tokens',
                label: '最大令牌',
                desc: '输入令牌和生成令牌的总长度受模型上下文长度的限制。',
                type: 'text',
                options: [],
                default: 1000,
                value: 3,
                order: 2,
                group: 'model',
                is_point: true,
                is_show: false,
                style: 'input',
                moduleCode: 'MoredealAiWritercodemodules\variableTextVariableModule'
            },
            {
                key: 'TextVariableModule',
                field: 'temperature',
                label: '温度',
                desc: '使用什么采样温度，介于0和2之间。较高的值（如0.8）会使输出更随机，而较低的值（如0.2）会使输出更集中和确定性。',
                type: 'text',
                options: [],
                default: 0.7,
                value: null,
                order: 1,
                group: 'model',
                is_point: true,
                is_show: false,
                style: 'input',
                moduleCode: 'MoredealAiWritercodemodules\variableTextVariableModule'
            },
            {
                key: 'TextVariableModule',
                field: 'n',
                label: '数量',
                desc: '为每个输入消息生成多少个聊天完成选项。https://platform.openai.com/docs/api-reference/chat',
                type: 'text',
                options: [
                    {
                        label: '1',
                        value: 1
                    },
                    {
                        label: '2',
                        value: 2
                    },
                    {
                        label: '3',
                        value: 3
                    },
                    {
                        label: '4',
                        value: 4
                    },
                    {
                        label: '5',
                        value: 5
                    },
                    {
                        label: '6',
                        value: 6
                    },
                    {
                        label: '7',
                        value: 7
                    },
                    {
                        label: '8',
                        value: 8
                    },
                    {
                        label: '9',
                        value: 9
                    },
                    {
                        label: '10',
                        value: 10
                    }
                ],
                default: 1,
                value: null,
                order: 2,
                group: 'model',
                is_point: true,
                is_show: false,
                style: 'select',
                moduleCode: 'MoredealAiWritercodemodules\variableTextVariableModule'
            },
            {
                key: 'TextVariableModule',
                field: 'prompt',
                label: '提示',
                desc: '所需图像的文本描述。最大长度为1000个字符。',
                type: 'text',
                options: [],
                default: 'Hi.',
                value: 'aaa',
                order: 4,
                group: 'model',
                is_point: true,
                is_show: true,
                style: 'text',
                moduleCode: 'MoredealAiWritercodemodules\variableTextVariableModule'
            }
        ],
        config: [
            {
                field: '生成文本',
                label: '生成文本',
                desc: '您可以要求 AI 为您执行各种任务。您可以要求它写、重写或翻译文章，将单词或元素分类到组中，写电子邮件等。',
                buttonLabel: '生成文本',
                stepModule: {
                    version: 1,
                    key: 'OpenApiStepModule',
                    name: 'Open API',
                    desc: 'Open API 聊天',
                    source: 'native',
                    sourceUrl: 'https://platform.openai.com/docs/api-reference/completions/create',
                    tags: ['OpenAI', 'Completions'],
                    isAuto: true,
                    type: null,
                    icon: 'http://127.0.0.1:8084/wp-content/plugins/moredeal-ai-writer/res/images/openai.svg',
                    scenes: [],
                    variables: [
                        {
                            key: 'TextVariableModule',
                            field: 'max_tokens',
                            label: '最大令牌',
                            desc: '输入令牌和生成令牌的总长度受模型上下文长度的限制。',
                            type: 'text',
                            options: [],
                            default: 1000,
                            value: 3,
                            order: 2,
                            group: 'model',
                            is_point: true,
                            is_show: false,
                            style: 'input',
                            moduleCode: 'MoredealAiWritercodemodules\variableTextVariableModule'
                        },
                        {
                            key: 'TextVariableModule',
                            field: 'temperature',
                            label: '温度',
                            desc: '使用什么采样温度，介于0和2之间。较高的值（如0.8）会使输出更随机，而较低的值（如0.2）会使输出更集中和确定性。',
                            type: 'text',
                            options: [],
                            default: 0.7,
                            value: null,
                            order: 1,
                            group: 'model',
                            is_point: true,
                            is_show: false,
                            style: 'input',
                            moduleCode: 'MoredealAiWritercodemodules\variableTextVariableModule'
                        },
                        {
                            key: 'TextVariableModule',
                            field: 'n',
                            label: '数量',
                            desc: '为每个输入消息生成多少个聊天完成选项。https://platform.openai.com/docs/api-reference/chat',
                            type: 'text',
                            options: [
                                {
                                    label: '1',
                                    value: 1
                                },
                                {
                                    label: '2',
                                    value: 2
                                },
                                {
                                    label: '3',
                                    value: 3
                                },
                                {
                                    label: '4',
                                    value: 4
                                },
                                {
                                    label: '5',
                                    value: 5
                                },
                                {
                                    label: '6',
                                    value: 6
                                },
                                {
                                    label: '7',
                                    value: 7
                                },
                                {
                                    label: '8',
                                    value: 8
                                },
                                {
                                    label: '9',
                                    value: 9
                                },
                                {
                                    label: '10',
                                    value: 10
                                }
                            ],
                            default: 1,
                            value: null,
                            order: 2,
                            group: 'model',
                            is_point: true,
                            is_show: false,
                            style: 'select',
                            moduleCode: 'MoredealAiWritercodemodules\variableTextVariableModule'
                        },
                        {
                            key: 'TextVariableModule',
                            field: 'prompt',
                            label: '提示',
                            desc: '所需图像的文本描述。最大长度为1000个字符。',
                            type: 'text',
                            options: [],
                            default: 'Hi.',
                            value: 'aaa',
                            order: 4,
                            group: 'model',
                            is_point: true,
                            is_show: true,
                            style: 'text',
                            moduleCode: 'MoredealAiWritercodemodules\variableTextVariableModule'
                        }
                    ],
                    response: {
                        key: 'TextResponseModule',
                        type: 'text',
                        style: 'text',
                        stepField: null,
                        processParams: null,
                        isShow: true,
                        value: null,
                        errorCode: null,
                        status: false,
                        message: null,
                        moduleCode: 'MoredealAiWritercodemodulesstep\responseTextResponseModule'
                    },
                    isCanAddStep: true,
                    moduleCode: 'MoredealAiWritercodemodulesstepOpenApiStepModule'
                },
                variables: [
                    { desc: '', field: 'Variable_0', is_show: true, label: 'Variable 0', options: [], style: 'input', value: '12' }
                ],
                moduleCode: 'MoredealAiWritercodemodulesstepStepWrapper'
            }
        ]
    });
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
                        <Basis />
                    </Grid>
                    <Grid item lg={7}>
                        {/* <Perform config={edit} /> */}
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
