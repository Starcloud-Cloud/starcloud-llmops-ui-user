import {
    FormControl,
    Grid,
    Box,
    Button,
    IconButton,
    InputLabel,
    MenuItem,
    Select,
    Slider,
    Switch,
    TextField,
    Tooltip
} from '@mui/material';
import { useEffect, useRef, useState } from 'react';
import { IChatInfo } from '../index';
import HelpOutlineIcon from '@mui/icons-material/HelpOutline';
import AppModal from 'views/picture/create/Menu/appModal';
import useUserStore from 'store/user';
import { UpgradeOnlineModal } from './modal/upgradeOnline';
import { UpgradeModelModal } from './modal/upgradeModel';
import { dispatch } from 'store';
import { openSnackbar } from 'store/slices/snackbar';

const marks = [
    {
        value: 0,
        label: '最准确'
    },
    {
        value: 0.5,
        label: '较准确'
    },
    {
        value: 1,
        label: '平衡'
    },
    {
        value: 1.5,
        label: '强创造力'
    },
    {
        value: 2,
        label: '天马行空'
    }
];

const TEXT = `- Identify what language users use in questions and use the same language in your answers. \n - Use English or 中文 to answer questions based on the language of the question.`;

export const Regulation = ({
    setChatBotInfo,
    chatBotInfo,
    handleSave
}: {
    setChatBotInfo: (chatInfo: IChatInfo) => void;
    chatBotInfo: IChatInfo;
    handleSave: () => void;
}) => {
    const [regulationText, setRegulationText] = useState('');
    const [startCheck, setStartCheck] = useState(false);
    const regulationTextRef = useRef(regulationText);
    const [appOpen, setAppOpen] = useState(false);
    const [isValid, setIsValid] = useState(true);
    const [websiteCount, setWebsiteCount] = useState(0);
    const permissions = useUserStore((state) => state.permissions);
    const [openUpgradeOnline, setOpenUpgradeOnline] = useState(false);
    const [openUpgradeModel, setOpenUpgradeModel] = useState(false);

    const handleRuleValue = (type: number, value: string) => {
        if (type === 1) {
            const pattern = /- 请使用(.*)语气跟我进行对话/g;
            const matchResult = regulationText.match(pattern);
            if (matchResult) {
                if (value === '默认') {
                    // 删除
                    regulationTextRef.current = regulationText;
                    matchResult.forEach((v) => {
                        regulationTextRef.current = regulationTextRef.current.replace(`${v}\n`, '');
                        regulationTextRef.current = regulationTextRef.current.replace(v, '');
                    });
                    setRegulationText(`${regulationTextRef.current.trim()}`);
                } else {
                    // 替换
                    regulationTextRef.current = regulationText;
                    matchResult.forEach((v) => {
                        regulationTextRef.current = regulationTextRef.current.replace(`${v}\n`, '');
                        regulationTextRef.current = regulationTextRef.current.replace(v, '');
                    });
                    setRegulationText(`${regulationTextRef.current.trim()}\n${value}`);
                }
            } else {
                if (value === '默认') {
                    return;
                } else {
                    setRegulationText(`${regulationText}\n${value}`);
                }
            }
        }
        if (type === 2) {
            const pattern = /- 回复长度最好不要超过(.*)字/g;
            const matchResult = regulationText.match(pattern);
            if (matchResult) {
                if (value === '默认') {
                    // 删除
                    regulationTextRef.current = regulationText;
                    matchResult.forEach((v) => {
                        regulationTextRef.current = regulationTextRef.current.replace(`${v}\n`, '');
                        regulationTextRef.current = regulationTextRef.current.replace(v, '');
                    });
                    setRegulationText(`${regulationTextRef.current.trim()}`);
                } else {
                    // 替换
                    regulationTextRef.current = regulationText;
                    matchResult.forEach((v) => {
                        regulationTextRef.current = regulationTextRef.current.replace(`${v}\n`, '');
                        regulationTextRef.current = regulationTextRef.current.replace(v, '');
                    });
                    setRegulationText(`${regulationTextRef.current.trim()}\n${value}`);
                }
            } else {
                if (value === '默认') {
                    return;
                } else {
                    setRegulationText(`${regulationText}\n${value}`);
                }
            }
        }

        if (type === 3) {
            const pattern = /- 回复时使用(.*)进行回复/g;
            const matchResult = regulationText.match(pattern);
            const textIncludes = regulationText.includes(TEXT);
            if (matchResult || textIncludes) {
                const matchedText = matchResult || TEXT; // 提取匹配到的内容

                if (Array.isArray(matchedText)) {
                    regulationTextRef.current = regulationText;
                    matchedText.forEach((v) => {
                        regulationTextRef.current = regulationTextRef.current.replace(`${v}\n`, '');
                        regulationTextRef.current = regulationTextRef.current.replace(v, '');
                    });
                    setRegulationText(`${regulationTextRef.current.trim()}\n${value}`);
                } else {
                    // 替换
                    setRegulationText(regulationText.replace(matchedText, value));
                }
            } else {
                setRegulationText(`${regulationText}\n${value}`);
            }
        }
    };

    useEffect(() => {
        if (chatBotInfo.prePrompt) {
            setRegulationText(chatBotInfo.prePrompt);
        }
    }, [chatBotInfo]);

    // 监听修改
    useEffect(() => {
        if (regulationText) {
            setChatBotInfo({ ...chatBotInfo, prePrompt: regulationText });
        }
    }, [regulationText]);

    const emits = (data: any) => {
        setAppOpen(false);
        setRegulationText(data);
    };

    // useEffect(() => {
    //     if (chatBotInfo.searchInWeb) {
    //         const websites = chatBotInfo.searchInWeb
    //             .trim()
    //             .split('\n')
    //             .map((item) => item.trim());
    //         // 简单验证每个网站地址
    //         const isValidInput =
    //             websites.every((website) => /^(https?:\/\/)?([\w.-]+\.[a-z]{2,6})(:[0-9]{1,5})?([/\w.-]*)*\/?$/.test(website)) &&
    //             websites.length < 11;
    //         setIsValid(isValidInput);
    //         // 设置网站地址的数量
    //         setWebsiteCount(websites.length);
    //     }
    // }, [chatBotInfo.searchInWeb]);

    return (
        <div>
            <div>
                <span
                    className={
                        "before:bg-[#673ab7] before:left-0 before:top-[2px] before:content-[''] before:w-[3px] before:h-[14px] before:absolute before:ml-0.5 block text-[1.125rem] font-medium pl-[12px] relative text-black"
                    }
                >
                    基础规则
                </span>
                <div className={'mt-3'}>
                    <div className="flex items-center">
                        <span className={'text-md text-black'}>首选模型</span>
                        <Tooltip title="默认模型集成多个LLM，自动适配你的设置提供最佳回复内容。" placement="top">
                            <HelpOutlineIcon className="text-base ml-1 cursor-pointer" />
                        </Tooltip>
                    </div>
                    <div className={'mt-3'}>
                        <FormControl className="w-[280px] md:w-[310px]">
                            <InputLabel size={'small'} id="age-select">
                                选择模型
                            </InputLabel>
                            <Select
                                size={'small'}
                                id="columnId"
                                name="columnId"
                                label={'模型选择'}
                                value={chatBotInfo.modelProvider || 'GPT35'}
                                fullWidth
                                onChange={(e: any) => {
                                    if (e.target.value === 'GPT4' && !permissions.includes('chat:config:llm:gpt4')) {
                                        setOpenUpgradeModel(true);
                                        return;
                                    }
                                    if (e.target.value === 'QWEN' && !permissions.includes('chat:config:llm:qwen')) {
                                        setOpenUpgradeModel(true);
                                        return;
                                    }
                                    // 当选择了技能，选择非GPT4.0提示
                                    if (chatBotInfo.skillWorkflowList?.length && e.target.value !== 'GPT4') {
                                        dispatch(
                                            openSnackbar({
                                                open: true,
                                                message: '技能依赖于大模型4.0，请先停用技能再切换模型',
                                                variant: 'alert',
                                                alert: {
                                                    color: 'error'
                                                },
                                                close: false
                                            })
                                        );
                                        return;
                                    }

                                    setChatBotInfo({ ...chatBotInfo, modelProvider: e.target.value });
                                }}
                            >
                                <MenuItem value={'GPT35'}>大模型3.5</MenuItem>
                                <MenuItem value={'GPT4'}>大模型4.0</MenuItem>
                                <MenuItem value={'QWEN'}>通义千问</MenuItem>
                            </Select>
                        </FormControl>
                    </div>
                </div>
                <Box className={'mt-0'} display="flex" justifyContent="right">
                    <Button
                        color="secondary"
                        size="small"
                        variant="text"
                        onClick={() => {
                            setAppOpen(true);
                        }}
                    >
                        一键AI生成
                    </Button>
                </Box>
                <div>
                    <TextField
                        value={regulationText}
                        label={'角色描述'}
                        className={'mt-1'}
                        fullWidth
                        size={'small'}
                        multiline={true}
                        maxRows={18}
                        minRows={10}
                        InputLabelProps={{ shrink: true }}
                        onChange={(e) => {
                            setStartCheck(true);
                            setRegulationText(e.target.value);
                        }}
                        error={(regulationText?.length || 0) > 1000 || (startCheck && !regulationText)}
                    />
                    <div className="flex justify-between">
                        {startCheck && !regulationText ? (
                            <div className="text-[#f44336] mt-1">请输入角色描述</div>
                        ) : (
                            <div className="mt-1">机器人将根据以上内容，明确具体的职责进行回答。请尽量输入重要且精准的要求。</div>
                        )}
                        <div className="text-right text-stone-600 mr-1 mt-1">{regulationText?.length || 0}/1000</div>
                    </div>

                    <div className={'flex  items-center mt-5'}>
                        <FormControl
                            sx={{
                                width: '150px',
                                '& .Mui-focused': {
                                    background: '#f8fafc',
                                    paddingRight: '2px'
                                },
                                '& .MuiInputLabel-sizeSmall': {
                                    background: '#f8fafc',
                                    paddingRight: '2px'
                                }
                            }}
                        >
                            <InputLabel size="small" id="age-select">
                                回复语气
                            </InputLabel>
                            <Select
                                size="small"
                                id="columnId"
                                name="columnId"
                                label={'style'}
                                fullWidth
                                onChange={(e: any) => handleRuleValue(1, e.target.value)}
                            >
                                <MenuItem value="默认">默认</MenuItem>
                                <MenuItem value="- 请使用亲切语气跟我进行对话">亲切</MenuItem>
                                <MenuItem value="- 请使用可爱语气跟我进行对话">可爱</MenuItem>
                                <MenuItem value="- 请使用礼貌语气跟我进行对话">礼貌</MenuItem>
                                <MenuItem value="- 请使用严肃语气跟我进行对话">严肃</MenuItem>
                                <MenuItem value="- 请使用幽默语气跟我进行对话">幽默</MenuItem>
                            </Select>
                        </FormControl>
                        <FormControl
                            sx={{
                                width: '150px',
                                '& .Mui-focused': {
                                    background: '#f8fafc',
                                    paddingRight: '2px'
                                },
                                '& .MuiInputLabel-sizeSmall': {
                                    background: '#f8fafc',
                                    paddingRight: '2px'
                                }
                            }}
                            className={'ml-3'}
                        >
                            <InputLabel size={'small'} id="age-select">
                                最大回复长度
                            </InputLabel>
                            <Select
                                size={'small'}
                                id="columnId"
                                name="columnId"
                                label={'style'}
                                fullWidth
                                onChange={(e: any) => handleRuleValue(2, e.target.value)}
                            >
                                <MenuItem value="默认">默认</MenuItem>
                                <MenuItem value="- 回复长度最好不要超过50字">50字</MenuItem>
                                <MenuItem value="- 回复长度最好不要超过100字">100字</MenuItem>
                                <MenuItem value="- 回复长度最好不要超过200字">200字</MenuItem>
                                <MenuItem value="- 回复长度最好不要超过300字">300字</MenuItem>
                                <MenuItem value="- 回复长度最好不要超过500字">500字</MenuItem>
                            </Select>
                        </FormControl>
                        <FormControl
                            sx={{
                                width: '150px',
                                '& .Mui-focused': {
                                    background: '#f8fafc',
                                    paddingRight: '2px'
                                },
                                '& .MuiInputLabel-sizeSmall': {
                                    background: '#f8fafc',
                                    paddingRight: '2px'
                                }
                            }}
                            className={'ml-3'}
                        >
                            <InputLabel size={'small'} id="age-select">
                                回复语种
                            </InputLabel>
                            <Select
                                size={'small'}
                                id="columnId"
                                name="columnId"
                                label={'style'}
                                fullWidth
                                onChange={(e: any) => handleRuleValue(3, e.target.value)}
                            >
                                <MenuItem value={TEXT}>跟随提问</MenuItem>
                                <MenuItem value="- 回复时使用中文进行回复">始终中文</MenuItem>
                                <MenuItem value="- 回复时使用英文进行回复">始终英文</MenuItem>
                            </Select>
                        </FormControl>
                    </div>
                </div>
            </div>
            <div>
                <div className="mt-10">
                    <div>
                        <div className="flex items-start flex-col ">
                            <div className="flex items-center">
                                <span
                                    className={
                                        "before:bg-[#673ab7] before:left-0 before:top-[2px] before:content-[''] before:w-[3px] before:h-[14px] before:absolute before:ml-0.5 block text-[1.125rem] font-medium pl-[12px] relative text-black"
                                    }
                                >
                                    从互联网中学习
                                </span>
                                <Tooltip
                                    title={
                                        <div>
                                            可智能利用互联网，实时获取全网最新数据，提高精度和速度。
                                            <p> 你可以问机器人最新的信息如：</p>
                                            <p>1.今天杭州天气怎么样？</p>
                                            <p>2.帮我搜下今天苹果的新闻。</p>
                                            <p>3.帮我搜索下关于亚运会的照片。</p>
                                        </div>
                                    }
                                    placement="top"
                                >
                                    <HelpOutlineIcon className="text-base ml-1 cursor-pointer" />
                                </Tooltip>
                            </div>
                            <div className="flex justify-end items-center">
                                <span className={'text-#697586'}>{chatBotInfo.enableSearchInWeb ? '启用' : '不启用'}</span>
                                <Switch
                                    checked={!!chatBotInfo.enableSearchInWeb}
                                    onChange={(e) => {
                                        // 没有权限弹窗
                                        if (e.target.checked && !permissions.includes('chat:config:websearch')) {
                                            setOpenUpgradeOnline(true);
                                            return;
                                        }
                                        setChatBotInfo({
                                            ...chatBotInfo,
                                            enableSearchInWeb: !chatBotInfo.enableSearchInWeb
                                        });
                                    }}
                                    color="secondary"
                                />
                            </div>
                        </div>
                        {/* <div className="text-sm text-[#9da3af] ml-3">能够从互联网上收集实时信息，你可以问机器人最新最近的信息。 </div> */}
                    </div>
                    {/* {chatBotInfo.enableSearchInWeb && (
                    <>
                        <TextField
                            label={'设置网络搜索范围'}
                            className={'mt-3'}
                            fullWidth
                            error={!isValid}
                            onChange={(e) => {
                                setChatBotInfo({
                                    ...chatBotInfo,
                                    searchInWeb: e.target.value
                                });
                            }}
                            multiline
                            value={chatBotInfo.searchInWeb}
                            minRows={3}
                            size="small"
                        />
                        <div className="flex justify-between">
                            {!isValid ? (
                                <div className="text-[#f44336] mt-1">
                                    {websiteCount <= 10 ? '请输入正确的网络搜索范围' : '网址不能超过10个'}
                                </div>
                            ) : (
                                <div className="mt-1">您可以通过下面的输入框指定具体的搜索网页范围，每行一个URL，例如mofaai.com.cn</div>
                            )}
                            <div className="text-right text-stone-600 mr-1 mt-1">{websiteCount || 0}/10个</div>
                        </div>
                    </>
                )} */}
                </div>
            </div>
            <div className={'mt-5'}>
                <span
                    className={
                        "before:bg-[#673ab7] before:left-0 before:top-[7px] before:content-[''] before:w-[3px] before:h-[14px] before:absolute before:ml-0.5 block text-lg font-medium pl-[12px] relative text-black"
                    }
                >
                    高级规则
                </span>
                <div className={'mt-3'}>
                    <div className="flex items-center">
                        <span className={'text-sm text-black'}>回复内容的创造性</span>
                        <Tooltip title={'值越小同一个问题的回复相对固定，值越大回复内容越随机多样具有创造性。'} placement="top">
                            <HelpOutlineIcon className="text-base ml-1 cursor-pointer" />
                        </Tooltip>
                    </div>
                    <Grid item xs={12} container spacing={2} className="flex justify-center">
                        <Grid item className="w-[90%] pt-0 mt-[16px]">
                            <Slider
                                step={0.5}
                                valueLabelDisplay="auto"
                                min={0}
                                max={2}
                                value={chatBotInfo?.temperature || 0}
                                marks={marks}
                                onChange={(e, value) => {
                                    setChatBotInfo({
                                        ...chatBotInfo,
                                        temperature: value as number
                                    });
                                }}
                            />
                        </Grid>
                    </Grid>
                </div>
            </div>
            <Button onClick={handleSave} sx={{ mt: 3 }} color="secondary" variant="outlined">
                保存设置
            </Button>
            {appOpen && (
                <AppModal
                    title={'角色描述优化'}
                    value={regulationText}
                    open={appOpen}
                    emits={emits}
                    tags={['Chat', 'Optimize Prompt', 'Role']}
                    setOpen={setAppOpen}
                />
            )}
            <UpgradeOnlineModal open={openUpgradeOnline} handleClose={() => setOpenUpgradeOnline(false)} />
            <UpgradeModelModal open={openUpgradeModel} handleClose={() => setOpenUpgradeModel(false)} />
        </div>
    );
};
