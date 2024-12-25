import { TextField, MenuItem } from '@mui/material';
import { useState, memo, useEffect, useRef } from 'react';
import { Table, Button, Modal, Upload, UploadProps, Progress, Radio, Checkbox, Image, Select, Input, Tooltip, Popover } from 'antd';
import { PlusOutlined, ContainerOutlined, ArrowsAltOutlined, ExclamationCircleOutlined } from '@ant-design/icons';
import { t } from 'i18next';
import _ from 'lodash-es';
import { v4 as uuidv4 } from 'uuid';
import { getAccessToken } from 'utils/auth';
import { verifyJSON, changeJSONValue } from './validaForm';
import VariableInput from 'views/pages/batchSmallRedBooks/components/variableInput';
import { materialImport, materialResilt, materialExport, executeTest, detailPrompt } from 'api/redBook/batchIndex';
import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd';
import { origin_url } from 'utils/axios/config';
import Can from './can';
import { useLocation } from 'react-router-dom';
import { dispatch } from 'store';
import { openSnackbar } from 'store/slices/snackbar';

function FormExecute({
    item,
    details = undefined,
    onChange,
    pre,
    materialType,
    variables,
    stepCode,
    model,
    handlerCode,
    columns = [],
    setEditOpen,
    setTitle,
    setStep,
    setMaterialType,
    history,
    materialValue,
    materialList,
    stepIndex,
    usePrompt,
    setUsePromptValue
}: any) {
    const location = useLocation();
    const query = new URLSearchParams(location.search);
    const mt = {
        marginTop: 2
    };
    const [value, setValue] = useState(false);
    useEffect(() => {
        if (pre) {
            setValue(true);
        }
    }, [pre]);

    const [fileList, setFileList] = useState<any[]>([]);
    //上传图片
    const props: UploadProps = {
        name: 'image',
        multiple: true,
        listType: 'picture-card',
        fileList,
        action: `${origin_url}${process.env.REACT_APP_API_URL}/llm/creative/plan/uploadImage`,
        headers: {
            Authorization: 'Bearer ' + getAccessToken()
        },
        maxCount: 500,
        onChange(info) {
            setFileList(info.fileList);
            if (info.fileList?.every((item) => item.status !== 'uploading')) {
                onChange({
                    name: item.field,
                    value: info.fileList
                        // ?.filter((item) => item.status === 'done')
                        ?.map((item) => ({ pictureUrl: item?.response?.data?.url, type: 'picture' }))
                });
            }
        },
        // onPreview: (file) => {
        //     setpreviewImage(file?.response?.data?.url);
        //     setOpen(true);
        // },
        onDrop(e) {
            console.log('Dropped files', e.dataTransfer.files);
        }
    };
    useEffect(() => {
        if (materialType === 'picture' && item?.style === 'MATERIAL')
            setFileList(
                item?.value?.map((item: any) => {
                    return {
                        uid: uuidv4(),
                        thumbUrl: item?.pictureUrl,
                        response: {
                            data: {
                                url: item?.pictureUrl
                            }
                        }
                    };
                }) || []
            );
    }, []);

    const [tableLoading, setTableLoading] = useState(false);
    //上传素材弹框
    const [uploadOpen, setUploadOpen] = useState(false);
    const [parseUid, setParseUid] = useState(''); //上传之后获取的 uid

    //模拟上传进度
    const [uploadLoading, setUploadLoading] = useState(false);
    const perRef = useRef<number>(0);
    const [percent, setPercent] = useState(0);
    const timer1: any = useRef(null);
    const props1: UploadProps = {
        showUploadList: false,
        accept: '.zip,.rar',
        beforeUpload: async (file, fileList) => {
            setUploadLoading(true);
            try {
                const result = await materialImport({ file });
                perRef.current = 100;
                setPercent(perRef.current);
                setTableLoading(true);
                setUploadOpen(false);
                setParseUid(result?.data);
                setUploadLoading(false);
                return false;
            } catch (error) {
                console.error('Error uploading file:', error);
                setUploadLoading(false);
            }
        }
    };
    useEffect(() => {
        if (uploadLoading) {
            timer1.current = setInterval(() => {
                if (percent < 100) {
                    perRef.current += 30;
                    setPercent(perRef.current);
                }
            }, 20);
        } else {
            clearInterval(timer1.current);
            setPercent(0);
        }
    }, [uploadLoading]);

    //下载模板
    const handleDownLoad = async () => {
        const res = await materialExport(materialType);
        const downloadLink = document.createElement('a');
        downloadLink.href = window.URL.createObjectURL(res);
        downloadLink.download = materialType + '.zip';
        document.body.appendChild(downloadLink);
        downloadLink.click();
        document.body.removeChild(downloadLink);
    };
    //获取导入结果
    const timer: any = useRef(null);
    const getImportResult = () => {
        clearInterval(timer.current);
        timer.current = setInterval(() => {
            materialResilt(parseUid).then((result) => {
                if (result?.complete) {
                    setTableLoading(false);
                    clearInterval(timer.current);
                    const res = result?.materialList;
                    onChange({ name: item.field, value: res });
                }
            });
        }, 2000);
    };
    useEffect(() => {
        if (parseUid) {
            getImportResult();
        }
        return () => {
            clearInterval(timer.current);
        };
    }, [parseUid]);

    //文本框
    const [open, setOpen] = useState(false);
    const onDragEnd = (result: any) => {
        if (!result.destination) return;
        let values: any = _.cloneDeep(item.value);
        if (result.source.index < result.destination.index) {
            values?.splice(result.destination.index + 1, 0, { type: 'note', pictureUrl: result.draggableId });
            values?.splice(result.source.index, 1);
        }
        if (result.source.index > result.destination.index) {
            values?.splice(result.source.index, 1);
            values?.splice(result.destination.index, 0, { type: 'note', pictureUrl: result.draggableId });
        }
        onChange({ name: item?.field, value: values });
    };

    // flowStepCode === 'CustomActionHandler'
    const [customOpen, setCustomOpen] = useState(false);
    const [customLoading, setCustomLoading] = useState(false);
    const [customTitle, setCustomTitle] = useState('');

    const [canOpen, setCanOpen] = useState(false);

    const promptRef = useRef('');
    const [customValue, setCustomValue] = useState('');
    const [promptValue, setPromptValue] = useState('');
    const [useModel, setUseModel] = useState('GPT35');
    const [promptContent, setPromptContent] = useState<any>(null);

    const promptExe = async () => {
        const newData = _.cloneDeep(details);
        newData.workflowConfig.steps
            .find((i: any) => i.field === stepCode)
            .variable.variables.find((i: any) => item.field === i.field).value = customValue;
        newData.workflowConfig.steps
            .find((_: any, i: number) => i === stepIndex + 1)
            .flowStep.variable.variables.find((i: any) => i.field === 'model').value = useModel;
        setCustomLoading(true);
        try {
            const res: any = await executeTest({
                aiModel: useModel,
                appReqVO: newData,
                stepId: stepCode,
                source: query.get('appUid') ? 'MARKET' : 'APP',
                appUid: query.get('appUid') || query.get('uid')
            });
            promptRef.current = '';
            setPromptValue('');
            const reader = res.getReader();
            const textDecoder = new TextDecoder();
            let outerJoins: any;
            let appConversationUid = '';
            while (1) {
                let joins = outerJoins;
                const { done, value } = await reader.read();
                if (done) {
                    setCustomLoading(false);
                    detailPrompt({ appConversationUid }).then((res) => {
                        setPromptContent(res);
                    });
                    break;
                }
                let str = textDecoder.decode(value);
                const lines = str.split('\n');
                lines.forEach((message, i: number) => {
                    if (i === 0 && joins) {
                        message = joins + message;
                        joins = undefined;
                    }
                    if (i === lines.length - 1) {
                        if (message && message.indexOf('}') === -1) {
                            joins = message;
                            return;
                        }
                    }
                    let bufferObj;
                    if (message?.startsWith('data:')) {
                        bufferObj = message.substring(5) && JSON.parse(message.substring(5));
                    }
                    if (bufferObj?.code === 200 && bufferObj.type !== 'ads-msg') {
                        appConversationUid = bufferObj.conversationUid;
                        promptRef.current += bufferObj.content;
                        setPromptValue(promptRef.current);
                    } else if (bufferObj?.code === 200 && bufferObj.type === 'ads-msg') {
                        dispatch(
                            openSnackbar({
                                open: true,
                                message: bufferObj.content,
                                variant: 'alert',
                                alert: {
                                    color: 'success'
                                },
                                anchorOrigin: { vertical: 'top', horizontal: 'center' },
                                close: false
                            })
                        );
                    } else if (bufferObj && bufferObj.code !== 200 && bufferObj.code !== 300900000) {
                        dispatch(
                            openSnackbar({
                                open: true,
                                message: bufferObj?.content || t('market.warning'),
                                variant: 'alert',
                                alert: {
                                    color: 'error'
                                },
                                anchorOrigin: { vertical: 'top', horizontal: 'center' },
                                close: false
                            })
                        );
                    }
                });
            }
        } catch (err) {
            setCustomLoading(false);
        }
    };
    useEffect(() => {
        if (!customOpen) {
            setPromptValue('');
        }
    }, [customOpen]);
    useEffect(() => {
        if (handlerCode === 'CustomActionHandler') {
            setCustomValue(item.value);
        }
    }, []);
    const canRef = useRef<any>();
    const setData = (data: string) => {
        let newValue = _.cloneDeep(item.value);
        if (!newValue) {
            newValue = '';
        }
        const part1 = newValue.slice(0, canRef.current?.resizableTextArea?.textArea?.selectionStart);
        const part2 = newValue.slice(canRef.current?.resizableTextArea?.textArea?.selectionStart);
        newValue = `${part1}{{${data}}}${part2}`;
        setCanOpen(false);
        onChange({ name: item.field, value: newValue });
    };

    const cansRef = useRef<any>();
    const [canOpens, setCanOpens] = useState(false);
    const setCanData = (data: string, flag: boolean = false) => {
        //flag 是否是点击用户变量
        let newValue = _.cloneDeep(customValue);
        if (!newValue) {
            newValue = '';
        }
        const part1 = newValue.slice(0, cansRef.current?.resizableTextArea?.textArea?.selectionStart);
        const part2 = newValue.slice(cansRef.current?.resizableTextArea?.textArea?.selectionStart);
        newValue = flag ? `${part1 + data + part2}` : `${part1}{{${data}}}${part2}`;
        setCanOpens(false);
        setCustomValue(newValue);
    };
    useEffect(() => {
        if (customOpen) {
            setCustomValue(item.value);
            setUseModel(usePrompt);
        }
    }, [customOpen]);

    return (
        <>
            {handlerCode === 'CustomActionHandler' && item.style === 'TEXTAREA' ? (
                <div className=" bg-[#f9f9f9] mt-4 rounded-lg p-2">
                    <div className="flex justify-between items-center text-sm font-[500] mb-1">
                        <div>
                            {item.label}{' '}
                            <Tooltip title={'向模型提供用户指令，如查询或任何基于文本输入的提问'}>
                                <ExclamationCircleOutlined className="cursor-pointer" />
                            </Tooltip>
                        </div>
                        <div className="flex items-center gap-2">
                            <Tooltip title="展开">
                                <ArrowsAltOutlined
                                    onClick={() => {
                                        setCustomOpen(true);
                                        setCustomTitle(item.label);
                                    }}
                                    className="cursor-pointer"
                                />
                            </Tooltip>
                            <Can
                                open={canOpen}
                                setOpen={setCanOpen}
                                setData={setData}
                                details={details}
                                stepCode={stepCode}
                                index={undefined}
                            />
                        </div>
                    </div>
                    <Input.TextArea ref={canRef} value={item.value} onChange={(e) => onChange(e.target)} rows={8} />
                </div>
            ) : (handlerCode !== 'OpenAIChatActionHandler' && item.style === 'TEXTAREA') ||
              (handlerCode === 'AssembleActionHandler' && item.field === 'TITLE') ? (
                <div className="w-full relative mt-4">
                    <VariableInput
                        open={open}
                        setOpen={setOpen}
                        handleMenu={({ newValue }) => {
                            onChange({ name: item.field, value: newValue });
                        }}
                        details={details}
                        code={handlerCode}
                        stepCode={stepCode}
                        index={undefined}
                        value={item.value}
                        status={handlerCode === 'AssembleActionHandler' ? true : false}
                        row={item?.field === 'TITLE' ? 1 : 6}
                        setValue={(value) => {
                            onChange({ name: item.field, value: value });
                        }}
                        model={model}
                    />
                    <span
                        style={{ color: !item.value && handlerCode === 'AssembleActionHandler' ? '#f44336' : '#364152' }}
                        className="z-[100] block bg-[#fff] px-[5px] absolute top-[-10px] left-2 text-[12px] bg-gradient-to-b from-[#fff] to-[#f8fafc]"
                    >
                        {item.label}
                    </span>
                    {!item.value && handlerCode === 'AssembleActionHandler' && (
                        <p className="text-[#f44336] mt-[4px] text-xs">{item.label}必填</p>
                    )}
                </div>
            ) : item.style === 'TEXTAREA' ? (
                <TextField
                    color="secondary"
                    size="small"
                    sx={mt}
                    label={item.label}
                    defaultValue={item.value}
                    id={item.field}
                    required
                    name={item.field}
                    multiline
                    minRows={3}
                    maxRows={3}
                    InputLabelProps={{ shrink: true }}
                    placeholder={item.defaultValue ? String(item.defaultValue) : ''}
                    error={!item.value && value}
                    helperText={!item.value && value ? `${item.label}必填` : item.description}
                    onChange={(e) => {
                        setValue(true);
                    }}
                    onBlur={(e) => {
                        onChange(e.target);
                    }}
                    fullWidth
                />
            ) : item.style === 'INPUT' ? (
                <TextField
                    sx={mt}
                    size="small"
                    color="secondary"
                    label={item.label === 'Max Tokens' ? '最大返回Tokens' : item.label === 'Temperature' ? '温度值' : item.label}
                    defaultValue={item.value}
                    id={item.field}
                    required
                    name={item.field}
                    InputLabelProps={{ shrink: true }}
                    placeholder={item.defaultValue ? String(item.defaultValue) : ''}
                    error={!item.value && value}
                    helperText={!item.value && value ? `${item.label}必填` : item.description}
                    onChange={(e) => {
                        setValue(true);
                    }}
                    onBlur={(e) => {
                        onChange(e.target);
                    }}
                    fullWidth
                />
            ) : item.style === 'JSON' ? (
                <TextField
                    sx={mt}
                    size="small"
                    color="secondary"
                    label={item.label === 'Prompt' ? t('market.' + item.field) : item.label}
                    value={item.value}
                    id={item.field}
                    required
                    name={item.field}
                    multiline
                    minRows={3}
                    maxRows={3}
                    InputLabelProps={{ shrink: true }}
                    placeholder={item.defaultValue ? String(item.defaultValue) : ''}
                    error={!verifyJSON(item.value) && value}
                    helperText={!verifyJSON(item.value) && value ? `${item.label}必须为 JSON 格式` : item.description}
                    onChange={(e) => {
                        setValue(true);
                        onChange(e.target);
                    }}
                    onBlur={(e) => {
                        onChange({ name: item.field, value: changeJSONValue(e.target.value) });
                    }}
                    fullWidth
                />
            ) : item.style === 'SELECT' ? (
                item.field === 'MATERIAL_TYPE' ? null : (
                    <TextField
                        sx={mt}
                        size="small"
                        color="secondary"
                        value={item.value}
                        InputLabelProps={{ shrink: true }}
                        select
                        required
                        id={item.field}
                        name={item.field}
                        label={item.label === 'Model' ? '推荐模型' : item.label}
                        placeholder={item.defaultValue ? String(item.defaultValue) : ''}
                        error={!item.value && value}
                        helperText={!item.value && value ? `${item.label}必填` : item.description}
                        onChange={(e) => {
                            setValue(true);
                            onChange(e.target);
                        }}
                        fullWidth
                    >
                        {item.options.map((el: any) => (
                            <MenuItem key={el.value} value={el.value}>
                                {el.label}
                            </MenuItem>
                        ))}
                    </TextField>
                )
            ) : item.style === 'RADIO' ? (
                <div>
                    <Radio.Group
                        onChange={(e) => {
                            onChange({ name: item.field, value: e.target.value });
                        }}
                        value={item.value}
                    >
                        {item?.options?.map((item: any) => (
                            <Radio value={item.value} key={item.value}>
                                {item.label}
                            </Radio>
                        ))}
                    </Radio.Group>
                    <div className="text-xs">
                        <span className="text-[#673ab7]">Tips:</span>
                        {item?.options?.find((el: any) => el.value === item.value)?.description}
                    </div>
                </div>
            ) : item.style === 'CHECKBOX' ? (
                <div>
                    <Checkbox.Group
                        onChange={(e) => {
                            onChange({ name: item.field, value: e });
                        }}
                        options={item.options}
                        value={item.value}
                    ></Checkbox.Group>
                    <div className="text-xs mt-[20px]">
                        <span className="text-[#673ab7]">Tips:</span>
                        {item?.options?.find((el: any) => el.value === item.value)?.description}
                    </div>
                </div>
            ) : item.style === 'TAG_BOX' ? (
                <div className="relative mt-4">
                    <Select
                        allowClear
                        value={item.value}
                        onChange={(value: any) => {
                            onChange({ name: item?.field, value });
                        }}
                        notFoundContent={false}
                        dropdownStyle={{ display: 'none' }}
                        className="w-full min-h-[51px]"
                        mode="tags"
                        size="large"
                    />
                    <span
                        className=" block bg-gradient-to-b from-[#fff] to-[#f8fafc] px-[5px] absolute top-[-10px] left-2 text-[12px]"
                        style={{ color: '#697586' }}
                    >
                        {item.label}
                    </span>
                </div>
            ) : item.style === 'IMAGE_LIST' ? (
                <>
                    <div className="mt-4 mb-2 font-bold text-xs">参考图片</div>
                    <DragDropContext onDragEnd={onDragEnd}>
                        <Droppable direction="horizontal" droppableId="droppable">
                            {(provided: any) => (
                                <div {...provided.droppableProps} ref={provided.innerRef} className="flex gap-2 overflow-auto">
                                    {item?.value?.map((i: any, index: number) => (
                                        <Draggable key={i?.pictureUrl} draggableId={i?.pictureUrl} index={index}>
                                            {(provided: any, snapshot: any) => (
                                                <div ref={provided.innerRef} {...provided.draggableProps} {...provided.dragHandleProps}>
                                                    <Image src={i?.pictureUrl} width={100} height={100} />
                                                </div>
                                            )}
                                        </Draggable>
                                    ))}
                                    {provided.placeholder}
                                </div>
                            )}
                        </Droppable>
                    </DragDropContext>
                </>
            ) : handlerCode === 'MaterialActionHandler' && materialType === 'picture' ? (
                <div>
                    <div className="text-[12px] font-[500] flex items-center justify-between">
                        <div>图片总量：{item.value?.length}</div>
                        {item.value?.length > 0 && (
                            <Button
                                danger
                                onClick={() => {
                                    onChange({ name: item.field, value: [] });
                                }}
                                size="small"
                                type="text"
                            >
                                全部清除
                            </Button>
                        )}
                    </div>
                    <div className="flex flex-wrap gap-[10px] h-[300px] overflow-y-auto shadow">
                        <div>
                            <Upload {...props}>
                                <div className=" w-[100px] h-[100px] border border-dashed border-[#d9d9d9] rounded-[5px] bg-[#000]/[0.02] flex justify-center items-center flex-col cursor-pointer">
                                    <PlusOutlined />
                                    <div style={{ marginTop: 8 }}>Upload</div>
                                </div>
                            </Upload>
                        </div>
                    </div>
                </div>
            ) : (
                <div className="mt-4">
                    <div className="w-full flex justify-between items-center mb-2">
                        <div className="relative">
                            <Select
                                placeholder={variables?.find((el: any) => el?.field === 'MATERIAL_TYPE')?.description}
                                onChange={(e) => {
                                    setMaterialType(e);
                                }}
                                className="w-[150px] h-[25px]"
                                value={materialValue}
                                options={materialList}
                            />
                            <span className="z-[100] block bg-[#fff] px-[5px] absolute top-[-9px] left-2 text-[10px] bg-gradient-to-b from-[#fff] to-[#f8fafc]">
                                {variables?.find((el: any) => el?.field === 'MATERIAL_TYPE')?.label}
                            </span>
                        </div>
                        {/* <div>
                            {handlerCode === 'MaterialActionHandler' && (
                                <Button
                                    disabled={history}
                                    size="small"
                                    type="primary"
                                    onClick={(e) => {
                                        setUploadOpen(true);
                                        e.stopPropagation();
                                    }}
                                >
                                    批量导入
                                </Button>
                            )}
                        </div> */}
                        {handlerCode !== 'ImitateActionHandler' && (
                            <Button
                                disabled={history}
                                size="small"
                                type="primary"
                                onClick={(e) => {
                                    setStep();
                                    setMaterialType();
                                    setTitle('新增');
                                    setEditOpen(true);
                                    e.stopPropagation();
                                }}
                            >
                                新增
                            </Button>
                        )}
                    </div>
                    <Table
                        virtual
                        rowKey={(_, index) => String(index)}
                        loading={tableLoading}
                        columns={handlerCode !== 'ImitateActionHandler' ? columns : columns?.filter((item: any) => item.title !== '操作')}
                        dataSource={item.value}
                        pagination={false}
                    />
                    {model && (model === 'RANDOM' || model === 'AI_PARODY') && (
                        <span className="text-xs text-[rgb(244,67,54)] mt-4">参考列表最少需要一个</span>
                    )}
                </div>
            )}
            {uploadOpen && (
                <Modal zIndex={1100} width={400} title="批量导入" open={uploadOpen} footer={null} onCancel={() => setUploadOpen(false)}>
                    <p>
                        支持以 XLS 文件形式批量导入页面元素，导入文件将自动刷新列表页。
                        <span className="text-[#673ab7] cursor-pointer" onClick={handleDownLoad}>
                            下载导入文件模板
                        </span>
                    </p>
                    <div className="flex justify-center mt-[20px]">
                        <div className="flex flex-col items-center">
                            <Upload {...props1}>
                                <Button type="primary">上传 ZIP</Button>
                            </Upload>
                            <div className="text-xs text-black/50 mt-2">请把下载的内容修改后，对目录打包后再上传</div>
                        </div>
                    </div>
                    {uploadLoading && <Progress size="small" percent={percent} />}
                </Modal>
            )}
            {customOpen && (
                <Modal
                    width="60%"
                    title={customTitle}
                    open={customOpen}
                    onCancel={() => {
                        setCustomOpen(false);
                        setPromptContent(null);
                    }}
                    footer={null}
                >
                    <div className="w-full flex justify-between items-stretch gap-4">
                        <div className="flex-1">
                            <div className="text-xs flex justify-between items-end mb-2">
                                <div>用户提示词</div>
                                <div className="flex gap-2 items-center">
                                    <Tooltip title="提示词库暂未开放">
                                        <div className="w-[25px] h-[25px] rounded-md bg-[#ddd]/60 text-xs text-center leading-[25px] cursor-not-allowed">
                                            <ContainerOutlined />
                                        </div>
                                    </Tooltip>
                                    大模型:
                                    <Select
                                        value={useModel}
                                        onChange={setUseModel}
                                        size="small"
                                        options={[
                                            { label: '默认模型3.5', value: 'GPT35' },
                                            { label: '默认模型4.0', value: 'GPT4' },
                                            { label: '通义千问', value: 'QWEN' },
                                            { label: '通义千问MAX', value: 'QWEN_MAX' }
                                        ]}
                                        className="w-[120px]"
                                    />
                                    <Can
                                        open={canOpens}
                                        setOpen={setCanOpens}
                                        setData={setCanData}
                                        details={details}
                                        stepCode={stepCode}
                                        index={undefined}
                                    />
                                </div>
                            </div>
                            <div className="relative">
                                <Input.TextArea
                                    value={customValue}
                                    ref={cansRef}
                                    onChange={(e) => setCustomValue(e.target.value)}
                                    className="whitespace-pre-wrap !h-[400px]"
                                    maxLength={2000}
                                />
                                <div className="absolute bottom-2 right-2 text-xs">{customValue?.length || 0}/2000</div>
                            </div>
                            <div className="mt-1 text-xs text-black/60">
                                执行时，变量占位符会替换为真实的数据，如：素材库，全局变量中的值。 请确保已经有值，不然影响AI生成效果。
                            </div>
                            <div className="flex gap-1 items-center flex-wrap mt-1">
                                {variables?.map(
                                    (el: any) =>
                                        item.field !== el.field &&
                                        el.field !== 'GENERATE_MODE' &&
                                        el.isShow && (
                                            <Tooltip key={el.field} title={el?.description}>
                                                <span
                                                    onClick={() => {
                                                        setCanData(`{STEP.${stepCode}.${el.field}}`, true);
                                                    }}
                                                    className="text-xs text-white bg-[#673ab7] rounded-full px-2 py-1 cursor-pointer"
                                                >
                                                    {el?.label}
                                                </span>
                                            </Tooltip>
                                        )
                                )}
                            </div>
                        </div>
                        <div className="flex-1">
                            <div className="h-[25px] mb-2 flex items-center gap-2">
                                AI 生成结果
                                {promptContent?.systemPrompt && (
                                    <Popover
                                        content={
                                            <div className="w-[400px] h-[300px] overflow-y-auto">
                                                <div className="flex flex-col gap-2">
                                                    <div>用户提示词：{promptContent?.userPrompt}</div>
                                                    <div className="flex">
                                                        <div className="whitespace-nowrap">系统提示词：</div>
                                                        <div>{promptContent?.systemPrompt}</div>
                                                    </div>
                                                </div>
                                            </div>
                                        }
                                    >
                                        <div className="w-[25px] h-[25px] rounded-md bg-[#e7b8ff33] text-xs text-[#673ab7] text-center leading-[25px] cursor-pointer font-bold">
                                            P
                                        </div>
                                    </Popover>
                                )}
                            </div>
                            <div
                                dangerouslySetInnerHTML={{ __html: promptValue }}
                                className="w-full h-[400px] border border-solid border-[#d9d9d9] rounded-lg whitespace-pre-wrap text-base overflow-y-auto px-[11px] py-1"
                            />
                        </div>
                    </div>
                    <div className="flex gap-4 mt-2">
                        <div className="flex-1 flex justify-end">
                            <Button loading={customLoading} onClick={promptExe} type="primary">
                                AI 生成
                            </Button>
                        </div>
                        <div className="flex-1 flex justify-end">
                            <Button
                                disabled={!customValue}
                                onClick={() => {
                                    setUsePromptValue({ name: item.field, value: customValue, aiModel: useModel });
                                    setPromptContent(null);
                                    setCustomOpen(false);
                                }}
                                type="primary"
                            >
                                更新提示词
                            </Button>
                        </div>
                    </div>
                </Modal>
            )}
        </>
    );
}
const arePropsEqual = (prevProps: any, nextProps: any) => {
    return (
        _.isEqual(prevProps?.item, nextProps?.item) &&
        _.isEqual(prevProps?.open, nextProps?.open) &&
        _.isEqual(prevProps?.columns, nextProps?.columns) &&
        _.isEqual(prevProps?.model, nextProps?.model) &&
        _.isEqual(prevProps?.details, nextProps?.details) &&
        _.isEqual(prevProps?.stepCode, nextProps?.stepCode) &&
        _.isEqual(prevProps?.materialValue, nextProps?.materialValue) &&
        _.isEqual(prevProps?.usePrompt, nextProps?.usePrompt)
    );
};
export default memo(FormExecute, arePropsEqual);
