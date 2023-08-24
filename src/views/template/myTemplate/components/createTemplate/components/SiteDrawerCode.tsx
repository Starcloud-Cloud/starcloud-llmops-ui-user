import {
    Button,
    Divider,
    Drawer,
    TextField,
    Accordion,
    AccordionSummary,
    Typography,
    AccordionDetails,
    FormControlLabel,
    Switch
} from '@mui/material';
import { Popconfirm, ConfigProvider } from 'antd';
import React, { useEffect, useRef } from 'react';
import ChatMarkdown from 'ui-component/Markdown';
import cheerio from 'cheerio';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import { channelUpload, channelDelete } from 'api/template';
import ReactMarkdown from 'react-markdown';
import SyntaxHighlighter from 'react-syntax-highlighter';
import { vscDarkPlus } from 'react-syntax-highlighter/dist/esm/styles/prism';
import './SiteDrawerCode.scss';
import CopyToClipboard from 'react-copy-to-clipboard';
import { openSnackbar } from 'store/slices/snackbar';
import { dispatch } from 'store';
import _ from 'lodash-es';

export const SiteDrawerCode = ({
    open,
    mode,
    codeList,
    setOpen,
    setCodeValue,
    getUpdateBtn
}: {
    open: boolean;
    mode: undefined | string;
    codeList: any[];
    setOpen: (open: boolean) => void;
    setCodeValue: (data: any) => void;
    getUpdateBtn: () => void;
}) => {
    const onClose = () => setOpen(false);
    const [expanded, setExpanded] = React.useState<number | false>(0);
    const handleChange = (panel: number) => (event: React.SyntheticEvent, isExpanded: boolean) => {
        setExpanded(isExpanded ? panel : false);
    };
    const codeRef: any = useRef(null);
    useEffect(() => {
        codeRef.current = _.cloneDeep(codeList);
    }, [codeList]);
    //删除
    const handleDel = async (data: any) => {
        const { uid } = data;
        await channelDelete({ uid });
        getUpdateBtn();
        dispatch(
            openSnackbar({
                open: true,
                message: '删除成功',
                variant: 'alert',
                alert: {
                    color: 'success'
                },
                close: false
            })
        );
    };
    //更新
    const handleUpload = async (data: any) => {
        if (data.name) {
            const { name, uid, status } = data;
            await channelUpload({ uid, name, status: status ? 1 : 0 });
            getUpdateBtn();
            dispatch(
                openSnackbar({
                    open: true,
                    message: '更新成功',
                    variant: 'alert',
                    alert: {
                        color: 'success'
                    },
                    close: false
                })
            );
        }
    };

    const insertScript = `${window.location.origin}/iframe.js`;

    const HTML_CODE = (name: string, uid: string) => {
        return ` 
\`\`\`
<iframe
src="${window.location.origin}/${mode === 'CHAT' ? 'cb_i' : 'app_i'}/${uid}?source=${name}"
width="408px"
height="594px"
frameborder="0">
</iframe>
\`\`\`
`;
    };

    const HTML_CODE_COPY = (name: string, uid: string) => {
        return ` 
<iframe
src="${window.location.origin}/${mode === 'CHAT' ? 'cb_i' : 'app_i'}/${uid}?source=${name}"
width="408px"
height="594px"
frameborder="0">
</iframe>
`;
    };

    const JS_CODE = (name: string, uid: string) => `
\`\`\`
<script>
window.tip_mofaai_color="#fff";
window.tip_mofaai_bg="#4C83F3";
window.mofaai_iframe_src = "${window.location.origin}/${mode === 'CHAT' ? 'cb_js' : 'app_js'}/${uid}?source=${name}";
var st = document.createElement("script");
st.type="text/javascript";
st.async = true;st.src = "${insertScript}";
var header = document.getElementsByTagName("head")[0];
header.appendChild(st);
</script>
\`\`\`
`;

    const JS_CODE_COPY = (name: string, uid: string) => `
<script>
window.tip_mofaai_color="#fff";
window.tip_mofaai_bg="#4C83F3";
window.mofaai_iframe_src = "${window.location.origin}/cb_js/${uid}?source=${name}";
var st = document.createElement("script");
st.type="text/javascript";
st.async = true;st.src = "${insertScript}";
var header = document.getElementsByTagName("head")[0];
header.appendChild(st);
</script>
`;

    return (
        <Drawer anchor="right" open={open} sx={{ '& .MuiDrawer-paper': { overflow: 'hidden' } }} onClose={onClose}>
            <div className="bg-[#f4f6f8] w-[350px] md:w-[600px] flex items-center justify-center">
                <div className="m-[10px] bg-[#fff] h-[calc(100vh-20px)] w-[100%] rounded-lg p-[20px] overflow-auto">
                    <div className="text-lg">我的站点</div>
                    {codeList?.map((item: any, index: number) => (
                        <Accordion key={index} expanded={expanded === index} onChange={handleChange(index)}>
                            <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                                <Typography fontSize="14px" fontWeight="500">
                                    站点{index + 1}：{item.name}
                                </Typography>
                            </AccordionSummary>
                            <AccordionDetails>
                                <div className="mt-5">
                                    <TextField
                                        error={!item.name}
                                        InputLabelProps={{ shrink: true }}
                                        color="secondary"
                                        name="name"
                                        label={'站点名称'}
                                        placeholder={'请输入站点名称'}
                                        fullWidth
                                        value={item.name}
                                        helperText={!item.name && '站点名称必填'}
                                        onChange={(e) => {
                                            const { name, value } = e.target;
                                            const newValue = _.cloneDeep(codeRef.current);
                                            newValue[index][name] = value;
                                            codeRef.current = newValue;
                                            setCodeValue(newValue);
                                        }}
                                    />
                                    <FormControlLabel
                                        control={
                                            <Switch
                                                name="status"
                                                checked={!Boolean(item.status)}
                                                onChange={(e) => {
                                                    const { name } = e.target;
                                                    const newValue = _.cloneDeep(codeRef.current);
                                                    newValue[index][name] = !newValue[index][name];
                                                    codeRef.current = newValue;
                                                    setCodeValue(newValue);
                                                }}
                                            />
                                        }
                                        label="启用"
                                    />
                                    <div className="text-base mt-5">JS代码</div>
                                    <div className="text-sm mt-2 mb-1">机器人代码，请将此 iframe 添加到您的 html 代码中</div>
                                    <div className="flex items-center relative text-gray-200 bg-gray-800 px-4 py-2 text-xs font-sans justify-between rounded-t-md">
                                        <span>html</span>
                                        <CopyToClipboard
                                            text={HTML_CODE_COPY(item.name, item.mediumUid)}
                                            onCopy={() =>
                                                dispatch(
                                                    openSnackbar({
                                                        open: true,
                                                        message: '复制成功',
                                                        variant: 'alert',
                                                        alert: {
                                                            color: 'success'
                                                        },
                                                        close: false,
                                                        anchorOrigin: { vertical: 'top', horizontal: 'right' },
                                                        transition: 'SlideLeft'
                                                    })
                                                )
                                            }
                                        >
                                            <button className="flex ml-auto gap-2 text-white border-0 bg-transparent cursor-pointer">
                                                <svg
                                                    stroke="currentColor"
                                                    fill="none"
                                                    stroke-width="2"
                                                    viewBox="0 0 24 24"
                                                    stroke-linecap="round"
                                                    stroke-linejoin="round"
                                                    className="h-4 w-4"
                                                    height="1em"
                                                    width="1em"
                                                    xmlns="http://www.w3.org/2000/svg"
                                                >
                                                    <path d="M16 4h2a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h2"></path>
                                                    <rect x="8" y="2" width="8" height="4" rx="1" ry="1"></rect>
                                                </svg>
                                                Copy code
                                            </button>
                                        </CopyToClipboard>
                                    </div>
                                    <div className="markdown-wrapper">
                                        <ReactMarkdown
                                            components={{
                                                code({ node, inline, className, children, ...props }) {
                                                    const match = /language-(\w+)/.exec(className || '');
                                                    return true ? (
                                                        <SyntaxHighlighter
                                                            showLineNumbers={true}
                                                            style={{ ...vscDarkPlus } as any}
                                                            language={'javascript'}
                                                            PreTag="div"
                                                            {...props}
                                                        >
                                                            {String(children).replace(/\n$/, '')}
                                                        </SyntaxHighlighter>
                                                    ) : (
                                                        <code className={className} {...props}>
                                                            {children}
                                                        </code>
                                                    );
                                                }
                                            }}
                                        >
                                            {HTML_CODE(item.name, item.mediumUid)}
                                        </ReactMarkdown>
                                    </div>
                                    <div className="text-sm mt-3 mb-1">添加聊天气泡，请复制添加到您的 html中</div>
                                    <div className="flex items-center relative text-gray-200 bg-gray-800 px-4 py-2 text-xs font-sans justify-between rounded-t-md">
                                        <span>javascript</span>
                                        <CopyToClipboard
                                            text={JS_CODE_COPY(item.name, item.mediumUid)}
                                            onCopy={() =>
                                                dispatch(
                                                    openSnackbar({
                                                        open: true,
                                                        message: '复制成功',
                                                        variant: 'alert',
                                                        alert: {
                                                            color: 'success'
                                                        },
                                                        close: false,
                                                        anchorOrigin: { vertical: 'top', horizontal: 'right' },
                                                        transition: 'SlideLeft'
                                                    })
                                                )
                                            }
                                        >
                                            <button className="flex ml-auto gap-2 text-white border-0 bg-transparent cursor-pointer">
                                                <svg
                                                    stroke="currentColor"
                                                    fill="none"
                                                    stroke-width="2"
                                                    viewBox="0 0 24 24"
                                                    stroke-linecap="round"
                                                    stroke-linejoin="round"
                                                    className="h-4 w-4"
                                                    height="1em"
                                                    width="1em"
                                                    xmlns="http://www.w3.org/2000/svg"
                                                >
                                                    <path d="M16 4h2a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h2"></path>
                                                    <rect x="8" y="2" width="8" height="4" rx="1" ry="1"></rect>
                                                </svg>
                                                Copy code
                                            </button>
                                        </CopyToClipboard>
                                    </div>
                                    <div className="markdown-wrapper">
                                        <ReactMarkdown
                                            components={{
                                                code({ node, inline, className, children, ...props }) {
                                                    const match = /language-(\w+)/.exec(className || '');
                                                    return true ? (
                                                        <SyntaxHighlighter
                                                            showLineNumbers={true}
                                                            style={vscDarkPlus as any}
                                                            language={'javascript'}
                                                            PreTag="div"
                                                            {...props}
                                                        >
                                                            {String(children).replace(/\n$/, '')}
                                                        </SyntaxHighlighter>
                                                    ) : (
                                                        <code className={className} {...props}>
                                                            {children}
                                                        </code>
                                                    );
                                                }
                                            }}
                                        >
                                            {JS_CODE(item.name, item.mediumUid)}
                                        </ReactMarkdown>
                                    </div>
                                    <Divider className="my-[20px]" />
                                    <div className="flex items-center justify-end">
                                        <ConfigProvider
                                            theme={{
                                                components: {
                                                    Popconfirm: {
                                                        zIndexPopup: 9999
                                                    }
                                                }
                                            }}
                                        >
                                            <Popconfirm
                                                placement="top"
                                                title="请再次确认是否通过这次审查"
                                                onConfirm={() => {
                                                    handleDel(item);
                                                }}
                                                okText="Yes"
                                                cancelText="No"
                                            >
                                                <Button color={'error'} size={'small'} variant="contained">
                                                    删除
                                                </Button>
                                            </Popconfirm>
                                        </ConfigProvider>
                                        <Button
                                            onClick={() => {
                                                handleUpload(item);
                                            }}
                                            className="ml-5"
                                            color={'secondary'}
                                            size={'small'}
                                            variant="contained"
                                        >
                                            更新
                                        </Button>
                                    </div>
                                </div>
                            </AccordionDetails>
                        </Accordion>
                    ))}
                </div>
            </div>
        </Drawer>
    );
};
