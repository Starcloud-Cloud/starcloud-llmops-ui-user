import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';

import Box from '@mui/material/Box';
import Tooltip from '@mui/material/Tooltip';
import IconButton from '@mui/material/IconButton';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import Grid from '@mui/material/Grid';
import TextField from '@mui/material/TextField';

import AlbumIcon from '@mui/icons-material/Album';
import ErrorOutlineIcon from '@mui/icons-material/ErrorOutline';
import NotStartedIcon from '@mui/icons-material/NotStarted';

import FormExecute from 'views/template/components/form';

import { useFormik } from 'formik';
import './index.css';

import generateValidationSchema from 'hooks/usevalid';

function CarryOut() {
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
    const markdown =
        "### Generol Input:\n\nTopic: Shopify Alternative\n\nLanguage: English\n\nWriting style: Creative\n\nWriting tone: Cheerful\n\n### Title\n\n\n\n##### Output:\n\n```\n\n5 Unconventional E-commerce Platforms: Alternatives to Shopify\n\n```\n\n### Sections\n\n##### Input:\n\nSections: 5\n\n\n\n\n\n##### Output:\n\n```\n\n## Unleashing the Power of Unconventional E-commerce Platforms\n## Empower Your Online Business with These 5 Game-Changing Platforms\n## Elevate Your E-commerce Game with These Unique Alternatives to Shopify\n## Ditch the Ordinary: 5 Unconventional E-commerce Platforms to Consider\n## Unconventional E-commerce Platforms: The Future of Online Selling\n\n```\n\n### Content\n\n##### Input:\n\nParagraphs: 2\n\n\n\n\n\n##### Output:\n\n```\n\n<!--- ===INTRO: --->\nAre you tired of using the same old e-commerce platform? Are you looking for something unique and unconventional? Look no further as we have listed down five alternative e-commerce platforms that will elevate your online business game. We will be discussing the features, benefits, and pricing of each platform to help you make an informed decision. So, say goodbye to the ordinary and hello to something new and exciting! \n\n## Unleashing the Power of Unconventional E-commerce Platforms\n\nE-commerce platforms have revolutionized the way we do business. They offer a range of features and functionalities that make online selling easier and more efficient. However, most businesses rely on the same old platforms, such as Shopify. But, what if we told you that there are other options out there that are just as good, if not better? These unconventional e-commerce platforms offer unique features and benefits that can take your business to the next level.\n\n## Empower Your Online Business with These 5 Game-Changing Platforms\n\n1. Big Cartel: Big Cartel is a platform that caters to artists and creatives. It offers a range of customizable templates and features that allow for a personalized online store. Unlike Shopify, Big Cartel offers a free plan that allows for up to five products. Its paid plans start at $9.99 per month.\n\n2. WooCommerce: WooCommerce is a plugin for WordPress that turns your website into an e-commerce store. It offers a range of features and integrations, making it a versatile platform for businesses of all sizes. Unlike Shopify, WooCommerce is free to use, but you will need to pay for hosting and a domain name.\n\n3. Squarespace: Squarespace is a website builder that also offers e-commerce functionality. It offers a range of customizable templates and features, making it a great option for businesses that want a professional-looking website. Its e-commerce plans start at $18 per month.\n\n4. Ecwid: Ecwid is a platform that allows you to sell on multiple channels, such as Facebook, Instagram, and Amazon. It offers a range of features, including inventory management and shipping options. Its plans start at $15 per month.\n\n5. Magento: Magento is an open-source e-commerce platform that offers a range of features and integrations. It is a great option for businesses that want complete control over their online store. Unlike Shopify, Magento is free to use, but you will need to pay for hosting and development.\n\n## Elevate Your E-commerce Game with These Unique Alternatives to Shopify\n\nWhile Shopify is a popular e-commerce platform, it may not be the best option for every business. These alternative platforms offer unique features and benefits that can help take your online business to the next level. Whether you're an artist, a blogger, or a large corporation, there's an e-commerce platform out there that's perfect for you.\n\n## Ditch the Ordinary: 5 Unconventional E-commerce Platforms to Consider\n\nIf you're tired of using the same old e-commerce platform, it's time to consider something new and exciting. These unconventional e-commerce platforms offer unique features and benefits that can help you stand out from the crowd. So, ditch the ordinary and try something new today!\n\n## Unconventional E-commerce Platforms: The Future of Online Selling\n\nAs e-commerce continues to grow, so does the demand for unique and unconventional platforms. These platforms offer a range of features and benefits that can help businesses of all sizes succeed online. So, whether you're a small business owner or a large corporation, consider using one of these unconventional e-commerce platforms to elevate your online business game.\n\n```\n\n### Excerpt\n\n\n\n##### Output:\n\n```\n\n\"Are you tired of the same old e-commerce options? Look no further! Check out these 5 unconventional platforms that will take your online store to the next level. Say goodbye to Shopify and hello to something new and exciting!\"\n\n```";

    return (
        <Box>
            <Grid container spacing={4}>
                <Grid item lg={7} md={7} sm={7}>
                    <Typography variant="h5" my={2}>
                        我是产品描述
                    </Typography>
                    <Button startIcon={<AlbumIcon />} variant="contained">
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
                                    <FormExecute key={index} formik={formik} item={item} />
                                </Grid>
                            ))}
                        </Grid>
                    </form>
                    <Box>
                        <Box my={2} display="flex" justifyContent="space-between">
                            <Box>
                                <Typography variant="h2">执行标题</Typography>
                                <Typography variant="body2" mt={1}>
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
                                        <FormExecute key={index} formik={formik} item={item} />
                                    </Grid>
                                ))}
                                {variables.map((item, index) => (
                                    <Grid item lg={item.style === 'text' ? 6 : 4} sm={12}>
                                        <FormExecute key={index} formik={formik} item={item} />
                                    </Grid>
                                ))}
                            </Grid>
                        </form>
                        <Box my={2}>
                            <TextField multiline rows={8} fullWidth />
                        </Box>
                    </Box>
                </Grid>
                <Grid item lg={5} md={5} sm={5}>
                    <ReactMarkdown children={markdown} remarkPlugins={[remarkGfm]} />
                </Grid>
            </Grid>
        </Box>
    );
}
export default CarryOut;
