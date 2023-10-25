import {
    Button,
    Card,
    IconButton,
    LinearProgress,
    Switch,
    Tooltip,
    Grid,
    TextField,
    FormControl,
    InputLabel,
    Select,
    MenuItem,
    Divider as MuiDivider
} from '@mui/material';
import TipsAndUpdatesIcon from '@mui/icons-material/TipsAndUpdates';
import ContentCopyIcon from '@mui/icons-material/ContentCopy';
import RefreshIcon from '@mui/icons-material/Refresh';
import ReplayIcon from '@mui/icons-material/Replay';
import { Input, Alert, Divider, Rate, Dropdown, MenuProps, Menu, FloatButton, Tag } from 'antd';
import HelpOutlineIcon from '@mui/icons-material/HelpOutline';
import React from 'react';
import TuneIcon from '@mui/icons-material/Tune';
import { useFormik } from 'formik';
import * as yup from 'yup';
import { AiCustomModal } from '../AiCustomModal';
import AddIcon from '@mui/icons-material/Add';
import _ from 'lodash';
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
import { getListingByAsin } from 'api/listing/build';

const { Search } = Input;

// 首字母转换为大写
function capitalizeFirstLetterOfEachWord(str: string): string {
    const words = str.split(' ');
    const capitalizedWords = words.map((word) => {
        return word.charAt(0).toUpperCase() + word.slice(1);
    });
    return capitalizedWords.join(' ');
}

