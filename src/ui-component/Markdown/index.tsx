import ReactMarkdown from 'react-markdown';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { vscDarkPlus } from 'react-syntax-highlighter/dist/esm/styles/prism';

// darcula webstorm
// vscDarkPlus vscode暗色主题

type tProps = {
    textContent: string;
    darkMode?: boolean; // markdown文本
};

const ChatMarkdown = (props: tProps) => {
    const { textContent, darkMode } = props;
    return (
        <ReactMarkdown
            components={{
                code({ node, inline, className, children, ...props }) {
                    const match = /language-(\w+)/.exec(className || '');
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
        </ReactMarkdown>
    );
};

export default ChatMarkdown;
