import {
    Button,
    Card,
    Divider as MuiDivider,
    FormControl,
    Grid,
    IconButton,
    InputLabel,
    LinearProgress,
    MenuItem,
    Select,
    Switch,
    TextField,
    Tooltip
} from '@mui/material';
import TipsAndUpdatesIcon from '@mui/icons-material/TipsAndUpdates';
import ContentCopyIcon from '@mui/icons-material/ContentCopy';
import { Alert, Divider, Dropdown, FloatButton, Input, MenuProps, Modal, Popover, Rate, Spin } from 'antd';
import HelpOutlineIcon from '@mui/icons-material/HelpOutline';
import React, { useEffect } from 'react';
import TuneIcon from '@mui/icons-material/Tune';
import { useFormik } from 'formik';
import * as yup from 'yup';
import { AiCustomModal } from '../AiCustomModal';
import AddIcon from '@mui/icons-material/Add';
import _ from 'lodash-es';
import DeleteIcon from '@mui/icons-material/Delete';
import { ListingBuilderEnum } from 'utils/enums/listingBuilderEnums';
import copy from 'clipboard-copy';
import { dispatch } from 'store';
import { openSnackbar } from 'store/slices/snackbar';
import { getCaretPosition } from 'utils/getCaretPosition';
import { SCORE_LIST } from '../../../data/index';
import ExpandLessIcon from '@mui/icons-material/ExpandLess';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import FiledTextArea from './FiledTextArea';
import { useListing } from 'contexts/ListingContext';
import { getListingByAsin, getMetadata, getRecommend } from 'api/listing/build';
import { ExclamationCircleFilled } from '@ant-design/icons';
import imgLoading from 'assets/images/picture/loading.gif';
import { fetchRequestCanCancel } from 'utils/fetch';
import { useLocation } from 'react-router-dom';
import { PermissionUpgradeModal } from 'views/template/myChat/createChat/components/modal/permissionUpgradeModal';

const { Search } = Input;

// 首字母转换为大写
function capitalizeFirstLetterOfEachWord(str: string): string {
    const words = str.split(' ');
    const capitalizedWords = words.map((word) => {
        return word.charAt(0).toUpperCase() + word.slice(1);
    });
    return capitalizedWords.join(' ');
}

const findCurrentWord = (input: string, index: number) => {
    let currentWord = '';
    // 将字符串按空格分割成单词数组
    let words = input.split(' ');

    // 记录当前位置
    let currentPosition = 0;

    // 遍历单词数组，判断索引6处的字符位于哪个单词上
    for (let i = 0; i < words.length; i++) {
        let word = words[i];
        let wordLength = word.length;

        // 判断当前位置是否在当前单词的范围内
        if (currentPosition + wordLength >= index) {
            console.log('索引6处的字符位于单词:', word);
            currentWord = word;
            break;
        }

        // 更新当前位置
        currentPosition += wordLength + 1; // 加1是为了考虑空格的长度
    }
    return currentWord;
};

