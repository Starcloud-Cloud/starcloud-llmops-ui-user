import { getGrade } from 'api/listing/build';
import _ from 'lodash';
import { createContext, useContext, useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';
import { ListingBuilderEnum } from 'utils/enums/listingBuilderEnums';
import { COUNTRY_LIST, DEFAULT_LIST } from 'views/pages/listing-builder/data';

type CountryType = {
    key: string;
    icon: string;
    label: string;
};
export type ListType = {
    title: string;
    des: JSX.Element | string;
    placeholder: string;
    type: ListingBuilderEnum;
    maxCharacter: number;
    character: number;
    word: number;
    isOvertop?: boolean;
    value: string;
    row: number;
    btnText: string;
    enable: boolean;
    keyword: { text: string; recommend: number }[];
    grade: number;
};

const ListingContext = createContext<ListingContextType | null>(null);

type keywordHighlightType = {
    text: string;
    num: number;
    type: ListingBuilderEnum;
    fiveType?: string;
}[][];

type ListingContextType = {
    uid: string;
    setUid: (uid: string) => void;
    version: number | undefined;
    setVersion: (version: number) => void;
    country: CountryType;
    setCountry: (country: CountryType) => void;
    list: ListType[];
    setList: (list: any) => void;
    enableAi: boolean;
    setEnableAi: (enableAi: boolean) => void;
    setKeywordHighlight: (keywordHighlight: keywordHighlightType) => void;
    keywordHighlight: keywordHighlightType;
    setUpdate: (update: object) => void;
    update: object;
    setDetail: (detail: any) => void;
    detail: any;
};

export const ListingProvider = ({ children }: { children: React.ReactElement }) => {
    const [uid, setUid] = useState('');
    const [version, setVersion] = useState<number | undefined>();
    const [country, setCountry] = useState({
        key: COUNTRY_LIST?.['0']?.key,
        icon: COUNTRY_LIST?.['0']?.icon,
        label: COUNTRY_LIST?.['0']?.label
    });
    const [list, setList] = useState<ListType[]>(DEFAULT_LIST);
    const [enableAi, setEnableAi] = useState(true);
    const [keywordHighlight, setKeywordHighlight] = useState<keywordHighlightType | []>([]);
    const [detail, setDetail] = useState<any>(null);
    const [update, setUpdate] = useState<object>({});

    const location = useLocation();
    const searchParams = new URLSearchParams(location.search);
    const queryUid = searchParams.get('uid');
    const queryVersion = searchParams.get('version');

    useEffect(() => {
        if (queryVersion && queryUid) {
            setVersion(Number(queryVersion));
            setUid(queryUid);
        }
    }, [queryUid, queryVersion]);

    // 回显推荐关键词 & 是否开启 & 文本
    useEffect(() => {
        if (detail && list) {
            console.log(detail.title);
            const copyList = _.cloneDeep(list);

            const newDetail = detail.draftConfig;

            // 标题
            copyList[0].enable = !newDetail.titleConfig?.ignoreUse;
            copyList[0].keyword = newDetail.titleConfig?.recommendKeys?.map((item: any) => ({ text: item.keyword })) || [];
            copyList[0].value = detail.title;

            //描述
            const descIndex = newDetail.fiveDescNum + 1;
            copyList[descIndex].enable = !newDetail.productDescConfig?.ignoreUse;
            copyList[descIndex].keyword =
                newDetail.productDescConfig?.recommendKeys?.map((item: any) => ({
                    text: item.keyword,
                    recommend: 1
                })) || [];
            copyList[descIndex].value = detail.productDesc;

            // 搜索
            const searchIndex = newDetail.fiveDescNum + 2;
            copyList[searchIndex].enable = !newDetail.searchTermConfig?.ignoreUse;
            copyList[searchIndex].keyword =
                newDetail.searchTermConfig.recommendKeys?.map((item: any) => ({
                    text: item.keyword,
                    recommend: 1
                })) || [];
            copyList[searchIndex].value = detail.searchTerm;

            // // 5点描述
            Object.keys(newDetail.fiveDescConfig).forEach((key) => {
                const index = Number(key);
                copyList[index].enable = !newDetail.fiveDescConfig[key]?.ignoreUse;
                copyList[index].keyword =
                    newDetail.fiveDescConfig[key]?.recommendKeys?.map((item: any) => ({
                        text: item.keyword
                    })) || [];
            });
            Object.keys(detail.fiveDesc)?.forEach((key) => {
                const index = Number(key);
                copyList[index].value = detail.fiveDesc[index];
            });

            handleGrade(detail, copyList);
            setList(copyList);
        }
    }, [detail]);

    const handleStar = (type: ListingBuilderEnum, num: number) => {
        if (type === ListingBuilderEnum.TITLE) {
            if (num === 0 || num === 1) {
                return 0;
            }
            if (num === 0.5) {
                return 2;
            }
            if (num === 3) {
                return 1;
            }
        }
        if (type === ListingBuilderEnum.PRODUCT_DES) {
            if (num === 0 || num === 1) {
                return 0;
            }

            if (num === 2) {
                return 1;
            }
        }
        if (type === ListingBuilderEnum.SEARCH_WORD) {
            if (num === 0) {
                return 0;
            }

            if (num === 1) {
                return 1;
            }
        }
    };

    // 处理上面分数
    const handleGrade = (detail: any, copyList: ListType[]) => {
        if (detail && list.length) {
            let titleGrade = 0;
            if (detail.itemScore.withoutSpecialChat) {
                titleGrade++;
            }
            if (detail.itemScore.titleLength) {
                titleGrade++;
            }
            if (detail.itemScore.titleUppercase) {
                titleGrade++;
            }
            let desGrade = 0;
            if (detail.itemScore.productLength) {
                desGrade++;
            }
            if (detail.itemScore.withoutUrl) {
                desGrade++;
            }
            let searchGrade = 0;
            if (detail.itemScore.searchTermLength) {
                searchGrade++;
            }

            copyList[0].grade = handleStar(ListingBuilderEnum.TITLE, titleGrade) || 0;
            copyList[detail?.draftConfig.fiveDescNum + 1].grade = handleStar(ListingBuilderEnum.PRODUCT_DES, desGrade) || 0;
            copyList[detail?.draftConfig.fiveDescNum + 2].grade = handleStar(ListingBuilderEnum.SEARCH_WORD, searchGrade) || 0;
            setList(copyList);
        }
    };

    // useEffect(() => {
    //     const timer = setTimeout(() => {
    //         const result = list
    //             .filter((item) => item.type === ListingBuilderEnum.FIVE_DES)
    //             .reduce((acc: any, obj, index) => {
    //                 acc[index + 1] = obj.value;
    //                 return acc;
    //             }, {});
    //         const data = {
    //             uid,
    //             version,
    //             endpoint: country.key,
    //             draftConfig: {
    //                 enableAi: true,
    //                 fiveDescNum: list.filter((item) => item.type === ListingBuilderEnum.FIVE_DES)?.length
    //             },
    //             title: list.find((item) => item.type === ListingBuilderEnum.TITLE)?.value,
    //             productDesc: list.find((item) => item.type === ListingBuilderEnum.PRODUCT_DES)?.value,
    //             searchTerm: list.find((item) => item.type === ListingBuilderEnum.SEARCH_WORD)?.value,
    //             fiveDesc: result
    //         };
    //         getGrade(data).then((res) => {
    //             const copyDetail = _.cloneDeep(detail);
    //             copyDetail.itemScore = res.itemScore;
    //             setDetail(copyDetail);
    //         });
    //     }, 500);
    //     return () => {
    //         // 在每次状态变化时，清除之前的计时器
    //         clearTimeout(timer);
    //     };
    // }, [list]);

    return (
        <ListingContext.Provider
            value={{
                uid,
                setUid,
                version,
                setVersion,
                country,
                setCountry,
                list,
                setList,
                enableAi,
                setEnableAi,
                keywordHighlight,
                setKeywordHighlight,
                setDetail,
                detail,
                setUpdate,
                update
            }}
        >
            {children}
        </ListingContext.Provider>
    );
};

export const useListing = () => {
    const context = useContext(ListingContext);
    return context!;
};
