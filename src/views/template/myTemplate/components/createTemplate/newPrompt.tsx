import { Box, Typography, Switch, Tooltip, Chip, FormControlLabel } from '@mui/material';
import { Popover } from 'antd';
import ErrorIcon from '@mui/icons-material/Error';
import { Input } from 'antd';
import { useRef, useState, useEffect, memo } from 'react';
import { t } from 'hooks/web/useI18n';
import _ from 'lodash-es';
import ExePrompt from 'views/pages/copywriting/components/spliceCmponents/exePrompt';
const NewPrompt = ({
    el,
    handler,
    dictList,
    variable,
    fields,
    index,
    i,
    variables,
    basisChange
}: {
    el: any;
    handler?: string;
    dictList?: any[];
    variable: any[];
    fields: any;
    index: number;
    i: number;
    variables: any[];
    basisChange: any;
}) => {
    const { TextArea } = Input;
    const iptRef = useRef<any | null>(null);
    const [prompt, setPrompt] = useState<undefined | string>('');
    const setPrompts = (data: any) => {
        setPrompt(data.target.value);
    };
    const changePrompt = (field: string, i: number, exclude = false) => {
        const newVal = _.cloneDeep(variables);
        const part1 = newVal[i].value.slice(0, iptRef?.current?.resizableTextArea?.textArea?.selectionStart);
        const part2 = newVal[i].value.slice(iptRef?.current?.resizableTextArea?.textArea?.selectionStart);
        if (exclude) {
            newVal[i].value = `${part1}${field}${part2}`;
        } else {
            newVal[i].value =
                handler === 'OpenAIChatActionHandler' ? `${part1}{STEP.${fields}.${field}}${part2}` : `${part1}{{${field}}}${part2}`;
        }
        basisChange({ e: { name: 'prompt', value: newVal[i].value }, index, i, flag: false, values: true });
    };
    useEffect(() => {
        setPrompt(variables?.find((item: any) => item.field === 'prompt')?.value);
    }, [variables?.find((item: any) => item.field === 'prompt')?.value]);
    // const promptmessage = useMemo(()=>{
    //     console.log(11111111);
    //     variable?.map(item=>{
    //         prompt.
    //     })

    // },[prompt])
    return (
        <div>
            <Box display="flex" justifyContent="space-between" alignItems="center">
                <Box display="flex" alignItems="center">
                    <Typography mr={1} variant="h5">
                        {t('market.' + el.field)}
                    </Typography>
                    <Tooltip placement="top" title={t('market.promptDesc')}>
                        <ErrorIcon fontSize="small" />
                    </Tooltip>
                </Box>
                <Box>
                    <FormControlLabel
                        label="是否显示"
                        control={
                            <Switch
                                name="promptisShow"
                                onChange={(e) => {
                                    basisChange({ e: e.target, index, i, flag: true });
                                }}
                                checked={el.isShow}
                            />
                        }
                    />
                </Box>
            </Box>
            <div className="relative mt-[16px]">
                <TextArea
                    status={!el.value ? 'error' : ''}
                    ref={iptRef}
                    style={{ height: '400px' }}
                    value={prompt}
                    name={el.field}
                    onChange={(e) => setPrompts(e)}
                    onBlur={(e) => basisChange({ e: e.target, index, i, flag: false, values: true })}
                />
                {/* <div className="border border-solid border-black w-[400px] h-[300px] rounded-lg p-4" contentEditable={true}></div> */}
                <ExePrompt
                    type="prompt_template"
                    changePrompt={(data) => {
                        changePrompt(data, i, true);
                    }}
                />
            </div>
            {!el.value ? (
                <span className="text-[12px] text-[#f44336] mt-[5px] ml-[5px]">{'Prompt 必填'}</span>
            ) : (
                <span className="text-[12px] mt-[5px] ml-[5px]">{el.description}</span>
            )}
            <Box mb={1}>
                {variable?.map((item) => (
                    <Popover
                        key={item.field}
                        placement="top"
                        content={
                            <div>
                                <div className="flex justify-center mb-1 font-bold">{item.label}</div>
                                <div>点击变量，增加到提示词中</div>
                            </div>
                        }
                    >
                        <Chip
                            sx={{ mr: 1, mt: 1 }}
                            size="small"
                            color="primary"
                            onClick={() => changePrompt(item.field, i)}
                            label={item.label}
                        ></Chip>
                    </Popover>
                    // <Tooltip key={item.field} placement="top" title={'点击变量，增加到提示词中'}>
                    //     <Chip
                    //         sx={{ mr: 1, mt: 1 }}
                    //         size="small"
                    //         color="primary"
                    //         onClick={() => changePrompt(item.field, i)}
                    //         label={item.field}
                    //     ></Chip>
                    // </Tooltip>
                ))}
            </Box>
        </div>
    );
};
const arePropsEqual = (prevProps: any, nextProps: any) => {
    return (
        JSON.stringify(prevProps?.el) === JSON.stringify(nextProps?.el) &&
        JSON.stringify(prevProps?.variable) === JSON.stringify(nextProps?.variable) &&
        JSON.stringify(prevProps?.dictList) === JSON.stringify(nextProps?.dictList)
    );
};
export default memo(NewPrompt, arePropsEqual);
