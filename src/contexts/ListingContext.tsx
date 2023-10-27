import { getGrade } from 'api/listing/build';
import _ from 'lodash';
import { createContext, useContext, useEffect, useMemo, useState } from 'react';
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
    update: any;
    setDetail: (detail: any) => void;
    detail: any;
    handleReGrade: (list: any[]) => void;
    handleSumGrade: (index: number, type: ListingBuilderEnum) => any;
    setItemScore: (itemScore: any) => void;
    itemScore: any;
    fiveLen: number;
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
    const [update, setUpdate] = useState<any>({});
    const [itemScore, setItemScore] = useState<any>({});

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

    const fiveLen = useMemo(() => {
        return list.filter((item) => item.type === ListingBuilderEnum.FIVE_DES)?.length || 0;
    }, []);

    //匹配到列表 回显推荐关键词 & 是否开启 & 文本 && 星号
    useEffect(() => {
        if (detail && detail.draftConfig && list.length) {
            console.log(detail.title);
            const copyList = _.cloneDeep(list);

            const newDetail = detail.draftConfig;

            // 标题
            copyList[0].enable = newDetail.titleConfig?.ignoreUse;
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
                newDetail.searchTermConfig?.recommendKeys?.map((item: any) => ({
                    text: item.keyword,
                    recommend: 1
                })) || [];
            copyList[searchIndex].value = detail.searchTerm;

            // // 5点描述
            newDetail.fiveDescConfig &&
                Object.keys(newDetail.fiveDescConfig).forEach((key) => {
                    const index = Number(key);
                    copyList[index].enable = !newDetail?.fiveDescConfig[key]?.ignoreUse;
                    copyList[index].keyword =
                        newDetail.fiveDescConfig[key]?.recommendKeys?.map((item: any) => ({
                            text: item.keyword
                        })) || [];
                });
            detail.fiveDesc &&
                Object.keys(detail.fiveDesc)?.forEach((key) => {
                    const index = Number(key);
                    copyList[index].value = detail?.fiveDesc?.[index];
                });

            setList(copyList);
        }
    }, [detail]);

    // 星号分值映射
    const handleStar = (type: ListingBuilderEnum, num: number) => {
        if (type === ListingBuilderEnum.TITLE) {
            if (num === 0 || num === 1) {
                return 0;
            }
            if (num === 2) {
                return 0.5;
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
        if (type === ListingBuilderEnum.FIVE_DES) {
            if (num === 0 || num === 1) {
                return 0;
            }

            if (num === 2) {
                return 1;
            }
        }
    };

    // 处理上面分数
    const handleSumGrade = (index: number, type: ListingBuilderEnum) => {
        const copyItemScore = _.cloneDeep(itemScore);

        if (copyItemScore && Object.keys(copyItemScore).length) {
            let titleGrade = 0;
            if (copyItemScore.withoutSpecialChat) {
                titleGrade++;
            }
            if (copyItemScore.titleLength) {
                titleGrade++;
            }
            if (copyItemScore.titleUppercase) {
                titleGrade++;
            }

            let desGrade = 0;
            if (copyItemScore.productLength) {
                desGrade++;
            }
            if (copyItemScore.withoutUrl) {
                desGrade++;
            }

            let searchGrade = 0;
            if (copyItemScore.searchTermLength) {
                searchGrade++;
            }

            if (type !== ListingBuilderEnum.FIVE_DES) {
                // 标题
                if (index === 0) {
                    return handleStar(ListingBuilderEnum.TITLE, titleGrade) || 0;
                }
                if (index === fiveLen - 1) {
                    return handleStar(ListingBuilderEnum.SEARCH_WORD, desGrade) || 0;
                }
                if (index === fiveLen - 2) {
                    return handleStar(ListingBuilderEnum.PRODUCT_DES, searchGrade) || 0;
                }
            } else {
                const currentFiveDes = copyItemScore?.fiveDescScore?.[index];
                let fiveGrade = 0;
                if (currentFiveDes?.fiveDescLength) {
                    fiveGrade++;
                }
                if (currentFiveDes?.starUppercase) {
                    fiveGrade++;
                }
                return handleStar(ListingBuilderEnum.FIVE_DES, fiveGrade) || 0;
            }
        } else {
            return 0;
        }
    };

    const handleReGrade = (list: ListType[]) => {
        const result = list
            .filter((item) => item.type === ListingBuilderEnum.FIVE_DES)
            .reduce((acc: any, obj, index) => {
                acc[index + 1] = obj.value;
                return acc;
            }, {});
        const data = {
            uid,
            version,
            endpoint: country.key,
            draftConfig: {
                enableAi: true,
                fiveDescNum: list.filter((item) => item.type === ListingBuilderEnum.FIVE_DES)?.length
            },
            title: list.find((item) => item.type === ListingBuilderEnum.TITLE)?.value,
            productDesc: list.find((item) => item.type === ListingBuilderEnum.PRODUCT_DES)?.value,
            searchTerm: list.find((item) => item.type === ListingBuilderEnum.SEARCH_WORD)?.value,
            fiveDesc: result
        };
        getGrade(data).then((res) => {
            setItemScore({ ...res.itemScore });
        });
    };

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
                update,
                handleReGrade,
                handleSumGrade,
                setItemScore,
                itemScore,
                fiveLen
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
