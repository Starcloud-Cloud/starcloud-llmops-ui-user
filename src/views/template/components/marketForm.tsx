import { TextField, MenuItem } from '@mui/material';
import { useState, memo, useEffect, useRef } from 'react';
import { Table, Button, Modal, Upload, UploadProps, Progress, Radio, Checkbox } from 'antd';
import { t } from 'i18next';
import _ from 'lodash-es';
import { verifyJSON, changeJSONValue } from './validaForm';
import VariableInput from 'views/pages/batchSmallRedBooks/components/variableInput';
import { materialImport, materialResilt, materialExport } from 'api/redBook/batchIndex';
import { useLocation } from 'react-router-dom';

function FormExecute({
    item,
    onChange,
    pre,
    materialType,
    stepCode,
    handlerCode,
    columns = [],
    setEditOpen,
    setTitle,
    setStep,
    setMaterialType,
    history
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
        accept: '.zip',
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
                    const res = result?.materialDTOList;
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
    return (
        <>
            {item.style === 'INPUT' ? (
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
            ) : item.style === 'TEXTAREA' ? (
                <div ref={widthRef} className="w-full relative mt-4">
                    <VariableInput
                        open={open}
                        setOpen={setOpen}
                        popoverWidth={popoverWidth}
                        handleMenu={({ newValue }) => {
                            onChange({ name: item.field, value: newValue });
                        }}
                        appUid={'c391a40ab293494d9eae937401065bcd'}
                        stepCode={'标题生成'}
                        index={undefined}
                        value={item.value}
                        row={6}
                        setValue={(value) => {
                            onChange({ name: item.field, value: value });
                        }}
                        model={stepCode}
                    />
                    <span className="z-[100] block bg-[#fff] px-[5px] absolute top-[-10px] left-2 text-[12px] bg-gradient-to-b from-[#fff] to-[#f8fafc]">
                        {item.label}
                    </span>
                </div>
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
            ) : (
                <div>
                    <div className="flex justify-between mb-4">
                        <div>
                            {handlerCode === 'MaterialActionHandler' && (
                                <Button
                                    disabled={history}
                                    size="small"
                                    type="primary"
                                    onClick={() => {
                                        setUploadOpen(true);
                                    }}
                                >
                                    批量导入
                                </Button>
                            )}
                        </div>
                        <Button
                            disabled={history}
                            size="small"
                            type="primary"
                            onClick={() => {
                                setStep();
                                setMaterialType();
                                setTitle('新增');
                                setEditOpen(true);
                            }}
                        >
                            新增
                        </Button>
                    </div>
                    <Table rowKey={(_, index) => String(index)} loading={tableLoading} columns={columns} dataSource={item.value} />
                </div>
            )}
            {uploadOpen && (
                <Modal zIndex={1100} width={400} title="批量导入" open={uploadOpen} footer={null} onCancel={() => setUploadOpen(false)}>
                    <p>
                        支持以 XLS 文件形式批量导入页面元素，导入文件将自动刷新列表页。
                        <span className="text-[#673ab7] cursor-pointer" onClick={handleDownLoad}>
                            下载导入 XLS 模板
                        </span>
                    </p>
                    <div className="flex justify-center mt-[20px]">
                        <div>
                            <Upload {...props1}>
                                <Button type="primary">上传 ZIP</Button>
                            </Upload>
                        </div>
                    </div>
                    {uploadLoading && <Progress size="small" percent={percent} />}
                </Modal>
            )}
        </>
    );
}
const arePropsEqual = (prevProps: any, nextProps: any) => {
    return (
        JSON.stringify(prevProps?.item) === JSON.stringify(nextProps?.item) &&
        JSON.stringify(prevProps?.open) === JSON.stringify(nextProps?.open) &&
        JSON.stringify(prevProps?.columns) === JSON.stringify(nextProps?.columns) &&
        JSON.stringify(prevProps?.stepCode) === JSON.stringify(nextProps?.stepCode)
    );
};
export default memo(FormExecute, arePropsEqual);
