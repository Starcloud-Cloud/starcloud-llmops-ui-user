import ReactMarkdown from 'react-markdown';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { vscDarkPlus } from 'react-syntax-highlighter/dist/esm/styles/prism';
import ContentCopyIcon from '@mui/icons-material/ContentCopy';
import remarkGfm from 'remark-gfm';
type tProps = {
    textContent: string;
    darkMode?: boolean; // markdown文本
};

const text = `Here is some JavaScript code:

~~~json
{"input": "fasfasd"}
~~~
`;

const ChatMarkdown = (props: tProps) => {
    const { textContent } = props;
    return (
        <ReactMarkdown
            remarkPlugins={[remarkGfm]}
            components={{
                code({ node, inline, className, children, ...props }) {
                    const match = /language-(\w+)/.exec(className || '');
                    console.log(inline, className, children, props, 'asda');
                    return !inline && match ? (
                        <SyntaxHighlighter showLineNumbers={true} style={vscDarkPlus as any} language={match[1]} PreTag="div" {...props}>
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
            {textContent}
            {/* {text} */}
        </ReactMarkdown>
    );
};

export default ChatMarkdown;