const Content = () => {
    const [expandList, setExpandList] = React.useState<number[]>([]);

    const [assistOpen, setAssistOpen] = React.useState(true);
    const [aiCustomOpen, setAiCustomOpen] = React.useState(false);
    const [scoreList, setScoreList] = React.useState(SCORE_LIST);
    const [x, setX] = React.useState(0);
    const [y, setY] = React.useState(0);
    const [openKeyWordSelect, setOpenKeyWordSelect] = React.useState(false);
    const [hoverKey, setHoverKey] = React.useState(0);
    const [currentInputIndex, setCurrentInputIndex] = React.useState(0);
    const [editIndex, setEditIndex] = React.useState(0);
    const [currentWord, setCurrentWord] = React.useState('');
    const [activeIndex, setActiveIndex] = React.useState<number | undefined>(undefined);
    const [mateList, setMateList] = React.useState<any>();
    const [productFeature, setProductFeature] = React.useState('');
    const [loadingList, setLoadingList] = React.useState<any[]>([]);
    const [openGrade, setOpenGrade] = React.useState(false);
    const [tokenOpen, setTokenOpen] = React.useState(false);
    const [from, setFrom] = React.useState('');

    const location = useLocation();

    const {
        list,
        setList,
        enableAi,
        setEnableAi,
        keywordHighlight,
        detail,
        country,
        handleReGrade,
        itemScore,
        version,
        uid,
        handleSumGrade,
        fiveLen,
        setListingParam,
        setAsin,
        asin
    } = useListing();

    const ulRef = React.useRef<any>(null);
    const hoverKeyRef = React.useRef<any>(null);
    const timeoutRef = React.useRef<any>(null);

    React.useEffect(() => {
        if (detail) {
            setAsin(detail.asin);
        }
    }, [detail]);

    // 设置头部分数
    React.useEffect(() => {
        const scoreListDefault = _.cloneDeep(scoreList);
        if (itemScore) {
            scoreListDefault[0].list[0].value = itemScore.withoutSpecialChat;
            scoreListDefault[0].list[1].value = itemScore.titleLength;
            scoreListDefault[0].list[2].value = itemScore.titleUppercase;

            scoreListDefault[1].list[0].value = itemScore.fiveDescLength;
            scoreListDefault[1].list[1].value = itemScore.allUppercase;
            scoreListDefault[1].list[2].value = itemScore.partUppercase;

            scoreListDefault[2].list[0].value = itemScore.productLength;
            scoreListDefault[2].list[1].value = itemScore.withoutUrl;

            scoreListDefault[3].list[0].value = itemScore.searchTermLength;
            setScoreList([...scoreListDefault]);
        }
    }, [itemScore]);

    const fiveDesGrade = (index: number) => {
        const copyItemScore = _.cloneDeep(itemScore);
        if (copyItemScore?.fiveDescScore) {
            let list: any[] = [];
            Object.keys(copyItemScore?.fiveDescScore).forEach((i) => {
                if (index === 0) {
                    list.push({
                        label: `五点描述${i}： 包含150到200个字符`,
                        value: copyItemScore?.fiveDescScore[i].fiveDescLength
                    });
                }
                if (index === 1) {
                    list.push({
                        label: `五点描述${i}： 第一个字母大写`,
                        value: copyItemScore?.fiveDescScore[i].starUppercase
                    });
                }
                if (index === 2) {
                    list.push({
                        label: `五点描述${i}： 不全是大写`,
                        value: copyItemScore?.fiveDescScore[i].hasLowercase
                    });
                }
            });
            return list.map((item) => getItemGradeComp(item));
        } else {
            return null;
        }
    };

    useEffect(() => {
        (async () => {
            const res = await getMetadata();
            setMateList(res);
        })();
    }, []);

    const getItemGradeComp = (v: any) => {
        return (
            <div className="flex justify-between items-center h-[30px]">
                <span className="flex-[80%]">{v.label}</span>
                {!v.value ? (
                    <Tooltip title={'不满足'}>
                        <svg
                            className="h-[14px] w-[14px] cursor-pointer"
                            viewBox="0 0 1098 1024"
                            version="1.1"
                            xmlns="http://www.w3.org/2000/svg"
                            p-id="11931"
                            width="32"
                            height="32"
                        >
                            <path
                                d="M610.892409 345.817428C611.128433 343.63044 611.249529 341.409006 611.249529 339.159289 611.249529 305.277109 583.782594 277.810176 549.900416 277.810176 516.018238 277.810176 488.551303 305.277109 488.551303 339.159289 488.551303 339.229063 488.55142 339.298811 488.551654 339.368531L488.36115 339.368531 502.186723 631.80002C502.185201 631.957072 502.184441 632.114304 502.184441 632.271715 502.184441 658.624519 523.547611 679.98769 549.900416 679.98769 576.253221 679.98769 597.616391 658.624519 597.616391 632.271715 597.616391 631.837323 597.610587 631.404284 597.599053 630.972676L610.892409 345.817428ZM399.853166 140.941497C481.4487 1.632048 613.916208 1.930844 695.336733 140.941497L1060.013239 763.559921C1141.608773 902.869372 1076.938039 1015.801995 915.142835 1015.801995L180.047065 1015.801995C18.441814 1015.801995-46.243866 902.570576 35.176659 763.559921L399.853166 140.941497ZM549.900416 877.668165C583.782594 877.668165 611.249529 850.201231 611.249529 816.319053 611.249529 782.436871 583.782594 754.96994 549.900416 754.96994 516.018238 754.96994 488.551303 782.436871 488.551303 816.319053 488.551303 850.201231 516.018238 877.668165 549.900416 877.668165Z"
                                fill="#FB6547"
                                p-id="11932"
                            ></path>
                        </svg>
                    </Tooltip>
                ) : (
                    <Tooltip title={'满足'}>
                        <svg
                            className="h-[14px] w-[14px] cursor-pointer"
                            viewBox="0 0 1024 1024"
                            version="1.1"
                            xmlns="http://www.w3.org/2000/svg"
                            p-id="21700"
                            width="16"
                            height="16"
                        >
                            <path
                                d="M511.999994 0C229.205543 0 0.020822 229.226376 0.020822 512.020827c0 282.752797 229.184721 511.979173 511.979173 511.979173s511.979173-229.226376 511.979173-511.979173C1023.979167 229.226376 794.794446 0 511.999994 0zM815.371918 318.95082l-346.651263 461.201969c-10.830249 14.370907-27.32555 23.409999-45.27877 24.742952-1.582882 0.124964-3.12411 0.166619-4.665338 0.166619-16.328682 0-32.074198-6.373185-43.779197-17.911565l-192.903389-189.44604c-24.617988-24.20144-24.992881-63.731847-0.791441-88.349835 24.20144-24.659643 63.731847-24.951226 88.349835-0.833096l142.042875 139.501932 303.788472-404.2182c20.744091-27.575479 59.899605-33.115568 87.516739-12.413131C830.534266 252.219827 836.116009 291.375341 815.371918 318.95082z"
                                fill="#673ab7"
                                p-id="21701"
                            ></path>
                        </svg>
                    </Tooltip>
                )}
            </div>
        );
    };

    const handleGradeItem = React.useCallback(
        (index: number, type: ListingBuilderEnum) => {
            if (itemScore && Object.keys(itemScore).length) {
                const scoreListCopy = _.cloneDeep(scoreList);
                const copyItemScore = _.cloneDeep(itemScore);
                if (type !== ListingBuilderEnum.FIVE_DES) {
                    if (index === 0) {
                        return scoreListCopy[0].list.map((item) => getItemGradeComp(item));
                    }
                    if (index === fiveLen + 1) {
                        return scoreListCopy[2].list.map((item) => getItemGradeComp(item));
                    }
                    if (index === fiveLen + 2) {
                        return scoreListCopy[3].list.map((item) => getItemGradeComp(item));
                    }
                } else {
                    let list = [];
                    const current = copyItemScore?.fiveDescScore?.[index];
                    list.push(
                        {
                            label: '包含150到200个字符',
                            value: current?.fiveDescLength
                        },
                        {
                            label: '第一个字母大写',
                            value: current?.starUppercase
                        },
                        {
                            label: '不全是大写',
                            value: current?.hasLowercase
                        }
                    );
                    return list.map((item) => getItemGradeComp(item));
                }
            }
        },
        [itemScore, scoreList, fiveLen]
    );

    useEffect(() => {
        const filerList = detail?.keywordResume?.filter((item: string) => item.toLowerCase()?.startsWith(currentWord.toLowerCase()));
        if (!filerList?.length || !currentWord) {
            setOpenKeyWordSelect(false);
            setHoverKey(0);
            hoverKeyRef.current = 0;
        }
    }, [detail?.keywordResume, currentWord]);

    React.useEffect(() => {
        if (openKeyWordSelect) {
            // 绑定键盘事件
            const handleKeyDown = (e: any) => {
                const { key } = e;
                if (key === 'ArrowUp' || key === 'ArrowDown') {
                    e.preventDefault(); // 防止滚动页面
                    console.log(Math.max(0, hoverKeyRef.current - 1), Math.min(detail?.keywordResume.length - 1, hoverKeyRef.current + 1));
                    const newIndex =
                        key === 'ArrowUp'
                            ? Math.max(0, hoverKeyRef.current - 1)
                            : Math.min(detail?.keywordResume.length - 1, hoverKeyRef.current + 1);
                    setHoverKey(newIndex);
                    hoverKeyRef.current = newIndex;
                } else if (key === 'Enter') {
                    e.preventDefault(); // 防止滚动页面
                    if (hoverKeyRef.current !== undefined) {
                        handleReplaceValue(
                            detail?.keywordResume?.filter((item: string) => item.toLowerCase()?.startsWith(currentWord.toLowerCase()))[
                                hoverKeyRef.current || 0
                            ]
                        );
                    }
                }
            };

            document.addEventListener('keydown', handleKeyDown);
            // 在组件卸载时解绑键盘事件
            return () => {
                document.removeEventListener('keydown', handleKeyDown);
            };
        }
    }, [openKeyWordSelect, detail, currentWord]);

    const handleReplaceValue = (selectValue: string) => {
        const newList = [...list];
        const preValue = newList[editIndex].value;
        const modifiedString =
            preValue?.slice(0, currentInputIndex - currentWord.length) +
            selectValue +
            preValue?.slice(currentInputIndex + currentWord.length);
        newList[editIndex] = {
            ...newList[editIndex],
            value: modifiedString,
            character: modifiedString.length,
            word: modifiedString.trim() === '' ? 0 : modifiedString.trim().split(' ').length
        };
        setList(newList);

        clearTimeout(timeoutRef.current);
        timeoutRef.current = setTimeout(() => {
            handleReGrade(newList);
        }, 200);
        setOpenKeyWordSelect(false);
        setHoverKey(0);
        hoverKeyRef.current = 0;
    };

    const handleHasKeyWork = (e: any, keyword: string[]) => {
        const startIndex = e.target.selectionStart;
        setCurrentInputIndex(startIndex);
        const value = e.target.value;
        const word = findCurrentWord(value, startIndex);
        setCurrentWord(word);
        if (startIndex === 1 || value[startIndex - 2] === ' ') {
            // const filterKeyWord = keyword.filter((item, index) => {
            const filterKeyWord = detail?.keywordResume?.filter((item: string) => item?.toLowerCase().startsWith(word.toLowerCase())) || [];
            if (filterKeyWord?.length > 0) {
                const { x, y } = getCaretPosition(e.target);
                setX(x);
                setY(y);
                setOpenKeyWordSelect(true);
            } else {
                setOpenKeyWordSelect(false);
            }
        } else {
            const { x, y } = getCaretPosition(e.target);
            setX(x);
            setY(y);
        }
    };

    const handleInputChange = (e: any, index: number, keyword: string[]) => {
        let otherList: any[] = [];
        const newKeyword = keyword?.map((v: any) => v.keyword) || [];
        handleHasKeyWork(e, newKeyword);

        setEditIndex(index);
        setList((prevList: any) => {
            const newList = [...prevList];
            newList[index] = {
                ...newList[index],
                value: e.target.value,
                character: e.target.value.length,
                word: e.target.value.trim() === '' ? 0 : e.target.value.trim().split(' ').length
            };
            otherList = newList;
            return newList;
        });

        clearTimeout(timeoutRef.current);
        timeoutRef.current = setTimeout(() => {
            handleReGrade(otherList);
        }, 200);
    };

    const handleExpand = (key: number) => {
        const index = expandList.findIndex((v) => v === key);
        if (index > -1) {
            expandList.splice(index, 1);
        } else {
            expandList.push(key);
        }
        setExpandList([...expandList]);
    };

    const formik = useFormik({
        initialValues: {
            productFeature: '',
            customerFeature: '',
            brandName: '',
            targetLanguage: '',
            writingStyle: ''
        },
        onSubmit: async (values) => {}
    });

    useEffect(() => {
        setListingParam({ ...formik.values });
    }, [formik.values]);

    useEffect(() => {
        if (detail?.draftConfig?.aiConfigDTO) {
            setProductFeature(detail.draftConfig.aiConfigDTO.productFeature);
            formik.setValues({
                ...detail.draftConfig.aiConfigDTO
            });
        }
    }, [detail]);

    const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setEnableAi(event.target.checked);
    };

    const items: MenuProps['items'] = [
        {
            key: '1',
            label: (
                <div className="flex items-center">
                    <TipsAndUpdatesIcon className="!text-sm" color="secondary" />
                    <span>根据已有关键词生成</span>
                </div>
            )
        },
        {
            key: '2',
            label: (
                <div className="flex items-center">
                    <TuneIcon className="!text-sm" color="secondary" />
                    <span>高级自定义生成</span>
                </div>
            ),
            onClick: () => setAiCustomOpen(true)
        }
    ];

    const handleAddFiveDescription = () => {
        const r = list.filter((item) => item.type === ListingBuilderEnum.FIVE_DES);
        const index = r.length + 1;
        const copyList = _.cloneDeep(list);
        copyList.splice(-2, 0, {
            title: `五点描述${index}`,
            des: (
                <span>
                    1、提炼产品核心卖点，比如：尺寸、质保信息、适用年龄等，按重要程度排序；
                    <br />
                    2、字符要求：单行最多500字符，一般建议在200字符以内；
                    <br />
                    3、分点描述，每个五点描述的首字母大写，避免全部使用大写字母；
                    <br />
                    4、语言本地化、可读性强，让消费者可以通过简洁明了的描述最快速地了解产品的详细情况；
                    <br />
                    5、不要包含促销和定价的相关信息，不要包含物流、卖家以及公司的相关信息。
                </span>
            ),
            placeholder: `产品卖点描述${index}`,
            type: ListingBuilderEnum.FIVE_DES,
            isOvertop: true,
            maxCharacter: 200,
            character: 0,
            word: 0,
            value: '',
            row: 4,
            btnText: 'AI生成五点描述',
            enable: true,
            keyword: [],
            grade: 0
        });
        setList(copyList);
    };

    const handleDelFiveDescription = (index: number) => {
        const copyList = _.cloneDeep(list);
        copyList.splice(index, 1);
        setList(copyList);
    };

    const handleTurnUpcase = (index: number) => {
        const copyList = _.cloneDeep(list);
        copyList[index].value = capitalizeFirstLetterOfEachWord(copyList[index].value || '');
        setList(copyList);
    };

    const handleTurnLowercase = (index: number) => {
        const copyList = _.cloneDeep(list);
        copyList[index].value = copyList[index].value?.toLowerCase();
        setList(copyList);
    };

    const handleSwitch = (e: any, index: number) => {
        const value = e.target.checked;
        const copyList = _.cloneDeep(list);
        copyList[index].enable = !value;
        setList(copyList);
        // 处理逻辑
    };

    const typeSearchList = async (value: string) => {
        try {
            const indexList = list.filter((item) => item.type !== ListingBuilderEnum.SEARCH_WORD).map((item, index) => index);
            setLoadingList(indexList);

            const res = await getListingByAsin({
                asin: value,
                marketName: country.key
            });
            window.scrollTo(0, 870);
            setLoadingList([]);
            let copyList: any[] = _.cloneDeep(list);
            copyList[0].value = res.title;
            copyList[0].character = res?.title?.length || 0;
            copyList[0].word = res?.title?.trim()?.split(' ')?.length || 0;

            const productIndex = copyList.findIndex((item) => item.type === ListingBuilderEnum.PRODUCT_DES);
            copyList[productIndex].value = res.description;
            copyList[productIndex].character = res.description?.length || 0;
            copyList[productIndex].word = res.description?.trim()?.split(' ')?.length || 0;

            res.features?.forEach((item: any, index: number) => {
                copyList[index + 1].value = item;
                copyList[index + 1].character = item?.length || 0;
                copyList[index + 1].word = item?.trim()?.split(' ')?.length || 0;
            });
            setList(copyList);
        } catch (e) {
            setLoadingList([]);
        }
    };

    // 所搜
    const handleSearch = async (value: any) => {
        setAsin(value);
        if (!value) {
            dispatch(
                openSnackbar({
                    open: true,
                    message: '请先输入ASIN',
                    variant: 'alert',
                    alert: {
                        color: 'error'
                    },
                    anchorOrigin: { vertical: 'top', horizontal: 'center' },
                    close: false
                })
            );
            return;
        }
        const someList = list.some((item) => item.value);
        if (someList) {
            Modal.confirm({
                title: '温馨提示',
                icon: <ExclamationCircleFilled />,
                content: '获取Listing后，您当前编辑的内容会被覆盖，但不影响导入的关键词库，是否继续',
                onOk: () => {
                    typeSearchList(value);
                },
                onCancel() {
                    console.log('Cancel');
                }
            });
        } else {
            await typeSearchList(value);
        }
    };

    const getFiveDesAllKeys = (obj: any) => {
        let allKeys: any = [];

        for (let key in obj) {
            allKeys = allKeys.concat(obj[key].keys);
        }

        return allKeys;
    };
    const doAiWrite = async (item: any, index: number, isAll?: boolean) => {
        try {
            if (item.type !== ListingBuilderEnum.FIVE_DES) {
                setLoadingList([index]);
                // 清空当前value
                setList((preList: any) => {
                    const copyPreList = _.cloneDeep(preList);
                    copyPreList[index].value = '';
                    return copyPreList;
                });
            } else {
                const array = Array.from({ length: index + fiveLen - 1 }, (_, i) => index + i);
                setLoadingList(array);
                array.forEach((v) => {
                    setList((preList: any) => {
                        const copyPreList = _.cloneDeep(preList);
                        copyPreList[v].value = '';
                        return copyPreList;
                    });
                });
            }

            // 智能推荐
            if (item.type === ListingBuilderEnum.SEARCH_WORD) {
                setLoadingList([]);
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
                        enableAi,
                        fiveDescNum: list.filter((item) => item.type === ListingBuilderEnum.FIVE_DES)?.length
                    },
                    title: list.find((item) => item.type === ListingBuilderEnum.TITLE)?.value,
                    productDesc: list.find((item) => item.type === ListingBuilderEnum.PRODUCT_DES)?.value,
                    searchTerm: list.find((item) => item.type === ListingBuilderEnum.SEARCH_WORD)?.value,
                    fiveDesc: result
                };

                const res = await getRecommend(data);
                if (res) {
                    setList((pre: any[]) => {
                        const copyPre = [...pre];
                        copyPre[index] = {
                            ...copyPre[index],
                            value: res
                        };
                        return copyPre;
                    });
                }
            } else {
                const { promise, controller } = fetchRequestCanCancel('/llm/listing/execute/asyncExecute', 'post', {
                    listingType:
                        item.type === ListingBuilderEnum.TITLE
                            ? 'LISTING_TITLE'
                            : item.type === ListingBuilderEnum.FIVE_DES
                            ? 'LISTING_BULLET_POINT'
                            : 'LISTING_PRODUCT_DESCRIPTION',
                    keywords:
                        item.type === ListingBuilderEnum.FIVE_DES
                            ? detail?.draftConfig?.fiveDescConfig
                                ? getFiveDesAllKeys(detail?.draftConfig.fiveDescConfig)
                                : []
                            : item.keyword.map((item: any) => item.text),
                    ...formik.values,
                    draftUid: uid,
                    title: list[0].value,
                    bulletPoints: list.filter((item) => item.type === ListingBuilderEnum.FIVE_DES).map((item) => item.value),
                    bulletPointsCount: fiveLen
                });
                let resp: any = await promise;

                const reader = resp.getReader();
                const textDecoder = new TextDecoder();
                let outerJoins = '';
                let fiveDesString = '';

                while (true) {
                    const { done, value } = await reader.read();
                    if (done) {
                        if (item.type === ListingBuilderEnum.FIVE_DES) {
                            setLoadingList([]);
                            const fiveList = fiveDesString?.split('#####');
                            fiveList.forEach((v, i) => {
                                setList((preList: any) => {
                                    const copyPreList = _.cloneDeep(preList);
                                    copyPreList[index + i].value = v.trim();
                                    copyPreList[index + i].character = v.trim().length || 0;
                                    copyPreList[index + i].word = v?.trim()?.split(' ')?.length || 0;
                                    return copyPreList;
                                });
                            });
                        }

                        if (isAll) {
                            const filterList = list.filter((item) => item.type !== ListingBuilderEnum.SEARCH_WORD);
                            const length = filterList.length;

                            if (index < length - 1) {
                                if (item.type !== ListingBuilderEnum.FIVE_DES) {
                                    doAiWrite(filterList[index + 1], index + 1, true);
                                } else {
                                    doAiWrite(filterList[index + fiveLen], fiveLen + index, true);
                                }
                            }
                        }
                        break;
                    }
                    const str = textDecoder.decode(value);
                    outerJoins += str;

                    // 查找事件结束标志，例如"}\n"
                    let eventEndIndex = outerJoins.indexOf('}\n');

                    while (eventEndIndex !== -1) {
                        const eventData = outerJoins.slice(0, eventEndIndex + 1);
                        const subString = eventData.substring(5);
                        const bufferObj = JSON.parse(subString);
                        // 300900000 为链接成功 type为null
                        if (bufferObj?.code === 200 || bufferObj?.code === 300900000) {
                            if (bufferObj.type === 'm') {
                                // 非5点描述
                                if (item.type !== ListingBuilderEnum.FIVE_DES) {
                                    setLoadingList([]);
                                    setList((preList: any) => {
                                        const copyPreList = _.cloneDeep(preList);
                                        copyPreList[index].value = copyPreList[index].value + bufferObj.content;
                                        copyPreList[index].character = (copyPreList[index].value + bufferObj.content)?.length || 0;
                                        copyPreList[index].word =
                                            (copyPreList[index].value + bufferObj.content)?.trim()?.split(' ')?.length || 0;
                                        return copyPreList;
                                    });
                                } else {
                                    // 5点描述
                                    fiveDesString = fiveDesString + bufferObj.content;
                                }
                            }
                        } else if (bufferObj?.code === 2004008003) {
                            setTokenOpen(true);
                            setFrom(`${bufferObj?.scene}_${bufferObj?.bizUid}`);
                            setLoadingList([]);
                        } else {
                            setLoadingList([]);
                            dispatch(
                                openSnackbar({
                                    open: true,
                                    message: bufferObj?.content || '请求异常，请重新再试',
                                    variant: 'alert',
                                    alert: {
                                        color: 'error'
                                    },
                                    anchorOrigin: { vertical: 'top', horizontal: 'center' },
                                    close: false
                                })
                            );
                            break;
                        }
                        outerJoins = outerJoins.slice(eventEndIndex + 3);
                        eventEndIndex = outerJoins.indexOf('}\n');
                    }
                }
            }
        } catch (e) {
            console.log('🚀 ~ Content ~ e:', e);
            dispatch(
                openSnackbar({
                    open: true,
                    message: '请求异常，请重新再试',
                    variant: 'alert',
                    alert: {
                        color: 'error'
                    },
                    anchorOrigin: { vertical: 'top', horizontal: 'center' },
                    close: false
                })
            );
            setLoadingList([]);
        }
    };

    const handleClick = async (item: any, index: number) => {
        if (list[index].value) {
            Modal.confirm({
                title: '温馨提示',
                icon: <ExclamationCircleFilled />,
                content:
                    item.type === ListingBuilderEnum.SEARCH_WORD
                        ? '智能推荐后，您当前编辑的内容会被覆盖，但不影响导入的关键词库，是否继续'
                        : 'AI生成后，您当前编辑的内容会被覆盖，但不影响导入的关键词库，是否继续',
                onOk: () => {
                    doAiWrite(item, index);
                },
                onCancel() {
                    console.log('Cancel');
                }
            });
        } else {
            await doAiWrite(item, index);
        }
    };

    // 循环遍历
    const handleAIGenerateAll = () => {
        const hasValue = list.some((item) => item.value);
        if (hasValue) {
            Modal.confirm({
                title: '温馨提示',
                icon: <ExclamationCircleFilled />,
                content: 'AI生成后，您当前编辑的内容会被覆盖，但不影响导入的关键词库，是否继续',
                onOk: () => {
                    doAiWrite(list[0], 0, true);
                },
                onCancel() {
                    console.log('Cancel');
                }
            });
        } else {
            doAiWrite(list[0], 0, true);
        }
    };

    return (
        <div>
            <Card className="rounded-t-none flex justify-center flex-col p-3" title={list?.[0]?.value || 'Listing草稿'}>
                <div className="text-xl font-bold py-1 mt-2">Listing评分</div>
                <div className="grid xl:grid-cols-2 xs:grid-cols-1 gap-2 w-full">
                    <div className="bg-[#f4f6f8] p-4 rounded-md">
                        <div className="flex flex-col items-center w-full">
                            <div className="flex justify-between items-center w-full">
                                <span className="text-lg font-semibold">List质量分</span>
                                <Tooltip title={'这按亚马逊官方推荐的标准进行打分，共有9个打分项，满分100分'} placement="top" arrow>
                                    <HelpOutlineIcon className="text-lg font-semibold ml-1 cursor-pointer" />
                                </Tooltip>
                            </div>
                            <div className="flex justify-between items-end w-full mt-10">
                                <span className="text-2xl font-semibold">{itemScore?.score || 0}</span>
                                <span className="text-base">/9</span>
                            </div>

                            <LinearProgress
                                variant="determinate"
                                value={((itemScore?.score || 0) / 9) * 100}
                                className="w-full"
                                sx={{
                                    height: '8px',
                                    borderRadius: '8px'
                                }}
                            />
                        </div>
                    </div>
                    <div className="bg-[#f4f6f8] p-4 rounded-md">
                        <div className="flex flex-col items-center w-full">
                            <div className="flex justify-between items-center w-full">
                                <span className="text-lg font-semibold">搜索量预估</span>
                                <Tooltip title={'List中已埋词的总搜索量占总关键词搜索量的比值'} placement="top" arrow>
                                    <HelpOutlineIcon className="text-lg font-semibold ml-1 cursor-pointer" />
                                </Tooltip>
                            </div>
                            <div className="flex justify-between items-end w-full mt-10">
                                <span className="text-2xl font-semibold">{itemScore?.matchSearchers || 0}</span>
                                <span className="text-base">/{itemScore?.totalSearches || 0}</span>
                            </div>

                            <LinearProgress
                                variant="determinate"
                                value={
                                    !itemScore?.totalSearches
                                        ? 0
                                        : ((itemScore?.matchSearchers || 0) / (itemScore?.totalSearches || 0)) * 100
                                }
                                className="w-full"
                                sx={{
                                    height: '8px',
                                    borderRadius: '8px'
                                }}
                            />
                        </div>
                    </div>
                </div>
                <div className="flex justify-between items-center my-2 cursor-pointer" onClick={() => setOpenGrade(!openGrade)}>
                    {/* <span className="text-[#505355] text-base font-semibold">打分明细</span> */}
                    <div className="flex items-center">
                        <div className="flex items-center">
                            {openGrade ? <ExpandLessIcon /> : <ExpandMoreIcon />}
                            {openGrade ? (
                                <span className="text-[#505355] text-sm font-semibold">收起打分明细</span>
                            ) : (
                                <span className="text-[#505355] text-sm font-semibold">展开打分明细</span>
                            )}
                        </div>
                    </div>
                </div>
                {openGrade && (
                    <div className="grid 2xl:grid-cols-4 sm:grid-cols-2 xs:grid-cols-1 gap-4 w-full">
                        {scoreList?.map((item, index) => (
                            <div className="flex  items-center w-full flex-col" key={index}>
                                <div className="mt-2  w-full">
                                    <span className="font-semibold text-base">{item.title}</span>
                                    {item.list.map((v, i) => (
                                        <>
                                            <div className="w-full py-1" key={i}>
                                                <div className="flex justify-between items-center h-[30px]">
                                                    <span className="flex-[80%]">{v.label}</span>
                                                    {item.title.includes('5点描述') ? (
                                                        <Popover content={fiveDesGrade(i)} title="打分">
                                                            {!v.value ? (
                                                                <svg
                                                                    className={`h-[14px] w-[14px] ${
                                                                        item.title.includes('5点描述') && 'cursor-pointer'
                                                                    }`}
                                                                    viewBox="0 0 1098 1024"
                                                                    version="1.1"
                                                                    xmlns="http://www.w3.org/2000/svg"
                                                                    p-id="11931"
                                                                    width="32"
                                                                    height="32"
                                                                >
                                                                    <path
                                                                        d="M610.892409 345.817428C611.128433 343.63044 611.249529 341.409006 611.249529 339.159289 611.249529 305.277109 583.782594 277.810176 549.900416 277.810176 516.018238 277.810176 488.551303 305.277109 488.551303 339.159289 488.551303 339.229063 488.55142 339.298811 488.551654 339.368531L488.36115 339.368531 502.186723 631.80002C502.185201 631.957072 502.184441 632.114304 502.184441 632.271715 502.184441 658.624519 523.547611 679.98769 549.900416 679.98769 576.253221 679.98769 597.616391 658.624519 597.616391 632.271715 597.616391 631.837323 597.610587 631.404284 597.599053 630.972676L610.892409 345.817428ZM399.853166 140.941497C481.4487 1.632048 613.916208 1.930844 695.336733 140.941497L1060.013239 763.559921C1141.608773 902.869372 1076.938039 1015.801995 915.142835 1015.801995L180.047065 1015.801995C18.441814 1015.801995-46.243866 902.570576 35.176659 763.559921L399.853166 140.941497ZM549.900416 877.668165C583.782594 877.668165 611.249529 850.201231 611.249529 816.319053 611.249529 782.436871 583.782594 754.96994 549.900416 754.96994 516.018238 754.96994 488.551303 782.436871 488.551303 816.319053 488.551303 850.201231 516.018238 877.668165 549.900416 877.668165Z"
                                                                        fill="#FB6547"
                                                                        p-id="11932"
                                                                    ></path>
                                                                </svg>
                                                            ) : (
                                                                <svg
                                                                    className={`h-[14px] w-[14px] ${
                                                                        item.title.includes('5点描述') && 'cursor-pointer'
                                                                    }`}
                                                                    viewBox="0 0 1024 1024"
                                                                    version="1.1"
                                                                    xmlns="http://www.w3.org/2000/svg"
                                                                    p-id="21700"
                                                                    width="16"
                                                                    height="16"
                                                                >
                                                                    <path
                                                                        d="M511.999994 0C229.205543 0 0.020822 229.226376 0.020822 512.020827c0 282.752797 229.184721 511.979173 511.979173 511.979173s511.979173-229.226376 511.979173-511.979173C1023.979167 229.226376 794.794446 0 511.999994 0zM815.371918 318.95082l-346.651263 461.201969c-10.830249 14.370907-27.32555 23.409999-45.27877 24.742952-1.582882 0.124964-3.12411 0.166619-4.665338 0.166619-16.328682 0-32.074198-6.373185-43.779197-17.911565l-192.903389-189.44604c-24.617988-24.20144-24.992881-63.731847-0.791441-88.349835 24.20144-24.659643 63.731847-24.951226 88.349835-0.833096l142.042875 139.501932 303.788472-404.2182c20.744091-27.575479 59.899605-33.115568 87.516739-12.413131C830.534266 252.219827 836.116009 291.375341 815.371918 318.95082z"
                                                                        fill="#673ab7"
                                                                        p-id="21701"
                                                                    ></path>
                                                                </svg>
                                                            )}
                                                        </Popover>
                                                    ) : (
                                                        <>
                                                            {!v.value ? (
                                                                <Tooltip title={'不满足'}>
                                                                    <svg
                                                                        className={`h-[14px] w-[14px] cursor-pointer`}
                                                                        viewBox="0 0 1098 1024"
                                                                        version="1.1"
                                                                        xmlns="http://www.w3.org/2000/svg"
                                                                        p-id="11931"
                                                                        width="32"
                                                                        height="32"
                                                                    >
                                                                        <path
                                                                            d="M610.892409 345.817428C611.128433 343.63044 611.249529 341.409006 611.249529 339.159289 611.249529 305.277109 583.782594 277.810176 549.900416 277.810176 516.018238 277.810176 488.551303 305.277109 488.551303 339.159289 488.551303 339.229063 488.55142 339.298811 488.551654 339.368531L488.36115 339.368531 502.186723 631.80002C502.185201 631.957072 502.184441 632.114304 502.184441 632.271715 502.184441 658.624519 523.547611 679.98769 549.900416 679.98769 576.253221 679.98769 597.616391 658.624519 597.616391 632.271715 597.616391 631.837323 597.610587 631.404284 597.599053 630.972676L610.892409 345.817428ZM399.853166 140.941497C481.4487 1.632048 613.916208 1.930844 695.336733 140.941497L1060.013239 763.559921C1141.608773 902.869372 1076.938039 1015.801995 915.142835 1015.801995L180.047065 1015.801995C18.441814 1015.801995-46.243866 902.570576 35.176659 763.559921L399.853166 140.941497ZM549.900416 877.668165C583.782594 877.668165 611.249529 850.201231 611.249529 816.319053 611.249529 782.436871 583.782594 754.96994 549.900416 754.96994 516.018238 754.96994 488.551303 782.436871 488.551303 816.319053 488.551303 850.201231 516.018238 877.668165 549.900416 877.668165Z"
                                                                            fill="#FB6547"
                                                                            p-id="11932"
                                                                        ></path>
                                                                    </svg>
                                                                </Tooltip>
                                                            ) : (
                                                                <Tooltip title={'满足'}>
                                                                    <svg
                                                                        className={`h-[14px] w-[14px] cursor-pointer`}
                                                                        viewBox="0 0 1024 1024"
                                                                        version="1.1"
                                                                        xmlns="http://www.w3.org/2000/svg"
                                                                        p-id="21700"
                                                                        width="16"
                                                                        height="16"
                                                                    >
                                                                        <path
                                                                            d="M511.999994 0C229.205543 0 0.020822 229.226376 0.020822 512.020827c0 282.752797 229.184721 511.979173 511.979173 511.979173s511.979173-229.226376 511.979173-511.979173C1023.979167 229.226376 794.794446 0 511.999994 0zM815.371918 318.95082l-346.651263 461.201969c-10.830249 14.370907-27.32555 23.409999-45.27877 24.742952-1.582882 0.124964-3.12411 0.166619-4.665338 0.166619-16.328682 0-32.074198-6.373185-43.779197-17.911565l-192.903389-189.44604c-24.617988-24.20144-24.992881-63.731847-0.791441-88.349835 24.20144-24.659643 63.731847-24.951226 88.349835-0.833096l142.042875 139.501932 303.788472-404.2182c20.744091-27.575479 59.899605-33.115568 87.516739-12.413131C830.534266 252.219827 836.116009 291.375341 815.371918 318.95082z"
                                                                            fill="#673ab7"
                                                                            p-id="21701"
                                                                        ></path>
                                                                    </svg>
                                                                </Tooltip>
                                                            )}
                                                        </>
                                                    )}
                                                </div>
                                            </div>
                                            <MuiDivider />
                                        </>
                                    ))}
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </Card>
            {/* <Card className="p-5 mt-2">
                <div className="flex justify-between flex-[30%] flex-wrap">
                    <div className="flex items-center">
                        <span>AI模式</span>
                        <Switch color={'secondary'} onChange={handleChange} checked={enableAi} />
                    </div>
                    <div className="flex items-center justify-end flex-[70%]">
                        <Search
                            onSearch={handleSearch}
                            className="w-full md:w-[400px]"
                            placeholder="输入ASIN, 获取亚马逊List的内容作为草稿"
                            enterButton="获取Listing"
                        />
                    </div>
                </div>
            </Card> */}
            {true && (
                <Card className="p-5 mt-2">
                    {location.pathname === '/listingBuilderOptimize' && (
                        <div>
                            <div className="flex mb-3 flex-col">
                                <span className="text-[#505355] text-base font-semibold mb-2">输入ASIN</span>
                                <Search
                                    value={asin}
                                    onSearch={handleSearch}
                                    className="w-full md:w-[400px]"
                                    placeholder="输入ASIN, 获取亚马逊List的内容作为草稿"
                                    enterButton="获取Listing"
                                    onChange={(e: any) => setAsin(e.target.value)}
                                />
                            </div>
                        </div>
                    )}
                    <div>
                        <div className="flex justify-between items-center cursor-pointer" onClick={() => setAssistOpen(!assistOpen)}>
                            <span className="text-[#505355] text-base font-semibold">添加ASIN辅助信息帮助AI更贴切的生成您的Listing</span>
                            <div className="flex items-center">
                                <div className="flex items-center ml-3 ">
                                    {assistOpen ? <ExpandLessIcon /> : <ExpandMoreIcon />}
                                    {assistOpen ? (
                                        <span className="text-[#505355] text-sm font-semibold">收起辅助信息</span>
                                    ) : (
                                        <span className="text-[#505355] text-sm font-semibold">展开辅助信息</span>
                                    )}
                                </div>
                            </div>
                        </div>
                        <div>
                            <span className="text-sm">输入产品特征，添加关键词，再点击下方“AI生成标题”按钮来自动生成文案。</span>
                        </div>
                    </div>
                    {assistOpen && (
                        <div>
                            <form onSubmit={formik.handleSubmit} className="mt-2">
                                <Grid container>
                                    <Grid sx={{ mt: 1 }} item className="w-full">
                                        <TextField
                                            size="small"
                                            fullWidth
                                            label={'*产品特征'}
                                            id="productFeature"
                                            name="productFeature"
                                            color="secondary"
                                            InputLabelProps={{ shrink: true }}
                                            value={formik.values.productFeature}
                                            onChange={(e) => {
                                                setProductFeature(e.target.value);
                                                formik.handleChange(e);
                                            }}
                                            error={formik.touched.productFeature && Boolean(formik.errors.productFeature)}
                                            helperText={formik.touched.productFeature && formik.errors.productFeature}
                                        />
                                    </Grid>
                                    <Grid sx={{ mt: 2 }} item className="w-full">
                                        <TextField
                                            size="small"
                                            label={'客户特征'}
                                            fullWidth
                                            id="customerFeature"
                                            name="customerFeature"
                                            color="secondary"
                                            InputLabelProps={{ shrink: true }}
                                            value={formik.values.customerFeature}
                                            onChange={formik.handleChange}
                                            error={formik.touched.customerFeature && Boolean(formik.errors.customerFeature)}
                                            helperText={formik.touched.customerFeature && formik.errors.customerFeature}
                                        />
                                    </Grid>
                                    <Grid sx={{ mt: 2 }} item className="w-full">
                                        <TextField
                                            size="small"
                                            label={'品牌名称'}
                                            fullWidth
                                            id="brandName"
                                            name="brandName"
                                            color="secondary"
                                            InputLabelProps={{ shrink: true }}
                                            value={formik.values.brandName}
                                            onChange={formik.handleChange}
                                            error={formik.touched.brandName && Boolean(formik.errors.brandName)}
                                            helperText={formik.touched.brandName && formik.errors.brandName}
                                        />
                                    </Grid>
                                    <Grid sx={{ mt: 2 }} item className="grid gap-2 grid-cols-2 w-full">
                                        <div>
                                            <FormControl fullWidth>
                                                <InputLabel size="small" id="demo-simple-select-label">
                                                    语言
                                                </InputLabel>
                                                <Select
                                                    size="small"
                                                    labelId="demo-simple-select-label"
                                                    label="targetLanguage"
                                                    id="targetLanguage"
                                                    name="targetLanguage"
                                                    value={formik.values.targetLanguage}
                                                    onChange={formik.handleChange}
                                                    error={formik.touched.targetLanguage && Boolean(formik.errors.targetLanguage)}
                                                >
                                                    {mateList?.targetLanguage.map((item: any, index: number) => (
                                                        <MenuItem value={item.value} key={index}>
                                                            {item.label}
                                                        </MenuItem>
                                                    ))}
                                                </Select>
                                            </FormControl>
                                        </div>
                                        <div>
                                            <FormControl fullWidth>
                                                <InputLabel size="small" id="demo-simple-select-label">
                                                    风格
                                                </InputLabel>
                                                <Select
                                                    size="small"
                                                    labelId="demo-simple-select-label"
                                                    label="writingStyle"
                                                    id="writingStyle"
                                                    name="writingStyle"
                                                    value={formik.values.writingStyle}
                                                    onChange={formik.handleChange}
                                                    error={formik.touched.writingStyle && Boolean(formik.errors.writingStyle)}
                                                >
                                                    {mateList?.writingStyle.map((item: any, index: number) => (
                                                        <MenuItem value={item.value} key={index}>
                                                            {item.label}
                                                        </MenuItem>
                                                    ))}
                                                </Select>
                                            </FormControl>
                                        </div>
                                    </Grid>
                                    <Grid sx={{ mt: 2, textAlign: 'center' }} item md={12}>
                                        <Tooltip title="请输入关键词和产品特征" placement={'top'} arrow>
                                            <Button
                                                className="!cursor-pointer !pointer-events-auto w-[300px]"
                                                startIcon={<TipsAndUpdatesIcon className="!text-sm" />}
                                                disabled={!productFeature || !detail?.keywordMetaData?.length || loadingList.length > 0}
                                                color="secondary"
                                                size="small"
                                                variant="contained"
                                                onClick={() => handleAIGenerateAll()}
                                            >
                                                {/* AI生成完整Listing(消耗{fiveLen + 2}点) */}
                                                AI生成完整Listing(消耗4点)
                                            </Button>
                                        </Tooltip>
                                    </Grid>
                                </Grid>
                            </form>
                        </div>
                    )}
                </Card>
            )}
            <Card className="mt-2 p-5">
                <div className="text-xl font-bold py-1">Listing优化</div>
                {list?.map((item, index) => (
                    <>
                        {item.type === ListingBuilderEnum.PRODUCT_DES && (
                            <>
                                <div className="justify-center flex">
                                    <Button
                                        color="secondary"
                                        size="small"
                                        variant="text"
                                        startIcon={<AddIcon />}
                                        onClick={handleAddFiveDescription}
                                    >
                                        加5点描述
                                    </Button>
                                </div>
                                <Divider />
                            </>
                        )}
                        <div className="mb-5" key={index}>
                            <div className="flex items-center text-lg justify-between mb-4">
                                <div className="flex items-center">
                                    <span className="text-[#505355] text-base font-semibold">{item.title}</span>
                                    <Divider type="vertical" style={{ marginInline: '4px' }} />
                                    <Popover content={handleGradeItem(index, item.type)} title="打分">
                                        <Rate
                                            className="!cursor-pointer"
                                            allowHalf
                                            value={handleSumGrade(index, item.type)}
                                            count={1}
                                            disabled
                                        />
                                    </Popover>
                                    <Divider type="vertical" style={{ marginInline: '4px' }} />
                                    <Button color="secondary" size="small" variant="text" onClick={() => handleExpand(index)}>
                                        高分建议
                                    </Button>
                                </div>
                                <div className="flex justify-center items-center">
                                    {enableAi &&
                                        (item.type == ListingBuilderEnum.TITLE ||
                                            item.type == ListingBuilderEnum.PRODUCT_DES ||
                                            index === 1) && (
                                            <Tooltip title="请输入关键词和产品特征" placement={'top'} arrow>
                                                <Button
                                                    className="!cursor-pointer !pointer-events-auto"
                                                    disabled={!productFeature || !detail?.keywordMetaData?.length || loadingList.length > 0}
                                                    onClick={() => handleClick(item, index)}
                                                    startIcon={<TipsAndUpdatesIcon className="!text-sm" />}
                                                    color="secondary"
                                                    size="small"
                                                    variant="contained"
                                                >
                                                    {index !== 1 ? item.btnText : `ai生成全部描述(消耗2点)`}
                                                </Button>
                                            </Tooltip>
                                        )}
                                    {item.type === ListingBuilderEnum.SEARCH_WORD && (
                                        <Tooltip title="请输入关键词" placement={'top'} arrow>
                                            <Button
                                                className="!cursor-pointer !pointer-events-auto"
                                                disabled={!detail?.keywordMetaData?.length}
                                                onClick={() => handleClick(item, index)}
                                                startIcon={<TipsAndUpdatesIcon className="!text-sm" />}
                                                color="secondary"
                                                size="small"
                                                variant="contained"
                                            >
                                                {item.btnText}
                                            </Button>
                                        </Tooltip>
                                    )}
                                    {/* {item.type === ListingBuilderEnum.SEARCH_WORD ? (
                                        <Button
                                            onClick={handleSearchWord}
                                            startIcon={<TipsAndUpdatesIcon className="!text-sm" />}
                                            color="secondary"
                                            size="small"
                                            variant="contained"
                                        >
                                            {item.btnText}
                                        </Button>
                                    ) : (
                                        <Dropdown menu={{ items }}>
                                            <Button
                                                startIcon={<TipsAndUpdatesIcon className="!text-sm" />}
                                                color="secondary"
                                                size="small"
                                                variant="contained"
                                            >
                                                {item.btnText}
                                            </Button>
                                        </Dropdown>
                                    )} */}
                                </div>
                            </div>
                            {expandList.includes(index) && (
                                <div className="mb-4">
                                    <Alert description={item.des} type="error" />
                                </div>
                            )}
                            <div
                                className={`flex flex-col border border-solid border-[#e6e8ec] rounded ${
                                    item.type === ListingBuilderEnum.SEARCH_WORD && 'border-b-0'
                                } `}
                            >
                                <div className="flex justify-between items-center px-4 flex-wrap py-1">
                                    <div className="flex items-center">
                                        <Tooltip title={'首字母大写'} arrow placement="top">
                                            <IconButton size="small">
                                                <span
                                                    className="text-[#bec2cc] cursor-pointer text-xs"
                                                    onClick={() => handleTurnUpcase(index)}
                                                >
                                                    Aa
                                                </span>
                                            </IconButton>
                                        </Tooltip>
                                        <Tooltip title={'大写转小写'} arrow placement="top" onClick={() => handleTurnLowercase(index)}>
                                            <IconButton size="small">
                                                <span className="text-[#bec2cc] cursor-pointer text-xs">ab</span>
                                            </IconButton>
                                        </Tooltip>
                                        <Divider type="vertical" style={{ marginInline: '4px' }} />
                                        <Tooltip title={'复制'} arrow placement="top">
                                            <IconButton
                                                size="small"
                                                onClick={() => {
                                                    copy(item.value || '');
                                                    dispatch(
                                                        openSnackbar({
                                                            open: true,
                                                            message: '复制成功',
                                                            variant: 'alert',
                                                            alert: {
                                                                color: 'success'
                                                            },
                                                            anchorOrigin: { vertical: 'top', horizontal: 'center' },
                                                            close: false
                                                        })
                                                    );
                                                }}
                                            >
                                                <ContentCopyIcon className="text-[#bec2cc] cursor-pointer text-sm" />
                                            </IconButton>
                                        </Tooltip>
                                        {/* <Divider type="vertical" style={{ marginInline: '4px' }} /> */}
                                        {/* <Tooltip title={'撤回'} arrow placement="top">
                                            <IconButton size="small">
                                                <RefreshIcon className="text-[#bec2cc] cursor-pointer text-sm" />
                                            </IconButton>
                                        </Tooltip>
                                        <Tooltip title={'重做'} arrow placement="top">
                                            <IconButton size="small">
                                                <ReplayIcon className="text-[#bec2cc] cursor-pointer text-sm" />
                                            </IconButton>
                                        </Tooltip> */}
                                        <Divider type="vertical" style={{ marginInline: '4px' }} />
                                        <span className="text-[#bec2cc]  text-xs">
                                            {item.character}/{item.maxCharacter}字
                                        </span>
                                        <Divider type="vertical" style={{ marginInline: '4px' }} />
                                        <span className="text-[#bec2cc] text-xs">{item.word}单词</span>
                                    </div>
                                    <div className="flex items-center">
                                        {/* <div className="flex items-center">
                                            <span>不计入已使用</span>
                                            <Switch checked={!item.enable} color={'secondary'} onChange={(e) => handleSwitch(e, index)} />
                                        </div> */}
                                        {item.isOvertop && (
                                            <IconButton size="small" onClick={() => handleDelFiveDescription(index)}>
                                                <DeleteIcon className=" cursor-pointer text-sm" />
                                            </IconButton>
                                        )}
                                    </div>
                                </div>
                                <Spin
                                    tip="思考中..."
                                    size={'large'}
                                    spinning={loadingList.includes(index)}
                                    indicator={<img width={60} src={imgLoading} />}
                                >
                                    <FiledTextArea
                                        rows={item.row}
                                        placeholder={item.placeholder}
                                        value={item.value}
                                        handleInputChange={(e: any) => handleInputChange(e, index, detail?.keywordMetaData || [])}
                                        handleClick={() => {
                                            if (index === activeIndex) {
                                                setActiveIndex(index);
                                            } else {
                                                setOpenKeyWordSelect(false);
                                                setActiveIndex(index);
                                            }
                                        }}
                                        highlightWordList={item.keyword}
                                        highlightAllWordList={detail?.keywordMetaData || []}
                                        index={index}
                                        type={item.type}
                                    />
                                </Spin>
                                {item.type !== ListingBuilderEnum.SEARCH_WORD && (
                                    <div className="flex px-4 py-3 items-center">
                                        <div className="flex-1 flex items-center">
                                            <span className="mr-2 flex items-center text-[#999]">
                                                建议关键词:
                                                <div className="ml-2 flex items-center">
                                                    {item?.keyword?.map((itemKeyword, keywordIndex) => (
                                                        <div
                                                            key={keywordIndex}
                                                            className={`${
                                                                keywordHighlight[index]
                                                                    ?.filter((item) => item !== undefined)
                                                                    .find(
                                                                        (itemKeyH) =>
                                                                            itemKeyH.text.toLowerCase() === itemKeyword.text.toLowerCase()
                                                                    )?.num
                                                                    ? 'bg-[#ffaca6] ml-1 line-through px-1'
                                                                    : 'ml-1 px-1'
                                                            }`}
                                                        >
                                                            <span>{itemKeyword.text}</span>
                                                            {/* {keywordHighlight?.find((itemKeyH) => itemKeyH.text === itemKeyword.text)?.num && (
                                                            <span>
                                                                (
                                                                {
                                                                    keywordHighlight?.find((itemKeyH) => itemKeyH.text === itemKeyword.text)
                                                                        ?.num
                                                                }
                                                                )
                                                            </span>
                                                        )} */}
                                                        </div>
                                                    ))}
                                                </div>
                                            </span>
                                        </div>
                                        <HelpOutlineIcon className="text-base ml-1 cursor-pointer" />
                                    </div>
                                )}
                            </div>
                        </div>

                        {(item.type === ListingBuilderEnum.TITLE || item.type === ListingBuilderEnum.PRODUCT_DES) && <Divider />}
                    </>
                ))}
                {openKeyWordSelect && (
                    <ul
                        ref={ulRef}
                        style={{ position: 'absolute', left: `${x}px`, top: `${y}px` }}
                        className="rounded border min-w-[200px] cursor-pointer border-[#f4f6f8] border-solid p-1 bg-white z-50"
                    >
                        {detail?.keywordResume
                            .filter((item: string) => item.toLowerCase()?.startsWith(currentWord.toLowerCase()))
                            ?.map((item: string, keyWordItemKey: number) => (
                                <li
                                    key={keyWordItemKey}
                                    style={{ height: '30px', lineHeight: '30px' }}
                                    className={`${hoverKey === keyWordItemKey ? 'list-none bg-[#f4f6f8]' : 'list-none'}`}
                                    onMouseEnter={() => {
                                        setHoverKey(keyWordItemKey);
                                        hoverKeyRef.current = keyWordItemKey;
                                    }}
                                    onClick={() => handleReplaceValue(item)}
                                >
                                    <span className="text-sm">{item}</span>
                                </li>
                            ))}
                    </ul>
                )}
            </Card>
            <AiCustomModal
                open={aiCustomOpen}
                handleClose={() => {
                    setAiCustomOpen(false);
                }}
            />
            <FloatButton.Group shape="circle" style={{ bottom: '100px' }}>
                <FloatButton.BackTop visibilityHeight={0} />
            </FloatButton.Group>
            <PermissionUpgradeModal
                from={from}
                open={tokenOpen}
                handleClose={() => setTokenOpen(false)}
                title={'当前魔法豆不足，升级会员，立享五折优惠！'}
            />
        </div>
    );
};

export default React.memo(Content);
