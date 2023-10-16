import {
    Box,
    Button,
    Card,
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
import RefreshIcon from '@mui/icons-material/Refresh';
import ReplayIcon from '@mui/icons-material/Replay';
import { Input, Alert, Divider, Statistic, ConfigProvider, Rate, Dropdown, MenuProps, Menu } from 'antd';
import HelpOutlineIcon from '@mui/icons-material/HelpOutline';
import React, { useEffect } from 'react';
import ExpandLessIcon from '@mui/icons-material/ExpandLess';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import TuneIcon from '@mui/icons-material/Tune';
import { useFormik } from 'formik';
import * as yup from 'yup';
import { AiCustomModal } from '../AiCustomModal';
import AddIcon from '@mui/icons-material/Add';
import _ from 'lodash';
import DeleteIcon from '@mui/icons-material/Delete';
import useCaretPosition from 'hooks/useCaretPosition';
import { ListingBuilderEnum } from 'utils/enums/listingBuilderEnums';
const { TextArea } = Input;

const { Search } = Input;

const defaultList = [
    {
        title: '标题',
        des: (
            <span>
                1、标题是亚马逊站内外搜索权重最高的项目，需确保它易于阅读、描述性强并包含产品的主要关键字；
                <br />
                2、200字符以内。但因为移动端仅展示标题的前60个字符，所以建议将最重要的信息放在前60个字符以内；
                <br />
                3、避免使用装饰性字符、表情符号和 ASCII 字符（例如： ~ ! * $ ? _ {} # &lt; &gt; | * ; ^ ¬ ¦ Æ © ®）；
                <br />
                4、每个单词的首字母大写，但介词、 (in, on, over, with) 连词 (and, or, for) 或冠词 (the, a, an) 除外，避免全部使用大写字母；
                <br />
                5、避免使用主观性评价用语，例如“热销商品”或“畅销商品”或促销短语，例如“免费送货”、“100% 质量保证；
                <br />
                6、尺寸和颜色变体应包含在子 ASIN 的商品名称中，而非包含在主要商品名称中。
            </span>
        ),
        placeholder: '为您的产品写一个标题',
        type: ListingBuilderEnum.TITLE,
        maxCharacter: 200,
        character: 0,
        word: 0
    },
    {
        title: '五点描述1',
        des: `1、标题是亚马逊站内外搜索权重最高的项目，需确保它易于阅读、描述性强并包含产品的主要关键字；
        2、200字符以内。但因为移动端仅展示标题的前60个字符，所以建议将最重要的信息放在前60个字符以内；
        3、避免使用装饰性字符、表情符号和 ASCII 字符（例如： ~ ! * $ ? _ { } # < > | * ; ^ ¬ ¦ Æ © ®）；
        4、每个单词的首字母大写，但介词、 (in, on, over, with) 连词 (and, or, for) 或冠词 (the, a, an) 除外，避免全部使用大写字母；
        5、避免使用主观性评价用语，例如“热销商品”或“畅销商品”或促销短语，例如“免费送货”、“100% 质量保证；
        6、尺寸和颜色变体应包含在子 ASIN 的商品名称中，而非包含在主要商品名称中。`,
        placeholder: '产品卖点描述1',
        type: ListingBuilderEnum.FIVE_DES,
        maxCharacter: 200,
        character: 0,
        word: 0
    },
    {
        title: '五点描述2',
        des: `1、标题是亚马逊站内外搜索权重最高的项目，需确保它易于阅读、描述性强并包含产品的主要关键字；
        2、200字符以内。但因为移动端仅展示标题的前60个字符，所以建议将最重要的信息放在前60个字符以内；
        3、避免使用装饰性字符、表情符号和 ASCII 字符（例如： ~ ! * $ ? _ { } # < > | * ; ^ ¬ ¦ Æ © ®）；
        4、每个单词的首字母大写，但介词、 (in, on, over, with) 连词 (and, or, for) 或冠词 (the, a, an) 除外，避免全部使用大写字母；
        5、避免使用主观性评价用语，例如“热销商品”或“畅销商品”或促销短语，例如“免费送货”、“100% 质量保证；
        6、尺寸和颜色变体应包含在子 ASIN 的商品名称中，而非包含在主要商品名称中。`,
        placeholder: '产品卖点描述2',
        type: ListingBuilderEnum.FIVE_DES,
        maxCharacter: 200,
        character: 0,
        word: 0
    },
    {
        title: '五点描述3',
        des: `1、标题是亚马逊站内外搜索权重最高的项目，需确保它易于阅读、描述性强并包含产品的主要关键字；
        2、200字符以内。但因为移动端仅展示标题的前60个字符，所以建议将最重要的信息放在前60个字符以内；
        3、避免使用装饰性字符、表情符号和 ASCII 字符（例如： ~ ! * $ ? _ { } # < > | * ; ^ ¬ ¦ Æ © ®）；
        4、每个单词的首字母大写，但介词、 (in, on, over, with) 连词 (and, or, for) 或冠词 (the, a, an) 除外，避免全部使用大写字母；
        5、避免使用主观性评价用语，例如“热销商品”或“畅销商品”或促销短语，例如“免费送货”、“100% 质量保证；
        6、尺寸和颜色变体应包含在子 ASIN 的商品名称中，而非包含在主要商品名称中。`,
        placeholder: '产品卖点描述3',
        type: ListingBuilderEnum.FIVE_DES,
        maxCharacter: 200,
        character: 0,
        word: 0
    },
    {
        title: '五点描述4',
        des: `1、标题是亚马逊站内外搜索权重最高的项目，需确保它易于阅读、描述性强并包含产品的主要关键字；
        2、200字符以内。但因为移动端仅展示标题的前60个字符，所以建议将最重要的信息放在前60个字符以内；
        3、避免使用装饰性字符、表情符号和 ASCII 字符（例如： ~ ! * $ ? _ { } # < > | * ; ^ ¬ ¦ Æ © ®）；
        4、每个单词的首字母大写，但介词、 (in, on, over, with) 连词 (and, or, for) 或冠词 (the, a, an) 除外，避免全部使用大写字母；
        5、避免使用主观性评价用语，例如“热销商品”或“畅销商品”或促销短语，例如“免费送货”、“100% 质量保证；
        6、尺寸和颜色变体应包含在子 ASIN 的商品名称中，而非包含在主要商品名称中。`,
        placeholder: '产品卖点描述4',
        type: ListingBuilderEnum.FIVE_DES,
        maxCharacter: 200,
        character: 0,
        word: 0
    },
    {
        title: '五点描述5',
        des: `1、标题是亚马逊站内外搜索权重最高的项目，需确保它易于阅读、描述性强并包含产品的主要关键字；
        2、200字符以内。但因为移动端仅展示标题的前60个字符，所以建议将最重要的信息放在前60个字符以内；
        3、避免使用装饰性字符、表情符号和 ASCII 字符（例如： ~ ! * $ ? _ { } # < > | * ; ^ ¬ ¦ Æ © ®）；
        4、每个单词的首字母大写，但介词、 (in, on, over, with) 连词 (and, or, for) 或冠词 (the, a, an) 除外，避免全部使用大写字母；
        5、避免使用主观性评价用语，例如“热销商品”或“畅销商品”或促销短语，例如“免费送货”、“100% 质量保证；
        6、尺寸和颜色变体应包含在子 ASIN 的商品名称中，而非包含在主要商品名称中。`,
        placeholder: '产品卖点描述5',
        type: ListingBuilderEnum.FIVE_DES,
        maxCharacter: 200,
        character: 0,
        word: 0
    },
    {
        title: '产品描述',
        des: `1、标题是亚马逊站内外搜索权重最高的项目，需确保它易于阅读、描述性强并包含产品的主要关键字；
        2、200字符以内。但因为移动端仅展示标题的前60个字符，所以建议将最重要的信息放在前60个字符以内；
        3、避免使用装饰性字符、表情符号和 ASCII 字符（例如： ~ ! * $ ? _ { } # < > | * ; ^ ¬ ¦ Æ © ®）；
        4、每个单词的首字母大写，但介词、 (in, on, over, with) 连词 (and, or, for) 或冠词 (the, a, an) 除外，避免全部使用大写字母；
        5、避免使用主观性评价用语，例如“热销商品”或“畅销商品”或促销短语，例如“免费送货”、“100% 质量保证；
        6、尺寸和颜色变体应包含在子 ASIN 的商品名称中，而非包含在主要商品名称中。`,
        placeholder: '请输入您的产品描述吧!',
        type: ListingBuilderEnum.PRODUCT_DES,
        maxCharacter: 200,
        character: 0,
        word: 0
    },
    {
        title: '搜索词',
        des: `1、标题是亚马逊站内外搜索权重最高的项目，需确保它易于阅读、描述性强并包含产品的主要关键字；
        2、200字符以内。但因为移动端仅展示标题的前60个字符，所以建议将最重要的信息放在前60个字符以内；
        3、避免使用装饰性字符、表情符号和 ASCII 字符（例如： ~ ! * $ ? _ { } # < > | * ; ^ ¬ ¦ Æ © ®）；
        4、每个单词的首字母大写，但介词、 (in, on, over, with) 连词 (and, or, for) 或冠词 (the, a, an) 除外，避免全部使用大写字母；
        5、避免使用主观性评价用语，例如“热销商品”或“畅销商品”或促销短语，例如“免费送货”、“100% 质量保证；
        6、尺寸和颜色变体应包含在子 ASIN 的商品名称中，而非包含在主要商品名称中。`,
        placeholder: '请添加产品的搜索词，用逗号或空格隔开!',
        type: ListingBuilderEnum.SEARCH_WORD,
        maxCharacter: 200,
        character: 0,
        word: 0
    }
];

const likeList = ['iphone pro', 'iphone', 'pro'];

type ListType = {
    title: string;
    des: JSX.Element | string;
    placeholder: string;
    type: ListingBuilderEnum;
    maxCharacter: number;
    character: number;
    word: number;
    isOvertop?: boolean;
    value?: string;
};

export const Content = () => {
    const [list, setList] = React.useState<ListType[]>(defaultList);
    const [expandList, setExpandList] = React.useState<number[]>([]);
    const [enableAi, setEnableAi] = React.useState(true);
    const [assistOpen, setAssistOpen] = React.useState(false);
    const [aiCustomOpen, setAiCustomOpen] = React.useState(false);

    const textareaRef = React.useRef<any>(null);
    const { x, y, getPosition, getSelection } = useCaretPosition(textareaRef);

    const handleInputChange = (e: any, index: number) => {
        const copyList = _.cloneDeep(list);
        copyList[index].value = e.target.value;
        copyList[index].character = e.target.value.length;
        copyList[index].word = e.target.value.trim().split(' ').length;
        setList(copyList);
    };

    useEffect(() => {
        if (textareaRef.current) {
            getPosition(textareaRef);
        }
    }, []);

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
            productFeatures: '',
            clientFeatures: '',
            voidWord: '',
            showNamePosition: '',
            name: '',
            style: ''
        },
        validationSchema: yup.object({
            productFeatures: yup.string().required('标题是必填的')
        }),
        onSubmit: async (values) => {}
    });

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
            des: `1、标题是亚马逊站内外搜索权重最高的项目，需确保它易于阅读、描述性强并包含产品的主要关键字；
            2、200字符以内。但因为移动端仅展示标题的前60个字符，所以建议将最重要的信息放在前60个字符以内；
            3、避免使用装饰性字符、表情符号和 ASCII 字符（例如： ~ ! * $ ? _ { } # < > | * ; ^ ¬ ¦ Æ © ®）；
            4、每个单词的首字母大写，但介词、 (in, on, over, with) 连词 (and, or, for) 或冠词 (the, a, an) 除外，避免全部使用大写字母；
            5、避免使用主观性评价用语，例如“热销商品”或“畅销商品”或促销短语，例如“免费送货”、“100% 质量保证；
            6、尺寸和颜色变体应包含在子 ASIN 的商品名称中，而非包含在主要商品名称中。`,
            placeholder: `产品卖点描述${index}`,
            type: ListingBuilderEnum.FIVE_DES,
            isOvertop: true,
            maxCharacter: 200,
            character: 0,
            word: 0,
            value: ''
        });
        setList(copyList);
    };

    const handleDelFiveDescription = (index: number) => {
        const copyList = _.cloneDeep(list);
        copyList.splice(index, 1);
        setList(copyList);
    };

    return (
        <div>
            <Card className="h-[320px] rounded-t-none flex justify-center flex-col">
                <div className="flex justify-around items-center w-full">
                    <div className="flex-1 flex justify-center">
                        <div className="w-[80%]">
                            <div className="flex flex-col items-center w-full">
                                <LinearProgress
                                    variant="determinate"
                                    value={80}
                                    className="w-full"
                                    sx={{
                                        height: '8px',
                                        borderRadius: '8px'
                                    }}
                                />
                                <div className="mt-2">
                                    <Statistic value={1231412} />
                                </div>
                            </div>
                        </div>
                    </div>
                    <Divider type={'vertical'} className="h-[80%]" />
                    <div className="flex-1 flex justify-center">
                        <div className="w-[80%]">
                            <div className="flex flex-col items-center w-full">
                                <LinearProgress
                                    variant="determinate"
                                    value={80}
                                    className="w-full"
                                    sx={{
                                        height: '8px',
                                        borderRadius: '8px'
                                    }}
                                />
                                <div className="mt-2">
                                    <Statistic value={1231412} />
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                <div className="flex w-full">
                    <div className="flex justify-around items-center w-full flex-col">
                        <div className="mt-2 w-[80%]">
                            <span className="font-semibold">Search Volume</span>
                            <div className="w-full mt-1">
                                <div className="flex">
                                    <ConfigProvider
                                        theme={{
                                            components: {
                                                Statistic: {
                                                    contentFontSize: 12
                                                }
                                            }
                                        }}
                                    >
                                        <Statistic value={1231412} />
                                    </ConfigProvider>
                                    /
                                    <ConfigProvider
                                        theme={{
                                            components: {
                                                Statistic: {
                                                    contentFontSize: 12
                                                }
                                            }
                                        }}
                                    >
                                        <Statistic value={1231412} />
                                    </ConfigProvider>
                                </div>
                                <LinearProgress
                                    variant="determinate"
                                    value={80}
                                    sx={{
                                        borderRadius: '4px'
                                    }}
                                />
                            </div>
                        </div>
                        <div className="mt-2 w-[80%]">
                            <span className="font-semibold">Search Volume</span>
                            <div className="w-full mt-1">
                                <div className="flex">
                                    <ConfigProvider
                                        theme={{
                                            components: {
                                                Statistic: {
                                                    contentFontSize: 12
                                                }
                                            }
                                        }}
                                    >
                                        <Statistic value={1231412} />
                                    </ConfigProvider>
                                    /
                                    <ConfigProvider
                                        theme={{
                                            components: {
                                                Statistic: {
                                                    contentFontSize: 12
                                                }
                                            }
                                        }}
                                    >
                                        <Statistic value={1231412} />
                                    </ConfigProvider>
                                </div>
                                <LinearProgress
                                    variant="determinate"
                                    value={80}
                                    sx={{
                                        borderRadius: '4px'
                                    }}
                                />
                            </div>
                        </div>
                        <div className="mt-2 w-[80%]">
                            <span className="font-semibold">Search Volume</span>
                            <div className="w-full mt-1">
                                <div className="flex">
                                    <ConfigProvider
                                        theme={{
                                            components: {
                                                Statistic: {
                                                    contentFontSize: 12
                                                }
                                            }
                                        }}
                                    >
                                        <Statistic value={1231412} />
                                    </ConfigProvider>
                                    /
                                    <ConfigProvider
                                        theme={{
                                            components: {
                                                Statistic: {
                                                    contentFontSize: 12
                                                }
                                            }
                                        }}
                                    >
                                        <Statistic value={1231412} />
                                    </ConfigProvider>
                                </div>
                                <LinearProgress
                                    variant="determinate"
                                    value={80}
                                    sx={{
                                        borderRadius: '4px'
                                    }}
                                />
                            </div>
                        </div>
                    </div>
                    <div className="flex justify-around items-center w-full flex-col">
                        <div className="mt-2 w-[80%]">
                            <span className="font-semibold">Search Volume</span>
                            <div className="w-full mt-1">
                                <div className="flex">
                                    <ConfigProvider
                                        theme={{
                                            components: {
                                                Statistic: {
                                                    contentFontSize: 12
                                                }
                                            }
                                        }}
                                    >
                                        <Statistic value={1231412} />
                                    </ConfigProvider>
                                    /
                                    <ConfigProvider
                                        theme={{
                                            components: {
                                                Statistic: {
                                                    contentFontSize: 12
                                                }
                                            }
                                        }}
                                    >
                                        <Statistic value={1231412} />
                                    </ConfigProvider>
                                </div>
                                <LinearProgress
                                    variant="determinate"
                                    value={80}
                                    sx={{
                                        borderRadius: '4px'
                                    }}
                                />
                            </div>
                        </div>
                        <div className="mt-2 w-[80%]">
                            <span className="font-semibold">Search Volume</span>
                            <div className="w-full mt-1">
                                <div className="flex">
                                    <ConfigProvider
                                        theme={{
                                            components: {
                                                Statistic: {
                                                    contentFontSize: 12
                                                }
                                            }
                                        }}
                                    >
                                        <Statistic value={1231412} />
                                    </ConfigProvider>
                                    /
                                    <ConfigProvider
                                        theme={{
                                            components: {
                                                Statistic: {
                                                    contentFontSize: 12
                                                }
                                            }
                                        }}
                                    >
                                        <Statistic value={1231412} />
                                    </ConfigProvider>
                                </div>
                                <LinearProgress
                                    variant="determinate"
                                    value={80}
                                    sx={{
                                        borderRadius: '4px'
                                    }}
                                />
                            </div>
                        </div>
                        <div className="mt-2 w-[80%]">
                            <span className="font-semibold">Search Volume</span>
                            <div className="w-full mt-1">
                                <div className="flex">
                                    <ConfigProvider
                                        theme={{
                                            components: {
                                                Statistic: {
                                                    contentFontSize: 12
                                                }
                                            }
                                        }}
                                    >
                                        <Statistic value={1231412} />
                                    </ConfigProvider>
                                    /
                                    <ConfigProvider
                                        theme={{
                                            components: {
                                                Statistic: {
                                                    contentFontSize: 12
                                                }
                                            }
                                        }}
                                    >
                                        <Statistic value={1231412} />
                                    </ConfigProvider>
                                </div>
                                <LinearProgress
                                    variant="determinate"
                                    value={80}
                                    sx={{
                                        borderRadius: '4px'
                                    }}
                                />
                            </div>
                        </div>
                    </div>
                    <div className="flex justify-around items-center w-full flex-col">
                        <div className="mt-2 w-[80%]">
                            <span className="font-semibold">Search Volume</span>
                            <div className="w-full mt-1">
                                <div className="flex">
                                    <ConfigProvider
                                        theme={{
                                            components: {
                                                Statistic: {
                                                    contentFontSize: 12
                                                }
                                            }
                                        }}
                                    >
                                        <Statistic value={1231412} />
                                    </ConfigProvider>
                                    /
                                    <ConfigProvider
                                        theme={{
                                            components: {
                                                Statistic: {
                                                    contentFontSize: 12
                                                }
                                            }
                                        }}
                                    >
                                        <Statistic value={1231412} />
                                    </ConfigProvider>
                                </div>
                                <LinearProgress
                                    variant="determinate"
                                    value={80}
                                    sx={{
                                        borderRadius: '4px'
                                    }}
                                />
                            </div>
                        </div>
                        <div className="mt-2 w-[80%]">
                            <span className="font-semibold">Search Volume</span>
                            <div className="w-full mt-1">
                                <div className="flex">
                                    <ConfigProvider
                                        theme={{
                                            components: {
                                                Statistic: {
                                                    contentFontSize: 12
                                                }
                                            }
                                        }}
                                    >
                                        <Statistic value={1231412} />
                                    </ConfigProvider>
                                    /
                                    <ConfigProvider
                                        theme={{
                                            components: {
                                                Statistic: {
                                                    contentFontSize: 12
                                                }
                                            }
                                        }}
                                    >
                                        <Statistic value={1231412} />
                                    </ConfigProvider>
                                </div>
                                <LinearProgress
                                    variant="determinate"
                                    value={80}
                                    sx={{
                                        borderRadius: '4px'
                                    }}
                                />
                            </div>
                        </div>
                        <div className="mt-2 w-[80%]">
                            <span className="font-semibold">Search Volume</span>
                            <div className="w-full mt-1">
                                <div className="flex">
                                    <ConfigProvider
                                        theme={{
                                            components: {
                                                Statistic: {
                                                    contentFontSize: 12
                                                }
                                            }
                                        }}
                                    >
                                        <Statistic value={1231412} />
                                    </ConfigProvider>
                                    /
                                    <ConfigProvider
                                        theme={{
                                            components: {
                                                Statistic: {
                                                    contentFontSize: 12
                                                }
                                            }
                                        }}
                                    >
                                        <Statistic value={1231412} />
                                    </ConfigProvider>
                                </div>
                                <LinearProgress
                                    variant="determinate"
                                    value={80}
                                    sx={{
                                        borderRadius: '4px'
                                    }}
                                />
                            </div>
                        </div>
                    </div>
                </div>
            </Card>
            <Card className="p-5 mt-2">
                <div className="flex justify-between">
                    <div className="flex items-center">
                        <span>AI模式</span>
                        <Switch color={'secondary'} onChange={handleChange} checked={enableAi} />
                    </div>
                    <div className="flex items-center">
                        <Search className="w-[400px]" placeholder="输入ASIN，一键获取亚马逊Listing内容" enterButton="获取Listing" />
                        {/* <Button startIcon={<ArrowDownwardIcon className="!text-sm" />} color="secondary" size="small" variant="contained">
                            导入
                        </Button> */}
                        <div className="ml-2">
                            <Button
                                startIcon={<TipsAndUpdatesIcon className="!text-sm" />}
                                color="secondary"
                                size="small"
                                variant="contained"
                            >
                                AI生成
                            </Button>
                        </div>
                    </div>
                </div>
            </Card>
            {enableAi && (
                <Card className="p-5 mt-2">
                    <div>
                        <div className="flex justify-between items-center">
                            <span className="text-[#505355] text-base font-semibold">添加ASIN辅助信息帮助AI更贴切的生成您的Listing</span>
                            <div className="flex items-center">
                                <span>本月剩余次数1000</span>
                                <div className="flex items-center ml-3 cursor-pointer" onClick={() => setAssistOpen(!assistOpen)}>
                                    {!assistOpen ? <ExpandLessIcon /> : <ExpandMoreIcon />}
                                    {!assistOpen ? (
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
                                    <Grid sx={{ mt: 1 }} item md={12}>
                                        <TextField
                                            size="small"
                                            label={'产品特征'}
                                            fullWidth
                                            id="productFeatures"
                                            name="productFeatures"
                                            color="secondary"
                                            InputLabelProps={{ shrink: true }}
                                            value={formik.values.productFeatures}
                                            onChange={formik.handleChange}
                                            error={formik.touched.productFeatures && Boolean(formik.errors.productFeatures)}
                                            helperText={formik.touched.productFeatures && formik.errors.productFeatures}
                                        />
                                    </Grid>
                                    <Grid sx={{ mt: 2 }} item md={12}>
                                        <TextField
                                            size="small"
                                            label={'客户特征'}
                                            fullWidth
                                            id="clientFeatures"
                                            name="clientFeatures"
                                            color="secondary"
                                            InputLabelProps={{ shrink: true }}
                                            value={formik.values.clientFeatures}
                                            onChange={formik.handleChange}
                                            error={formik.touched.clientFeatures && Boolean(formik.errors.clientFeatures)}
                                            helperText={formik.touched.clientFeatures && formik.errors.clientFeatures}
                                        />
                                    </Grid>
                                    <Grid sx={{ mt: 2 }} item md={12}>
                                        <TextField
                                            size="small"
                                            label={'不希望出现的词汇'}
                                            fullWidth
                                            id="voidWord"
                                            name="voidWord"
                                            color="secondary"
                                            InputLabelProps={{ shrink: true }}
                                            value={formik.values.voidWord}
                                            onChange={formik.handleChange}
                                            error={formik.touched.voidWord && Boolean(formik.errors.voidWord)}
                                            helperText={formik.touched.voidWord && formik.errors.voidWord}
                                        />
                                    </Grid>
                                    <Grid sx={{ mt: 2 }} item md={12} className="grid gap-3 grid-cols-3">
                                        <div>
                                            <FormControl fullWidth>
                                                <InputLabel size="small" id="demo-simple-select-label">
                                                    显示品牌名称
                                                </InputLabel>
                                                <Select
                                                    size="small"
                                                    labelId="demo-simple-select-label"
                                                    id="demo-simple-select"
                                                    // value={age}
                                                    label="Age"
                                                    // onChange={handleChange}
                                                >
                                                    <MenuItem value={10}>展示在标题开头</MenuItem>
                                                    <MenuItem value={20}>展示在标题结尾</MenuItem>
                                                </Select>
                                            </FormControl>
                                        </div>
                                        <div>
                                            <TextField
                                                size="small"
                                                label={'品牌名称'}
                                                fullWidth
                                                id="voidWord"
                                                name="voidWord"
                                                color="secondary"
                                                InputLabelProps={{ shrink: true }}
                                                value={formik.values.voidWord}
                                                onChange={formik.handleChange}
                                                error={formik.touched.voidWord && Boolean(formik.errors.voidWord)}
                                                helperText={formik.touched.voidWord && formik.errors.voidWord}
                                            />
                                        </div>
                                        <div>
                                            <FormControl fullWidth>
                                                <InputLabel size="small" id="demo-simple-select-label">
                                                    语言风格
                                                </InputLabel>
                                                <Select
                                                    size="small"
                                                    labelId="demo-simple-select-label"
                                                    id="demo-simple-select"
                                                    // value={age}
                                                    label="Age"
                                                    // onChange={handleChange}
                                                >
                                                    <MenuItem value={1}>正式</MenuItem>
                                                    <MenuItem value={2}>感性</MenuItem>
                                                    <MenuItem value={3}>鼓吹</MenuItem>
                                                    <MenuItem value={4}>有激情</MenuItem>
                                                    <MenuItem value={5}>又爆发力</MenuItem>
                                                </Select>
                                            </FormControl>
                                        </div>
                                    </Grid>
                                </Grid>
                            </form>
                        </div>
                    )}
                </Card>
            )}
            <Card className="mt-2 p-5">
                {list.map((item, index) => (
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
                                    <Divider type="vertical" />
                                    <Button color="secondary" size="small" variant="text" onClick={() => handleExpand(index)}>
                                        高分建议
                                    </Button>
                                    <Divider type="vertical" />
                                    <Rate allowHalf defaultValue={2.5} count={1} />
                                </div>
                                <div className="flex justify-center items-center">
                                    <Dropdown menu={{ items }}>
                                        <Button
                                            startIcon={<TipsAndUpdatesIcon className="!text-sm" />}
                                            color="secondary"
                                            size="small"
                                            variant="contained"
                                        >
                                            AI生成
                                        </Button>
                                    </Dropdown>
                                </div>
                            </div>
                            {expandList.includes(index) && (
                                <div className="mb-4">
                                    <Alert description={item.des} type="error" />
                                </div>
                            )}
                            <div className="flex flex-col border border-solid border-[#e6e8ec] rounded">
                                <div className="flex justify-between items-center px-4">
                                    <div className="flex items-center">
                                        <Tooltip title={'首字母大写'} arrow placement="top">
                                            <IconButton size="small">
                                                <span className="text-[#bec2cc] cursor-pointer text-xs">Aa</span>
                                            </IconButton>
                                        </Tooltip>
                                        <Tooltip title={'大写转小写'} arrow placement="top">
                                            <IconButton size="small">
                                                <span className="text-[#bec2cc] cursor-pointer text-xs">ab</span>
                                            </IconButton>
                                        </Tooltip>
                                        <Divider type="vertical" />
                                        <Tooltip title={'复制'} arrow placement="top">
                                            <IconButton size="small">
                                                <ContentCopyIcon className="text-[#bec2cc] cursor-pointer text-sm" />
                                            </IconButton>
                                        </Tooltip>
                                        <Divider type="vertical" />
                                        <Tooltip title={'撤回'} arrow placement="top">
                                            <IconButton size="small">
                                                <RefreshIcon className="text-[#bec2cc] cursor-pointer text-sm" />
                                            </IconButton>
                                        </Tooltip>
                                        <Tooltip title={'重做'} arrow placement="top">
                                            <IconButton size="small">
                                                <ReplayIcon className="text-[#bec2cc] cursor-pointer text-sm" />
                                            </IconButton>
                                        </Tooltip>
                                        <Divider type="vertical" />
                                        <span className="text-[#bec2cc] cursor-pointer text-xs">
                                            {item.character}/{item.maxCharacter}字
                                        </span>
                                        <Divider type="vertical" />
                                        <span className="text-[#bec2cc] cursor-pointer text-xs">{item.word}单词</span>
                                    </div>
                                    <div className="flex items-center">
                                        <div className="flex items-center">
                                            <span>不计入已使用</span>
                                            <Switch color={'secondary'} />
                                        </div>
                                        {item.isOvertop && (
                                            <IconButton size="small" onClick={() => handleDelFiveDescription(index)}>
                                                <DeleteIcon className=" cursor-pointer text-sm" />
                                            </IconButton>
                                        )}
                                    </div>
                                </div>
                                <textarea
                                    rows={5}
                                    ref={textareaRef}
                                    placeholder={item.placeholder}
                                    spellCheck="false"
                                    value={item.value}
                                    onChange={(e) => handleInputChange(e, index)}
                                    onInput={() => getPosition(textareaRef)}
                                    onClick={() => getPosition(textareaRef)}
                                    className="rounded-none focus:shadow-none hover:border-[#e6e8ec]  focus:border-[#e6e8ec]  border-[#e6e8ec] border-l-0 border-r-0 text-sm p"
                                />

                                <Menu style={{ position: 'absolute', left: `${x}px`, top: `${y}px` }} mode="vertical">
                                    <Menu.Item key="1" style={{ height: '30px', lineHeight: '30px', color: 'red' }}>
                                        Navigation One
                                    </Menu.Item>
                                    <Menu.Item key="2" style={{ height: '30px', lineHeight: '30px' }}>
                                        Navigation One
                                    </Menu.Item>
                                </Menu>
                                <div className="flex px-4 py-3 items-center">
                                    <div className="flex-1">
                                        <span>建议关键词:</span>
                                    </div>
                                    <HelpOutlineIcon className="text-base ml-1 cursor-pointer" />
                                </div>
                            </div>
                        </div>

                        {(item.type === ListingBuilderEnum.TITLE || item.type === ListingBuilderEnum.PRODUCT_DES) && <Divider />}
                    </>
                ))}
            </Card>
            <AiCustomModal
                open={aiCustomOpen}
                handleClose={() => {
                    setAiCustomOpen(false);
                }}
            />
        </div>
    );
};
