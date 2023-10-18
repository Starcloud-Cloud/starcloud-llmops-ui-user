import React from 'react';

const FiledTextArea = ({ rows, value, handleInputChange, placeholder, index }: any) => {
    return (
        <textarea
            rows={rows}
            placeholder={placeholder}
            spellCheck="false"
            value={value}
            onChange={(e) => handleInputChange(e, index)}
            className="border-[#e6e8ec] border-l-0 border-r-0 text-sm"
        />
    );
};

export default React.memo(FiledTextArea);
