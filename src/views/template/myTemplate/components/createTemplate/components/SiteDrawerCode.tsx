import { Button, Divider, Drawer, TextField } from '@mui/material';
import React, { useState } from 'react';
import ChatMarkdown from 'ui-component/Markdown';
import cheerio from 'cheerio';
import ReactMarkdown from 'react-markdown';
import SyntaxHighlighter from 'react-syntax-highlighter';
import { vscDarkPlus } from 'react-syntax-highlighter/dist/esm/styles/prism';
import './SiteDrawerCode.scss';
import CopyToClipboard from 'react-copy-to-clipboard';
import { openSnackbar } from 'store/slices/snackbar';
import { dispatch } from 'store';

export const SiteDrawerCode = ({
    open,
    setOpen,
    setValue,
    value
}: {
    open: boolean;
    setOpen: (open: boolean) => void;
    value: string;
    setValue: (value: string) => void;
}) => {
    const onClose = () => setOpen(false);
    const [checked, setChecked] = useState(false);

    const HTML_CODE = ` 
\`\`\`
<iframe
src="https://chato.cn/b/p8eldrk02m95nky0?source=1234jh"
width="408px"
height="594px"
frameborder="0">
</iframe>
\`\`\`
`;

    const JS_CODE = `
\`\`\`
<script>
window.tip_chato_color="#fff";
window.tip_chato_bg="#4C83F3";
window.chato_iframe_src = "https://chato.cn/b/p8eldrk02m95nky0?source=1234jh";
window.chato_script_checkDomain = "https://api.chato.cn/chato/api/v1/domains/p8eldrk02m95nky0/whitelist_sites/check";
var st = document.createElement("script");
st.type="text/javascript";
st.async = true;st.src = "https://chato.cn/assets/iframe.min.js";
var header = document.getElementsByTagName("head")[0];
header.appendChild(st);
</script>
\`\`\`
`;

    return (
        <Drawer anchor="right" open={open} sx={{ '& .MuiDrawer-paper': { overflow: 'hidden' } }} onClose={onClose}>
            <div className="bg-[#f4f6f8] w-[350px] md:w-[600px] flex items-center justify-center">
                <div className="m-[10px] bg-[#fff] h-[calc(100vh-20px)] w-[100%] rounded-lg p-[20px]">
                    <div className="text-lg">我的站点</div>
                    <div className="mt-5">
                        <TextField
                            error={checked && !value}
                            autoFocus
                            size="small"
                            id="name"
                            label={'站点名称'}
                            placeholder={'请输入站点名称'}
                            fullWidth
                            helperText={checked && !value && '站点名称必填'}
                            onChange={(e) => {
                                setChecked(true);
                                setValue(e.target.value);
                            }}
                        />
                        <div className="text-base mt-5">JS代码</div>
                        <div className="text-sm mt-2 mb-1">机器人代码，请将此 iframe 添加到您的 html 代码中</div>
                        <div className="flex items-center relative text-gray-200 bg-gray-800 px-4 py-2 text-xs font-sans justify-between rounded-t-md">
                            <span>javascript</span>
                            <CopyToClipboard
                                text={HTML_CODE}
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
                                {HTML_CODE}
                            </ReactMarkdown>
                        </div>
                        <div className="text-sm mt-3 mb-1">添加聊天气泡，请复制添加到您的 html中</div>
                        <div className="flex items-center relative text-gray-200 bg-gray-800 px-4 py-2 text-xs font-sans justify-between rounded-t-md">
                            <span>javascript</span>
                            <CopyToClipboard
                                text={JS_CODE}
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
                                {JS_CODE}
                            </ReactMarkdown>
                        </div>
                        <Divider className="my-[20px]" />
                        <div className="flex items-center justify-end">
                            <Button color={'error'} size={'small'} variant="contained">
                                删除
                            </Button>
                            <Button className="ml-5" color={'secondary'} size={'small'} variant="contained">
                                更新
                            </Button>
                        </div>
                    </div>
                </div>
            </div>
        </Drawer>
    );
};
