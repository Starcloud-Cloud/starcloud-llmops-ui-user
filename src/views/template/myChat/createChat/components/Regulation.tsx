import { FormControl, Grid, InputLabel, MenuItem, Select, Slider, TextField } from '@mui/material';
import { useEffect, useState } from 'react';
import { IChatInfo } from '../index';

const marks = [
    {
        value: 0.4,
        label: '最准确'
    },
    {
        value: 0.8,
        label: '较准确'
    },
    {
        value: 1.2,
        label: '平衡'
    },
    {
        value: 1.6,
        label: '强创造力'
    },
    {
        value: 2.0,
        label: '天马行空'
    }
];

export const Regulation = ({ setChatBotInfo, chatBotInfo }: { setChatBotInfo: (chatInfo: IChatInfo) => void; chatBotInfo: IChatInfo }) => {
    const [regulationText, setRegulationText] = useState('');

    const handleRuleValue = (type: number, value: string) => {
        if (type === 1) {
            const pattern = /请使用(.*)语气跟我进行对话/;
            const matchResult = regulationText.match(pattern);
            if (matchResult) {
                const matchedText = matchResult[0]; // 提取匹配到的内容
                if (value === '默认') {
                    // 删除
                    setRegulationText(regulationText.replace(matchedText, ''));
                } else {
                    // 替换
                    setRegulationText(regulationText.replace(matchedText, value));
                }
            } else {
                setRegulationText(`${regulationText} \n ${value}`);
            }
        }
        if (type === 2) {
            const pattern = /回复长度最好不要超过(.*)字/;
            const matchResult = regulationText.match(pattern);
            if (matchResult) {
                const matchedText = matchResult[0]; // 提取匹配到的内容
                if (value === '默认') {
                    // 删除
                    setRegulationText(regulationText.replace(matchedText, ''));
                } else {
                    // 替换
                    setRegulationText(regulationText.replace(matchedText, value));
                }
            } else {
                setRegulationText(`${regulationText} \n ${value}`);
            }
        }
        if (type === 3) {
            const pattern = /回复时使用(.*)进行回复/;
            const matchResult = regulationText.match(pattern);
            const textIncludes = regulationText.includes(
                '- Identify what language users use in questions and use the same language in your answers. - Use English or 中文 to answer questions based on the language of the question.'
            );
            console.log(textIncludes, 'textIncludes');
            if (matchResult || textIncludes) {
                const matchedText =
                    matchResult?.[0] ||
                    '- Identify what language users use in questions and use the same language in your answers. - Use English or 中文 to answer questions based on the language of the question.'; // 提取匹配到的内容
                if (value === '默认') {
                    // 删除
                    setRegulationText(regulationText.replace(matchedText, ''));
                } else {
                    // 替换
                    setRegulationText(regulationText.replace(matchedText, value));
                }
            } else {
                setRegulationText(`${regulationText} \n ${value}`);
            }
        }
    };

    useEffect(() => {
        if (regulationText) {
            setChatBotInfo({ ...chatBotInfo, prePrompt: regulationText });
        }
    }, [regulationText]);

    return (
        <div>
            <div>
                <span
                    className={
                        "before:bg-[#673ab7] before:left-0 before:top-[7px] before:content-[''] before:w-[3px] before:h-[14px] before:absolute before:ml-0.5 block text-lg font-medium pl-[12px] relative text-black"
                    }
                >
                    基础规则
                </span>
                <div className={'mt-5'}>
                    <TextField
                        value={chatBotInfo.prePrompt}
                        label={'角色描述'}
                        className={'mt-1'}
                        fullWidth
                        size={'small'}
                        multiline={true}
                        maxRows={10}
                        minRows={10}
                        InputLabelProps={{ shrink: true }}
                        onChange={(e) => setRegulationText(e.target.value)}
                        helperText="机器人将根据以上内容，明确自己的具体职责，请尽量输入重要且精准的要求。"
                    />
                    <div className={'flex  items-center mt-3'}>
                        <FormControl sx={{ width: '150px' }}>
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
                                <MenuItem value="请使用亲切语气跟我进行对话">亲切</MenuItem>
                                <MenuItem value="请使用可爱语气跟我进行对话">可爱</MenuItem>
                                <MenuItem value="请使用礼貌语气跟我进行对话">礼貌</MenuItem>
                                <MenuItem value="请使用严肃语气跟我进行对话">严肃</MenuItem>
                                <MenuItem value="请使用幽默语气跟我进行对话">幽默</MenuItem>
                            </Select>
                        </FormControl>
                        <FormControl sx={{ width: '150px' }} className={'ml-3'}>
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
                                <MenuItem value="回复长度最好不要超过50字">50字</MenuItem>
                                <MenuItem value="回复长度最好不要超过100字">100字</MenuItem>
                                <MenuItem value="回复长度最好不要超过200字">200字</MenuItem>
                                <MenuItem value="回复长度最好不要超过300字">300字</MenuItem>
                                <MenuItem value="回复长度最好不要超过500字">500字</MenuItem>
                            </Select>
                        </FormControl>
                        <FormControl sx={{ width: '150px' }} className={'ml-3'}>
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
                                <MenuItem
                                    value={`- Identify what language users use in questions and use the same language in your answers. - Use English or 中文 to answer questions based on the language of the question.`}
                                >
                                    跟随提问
                                </MenuItem>
                                <MenuItem value="回复时使用中文进行回复">始终中文</MenuItem>
                                <MenuItem value="回复时使用英文进行回复">始终英文</MenuItem>
                            </Select>
                        </FormControl>
                    </div>
                </div>
            </div>
            <div className={'mt-10'}>
                <span
                    className={
                        "before:bg-[#673ab7] before:left-0 before:top-[7px] before:content-[''] before:w-[3px] before:h-[14px] before:absolute before:ml-0.5 block text-lg font-medium pl-[12px] relative text-black"
                    }
                >
                    高级规则
                </span>
                <div className={'mt-3'}>
                    <span className={'text-base text-black'}>回复多样性</span>
                    <Grid item xs={12} container spacing={2} className="flex justify-center">
                        <Grid item className="w-[90%]">
                            <Slider
                                defaultValue={0.4}
                                step={0.4}
                                valueLabelDisplay="off"
                                min={0.4}
                                max={2}
                                value={chatBotInfo?.temperature || 0.4}
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
        </div>
    );
};
