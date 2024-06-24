import { Modal, Button, Image, Tooltip, Dropdown, Switch, Row, Col, Popover } from 'antd';
import {
    SettingOutlined,
    VerticalAlignTopOutlined,
    VerticalAlignBottomOutlined,
    CopyOutlined,
    DeleteOutlined,
    InfoCircleOutlined
} from '@ant-design/icons';
import { Accordion, AccordionSummary, IconButton, AccordionDetails } from '@mui/material';
import { ExpandMore, MoreVert, AddCircleSharp, South } from '@mui/icons-material';
import { dispatch } from 'store';
import { openSnackbar } from 'store/slices/snackbar';
import MarketForm from '../../../template/components/marketForm';
import Forms from '../../smallRedBook/components/form';
import _ from 'lodash-es';
const SettingModal = ({
    settingOpen,
    setSettingOpen,
    saveStep,
    appData,
    stepMove,
    stepOpen,
    materialStatus,
    materialTypeStatus,
    setStepOpen,
    advanced,
    advanceds,
    addStep,
    copyStep,
    delStep,
    setEditOpens,
    setTitles,
    stepMaterial,
    setMaterialTypes,
    setStep,
    changeForm,
    changeSwitch,
    stepLists,
    changeForms
}: {
    settingOpen: boolean;
    setSettingOpen: (data: boolean) => void;
    saveStep: () => void;
    appData: any;
    stepMove: (item: any, index: number) => void;
    stepOpen: any[];
    materialStatus: string;
    materialTypeStatus: boolean;
    setStepOpen: (data: any) => void;
    advanced: (data: any, index: number) => void;
    addStep: (el: any, index: number) => void;
    copyStep: (item: any, index: number) => void;
    delStep: (index: number) => void;
    advanceds: (data: any, index: number) => void;
    setEditOpens: any;
    setTitles: (data: any) => void;
    stepMaterial: any;
    setMaterialTypes: (data: any) => void;
    setStep: (data: number) => void;
    changeForm: (e: any, item: any, index: number, i: number) => void;
    changeSwitch: () => void;
    stepLists: any[];
    changeForms: (data: any, index: number, de: number) => void;
}) => {
    const getImage = (data: string) => {
        let image: string = '';
        try {
            image = require('../../../../assets/images/carryOut/' + data + '.svg');
        } catch (errr) {
            image = '';
        }
        return image;
    };
    return (
        <Modal width={'80%'} className="relative" open={settingOpen} onCancel={() => setSettingOpen(false)} footer={false}>
            <div
                style={{
                    backgroundImage: `radial-gradient(circle, rgba(0, 0, 0, 0.1) 10%, transparent 10%)`,
                    backgroundSize: '10px 10px',
                    backgroundRepeat: 'repeat',
                    scrollbarGutter: 'stable'
                }}
                className="h-[80vh] overflow-y-auto"
            >
                <div className=" bg-white w-full flex items-center justify-between pl-4 pr-14 absolute top-[15px] right-[0px]">
                    <div className="text-[16px] font-[600]">编辑步骤</div>
                    <Button onClick={saveStep} type="primary">
                        保存
                    </Button>
                </div>
                <div className="flex justify-center mt-6">
                    <div className="2xl:w-[1000px] xl:w-[820px] lg:w-[740px]  w-[100%]">
                        {appData?.configuration?.appInformation?.workflowConfig?.steps?.map((item: any, index: number) => (
                            <div key={index}>
                                {index !== 0 && (
                                    <div className="flex justify-center my-4">
                                        <South />
                                    </div>
                                )}
                                <Accordion
                                    expanded={
                                        item?.flowStep?.handler === 'MaterialActionHandler' ||
                                        item?.flowStep?.handler === 'PosterActionHandler'
                                            ? false
                                            : undefined
                                    }
                                    key={item?.flowStep?.handler}
                                    onChange={(e) => {
                                        if (
                                            item?.flowStep?.handler === 'MaterialActionHandler' ||
                                            item?.flowStep?.handler === 'PosterActionHandler'
                                        ) {
                                            dispatch(
                                                openSnackbar({
                                                    open: true,
                                                    message: '该节点请在外部编辑',
                                                    variant: 'alert',
                                                    alert: {
                                                        color: 'error'
                                                    },
                                                    anchorOrigin: { vertical: 'top', horizontal: 'center' },
                                                    close: false
                                                })
                                            );
                                        }
                                    }}
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
                                            <div className="flex gap-2 items-center">
                                                <div className="w-[24px]">
                                                    {item?.flowStep?.handler !== 'MaterialActionHandler' &&
                                                        item?.flowStep?.handler !== 'PosterActionHandler' && (
                                                            <ExpandMore className="aaa -rotate-90" />
                                                        )}
                                                </div>
                                                <Image
                                                    preview={false}
                                                    style={{ width: '25px', height: '25px' }}
                                                    src={getImage(item.flowStep.icon)}
                                                    fallback="data:image/png;base64,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"
                                                    alt="svg"
                                                />
                                                <div className="font-bold text-[16px]">{item.name}</div>
                                            </div>
                                            <div className="flex gap-2">
                                                {item?.flowStep?.handler === 'VariableActionHandler' && (
                                                    <div className="flex justify-end">
                                                        <Tooltip title="高级配置">
                                                            <IconButton
                                                                onClick={(e) => {
                                                                    advanced(item, index);
                                                                    e.stopPropagation();
                                                                }}
                                                                size="small"
                                                            >
                                                                <SettingOutlined rev={undefined} />
                                                            </IconButton>
                                                        </Tooltip>
                                                    </div>
                                                )}
                                                {item?.flowStep?.handler !== 'MaterialActionHandler' &&
                                                    item?.flowStep?.handler !== 'PosterActionHandler' &&
                                                    item?.flowStep?.handler !== 'AssembleActionHandler' &&
                                                    item?.flowStep?.handler !== 'VariableActionHandler' && (
                                                        <Tooltip title="高级配置">
                                                            <IconButton
                                                                onClick={(e) => {
                                                                    advanceds(item, index);
                                                                    e.stopPropagation();
                                                                }}
                                                                size="small"
                                                            >
                                                                <SettingOutlined rev={undefined} />
                                                            </IconButton>
                                                        </Tooltip>
                                                    )}
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
                                                                            appData?.configuration?.appInformation?.workflowConfig?.steps[
                                                                                index - 1
                                                                            ]?.flowStep.handler === 'VariableActionHandler',
                                                                        icon: <VerticalAlignTopOutlined rev={undefined} />
                                                                    },
                                                                    {
                                                                        key: '2',
                                                                        label: ' 向下',
                                                                        disabled:
                                                                            appData?.configuration?.appInformation?.workflowConfig?.steps
                                                                                ?.length -
                                                                                3 ===
                                                                                index || item.flowStep.handler === 'VariableActionHandler',

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
                                                {item?.flowStep?.handler === 'MaterialActionHandler' && (
                                                    <div className="flex gap-2 items-center mr-4">
                                                        <div>
                                                            <span>拼图生成模式</span>
                                                            <Tooltip
                                                                title="方便批量上传图片，图片会随机放在 图片风格模版中进行生成
(当素材只有一个图片类型的字段的时候可开启此功能)"
                                                            >
                                                                <InfoCircleOutlined className="cursor-pointer" rev={undefined} />
                                                            </Tooltip>
                                                        </div>
                                                        <Switch
                                                            checked={materialStatus === 'default' ? false : true}
                                                            disabled={!materialTypeStatus}
                                                            onChange={(e, event) => {
                                                                changeSwitch();
                                                                event.stopPropagation();
                                                            }}
                                                        />
                                                    </div>
                                                )}
                                            </div>
                                        </div>
                                    </AccordionSummary>
                                    {index !== 0 && index !== appData?.configuration?.appInformation?.workflowConfig?.steps?.length - 1 && (
                                        <AccordionDetails>
                                            <div key={item.field}>
                                                <div className="text-xs text-black/50 mb-4">{item?.description}</div>

                                                {item?.flowStep?.handler !== 'VariableActionHandler' ? (
                                                    item?.variable?.variables?.map((el: any, i: number) => (
                                                        <div key={el.field}>
                                                            {el?.isShow && (
                                                                <MarketForm
                                                                    key={el.field}
                                                                    item={el}
                                                                    materialType={''}
                                                                    details={
                                                                        appData?.configuration?.appInformation ||
                                                                        appData?.executeParam?.appInformation
                                                                    }
                                                                    stepCode={item?.field}
                                                                    model={''}
                                                                    handlerCode={item?.flowStep?.handler}
                                                                    history={false}
                                                                    promptShow={true}
                                                                    setEditOpen={setEditOpens}
                                                                    setTitle={setTitles}
                                                                    setStep={() => setStep(index)}
                                                                    columns={stepMaterial[index - 1]}
                                                                    setMaterialType={() => {
                                                                        setMaterialTypes(
                                                                            item?.variable?.variables?.find(
                                                                                (i: any) => i.field === 'MATERIAL_TYPE'
                                                                            )?.value
                                                                        );
                                                                    }}
                                                                    onChange={(e: any) => {
                                                                        changeForm(e, item, index, i);
                                                                    }}
                                                                />
                                                            )}
                                                        </div>
                                                    ))
                                                ) : (
                                                    <Row gutter={10}>
                                                        {item?.variable?.variables?.map((item: any, de: number) => (
                                                            <Col key={item?.field} span={24}>
                                                                <Forms
                                                                    item={item}
                                                                    index={de}
                                                                    changeValue={(data: any) => {
                                                                        changeForms(data, index, de);
                                                                    }}
                                                                    flag={false}
                                                                />
                                                            </Col>
                                                        ))}
                                                    </Row>
                                                )}
                                            </div>
                                        </AccordionDetails>
                                    )}
                                </Accordion>
                                {(index !== 0 ||
                                    appData?.configuration?.appInformation?.workflowConfig?.steps[1]?.flowStep.handler !==
                                        'VariableActionHandler') &&
                                    appData?.configuration?.appInformation?.workflowConfig?.steps?.length - 1 !== index &&
                                    appData?.configuration?.appInformation?.workflowConfig?.steps?.length - 2 !== index && (
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
                                                                    onClick={() => {
                                                                        if (
                                                                            index === 0 &&
                                                                            el.flowStep.handler === 'VariableActionHandler' &&
                                                                            appData?.configuration?.appInformation?.workflowConfig?.steps?.find(
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
                                                                        <div className="text-xs text-black/50 line-clamp-3">
                                                                            {el.description}
                                                                        </div>
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
                    </div>
                </div>
            </div>
        </Modal>
    );
};
export default SettingModal;
