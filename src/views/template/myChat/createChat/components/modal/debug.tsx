import {
    Modal,
    IconButton,
    CardContent,
    Box,
    Divider,
    CardActions,
    Grid,
    Button,
    TextField,
    FormControl,
    InputLabel,
    Select,
    MenuItem
} from '@mui/material';
import { Close } from '@mui/icons-material';
import MainCard from 'ui-component/cards/MainCard';
import { useState, useEffect } from 'react';
import { useFormik } from 'formik';
import * as yup from 'yup';
import formatDate from 'hooks/useDate';
import { ruleDebugRule } from 'api/chat';
interface DeBugData {
    ruleType: string;
}
const DeBug = ({
    deBugOpen,
    datasetUid,
    typeList,
    setDeBugOpen
}: {
    deBugOpen: boolean;
    datasetUid: string | undefined;
    typeList: any[];
    setDeBugOpen: (data: any) => void;
}) => {
    const [deBugData, setDeBugData] = useState<DeBugData>({
        ruleType: 'HTML'
    });
    //文本
    const formik = useFormik({
        initialValues: {
            title: `文本：${formatDate(new Date().getTime())}`,
            context: ''
        },
        validationSchema: yup.object({
            title: yup.string().required('标题是必填的'),
            context: yup.string().max(150000, '文本过长、请减少到150000字以内').required('内容是必填的')
        }),
        onSubmit: async (values) => {
            const res = await ruleDebugRule({
                appId: datasetUid,
                url: '',
                title: values.title,
                context: values.context,
                dataType: 'CHARACTERS'
            });
            setRuleName(res.ruleName);
            setResult(res.data);
        }
    });
    //网页
    const [isValid, setIsValid] = useState(true);
    const [url, setUrl] = useState('');
    const saveUrl = async () => {
        if (url && isValid) {
            const res = await ruleDebugRule({
                appId: datasetUid,
                url,
                title: '',
                context: '',
                dataType: 'HTML'
            });
            setRuleName(res.ruleName);
            setResult(res.data);
        } else {
            setIsValid(false);
        }
    };
    useEffect(() => {
        if (url) {
            const isValidInput = /^(http:\/\/|https:\/\/|www\.)[^\s,，]*$/.test(url);
            setIsValid(isValidInput);
        }
    }, [url]);
    //规则名称
    const [ruleName, setRuleName] = useState('');
    //调试结果
    const [result, setResult] = useState('');
    return (
        <Modal open={deBugOpen} onClose={() => setDeBugOpen(false)} aria-labelledby="modal-title" aria-describedby="modal-description">
            <MainCard
                style={{
                    position: 'absolute',
                    width: '60%',
                    top: '10%',
                    left: '50%',
                    transform: 'translate(-50%, 0)'
                }}
                headerSX={{ p: '16px !important' }}
                contentSX={{ p: '16px !important' }}
                title="规则调试"
                content={false}
                secondary={
                    <IconButton onClick={() => setDeBugOpen(false)}>
                        <Close fontSize="small" />
                    </IconButton>
                }
            >
                <CardContent sx={{ p: '16px !important' }}>
                    <Grid container spacing={6}>
                        <Grid item md={6} xs={12}>
                            <FormControl fullWidth>
                                <InputLabel color="secondary" id="type">
                                    选择类型
                                </InputLabel>
                                <Select
                                    fullWidth
                                    name="ruleType"
                                    value={deBugData.ruleType}
                                    onChange={(e) => {
                                        setDeBugData({
                                            ...deBugData,
                                            ruleType: e.target.value
                                        });
                                    }}
                                    color="secondary"
                                    labelId="type"
                                    label="选择类型"
                                >
                                    {typeList.map((item: any) => (
                                        <MenuItem disabled={item.type === 'DOCUMENT'} key={item.type} value={item.type}>
                                            {item.typeName}
                                        </MenuItem>
                                    ))}
                                </Select>
                            </FormControl>
                        </Grid>
                        <Grid item md={6} xs={12}>
                            <TextField fullWidth value={ruleName} InputLabelProps={{ shrink: true }} disabled label="规则名称" />
                        </Grid>
                    </Grid>
                    <Grid sx={{ mt: 2 }} flexWrap="nowrap" container spacing={2}>
                        <Grid item md={6} xs={12}>
                            {deBugData.ruleType === 'CHARACTERS' && (
                                <Box>
                                    <form onSubmit={formik.handleSubmit}>
                                        <TextField
                                            label={'标题'}
                                            fullWidth
                                            id="title"
                                            name="title"
                                            color="secondary"
                                            InputLabelProps={{ shrink: true }}
                                            value={formik.values.title}
                                            onChange={formik.handleChange}
                                            error={formik.touched.title && Boolean(formik.errors.title)}
                                            helperText={formik.touched.title && formik.errors.title}
                                        />
                                        <Box position="relative">
                                            <TextField
                                                label={'内容'}
                                                fullWidth
                                                id="context"
                                                name="context"
                                                color="secondary"
                                                placeholder="文本内容，请输入 150000 字符以内"
                                                InputLabelProps={{ shrink: true }}
                                                value={formik.values.context}
                                                onChange={formik.handleChange}
                                                error={formik.touched.context && Boolean(formik.errors.context)}
                                                helperText={(formik.touched.context && formik.errors.context) || ' '}
                                                className={'mt-3'}
                                                multiline
                                                minRows={6}
                                                maxRows={6}
                                            />
                                            <Box position="absolute" bottom="0px" right="5px" fontSize="0.75rem">
                                                {formik.values.context.length}/150000个
                                            </Box>
                                        </Box>
                                    </form>
                                </Box>
                            )}
                            {deBugData.ruleType === 'HTML' && (
                                <Box>
                                    <div className="text-sm text-[#9da3af]">
                                        请避免非法抓取他人网站的侵权行为，保证链接可公开访问，且网站内容可复制
                                    </div>
                                    <TextField
                                        label="网页地址"
                                        fullWidth
                                        focused
                                        id="url"
                                        name="url"
                                        color="secondary"
                                        value={url}
                                        onChange={(e) => {
                                            setUrl(e.target.value);
                                        }}
                                        error={!isValid}
                                        placeholder="网站通过http://、https://、www.开头多个网站通过换行分割避免解析错误"
                                        className={'mt-3'}
                                        multiline
                                        minRows={6}
                                        maxRows={6}
                                    />
                                    {!isValid && <div className="text-[#f44336] mt-1">{'请输入正确的网络地址'}</div>}
                                </Box>
                            )}
                        </Grid>
                        <Divider sx={{ ml: 2, display: { md: 'block', xs: 'none' } }} orientation="vertical" flexItem />
                        <Grid item md={6} xs={12}>
                            <TextField
                                multiline
                                minRows={8}
                                maxRows={8}
                                fullWidth
                                value={result}
                                label="调试结果"
                                InputLabelProps={{ shrink: true }}
                            />
                        </Grid>
                    </Grid>
                </CardContent>
                <Divider />
                <CardActions sx={{ p: 2 }}>
                    <Grid container justifyContent="flex-end">
                        <Button
                            variant="contained"
                            onClick={() => {
                                if (deBugData.ruleType === 'HTML') {
                                    saveUrl();
                                } else {
                                    formik.handleSubmit();
                                }
                            }}
                            color="secondary"
                        >
                            调试
                        </Button>
                    </Grid>
                </CardActions>
            </MainCard>
        </Modal>
    );
};
export default DeBug;
