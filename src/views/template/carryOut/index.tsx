import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';

import { Box, Grid, Typography } from '@mui/material';

import './index.css';
import Perform from './perform';

function CarryOut({ config, example }: { config: any; example: string }) {
    const list = {
        version: 1,
        id: null,
        key: 'TemplateModule',
        type: 'system',
        logotype: 'article',
        name: '生成文章',
        desc: '文章生成器是一个强大的工具，可以为您生成丰富的多段落文章内容',
        icon: 'file-document-outline',
        tags: 'Article, Blog, System, Default',
        topics: 'Writing, Blog',
        steps: [
            {
                field: 'EXCERPT',
                label: '摘要',
                desc: '文章摘要描述',
                buttonLabel: '生成摘要',
                stepModule: {
                    version: 1,
                    key: 'OpenApiStepModule',
                    name: 'Open API',
                    desc: 'Open API 聊天',
                    source: 'native',
                    variables: [
                        {
                            key: 'TextVariableModule',
                            field: 'max_tokens',
                            label: '最大令牌',
                            desc: '输入令牌和生成令牌的总长度受模型上下文长度的限制。',
                            type: 'text',
                            options: [],
                            default: 1000,
                            value: null,
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
                            order: 4,
                            group: 'model',
                            is_point: true,
                            is_show: false,
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
                    {
                        key: 'TextVariableModule',
                        field: 'max_tokens',
                        label: '最大令牌',
                        desc: '输入令牌和生成令牌的总长度受模型上下文长度的限制。',
                        type: 'text',
                        options: [],
                        default: 1000,
                        value: null,
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
                    }
                ]
            }
        ],
        variables: [
            {
                key: 'TextVariableModule',
                field: 'topic',
                label: '主题',
                desc: '您想要生成内容的主题',
                type: 'text',
                options: [],
                default: 'Enter the topic you want to generate content',
                value: 'topic',
                order: 3,
                group: 'params',
                is_point: true,
                is_show: true,
                style: 'text',
                moduleCode: 'MoredealAiWritercodemodules\variableTextVariableModule'
            },
            {
                key: 'SelectionVariableModule',
                field: 'language',
                label: '语言',
                desc: '生成的内容将以哪种语言返回',
                type: 'text',
                options: [
                    {
                        label: '英语',
                        value: 'English'
                    },
                    {
                        label: '德语',
                        value: 'German'
                    },
                    {
                        label: '法语',
                        value: 'French'
                    },
                    {
                        label: '西班牙语',
                        value: 'Spanish'
                    },
                    {
                        label: '意大利语',
                        value: 'Italian'
                    },
                    {
                        label: '中文',
                        value: 'Chinese'
                    },
                    {
                        label: '日语',
                        value: 'Japanese'
                    },
                    {
                        label: '葡萄牙语',
                        value: 'Portuguese'
                    },
                    {
                        label: '其他',
                        value: 'Other'
                    }
                ],
                default: 'English',
                value: 'English',
                order: 0,
                group: 'params',
                is_point: true,
                is_show: true,
                style: 'select',
                moduleCode: 'MoredealAiWritercodemodules\variableSelectionVariableModule'
            },
            {
                key: 'SelectionVariableModule',
                field: 'writing_style',
                label: '写作风格',
                desc: '生成的内容的写作风格',
                type: 'text',
                options: [
                    {
                        label: 'Informative',
                        value: 'Informative'
                    },
                    {
                        label: 'Descriptive',
                        value: 'Descriptive'
                    },
                    {
                        label: 'Creative',
                        value: 'Creative'
                    },
                    {
                        label: 'Narrative',
                        value: 'Narrative'
                    },
                    {
                        label: 'Persuasive',
                        value: 'Persuasive'
                    },
                    {
                        label: 'Reflective',
                        value: 'Reflective'
                    },
                    {
                        label: 'Argumentative',
                        value: 'Argumentative'
                    },
                    {
                        label: 'Analytical',
                        value: 'Analytical'
                    },
                    {
                        label: 'Evaluative',
                        value: 'Evaluative'
                    },
                    {
                        label: 'Journalistic',
                        value: 'Journalistic'
                    },
                    {
                        label: 'Technical',
                        value: 'Technical'
                    }
                ],
                default: 'Creative',
                value: 'Creative',
                order: 0,
                group: 'params',
                is_point: true,
                is_show: true,
                style: 'select',
                moduleCode: 'MoredealAiWritercodemodules\variableSelectionVariableModule'
            },
            {
                key: 'SelectionVariableModule',
                field: 'writing_tone',
                label: '写作语气',
                desc: '生成内容的写作语气',
                type: 'text',
                options: [
                    {
                        label: 'Eutral',
                        value: 'Neutral'
                    },
                    {
                        label: 'Formal',
                        value: 'Formal'
                    },
                    {
                        label: 'Assertive',
                        value: 'Assertive'
                    },
                    {
                        label: 'Cheerful',
                        value: 'Cheerful'
                    },
                    {
                        label: 'Humorous',
                        value: 'Humorous'
                    },
                    {
                        label: 'Informal',
                        value: 'Informal'
                    },
                    {
                        label: 'Inspirational',
                        value: 'Inspirational'
                    },
                    {
                        label: 'Professional',
                        value: 'Professional'
                    },
                    {
                        label: 'Confvalueent',
                        value: 'Confvalueent'
                    },
                    {
                        label: 'Emotional',
                        value: 'Emotional'
                    },
                    {
                        label: 'Persuasive',
                        value: 'Persuasive'
                    },
                    {
                        label: 'Supportive',
                        value: 'Supportive'
                    },
                    {
                        label: 'Sarcastic',
                        value: 'Sarcastic'
                    },
                    {
                        label: 'Condescending',
                        value: 'Condescending'
                    },
                    {
                        label: 'Skeptical',
                        value: 'Skeptical'
                    },
                    {
                        label: 'Narrative',
                        value: 'Narrative'
                    },
                    {
                        label: 'Journalistic',
                        value: 'Journalistic'
                    }
                ],
                default: 'Cheerful',
                value: 'Cheerful',
                order: 0,
                group: 'params',
                is_point: true,
                is_show: true,
                style: 'select',
                moduleCode: 'MoredealAiWritercodemodules\variableSelectionVariableModule'
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
                field: 'max_tokens',
                label: '最大令牌',
                desc: '输入令牌和生成令牌的总长度受模型上下文长度的限制。',
                type: 'text',
                options: [],
                default: 1000,
                value: null,
                order: 2,
                group: 'model',
                is_point: true,
                is_show: false,
                style: 'input',
                moduleCode: 'MoredealAiWritercodemodules\variableTextVariableModule'
            }
        ],
        context: null,
        moduleCode: 'MoredealAiWritercodemodules\templateTemplateModule'
    };
    return (
        <Box>
            <Grid container spacing={4}>
                <Grid item lg={7} md={7} sm={7}>
                    <Typography variant="h5" my={2}>
                        {config.description}
                    </Typography>
                    <Perform config={list} />
                </Grid>
                <Grid item lg={5} md={5} sm={5}>
                    <ReactMarkdown children={example} remarkPlugins={[remarkGfm]} />
                </Grid>
            </Grid>
        </Box>
    );
}
export default CarryOut;
