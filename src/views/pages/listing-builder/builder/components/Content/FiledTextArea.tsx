import { useListing } from 'contexts/ListingContext';
import _ from 'lodash';
import React, { useEffect } from 'react';

const FiledTextArea = ({ rows, value, handleInputChange, placeholder, index, highlightWordList, type }: any) => {
    const { list, setList } = useListing();

    highlightWordList.sort((a: string, b: string) => b.length - a.length);
    const r = `(${highlightWordList.join('|')})`;
    const pattern = new RegExp(r);
    const resultArray = value?.split(pattern).filter((item: string) => item !== '');

    useEffect(() => {
        const copyList = _.cloneDeep(list);
        resultArray?.map((item: string) => {
            copyList[index].keyword.forEach((item1: { text: string; num: number }) => {
                if (item1.text === item) {
                    item1.num += 1;
                }
            });
        });
        setList(copyList);
    }, [resultArray]);

    const handleChange = (e: any) => {
        handleInputChange(e, index);
    };

    return (
        <div className="relative w-full">
            <div className="break-words w-full h-full absolute p-[2px]">
                {resultArray?.map((item: any) => (
                    <pre
                        className={`${
                            highlightWordList.includes(item)
                                ? 'text-transparent inline whitespace-pre-wrap text-sm font-[monospace] bg-[#ffaca6]'
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
                onChange={(e) => handleChange(e)}
                style={{ background: 'none' }}
                className="border-[#e6e8ec] border-l-0 border-r-0 text-sm relative z-10 w-full"
            />
        </div>
    );
};

export default React.memo(FiledTextArea);