const Content = () => {
    const [expandList, setExpandList] = React.useState<number[]>([]);

    const [assistOpen, setAssistOpen] = React.useState(true);
    const [aiCustomOpen, setAiCustomOpen] = React.useState(false);
    const [scoreList, setScoreList] = React.useState(SCORE_LIST);
    const [x, setX] = React.useState(0);
    const [y, setY] = React.useState(0);
    const [openKeyWordSelect, setOpenKeyWordSelect] = React.useState(false);
    const [keyWordSelectList, setKeyWordSelectList] = React.useState<any[]>([]);
    const [hoverKey, setHoverKey] = React.useState(0);
    const [currentInputIndex, setCurrentInputIndex] = React.useState(0);
    const [editIndex, setEditIndex] = React.useState(0);

    const { list, setList, enableAi, setEnableAi, keywordHighlight, detail, country } = useListing();

    const ulRef = React.useRef<any>(null);
    const hoverKeyRef = React.useRef<any>(null);

    // 设置头部分数
    React.useEffect(() => {
        const scoreListDefault = SCORE_LIST;
        if (detail?.itemScore) {
            scoreListDefault[0].list[0].value = detail.itemScore.withoutSpecialChat;
            scoreListDefault[0].list[1].value = detail.itemScore.titleLength;
            scoreListDefault[0].list[2].value = detail.itemScore.titleUppercase;

            scoreListDefault[1].list[0].value = detail.itemScore.fiveDescLength;
            scoreListDefault[1].list[1].value = detail.itemScore.allUppercase;
            scoreListDefault[1].list[2].value = detail.itemScore.partUppercase;

            scoreListDefault[2].list[0].value = detail.itemScore.productLength;
            scoreListDefault[2].list[1].value = detail.itemScore.withoutUrl;

            scoreListDefault[3].list[0].value = detail.itemScore.searchTermLength;
            setScoreList(scoreListDefault);
        }
    }, [detail]);

    React.useEffect(() => {
        if (openKeyWordSelect) {
            // 绑定键盘事件
            const handleKeyDown = (e: any) => {
                const { key } = e;
                if (key === 'ArrowUp' || key === 'ArrowDown') {
                    e.preventDefault(); // 防止滚动页面
                    const newIndex = key === 'ArrowUp' ? Math.max(0, hoverKey - 1) : Math.min(keyWordSelectList.length - 1, hoverKey + 1);
                    setHoverKey(newIndex);
                    hoverKeyRef.current = newIndex;
                } else if (key === 'Enter') {
                    e.preventDefault(); // 防止滚动页面
                    if (hoverKeyRef.current !== undefined) {
                        handleReplaceValue(keyWordSelectList[hoverKeyRef.current || 0]);
                    }
                }
            };

            document.addEventListener('keydown', handleKeyDown);
            // 在组件卸载时解绑键盘事件
            return () => {
                document.removeEventListener('keydown', handleKeyDown);
            };
        }
    }, [openKeyWordSelect]);

    const handleReplaceValue = (selectValue: string) => {
        const newList = [...list];
        const preValue = newList[editIndex].value;
        const modifiedString = preValue?.slice(0, currentInputIndex - 1) + selectValue + preValue?.slice(currentInputIndex + 1);
        newList[editIndex] = {
            ...newList[editIndex],
            value: modifiedString,
            character: modifiedString.length,
            word: modifiedString.trim() === '' ? 0 : modifiedString.trim().split(' ').length
        };
        setList(newList);
        setOpenKeyWordSelect(false);
        setHoverKey(0);
        hoverKeyRef.current = 0;
    };

    const handleHasKeyWork = (e: any, keyword: string[]) => {
        const startIndex = e.target.selectionStart;
        setCurrentInputIndex(startIndex);
        const value = e.target.value;
        // TODO 字符同样
        if (startIndex === 1 || value[startIndex - 2] === ' ') {
            const filterKeyWord = keyword.filter((item, index) => {
                if (item.includes(value[startIndex - 1])) {
                    return item;
                }
            });
            if (filterKeyWord.length > 0) {
                setKeyWordSelectList([...filterKeyWord]);
                const { x, y } = getCaretPosition(e.target);
                setX(x);
                setY(y);
                setOpenKeyWordSelect(true);
            } else {
                setOpenKeyWordSelect(false);
            }
        } else {
            setOpenKeyWordSelect(false);
        }
    };

    const handleInputChange = React.useCallback((e: any, index: number, keyword: string[]) => {
        const newKeyword = keyword.map((v: any) => v.keyword) || [];
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
            return newList;
        });
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

    // 所搜
    const handleSearch = async (value: any) => {
        // const res = await getListingByAsin({
        //     asin: value,
        //     marketName: country.key
        // });
        const res = {
            market: 'GLOBAL',
            asin: 'B08RYQR1CJ',
            imgUrls: [
                'https://images-na.ssl-images-amazon.com/images/I/41Jj+ixqgFL.jpg',
                'https://images-na.ssl-images-amazon.com/images/I/41HoSBUctCL.jpg',
                'https://images-na.ssl-images-amazon.com/images/I/51CATaXh+ZL.jpg',
                'https://images-na.ssl-images-amazon.com/images/I/41RIFOzGg0L.jpg',
                'https://images-na.ssl-images-amazon.com/images/I/318E3Iwxe+L.jpg',
                'https://images-na.ssl-images-amazon.com/images/I/41TlyeP9kmL.jpg',
                'https://images-na.ssl-images-amazon.com/images/I/51tqGaEVYzL.jpg',
                'https://images-na.ssl-images-amazon.com/images/I/41HNbEScSSL.jpg'
            ],
            title: 'Makeup Bag Portable Travel Cosmetic Bag for Women, Beauty Zipper Makeup Organizer PU Leather Washable Waterproof (Pink)',
            features: [
                '✅【WATERPROOF MATERIAL】 Cosmetic case made of high-quality PU leather material, the surface is waterproof and washable, easy to clean; no worries for leakage when traveling',
                '✅【LIGHT WEIGHT & ROOMY】 9 x 6 x 4.5 inch; this makeup bag is light-weighted and perfect for holding all kinds of beauty essentials, enough to hold everything securely you need for your travel',
                '✅【UNIQUE DESIGN】 Makeup bag with wide durable handle and sturdy zipper, portable and easy to carry; can be used as a make up organizer, toiletry wash bag, pencil case and daily handbag. Suitable for outdoor, business trip, camping, travel, gym room, indoor, house-held storage',
                '✅【VERSATILE MAKEUP BAG】Ideal for travel, business trip, vacation, gym, camping, toiletry organization and outdoor activity; its a functional makeup bag, cosmetic bag, travel organizer bag',
                '✅【SERVICE GUARANTEE】Please feel free to contact us whenever you meet any problem; we provide lifetime warranty and customer service'
            ],
            description: null
        };
        let copyList: any[] = _.cloneDeep(list);
        copyList[0].value = res.title;
        const productIndex = copyList.findIndex((item) => item.type === ListingBuilderEnum.PRODUCT_DES);
        copyList[productIndex].value = res.description;
        res.features?.forEach((item, index) => {
            copyList[index + 1].value = item;
        });
        setList(copyList);
    };

    return (
        <div>
            <Card className="rounded-t-none flex justify-center flex-col p-3" title={list?.[0]?.value || 'Listing草稿'}>
                <div className="text-lg font-bold py-1">Listing优化</div>
                <div className="grid xl:grid-cols-2 xs:grid-cols-1 gap-2 w-full">
                    <div className="bg-[#f4f6f8] p-4 rounded-md">
                        <div className="flex flex-col items-center w-full">
                            <div className="flex justify-between items-center w-full">
                                <span className="text-lg font-semibold">Listing Quality Score</span>
                                <Tooltip title={'这是一条广告'} placement="top" arrow>
                                    <HelpOutlineIcon className="text-lg font-semibold ml-1 cursor-pointer" />
                                </Tooltip>
                            </div>
                            <div className="flex justify-between items-end w-full mt-10">
                                <span className="text-2xl font-semibold">8.8</span>
                                <span className="text-base">/10</span>
                            </div>

                            <LinearProgress
                                variant="determinate"
                                value={80}
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
                                <span className="text-lg font-semibold">Listing Quality Score</span>
                                <Tooltip title={'这是一条广告'} placement="top" arrow>
                                    <HelpOutlineIcon className="text-lg font-semibold ml-1 cursor-pointer" />
                                </Tooltip>
                            </div>
                            <div className="flex justify-between items-end w-full mt-10">
                                <span className="text-2xl font-semibold">8.8</span>
                                <span className="text-base">/10</span>
                            </div>

                            <LinearProgress
                                variant="determinate"
                                value={80}
                                className="w-full"
                                sx={{
                                    height: '8px',
                                    borderRadius: '8px'
                                }}
                            />
                        </div>
                    </div>
                </div>
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
                                                {!v.value ? (
                                                    <svg
                                                        className="h-[14px] w-[14px]"
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
                                                        className="h-[14px] w-[14px]"
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
                                            </div>
                                        </div>
                                        <MuiDivider />
                                    </>
                                ))}
                            </div>
                        </div>
                    ))}
                </div>
            </Card>
            <Card className="p-5 mt-2">
                <div className="flex justify-between flex-[30%] flex-wrap">
                    <div className="flex items-center">
                        <span>AI模式</span>
                        <Switch color={'secondary'} onChange={handleChange} checked={enableAi} />
                    </div>
                    <div className="flex items-center justify-end flex-[70%]">
                        <Search
                            onSearch={handleSearch}
                            className="lg:w-full xl:w-[70%]"
                            placeholder="输入ASIN，一键获取亚马逊Listing内容"
                            enterButton="获取Listing"
                        />
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
                                    <Grid sx={{ mt: 1 }} item className="w-full">
                                        <TextField
                                            size="small"
                                            fullWidth
                                            label={'*产品特征'}
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
                                    <Grid sx={{ mt: 2 }} item className="w-full">
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
                                    <Grid sx={{ mt: 2 }} item className="w-full">
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
                                    </Grid>
                                    <Grid sx={{ mt: 2 }} item className="grid gap-3 grid-cols-3 w-full">
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
                                            <FormControl fullWidth>
                                                <InputLabel size="small" id="demo-simple-select-label">
                                                    语言
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
                                        <div>
                                            <FormControl fullWidth>
                                                <InputLabel size="small" id="demo-simple-select-label">
                                                    风格
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
                                    <Grid sx={{ mt: 2, textAlign: 'center' }} item md={12}>
                                        <Button
                                            startIcon={<TipsAndUpdatesIcon className="!text-sm" />}
                                            color="secondary"
                                            size="small"
                                            variant="contained"
                                            onClick={() => setAssistOpen(true)}
                                            className="w-[300px]"
                                        >
                                            AI生成(消耗x点)
                                        </Button>
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
                                    <Divider type="vertical" style={{ marginInline: '4px' }} />
                                    <Rate allowHalf defaultValue={item.grade} count={1} disabled />
                                    <Divider type="vertical" style={{ marginInline: '4px' }} />
                                    <Button color="secondary" size="small" variant="text" onClick={() => handleExpand(index)}>
                                        高分建议
                                    </Button>
                                </div>
                                <div className="flex justify-center items-center">
                                    {enableAi &&
                                        ((item.type === ListingBuilderEnum.FIVE_DES && index === 1) ||
                                            item.type === ListingBuilderEnum.TITLE ||
                                            item.type === ListingBuilderEnum.PRODUCT_DES ||
                                            item.type === ListingBuilderEnum.SEARCH_WORD) && (
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
                                        )}
                                </div>
                            </div>
                            {expandList.includes(index) && (
                                <div className="mb-4">
                                    <Alert description={item.des} type="error" />
                                </div>
                            )}
                            <div className="flex flex-col border border-solid border-[#e6e8ec] rounded">
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
                                <FiledTextArea
                                    rows={item.row}
                                    placeholder={item.placeholder}
                                    value={item.value}
                                    handleInputChange={(e: any) => handleInputChange(e, index, detail?.keywordMetaData)}
                                    highlightWordList={item.keyword}
                                    highlightAllWordList={detail?.keywordMetaData || []}
                                    index={index}
                                    type={item.type}
                                />
                                <div className="flex px-4 py-3 items-center">
                                    <div className="flex-1 flex items-center">
                                        <span className="mr-2 flex items-center">
                                            建议关键词:
                                            <div className="ml-2 flex items-center">
                                                {item.keyword.map((itemKeyword, index) => (
                                                    <div
                                                        key={index}
                                                        className={`${
                                                            keywordHighlight
                                                                ?.flat()
                                                                ?.filter((item) => item !== undefined)
                                                                .find((itemKeyH) => itemKeyH.text === itemKeyword.text)?.num
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
                        {detail?.keywordResume?.map((item: string, keyWordItemKey: number) => (
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
        </div>
    );
};

export default React.memo(Content);
