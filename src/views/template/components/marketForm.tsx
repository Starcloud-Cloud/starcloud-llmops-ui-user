import { TextField, MenuItem, FormControl, Autocomplete, Chip } from '@mui/material';
import { useState, memo, useEffect, useRef } from 'react';
import { Table, Button, Modal, Upload, UploadProps, Progress, Radio, Checkbox, Image, Select, Input, Tooltip } from 'antd';
import { PlusOutlined, ArrowsAltOutlined, ExclamationCircleOutlined, SearchOutlined } from '@ant-design/icons';
import { t } from 'i18next';
import _ from 'lodash-es';
import { v4 as uuidv4 } from 'uuid';
import { getAccessToken } from 'utils/auth';
import { verifyJSON, changeJSONValue } from './validaForm';
import VariableInput from 'views/pages/batchSmallRedBooks/components/variableInput';
import { materialImport, materialResilt, materialExport } from 'api/redBook/batchIndex';
import { useLocation } from 'react-router-dom';
import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd';
import { origin_url } from 'utils/axios/config';
import Can from './can';

function FormExecute({
    item,
    details = undefined,
    onChange,
    pre,
    materialType,
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
    materialList
}: any) {
    const location = useLocation();
    const searchParams = new URLSearchParams(location.search);
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
    const widthRef: any = useRef(null);
    const [popoverWidth, setPopoverWidth] = useState(undefined);
    useEffect(() => {
        if (widthRef.current) {
            setPopoverWidth(widthRef.current?.offsetWidth);
        }
    }, [widthRef]);
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

    return (
        <>
            {handlerCode === 'CustomActionHandler' && item.style === 'TEXTAREA' ? (
                <div className=" bg-[#f9f9f9] mt-4 rounded-lg p-2">
                    <div className="flex justify-between items-center text-sm font-[500] mb-1">
                        <div>
                            {item.label}{' '}
                            <Tooltip title={item.description || '暂无描述'}>
                                <ExclamationCircleOutlined className="cursor-pointer" />
                            </Tooltip>
                        </div>
                        <div className="flex items-center gap-2">
                            <Tooltip title="展开">
                                <ArrowsAltOutlined
                                    onClick={() => {
                                        console.log(item);
                                        setCustomOpen(true);
                                        setCustomTitle(item.label);
                                    }}
                                    className="cursor-pointer"
                                />
                            </Tooltip>
                            <Can
                                open={canOpen}
                                setOpen={setCanOpen}
                                handleMenu={({ newValue }) => {
                                    onChange({ name: item.field, value: newValue });
                                }}
                                details={details}
                                stepCode={stepCode}
                                index={undefined}
                                popoverWidth={popoverWidth}
                            />
                        </div>
                    </div>
                    <Input.TextArea value={item.value} onChange={(e) => onChange(e.target)} rows={8} />
                </div>
            ) : (handlerCode !== 'OpenAIChatActionHandler' && item.style === 'TEXTAREA') ||
              (handlerCode === 'AssembleActionHandler' && item.field === 'TITLE') ? (
                <div ref={widthRef} className="w-full relative mt-4">
                    <VariableInput
                        open={open}
                        setOpen={setOpen}
                        popoverWidth={popoverWidth}
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
                <>
                    <div className="mt-4">
                        <FormControl key={item?.value} color="secondary" size="small" fullWidth>
                            <Autocomplete
                                multiple
                                size="small"
                                id="tags-filled"
                                color="secondary"
                                options={[]}
                                defaultValue={item?.value || []}
                                freeSolo
                                renderTags={(value: readonly string[], getTagProps) =>
                                    value?.map((option: string, index: number) => (
                                        <Chip variant="outlined" label={option} {...getTagProps({ index })} />
                                    ))
                                }
                                onChange={(e: any, newValue) => {
                                    onChange({ name: item?.field, value: newValue });
                                }}
                                renderInput={(param) => (
                                    <TextField
                                        onBlur={(e: any) => {
                                            if (e.target.value) {
                                                let newValue: any = item?.value;
                                                if (!newValue) {
                                                    newValue = [];
                                                }
                                                const tag = e.target.value.split(/[\s,]+/).map((item: any) => {
                                                    if (item[0] === '#') {
                                                        return item.slice(1);
                                                    } else {
                                                        return item;
                                                    }
                                                });
                                                newValue.push(...tag);
                                                onChange({ name: item?.field, value: newValue });
                                            }
                                        }}
                                        color="secondary"
                                        {...param}
                                        label={item.label}
                                        placeholder="请输入标签然后回车"
                                    />
                                )}
                            />
                        </FormControl>
                    </div>
                </>
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
                                placeholder="选择素材类型"
                                onChange={(e) => {
                                    setMaterialType(e);
                                }}
                                className="w-[150px] h-[25px]"
                                value={materialValue}
                                options={materialList}
                            />
                            <span className="z-[100] block bg-[#fff] px-[5px] absolute top-[-9px] left-2 text-[10px] bg-gradient-to-b from-[#fff] to-[#f8fafc]">
                                素材类型
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
            <Modal width="60%" title={customTitle} open={customOpen} onCancel={() => setCustomOpen(false)} footer={null}>
                <div className="w-full flex justify-between items-stretch gap-2 h-[452px]">
                    <div className="flex-1">
                        <Input.TextArea
                            value={item.value}
                            onChange={(e) => onChange(e.target)}
                            rows={16}
                            className="text-base whitespace-pre-wrap"
                        />
                        <div className="flex justify-end gap-2 mt-2">
                            <Button onClick={() => {}}>清空内容</Button>
                            <Button loading={customLoading} onClick={() => {}} icon={<SearchOutlined />} type="primary">
                                Prompt 生成
                            </Button>
                        </div>
                    </div>
                    <div className="w-[1px] bg-[#d9d9d9]"></div>
                    <div className="flex-1">
                        <div className="relative h-[calc(100%-40px)]">
                            <div
                                // dangerouslySetInnerHTML={{ __html: newWordsRes?.resContent }}
                                className="w-full border border-solid border-[#d9d9d9] rounded-lg h-full whitespace-pre-wrap text-base overflow-y-auto px-[11px] py-1"
                            />
                        </div>
                        <div className="flex justify-end gap-2 mt-2">
                            <Button
                                // disabled={!newWordsRes?.resContent}
                                onClick={() => {
                                    // dispatch(
                                    //     openSnackbar({
                                    //         open: true,
                                    //         message: '复制成功',
                                    //         variant: 'alert',
                                    //         alert: {
                                    //             color: 'success'
                                    //         },
                                    //         close: false,
                                    //         anchorOrigin: { vertical: 'top', horizontal: 'center' }
                                    //     })
                                    // );
                                }}
                                type="primary"
                            >
                                插入内容
                            </Button>
                        </div>
                    </div>
                </div>
            </Modal>
        </>
    );
}
const arePropsEqual = (prevProps: any, nextProps: any) => {
    return (
        JSON.stringify(prevProps?.item) === JSON.stringify(nextProps?.item) &&
        JSON.stringify(prevProps?.open) === JSON.stringify(nextProps?.open) &&
        JSON.stringify(prevProps?.columns) === JSON.stringify(nextProps?.columns) &&
        JSON.stringify(prevProps?.model) === JSON.stringify(nextProps?.model) &&
        JSON.stringify(prevProps?.details) === JSON.stringify(nextProps?.details) &&
        JSON.stringify(prevProps?.stepCode) === JSON.stringify(nextProps?.stepCode) &&
        JSON.stringify(prevProps?.materialValue) === JSON.stringify(nextProps?.materialValue)
    );
};
export default memo(FormExecute, arePropsEqual);
