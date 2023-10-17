import { Button, Card, IconButton, LinearProgress, Switch, Tooltip } from '@mui/material';
import TipsAndUpdatesIcon from '@mui/icons-material/TipsAndUpdates';
import ContentCopyIcon from '@mui/icons-material/ContentCopy';
import RefreshIcon from '@mui/icons-material/Refresh';
import ReplayIcon from '@mui/icons-material/Replay';
import { Input, Alert, Divider, Statistic, ConfigProvider, Rate, Dropdown, MenuProps, Menu } from 'antd';
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
import { AddAiModal } from '../AddAiModal/index';
import copy from 'clipboard-copy';
import { dispatch } from 'store';
import { openSnackbar } from 'store/slices/snackbar';
import KeyWordTag from '../KeyWordTag';
import { getCaretPosition } from 'utils/getCaretPosition';
import { DEFAULT_LIST } from '../../../data/index';
import { setPaymentCard } from '../../../../../../store/slices/cart';

const { Search } = Input;

// 首字母转换为大写
function capitalizeFirstLetterOfEachWord(str: string): string {
    const words = str.split(' ');
    const capitalizedWords = words.map((word) => {
        return word.charAt(0).toUpperCase() + word.slice(1);
    });
    return capitalizedWords.join(' ');
}

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
    row: number;
};

export const Content = () => {
    const [list, setList] = React.useState<ListType[]>(DEFAULT_LIST);
    const [expandList, setExpandList] = React.useState<number[]>([]);
    const [enableAi, setEnableAi] = React.useState(true);
    const [assistOpen, setAssistOpen] = React.useState(false);
    const [aiCustomOpen, setAiCustomOpen] = React.useState(false);
    const [x, setX] = React.useState(0);
    const [y, setY] = React.useState(0);

    const handleInputChange = (e: any, index: number) => {
        const { x, y } = getCaretPosition(e.target);
        setX(x);
        setY(y);
        const copyList = _.cloneDeep(list);
        copyList[index].value = e.target.value;
        copyList[index].character = e.target.value.length;
        copyList[index].word = e.target.value.trim() === '' ? 0 : e.target.value.trim().split(' ').length;
        setList(copyList);
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
            row: 4
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

    return (
        <div>
            <Card className="h-[350px] rounded-t-none flex justify-center flex-col p-5">
                <div className="grid grid-cols-2 gap-2 w-full">
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
                <div className="grid grid-cols-3 gap-3 w-full">
                    <div className="flex  items-center w-full flex-col">
                        <div className="mt-2  w-full">
                            <span className="font-semibold">Best Practices</span>
                            <div className="w-full mt-1">
                                <div className="flex justify-between items-center">
                                    <span>Title Does not contain symbols or emojis</span>
                                    {true ? (
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
                        </div>
                    </div>
                </div>
            </Card>
            <Card className="p-5 mt-2">
                <div className="flex justify-end">
                    {/* <div className="flex items-center">
                        <span>AI模式</span>
                        <Switch color={'secondary'} onChange={handleChange} checked={enableAi} />
                    </div> */}
                    <div className="flex items-center">
                        <Search className="w-[400px]" placeholder="输入ASIN，一键获取亚马逊Listing内容" enterButton="获取Listing" />
                        {/* <Button startIcon={<ArrowDownwardIcon className="!text-sm" />} color="secondary" size="small" variant="contained">
                            导入Listing
                        </Button> */}
                        <div className="ml-2">
                            <Button
                                startIcon={<TipsAndUpdatesIcon className="!text-sm" />}
                                color="secondary"
                                size="small"
                                variant="contained"
                                onClick={() => setAssistOpen(true)}
                            >
                                AI生成
                            </Button>
                        </div>
                    </div>
                </div>
            </Card>
            {/* {enableAi && (
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
            )} */}
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
                                        <Divider type="vertical" />
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
                                        <span className="text-[#bec2cc]  text-xs">
                                            {item.character}/{item.maxCharacter}字
                                        </span>
                                        <Divider type="vertical" />
                                        <span className="text-[#bec2cc] text-xs">{item.word}单词</span>
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
                                    rows={item.row}
                                    placeholder={item.placeholder}
                                    spellCheck="false"
                                    value={item.value}
                                    onChange={(e) => handleInputChange(e, index)}
                                    className="border-[#e6e8ec] border-l-0 border-r-0 text-sm"
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
                                    <div className="flex-1 flex items-center">
                                        <span className="mr-2">建议关键词:</span>
                                        <KeyWordTag />
                                    </div>
                                    <HelpOutlineIcon className="text-base ml-1 cursor-pointer" />
                                </div>
                            </div>
                        </div>

                        {(item.type === ListingBuilderEnum.TITLE || item.type === ListingBuilderEnum.PRODUCT_DES) && <Divider />}
                    </>
                ))}
            </Card>
            <AddAiModal
                open={assistOpen}
                handleClose={() => {
                    setAssistOpen(false);
                }}
            />
            <AiCustomModal
                open={aiCustomOpen}
                handleClose={() => {
                    setAiCustomOpen(false);
                }}
            />
        </div>
    );
};
