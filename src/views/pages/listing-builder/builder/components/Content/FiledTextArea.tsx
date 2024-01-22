import { useListing } from 'contexts/ListingContext';
import _ from 'lodash-es';
import React, { useEffect, useMemo, useRef, useState } from 'react';
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
const FiledTextArea = ({
    rows,
    value,
    handleInputChange,
    placeholder,
    index,
    highlightWordList,
    type,
    highlightAllWordList,
    handleClick
}: any) => {
    const [currentList, setCurrentList] = useState<any>([]);
    const { list, setKeywordHighlight, keywordHighlight, keywordHighlightRef } = useListing();
    const copyHighlightWordList = highlightAllWordList.map((item: any) => item.keyword.toLowerCase());
    const container1Ref = useRef(null);
    const container2Ref = useRef(null);
    const [scrollPosition, setScrollPosition] = useState(0);

    // 该文本的关键字数组
    const resultArray = useMemo(() => {
        copyHighlightWordList.sort((a: string, b: string) => b.length - a.length);
        const r = `(${copyHighlightWordList.join('|')})`;
        const pattern = new RegExp(r);
        const resultArray = value
            ?.toLowerCase()
            ?.split(pattern)
            .filter((item: string) => item !== '');
        return resultArray;
    }, [highlightAllWordList, value]);

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
        const copyKeywordHighlight = _.cloneDeep(keywordHighlightRef.current || []);
        if (!_.isEqual(copyKeywordHighlight[index], result)) {
            copyKeywordHighlight[index] = result;
            keywordHighlightRef.current = copyKeywordHighlight;
            setKeywordHighlight(copyKeywordHighlight);
        }
    }, [currentList]);

    const handleChange = (e: any) => {
        handleInputChange(e, index);
    };

    const handleContainer2Scroll = () => {
        if (container2Ref.current) {
            setScrollPosition((container2Ref.current as any).scrollTop);
        }
    };

    useEffect(() => {
        if (container1Ref.current) {
            (container1Ref.current as any).scrollTop = scrollPosition;
        }
    }, [scrollPosition]);

    return (
        <div className="relative w-full">
            <div className="break-words w-full h-full absolute p-[2px] overflow-auto" ref={container1Ref}>
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
                onScroll={handleContainer2Scroll}
                ref={container2Ref}
                rows={rows}
                placeholder={placeholder}
                spellCheck="false"
                value={value}
                onChange={(e) => handleChange(e)}
                style={{ background: 'none' }}
                className="border-[#e6e8ec] border-l-0 border-r-0 text-sm relative z-10 w-full resize-none"
                onClick={handleClick}
            />
        </div>
    );
};

export default React.memo(FiledTextArea);
