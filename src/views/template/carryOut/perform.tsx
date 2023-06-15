import { Tooltip, IconButton, Button, Typography, Grid, Box, Card } from '@mui/material';

import AlbumIcon from '@mui/icons-material/Album';
import ErrorOutlineIcon from '@mui/icons-material/ErrorOutline';
import NotStartedIcon from '@mui/icons-material/NotStarted';
import InsertPhotoIcon from '@mui/icons-material/InsertPhoto';

import FormExecute from 'views/template/components/validaForm';

import { useFormik } from 'formik';

import generateValidationSchema from 'hooks/usevalid';

function Perform() {
    const variables = [
        {
            key: 'TextVariableModule',
            field: 'max_tokens',
            label: '最大令牌',
            desc: '输入令牌和生成令牌的总长度受模型上下文长度的限制。',
            type: 'text',
            options: [],
            default: 1000,
            value: undefined,
            order: 2,
            group: 'model',
            is_point: true,
            is_show: false,
            style: 'input',
            moduleCode: 'MoredealAiWriter\\code\\modules\\variable\\TextVariableModule'
        },
        {
            key: 'TextVariableModule',
            field: 'temperature',
            label: '温度',
            desc: '使用什么采样温度，介于0和2之间。较高的值（如0.8）会使输出更随机，而较低的值（如0.2）会使输出更集中和确定性。',
            type: 'text',
            options: [],
            default: 0.7,
            value: undefined,
            order: 1,
            group: 'model',
            is_point: true,
            is_show: false,
            style: 'input',
            moduleCode: 'MoredealAiWriter\\code\\modules\\variable\\TextVariableModule'
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
            value: undefined,
            order: 2,
            group: 'model',
            is_point: true,
            is_show: false,
            style: 'select',
            moduleCode: 'MoredealAiWriter\\code\\modules\\variable\\TextVariableModule'
        },
        {
            key: 'TextVariableModule',
            field: 'prompt',
            label: '提示',
            desc: '所需图像的文本描述。最大长度为1000个字符。',
            type: 'text',
            options: [],
            default: 'Hi.',
            value: 'Write an article title for \'alternative\' type blog  about "{GLOBAL.TOPIC}" in {GLOBAL.LANGUAGE}. Style: {GLOBAL.WRITING_STYLE}. Tone: {GLOBAL.WRITING_TONE}. \nThe title of your alternative article contains a number, the word “alternative” or “alternatives to,” followed by the product or service and the product/service category.The number should no more than 8.Must be between 40 and 60 characters.\nUse natural language to describe the title of the article and to use the top level keyword to help search engines better understand the topic and content of the webpage.\nDo not use very common words that AI often uses.Utilize uncommon terminology to enhance the originality of the piece.Must be 100% unique and remove plagiarism.Make it look more like it was written by a human and have a high level of professionalism.',
            order: 4,
            group: 'model',
            is_point: true,
            is_show: false,
            style: 'text',
            moduleCode: 'MoredealAiWriter\\code\\modules\\variable\\TextVariableModule'
        }
    ];
    const initialValues: Record<string, any> = {};
    variables.forEach((variable) => {
        const { field } = variable;
        initialValues[field] = '';
        // 添加其他类型的校验规则，根据需要进行扩展
    });
    const validationSchema = generateValidationSchema(variables);
    const formik = useFormik({
        initialValues,
        validationSchema,
        onSubmit: (values) => {
            console.log(values);
        }
    });
    return (
        <Box>
            <Typography variant="h5" my={2}>
                我是产品描述
            </Typography>
            <Button onClick={() => formik.handleSubmit()} startIcon={<AlbumIcon />} variant="contained">
                全部执行
            </Button>
            <Tooltip title="点击全部执行">
                <IconButton size="small">
                    <ErrorOutlineIcon />
                </IconButton>
            </Tooltip>
            <form onSubmit={formik.handleSubmit}>
                <Grid container spacing={2}>
                    {variables.map((item, index) => (
                        <Grid item lg={4} md={6} sm={12} key={index}>
                            <FormExecute formik={formik} item={item} />
                        </Grid>
                    ))}
                </Grid>
            </form>
            <Card elevation={2} sx={{ padding: 2 }}>
                <Box my={2} display="flex" justifyContent="space-between">
                    <Box>
                        <Typography variant="h2">执行标题</Typography>
                        <Typography variant="overline" display="block" mt={1}>
                            我是每个步骤的描述
                        </Typography>
                    </Box>
                    <Box>
                        <Tooltip title="点击执行当前步骤">
                            <IconButton size="small">
                                <ErrorOutlineIcon />
                            </IconButton>
                        </Tooltip>
                        <Button size="small" startIcon={<NotStartedIcon />} variant="contained">
                            执行
                        </Button>
                    </Box>
                </Box>
                <form onSubmit={formik.handleSubmit}>
                    <Grid container spacing={2}>
                        {variables.map((item, index) => (
                            <Grid
                                item
                                lg={item.field === 'prompt' ? 12 : item.style === 'text' ? 6 : 4}
                                md={item.field === 'prompt' ? 12 : item.style === 'text' ? 6 : 4}
                                sm={12}
                                key={index}
                            >
                                <FormExecute formik={formik} item={item} />
                            </Grid>
                        ))}
                        {variables.map((item, index) => (
                            <Grid item key={index} lg={item.style === 'text' ? 6 : 4} sm={12}>
                                <FormExecute formik={formik} item={item} />
                            </Grid>
                        ))}
                    </Grid>
                </form>
                <Box my={2} display="flex">
                    {/* <TextField fullWidth /> */}
                    {/* <TextField multiline rows={8} fullWidth /> */}
                    {Array.from({ length: 3 }, (_, index) => (
                        <Card
                            elevation={3}
                            sx={{ width: '200px', height: '200px', marginRight: '16px', lineHeight: '200px', textAlign: 'center' }}
                        >
                            <InsertPhotoIcon fontSize="large" />
                        </Card>
                    ))}
                </Box>
            </Card>
        </Box>
    );
}
export default Perform;
