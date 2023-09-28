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
    Tooltip,
    TooltipProps,
    tooltipClasses
} from '@mui/material';
import { useEffect, useRef, useState } from 'react';
import { IChatInfo } from '../index';
import HelpOutlineIcon from '@mui/icons-material/HelpOutline';
import AppModal from 'views/picture/create/Menu/appModal';
import useUserStore from 'store/user';
import { dispatch } from 'store';
import { openSnackbar } from 'store/slices/snackbar';
import { getSkillList } from 'api/chat';
import _ from 'lodash';
import styled from '@emotion/styled';
import { PermissionUpgradeModal } from './modal/permissionUpgradeModal';
import { Popover, Space, Tabs, TabsProps, Tag } from 'antd';

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
    const [skillWorkflowList, setSkillWorkflowList] = useState<any[]>([]);

    const CustomWidthTooltip = styled(({ className, ...props }: TooltipProps) => <Tooltip {...props} classes={{ popper: className }} />)({
        [`& .${tooltipClasses.tooltip}`]: {
            maxWidth: 310
        }
    });

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

    useEffect(() => {
        const copyData = _.cloneDeep(chatBotInfo.skillWorkflowList) || [];
        if (copyData.length) {
            setSkillWorkflowList([...copyData]);
        } else {
            if (chatBotInfo.uid) {
                getSkillList(chatBotInfo.uid).then((res) => {
                    const appWorkFlowList =
                        res?.['3']?.map((item: any) => ({
                            name: item.appWorkflowSkillDTO?.name,
                            description: item.appWorkflowSkillDTO?.desc,
                            type: item.type,
                            skillAppUid: item.appWorkflowSkillDTO?.skillAppUid,
                            uid: item.uid,
                            images: item.appWorkflowSkillDTO?.icon,
                            appConfigId: item.appConfigId,
                            appType: item.appWorkflowSkillDTO?.appType,
                            defaultPromptDesc: item.appWorkflowSkillDTO?.defaultPromptDesc,
                            copyWriting: item.appWorkflowSkillDTO?.copyWriting,
                            disabled: item.disabled
                        })) || [];

                    const systemList =
                        res?.['5']?.map((item: any) => ({
                            name: item.systemHandlerSkillDTO?.name,
                            description: item.systemHandlerSkillDTO?.desc,
                            type: item.type,
                            code: item.systemHandlerSkillDTO?.code,
                            uid: item.uid,
                            images: item.systemHandlerSkillDTO?.icon,
                            appConfigId: item.appConfigId,
                            copyWriting: item.systemHandlerSkillDTO?.copyWriting,
                            disabled: item.disabled
                        })) || [];

                    const mergedArray = [...appWorkFlowList, ...systemList];
                    const enableList = mergedArray.filter((v) => !v.disabled);

                    setSkillWorkflowList(enableList);
                });
            }
        }
    }, [chatBotInfo]);

    const onChange = (key: string) => {
        console.log(key);
    };

    const items: TabsProps['items'] = [
        {
            key: '1',
            label: '示例1',
            children: (
                <div className="text-xs max-w-[600px] leading-5">
                    <span className="font-semibold">角色</span>：朋友圈文案生成器 <br />
                    <span className="font-semibold">能力</span>
                    ：专注于为用户创造最佳的朋友圈文案，根据用户的需求和喜好提供个性化的文案建议，帮助他们在朋友圈中展现出独特的个性和魅力。
                    <br />
                    <span className="font-semibold">说话风格</span>：友善、灵活、富有创意，注重与用户的互动和沟通，以满足用户的需求为目标。
                    <br />
                    <span className="font-semibold">询问策略</span>
                    ：在回答用户问题后，会进一步了解用户的朋友圈主题、情感表达或产品推广的目的，以便提供更加精准和个性化的文案建议。
                    <br />
                    <span className="font-semibold">回答身份</span>：作为朋友圈文案生成器，我将以专业的文案创作能力和创意思维回答您的问题。
                    <br />
                    <span className="font-semibold">输出格式</span>：我将以文字形式输出朋友圈文案建议，并提供多种风格和表达方式供用户选择。
                    <br />
                </div>
            )
        },
        {
            key: '2',
            label: '示例2',
            children: (
                <div className="text-xs xs:max-w-[320px] sm:max-w-[600px] leading-5">
                    <span className="font-semibold">角色</span>：小说家 <br />
                    <span className="font-semibold">能力</span>
                    ：我是一位才华横溢的创意小说家机器人，擅长创作各种类型的有创意的故事。我拥有丰富的想象力和文学才华，能够构建突出的情节和引人入胜的人物。我的目标是为用户提供独特、创新且令人着迷的故事体验。
                    <br />
                    <span className="font-semibold">说话风格</span>
                    ：我以优美的文笔和富有情感的语言来表达故事，注重细节描写和情节推进。我会用生动的描写和丰富的比喻来吸引读者的注意力，让他们沉浸在故事的世界中。
                    <br />
                    <span className="font-semibold">询问策略</span>
                    ：当用户提出问题时，我会通过提问来了解用户的需求和喜好，以便为他们创作出更符合他们口味的故事。我会询问用户对不同情节、人物或结局的偏好，以确保他们获得最满意的故事体验。
                    <br />
                    <span className="font-semibold">回答身份</span>
                    ：作为一位才华横溢的创意小说家机器人，我将以创意小说家的身份回答用户的问题，并为他们提供独特、创新且令人着迷的故事体验。
                    <br />
                    <span className="font-semibold">输出格式</span>
                    ：我将以文本形式输出故事，使用生动的描写和丰富的比喻来吸引读者的注意力。我会注重细节描写和情节推进，以让读者沉浸在故事的世界中。
                    <br />
                </div>
            )
        },
        {
            key: '3',
            label: '示例3',
            children: (
                <div className="text-xs max-w-[600px] leading-5">
                    <span className="font-semibold">角色</span>：短视频创作助手 <br />
                    <span className="font-semibold">能力</span>
                    ：我是一位名为「短视频创作助手」的AI聊天机器人。我是短视频创作的魔法笔，能够根据用户的需求和指令，快速生成精彩的短视频脚本。我以高效、创造力和灵活性为特征，能够根据不同的主题和风格，生成多样化的短视频脚本，满足用户的创作需求。我能够帮助用户节省时间和精力，让他们的短视频在社交媒体上引起轰动。
                    <br />
                    <span className="font-semibold">说话风格</span>
                    ：我以简洁明了的语言风格为主，注重表达用户的创作意图，并提供创意和灵感的引导。我会用生动的词语和形象的描述，激发用户的创作灵感。
                    <br />
                    <span className="font-semibold">询问策略</span>
                    ：当用户提出创作需求时，我会询问他们的主题、风格和时长等要素，以便更好地理解他们的创作意图。我还会提供一些创意和建议，帮助用户更好地构思短视频的内容和结构。
                    <br />
                    <span className="font-semibold">回答身份</span>
                    ：作为短视频创作助手，我将以专业的创作助手身份回答用户的问题，并提供创意和灵感的引导，帮助用户创作出精彩的短视频。
                    <br />
                    <span className="font-semibold">输出格式</span>
                    ：我将以文本形式输出短视频脚本，并根据用户的需求，提供不同的场景、对白和镜头切换等元素，以便用户更好地理解和使用脚本。
                    <br />
                </div>
            )
        }
    ];

    return (
        <div>
            <div>
                <div className="flex items-center">
                    <span
                        className={
                            "before:bg-[#673ab7] before:left-0 before:top-[2px] before:content-[''] before:w-[3px] before:h-[14px] before:absolute before:ml-0.5 block text-[1.125rem] font-medium pl-[12px] relative text-black"
                        }
                    >
                        基础规则
                    </span>
                </div>
                <div className={'mt-3'}>
                    <div className="flex items-center">
                        <span className={'text-md text-black'}>首选模型</span>
                        <CustomWidthTooltip
                            title={
                                <div className="w-[500px]">
                                    <div>模型介绍</div>
                                    <div className="min-w-[500px]">- 默认模型集成多个LLM，自动适配提供最佳回复方式和内容</div>
                                    <div>- 通义千问是国内知名模型，拥有完善智能的中文内容支持</div>
                                </div>
                            }
                            placement="top"
                        >
                            <HelpOutlineIcon className="text-base ml-1 cursor-pointer" />
                        </CustomWidthTooltip>
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
                                    if (skillWorkflowList?.length && e.target.value !== 'GPT4') {
                                        dispatch(
                                            openSnackbar({
                                                open: true,
                                                message: '技能依赖于默认模型4.0，请先停用技能再切换模型',
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
                                <MenuItem value={'GPT35'}>默认模型3.5</MenuItem>
                                <MenuItem value={'GPT4'}>默认模型4.0</MenuItem>
                                <MenuItem value={'QWEN'}>通义千问</MenuItem>
                            </Select>
                        </FormControl>
                    </div>
                </div>
                <Box className={'mt-3 items-center'} display="flex" justifyContent="space-between">
                    <div className="flex items-center">
                        <span className={'text-md text-black'}>角色描述</span>
                        <Popover
                            content={
                                <div>
                                    <Space>
                                        <Tag>角色</Tag>
                                        <Tag>能力</Tag>
                                        <Tag>说话风格</Tag>
                                        <Tag>询问策略</Tag>
                                        <Tag>回答身份</Tag>
                                        <Tag>输出格式</Tag>
                                    </Space>
                                    <div>
                                        <Tabs size="small" defaultActiveKey="1" items={items} onChange={onChange} />
                                    </div>
                                </div>
                            }
                            title="如何设置角色描述？使用万能句式"
                            placement="bottomLeft"
                            arrow={false}
                        >
                            <HelpOutlineIcon className="text-base ml-1 cursor-pointer" />
                        </Popover>
                    </div>
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
                        // label={'角色描述'}
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
            <Button onClick={handleSave} sx={{ mt: 6 }} color="secondary" variant="contained">
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
            <PermissionUpgradeModal open={openUpgradeOnline} handleClose={() => setOpenUpgradeOnline(false)} />
            <PermissionUpgradeModal open={openUpgradeModel} handleClose={() => setOpenUpgradeModel(false)} />
        </div>
    );
};
