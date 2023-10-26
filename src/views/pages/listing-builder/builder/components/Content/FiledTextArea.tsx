import { useListing } from 'contexts/ListingContext';
import _ from 'lodash-es';
import React, { useEffect, useMemo, useState } from 'react';
import { ListingBuilderEnum } from 'utils/enums/listingBuilderEnums';

const mergeArray = (arr: any[]) => {
    const mergedArray = [];
    const mergedData: any = {};

    arr.forEach((item) => {
        const key = item.five_des ? `${item.type}-${item.text}-${item.five_des}` : `${item.type}-${item.text}`;

        if (!mergedData[key]) {
            mergedData[key] = { ...item };
        } else {
            mergedData[key].num += item.num;
        }
    });

    for (const key in mergedData) {
        mergedArray.push(mergedData[key]);
    }

    return mergedArray;
};

// 所有关键词都高亮
const FiledTextArea = ({ rows, value, handleInputChange, placeholder, index, highlightWordList, type, highlightAllWordList }: any) => {
    const [currentList, setCurrentList] = useState<any>([]);
    const { list, setKeywordHighlight, keywordHighlight } = useListing();
    const copyHighlightWordList = highlightAllWordList.map((item: any) => item.keyword);

    // 该文本的关键字数组
    const resultArray = useMemo(() => {
        copyHighlightWordList.sort((a: string, b: string) => b.length - a.length);
        const r = `(${copyHighlightWordList.join('|')})`;
        const pattern = new RegExp(r);
        const resultArray = value?.split(pattern).filter((item: string) => item !== '');
        return resultArray;
    }, [highlightWordList, value]);

    useEffect(() => {
        const copyList = _.clone(highlightAllWordList);
        const data: any[] = [];
        resultArray?.map((item: string) => {
            copyList.forEach((item1: any) => {
                if (item1.keyword === item) {
                    if (type !== ListingBuilderEnum.FIVE_DES) {
                        data.push({ text: item1.keyword, type, num: 1 });
                    } else {
                        data.push({
                            text: item1.keyword,
                            type,
                            num: 1,
                            fiveType: `${ListingBuilderEnum.FIVE_DES}_${index}`
                        });
                    }
                }
            });
        });
        setCurrentList(data);
    }, [resultArray]);

    useEffect(() => {
        const result = mergeArray(currentList);
        const copyKeywordHighlight = _.clone(keywordHighlight);
        copyKeywordHighlight[index] = result;
        setKeywordHighlight(copyKeywordHighlight);
    }, [currentList]);

    const handleChange = (e: any) => {
        handleInputChange(e, index);
    };

    return (
        <div className="relative w-full">
            <div className="break-words w-full h-full absolute p-[2px]">
                {resultArray?.map((item: any) => (
                    <pre
                        className={`${
                            copyHighlightWordList.includes(item)
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

// export default React.memo(FiledTextArea);
export default FiledTextArea;
