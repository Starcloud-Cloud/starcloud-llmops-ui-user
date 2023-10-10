import React from 'react';
import ReactMarkdown from 'react-markdown';

interface JSONBlockProps {
    value: string;
}

const renderJSONBlock: React.FC<JSONBlockProps> = ({ value }) => {
    try {
        const jsonData = JSON.parse(value);
        return <pre>{JSON.stringify(jsonData, null, 2)}</pre>;
    } catch (error: any) {
        return <p>Error rendering JSON block: {error.message}</p>;
    }
};

const CustomRenderers: { [key: string]: React.FC<any> } = {
    jsonBlock: renderJSONBlock
};

const markdownText = `
# Markdown with JSON

This is a JSON block:

\`\`\`json
{
  "key": "value",
  "array": [1, 2, 3]
}
\`\`\`

`;

export function MarkdownWithJSON() {
    return (
        <div>
            <ReactMarkdown components={CustomRenderers} children={markdownText} />
        </div>
    );
}
