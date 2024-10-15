import ReactMarkdown from 'react-markdown';
import { PrismAsyncLight as SyntaxHighlighter } from 'react-syntax-highlighter';
import { vscDarkPlus } from 'react-syntax-highlighter/dist/esm/styles/prism';
import remarkGfm from 'remark-gfm';
import CopyToClipboard from 'react-copy-to-clipboard';
import { openSnackbar } from 'store/slices/snackbar';
import { dispatch } from 'store';
import rehypeRaw from 'rehype-raw';
import './index.scss';

type tProps = {
    textContent: string;
    darkMode?: boolean; // markdown文本
};

const ChatMarkdown = (props: tProps) => {
    const { textContent } = props;
    // 处理文档类型
    // const replacedText = textContent.replace(
    //     /\{(\d+)\}/g,
    //     `<span style="
    //     padding: 0 3px;
    //     background: rgb(103, 58, 183);
    //     color: white;
    //     border-radius: 4px;
    // ">$1</span>`
    // );

    return (
        <>
            <div className="markdown-wrapper mt-2">
                <ReactMarkdown
                    remarkPlugins={[remarkGfm]}
                    // @ts-ignore
                    rehypePlugins={[rehypeRaw]}
                    components={{
                        // 自定义链接组件
                        a({ node, href, children, ...props }) {
                            return (
                                <a href={href} target="_blank" {...props}>
                                    {children}
                                </a>
                            );
                        },
                        code({ node, inline, className, children, ...props }) {
                            const match = /language-(\w+)/.exec(className || '');
                            return !inline && match ? (
                                <>
                                    <div className="flex items-center relative text-gray-200 bg-gray-800 px-4 py-2 text-xs font-sans justify-between rounded-t-md">
                                        <span>{match[1]}</span>
                                        <CopyToClipboard
                                            text={textContent?.replace(/~~~json/, '')}
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
                                                    strokeWidth="2"
                                                    viewBox="0 0 24 24"
                                                    strokeLinecap="round"
                                                    strokeLinejoin="round"
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
                                    <SyntaxHighlighter
                                        showLineNumbers={true}
                                        className="max-h-[400px]"
                                        style={vscDarkPlus as any}
                                        language={match[1]}
                                        PreTag="div"
                                        {...props}
                                    >
                                        {String(children).replace(/\n$/, '')}
                                    </SyntaxHighlighter>
                                </>
                            ) : (
                                <code className={className} {...props}>
                                    {children}
                                </code>
                            );
                        }
                    }}
                >
                    {textContent}
                </ReactMarkdown>
            </div>
        </>
    );
};

export default ChatMarkdown;
