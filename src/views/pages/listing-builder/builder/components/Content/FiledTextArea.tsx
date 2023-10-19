import React from 'react';

const FiledTextArea = ({ rows, value, handleInputChange, placeholder, index }: any) => {
    const h_input = ['iphone', 'iphone pro'];
    h_input.sort((a, b) => b.length - a.length);
    const r = `(${h_input.join('|')})`;
    const pattern = new RegExp(r);
    const resultArray = value?.split(pattern);

    return (
        <div className="relative w-full">
            <div className="break-words w-full h-full absolute p-[2px]">
                {resultArray?.map((item: any) => (
                    <pre
                        className={`${
                            h_input.includes(item)
                                ? 'text-transparent inline whitespace-pre-wrap text-sm font-[monospace] bg-red-400'
                                : 'text-transparent inline whitespace-pre-wrap text-sm font-[monospace]'
                        }`}
                    >
                        {item}
                    </pre>
                ))}
            </div>
            <textarea
                rows={rows}
                placeholder={placeholder}
                spellCheck="false"
                value={value}
                onChange={(e) => handleInputChange(e, index)}
                style={{ background: 'none' }}
                className="border-[#e6e8ec] border-l-0 border-r-0 text-sm relative z-10 w-full"
            />
        </div>
    );
};

export default React.memo(FiledTextArea);
