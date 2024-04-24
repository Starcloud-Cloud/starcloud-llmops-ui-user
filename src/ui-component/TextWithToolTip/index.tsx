import { Tooltip } from 'antd';
import React from 'react';

export const TextWithTooltip = ({
    text,
    maxLength,
    through,
    color
}: {
    text: string;
    maxLength: number;
    through?: boolean;
    color?: string;
}) => {
    const showTooltip = text.length > maxLength;

    const truncateText = (text: string, length: number) => {
        if (text.length <= length) {
            return text;
        } else {
            let truncatedText = '';
            let count = 0;
            for (let i = 0; i < text.length; i++) {
                if (count >= length) {
                    break;
                }
                truncatedText += text[i];
                count += /[^\x00-\xff]/.test(text[i]) ? 2 : 1; // 判断是否为中文字符
            }
            return `${truncatedText}...`;
        }
    };

    return (
        <div className={showTooltip ? 'text-with-tooltip' : 'text'}>
            {showTooltip ? (
                <Tooltip title={text}>
                    <span data-tip={text} data-for="tooltip" className={`${through ? 'line-through' : ''}  text-[${color}] cursor-pointer`}>
                        {truncateText(text, maxLength)}
                    </span>
                </Tooltip>
            ) : (
                <span>{text}</span>
            )}
        </div>
    );
};
