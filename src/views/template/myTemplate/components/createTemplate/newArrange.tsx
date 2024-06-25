import { Box, Typography, TextField, IconButton, Tooltip, Accordion, AccordionSummary, AccordionDetails } from '@mui/material';
import { Image, Dropdown, Popover, Switch, Spin } from 'antd';
import { VerticalAlignTopOutlined, VerticalAlignBottomOutlined, CopyOutlined, DeleteOutlined, InfoCircleOutlined } from '@ant-design/icons';
import { BorderColor, AddCircleSharp, South, ExpandMore, MoreVert, Error, Add } from '@mui/icons-material';
import { t } from 'hooks/web/useI18n';
import { stepList } from 'api/template';
import { dispatch } from 'store';
import { openSnackbar } from 'store/slices/snackbar';
import StepEdit from './stepEdit';
import { useState, useEffect, memo, useMemo } from 'react';
import _ from 'lodash-es';
function Arrange({
    detail,
    config,
    variableStyle,
    editChange,
    basisChange,
    statusChange,
    changeConfigs,
    getTableData,
    tableCopy,
    tableDataDel,
    tableDataMove
}: any) {
    //增加节点
    const [expanded, setExpanded] = useState<any[]>([]);
    //步骤名称编辑
    const [editStatus, setEditStatus] = useState<any[]>([]);
    //步骤描述编辑
    const [descStatus, setDescStatus] = useState<any[]>([]);
    //删除步骤
    const delStep = (index: number) => {
        tableDataDel(index);
        const newValue = _.cloneDeep(config);
        newValue.steps.splice(index, 1);
        changeConfigs(newValue);
    };
    //复制步骤
    const copyStep = (step: any, index: number) => {
        tableCopy(index);
        const newStep = _.cloneDeep(step);
        beforeCopy(index, newStep.name, newStep, config.steps);
    };
    const beforeCopy = (index: number, name: string, newStep: any, steps: any) => {
        if (steps.some((item: { name: string }) => item.name === name + '-copy')) {
            beforeCopy(index, name + '-copy', newStep, steps);
        } else {
            const Name = _.cloneDeep(newStep);
            Name.name = name + '-copy';
            Name.field = name + '-copy';
            const newValue = _.cloneDeep(config);
            newValue.steps.splice(index + 1, 0, Name);
            changeConfigs(newValue);
        }
    };
    //移动步骤
    const stepMove = (index: number, direction: number) => {
        tableDataMove({ index, direction });
        const newData = _.cloneDeep(config);
        const temp = newData?.steps[index];
        newData.steps[index] = newData?.steps[index + direction];
        newData.steps[index + direction] = temp;
        changeConfigs(newData);
        setPre(pre + 1);
    };
    //增加步骤
    const [stepOpen, setStepOpen] = useState<any[]>([]);
    const [stepLists, setStepList] = useState<any[]>([]);
    const stepEtch = (index: number, name: string, steps: any, newStep: any, i: number) => {
        if (steps.some((item: { name: string }) => item.name === name + index)) {
            stepEtch(index + 1, name, steps, newStep, i);
        } else {
            const Name = _.cloneDeep(newStep);
            Name.name = Name.name + index;
            Name.field = Name.field + index;
            const newValue = _.cloneDeep(config);
            newValue.steps.splice(i + 1, 0, Name);
            changeConfigs(newValue);
            let newVal = [...expanded];
            newVal = newVal.map(() => false);
            newVal[i + 1] = true;
            setExpanded(newVal);
        }
    };
    const addStep = (step: any, index: number) => {
        const newList = _.cloneDeep(stepOpen);
        newList[index] = false;
        setStepOpen(newList);
        getTableData({ step, index });
        const newStep = _.cloneDeep(step);
        if (newStep?.flowStep?.handler === 'PosterActionHandler') {
            newStep?.variable?.variables?.forEach((item: any) => {
                if (item?.field === 'POSTER_STYLE_CONFIG' && item.value) {
                    item.value = JSON.parse(item.value);
                }
            });
            newStep?.flowStep?.variable?.variables?.forEach((item: any) => {
                if (item?.field === 'SYSTEM_POSTER_STYLE_CONFIG' && item.value) {
                    item.value = JSON.parse(item.value);
                }
            });
        }
        stepEtch(index + 1, newStep.name, config.steps, newStep, index);
    };
    const [pre, setPre] = useState(0);
    useEffect(() => {
        stepList(detail?.type).then((res) => {
            setStepList(res);
        });
    }, [detail?.type]);
    const getImage = (data: string) => {
        let image: string = '';
        try {
            image = require('../../../../../assets/images/carryOut/' + data + '.svg');
        } catch (errr) {
            image = '';
        }
        return image;
    };
    const upHandler = useMemo(() => {
        return (
            config?.steps
                ?.find((item: any) => item.flowStep.handler === 'MaterialActionHandler')
                ?.variable?.variables?.find((el: any) => el.field === 'BUSINESS_TYPE')?.value || 'default'
        );
    }, [config?.steps]);

    const [loading, setLoading] = useState(true);
    useEffect(() => {
        setTimeout(() => {
            setLoading(false);
        }, 300);
    }, []);
    if (loading) {
        return (
            <div className="w-full h-[calc(100vh-300px)] flex justify-center items-center">
                <Spin />
            </div>
        );
    }
    return (
        <Box>
            <Typography variant="h5" fontSize="1rem" mb={1}>
                {t('myApp.flow')}
            </Typography>
            {config?.steps?.map((item: any, index: number) => (
                <div key={item?.field}>
                    {index !== 0 && (
                        <div className="flex justify-center my-4">
                            <South />
                        </div>
                    )}
                    <Accordion
                        key={item?.flowStep?.handler}
                        className="before:border-none !m-0 border border-solid border-black/20 rounded-lg"
                    >
                        <AccordionSummary
                            className="p-0 !min-h-0 !h-[70px] bg-black/10"
                            sx={{
                                '& .Mui-expanded': {
                                    m: '0 !important'
                                },
                                '& .MuiAccordionSummary-content': {
                                    m: '0 !important'
                                },
                                '& .Mui-expanded .aaa': {
                                    transition: 'transform 0.4s',
                                    transform: 'rotate(0deg)'
                                }
                            }}
                        >
                            <div className="w-full flex justify-between items-center">
                                <div className="flex gap-2 items-center flex-1">
                                    <div className="w-[24px]">
                                        <ExpandMore className="aaa -rotate-90" />
                                    </div>
                                    <Image
                                        preview={false}
                                        style={{ width: '25px', height: '25px' }}
                                        src={getImage(item.flowStep.icon)}
                                        fallback="data:image/png;base64,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"
                                        alt="svg"
                                    />
                                    <div className="w-full flex flex-col justify-center">
                                        {editStatus[index] ? (
                                            <TextField
                                                color="secondary"
                                                onBlur={(e) => {
                                                    const newValue = _.cloneDeep(editStatus);
                                                    newValue[index] = false;
                                                    setEditStatus(newValue);
                                                    if (e.target.value) {
                                                        editChange({
                                                            num: index,
                                                            label: 'name',
                                                            value: e.target.value,
                                                            flag: true
                                                        });
                                                    }
                                                }}
                                                name="name"
                                                className="w-[200px]"
                                                autoFocus
                                                defaultValue={item?.name}
                                                variant="standard"
                                            />
                                        ) : (
                                            <div className="flex items-center">
                                                <div className="font-bold text-[16px] whitespace-nowrap">{item.name}</div>
                                                <Tooltip placement="top" title={t('market.editName')}>
                                                    <IconButton
                                                        onClick={(e) => {
                                                            const newList = _.cloneDeep(editStatus);
                                                            newList[index] = true;
                                                            setEditStatus(newList);
                                                            e.stopPropagation();
                                                        }}
                                                        size="small"
                                                    >
                                                        <BorderColor fontSize="small" />
                                                    </IconButton>
                                                </Tooltip>
                                            </div>
                                        )}
                                        {descStatus[index] ? (
                                            <TextField
                                                className="h-[30px]"
                                                color="secondary"
                                                onBlur={(e) => {
                                                    const newValue = _.cloneDeep(descStatus);
                                                    newValue[index] = false;
                                                    setDescStatus(newValue);
                                                    if (e.target.value) {
                                                        editChange({
                                                            num: index,
                                                            label: e.target.name,
                                                            value: e.target.value
                                                        });
                                                    }
                                                }}
                                                autoFocus
                                                name="description"
                                                fullWidth
                                                defaultValue={item.description}
                                                variant="standard"
                                            />
                                        ) : (
                                            <div className="flex items-center">
                                                <div className="max-w-[500px] text-xs text-black/50 line-clamp-1">{item.description}</div>
                                                <Tooltip placement="top" title={'编辑步骤描述'}>
                                                    <IconButton
                                                        onClick={(e) => {
                                                            const newList = _.cloneDeep(descStatus);
                                                            newList[index] = true;
                                                            setDescStatus(newList);
                                                            e.stopPropagation();
                                                        }}
                                                        size="small"
                                                    >
                                                        <BorderColor fontSize="small" />
                                                    </IconButton>
                                                </Tooltip>
                                            </div>
                                        )}
                                    </div>
                                </div>
                                {item?.flowStep?.handler !== 'MaterialActionHandler' &&
                                    item?.flowStep?.handler !== 'PosterActionHandler' &&
                                    item?.flowStep?.handler !== 'AssembleActionHandler' && (
                                        <Dropdown
                                            placement="bottom"
                                            menu={{
                                                items: [
                                                    {
                                                        key: '1',
                                                        label: ' 向上',
                                                        disabled:
                                                            index === 1 ||
                                                            config?.steps[index - 1]?.flowStep.handler === 'VariableActionHandler',
                                                        icon: <VerticalAlignTopOutlined rev={undefined} />
                                                    },
                                                    {
                                                        key: '2',
                                                        label: ' 向下',
                                                        disabled:
                                                            config?.steps?.length - 3 === index ||
                                                            item.flowStep.handler === 'VariableActionHandler',

                                                        icon: <VerticalAlignBottomOutlined rev={undefined} />
                                                    },
                                                    {
                                                        key: '3',
                                                        label: ' 复制',
                                                        disabled: item.flowStep.handler === 'VariableActionHandler',
                                                        icon: <CopyOutlined rev={undefined} />
                                                    },
                                                    {
                                                        key: '4',
                                                        label: '删除',
                                                        icon: <DeleteOutlined rev={undefined} />
                                                    }
                                                ],
                                                onClick: (e: any) => {
                                                    switch (e.key) {
                                                        case '1':
                                                            stepMove(index, -1);
                                                            break;
                                                        case '2':
                                                            stepMove(index, 1);
                                                            break;
                                                        case '3':
                                                            copyStep(item, index);
                                                            break;
                                                        case '4':
                                                            delStep(index);
                                                            break;
                                                    }
                                                    e.domEvent.stopPropagation();
                                                }
                                            }}
                                            trigger={['click']}
                                        >
                                            <IconButton size="small" onClick={(e) => e.stopPropagation()}>
                                                <MoreVert />
                                            </IconButton>
                                        </Dropdown>
                                    )}
                            </div>
                        </AccordionSummary>
                        <AccordionDetails>
                            <StepEdit
                                detail={detail}
                                variableStyle={variableStyle}
                                index={index}
                                variable={item?.variable?.variables}
                                upHandler={upHandler}
                                syszanVariable={
                                    item?.flowStep?.variable?.variables?.find((item: any) => item.field === 'SYSTEM_POSTER_STYLE_CONFIG')
                                        ?.value
                                }
                                setVariable={(data: any, flag?: boolean) => {
                                    const newData = _.cloneDeep(config);
                                    if (flag) {
                                        newData.steps.find(
                                            (i: any) => i.flowStep.handler === 'PosterActionHandler'
                                        ).flowStep.variable.variables = data;
                                        console.log(newData);
                                    } else {
                                        newData.steps[index].variable.variables = data;
                                    }
                                    changeConfigs(newData);
                                }}
                                variables={item?.flowStep?.variable?.variables}
                                fields={item?.fields}
                                handler={item?.flowStep?.handler}
                                basisChange={basisChange}
                                resReadOnly={item?.flowStep?.response?.readOnly}
                                resType={item?.flowStep?.response?.type}
                                resJsonSchema={item?.flowStep?.response?.output?.jsonSchema}
                            />
                        </AccordionDetails>
                    </Accordion>
                    {(index !== 0 || config?.steps[1]?.flowStep.handler !== 'VariableActionHandler') &&
                        config?.steps?.length - 1 !== index &&
                        config?.steps?.length - 2 !== index && (
                            <>
                                <div className="flex justify-center my-4">
                                    <div className="h-[20px] w-[2px] bg-black/80"></div>
                                </div>
                                <Popover
                                    open={stepOpen[index]}
                                    placement="bottom"
                                    trigger={'click'}
                                    onOpenChange={(open: boolean) => {
                                        const newList = _.cloneDeep(stepOpen);
                                        newList[index] = open;
                                        setStepOpen(newList);
                                    }}
                                    content={
                                        <div className="lg:w-[700px] md:w-[80%] flex gap-2 flex-wrap">
                                            {stepLists
                                                ?.filter((item) => {
                                                    if (index === 0) {
                                                        return (
                                                            item.flowStep.handler !== 'MaterialActionHandler' &&
                                                            item.flowStep.handler !== 'PosterActionHandler' &&
                                                            item.flowStep.handler !== 'AssembleActionHandler'
                                                        );
                                                    } else {
                                                        return (
                                                            item.flowStep.handler !== 'MaterialActionHandler' &&
                                                            item.flowStep.handler !== 'PosterActionHandler' &&
                                                            item.flowStep.handler !== 'AssembleActionHandler' &&
                                                            item.flowStep.handler !== 'VariableActionHandler'
                                                        );
                                                    }
                                                })
                                                ?.map((el) => (
                                                    <div
                                                        key={el?.field}
                                                        onClick={() => {
                                                            if (
                                                                index === 0 &&
                                                                el.flowStep.handler === 'VariableActionHandler' &&
                                                                config?.steps?.find(
                                                                    (i: any) => i.flowStep.handler === 'VariableActionHandler'
                                                                )
                                                            ) {
                                                                dispatch(
                                                                    openSnackbar({
                                                                        open: true,
                                                                        message: '全局变量已经存在',
                                                                        variant: 'alert',
                                                                        alert: {
                                                                            color: 'error'
                                                                        },
                                                                        anchorOrigin: {
                                                                            vertical: 'top',
                                                                            horizontal: 'center'
                                                                        },
                                                                        close: false
                                                                    })
                                                                );
                                                            } else {
                                                                addStep(el, index);
                                                            }
                                                        }}
                                                        className="!w-[calc(50%-0.25rem)] flex gap-2 items-center hover:shadow-md cursor-pointer p-2 rounded-md"
                                                    >
                                                        <div className="border border-solid border-[rgba(76,76,102,.1)] rounded-lg p-2 ">
                                                            <Image
                                                                preview={false}
                                                                width={40}
                                                                height={40}
                                                                src={getImage(el?.flowStep?.icon)}
                                                                fallback="data:image/png;base64,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"
                                                                alt="svg"
                                                            />
                                                        </div>
                                                        <div className="flex justify-between gap-2 flex-col">
                                                            <div className="text-[16px] font-bold">{el?.name}</div>
                                                            <div className="text-xs text-black/50 line-clamp-3">{el.description}</div>
                                                        </div>
                                                    </div>
                                                ))}
                                        </div>
                                    }
                                >
                                    <div className="flex justify-center cursor-pointer">
                                        <AddCircleSharp color="secondary" />
                                    </div>
                                </Popover>
                            </>
                        )}
                </div>
            ))}
        </Box>
    );
}
const arePropsEqual = (prevProps: any, nextProps: any) => {
    return (
        JSON.stringify(prevProps?.config?.steps) === JSON.stringify(nextProps?.config?.steps) &&
        JSON.stringify(prevProps?.detail?.type) === JSON.stringify(nextProps?.detail?.type)
    );
};
export default memo(Arrange, arePropsEqual);
